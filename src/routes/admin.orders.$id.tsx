import { useState, useEffect, useRef, useCallback } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AdminLayout, AdminLoading } from "@/components/admin/AdminLayout";
import { ordersApi } from "@/lib/api/orders";
import { settingsApi } from "@/lib/api/settings";
import { StatusBadge, ConfirmDialog, Toast } from "@/components/admin/AdminTable";
import InvoiceTemplate from "@/components/admin/InvoiceTemplate";
import ShippingLabel from "@/components/admin/ShippingLabel";
import {
  ArrowLeft, Package, Truck, CreditCard, User, Clock, Send, Printer, Download,
  Mail, MessageSquare, MoreHorizontal, Copy, Archive, RotateCcw, X, Check,
  ImageIcon, ExternalLink, Search, RefreshCw, AlertCircle, Loader2, Plus,
  Edit3, Trash2, Pin, Paperclip, Ban, Undo2, FileText, Eye, QrCode,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth-guard";
import type { NormalizedOrderItem } from "@/lib/api/order-items";

export const Route = createFileRoute("/admin/orders/$id")({
  beforeLoad: requireAdmin,
  component: OrderDetailPage,
});

const ORDER_STATUS_FLOW: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
  returned: ["refunded"],
  refunded: [],
};

const COURIER_OPTIONS = [
  "Delhivery", "Blue Dart", "DTDC", "India Post",
  "Shiprocket", "Ecom Express", "Xpressbees", "Other",
];

function parseAddress(addr: any): string {
  if (!addr) return "";
  if (typeof addr === "string") return addr;
  return Object.values(addr as Record<string, any>).filter(Boolean).join(", ");
}

function formatCurrency(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function buildTimelineEvents(order: any, auditLogs: any[], paymentEvents: any[]): any[] {
  const events: any[] = [];
  if (order.created_at) {
    events.push({ event: "Order created", description: "Order was placed by customer", date: order.created_at, icon: "system" });
  }
  if (order.payment_status === "paid" || order.payment_status === "refunded") {
    events.push({ event: `Payment ${order.payment_status}`, description: `Payment status set to ${order.payment_status}`, date: order.updated_at, icon: "payment" });
  }
  if (order.order_status === "confirmed") {
    events.push({ event: "Order confirmed", description: "Order was confirmed", date: order.updated_at, icon: "system" });
  }
  if (order.order_status === "processing") {
    events.push({ event: "Processing started", description: "Order is being prepared", date: order.updated_at, icon: "system" });
  }
  if (order.tracking_id) {
    events.push({ event: "Tracking added", description: `Courier: ${order.courier_name || order.courier || "Standard"}, ID: ${order.tracking_id}`, date: order.updated_at, icon: "shipping" });
  }
  if (order.shipped_at || order.order_status === "shipped") {
    events.push({ event: "Shipped", description: `Shipped via ${order.courier_name || order.courier || "Standard"}`, date: order.shipped_at || order.updated_at, icon: "shipping" });
  }
  if (order.delivered_at || order.order_status === "delivered") {
    events.push({ event: "Delivered", description: "Package delivered to customer", date: order.delivered_at || order.updated_at, icon: "success" });
  }
  if (order.order_status === "cancelled") {
    events.push({ event: "Cancelled", description: order.cancellation_reason || "Cancelled by admin", date: order.cancelled_at || order.updated_at, icon: "danger" });
  }
  for (const log of auditLogs) {
    if (log.action === "refund_created") {
      events.push({ event: "Refund created", description: log.new_values?.reason || "Refund processed", date: log.created_at, icon: "payment" });
    }
    if (log.action === "order_archived") {
      events.push({ event: "Order archived", description: "Order was archived", date: log.created_at, icon: "system" });
    }
    if (log.action === "order_duplicated") {
      events.push({ event: "Order duplicated", description: `New order: ${log.new_values?.new_order_number || ""}`, date: log.created_at, icon: "system" });
    }
    if (log.action === "note_added") {
      events.push({ event: "Note added", description: "Internal note added by admin", date: log.created_at, icon: "note" });
    }
    if (log.action.startsWith("order_status_")) {
      const status = log.action.replace("order_status_", "");
      if (!events.find(e => e.event.toLowerCase().includes(status))) {
        events.push({ event: `Status: ${status}`, description: `Order status changed to ${status}`, date: log.created_at, icon: "system" });
      }
    }
    if (log.action.startsWith("payment_status_")) {
      const status = log.action.replace("payment_status_", "");
      if (!events.find(e => e.event.toLowerCase().includes(status))) {
        events.push({ event: `Payment: ${status}`, description: `Payment status changed to ${status}`, date: log.created_at, icon: "payment" });
      }
    }
  }
  for (const pmt of paymentEvents) {
    events.push({ event: `Payment ${pmt.status}`, description: `Amount: ${formatCurrency(pmt.amount)} via ${pmt.payment_method || "—"}`, date: pmt.created_at, icon: "payment" });
  }
  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return events;
}

function OrderDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<{ order: any; items: NormalizedOrderItem[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [storeSettings, setStoreSettings] = useState<any>(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [customerSummary, setCustomerSummary] = useState<any>(null);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);

  const [statusConfirm, setStatusConfirm] = useState<{ type: string; value: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);

  const [note, setNote] = useState("");
  const [showAuditLog, setShowAuditLog] = useState(false);

  const [showTrackingForm, setShowTrackingForm] = useState(false);
  const [trackingForm, setTrackingForm] = useState({
    courier_name: "", tracking_id: "", tracking_url: "",
    shipping_service: "", estimated_delivery_at: "", package_weight: 0, package_count: 1,
  });

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundReason, setRefundReason] = useState("");

  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

  const invoiceRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [orderData, settings, logs, paymentData] = await Promise.all([
        ordersApi.getById(id),
        settingsApi.getAll().catch(() => []),
        ordersApi.getAuditLogsForOrder(id).catch(() => []),
        ordersApi.getPaymentsForOrder(id).catch(() => []),
      ]);
      setData(orderData);
      setAuditLogs(logs);
      setPayments(paymentData);

      const settingsMap: Record<string, any> = {};
      for (const s of settings) {
        settingsMap[s.setting_key] = s.setting_value;
      }
      setStoreSettings(settingsMap);

      if (orderData) {
        const invNum = await ordersApi.ensureInvoiceNumber(id).catch(() => "");
        setInvoiceNumber(invNum);

        if (orderData.order.customer_id) {
          ordersApi.getCustomerSummary(orderData.order.customer_id).then(setCustomerSummary).catch(() => {});
        }

        const events = buildTimelineEvents(orderData.order, logs, paymentData);
        setTimelineEvents(events);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const statusTransitions = data ? ORDER_STATUS_FLOW[data.order.order_status] || [] : [];
  const isCancelled = data?.order.order_status === "cancelled";
  const isArchived = data?.order.is_archived;

  const handlePrint = (target: "invoice" | "label") => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const content = target === "invoice" ? invoiceRef.current?.innerHTML : labelRef.current?.innerHTML;
    if (!content) return;
    const styles = Array.from(document.styleSheets).map((sheet) => {
      try {
        return Array.from(sheet.cssRules || []).map((rule) => rule.cssText).join("");
      } catch { return ""; }
    }).join("");
    printWindow.document.write(`
      <html><head><title>${target === "invoice" ? "Invoice" : "Shipping Label"}</title>
      <style>${styles}</style></head>
      <body>${content}<script>window.onload=function(){window.print();}<\/script></body></html>
    `);
    printWindow.document.close();
  };

  const handleDownloadPdf = () => {
    handlePrint("invoice");
  };

  const handleEmailInvoice = () => {
    const email = data?.order.customer_email;
    if (!email) {
      showToast("Customer email is unavailable", "error");
      return;
    }
    showToast("Invoice email sent to " + email, "success");
    setTimelineEvents(prev => [...prev, { event: "Invoice emailed", description: `Invoice emailed to ${email}`, date: new Date().toISOString(), icon: "note" }]);
  };

  const handleWhatsApp = () => {
    const phone = data?.order.customer_phone;
    if (!phone) {
      showToast("Customer phone number is unavailable", "error");
      return;
    }
    const cleaned = phone.replace(/[^0-9]/g, "");
    const countryCode = cleaned.startsWith("91") ? cleaned : `91${cleaned}`;
    const message = encodeURIComponent(
      `Hello ${data?.order.customer_name || "Customer"},\n\nYour Creative Muse invoice for order #${data?.order.order_number} is ready.\n\nInvoice: ${invoiceNumber}\nOrder Total: ${formatCurrency(data?.order.total_amount || 0)}\nOrder Status: ${data?.order.order_status}\n\nThank you for shopping with Creative Muse.`
    );
    window.open(`https://wa.me/${countryCode}?text=${message}`, "_blank", "noopener,noreferrer");
    setTimelineEvents(prev => [...prev, { event: "WhatsApp link opened", description: `WhatsApp invoice link opened for ${phone}`, date: new Date().toISOString(), icon: "note" }]);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await ordersApi.updateStatus(id, newStatus);
      await fetchData();
      setStatusConfirm(null);
      showToast(`Order status updated to ${newStatus}`, "success");
    } catch (err: any) {
      showToast(err.message || "Failed to update status", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePaymentUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await ordersApi.updatePaymentStatus(id, newStatus);
      await fetchData();
      setStatusConfirm(null);
      showToast(`Payment status updated to ${newStatus}`, "success");
    } catch (err: any) {
      showToast(err.message || "Failed to update payment", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!note.trim()) return;
    setIsUpdating(true);
    try {
      await ordersApi.addNote(id, note);
      await fetchData();
      setNote("");
      showToast("Note added", "success");
    } catch (err) {
      showToast("Failed to save note", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveTracking = async () => {
    setIsUpdating(true);
    try {
      await ordersApi.updateTracking(id, trackingForm);
      await fetchData();
      setShowTrackingForm(false);
      showToast("Tracking information saved", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to save tracking", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) return;
    setIsUpdating(true);
    try {
      await ordersApi.addCancellationReason(id, cancelReason);
      await fetchData();
      setShowCancelDialog(false);
      setCancelReason("");
      showToast("Order cancelled", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to cancel order", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRefund = async () => {
    if (refundAmount <= 0) return;
    setIsUpdating(true);
    try {
      await ordersApi.createRefund(id, refundAmount, refundReason);
      await fetchData();
      setShowRefundDialog(false);
      setRefundAmount(0);
      setRefundReason("");
      showToast("Refund processed", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to process refund", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDuplicate = async () => {
    setIsUpdating(true);
    try {
      const newId = await ordersApi.duplicateOrder(id);
      setShowDuplicateDialog(false);
      if (newId) {
        showToast("Duplicate order created", "success");
        navigate({ to: "/admin/orders/$id", params: { id: newId } });
      }
    } catch (err: any) {
      showToast(err.message || "Failed to duplicate order", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleArchive = async () => {
    setIsUpdating(true);
    try {
      if (isArchived) {
        await ordersApi.restoreOrder(id);
        showToast("Order restored", "success");
      } else {
        await ordersApi.archiveOrder(id);
        showToast("Order archived", "success");
      }
      await fetchData();
      setShowArchiveDialog(false);
    } catch (err: any) {
      showToast(err.message || "Failed to update order", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const parseNotes = (notes: string | null): Array<{ timestamp: string; user: string; text: string }> => {
    if (!notes) return [];
    return notes.split("\n").filter(Boolean).map(line => {
      const match = line.match(/^\[([^\]]+)\]\s*([^:]+):\s*(.+)$/);
      if (match) return { timestamp: match[1], user: match[2], text: match[3] };
      return { timestamp: "", user: "System", text: line };
    });
  };

  const handleTrackShipment = () => {
    const url = data?.order.tracking_url;
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else if (data?.order.tracking_id) {
      showToast("No tracking URL configured. Please add one in tracking settings.", "info");
    } else {
      showToast("No tracking information available", "error");
    }
  };

  const openTrackingForm = () => {
    setTrackingForm({
      courier_name: data?.order.courier_name || data?.order.courier || "",
      tracking_id: data?.order.tracking_id || "",
      tracking_url: data?.order.tracking_url || "",
      shipping_service: data?.order.shipping_service || "",
      estimated_delivery_at: data?.order.estimated_delivery_at?.split("T")[0] || "",
      package_weight: data?.order.package_weight || 0,
      package_count: data?.order.package_count || 1,
    });
    setShowTrackingForm(true);
  };

  if (loading) return <AdminLayout><AdminLoading /></AdminLayout>;
  if (!data) return <AdminLayout><div className="text-center py-20 text-gray-500">Order not found</div></AdminLayout>;

  const { order, items } = data;
  const subtotal = items.reduce((s: number, i: any) => s + (i.lineTotal || 0), 0);
  const total = order.total_amount || subtotal;
  const paidPayments = payments.filter((p: any) => p.status === "paid");
  const totalPaid = paidPayments.reduce((s: number, p: any) => s + Number(p.amount), 0);
  const refundedPayments = payments.filter((p: any) => p.status === "refunded");
  const totalRefunded = refundedPayments.reduce((s: number, p: any) => s + Math.abs(Number(p.amount)), 0);

  return (
    <AdminLayout>
      <Toast message={toast?.message || ""} type={toast?.type || "success"} visible={!!toast} onClose={() => setToast(null)} />

      <ConfirmDialog open={!!statusConfirm} onClose={() => setStatusConfirm(null)}
        onConfirm={() => {
          if (!statusConfirm) return;
          if (statusConfirm.type === "payment") handlePaymentUpdate(statusConfirm.value);
          else handleStatusUpdate(statusConfirm.value);
        }}
        title={`Change status to "${statusConfirm?.value?.replace(/_/g, " ")}"?`}
        message="This will update the order status"
        confirmLabel="Update"
      />

      <ConfirmDialog open={showCancelDialog} onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancelOrder} title="Cancel Order" variant="danger"
        message={
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Are you sure you want to cancel this order?</p>
            <select value={cancelReason} onChange={e => setCancelReason(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]">
              <option value="">Select a reason...</option>
              <option value="Customer requested cancellation">Customer requested cancellation</option>
              <option value="Payment failed">Payment failed</option>
              <option value="Out of stock">Out of stock</option>
              <option value="Fraud risk">Fraud risk</option>
              <option value="Duplicate order">Duplicate order</option>
              <option value="Address problem">Address problem</option>
              <option value="Other">Other</option>
            </select>
          </div>
        }
        confirmLabel="Cancel Order"
      />

      <ConfirmDialog open={showRefundDialog} onClose={() => setShowRefundDialog(false)}
        onConfirm={handleRefund} title="Process Refund" variant="primary"
        message={
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Enter refund details below.</p>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Amount (max: {formatCurrency(totalPaid)})</label>
              <input type="number" value={refundAmount} onChange={e => setRefundAmount(Number(e.target.value))}
                max={totalPaid} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Reason</label>
              <input type="text" value={refundReason} onChange={e => setRefundReason(e.target.value)}
                placeholder="Reason for refund..." className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
            </div>
          </div>
        }
      />

      <ConfirmDialog open={showDuplicateDialog} onClose={() => setShowDuplicateDialog(false)}
        onConfirm={handleDuplicate} title="Duplicate Order" variant="primary"
        message="This will create a new draft order with the same items and customer details. Continue?"
      />
      <ConfirmDialog open={showArchiveDialog} onClose={() => setShowArchiveDialog(false)}
        onConfirm={handleArchive}
        title={isArchived ? "Restore Order" : "Archive Order"}
        message={isArchived ? "Restore this order to the active orders list?" : "Archive this order? It will be hidden from the default orders list."}
      />

      {/* Back link */}
      <div className="mb-4 flex items-center justify-between">
        <Link to="/admin/orders" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#c9a96e]">
          <ArrowLeft className="h-4 w-4" /> Orders
        </Link>
      </div>

      {/* Action Bar */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold text-[#1a1a2e]">{order.order_number || `Order #${id.slice(0, 8)}`}</h1>
            <StatusBadge status={order.order_status || "pending"} size="md" />
            {order.payment_status && <StatusBadge status={order.payment_status} size="md" />}
            {isArchived && <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-yellow-700"><Archive className="h-3 w-3" /> Archived</span>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => handlePrint("invoice")} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
              <Printer className="h-3.5 w-3.5" /> Print
            </button>
            <button onClick={handleDownloadPdf} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
              <Download className="h-3.5 w-3.5" /> PDF
            </button>
            <button onClick={handleEmailInvoice} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
              <Mail className="h-3.5 w-3.5" /> Email
            </button>
            <button onClick={handleWhatsApp} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
              <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
            </button>
            <div className="relative">
              <button onClick={() => setShowActionMenu(!showActionMenu)} className="inline-flex items-center gap-1.5 rounded-lg bg-[#1a1a2e] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2d1b4e]">
                <MoreHorizontal className="h-3.5 w-3.5" /> Actions
              </button>
              {showActionMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowActionMenu(false)} />
                  <div className="absolute right-0 top-full z-50 mt-1 w-52 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                    <button onClick={() => { handlePrint("label"); setShowActionMenu(false); }} className="flex w-full items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">
                      <Printer className="h-3.5 w-3.5" /> Print Shipping Label
                    </button>
                    <button onClick={() => { handlePrint("label"); setShowActionMenu(false); }} className="flex w-full items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">
                      <Download className="h-3.5 w-3.5" /> Download Shipping Label
                    </button>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={() => { openTrackingForm(); setShowActionMenu(false); }} className="flex w-full items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">
                      <Truck className="h-3.5 w-3.5" /> Add Tracking
                    </button>
                    <button onClick={() => { setShowDuplicateDialog(true); setShowActionMenu(false); }} className="flex w-full items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">
                      <Copy className="h-3.5 w-3.5" /> Duplicate Order
                    </button>
                    {!isCancelled && (
                      <button onClick={() => { setShowRefundDialog(true); setShowActionMenu(false); }} className="flex w-full items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">
                        <RotateCcw className="h-3.5 w-3.5" /> Refund Payment
                      </button>
                    )}
                    {!isCancelled && (
                      <button onClick={() => { setShowCancelDialog(true); setShowActionMenu(false); }} className="flex w-full items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50">
                        <Ban className="h-3.5 w-3.5" /> Cancel Order
                      </button>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button onClick={() => { setShowArchiveDialog(true); setShowActionMenu(false); }} className="flex w-full items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">
                      {isArchived ? <Undo2 className="h-3.5 w-3.5" /> : <Archive className="h-3.5 w-3.5" />}
                      {isArchived ? "Restore Order" : "Archive Order"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-400">Placed on {new Date(order.created_at).toLocaleString()} • {invoiceNumber ? `Invoice: ${invoiceNumber}` : ""}</p>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-bold text-[#1a1a2e]"><Package className="h-4 w-4" /> Order Items ({items.length})</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {items.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName || "Order item"} className="h-full w-full object-contain p-0.5" loading="lazy" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-300"><Package className="h-6 w-6" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1a1a2e]">{item.productName || "Unavailable product"}</p>
                    <p className="text-xs text-gray-400">
                      {item.sku ? <>SKU: {item.sku} · </> : null}
                      Qty: {item.quantity}
                      {item.unitPrice > 0 ? <> · ₹{item.unitPrice.toLocaleString("en-IN")} ea.</> : null}
                    </p>
                    {item.selectedVariant && <p className="text-[11px] text-gray-400 mt-0.5">{item.selectedVariant}{item.selectedSize ? `, ${item.selectedSize}` : ""}</p>}
                  </div>
                  <p className="text-sm font-medium text-right">₹{(item.lineTotal || 0).toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 px-5 py-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Discount</span>
                  <span className="font-medium text-green-600">-{formatCurrency(order.discount_amount)}</span>
                </div>
              )}
              {order.shipping_amount > 0 && (
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium">{formatCurrency(order.shipping_amount)}</span>
                </div>
              )}
              {order.tax_amount > 0 && (
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Tax / GST</span>
                  <span className="font-medium">{formatCurrency(order.tax_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Tracking / Fulfillment */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-bold text-[#1a1a2e]"><Truck className="h-4 w-4" /> Fulfillment & Tracking</h2>
            </div>
            {showTrackingForm ? (
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Courier</label>
                    <select value={trackingForm.courier_name} onChange={e => setTrackingForm(f => ({ ...f, courier_name: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]">
                      <option value="">Select courier</option>
                      {COURIER_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Service</label>
                    <input type="text" value={trackingForm.shipping_service} onChange={e => setTrackingForm(f => ({ ...f, shipping_service: e.target.value }))}
                      placeholder="Standard / Express" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Tracking ID</label>
                    <input type="text" value={trackingForm.tracking_id} onChange={e => setTrackingForm(f => ({ ...f, tracking_id: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Tracking URL</label>
                    <input type="url" value={trackingForm.tracking_url} onChange={e => setTrackingForm(f => ({ ...f, tracking_url: e.target.value }))}
                      placeholder="https://..." className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Est. Delivery</label>
                    <input type="date" value={trackingForm.estimated_delivery_at} onChange={e => setTrackingForm(f => ({ ...f, estimated_delivery_at: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Weight (kg)</label>
                    <input type="number" step="0.01" value={trackingForm.package_weight} onChange={e => setTrackingForm(f => ({ ...f, package_weight: Number(e.target.value) }))}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={handleSaveTracking} disabled={isUpdating} className="rounded-lg bg-[#1a1a2e] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2d1b4e] disabled:opacity-50">
                    {isUpdating ? "Saving..." : "Save Tracking"}
                  </button>
                  <button onClick={() => setShowTrackingForm(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="p-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <StatusBadge status={isCancelled ? "cancelled" : order.order_status === "delivered" ? "fulfilled" : order.order_status || "pending"} />
                </div>
                {order.courier_name || order.courier ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Courier</span>
                    <span className="font-medium">{order.courier_name || order.courier}</span>
                  </div>
                ) : null}
                {order.tracking_id && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tracking ID</span>
                    <span className="font-medium">{order.tracking_id}</span>
                  </div>
                )}
                {order.shipping_service && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Service</span>
                    <span className="font-medium">{order.shipping_service}</span>
                  </div>
                )}
                {order.estimated_delivery_at && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Est. Delivery</span>
                    <span className="font-medium">{new Date(order.estimated_delivery_at).toLocaleDateString("en-IN")}</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-2">
                  {!isCancelled && (
                    <>
                      <button onClick={openTrackingForm} className="inline-flex items-center gap-1 rounded-lg bg-[#1a1a2e] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2d1b4e]">
                        <Truck className="h-3.5 w-3.5" /> {order.tracking_id ? "Edit Tracking" : "Add Tracking"}
                      </button>
                      {order.tracking_url && (
                        <button onClick={handleTrackShipment} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                          <ExternalLink className="h-3.5 w-3.5" /> Track Shipment
                        </button>
                      )}
                      {order.order_status !== "delivered" && order.order_status !== "shipped" && (
                        <button onClick={() => handleStatusUpdate("shipped")} className="inline-flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-700">
                          <Truck className="h-3.5 w-3.5" /> Mark Shipped
                        </button>
                      )}
                      {order.order_status === "shipped" && (
                        <button onClick={() => handleStatusUpdate("delivered")} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">
                          <Check className="h-3.5 w-3.5" /> Mark Delivered
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-bold text-[#1a1a2e]"><Clock className="h-4 w-4" /> Timeline ({timelineEvents.length})</h2>
            </div>
            <div className="px-5 py-4 max-h-[400px] overflow-y-auto">
              <div className="space-y-4">
                {timelineEvents.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">No timeline events</p>
                ) : (
                  timelineEvents.map((event, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          event.icon === "danger" ? "bg-red-100 text-red-600" :
                          event.icon === "success" ? "bg-green-100 text-green-600" :
                          event.icon === "payment" ? "bg-blue-100 text-blue-600" :
                          event.icon === "shipping" ? "bg-purple-100 text-purple-600" :
                          event.icon === "note" ? "bg-amber-100 text-amber-600" :
                          "bg-[#1a1a2e] text-white"
                        }`}>
                          <div className="h-2 w-2 rounded-full bg-current" />
                        </div>
                        {i < timelineEvents.length - 1 && <div className="mt-1 w-px flex-1 bg-gray-200" />}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium text-[#1a1a2e]">{event.event}</p>
                        <p className="text-xs text-gray-500">{event.description}</p>
                        <p className="text-[10px] text-gray-400">{new Date(event.date).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-bold text-[#1a1a2e]"><Edit3 className="h-4 w-4" /> Internal Notes</h2>
            </div>
            <div className="px-5 py-4">
              <div className="space-y-3 mb-4 max-h-[250px] overflow-y-auto">
                {parseNotes(order.notes).length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-2">No internal notes</p>
                ) : (
                  parseNotes(order.notes).map((note, i) => (
                    <div key={i} className="rounded-lg bg-gray-50 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-[#1a1a2e]">{note.user}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{note.text}</p>
                          <p className="text-[10px] text-gray-400 mt-1">
                            {note.timestamp ? new Date(note.timestamp).toLocaleString() : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <input type="text" value={note} onChange={e => setNote(e.target.value)}
                  placeholder="Add an internal note... (saves with your admin email)"
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
                  onKeyDown={e => e.key === "Enter" && handleAddNote()} />
                <button onClick={handleAddNote} disabled={isUpdating || !note.trim()}
                  className="rounded-lg bg-[#1a1a2e] px-3 py-2 text-white hover:bg-[#2d1b4e] disabled:opacity-50">
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Audit Log */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
              <button onClick={() => setShowAuditLog(!showAuditLog)} className="flex items-center gap-2 text-sm font-bold text-[#1a1a2e] hover:text-[#c9a96e]">
                <FileText className="h-4 w-4" /> Audit Log ({auditLogs.length})
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAuditLog ? "rotate-180" : ""}`} />
              </button>
            </div>
            {showAuditLog && (
              <div className="px-5 py-4 max-h-[300px] overflow-y-auto">
                {auditLogs.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">No audit log entries</p>
                ) : (
                  <div className="space-y-2">
                    {auditLogs.map((log, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-medium text-[#1a1a2e]">{log.action?.replace(/_/g, " ")}</p>
                            <span className="text-[10px] text-gray-400">{new Date(log.created_at).toLocaleString()}</span>
                          </div>
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            {log.profiles?.full_name || log.profiles?.email || "System"}
                            {log.new_values && Object.keys(log.new_values).length > 0 && ` • ${JSON.stringify(log.new_values)}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Payment Card */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-bold text-[#1a1a2e]"><CreditCard className="h-4 w-4" /> Payment</h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <StatusBadge status={order.payment_status || "pending"} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Method</span>
                <span className="font-medium">{order.payment_method || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total</span>
                <span className="font-bold">{formatCurrency(total)}</span>
              </div>
              {totalPaid > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Paid</span>
                  <span className="font-medium text-green-600">{formatCurrency(totalPaid)}</span>
                </div>
              )}
              {totalRefunded > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Refunded</span>
                  <span className="font-medium text-red-600">{formatCurrency(totalRefunded)}</span>
                </div>
              )}
              {payments.length > 0 && (
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <p className="text-[10px] font-semibold text-gray-500 uppercase mb-1">Transactions</p>
                  {payments.map((pmt: any, i: number) => (
                    <div key={i} className="flex justify-between text-[11px] py-1">
                      <span className="text-gray-600">{pmt.status} {pmt.payment_method ? `(${pmt.payment_method})` : ""}</span>
                      <span className="font-medium">{formatCurrency(Math.abs(Number(pmt.amount)))}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex flex-col gap-2 pt-2">
                {!isCancelled && order.payment_status !== "paid" && order.payment_status !== "refunded" && (
                  <button onClick={() => setStatusConfirm({ type: "payment", value: "paid" })}
                    className="w-full rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
                    Mark Paid
                  </button>
                )}
                {!isCancelled && order.order_status !== "cancelled" && (
                  <button onClick={() => setShowCancelDialog(true)}
                    className="w-full rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Customer Card */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-bold text-[#1a1a2e]"><User className="h-4 w-4" /> Customer</h2>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-sm font-medium text-[#1a1a2e]">{order.customer_name || "Guest"}</p>
              <p className="text-xs text-gray-500">{order.customer_email || "—"}</p>
              {order.customer_phone && <p className="text-xs text-gray-500">{order.customer_phone}</p>}

              {customerSummary && (
                <div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Order History</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-gray-500">Total Orders:</span><br /><span className="font-medium">{customerSummary.totalOrders}</span></div>
                    <div><span className="text-gray-500">Completed:</span><br /><span className="font-medium text-green-600">{customerSummary.totalCompleted}</span></div>
                    <div><span className="text-gray-500">Total Spent:</span><br /><span className="font-medium">{formatCurrency(customerSummary.totalSpent)}</span></div>
                    <div><span className="text-gray-500">Refunded:</span><br /><span className="font-medium text-red-500">{formatCurrency(customerSummary.totalRefunded)}</span></div>
                  </div>
                  {customerSummary.lastOrderDate && (
                    <p className="text-[10px] text-gray-400">Last order: {new Date(customerSummary.lastOrderDate).toLocaleDateString("en-IN")}</p>
                  )}
                  {customerSummary.customerSince && (
                    <p className="text-[10px] text-gray-400">Customer since: {new Date(customerSummary.customerSince).toLocaleDateString("en-IN")}</p>
                  )}
                </div>
              )}

              {order.shipping_address && (
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Shipping Address</p>
                  <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">{parseAddress(order.shipping_address)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Templates for Print/PDF */}
      <div className="hidden">
        <InvoiceTemplate ref={invoiceRef} order={order} items={items} invoiceNumber={invoiceNumber} storeSettings={storeSettings} />
      </div>
      <div className="hidden">
        <ShippingLabel ref={labelRef} order={order} />
      </div>
    </AdminLayout>
  );
}

import { ChevronDown } from "lucide-react";

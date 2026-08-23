/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type PdfItem = {
  productName: string;
  productSku?: string | null;
  productImage?: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

const money = (value: number) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

function normalizeItem(item: any): PdfItem {
  return {
    productName: item.productName || item.product_name || item.name || "Item",
    productSku: item.productSku || item.product_sku || item.sku || null,
    productImage: item.productImage || item.product_image || item.image || null,
    quantity: Number(item.quantity || item.qty || 0),
    unitPrice: Number(item.unitPrice || item.unit_price || 0),
    lineTotal: Number(item.lineTotal || item.total_price || 0),
  };
}

function addressLines(addr: any, fallbackName?: string) {
  if (!addr) return ["-"];
  if (typeof addr === "string") return addr.split("\n").filter(Boolean);
  return [
    addr.fullName || addr.full_name || fallbackName,
    addr.addressLine1 || addr.address_line1,
    addr.addressLine2 || addr.address_line2,
    addr.landmark,
    [addr.locality, addr.city].filter(Boolean).join(", "),
    [addr.state, addr.postalCode || addr.pincode || addr.postal_code].filter(Boolean).join(" - "),
    addr.country || addr.country_code,
  ].filter(Boolean);
}

function formatDate(value?: string) {
  return value
    ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

async function imageData(url?: string | null) {
  if (!url) return null;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generateInvoicePdf({
  order,
  items,
  invoiceNumber,
}: {
  order: any;
  items: any[];
  invoiceNumber?: string;
}) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const lines = items.map(normalizeItem);
  const imageMap = new Map<number, string>();
  await Promise.all(
    lines.map(async (item, index) => {
      const data = await imageData(item.productImage);
      if (data) imageMap.set(index, data);
    }),
  );

  const inv = invoiceNumber || order.invoice_number || `CM-INV-${order.order_number || "ORDER"}`;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const brand = "#9C544D";
  const ink = "#1a1a2e";

  doc.setFillColor(253, 248, 243);
  doc.rect(0, 0, pageWidth, 42, "F");
  doc.setFillColor(156, 84, 77);
  doc.circle(24, 20, 9, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.text("CM", 24, 22, { align: "center" });
  doc.setTextColor(ink);
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.text("Creative Muse", 38, 17);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Fine Jewellery Accessories", 38, 23);
  doc.text("hello@creativemuse.in | creativemuse.in | +91 90337 79867", 38, 29);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(brand);
  doc.text("INVOICE", pageWidth - margin, 17, { align: "right" });
  doc.setTextColor(ink);
  doc.setFontSize(8);
  doc.text(`Invoice: ${inv}`, pageWidth - margin, 24, { align: "right" });
  doc.text(`Order: ${order.order_number || "-"}`, pageWidth - margin, 29, { align: "right" });
  doc.text(`Date: ${formatDate(order.created_at)}`, pageWidth - margin, 34, { align: "right" });

  let y = 52;
  doc.setDrawColor(224, 216, 204);
  doc.line(margin, 44, pageWidth - margin, 44);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Billing Address", margin, y);
  doc.text("Shipping Address", 108, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  [
    order.customer_name || "Customer",
    order.customer_email,
    order.customer_phone,
  ].filter(Boolean).forEach((line, i) => doc.text(String(line), margin, y + 6 + i * 5));
  addressLines(order.delivery_address || order.shipping_address, order.customer_name)
    .slice(0, 6)
    .forEach((line, i) => doc.text(String(line), 108, y + 6 + i * 5));

  y = 92;
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Image", "Product", "SKU", "Qty", "Unit Price", "Discount", "Total"]],
    body: lines.map((item) => [
      "",
      item.productName,
      item.productSku || "-",
      String(item.quantity),
      money(item.unitPrice),
      "-",
      money(item.lineTotal),
    ]),
    styles: { font: "helvetica", fontSize: 8, cellPadding: 2.5, textColor: ink, minCellHeight: 16 },
    headStyles: { fillColor: [26, 26, 46], textColor: [255, 255, 255], fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: 18 },
      1: { cellWidth: 48 },
      3: { halign: "center", cellWidth: 12 },
      4: { halign: "right" },
      5: { halign: "right" },
      6: { halign: "right" },
    },
    didDrawCell: (data) => {
      if (data.section !== "body" || data.column.index !== 0) return;
      const img = imageMap.get(data.row.index);
      if (!img) return;
      try {
        doc.addImage(img, data.cell.x + 2, data.cell.y + 2, 12, 12);
      } catch {}
    },
  });

  const finalY = ((doc as any).lastAutoTable?.finalY || y) + 8;
  const totalsX = pageWidth - 84;
  const row = (label: string, value: string, offset: number, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 10 : 8);
    doc.text(label, totalsX, finalY + offset);
    doc.text(value, pageWidth - margin, finalY + offset, { align: "right" });
  };
  row("Subtotal", money(order.subtotal || lines.reduce((s, i) => s + i.lineTotal, 0)), 0);
  row("Coupon Discount", order.discount_amount ? `-${money(order.discount_amount)}` : "-", 6);
  row("Gift Packaging", order.gift_packaging_enabled ? money(order.gift_packaging_price || 0) : "-", 12);
  row("Shipping", Number(order.shipping_amount || 0) === 0 ? "Free" : money(order.shipping_amount), 18);
  row("Tax", money(order.tax_amount || 0), 24);
  doc.setDrawColor(26, 26, 46);
  doc.line(totalsX, finalY + 29, pageWidth - margin, finalY + 29);
  row("Grand Total", money(order.total_amount || 0), 36, true);

  const infoY = finalY + 52;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Payment & Order", margin, infoY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Payment Method: ${order.payment_method || "-"}`, margin, infoY + 6);
  doc.text(`Payment Status: ${order.payment_status || "-"}`, margin, infoY + 11);
  doc.text(`Order Status: ${order.order_status || "-"}`, margin, infoY + 16);
  if (order.coupon_code) doc.text(`Coupon: ${order.coupon_code}`, margin, infoY + 21);
  if (order.gift_message) doc.text(`Gift Message: ${order.gift_message}`, margin, infoY + 26);

  const footerY = 268;
  doc.setDrawColor(224, 216, 204);
  doc.line(margin, footerY - 8, pageWidth - margin, footerY - 8);
  doc.setFont("helvetica", "bold");
  doc.text("Terms & Conditions", margin, footerY);
  doc.setFont("helvetica", "normal");
  doc.text("Prices are inclusive of applicable taxes unless stated otherwise. Returns and exchanges are subject to store policy.", margin, footerY + 5);
  doc.text("Support: hello@creativemuse.in | Website: creativemuse.in | Phone: +91 90337 79867", margin, footerY + 10);
  doc.text("Authorized Signature", pageWidth - margin, footerY + 10, { align: "right" });
  doc.line(pageWidth - 58, footerY + 3, pageWidth - margin, footerY + 3);

  doc.save(`${inv}.pdf`);
}

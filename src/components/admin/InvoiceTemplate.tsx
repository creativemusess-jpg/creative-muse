/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from "react";
import type { NormalizedOrderItem } from "@/lib/api/order-items";

interface InvoiceTemplateProps {
  order: any;
  items: NormalizedOrderItem[];
  invoiceNumber: string;
  storeSettings?: Record<string, any>;
}

const InvoiceTemplate = forwardRef<HTMLDivElement, InvoiceTemplateProps>(
  ({ order, items, invoiceNumber, storeSettings }, ref) => {
    const subtotal = items.reduce((s: number, i: any) => s + (i.lineTotal || 0), 0);
    const total = order.total_amount || subtotal;
    const business = storeSettings?.store_info || storeSettings?.business_info || {};
    const taxSnap = order.tax_snapshot || {};
    const formatCurrency = (n: number) => `₹${n.toLocaleString("en-IN")}`;

    return (
      <div
        ref={ref}
        className="invoice-template"
        style={{ fontFamily: "Inter, system-ui, sans-serif", color: "#1a1a2e" }}
      >
        <style>{`
          @page { size: A4; margin: 15mm; }
          .invoice-template { width: 100%; max-width: 210mm; margin: 0 auto; padding: 20px; background: #fff; }
          .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
          .invoice-business { text-align: left; }
          .invoice-business h1 { font-size: 24px; font-weight: 700; margin: 0 0 4px; color: #1a1a2e; }
          .invoice-business p { font-size: 11px; color: #666; margin: 2px 0; line-height: 1.5; }
          .invoice-title { text-align: right; }
          .invoice-title h2 { font-size: 20px; font-weight: 700; margin: 0 0 4px; color: #c9a96e; text-transform: uppercase; letter-spacing: 1px; }
          .invoice-title p { font-size: 11px; color: #666; margin: 2px 0; }
          .invoice-divider { border: none; border-top: 2px solid #c9a96e; margin: 16px 0; }
          .invoice-section { margin-bottom: 20px; }
          .invoice-section h3 { font-size: 12px; font-weight: 600; color: #c9a96e; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .info-grid p { font-size: 11px; margin: 2px 0; color: #444; }
          .info-grid strong { color: #1a1a2e; }
          table.invoice-items { width: 100%; border-collapse: collapse; font-size: 11px; margin: 16px 0; }
          table.invoice-items th { background: #1a1a2e; color: #fff; padding: 8px 10px; text-align: left; font-weight: 600; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
          table.invoice-items th:last-child { text-align: right; }
          table.invoice-items td { padding: 8px 10px; border-bottom: 1px solid #eee; vertical-align: top; }
          table.invoice-items td:last-child { text-align: right; white-space: nowrap; }
          table.invoice-items tr:last-child td { border-bottom: none; }
          .invoice-totals { margin-left: auto; width: 280px; }
          .invoice-totals table { width: 100%; font-size: 11px; }
          .invoice-totals td { padding: 4px 0; }
          .invoice-totals td:last-child { text-align: right; font-weight: 500; }
          .invoice-totals .grand-total td { font-size: 14px; font-weight: 700; padding-top: 8px; border-top: 2px solid #1a1a2e; color: #1a1a2e; }
          .invoice-footer { margin-top: 30px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 10px; color: #888; text-align: center; }
          .invoice-footer p { margin: 2px 0; }
          .invoice-payment-info { font-size: 11px; margin-top: 8px; }
          .invoice-payment-info p { margin: 2px 0; }
          .invoice-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 9px; font-weight: 600; text-transform: uppercase; }
          .badge-paid { background: #d1fae5; color: #065f46; }
          .badge-pending { background: #fef3c7; color: #92400e; }
          .badge-cancelled { background: #fee2e2; color: #991b1b; }
          .item-image-cell img { width: 40px; height: 40px; object-fit: contain; border-radius: 4px; border: 1px solid #eee; }
          @media print {
            .invoice-template { padding: 0; max-width: 100%; }
            .no-print { display: none !important; }
          }
        `}</style>

        <div className="invoice-header">
          <div className="invoice-business">
            <h1>{business.name || "Creative Muse"}</h1>
            <p>{business.address || ""}</p>
            <p>
              {(business.city || "") +
                (business.city && business.state ? ", " : "") +
                (business.state || "")}
            </p>
            <p>{business.postal_code || ""}</p>
            <p>{business.phone || ""}</p>
            <p>{business.email || ""}</p>
            {business.gstin && (
              <p>
                <strong>GSTIN:</strong> {business.gstin}
              </p>
            )}
            <p>www.creativemuse.in</p>
          </div>
          <div className="invoice-title">
            <h2>Invoice</h2>
            <p>
              <strong>Invoice #:</strong> {invoiceNumber}
            </p>
            <p>
              <strong>Order #:</strong> {order.order_number}
            </p>
            <p>
              <strong>Invoice Date:</strong>{" "}
              {new Date().toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <p>
              <strong>Order Date:</strong>{" "}
              {new Date(order.created_at).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <p>
              <strong>Payment:</strong>{" "}
              <span className={`invoice-badge badge-${order.payment_status}`}>
                {order.payment_status}
              </span>
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`invoice-badge badge-${order.order_status === "delivered" ? "paid" : order.order_status}`}
              >
                {order.order_status}
              </span>
            </p>
          </div>
        </div>

        <hr className="invoice-divider" />

        <div className="info-grid">
          <div className="invoice-section">
            <h3>Bill To</h3>
            <p>
              <strong>{order.customer_name || "Guest"}</strong>
            </p>
            <p>{order.customer_email || ""}</p>
            <p>{order.customer_phone || ""}</p>
          </div>
          <div className="invoice-section">
            <h3>Ship To</h3>
            {order.delivery_address || order.shipping_address ? (
              typeof (order.delivery_address || order.shipping_address) === "string" ? (
                <p>{order.delivery_address || order.shipping_address}</p>
              ) : (
                <div>
                  <p>{order.customer_name}</p>
                  {Object.values(
                    (order.delivery_address || order.shipping_address) as Record<string, any>,
                  )
                    .filter(Boolean)
                    .map((v: any, i: number) => (
                      <p key={i}>{String(v)}</p>
                    ))}
                  <p>{order.customer_phone}</p>
                </div>
              )
            ) : (
              <p>—</p>
            )}
          </div>
        </div>

        <div className="invoice-section">
          <h3>Order Items</h3>
          <table className="invoice-items">
            <thead>
              <tr>
                <th style={{ width: 50 }}></th>
                <th>Product</th>
                <th>SKU</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td className="item-image-cell">
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName} />
                    ) : (
                      <div
                        style={{ width: 40, height: 40, background: "#f3f4f6", borderRadius: 4 }}
                      />
                    )}
                  </td>
                  <td>
                    {item.productName || "Unavailable product"}
                    {item.selectedVariant && (
                      <div style={{ fontSize: 10, color: "#999" }}>
                        {item.selectedVariant}
                        {item.selectedSize ? `, ${item.selectedSize}` : ""}
                      </div>
                    )}
                  </td>
                  <td>{item.sku || "—"}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unitPrice > 0 ? formatCurrency(item.unitPrice) : "—"}</td>
                  <td>{formatCurrency(item.lineTotal || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="invoice-totals">
          <table>
            <tbody>
              <tr>
                <td>Subtotal</td>
                <td>{formatCurrency(subtotal)}</td>
              </tr>
              {order.discount_amount > 0 && (
                <tr>
                  <td>Discount</td>
                  <td style={{ color: "#059669" }}>-{formatCurrency(order.discount_amount)}</td>
                </tr>
              )}
              {order.shipping_amount > 0 && (
                <tr>
                  <td>Shipping</td>
                  <td>{formatCurrency(order.shipping_amount)}</td>
                </tr>
              )}
              {order.tax_amount > 0 && taxSnap.gstType === "cgst_sgst" ? (
                <>
                  <tr>
                    <td>CGST @ {taxSnap.cgstRate || ""}%</td>
                    <td>{formatCurrency(taxSnap.cgstAmount || order.tax_amount / 2)}</td>
                  </tr>
                  <tr>
                    <td>SGST @ {taxSnap.sgstRate || ""}%</td>
                    <td>{formatCurrency(taxSnap.sgstAmount || order.tax_amount / 2)}</td>
                  </tr>
                </>
              ) : order.tax_amount > 0 && taxSnap.gstType === "igst" ? (
                <tr>
                  <td>IGST @ {taxSnap.igstRate || ""}%</td>
                  <td>{formatCurrency(taxSnap.igstAmount || order.tax_amount)}</td>
                </tr>
              ) : order.tax_amount > 0 ? (
                <tr>
                  <td>Tax / GST</td>
                  <td>{formatCurrency(order.tax_amount)}</td>
                </tr>
              ) : null}
              <tr className="grand-total">
                <td>Grand Total</td>
                <td>{formatCurrency(total)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="invoice-payment-info">
          <p>
            <strong>Payment Method:</strong> {order.payment_method || "—"}
          </p>
          <p>
            <strong>Payment Status:</strong> {order.payment_status}
          </p>
          {business.gstin && (
            <p>
              <strong>GSTIN:</strong> {business.gstin}
            </p>
          )}
          {order.delivery_state_code && (
            <p>
              <strong>Place of Supply:</strong> {order.delivery_state_code}
            </p>
          )}
          {order.delivery_method && (
            <p>
              <strong>Delivery Method:</strong>{" "}
              {order.delivery_method === "express" ? "Express Delivery" : "Standard Delivery"}
            </p>
          )}
        </div>

        <div className="invoice-footer">
          <p>Thank you for shopping with Creative Muse!</p>
          <p>For returns or exchanges, please contact us within 7 days of delivery.</p>
          <p>
            Email: {business.email || "hello@creativemuse.in"} | Phone: {business.phone || ""}
          </p>
          <p style={{ marginTop: 8 }}>© 2026 All Rights Reserved By Creative Muse</p>
          <p>Designed & Developed By APFP UNIVERSAL</p>
        </div>
      </div>
    );
  },
);

InvoiceTemplate.displayName = "InvoiceTemplate";
export default InvoiceTemplate;

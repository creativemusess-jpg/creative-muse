import { forwardRef } from "react";

interface ShippingLabelProps {
  order: any;
}

const ShippingLabel = forwardRef<HTMLDivElement, ShippingLabelProps>(({ order }, ref) => {
  const formatAddress = () => {
    if (!order.shipping_address) return "—";
    if (typeof order.shipping_address === "string") return order.shipping_address;
    return Object.values(order.shipping_address as Record<string, any>).filter(Boolean).join(", ");
  };

  return (
    <div ref={ref} style={{ fontFamily: "Inter, system-ui, sans-serif", color: "#1a1a2e" }}>
      <style>{`
        @page { size: 4in 6in; margin: 0; }
        .label-container { width: 4in; min-height: 6in; padding: 0.25in; background: #fff; box-sizing: border-box; }
        .label-header { text-align: center; border-bottom: 2px solid #1a1a2e; padding-bottom: 8px; margin-bottom: 12px; }
        .label-header h1 { font-size: 16px; font-weight: 700; margin: 0; color: #1a1a2e; }
        .label-header p { font-size: 10px; color: #666; margin: 2px 0; }
        .label-section { margin-bottom: 12px; }
        .label-section h3 { font-size: 9px; font-weight: 600; color: #c9a96e; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px; }
        .label-section p { font-size: 11px; margin: 1px 0; color: #333; }
        .label-section .name { font-size: 14px; font-weight: 700; color: #1a1a2e; }
        .label-divider { border: none; border-top: 1px dashed #ccc; margin: 10px 0; }
        .label-barcode { text-align: center; margin: 12px 0; }
        .label-barcode svg { max-width: 100%; }
        .label-footer { font-size: 8px; color: #999; text-align: center; margin-top: 8px; }
        .label-tag { display: inline-block; padding: 2px 6px; border-radius: 3px; font-size: 9px; font-weight: 600; }
        .label-tag-cod { background: #fef3c7; color: #92400e; }
        .label-tag-prepaid { background: #d1fae5; color: #065f46; }
        .label-info-row { display: flex; justify-content: space-between; font-size: 10px; color: #666; }
        @media print {
          .label-container { padding: 0.25in; }
        }
      `}</style>

      <div className="label-container">
        <div className="label-header">
          <h1>Creative Muse</h1>
          <p>Fine Jewellery • Shipping Label</p>
        </div>

        <div className="label-section">
          <h3>Order Information</h3>
          <p><strong>Order:</strong> {order.order_number}</p>
          {order.invoice_number && <p><strong>Invoice:</strong> {order.invoice_number}</p>}
          <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString("en-IN")}</p>
        </div>

        <hr className="label-divider" />

        <div className="label-section">
          <h3>Ship To</h3>
          <p className="name">{order.customer_name || "Guest"}</p>
          <p>{formatAddress()}</p>
          <p>{order.customer_phone}</p>
        </div>

        <hr className="label-divider" />

        <div className="label-section">
          <h3>Delivery Method</h3>
          <p>
            {order.payment_method === "cod" ? (
              <span className="label-tag label-tag-cod">COD</span>
            ) : (
              <span className="label-tag label-tag-prepaid">Prepaid</span>
            )}
            {" "}
            {order.courier_name || order.courier || "Standard"}
          </p>
          {order.tracking_id && <p><strong>Tracking:</strong> {order.tracking_id}</p>}
        </div>

        <hr className="label-divider" />

        <div className="label-info-row">
          <span>Packages: {order.package_count || 1}</span>
          {order.package_weight && <span>Weight: {order.package_weight} kg</span>}
        </div>

        <div className="label-barcode">
          <svg width="200" height="60" viewBox="0 0 200 60">
            <rect x="0" y="0" width="200" height="60" fill="#fff" />
            {Array.from({ length: 60 }).map((_, i) => (
              <rect
                key={i}
                x={5 + i * 3}
                y={5}
                width={Math.random() > 0.3 ? 1.5 : 3}
                height={50}
                fill="#1a1a2e"
                opacity={0.9}
              />
            ))}
          </svg>
          <p style={{ fontSize: 9, margin: "4px 0 0", color: "#666", letterSpacing: 2 }}>
            {order.order_number}
          </p>
        </div>

        <div className="label-footer">
          <p>© 2026 Creative Muse • Designed & Developed By APFP UNIVERSAL</p>
        </div>
      </div>
    </div>
  );
});

ShippingLabel.displayName = "ShippingLabel";
export default ShippingLabel;

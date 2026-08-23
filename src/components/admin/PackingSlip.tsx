/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from "react";
import type { NormalizedOrderItem } from "@/lib/api/order-items";

interface PackingSlipProps {
  order: any;
  items: NormalizedOrderItem[];
}

const PackingSlip = forwardRef<HTMLDivElement, PackingSlipProps>(({ order, items }, ref) => {
  const address = order.delivery_address || order.shipping_address || {};
  const formatAddress = () => {
    if (typeof address === "string") return address;
    return [
      address.addressLine1,
      address.addressLine2,
      [address.locality, address.city].filter(Boolean).join(", "),
      [address.state, address.postalCode || address.pincode].filter(Boolean).join(" - "),
      address.country,
    ]
      .filter(Boolean)
      .join(", ");
  };
  const trackingValue = order.tracking_number || order.tracking_id || order.order_number;

  return (
    <div
      ref={ref}
      className="packing-slip"
      style={{ fontFamily: "Inter, Arial, sans-serif", color: "#1a1a2e" }}
    >
      <style>{`
        @page { size: A4 portrait; margin: 14mm; }
        .packing-slip { width: 190mm; min-height: 270mm; background:#fffdf8; padding:18mm; box-sizing:border-box; border:1px solid #ead8b8; }
        .ps-header { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1px solid #9C544D; padding-bottom:18px; }
        .ps-logo { font:700 42px Georgia,serif; color:#222; letter-spacing:.04em; }
        .ps-title { font:500 30px Georgia,serif; color:#7b5417; text-transform:uppercase; }
        .ps-grid { display:grid; grid-template-columns:1fr 1fr; gap:22px; margin-top:22px; }
        .ps-card { border:1px solid #ead8b8; border-radius:8px; padding:14px; background:#fff; }
        .ps-card h3 { margin:0 0 8px; font:700 13px Georgia,serif; color:#7b5417; text-transform:uppercase; letter-spacing:.08em; }
        .ps-card p { margin:3px 0; font-size:12px; line-height:1.5; color:#2c2c2c; }
        .ps-items { width:100%; border-collapse:collapse; margin-top:22px; font-size:12px; background:#fff; border:1px solid #ead8b8; }
        .ps-items th { color:#7b5417; text-transform:uppercase; font-size:11px; letter-spacing:.06em; padding:10px; border-bottom:1px solid #ead8b8; }
        .ps-items td { padding:10px; border-bottom:1px solid #ead8b8; vertical-align:middle; }
        .ps-items img { width:64px; height:64px; object-fit:contain; border:1px solid #ead8b8; border-radius:7px; background:#fff7e8; }
        .ps-note { margin-top:22px; display:grid; grid-template-columns:auto 1fr; gap:14px; align-items:center; border:1px solid #ead8b8; border-radius:10px; padding:14px; background:#fff9ef; }
        .ps-footer { margin-top:20px; text-align:center; color:#7b5417; font:500 15px Georgia,serif; }
      `}</style>
      <div className="ps-header">
        <div>
          <div className="ps-logo">CM</div>
          <p
            style={{ margin: 0, fontSize: 11, letterSpacing: ".26em", textTransform: "uppercase" }}
          >
            Creative Muse Accessories
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="ps-title">Packing Slip</div>
          <p style={{ margin: "10px 0 0", fontSize: 13 }}>
            Order No.: <strong>{order.order_number}</strong>
          </p>
          <p style={{ margin: "4px 0", fontSize: 13 }}>
            Package No.: <strong>{order.package_number || "PKG-01"}</strong>
          </p>
          <p style={{ margin: "4px 0", fontSize: 13 }}>
            Order Date: {new Date(order.created_at).toLocaleDateString("en-IN")}
          </p>
        </div>
      </div>

      <div className="ps-grid">
        <div className="ps-card">
          <h3>Bill To</h3>
          <p>
            <strong>{order.customer_name || "Guest"}</strong>
          </p>
          <p>{order.customer_email || ""}</p>
          <p>{order.customer_phone || ""}</p>
        </div>
        <div className="ps-card">
          <h3>Ship To</h3>
          <p>
            <strong>{order.customer_name || "Guest"}</strong>
          </p>
          <p>{formatAddress()}</p>
          <p>{order.customer_phone || ""}</p>
        </div>
      </div>

      <table className="ps-items">
        <thead>
          <tr>
            <th align="left">Product</th>
            <th align="right">Qty</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {item.productImage ? (
                    <img src={item.productImage} alt={item.productName} />
                  ) : null}
                  <strong>{item.productName}</strong>
                </div>
              </td>
              <td align="right">{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ps-note">
        <div
          style={{
            width: 54,
            height: 54,
            border: "1px solid #9C544D",
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            color: "#9C544D",
            fontSize: 28,
          }}
        >
          ◇
        </div>
        <div>
          <h3
            style={{
              margin: 0,
              font: "700 14px Georgia,serif",
              color: "#7b5417",
              textTransform: "uppercase",
            }}
          >
            Packing Note
          </h3>
          <p style={{ margin: "6px 0 0", fontSize: 12, lineHeight: 1.6 }}>
            Your fine jewellery has been carefully inspected, securely packed, and insured for safe
            delivery. Thank you for choosing Creative Muse.
          </p>
        </div>
      </div>

      <div className="ps-grid">
        <div className="ps-card">
          <h3>Courier Details</h3>
          <p>Courier Partner: {order.courier_name || order.courier || "-"}</p>
          <p>Service Type: {order.shipping_service || order.delivery_method || "-"}</p>
          <p>Tracking: {trackingValue || "-"}</p>
        </div>
        <div className="ps-card">
          <h3>Prepared By</h3>
          <p>Admin</p>
          <p>Packed Date: {new Date(order.packed_at || Date.now()).toLocaleDateString("en-IN")}</p>
        </div>
      </div>

      <div className="ps-footer">Handcrafted with love. Delivered with care.</div>
    </div>
  );
});

PackingSlip.displayName = "PackingSlip";
export default PackingSlip;

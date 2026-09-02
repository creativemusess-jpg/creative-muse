/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from "react";

interface ShippingLabelProps {
  order: any;
  storeSettings?: Record<string, any>;
}

const ShippingLabel = forwardRef<HTMLDivElement, ShippingLabelProps>(
  ({ order, storeSettings }, ref) => {
    const trackingValue = order.tracking_number || order.tracking_id || order.order_number || "";
    const address = order.delivery_address || order.shipping_address || {};
    const postalCode = order.delivery_pincode || address.postalCode || address.pincode || "";
    const store = storeSettings?.store_info || storeSettings?.business_info || {};

    const formatAddress = () => {
      if (!address) return "-";
      if (typeof address === "string") return address;
      return [
        address.addressLine1,
        address.addressLine2,
        address.landmark,
        [address.locality, address.city].filter(Boolean).join(", "),
        [address.state, address.postalCode || address.pincode].filter(Boolean).join(" - "),
        address.country,
      ]
        .filter(Boolean)
        .join(", ");
    };

    const barcodeBars = () => {
      const seed = trackingValue || order.order_number || "CREATIVE-MUSE";
      const bars: Array<{ width: number; gap: number }> = [];
      seed.split("").forEach((char: string, index: number) => {
        const code = char.charCodeAt(0) + index;
        bars.push({
          width: code % 3 === 0 ? 3 : code % 2 === 0 ? 2 : 1,
          gap: code % 4 === 0 ? 2 : 1,
        });
        bars.push({ width: code % 5 === 0 ? 1 : 2, gap: 1 });
      });
      return bars.slice(0, 86).reduce((acc: Array<{ x: number; width: number }>, bar) => {
        const previous = acc[acc.length - 1];
        const x = previous ? previous.x + previous.width + bar.gap : 8;
        acc.push({ x, width: bar.width });
        return acc;
      }, []);
    };

    const qrCells = () => {
      const seed = `${order.order_number}|${trackingValue}|${postalCode}`;
      return Array.from({ length: 21 * 21 }, (_, index) => {
        const code = seed.charCodeAt(index % Math.max(seed.length, 1)) || 31;
        return (code + index * 7 + Math.floor(index / 21)) % 5 < 2;
      });
    };

    return (
      <div ref={ref} style={{ fontFamily: "Inter, Arial, sans-serif", color: "#111" }}>
        <style>{`
        @page { size: 4in 6in; margin: 0; }
        .label-container { width: 4in; min-height: 6in; padding: 0.18in; background: #fff; box-sizing: border-box; border: 1px solid #111; }
        .label-header { display:flex; justify-content:space-between; align-items:flex-start; border-bottom: 2px solid #111; padding-bottom: 8px; margin-bottom: 10px; }
        .label-header h1 { font-size: 28px; line-height: 1; font-weight: 700; margin: 0; color: #111; letter-spacing: 0.04em; }
        .label-header p { font-size: 9px; color: #222; margin: 2px 0; letter-spacing: 0.24em; text-transform: uppercase; }
        .prepaid-badge { background:#111; color:#fff; padding:7px 12px; font-size:18px; font-weight:800; text-transform:uppercase; border-radius:3px; }
        .label-section { margin-bottom: 10px; }
        .label-section h3 { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 5px; }
        .label-section p { font-size: 11px; margin: 2px 0; color: #111; }
        .label-section .name { font-size: 16px; font-weight: 800; }
        .label-divider { border: none; border-top: 1px dashed #999; margin: 9px 0; }
        .label-info-row { display: flex; justify-content: space-between; border:1px solid #111; }
        .label-info-row span { flex:1; text-align:center; padding:7px 3px; font-size:12px; font-weight:800; border-right:1px solid #111; }
        .label-info-row span:last-child { border-right:0; }
        .qr { display:grid; grid-template-columns: repeat(21, 4px); grid-template-rows: repeat(21, 4px); background:#fff; padding:6px; border:1px solid #111; width:max-content; }
        .pin { font-size:34px; font-weight:900; letter-spacing:2px; color:#111; text-align:center; margin-top:8px; }
        .label-barcode { text-align:center; margin:11px 0 8px; }
        .label-footer { border-top: 12px solid #111; padding-top: 6px; font-size: 9px; color: #111; }
        .label-footer p { margin: 2px 0; }
      `}</style>

        <div className="label-container">
          <div className="label-header">
            <div>
              <h1>CM</h1>
              <p>{store.name || "Creative Muse"}</p>
            </div>
            <div className="prepaid-badge">
              {order.payment_method === "cod" ? "COD" : "Prepaid"}
            </div>
          </div>

          <div
            className="label-section"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
          >
            <div>
              <p>
                <strong>Order No:</strong> {order.order_number}
              </p>
              <p>
                <strong>Shipment ID:</strong> {order.shipment_id || "-"}
              </p>
            </div>
            <div>
              <p>
                <strong>Courier:</strong> {order.courier_name || order.courier || "-"}
              </p>
              <p>
                <strong>Tracking No:</strong> {trackingValue || "-"}
              </p>
            </div>
          </div>

          <hr className="label-divider" />

          <div
            className="label-section"
            style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}
          >
            <div>
              <h3 style={{ background: "#111", color: "#fff", padding: "4px 6px" }}>Ship To</h3>
              <p className="name">{order.customer_name || "Guest"}</p>
              <p>{formatAddress()}</p>
              <p>Ph: {order.customer_phone || "-"}</p>
            </div>
            <div>
              <div className="qr">
                {qrCells().map((on, index) => (
                  <span key={index} style={{ background: on ? "#111" : "#fff" }} />
                ))}
              </div>
              <div className="pin">{postalCode || "-"}</div>
            </div>
          </div>

          <hr className="label-divider" />

          <div className="label-barcode">
            <svg
              width="330"
              height="72"
              viewBox="0 0 330 72"
              role="img"
              aria-label={`Barcode ${trackingValue}`}
            >
              <rect x="0" y="0" width="330" height="72" fill="#fff" />
              {barcodeBars().map((bar, index) => (
                <rect key={index} x={bar.x} y="6" width={bar.width} height="56" fill="#111" />
              ))}
            </svg>
            <p
              style={{
                fontSize: 13,
                margin: "2px 0 0",
                color: "#111",
                letterSpacing: 2,
                fontWeight: 800,
              }}
            >
              {trackingValue || order.order_number}
            </p>
          </div>

          <div className="label-info-row">
            <span>
              Weight
              <br />
              {order.package_weight || "0.00"} kg
            </span>
            <span>
              Package
              <br />1 / {order.package_count || 1}
            </span>
            <span>
              Routing
              <br />
              {order.routing_code || postalCode || "-"}
            </span>
          </div>

          <div className="label-footer">
            <p>
              <strong>Return Address</strong>
            </p>
            <p>{store.address || "Configured store address unavailable"}</p>
            <p>{store.email || "Configured support email unavailable"}</p>
          </div>
        </div>
      </div>
    );
  },
);

ShippingLabel.displayName = "ShippingLabel";
export default ShippingLabel;

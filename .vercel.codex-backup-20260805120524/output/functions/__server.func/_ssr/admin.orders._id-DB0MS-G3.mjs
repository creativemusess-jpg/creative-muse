import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./supabase-Bz-JQXNc.mjs";
import { t as settingsApi } from "./settings-wLvOzTaw.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as Package, Ct as Clock, Ht as Archive, Lt as Ban, Mt as Check, N as Printer, O as Send, R as PenLine, St as Copy, U as MessageSquare, Vt as ArrowLeft, Y as LoaderCircle, dt as FileText, f as Undo2, gt as Ellipsis, ht as ExternalLink, j as RotateCcw, jt as ChevronDown, l as User, p as Truck, q as Mail, vt as Download, xt as CreditCard } from "../_libs/lucide-react.mjs";
import { t as generateInvoicePdf } from "./invoice-pdf-B4IYl00w.mjs";
import { n as AdminLayout, r as AdminLoading, s as ordersApi } from "./AdminLayout-D0HWfGfb.mjs";
import { i as Toast, r as StatusBadge, t as ConfirmDialog } from "./AdminTable-9BSMWvKK.mjs";
import { t as Route } from "./admin.orders._id-CzT4VorT.mjs";
import { i as sendTransactionalEmail, n as listOrderNotifications } from "./server-DlvYJMt6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.orders._id-DB0MS-G3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var InvoiceTemplate = (0, import_react.forwardRef)(({ order, items, invoiceNumber, storeSettings }, ref) => {
	const subtotal = items.reduce((s, i) => s + (i.lineTotal || 0), 0);
	const total = order.total_amount || subtotal;
	const business = storeSettings?.store_info || storeSettings?.business_info || {};
	const formatCurrency = (n) => `₹${n.toLocaleString("en-IN")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: "invoice-template",
		style: {
			fontFamily: "Inter, system-ui, sans-serif",
			color: "#1a1a2e"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
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
          @media print {
            .invoice-template { padding: 0; max-width: 100%; }
            .no-print { display: none !important; }
          }
        ` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "invoice-header",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "invoice-business",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: business.name || "Creative Muse" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: business.address || "" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: (business.city || "") + (business.city && business.state ? ", " : "") + (business.state || "") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: business.postal_code || "" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: business.phone || "" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: business.email || "" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "www.creativemuse.in" })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "invoice-title",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Invoice" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Invoice #:" }),
							" ",
							invoiceNumber
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Order #:" }),
							" ",
							order.order_number
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Invoice Date:" }),
							" ",
							(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
								year: "numeric",
								month: "short",
								day: "numeric"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Order Date:" }),
							" ",
							new Date(order.created_at).toLocaleDateString("en-IN", {
								year: "numeric",
								month: "short",
								day: "numeric"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Payment:" }),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `invoice-badge badge-${order.payment_status}`,
								children: order.payment_status
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Status:" }),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `invoice-badge badge-${order.order_status === "delivered" ? "paid" : order.order_status}`,
								children: order.order_status
							})
						] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "invoice-divider" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "info-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "invoice-section",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Bill To" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: order.customer_name || "Guest" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: order.customer_email || "" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: order.customer_phone || "" })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "invoice-section",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Ship To" }), order.delivery_address || order.shipping_address ? typeof (order.delivery_address || order.shipping_address) === "string" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: order.delivery_address || order.shipping_address }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: order.customer_name }),
						Object.values(order.delivery_address || order.shipping_address).filter(Boolean).map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: String(v) }, i)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: order.customer_phone })
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "—" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "invoice-section",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Order Items" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "invoice-items",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Product" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							style: { width: 60 },
							children: "Qty"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							style: { width: 90 },
							children: "Unit Price"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							style: { width: 90 },
							children: "Total"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [item.productName || "Unavailable product", item.selectedVariant && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								fontSize: 10,
								color: "#999"
							},
							children: [item.selectedVariant, item.selectedSize ? `, ${item.selectedSize}` : ""]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: item.quantity }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: item.unitPrice > 0 ? formatCurrency(item.unitPrice) : "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: formatCurrency(item.lineTotal || 0) })
					] }, i)) })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "invoice-totals",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: formatCurrency(subtotal) })] }),
					order.discount_amount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Discount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						style: { color: "#059669" },
						children: ["-", formatCurrency(order.discount_amount)]
					})] }),
					order.shipping_amount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Shipping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: formatCurrency(order.shipping_amount) })] }),
					null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "grand-total",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Grand Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: formatCurrency(total) })]
					})
				] }) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "invoice-payment-info",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Payment Method:" }),
						" ",
						order.payment_method || "—"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Payment Status:" }),
						" ",
						order.payment_status
					] }),
					order.delivery_method && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Delivery Method:" }),
						" ",
						order.delivery_method === "express" ? "Express Delivery" : "Standard Delivery"
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "invoice-footer",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Thank you for shopping with Creative Muse!" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "For returns or exchanges, please contact us within 7 days of delivery." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Email: ",
						business.email || "hello@creativemuse.in",
						" | Phone: ",
						business.phone || ""
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: { marginTop: 8 },
						children: "© 2026 All Rights Reserved By Creative Muse"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Designed & Developed By APFP UNIVERSAL" })
				]
			})
		]
	});
});
InvoiceTemplate.displayName = "InvoiceTemplate";
var ShippingLabel = (0, import_react.forwardRef)(({ order, storeSettings }, ref) => {
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
			address.country
		].filter(Boolean).join(", ");
	};
	const barcodeBars = () => {
		const seed = trackingValue || order.order_number || "CREATIVE-MUSE";
		const bars = [];
		seed.split("").forEach((char, index) => {
			const code = char.charCodeAt(0) + index;
			bars.push({
				width: code % 3 === 0 ? 3 : code % 2 === 0 ? 2 : 1,
				gap: code % 4 === 0 ? 2 : 1
			});
			bars.push({
				width: code % 5 === 0 ? 1 : 2,
				gap: 1
			});
		});
		return bars.slice(0, 86).reduce((acc, bar) => {
			const previous = acc[acc.length - 1];
			const x = previous ? previous.x + previous.width + bar.gap : 8;
			acc.push({
				x,
				width: bar.width
			});
			return acc;
		}, []);
	};
	const qrCells = () => {
		const seed = `${order.order_number}|${trackingValue}|${postalCode}`;
		return Array.from({ length: 441 }, (_, index) => {
			return ((seed.charCodeAt(index % Math.max(seed.length, 1)) || 31) + index * 7 + Math.floor(index / 21)) % 5 < 2;
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		style: {
			fontFamily: "Inter, Arial, sans-serif",
			color: "#111"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
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
      ` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "label-container",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "label-header",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "CM" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: store.name || "Creative Muse" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "prepaid-badge",
						children: order.payment_method === "cod" ? "COD" : "Prepaid"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "label-section",
					style: {
						display: "grid",
						gridTemplateColumns: "1fr 1fr",
						gap: 8
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Order No:" }),
						" ",
						order.order_number
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Shipment ID:" }),
						" ",
						order.shipment_id || "-"
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Courier:" }),
						" ",
						order.courier_name || order.courier || "-"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Tracking No:" }),
						" ",
						trackingValue || "-"
					] })] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "label-divider" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "label-section",
					style: {
						display: "grid",
						gridTemplateColumns: "1fr auto",
						gap: 10
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							style: {
								background: "#111",
								color: "#fff",
								padding: "4px 6px"
							},
							children: "Ship To"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "name",
							children: order.customer_name || "Guest"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: formatAddress() }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Ph: ", order.customer_phone || "-"] })
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "qr",
						children: qrCells().map((on, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { background: on ? "#111" : "#fff" } }, index))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pin",
						children: postalCode || "-"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "label-divider" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "label-barcode",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						width: "330",
						height: "72",
						viewBox: "0 0 330 72",
						role: "img",
						"aria-label": `Barcode ${trackingValue}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "0",
							y: "0",
							width: "330",
							height: "72",
							fill: "#fff"
						}), barcodeBars().map((bar, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: bar.x,
							y: "6",
							width: bar.width,
							height: "56",
							fill: "#111"
						}, index))]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: {
							fontSize: 13,
							margin: "2px 0 0",
							color: "#111",
							letterSpacing: 2,
							fontWeight: 800
						},
						children: trackingValue || order.order_number
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "label-info-row",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Weight",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							order.package_weight || "0.00",
							" kg"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Package",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"1 / ",
							order.package_count || 1
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Routing",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							order.routing_code || postalCode || "-"
						] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "label-footer",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Return Address" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: store.address || "Configured store address unavailable" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: store.email || "Configured support email unavailable" })
					]
				})
			]
		})]
	});
});
ShippingLabel.displayName = "ShippingLabel";
var PackingSlip = (0, import_react.forwardRef)(({ order, items }, ref) => {
	const address = order.delivery_address || order.shipping_address || {};
	const formatAddress = () => {
		if (typeof address === "string") return address;
		return [
			address.addressLine1,
			address.addressLine2,
			[address.locality, address.city].filter(Boolean).join(", "),
			[address.state, address.postalCode || address.pincode].filter(Boolean).join(" - "),
			address.country
		].filter(Boolean).join(", ");
	};
	const trackingValue = order.tracking_number || order.tracking_id || order.order_number;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: "packing-slip",
		style: {
			fontFamily: "Inter, Arial, sans-serif",
			color: "#1a1a2e"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @page { size: A4 portrait; margin: 14mm; }
        .packing-slip { width: 190mm; min-height: 270mm; background:#fffdf8; padding:18mm; box-sizing:border-box; border:1px solid #ead8b8; }
        .ps-header { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1px solid #7A2533; padding-bottom:18px; }
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
      ` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ps-header",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ps-logo",
					children: "CM"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					style: {
						margin: 0,
						fontSize: 11,
						letterSpacing: ".26em",
						textTransform: "uppercase"
					},
					children: "Creative Muse Accessories"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: { textAlign: "right" },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "ps-title",
							children: "Packing Slip"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							style: {
								margin: "10px 0 0",
								fontSize: 13
							},
							children: ["Order No.: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: order.order_number })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							style: {
								margin: "4px 0",
								fontSize: 13
							},
							children: ["Package No.: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: order.package_number || "PKG-01" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							style: {
								margin: "4px 0",
								fontSize: 13
							},
							children: ["Order Date: ", new Date(order.created_at).toLocaleDateString("en-IN")]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ps-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ps-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Bill To" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: order.customer_name || "Guest" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: order.customer_email || "" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: order.customer_phone || "" })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ps-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Ship To" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: order.customer_name || "Guest" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: formatAddress() }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: order.customer_phone || "" })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "ps-items",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					align: "left",
					children: "Product"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					align: "right",
					children: "Qty"
				})] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: 12
					},
					children: [item.productImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: item.productImage,
						alt: item.productName
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.productName })]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					align: "right",
					children: item.quantity
				})] }, item.id)) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ps-note",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						width: 54,
						height: 54,
						border: "1px solid #7A2533",
						borderRadius: "50%",
						display: "grid",
						placeItems: "center",
						color: "#7A2533",
						fontSize: 28
					},
					children: "◇"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					style: {
						margin: 0,
						font: "700 14px Georgia,serif",
						color: "#7b5417",
						textTransform: "uppercase"
					},
					children: "Packing Note"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					style: {
						margin: "6px 0 0",
						fontSize: 12,
						lineHeight: 1.6
					},
					children: "Your fine jewellery has been carefully inspected, securely packed, and insured for safe delivery. Thank you for choosing Creative Muse."
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ps-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ps-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Courier Details" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Courier Partner: ", order.courier_name || order.courier || "-"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Service Type: ", order.shipping_service || order.delivery_method || "-"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Tracking: ", trackingValue || "-"] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ps-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Prepared By" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Admin" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Packed Date: ", new Date(order.packed_at || Date.now()).toLocaleDateString("en-IN")] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "ps-footer",
				children: "Handcrafted with love. Delivered with care."
			})
		]
	});
});
PackingSlip.displayName = "PackingSlip";
var ORDER_STATUS_FLOW = {
	pending: ["confirmed", "cancelled"],
	confirmed: ["processing", "cancelled"],
	processing: ["shipped", "cancelled"],
	shipped: ["delivered", "cancelled"],
	delivered: [],
	cancelled: [],
	returned: ["refunded"],
	refunded: []
};
var COURIER_OPTIONS = [
	"Delhivery",
	"Blue Dart",
	"DTDC",
	"India Post",
	"Shiprocket",
	"Ecom Express",
	"Xpressbees",
	"Other"
];
function parseAddress(addr) {
	if (!addr) return "";
	if (typeof addr === "string") return addr;
	return Object.values(addr).filter(Boolean).join(", ");
}
function formatCurrency(n) {
	return `₹${n.toLocaleString("en-IN")}`;
}
function buildTimelineEvents(order, auditLogs, paymentEvents) {
	const events = [];
	if (order.created_at) events.push({
		event: "Order created",
		description: "Order was placed by customer",
		date: order.created_at,
		icon: "system"
	});
	if (order.payment_status === "paid" || order.payment_status === "refunded") events.push({
		event: `Payment ${order.payment_status}`,
		description: `Payment status set to ${order.payment_status}`,
		date: order.updated_at,
		icon: "payment"
	});
	if (order.order_status === "confirmed") events.push({
		event: "Order confirmed",
		description: "Order was confirmed",
		date: order.updated_at,
		icon: "system"
	});
	if (order.order_status === "processing") events.push({
		event: "Processing started",
		description: "Order is being prepared",
		date: order.updated_at,
		icon: "system"
	});
	if (order.tracking_id) events.push({
		event: "Tracking added",
		description: `Courier: ${order.courier_name || order.courier || "Standard"}, ID: ${order.tracking_id}`,
		date: order.updated_at,
		icon: "shipping"
	});
	if (order.shipped_at || order.order_status === "shipped") events.push({
		event: "Shipped",
		description: `Shipped via ${order.courier_name || order.courier || "Standard"}`,
		date: order.shipped_at || order.updated_at,
		icon: "shipping"
	});
	if (order.delivered_at || order.order_status === "delivered") events.push({
		event: "Delivered",
		description: "Package delivered to customer",
		date: order.delivered_at || order.updated_at,
		icon: "success"
	});
	if (order.order_status === "cancelled") events.push({
		event: "Cancelled",
		description: order.cancellation_reason || "Cancelled by admin",
		date: order.cancelled_at || order.updated_at,
		icon: "danger"
	});
	for (const log of auditLogs) {
		if (log.action === "refund_created") events.push({
			event: "Refund created",
			description: log.new_values?.reason || "Refund processed",
			date: log.created_at,
			icon: "payment"
		});
		if (log.action === "order_archived") events.push({
			event: "Order archived",
			description: "Order was archived",
			date: log.created_at,
			icon: "system"
		});
		if (log.action === "order_duplicated") events.push({
			event: "Order duplicated",
			description: `New order: ${log.new_values?.new_order_number || ""}`,
			date: log.created_at,
			icon: "system"
		});
		if (log.action === "note_added") events.push({
			event: "Note added",
			description: "Internal note added by admin",
			date: log.created_at,
			icon: "note"
		});
		if (log.action.startsWith("order_status_")) {
			const status = log.action.replace("order_status_", "");
			if (!events.find((e) => e.event.toLowerCase().includes(status))) events.push({
				event: `Status: ${status}`,
				description: `Order status changed to ${status}`,
				date: log.created_at,
				icon: "system"
			});
		}
		if (log.action.startsWith("payment_status_")) {
			const status = log.action.replace("payment_status_", "");
			if (!events.find((e) => e.event.toLowerCase().includes(status))) events.push({
				event: `Payment: ${status}`,
				description: `Payment status changed to ${status}`,
				date: log.created_at,
				icon: "payment"
			});
		}
	}
	for (const pmt of paymentEvents) events.push({
		event: `Payment ${pmt.status}`,
		description: `Amount: ${formatCurrency(pmt.amount)} via ${pmt.payment_method || "—"}`,
		date: pmt.created_at,
		icon: "payment"
	});
	events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	return events;
}
function OrderDetailPage() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [storeSettings, setStoreSettings] = (0, import_react.useState)(null);
	const [invoiceNumber, setInvoiceNumber] = (0, import_react.useState)("");
	const [auditLogs, setAuditLogs] = (0, import_react.useState)([]);
	const [payments, setPayments] = (0, import_react.useState)([]);
	const [customerSummary, setCustomerSummary] = (0, import_react.useState)(null);
	const [timelineEvents, setTimelineEvents] = (0, import_react.useState)([]);
	const [orderNotifications, setOrderNotifications] = (0, import_react.useState)([]);
	const [statusConfirm, setStatusConfirm] = (0, import_react.useState)(null);
	const [toast, setToast] = (0, import_react.useState)(null);
	const [isUpdating, setIsUpdating] = (0, import_react.useState)(false);
	const [showActionMenu, setShowActionMenu] = (0, import_react.useState)(false);
	const [showNotificationMenu, setShowNotificationMenu] = (0, import_react.useState)(false);
	const [emailSending, setEmailSending] = (0, import_react.useState)(null);
	const [note, setNote] = (0, import_react.useState)("");
	const [showAuditLog, setShowAuditLog] = (0, import_react.useState)(false);
	const [showTrackingForm, setShowTrackingForm] = (0, import_react.useState)(false);
	const [trackingForm, setTrackingForm] = (0, import_react.useState)({
		courier_name: "",
		tracking_id: "",
		tracking_url: "",
		shipment_id: "",
		shipping_service: "",
		estimated_delivery_at: "",
		package_weight: 0,
		package_count: 1,
		notify_customer: false
	});
	const [showCancelDialog, setShowCancelDialog] = (0, import_react.useState)(false);
	const [cancelReason, setCancelReason] = (0, import_react.useState)("");
	const [showRefundDialog, setShowRefundDialog] = (0, import_react.useState)(false);
	const [refundAmount, setRefundAmount] = (0, import_react.useState)(0);
	const [refundReason, setRefundReason] = (0, import_react.useState)("");
	const [showDuplicateDialog, setShowDuplicateDialog] = (0, import_react.useState)(false);
	const [showArchiveDialog, setShowArchiveDialog] = (0, import_react.useState)(false);
	const invoiceRef = (0, import_react.useRef)(null);
	const labelRef = (0, import_react.useRef)(null);
	const packingSlipRef = (0, import_react.useRef)(null);
	const showToast = (0, import_react.useCallback)((message, type) => {
		setToast({
			message,
			type
		});
		setTimeout(() => setToast(null), 4e3);
	}, []);
	const fetchData = (0, import_react.useCallback)(async () => {
		setLoading(true);
		try {
			const { data: sessionData } = await supabase.auth.getSession();
			const accessToken = sessionData.session?.access_token || "";
			const [orderData, settings, logs, paymentData, notifications] = await Promise.all([
				ordersApi.getById(id),
				settingsApi.getAll().catch(() => []),
				ordersApi.getAuditLogsForOrder(id).catch(() => []),
				ordersApi.getPaymentsForOrder(id).catch(() => []),
				listOrderNotifications({ data: {
					orderId: id,
					limit: 25,
					accessToken
				} }).catch(() => [])
			]);
			setData(orderData);
			setAuditLogs(logs);
			setPayments(paymentData);
			setOrderNotifications(Array.isArray(notifications) ? notifications : []);
			const settingsMap = {};
			for (const s of settings) settingsMap[s.setting_key] = s.setting_value;
			setStoreSettings(settingsMap);
			if (orderData) {
				const invNum = await ordersApi.ensureInvoiceNumber(id).catch(() => "");
				setInvoiceNumber(invNum);
				if (orderData.order.customer_id) ordersApi.getCustomerSummary(orderData.order.customer_id).then(setCustomerSummary).catch(() => {});
				const events = buildTimelineEvents(orderData.order, logs, paymentData);
				setTimelineEvents(events);
			}
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}, [id]);
	(0, import_react.useEffect)(() => {
		fetchData();
	}, [fetchData]);
	data && ORDER_STATUS_FLOW[data.order.order_status];
	const isCancelled = data?.order.order_status === "cancelled";
	const isArchived = data?.order.is_archived;
	const handlePrint = (target) => {
		const printWindow = window.open("", "_blank");
		if (!printWindow) return;
		const content = target === "invoice" ? invoiceRef.current?.innerHTML : target === "packing" ? packingSlipRef.current?.innerHTML : labelRef.current?.innerHTML;
		if (!content) return;
		const styles = Array.from(document.styleSheets).map((sheet) => {
			try {
				return Array.from(sheet.cssRules || []).map((rule) => rule.cssText).join("");
			} catch {
				return "";
			}
		}).join("");
		printWindow.document.write(`
      <html><head><title>${target === "invoice" ? "Invoice" : target === "packing" ? "Packing Slip" : "Shipping Label"}</title>
      <style>${styles}</style></head>
      <body>${content}<script>window.onload=function(){window.print();}<\/script></body></html>
    `);
		printWindow.document.close();
	};
	const handleDownloadPdf = async () => {
		if (!data?.order) return;
		await generateInvoicePdf({
			order: data.order,
			items,
			invoiceNumber
		});
	};
	const handleSendNotification = async (template, resendNotificationId) => {
		if (!data?.order.customer_email) {
			showToast("Customer email is unavailable", "error");
			return;
		}
		setEmailSending(template);
		try {
			const { data: sessionData } = await supabase.auth.getSession();
			const accessToken = sessionData.session?.access_token || "";
			const result = await sendTransactionalEmail({ data: {
				template,
				orderId: id,
				source: "admin_order_detail",
				accessToken,
				resendNotificationId
			} });
			showToast(`${result.template || "Email"} ${result.status === "duplicate" ? "already sent" : "sent"}`, "success");
			await fetchData();
		} catch (err) {
			showToast(err.message || "Email failed", "error");
			await fetchData();
		} finally {
			setEmailSending(null);
			setShowNotificationMenu(false);
		}
	};
	const handleEmailInvoice = () => {
		handleSendNotification("invoice");
	};
	const handleWhatsApp = () => {
		const phone = data?.order.customer_phone;
		if (!phone) {
			showToast("Customer phone number is unavailable", "error");
			return;
		}
		const cleaned = phone.replace(/[^0-9]/g, "");
		const countryCode = cleaned.startsWith("91") ? cleaned : `91${cleaned}`;
		const message = encodeURIComponent(`Hello ${data?.order.customer_name || "Customer"},\n\nYour Creative Muse invoice for order #${data?.order.order_number} is ready.\n\nInvoice: ${invoiceNumber}\nOrder Total: ${formatCurrency(data?.order.total_amount || 0)}\nOrder Status: ${data?.order.order_status}\n\nThank you for shopping with Creative Muse.`);
		window.open(`https://wa.me/${countryCode}?text=${message}`, "_blank", "noopener,noreferrer");
		setTimelineEvents((prev) => [...prev, {
			event: "WhatsApp link opened",
			description: `WhatsApp invoice link opened for ${phone}`,
			date: (/* @__PURE__ */ new Date()).toISOString(),
			icon: "note"
		}]);
	};
	const handleStatusUpdate = async (newStatus) => {
		setIsUpdating(true);
		try {
			if (newStatus === "shipped" && (!(data?.order.tracking_id || data?.order.tracking_number) || !(data?.order.courier_name || data?.order.courier))) throw new Error("Add courier and tracking details before marking the order shipped.");
			await ordersApi.updateStatus(id, newStatus);
			await fetchData();
			setStatusConfirm(null);
			showToast(`Order status updated to ${newStatus}`, "success");
			if (newStatus === "shipped") handleSendNotification("shipped");
			else if (newStatus === "delivered") handleSendNotification("delivered");
		} catch (err) {
			showToast(err.message || "Failed to update status", "error");
		} finally {
			setIsUpdating(false);
		}
	};
	const handlePaymentUpdate = async (newStatus) => {
		setIsUpdating(true);
		try {
			await ordersApi.updatePaymentStatus(id, newStatus);
			await fetchData();
			setStatusConfirm(null);
			showToast(`Payment status updated to ${newStatus}`, "success");
			if (newStatus === "paid") handleSendNotification("payment_confirmation");
			else if (newStatus === "failed") handleSendNotification("payment_failed");
		} catch (err) {
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
			if (!trackingForm.courier_name.trim()) throw new Error("Courier is required.");
			if (!trackingForm.tracking_id.trim()) throw new Error("Tracking number is required.");
			if (trackingForm.tracking_url && !/^https?:\/\//i.test(trackingForm.tracking_url)) throw new Error("Tracking URL must start with http:// or https://.");
			if (trackingForm.package_count <= 0) throw new Error("Package count must be positive.");
			if (trackingForm.package_weight < 0) throw new Error("Package weight cannot be negative.");
			const shipmentId = trackingForm.shipment_id.trim() || `SHP-${data?.order.order_number || id.slice(0, 8)}`;
			await ordersApi.updateTracking(id, {
				courier_name: trackingForm.courier_name,
				tracking_id: trackingForm.tracking_id,
				tracking_number: trackingForm.tracking_id,
				tracking_url: trackingForm.tracking_url,
				shipment_id: shipmentId,
				shipping_service: trackingForm.shipping_service,
				estimated_delivery_at: trackingForm.estimated_delivery_at,
				package_weight: trackingForm.package_weight,
				package_count: trackingForm.package_count
			});
			await fetchData();
			setShowTrackingForm(false);
			showToast("Tracking information saved", "success");
			if (trackingForm.notify_customer) await handleSendNotification("shipped");
		} catch (err) {
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
			handleSendNotification("cancellation");
		} catch (err) {
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
			handleSendNotification("refund");
		} catch (err) {
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
				navigate({
					to: "/admin/orders/$id",
					params: { id: newId }
				});
			}
		} catch (err) {
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
		} catch (err) {
			showToast(err.message || "Failed to update order", "error");
		} finally {
			setIsUpdating(false);
		}
	};
	const parseNotes = (notes) => {
		if (!notes) return [];
		return notes.split("\n").filter(Boolean).map((line) => {
			const match = line.match(/^\[([^\]]+)\]\s*([^:]+):\s*(.+)$/);
			if (match) return {
				timestamp: match[1],
				user: match[2],
				text: match[3]
			};
			return {
				timestamp: "",
				user: "System",
				text: line
			};
		});
	};
	const handleTrackShipment = () => {
		const url = data?.order.tracking_url;
		if (url) window.open(url, "_blank", "noopener,noreferrer");
		else if (data?.order.tracking_id) showToast("No tracking URL configured. Please add one in tracking settings.", "info");
		else showToast("No tracking information available", "error");
	};
	const openTrackingForm = () => {
		setTrackingForm({
			courier_name: data?.order.courier_name || data?.order.courier || "",
			tracking_id: data?.order.tracking_id || "",
			tracking_url: data?.order.tracking_url || "",
			shipment_id: data?.order.shipment_id || "",
			shipping_service: data?.order.shipping_service || "",
			estimated_delivery_at: data?.order.estimated_delivery_at?.split("T")[0] || "",
			package_weight: data?.order.package_weight || 0,
			package_count: data?.order.package_count || 1,
			notify_customer: false
		});
		setShowTrackingForm(true);
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoading, {}) });
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-center py-20 text-gray-500",
		children: "Order not found"
	}) });
	const { order, items } = data;
	const subtotal = items.reduce((s, i) => s + (i.lineTotal || 0), 0);
	const total = order.total_amount || subtotal;
	const totalPaid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
	const refundedPayments = payments.filter((p) => p.status === "refunded");
	const totalRefunded = refundedPayments.reduce((s, p) => s + Math.abs(Number(p.amount)), 0);
	const canSendShipping = !!(order.courier_name || order.courier) && !!(order.tracking_number || order.tracking_id);
	const canSendDelivered = order.order_status === "delivered";
	const canSendCancellation = order.order_status === "cancelled";
	const canSendRefund = refundedPayments.length > 0;
	const notificationActions = [
		{
			template: "order_confirmation",
			label: "Resend Order Confirmation"
		},
		{
			template: "invoice",
			label: "Resend Invoice"
		},
		{
			template: "payment_confirmation",
			label: "Send Payment Confirmation",
			disabled: order.payment_status !== "paid",
			reason: "Payment is not marked paid"
		},
		{
			template: "shipped",
			label: "Send Shipping Update",
			disabled: !canSendShipping,
			reason: "Courier and tracking required"
		},
		{
			template: "delivered",
			label: "Send Delivered Confirmation",
			disabled: !canSendDelivered,
			reason: "Order is not delivered"
		},
		{
			template: "cancellation",
			label: "Send Cancellation Email",
			disabled: !canSendCancellation,
			reason: "Order is not cancelled"
		},
		{
			template: "refund",
			label: "Send Refund Confirmation",
			disabled: !canSendRefund,
			reason: "No refund record found"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toast, {
			message: toast?.message || "",
			type: toast?.type || "success",
			visible: !!toast,
			onClose: () => setToast(null)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			open: !!statusConfirm,
			onClose: () => setStatusConfirm(null),
			onConfirm: () => {
				if (!statusConfirm) return;
				if (statusConfirm.type === "payment") handlePaymentUpdate(statusConfirm.value);
				else handleStatusUpdate(statusConfirm.value);
			},
			title: `Change status to "${statusConfirm?.value?.replace(/_/g, " ")}"?`,
			message: "This will update the order status",
			confirmLabel: "Update"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			open: showCancelDialog,
			onClose: () => setShowCancelDialog(false),
			onConfirm: handleCancelOrder,
			title: "Cancel Order",
			variant: "danger",
			message: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-gray-600",
					children: "Are you sure you want to cancel this order?"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: cancelReason,
					onChange: (e) => setCancelReason(e.target.value),
					className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select a reason..."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Customer requested cancellation",
							children: "Customer requested cancellation"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Payment failed",
							children: "Payment failed"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Out of stock",
							children: "Out of stock"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Fraud risk",
							children: "Fraud risk"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Duplicate order",
							children: "Duplicate order"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Address problem",
							children: "Address problem"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Other",
							children: "Other"
						})
					]
				})]
			}),
			confirmLabel: "Cancel Order"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			open: showRefundDialog,
			onClose: () => setShowRefundDialog(false),
			onConfirm: handleRefund,
			title: "Process Refund",
			variant: "primary",
			message: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-gray-600",
						children: "Enter refund details below."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs font-semibold text-gray-600 mb-1",
						children: [
							"Amount (max: ",
							formatCurrency(totalPaid),
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						value: refundAmount,
						onChange: (e) => setRefundAmount(Number(e.target.value)),
						max: totalPaid,
						className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold text-gray-600 mb-1",
						children: "Reason"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: refundReason,
						onChange: (e) => setRefundReason(e.target.value),
						placeholder: "Reason for refund...",
						className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
					})] })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			open: showDuplicateDialog,
			onClose: () => setShowDuplicateDialog(false),
			onConfirm: handleDuplicate,
			title: "Duplicate Order",
			variant: "primary",
			message: "This will create a new draft order with the same items and customer details. Continue?"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			open: showArchiveDialog,
			onClose: () => setShowArchiveDialog(false),
			onConfirm: handleArchive,
			title: isArchived ? "Restore Order" : "Archive Order",
			message: isArchived ? "Restore this order to the active orders list?" : "Archive this order? It will be hidden from the default orders list."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 flex items-center justify-between",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/orders",
				className: "inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#7A2533]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Orders"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 rounded-xl border border-gray-200 bg-white p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-xl font-bold text-[#1a1a2e]",
							children: order.order_number || `Order #${id.slice(0, 8)}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
							status: order.order_status || "pending",
							size: "md"
						}),
						order.payment_status && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
							status: order.payment_status,
							size: "md"
						}),
						isArchived && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-yellow-700",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "h-3 w-3" }), " Archived"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => handlePrint("invoice"),
							className: "inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-3.5 w-3.5" }), " Print"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleDownloadPdf,
							className: "inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " PDF"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleEmailInvoice,
							className: "inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5" }), " Email"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setShowNotificationMenu(!showNotificationMenu),
								className: "inline-flex items-center gap-1.5 rounded-lg border border-[#7A2533] px-3 py-1.5 text-xs font-semibold text-[#8a681f] hover:bg-[#fdf8f3]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5" }), " Notifications"]
							}), showNotificationMenu && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fixed inset-0 z-40",
								onClick: () => setShowNotificationMenu(false)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute right-0 top-full z-50 mt-1 w-64 rounded-xl border border-gray-200 bg-white py-1 shadow-lg",
								children: [
									notificationActions.map((action) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => !action.disabled && handleSendNotification(action.template),
										disabled: action.disabled || !!emailSending,
										title: action.disabled ? action.reason : void 0,
										className: `flex w-full items-center justify-between gap-2 px-4 py-2 text-left text-xs ${action.disabled ? "cursor-not-allowed text-gray-300" : "text-gray-700 hover:bg-gray-50"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: action.label }), emailSending === action.template ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : null]
									}, action.template)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "my-1 border-gray-100" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: handleWhatsApp,
										disabled: !order.customer_phone,
										className: `flex w-full items-center gap-2 px-4 py-2 text-xs ${order.customer_phone ? "text-gray-700 hover:bg-gray-50" : "cursor-not-allowed text-gray-300"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-3.5 w-3.5" }), " Send WhatsApp Update"]
									})
								]
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleWhatsApp,
							className: "inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-3.5 w-3.5" }), " WhatsApp"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setShowActionMenu(!showActionMenu),
								className: "inline-flex items-center gap-1.5 rounded-lg bg-[#1a1a2e] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2d1b4e]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "h-3.5 w-3.5" }), " Actions"]
							}), showActionMenu && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fixed inset-0 z-40",
								onClick: () => setShowActionMenu(false)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute right-0 top-full z-50 mt-1 w-52 rounded-xl border border-gray-200 bg-white py-1 shadow-lg",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											handlePrint("label");
											setShowActionMenu(false);
										},
										className: "flex w-full items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-3.5 w-3.5" }), " Print Shipping Label"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											handlePrint("packing");
											setShowActionMenu(false);
										},
										className: "flex w-full items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-3.5 w-3.5" }), " Print Packing Slip"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											handlePrint("label");
											setShowActionMenu(false);
										},
										className: "flex w-full items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " Download Shipping Label"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "my-1 border-gray-100" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											openTrackingForm();
											setShowActionMenu(false);
										},
										className: "flex w-full items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-3.5 w-3.5" }), " Add Tracking"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											setShowDuplicateDialog(true);
											setShowActionMenu(false);
										},
										className: "flex w-full items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), " Duplicate Order"]
									}),
									!isCancelled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											setShowRefundDialog(true);
											setShowActionMenu(false);
										},
										className: "flex w-full items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), " Refund Payment"]
									}),
									!isCancelled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											setShowCancelDialog(true);
											setShowActionMenu(false);
										},
										className: "flex w-full items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "h-3.5 w-3.5" }), " Cancel Order"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "my-1 border-gray-100" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											setShowArchiveDialog(true);
											setShowActionMenu(false);
										},
										className: "flex w-full items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50",
										children: [isArchived ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "h-3.5 w-3.5" }), isArchived ? "Restore Order" : "Archive Order"]
									})
								]
							})] })]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-gray-400",
				children: [
					"Placed on ",
					new Date(order.created_at).toLocaleString(),
					" •",
					" ",
					invoiceNumber ? `Invoice: ${invoiceNumber}` : ""
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-2 space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-gray-200 bg-white",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border-b border-gray-100 px-5 py-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "flex items-center gap-2 text-sm font-bold text-[#1a1a2e]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" }),
										" Order Items (",
										items.length,
										")"
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "divide-y divide-gray-100",
								children: items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4 px-5 py-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50",
											children: item.productImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: item.productImage,
												alt: item.productName || "Order item",
												className: "h-full w-full object-contain p-0.5",
												loading: "lazy"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-full items-center justify-center text-gray-300",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-6 w-6" })
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 min-w-0",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm font-medium text-[#1a1a2e]",
													children: item.productName || "Unavailable product"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-gray-400",
													children: [
														"Qty: ",
														item.quantity,
														item.unitPrice > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
															" · ₹",
															item.unitPrice.toLocaleString("en-IN"),
															" ea."
														] }) : null
													]
												}),
												item.selectedVariant && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[11px] text-gray-400 mt-0.5",
													children: [item.selectedVariant, item.selectedSize ? `, ${item.selectedSize}` : ""]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-sm font-medium text-right",
											children: ["₹", (item.lineTotal || 0).toLocaleString("en-IN")]
										})
									]
								}, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-gray-100 px-5 py-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-gray-500",
											children: "Subtotal"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: formatCurrency(subtotal)
										})]
									}),
									order.discount_amount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-sm mt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-gray-500",
											children: "Discount"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-medium text-green-600",
											children: ["-", formatCurrency(order.discount_amount)]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-sm mt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-gray-500",
											children: "Shipping"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: order.shipping_amount > 0 ? formatCurrency(order.shipping_amount) : "Free"
										})]
									}),
									order.gift_packaging_enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-sm mt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-gray-500",
											children: order.gift_packaging_name || "Gift Packaging"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: formatCurrency(order.gift_packaging_price || 0)
										})]
									}), order.gift_message && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 rounded-lg bg-amber-50 p-2 text-xs text-gray-600 italic",
										children: [
											"\"",
											order.gift_message,
											"\""
										]
									})] }),
									null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-base font-bold mt-2 pt-2 border-t border-gray-100",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatCurrency(total) })]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-gray-200 bg-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-gray-100 px-5 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "flex items-center gap-2 text-sm font-bold text-[#1a1a2e]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4" }),
									" Email History (",
									orderNotifications.length,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: fetchData,
								className: "rounded-lg border border-gray-200 px-2 py-1 text-[11px] font-semibold text-gray-500 hover:bg-gray-50",
								children: "Refresh"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-gray-100 bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-2",
											children: "Email Type"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-2",
											children: "Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-2",
											children: "Recipient"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-2",
											children: "Sent On"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-2",
											children: "Sender"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-2",
											children: "Actions"
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-gray-100",
									children: orderNotifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 6,
										className: "px-4 py-6 text-center text-gray-400",
										children: "No email notifications logged yet"
									}) }) : orderNotifications.map((notification) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-4 py-2 font-medium text-[#1a1a2e]",
											children: [notification.metadata?.template_label || notification.notification_type?.replace(/_/g, " "), notification.is_test && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "ml-2 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-700",
												children: "Test"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${notification.status === "sent" ? "bg-green-100 text-green-700" : notification.status === "failed" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"}`,
												children: notification.status
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-4 py-2 text-gray-500",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: notification.actual_recipient }), notification.is_test && notification.intended_recipient && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[10px] text-gray-400",
												children: ["Intended: ", notification.intended_recipient]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-gray-500",
											children: notification.sent_at ? new Date(notification.sent_at).toLocaleString() : "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-gray-500",
											children: notification.source === "system" ? "System" : "Admin"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => handleSendNotification(notification.notification_type, notification.id),
													className: "rounded border border-gray-200 px-2 py-1 text-[10px] font-semibold text-gray-600 hover:bg-gray-50",
													children: notification.status === "failed" ? "Retry" : "Resend"
												}), notification.error_summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													title: notification.error_summary,
													className: "rounded border border-red-200 px-2 py-1 text-[10px] font-semibold text-red-600",
													children: "Safe Error"
												})]
											})
										})
									] }, notification.id))
								})]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-gray-200 bg-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-gray-100 px-5 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "flex items-center gap-2 text-sm font-bold text-[#1a1a2e]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4" }), " Fulfillment & Tracking"]
							}), order.delivery_method && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `inline-block mt-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${order.delivery_method === "express" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`,
								children: order.delivery_method === "express" ? "Express" : "Standard"
							})]
						}), showTrackingForm ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-gray-600 mb-1",
											children: "Shipment ID"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: trackingForm.shipment_id,
											onChange: (e) => setTrackingForm((f) => ({
												...f,
												shipment_id: e.target.value
											})),
											placeholder: `SHP-${order.order_number}`,
											className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-gray-600 mb-1",
											children: "Courier"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: trackingForm.courier_name,
											onChange: (e) => setTrackingForm((f) => ({
												...f,
												courier_name: e.target.value
											})),
											className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: "Select courier"
											}), COURIER_OPTIONS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: c,
												children: c
											}, c))]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-gray-600 mb-1",
											children: "Service"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: trackingForm.shipping_service,
											onChange: (e) => setTrackingForm((f) => ({
												...f,
												shipping_service: e.target.value
											})),
											placeholder: "Standard / Express",
											className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-gray-600 mb-1",
											children: "Tracking ID"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: trackingForm.tracking_id,
											onChange: (e) => setTrackingForm((f) => ({
												...f,
												tracking_id: e.target.value
											})),
											className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-gray-600 mb-1",
											children: "Tracking URL"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "url",
											value: trackingForm.tracking_url,
											onChange: (e) => setTrackingForm((f) => ({
												...f,
												tracking_url: e.target.value
											})),
											placeholder: "https://...",
											className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-gray-600 mb-1",
											children: "Est. Delivery"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "date",
											value: trackingForm.estimated_delivery_at,
											onChange: (e) => setTrackingForm((f) => ({
												...f,
												estimated_delivery_at: e.target.value
											})),
											className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-gray-600 mb-1",
											children: "Weight (kg)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											step: "0.01",
											value: trackingForm.package_weight,
											onChange: (e) => setTrackingForm((f) => ({
												...f,
												package_weight: Number(e.target.value)
											})),
											className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-gray-600 mb-1",
											children: "Package Count"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											min: 1,
											value: trackingForm.package_count,
											onChange: (e) => setTrackingForm((f) => ({
												...f,
												package_count: Number(e.target.value)
											})),
											className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-xs font-medium text-gray-600",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: trackingForm.notify_customer,
										onChange: (e) => setTrackingForm((f) => ({
											...f,
											notify_customer: e.target.checked
										})),
										className: "accent-[#7A2533]"
									}), "Notify customer with shipped email after saving"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: handleSaveTracking,
										disabled: isUpdating,
										className: "rounded-lg bg-[#1a1a2e] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2d1b4e] disabled:opacity-50",
										children: isUpdating ? "Saving..." : "Save Tracking"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setShowTrackingForm(false),
										className: "rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50",
										children: "Cancel"
									})]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gray-500",
										children: "Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: isCancelled ? "cancelled" : order.order_status === "delivered" ? "fulfilled" : order.order_status || "pending" })]
								}),
								order.courier_name || order.courier ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gray-500",
										children: "Courier"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: order.courier_name || order.courier
									})]
								}) : null,
								order.tracking_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gray-500",
										children: "Tracking ID"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: order.tracking_id
									})]
								}),
								order.shipping_service && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gray-500",
										children: "Service"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: order.shipping_service
									})]
								}),
								order.delivery_estimate && !order.estimated_delivery_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gray-500",
										children: "Est. Delivery"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: order.delivery_estimate
									})]
								}),
								order.estimated_delivery_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gray-500",
										children: "Est. Delivery"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: new Date(order.estimated_delivery_at).toLocaleDateString("en-IN")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2 pt-2",
									children: !isCancelled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: openTrackingForm,
											className: "inline-flex items-center gap-1 rounded-lg bg-[#1a1a2e] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2d1b4e]",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-3.5 w-3.5" }),
												" ",
												order.tracking_id ? "Edit Tracking" : "Add Tracking"
											]
										}),
										order.tracking_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: handleTrackShipment,
											className: "inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" }), " Track Shipment"]
										}),
										order.order_status !== "delivered" && order.order_status !== "shipped" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => handleStatusUpdate("shipped"),
											className: "inline-flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-700",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-3.5 w-3.5" }), " Mark Shipped"]
										}),
										order.order_status === "shipped" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => handleStatusUpdate("delivered"),
											className: "inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Mark Delivered"]
										})
									] })
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-gray-200 bg-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-b border-gray-100 px-5 py-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "flex items-center gap-2 text-sm font-bold text-[#1a1a2e]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }),
									" Timeline (",
									timelineEvents.length,
									")"
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-5 py-4 max-h-[400px] overflow-y-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-4",
								children: timelineEvents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-gray-400 text-center py-4",
									children: "No timeline events"
								}) : timelineEvents.map((event, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `flex h-6 w-6 items-center justify-center rounded-full ${event.icon === "danger" ? "bg-red-100 text-red-600" : event.icon === "success" ? "bg-green-100 text-green-600" : event.icon === "payment" ? "bg-blue-100 text-blue-600" : event.icon === "shipping" ? "bg-purple-100 text-purple-600" : event.icon === "note" ? "bg-amber-100 text-amber-600" : "bg-[#1a1a2e] text-white"}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2 rounded-full bg-current" })
										}), i < timelineEvents.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-1 w-px flex-1 bg-gray-200" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pb-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-medium text-[#1a1a2e]",
												children: event.event
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-gray-500",
												children: event.description
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-gray-400",
												children: new Date(event.date).toLocaleString()
											})
										]
									})]
								}, i))
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-gray-200 bg-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-b border-gray-100 px-5 py-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "flex items-center gap-2 text-sm font-bold text-[#1a1a2e]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4" }), " Internal Notes"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-5 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-3 mb-4 max-h-[250px] overflow-y-auto",
								children: parseNotes(order.notes).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-gray-400 text-center py-2",
									children: "No internal notes"
								}) : parseNotes(order.notes).map((note, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-lg bg-gray-50 p-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-start justify-between gap-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs font-medium text-[#1a1a2e]",
													children: note.user
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-gray-600 mt-0.5",
													children: note.text
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] text-gray-400 mt-1",
													children: note.timestamp ? new Date(note.timestamp).toLocaleString() : ""
												})
											]
										})
									})
								}, i))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: note,
									onChange: (e) => setNote(e.target.value),
									placeholder: "Add an internal note... (saves with your admin email)",
									className: "flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]",
									onKeyDown: (e) => e.key === "Enter" && handleAddNote()
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleAddNote,
									disabled: isUpdating || !note.trim(),
									className: "rounded-lg bg-[#1a1a2e] px-3 py-2 text-white hover:bg-[#2d1b4e] disabled:opacity-50",
									children: isUpdating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-gray-200 bg-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-b border-gray-100 px-5 py-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setShowAuditLog(!showAuditLog),
								className: "flex items-center gap-2 text-sm font-bold text-[#1a1a2e] hover:text-[#7A2533]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }),
									" Audit Log (",
									auditLogs.length,
									")",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-3.5 w-3.5 transition-transform ${showAuditLog ? "rotate-180" : ""}` })
								]
							})
						}), showAuditLog && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-5 py-4 max-h-[300px] overflow-y-auto",
							children: auditLogs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-gray-400 text-center py-4",
								children: "No audit log entries"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: auditLogs.map((log, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-start gap-3 rounded-lg bg-gray-50 p-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-medium text-[#1a1a2e]",
												children: log.action?.replace(/_/g, " ")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-gray-400",
												children: new Date(log.created_at).toLocaleString()
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] text-gray-500 mt-0.5",
											children: [log.profiles?.full_name || log.profiles?.email || "System", log.new_values && Object.keys(log.new_values).length > 0 && ` • ${JSON.stringify(log.new_values)}`]
										})]
									})
								}, i))
							})
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-gray-200 bg-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-b border-gray-100 px-5 py-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "flex items-center gap-2 text-sm font-bold text-[#1a1a2e]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4" }), " Payment"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gray-500",
									children: "Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: order.payment_status || "pending" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gray-500",
									children: "Method"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: order.payment_method || "—"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gray-500",
									children: "Total"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold",
									children: formatCurrency(total)
								})]
							}),
							totalPaid > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gray-500",
									children: "Paid"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-green-600",
									children: formatCurrency(totalPaid)
								})]
							}),
							totalRefunded > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gray-500",
									children: "Refunded"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-red-600",
									children: formatCurrency(totalRefunded)
								})]
							}),
							payments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-gray-100 pt-2 mt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-semibold text-gray-500 uppercase mb-1",
									children: "Transactions"
								}), payments.map((pmt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-[11px] py-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-gray-600",
										children: [
											pmt.status,
											" ",
											pmt.payment_method ? `(${pmt.payment_method})` : ""
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: formatCurrency(Math.abs(Number(pmt.amount)))
									})]
								}, i))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-2 pt-2",
								children: [!isCancelled && order.payment_status !== "paid" && order.payment_status !== "refunded" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setStatusConfirm({
										type: "payment",
										value: "paid"
									}),
									className: "w-full rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700",
									children: "Mark Paid"
								}), !isCancelled && order.order_status !== "cancelled" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setShowCancelDialog(true),
									className: "w-full rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50",
									children: "Cancel Order"
								})]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-gray-200 bg-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-b border-gray-100 px-5 py-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "flex items-center gap-2 text-sm font-bold text-[#1a1a2e]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" }), " Customer"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-[#1a1a2e]",
								children: order.customer_name || "Guest"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-gray-500",
								children: order.customer_email || "—"
							}),
							order.customer_phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-gray-500",
								children: order.customer_phone
							}),
							customerSummary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-gray-100 pt-3 mt-3 space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] font-semibold text-gray-500 uppercase tracking-wider",
										children: "Order History"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-2 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-gray-500",
													children: "Total Orders:"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium",
													children: customerSummary.totalOrders
												})
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-gray-500",
													children: "Completed:"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium text-green-600",
													children: customerSummary.totalCompleted
												})
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-gray-500",
													children: "Total Spent:"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium",
													children: formatCurrency(customerSummary.totalSpent)
												})
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-gray-500",
													children: "Refunded:"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium text-red-500",
													children: formatCurrency(customerSummary.totalRefunded)
												})
											] })
										]
									}),
									customerSummary.lastOrderDate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] text-gray-400",
										children: [
											"Last order:",
											" ",
											new Date(customerSummary.lastOrderDate).toLocaleDateString("en-IN")
										]
									}),
									customerSummary.customerSince && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] text-gray-400",
										children: [
											"Customer since:",
											" ",
											new Date(customerSummary.customerSince).toLocaleDateString("en-IN")
										]
									})
								]
							}),
							(order.shipping_address || order.delivery_address) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-gray-100 pt-3 mt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-semibold text-gray-500 uppercase tracking-wider",
									children: "Shipping Address"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 text-sm text-gray-600",
									children: [
										order.delivery_state_code && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-x-4 gap-y-1 text-xs mb-2",
											children: [
												order.delivery_pincode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-gray-400",
														children: "PIN:"
													}),
													" ",
													order.delivery_pincode
												] }),
												order.delivery_city && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-gray-400",
														children: "City:"
													}),
													" ",
													order.delivery_city
												] }),
												order.delivery_state_code && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-gray-400",
														children: "State:"
													}),
													" ",
													order.delivery_state_code
												] }),
												order.delivery_district && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-gray-400",
														children: "District:"
													}),
													" ",
													order.delivery_district
												] }),
												order.delivery_locality && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "col-span-2",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-gray-400",
															children: "Locality:"
														}),
														" ",
														order.delivery_locality
													]
												})
											]
										}),
										order.delivery_address && typeof order.delivery_address === "object" && !Array.isArray(order.delivery_address) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "whitespace-pre-line",
											children: [
												order.delivery_address.addressLine1,
												order.delivery_address.addressLine2,
												order.delivery_address.landmark,
												`${order.delivery_address.city || ""}${order.delivery_address.state ? ", " + order.delivery_address.state : ""}${order.delivery_address.postalCode ? " - " + order.delivery_address.postalCode : ""}`
											].filter(Boolean).join("\n")
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "whitespace-pre-line",
											children: parseAddress(order.shipping_address || order.delivery_address)
										}),
										order.delivery_method && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-gray-400 mt-1",
											children: [
												"Method:",
												" ",
												order.delivery_method === "express" ? "Express Delivery" : "Standard Delivery"
											]
										}),
										order.delivery_estimate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-gray-400",
											children: ["Est. delivery: ", order.delivery_estimate]
										})
									]
								})]
							})
						]
					})]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InvoiceTemplate, {
				ref: invoiceRef,
				order,
				items,
				invoiceNumber,
				storeSettings
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShippingLabel, {
				ref: labelRef,
				order,
				storeSettings
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackingSlip, {
				ref: packingSlipRef,
				order,
				items
			})
		})
	] });
}
//#endregion
export { OrderDetailPage as component };

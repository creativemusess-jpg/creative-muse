//#region node_modules/.nitro/vite/services/ssr/assets/order-items-1dSWUIeN.js
function normalizeOrderItem(raw) {
	const variant = raw.variant_info ? typeof raw.variant_info === "string" ? JSON.parse(raw.variant_info) : raw.variant_info : null;
	return {
		id: raw.id,
		orderId: raw.order_id,
		productId: raw.product_id || null,
		productName: raw.product_name || "",
		productImage: raw.product_image || null,
		quantity: raw.quantity || 0,
		unitPrice: raw.unit_price || 0,
		lineTotal: raw.total_price || 0,
		selectedSize: variant?.size || null,
		selectedVariant: variant?.variant || null
	};
}
function normalizeOrderItems(raws) {
	return (raws || []).map(normalizeOrderItem);
}
//#endregion
export { normalizeOrderItems as t };

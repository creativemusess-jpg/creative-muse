//#region node_modules/.nitro/vite/services/ssr/assets/product-link-CZ0ghSx1.js
function productLink(product) {
	if (!product?.id) return void 0;
	return {
		to: "/product/$productId",
		params: { productId: product.id }
	};
}
//#endregion
export { productLink as t };

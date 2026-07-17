export function productLink(product: { id: string }): { to: "/product/$productId"; params: { productId: string } } | undefined {
  if (!product?.id) return undefined;
  return { to: "/product/$productId" as const, params: { productId: product.id } };
}

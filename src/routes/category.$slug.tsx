import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { categoriesApi } from "@/lib/api/categories";
import { productsApi } from "@/lib/api/products";
import { productFromDb } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { ChevronRight, Home } from "lucide-react";
import catRings from "@/assets/cat-rings.png";
import catNecklaces from "@/assets/cat-necklaces.png";
import catEarrings from "@/assets/cat-earrings.png";
import catBracelets from "@/assets/cat-bracelets.png";
import catMangalsutra from "@/assets/cat-mangalsutra.png";
import catPendants from "@/assets/cat-pendants.png";
import catBangles from "@/assets/cat-bangles.png";
import catWedding from "@/assets/cat-wedding.png";

const CATEGORY_IMAGES: Record<string, string> = {
  Rings: catRings,
  Necklaces: catNecklaces,
  Earrings: catEarrings,
  Bracelets: catBracelets,
  Mangalsutra: catMangalsutra,
  Pendants: catPendants,
  Bangles: catBangles,
  "Wedding Sets": catWedding,
};

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const [category, setCategory] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const cat = await categoriesApi.getBySlug(slug);
        if (cancelled) return;
        setCategory(cat);
        if (cat) {
          const result = await productsApi.getPublishedByCategorySlug(slug);
          if (cancelled) return;
          setProducts(result.map(productFromDb));
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf8f3] pt-32 pb-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c9a96e] border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-[#fdf8f3] pt-32 pb-20">
        <div className="mx-auto max-w-[1280px] px-6 text-center">
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Category not found</h1>
          <p className="mt-4 text-gray-500">The category you're looking for doesn't exist.</p>
          <Link to="/shop" className="btn-primary mt-6 inline-flex">Browse Products</Link>
        </div>
      </div>
    );
  }

  const catImage = category.imageUrl || CATEGORY_IMAGES[category.name] || null;

  return (
    <div className="min-h-screen bg-[#fdf8f3] pt-24 pb-20">
      <div className="mx-auto max-w-[1280px] px-6">
        <nav className="flex items-center gap-2 py-4 text-xs text-gray-400">
          <Link to="/" className="hover:text-[#c9a96e]"><Home className="h-3.5 w-3.5" /></Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/shop" className="hover:text-[#c9a96e]">Shop</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#1a1a2e]">{category.name}</span>
        </nav>

        <div className="mb-10 flex flex-col items-center text-center">
          {catImage && (
            <div className="mb-6 h-28 w-28 overflow-hidden rounded-2xl bg-gradient-to-br from-[#fdf8f3] to-[#f0e4cd] shadow-sm">
              <img src={catImage} alt={category.name} className="h-full w-full object-contain p-2" />
            </div>
          )}
          <h1 className="text-3xl font-semibold text-[#1a1a2e]">{category.name}</h1>
          {category.description && (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-500">{category.description}</p>
          )}
          <p className="mt-2 text-xs tracking-wider text-[#8a6a2a] uppercase">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg className="mb-4 h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            <p className="text-lg font-medium text-gray-400">No products have been added to {category.name} yet.</p>
            <Link to="/shop" className="mt-6 rounded-lg bg-[#1a1a2e] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#2d1b4e]">Browse All Products</Link>
          </div>
        )}
      </div>
    </div>
  );
}

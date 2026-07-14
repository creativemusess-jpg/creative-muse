import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { Search, Package, ShoppingCart, Users, Tag, Layers, X } from "lucide-react";
import { productsApi } from "@/lib/api/products";
import { ordersApi } from "@/lib/api/orders";
import { customersApi } from "@/lib/api/customers";

interface SearchResult {
  type: "product" | "order" | "customer";
  label: string;
  subtitle: string;
  href: string;
}

export function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    const items: SearchResult[] = [];
    try {
      const [pRes, oRes, cRes] = await Promise.all([
        productsApi.list({ search: q, per_page: 5 }),
        ordersApi.list({ search: q, per_page: 5 }),
        customersApi.list({ search: q, per_page: 5 }),
      ]);
      pRes.data.forEach((p) => items.push({
        type: "product", label: p.name, subtitle: `₹${p.current_price?.toLocaleString("en-IN") ?? "—"}`,
        href: `/admin/products/${p.id}`,
      }));
      oRes.data.forEach((o) => items.push({
        type: "order", label: o.order_number ?? `Order ${o.id.slice(0, 8)}`, subtitle: o.status ?? "—",
        href: `/admin/orders/${o.id}`,
      }));
      cRes.data.forEach((c) => items.push({
        type: "customer", label: c.full_name || c.email || "—", subtitle: c.email || "",
        href: `/admin/customers/${c.id}`,
      }));
    } catch {}
    setResults(items);
    setSelectedIdx(-1);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx((i) => Math.min(i + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && selectedIdx >= 0) {
      window.location.href = results[selectedIdx].href;
      onClose();
    }
    if (e.key === "Escape") onClose();
  };

  if (!open) return null;

  const icon = (type: string) => {
    switch (type) {
      case "product": return <Package className="h-4 w-4 text-gray-400" />;
      case "order": return <ShoppingCart className="h-4 w-4 text-gray-400" />;
      case "customer": return <Users className="h-4 w-4 text-gray-400" />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/30 pt-24" onClick={onClose}>
      <div className="mx-4 w-full max-w-xl rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center border-b border-gray-200 px-4">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products, orders, customers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border-0 px-3 py-4 text-sm outline-none"
          />
          {loading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#c9a96e] border-t-transparent" />}
          <button onClick={onClose} className="ml-2 rounded-lg p-1 hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>
        {results.length > 0 && (
          <div className="max-h-80 overflow-y-auto p-2">
            {results.map((r, i) => (
              <Link
                key={`${r.type}-${r.href}`}
                to={r.href as any}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${i === selectedIdx ? "bg-gray-100" : "hover:bg-gray-50"}`}
              >
                {icon(r.type)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#1a1a2e] truncate">{r.label}</p>
                  <p className="text-xs text-gray-400">{r.subtitle}</p>
                </div>
                <span className="text-[10px] uppercase text-gray-400">{r.type}</span>
              </Link>
            ))}
          </div>
        )}
        {query.length >= 2 && !loading && results.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-400">No results found</div>
        )}
      </div>
    </div>
  );
}

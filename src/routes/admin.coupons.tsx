import { useState, useEffect, useMemo, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader, AdminLoading, AdminEmpty } from "@/components/admin/AdminLayout";
import { couponsApi } from "@/lib/api/coupons";
import { categoriesApi } from "@/lib/api/categories";
import { productsApi } from "@/lib/api/products";
import { Plus, Edit3, Trash2, X, Check, Search, ChevronDown } from "lucide-react";

import { requireAdmin } from "@/lib/auth-guard";

export const Route = createFileRoute("/admin/coupons")({
  beforeLoad: requireAdmin,
  component: AdminCoupons,
});

function AdminCoupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: "",
    coupon_scope: "entire_store",
    discount_type: "percentage",
    discount_value: 0,
    min_order_value: 0,
    max_discount: 0,
    usage_limit: 0,
    per_user_usage_limit: 1,
    first_order_only: false,
    is_active: true,
    start_date: "",
    customer_group: "",
    guest_allowed: true,
    logged_in_only: false,
    min_items: 0,
    max_items: 0,
  });
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set());
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await couponsApi.list();
      setCoupons(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const loadProducts = async () => {
    if (allProducts.length > 0) return;
    setProductsLoading(true);
    try {
      const { data } = await productsApi.list({}, 1, 1000);
      setAllProducts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setProductsLoading(false);
    }
  };

  const loadCategories = async () => {
    if (allCategories.length > 0) return;
    setCategoriesLoading(true);
    try {
      const data = await categoriesApi.list();
      setAllCategories(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    if (form.coupon_scope === "selected_products") loadProducts();
    if (form.coupon_scope === "selected_categories") loadCategories();
  }, [form.coupon_scope]);

  const resetForm = () => {
    setForm({
      code: "",
      coupon_scope: "entire_store",
      discount_type: "percentage",
      discount_value: 0,
      min_order_value: 0,
      max_discount: 0,
      usage_limit: 0,
      per_user_usage_limit: 1,
      first_order_only: false,
      is_active: true,
      start_date: "",
      customer_group: "",
      guest_allowed: true,
      logged_in_only: false,
      min_items: 0,
      max_items: 0,
    });
    setSelectedProductIds(new Set());
    setSelectedCategoryIds(new Set());
    setEditing(null);
  };

  const openEdit = async (coupon: any) => {
    setForm({
      code: coupon.code,
      coupon_scope: coupon.coupon_scope || "entire_store",
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_value: coupon.min_cart_value || 0,
      max_discount: coupon.max_discount || 0,
      usage_limit: coupon.total_usage_limit || 0,
      per_user_usage_limit: coupon.per_user_usage_limit || 1,
      first_order_only: coupon.first_order_only || false,
      is_active: coupon.is_active,
      start_date: coupon.start_date ? coupon.start_date.slice(0, 16) : "",
      customer_group: coupon.customer_group || "",
      guest_allowed: coupon.guest_allowed ?? true,
      logged_in_only: coupon.logged_in_only || false,
      min_items: coupon.min_items || 0,
      max_items: coupon.max_items || 0,
    });
    setEditing(coupon);
    setShowForm(true);
    try {
      const scopes = await couponsApi.getScopes(coupon.id);
      const productIds = new Set<string>();
      const categoryIds = new Set<string>();
      for (const s of scopes) {
        if (s.scope_type === "product" && s.scope_id) productIds.add(s.scope_id);
        if (s.scope_type === "category" && s.scope_id) categoryIds.add(s.scope_id);
      }
      setSelectedProductIds(productIds);
      setSelectedCategoryIds(categoryIds);
      if (productIds.size > 0) loadProducts();
      if (categoryIds.size > 0) loadCategories();
    } catch { /* ignore */ }
  };

  const handleSave = async () => {
    if (!form.code || form.discount_value <= 0) return;
    if (form.coupon_scope === "selected_products" && selectedProductIds.size === 0) {
      alert("Please select at least one product.");
      return;
    }
    if (form.coupon_scope === "selected_categories" && selectedCategoryIds.size === 0) {
      alert("Please select at least one category.");
      return;
    }
    setSaving(true);
    try {
      const payload: any = {
        code: form.code,
        coupon_scope: form.coupon_scope,
        discount_type: form.discount_type,
        discount_value: form.discount_value,
        min_cart_value: form.min_order_value,
        max_discount: form.max_discount,
        total_usage_limit: form.usage_limit,
        per_user_usage_limit: form.per_user_usage_limit,
        first_order_only: form.first_order_only,
        is_active: form.is_active,
        start_date: form.start_date ? new Date(form.start_date).toISOString() : null,
        customer_group: form.customer_group || null,
        guest_allowed: form.guest_allowed,
        logged_in_only: form.logged_in_only,
        min_items: form.min_items || null,
        max_items: form.max_items || null,
      };
      let couponId: string;
      if (editing) {
        await couponsApi.update(editing.id, payload);
        couponId = editing.id;
      } else {
        const created = await couponsApi.create(payload);
        couponId = created.id;
      }

      const scopes: any[] = [];
      if (form.coupon_scope === "selected_products") {
        for (const pid of selectedProductIds) {
          const p = allProducts.find((x) => x.id === pid);
          scopes.push({ scope_type: "product", scope_id: pid, scope_label: p?.name || pid, rule_type: "include" });
        }
      } else if (form.coupon_scope === "selected_categories") {
        for (const cid of selectedCategoryIds) {
          const c = allCategories.find((x) => x.id === cid);
          scopes.push({ scope_type: "category", scope_id: cid, scope_label: c?.name || cid, rule_type: "include" });
        }
      }
      await couponsApi.setScopes(couponId, scopes);
      setShowForm(false);
      resetForm();
      fetch();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    try {
      await couponsApi.delete(id);
      fetch();
    } catch (err) {
      console.error(err);
    }
  };

  const formatValue = (c: any) => {
    if (c.discount_type === "percentage") return `${c.discount_value}%`;
    return "₹" + Number(c.discount_value).toLocaleString("en-IN");
  };

  const formatScope = (c: any) => {
    if (c.coupon_scope === "entire_store" || !c.coupon_scope) {
      return <span className="text-xs font-medium text-gray-600">Entire Store</span>;
    }
    if (c.coupon_scope === "selected_products") {
      const count = c.scope_count ?? 0;
      return <span className="text-xs font-medium text-gray-600">{count} Product{count !== 1 ? "s" : ""}</span>;
    }
    if (c.coupon_scope === "selected_categories") {
      const count = c.scope_count ?? 0;
      return <span className="text-xs font-medium text-gray-600">{count} Categor{count !== 1 ? "ies" : "y"}</span>;
    }
    return <span className="text-xs text-gray-400">—</span>;
  };

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Coupons"
        description={`${coupons.length} coupons`}
        actions={
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]">
            <Plus className="h-4 w-4" /> Add Coupon
          </button>
        }
      />

      {showForm && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-bold text-[#1a1a2e] mb-4">{editing ? "Edit Coupon" : "New Coupon"}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Code</label>
              <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]" placeholder="SUMMER25" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Discount Type</label>
              <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Value</label>
              <input type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Coupon Scope</label>
              <select value={form.coupon_scope} onChange={(e) => setForm({ ...form, coupon_scope: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]">
                <option value="entire_store">Entire Store</option>
                <option value="selected_categories">Selected Categories</option>
                <option value="selected_products">Selected Products</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Min Order Value</label>
              <input type="number" value={form.min_order_value} onChange={(e) => setForm({ ...form, min_order_value: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Max Discount</label>
              <input type="number" value={form.max_discount} onChange={(e) => setForm({ ...form, max_discount: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Usage Limit</label>
              <input type="number" value={form.usage_limit} onChange={(e) => setForm({ ...form, usage_limit: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Per User Limit</label>
              <input type="number" value={form.per_user_usage_limit} onChange={(e) => setForm({ ...form, per_user_usage_limit: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]" />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded" />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.first_order_only} onChange={(e) => setForm({ ...form, first_order_only: e.target.checked })} className="rounded" />
              First Order Only
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.logged_in_only} onChange={(e) => setForm({ ...form, logged_in_only: e.target.checked })} className="rounded" />
              Logged In Only
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!form.guest_allowed} onChange={(e) => setForm({ ...form, guest_allowed: !e.target.checked })} className="rounded" />
              Block Guests
            </label>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Start Date</label>
              <input type="datetime-local" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Customer Group</label>
              <input value={form.customer_group} onChange={(e) => setForm({ ...form, customer_group: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]" placeholder="VIP, Wholesale, etc." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Min Items</label>
              <input type="number" value={form.min_items} onChange={(e) => setForm({ ...form, min_items: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Max Items</label>
              <input type="number" value={form.max_items} onChange={(e) => setForm({ ...form, max_items: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]" />
            </div>
          </div>

          {form.coupon_scope === "selected_products" && (
            <div className="mt-4">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Select Products ({selectedProductIds.size} selected)
              </label>
              <SearchableMultiSelect
                items={allProducts.map((p: any) => ({ id: p.id, label: p.name }))}
                selected={selectedProductIds}
                onChange={setSelectedProductIds}
                placeholder="Search products..."
                loading={productsLoading}
              />
            </div>
          )}

          {form.coupon_scope === "selected_categories" && (
            <div className="mt-4">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Select Categories ({selectedCategoryIds.size} selected)
              </label>
              <SearchableMultiSelect
                items={allCategories.map((c: any) => ({ id: c.id, label: c.name }))}
                selected={selectedCategoryIds}
                onChange={setSelectedCategoryIds}
                placeholder="Search categories..."
                loading={categoriesLoading}
              />
            </div>
          )}

          <div className="mt-4 flex items-center gap-3">
            <button onClick={handleSave} disabled={saving} className="rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e] disabled:opacity-50">
              {saving ? "Saving..." : editing ? "Update" : "Create"}
            </button>
            <button onClick={() => { setShowForm(false); resetForm(); }} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <AdminLoading />
      ) : coupons.length === 0 ? (
        <AdminEmpty title="No coupons yet" description="Create discount coupons to promote your products." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Value</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Scope</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Min Order</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Usage</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><span className="font-mono font-bold text-[#1a1a2e]">{c.code}</span></td>
                  <td className="px-4 py-3 font-medium">{formatValue(c)}</td>
                  <td className="px-4 py-3">{formatScope(c)}</td>
                  <td className="px-4 py-3 text-gray-500">{c.min_cart_value ? "₹" + Number(c.min_cart_value).toLocaleString("en-IN") : "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{c.usage_count ?? 0}{c.total_usage_limit ? ` / ${c.total_usage_limit}` : ""}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${c.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {c.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(c)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><Edit3 className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(c.id, c.code)} className="rounded-lg p-1.5 text-red-300 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

function SearchableMultiSelect({
  items,
  selected,
  onChange,
  placeholder,
  loading,
}: {
  items: Array<{ id: string; label: string }>;
  selected: Set<string>;
  onChange: (selected: Set<string>) => void;
  placeholder: string;
  loading?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [items, query]);

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(next);
  };

  const selectedLabels = items.filter((i) => selected.has(i.id)).map((i) => i.label);

  return (
    <div ref={ref} className="relative">
      <div
        className="flex min-h-[42px] cursor-pointer flex-wrap items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
        onClick={() => setOpen(!open)}
      >
        {selectedLabels.length === 0 ? (
          <span className="text-gray-400">{loading ? "Loading..." : placeholder}</span>
        ) : (
          selectedLabels.slice(0, 3).map((label) => (
            <span key={label} className="inline-flex items-center gap-1 rounded-md bg-[#1a1a2e]/10 px-2 py-0.5 text-xs font-medium text-[#1a1a2e]">
              {label}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const item = items.find((i) => i.label === label);
                  if (item) toggle(item.id);
                }}
                className="hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))
        )}
        {selectedLabels.length > 3 && (
          <span className="text-xs text-gray-500">+{selectedLabels.length - 3} more</span>
        )}
        <ChevronDown className={`ml-auto h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-transparent text-sm outline-none"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-center text-xs text-gray-400">No results</p>
            ) : (
              filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggle(item.id)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                    selected.has(item.id) ? "bg-[#7A2533]/5 font-medium" : ""
                  }`}
                >
                  <div className={`flex h-4 w-4 items-center justify-center rounded border ${
                    selected.has(item.id) ? "border-[#7A2533] bg-[#7A2533]" : "border-gray-300"
                  }`}>
                    {selected.has(item.id) && <Check className="h-3 w-3 text-white" />}
                  </div>
                  {item.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCoupons;

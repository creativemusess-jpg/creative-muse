import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader, AdminLoading, AdminEmpty } from "@/components/admin/AdminLayout";
import { couponsApi } from "@/lib/api/coupons";
import { Plus, Edit3, Trash2, Tag } from "lucide-react";

export const Route = createFileRoute("/admin/coupons")({
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
    description: "",
    discount_type: "percentage",
    discount_value: 0,
    min_order_value: 0,
    max_discount: 0,
    usage_limit: 0,
    per_user_usage_limit: 1,
    first_order_only: false,
    is_active: true,
  });

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

  const resetForm = () => {
    setForm({
      code: "",
      description: "",
      discount_type: "percentage",
      discount_value: 0,
      min_order_value: 0,
      max_discount: 0,
      usage_limit: 0,
      per_user_usage_limit: 1,
      first_order_only: false,
      is_active: true,
    });
    setEditing(null);
  };

  const openEdit = (coupon: any) => {
    setForm({
      code: coupon.code,
      description: coupon.description || "",
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_value: coupon.min_order_value || 0,
      max_discount: coupon.max_discount || 0,
      usage_limit: coupon.usage_limit || 0,
      per_user_usage_limit: coupon.per_user_usage_limit || 1,
      first_order_only: coupon.first_order_only || false,
      is_active: coupon.is_active,
    });
    setEditing(coupon);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.code || form.discount_value <= 0) return;
    setSaving(true);
    try {
      const payload = {
        code: form.code,
        description: form.description,
        discount_type: form.discount_type,
        discount_value: form.discount_value,
        min_cart_value: form.min_order_value,
        max_discount: form.max_discount,
        total_usage_limit: form.usage_limit,
        per_user_usage_limit: form.per_user_usage_limit,
        first_order_only: form.first_order_only,
        is_active: form.is_active,
      };
      if (editing) {
        await couponsApi.update(editing.id, payload);
      } else {
        await couponsApi.create(payload);
      }
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
              <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" placeholder="SUMMER25" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Type</label>
              <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Value</label>
              <input type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Min Order Value</label>
              <input type="number" value={form.min_order_value} onChange={(e) => setForm({ ...form, min_order_value: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Max Discount</label>
              <input type="number" value={form.max_discount} onChange={(e) => setForm({ ...form, max_discount: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Usage Limit</label>
              <input type="number" value={form.usage_limit} onChange={(e) => setForm({ ...form, usage_limit: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Per User Limit</label>
              <input type="number" value={form.per_user_usage_limit} onChange={(e) => setForm({ ...form, per_user_usage_limit: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Description</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded" />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.first_order_only} onChange={(e) => setForm({ ...form, first_order_only: e.target.checked })} className="rounded" />
              First Order Only
            </label>
          </div>
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

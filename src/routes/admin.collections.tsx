/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Edit, ImageOff, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import { ConfirmDialog, DataTable } from "@/components/admin/AdminTable";
import { collectionsApi } from "@/lib/api/collections";
import { uploadImage } from "@/lib/api/upload";

import { requireAdmin } from "@/lib/auth-guard";

export const Route = createFileRoute("/admin/collections")({
  beforeLoad: requireAdmin,
  component: CollectionsPage,
});

type CollectionForm = {
  name: string;
  slug: string;
  description: string;
  image: string;
};

const emptyForm: CollectionForm = { name: "", slug: "", description: "", image: "" };

function CollectionsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<CollectionForm>(emptyForm);

  const load = async () => {
    setLoading(true);
    try {
      const result = await collectionsApi.list();
      setData(result.data);
      setError("");
    } catch (e: any) {
      setError(e.message || "Unable to load collections.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "categories", "collections");
      setForm((current) => ({ ...current, image: url }));
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        image: form.image || null,
      };

      if (!payload.name) throw new Error("Collection name is required.");
      if (!payload.slug) throw new Error("Collection slug is required.");

      if (editing) await collectionsApi.update(editing.id, payload);
      else await collectionsApi.create(payload);

      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
      load();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await collectionsApi.delete(deleteId);
      setDeleteId(null);
      load();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({
      name: item.name || "",
      slug: item.slug || "",
      description: item.description || "",
      image: item.image || "",
    });
    setShowForm(true);
  };

  const filteredData = data.filter((item) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      String(item.name || "")
        .toLowerCase()
        .includes(term) ||
      String(item.slug || "")
        .toLowerCase()
        .includes(term)
    );
  });

  return (
    <AdminLayout>
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete collection?"
        message="This will remove the collection and unlink all products. Products themselves are not deleted."
        confirmLabel="Delete"
      />

      <AdminPageHeader
        title="Collections"
        description={`${data.length} collections total`}
        actions={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]"
          >
            <Plus className="h-4 w-4" />
            Add Collection
          </button>
        }
      />

      <DataTable
        data={filteredData}
        loading={loading}
        error={error}
        keyField="id"
        emptyTitle="No collections yet"
        emptyDescription="Create your first collection to organize products."
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search collections..."
        onRetry={load}
        columns={[
          {
            key: "image",
            label: "Image",
            render: (row) =>
              row.image ? (
                <img src={row.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-300">
                  <ImageOff className="h-4 w-4" />
                </span>
              ),
          },
          {
            key: "name",
            label: "Name",
            sortable: true,
            render: (row) => (
              <Link
                to="/collections/$slug"
                params={{ slug: row.slug || "" }}
                className="text-sm font-medium text-[#1a1a2e] hover:text-[#7A2533]"
              >
                {row.name}
              </Link>
            ),
          },
          {
            key: "slug",
            label: "Slug",
            sortable: true,
            render: (row) => <span className="text-xs text-gray-400">{row.slug || "-"}</span>,
          },
          {
            key: "description",
            label: "Description",
            render: (row) => (
              <span className="block max-w-[240px] truncate text-xs text-gray-500">
                {row.description || "-"}
              </span>
            ),
          },
          {
            key: "product_count",
            label: "Products",
            sortable: true,
            render: (row) => (
              <span className="inline-flex items-center justify-center rounded-full bg-[#1a1a2e]/10 px-2 py-0.5 text-xs font-semibold text-[#1a1a2e]">
                {row.product_count ?? 0}
              </span>
            ),
          },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={() => openEdit(row)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#7A2533]"
                  aria-label="Edit collection"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteId(row.id)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                  aria-label="Delete collection"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ),
          },
        ]}
      />

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-[#1a1a2e]">
              {editing ? "Edit" : "Add"} Collection
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500">Image</label>
                <div className="mt-1 flex items-start gap-3">
                  {form.image ? (
                    <div className="relative">
                      <img
                        src={form.image}
                        alt="Collection preview"
                        className="h-20 w-20 rounded-lg object-cover shadow-sm"
                      />
                      <button
                        onClick={() => setForm({ ...form, image: "" })}
                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                        type="button"
                        aria-label="Remove image"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 hover:border-[#7A2533] hover:text-[#7A2533]">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      {uploading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Upload className="h-5 w-5" />
                      )}
                    </label>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]"
              >
                {editing ? "Save" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

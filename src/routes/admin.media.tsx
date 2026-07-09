import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader, AdminLoading, AdminEmpty } from "@/components/admin/AdminLayout";
import { mediaApi } from "@/lib/api/media";
import { Search, Trash2, ImageOff } from "lucide-react";

export const Route = createFileRoute("/admin/media")({
  component: AdminMedia,
});

function AdminMedia() {
  const [items, setItems] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetch = async () => {
    setLoading(true);
    try {
      const result = await mediaApi.list({ search: search || undefined });
      setItems(result.data);
      setCount(result.count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [search]);

  const handleDelete = async (id: string, filename: string) => {
    if (!window.confirm(`Delete "${filename}"?`)) return;
    try {
      await mediaApi.delete(id);
      fetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <AdminPageHeader title="Media Library" description={`${count} files`} />
      <div className="mb-4 relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search media..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#c9a96e]" />
      </div>
      {loading ? (
        <AdminLoading />
      ) : items.length === 0 ? (
        <AdminEmpty title="No media files" description="Uploaded images and files will appear here." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {items.map((m) => (
            <div key={m.id} className="group relative rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="flex aspect-square items-center justify-center bg-gray-50 p-2">
                {m.mime_type?.startsWith("image/") ? (
                  <img src={m.url} alt={m.alt_text || m.filename} className="h-full w-full object-contain" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                ) : (
                  <ImageOff className="h-8 w-8 text-gray-300" />
                )}
              </div>
              <div className="p-2.5">
                <p className="truncate text-xs font-medium text-[#1a1a2e]" title={m.filename}>{m.filename}</p>
                <p className="text-[10px] text-gray-400">{new Date(m.created_at).toLocaleDateString()}</p>
              </div>
              <button onClick={() => handleDelete(m.id, m.filename)} className="absolute top-2 right-2 rounded-lg bg-white/90 p-1.5 text-red-400 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-500">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

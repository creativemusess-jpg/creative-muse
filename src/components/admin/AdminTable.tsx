import { useState, useCallback } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown, Search, Check, X, ArrowUpDown } from "lucide-react";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render: (item: T) => React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: string;
  loading?: boolean;
  error?: string | null;
  emptyTitle?: string;
  emptyDescription?: string;
  onRetry?: () => void;
  selectedItems?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (field: string) => void;
  page?: number;
  totalPages?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  bulkActions?: React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  columns, data, keyField, loading, error, emptyTitle = "No items found",
  emptyDescription, onRetry, selectedItems, onSelectionChange,
  sortField, sortOrder, onSort, page, totalPages, total,
  onPageChange, searchValue, onSearchChange, searchPlaceholder = "Search...",
  filters, bulkActions,
}: DataTableProps<T>) {
  const allSelected = data.length > 0 && selectedItems?.size === data.length;
  const someSelected = (selectedItems?.size ?? 0) > 0;

  const toggleAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(data.map((d) => String(d[keyField]))));
    }
  };

  const toggleItem = (id: string) => {
    if (!onSelectionChange) return;
    const next = new Set(selectedItems);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange(next);
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ChevronsUpDown className="h-3 w-3 text-gray-300" />;
    return sortOrder === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="space-y-3 p-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-5 flex-1 animate-pulse rounded bg-gray-100" />
              <div className="h-5 w-20 animate-pulse rounded bg-gray-100" />
              <div className="h-5 w-20 animate-pulse rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
        <div className="flex items-start gap-3">
          <X className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Could not load data</p>
            <p className="mt-1 text-sm">{error}</p>
            {onRetry && (
              <button onClick={onRetry} className="mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700">
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {(searchValue !== undefined || filters || bulkActions) && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            {searchValue !== undefined && onSearchChange && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#7A2533]"
                />
              </div>
            )}
            {filters}
          </div>
          {someSelected && bulkActions && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{selectedItems?.size} selected</span>
              {bulkActions}
            </div>
          )}
        </div>
      )}

      {data.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <p className="mt-4 text-lg font-semibold text-gray-600">{emptyTitle}</p>
          {emptyDescription && <p className="mt-1 text-sm text-gray-400">{emptyDescription}</p>}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {onSelectionChange && (
                  <th className="w-10 px-3 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="h-4 w-4 rounded border-gray-300 text-[#7A2533] focus:ring-[#7A2533]"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600 ${col.className || ""} ${col.hideOnMobile ? "hidden md:table-cell" : ""}`}
                  >
                    {col.sortable ? (
                      <button
                        onClick={() => onSort?.(col.key)}
                        className="flex items-center gap-1 hover:text-gray-900"
                      >
                        {col.label}
                        <SortIcon field={col.key} />
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((item) => {
                const id = String(item[keyField]);
                return (
                  <tr key={id} className={`hover:bg-gray-50 ${selectedItems?.has(id) ? "bg-amber-50/50" : ""}`}>
                    {onSelectionChange && (
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selectedItems?.has(id) ?? false}
                          onChange={() => toggleItem(id)}
                          className="h-4 w-4 rounded border-gray-300 text-[#7A2533] focus:ring-[#7A2533]"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3 ${col.className || ""} ${col.hideOnMobile ? "hidden md:table-cell" : ""}`}
                      >
                        {col.render(item)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-gray-500">{total ?? 0} total</p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange?.((page ?? 1) - 1)}
              disabled={!page || page <= 1}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium disabled:opacity-30"
            >
              Previous
            </button>
            <span className="px-3 text-xs text-gray-500">
              {page ?? 1} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange?.((page ?? 1) + 1)}
              disabled={!page || !totalPages || page >= totalPages}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function StatusBadge({ status, size = "sm" }: { status: string; size?: "sm" | "md" }) {
  const colors: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    draft: "bg-gray-100 text-gray-600",
    archived: "bg-yellow-100 text-yellow-700",
    out_of_stock: "bg-red-100 text-red-600",
    pending: "bg-amber-100 text-amber-700",
    paid: "bg-blue-100 text-blue-700",
    fulfilled: "bg-green-100 text-green-700",
    delivered: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-600",
    refunded: "bg-purple-100 text-purple-600",
    published: "bg-green-100 text-green-700",
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-amber-100 text-amber-700",
    in_progress: "bg-indigo-100 text-indigo-700",
    resolved: "bg-green-100 text-green-700",
    closed: "bg-gray-100 text-gray-500",
    spam: "bg-red-100 text-red-600",
    subscribed: "bg-green-100 text-green-700",
    unsubscribed: "bg-gray-100 text-gray-500",
  };
  const sizeClass = size === "md" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[10px]";
  return (
    <span className={`inline-block rounded-full font-semibold uppercase tracking-wider ${sizeClass} ${colors[status] || "bg-gray-100 text-gray-600"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = "Confirm", variant = "danger" }: {
  open: boolean; onClose: () => void; onConfirm: () => void;
  title: string; message: string; confirmLabel?: string; variant?: "danger" | "primary";
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="mx-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-[#1a1a2e]">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${variant === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-[#1a1a2e] hover:bg-[#2d1b4e]"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Toast({ message, type = "success", visible, onClose }: {
  message: string; type?: "success" | "error" | "info"; visible: boolean; onClose: () => void;
}) {
  if (!visible) return null;
  const bg = type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : "bg-blue-600";
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right-2">
      <div className={`flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg ${bg}`}>
        {type === "success" ? <Check className="h-4 w-4" /> : type === "error" ? <X className="h-4 w-4" /> : null}
        {message}
        <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-6">
          <div className="h-5 flex-1 animate-pulse rounded bg-gray-100" />
          <div className="h-5 w-24 animate-pulse rounded bg-gray-100" />
          <div className="h-5 w-24 animate-pulse rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

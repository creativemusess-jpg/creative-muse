import { useEffect, useState } from "react";
import { CalendarClock, Eye, EyeOff, Archive, Store } from "lucide-react";

export interface PublishState {
  status: string;
  publish_at: string | null;
}

const toLocalInput = (iso: string | null | undefined): string => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const fromLocalInput = (value: string): string | null => {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d.toISOString();
};

const defaultScheduleIso = (): string => {
  const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return d.toISOString();
};

export function PublishControl({
  status,
  publish_at,
  onChange,
}: {
  status: string;
  publish_at?: string | null;
  onChange: (next: PublishState) => void;
}) {
  const isFutureSchedule =
    (status === "active" || status === "draft") &&
    !!publish_at &&
    new Date(publish_at).getTime() > Date.now();
  const [mode, setMode] = useState<string>(() => {
    if (status === "archived") return "archive";
    if (status === "out_of_stock") return "out_of_stock";
    if (isFutureSchedule) return "schedule";
    if (status === "active") return "publish";
    return "draft";
  });
  const [scheduleValue, setScheduleValue] = useState<string>(isFutureSchedule ? toLocalInput(publish_at) : "");

  useEffect(() => {
    let nextMode = "draft";
    if (status === "archived") nextMode = "archive";
    else if (status === "out_of_stock") nextMode = "out_of_stock";
    else if (isFutureSchedule) nextMode = "schedule";
    else if (status === "active") nextMode = "publish";
    setMode(nextMode);
    if (isFutureSchedule) setScheduleValue(toLocalInput(publish_at));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, publish_at]);

  const emit = (nextMode: string, overrideSlot?: string) => {
    if (nextMode === "schedule") {
      if (!overrideSlot && !scheduleValue) setScheduleValue(toLocalInput(defaultScheduleIso()));
      onChange({
        status: "active",
        publish_at: fromLocalInput(overrideSlot ?? scheduleValue),
      });
      return;
    }
    switch (nextMode) {
      case "archive":
        onChange({ status: "archived", publish_at: null });
        break;
      case "out_of_stock":
        onChange({ status: "out_of_stock", publish_at: null });
        break;
      case "publish":
        onChange({ status: "active", publish_at: null });
        break;
      default:
        onChange({ status: "draft", publish_at: null });
    }
  };

  const options = [
    { id: "draft", label: "Draft", hint: "Hidden from the storefront", icon: EyeOff },
    { id: "publish", label: "Publish", hint: "Live immediately", icon: Eye },
    { id: "schedule", label: "Schedule", hint: "Go live at a future time", icon: CalendarClock },
    { id: "out_of_stock", label: "Out of Stock", hint: "Keep visible but unorderable", icon: Store },
    { id: "archive", label: "Archive", hint: "Hide and mark as archived", icon: Archive },
  ];

  const selected = options.find((o) => o.id === mode) || options[0];

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label="Publishing">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSel = mode === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => emit(opt.id)}
              className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-left transition-colors ${
                isSel
                  ? "border-[#7A2533] bg-[#7A2533]/5 text-[#1a1a2e]"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isSel ? "text-[#7A2533]" : "text-gray-400"}`} />
              <span className="min-w-0">
                <span className={`block text-sm font-medium ${isSel ? "text-[#1a1a2e]" : ""}`}>{opt.label}</span>
                <span className="block text-[11px] text-gray-400">{opt.hint}</span>
              </span>
            </button>
          );
        })}
      </div>

      {mode === "schedule" && (
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Scheduled Time</label>
          <input
            type="datetime-local"
            value={scheduleValue}
            onChange={(e) => {
              setScheduleValue(e.target.value);
              emit("schedule", e.target.value);
            }}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]"
          />
          <p className="mt-1 text-[11px] text-gray-400">
            {scheduleValue
              ? `Will go live ${new Date(scheduleValue).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}.`
              : "Pick a future date and time."}
          </p>
        </div>
      )}

      <p className="text-[11px] text-gray-400">
        {selected.hint}. Publishing is applied instantly — a scheduled product becomes visible automatically when its
        time arrives, with no manual step needed.
      </p>
    </div>
  );
}
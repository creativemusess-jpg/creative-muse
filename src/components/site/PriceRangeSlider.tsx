import { useCallback, useEffect, useRef, useState } from "react";

function fmt(n: number) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

interface Props {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
  step?: number;
}

export function PriceRangeSlider({ min, max, valueMin, valueMax, onChange, step = 100 }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [localMin, setLocalMin] = useState(valueMin);
  const [localMax, setLocalMax] = useState(valueMax);
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);

  useEffect(() => {
    setLocalMin(valueMin);
    setLocalMax(valueMax);
  }, [valueMin, valueMax, min, max]);

  const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  const handlePointer = useCallback(
    (clientX: number) => {
      if (!trackRef.current || !dragging) return;
      const rect = trackRef.current.getBoundingClientRect();
      let ratio = (clientX - rect.left) / rect.width;
      ratio = clamp(ratio, 0, 1);
      let val = Math.round((min + ratio * (max - min)) / step) * step;
      val = clamp(val, min, max);

      if (dragging === "min") {
        const next = Math.min(val, localMax - step);
        setLocalMin(next);
        onChange(next, localMax);
      } else {
        const next = Math.max(val, localMin + step);
        setLocalMax(next);
        onChange(localMin, next);
      }
    },
    [dragging, localMin, localMax, min, max, step, onChange],
  );

  const onPointerDown = (handle: "min" | "max") => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(handle);
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => handlePointer(e.clientX);
    const onUp = () => setDragging(null);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging, handlePointer]);

  const onKeyDown = (handle: "min" | "max") => (e: React.KeyboardEvent) => {
    let delta = 0;
    if (e.key === "ArrowUp" || e.key === "ArrowRight") delta = step;
    else if (e.key === "ArrowDown" || e.key === "ArrowLeft") delta = -step;
    else if (e.key === "PageUp") delta = step * 5;
    else if (e.key === "PageDown") delta = -step * 5;
    else return;
    e.preventDefault();
    if (handle === "min") {
      const next = clamp(localMin + delta, min, localMax - step);
      setLocalMin(next);
      onChange(next, localMax);
    } else {
      const next = clamp(localMax + delta, localMin + step, max);
      setLocalMax(next);
      onChange(localMin, next);
    }
  };

  const pctMin = pct(localMin);
  const pctMax = pct(localMax);

  return (
    <div className="space-y-3">
      <div
        ref={trackRef}
        className="relative h-7 w-full select-none touch-none"
        onPointerDown={(e) => {
          if (!trackRef.current || dragging) return;
          const rect = trackRef.current.getBoundingClientRect();
          const ratio = clamp((e.clientX - rect.left) / rect.width, 0, 1);
          const val = Math.round((min + ratio * (max - min)) / step) * step;
          const mid = (localMin + localMax) / 2;
          setDragging(val < mid ? "min" : "max");
        }}
      >
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-[rgba(92,61,58,0.12)]" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#9C544D]"
          style={{ left: `${pctMin}%`, width: `${pctMax - pctMin}%` }}
        />
        <div
          className="absolute top-1/2 z-10 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing items-center justify-center rounded-full bg-white border-2 border-[#9C544D] shadow-[0_2px_8px_rgba(156,84,77,0.2)]"
          style={{ left: `${pctMin}%` }}
          onPointerDown={onPointerDown("min")}
          tabIndex={0}
          role="slider"
          aria-label="Minimum price"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={localMin}
          aria-valuetext={fmt(localMin)}
          onKeyDown={onKeyDown("min")}
        >
          <div className="h-2 w-2 rounded-full bg-[#9C544D]" />
        </div>
        <div
          className="absolute top-1/2 z-10 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing items-center justify-center rounded-full bg-white border-2 border-[#9C544D] shadow-[0_2px_8px_rgba(156,84,77,0.2)]"
          style={{ left: `${pctMax}%` }}
          onPointerDown={onPointerDown("max")}
          tabIndex={0}
          role="slider"
          aria-label="Maximum price"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={localMax}
          aria-valuetext={fmt(localMax)}
          onKeyDown={onKeyDown("max")}
        >
          <div className="h-2 w-2 rounded-full bg-[#9C544D]" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-1 items-center rounded-[10px] border border-[rgba(92,61,58,0.18)] bg-[#fffdf9] px-2.5 py-1.5">
          <span className="text-[11px] font-semibold text-[#9C544D]">₹</span>
          <input
            type="text"
            inputMode="numeric"
            value={localMin}
            onChange={(e) => {
              const v = parseInt(e.target.value.replace(/\D/g, ""), 10) || min;
              const next = clamp(v, min, localMax - step);
              setLocalMin(next);
              onChange(next, localMax);
            }}
            className="w-full bg-transparent px-1 text-[12px] font-medium text-[#9C544D] outline-none"
            aria-label="Minimum price"
          />
        </div>
        <span className="text-[11px] text-[rgba(92,61,58,0.4)]">—</span>
        <div className="flex flex-1 items-center rounded-[10px] border border-[rgba(92,61,58,0.18)] bg-[#fffdf9] px-2.5 py-1.5">
          <span className="text-[11px] font-semibold text-[#9C544D]">₹</span>
          <input
            type="text"
            inputMode="numeric"
            value={localMax}
            onChange={(e) => {
              const v = parseInt(e.target.value.replace(/\D/g, ""), 10) || max;
              const next = clamp(v, localMin + step, max);
              setLocalMax(next);
              onChange(localMin, next);
            }}
            className="w-full bg-transparent px-1 text-[12px] font-medium text-[#9C544D] outline-none"
            aria-label="Maximum price"
          />
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";

type BrandLogoProps = {
  src?: string;
  compact?: boolean;
  dark?: boolean;
  className?: string;
};

export function BrandLogo({ src, compact = false, dark = false, className = "" }: BrandLogoProps) {
  const [imageState, setImageState] = useState<"loading" | "loaded" | "failed">(
    src ? "loading" : "failed",
  );

  if (src && imageState === "loaded") {
    return (
      <img
        src={src}
        alt="Creative Muse"
        className={className}
      />
    );
  }

  return (
    <span className={`flex items-center gap-2 ${className}`} aria-label="Creative Muse">
      {src && imageState === "loading" && (
        <img
          src={src}
          alt=""
          aria-hidden="true"
          onLoad={() => setImageState("loaded")}
          onError={() => setImageState("failed")}
          className="hidden"
        />
      )}
      <span
        className={`flex shrink-0 items-center justify-center rounded-full border font-display font-semibold ${
          compact ? "h-9 w-9 text-[13px]" : "h-11 w-11 text-[15px]"
        } ${
          dark
            ? "border-[#C9A96E]/55 bg-white text-[#1a1a2e]"
            : "border-[#C9A96E]/45 bg-white text-[#1a1a2e]"
        }`}
      >
        CM
      </span>
      <span className={compact ? "leading-tight" : "leading-tight"}>
        <span
          className={`block font-display font-semibold ${
            compact ? "text-[15px]" : "text-[19px]"
          } ${dark ? "text-white" : "text-[#1a1a2e]"}`}
        >
          Creative Muse
        </span>
        <span className="block text-[9px] font-semibold uppercase tracking-[0.22em] text-[#C9A96E]">
          Fine Jewellery
        </span>
      </span>
    </span>
  );
}

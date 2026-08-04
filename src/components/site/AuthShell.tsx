import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fdf8f3] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-[440px] flex-col items-center justify-center">
        <Link to="/" className="mb-8 flex items-center justify-center" aria-label="Creative Muse home">
          <img
            src="/favicon.ico"
            alt="Creative Muse"
            className="h-[72px] w-[72px] object-contain"
          />
        </Link>
        {children}
      </div>
    </div>
  );
}

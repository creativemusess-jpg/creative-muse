import type { ReactNode } from "react";
import { AnnouncementBar } from "./AnnouncementBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { StoreProvider } from "@/lib/store";
import { Overlays } from "./Overlays";

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <div className="flex min-h-screen flex-col bg-[#fdf8f3]">
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Overlays />
      </div>
    </StoreProvider>
  );
}

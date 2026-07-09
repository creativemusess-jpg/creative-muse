import { MessageCircle } from "lucide-react";

export function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/919033779867"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="animate-cm-pulse-ring fixed right-4 bottom-[max(18px,env(safe-area-inset-bottom))] z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition-transform hover:scale-110 md:right-5 md:bottom-5 md:h-14 md:w-14"
    >
      <MessageCircle className="h-5 w-5 md:h-6 md:w-6" fill="white" />
    </a>
  );
}

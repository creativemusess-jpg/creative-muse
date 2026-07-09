import { MessageCircle } from "lucide-react";

export function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/919033779867"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="animate-cm-pulse-ring fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition-transform hover:scale-110"
    >
      <MessageCircle className="h-6 w-6" fill="white" />
    </a>
  );
}

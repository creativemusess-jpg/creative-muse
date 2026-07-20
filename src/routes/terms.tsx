import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms of Service — Creative Muse" }] }),
  component: TermsRedirect,
});

function TermsRedirect() {
  const navigate = useNavigate();
  useEffect(() => { navigate({ to: "/terms-and-conditions", replace: true }); }, [navigate]);
  return null;
}

import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({ meta: [{ title: "Refund Policy — Creative Muse" }] }),
  component: RefundPolicyRedirect,
});

function RefundPolicyRedirect() {
  const navigate = useNavigate();
  useEffect(() => { navigate({ to: "/refund-return-policy", replace: true }); }, [navigate]);
  return null;
}

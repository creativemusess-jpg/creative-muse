export const OAUTH_REDIRECT_STORAGE_KEY = "cm_oauth_redirect";

export function safeInternalRedirect(value?: string | null, fallback = "/account") {
  const redirect = String(value || "").trim();
  if (
    !redirect.startsWith("/") ||
    redirect.startsWith("//") ||
    redirect.startsWith("/\\") ||
    /[\u0000-\u001f]/.test(redirect)
  ) {
    return fallback;
  }
  if (redirect === "/login" || redirect.startsWith("/login?") || redirect.startsWith("/auth/")) {
    return fallback;
  }
  return redirect;
}

export function storeOAuthRedirect(value?: string | null) {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(OAUTH_REDIRECT_STORAGE_KEY, safeInternalRedirect(value));
}

export function takeStoredOAuthRedirect() {
  if (typeof sessionStorage === "undefined") return null;
  const value = sessionStorage.getItem(OAUTH_REDIRECT_STORAGE_KEY);
  sessionStorage.removeItem(OAUTH_REDIRECT_STORAGE_KEY);
  return value;
}

export function authCallbackUrl(origin: string, redirect?: string | null) {
  const url = new URL("/auth/callback", origin);
  url.searchParams.set("redirect", safeInternalRedirect(redirect));
  return url.toString();
}

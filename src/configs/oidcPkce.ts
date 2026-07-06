// khi lên Azure AD thật (https://), có thể quay lại dùng MSAL bình thường.

export const OIDC_ISSUER = import.meta.env.VITE_SSO_AUTHORITY; // http://localhost:8081/realms/gfl-demo
export const OIDC_CLIENT_ID = import.meta.env.VITE_SSO_CLIENT_ID; // gfl-backend-app2
export const OIDC_REDIRECT_URI = `${window.location.origin}/auth/sso-callback`;

function base64url(bytes: Uint8Array): string {
  let str = "";
  bytes.forEach((b) => (str += String.fromCharCode(b)));
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function generatePkcePair() {
  const verifierBytes = crypto.getRandomValues(new Uint8Array(40));
  const verifier = base64url(verifierBytes);
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );
  const challenge = base64url(new Uint8Array(digest));
  return { verifier, challenge };
}

export async function getDiscovery() {
  const res = await fetch(`${OIDC_ISSUER}/.well-known/openid-configuration`);

  if (!res.ok) {
    throw new Error("Không lấy được OIDC discovery document");
  }

  const discovery = await res.json();

  console.log("===== OIDC DISCOVERY =====");
  console.log(discovery);

  return discovery;
}

/**
 * OIDC + PKCE helpers
 *
 * Dùng cho Keycloak (HTTP) để phát triển local.
 * Khi triển khai Azure AD thật (HTTPS), chỉ cần đổi các biến môi trường.
 */

export const OIDC_ISSUER = import.meta.env.VITE_SSO_AUTHORITY;

export const OIDC_CLIENT_ID = import.meta.env.VITE_SSO_CLIENT_ID;

export const OIDC_REDIRECT_URI = `${window.location.origin}/auth/sso-callback`;

export interface OidcDiscovery {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint?: string;
  jwks_uri: string;
  end_session_endpoint?: string;
}

/**
 * Base64URL encode
 */
function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";

  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Random string dùng cho:
 * - state
 * - nonce
 */
export function generateRandomString(length = 32): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));

  return base64UrlEncode(bytes);
}

/**
 * Sinh PKCE
 */
export async function generatePkcePair() {
  const verifier = generateRandomString(64);

  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );

  const challenge = base64UrlEncode(new Uint8Array(digest));

  return {
    verifier,
    challenge,
  };
}

/**
 * Sinh state chống CSRF
 */
export function generateState() {
  return generateRandomString(32);
}

/**
 * Sinh nonce chống replay attack
 */
export function generateNonce() {
  return generateRandomString(32);
}

/**
 * Lấy OIDC Discovery Document
 */
export async function getDiscovery(): Promise<OidcDiscovery> {
  console.log("========== GET OIDC DISCOVERY ==========");

  const response = await fetch(
    `${OIDC_ISSUER}/.well-known/openid-configuration`,
  );

  if (!response.ok) {
    throw new Error(`Không lấy được OIDC Discovery (${response.status})`);
  }

  const discovery = (await response.json()) as OidcDiscovery;

  console.log("OIDC ISSUER:", discovery.issuer);
  console.log("AUTHORIZATION:", discovery.authorization_endpoint);
  console.log("TOKEN:", discovery.token_endpoint);
  console.log("JWKS:", discovery.jwks_uri);

  return discovery;
}

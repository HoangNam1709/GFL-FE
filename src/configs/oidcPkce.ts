/**
 * OIDC + PKCE helpers — hỗ trợ NHIỀU Identity Provider cùng lúc (Keycloak để
 * test local + Azure AD thật), khớp với registry phía Backend
 * (app/core/config.py: _build_oidc_providers()).
 */

export type OidcProvider = "keycloak" | "azure";

interface ProviderConfig {
  issuer: string;
  clientId: string;
}

const PROVIDERS: Record<OidcProvider, ProviderConfig> = {
  keycloak: {
    issuer: import.meta.env.VITE_KEYCLOAK_SSO_AUTHORITY,
    clientId: import.meta.env.VITE_KEYCLOAK_SSO_CLIENT_ID,
  },
  azure: {
    issuer: import.meta.env.VITE_AZURE_SSO_AUTHORITY,
    clientId: import.meta.env.VITE_AZURE_SSO_CLIENT_ID,
  },
};

export function getProviderConfig(provider: OidcProvider): ProviderConfig {
  const config = PROVIDERS[provider];
  if (!config?.issuer || !config?.clientId) {
    throw new Error(
      `Provider "${provider}" chưa được cấu hình đủ trong .env (thiếu issuer hoặc clientId).`,
    );
  }
  return config;
}

// Dùng CHUNG 1 redirect_uri cho mọi provider — FE tự phân biệt provider nào
// đang xử lý qua giá trị lưu trong sessionStorage (xem LoginPage.tsx,
// SsoCallbackPage.tsx), không cần khai 1 path callback riêng cho từng provider.
export const OIDC_REDIRECT_URI = `${window.location.origin}/auth/sso-callback`;

export interface OidcDiscovery {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint?: string;
  jwks_uri: string;
  end_session_endpoint?: string;
}

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

export function generateRandomString(length = 32): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return base64UrlEncode(bytes);
}

export async function generatePkcePair() {
  const verifier = generateRandomString(64);
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );
  const challenge = base64UrlEncode(new Uint8Array(digest));
  return { verifier, challenge };
}

export function generateState() {
  return generateRandomString(32);
}

export function generateNonce() {
  return generateRandomString(32);
}

// Cache discovery document THEO PROVIDER — tránh gọi lại .well-known nhiều
// lần trong 1 phiên (login và logout đều cần tới discovery).
const discoveryCache: Partial<Record<OidcProvider, OidcDiscovery>> = {};

export async function getDiscovery(
  provider: OidcProvider,
): Promise<OidcDiscovery> {
  if (discoveryCache[provider]) {
    return discoveryCache[provider]!;
  }

  const { issuer } = getProviderConfig(provider);

  const response = await fetch(`${issuer}/.well-known/openid-configuration`);
  if (!response.ok) {
    throw new Error(
      `Không lấy được OIDC Discovery cho provider "${provider}" (${response.status})`,
    );
  }

  const discovery = (await response.json()) as OidcDiscovery;
  discoveryCache[provider] = discovery;
  return discovery;
}

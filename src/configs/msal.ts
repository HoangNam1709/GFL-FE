// src/configs/msal.ts
import {
  PublicClientApplication,
  type Configuration,
} from "@azure/msal-browser";

const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_SSO_CLIENT_ID,
    authority: import.meta.env.VITE_SSO_AUTHORITY,
    knownAuthorities: [import.meta.env.VITE_SSO_KNOWN_AUTHORITY],
    redirectUri: "/auth/sso-callback",
    // KHÔNG còn protocolMode ở đây với v5
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
  system: {
    protocolMode: "OIDC", // v5: chuyển sang system, không phải auth
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

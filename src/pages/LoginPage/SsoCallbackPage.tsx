import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import axios from "axios";

import {
  getDiscovery,
  OIDC_CLIENT_ID,
  OIDC_REDIRECT_URI,
} from "../../configs/oidcPkce";

import { useAuth } from "../../contexts/AuthContext";

function decodeJwt(token: string) {
  return JSON.parse(atob(token.split(".")[1]));
}

export default function SsoCallbackPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      try {
        console.log("========== SSO CALLBACK ==========");

        //--------------------------------------------------
        // Authorization Code
        //--------------------------------------------------

        const params = new URLSearchParams(window.location.search);

        const code = params.get("code");
        const state = params.get("state");

        if (!code || !state) {
          throw new Error("Thiếu authorization code hoặc state.");
        }

        //--------------------------------------------------
        // Restore PKCE
        //--------------------------------------------------

        const pendingRaw = sessionStorage.getItem("app2_pending_auth");

        sessionStorage.removeItem("app2_pending_auth");

        if (!pendingRaw) {
          throw new Error("Không tìm thấy phiên đăng nhập.");
        }

        const pending = JSON.parse(pendingRaw);

        if (pending.state !== state) {
          throw new Error("State không hợp lệ.");
        }

        //--------------------------------------------------
        // Discovery
        //--------------------------------------------------

        const discovery = await getDiscovery();

        //--------------------------------------------------
        // Exchange code -> token
        //--------------------------------------------------

        const tokenResponse = await fetch(discovery.token_endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            client_id: OIDC_CLIENT_ID,
            redirect_uri: OIDC_REDIRECT_URI,
            code_verifier: pending.verifier,
          }),
        });

        if (!tokenResponse.ok) {
          throw new Error(await tokenResponse.text());
        }

        const tokens = await tokenResponse.json();

        console.log("========== TOKEN RESPONSE ==========");
        console.log(tokens);

        if (!tokens.id_token) {
          throw new Error("Identity Provider không trả ID Token.");
        }

        if (!tokens.access_token) {
          throw new Error("Identity Provider không trả Access Token.");
        }

        console.log("========== ID TOKEN ==========");
        console.log(decodeJwt(tokens.id_token));

        console.log("========== ACCESS TOKEN ==========");
        console.log(decodeJwt(tokens.access_token));

        const exchange = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/azure/exchange`,
          {
            id_token: tokens.id_token,
            access_token: tokens.access_token,
          },
        );

        console.log("========== BACKEND ==========");
        console.log(exchange.data);

        login(exchange.data.access_token, exchange.data.user);

        window.history.replaceState({}, "", OIDC_REDIRECT_URI);

        navigate("/vehicle-in", {
          replace: true,
        });
      } catch (err: any) {
        console.error(err);

        setError(
          err?.response?.data?.detail?.message ??
            err.message ??
            "Đăng nhập thất bại.",
        );
      }
    }

    run();
  }, [login, navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {error ? (
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          {error}
        </Alert>
      ) : (
        <>
          <CircularProgress />
          <Typography>Đang xác thực SSO...</Typography>
        </>
      )}
    </Box>
  );
}

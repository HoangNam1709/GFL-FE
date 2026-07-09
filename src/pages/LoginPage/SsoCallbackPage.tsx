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

export default function SsoCallbackPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      try {

        const params = new URLSearchParams(window.location.search);

        const code = params.get("code");
        const state = params.get("state");

        if (!code || !state) {
          throw new Error("Thiếu authorization code hoặc state.");
        }

        const pendingRaw = sessionStorage.getItem("app2_pending_auth");

        sessionStorage.removeItem("app2_pending_auth");

        if (!pendingRaw) {
          throw new Error("Không tìm thấy phiên đăng nhập.");
        }

        const pending = JSON.parse(pendingRaw);

        if (pending.state !== state) {
          throw new Error("State không hợp lệ.");
        }

        const discovery = await getDiscovery();

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

        if (!tokens.id_token) {
          throw new Error("Identity Provider không trả ID Token.");
        }

        if (!tokens.access_token) {
          throw new Error("Identity Provider không trả Access Token.");
        }

        const exchange = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/azure/exchange`,
          {
            id_token: tokens.id_token,
            access_token: tokens.access_token,
          },
        );

        const { access_token, refresh_token, user } = exchange.data;

        if (!access_token || !refresh_token) {
          throw new Error("Backend không trả đủ access_token/refresh_token.");
        }

        localStorage.setItem("sso_id_token", tokens.id_token);
        // nhân khiến luồng SSO không tự refresh được như luồng dev-login.
        localStorage.setItem("refresh_token", refresh_token);

        login(access_token, user);

        window.history.replaceState({}, "", OIDC_REDIRECT_URI);

        navigate("/vehicle-in", {
          replace: true,
        });
      } catch (err: any) {
        console.error("SSO callback lỗi:", err?.message || err);

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

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";
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
    async function handleCallback() {
      try {
        console.log("========== SSO CALLBACK ==========");

        // ----------------------------------------------------
        // Lấy authorization code và state
        // ----------------------------------------------------
        const params = new URLSearchParams(window.location.search);

        const code = params.get("code");
        const state = params.get("state");

        console.log("Authorization Code:", code);
        console.log("State:", state);

        if (!code || !state) {
          setError("Thiếu code hoặc state từ Identity Provider.");
          return;
        }

        // ----------------------------------------------------
        // Lấy thông tin đã lưu trước redirect
        // ----------------------------------------------------
        const pendingRaw = sessionStorage.getItem("app2_pending_auth");

        sessionStorage.removeItem("app2_pending_auth");

        if (!pendingRaw) {
          setError(
            "Không tìm thấy phiên đăng nhập tạm (sessionStorage trống).",
          );
          return;
        }

        const pending = JSON.parse(pendingRaw);

        console.log("Pending Auth:", pending);

        if (pending.state !== state) {
          setError("State không khớp - nghi ngờ CSRF.");
          return;
        }

        // ----------------------------------------------------
        // Discovery Document
        // ----------------------------------------------------
        const discovery = await getDiscovery();

        console.log("========== OIDC DISCOVERY ==========");
        console.log(discovery);

        // ----------------------------------------------------
        // Đổi Authorization Code lấy Token
        // ----------------------------------------------------
        const tokenRes = await fetch(discovery.token_endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: OIDC_REDIRECT_URI,
            client_id: OIDC_CLIENT_ID,
            code_verifier: pending.verifier,
          }),
        });

        if (!tokenRes.ok) {
          const detail = await tokenRes.text();
          throw new Error(`Đổi code lấy token thất bại:\n${detail}`);
        }

        const tokenData = await tokenRes.json();

        console.log("========== TOKEN RESPONSE ==========");
        console.log(tokenData);

        console.log("Access Token:");
        console.log(tokenData.access_token);

        console.log("ID Token:");
        console.log(tokenData.id_token);

        // ----------------------------------------------------
        // Decode Access Token
        // ----------------------------------------------------
        if (tokenData.access_token) {
          const accessPayload = JSON.parse(
            atob(tokenData.access_token.split(".")[1]),
          );

          console.log("========== ACCESS TOKEN ==========");
          console.log(accessPayload);

          console.log("ACCESS aud =", accessPayload.aud);
          console.log("ACCESS azp =", accessPayload.azp);
          console.log("ACCESS iss =", accessPayload.iss);
          console.log("ACCESS sub =", accessPayload.sub);
        }

        // ----------------------------------------------------
        // Decode ID Token
        // ----------------------------------------------------
        if (tokenData.id_token) {
          const idPayload = JSON.parse(atob(tokenData.id_token.split(".")[1]));

          console.log("========== ID TOKEN ==========");
          console.log(idPayload);

          console.log("ID aud =", idPayload.aud);
          console.log("ID azp =", idPayload.azp);
          console.log("ID iss =", idPayload.iss);
          console.log("ID sub =", idPayload.sub);
        }

        // ----------------------------------------------------
        // Tạm thời gửi Access Token lên Backend
        // ----------------------------------------------------
        console.log("========== SEND TOKEN TO BACKEND ==========");
        console.log("Sending ID Token");

        const exchangeRes = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/azure/exchange`,
          {
            azure_access_token: tokenData.id_token,
          },
        );

        console.log("========== BACKEND RESPONSE ==========");
        console.log(exchangeRes.data);

        const { access_token, user } = exchangeRes.data;

        login(access_token, user);

        window.history.replaceState({}, "", OIDC_REDIRECT_URI);

        navigate("/vehicle-in", {
          replace: true,
        });
      } catch (err: any) {
        console.error("========== SSO ERROR ==========");
        console.error(err);

        if (err.response) {
          console.error("Response:", err.response.data);
        }

        setError(
          err.response?.data?.detail?.message ||
            err.message ||
            "Đăng nhập SSO thất bại.",
        );
      }
    }

    handleCallback();
  }, [login, navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
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
          <Typography>Đang xác thực qua SSO...</Typography>
        </>
      )}
    </Box>
  );
}

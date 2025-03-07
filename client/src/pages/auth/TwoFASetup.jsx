import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TwoFASetup() {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchQRCode() {
      try {
        const response = await axios.get("/api/auth/2fa/setup", {
          withCredentials: true,
        });
        setQrCode(response.data.qrCodeDataURL);
      } catch (error) {
        console.error("Error fetching QR code", error);
      } finally {
        setLoading(false);
      }
    }
    fetchQRCode();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="sm">
      <Box mt={5} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Set Up 2FA
        </Typography>
        {qrCode ? (
          <>
            <Typography variant="body1">
              Scan the QR code below using your authenticator app:
            </Typography>
            <Box mt={2} display="flex" justifyContent="center">
              <img
                src={qrCode}
                alt="TOTP QR Code"
                style={{ maxWidth: "100%" }}
              />
            </Box>
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/2fa/verify")}
              >
                Verify 2FA Code
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="body1">
            Unable to load QR Code. Please try again.
          </Typography>
        )}
      </Box>
    </Container>
  );
}

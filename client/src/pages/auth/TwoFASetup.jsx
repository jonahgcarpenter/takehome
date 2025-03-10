import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Button,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/**
 * TwoFASetup Component - Handles initial two-factor authentication setup
 * Displays QR code for users to scan with their authenticator app
 */
export default function TwoFASetup() {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /**
   * Fetches QR code for 2FA setup on component mount
   */
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

  // Loading state
  if (loading)
    return (
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="primary" />
      </Container>
    );

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {/* Setup Form Container */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: "center",
          backgroundColor: "#2C2C2C",
          color: "#eee",
          borderRadius: 2,
          width: "100%",
          maxWidth: 400,
        }}
      >
        {/* Page Title */}
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "primary.main", fontWeight: "bold" }}
        >
          Set Up 2FA
        </Typography>

        {/* QR Code Display Section */}
        {qrCode ? (
          <>
            <Typography variant="body1" sx={{ color: "#ccc" }}>
              Scan the QR code below using your authenticator app:
            </Typography>
            <Box mt={2} display="flex" justifyContent="center">
              <img
                src={qrCode}
                alt="TOTP QR Code"
                style={{
                  maxWidth: "100%",
                  backgroundColor: "#fff",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              />
            </Box>
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/2fa/verify")}
                sx={{ mt: 2 }}
              >
                Verify 2FA Code
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="body1" sx={{ color: "#f44336" }}>
            Unable to load QR Code. Please try again.
          </Typography>
        )}
      </Paper>
    </Container>
  );
}

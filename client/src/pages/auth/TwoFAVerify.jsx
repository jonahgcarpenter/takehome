import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TwoFAVerify() {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      // Ensure credentials are included so the session cookie is sent
      const response = await axios.post(
        "/api/auth/2fa/verify",
        { token },
        { withCredentials: true },
      );
      setMessage(response.data.message);
      // On successful verification, redirect to the dashboard (protected route)
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Verification failed");
    }
  };

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
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "primary.main", fontWeight: "bold" }}
        >
          2FA Verification
        </Typography>
        <form onSubmit={handleVerify}>
          <TextField
            label="Enter 2FA Code"
            variant="outlined"
            fullWidth
            margin="normal"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            inputProps={{ maxLength: 6 }}
            sx={{
              backgroundColor: "#333",
              borderRadius: 1,
              input: { color: "#fff" },
              label: { color: "#ccc" },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Verify
          </Button>
        </form>
        {message && (
          <Typography variant="body1" color="error" mt={2}>
            {message}
          </Typography>
        )}
      </Paper>
    </Container>
  );
}

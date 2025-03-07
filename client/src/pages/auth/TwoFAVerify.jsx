import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button } from "@mui/material";
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
    <Container maxWidth="sm">
      <Box mt={5} textAlign="center">
        <Typography variant="h4" gutterBottom>
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
          />
          <Button type="submit" variant="contained" color="primary">
            Verify
          </Button>
        </form>
        {message && (
          <Typography variant="body1" color="error" mt={2}>
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
}

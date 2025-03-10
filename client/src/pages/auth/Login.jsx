import React from "react";
import { Button, Container, Typography, Box, Paper } from "@mui/material";

export default function Login() {
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
          Login
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href="/api/auth/login"
          sx={{ mt: 2 }}
        >
          Login with Google
        </Button>
      </Paper>
    </Container>
  );
}

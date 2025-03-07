import React from "react";
import { Button, Container, Typography, Box } from "@mui/material";

export default function Login() {
  return (
    <Container maxWidth="sm">
      <Box mt={5} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <Button variant="contained" color="primary" href="/api/auth/login">
          Login with Google
        </Button>
      </Box>
    </Container>
  );
}

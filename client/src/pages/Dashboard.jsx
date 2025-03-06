import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Button,
} from "@mui/material";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get("/api/me", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box mt={5} textAlign="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Box mt={5} textAlign="center">
          <Typography variant="h6">User data not available.</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box mt={5} textAlign="center">
        <Avatar
          alt={user.displayName}
          src={user.profilePhoto}
          sx={{ width: 100, height: 100, margin: "0 auto" }}
        />
        <Typography variant="h4" gutterBottom>
          Welcome, {user.displayName}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 2 }}
          onClick={() => {
            window.location.href = "/api/auth/logout";
          }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
}

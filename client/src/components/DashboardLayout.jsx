import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Paper, Typography, Box, Button } from "@mui/material";
import axios from "axios";
import Navbar from "./Navbar";
import useUserSocket from "../hooks/websockets/useUserSockets";

// Import role-specific dashboard pages:
import Logs from "../pages/admin/Logs";
import UserManagement from "../pages/admin/UserManagement";
import Buy from "../pages/customer/Buy";
import Orders from "../pages/customer/Orders";
import InventoryManagement from "../pages/staff/InventoryManagement";
import OrderManagement from "../pages/staff/OrderManagement";

/**
 * DashboardLayout Component - Main layout component for the dashboard
 * Handles routing, user authentication, and role-based access control
 */
export default function DashboardLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /**
   * Handles user updates from websocket
   * @param {Object} updatedUser - Updated user information
   */
  const handleUserUpdate = useCallback(
    (updatedUser) => {
      if (updatedUser._id === user?._id) {
        setUser(updatedUser);
        // Redirect to new default route if role changed
        const newDefaultRoute = getDefaultRoute(updatedUser.role);
        navigate(`/dashboard/${newDefaultRoute}`);
      }
    },
    [user, navigate],
  );

  // Initialize websocket connection
  useUserSocket({ onUsersUpdated: handleUserUpdate });

  /**
   * Fetches user information on component mount
   */
  useEffect(() => {
    axios
      .get("/api/users/me", { withCredentials: true })
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
        if (err.response?.status === 401) {
          navigate('/');
        }
        setLoading(false);
      });
  }, [navigate]);

  /**
   * Determines default route based on user role
   * @param {string} role - User role
   * @returns {string} Default route path
   */
  const getDefaultRoute = (role) => {
    switch (role) {
      case "Admin":
        return "usermanagement";
      case "Customer":
        return "buy";
      case "Staff":
        return "inventorymanagement";
      default:
        return "";
    }
  };

  // Show loading state
  if (loading) {
    return <div>Loading user info...</div>;
  }

  /**
   * Configure role-based routing
   */
  let roleRoutes;
  let navLinks = [];
  
  // Admin Routes
  if (user.role === "Admin") {
    navLinks = [
      { key: "usermanagement", label: "User Management" },
      { key: "logs", label: "Logs" },
      { key: "inventorymanagement", label: "Inventory Management" },
      { key: "ordermanagement", label: "Order Management" },
    ];
    roleRoutes = (
      <>
        <Route path="usermanagement" element={<UserManagement />} />
        <Route path="logs" element={<Logs />} />
        <Route path="inventorymanagement" element={<InventoryManagement />} />
        <Route path="ordermanagement" element={<OrderManagement />} />

        {/* Default admin route */}
        <Route index element={<Navigate to="usermanagement" replace />} />
      </>
    );
  } 
  // Customer Routes
  else if (user.role === "Customer") {
    navLinks = [
      { key: "buy", label: "Buy" },
      { key: "orders", label: "Orders" },
    ];
    roleRoutes = (
      <>
        <Route path="buy" element={<Buy />} />
        <Route path="orders" element={<Orders />} />
        {/* Default customer route */}
        <Route index element={<Navigate to="buy" replace />} />
      </>
    );
  } 
  // Staff Routes
  else if (user.role === "Staff") {
    navLinks = [
      { key: "inventorymanagement", label: "Inventory Management" },
      { key: "ordermanagement", label: "Order Management" },
    ];
    roleRoutes = (
      <>
        <Route path="inventorymanagement" element={<InventoryManagement />} />
        <Route path="ordermanagement" element={<OrderManagement />} />
        {/* Default staff route */}
        <Route index element={<Navigate to="inventorymanagement" replace />} />
      </>
    );
  } 
  // Fallback Routes
  else {
    // Fallback in case user role is unknown
    roleRoutes = (
      <Route index element={<div>No dashboard available for your role.</div>} />
    );
  }

  return (
    <div>
      {/* Navigation Bar */}
      <Navbar
        photo={user.profilePhoto}
        links={navLinks}
        activeLink={window.location.pathname.split("/").pop()}
        onLinkChange={(link) => navigate(`/dashboard/${link}`)}
      />

      {/* Main Content Area */}
      <div style={{ padding: "20px" }}>
        <Routes>
          {/* Role-based Routes */}
          {roleRoutes}

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="60vh"
              >
                <Paper
                  elevation={3}
                  sx={{
                    padding: 4,
                    backgroundColor: "#2C2C2C",
                    color: "white",
                    maxWidth: "500px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography variant="h6" align="center">
                    404 Page not found
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      navigate(`/dashboard/${getDefaultRoute(user.role)}`)
                    }
                  >
                    Back to where you belong
                  </Button>
                </Paper>
              </Box>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

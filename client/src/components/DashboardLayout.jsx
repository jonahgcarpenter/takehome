import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

// Import role-specific dashboard pages:
import Logs from "../pages/admin/Logs";
import UserManagement from "../pages/admin/UserManagement";
import Buy from "../pages/customer/Buy";
import Orders from "../pages/customer/Orders";
import InventoryManagement from "../pages/staff/InventoryManagement";
import OrderManagement from "../pages/staff/OrderManagement";

export default function DashboardLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user details from the backend using axios
  useEffect(() => {
    axios
      .get("/api/users/me", { withCredentials: true })
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading user info...</div>;
  }

  // Conditionally define routes based on the user's role.
  let roleRoutes;
  let navLinks = [];
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
  } else if (user.role === "Customer") {
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
  } else if (user.role === "Staff") {
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
  } else {
    // Fallback in case user role is unknown
    roleRoutes = (
      <Route index element={<div>No dashboard available for your role.</div>} />
    );
  }

  return (
    <div>
      <Navbar
        photo={user.profilePhoto}
        links={navLinks}
        activeLink={window.location.pathname.split("/").pop()}
        onLinkChange={(link) => navigate(`/dashboard/${link}`)}
      />
      <div style={{ padding: "20px" }}>
        <Routes>
          {roleRoutes}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </div>
    </div>
  );
}

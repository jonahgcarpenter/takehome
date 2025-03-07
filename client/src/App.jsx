import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import TwoFASetup from "./pages/auth/TwoFASetup";
import TwoFAVerify from "./pages/auth/TwoFAVerify";

import AdminDashboard from "./pages/dashboards/AdminDashboard";
import CustomerDashboard from "./pages/dashboards/CustomerDashboard";
import StaffDashboard from "./pages/dashboards/StaffDashboard";

const useAuth = () => {
  return { role: "customer" };
};

export default function App() {
  const { role } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/2fa/setup" element={<TwoFASetup />} />
        <Route path="/2fa/verify" element={<TwoFAVerify />} />

        {role === "admin" && (
          <Route path="/dashboard" element={<AdminDashboard />} />
        )}
        {role === "staff" && (
          <Route path="/dashboard" element={<StaffDashboard />} />
        )}
        {role === "customer" && (
          <Route path="/dashboard" element={<CustomerDashboard />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

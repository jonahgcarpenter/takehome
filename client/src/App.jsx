import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import TwoFASetup from "./pages/auth/TwoFASetup";
import TwoFAVerify from "./pages/auth/TwoFAVerify";
import DashboardLayout from "./components/DashboardLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/2fa/setup" element={<TwoFASetup />} />
        <Route path="/2fa/verify" element={<TwoFAVerify />} />

        <Route path="/dashboard/*" element={<DashboardLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

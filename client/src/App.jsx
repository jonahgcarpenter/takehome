import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import TwoFASetup from "./components/TwoFASetup";
import TwoFAVerify from "./components/TwoFAVerify";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/2fa/setup" element={<TwoFASetup />} />
        <Route path="/2fa/verify" element={<TwoFAVerify />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

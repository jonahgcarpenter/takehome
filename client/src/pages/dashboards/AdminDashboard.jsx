import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import Navbar from "../../components/Navbar";

const adminLinks = [
  { label: "Admin", key: "admin" },
  { label: "Inventory", key: "inventory" },
  { label: "Orders", key: "orders" },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(adminLinks[0].key);

  const renderContent = () => {
    switch (activeTab) {
      case "admin":
        return <div>Admin Content</div>;
      case "inventory":
        return <div>Inventory Content</div>;
      case "orders":
        return <div>Orders Content</div>;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Navbar
        links={adminLinks}
        activeLink={activeTab}
        onLinkChange={setActiveTab}
      />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {renderContent()}
      </Container>
    </Box>
  );
};

export default AdminDashboard;

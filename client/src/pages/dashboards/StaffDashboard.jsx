import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import Navbar from "../../components/Navbar";

const staffLinks = [
  { label: "Inventory", key: "inventory" },
  { label: "Orders", key: "orders" },
];

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState(staffLinks[0].key);

  const renderContent = () => {
    switch (activeTab) {
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
        links={staffLinks}
        activeLink={activeTab}
        onLinkChange={setActiveTab}
      />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {renderContent()}
      </Container>
    </Box>
  );
};

export default StaffDashboard;

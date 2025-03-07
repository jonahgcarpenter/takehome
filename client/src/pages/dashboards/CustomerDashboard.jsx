import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import Navbar from "../../components/Navbar";

const customerLinks = [
  { label: "Buy", key: "buy" },
  { label: "Orders", key: "orders" },
];

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState(customerLinks[0].key);

  const renderContent = () => {
    switch (activeTab) {
      case "buy":
        return <div>Buy Content</div>;
      case "orders":
        return <div>Orders Content</div>;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Navbar
        links={customerLinks}
        activeLink={activeTab}
        onLinkChange={setActiveTab}
      />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {renderContent()}
      </Container>
    </Box>
  );
};

export default CustomerDashboard;

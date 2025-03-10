import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Avatar,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";

const Navbar = ({ photo, links, activeLink, onLinkChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Perform logout action (e.g., redirect to logout endpoint)
    window.location.href = "/api/auth/logout";
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#2C2C2C",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
      }}
    >
      <Toolbar sx={{ minHeight: "64px" }}>
        <Avatar
          src={photo}
          alt="Profile Photo"
          sx={{
            mr: 2,
            cursor: "pointer",
            border: "2px solid #555",
          }}
          onClick={handleAvatarClick}
        />
        <Box sx={{ flexGrow: 1 }} />
        {links.map((link) => (
          <Button
            key={link.key}
            onClick={() => onLinkChange(link.key)}
            sx={{
              color: activeLink === link.key ? "primary.main" : "#eee",
              textTransform: "none",
              fontSize: "1rem",
              mx: 1,
              transition: "color 0.3s ease",
              "&:hover": {
                color: "#bbb",
              },
            }}
          >
            {link.label}
          </Button>
        ))}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              backgroundColor: "#2C2C2C",
              color: "#eee",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
            },
          }}
        >
          <MenuItem
            onClick={() => {
              handleLogout();
              handleMenuClose();
            }}
            sx={{
              "&:hover": {
                backgroundColor: "#3A3A3A",
              },
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

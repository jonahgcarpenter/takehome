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
    <AppBar position="static">
      <Toolbar>
        <Avatar
          src={photo}
          alt="Profile Photo"
          sx={{ mr: 2, cursor: "pointer" }}
          onClick={handleAvatarClick}
        />
        <Box sx={{ flexGrow: 1 }} />
        {links.map((link) => (
          <Button
            key={link.key}
            color={activeLink === link.key ? "secondary" : "inherit"}
            onClick={() => onLinkChange(link.key)}
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
        >
          <MenuItem
            onClick={() => {
              handleLogout();
              handleMenuClose();
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

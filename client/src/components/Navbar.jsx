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

/**
 * Navigation Bar Component - Displays top navigation with user avatar and navigation links
 * @param {Object} props
 * @param {string} props.photo - URL of user's profile photo
 * @param {Array<Object>} props.links - Array of navigation link objects
 * @param {string} props.links[].key - Unique identifier for the link
 * @param {string} props.links[].label - Display text for the link
 * @param {string} props.activeLink - Key of the currently active link
 * @param {Function} props.onLinkChange - Callback function when link is clicked
 */
const Navbar = ({ photo, links, activeLink, onLinkChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  /**
   * Handles click event on avatar to open menu
   * @param {Object} event - Click event object
   */
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Closes the user menu
   */
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * Handles user logout action
   */
  const handleLogout = () => {
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
        {/* User Avatar Section */}
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
        {/* Navigation Links Section */}
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
        {/* User Menu Section */}
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

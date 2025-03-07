import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const Navbar = ({ links, activeLink, onLinkChange }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
        {links.map((link) => (
          <Button
            key={link.key}
            color={activeLink === link.key ? "secondary" : "inherit"}
            onClick={() => onLinkChange(link.key)}
          >
            {link.label}
          </Button>
        ))}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

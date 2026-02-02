import React, { useState } from "react";
import {
  AppBar, Toolbar, Typography, Button, Box, Container,
  IconButton, Menu, MenuItem
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../auth/AuthContext";

const navLinks = [
  { label: "Upload", to: "/" },
  { label: "Analytics", to: "/analytics" },
  { label: "Compare", to: "/compare" },
  { label: "Reports", to: "/reports" },
];

export default function Layout({ children }) {
  const { isAuthed, logout } = useAuth();
  const nav = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Box>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          {/* Left: Logo + Title */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <img
              src={logo}
              alt="ChemViz"
              style={{
                height: 36,
                width: 36,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid rgba(255,255,255,0.35)",
              }}
            />
            <Box>
              <Typography variant="h6" sx={{ lineHeight: 1 }}>
                ChemViz
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Chemical Equipment Analytics
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop nav */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {navLinks.map((l) => (
              <Button key={l.to} color="inherit" component={Link} to={l.to}>
                {l.label}
              </Button>
            ))}
          </Box>

          {/* Desktop auth buttons */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, ml: 1 }}>
            {isAuthed ? (
              <Button color="inherit" onClick={() => { logout(); nav("/"); }}>
                Logout
              </Button>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/signup">Signup</Button>
              </>
            )}
          </Box>

          {/* Mobile hamburger */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton color="inherit" onClick={handleOpen}>
              <MenuIcon />
            </IconButton>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              {navLinks.map((l) => (
                <MenuItem
                  key={l.to}
                  onClick={() => {
                    handleClose();
                    nav(l.to);
                  }}
                >
                  {l.label}
                </MenuItem>
              ))}

              <Box sx={{ borderTop: "1px solid rgba(0,0,0,0.1)", my: 1 }} />

              {isAuthed ? (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    logout();
                    nav("/");
                  }}
                >
                  Logout
                </MenuItem>
              ) : (
                <>
                  <MenuItem onClick={() => { handleClose(); nav("/login"); }}>Login</MenuItem>
                  <MenuItem onClick={() => { handleClose(); nav("/signup"); }}>Signup</MenuItem>
                </>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {children}
      </Container>
    </Box>
  );
}

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import AccountCircle from "@mui/icons-material/AccountCircle";

import Button from "@mui/material/Button";

import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

const pages = ["Dashboard", "How It Works", "Upgrade"];

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate("/");
    }
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (page) => {
    setAnchorElNav(null);
    if (page === "Dashboard") {
      navigate("/dashboard");
    } else if (page === "Upgrade") {
      navigate("/upgrade");
    } else if (page === "How It Works") {
      navigate("/how-it-works");
    }
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#000", // Set navbar to black
        color: "#fff", // Ensure text/icons remain white
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Logo */}
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
              cursor: "pointer",
            }}
            onClick={() => navigate("/dashboard")}
          >
            IntervYOU
          </Typography>

          {/* Mobile Menu Icon */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            {/* Mobile menu items */}
            <Menu
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={() => setAnchorElNav(null)}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => {
                const normalizedPage = page.toLowerCase().replace(/\s+/g, "-");
                const isActive = normalizedPage === location.pathname;

                return (
                  <MenuItem
                    key={page}
                    onClick={() => handleCloseNavMenu(page)}
                    sx={{
                      color: isActive ? "#BB86FC" : "black",
                      fontWeight: isActive ? "bold" : "normal",
                    }}
                  >
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                );
              })}
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            IntervYOU
          </Typography>

          {/* Desktop pages */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => {
              const normalizedPage = page.toLowerCase().replace(/\s+/g, "-");
              const isActive = location.pathname == "/" + normalizedPage;
              return (
                <Button
                  key={page}
                  onClick={() => handleCloseNavMenu(page)}
                  sx={{
                    color: isActive ? "#BB86FC" : "white",
                    fontWeight: isActive ? "bold" : "normal",
                    marginLeft: "1rem",
                    position: "relative",
                    "&:hover": {
                      color: "#fff",
                      backgroundColor: "rgba(187, 134, 252, 0.1)", // Subtle hover background
                    },
                    "&:after": {
                      content: '""',
                      display: "block",
                      width: "0",
                      height: "2px",
                      background: "#BB86FC",
                      transition: "width 0.3s ease",
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                    },
                    "&:hover:after": {
                      width: "100%",
                    },
                  }}
                >
                  {page}
                </Button>
              );
            })}
          </Box>
          {/* Logout Button */}
          {/* <Button
            onClick={handleLogout}
            sx={{
              color: "#BB86FC",
              fontWeight: "bold",
              marginLeft: "1rem",
              position: "relative",
              "&:hover": {
                color: "#fff",
                backgroundColor: "rgba(187, 134, 252, 0.1)", // Subtle hover background
              },
              "&:after": {
                content: '""',
                display: "block",
                width: "0",
                height: "2px",
                background: "#BB86FC",
                transition: "width 0.3s ease",
                position: "absolute",
                bottom: 0,
                left: 0,
              },
              "&:hover:after": {
                width: "100%",
              },
            }}
          >
            Logout
          </Button> */}
          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleOpenUserMenu} color="inherit">
              <AccountCircle sx={{ fontSize: 32 }} />
            </IconButton>
            <Menu
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElUser)}
              onClose={() => setAnchorElUser(null)}
            >
              <MenuItem onClick={() => setAnchorElUser(null)}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>

          {/* User Avatar Menu */}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;

// Sidebar.js
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Drawer,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Collapse,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  ContactMail as ContactMailIcon,
  ExpandLess,
  ExpandMore,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  PersonAdd as PersonAddIcon,
  AddCircle as AddCircleIcon,
  Book as BookIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_GLOBALURL
    : process.env.REACT_APP_GLOBALURL;

const drawerWidth = 240;

const Sidebar = (props) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  // Get userId and userType from localStorage
  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userRole"); // Retrieve user type

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOptionsClick = () => {
    setOptionsOpen(!optionsOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole"); // Clear userRole on logout
    navigate("/login");
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {/* Home */}
        <ListItem button component={Link} to="/home" key="Home">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>

        {/* About
        <ListItem button component={Link} to="/about" key="About">
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary="About" />
        </ListItem> */}

        {/* Contact */}
        {/* <ListItem button component={Link} to="/contact" key="Contact">
          <ListItemIcon>
            <ContactMailIcon />
          </ListItemIcon>
          <ListItemText primary="Contact" />
        </ListItem> */}

        {/* Options */}
        <ListItem button onClick={handleOptionsClick}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Options" />
          {optionsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={optionsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {userType !== "customer" && (
              <>
                {/* <ListItem button component={Link} to="/bookings" sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <BookIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Bookings" />
                </ListItem>
                <ListItem button component={Link} to="/centres" sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <LocationOnIcon />
                  </ListItemIcon>
                  <ListItemText primary="Find Centres" />
                </ListItem> */}
                <Divider />
              </>
            )}
            {userId ? (
              <ListItem
                button
                component={Link}
                to="/userProfile"
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
            ) : (
              <ListItem button component={Link} to="/login" sx={{ pl: 4 }}>
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItem>
            )}
            {userType === "manager" && (
              <>
                <Divider />
                <ListItem button component={Link} to="/addSport" sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <AddCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Add Sport" />
                </ListItem>
                <ListItem
                  button
                  component={Link}
                  to="/addCentre"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <AddCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Add Centre" />
                </ListItem>

                <ListItem button component={Link} to="/addCourt" sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <AddCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Add Court" />
                </ListItem>
              </>
            )}
          </List>
        </Collapse>

        {/* If user is not logged in, show Login and Register */}
        {!userId && (
          <>
            <ListItem button component={Link} to="/login">
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/register">
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}

        {/* If user is logged in, show Logout button */}
        {userId && (
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* AppBar at the top */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          background: "linear-gradient(45deg, #0d6efd, #6610f2)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Toolbar>
          {/* Menu button for mobile view */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }} // Show only on small screens
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/home"
            sx={{
              textDecoration: "none",
              color: "#fff",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
          >
            Sportify
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile view */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile
        sx={{
          display: { xs: "block", sm: "none" }, // Show on extra-small screens
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      {/* Drawer for desktop view */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" }, // Hide on extra-small screens
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Main content area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  );
};

export default Sidebar;

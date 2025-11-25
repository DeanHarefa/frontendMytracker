// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Link,
//   useLocation,
// } from "react-router-dom";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   Box,
//   IconButton,
//   Drawer,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
// } from "@mui/material";

// import MenuIcon from "@mui/icons-material/Menu";
// import LogoutIcon from "@mui/icons-material/Logout";

// import { useState } from "react";

// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import Login from "./pages/Login";
// import FinancialTracker from "./pages/FinanancialTracker";

// function AppContent() {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const location = useLocation();

//   // HIDE NAVBAR DI LOGIN & REGISTER
//   const hideNavbar =
//     location.pathname === "/" || location.pathname === "/register";

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     window.location.href = "/";
//   };

//   const menuItems = [
//     { text: "Job Tracker", path: "/dashboard" },
//     { text: "Financial Tracker", path: "/financial-tracker" },
//   ];

//   const drawer = (
//     <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
//       <Typography variant="h6" sx={{ my: 2 }}>
//         My Tracker
//       </Typography>

//       <List>
//         {menuItems.map((item) => {
//           const isActive = location.pathname === item.path;

//           return (
//             <ListItem key={item.text} disablePadding>
//               <ListItemButton
//                 component={Link}
//                 to={item.path}
//                 sx={{
//                   backgroundColor: isActive
//                     ? "rgba(0,0,0,0.1)"
//                     : "transparent",
//                 }}
//               >
//                 <ListItemText primary={item.text} />
//               </ListItemButton>
//             </ListItem>
//           );
//         })}

//         {/* LOGOUT drawer */}
//         <ListItem disablePadding>
//           <ListItemButton onClick={handleLogout}>
//             <LogoutIcon color="error" style={{ marginRight: 8 }} />
//           </ListItemButton>
//         </ListItem>
//       </List>
//     </Box>
//   );

//   return (
//     <>
//       {/* NAVBAR */}
//       {!hideNavbar && (
//         <AppBar position="static" component="nav">
//           <Toolbar>
//             <Typography variant="h6" sx={{ flexGrow: 1 }}>
//               My Tracker
//             </Typography>

//             {/* MENU DESKTOP */}
//             <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2 }}>
//               {menuItems.map((item) => {
//                 const isActive = location.pathname === item.path;

//                 return (
//                   <Button
//                     key={item.text}
//                     component={Link}
//                     to={item.path}
//                     color="inherit"
//                     sx={{
//                       borderBottom: isActive
//                         ? "2px solid white"
//                         : "2px solid transparent",
//                       borderRadius: 0,
//                       paddingBottom: "4px",
//                     }}
//                   >
//                     {item.text}
//                   </Button>
//                 );
//               })}

//               {/* LOGOUT ICON */}
//               <IconButton
//                 color="inherit"
//                 onClick={handleLogout}
//                 title="Logout"
//               >
//                 <LogoutIcon color="error" />
//               </IconButton>
//             </Box>

//             {/* MENU MOBILE ICON */}
//             <IconButton
//               color="inherit"
//               edge="end"
//               sx={{ display: { sm: "none" } }}
//               onClick={handleDrawerToggle}
//             >
//               <MenuIcon />
//             </IconButton>
//           </Toolbar>
//         </AppBar>
//       )}

//       {/* DRAWER MOBILE */}
//       <Drawer
//         anchor="right"
//         open={mobileOpen}
//         onClose={handleDrawerToggle}
//         sx={{ display: { sm: "none", xs: "block" } }}
//       >
//         {drawer}
//       </Drawer>

//       {/* ROUTES */}
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/financial-tracker" element={<FinancialTracker />} />
//       </Routes>
//     </>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <AppContent />
//     </BrowserRouter>
//   );
// }


import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Switch,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LogoutIcon from "@mui/icons-material/Logout";

import { useState, useMemo, useEffect } from "react";

import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import FinancialTracker from "./pages/FinanancialTracker";

// =============================
// MAIN CONTENT COMPONENT
// =============================
function AppContent() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const location = useLocation();
  const theme = useTheme();

  // LOAD THEME FROM LOCAL STORAGE
  const [mode, setMode] = useState(localStorage.getItem("mode") || "light");

  const toggleColorMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("mode", newMode);
    window.location.reload(); // refresh so theme applied cleanly
  };

  // HIDE NAVBAR AT LOGIN & REGISTER
  const hideNavbar =
    location.pathname === "/" || location.pathname === "/register";

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // USER MENU
  const handleOpenUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const menuItems = [
    { text: "Job Tracker", path: "/dashboard" },
    { text: "Financial Tracker", path: "/financial-tracker" },
  ];

  // DRAWER (MOBILE)
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        My Tracker
      </Typography>

      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  bgcolor: isActive ? "rgba(0,0,0,0.1)" : "transparent",
                  borderLeft: isActive ? "4px solid #1976d2" : "none",
                }}
              >
                <ListItemText
                  primary={item.text}
                  sx={{
                    color: isActive ? "#1976d2" : "inherit",
                    fontWeight: isActive ? "bold" : "normal",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}

        {/* Logout di drawer mobile */}
        <ListItemButton onClick={handleLogout}>
          <LogoutIcon color="error" style={{ marginRight: 8 }} />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <>
      <CssBaseline />

      {/* NAVBAR */}
      {!hideNavbar && (
        <AppBar position="fixed" component="nav" elevation={3}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              My Tracker
            </Typography>

            {/* MENU DESKTOP */}
            <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2 }}>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <Button
                    key={item.text}
                    component={Link}
                    to={item.path}
                    color="inherit"
                    sx={{
                      position: "relative",
                      fontWeight: isActive ? "bold" : "normal",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        width: isActive ? "100%" : "0%",
                        height: "3px",
                        bottom: 0,
                        left: 0,
                        backgroundColor: "currentColor",
                        transition: "0.3s",
                      },
                      "&:hover::after": {
                        width: "100%",
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                );
              })}

              {/* THEME TOGGLE */}
              <IconButton color="inherit" onClick={toggleColorMode}>
                {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
              </IconButton>

              {/* AVATAR DROPDOWN */}
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User" src="" />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseUserMenu}
                sx={{ mt: 1 }}
              >
                <MenuItem onClick={handleCloseUserMenu}>Profile</MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>Settings</MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon color="error" sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </Box>

            {/* MENU MOBILE BUTTON */}
            <IconButton
              color="inherit"
              edge="end"
              sx={{ display: { sm: "none" } }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* OFFSET FOR FIXED NAVBAR */}
      {!hideNavbar && <Box sx={{ height: "70px" }} />}

      {/* DRAWER MOBILE */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { sm: "none", xs: "block" } }}
      >
        {drawer}
      </Drawer>

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/financial-tracker" element={<FinancialTracker />} />
      </Routes>
    </>
  );
}

// =============================
// MAIN WRAPPER WITH THEME
// =============================
export default function App() {
  const storedMode = localStorage.getItem("mode") || "light";

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: storedMode,
        },
      }),
    [storedMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

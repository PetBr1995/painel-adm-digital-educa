import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  CssBaseline,
  AppBar,
  Toolbar,
  InputBase,
  CardMedia,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { styled, alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import {
  AirplaneTicket,
  Book,
  Category,
  Dashboard,
  Notifications,
  Person,
  PersonAdd,
} from "@mui/icons-material";
import theme from "../../theme/theme";
import Swal from "sweetalert2";

const drawerWidth = 240;
const miniDrawerWidth = 60;

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(2),
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "20ch",
      "&:focus": {
        width: "28ch",
      },
    },
  },
}));

const Home = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const navigate = useNavigate();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDrawerOpen((prev) => !prev);
    }
  };

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard sx={{ color: theme.palette.primary.light }} />, path: "/dashboard" },
    { text: "Cursos", icon: <SchoolIcon sx={{ color: theme.palette.primary.light }} />, path: "/cursos" },
    { text: "Instrutores", icon: <PersonAdd sx={{ color: theme.palette.primary.light }} />, path: "/instrutores" },
    { text: "Categorias", icon: <Category sx={{ color: theme.palette.primary.light }} />, path: "/categorias" },
    { text: "Planos", icon: <AirplaneTicket sx={{ color: theme.palette.primary.light }} />, path: "/planos" },
  ];

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar />
      <Divider />
      <List sx={{ cursor: "pointer" }}>
        {menuItems.map((item) => (
          <ListItem button key={item.text} onClick={() => navigate(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            {(drawerOpen || isMobile) && <ListItemText primary={item.text} />}
          </ListItem>
        ))}
      </List>

      {/* Espaço automático para empurrar o Logoff para o fim */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Logoff */}
      <Divider />
      <List sx={{ cursor: "pointer" }}>
        <ListItem
          button
          onClick={() => {
            Swal.fire({
              title: "Tem certeza que deseja sair?",
              text: "Você será deslogado do sistema.",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#d33",
              cancelButtonColor: "#3085d6",
              confirmButtonText: "Sim, sair",
              cancelButtonText: "Cancelar",
            }).then((result) => {
              if (result.isConfirmed) {
                localStorage.removeItem("token"); // ou outro nome do seu token
                navigate("/");
              }
            });
          }}
        >
          <ListItemIcon>
            <Person sx={{ color: theme.palette.error.main }} />
          </ListItemIcon>
          {(drawerOpen || isMobile) && (
            <ListItemText
              primary="Sair"
              primaryTypographyProps={{ color: "error" }}
            />
          )}
        </ListItem>
      </List>
    </Box>
  );


  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#1a1a1a", // Cor escura
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            width: "100%",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 1,
                transform: drawerOpen && !isMobile ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease-in-out",
              }}
            >
              <MenuIcon />
            </IconButton>
            <CardMedia
              component="img"
              height="40"
              image="https://i.imgur.com/fumQcmz.png"
              alt="Logo"
              sx={{ maxWidth: "150px" }}
            />
          </Box>

          <Search sx={{ flex: 1, maxWidth: "300px" }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Buscar…" inputProps={{ "aria-label": "search" }} />
          </Search>

          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton color="inherit">
              <Notifications />
            </IconButton>
            <IconButton color="inherit">
              <Person />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          open={drawerOpen}
          sx={{
            width: drawerOpen ? drawerWidth : miniDrawerWidth,
            flexShrink: 0,
            whiteSpace: "nowrap",
            "& .MuiDrawer-paper": {
              width: drawerOpen ? drawerWidth : miniDrawerWidth,
              transition: "width 0.3s",
              overflowX: "hidden",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Home;

import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
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
  Stack,
  Avatar,
  Tooltip,
  Paper,
  alpha,
} from "@mui/material";
import {
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
  Dashboard,
  School,
  PersonAdd,
  AirplaneTicket,
  Person3,
  Category,
  LogoutRounded,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Swal from "sweetalert2";
import theme from "../../theme/theme";

const drawerWidth = 260;
const miniDrawerWidth = 70;

// DRAWER OTIMIZADO (SEM BLUR PESADO = SEM TRAVAR)
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    borderRight: `1px solid ${alpha(theme.palette.primary.dark, 0.2)}`,
    overflowX: "hidden",
    boxShadow: "8px 0 30px rgba(0,0,0,0.3)",
    // OTIMIZAÇÃO GPU
    transform: "translateZ(0)",
    backfaceVisibility: "hidden",
    willChange: "width",
    transition: theme.transitions.create("width", {
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      duration: 400,
    }),
  },
}));

// ITEM DO MENU COM HOVER FLUIDO
const StyledListItem = styled(ListItem)(({ theme }) => ({
  margin: "6px 10px",
  borderRadius: 14,
  cursor: "pointer",
  transition: "all 0.25s ease",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.light, 0.15),
    transform: "translateX(6px)",
    boxShadow: `0 0 8px ${alpha(theme.palette.primary.light, 0.4)}`,
  },
  "&.active": {
    backgroundColor: alpha(theme.palette.primary.light, 0.25),
    borderLeft: `4px solid ${theme.palette.primary.light}`,
    "& .MuiListItemText-primary": {
      fontWeight: 700,
      color: "#ffffff",
    },
  },
}));

const Home = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { text: "Conteúdos", icon: <School />, path: "/cursos" },
    { text: "Instrutores", icon: <PersonAdd />, path: "/instrutores" },
    { text: "Planos", icon: <AirplaneTicket />, path: "/planos" },
    { text: "Usuários", icon: <Person3 />, path: "/usuarios" },
    { text: "Categorias", icon: <Category />, path: "/categorias" },
  ];

  const toggleDrawer = () => setDrawerOpen(prev => !prev);

  const drawer = (
    <Box sx={{ position: "relative", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* EFEITO DE GLASS LEVE (SEM TRAVAR) */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: -1,
          opacity: drawerOpen ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* HEADER COM LOGO */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: drawerOpen ? "space-between" : "center",
          alignItems: "center",
          bgcolor: "transparent",
        }}
      >
        {drawerOpen && (
          <Box
            component="img"
            src="https://i.imgur.com/fumQcmz.png"
            alt="Logo"
            sx={{
              height: 48,
              filter: "brightness(1.3) drop-shadow(0 2px 8px rgba(99,102,241,0.4))",
              transition: "all 0.3s ease",
              "&:hover": { filter: "brightness(1.5)" },
            }}
          />
        )}
        <IconButton
          onClick={toggleDrawer}
          sx={{
            color: "white",
            bgcolor: alpha(theme.palette.secondary.light, 0.5),
            "&:hover": { bgcolor: alpha(theme.palette.secondary.light, 0.8), transform: "scale(1.1)" },
            borderRadius: 2,
            p: 1.3,
            transition: "all 0.3s ease",
          }}
        >
          {drawerOpen ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: alpha(theme.palette.primary.dark, 0.2) }} />

      {/* MENU */}
      <List sx={{ flex: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <StyledListItem
            key={item.text}
            onClick={() => navigate(item.path)}
            className={location.pathname === item.path ? "active" : ""}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === item.path ? theme.palette.primary.light : "#ffffff",
                minWidth: drawerOpen ? 48 : "auto",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {drawerOpen && (
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  color: location.pathname === item.path ? "#6366f1" : "#e0e7ff",
                }}
              />
            )}
          </StyledListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: alpha(theme.palette.primary.dark, 0.2) }} />

      {/* RODAPÉ */}
      <Box sx={{ p: 2 }}>
        {drawerOpen && (
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 2,
              border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
              borderRadius: 3,
              backdropFilter: "blur(12px)",
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.light,
                  width: 44,
                  height: 44,
                  fontWeight: 700,
                  color:theme.palette.secondary.dark
                }}
              >
                A
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={700} color="#e0e7ff">
                  Admin User
                </Typography>
                <Typography variant="caption" sx={{color:theme.palette.primary.light}}>
                  admin@educa.com
                </Typography>
              </Box>
            </Stack>
          </Paper>
        )}

        <Tooltip title={drawerOpen ? "Sair do sistema" : ""} placement="right">
          <StyledListItem
            onClick={() => {
              Swal.fire({
                title: "Sair do sistema?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#ef4444",
                cancelButtonColor: "#6366f1",
                confirmButtonText: "Sair",
                cancelButtonText: "Cancelar",
                background: "#1E2A46",
                color: "#e0e7ff",
                customClass: { popup: "animate__animated animate__fadeIn" },
              }).then((result) => {
                if (result.isConfirmed) {
                  localStorage.removeItem("token");
                  navigate("/");
                }
              });
            }}
          >
            <ListItemIcon sx={{ color: "#ef4444", minWidth: drawerOpen ? 48 : "auto", justifyContent: "center" }}>
              <LogoutRounded />
            </ListItemIcon>
            {drawerOpen && (
              <ListItemText
                primary="Sair"
                primaryTypographyProps={{ color: "#ef4444", fontWeight: 600 }}
              />
            )}
          </StyledListItem>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* DRAWER PERFEITO */}
      <StyledDrawer
        variant="permanent"
        open={drawerOpen}
        sx={{
          width: drawerOpen ? drawerWidth : miniDrawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerOpen ? drawerWidth : miniDrawerWidth,
          },
        }}
      >
        {drawer}
      </StyledDrawer>

      {/* CONTEÚDO PRINCIPAL */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "radial-gradient(circle at top left, #0f172a, #020617)",
          minHeight: "100vh",
          p: { xs: 2, sm: 3 },
          transition: "margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Home;
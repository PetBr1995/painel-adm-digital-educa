import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
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
  Avatar,
  Chip,
  Badge,
  Stack,
  alpha,
  Paper,
  Tooltip,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import {
  AirplaneTicket,
  Category,
  Dashboard,
  Notifications,
  Person,
  Person3,
  PersonAdd,
  LogoutRounded,
} from "@mui/icons-material";
import theme from "../../theme/theme";
import Swal from "sweetalert2";
import axios from "axios";

const drawerWidth = 260;
const miniDrawerWidth = 70;

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 12,
  backgroundColor: alpha(theme.palette.common.white, 0.08),
  backdropFilter: "blur(8px)",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  marginLeft: theme.spacing(2),
  width: "100%",
  maxWidth: "320px",
  display: "flex",
  alignItems: "center",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.12),
    borderColor: alpha(theme.palette.primary.main, 0.4),
    transform: "translateY(-1px)",
    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
  "&:focus-within": {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}, 0 4px 20px ${alpha(theme.palette.primary.main, 0.25)}`,
    maxWidth: "400px",
  },
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
    marginLeft: theme.spacing(1),
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
  color: alpha(theme.palette.common.white, 0.7),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.2, 1.2, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create(["width"], {
      duration: theme.transitions.duration.standard,
    }),
    width: "22ch",
    fontSize: "0.95rem",
    fontWeight: 500,
    "&:focus": {
      width: "30ch",
    },
    "&::placeholder": {
      color: alpha(theme.palette.common.white, 0.6),
      opacity: 1,
    },
  },
}));

const StyledDrawer = styled(Drawer)(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    background: `linear-gradient(180deg, ${theme.palette.secondary.dark} 0%, ${alpha(theme.palette.secondary.dark, 0.95)} 100%)`,
    backdropFilter: "blur(20px)",
    borderRight: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
    boxShadow: open
      ? `4px 0 20px ${alpha(theme.palette.common.black, 0.1)}`
      : `2px 0 10px ${alpha(theme.palette.common.black, 0.05)}`,
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  margin: "4px 8px",
  borderRadius: 12,
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    transform: "translateX(4px)",
    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
    "& .MuiListItemIcon-root": {
      transform: "scale(1.1)",
    },
  },
  "&.active": {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    "& .MuiListItemText-primary": {
      fontWeight: 600,
      color: theme.palette.primary.main,
    },
  },
}));

const Home = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // ✅ CORREÇÃO AQUI
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
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { text: "Conteúdos", icon: <SchoolIcon />, path: "/cursos" },
    { text: "Instrutores", icon: <PersonAdd />, path: "/instrutores" },
    { text: "Planos", icon: <AirplaneTicket />, path: "/planos" },
    { text: "Usuários", icon: <Person3 />, path: "/usuarios" },
  ];

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    if (event.key === "Enter" && searchQuery.trim()) {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [cursosRes, instrutoresRes, categoriasRes, planosRes] = await Promise.all([
          axios.get(`http://10.10.10.61:3000/curso/cursos?search=${encodeURIComponent(searchQuery)}`, { headers }),
          axios.get(`http://10.10.10.61:3000/instrutor?search=${encodeURIComponent(searchQuery)}`, { headers }),
          axios.get(`http://10.10.10.61:3000/categoria/list?search=${encodeURIComponent(searchQuery)}`),
          axios.get(`http://10.10.10.61:3000/planos?search=${encodeURIComponent(searchQuery)}`, { headers }),
        ]);

        const results = {
          cursos: cursosRes.data || [],
          instrutores: instrutoresRes.data || [],
          categorias: categoriasRes.data || [],
          planos: planosRes.data || [],
        };

        navigate(`/search?query=${encodeURIComponent(searchQuery)}`, { state: { results } });
        setSearchQuery("");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Erro na busca",
          text: "Não foi possível realizar a busca. Tente novamente.",
        });
        console.error("Search error:", error);
      }
    }
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", py: 1 }}>
      <Toolbar />
      {/*

      {(drawerOpen || isMobile) && (


        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main", mb: 0.5 }}>
            Admin Panel
          </Typography>
          <Chip
            label="v2.0"
            size="small"
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
              fontWeight: 600,
              fontSize: "0.7rem"
            }}
          />
        </Box>

      )}
              */}
      <Divider sx={{ mx: 1, borderColor: alpha(theme.palette.primary.main, 0.1) }} />
      <List sx={{ flex: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <StyledListItem
            key={item.text}
            onClick={() => navigate(item.path)}
            className={location.pathname === item.path ? "active" : ""}
          >
            <ListItemIcon
              sx={{
                minWidth: drawerOpen ? 40 : "auto",
                justifyContent: "center",
                color: "primary.light",
                transition: "transform 0.2s ease"
              }}
            >
              {item.icon}
            </ListItemIcon>
            {(drawerOpen || isMobile) && (
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "0.95rem",
                  fontWeight: 500,
                }}
              />
            )}
          </StyledListItem>
        ))}
      </List>
      <Divider sx={{ mx: 1, borderColor: alpha(theme.palette.primary.main, 0.1) }} />
      <Box sx={{ p: 1 }}>
        {(drawerOpen || isMobile) && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 1,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 36,
                  height: 36,
                  fontSize: "0.9rem",
                  fontWeight: 600
                }}
              >
                A
              </Avatar>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  Admin User
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  admin@sistema.com
                </Typography>
              </Box>
            </Stack>
          </Paper>
        )}
        <Tooltip title="Sair do sistema" placement="right">
          <StyledListItem
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
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
                customClass: {
                  popup: "swal-thema-popup"
                },
                didOpen: () => {
                  const container = document.querySelector(".swal2-container");
                  if (container) container.style.zIndex = 20000;
                }
              }).then((result) => {
                if (result.isConfirmed) {
                  localStorage.removeItem("token");
                  navigate("/");
                }
              });
            }}
            sx={{
              "&:hover": {
                backgroundColor: alpha(theme.palette.error.main, 0.08),
                "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                  color: "error.main",
                }
              }
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: drawerOpen ? 40 : "auto",
                justifyContent: "center",
                color: "error.main"
              }}
            >
              <LogoutRounded />
            </ListItemIcon>
            {(drawerOpen || isMobile) && (
              <ListItemText
                primary="Sair"
                primaryTypographyProps={{
                  color: "error.main",
                  fontWeight: 500,
                  fontSize: "0.95rem"
                }}
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
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${alpha(theme.palette.secondary.dark, 0.9)} 100%)`,
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          boxShadow: `0 2px 20px ${alpha(theme.palette.common.black, 0.1)}`,
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
            minHeight: 70,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                transform: drawerOpen && !isMobile ? "rotate(180deg)" : "rotate(0deg)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  transform: `${drawerOpen && !isMobile ? "rotate(180deg)" : "rotate(0deg)"} scale(1.05)`,
                },
              }}
            >
              {drawerOpen ? <MenuOpenIcon sx={{transform:"rotate(180deg)"}} /> : <MenuIcon />}
            </IconButton>

            <CardMedia
              component="img"
              height="45"
              image="https://i.imgur.com/fumQcmz.png"
              alt="Logo"
              sx={{
                maxWidth: "160px",
                filter: "brightness(1.1)",
                transition: "filter 0.3s ease",
                "&:hover": { filter: "brightness(1.2)" },
              }}
            />
          </Stack>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Buscar conteúdos, instrutores..."
              inputProps={{ "aria-label": "search" }}
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchSubmit}
            />
          </Search>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Tooltip title="Notificações">
              <IconButton
                color="inherit"
                sx={{
                  p: 1.2,
                  borderRadius: 2,
                  "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.1) }
                }}
              >
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Perfil">
              <IconButton
                color="inherit"
                sx={{
                  p: 1.2,
                  borderRadius: 2,
                  "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.1) }
                }}
              >
                <Person />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>
      {isMobile ? (
        <StyledDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ "& .MuiDrawer-paper": { width: drawerWidth } }}
        >
          {drawer}
        </StyledDrawer>
      ) : (
        <StyledDrawer
          variant="permanent"
          open={drawerOpen}
          sx={{
            width: drawerOpen ? drawerWidth : miniDrawerWidth,
            flexShrink: 0,
            whiteSpace: "nowrap",
            "& .MuiDrawer-paper": {
              width: drawerOpen ? drawerWidth : miniDrawerWidth,
              transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              overflowX: "hidden",
            },
          }}
        >
          {drawer}
        </StyledDrawer>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          background: "radial-gradient(circle at top left, #1E2A46, #0A1128)",
          minHeight: "100vh"
        }}
      >
        <Toolbar sx={{ minHeight: 70 }} />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Home;

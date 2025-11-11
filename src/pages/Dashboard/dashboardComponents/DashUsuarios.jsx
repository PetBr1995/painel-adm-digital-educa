// src/components/DashUsuarios.jsx
import { useEffect, useState } from "react";
import {
  alpha,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  Paper
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import UsuariosList from "./UsuariosList";

const DashUsuarios = () => {
  const theme = useTheme();
  const [users, setUsers] = useState({
    total: 0,
    assinaturasAtivas: 0,
    assinaturasCanceladas: 0,
    usuariosFree: 0,
  });

  const [usuariosFiltro, setUsuariosFiltro] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [filtroSelecionado, setFiltroSelecionado] = useState("todos");

  const listarUsuariosFiltro = () => {
    axios
      .get("https://api.digitaleduca.com.vc/usuario/admin/usuarios", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setUsuariosFiltro(res.data))
      .catch(console.error);
  };

  const getUsers = () => {
    axios
      .get("https://api.digitaleduca.com.vc/dashboard/usuarios", {
        headers: {
          Authorization:
            "Dashboard FDYWmkzwEDhacggv6tIZhHsqhz8FSkqVbsqR1QYsL722i8lRr9kFTiWofUmAYDQqvT3w8IcpjJwS9DqEkUpdmBtRzJEg9Ivy25jEXezoaMxpUvlFlct37ZQ4DOpMie",
        },
      })
      .then((res) => {
        setUsers({
          total: res.data.totalUsuarios,
          assinaturasAtivas: res.data.usuariosComAssinatura,
          assinaturasCanceladas: res.data.usuariosCancelados,
          usuariosFree: res.data.usuariosFree,
        });
      })
      .catch(console.error);
  };

  useEffect(() => {
    getUsers();
    listarUsuariosFiltro();
  }, []);

  const abrirModalFiltro = (tipo) => {
    setFiltroSelecionado(tipo);
    setOpenModal(true);
  };

  const filtrarUsuarios = () =>
    usuariosFiltro.filter((u) => {
      if (u.email?.toLowerCase().includes("superadmin")) return false;
      const assinaturaAtiva = u.assinaturas?.some(
        (a) =>
          a.status === "ATIVA" &&
          a.stripeSubscriptionId &&
          a.stripeSubscriptionId.trim() !== ""
      );

      if (filtroSelecionado === "ativos") return assinaturaAtiva;
      if (filtroSelecionado === "free") return !assinaturaAtiva;
      if (filtroSelecionado === "cancelados")
        return u.assinaturas?.some((a) => a.status === "CANCELADA");
      return true;
    });

  const tituloModal = {
    todos: "Todos os Usuários",
    ativos: "Usuários com Assinatura Ativa",
    free: "Usuários Free",
    cancelados: "Usuários Cancelados",
  }[filtroSelecionado];

  // 📊 Dados para gráficos
  const chartData = [
    { name: "Ativos", value: users.assinaturasAtivas },
    { name: "Free", value: users.usuariosFree },
    { name: "Cancelados", value: users.assinaturasCanceladas },
  ];

  const total = users.assinaturasAtivas + users.assinaturasCanceladas;
  const pieData = [
    { name: "Ativos", value: users.assinaturasAtivas },
    { name: "Cancelados", value: users.assinaturasCanceladas },
  ];

  const taxaConversao =
    users.total > 0
      ? ((users.assinaturasAtivas / users.total) * 100).toFixed(1)
      : 0;

  const COLORS = [
    theme.palette.success.main,
    theme.palette.primary.light,
    theme.palette.error.main,
  ];

  const isDark = theme.palette.mode === "dark";
  const tooltipTextColor = isDark ? "#ffffff" : "#1a1a1a";
  const tooltipBgColor = isDark
    ? alpha("#2a2a2a", 0.98)
    : alpha(theme.palette.background.paper, 0.98);

  const statsCards = [
    {
      title: "Total de Usuários",
      value: users.total,
      icon: PeopleIcon,
      color: theme.palette.primary.main,
      bgColor: alpha(theme.palette.primary.main, 0.1),
      tipo: "todos",
    },
    {
      title: "Assinaturas Ativas",
      value: users.assinaturasAtivas,
      icon: CheckCircleIcon,
      color: theme.palette.success.main,
      bgColor: alpha(theme.palette.success.main, 0.1),
      tipo: "ativos",
    },
    {
      title: "Usuários Free",
      value: users.usuariosFree,
      icon: PersonAddIcon,
      color: theme.palette.warning.main,
      bgColor: alpha(theme.palette.warning.main, 0.1),
      tipo: "free",
    },
    {
      title: "Assinaturas Canceladas",
      value: users.assinaturasCanceladas,
      icon: CancelIcon,
      color: theme.palette.error.main,
      bgColor: alpha(theme.palette.error.main, 0.1),
      tipo: "cancelados",
    },
  ];

  return (
    <>
      {/* Cards */}
      <Paper
        elevation={4}
        sx={{
          bgcolor: alpha(theme.palette.primary.main, 0.0),
          borderRadius: 4,
          p: 3,
          mb: 4,
          mt: 4,
          textAlign: "center",
          border: `1px solid ${alpha(theme.palette.primary.light, 0.3)}`,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
          Métricas dos usuários
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
          Visão geral do desempenho dos usuários
        </Typography>
      </Paper>
      <Grid
        container
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          mb: 5,
        }}
      >
        {statsCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card
              key={i}
              onClick={() => abrirModalFiltro(stat.tipo)}
              sx={{
                cursor: "pointer",
                borderRadius: 3,
                border: `1px solid ${alpha(stat.color, 0.3)}`,
                bgcolor: alpha(stat.color, 0.05),
                transition: "0.3s",
                "&:hover": {
                  boxShadow: theme.shadows[8],
                  bgcolor: alpha(stat.color, 0.1),
                },
              }}
            >
              <CardContent sx={{ pb: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.2,
                      borderRadius: 2,
                      backgroundColor: stat.bgColor,
                      mr: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon sx={{ fontSize: 30, color: stat.color }} />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontWeight: 500 }}
                  >
                    {stat.title}
                  </Typography>
                </Box>

                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: stat.color, mb: 1 }}
                >
                  {stat.value.toLocaleString("pt-BR")}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Grid>

      {/* Charts */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 3,
        }}
      >
        {/* Gráfico de Barras */}
        <Card
          sx={{
            bgcolor: "transparent",
            borderRadius: 3,
            p: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} mb={2}>
            Distribuição de Usuários
          </Typography>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={alpha(theme.palette.text.primary, 0.1)}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: alpha(theme.palette.text.primary, 0.6), fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: alpha(theme.palette.text.primary, 0.6), fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBgColor,
                  border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
                  borderRadius: "12px",
                  color: tooltipTextColor,
                }}
                cursor={{ fill: alpha(theme.palette.primary.main, 0.05) }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart Unificado */}
        <Card
          sx={{
            borderRadius: 3,
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "transparent",
            border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            Assinaturas Ativas vs Canceladas
          </Typography>
          <Typography variant="h5" fontWeight={700} mb={2} color="text.primary">
            {taxaConversao}% Conversão
          </Typography>

          <Box sx={{ width: "100%", height: 260 }}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Ativos", value: users.assinaturasAtivas },
                    { name: "Cancelados", value: users.assinaturasCanceladas },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  cornerRadius={8}
                  dataKey="value"
                  labelLine={false}
                  label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                >
                  <Cell fill={theme.palette.success.main} />
                  <Cell fill={theme.palette.error.main} />
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                    border: "1px solid " + alpha(theme.palette.divider, 0.3),
                    borderRadius: 10,
                    boxShadow: theme.shadows[3],
                    padding: "8px 12px",
                  }}
                  itemStyle={{
                    color: theme.palette.text.primary,
                    fontWeight: 500,
                  }}
                  labelStyle={{ color: theme.palette.text.secondary }}
                />

                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{
                    marginTop: 10,
                    fontSize: 13,
                    color: theme.palette.text.primary,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

          </Box>
        </Card>
      </Box>

      {/* Modal */}
      <UsuariosList
        open={openModal}
        onClose={() => setOpenModal(false)}
        usuarios={filtrarUsuarios()}
        titulo={tituloModal}
      />
    </>
  );
};

export default DashUsuarios;

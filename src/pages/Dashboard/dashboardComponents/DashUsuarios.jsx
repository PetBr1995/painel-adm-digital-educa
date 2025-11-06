import {
    alpha,
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    useTheme,
    Divider,
  } from "@mui/material"
  import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
  } from "recharts"
  import PeopleIcon from "@mui/icons-material/People"
  import CheckCircleIcon from "@mui/icons-material/CheckCircle"
  import CancelIcon from "@mui/icons-material/Cancel"
  import PersonAddIcon from "@mui/icons-material/PersonAdd"
  import axios from "axios"
  import { useEffect, useState } from "react"
  
  const DashUsuarios = () => {
    const theme = useTheme()
  
    const [users, setUsers] = useState({
      total: 0,
      assinaturasAtivas: 0,
      assinaturasCanceladas: 0,
      usuariosFree: 0,
    })
  
    const getUsers = () => {
      axios
        .get("http://10.10.11.180:3000/dashboard/usuarios", {
          headers: {
            Authorization:
              "Dashboard FDYWmkzwEDhacggv6tIZhHsqhz8FSkqVbsqR1QYsL722i8lRr9kFTiWofUmAYDQqvT3w8IcpjJwS9DqEkUpdmBtRzJEg9Ivy25jEXezoaMxpUvlFlct37ZQ4DOpMie",
          },
        })
        .then((response) => {
          setUsers({
            total: response.data.totalUsuarios,
            assinaturasAtivas: response.data.usuariosComAssinatura,
            assinaturasCanceladas: response.data.usuariosCancelados,
            usuariosFree: response.data.usuariosFree,
          })
        })
        .catch((error) => console.log(error))
    }
  
    useEffect(() => {
      getUsers()
    }, [])
  
    const pieData = [
      { name: "Assinaturas Ativas", value: users.assinaturasAtivas, color: theme.palette.success.main },
      { name: "Usuários Free", value: users.usuariosFree, color: theme.palette.warning.main },
      { name: "Canceladas", value: users.assinaturasCanceladas, color: theme.palette.error.main },
    ]
  
    const barData = [
      { name: "Total", valor: users.total },
      { name: "Pagantes", valor: users.assinaturasAtivas },
      { name: "Free", valor: users.usuariosFree },
      { name: "Canceladas", valor: users.assinaturasCanceladas },
    ]
  
    const taxaConversao =
      users.total > 0 ? ((users.assinaturasAtivas / users.total) * 100).toFixed(1) : 0
    const taxaCancelamento =
      users.total > 0 ? ((users.assinaturasCanceladas / users.total) * 100).toFixed(1) : 0
  
    const statsCards = [
      {
        title: "Total de Usuários",
        value: users.total,
        icon: PeopleIcon,
        color: theme.palette.primary.main,
        bgColor: alpha(theme.palette.primary.main, 0.1),
      },
      {
        title: "Assinaturas Ativas",
        value: users.assinaturasAtivas,
        icon: CheckCircleIcon,
        color: theme.palette.success.main,
        bgColor: alpha(theme.palette.success.main, 0.1),
      },
      {
        title: "Usuários Free",
        value: users.usuariosFree,
        icon: PersonAddIcon,
        color: theme.palette.warning.main,
        bgColor: alpha(theme.palette.warning.main, 0.1),
      },
      {
        title: "Assinaturas Canceladas",
        value: users.assinaturasCanceladas,
        icon: CancelIcon,
        color: theme.palette.error.main,
        bgColor: alpha(theme.palette.error.main, 0.1),
      },
    ]
  
    return (
      <>
        {/* Cabeçalho */}
        <Paper
          elevation={4}
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            borderRadius: 4,
            p: 3,
            mb: 4,
            textAlign: "center",
            border: `1px solid ${alpha(theme.palette.primary.light, 0.3)}`,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
            Métricas dos Usuários
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
            Visão geral do desempenho de usuários na plataforma
          </Typography>
        </Paper>
  
        {/* Cards */}
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
          {statsCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                elevation={4}
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${alpha(stat.color, 0.3)}`,
                  transition: "0.3s",
                  bgcolor: alpha(stat.color, 0.05),
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: theme.shadows[8],
                    bgcolor: alpha(stat.color, 0.1),
                  },
                }}
              >
                <CardContent>
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
            )
          })}
        </Grid>
  
        {/* Gráficos */}
        <Grid
          container
          sx={{
            display: "grid",
            gap: 3,
            mb: 5,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "2fr 1fr",
            },
            alignItems: "stretch",
          }}
        >
          {/* Pie */}
          <Paper
            elevation={5}
            sx={{
              borderRadius: 4,
              p: 3,
              border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
              height: "100%",
              backdropFilter: "blur(4px)",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 3, textAlign: "center" }}
            >
              Distribuição de Usuários
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, boxShadow: theme.shadows[3] }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
  
          {/* Bar */}
          <Paper
            elevation={5}
            sx={{
              borderRadius: 4,
              p: 3,
              border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
              height: "100%",
              backdropFilter: "blur(4px)",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 3, textAlign: "center" }}
            >
              Comparativo de Usuários
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={alpha(theme.palette.divider, 0.5)}
                />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={{ borderRadius: 8, boxShadow: theme.shadows[3] }} />
                <Bar
                  dataKey="valor"
                  fill={theme.palette.primary.main}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
  
        {/* Métricas */}
        <Paper
          elevation={6}
          sx={{
            borderRadius: 4,
            p: 4,
            border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
            backgroundColor: alpha(theme.palette.background.paper, 0.6),
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, mb: 3, textAlign: "center", color: theme.palette.primary.main }}
          >
            Métricas de Desempenho
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  p: 3,
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                  textAlign: "center",
                }}
              >
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                  Taxa de Conversão
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                  {taxaConversao}%
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {users.assinaturasAtivas} de {users.total} usuários pagantes
                </Typography>
              </Box>
            </Grid>
  
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  p: 3,
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                  textAlign: "center",
                }}
              >
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                  Taxa de Cancelamento
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
                  {taxaCancelamento}%
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {users.assinaturasCanceladas} assinaturas canceladas
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </>
    )
  }
  
  export default DashUsuarios
  
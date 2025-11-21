import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Avatar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
  AlertTitle,
  alpha,
  Container
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

import {
  School as SchoolIcon,
  PersonAdd as PersonAddIcon,
  Category as CategoryIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  PlayCircle as PlayIcon,
  Assignment as AssignmentIcon,
  Refresh as RefreshIcon,
  People as PeopleIcon,
  MenuBook as MenuBookIcon,
  CardMembership as CardMembershipIcon,
  Circle
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import theme from '../../theme/theme';

const Dashboard = () => {
  const [cursos, setCursos] = useState([]);
  const [instrutores, setInstrutores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosAtivos, setUsuariosAtivos] = useState(0);
  const [loading, setLoading] = useState(true);

  const [metricas, setMetricas] = useState({
    novasInscricoes: 0,
    receitaMensal: 0,
    cursosPopulares: [],
    avaliacaoMedia: 0,
    taxaConclusao: 0,
    tendencia: {
      cursos: "+8%",
      instrutores: "+12%",
      alunos: "+15%"
    }
  });

  const getCursos = () => {
    return axios
      .get("https://api.digitaleduca.com.vc/conteudos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
      .then((response) => {
        setCursos(response.data);

        const cursosAtivos = response.data.filter(curso => curso.ativo !== false);
        const totalAvaliacoes = response.data.reduce((acc, curso) => {
          const avaliacao = parseFloat(curso.avaliacao) || 0;
          return acc + avaliacao;
        }, 0);
        const mediaAvaliacoes = cursosAtivos.length > 0
          ? (totalAvaliacoes / cursosAtivos.length).toFixed(1)
          : "0.0";

        setMetricas(prev => ({
          ...prev,
          avaliacaoMedia: mediaAvaliacoes,
          cursosPopulares: response.data.slice(0, 5)
        }));
      })
      .catch((error) => {
        console.log("Erro ao buscar cursos:", error);
      });
  };

  const [conteudos, setConteudos] = useState([]);

  const getConteudos = () => {
    axios.get('https://api.digitaleduca.com.vc/conteudos', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }).then(function (response) {
      console.log(response)
      setConteudos(response.data.data)

    }).catch(function (error) {
      console.log(error)
    })
  }


  const getInstrutores = () => {
    return axios.get("https://api.digitaleduca.com.vc/instrutor", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((response) => {
      setInstrutores(response.data);
    }).catch((error) => {
      console.log("Erro ao buscar instrutores:", error);
    });
  };

  const listarUsuarios = () => {
    return axios.get('https://api.digitaleduca.com.vc/usuario/admin/usuarios', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }).then((response) => {
      const todosUsuarios = response.data;

      const ativos = todosUsuarios.filter(user =>
        user.stripeCustomerId && // Verifica se o stripeCustomerId existe e não é nulo
        user.assinaturas?.some(assinatura => assinatura.status === "ATIVA")
      );

      setUsuarios(todosUsuarios);
      setUsuariosAtivos(ativos.length);

      const receitaEstimada = ativos.reduce((total, user) => {
        const assinaturaAtiva = user.assinaturas?.find(a => a.status === "ATIVA");
        return total + (assinaturaAtiva?.valorPago ?? 0);
      }, 0);

      setMetricas(prev => ({
        ...prev,
        receitaMensal: receitaEstimada,
        novasInscricoes: Math.floor(ativos.length * 0.1)
      }));
    }).catch((error) => {
      console.log("Erro ao buscar usuários:", error);
    });
  };

  const [allUsers, setAllUsers] = useState([])

  const getAllUsers = () => {
    axios.get('https://api.digitaleduca.com.vc/usuario/admin/usuarios', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(function (response) {
      setAllUsers(response.data)
      console.log(response)
    }).catch(function (error) {
      console.log(error)
    })
  }

  const getCategorias = () => {
    return axios.get('https://api.digitaleduca.com.vc/categorias/list')
      .then((response) => {
        setCategorias(response.data);
      })
      .catch((error) => {
        console.log("Erro ao buscar categorias:", error);
      });
  };



  const getPlanos = () => {
    return axios.get('https://api.digitaleduca.com.vc/planos', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then((response) => {
      console.log(response)
      setPlanos(response.data);
    }).catch((error) => {
      console.log("Erro ao buscar planos:", error);
    });
  };

  const carregarDados = async () => {
    setLoading(true);
    try {
      await Promise.all([
        getCursos(),
        getInstrutores(),
        getCategorias(),
        getPlanos(),
        listarUsuarios(),
        getConteudos(),
        getAllUsers()
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const summaryData = [
    {
      label: "Conteúdos",
      value: conteudos.length,
      icon: <SchoolIcon fontSize="large" />,
      bgColor: theme.palette.primary.main,
      link: "/cursos",
      trend: metricas.tendencia.cursos,
      trendUp: true,
      subtitle: "Total de cursos"
    },
    {
      label: "Instrutores",
      value: instrutores.length,
      icon: <PeopleIcon fontSize="large" />,
      bgColor: theme.palette.secondary.main,
      link: "/instrutores",
      trend: metricas.tendencia.instrutores,
      trendUp: true,
      subtitle: "Professores ativos"
    },
    {
      label: "Alunos Ativos",
      value: usuariosAtivos,
      icon: <PersonAddIcon fontSize="large" />,
      bgColor: theme.palette.info.main,
      link: "/usuarios",
      trend: metricas.tendencia.alunos,
      trendUp: true,
      subtitle: "Com assinatura ativa"
    },

  ];

  const metricsCards = [
    {
      title: "Receita Mensal",
      value: `R$ ${metricas.receitaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: <MoneyIcon />,
      progress: 75,
      subtitle: "Baseada em assinaturas ativas",
      color: "success"
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>Carregando dashboard...</Typography>
      </Box>
    );
  }

  const data = [
    { name: 'Janeiro', Total: `${allUsers.length}`, Ativos: `${usuariosAtivos}` },
  ];

  const porcentagemAtivos = 0

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.background.default, minHeight: "100vh" }}>
      <Container>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
              Dashboard DigitalEduca
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Visão geral da sua plataforma de ensino
            </Typography>
          </Box>
          <IconButton onClick={carregarDados} color="primary" sx={{ backgroundColor: theme.palette.background.paper, boxShadow: 2 }}>
            <RefreshIcon />
          </IconButton>
        </Box>

        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          <AlertTitle>Bem-vindo ao seu Dashboard!</AlertTitle>
          Aqui você pode acompanhar o desempenho da sua plataforma em tempo real.
        </Alert>

        {/* Cards principais */}
        <Grid container spacing={3} mb={4}>
          {summaryData.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Link to={item.link} style={{ textDecoration: "none" }}>
                <Paper sx={{ p: 3, borderRadius: 4, background: item.bgColor, color: theme.palette.common.white }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="h2" fontWeight="bold">{item.value}</Typography>
                      <Typography variant="h6">{item.label}</Typography>
                      <Typography variant="caption">{item.subtitle}</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: "rgba(255,255,255,0.15)", width: 60, height: 60 }}>
                      {item.icon}
                    </Avatar>
                  </Box>
                  {item.trend && (
                    <Box display="flex" alignItems="center">
                      <Chip
                        size="small"
                        icon={item.trendUp ? <TrendingUpIcon /> : <TrendingDownIcon />}
                        label={item.trend}
                        sx={{
                          bgcolor: item.trendUp
                            ? theme.palette.success.light
                            : theme.palette.error.light,
                          color: theme.palette.common.white
                        }}
                      />
                    </Box>
                  )}
                </Paper>
              </Link>
            </Grid>
          ))}
        </Grid>

        {/*Charts*/}

        <section style={{ display: "flex", justifyContent: "flex-start", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>

          <Paper
            elevation={2}
            sx={{
              width: "550px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 6,
              borderRadius: "16px",
              p: 3,
              border: `1px solid ${alpha(theme.palette.primary.light, 0.15)}`,
              background: theme.palette.background.paper,
            }}
          >
            {/* Gráfico */}
            <Box flex={1}>
              <Typography
                sx={{ textAlign: "center", mb: 2, fontWeight: 600 }}
                variant="h6"
                color="text.primary"
              >
                Indicadores dos Usuários
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                  barCategoryGap="25%"
                >
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: theme.shadows[3],
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="Ativos"
                    fill={theme.palette.success.main}
                    barSize={40}
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="Total"
                    fill={theme.palette.primary.light}
                    barSize={40}
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            {/* Resumo ao lado */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                minWidth: "220px",
                pl: 3,
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Usuários Ativos
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color={theme.palette.success.main}
                  >
                    {usuariosAtivos}
                  </Typography>
                </Box>
              </Paper>

              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total de Usuários
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color={theme.palette.primary.main}
                  >
                    {allUsers.length}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Paper>

          <Paper
            elevation={2}
            sx={{
              width: "550px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 6,
              borderRadius: "16px",
              p: 3,
              border: `1px solid ${alpha(theme.palette.primary.light, 0.15)}`,
              background: theme.palette.background.paper,
            }}
          >
            {/* Gráfico */}
            <Box flex={1}>
              <Typography
                sx={{ textAlign: "center", mb: 2, fontWeight: 600 }}
                variant="h6"
                color="text.primary"
              >
                Indicadores dos Usuários
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Tooltip
                    formatter={(value, name, props) => `${value} (${((value / allUsers.length) * 100).toFixed(1)}%)`}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: theme.shadows[3],
                    }}
                  />
                  <Legend />
                  <Pie
                    data={[
                      { name: "Ativos", value: usuariosAtivos },
                      { name: "Inativos", value: allUsers.length - usuariosAtivos },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60} // vira doughnut chart
                    label={({ name, value }) =>
                      `${name}: ${((value / allUsers.length) * 100).toFixed(1)}%`
                    }
                  >
                    <Cell fill={theme.palette.success.main} /> {/* Ativos */}
                    <Cell fill={theme.palette.error.light} />   {/* Inativos */}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>


            </Box>

            {/* Resumo ao lado */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                minWidth: "220px",
                pl: 3,
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Usuários Ativos
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color={theme.palette.success.main}
                  >
                    {usuariosAtivos}
                  </Typography>
                </Box>
              </Paper>

              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total de Usuários
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color={theme.palette.primary.main}
                  >
                    {allUsers.length}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Paper>
        </section>

        {/* Métricas detalhadas */}
        <Grid container spacing={3} mb={4}>
          {metricsCards.map((metric, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ borderRadius: 3, height: "100%" }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" mb={3}>
                    <Avatar sx={{ bgcolor: theme.palette[metric.color].main, mr: 2 }}>
                      {metric.icon}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight="600">{metric.title}</Typography>
                      <Typography variant="body2">{metric.subtitle}</Typography>
                    </Box>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color={`${metric.color}.main`} mb={2}>
                    {metric.value}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={metric.progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: theme.palette.grey[300],
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: theme.palette[metric.color].main
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;

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
  AlertTitle
} from "@mui/material";
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
  CardMembership as CardMembershipIcon
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
      .get("http://10.10.10.62:3000/curso/cursos", {
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


  const [conteudos, setConteudos] = useState([])

  const getConteudos = () => {
    axios.get('http://10.10.10.62:3000/conteudos', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }).then(function (response) {
      console.log(response)
      setConteudos(response.data)

    }).catch(function (error) {
      console.log(error)
    })
  }


  const getInstrutores = () => {
    return axios.get("http://10.10.10.62:3000/instrutor", {
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
    return axios.get('http://10.10.10.62:3000/usuario/admin/usuarios', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }).then((response) => {
      const todosUsuarios = response.data;
      const ativos = todosUsuarios.filter(user =>
        user.assinaturas?.some(assinatura => assinatura.status === "ATIVA")
      );

      setUsuarios(todosUsuarios);
      setUsuariosAtivos(ativos.length);

      const receitaEstimada = ativos.length * 49.90;
      setMetricas(prev => ({
        ...prev,
        receitaMensal: receitaEstimada,
        novasInscricoes: Math.floor(ativos.length * 0.1)
      }));
    }).catch((error) => {
      console.log("Erro ao buscar usuários:", error);
    });
  };

  const getCategorias = () => {
    return axios.get('http://10.10.10.62:3000/categoria/list')
      .then((response) => {
        setCategorias(response.data);
      })
      .catch((error) => {
        console.log("Erro ao buscar categorias:", error);
      });
  };

  const getPlanos = () => {
    return axios.get('http://10.10.10.62:3000/planos', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then((response) => {
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
        getConteudos()
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
      value: cursos.length,
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

    {
      label: "Categorias",
      value: categorias.length,
      icon: <CategoryIcon fontSize="large" />,
      bgColor: theme.palette.warning.main,
      link: "/categorias",
      trend: "0%",
      trendUp: null,
      subtitle: "Áreas de conhecimento"
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
    {
      title: "Novas Inscrições",
      value: metricas.novasInscricoes,
      icon: <AssignmentIcon />,
      progress: 60,
      subtitle: "Novos alunos este mês",
      color: "info"
    },
    {
      title: "Avaliação Média",
      value: `${metricas.avaliacaoMedia || "0.0"}⭐`,
      icon: <StarIcon />,
      progress: (parseFloat(metricas.avaliacaoMedia || 0) / 5) * 100,
      subtitle: "Satisfação dos alunos",
      color: "warning"
    }
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>Carregando dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.background.default, minHeight: "100vh" }}>
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

      {/* Cursos populares */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                  <PlayIcon />
                </Avatar>
                <Typography variant="h6" fontWeight="600">Cursos em Destaque</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {metricas.cursosPopulares.length > 0 ? (
                <List>
                  {metricas.cursosPopulares.slice(0, 5).map((curso, index) => (
                    <ListItem key={curso.id || index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Chip label={index + 1} size="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={curso.nome || `Curso ${index + 1}`}
                        secondary={curso.categoria?.nome || "Categoria não informada"}
                      />
                      <Box display="flex" alignItems="center" gap={1}>
                        <StarIcon sx={{ color: theme.palette.warning.main, fontSize: 16 }} />
                        <Typography variant="body2">{curso.avaliacao ? parseFloat(curso.avaliacao).toFixed(1) : "4.5"}</Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography textAlign="center">Nenhum curso encontrado</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Atividade recente */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar sx={{ bgcolor: theme.palette.info.main, mr: 2 }}>
                  <ScheduleIcon />
                </Avatar>
                <Typography variant="h6" fontWeight="600">Atividade Recente</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: theme.palette.success.main, width: 36, height: 36 }}>
                      <PersonAddIcon fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText primary={`${metricas.novasInscricoes} novos alunos`} secondary="Inscritos nas últimas 24h" />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 36, height: 36 }}>
                      <MenuBookIcon fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText primary={`${cursos.length} cursos publicados`} secondary="Total na plataforma" />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: theme.palette.warning.main, width: 36, height: 36 }}>
                      <StarIcon fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText primary={`Avaliação média: ${metricas.avaliacaoMedia || "0.0"}`} secondary="Baseada em todas as avaliações" />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 36, height: 36 }}>
                      <CardMembershipIcon fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText primary={`${planos.length} planos disponíveis`} secondary="Opções de assinatura" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

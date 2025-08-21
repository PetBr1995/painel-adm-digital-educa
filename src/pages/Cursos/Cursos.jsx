import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Chip,
  CircularProgress,
  Tooltip,
  Divider,
  Modal,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import theme from "../../theme/theme";
import CadastrarCategorias from "../../components/CadastrarCategorias";

const Cursos = () => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cursosPorCategoria, setCursosPorCategoria] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const getCursos = async () => {
    try {
      const response = await axios.get("https://api.digitaleduca.com.vc/curso/cursos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCursos(response.data);
      setCursosPorCategoria(response.data); // Initially show all courses
      console.log(response.data)
    } catch (error) {
      setError("Erro ao carregar os cursos. Tente novamente mais tarde.");
    }
  };

  const getCategorias = async () => {
    try {
      const response = await axios.get("https://api.digitaleduca.com.vc/categoria/list", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCategorias(response.data);
    } catch (error) {
      setError("Erro ao carregar as categorias. Tente novamente mais tarde.");
    }
  };

  const handleCategoriaCadastrada = (novaCategoria) => {
    setCategorias((prev) => [...prev, novaCategoria]);
    setShowForm(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getCursos(), getCategorias()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Filter courses based on selected category
    if (categoriaSelecionada === "todos") {
      setCursosPorCategoria(cursos);
    } else {
      const filtrados = cursos.filter(
        (curso) => curso?.categoria?.id === categoriaSelecionada
      );
      setCursosPorCategoria(filtrados);
    }
  }, [categoriaSelecionada, cursos]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        mb={4}
        gap={2}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Cursos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie todos os seus cursos cadastrados
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: "20px",
            px: 3,
            py: 1,
            fontWeight: "bold",
            textTransform: "none",
            bgcolor: "primary.main",
            "&:hover": { bgcolor: "primary.dark", color: theme.palette.primary.light, boxShadow: "inset 0 0 5px rgba(0,0,0,0.5)" },
            boxShadow: "inset 0 0 5px rgba(0,0,0,0.5)",
            transition: ".4s",
          }}
          onClick={() => navigate("/cadastrarcurso")}
        >
          Novo Curso
        </Button>
      </Stack>

      {/* Category Filter */}
      <Divider sx={{ mb: 4 }} />
      <Box sx={{ flexWrap:"wrap",display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>

          <Button
            variant="contained"
            sx={{ borderRadius: "20px", fontWeight: "600" }}
            onClick={() => setShowForm(true)}
          >
            Cadastrar Categoria
          </Button>
        </Stack>
        <Grid container spacing={2} mb={3}>
          <Grid item>
            <Button
              variant={categoriaSelecionada === "todos" ? "contained" : "outlined"}
              onClick={() => setCategoriaSelecionada("todos")}
              sx={{
                fontWeight: "600",
                borderRadius: "20px",
                border: "none",
                boxShadow: "0 0 2px rgba(255,255,255,0.4)",
              }}
            >
              Todos
            </Button>
          </Grid>
          {categorias.map((cat) => (
            <Grid item key={cat.id}>
              <Button
                variant={categoriaSelecionada === cat.id ? "contained" : "outlined"}
                onClick={() => setCategoriaSelecionada(cat.id)}
                sx={{
                  fontWeight: "600",
                  borderRadius: "20px",
                  border: "none",
                  boxShadow: "0 0 2px rgba(255,255,255,0.4)",
                }}
              >
                {cat.nome}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Divider sx={{ mb: 4 }} />

      {/* States */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : cursosPorCategoria.length === 0 ? (
        <Typography align="center" color="text.secondary">
          Nenhum curso encontrado para {categoriaSelecionada === "todos" ? "todas as categorias" : "esta categoria"}.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {cursosPorCategoria.map((curso) => {
            const totalVideos = curso.modulos?.reduce(
              (acc, mod) => acc + (mod.videos?.length || 0),
              0
            );

            return (
              <Grid item xs={12} sm={6} md={4} key={curso.id}>
                <Card
                  onClick={() => navigate(`/modulos`, { state: { curso } })}
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    height: "100%",
                    width: "300px",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image={
                      curso.thumbnail
                        ? "https://api.digitaleduca.com.vc/" + curso.thumbnail
                        : "/placeholder-image.jpg"
                    }
                    alt={curso.titulo}
                    sx={{ objectFit: "cover", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        mb: 1,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {curso.titulo}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        mb: 1.5,
                        minHeight: "3em",
                      }}
                    >
                      {curso.descricao}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="primary.main"
                      sx={{ mb: 1, fontWeight: 500 }}
                    >
                      {curso.categoria?.nome || "Sem categoria"}
                    </Typography>
                    <Stack direction="row" spacing={1} mb={2}>
                      <Chip
                        label={`${curso.modulos?.length || 0} ${curso.modulos?.length === 1 ? "módulo" : "módulos"}`}
                        size="small"
                        variant="outlined"
                        sx={{
                          bgcolor: theme.palette.primary.light,
                          color: theme.palette.secondary.dark,
                        }}
                      />
                      <Chip
                        label={`${totalVideos} ${totalVideos === 1 ? "vídeo" : "vídeos"}`}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Editar curso">
                        <Button
                          variant="outlined"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/editarcurso/${curso.id}`);
                          }}
                          fullWidth
                          startIcon={<EditIcon />}
                          sx={{
                            textTransform: "none",
                            borderRadius: "20px",
                            border: "none",
                            boxShadow: "0 0 6px rgba(255,255,255,0.4)",
                          }}
                        >
                          Editar
                        </Button>
                      </Tooltip>
                      <Tooltip title="Gerenciar módulos">
                        <Button
                          variant="contained"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/modulos`, { state: { curso } });
                          }}
                          fullWidth
                          startIcon={<SettingsIcon />}
                          sx={{ textTransform: "none", borderRadius: "20px" }}
                        >
                          Módulos
                        </Button>
                      </Tooltip>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "transparent",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: 400,
          }}
        >
          <CadastrarCategorias
            setForm={setShowForm}
            onCategoriaCadastrada={handleCategoriaCadastrada}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default Cursos;
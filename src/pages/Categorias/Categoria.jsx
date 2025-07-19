import { Add, ArrowBack, ExpandMore } from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  Paper,
  Modal,
  Fade,
  CircularProgress,
  IconButton,
  Collapse,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CadastrarCategoria from "../../components/CadastrarCategorias";
import axios from "axios";
import theme from "../../theme/theme";

const Categoria = () => {
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({}); // Track expanded state for each category

  const getCategorias = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://api.digitaleduca.com.vc/categoria/list", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCategorias(response.data);
      setExpanded(response.data.reduce((acc, cat) => ({ ...acc, [cat.id]: false }), {}));
    } catch (error) {
      setError("Erro ao carregar as categorias. Tente novamente mais tarde.");
      console.error("Erro ao buscar categorias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategorias();
  }, []);

  const handleToggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 3, md: 5 } }}>
      <Box sx={{ maxWidth: "1200px", mx: "auto", px: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 5,
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "text.primary", mb: 1 }}
            >
              Categorias
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Gerencie as categorias e seus cursos
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                borderColor: "primary.main",
                color: "primary.main",
                "&:hover": { bgcolor: "primary.light" },
              }}
              onClick={() => navigate("/cursos")}
              aria-label="Voltar para cursos"
            >
              Voltar
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{
                textTransform: "none",
                px: 4,
                py: 1.5,
                fontWeight: "medium",
                borderRadius: 2,
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.dark" },
              }}
              onClick={() => setFormOpen(true)}
              aria-label="Adicionar nova categoria"
            >
              Adicionar Categoria
            </Button>
          </Box>
        </Box>

        {/* Modal for CadastrarCategoria */}
        <Modal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          aria-labelledby="cadastro-categoria-title"
          closeAfterTransition
        >
          <Fade in={formOpen}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                maxWidth: "600px",
                width: "90%",
                bgcolor: "background.paper",
                borderRadius: 2,
                p: { xs: 2, sm: 4 },
                boxShadow: 24,
              }}
            >
              <Typography
                id="cadastro-categoria-title"
                variant="h6"
                sx={{ fontWeight: "medium", mb: 3 }}
              >
                Adicionar Nova Categoria
              </Typography>
              <CadastrarCategoria setForm={setFormOpen} />
            </Box>
          </Fade>
        </Modal>

        {/* Loading State */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 300,
            }}
          >
            <CircularProgress />
            <Typography sx={{ ml: 2, color: "text.secondary" }}>
              Carregando categorias...
            </Typography>
          </Box>
        ) : error ? (
          <Box
            sx={{
              p: 4,
              borderRadius: 2,
              bgcolor: "background.paper",
              textAlign: "center",
              border: 1,
              borderColor: "error.light",
            }}
          >
            <Typography sx={{ color: "error.main", mb: 2 }}>
              {error}
            </Typography>
            <Button
              variant="outlined"
              onClick={getCategorias}
              sx={{ textTransform: "none", borderRadius: 2 }}
              aria-label="Tentar novamente"
            >
              Tentar Novamente
            </Button>
          </Box>
        ) : categorias.length === 0 ? (
          <Box
            sx={{
              p: 4,
              borderRadius: 2,
              bgcolor: "background.paper",
              textAlign: "center",
              border: 1,
              borderColor: "divider",
            }}
          >
            <Typography sx={{ color: "text.secondary", mb: 2 }}>
              Nenhuma categoria encontrada. Crie uma nova categoria para começar.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setFormOpen(true)}
              sx={{ textTransform: "none", borderRadius: 2 }}
              aria-label="Adicionar nova categoria"
            >
              Criar Categoria
            </Button>
          </Box>
        ) : (
          categorias.map((categoria) => (
            <Paper
              key={categoria.id}
              elevation={2}
              sx={{
                p: { xs: 2, sm: 3 },
                mb: 2,
                borderRadius: 2,
                bgcolor: "background.paper",
                border: 1,
                borderColor: "divider",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "medium", color: "text.primary" }}
                  >
                    {categoria.nome}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mt: 0.5 }}
                  >
                    {categoria.cursos?.length || 0}{" "}
                    {categoria.cursos?.length === 1 ? "curso" : "cursos"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Button
                    variant="outlined"
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      borderColor: "primary.main",
                      color: "primary.main",
                      "&:hover": { bgcolor: "primary.light" },
                    }}
                    onClick={() => navigate(`/editar-categoria/${categoria.id}`)}
                    aria-label={`Editar categoria ${categoria.nome}`}
                  >
                    Editar
                  </Button>
                  <IconButton
                    onClick={() => handleToggleExpand(categoria.id)}
                    aria-label={`Expandir cursos da categoria ${categoria.nome}`}
                    sx={{
                      transform: expanded[categoria.id]
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  >
                    <ExpandMore />
                  </IconButton>
                </Box>
              </Box>
              <Collapse in={expanded[categoria.id]} timeout="auto" unmountOnExit>
                <Box sx={{ mt: 3 }}>
                  {categoria.cursos?.length > 0 ? (
                    <Grid container spacing={2}>
                      {categoria.cursos.map((curso) => (
                        <Grid item xs={12} sm={6} key={curso.id}>
                          <Card
                            sx={{
                              borderRadius: 2,
                              border: 1,
                              borderColor: "divider",
                              bgcolor: "background.paper",
                            }}
                          >
                            <CardMedia
                              sx={{
                                height: 120,
                                backgroundColor: "grey.200",
                                objectFit: "cover",
                              }}
                              image={
                                curso.thumbnail ||
                                "https://via.placeholder.com/300x120?text=Sem+Imagem"
                              }
                              title={curso.titulo}
                              component="img"
                            />
                            <CardContent sx={{ p: 2 }}>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: "medium",
                                  color: "text.primary",
                                  mb: 1,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {curso.titulo}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "text.secondary",
                                  mb: 2,
                                  height: 40,
                                  overflow: "hidden",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                {curso.descricao}
                              </Typography>
                              <Stack direction="row" spacing={1}>
                                <Chip
                                  label={`${curso.modulos} ${
                                    curso.modulos === 1 ? "módulo" : "módulos"
                                  }`}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    bgcolor: theme.palette.secondary.light,
                                    color: "text.primary",
                                    borderColor: theme.palette.secondary.main,
                                  }}
                                />
                                <Chip
                                  label={`${curso.videos} ${
                                    curso.videos === 1 ? "vídeo" : "vídeos"
                                  }`}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    bgcolor: theme.palette.secondary.light,
                                    color: "text.primary",
                                    borderColor: theme.palette.secondary.main,
                                  }}
                                />
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography
                      sx={{ color: "text.secondary", textAlign: "center", py: 2 }}
                    >
                      Nenhum curso associado a esta categoria.
                    </Typography>
                  )}
                </Box>
              </Collapse>
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
};

export default Categoria;
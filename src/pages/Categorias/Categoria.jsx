import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  CircularProgress,
  Stack,
  Modal,
  Chip,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CadastrarCategorias from "../../components/CadastrarCategorias";
import theme from "../../theme/theme";

const Categoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [todosCursos, setTodosCursos] = useState([]);
  const [cursosPorCategoria, setCursosPorCategoria] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("todos"); // Inicia selecionado em "todos"
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Ao carregar, pega categorias e cursos
    getCategorias();
    getTodosCursos();
  }, []);

  useEffect(() => {
    // Sempre que atualizar lista completa de cursos ou categoria selecionada, filtra cursos exibidos
    if (categoriaSelecionada === "todos") {
      setCursosPorCategoria(todosCursos);
    } else {
      const filtrados = todosCursos.filter(
        (curso) => curso?.categoria?.id === categoriaSelecionada
      );
      setCursosPorCategoria(filtrados);
    }
  }, [categoriaSelecionada, todosCursos]);

  const getCategorias = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://api.digitaleduca.com.vc/categoria/list", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCategorias(response.data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      alert("Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  };

  const getTodosCursos = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://api.digitaleduca.com.vc/curso/cursos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTodosCursos(response.data);
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
      alert("Erro ao carregar cursos");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoriaCadastrada = (novaCategoria) => {
    setCategorias((prev) => [...prev, novaCategoria]);
    setShowForm(false);
  };

  return (
    <Box p={4}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Categorias</Typography>
        <Button variant="contained" sx={{ borderRadius: "20px", fontWeight: "600" }} onClick={() => setShowForm(true)}>
          Cadastrar Categoria
        </Button>
      </Stack>

      <Divider sx={{ mb: 4 }} />

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2} mb={4}>
            {/* Botão "Todos" */}
            <Grid item>
              <Button
                variant={categoriaSelecionada === "todos" ? "contained" : "outlined"}
                onClick={() => setCategoriaSelecionada("todos")}
                sx={{ fontWeight: "600", borderRadius: "20px", border: "none", boxShadow: "0 0 2px rgba(255,255,255,0.4)" }}
              >
                Todos
              </Button>
            </Grid>

            {/* Botões categorias */}
            {categorias.map((cat) => (
              <Grid item key={cat.id}>
                <Button
                  variant={categoriaSelecionada === cat.id ? "contained" : "outlined"}
                  onClick={() => setCategoriaSelecionada(cat.id)}
                  sx={{ borderRadius: "20px", fontWeight: "600", border: "none", boxShadow: "0 0 2px rgba(255,255,255,0.4)" }}
                >
                  {cat.nome}
                </Button>
              </Grid>
            ))}
          </Grid>
          <Box>
            <Divider sx={{ mb: 4 }} />
          </Box>

          <Typography variant="h5" gutterBottom>
            {categoriaSelecionada === "todos"
              ? "Todos os cursos"
              : categoriaSelecionada
                ? `Cursos da Categoria Selecionada`
                : "Selecione uma categoria para ver os cursos"}
          </Typography>

          {categoriaSelecionada && cursosPorCategoria.length === 0 ? (
            <Typography variant="body1" color="textSecondary" mt={2}>
              Nenhum curso encontrado para esta categoria.
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
                      onClick={() => navigate(`/curso/${curso.id}`)}
                    >
                      <CardMedia
                        component="img"
                        height="160"
                        image={
                          curso.thumbnail
                            ? "https://api.digitaleduca.com.vc/" + curso.thumbnail
                            : "/placeholder-image.jpg"
                        }
                        alt={curso.titulo || curso.nome}
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
                          {curso.titulo || curso.nome}
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
                          {curso.descricao || curso.descricaoCurta || "Sem descrição"}
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
                            label={`${curso.modulos?.length || 0} ${curso.modulos?.length === 1 ? "módulo" : "módulos"
                              }`}
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
                      </CardContent>

                      <CardActions>
                        <Button
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/cursos`);
                          }}
                          variant="outlined"
                          sx={{ fontWeight: "600", borderRadius: "20px", margin: "auto", mb: 1, border: "none", boxShadow: "0 0 2px rgba(255,255,255,0.4)" }}
                        >
                          Ver detalhes
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
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

export default Categoria;

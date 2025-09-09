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
  alpha,
  Container,
  Fade,
  Backdrop,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/Category";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import theme from "../../theme/theme";
import CadastrarCategorias from "../../components/CadastrarCategorias";

const Conteudos = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [conteudos, setConteudos] = useState([]);

  const getConteudos = async () => {
    try {
      const response = await axios.get("http://10.10.10.62:3000/conteudos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response.data)
      setConteudos(response.data);
    } catch (err) {
      console.error("Erro ao carregar conteúdos:", err);
      setError("Erro ao carregar os conteúdos. Tente novamente mais tarde.");
    }
  };

  const getCategorias = async () => {
    try {
      const response = await axios.get("http://10.10.10.62:3000/categorias/list", {
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
      await getCategorias();
      await getConteudos();
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 6 }}>
      <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 4 } }}>
        {/* Header com design mais limpo */}
        <Paper
          elevation={2}
          sx={{
            p: { xs: 3, md: 4 },
            mb: 4,
            borderRadius: 3,
            bgcolor: "background.paper",
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            gap={3}
          >
            <Box>
              <Stack direction="row" alignItems="center" gap={2} mb={1}>
                <VideoLibraryIcon
                  sx={{
                    fontSize: 32,
                    color: "primary.main",
                  }}
                />
                <Typography
                  variant="h4"
                  fontWeight="700"
                  color="text.primary"
                >
                  Conteúdos
                </Typography>
              </Stack>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Gerencie todos os seus conteúdos de vídeo de forma intuitiva
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {conteudos.length} {conteudos.length === 1 ? 'conteúdo' : 'conteúdos'} {conteudos.length === 1 ? 'cadastrado' : 'cadastrados'}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="large"
              sx={{
                borderRadius: "12px",
                px: 4,
                py: 1.5,
                fontWeight: "600",
                textTransform: "none",
                fontSize: "1rem",
                bgcolor: "primary.main",
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
                "&:hover": {
                  bgcolor: "primary.dark",
                  boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.35)}`,
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
              onClick={() => navigate("/cadastrarconteudo")}
            >
              Cadastrar Conteúdo
            </Button>
          </Stack>
        </Paper>

        {/* Seção de categorias mais discreta */}
        <Paper
          elevation={1}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            bgcolor: "background.paper",
            border: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" gap={2}>
              <CategoryIcon sx={{ color: "primary.main", fontSize: 24 }} />
              <Typography variant="h6" fontWeight="600" color="text.primary">
                Gerenciar Categorias
              </Typography>
            </Stack>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{
                borderRadius: "10px",
                fontWeight: "600",
                textTransform: "none",
                borderColor: alpha(theme.palette.primary.main, 0.4),
                color: "primary.main",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease",
              }}
              onClick={() => setShowForm(true)}
            >
              Nova Categoria
            </Button>
          </Stack>
        </Paper>

        {/* Content Area */}
        {loading ? (
          <Paper
            elevation={1}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 400,
              borderRadius: 3,
              bgcolor: "background.paper",
            }}
          >
            <Stack alignItems="center" spacing={3}>
              <CircularProgress size={50} thickness={4} />
              <Typography variant="h6" color="text.secondary" fontWeight="500">
                Carregando conteúdos...
              </Typography>
            </Stack>
          </Paper>
        ) : error ? (
          <Paper
            elevation={1}
            sx={{
              bgcolor: alpha(theme.palette.error.main, 0.08),
              borderRadius: 3,
              p: 4,
              textAlign: "center",
              border: `1px solid ${alpha(theme.palette.error.main, 0.15)}`,
            }}
          >
            <Typography color="error.main" variant="h6" fontWeight="600">
              {error}
            </Typography>
          </Paper>
        ) : conteudos.length === 0 ? (
          <Paper
            elevation={1}
            sx={{
              borderRadius: 3,
              p: { xs: 4, md: 6 },
              textAlign: "center",
              bgcolor: "background.paper",
              border: `2px dashed ${alpha(theme.palette.primary.main, 0.15)}`,
              minHeight: 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Stack spacing={4} alignItems="center" maxWidth={500}>
              <VideoLibraryIcon
                sx={{
                  fontSize: 80,
                  color: alpha(theme.palette.primary.main, 0.4),
                }}
              />
              <Typography
                variant="h5"
                color="text.primary"
                fontWeight="700"
              >
                Comece criando seus conteúdos
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{ lineHeight: 1.6 }}
              >
                Você ainda não tem nenhum conteúdo cadastrado. Que tal criar seu primeiro vídeo?
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                size="large"
                onClick={() => navigate("/cadastrarconteudo")}
                sx={{
                  borderRadius: "14px",
                  px: 4,
                  py: 1.5,
                  fontWeight: "600",
                  textTransform: "none",
                  fontSize: "1.1rem",
                  bgcolor: "primary.main",
                  boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.25)}`,
                  "&:hover": {
                    bgcolor: "primary.dark",
                    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.35)}`,
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Cadastrar Primeiro Conteúdo
              </Button>
            </Stack>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            {conteudos.map((conteudo, index) => (
              <Grid item xs={12} sm={6} lg={4} key={conteudo.id}>
                <Fade in timeout={300 + index * 100}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      bgcolor: "background.paper",
                      border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                      boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.06)}`,
                      transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: `0 16px 40px ${alpha(theme.palette.common.black, 0.12)}`,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        "& .card-media": {
                          transform: "scale(1.05)",
                        },
                        "& .play-overlay": {
                          opacity: 1,
                        },
                      },
                    }}
                  >
                    <Box sx={{ position: "relative", overflow: "hidden" }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={
                          conteudo.thumbnailDesktop
                            ? "http://10.10.10.62:3000/" + conteudo.thumbnailDesktop
                            : "/placeholder-image.jpg"
                        }
                        alt={conteudo.titulo}
                        className="card-media"
                        sx={{
                          objectFit: "cover",
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                          transition: "transform 0.4s ease",
                        }}
                      />
                      <Box
                        className="play-overlay"
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          bgcolor: alpha(theme.palette.common.black, 0.6),
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                        }}
                      >
                        <PlayArrowIcon sx={{ fontSize: 50, color: "white" }} />
                      </Box>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography
                        variant="h6"
                        fontWeight="700"
                        sx={{
                          mb: 2,
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          color: "text.primary",
                        }}
                      >
                        {conteudo.titulo}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          mb: 2,
                          minHeight: "3em",
                          lineHeight: 1.5,
                        }}
                      >
                        {conteudo.descricao}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mb: 2,
                          fontWeight: 600,
                          color: "primary.main",
                          fontSize: "0.85rem",
                        }}
                      >
                        {conteudo.categoria?.nome || "Sem categoria"}
                      </Typography>
                      <Stack direction="row" spacing={1} mb={3} flexWrap="wrap" gap={1}>
                        <Chip
                          label={conteudo.tipo}
                          size="small"
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                            color: "primary.main",
                            fontWeight: "600",
                            border: "none",
                            fontSize: "0.75rem",
                          }}
                        />
                        <Chip
                          label={conteudo.level || "Não definido"}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: alpha(theme.palette.text.secondary, 0.25),
                            color: "text.secondary",
                            fontWeight: "500",
                            fontSize: "0.75rem",
                          }}
                        />
                      </Stack>
                      <Stack direction="row" spacing={2}>
                        <Tooltip title="Editar conteúdo" arrow>
                          <Button
                            variant="outlined"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/editarconteudo/${conteudo.id}`);
                            }}
                            fullWidth
                            startIcon={<EditIcon />}
                            sx={{
                              textTransform: "none",
                              borderRadius: "10px",
                              borderColor: alpha(theme.palette.primary.main, 0.3),
                              color: "primary.main",
                              fontWeight: "600",
                              py: 1,
                              fontSize: "0.875rem",
                              "&:hover": {
                                borderColor: "primary.main",
                                bgcolor: alpha(theme.palette.primary.main, 0.04),
                                transform: "translateY(-1px)",
                              },
                              transition: "all 0.2s ease",
                            }}
                          >
                            Editar
                          </Button>
                        </Tooltip>
                        <Tooltip title="Gerenciar conteúdo" arrow>
                          <Button
                            variant="contained"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/conteudos/${conteudo.id}`);
                            }}
                            fullWidth
                            startIcon={<PlayArrowIcon />}
                            sx={{
                              textTransform: "none",
                              borderRadius: "10px",
                              fontWeight: "600",
                              py: 1,
                              fontSize: "0.875rem",
                              bgcolor: "primary.main",
                              "&:hover": {
                                bgcolor: "primary.dark",
                                transform: "translateY(-1px)",
                              },
                              transition: "all 0.2s ease",
                            }}
                          >
                            Gerenciar
                          </Button>
                        </Tooltip>
                      </Stack>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Modal com estilo mais sóbrio */}
        <Modal
          open={showForm}
          onClose={() => setShowForm(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
            sx: {
              backdropFilter: "blur(4px)",
              bgcolor: alpha(theme.palette.common.black, 0.6),
            }
          }}
        >
          <Fade in={showForm}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.2)}`,
                p: 4,
                borderRadius: 3,
                width: { xs: "90%", sm: 450 },
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <CadastrarCategorias
                setForm={setShowForm}
                onCategoriaCadastrada={handleCategoriaCadastrada}
              />
            </Box>
          </Fade>
        </Modal>
      </Container>
    </Box>
  );
};

export default Conteudos;
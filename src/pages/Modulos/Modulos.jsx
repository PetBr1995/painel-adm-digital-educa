import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Paper,
  CircularProgress,
  Modal,
  Fade,
  Divider,
} from "@mui/material";
import {
  Add,
  ArrowBack,
  Delete,
  Edit,
  PlayCircle,
  Upload,
} from "@mui/icons-material";
import CadastroModulo from "../../components/CadastroModulo";
import theme from "../../theme/theme";
import axios from "axios";

export const Modulos = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const cursoState = location.state?.curso;
  const [curso, setCurso] = useState(cursoState);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  const fetchCursoById = async (id) => {
    try {
      const response = await axios.get(`https://api.digitaleduca.com.vc/curso/${id}`);
      setCurso(response.data);
    } catch (error) {
      console.error("Erro ao carregar curso:", error);
    }
  };

  useEffect(() => {
    if (!cursoState) {
      navigate("/cursos");
    } else {
      fetchCursoById(cursoState.id).finally(() => setLoading(false));
    }
  }, [cursoState, navigate]);

  const handleModuloCriado = () => {
    fetchCursoById(curso.id);
    setFormOpen(false);
  };

  if (loading || !curso) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <Box sx={{ maxWidth: "1000px", mx: "auto", px: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            mb: 4,
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <IconButton
              onClick={() => navigate("/cursos")}
              aria-label="Voltar para cursos"
              color="primary"
              
            >
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "text.primary" }}>
                {curso.titulo}
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary", mt: 1, width:350 }}>
                {curso.descricao}
              </Typography>
            </Box>
          </Box>
          <Button
            onClick={() => setFormOpen(true)}
            startIcon={<Add />}
            variant="contained"
            sx={{ textTransform: "none", px: 4, py: 1.5, fontWeight: "medium" }}
          >
            Novo Módulo
          </Button>
        </Box>

        {/* Modal de Cadastro de Módulo */}
        <Modal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          aria-labelledby="cadastro-modulo-title"
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
              <Typography id="cadastro-modulo-title" variant="h6" sx={{ fontWeight: "medium", mb: 3 }}>
                Adicionar Novo Módulo
              </Typography>
              <CadastroModulo
                getCurso={fetchCursoById}
                setForm={setFormOpen}
                cursoId={curso.id}
                onSuccess={handleModuloCriado}
              />
            </Box>
          </Fade>
        </Modal>

        {/* Lista de Módulos */}
        {curso.modulos.length === 0 ? (
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              textAlign: "center",
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="h6" sx={{ color: "text.secondary" }}>
              Nenhum módulo disponível. Adicione um novo módulo para começar.
            </Typography>
          </Paper>
        ) : (
          curso.modulos.map((modulo, index) => (
            <Paper
              key={index}
              elevation={2}
              sx={{
                p: { xs: 2, sm: 3 },
                mb: 2,
                borderRadius: 2,
                bgcolor: "background.paper",
                border: 1,
                borderColor: "divider",
                transition: "transform 0.2s",
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
                  <Typography variant="h6" sx={{ fontWeight: "medium", color: "text.primary" }}>
                    {modulo.titulo}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {modulo.subtitulo}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      bgcolor: theme.palette.secondary.dark,
                      px: 2,
                      py: 0.5,
                      borderRadius: "16px",
                      color: theme.palette.primary.light,
                      fontWeight: "600",
                    }}
                  >
                    Videos: {modulo.videos.length}
                  </Typography>
                  <IconButton sx={{ bgcolor: theme.palette.secondary.light, "&:hover": { bgcolor: theme.palette.secondary.main } }}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      navigate("/upload-video", {
                        state: {
                          moduloId: modulo.id,
                          curso, // envia o curso junto
                        },
                      })
                    }
                    sx={{ bgcolor: theme.palette.secondary.light, "&:hover": { bgcolor: theme.palette.secondary.main } }}
                  >
                    <Upload />
                  </IconButton>
                  <IconButton sx={{ bgcolor: theme.palette.error.light, "&:hover": { bgcolor: theme.palette.error.main } }}>
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
              <Divider sx={{ mt: 2, mb: 2 }} />
              {/* Vídeos */}
              {modulo.videos.map((video, idx) => (
                <Paper key={idx} elevation={1} sx={{ mt: 2 }}>
                  <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <PlayCircle sx={{ color: theme.palette.primary.light }} />
                      <Typography variant="h5" sx={{ fontWeight: "600" }}>{video.titulo}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontWeight: "medium",
                          bgcolor: theme.palette.secondary.dark,
                          px: 1,
                          py: 0.5,
                          borderRadius: "12px",
                        }}
                      >
                        {Math.floor(video.duracao / 60)}m {video.duracao % 60}s
                      </Typography>

                      <Button variant="outlined" sx={{ border: "none" }}>
                        <Delete />
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
};

export default Modulos;

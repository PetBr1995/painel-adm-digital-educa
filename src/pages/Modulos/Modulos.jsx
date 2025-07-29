import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
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
      const response = await axios.get(`https://api.digitaleduca.com.vc/curso/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
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

  const handleDeleteModulo = async (moduloId) => {
    Swal.fire({
      title: "Deseja excluir o módulo?",
      text: "Essa ação não pode ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, excluir"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`https://api.digitaleduca.com.vc/modulo-curso/${moduloId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
        .then(() => {
          Swal.fire("Excluído!", "O módulo foi excluído com sucesso.", "success");
          fetchCursoById(curso.id);
        })
        .catch(() => {
          Swal.fire("Erro", "Erro ao excluir o módulo.", "error");
        });
      }
    });
  };

  const handleDeleteVideo = async (videoId) => {
    Swal.fire({
      title: "Deseja excluir o vídeo?",
      text: "Essa ação não pode ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, excluir"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`https://api.digitaleduca.com.vc/video/${videoId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
        .then(() => {
          Swal.fire("Excluído!", "O vídeo foi excluído com sucesso.", "success");
          fetchCursoById(curso.id);
        })
        .catch(() => {
          Swal.fire("Erro", "Erro ao excluir o vídeo.", "error");
        });
      }
    });
  };

  if (loading || !curso) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <Box sx={{ maxWidth: "1000px", mx: "auto", px: { xs: 2, sm: 3 } }}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          mb={4}
          gap={2}
        >
          <Box display="flex" alignItems="center" gap="1rem">
            <IconButton onClick={() => navigate("/cursos")} color="primary">
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h4" fontWeight="bold">{curso.titulo}</Typography>
              <Typography color="text.secondary" mt={1} width={350}>{curso.descricao}</Typography>
            </Box>
          </Box>
          <Button
            onClick={() => setFormOpen(true)}
            startIcon={<Add />}
            variant="contained"
            sx={{ textTransform: "none", px: 4, py: 1.5 }}
          >
            Novo Módulo
          </Button>
        </Box>

        <Modal open={formOpen} onClose={() => setFormOpen(false)} closeAfterTransition>
          <Fade in={formOpen}>
            <Box sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: "600px",
              bgcolor: "background.paper",
              borderRadius: 2,
              p: { xs: 2, sm: 4 },
              boxShadow: 24,
            }}>
              <Typography variant="h6" mb={3}>Adicionar Novo Módulo</Typography>
              <CadastroModulo
                getCurso={fetchCursoById}
                setForm={setFormOpen}
                cursoId={curso.id}
                onSuccess={handleModuloCriado}
              />
            </Box>
          </Fade>
        </Modal>

        {curso.modulos.length === 0 ? (
          <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              Nenhum módulo disponível. Adicione um novo módulo para começar.
            </Typography>
          </Paper>
        ) : (
          curso.modulos.map((modulo) => (
            <Paper key={modulo.id} sx={{ p: 3, mb: 2 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
              >
                <Box>
                  <Typography variant="h6" fontWeight="medium">{modulo.titulo}</Typography>
                  <Typography variant="body2" color="text.secondary">{modulo.subtitulo}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography
                    variant="body2"
                    sx={{
                      bgcolor: theme.palette.secondary.dark,
                      px: 2,
                      py: 0.5,
                      borderRadius: "16px",
                      color: theme.palette.primary.light,
                      fontWeight: 600,
                    }}
                  >
                    Vídeos: {modulo.videos.length}
                  </Typography>
                  <IconButton color="primary"><Edit /></IconButton>
                  <IconButton color="primary" onClick={() => navigate("/upload-video", {
                    state: { moduloId: modulo.id, curso }
                  })}><Upload /></IconButton>
                  <IconButton color="error" onClick={() => handleDeleteModulo(modulo.id)}><Delete /></IconButton>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              {modulo.videos.map((video) => (
                <Paper key={video.id} elevation={1} sx={{ mt: 2 }}>
                  <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={2}>
                      <PlayCircle sx={{ color: theme.palette.primary.main }} />
                      <Typography variant="h6">{video.titulo}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography variant="body2" color="text.secondary">
                        {Math.floor(video.duracao / 60)}m {video.duracao % 60}s
                      </Typography>
                      <IconButton onClick={() => handleDeleteVideo(video.id)} color="error">
                        <Delete />
                      </IconButton>
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

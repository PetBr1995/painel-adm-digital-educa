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
} from "@mui/material";
import { Add, ArrowBack, Delete, Edit, Upload } from "@mui/icons-material";
import CadastroModulo from "../../components/CadastroModulo";
import theme from "../../theme/theme";

export const Modulos = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const curso = location.state?.curso;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!curso) {
      navigate("/cursos");
    } else {
      setLoading(false);
    }
  }, [curso, navigate]);

  if (loading) {
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
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "text.primary" }}
              >
                {curso.titulo}
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
                {curso.descricao}
              </Typography>
            </Box>
          </Box>
          <Button
            onClick={() => setFormOpen(true)}
            startIcon={<Add />}
            variant="contained"
            sx={{
              textTransform: "none",
              px: 4,
              py: 1.5,
              fontWeight: "medium",
            }}
          >
            Novo Módulo
          </Button>
        </Box>

        {/* Modal for CadastroModulo */}
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
              <Typography
                id="cadastro-modulo-title"
                variant="h6"
                sx={{ fontWeight: "medium", mb: 3 }}
              >
                Adicionar Novo Módulo
              </Typography>
              <CadastroModulo setForm={setFormOpen} cursoId={curso.id} />
            </Box>
          </Fade>
        </Modal>

        {/* Modules List */}
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
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "medium", color: "text.primary" }}
                  >
                    {modulo.titulo}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {modulo.subtitulo}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      bgcolor: theme.palette.secondary.light,
                      px: 2,
                      py: 0.5,
                      borderRadius: "16px",
                      color: "text.primary",
                    }}
                  >
                    Vídeos
                  </Typography>
                  <IconButton
                    aria-label="Editar módulo"
                    sx={{
                      bgcolor: theme.palette.secondary.light,
                      "&:hover": { bgcolor: theme.palette.secondary.main },
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      navigate("/upload-video", { state: { moduloId: modulo.id } })
                    }
                    aria-label="Upload de vídeo"
                    sx={{
                      bgcolor: theme.palette.secondary.light,
                      "&:hover": { bgcolor: theme.palette.secondary.main },
                    }}
                  >
                    <Upload />
                  </IconButton>
                  <IconButton
                    aria-label="Excluir módulo"
                    sx={{
                      bgcolor: theme.palette.error.light,
                      "&:hover": { bgcolor: theme.palette.error.main },
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
};
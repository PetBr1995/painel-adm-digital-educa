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

const Cursos = () => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCursos = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://api.digitaleduca.com.vc/curso/cursos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCursos(response.data);
      console.log(response.data);
    } catch (error) {
      setError("Erro ao carregar os cursos. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCursos();
  }, []);

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
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: "bold",
            textTransform: "none",
            bgcolor: "primary.main",
            "&:hover": { bgcolor: "primary.dark" },
          }}
          onClick={() => navigate("/cadastrarcurso")}
        >
          Novo Curso
        </Button>
      </Stack>

      {/* Estados */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : cursos.length === 0 ? (
        <Typography align="center" color="text.secondary">
          Nenhum curso encontrado.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {cursos.map((curso) => {
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

                    {/* Chips */}
                    <Stack direction="row" spacing={1} mb={2}>
                      <Chip
                        label={`${curso.modulos?.length || 0} ${
                          curso.modulos?.length === 1 ? "módulo" : "módulos"
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

                    {/* Botões */}
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
                          sx={{ textTransform: "none", borderRadius: 2 }}
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
                          sx={{ textTransform: "none", borderRadius: 2 }}
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
    </Box>
  );
};

export default Cursos;

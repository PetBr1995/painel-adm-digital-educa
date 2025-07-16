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
  } from "@mui/material";
  import PersonIcon from "@mui/icons-material/Person";
  import AccessTimeIcon from "@mui/icons-material/AccessTime";
  import EditIcon from "@mui/icons-material/Edit";
  import SettingsIcon from "@mui/icons-material/Settings";
  import AddIcon from "@mui/icons-material/Add";
  import { useNavigate } from "react-router-dom";
  import axios from "axios";
  import { useEffect, useState } from "react";
  
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
        console.log(response.data)
      } catch (error) {
        setError("Erro ao carregar os cursos. Tente novamente mais tarde.");
        console.error("Erro ao buscar cursos:", error);
      } finally {
        setLoading(false);
      }
    };
    

    useEffect(() => {
      getCursos();
    }, []);
  
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
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
              Gerencie todos os seus cursos
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
            aria-label="Criar novo curso"
          >
            Novo Curso
          </Button>
        </Stack>
  
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
            {cursos.map((curso) => (
              <Grid item xs={12} sm={6} lg={4} key={curso.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardMedia
                    sx={{ height: 160, backgroundColor: "#f0f0f0" }}
                    image={curso.thumbnail}
                    title={curso.titulo}
                    component="img"
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      noWrap
                      sx={{ mb: 1, overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {curso.titulo}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, height: 40, overflow: "hidden" }}
                    >
                      {curso.descricao}
                    </Typography>
  
                    <Stack direction="row" spacing={2} mb={2}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <PersonIcon fontSize="small" color="action" />
                        <Typography variant="caption">
                          {curso.alunos} {curso.alunos === 1 ? "aluno" : "alunos"}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Typography variant="caption">{curso.duracao}</Typography>
                      </Stack>
                    </Stack>
  
                    <Stack direction="row" spacing={1} mb={3}>
                      <Chip
                        label={`${curso.modulos} ${curso.modulos === 1 ? "módulo" : "módulos"}`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={`${curso.videos} ${curso.videos === 1 ? "vídeo" : "vídeos"}`}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
  
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        fullWidth
                        sx={{ textTransform: "none", borderRadius: 2 }}
                        onClick={() => navigate(`/editarcurso/${curso.id}`)}
                        aria-label={`Editar curso ${curso.titulo}`}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<SettingsIcon />}
                        fullWidth
                        sx={{ textTransform: "none", borderRadius: 2 }}
                        onClick={() => navigate('/modulo')}
                        aria-label={`Gerenciar módulos do curso ${curso.titulo}`}
                      >
                        Módulos
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    );
  };
  
  export default Cursos;
import {
  Add,
  ArrowBack,
  Delete,
  VideoCall,
  Watch,
  PlayArrow,
  FolderOpen,
  VideoLibrary
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Typography,
  Chip,
  Stack,
  Avatar,
  Grid,
  Fade,
  Card,
  CardContent,
  Container,
  alpha,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import theme from "../theme/theme";
import Swal from "sweetalert2";

const Conteudo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [modulos, setModulos] = useState([]);
  const [videosSoltos, setVideosSoltos] = useState([]);
  const [loading, setLoading] = useState(true);


  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const editVideoTitle = async (videoId, moduloId) => {
    const { value: newTitle } = await Swal.fire({
      title: "Editar título do vídeo",
      input: "text",
      inputLabel: "Novo título",
      inputPlaceholder: "Digite o novo título",
      showCancelButton: true,
      confirmButtonText: "Salvar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: theme.palette.primary.main,
      inputValidator: (value) => {
        if (!value || value.trim() === "") return "O título não pode estar vazio";
      },
    });

    if (!newTitle) return;

    try {
      // 1. Busca o vídeo atual
      const { data: videoAtual } = await axios.get(
        `https://api.digitaleduca.com.vc/video/${videoId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // 2. Valida e corrige a URL
      let urlValida = videoAtual.url?.trim();

      // Se não tiver URL válida, força uma URL temporária válida (ex: YouTube)
      if (!urlValida || !isValidUrl(urlValida)) {
        urlValida = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Vídeo temporário válido
        // Ou use: "https://example.com/video-placeholder"
      }

      // 3. Payload com URL válida
      const payload = {
        titulo: newTitle.trim(),
        duracao: videoAtual.duracao || 0,
        url: urlValida,
        moduloId: videoAtual.moduloId || null,
        conteudoId: videoAtual.conteudoId || parseInt(id),
      };

      // 4. Envia PATCH
      await axios.patch(
        `https://api.digitaleduca.com.vc/video/${videoId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // 5. Atualiza estado local
      const updateVideo = (videos) =>
        videos.map((v) => (v.id === videoId ? { ...v, titulo: newTitle.trim() } : v));

      if (moduloId) {
        setModulos((prev) =>
          prev.map((mod) =>
            mod.id === moduloId
              ? { ...mod, videos: updateVideo(mod.videos) }
              : mod
          )
        );
      } else {
        setVideosSoltos(updateVideo);
      }

      Swal.fire({
        title: "Sucesso!",
        text: "Título atualizado com sucesso.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Erro ao editar título:", error);

      const message =
        error.response?.data?.message?.[0] ||
        error.response?.data?.message ||
        "Erro ao atualizar. Verifique a URL do vídeo.";

      Swal.fire({
        title: "Erro",
        text: message,
        icon: "error",
        confirmButtonColor: theme.palette.primary.main,
      });
    }
  };



  const fetchConteudo = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.digitaleduca.com.vc/conteudos/${id}/admin`,
        { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
      );

      const modulosAPI = response.data.modulos || response.data.módulos || [];
      setModulos(modulosAPI);

      // Pega vídeos sem módulo
      const todosVideos = response.data.videos || [];
      const soltos = todosVideos.filter((video) => !video.moduloId);
      setVideosSoltos(soltos);
    } catch (error) {
      console.error("Erro ao buscar módulos e vídeos:", error.response || error);
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (videoId, moduloId) => {
    const result = await Swal.fire({
      title: "Deseja realmente deletar este vídeo?",
      text: "Esta ação não pode ser desfeita",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, deletar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#6c757d",
      background: "#fff",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`https://api.digitaleduca.com.vc/video/${videoId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (moduloId) {
        setModulos((prev) =>
          prev.map((modulo) =>
            modulo.id === moduloId
              ? { ...modulo, videos: modulo.videos.filter((v) => v.id !== videoId) }
              : modulo
          )
        );
      } else {
        setVideosSoltos((prev) => prev.filter((v) => v.id !== videoId));
      }

      Swal.fire({
        title: "Deletado!",
        text: "O vídeo foi deletado com sucesso.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Erro ao deletar vídeo:", error.response || error);
      Swal.fire({
        title: "Erro",
        text: "Erro ao deletar vídeo. Tente novamente.",
        icon: "error",
        confirmButtonColor: theme.palette.primary.main,
      });
    }
  };

  const getTotalVideos = () =>
    modulos.reduce((total, m) => total + (m.videos?.length || 0), 0) +
    videosSoltos.length;

  useEffect(() => {
    fetchConteudo();
  }, [id]);

  const LoadingSkeleton = () => (
    <Box>
      {[1, 2, 3].map((item) => (
        <Card key={item} sx={{ mb: 3 }}>
          <CardContent>
            <Stack spacing={1}>
              <Box
                sx={{
                  height: 32,
                  bgcolor: alpha(theme.palette.grey[300], 0.4),
                  mb: 1,
                }}
              />
              <Box
                sx={{
                  height: 20,
                  bgcolor: alpha(theme.palette.grey[300], 0.3),
                  mb: 2,
                }}
              />
              <Box
                sx={{
                  height: 60,
                  bgcolor: alpha(theme.palette.grey[300], 0.2),
                  borderRadius: 1,
                  mb: 1,
                }}
              />
              <Box
                sx={{
                  height: 60,
                  bgcolor: alpha(theme.palette.grey[300], 0.2),
                  borderRadius: 1,
                }}
              />
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Button
            onClick={() => navigate("/cursos")}
            startIcon={<ArrowBack />}
            sx={{
              mb: 3,
              color: theme.palette.text.secondary,
              "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.08) },
            }}
          >
            Voltar aos conteúdos
          </Button>

          {/* Cards de estatísticas */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  color: "white",
                }}
              >
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: alpha("#fff", 0.2) }}>
                    <FolderOpen />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {loading ? "-" : modulos.length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Módulos
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                  color: "white",
                }}
              >
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: alpha("#fff", 0.2) }}>
                    <VideoLibrary />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {loading ? "-" : getTotalVideos()}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Vídeos
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Botões de ação */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              startIcon={<Add />}
              onClick={() => navigate("/cadastromodulo", { state: { conteudoId: id } })}
              variant="outlined"
              size="large"
              sx={{
                borderRadius: 3,
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                px: 3,
                py: 1.5,
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  borderColor: theme.palette.primary.dark,
                },
              }}
            >
              Criar Módulo
            </Button>

            <Button
              startIcon={<VideoCall />}
              variant="contained"
              size="large"
              onClick={() =>
                navigate("/upload-video", { state: { conteudoId: id, moduloId: null } })
              }
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                "&:hover": {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                },
              }}
            >
              Adicionar Vídeo
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Lista de módulos */}
        {loading ? (
          <LoadingSkeleton />
        ) : modulos.length === 0 ? (
          <Card
            sx={{
              textAlign: "center",
              py: 8,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.05
              )}, ${alpha(theme.palette.secondary.main, 0.05)})`,
            }}
          >
            <CardContent>
              <FolderOpen
                sx={{ fontSize: 80, color: theme.palette.grey[400], mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Nenhum módulo cadastrado
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Comece criando seu primeiro módulo
              </Typography>
              <Button
                startIcon={<Add />}
                variant="contained"
                onClick={() =>
                  navigate("/cadastromodulo", { state: { conteudoId: id } })
                }
                sx={{ borderRadius: 3 }}
              >
                Criar Primeiro Módulo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={3}>
            {modulos.map((modulo, index) => (
              <Fade in timeout={300 + index * 100} key={modulo.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.12
                    )}`,
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: theme.shadows[8],
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                    },
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box
                      sx={{
                        p: 3,
                        background: `linear-gradient(135deg, ${alpha(
                          theme.palette.primary.main,
                          0.08
                        )}, ${alpha(theme.palette.secondary.main, 0.08)})`,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: theme.palette.text.primary,
                              mb: 1,
                            }}
                          >
                            {modulo.titulo}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            {modulo.descricao || "Sem descrição"}
                          </Typography>
                        </Box>
                        <Chip
                          label={`${modulo.videos?.length || 0} vídeos`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      <Button
                        size="small"
                        startIcon={<Add />}
                        variant="contained"
                        onClick={() =>
                          navigate("/uploadvideomodulo", {
                            state: { conteudoId: id, moduloId: modulo.id },
                          })
                        }
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 500,
                        }}
                      >
                        Adicionar Vídeo
                      </Button>
                    </Box>

                    {/* Vídeos dentro do módulo */}
                    {modulo.videos && modulo.videos.length > 0 ? (
                      <Box sx={{ p: 2 }}>
                        <Stack spacing={2}>
                          {modulo.videos.map((video, videoIndex) => (
                            <Fade in timeout={500 + videoIndex * 100} key={video.id}>
                              <Card
                                variant="outlined"
                                sx={{
                                  borderRadius: 2,
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                                    borderColor: alpha(theme.palette.primary.main, 0.2),
                                  },
                                }}
                              >
                                <CardContent sx={{ p: 2 }}>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Avatar
                                      sx={{
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        color: theme.palette.primary.main,
                                      }}
                                    >
                                      <PlayArrow />
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                      <Typography
                                        variant="subtitle1"
                                        sx={{ fontWeight: 500, mb: 0.5 }}
                                      >
                                        {video.titulo}
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ fontSize: "0.875rem" }}
                                      >
                                        {video.url ? "Link disponível" : "Sem link"}
                                      </Typography>
                                    </Box>
                                    <Stack direction="row" spacing={1}>
                                      <Button
                                        size="small"
                                        startIcon={<Watch />}
                                        variant="outlined"
                                        onClick={() =>
                                          video.url && window.open(video.url, "_blank")
                                        }
                                        sx={{
                                          borderRadius: 2,
                                          textTransform: "none",
                                          minWidth: "auto",
                                          px: 2,
                                        }}
                                      >
                                        Assistir
                                      </Button>
                                      <Button
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        onClick={() => deleteVideo(video.id, modulo.id)}
                                      >
                                        Deletar
                                      </Button>
                                    </Stack>
                                  </Box>
                                </CardContent>
                              </Card>
                            </Fade>
                          ))}
                        </Stack>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          p: 4,
                          textAlign: "center",
                          bgcolor: alpha(theme.palette.grey[500], 0.05),
                        }}
                      >
                        <VideoLibrary
                          sx={{
                            fontSize: 48,
                            color: theme.palette.grey[400],
                            mb: 1,
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Nenhum vídeo cadastrado neste módulo
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Fade>
            ))}
          </Stack>
        )}

        {/* Vídeos sem módulo */}
        {videosSoltos.length > 0 && (
          <Box sx={{ mt: 5 }}>
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <VideoLibrary color="primary" /> Vídeos sem módulo
            </Typography>
            <Stack spacing={2}>
              {videosSoltos.map((video) => (
                <Card key={video.id} variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                      }}
                    >
                      <PlayArrow />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {video.titulo}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.875rem" }}
                      >
                        {video.url ? "Link disponível" : "Sem link"}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      {video.url && (
                        <Button
                          size="small"
                          startIcon={<Watch />}
                          variant="outlined"
                          onClick={() => window.open(video.url, "_blank")}
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            minWidth: "auto",
                            px: 2,
                          }}
                        >
                          Assistir
                        </Button>
                      )}
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => editVideoTitle(video.id, null)}
                      >
                        Editar Título
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => deleteVideo(video.id, null)}
                      >
                        Deletar
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Conteudo;

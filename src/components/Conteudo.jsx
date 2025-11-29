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

  const [conteudo, setConteudo] = useState(null);
  const [modulos, setModulos] = useState([]);
  const [videosSoltos, setVideosSoltos] = useState([]);
  const [loading, setLoading] = useState(true);

  const editVideoTitle = async (videoId, moduloId) => {
    try {
      const { data: videoAtual } = await axios.get(
        `https://api.digitaleduca.com.vc/video/${videoId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { value: newTitle } = await Swal.fire({
        title: "Editar título do vídeo",
        input: "text",
        inputLabel: "Novo título",
        inputValue: videoAtual.titulo || "",
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

      await axios.patch(
        `https://api.digitaleduca.com.vc/video/${videoId}`,
        { titulo: newTitle.trim() },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const updateVideo = (videos) =>
        videos.map((v) =>
          v.id === videoId ? { ...v, titulo: newTitle.trim() } : v
        );

      if (moduloId) {
        setModulos((prev) =>
          prev.map((mod) =>
            mod.id === moduloId
              ? { ...mod, videos: updateVideo(mod.videos || []) }
              : mod
          )
        );
      } else {
        setVideosSoltos((prev) => updateVideo(prev));
      }

      Swal.fire({
        title: "Sucesso!",
        text: "Título atualizado com sucesso.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Erro ao editar vídeo:", error.response?.data || error);

      const message =
        error.response?.data?.message?.[0] ||
        error.response?.data?.message ||
        "Erro ao editar vídeo.";

      Swal.fire({
        title: "Erro",
        text: message,
        icon: "error",
        confirmButtonColor: theme.palette.primary.main,
      });
    }
  };

  const deleteModulo = async (moduloId) => {
    const modulo = modulos.find((m) => m.id === moduloId);
    const hasVideos = modulo && modulo.videos && modulo.videos.length > 0;

    const result = await Swal.fire({
      title: "Deseja realmente deletar este módulo?",
      text: hasVideos
        ? "Este módulo possui vídeos vinculados. Ao deletar, TODOS os vídeos deste módulo também serão excluídos. Esta ação não pode ser desfeita."
        : "Esta ação não pode ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: hasVideos ? "Sim, deletar módulo e vídeos" : "Sim, deletar módulo",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#6c757d",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `https://api.digitaleduca.com.vc/modulo-conteudo/${moduloId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setModulos((prev) => prev.filter((m) => m.id !== moduloId));

      Swal.fire({
        title: "Deletado!",
        text: hasVideos
          ? "O módulo e todos os vídeos vinculados foram deletados com sucesso."
          : "O módulo foi deletado com sucesso.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      const backend = error.response?.data;

      let message =
        (Array.isArray(backend?.message)
          ? backend.message.join("\n")
          : backend?.message) ||
        backend?.error ||
        "Erro ao deletar módulo.";

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

      const data = response.data;

      console.log("Conteúdo carregado:", data);

      setConteudo(data);

      const modulosAPI = data.modulos || [];
      setModulos(modulosAPI);

      const todosVideos = data.videos || [];
      setVideosSoltos(todosVideos.filter((video) => !video.moduloId));
    } catch (error) {
      console.error("Erro ao buscar conteúdo:", error.response || error);
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (videoId, moduloId) => {
    const result = await Swal.fire({
      title: "Excluir vídeo?",
      text: "Esta ação não pode ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, deletar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#6c757d",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`https://api.digitaleduca.com.vc/video/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (moduloId) {
        setModulos((prev) =>
          prev.map((mod) =>
            mod.id === moduloId
              ? {
                  ...mod,
                  videos: (mod.videos || []).filter(
                    (v) => (v.id ?? v._id) !== videoId
                  ),
                }
              : mod
          )
        );
      } else {
        setVideosSoltos((prev) =>
          prev.filter((v) => (v.id ?? v._id) !== videoId)
        );
      }

      Swal.fire({
        title: "Deletado!",
        text: "O vídeo foi excluído com sucesso.",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Erro ao deletar vídeo:", error.response?.data || error);

      const backend = error.response?.data;
      const message =
        (Array.isArray(backend?.message)
          ? backend.message.join("\n")
          : backend?.message) ||
        backend?.error ||
        "Erro ao deletar vídeo.";

      Swal.fire({
        title: "Erro",
        text: message,
        icon: "error",
        confirmButtonColor: "#d32f2f",
      });
    }
  };

  useEffect(() => {
    fetchConteudo();
  }, [id]);

  const LoadingSkeleton = () => (
    <Box>
      {[1, 2, 3].map((item) => (
        <Card key={item} sx={{ mb: 3 }}>
          <CardContent>
            <Stack spacing={1}>
              <Box sx={{ height: 32, bgcolor: alpha(theme.palette.grey[300], 0.4), mb: 1 }} />
              <Box sx={{ height: 20, bgcolor: alpha(theme.palette.grey[300], 0.3), mb: 2 }} />
              <Box sx={{ height: 60, bgcolor: alpha(theme.palette.grey[300], 0.2), borderRadius: 1, mb: 1 }} />
              <Box sx={{ height: 60, bgcolor: alpha(theme.palette.grey[300], 0.2), borderRadius: 1 }} />
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const categoriaNome =
    conteudo?.categoria?.nome ||
    conteudo?.categoria?.title ||
    "Sem categoria";

  const subcategoriaNome =
    conteudo?.subcategoria?.nome ||
    conteudo?.subcategoria?.title ||
    "Sem subcategoria";

  const gratuitoTipoLabel = (() => {
    if (!conteudo?.gratuitoTipo || conteudo.gratuitoTipo === "NENHUM") {
      return "Conteúdo pago";
    }
    if (conteudo.gratuitoTipo === "PERMANENTE") {
      return "Gratuito permanente";
    }
    if (conteudo.gratuitoTipo === "TEMPORARIO") {
      if (conteudo.gratuitoAte) {
        return `Gratuito até ${conteudo.gratuitoAte}`;
      }
      return "Gratuito temporariamente";
    }
    return conteudo.gratuitoTipo;
  })();

  const instrutores = conteudo?.instrutores || [];

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

          {/* Seção de informações do conteúdo */}
          {conteudo && (
            <Card
              sx={{
                mb: 4,
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
              }}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                      {conteudo.titulo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {conteudo.descricao || "Sem descrição"}
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Categoria
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          <Chip
                            label={categoriaNome}
                            color="primary"
                            variant="outlined"
                            size="small"
                          />
                          <Chip
                            label={subcategoriaNome}
                            variant="outlined"
                            size="small"
                            sx={{fontWeight:700, color:theme.palette.secondary.dark,bgcolor:theme.palette.primary.light}}
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                  
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Tipo e Nível
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          <Chip
                            label={conteudo.tipo || "Sem tipo"}
                            variant="outlined"
                            size="small"
                          />
                          <Chip
                            label={conteudo.level || "Nível não informado"}
                            variant="outlined"
                            size="small"
                          />
                          <Chip
                            label={gratuitoTipoLabel}
                            color={
                              conteudo?.gratuitoTipo === "NENHUM"
                                ? "default"
                                : "success"
                            }
                            variant="outlined"
                            size="small"
                          />
                        </Stack>
                      </Stack>
                    </Grid>

                    {/* Instrutores */}
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Instrutores
                        </Typography>
                        {instrutores.length === 0 ? (
                          <Typography variant="body2" color="text.secondary">
                            Nenhum instrutor vinculado.
                          </Typography>
                        ) : (
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {instrutores.map((item, idx) => {
                              const nome =
                                item.instrutor?.nome ||
                                item.instrutor?.nomeCompleto ||
                                item.instrutor?.name ||
                                item.nome ||
                                "Instrutor";
                              return (
                                <Chip
                                  key={idx}
                                  label={nome}
                                  size="small"
                                  variant="outlined"
                                />
                              );
                            })}
                          </Stack>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Estatísticas */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`, color: "white" }}>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: alpha("#fff", 0.2) }}>
                    <FolderOpen />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">{loading ? "-" : modulos.length}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Módulos</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`, color: "white" }}>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: alpha("#fff", 0.2) }}>
                    <VideoLibrary />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {loading ? "-" : modulos.reduce((t, m) => t + (m.videos?.length || 0), 0) + videosSoltos.length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Vídeos</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Botões */}
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
              }}
            >
              Criar Módulo
            </Button>

            <Button
              startIcon={<VideoCall />}
              variant="contained"
              size="large"
              onClick={() => navigate("/upload-video", { state: { conteudoId: id, moduloId: null } })}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
                fontWeight: 600,
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
          <Card sx={{ textAlign: "center", py: 8 }}>
            <CardContent>
              <FolderOpen sx={{ fontSize: 80, color: theme.palette.grey[400], mb: 2 }} />
              <Typography variant="h6" color="text.secondary">Nenhum módulo cadastrado</Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={3}>
            {modulos.map((modulo, index) => (
              <Fade in timeout={300 + index * 100} key={modulo.id}>
                <Card sx={{ borderRadius: 3, border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}` }}>
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ p: 3, background: alpha(theme.palette.primary.main, 0.08) }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight={600}>{modulo.titulo}</Typography>
                          <Typography variant="body2" color="text.secondary">{modulo.descricao || "Sem descrição"}</Typography>
                        </Box>

                        <Chip label={`${modulo.videos?.length || 0} vídeos`} size="small" color="primary" />
                      </Box>

                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          startIcon={<Add />}
                          variant="contained"
                          onClick={() => navigate("/uploadvideomodulo", {
                            state: { conteudoId: id, moduloId: modulo.id },
                          })}
                          sx={{ borderRadius: 2 }}
                        >
                          Adicionar Vídeo
                        </Button>

                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => navigate("/editar-modulo", { state: { modulo } })}
                          sx={{ borderRadius: 2 }}
                        >
                          Editar módulo
                        </Button>

                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => deleteModulo(modulo.id)}
                          sx={{ borderRadius: 2 }}
                        >
                          Excluir módulo
                        </Button>
                      </Stack>
                    </Box>

                    {modulo.videos?.length > 0 ? (
                      <Box sx={{ p: 2 }}>
                        <Stack spacing={2}>
                          {modulo.videos.map((video) => (
                            <Card key={video.id} variant="outlined" sx={{ borderRadius: 2 }}>
                              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.15) }}>
                                  <PlayArrow />
                                </Avatar>

                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="subtitle1">{video.titulo}</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {video.url ? "Link disponível" : "Sem link"}
                                  </Typography>
                                </Box>

                                <Stack direction="row" spacing={1}>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => editVideoTitle(video.id, modulo.id)}
                                  >
                                    Editar
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
                    ) : (
                      <Box sx={{ p: 3, textAlign: "center" }}>
                        <Typography color="text.secondary">Nenhum vídeo neste módulo</Typography>
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
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              <VideoLibrary color="primary" /> Vídeos sem módulo
            </Typography>
            <Stack spacing={2}>
              {videosSoltos.map((video) => (
                <Card key={video.id} variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.15) }}>
                      <PlayArrow />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1">{video.titulo}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {video.url ? "Link disponível" : "Sem link"}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                      {video.url && (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Watch />}
                          onClick={() => window.open(video.url, "_blank")}
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

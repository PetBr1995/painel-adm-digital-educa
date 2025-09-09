import React, { useState, useEffect } from "react";
import axios from "axios";
import * as tus from "tus-js-client";
import {
  Box,
  Button,
  Card,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  Paper,
  LinearProgress,
  Stack,
  Grid,
  Fade,
  alpha,
} from "@mui/material";
import {
  ArrowBack,
  CloudUpload as CloudUploadIcon,
  Send as SendIcon,
  VideoLibrary,
  Image as ImageIcon,
  Person,
  Category,
  School,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import theme from "../theme/theme";

export default function CadastrarConteudo() {
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    categoriaId: "",
    tipo: "CURSO",
    level: "Iniciante",
    aprendizagem: "",
    requisitos: "",
    instrutorId: "",
  });

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "info" });
  const [categorias, setCategorias] = useState([]);
  const [instrutores, setInstrutores] = useState([]);
  const [categoriasLoading, setCategoriasLoading] = useState(false);
  const [instrutoresLoading, setInstrutoresLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [thumbnailDesktop, setThumbnailDesktop] = useState(null);
  const [thumbnailMobile, setThumbnailMobile] = useState(null);
  const [thumbnailDestaque, setThumbnailDestaque] = useState(null);

  const navigate = useNavigate();

  const showAlert = (message, type = "info") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "info" }), 5000);
  };

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setCategoriasLoading(true);
        const res = await axios.get("http://10.10.10.62:3000/categorias/list", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCategorias(res.data || []);
      } catch (err) {
        console.error("❌ Erro ao carregar categorias:", err);
        showAlert("Erro ao carregar categorias", "error");
      } finally {
        setCategoriasLoading(false);
      }
    };

    const fetchInstrutores = async () => {
      try {
        setInstrutoresLoading(true);
        const res = await axios.get("http://10.10.10.62:3000/instrutor", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setInstrutores(res.data || []);
      } catch (err) {
        console.error("❌ Erro ao carregar instrutores:", err);
        showAlert("Erro ao carregar instrutores", "error");
      } finally {
        setInstrutoresLoading(false);
      }
    };

    fetchCategorias();
    fetchInstrutores();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideo({ file, titulo: file.name.replace(/\.[^/.]+$/, "") });
    showAlert("Vídeo introdutório selecionado", "success");
  };

  const ImageUploader = ({ label, id, value, onChange }) => (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="body2" fontWeight="600" sx={{ mb: 1.5, color: "text.primary" }}>
        {label}
      </Typography>
      <Paper
        elevation={2}
        sx={{
          border: value ? `2px solid ${theme.palette.primary.main}` : `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
          width: 140,
          height: 140,
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          cursor: "pointer",
          transition: "all 0.3s ease",
          mx: "auto",
          bgcolor: value ? "transparent" : alpha(theme.palette.primary.main, 0.02),
          "&:hover": {
            borderColor: theme.palette.primary.main,
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            transform: "translateY(-2px)",
            boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
          }
        }}
      >
        <input
          accept="image/*"
          style={{ display: "none" }}
          id={id}
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            onChange(file);
            showAlert("Imagem selecionada com sucesso", "success");
          }}
        />
        <label htmlFor={id} style={{ width: "100%", height: "100%", cursor: "pointer" }}>
          {value ? (
            <Box
              component="img"
              src={URL.createObjectURL(value)}
              alt={label}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 2
              }}
            />
          ) : (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", p: 2 }}>
              <ImageIcon sx={{ fontSize: 32, color: "primary.main", mb: 1 }} />
              <Typography variant="body2" color="primary.main" fontWeight="600" align="center">
                Selecionar
              </Typography>
            </Stack>
          )}
        </label>
      </Paper>
    </Box>
  );

  const handleSubmit = async () => {
    if (!form.titulo.trim()) return showAlert("O título do conteúdo é obrigatório", "error");
    if (!form.descricao.trim()) return showAlert("A descrição é obrigatória", "error");
    if (!form.categoriaId) return showAlert("Selecione uma categoria", "error");
    if (!form.instrutorId) return showAlert("Selecione um instrutor", "error");
    if (!video) return showAlert("Selecione o vídeo introdutório", "error");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("titulo", String(form.titulo).trim());
      formData.append("descricao", String(form.descricao).trim());
      formData.append("categoriaId", Number(form.categoriaId));
      formData.append("instrutorId", Number(form.instrutorId));
      formData.append("tipo", String(form.tipo).toUpperCase());
      formData.append("level", String(form.level));
      formData.append("aprendizagem", String(form.aprendizagem));
      formData.append("requisitos", String(form.requisitos));
      formData.append("fileSize", Number(video.file.size));
      formData.append("video", video.file);

      if (thumbnailDesktop) formData.append("thumbnailDesktop", thumbnailDesktop);
      if (thumbnailMobile) formData.append("thumbnailMobile", thumbnailMobile);
      if (thumbnailDestaque) formData.append("thumbnailDestaque", thumbnailDestaque);

      const { data } = await axios.post(
        "http://10.10.10.62:3000/conteudos/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      showAlert("Conteúdo cadastrado com sucesso!", "success");
      setForm({
        titulo: "",
        descricao: "",
        categoriaId: "",
        tipo: "CURSO",
        level: "Iniciante",
        aprendizagem: "",
        requisitos: "",
        instrutorId: ""
      });
      setVideo(null);
      setThumbnailDesktop(null);
      setThumbnailMobile(null);
      setThumbnailDestaque(null);
      setProgress(0);
    } catch (err) {
      console.error("🔥 Erro no cadastro:", err);
      showAlert("Erro durante o cadastro do conteúdo", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <Container maxWidth="md">
        {/* Header com botão voltar */}
        <Stack direction="row" alignItems="center" spacing={2} mb={4}>
          <Button
            onClick={() => navigate('/cursos')}
            startIcon={<ArrowBack />}
            variant="outlined"
            sx={{
              borderRadius: 2,
              fontWeight: "600",
              textTransform: "none",
              borderColor: alpha(theme.palette.primary.main, 0.4),
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: alpha(theme.palette.primary.main, 0.04),
              }
            }}
          >
            Voltar aos conteúdos
          </Button>
        </Stack>

        {/* Card principal */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          }}
        >
          {/* Título da página */}
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} mb={4}>
            <VideoLibrary sx={{ fontSize: 32, color: "primary.main" }} />
            <Typography variant="h4" fontWeight="700" color="text.primary">
              Cadastrar Novo Conteúdo
            </Typography>
          </Stack>

          {/* Alert */}
          {alert.show && (
            <Fade in>
              <Alert
                severity={alert.type}
                sx={{
                  mb: 4,
                  borderRadius: 2,
                  "& .MuiAlert-icon": {
                    fontSize: 24
                  }
                }}
              >
                {alert.message}
              </Alert>
            </Fade>
          )}

          {/* Formulário */}
          <Stack spacing={4}>
            {/* Seção: Informações Básicas */}
            <Paper
              elevation={1}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.02),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
              }}
            >
              <Typography variant="h6" fontWeight="700" sx={{ mb: 3, color: "text.primary" }}>
                📝 Informações Básicas
              </Typography>
              <Grid container spacing={3}>

                <TextField
                  fullWidth
                  name="titulo"
                  label="Título do Conteúdo *"
                  value={form.titulo}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    }
                  }}
                />

                <TextField
                  fullWidth
                  name="descricao"
                  label="Descrição *"
                  value={form.descricao}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    }
                  }}
                />


                <TextField
                  fullWidth
                  name="aprendizagem"
                  label="O que você vai aprender"
                  value={form.aprendizagem}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    }
                  }}
                />
                <TextField
                  fullWidth
                  name="requisitos"
                  label="Pré-requisitos"
                  value={form.requisitos}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
            </Paper>

            {/* Seção: Configurações */}
            <Paper
              elevation={1}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.secondary.main, 0.02),
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.08)}`,
              }}
            >
              <Typography variant="h6" fontWeight="700" sx={{ mb: 3, color: "text.primary" }}>
                ⚙️ Configurações
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <Box sx={{ width: "70%" }}>
                  <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: "text.primary", display: "flex", alignItems: "center", gap: 1 }}>
                    <Person sx={{ fontSize: 18, color: "primary.main" }} />
                    Instrutor *
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      name="instrutorId"
                      value={form.instrutorId}
                      onChange={handleChange}
                      displayEmpty
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">Selecione um instrutor</MenuItem>
                      {instrutoresLoading ? (
                        <MenuItem disabled>Carregando...</MenuItem>
                      ) : (
                        instrutores.map((inst) => (
                          <MenuItem key={inst.id} value={inst.id}>
                            {inst.nome}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ width: "70%" }}>
                  <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: "text.primary", display: "flex", alignItems: "center", gap: 1 }}>
                    <School sx={{ fontSize: 18, color: "primary.main" }} />
                    Nível de Dificuldade
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      name="level"
                      value={form.level}
                      onChange={handleChange}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="Iniciante">Iniciante</MenuItem>
                      <MenuItem value="Intermediário">Intermediário</MenuItem>
                      <MenuItem value="Avançado">Avançado</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ width: "70%" }}>
                  <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: "text.primary", display: "flex", alignItems: "center", gap: 1 }}>
                    <Category sx={{ fontSize: 18, color: "primary.main" }} />
                    Categoria *
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      name="categoriaId"
                      value={form.categoriaId}
                      onChange={handleChange}
                      displayEmpty
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">Selecione uma categoria</MenuItem>
                      {categoriasLoading ? (
                        <MenuItem disabled>Carregando...</MenuItem>
                      ) : (
                        categorias.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id}>
                            {cat.nome}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{ mb: 1, color: "text.primary", display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <VideoLibrary sx={{ fontSize: 18, color: "primary.main" }} />
                      Tipo de Conteúdo *
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        name="tipo"
                        value={form.tipo}
                        onChange={handleChange}
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="CURSO">Curso</MenuItem>
                        <MenuItem value="PALESTRA">Palestra</MenuItem>
                        <MenuItem value="PODCAST">Podcast</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </Box>
            </Paper>

            {/* Seção: Thumbnails */}
            <Paper
              elevation={1}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.success.main, 0.02),
                border: `1px solid ${alpha(theme.palette.success.main, 0.08)}`,
              }}
            >
              <Typography variant="h6" fontWeight="700" sx={{ mb: 3, color: "text.primary" }}>
                🖼️ Imagens do Conteúdo
              </Typography>
              <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} sm={4}>
                  <ImageUploader
                    label="Thumbnail Desktop"
                    id="thumbnailDesktop"
                    value={thumbnailDesktop}
                    onChange={setThumbnailDesktop}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ImageUploader
                    label="Thumbnail Mobile"
                    id="thumbnailMobile"
                    value={thumbnailMobile}
                    onChange={setThumbnailMobile}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ImageUploader
                    label="Thumbnail Destaque"
                    id="thumbnailDestaque"
                    value={thumbnailDestaque}
                    onChange={setThumbnailDestaque}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Seção: Upload do Vídeo */}
            <Paper
              elevation={2}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 3,
                border: video ? `2px solid ${theme.palette.primary.main}` : `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                bgcolor: video ? alpha(theme.palette.primary.main, 0.02) : "transparent",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                }
              }}
            >
              <input
                accept="video/*"
                style={{ display: "none" }}
                id="video-upload"
                type="file"
                onChange={handleVideoChange}
              />
              <label htmlFor="video-upload">
                <Stack alignItems="center" spacing={2} sx={{ cursor: "pointer" }}>
                  <CloudUploadIcon sx={{ fontSize: 48, color: "primary.main" }} />
                  <Button
                    variant="contained"
                    component="span"
                    size="large"
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      fontWeight: "600",
                      textTransform: "none",
                      fontSize: "1rem",
                    }}
                  >
                    {video ? "Alterar Vídeo Introdutório" : "Selecionar Vídeo Introdutório *"}
                  </Button>
                  {video && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body1" fontWeight="600" color="text.primary">
                        {video.file.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {(video.file.size / (1024 * 1024)).toFixed(2)} MB
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </label>
              {progress > 0 && (
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    mt: 3,
                    height: 8,
                    borderRadius: 4,
                  }}
                />
              )}
            </Paper>

            {/* Botão de Envio */}
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={loading || !video}
              startIcon={!loading && <SendIcon />}
              sx={{
                py: 2,
                fontSize: "1.1rem",
                fontWeight: "700",
                textTransform: "none",
                borderRadius: 3,
                bgcolor: "primary.main",
                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.25)}`,
                "&:hover": {
                  bgcolor: "primary.dark",
                  boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.35)}`,
                  transform: "translateY(-2px)",
                },
                "&:disabled": {
                  bgcolor: alpha(theme.palette.action.disabled, 0.12),
                },
                transition: "all 0.3s ease",
              }}
            >
              {loading ? "Enviando..." : "Cadastrar Conteúdo"}
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
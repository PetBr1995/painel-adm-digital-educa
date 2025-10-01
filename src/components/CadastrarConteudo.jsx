import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  Paper,
  Stack,
  Grid,
  Fade,
  alpha,
} from "@mui/material";
import { ArrowBack, Send as SendIcon } from "@mui/icons-material";
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
    videoIntrodutorio: "",
    fileSize: 0,
    thumbnailDesktop: "",
    thumbnailMobile: "",
    thumbnailDestaque: "",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "info",
  });
  const [categorias, setCategorias] = useState([]);
  const [categoriasLoading, setCategoriasLoading] = useState(false);

  const navigate = useNavigate();

  const showAlert = (message, type = "info") => {
    setAlert({ show: true, message, type });
    setTimeout(
      () => setAlert({ show: false, message: "", type: "info" }),
      5000
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchCategorias = async () => {
      try {
        setCategoriasLoading(true);
        const res = await axios.get(
          "https://testeapi.digitaleduca.com.vc/categorias/list",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCategorias(res.data || []);
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
        showAlert("Erro ao carregar categorias", "error");
      } finally {
        setCategoriasLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!form.titulo.trim())
      return Swal.fire("Atenção", "Informe o título do conteúdo", "warning");
    if (!form.categoriaId)
      return Swal.fire("Atenção", "Selecione uma categoria", "warning");
    if (!form.videoIntrodutorio.trim())
      return Swal.fire(
        "Atenção",
        "Informe a URL do vídeo introdutório",
        "warning"
      );

    try {
      const payload = {
        titulo: form.titulo.trim(),
        descricao: form.descricao.trim(),
        categoriaId: Number(form.categoriaId),
        tipo: form.tipo,
        level: form.level,
        aprendizagem: form.aprendizagem.trim(),
        requisitos: form.requisitos.trim(),
        videoIntrodutorio: form.videoIntrodutorio.trim(),
        fileSize: form.fileSize,
        thumbnailDesktop: form.thumbnailDesktop.trim(),
        thumbnailMobile: form.thumbnailMobile.trim(),
        thumbnailDestaque: form.thumbnailDestaque.trim(),
      };

      console.log("🚀 Payload enviado:", payload);

      const response = await axios.post(
        "https://testeapi.digitaleduca.com.vc/conteudos/create",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Resposta do backend:", response.data);
      Swal.fire("Sucesso", "Conteúdo cadastrado com sucesso!", "success");

      setForm({
        titulo: "",
        descricao: "",
        categoriaId: "",
        tipo: "CURSO",
        level: "Iniciante",
        aprendizagem: "",
        requisitos: "",
        videoIntrodutorio: "",
        fileSize: 0,
        thumbnailDesktop: "",
        thumbnailMobile: "",
        thumbnailDestaque: "",
      });
    } catch (err) {
      console.error("❌ Erro completo:", err);
      console.error("❌ Erro response.data:", err.response?.data);
      console.error("❌ Erro response.status:", err.response?.status);

      Swal.fire(
        "Erro",
        err.response?.data?.message || "Não foi possível cadastrar o conteúdo",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <Container maxWidth="md">
        <Stack direction="row" alignItems="center" spacing={2} mb={4}>
          <Button
            onClick={() => navigate("/cursos")}
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
              },
            }}
          >
            Voltar aos conteúdos
          </Button>
        </Stack>

        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          }}
        >
          <Stack spacing={4}>
            {alert.show && (
              <Fade in>
                <Alert severity={alert.type}>{alert.message}</Alert>
              </Fade>
            )}

            <Paper
              elevation={1}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.02),
              }}
            >
              <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>
                📝 Informações Básicas
              </Typography>
              <Grid container spacing={3}>
                <TextField
                  fullWidth
                  name="titulo"
                  label="Título do Conteúdo *"
                  value={form.titulo}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  name="descricao"
                  label="Descrição *"
                  value={form.descricao}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
                <TextField
                  fullWidth
                  name="aprendizagem"
                  label="O que você vai aprender"
                  value={form.aprendizagem}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
                <TextField
                  fullWidth
                  name="requisitos"
                  label="Pré-requisitos"
                  value={form.requisitos}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
                <TextField
                  fullWidth
                  name="videoIntrodutorio"
                  label="URL do Vídeo Introdutório *"
                  value={form.videoIntrodutorio}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  name="thumbnailDesktop"
                  label="Thumbnail Desktop URL"
                  value={form.thumbnailDesktop}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  name="thumbnailMobile"
                  label="Thumbnail Mobile URL"
                  value={form.thumbnailMobile}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  name="thumbnailDestaque"
                  label="Thumbnail Destaque URL"
                  value={form.thumbnailDestaque}
                  onChange={handleChange}
                />
              </Grid>
            </Paper>

            <Paper
              elevation={1}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.secondary.main, 0.02),
              }}
            >
              <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>
                ⚙️ Configurações
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Conteúdo</InputLabel>
                    <Select
                      name="tipo"
                      value={form.tipo}
                      onChange={handleChange}
                    >
                      <MenuItem value="PALESTRA">Palestra</MenuItem>
                      <MenuItem value="CURSO">Curso</MenuItem>
                      <MenuItem value="PODCAST">Podcast</MenuItem>
                      <MenuItem value="WORKSHOP">Workshop</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Nível</InputLabel>
                    <Select
                      name="level"
                      value={form.level}
                      onChange={handleChange}
                    >
                      <MenuItem value="Iniciante">Iniciante</MenuItem>
                      <MenuItem value="Intermediário">Intermediário</MenuItem>
                      <MenuItem value="Avançado">Avançado</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Categoria *</InputLabel>
                    <Select
                      name="categoriaId"
                      value={form.categoriaId}
                      onChange={handleChange}
                    >
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
                </Grid>
              </Grid>
            </Paper>

            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={!loading && <SendIcon />}
            >
              {loading ? "Enviando..." : "Cadastrar Conteúdo"}
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

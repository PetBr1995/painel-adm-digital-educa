import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Button, LinearProgress, TextField, Typography, Paper, Stack, MenuItem,
  Grid, CircularProgress, Fade, alpha
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import theme from "../../theme/theme";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function EditarConteudo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const conteudoData = location.state?.conteudo; // 🔹 recebe o conteúdo do useLocation

  const [loading, setLoading] = useState(true);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [thumbnailDesktop, setThumbnailDesktop] = useState("");
  const [thumbnailMobile, setThumbnailMobile] = useState("");
  const [thumbnailDestaque, setThumbnailDestaque] = useState("");
  const [aprendizagem, setAprendizagem] = useState("");
  const [requisitos, setRequisitos] = useState("");
  const [level, setLevel] = useState("Iniciante");
  const [tipo, setTipo] = useState("CURSO");
  const [categoriaId, setCategoriaId] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState("");

  // 🔹 Buscar categorias
  const getCategorias = async () => {
    try {
      const res = await axios.get("https://testeapi.digitaleduca.com.vc/categorias/list", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCategorias(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Buscar dados do conteúdo (fallback)
  const getConteudo = async () => {
    if (conteudoData) {
      preencherCampos(conteudoData);
      setLoading(false);
    } else {
      try {
        const res = await axios.get(`https://testeapi.digitaleduca.com.vc/conteudos/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        preencherCampos(res.data);
      } catch (err) {
        console.error("Erro ao carregar conteúdo:", err);
        setStatus("Erro ao carregar o conteúdo.");
      } finally {
        setLoading(false);
      }
    }
  };

  const preencherCampos = (data) => {
    setTitulo(data.titulo || "");
    setDescricao(data.descricao || "");
    setThumbnailDesktop(data.thumbnailDesktop || "");
    setThumbnailMobile(data.thumbnailMobile || "");
    setThumbnailDestaque(data.thumbnailDestaque || "");
    setAprendizagem(data.aprendizagem || "");
    setRequisitos(data.requisitos || "");
    setLevel(data.level || "Iniciante");
    setTipo(data.tipo || "CURSO");
    setCategoriaId(data.categoriaId || "");
  };

  useEffect(() => {
    getCategorias();
    getConteudo();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      titulo, descricao, categoriaId, tipo, level,
      aprendizagem, requisitos,
      thumbnailDesktop, thumbnailMobile, thumbnailDestaque,
    };

    try {
      setStatus("Atualizando conteúdo...");
      await axios.put(`https://testeapi.digitaleduca.com.vc/conteudos/${id}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStatus("Conteúdo atualizado com sucesso!");
      setTimeout(() => navigate("/conteudos"), 1200);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      setStatus("Erro ao atualizar o conteúdo.");
    }
  };

  if (loading) {
    return (
      <Fade in>
        <Box
          sx={{
            minHeight: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Stack alignItems="center" spacing={3}>
            <CircularProgress size={50} />
            <Typography variant="h6" color="text.secondary">
              Carregando conteúdo...
            </Typography>
          </Stack>
        </Box>
      </Fade>
    );
  }

  return (
    <Fade in={!loading} timeout={500}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 5 }}>
        <Stack spacing={4} maxWidth={720} mx="auto">
          <Typography variant="h4" fontWeight="700" align="center">
            Editar Conteúdo
          </Typography>

          {status && (
            <Typography
              align="center"
              color={status.includes("erro") ? "error" : "success.main"}
            >
              {status}
            </Typography>
          )}

          {/* Campos */}
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* 📝 Informações Básicas */}
              <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>
                  📝 Informações Básicas
                </Typography>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Título *"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Descrição *"
                    multiline
                    rows={3}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                  />
                </Stack>
              </Paper>

              {/* ⚙️ Configurações */}
              <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>
                  ⚙️ Configurações
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Tipo"
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value)}
                    >
                      <MenuItem value="CURSO">Curso</MenuItem>
                      <MenuItem value="AULA">Aula</MenuItem>
                      <MenuItem value="MODULO">Módulo</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Categoria"
                      value={categoriaId}
                      onChange={(e) => setCategoriaId(e.target.value)}
                    >
                      {categorias.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.nome}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Nível"
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                    >
                      <MenuItem value="Iniciante">Iniciante</MenuItem>
                      <MenuItem value="Intermediário">Intermediário</MenuItem>
                      <MenuItem value="Avançado">Avançado</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Paper>

              {/* 🖼️ Thumbnails */}
              <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>
                  🖼️ Thumbnails (URLs)
                </Typography>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Thumbnail Desktop (URL)"
                    value={thumbnailDesktop}
                    onChange={(e) => setThumbnailDesktop(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Thumbnail Mobile (URL)"
                    value={thumbnailMobile}
                    onChange={(e) => setThumbnailMobile(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Thumbnail Destaque (URL)"
                    value={thumbnailDestaque}
                    onChange={(e) => setThumbnailDestaque(e.target.value)}
                  />
                </Stack>
              </Paper>

              {/* 📘 Detalhes */}
              <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>
                  📘 Detalhes do Curso
                </Typography>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Aprendizagem"
                    multiline
                    rows={2}
                    value={aprendizagem}
                    onChange={(e) => setAprendizagem(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Requisitos"
                    multiline
                    rows={2}
                    value={requisitos}
                    onChange={(e) => setRequisitos(e.target.value)}
                  />
                </Stack>
              </Paper>

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  borderRadius: 3,
                  textTransform: "none",
                  bgcolor: "primary.main",
                  "&:hover": { bgcolor: "primary.dark", transform: "translateY(-2px)" },
                }}
              >
                Atualizar Conteúdo
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Fade>
  );
}

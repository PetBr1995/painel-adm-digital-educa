import React, { useEffect, useState } from "react";
import axios from "axios";
import * as tus from "tus-js-client";
import {
  Box,
  Button,
  LinearProgress,
  TextField,
  Typography,
  Paper,
  Stack,
  MenuItem,
  Grid,
  alpha,
  CircularProgress,
} from "@mui/material";
import { ArrowBackIos, CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import theme from "../theme/theme";

export default function ConteudoForm() {
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
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://testeapi.digitaleduca.com.vc/categorias/list", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Selecione um vídeo introdutório!");

    try {
      setLoading(true);
      setStatus("Criando conteúdo...");

      const response = await axios.post(
        "https://testeapi.digitaleduca.com.vc/conteudos/create",
        {
          titulo,
          descricao,
          categoriaId,
          tipo,
          level,
          thumbnailDesktop,
          thumbnailMobile,
          thumbnailDestaque,
          aprendizagem,
          requisitos,
          fileSize: file.size,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const { vimeoUploadLink, conteudo } = response.data;
      if (!vimeoUploadLink)
        return setStatus("Erro: link de upload do Vimeo não disponível");

      setStatus("Enviando vídeo para o Vimeo...");

      const upload = new tus.Upload(file, {
        uploadUrl: vimeoUploadLink,
        metadata: { filename: file.name, filetype: file.type },
        onError: () => {
          setLoading(false);
          setStatus("Erro ao enviar vídeo.");
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percent = Math.round((bytesUploaded / bytesTotal) * 100);
          setUploadProgress(percent);
          setStatus(`Enviando vídeo... ${percent}%`);
        },
        onSuccess: async () => {
          try {
            const token = localStorage.getItem("token");
            await axios.post(
              `https://testeapi.digitaleduca.com.vc/vimeo-client/update-metadata/${conteudo.id}`,
              { name: conteudo.titulo, description: conteudo.descricao || "" },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            setStatus(`Conteúdo "${conteudo.titulo}" criado com sucesso!`);
            setTimeout(() => {
              setLoading(false);
              navigate("/cursos");
            }, 1500);
          } catch {
            setStatus(
              `Conteúdo "${conteudo.titulo}" criado, mas falhou ao atualizar título no Vimeo`
            );
            setLoading(false);
          }
        },
      });

      upload.start();
    } catch (err) {
      console.error(err);
      setStatus("Erro ao criar conteúdo.");
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 5 }}>
      <Stack spacing={4} maxWidth={720} mx="auto">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <Button onClick={() => navigate("/cursos")} variant="outlined" sx={{ fontWeight: 600 }} startIcon={<ArrowBackIos />}>
            Voltar
          </Button>
          <Typography variant="h4" fontWeight="700" align="center">
            Criar Novo Conteúdo
          </Typography>
        </Box>

        {status && (
          <Typography
            align="center"
            color={status.toLowerCase().includes("erro") ? "error" : "success.main"}
          >
            {status}
          </Typography>
        )}

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 6,
                  textAlign: "center",
                  borderRadius: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <CircularProgress
                    size={70}
                    thickness={4}
                    sx={{ color: theme.palette.primary.main }}
                  />
                </motion.div>

                <Typography variant="h6" fontWeight="600">
                  {status || "Processando..."}
                </Typography>

                {uploadProgress > 0 && (
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                    sx={{ width: "100%", height: 8, borderRadius: 4 }}
                  />
                )}
              </Paper>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <Stack spacing={4}>
                {/* Informações básicas */}
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
                      multiline
                      rows={3}
                      label="Descrição *"
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                    />
                  </Stack>
                </Paper>

                {/* Aprendizagem e Pré-requisitos */}
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>
                    🎯 Aprendizagem e Pré-requisitos
                  </Typography>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="O que o aluno vai aprender?"
                      placeholder="Descreva as principais aprendizagens que o aluno terá..."
                      value={aprendizagem}
                      onChange={(e) => setAprendizagem(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Pré-requisitos"
                      placeholder="Liste os conhecimentos necessários para aproveitar melhor o conteúdo..."
                      value={requisitos}
                      onChange={(e) => setRequisitos(e.target.value)}
                    />
                  </Stack>
                </Paper>

                {/* Configurações */}
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>
                    ⚙️ Configurações
                  </Typography>
                  <Grid container sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <Grid>
                      <TextField
                        select
                        fullWidth
                        label="Tipo de Conteúdo"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                      >
                        <MenuItem value="CURSO">Curso</MenuItem>
                        <MenuItem value="PALESTRA">Palestra</MenuItem>
                        <MenuItem value="PODCAST">Podcast</MenuItem>
                        <MenuItem value="WORKSHOP">Workshop</MenuItem>
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

                {/* Thumbnails */}
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>
                    🖼️ Thumbnails (links)
                  </Typography>
                  <Stack spacing={3}>
                    <TextField
                      label="Thumbnail Desktop"
                      value={thumbnailDesktop}
                      onChange={(e) => setThumbnailDesktop(e.target.value)}
                      placeholder="https://cdn.meusite.com/thumbs/desktop.png"
                      fullWidth
                    />
                    <TextField
                      label="Thumbnail Mobile"
                      value={thumbnailMobile}
                      onChange={(e) => setThumbnailMobile(e.target.value)}
                      placeholder="https://cdn.meusite.com/thumbs/mobile.png"
                      fullWidth
                    />
                    <TextField
                      label="Thumbnail Destaque"
                      value={thumbnailDestaque}
                      onChange={(e) => setThumbnailDestaque(e.target.value)}
                      placeholder="https://cdn.meusite.com/thumbs/destaque.png"
                      fullWidth
                    />
                  </Stack>
                </Paper>

                {/* Upload de vídeo */}
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    border: file
                      ? `2px solid ${theme.palette.primary.main}`
                      : `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                    borderRadius: 3,
                    cursor: "pointer",
                    "&:hover": { borderColor: theme.palette.primary.main },
                  }}
                >
                  <input
                    accept="video/*"
                    type="file"
                    style={{ display: "none" }}
                    id="video-upload"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <label htmlFor="video-upload">
                    <Stack spacing={2} alignItems="center">
                      <CloudUploadIcon sx={{ fontSize: 48, color: "primary.main" }} />
                      <Button variant="contained" component="span" sx={{ borderRadius: 2 }}>
                        {file ? "Alterar Vídeo" : "Selecionar Vídeo"}
                      </Button>
                      {file && (
                        <Typography variant="body2" color="text.secondary">
                          {file.name} - {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </Typography>
                      )}
                    </Stack>
                  </label>
                  {uploadProgress > 0 && (
                    <LinearProgress
                      variant="determinate"
                      value={uploadProgress}
                      sx={{ mt: 3, height: 8, borderRadius: 4 }}
                    />
                  )}
                </Paper>

                {/* Botão final */}
                <Button
                  onClick={handleSubmit}
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
                  Criar Conteúdo
                </Button>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </Stack>
    </Box>
  );
}

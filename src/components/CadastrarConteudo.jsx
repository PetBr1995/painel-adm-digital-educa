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
  Select,
  Checkbox,
  ListItemText
} from "@mui/material";
import { ArrowBackIos, CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import theme from "../theme/theme";
import Instrutor from "../pages/Instrutor/Instrutor";

export default function ConteudoForm() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [aprendizagem, setAprendizagem] = useState("");
  const [requisitos, setRequisitos] = useState("");
  const [level, setLevel] = useState("Iniciante");
  const [tipo, setTipo] = useState("CURSO");
  const [categoriaId, setCategoriaId] = useState(""); // guarda ID da categoria
  const [subcategoriaId, setSubcategoriaId] = useState(""); // guarda ID da subcategoria
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [gratuito, setGratuito] = useState(false);
  const [dataCriacao, setDataCriacao] = useState("")

  const [gratuitoTipo, setGratuitoTipo] = useState("nenhum"); // "nenhum" | "permanente" | "temporario"
  const [gratuitoDataInicio, setGratuitoDataInicio] = useState(""); // yyyy-mm-dd
  const [gratuitoDataFim, setGratuitoDataFim] = useState("");

  // thumbnails (files)
  const [thumbnailDesktop, setThumbnailDesktop] = useState(null);
  const [thumbnailMobile, setThumbnailMobile] = useState(null);
  const [thumbnailDestaque, setThumbnailDestaque] = useState(null);

  const navigate = useNavigate();

  const [instrutores, setInstrutores] = useState([]);
  const [instrutoresSelecionados, setInstrutoresSelecionados] = useState([]); // novo

  // Carrega categorias e subcategorias e normaliza para usar sempre `id` e `categoriaId`
  useEffect(() => {
    const token = localStorage.getItem("token");

    const loadCategorias = async () => {
      try {
        const res = await axios.get("http://10.10.11.174:3000/categorias/list", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // normaliza categorias
        const normalizedCats = (res.data || []).map((c) => ({
          id: c._id ?? c.id ?? "",
          nome: c.nome ?? c.title ?? "",
        }));
        setCategorias(normalizedCats);
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
        setCategorias([]);
      }
    };

    const loadSubcategorias = async () => {
      try {
        const res = await axios.get("http://10.10.11.174:3000/subcategorias/list", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // normaliza subcategorias garantindo categoriaId string
        const normalizedSubs = (res.data || []).map((s) => ({
          id: s._id ?? s.id ?? "",
          nome: s.nome ?? "",
          categoriaId: s.categoriaId ?? s.categoria?._id ?? s.categoria ?? "",
        }));
        setSubcategorias(normalizedSubs);
      } catch (err) {
        console.error("Erro ao carregar subcategorias:", err);
        setSubcategorias([]);
      }
    };

    // dentro do useEffect (ou fora, chamada pelo useEffect)
    const getInstrutores = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return console.error("token não encontrado");

        const res = await axios.get("http://10.10.11.174:3000/instrutor", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // adapta diferentes formatos de response
        const data = res.data?.instrutores ?? res.data ?? [];
        const normalized = (Array.isArray(data) ? data : []).map(i => ({
          id: i._id ?? i.id ?? i._idstr ?? "",   // garantir id
          nome: i.nome ?? i.name ?? i.nomeCompleto ?? "Sem nome",
        }));

        setInstrutores(normalized);
        console.log("instrutores carregados:", normalized);
      } catch (err) {
        console.error("Erro ao carregar instrutores:", err);
        setInstrutores([]);
      }
    };

    loadCategorias();
    loadSubcategorias();
    getInstrutores();

  }, []);


  // Subcategorias filtradas dinamicamente pela categoria selecionada
  const subcategoriasFiltradas = subcategorias.filter((s) => s.categoriaId === (categoriaId || ""));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo.trim()) return setStatus("Preencha o título.");
    if (!descricao.trim()) return setStatus("Preencha a descrição.");
    if (!file) return setStatus("Selecione um vídeo introdutório!");

    try {
      setLoading(true);
      setStatus("Criando conteúdo...");
      const token = localStorage.getItem("token");

      // 🔹 Normaliza tipo gratuito
      const tipoGratuito = gratuitoTipo?.toUpperCase() || "NENHUM";

      // 🔹 Define gratuitoAte apenas se for TEMPORARIO
      const dataGratuita =
        tipoGratuito === "TEMPORARIO" && gratuitoDataFim
          ? gratuitoDataFim
          : null;

      // 🔹 Monta dados compatíveis com backend
      const conteudoData = {
        titulo,
        descricao,
        tipo,
        level,
        aprendizagem,
        requisitos,
        subcategoriaId,
        dataCriacao:dataCriacao,
        gratuitoTipo: tipoGratuito,
        ...(dataGratuita && { gratuitoAte: dataGratuita }), // só envia se tiver valor
        fileSize: file?.size,
      };

      // 🔹 Cria FormData
      const formData = new FormData();
      for (const [key, value] of Object.entries(conteudoData)) {
        if (value !== undefined && value !== null && value !== "")
          formData.append(key, value);
      }

      // 🔹 Adiciona múltiplos instrutores (array de IDs)
      if (instrutoresSelecionados && instrutoresSelecionados.length > 0) {
        instrutoresSelecionados.forEach((id) => {
          formData.append("instrutorIds[]", id);
        });
      }

      // 🔹 thumbnails
      if (thumbnailDesktop)
        formData.append("thumbnailDesktop", thumbnailDesktop);
      if (thumbnailMobile) formData.append("thumbnailMobile", thumbnailMobile);
      if (thumbnailDestaque)
        formData.append("thumbnailDestaque", thumbnailDestaque);

      // 🔹 Requisição principal
      const response = await axios.post(
        "http://10.10.11.174:3000/conteudos/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { vimeoUploadLink, conteudo } = response.data;

      if (!vimeoUploadLink) {
        setStatus("Erro: link de upload do Vimeo não retornado.");
        setLoading(false);
        return;
      }

      setStatus("Enviando vídeo para o Vimeo...");
      setUploadProgress(0);

      const upload = new tus.Upload(file, {
        uploadUrl: vimeoUploadLink,
        metadata: { filename: file.name, filetype: file.type },
        onError: (err) => {
          console.error("Erro no upload:", err);
          setStatus("Erro ao enviar vídeo.");
          setLoading(false);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percent = Math.round((bytesUploaded / bytesTotal) * 100);
          setUploadProgress(percent);
          setStatus(`Enviando vídeo... ${percent}%`);
        },
        onSuccess: async () => {
          try {
            await axios.post(
              `http://10.10.11.174:3000/vimeo-client/update-metadata/${conteudo.id}`,
              {
                name: conteudo.titulo,
                description: conteudo.descricao || "",
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            setStatus(`Conteúdo "${conteudo.titulo}" criado com sucesso!`);
            setTimeout(() => {
              setLoading(false);
              navigate("/cursos");
            }, 1000);
          } catch (err) {
            console.error("Erro ao atualizar metadata:", err);
            setStatus("Conteúdo criado, mas falhou ao atualizar metadata.");
            setLoading(false);
          }
        },
      });

      upload.start();
    } catch (err) {
      console.error("Erro ao criar conteúdo:", err.response?.data || err);
      setStatus("Erro ao criar conteúdo.");
      setLoading(false);
    }
  };


  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 5 }}>
      <Stack spacing={4} maxWidth={920} mx="auto">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <Button onClick={() => navigate("/cursos")} variant="outlined" sx={{ fontWeight: 600 }} startIcon={<ArrowBackIos />}>
            Voltar
          </Button>
          <Typography variant="h4" fontWeight="700" align="center">
            Criar Novo Conteúdo
          </Typography>
        </Box>

        {status && (
          <Typography align="center" color={status.toLowerCase().includes("erro") ? "error" : "success.main"}>
            {status}
          </Typography>
        )}

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <Paper elevation={3} sx={{ p: 6, textAlign: "center", borderRadius: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                  <CircularProgress size={70} thickness={4} sx={{ color: theme.palette.primary.main }} />
                </motion.div>
                <Typography variant="h6" fontWeight="600">{status || "Processando..."}</Typography>
                {uploadProgress > 0 && <LinearProgress variant="determinate" value={uploadProgress} sx={{ width: "100%", height: 8, borderRadius: 4 }} />}
              </Paper>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.4 }}>
              <Stack spacing={4} component="form" onSubmit={handleSubmit}>
                {/* Informações básicas */}

                <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight="700" sx={{  mb: 3 }}>📅 Data de Criação do conteúdo</Typography>
                  <Stack spacing={3}>
                    <TextField type="datetime-local" defaultValue="Teste" value={dataCriacao} onChange={(e) => setDataCriacao(e.target.value)} />
                  </Stack>
                </Paper>

                <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>📝 Informações Básicas</Typography>
                  <Stack spacing={3}>
                    <TextField fullWidth label="Título *" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
                    <TextField fullWidth multiline rows={3} label="Descrição *" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                  </Stack>
                </Paper>

                {/* Aprendizagem e pré-requisitos */}
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>🎯 Aprendizagem e Pré-requisitos</Typography>
                  <Stack spacing={3}>
                    <TextField fullWidth multiline rows={3} label="O que o aluno vai aprender?" value={aprendizagem} onChange={(e) => setAprendizagem(e.target.value)} />
                    <TextField fullWidth multiline rows={2} label="Pré-requisitos" value={requisitos} onChange={(e) => setRequisitos(e.target.value)} />
                  </Stack>
                </Paper>

                {/* Configurações */}
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>⚙️ Configurações</Typography>

                  <Grid container sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <Grid>
                      <TextField select fullWidth label="Tipo de Conteúdo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                        <MenuItem value="AULA">Aula</MenuItem>
                        <MenuItem value="PALESTRA">Palestra</MenuItem>
                        <MenuItem value="PODCAST">Podcast</MenuItem>
                      </TextField>
                    </Grid>

                    <Grid item xs={12}>
                      {/* Categoria */}
                      <TextField
                        select
                        fullWidth
                        label="Categoria"
                        value={categoriaId || ""}
                        margin="normal"
                        onChange={(e) => {
                          const newCat = e.target.value ?? "";
                          setCategoriaId(newCat);
                          setSubcategoriaId(""); // limpa a subcategoria ao trocar categoria
                        }}
                      >
                        <MenuItem value="">Selecione uma categoria...</MenuItem>
                        {categorias.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id}>
                            {cat.nome}
                          </MenuItem>
                        ))}
                      </TextField>

                      {/* Subcategoria */}
                      <TextField
                        select
                        fullWidth
                        label="Subcategoria"
                        value={subcategoriaId || ""}
                        onChange={(e) => setSubcategoriaId(e.target.value ?? "")}
                        disabled={!categoriaId}
                        margin="normal"
                      >
                        <MenuItem value="">Selecione uma subcategoria...</MenuItem>
                        {subcategorias
                          .filter((s) => s.categoriaId === categoriaId) // filtra pelo id da categoria selecionada
                          .map((sub) => (
                            <MenuItem key={sub.id} value={sub.id}>
                              {sub.nome}
                            </MenuItem>
                          ))}
                      </TextField>

                    </Grid>

                    <Grid item xs={12}>
                      <TextField select fullWidth label="Nível" value={level} onChange={(e) => setLevel(e.target.value)}>
                        <MenuItem value="Iniciante">Iniciante</MenuItem>
                        <MenuItem value="Intermediário">Intermediário</MenuItem>
                        <MenuItem value="Avançado">Avançado</MenuItem>
                      </TextField>
                    </Grid>

                  </Grid>
                </Paper>

                {/* bloco de instrutores - coloque onde quiser no form */}
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>
                    Instrutores
                  </Typography>

                  <Select
                    multiple
                    fullWidth
                    value={instrutoresSelecionados}
                    onChange={(e) => setInstrutoresSelecionados(e.target.value)}
                    renderValue={(selected) =>
                      instrutores
                        .filter(i => selected.includes(i.id))
                        .map(i => i.nome)
                        .join(", ")
                    }
                  >
                    {instrutores.map(instrutor => (
                      <MenuItem key={instrutor.id} value={instrutor.id}>
                        <Checkbox checked={instrutoresSelecionados.includes(instrutor.id)} />
                        <ListItemText primary={instrutor.nome} />
                      </MenuItem>
                    ))}
                  </Select>
                </Paper>

                {/* Thumbnails */}
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>🖼️ Thumbnails</Typography>
                  <Stack spacing={3}>
                    <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                      Upload Thumbnail Desktop
                      <input type="file" accept="image/*" hidden onChange={(e) => setThumbnailDesktop(e.target.files?.[0] ?? null)} />
                    </Button>
                    {thumbnailDesktop && <Typography variant="body2">{thumbnailDesktop.name}</Typography>}

                    <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                      Upload Thumbnail Mobile
                      <input type="file" accept="image/*" hidden onChange={(e) => setThumbnailMobile(e.target.files?.[0] ?? null)} />
                    </Button>
                    {thumbnailMobile && <Typography variant="body2">{thumbnailMobile.name}</Typography>}

                    <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                      Upload Thumbnail Destaque
                      <input type="file" accept="image/*" hidden onChange={(e) => setThumbnailDestaque(e.target.files?.[0] ?? null)} />
                    </Button>
                    {thumbnailDestaque && <Typography variant="body2">{thumbnailDestaque.name}</Typography>}
                  </Stack>
                </Paper>

                {/* Conteúdo gratuito (select estilizado) */}
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                  <Stack direction="column" alignItems="flex-start" spacing={2}>
                    <Typography variant="h6" fontWeight="700">💰 Conteúdo Gratuito</Typography>

                    <TextField
                      select
                      fullWidth
                      label="Selecione uma opção"
                      value={gratuitoTipo}
                      onChange={(e) => setGratuitoTipo(e.target.value)}
                    >
                      <MenuItem value="NENHUM">Nenhum</MenuItem>
                      <MenuItem value="PERMANENTE">Permanente</MenuItem>
                      <MenuItem value="TEMPORARIO">Temporário</MenuItem>
                    </TextField>

                    {gratuitoTipo === "TEMPORARIO" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.2 }}
                        style={{ width: "100%" }}
                      >
                        <Grid container spacing={2} mt={1}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              type="date"
                              label="Data de Fim"
                              InputLabelProps={{ shrink: true }}
                              value={gratuitoDataFim}
                              onChange={(e) => setGratuitoDataFim(e.target.value)}
                            />
                          </Grid>
                        </Grid>
                      </motion.div>
                    )}

                  </Stack>
                </Paper>


                {/* Upload de vídeo */}
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    border: file ? `2px solid ${theme.palette.primary.main}` : `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                    borderRadius: 3,
                    cursor: "pointer",
                    "&:hover": { borderColor: theme.palette.primary.main },
                  }}
                >
                  <input accept="video/*" type="file" style={{ display: "none" }} id="video-upload" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                  <label htmlFor="video-upload">
                    <Stack spacing={2} alignItems="center">
                      <CloudUploadIcon sx={{ fontSize: 48, color: "primary.main" }} />
                      <Button variant="contained" component="span" sx={{ borderRadius: 2 }}>
                        {file ? "Alterar Vídeo" : "Selecionar Vídeo"}
                      </Button>
                      {file && <Typography variant="body2" color="text.secondary">{file.name} - {(file.size / (1024 * 1024)).toFixed(2)} MB</Typography>}
                    </Stack>
                  </label>
                  {uploadProgress > 0 && <LinearProgress variant="determinate" value={uploadProgress} sx={{ mt: 3, height: 8, borderRadius: 4 }} />}
                </Paper>

                {/* Botão final */}
                <Button onClick={handleSubmit} variant="contained" size="large" sx={{ py: 2, fontSize: "1.1rem", fontWeight: "700", borderRadius: 3, textTransform: "none", bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark", transform: "translateY(-2px)" } }}>
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

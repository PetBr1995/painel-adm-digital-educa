import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stack,
  Fade,
  alpha,
} from "@mui/material";
import { ArrowBack, Send as SendIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import theme from "../theme/theme";

export default function CadastrarConteudo() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    categoriaId: "",
    tipo: "CURSO",
    level: "Iniciante",
    aprendizagem: "",
    requisitos: "",
    thumbnailDesktop: "",
    thumbnailMobile: "",
    thumbnailDestaque: "",
  });

  const [categorias, setCategorias] = useState([]);
  const [categoriasLoading, setCategoriasLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "info" });

  const showAlert = (message, type = "info") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "info" }), 5000);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchCategorias = async () => {
      try {
        setCategoriasLoading(true);
        const res = await axios.get(
          "https://testeapi.digitaleduca.com.vc/categorias/list",
          { headers: { Authorization: `Bearer ${token}` } }
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

    if (!form.titulo.trim()) return showAlert("Informe o título do conteúdo", "warning");
    if (!form.categoriaId) return showAlert("Selecione uma categoria", "warning");

    try {
      const token = localStorage.getItem("token");

      const payload = {
        titulo: form.titulo,
        descricao: form.descricao,
        categoriaId: form.categoriaId,
        tipo: form.tipo,
        level: form.level,
        aprendizagem: form.aprendizagem,
        requisitos: form.requisitos,
        thumbnailDesktop: form.thumbnailDesktop,
        thumbnailMobile: form.thumbnailMobile,
        thumbnailDestaque: form.thumbnailDestaque,
        fileSize: 0, // necessário para o backend
      };

      const res = await axios.post(
        "https://testeapi.digitaleduca.com.vc/conteudos/create",
        payload,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      console.log("Resposta do backend:", res.data);

      // 🔹 Apenas registra o ID se ele existir, mas não mostra alerta se não vier
      const conteudoId = res.data.id || res.data.conteudoId || res.data.data?.id;
      console.log("Conteúdo criado com ID:", conteudoId);

      showAlert("Conteúdo criado com sucesso!", "success");

      // Reset do formulário
      setForm({
        titulo: "",
        descricao: "",
        categoriaId: "",
        tipo: "CURSO",
        level: "Iniciante",
        aprendizagem: "",
        requisitos: "",
        thumbnailDesktop: "",
        thumbnailMobile: "",
        thumbnailDestaque: "",
      });

      navigate("/cursos");
    } catch (err) {
      console.error("Erro ao criar conteúdo:", err);
      const msg =
        err.response?.data?.message?.[0] || err.response?.data?.error || "Erro ao criar conteúdo";
      showAlert(msg, "error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <Container maxWidth="md">
        <Stack spacing={4}>
          {alert.show && (
            <Fade in>
              <Alert severity={alert.type}>{alert.message}</Alert>
            </Fade>
          )}

          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/cursos")}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              mb: 3,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
            }}
          >
            Voltar aos conteúdos
          </Button>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
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
                label="Descrição"
                multiline
                rows={3}
                value={form.descricao}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                name="aprendizagem"
                label="O que você vai aprender"
                multiline
                rows={3}
                value={form.aprendizagem}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                name="requisitos"
                label="Pré-requisitos"
                multiline
                rows={3}
                value={form.requisitos}
                onChange={handleChange}
              />

              <FormControl fullWidth>
                <InputLabel>Tipo de Conteúdo</InputLabel>
                <Select name="tipo" value={form.tipo} onChange={handleChange}>
                  <MenuItem value="PALESTRA">Palestra</MenuItem>
                  <MenuItem value="CURSO">Curso</MenuItem>
                  <MenuItem value="PODCAST">Podcast</MenuItem>
                  <MenuItem value="WORKSHOP">Workshop</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Nível</InputLabel>
                <Select name="level" value={form.level} onChange={handleChange}>
                  <MenuItem value="Iniciante">Iniciante</MenuItem>
                  <MenuItem value="Intermediário">Intermediário</MenuItem>
                  <MenuItem value="Avançado">Avançado</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Categoria</InputLabel>
                <Select name="categoriaId" value={form.categoriaId} onChange={handleChange}>
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

              <TextField
                fullWidth
                name="thumbnailDesktop"
                label="Thumbnail Desktop (URL)"
                value={form.thumbnailDesktop}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                name="thumbnailMobile"
                label="Thumbnail Mobile (URL)"
                value={form.thumbnailMobile}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                name="thumbnailDestaque"
                label="Thumbnail Destaque (URL)"
                value={form.thumbnailDestaque}
                onChange={handleChange}
              />

              <Button
                type="submit"
                variant="contained"
                endIcon={<SendIcon />}
                disabled={loading}
                sx={{ py: 1.5, borderRadius: 2 }}
              >
                {loading ? "Enviando..." : "Criar Conteúdo"}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Container>
    </Box>
  );
}

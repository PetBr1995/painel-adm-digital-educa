import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Alert,
  IconButton,
  InputLabel,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const UploadVideo = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [moduloId, setModuloId] = useState(null);
  const [curso, setCurso] = useState(null);

  const [titulo, setTitulo] = useState("");
  const [duracao, setDuracao] = useState("");
  const [url, setUrl] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.moduloId) {
      setModuloId(location.state.moduloId);
      setCurso(location.state.curso);
    } else {
      setMensagem("ID do módulo não encontrado.");
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo || !duracao || !url || !moduloId) {
      setMensagem("Preencha todos os campos.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMensagem("Token não encontrado. Faça login novamente.");
      return;
    }

    try {
      setLoading(true);
      setMensagem("");

      const response = await axios.post(
        "https://api.digitaleduca.com.vc/video/create",
        {
          titulo,
          duracao: parseFloat(duracao),
          moduloId,
          url,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Vídeo cadastrado:", response.data);
      setMensagem("Vídeo cadastrado com sucesso!");
      setTitulo("");
      setDuracao("");
      setUrl("");
    } catch (error) {
      console.error("❌ Erro ao cadastrar vídeo:", error.response || error.message);
      const errMsg =
        error.response?.data?.message || "Erro ao cadastrar vídeo. Tente novamente.";
      setMensagem(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <Box sx={{ maxWidth: "600px", mx: "auto", px: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: 3 }}>
          <IconButton
            onClick={() => navigate("/modulos", { state: { curso } })}
            aria-label="Voltar para módulos"
            color="primary"
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>

        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
          Cadastrar Vídeo
        </Typography>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Título do vídeo"
              variant="outlined"
              sx={{ mb: 3 }}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Duração (em segundos)"
              variant="outlined"
              sx={{ mb: 3 }}
              type="number"
              value={duracao}
              onChange={(e) => setDuracao(e.target.value)}
              disabled={loading}
            />
            <TextField
              fullWidth
              label="URL do vídeo (ex: Vimeo)"
              variant="outlined"
              sx={{ mb: 3 }}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ textTransform: "none", py: 1.5 }}
              disabled={loading}
            >
              {loading ? "Enviando..." : "Cadastrar Vídeo"}
            </Button>
          </form>

          {mensagem && (
            <Alert
              severity={mensagem.includes("sucesso") ? "success" : "error"}
              sx={{ mt: 3 }}
            >
              {mensagem}
            </Alert>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default UploadVideo;

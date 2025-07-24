import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  LinearProgress,
  CircularProgress,
  Alert,
  IconButton,
  InputLabel,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const UploadVideo = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [moduloId, setModuloId] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [uploadProgresses, setUploadProgresses] = useState([]);
  const [uploadResults, setUploadResults] = useState([]);
  const [curso, setCurso] = useState(null);

  useEffect(() => {
    if (location.state?.moduloId) {
      setModuloId(location.state.moduloId);
      setCurso(location.state.curso);
    } else {
      setMensagem("ID do módulo não encontrado.");
    }
  }, [location.state]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    const processed = [];

    for (const file of files) {
      const duration = await getVideoDuration(file);
      processed.push({ file, duration, title: "" });
    }

    setVideos(processed);
    setUploadProgresses(new Array(processed.length).fill(0));
    setUploadResults([]);
  };

  const getVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const handleTitleChange = (index, value) => {
    setVideos((prev) =>
      prev.map((v, i) => (i === index ? { ...v, title: value } : v))
    );
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!moduloId) {
      setMensagem("ID do módulo não encontrado.");
      return;
    }

    if (videos.length === 0) {
      setMensagem("Selecione pelo menos um vídeo.");
      return;
    }

    setLoading(true);
    setMensagem("");
    setUploadResults([]);

    const token = localStorage.getItem("token");
    const results = [];

    for (let i = 0; i < videos.length; i++) {
      const { file, title, duration } = videos[i];
      const formData = new FormData();

      formData.append("videos", file);
      formData.append("titulos", title || file.name);
      formData.append("duracoes", duration?.toFixed(2) || "0");

      try {
        const response = await axios.post(
          `https://api.digitaleduca.com.vc/video/upload?moduloId=${moduloId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            onUploadProgress: (progressEvent) => {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgresses((prev) =>
                prev.map((p, idx) => (idx === i ? percent : p))
              );
            },
          }
        );

        results.push({
          status: "fulfilled",
          video: response.data,
          title: title || file.name
        });
      } catch (err) {
        console.error("Erro ao enviar vídeo:", err);
        const msg =
          Array.isArray(err?.response?.data?.message)
            ? err.response.data.message.join(", ")
            : err?.response?.data?.message || "Erro desconhecido.";

        results.push({
          status: "rejected",
          error: msg,
        });
      }
    }

    setUploadResults(results);
    setVideos([]);
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <Box sx={{ maxWidth: "800px", mx: "auto", px: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: 3 }}>
          <IconButton
            onClick={() => navigate("/modulos", { state: { curso } })}
            aria-label="Voltar para módulos"
            color="primary"
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 4,
            color: "text.primary",
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          Upload de Vídeo
        </Typography>

        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          <form onSubmit={handleUpload}>
            <InputLabel sx={{ mb: 1, fontWeight: "medium" }}>
              Selecionar vídeos
            </InputLabel>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 3, textTransform: "none" }}
              disabled={loading}
            >
              Escolher arquivos
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </Button>

            {videos.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "medium", mb: 2 }}>
                  Vídeos selecionados
                </Typography>
                {videos.map(({ file, duration, title }, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 2,
                      p: 2,
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {file.name} — {duration.toFixed(2)} segundos
                    </Typography>
                    <TextField
                      fullWidth
                      label={`Título do vídeo ${index + 1} (opcional)`}
                      value={title}
                      onChange={(e) =>
                        handleTitleChange(index, e.target.value)
                      }
                      variant="outlined"
                      size="small"
                    />
                    {loading && (
                      <Box sx={{ mt: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={uploadProgresses[index] || 0}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          Enviando: {uploadProgresses[index] || 0}%
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              disabled={loading || videos.length === 0}
              sx={{ textTransform: "none", px: 4, py: 1.5 }}
              fullWidth
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Enviar Vídeo(s)"
              )}
            </Button>
          </form>

          {mensagem && (
            <Alert
              severity={mensagem.includes("sucesso") ? "success" : "info"}
              sx={{ mt: 3 }}
            >
              {mensagem}
            </Alert>
          )}

          {uploadResults.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6">Resultado do upload:</Typography>
              {uploadResults.map((res, index) => (
                <Alert
                  key={index}
                  severity={res.status === "fulfilled" ? "success" : "error"}
                  sx={{ mt: 1 }}
                >
                  {res.status === "fulfilled"
                    ? `✅ ${res.title} enviado com sucesso`
                    : `❌ Erro no vídeo ${index + 1}: ${res.error}`}
                </Alert>
              ))}
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default UploadVideo;

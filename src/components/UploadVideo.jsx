import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  InputLabel,
  CircularProgress,
  Alert,
  Paper,
  LinearProgress,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";

const UploadVideo = () => {
  const { moduloId } = useParams();
  const [videos, setVideos] = useState([]); // Now includes title for each video
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const processed = [];

    for (const file of files) {
      const duration = await getVideoDuration(file);
      processed.push({ file, duration, title: "" }); // Initialize title as empty
    }

    setVideos(processed);
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
    setVideos((prevVideos) =>
      prevVideos.map((video, i) =>
        i === index ? { ...video, title: value } : video
      )
    );
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (videos.length === 0) {
      setMensagem("Selecione pelo menos um vídeo.");
      return;
    }

    setLoading(true);
    setMensagem("");
    setUploadProgress(0);

    try {
      const token = localStorage.getItem("token");

      for (const [index, { file, duration, title }] of videos.entries()) {
        const formData = new FormData();
        formData.append("titulo", title || file.name); // Use custom title or fallback to file name
        formData.append("video", file);
        formData.append("duracao", duration.toFixed(2));

        await axios.post(
          `https://api.digitaleduca.com.vc/video/upload?moduloId=${moduloId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(
                (prev) => (index / videos.length) * 100 + percentCompleted / videos.length
              );
            },
          }
        );
      }

      setMensagem("Vídeos enviados com sucesso!");
      setVideos([]);
    } catch (error) {
      console.error("Erro ao enviar vídeos:", error);
      setMensagem("Erro ao enviar vídeos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <Box sx={{ maxWidth: "800px", mx: "auto", px: { xs: 2, sm: 3 } }}>
        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <IconButton
            onClick={() => navigate("/modulos")}
            aria-label="Voltar para módulos"
            color="primary"
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>

        {/* Header */}
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

        {/* Form */}
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
                aria-label="Selecionar vídeos"
              />
            </Button>

            {/* Video Titles and Preview */}
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
                      onChange={(e) => handleTitleChange(index, e.target.value)}
                      variant="outlined"
                      size="small"
                      aria-label={`Título para ${file.name}`}
                    />
                  </Box>
                ))}
              </Box>
            )}

            {loading && (
              <Box sx={{ mb: 3 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="caption" color="text.secondary">
                  Enviando: {Math.round(uploadProgress)}%
                </Typography>
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
              {loading ? <CircularProgress size={24} color="inherit" /> : "Enviar Vídeo(s)"}
            </Button>
          </form>

          {/* Feedback Message */}
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
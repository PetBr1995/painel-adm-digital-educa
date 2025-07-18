import { useParams } from "react-router-dom";
import { useState } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    InputLabel,
    CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

const UploadVideo = () => {
    const { moduloId } = useParams();
    const [titulo, setTitulo] = useState("");
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState("");

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        const processed = [];

        for (const file of files) {
            const duration = await getVideoDuration(file);
            processed.push({ file, duration });
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

    const handleUpload = async (e) => {
        console.log(moduloId)
        e.preventDefault();

        if (videos.length === 0) {
            setMensagem("Selecione pelo menos um vídeo.");
            return;
        }

        setLoading(true);
        setMensagem("");

        try {
            const token = localStorage.getItem("token");

            for (const { file, duration } of videos) {
                const formData = new FormData();
                formData.append("titulo", titulo || file.name);
                formData.append("video", file);
                formData.append("duracao", duration.toFixed(2)); // duração em segundos
        

                await axios.post("https://api.digitaleduca.com.vc/video/upload?moduloId="+moduloId+", formData", {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            setMensagem("Vídeos enviados com sucesso!");
            setTitulo("");
            setVideos([]);
        } catch (error) {
            console.error("Erro ao enviar vídeos:", error);
            setMensagem("Erro ao enviar vídeos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Box>

            </Box>
            <Box sx={{ p: 4, maxWidth: "600px", mx: "auto" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
                    Upload de Vídeo
                </Typography>

                <form onSubmit={handleUpload}>
                    <TextField
                        fullWidth
                        label="Título geral (opcional)"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <InputLabel sx={{ mb: 1 }}>Arquivos de vídeo:</InputLabel>
                    <input
                        type="file"
                        accept="video/*"
                        multiple
                        onChange={handleFileChange}
                        style={{ marginBottom: "20px" }}
                    />

                    <Box sx={{ mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : "Enviar Vídeo(s)"}
                        </Button>
                    </Box>
                </form>

                {mensagem && (
                    <Typography sx={{ mt: 2, color: mensagem.includes("sucesso") ? "green" : "red" }}>
                        {mensagem}
                    </Typography>
                )}

                {videos.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                            Pré-visualização dos vídeos:
                        </Typography>
                        {videos.map(({ file, duration }, index) => (
                            <Typography key={index} variant="body2">
                                {file.name} — {duration.toFixed(2)} segundos
                            </Typography>
                        ))}
                    </Box>
                )}
            </Box>
        </>
    );
};

export default UploadVideo;

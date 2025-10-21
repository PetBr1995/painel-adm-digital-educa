import React, { useState, useRef } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    LinearProgress,
    TextField,
    Avatar,
    Stack,
} from "@mui/material";
import { CloudUpload, CheckCircle, Error, VideoFile, ArrowBack } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import * as tus from "tus-js-client";
import Swal from "sweetalert2";

const UploadVideoIntrodutorio = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const conteudoId =
        location.state?.conteudoId || new URLSearchParams(window.location.search).get("conteudoId");

    const [videoFile, setVideoFile] = useState(null);
    const [titulo, setTitulo] = useState("");
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("pending"); // pending | uploading | success | error
    const [videoLink, setVideoLink] = useState("");
    const [duracao, setDuracao] = useState(0);

    const videoRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("video/")) {
            Swal.fire("Erro", "Selecione um arquivo de vídeo válido", "warning");
            return;
        }

        setVideoFile(file);
        setTitulo(file.name.replace(/\.[^/.]+$/, ""));
        setStatus("pending");
        setProgress(0);
        setVideoLink("");

        const videoEl = document.createElement("video");
        videoEl.preload = "metadata";
        videoEl.onloadedmetadata = () => {
            setDuracao(Math.floor(videoEl.duration));
            URL.revokeObjectURL(videoEl.src);
        };
        videoEl.src = URL.createObjectURL(file);
    };

    const uploadVideoToVimeo = async () => {
        if (!videoFile) return Swal.fire("Erro", "Selecione um vídeo", "warning");
        if (!titulo.trim()) return Swal.fire("Erro", "Insira um título para o vídeo", "warning");
        if (!conteudoId) return Swal.fire("Erro", "Conteúdo não identificado", "error");

        setStatus("uploading");
        setProgress(0);

        try {
            const token = localStorage.getItem("token");

            // 1️⃣ Criar registro de vídeo no backend e obter link de upload do Vimeo
            const payload = {
                titulo: titulo.trim(),
                duracao,
                conteudoId,
                fileSize: videoFile.size,
            };

            const { data } = await axios.post(
                "http://10.10.11.174:3000/video/create",
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const dbVideoId = data.video?.id ?? data.id ?? data.videoId;
            const vimeoUploadLink = data.vimeoUploadLink;

            if (!dbVideoId || !vimeoUploadLink) {
                throw new Error("ID do vídeo ou link de upload não retornados pelo backend");
            }

            // 2️⃣ Upload do vídeo para Vimeo via tus-js-client
            await new Promise((resolve, reject) => {
                const upload = new tus.Upload(videoFile, {
                    uploadUrl: vimeoUploadLink,
                    metadata: { filename: videoFile.name, filetype: videoFile.type },
                    chunkSize: 5 * 1024 * 1024,
                    onError: (err) => {
                        console.error("Erro no upload:", err);
                        setStatus("error");
                        reject(err);
                    },
                    onProgress: (bytesUploaded, bytesTotal) => {
                        setProgress((bytesUploaded / bytesTotal) * 100);
                    },
                    onSuccess: async () => {
                        try {
                            const videoUrl = `https://vimeo.com/${dbVideoId}`;

                            // 🔹 Obter o conteúdo atual para evitar enviar campos inválidos
                            const { data: conteudoAtual } = await axios.get(
                                `http://10.10.11.174:3000/conteudos/${conteudoId}`,
                                { headers: { Authorization: `Bearer ${token}` } }
                            );

                            // 🔹 Filtrar somente os campos permitidos para PUT
                            const updatePayload = {
                                titulo: conteudoAtual.titulo,
                                descricao: conteudoAtual.descricao,
                                categoriaId: conteudoAtual.categoriaId,
                                level: conteudoAtual.level,
                                requisitos: conteudoAtual.requisitos,
                                videoIntrodutorio: videoUrl, // atualizando apenas o vídeo
                            };

                            await axios.put(
                                `http://10.10.11.174:3000/conteudos/${conteudoId}`,
                                updatePayload,
                                { headers: { Authorization: `Bearer ${token}` } }
                            );

                            setStatus("success");
                            setProgress(100);
                            setVideoLink(videoUrl);

                            Swal.fire("Sucesso", "Vídeo vinculado ao conteúdo!", "success");
                            resolve();
                        } catch (err) {
                            console.error("Erro ao vincular vídeo:", err.response?.data || err);
                            setStatus("error");
                            Swal.fire("Erro", "Falha ao vincular vídeo ao conteúdo", "error");
                            reject(err);
                        }
                    },
                });

                upload.start();
            });
        } catch (err) {
            console.error("Erro no fluxo de upload:", err);
            setStatus("error");
            Swal.fire("Erro", "Falha ao enviar vídeo", "error");
        }
    };


    const getStatusIcon = () => {
        switch (status) {
            case "success":
                return <CheckCircle color="success" />;
            case "error":
                return <Error color="error" />;
            case "uploading":
                return <VideoFile color="primary" />;
            default:
                return <VideoFile />;
        }
    };

    return (
        <Card sx={{ borderRadius: 3, mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
                <Button
                    startIcon={<ArrowBack />}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    onClick={() => navigate(-1)}
                >
                    Voltar
                </Button>

                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Vídeo Introdutório
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Adicione um vídeo introdutório para este conteúdo.
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        label="Título do vídeo"
                        fullWidth
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        disabled={status === "uploading" || status === "success"}
                    />

                    <input
                        accept="video/*"
                        style={{ display: "none" }}
                        id="upload-video-intro"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="upload-video-intro">
                        <Button
                            variant="contained"
                            component="span"
                            startIcon={<CloudUpload />}
                            disabled={status === "uploading" || status === "success"}
                        >
                            {videoFile ? "Alterar vídeo" : "Selecionar vídeo"}
                        </Button>
                    </label>

                    {videoFile && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar>{getStatusIcon()}</Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle1">{videoFile.name}</Typography>
                                    {status === "uploading" && (
                                        <LinearProgress
                                            variant="determinate"
                                            value={progress}
                                            sx={{ height: 8, borderRadius: 4, mt: 1 }}
                                        />
                                    )}
                                    {status === "success" && (
                                        <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                                            Vídeo enviado e vinculado!
                                        </Typography>
                                    )}
                                    {status === "error" && (
                                        <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                                            Erro ao enviar vídeo
                                        </Typography>
                                    )}
                                </Box>
                            </Box>

                            {status === "success" && (
                                <video ref={videoRef} src={videoLink} controls style={{ width: "100%", borderRadius: 8 }} />
                            )}
                        </Box>
                    )}

                    <Button
                        variant="contained"
                        startIcon={<CloudUpload />}
                        onClick={uploadVideoToVimeo}
                        disabled={!videoFile || status === "uploading" || status === "success"}
                    >
                        {status === "uploading" ? "Enviando..." : "Enviar Vídeo"}
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default UploadVideoIntrodutorio;

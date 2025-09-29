import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
    Alert,
    IconButton,
    LinearProgress,
    Chip,
    List,
    ListItem,
    Divider,
    Container,
    Card,
    CardContent,
    Avatar,
    Stack,
    alpha,
    Fade,
    Snackbar,
    Grid,
    Tooltip
} from "@mui/material";
import {
    ArrowBack,
    CloudUpload,
    Delete,
    CheckCircle,
    Error,
    VideoFile,
    FileUpload,
    VideoLibrary,
    Folder,
    Upload as UploadIcon
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import * as tus from "tus-js-client";
import theme from "../theme/theme";

const UploadVideoModulo = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [moduloId, setModuloId] = useState(null);
    const [conteudoId, setConteudoId] = useState(null);
    const [videos, setVideos] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [loading, setLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState('success');

    useEffect(() => {
        if (location.state?.moduloId && location.state?.conteudoId) {
            setModuloId(location.state.moduloId);
            setConteudoId(location.state.conteudoId);
        } else {
            setMensagem("Dados do módulo ou conteúdo não encontrados.");
            setAlertSeverity('error');
            setShowAlert(true);
        }
    }, [location.state]);

    const showMessage = (msg, isError = false) => {
        setMensagem(msg);
        setAlertSeverity(isError ? 'error' : 'success');
        setShowAlert(true);
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (!selectedFiles.length) return;

        // Filtrar apenas arquivos de vídeo
        const videoFiles = selectedFiles.filter(file => file.type.startsWith("video/"));
        if (videoFiles.length !== selectedFiles.length) {
            showMessage(`${selectedFiles.length - videoFiles.length} arquivo(s) não são vídeos e foram ignorados`, true);
        }

        if (videoFiles.length === 0) return;

        const newVideos = videoFiles.map((file, index) => ({
            id: Date.now() + index,
            file,
            titulo: file.name.replace(/\.[^/.]+$/, ""),
            progress: 0,
            status: "pending",
        }));

        setVideos((prev) => [...prev, ...newVideos]);
        showMessage(`${videoFiles.length} vídeo(s) adicionado(s) com sucesso`);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
            file.type.startsWith("video/")
        );

        if (!droppedFiles.length) {
            showMessage("Nenhum arquivo de vídeo válido foi encontrado", true);
            return;
        }

        const newVideos = droppedFiles.map((file, index) => ({
            id: Date.now() + index,
            file,
            titulo: file.name.replace(/\.[^/.]+$/, ""),
            progress: 0,
            status: "pending",
        }));

        setVideos((prev) => [...prev, ...newVideos]);
        showMessage(`${droppedFiles.length} vídeo(s) adicionado(s) via drag & drop`);
    };

    const handleRemoveVideo = (videoId) => {
        setVideos((prev) => prev.filter((video) => video.id !== videoId));
        showMessage("Vídeo removido da lista");
    };

    const handleVideoTitleChange = (videoId, newTitle) => {
        setVideos((prev) =>
            prev.map((video) => (video.id === videoId ? { ...video, titulo: newTitle } : video))
        );
    };

    const updateVideoProgress = (videoId, progress) => {
        setVideos((prev) =>
            prev.map((video) => (video.id === videoId ? { ...video, progress } : video))
        );
    };

    const updateVideoStatus = (videoId, status) => {
        setVideos((prev) =>
            prev.map((video) => (video.id === videoId ? { ...video, status } : video))
        );
    };

    const uploadSingleVideo = async (videoId) => {
        try {
            const currentVideo = videos.find((v) => v.id === videoId);
            if (!currentVideo) throw new Error("Vídeo não encontrado");

            updateVideoStatus(videoId, "uploading");
            updateVideoProgress(videoId, 0);

            const payload = {
                titulo: currentVideo.titulo.trim(),
                duracao: 0,
                moduloId,
                conteudoId,
                fileSize: currentVideo.file.size,
            };

            const token = localStorage.getItem("token");

            const { data } = await axios.post(
                "https://testeapi.digitaleduca.com.vc/video/create",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const dbVideoId = data.video?.id ?? data.id ?? data.videoId;
            const vimeoUploadLink = data.vimeoUploadLink;

            if (!dbVideoId || !vimeoUploadLink) {
                throw new Error("Erro: ID ou link de upload não retornados pelo backend");
            }

            return new Promise((resolve, reject) => {
                const upload = new tus.Upload(currentVideo.file, {
                    uploadUrl: vimeoUploadLink,
                    metadata: { filename: currentVideo.file.name, filetype: currentVideo.file.type },
                    chunkSize: 5 * 1024 * 1024,
                    onError: (err) => {
                        console.error("Erro no upload:", err);
                        updateVideoStatus(videoId, "error");
                        reject(err);
                    },
                    onProgress: (bytesUploaded, bytesTotal) => {
                        const percentage = (bytesUploaded / bytesTotal) * 100;
                        updateVideoProgress(videoId, percentage);
                    },
                    onSuccess: async () => {
                        try {
                            await axios.post(
                                `https://testeapi.digitaleduca.com.vc/vimeo-client/video/${dbVideoId}/update-metadata`,
                                { name: currentVideo.titulo, description: "" },
                                { headers: { Authorization: `Bearer ${token}` } }
                            );

                            updateVideoStatus(videoId, "success");
                            updateVideoProgress(videoId, 100);
                            resolve(currentVideo);
                        } catch {
                            updateVideoStatus(videoId, "success");
                            updateVideoProgress(videoId, 100);
                            resolve(currentVideo);
                        }
                    },
                });

                upload.start();
            });
        } catch (err) {
            console.error("Erro ao criar vídeo:", err);
            updateVideoStatus(videoId, "error");
            throw err;
        }
    };

    const handleSubmit = async () => {
        if (!moduloId) return showMessage("Módulo não informado.", true);
        if (videos.length === 0) return showMessage("Adicione pelo menos um vídeo.", true);

        const videosWithoutTitle = videos.filter((v) => !v.titulo.trim());
        if (videosWithoutTitle.length > 0) return showMessage("Todos os vídeos devem ter um título.", true);

        setLoading(true);

        try {
            const videosToUpload = videos.filter((v) => v.status === "pending");
            const uploadPromises = videosToUpload.map((video) => uploadSingleVideo(video.id));
            await Promise.allSettled(uploadPromises);

            const successCount = videos.filter((v) => v.status === "success").length;
            const errorCount = videos.filter((v) => v.status === "error").length;

            if (successCount > 0) showMessage(`${successCount} vídeo(s) enviado(s) com sucesso!`);
            if (errorCount > 0) showMessage(`${errorCount} vídeo(s) falharam no upload.`, true);

            // Aguardar um pouco antes de navegar para mostrar o feedback
            setTimeout(() => {
                navigate(`/conteudos/${conteudoId}`);
            }, 2000);
        } catch (err) {
            console.error("Erro no processo de upload:", err);
            showMessage("Erro durante o processo de upload.", true);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
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

    const getStatusColor = (status) => {
        switch (status) {
            case "success":
                return "success";
            case "error":
                return "error";
            case "uploading":
                return "primary";
            default:
                return "default";
        }
    };

    const getTotalSize = () => {
        return videos.reduce((total, video) => total + video.file.size, 0);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getOverallProgress = () => {
        if (videos.length === 0) return 0;
        const totalProgress = videos.reduce((sum, video) => sum + video.progress, 0);
        return totalProgress / videos.length;
    };

    return (
        <Box sx={{
            minHeight: "100vh",
            bgcolor: alpha(theme.palette.primary.main, 0.02),
            py: 4
        }}>
            <Container maxWidth="md">
                <Fade in timeout={300}>
                    <Box>
                        {/* Header */}
                        <Box sx={{ mb: 4 }}>
                            <Button
                                startIcon={<ArrowBack />}
                                onClick={() => navigate(`/conteudos/${conteudoId}`)}
                                sx={{
                                    mb: 3,
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    color: theme.palette.text.secondary,
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                                    }
                                }}
                            >
                                Voltar aos conteúdos
                            </Button>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Avatar sx={{
                                    bgcolor: theme.palette.primary.main,
                                    width: 56,
                                    height: 56
                                }}>
                                    <VideoLibrary sx={{ fontSize: 28 }} />
                                </Avatar>
                                <Box>
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: 700,
                                            color: theme.palette.text.primary,
                                            mb: 0.5
                                        }}
                                    >
                                        Upload de Vídeos
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Adicione vídeos ao módulo do seu curso
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Stats Cards */}
                            {videos.length > 0 && (
                                <Grid container spacing={3} sx={{ mb: 3 }}>
                                    <Grid item xs={12} sm={4}>
                                        <Card sx={{
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                            color: 'white'
                                        }}>
                                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar sx={{ bgcolor: alpha('#fff', 0.2) }}>
                                                    <VideoFile />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h4" fontWeight="bold">
                                                        {videos.length}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                        Vídeos
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <Card sx={{
                                            background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                                            color: 'white'
                                        }}>
                                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar sx={{ bgcolor: alpha('#fff', 0.2) }}>
                                                    <Folder />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h6" fontWeight="bold">
                                                        {formatFileSize(getTotalSize())}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                        Tamanho Total
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <Card sx={{
                                            background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                                            color: 'white'
                                        }}>
                                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar sx={{ bgcolor: alpha('#fff', 0.2) }}>
                                                    <CheckCircle />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h4" fontWeight="bold">
                                                        {videos.filter(v => v.status === 'success').length}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                        Concluídos
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            )}

                            {/* Overall Progress */}
                            {loading && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Progresso geral: {getOverallProgress().toFixed(1)}%
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={getOverallProgress()}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            '& .MuiLinearProgress-bar': {
                                                borderRadius: 4,
                                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                                            }
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>

                        {/* Main Upload Card */}
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: 4,
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                                overflow: 'hidden'
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                {/* Upload Zone */}
                                <Box
                                    sx={{
                                        border: "2px dashed",
                                        borderColor: isDragging
                                            ? theme.palette.primary.main
                                            : videos.length > 0
                                                ? theme.palette.success.main
                                                : alpha(theme.palette.primary.main, 0.3),
                                        bgcolor: isDragging
                                            ? alpha(theme.palette.primary.main, 0.08)
                                            : videos.length > 0
                                                ? alpha(theme.palette.success.main, 0.04)
                                                : 'transparent',
                                        p: 4,
                                        textAlign: "center",
                                        borderRadius: 3,
                                        mb: 4,
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            borderColor: theme.palette.primary.main,
                                            bgcolor: alpha(theme.palette.primary.main, 0.04)
                                        }
                                    }}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        accept="video/*"
                                        style={{ display: "none" }}
                                        id="video-upload"
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                    />

                                    <Avatar sx={{
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        color: theme.palette.primary.main,
                                        width: 80,
                                        height: 80,
                                        mx: 'auto',
                                        mb: 2
                                    }}>
                                        <CloudUpload sx={{ fontSize: 40 }} />
                                    </Avatar>

                                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                                        {isDragging
                                            ? "Solte os arquivos aqui"
                                            : videos.length > 0
                                                ? "Adicionar mais vídeos"
                                                : "Carregar vídeos"
                                        }
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Arraste e solte arquivos de vídeo aqui ou clique para selecionar
                                    </Typography>

                                    <label htmlFor="video-upload">
                                        <Button
                                            variant="contained"
                                            component="span"
                                            startIcon={<FileUpload />}
                                            size="large"
                                            sx={{
                                                borderRadius: 3,
                                                px: 4,
                                                py: 1.5,
                                                textTransform: 'none',
                                                fontWeight: 600
                                            }}
                                        >
                                            Selecionar Arquivos
                                        </Button>
                                    </label>

                                    <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
                                        Formatos suportados: MP4, MOV, AVI, MKV
                                    </Typography>
                                </Box>

                                {/* Videos List */}
                                {videos.length > 0 && (
                                    <Box>
                                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                            Vídeos Selecionados ({videos.length})
                                        </Typography>

                                        <List sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02), borderRadius: 2 }}>
                                            {videos.map((video, index) => (
                                                <React.Fragment key={video.id}>
                                                    <ListItem sx={{ p: 3 }}>
                                                        <Box sx={{ width: "100%" }}>
                                                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                                                <Avatar sx={{
                                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                    color: theme.palette.primary.main,
                                                                    mr: 2
                                                                }}>
                                                                    {getStatusIcon(video.status)}
                                                                </Avatar>

                                                                <Box sx={{ flex: 1 }}>
                                                                    <Typography variant="subtitle1" fontWeight={600}>
                                                                        {video.file.name}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {formatFileSize(video.file.size)}
                                                                    </Typography>
                                                                </Box>

                                                                <Stack direction="row" spacing={1} alignItems="center">
                                                                    <Chip
                                                                        size="small"
                                                                        label={video.status === 'pending' ? 'Aguardando' :
                                                                            video.status === 'uploading' ? 'Enviando...' :
                                                                                video.status === 'success' ? 'Concluído' : 'Erro'}
                                                                        color={getStatusColor(video.status)}
                                                                        variant="outlined"
                                                                    />

                                                                    <Tooltip title="Remover vídeo">
                                                                        <IconButton
                                                                            onClick={() => handleRemoveVideo(video.id)}
                                                                            disabled={video.status === "uploading"}
                                                                            size="small"
                                                                            sx={{
                                                                                color: theme.palette.error.main,
                                                                                '&:hover': {
                                                                                    bgcolor: alpha(theme.palette.error.main, 0.1)
                                                                                }
                                                                            }}
                                                                        >
                                                                            <Delete fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Stack>
                                                            </Box>

                                                            <TextField
                                                                fullWidth
                                                                label={`Título do Vídeo ${index + 1}`}
                                                                value={video.titulo}
                                                                onChange={(e) => handleVideoTitleChange(video.id, e.target.value)}
                                                                disabled={video.status === "uploading" || video.status === "success"}
                                                                sx={{
                                                                    mb: 2,
                                                                    '& .MuiOutlinedInput-root': {
                                                                        borderRadius: 2,
                                                                    }
                                                                }}
                                                                required
                                                                error={!video.titulo.trim() && video.status !== "success"}
                                                                helperText={!video.titulo.trim() && video.status !== "success" ? "Título é obrigatório" : ""}
                                                                placeholder="Digite um título descritivo para o vídeo"
                                                            />

                                                            {video.status === "uploading" && (
                                                                <Box>
                                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            Enviando...
                                                                        </Typography>
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            {video.progress.toFixed(1)}%
                                                                        </Typography>
                                                                    </Box>
                                                                    <LinearProgress
                                                                        variant="determinate"
                                                                        value={video.progress}
                                                                        sx={{
                                                                            height: 8,
                                                                            borderRadius: 4,
                                                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                            '& .MuiLinearProgress-bar': {
                                                                                borderRadius: 4,
                                                                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                                                                            }
                                                                        }}
                                                                    />
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    </ListItem>
                                                    {index < videos.length - 1 && <Divider />}
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Box>
                                )}

                                {/* Submit Button */}
                                {videos.length > 0 && (
                                    <Button
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        startIcon={<UploadIcon />}
                                        sx={{
                                            mt: 4,
                                            py: 2,
                                            borderRadius: 3,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            fontSize: '1.1rem',
                                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                            '&:hover': {
                                                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                                            },
                                            '&:disabled': {
                                                background: alpha(theme.palette.primary.main, 0.3)
                                            }
                                        }}
                                        onClick={handleSubmit}
                                        disabled={loading || videos.length === 0}
                                    >
                                        {loading ? "Enviando vídeos..." : `Enviar ${videos.length} Vídeo(s)`}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Notifications */}
                        <Snackbar
                            open={showAlert}
                            autoHideDuration={5000}
                            onClose={() => setShowAlert(false)}
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        >
                            <Alert
                                onClose={() => setShowAlert(false)}
                                severity={alertSeverity}
                                variant="filled"
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 500
                                }}
                            >
                                {mensagem}
                            </Alert>
                        </Snackbar>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default UploadVideoModulo;
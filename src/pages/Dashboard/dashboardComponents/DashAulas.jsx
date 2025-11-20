import {
    Box,
    Paper,
    Typography,
    useTheme,
    alpha,
    LinearProgress,
    Tooltip,
    Rating
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const DashAulas = () => {
    const theme = useTheme();

    const [aulas, setAulas] = useState({
        maisAssistido: null,
        melhorAvaliado: null,
        menosAssistido: null,
    });

    const [conteudos, setConteudos] = useState([]);

    // Buscar Conteúdos
    const getConteudos = async () => {
        try {
            const response = await axios.get(
                "https://api.digitaleduca.com.vc/conteudos",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            setConteudos(response.data?.data || []);
            console.log("Conteúdos:", response.data);
        } catch (error) {
            console.error("Erro ao buscar conteúdos:", error);
        }
    };

    // Buscar Métricas das Aulas
    const getAulas = async () => {
        try {
            const response = await axios.get(
                "https://api.digitaleduca.com.vc/dashboard/videos",
                {
                    headers: {
                        Authorization:
                            "Dashboard FDYWmkzwEDhacggv6tIZhHsqhz8FSkqVbsqR1QYsL722i8lRr9kFTiWofUmAYDQqvT3w8IcpjJwS9DqEkUpdmBtRzJEg9Ivy25jEXezoaMxpUvlFlct37ZQ4DOpMie",
                    },
                }
            );

            const data = response.data;
            console.log("Dados de aulas:", data);

            setAulas({
                maisAssistido: data.maisAssistido,
                melhorAvaliado: data.melhorAvaliado,
                menosAssistido: data.menosAssistido,
            });
        } catch (error) {
            console.error("Erro ao carregar métricas:", error);
        }
    };

    // Buscar usuários concluintes (arrumado)
    const usuarioConcluinte = async (id) => {
        try {
            const response = await axios.get(
                `https://api.digitaleduca.com.vc/dashboard/videos/${id}/usuarios-concluintes`,
                {
                    headers: {
                        Authorization:
                            "Dashboard FDYWmkzwEDhacggv6tIZhHsqhz8FSkqVbsqR1QYsL722i8lRr9kFTiWofUmAYDQqvT3w8IcpjJwS9DqEkUpdmBtRzJEg9Ivy25jEXezoaMxpUvlFlct37ZQ4DOpMie",
                    },
                }
            );
            console.log("Concluintes:", response.data);
        } catch (error) {
            console.error("Erro ao buscar concluintes:", error);
        }
    };

    useEffect(() => {
        getAulas();
        getConteudos();
    }, []);

    // 🔥 Renderização de cards com taxa e visualizações
    const renderCard = (titulo, aula, cor, destaque, mostrarViews = true) => (
        <Box
            sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: alpha(cor, 0.08),
                border: `1px solid ${alpha(cor, 0.3)}`,
                textAlign: "center",
                boxShadow: `0 0 10px ${alpha(cor, 0.15)}`,
                transition: "0.3s",
                "&:hover": {
                    boxShadow: `0 0 20px ${alpha(cor, 0.25)}`,
                },
            }}
        >
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 1, fontWeight: 500 }}>
                {titulo}
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 700, color: cor, mb: 1 }}>
                {aula?.titulo || "—"}
            </Typography>

            {/* 👁 Visualizações */}
            {mostrarViews && aula?.visualizacoes >= 0 && (
                <Typography
                    variant="body2"
                    sx={{
                        color: destaque ? cor : "text.secondary",
                        fontWeight: destaque ? 700 : 400,
                        fontSize: destaque ? "1.1rem" : "0.9rem",
                    }}
                >
                    👁 {aula?.visualizacoes ?? 0} visualizações
                </Typography>
            )}

            {/* 🔵 Barra de conclusão */}
            <Tooltip title="Taxa de conclusão estimada" placement="top">
                <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Taxa de Conclusão
                    </Typography>

                    <LinearProgress
                        variant="determinate"
                        value={aula?.taxaConclusao || 0}
                        sx={{
                            height: 8,
                            borderRadius: 5,
                            mt: 0.5,
                            "& .MuiLinearProgress-bar": {
                                backgroundColor: cor,
                            },
                        }}
                    />

                    <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5, display: "block" }}>
                        {aula?.taxaConclusao
                            ? `${aula.taxaConclusao.toFixed(1)}% concluída`
                            : "—"}
                    </Typography>
                </Box>
            </Tooltip>
        </Box>
    );

    return (
        <>
            <Paper
                elevation={4}
                sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.0),
                    borderRadius: 4,
                    p: 3,
                    mb: 4,
                    mt: 4,
                    textAlign: "center",
                    border: `1px solid ${alpha(theme.palette.primary.light, 0.3)}`,
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                    Métricas dos conteúdos
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                    Visão geral do desempenho dos conteúdos na plataforma
                </Typography>
            </Paper>

            <Paper
                elevation={6}
                sx={{
                    borderRadius: 4,
                    p: 4,
                    border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
                    backgroundColor: alpha(theme.palette.background.paper, 0.6),
                    mt: 5,
                }}
            >
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 3,
                        "@media (max-width: 900px)": {
                            gridTemplateColumns: "1fr",
                        },
                    }}
                >
                    {renderCard(
                        "Conteúdo com maior taxa de conclusão",
                        aulas.maisAssistido,
                        theme.palette.info.main,
                        true
                    )}

                    {renderCard(
                        "Melhor Avaliada",
                        aulas.melhorAvaliado,
                        theme.palette.success.main,
                        false,
                        true // 👈 **Agora exibe visualizações normalmente**
                    )}

                    {renderCard(
                        "Aula Menos Assistida",
                        aulas.menosAssistido,
                        theme.palette.warning.main
                    )}
                </Box>
            </Paper>
        </>
    );
};

export default DashAulas;

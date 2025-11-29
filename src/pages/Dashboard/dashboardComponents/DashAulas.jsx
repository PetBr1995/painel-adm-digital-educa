import {
    Box,
    Paper,
    Typography,
    useTheme,
    alpha,
    LinearProgress,
    Rating,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Chip,
} from "@mui/material";
import { Visibility, ArrowDropUp, ArrowDropDown } from "@mui/icons-material";
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

    // estado do modal
    const [modalOpen, setModalOpen] = useState(false);
    const [aulaSelecionada, setAulaSelecionada] = useState(null);
    const [tituloCardSelecionado, setTituloCardSelecionado] = useState("");

    const abrirModal = (aula, tituloCard) => {
        if (!aula) return;
        setAulaSelecionada(aula);
        setTituloCardSelecionado(tituloCard);
        setModalOpen(true);
    };

    const fecharModal = () => {
        setModalOpen(false);
        setAulaSelecionada(null);
        setTituloCardSelecionado("");
    };

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

    // Buscar usuários concluintes (mantido, se você usar em outro lugar)
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

    const formatarVisualizacoes = (valor) => {
        if (valor == null) return "0";
        const num = Number(valor);
        if (Number.isNaN(num)) return "0";
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
        if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
        return num.toString();
    };

    // 🔵 Card no modelo da imagem
    const renderCard = (tituloCard, aula, cor, mostrarViews = true) => {
        const variacao =
            aula?.variacao ?? aula?.crescimentoPercentual ?? aula?.percentual;
        const variacaoPositiva = variacao >= 0;

        return (
            <Box
                onClick={() => abrirModal(aula, tituloCard)}
                sx={{
                    p: 3,
                    borderRadius: 4,
                    background: theme.palette.secondary.dark,
                    border: `1px solid ${alpha(cor, 0.25)}`,
                    boxShadow: `0 10px 24px ${alpha(cor, 0.15)}`,
                    cursor: aula ? "pointer" : "default",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    transition: "0.25s",
                    "&:hover": {
                        transform: aula ? "translateY(-3px)" : "none",
                        boxShadow: aula
                            ? `0 18px 34px ${alpha(cor, 0.22)}`
                            : undefined,
                    },
                }}
            >
                {/* Badge de variação */}
                {typeof variacao === "number" && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 14,
                            right: 16,
                            px: 1.5,
                            py: 0.4,
                            borderRadius: 999,
                            fontSize: 12,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: alpha(
                                variacaoPositiva
                                    ? theme.palette.success.main
                                    : theme.palette.error.main,
                                0.1
                            ),
                            color: variacaoPositiva
                                ? theme.palette.success.main
                                : theme.palette.error.main,
                            fontWeight: 600,
                            minWidth: 60,
                        }}
                    >
                        {variacaoPositiva ? "+" : "-"}
                        {Math.abs(variacao)}%
                    </Box>
                )}

                {/* Ícone quadrado arredondado à esquerda */}
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2.5,
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 1,
                    }}
                >
                    <Visibility
                        sx={{
                            fontSize: 22,
                            color: theme.palette.primary.main,
                        }}
                    />
                </Box>

                {/* Label */}
                <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontWeight: 500 }}
                >
                    {tituloCard}
                </Typography>

                {/* Título truncado */}
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                    }}
                    title={aula?.titulo || ""} // título completo no tooltip nativo
                >
                    {aula?.titulo || "—"}
                </Typography>

                {/* Visualizações grandes */}
                {mostrarViews && (
                    <Box sx={{ mt: 1 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                color: theme.palette.text.primary,
                                lineHeight: 1.1,
                            }}
                        >
                            {formatarVisualizacoes(aula?.visualizacoes ?? 0)}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "text.secondary",
                                mt: 0.5,
                            }}
                        >
                            visualizações este mês
                        </Typography>
                    </Box>
                )}
            </Box>
        );
    };

    // 🎯 Linha da lista Top 5
    const renderConteudoRow = (conteudo, index) => {
        const titulo =
            conteudo?.titulo || conteudo?.nome || "Título não informado";
        const categoria =
            (typeof conteudo?.categoria === "string"
                ? conteudo.categoria
                : conteudo?.categoria?.nome) ||
            conteudo?.area ||
            conteudo?.categoriaNome ||
            "Categoria";

        const visualizacoes =
            conteudo?.visualizacoes ?? conteudo?.views ?? 0;
        const nota = conteudo?.notaMedia ?? conteudo?.rating ?? 0;
        const variacao =
            conteudo?.crescimentoPercentual ?? conteudo?.variacao;
        const variacaoPositiva = variacao >= 0;

        return (
            <Box
                key={conteudo?.id ?? index}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2.2,
                    borderRadius: 3,
                    border: `1px solid ${alpha(
                        theme.palette.primary.light,
                        0.08
                    )}`,
                    bgcolor: theme.palette.background.paper,
                    mb: 1.5,
                    gap: 2,
                    "@media (max-width: 900px)": {
                        flexDirection: "column",
                        alignItems: "flex-start",
                    },
                }}
            >
                {/* Posição */}
                <Box
                    sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.primary.main,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 14,
                        flexShrink: 0,
                    }}
                >
                    {index + 1}
                </Box>

                {/* Título + categoria */}
                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {titulo}
                    </Typography>

                    <Chip
                        label={categoria}
                        size="small"
                        sx={{
                            alignSelf: "flex-start",
                            fontSize: 11,
                            bgcolor: alpha(
                                theme.palette.grey[500],
                                0.08
                            ),
                            color: theme.palette.text.secondary,
                        }}
                    />
                </Box>

                {/* Métricas à direita */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        "@media (max-width: 900px)": {
                            width: "100%",
                            justifyContent: "space-between",
                        },
                    }}
                >
                    {/* Visualizações */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.7,
                            color: "text.secondary",
                            minWidth: 90,
                        }}
                    >
                        <Visibility sx={{ fontSize: 18 }} />
                        <Typography variant="body2">
                            {visualizacoes.toLocaleString("pt-BR")}
                        </Typography>
                    </Box>

                    {/* Nota */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.7,
                            minWidth: 80,
                            justifyContent: "flex-end",
                        }}
                    >
                        <Rating
                            value={Number(nota) || 0}
                            precision={0.1}
                            readOnly
                            size="small"
                        />
                        {nota > 0 && (
                            <Typography
                                variant="body2"
                                sx={{ fontWeight: 600 }}
                            >
                                {Number(nota).toFixed(1)}
                            </Typography>
                        )}
                    </Box>

                    {/* Variação */}
                    {typeof variacao === "number" && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.3,
                                fontWeight: 600,
                                color: variacaoPositiva
                                    ? theme.palette.success.main
                                    : theme.palette.error.main,
                                minWidth: 70,
                                justifyContent: "flex-end",
                            }}
                        >
                            {variacaoPositiva ? (
                                <ArrowDropUp />
                            ) : (
                                <ArrowDropDown />
                            )}
                            {Math.abs(variacao)}%
                        </Box>
                    )}
                </Box>
            </Box>
        );
    };

    return (
        <>
            {/* Cabeçalho */}
            <Paper
                elevation={4}
                sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                    borderRadius: 4,
                    p: 3,
                    mb: 4,
                    mt: 4,
                    textAlign: "center",
                    border: `1px solid ${alpha(
                        theme.palette.primary.light,
                        0.25
                    )}`,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                    }}
                >
                    Métricas dos conteúdos
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mt: 1 }}
                >
                    Visão geral do desempenho dos conteúdos na plataforma
                </Typography>
            </Paper>

            {/* Cards principais no modelo novo */}
            <Paper
                elevation={6}
                sx={{
                    borderRadius: 4,
                    p: 4,
                    border: `1px solid ${alpha(
                        theme.palette.primary.light,
                        0.2
                    )}`,
                    backgroundColor: alpha(
                        theme.palette.background.paper,
                        0.9
                    ),
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
                        "Mais assistido",
                        aulas.maisAssistido,
                        theme.palette.info.main
                    )}

                    {renderCard(
                        "Melhor avaliado",
                        aulas.melhorAvaliado,
                        theme.palette.success.main
                    )}

                    {renderCard(
                        "Menos assistido",
                        aulas.menosAssistido,
                        theme.palette.warning.main
                    )}
                </Box>
            </Paper>

            {/* Top 5 Conteúdos do Mês */}
            <Paper
                elevation={4}
                sx={{
                    borderRadius: 4,
                    p: 4,
                    mt: 4,
                    mb: 6,
                    border: `1px solid ${alpha(
                        theme.palette.primary.light,
                        0.18
                    )}`,
                    backgroundColor: alpha(
                        theme.palette.background.paper,
                        0.95
                    ),
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 3,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 700 }}
                    >
                        Top 5 Conteúdos do Mês
                    </Typography>
                </Box>

                <Box>
                    {conteudos.slice(0, 5).map((c, index) =>
                        renderConteudoRow(c, index)
                    )}
                </Box>
            </Paper>

            {/* Modal com detalhes vindos da API */}
            <Dialog
                open={modalOpen}
                onClose={fecharModal}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    {tituloCardSelecionado} – detalhes do conteúdo
                </DialogTitle>
                <DialogContent dividers>
                    {aulaSelecionada ? (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {/* título completo */}
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                {aulaSelecionada.titulo}
                            </Typography>

                            {/* ID, se existir */}
                            {aulaSelecionada.id && (
                                <Typography variant="body2" color="text.secondary">
                                    ID: {aulaSelecionada.id}
                                </Typography>
                            )}

                            {/* visualizações */}
                            <Typography variant="body1">
                                Visualizações este mês:{" "}
                                {aulaSelecionada.visualizacoes != null
                                    ? aulaSelecionada.visualizacoes.toLocaleString("pt-BR")
                                    : 0}
                            </Typography>

                            {/* taxa de conclusão */}
                            {aulaSelecionada.taxaConclusao != null && (
                                <Box>
                                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                                        Taxa de conclusão:{" "}
                                        {aulaSelecionada.taxaConclusao.toFixed(1)}%
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={aulaSelecionada.taxaConclusao}
                                        sx={{
                                            height: 8,
                                            borderRadius: 5,
                                            "& .MuiLinearProgress-bar": {
                                                backgroundColor: theme.palette.primary.main,
                                            },
                                        }}
                                    />
                                </Box>
                            )}

                            {/* nota média */}
                            {aulaSelecionada.notaMedia != null && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <Rating
                                        value={Number(aulaSelecionada.notaMedia) || 0}
                                        precision={0.1}
                                        readOnly
                                    />
                                    <Typography variant="body2">
                                        {Number(aulaSelecionada.notaMedia).toFixed(1)}
                                    </Typography>
                                </Box>
                            )}

                            {/* descrição, se existir */}
                            {aulaSelecionada.descricao && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    {aulaSelecionada.descricao}
                                </Typography>
                            )}
                        </Box>
                    ) : (
                        <Typography>Nenhuma informação disponível.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={fecharModal}>Fechar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DashAulas;

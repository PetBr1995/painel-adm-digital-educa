import {
    Add,
    Delete,
    SearchOutlined,
    FilterList,
    PeopleOutlined,
    PersonOutlined
} from "@mui/icons-material";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Tooltip,
    Typography,
    Container,
    alpha,
    Avatar,
    IconButton,
    Pagination,
    Divider
} from "@mui/material";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import theme from "../../theme/theme";

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [busca, setBusca] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("todos");
    const [pagina, setPagina] = useState(1);
    const porPagina = 10;
    const navigate = useNavigate();
    const location = useLocation();

    const listarUsuarios = () => {
        axios
            .get("https://api.digitaleduca.com.vc/usuario/admin/usuarios", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                setUsuarios(response.data);
            })
            .catch((error) => {
                console.error("❌ Erro ao listar usuários:", error);
                Swal.fire("Erro", "Não foi possível carregar os usuários.", "error");
            });
    };

    const excluirUsuario = (id) => {
        Swal.fire({
            title: "Tem certeza?",
            text: "Você não poderá reverter esta ação!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sim, excluir!",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(
                        `https://api.digitaleduca.com.vc/usuario/admin/usuarios/${id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    )
                    .then(() => {
                        Swal.fire(
                            "Excluído!",
                            "O usuário foi excluído com sucesso.",
                            "success"
                        );
                        listarUsuarios();
                    })
                    .catch((error) => {
                        console.error("❌ Erro ao excluir usuário:", error);
                        Swal.fire("Erro", "Não foi possível excluir o usuário.", "error");
                    });
            }
        });
    };

    const temAssinaturaAtiva = (usuario) => {
        return usuario.assinaturas?.some(
            (assinatura) =>
                assinatura.status === "ATIVA" &&
                assinatura.stripeSubscriptionId &&
                assinatura.stripeSubscriptionId.trim() !== ""
        );
    };

    useEffect(() => {
        listarUsuarios();
    }, []);

    // 🔹 Filtra e remove SUPERADMIN
    const usuariosFiltrados = useMemo(() => {
        return usuarios
            .filter((usuario) => usuario.role !== "SUPERADMIN")
            .filter((usuario) => {
                const matchBusca =
                    usuario.nome.toLowerCase().includes(busca.toLowerCase()) ||
                    usuario.email.toLowerCase().includes(busca.toLowerCase());

                const assinaturaAtiva = temAssinaturaAtiva(usuario);

                let matchStatus = true;
                if (filtroStatus === "ativa") {
                    matchStatus = assinaturaAtiva;
                } else if (filtroStatus === "inativa") {
                    matchStatus = !assinaturaAtiva;
                }

                return matchBusca && matchStatus;
            });
    }, [usuarios, busca, filtroStatus]);

    // 🔢 Paginação
    const inicio = (pagina - 1) * porPagina;
    const fim = inicio + porPagina;
    const exibidos = usuariosFiltrados.slice(inicio, fim);
    const totalPaginas = Math.ceil(usuariosFiltrados.length / porPagina);

    const handleChangePage = (_, novaPagina) => setPagina(novaPagina);

    const usuariosAtivos = usuariosFiltrados.filter((u) =>
        temAssinaturaAtiva(u)
    ).length;
    const usuariosInativos = usuariosFiltrados.length - usuariosAtivos;

    return (
        <Container sx={{ py: 4, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
            {/* Header */}
            <Paper
                elevation={0}
                sx={{
                    background: `linear-gradient(135deg, ${alpha(
                        theme.palette.primary.main,
                        0.08
                    )}, ${alpha(theme.palette.primary.main, 0.03)})`,
                    borderRadius: 3,
                    p: 4,
                    mb: 4,
                    border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 2,
                    }}
                >
                    <Box>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                color: "#ffffff",
                                mb: 1,
                            }}
                        >
                            Gerenciar Usuários
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                            Visualize e gerencie todos os usuários cadastrados
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                            <Chip
                                label={`${usuariosFiltrados.length} usuários`}
                                size="small"
                                sx={{
                                    backgroundColor: theme.palette.primary.light,
                                    color: "#000",
                                    fontWeight: 600,
                                }}
                            />
                            <Chip
                                label={`${usuariosAtivos} ativos`}
                                size="small"
                                color="success"
                                variant="outlined"
                                sx={{ fontWeight: 600 }}
                            />
                            <Chip
                                label={`${usuariosInativos} inativos`}
                                size="small"
                                color="default"
                                variant="outlined"
                                sx={{ fontWeight: 600 }}
                            />
                        </Box>
                    </Box>

                    <Button
                        onClick={() => navigate("/cadastrarusuario")}
                        variant="contained"
                        startIcon={<Add />}
                        size="large"
                        sx={{
                            borderRadius: 3,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                            fontWeight: 700,
                            px: 4,
                            py: 1.5,
                            textTransform: "none",
                            boxShadow: `0 4px 15px ${alpha(
                                theme.palette.primary.main,
                                0.3
                            )}`,
                            transition: "all 0.3s ease",
                            "&:hover": {
                                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                                boxShadow: `0 6px 20px ${alpha(
                                    theme.palette.primary.main,
                                    0.4
                                )}`,
                                transform: "translateY(-2px)",
                            },
                        }}
                    >
                        Novo Usuário
                    </Button>
                </Box>
            </Paper>

            {/* Filtros */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
                    background: `linear-gradient(135deg, ${alpha(
                        theme.palette.primary.main,
                        0.08
                    )}, ${alpha(theme.palette.primary.main, 0.03)})`,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        gap: 3,
                        flexWrap: "wrap",
                        alignItems: "center",
                    }}
                >
                    <TextField
                        placeholder="Buscar por nome ou email..."
                        variant="outlined"
                        value={busca}
                        onChange={(e) => {
                            setBusca(e.target.value);
                            setPagina(1);
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchOutlined sx={{ color: "#666" }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            flex: 1,
                            minWidth: "300px",
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 3,
                                backgroundColor: theme.palette.secondary.dark,
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#FDBB30",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#FDBB30",
                                },
                            },
                        }}
                    />

                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Status da Matrícula</InputLabel>
                        <Select
                            value={filtroStatus}
                            label="Status da Matrícula"
                            onChange={(e) => {
                                setFiltroStatus(e.target.value);
                                setPagina(1);
                            }}
                            sx={{
                                borderRadius: 2,
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#FDBB30",
                                },
                            }}
                        >
                            <MenuItem value="todos">Todos os usuários</MenuItem>
                            <MenuItem value="ativa">Matrícula Ativa</MenuItem>
                            <MenuItem value="inativa">Matrícula Inativa</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Chip
                        icon={<FilterList />}
                        label={`${usuariosFiltrados.length} usuário(s) encontrado(s)`}
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                    />
                </Box>
            </Paper>

            {/* Tabela */}
            {exibidos.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        textAlign: "center",
                        py: 8,
                        borderRadius: 3,
                        border: "2px dashed #e0e0e0",
                    }}
                >
                    <PersonOutlined
                        sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
                    />
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        fontWeight={600}
                        sx={{ mb: 1 }}
                    >
                        Nenhum usuário encontrado
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Tente ajustar os filtros de busca
                    </Typography>
                </Paper>
            ) : (
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
                        overflow: "hidden",
                    }}
                >
                    <TableContainer>
                        <Table>
                            <TableHead
                                sx={{
                                    background: `linear-gradient(135deg, ${alpha(
                                        theme.palette.primary.main,
                                        0.08
                                    )}, ${alpha(theme.palette.primary.main, 0.03)})`,
                                }}
                            >
                                <TableRow
                                    sx={{
                                        "& th": {
                                            fontWeight: 700,
                                            color: "#ffffff",
                                            borderBottom: "2px solid #e0e0e0",
                                        },
                                    }}
                                >
                                    <TableCell>Usuário</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell align="center">
                                        Status da Matrícula
                                    </TableCell>
                                    <TableCell align="center">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {exibidos.map((usuario, index) => {
                                    const assinaturaAtiva = temAssinaturaAtiva(usuario);
                                    return (
                                        <TableRow
                                            key={usuario.id}
                                            sx={{
                                                backgroundColor:
                                                    index % 2 === 0
                                                        ? alpha(theme.palette.primary.dark, 0.2)
                                                        : alpha(theme.palette.secondary.light, 0.08),
                                                "&:hover": {
                                                    backgroundColor:
                                                        index % 2 === 0
                                                            ? alpha(theme.palette.primary.light, 0.08)
                                                            : alpha(theme.palette.secondary.dark, 0.08),
                                                },
                                                transition: "background-color 0.2s ease",
                                            }}
                                        >
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 2,
                                                    }}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            width: 40,
                                                            height: 40,
                                                            backgroundColor: assinaturaAtiva
                                                                ? "#4caf50"
                                                                : "#9e9e9e",
                                                            fontSize: "0.9rem",
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {usuario.nome.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Typography variant="body1" fontWeight={600}>
                                                        {usuario.nome}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    color="#ffffff"
                                                >
                                                    {usuario.email}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={
                                                        assinaturaAtiva
                                                            ? "Matrícula Ativa"
                                                            : "Matrícula Inativa"
                                                    }
                                                    color={
                                                        assinaturaAtiva
                                                            ? "success"
                                                            : "default"
                                                    }
                                                    size="small"
                                                    sx={{ fontWeight: 600 }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip
                                                    title={
                                                        assinaturaAtiva
                                                            ? "Não é possível excluir usuário com matrícula ativa"
                                                            : "Excluir usuário"
                                                    }
                                                    arrow
                                                >
                                                    <span>
                                                        <IconButton
                                                            color="error"
                                                            disabled={assinaturaAtiva}
                                                            onClick={() =>
                                                                !assinaturaAtiva &&
                                                                excluirUsuario(usuario.id)
                                                            }
                                                            sx={{
                                                                opacity: assinaturaAtiva ? 0.4 : 1,
                                                                "&:hover": {
                                                                    backgroundColor: assinaturaAtiva
                                                                        ? "transparent"
                                                                        : alpha("#f44336", 0.1),
                                                                },
                                                            }}
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Paginação */}
                    {totalPaginas > 1 && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Box display="flex" justifyContent="center" pb={2}>
                                <Pagination
                                    count={totalPaginas}
                                    page={pagina}
                                    onChange={handleChangePage}
                                    color="primary"
                                    shape="rounded"
                                />
                            </Box>
                        </>
                    )}
                </Paper>
            )}
        </Container>
    );
};

export default Usuarios;

import { Add, ArrowBack, Delete, SearchOutlined, FilterList } from "@mui/icons-material";
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
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [busca, setBusca] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("todos"); // "todos", "ativa", "inativa"
    const navigate = useNavigate();

    const listarUsuarios = () => {
        axios.get("http://10.10.10.62:3000/usuario/admin/usuarios", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then((response) => {
                console.log("📌 Resposta da API:", response.data);
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
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://10.10.10.62:3000/usuario/admin/usuarios/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
                    .then(() => {
                        Swal.fire("Excluído!", "O usuário foi excluído com sucesso.", "success");
                        listarUsuarios();
                    })
                    .catch((error) => {
                        console.error("❌ Erro ao excluir usuário:", error);
                        Swal.fire("Erro", "Não foi possível excluir o usuário.", "error");
                    });
            }
        });
    };

    // Função para verificar se o usuário tem assinatura ativa
    const temAssinaturaAtiva = (usuario) => {
        return usuario.assinaturas?.some(assinatura => assinatura.status === "ATIVA");
    };

    useEffect(() => {
        listarUsuarios();
    }, []);

    // Filtra usuários pelo nome, email e status da assinatura
    const usuariosFiltrados = usuarios.filter((usuario) => {
        const matchBusca = usuario.nome.toLowerCase().includes(busca.toLowerCase()) ||
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

    return (
        <Box sx={{ maxWidth: "1000px", margin: "auto", mt: 4 }}>
            {/* Header com botão de cadastrar */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Button
                    onClick={() => navigate('/cadastrarusuario')}
                    variant="contained"
                    startIcon={<Add />}
                    sx={{ borderRadius: "20px", fontWeight: "600" }}
                >
                    Cadastrar Usuários
                </Button>
            </Box>

            {/* Área de filtros */}
            <Box sx={{
                display: "flex",
                gap: 2,
                mb: 3,
                flexWrap: "wrap",
                alignItems: "center"
            }}>
                {/* Barra de Pesquisa */}
                <TextField
                    label="Pesquisar usuário"
                    variant="outlined"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchOutlined />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        flex: 1,
                        minWidth: "300px",
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "50px",
                        }
                    }}
                />

                {/* Filtro por Status */}
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Status da Matrícula</InputLabel>
                    <Select
                        value={filtroStatus}
                        label="Status da Matrícula"
                        onChange={(e) => setFiltroStatus(e.target.value)}
                        startAdornment={<FilterList sx={{ mr: 1 }} />}
                    >
                        <MenuItem value="todos">Todos os usuários</MenuItem>
                        <MenuItem value="ativa">Matrícula Ativa</MenuItem>
                        <MenuItem value="inativa">Matrícula Inativa</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Indicador de resultados */}
            <Box sx={{ mb: 2 }}>
                <Chip
                    label={`${usuariosFiltrados.length} usuário(s) encontrado(s)`}
                    variant="outlined"
                />
            </Box>

            {/* Tabela */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Nome</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell align="center"><strong>Status</strong></TableCell>
                            <TableCell align="center"><strong>Ações</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usuariosFiltrados.length > 0 ? (
                            usuariosFiltrados.map((usuario) => {
                                const assinaturaAtiva = temAssinaturaAtiva(usuario);

                                return (
                                    <TableRow key={usuario.id}>
                                        <TableCell>{usuario.nome}</TableCell>
                                        <TableCell>{usuario.email}</TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={assinaturaAtiva ? "Ativa" : "Inativa"}
                                                color={assinaturaAtiva ? "success" : "default"}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip
                                                title={assinaturaAtiva ? "Não é possível excluir usuário com matrícula ativa" : "Excluir usuário"}
                                            >
                                                <span>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        size="small"
                                                        disabled={assinaturaAtiva}
                                                        onClick={() => {
                                                            if (!assinaturaAtiva) {
                                                                excluirUsuario(usuario.id);
                                                            }
                                                        }}
                                                        sx={{
                                                            opacity: assinaturaAtiva ? 0.5 : 1,
                                                            cursor: assinaturaAtiva ? "not-allowed" : "pointer"
                                                        }}
                                                    >
                                                        <Delete />
                                                    </Button>
                                                </span>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    Nenhum usuário encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Usuarios;
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    IconButton,
    InputAdornment,
    Container,
    Grid,
    alpha,
    Divider
} from "@mui/material";
import theme from "../../theme/theme";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
    Visibility,
    VisibilityOff,
    PersonAddOutlined,
    EmailOutlined,
    PhoneOutlined,
    LockOutlined,
    ArrowBack,
    PersonOutlined
} from "@mui/icons-material";

const CadastrarUsuario = () => {
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [celular, setCelular] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");

    // Função para aplicar máscara de celular
    const formatarCelular = (valor) => {
        return valor
            .replace(/\D/g, "") // Remove tudo que não for número
            .replace(/^(\d{2})(\d)/g, "($1) $2") // Coloca o DDD entre parênteses
            .replace(/(\d{5})(\d{4})$/, "$1-$2"); // Adiciona o hífen no final
    };

    const handleCelularChange = (e) => {
        setCelular(formatarCelular(e.target.value));
    };

    const cadastrarUsuario = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            Swal.fire("Erro", "Token de autenticação não encontrado.", "error");
            return;
        }

        // Converte dataInicio e dataFim para ISO string
        const dataInicioISO = dataInicio ? new Date(dataInicio).toISOString() : null;
        const dataFimISO = dataFim ? new Date(dataFim).toISOString() : null;

        // Objeto que será enviado
        const payload = {
            nome,
            email,
            senha,
            celular,
            role: "USER",
            dataInicio: dataInicioISO,
            dataFim: dataFimISO
        };

        // 🔹 Console de debug
        console.log("📤 Dados que serão enviados para o backend:", payload);

        axios
            .post(
                "http://10.10.11.174:3000/usuario/admin/create",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("✅ Resposta do backend:", response.data);

                Swal.fire({
                    title: "Sucesso!",
                    text: "Usuário cadastrado com sucesso!",
                    icon: "success",
                    confirmButtonText: "OK",
                    background: "#121829",
                    color: "#FFFFFF",
                    confirmButtonColor: "#FFB800"
                });

                setNome("");
                setEmail("");
                setSenha("");
                setCelular("");
                setDataInicio("");
                setDataFim("");
            })
            .catch((error) => {
                if (error.response) {
                    console.error("❌ Erro da API:", error.response);
                    Swal.fire(
                        "Erro",
                        error.response.data.message || "Verifique os dados e tente novamente.",
                        "error"
                    );
                } else if (error.request) {
                    console.error("❌ Erro na requisição:", error.request);
                    Swal.fire("Erro", "Erro de conexão com o servidor.", "error");
                } else {
                    console.error("❌ Erro desconhecido:", error.message);
                    Swal.fire("Erro", "Erro inesperado ao cadastrar usuário.", "error");
                }
            });
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Header */}
            <Paper
                elevation={0}
                sx={{
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.08)},${alpha(theme.palette.primary.light, 0.02)})`,
                    borderRadius: 3,
                    p: 4,
                    mb: 4,
                    border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`
                }}
            >
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <PersonAddOutlined
                            sx={{
                                fontSize: 40,
                                color: '#FDBB30',
                                p: 1,
                                borderRadius: 2,
                                backgroundColor: alpha('#FDBB30', 0.1)
                            }}
                        />
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#ffffff', mb: 0.5 }}>
                                Cadastrar Usuário
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                                Preencha as informações para criar um novo usuário
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate("/usuarios")}
                        sx={{
                            borderRadius: 2,
                            borderColor: '#FDBB30',
                            color: '#FDBB30',
                            fontWeight: 600,
                            px: 3,
                            py: 1,
                            textTransform: 'none',
                            "&:hover": {
                                borderColor: '#f4a000',
                                backgroundColor: alpha('#FDBB30', 0.04)
                            }
                        }}
                    >
                        Voltar para Usuários
                    </Button>
                </Box>
            </Paper>

            {/* Formulário */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 4,
                    border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
                    overflow: 'hidden'
                }}
            >
                {/* Header do formulário */}
                <Box sx={{
                    background: alpha(theme.palette.primary.light, 0.08),
                    color: '#ffffff',
                    p: 3,
                    textAlign: 'center'
                }}>
                    <PersonOutlined sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="h6" fontWeight={700}>
                        Dados do Novo Usuário
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                        Todos os campos são obrigatórios
                    </Typography>
                </Box>

                {/* Campos do formulário */}
                <Box sx={{ p: 4 }}>
                    <Grid container spacing={3}>
                        {/* Nome */}
                        <TextField
                            label="Nome completo"
                            fullWidth
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonOutlined sx={{ color: '#FDBB30' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 3,
                                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: '#FDBB30' },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: '#FDBB30' }
                                }
                            }}
                        />

                        {/* Email */}
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlined sx={{ color: '#FDBB30' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 3,
                                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: '#FDBB30' },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: '#FDBB30' }
                                }
                            }}
                        />

                        {/* Celular */}
                        <TextField
                            label="Celular"
                            type="tel"
                            fullWidth
                            value={celular}
                            onChange={handleCelularChange}
                            inputProps={{ maxLength: 15 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PhoneOutlined sx={{ color: '#FDBB30' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 3,
                                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: '#FDBB30' },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: '#FDBB30' }
                                }
                            }}
                        />

                        {/* Data Inicio e Fim */}
                        <Box sx={{display:"flex", gap:"1rem", width:"100%"}}>

                            <TextField
                                label="Data Início"
                                type="datetime-local"
                                fullWidth
                                value={dataInicio}
                                onChange={(e) => setDataInicio(e.target.value)}
                                sx={{

                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 3,
                                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: '#FDBB30' },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: '#FDBB30' }
                                    }
                                }} 

                            />
                            <TextField
                                label="Data Fim"
                                type="datetime-local"
                                fullWidth
                                value={dataFim}
                                onChange={(e) => setDataFim(e.target.value)}
                                sx={{

                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 3,
                                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: '#FDBB30' },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: '#FDBB30' }
                                    }
                                }}
                            />
                        </Box>

                        {/* Senha */}
                        <TextField
                            label="Senha"
                            type={mostrarSenha ? "text" : "password"}
                            fullWidth
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlined sx={{ color: '#FDBB30' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setMostrarSenha(!mostrarSenha)}
                                            edge="end"
                                            sx={{
                                                color: '#FDBB30',
                                                "&:hover": { backgroundColor: alpha('#FDBB30', 0.1) }
                                            }}
                                        >
                                            {mostrarSenha ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 3,
                                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: '#FDBB30' },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: '#FDBB30' }
                                }
                            }}
                        />
                    </Grid>

                    <Divider sx={{ my: 4, borderColor: alpha('#FDBB30', 0.2) }} />

                    {/* Botões */}
                    <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/usuarios")}
                            sx={{
                                borderRadius: 3,
                                borderColor: '#ccc',
                                color: '#ffffff',
                                fontWeight: 600,
                                px: 4,
                                py: 1.2,
                                textTransform: 'none',
                                minWidth: 140,
                                "&:hover": { borderColor: '#999', backgroundColor: alpha('#000', 0.04) }
                            }}
                        >
                            Cancelar
                        </Button>

                        <Button
                            variant="contained"
                            onClick={cadastrarUsuario}
                            startIcon={<PersonAddOutlined />}
                            sx={{
                                borderRadius: 3,
                                background: 'linear-gradient(45deg, #FDBB30 30%, #f4a000 90%)',
                                color: '#000',
                                fontWeight: 700,
                                px: 4,
                                py: 1.2,
                                textTransform: 'none',
                                minWidth: 160,
                                boxShadow: '0 4px 15px rgba(253,187,48,0.3)',
                                "&:hover": {
                                    background: 'linear-gradient(45deg, #f4a000 30%, #e89000 90%)',
                                    boxShadow: '0 6px 20px rgba(253,187,48,0.4)',
                                    transform: 'translateY(-1px)'
                                }
                            }}
                        >
                            Cadastrar Usuário
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default CadastrarUsuario;

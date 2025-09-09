import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    IconButton,
    InputAdornment
} from "@mui/material";
import theme from "../../theme/theme";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const CadastrarUsuario = () => {
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [celular, setCelular] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);

    // Função para aplicar máscara simples de celular
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

        axios
            .post(
                "http://10.10.10.62:3000/usuario/admin/create",
                {
                    nome,
                    email,
                    senha,
                    celular,
                    role: "USER"
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("✅ Usuário cadastrado com sucesso:", response.data);

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
            })
            .catch((error) => {
                if (error.response) {
                    console.error("❌ Erro da API:", error.response.data);
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
        <Box sx={{ maxWidth: "600px", margin: "auto", mt: 6 }}>
            <Box
                sx={{
                    fontWeight: "600",
                    mb: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}
            >
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: "600", mb: 1 }}>
                        Cadastrar Usuário
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ fontWeight: "300", color: "gray", mb: 3 }}
                    >
                        Preencha as informações do usuário abaixo
                    </Typography>
                </Box>
                <Box>
                    <Button
                        variant="text"
                        onClick={() => navigate("/usuarios")}
                        sx={{
                            boxShadow: "0 0 2px rgba(255,255,255,0.4)",
                            borderRadius: "20px"
                        }}
                    >
                        Todos os usuários
                    </Button>
                </Box>
            </Box>

            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper
                }}
            >
                <Box component="form" noValidate autoComplete="off">
                    <TextField
                        label="Nome"
                        fullWidth
                        margin="normal"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Senha"
                        type={mostrarSenha ? "text" : "password"}
                        fullWidth
                        margin="normal"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setMostrarSenha(!mostrarSenha)}
                                        edge="end"
                                    >
                                        {mostrarSenha ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        label="Celular"
                        type="tel"
                        fullWidth
                        margin="normal"
                        value={celular}
                        onChange={handleCelularChange}
                        inputProps={{ maxLength: 15 }} // Ex: (99) 99999-9999
                    />

                    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                        <Button
                            variant="text"
                            color="primary"
                            onClick={cadastrarUsuario}
                            sx={{
                                boxShadow: "0 0 2px rgba(255,255,255,0.4)",
                                borderRadius: "20px",
                                fontWeight: "600"
                            }}
                        >
                            Cadastrar
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default CadastrarUsuario;

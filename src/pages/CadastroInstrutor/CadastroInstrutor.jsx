import {
  ArrowBack,
  Person,
  School,
  Info
} from "@mui/icons-material";
import {
  Typography,
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  useTheme,
  TextField
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CadastroInstrutor = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [nome, setNome] = useState("");
  const [formacao, setFormacao] = useState("");
  const [sobre, setSobre] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const postInstrutor = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado para cadastrar um instrutor.");
      navigate("/login");
      return;
    }

    setIsLoading(true);

    axios
      .post(
        "https://api.digitaleduca.com.vc/instrutor/create",
        { nome, formacao, sobre },
        { headers: { Authorization: `bearer ${token}` } }
      )
      .then(() => {
        alert("Instrutor cadastrado com sucesso!");
        setNome("");
        setFormacao("");
        setSobre("");
        navigate("/instrutores");
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          alert("Sessão expirada. Faça login novamente.");
          navigate("/login");
        } else {
          alert("Erro ao cadastrar instrutor: " + (error.response?.data?.message || error.message));
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <Box sx={{ mb: 5, display: "flex", justifyContent: "flexStart", alignItems: "center", gap: '1rem' }}>
        <Button onClick={() => navigate('/instrutores')}>
          <ArrowBack />
        </Button>
        <Box>
          <Typography variant="h5" fontWeight={"700"}>Novo Instrutor</Typography>
          <Typography variant="body1">Cadastre a informações do instrutor</Typography>
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: 500,
          mx: "auto",
          p: 4,
          borderRadius: "16px",
          backgroundColor: theme.palette.background.paper,
          boxShadow: "0 0 2px rgba(255,255,255,0.2)",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 500, textAlign: "start", mb: 3 }}>
          Informações do Instrutor
        </Typography>

        <form onSubmit={(e) => { e.preventDefault(); postInstrutor(); }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

            {/* Nome */}

            <TextField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />

            {/* Formação */}
            <TextField
            label="Formação"
            value={formacao}
            onChange={(e) => setFormacao(e.target.value)}
            required
            />

            {/* Sobre */}
            <TextField
            label="Sobre"
            value={sobre}
            onChange={(e) => setSobre(e.target.value)}
            required
            multiline
            rows={4}
            />

            {/* Botão */}
            <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>

              <Button
                variant="contained"
                type="submit"
                disabled={isLoading}
                sx={{
                  mt: 0,
                  backgroundColor: "#FDBB30",
                  color: "#000",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#f4a000",
                  },
                }}
              >
                {isLoading ? "Cadastrando..." : "Cadastrar"}
              </Button>
              <Button
                variant="outlined"
                disabled={isLoading}
                onClick={() => navigate('/instrutores')}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </>
  );
};

export default CadastroInstrutor;

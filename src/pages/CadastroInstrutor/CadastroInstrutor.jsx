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
  TextField,
  useTheme,
  alpha,
  CircularProgress
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

    // Garantia extra de limite antes de enviar
    const payload = {
      nome: nome.slice(0, 100),
      formacao: formacao.slice(0, 100),
      sobre: sobre.slice(0, 500),
    };

    axios
      .post(
        "https://api.digitaleduca.com.vc/instrutor/create",
        payload,
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
      {/* Cabeçalho */}
      <Box sx={{ mb: 5, display: "flex", alignItems: "center", gap: '1rem' }}>
        <Button
          onClick={() => navigate('/instrutores')}
          sx={{
            borderRadius: "50%",
            minWidth: "40px",
            width: "40px",
            height: "40px",
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.2) }
          }}
        >
          <ArrowBack />
        </Button>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: theme.palette.text.primary }}>
            Novo Instrutor
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Cadastre as informações do instrutor
          </Typography>
        </Box>
      </Box>

      {/* Card de formulário */}
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          p: 4,
          borderRadius: "20px",
          background: alpha(theme.palette.primary.main, 0.05),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
        }}
      >
        <Typography
          variant="h5"
          fontWeight={600}
          sx={{ mb: 3, color: theme.palette.primary.main }}
        >
          Informações do Instrutor
        </Typography>

        <form onSubmit={(e) => { e.preventDefault(); postInstrutor(); }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

            {/* Nome */}
            <TextField
              label="Nome"
              value={nome}
              onChange={(e) => {
                const value = e.target.value.slice(0, 100);
                setNome(value);
              }}
              required
              inputProps={{ maxLength: 100 }}
              helperText={`${nome.length}/100 caracteres`}
              InputProps={{
                startAdornment: (
                  <Person sx={{ mr: 1, color: theme.palette.primary.main }} />
                )
              }}
            />

            {/* Formação */}
            <TextField
              label="Formação"
              value={formacao}
              onChange={(e) => {
                const value = e.target.value.slice(0, 100);
                setFormacao(value);
              }}
              required
              inputProps={{ maxLength: 100 }}
              helperText={`${formacao.length}/100 caracteres`}
              InputProps={{
                startAdornment: (
                  <School sx={{ mr: 1, color: theme.palette.primary.main }} />
                )
              }}
            />

            {/* Sobre */}
            <TextField
              label="Sobre"
              value={sobre}
              onChange={(e) => {
                const value = e.target.value.slice(0, 500);
                setSobre(value);
              }}
              required
              multiline
              rows={4}
              inputProps={{ maxLength: 500 }}
              helperText={`${sobre.length}/500 caracteres`}
              InputProps={{
                startAdornment: (
                  <Info sx={{ mr: 1, color: theme.palette.primary.main }} />
                )
              }}
            />

            {/* Ações */}
            <Box sx={{ display: "flex", alignItems: "center", gap: "1rem", mt: 2 }}>
              <Button
                variant="contained"
                type="submit"
                disabled={isLoading}
                sx={{
                  borderRadius: "12px",
                  px: 4,
                  py: 1.2,
                  fontWeight: 600,
                  textTransform: "none",
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  boxShadow: "none",
                  "&:hover": {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.15)"
                  }
                }}
              >
                {isLoading ? <CircularProgress size={22} color="inherit" /> : "Cadastrar"}
              </Button>

              <Button
                variant="outlined"
                disabled={isLoading}
                onClick={() => navigate('/instrutores')}
                sx={{
                  borderRadius: "12px",
                  px: 4,
                  py: 1.2,
                  fontWeight: 600,
                  textTransform: "none",
                  borderColor: alpha(theme.palette.primary.main, 0.4),
                  color: theme.palette.primary.main,
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05)
                  }
                }}
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

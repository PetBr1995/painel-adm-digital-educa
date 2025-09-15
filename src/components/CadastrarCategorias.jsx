import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Stack,
  Alert,
  Fade,
  alpha,
  CircularProgress
} from "@mui/material";
import {
  Category as CategoryIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Add as AddIcon
} from "@mui/icons-material";
import axios from "axios";
import { useState } from "react";
import theme from "../theme/theme";

const CadastrarCategorias = ({ setForm, onCategoriaCadastrada }) => {
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "info" });

  const showAlert = (message, type = "info") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "info" }), 4000);
  };

  const cadastrarCategoria = async () => {
    if (!nome.trim()) {
      showAlert("O nome da categoria é obrigatório", "error");
      return;
    }

    if (nome.trim().length < 2) {
      showAlert("O nome da categoria deve ter pelo menos 2 caracteres", "error");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        showAlert("Token de autenticação não encontrado", "error");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://10.10.10.61:3000/categorias/create",
        { nome: nome.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showAlert("Categoria cadastrada com sucesso!", "success");
      setNome("");

      // Notifica o componente pai com a nova categoria para atualizar a lista
      if (onCategoriaCadastrada) {
        onCategoriaCadastrada(response.data);
      }

      // Fecha o formulário após 1.5 segundos para permitir ver a mensagem de sucesso
      setTimeout(() => {
        setForm(false);
      }, 1500);

    } catch (error) {
      console.error("Erro ao cadastrar categoria:", error);
      const errorMessage = error.response?.data?.message || "Erro ao cadastrar categoria";
      showAlert(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading && nome.trim()) {
      cadastrarCategoria();
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 420,
        p: 4,
        borderRadius: 3,
        margin: "auto",
        border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.08)}, ${alpha(theme.palette.primary.light, 0.02)})`,
        "&::before": {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
        }
      }}
    >
      {/* Header com ícone */}
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} mb={3}>
        <CategoryIcon sx={{ fontSize: 28, color: "primary.main" }} />
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            textAlign: "center"
          }}
        >
          Nova Categoria
        </Typography>
      </Stack>

      {/* Alert */}
      {alert.show && (
        <Fade in>
          <Alert
            severity={alert.type}
            sx={{
              mb: 3,
              borderRadius: 2,
              "& .MuiAlert-icon": {
                fontSize: 20
              }
            }}
          >
            {alert.message}
          </Alert>
        </Fade>
      )}

      {/* Campo de entrada */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            mb: 1.5,
            color: "text.primary",
            display: "flex",
            alignItems: "center",
            gap: 1
          }}
        >
          <AddIcon sx={{ fontSize: 16, color: "primary.main" }} />
          Nome da Categoria
        </Typography>
        <TextField
          placeholder="Digite o nome da categoria..."
          fullWidth
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          autoFocus
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              fontSize: "1rem",
              "&:hover": {
                "& > fieldset": {
                  borderColor: "primary.main",
                }
              },
              "&.Mui-focused": {
                "& > fieldset": {
                  borderWidth: "2px",
                }
              }
            },
            "& .MuiInputBase-input": {
              py: 1.5
            }
          }}
        />
        {nome.trim() && nome.trim().length < 2 && (
          <Typography variant="caption" color="error.main" sx={{ mt: 0.5, display: "block" }}>
            Mínimo de 2 caracteres
          </Typography>
        )}
      </Box>

      {/* Botões de ação */}
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button
          onClick={() => setForm(false)}
          variant="outlined"
          disabled={loading}
          startIcon={<CloseIcon />}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: 600,
            textTransform: "none",
            borderColor: alpha('#666', 0.3),
            color: 'text.secondary',
            "&:hover": {
              borderColor: 'error.main',
              color: 'error.main',
              bgcolor: alpha('#f44336', 0.04),
            }
          }}
        >
          Cancelar
        </Button>

        <Button
          onClick={cadastrarCategoria}
          variant="contained"
          disabled={loading || !nome.trim() || nome.trim().length < 2}
          startIcon={loading ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <SaveIcon />
          )}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1,
            fontWeight: 700,
            textTransform: "none",
            fontSize: "0.95rem",
            boxShadow: `0 4px 12px ${alpha('#1976d2', 0.25)}`,
            "&:hover": {
              boxShadow: `0 6px 16px ${alpha('#1976d2', 0.35)}`,
              transform: "translateY(-1px)",
            },
            "&:disabled": {
              bgcolor: alpha('#ccc', 0.12),
              color: alpha('#666', 0.5),
              boxShadow: 'none',
            },
            transition: "all 0.2s ease",
          }}
        >
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </Stack>

      {/* Indicador de caracteres */}
      {nome.length > 0 && (
        <Box sx={{ mt: 2, textAlign: "right" }}>
          <Typography
            variant="caption"
            color={nome.length >= 50 ? "warning.main" : "text.secondary"}
            sx={{ fontWeight: 500 }}
          >
            {nome.length}/50 caracteres
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default CadastrarCategorias;
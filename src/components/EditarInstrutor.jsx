import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  useTheme,
  alpha,
} from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { ArrowBack, Person, School, Info } from "@mui/icons-material";

const EditarInstrutor = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { id: paramId } = useParams();
  const location = useLocation();
  const instrutorFromState = location.state?.instrutor;

  const id = instrutorFromState?._id || paramId;
  const [instrutor, setInstrutor] = useState({ nome: "", formacao: "", sobre: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (instrutorFromState) {
      setInstrutor({
        nome: instrutorFromState.nome || "",
        formacao: instrutorFromState.formacao || "",
        sobre: instrutorFromState.sobre || "",
      });
      setLoading(false);
    } else if (id) {
      axios
        .get(`https://api.digitaleduca.com.vc/instrutor/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          setInstrutor({
            nome: res.data.nome || "",
            formacao: res.data.formacao || "",
            sobre: res.data.sobre || "",
          });
        })
        .catch(() => {
          Swal.fire("Erro", "Não foi possível carregar os dados do instrutor.", "error");
          navigate("/instrutores");
        })
        .finally(() => setLoading(false));
    } else {
      Swal.fire("Erro", "ID do instrutor não informado.", "error");
      navigate("/instrutores");
    }
  }, [id, instrutorFromState, navigate]);

  const handleChange = (e) => {
    setInstrutor({ ...instrutor, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const { nome, formacao, sobre } = instrutor;
    if (!nome || !formacao || !sobre) {
      Swal.fire("Atenção", "Preencha todos os campos antes de salvar.", "warning");
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `https://api.digitaleduca.com.vc/instrutor/update/${id}`,
        { nome, formacao, sobre },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire("Sucesso", "Instrutor atualizado com sucesso!", "success").then(() =>
        navigate("/instrutores")
      );
    } catch (error) {
      const msg = error.response?.data?.message || "Erro ao atualizar instrutor.";
      Swal.fire("Erro", msg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* Cabeçalho */}
      <Box sx={{ mb: 5, display: "flex", alignItems: "center", gap: "1rem" }}>
        <Button
          onClick={() => navigate("/instrutores")}
          sx={{
            borderRadius: "50%",
            minWidth: "40px",
            width: "40px",
            height: "40px",
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.2) },
          }}
        >
          <ArrowBack />
        </Button>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: theme.palette.text.primary }}>
            Editar Instrutor
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Atualize as informações do instrutor
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
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={600}
          sx={{ mb: 3, color: theme.palette.primary.main }}
        >
          Informações do Instrutor
        </Typography>

        {/* Form */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            fullWidth
            label="Nome"
            name="nome"
            value={instrutor.nome}
            onChange={handleChange}
            InputProps={{
              startAdornment: <Person sx={{ mr: 1, color: theme.palette.primary.main }} />,
            }}
          />

          <TextField
            fullWidth
            label="Formação"
            name="formacao"
            value={instrutor.formacao}
            onChange={handleChange}
            InputProps={{
              startAdornment: <School sx={{ mr: 1, color: theme.palette.primary.main }} />,
            }}
          />

          <TextField
            fullWidth
            label="Sobre"
            name="sobre"
            value={instrutor.sobre}
            onChange={handleChange}
            multiline
            minRows={4}
            InputProps={{
              startAdornment: <Info sx={{ mr: 1, color: theme.palette.primary.main }} />,
            }}
          />

          {/* Botões */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "1rem", mt: 2 }}>
            <Button
              variant="contained"
              disabled={loading}
              onClick={handleUpdate}
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
                  boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                },
              }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Salvar"}
            </Button>

            <Button
              variant="outlined"
              disabled={loading}
              onClick={() => navigate("/instrutores")}
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
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                },
              }}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default EditarInstrutor;

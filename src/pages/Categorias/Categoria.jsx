import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Divider,
  Modal,
  Stack
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useEffect, useState } from "react";
import theme from "../../theme/theme";
import CadastrarCategorias from "../../components/CadastrarCategorias";

const Cursos = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); 

  const getCategorias = async () => {
    try {
      const response = await axios.get("https://testeapi.digitaleduca.com.vc/categoria/list", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCategorias(response.data);
      console.log(response.data)
    } catch (error) {
      setError("Erro ao carregar as categorias. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoriaCadastrada = (novaCategoria) => {
    setCategorias((prev) => [...prev, novaCategoria]);
    setShowForm(false);
  };

  useEffect(() => {
    getCategorias();
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }}}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        mb={4}
        gap={2}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Categorias
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie todas as categorias cadastradas
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: "20px",
            px: 3,
            py: 1,
            fontWeight: "bold",
            textTransform: "none",
            bgcolor: "primary.main",
            "&:hover": { bgcolor: "primary.dark", color: theme.palette.primary.light, boxShadow: "inset 0 0 5px rgba(0,0,0,0.5)" },
            boxShadow: "inset 0 0 5px rgba(0,0,0,0.5)",
            transition: ".4s",
          }}
          onClick={() => setShowForm(true)}
        >
          Cadastrar Categoria
        </Button>
      </Stack>

      {/* Categories List */}
      <Divider sx={{ mb: 4 }} />
      <Typography variant="h6" gutterBottom>
        Categorias Cadastradas
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : categorias.length === 0 ? (
        <Typography align="center" color="text.secondary">
          Nenhuma categoria encontrada.
        </Typography>
      ) : (
        <Grid container spacing={2} mb={4}>
          {categorias.map((cat) => (
            <Grid item key={cat.id}>
              <Button
                variant="outlined"
                sx={{
                  fontWeight: "600",
                  borderRadius: "20px",
                  border: "none",
                  boxShadow: "0 0 2px rgba(255,255,255,0.4)",
                }}
              >
                {cat.nome}
              </Button>
            </Grid>
          ))}
        </Grid>
      )}
      <Divider sx={{ mb: 4 }} />

      <Modal open={showForm} onClose={() => setShowForm(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "transparent",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: 400,
          }}
        >
          <CadastrarCategorias
            setForm={setShowForm}
            onCategoriaCadastrada={handleCategoriaCadastrada}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default Cursos;
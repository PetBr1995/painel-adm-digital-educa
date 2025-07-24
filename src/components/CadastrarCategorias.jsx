import { Box, Typography, Button, TextField, Paper } from "@mui/material";
import axios from "axios";
import { useState } from "react";

const CadastrarCategorias = ({ setForm, onCategoriaCadastrada }) => {
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);

  const cadastrarCategoria = async () => {
    if (!nome.trim()) {
      console.log("O nome da categoria é obrigatório.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token de autenticação não encontrado.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "https://api.digitaleduca.com.vc/categoria/create",
        { nome: nome.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Categoria cadastrada com sucesso:", response.data);
      setNome("");
      // Notifica o componente pai com a nova categoria para atualizar a lista
      if (onCategoriaCadastrada) {
        onCategoriaCadastrada(response.data);
      }
      setForm(false);
    } catch (error) {
      console.error("Erro ao cadastrar categoria:", error);
      alert("Erro ao cadastrar categoria");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{ width: "100%", maxWidth: 350, p: 2, borderRadius: "12px", margin: "auto" }}
    >
      <Typography variant="h5" sx={{ fontWeight: "600", mb: 2 }}>
        Informações Categoria
      </Typography>
      <TextField
        label="Nome..."
        fullWidth
        margin="normal"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        disabled={loading}
      />
      <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: "1rem" }}>
        <Button onClick={() => setForm(false)} variant="outlined" disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={cadastrarCategoria} variant="contained" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </Box>
    </Paper>
  );
};

export default CadastrarCategorias;

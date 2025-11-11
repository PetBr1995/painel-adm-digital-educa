import { Box, Button, Grid, TextField, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import { useState } from "react";

const CadastrarTag = ({ 
  setForm,           // ← Padrão novo (Categorias)
  onTagCadastrada,   // ← Callback novo
  showFormTag,       // ← Padrão antigo (Conteudos)
  setShowFormTag     // ← Padrão antigo
}) => {
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ESCOLHE QUAL FECHAR
  const fechar = () => {
    if (setForm) setForm(false);
    if (setShowFormTag) setShowFormTag(false);
  };

  // ESCOLHE QUAL CALLBACK
  const sucesso = (novaTag) => {
    if (onTagCadastrada) onTagCadastrada(novaTag);
    if (setShowFormTag) setShowFormTag(false); // fecha se for o antigo
  };

  const postTag = async () => {
    if (!nome.trim()) {
      setError("O nome da tag é obrigatório.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        'https://api.digitaleduca.com.vc/tags',
        { nome: nome.trim() },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      sucesso(response.data);
      setNome("");
      fechar();

    } catch (error) {
      const msg = error.response?.data?.message || "Erro ao cadastrar tag.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    setNome("");
    setError("");
    fechar();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Cadastrar Nova Tag
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Nome da Tag"
            variant="outlined"
            fullWidth
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={loading}
            error={!!error}
            helperText={error}
            onKeyDown={(e) => e.key === "Enter" && !loading && postTag()}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={handleCancelar} disabled={loading}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={postTag}
              disabled={loading || !nome.trim()}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CadastrarTag;
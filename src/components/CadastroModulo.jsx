import { Button, Container, TextField, Typography, Box } from "@mui/material";
import theme from "../theme/theme";
import { useState } from "react";
import axios from "axios";

const CadastroModulo = ({ setForm, onModuleCreated, cursoId }) => {
  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [descricao, setDescricao] = useState('');

  const createModule = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'https://api.digitaleduca.com.vc/modulo-curso/create',
        {
          titulo,
          subtitulo,
          descricao,
          cursoId: Number(cursoId), // Garantir que é um número
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        }
      );

      console.log('Módulo criado com sucesso:', response.data);
      if (onModuleCreated) onModuleCreated(); // Atualiza a lista de módulos
      setForm(false); // Fecha o formulário
    } catch (error) {
      console.error('Erro ao criar módulo:', error);
    }
  };

  return (
    <Container sx={{
      backgroundColor: theme.palette.secondary.dark,
      py: 4,
      px: 2,
      borderRadius: "12px",
      mt: 2
    }}>
      <Typography variant="h5" sx={{ fontWeight: "700", mb: 2 }}>Novo Módulo</Typography>
      <form onSubmit={createModule}>
        <TextField
          label="Título do Módulo"
          fullWidth
          margin="normal"
          required
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <TextField
          label="Subtítulo"
          fullWidth
          margin="normal"
          required
          value={subtitulo}
          onChange={(e) => setSubtitulo(e.target.value)}
        />
        <TextField
          label="Descrição"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          required
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-start", gap: "1rem", mt: 2 }}>
          <Button variant="outlined" onClick={() => setForm(false)} sx={{ fontWeight: "700" }}>
            Cancelar
          </Button>
          <Button variant="contained" type="submit" sx={{ fontWeight: "700" }}>
            Criar Módulo
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default CadastroModulo;

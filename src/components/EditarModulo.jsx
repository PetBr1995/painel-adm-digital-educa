import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

const EditarModulo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const modulo = location.state?.modulo;

  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (!modulo) {
      Swal.fire("Erro", "Nenhum módulo informado", "error");
      navigate("/modulos");
      return;
    }

    setTitulo(modulo.titulo || "");
    setSubtitulo(modulo.subtitulo || "");
    setDescricao(modulo.descricao || "");
  }, [modulo, navigate]);

  const handleAtualizar = async () => {
    try {
      await axios.put(`http://10.10.11.180:3000/modulo-curso/${modulo.id}`, {
        titulo,
        subtitulo,
        descricao,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      Swal.fire("Sucesso", "Módulo atualizado com sucesso", "success")
        .then(() => navigate(-1));
    } catch (error) {
      Swal.fire("Erro", "Não foi possível atualizar o módulo", "error");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={3}>Editar Módulo</Typography>

        <TextField
          fullWidth
          label="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Subtítulo"
          value={subtitulo}
          onChange={(e) => setSubtitulo(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Descrição"
          value={descricao}
          multiline
          rows={4}
          onChange={(e) => setDescricao(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button variant="contained" color="primary" onClick={handleAtualizar}>
          Salvar Alterações
        </Button>
      </Paper>
    </Box>
  );
};

export default EditarModulo;

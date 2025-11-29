import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
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

  // Garante que temos um ID válido (id, _id, moduloId, etc.)
  const moduloId = useMemo(
    () => modulo?.id ?? modulo?._id ?? modulo?.moduloId ?? modulo?.modulo_id ?? null,
    [modulo]
  );

  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!modulo || !moduloId) {
      Swal.fire(
        "Erro",
        "Nenhum módulo válido informado para edição.",
        "error"
      ).then(() => {
        // volta para a página anterior ou para /cursos
        navigate(-1);
      });
      return;
    }

    setTitulo(modulo.titulo || "");
    setSubtitulo(modulo.subtitulo || "");
    setDescricao(modulo.descricao || "");
  }, [modulo, moduloId, navigate]);

  const handleAtualizar = async () => {
    if (!moduloId) {
      Swal.fire("Erro", "ID do módulo não encontrado.", "error");
      return;
    }

    if (!titulo.trim()) {
      Swal.fire("Atenção", "O título é obrigatório", "warning");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const payload = {
        titulo: titulo.trim(),
        subtitulo: subtitulo?.trim() || null,
        descricao: descricao?.trim() || null,
      };

      console.log("Atualizando módulo:", moduloId, payload);

      const { data } = await axios.put(
        `https://api.digitaleduca.com.vc/modulo-conteudo/${moduloId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Resposta atualização módulo:", data);

      Swal.fire("Sucesso", "Módulo atualizado com sucesso", "success").then(
        () => navigate(-1)
      );
    } catch (error) {
      console.error("Erro ao atualizar módulo:", error.response?.data || error);

      const backend = error.response?.data;
      const message =
        (Array.isArray(backend?.message)
          ? backend.message.join("\n")
          : backend?.message) ||
        backend?.error ||
        "Não foi possível atualizar o módulo.";

      Swal.fire("Erro", message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={3}>
          Editar Módulo
        </Typography>

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

        <Button
          variant="contained"
          color="primary"
          onClick={handleAtualizar}
          disabled={saving}
        >
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </Paper>
    </Box>
  );
};

export default EditarModulo;

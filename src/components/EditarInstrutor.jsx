import { useEffect, useState } from "react";
import {
  Box, Typography, TextField, Button, Paper, CircularProgress
} from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const EditarInstrutor = () => {
  const navigate = useNavigate();
  const { id: paramId } = useParams(); // pega o ID da URL
  const location = useLocation();

  // Se foi enviado via navigate state (opcional)
  const instrutorFromState = location.state?.instrutor;
  console.log("Esse é o console" +instrutorFromState.id );

  // Usa o ID do estado ou o da URL
  const id = instrutorFromState?._id || paramId;

  const [instrutor, setInstrutor] = useState({
    nome: "",
    formacao: "",
    sobre: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (instrutorFromState) {
      // Preenche com dados do navigate
      setInstrutor({
        nome: instrutorFromState.nome || "",
        formacao: instrutorFromState.formacao || "",
        sobre: instrutorFromState.sobre || ""
      });
      setLoading(false);
    } else if (id) {
      // Busca os dados da API
      axios.get(`https://api.digitaleduca.com.vc/instrutor/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
        .then((res) => {
          setInstrutor({
            nome: res.data.nome || "",
            formacao: res.data.formacao || "",
            sobre: res.data.sobre || ""
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

      console.log("Atualizando instrutor ID:", id);
      console.log("Dados enviados:", { nome, formacao, sobre });

      await axios.put(
        `https://api.digitaleduca.com.vc/instrutor/update/${instrutorFromState.id}`,
        { nome, formacao, sobre },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        }
      );

      Swal.fire("Sucesso", "Instrutor atualizado com sucesso!", "success")
        .then(() => navigate("/instrutores"));

    } catch (error) {
      console.error("Erro ao atualizar:", {
        status: error.response?.status,
        data: error.response?.data
      });

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
    <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 6 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>Editar Instrutor</Typography>

      <TextField
        fullWidth
        label="Nome"
        name="nome"
        value={instrutor.nome}
        onChange={handleChange}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Formação"
        name="formacao"
        value={instrutor.formacao}
        onChange={handleChange}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Sobre o Instrutor"
        name="sobre"
        value={instrutor.sobre}
        onChange={handleChange}
        margin="normal"
        multiline
        minRows={4}
      />

      <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" onClick={() => navigate("/instrutores")}>Cancelar</Button>
        <Button variant="contained" onClick={handleUpdate}>Salvar</Button>
      </Box>
    </Paper>
  );
};

export default EditarInstrutor;

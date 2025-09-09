import { useState, useEffect } from "react";
import {
  Paper,
  TextField,
  Box,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
} from "@mui/material";
import axios from "axios";
import { Check } from "@mui/icons-material";

const EditarPlano = ({ plano, setOpen, onUpdate }) => {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [desc, setDesc] = useState("");
  const [intervalo, setIntervalo] = useState("");
  const [qtd, setQtd] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const id = plano?._id || plano?.id;

  useEffect(() => {
    console.log("Plano received from state:", JSON.stringify(plano, null, 2));
    if (plano) {
      setNome(plano.nome || "");
      setPreco(plano.preco?.toString() || "");
      setDesc(plano.descricao || "");
      setIntervalo(plano.intervalo || "");
      setQtd(plano.intervaloCount?.toString() || "1");
    }
  }, [plano]);

  const updatePlan = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    if (!id) {
      setErrors({ general: "ID do plano não encontrado" });
      console.error("ID is undefined. Plano object:", JSON.stringify(plano, null, 2));
      return;
    }

    const parsedPreco = parseFloat(preco);
    const parsedQtd = parseInt(qtd);

    if (!nome) {
      setErrors({ general: "Nome é obrigatório" });
      return;
    }
    if (!desc) {
      setErrors({ general: "Descrição é obrigatória" });
      return;
    }
    if (isNaN(parsedPreco)) {
      setErrors({ general: "Preço inválido" });
      return;
    }
    if (!intervalo || !["month", "year"].includes(intervalo)) {
      setErrors({ general: "Intervalo inválido" });
      return;
    }
    if (isNaN(parsedQtd) || parsedQtd <= 0) {
      setErrors({ general: "Quantidade inválida" });
      return;
    }

    // Try partial payload to test server response
    const payload = {
      nome,
      descricao: desc,
      // preco: parsedPreco,
      // intervalo,
      // intervaloCount: parsedQtd,
    };
    console.log("Sending payload to server:", JSON.stringify(payload, null, 2));
    console.log("Request URL:", `http://10.10.10.62:3000/planos/update/${id}`);

    try {
      const response = await axios.put(
        `http://10.10.10.62:3000/planos/update/${id}`,
        payload,
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Server response:", JSON.stringify(response.data, null, 2));

      setSuccess(true);
      if (onUpdate) onUpdate();

      setTimeout(() => {
        if (setOpen) setOpen(false);
      }, 2000);
    } catch (error) {
      const responseMessage = error.response?.data?.message;
      console.error("Server error details:", JSON.stringify(error.response?.data, null, 2));
      console.error("Full error object:", JSON.stringify(error, null, 2));

      if (Array.isArray(responseMessage)) {
        const errorMessages = responseMessage.reduce((acc, msg) => {
          if (msg.includes("intervalo")) acc.intervalo = "Intervalo inválido";
          if (msg.includes("intervaloCount")) acc.qtd = "Quantidade inválida";
          return acc;
        }, {});
        setErrors(errorMessages);
      } else {
        setErrors({ general: responseMessage || "Erro ao atualizar o plano" });
      }
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        width: "100%",
        borderRadius: "12px",
        boxShadow: "0 0 2px rgba(255,255,255,0.4)",
      }}
    >
      <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "600" }}>
        Editar Plano
      </Typography>

      {success && (
        <Alert icon={<Check />} severity="success" sx={{ mb: 2 }}>
          Plano atualizado com sucesso!
        </Alert>
      )}
      {errors.general && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.general}
        </Alert>
      )}

      <TextField
        label="Nome"
        fullWidth
        margin="normal"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />

      <TextField
        label="Preço (R$)"
        fullWidth
        margin="normal"
        value={preco}
        disabled
      />

      <TextField
        label="Descrição"
        multiline
        rows={4}
        fullWidth
        margin="normal"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        required
      />

      <FormControl fullWidth margin="normal" disabled>
        <InputLabel>Intervalo</InputLabel>
        <Select value={intervalo}>
          <MenuItem value="month">Mês</MenuItem>
          <MenuItem value="year">Ano</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Quantidade"
        fullWidth
        margin="normal"
        value={qtd}
        disabled
      />

      <Box sx={{mt: 2, display: "flex", gap: "1rem", justifyContent: "center" }}>
        <Button sx={{borderRadius:"20px", fontWeight:"600", border:"none", boxShadow:"0 0 2px rgba(255,255,255,0.4)"}} onClick={() => setOpen(false)} variant="outlined">
          Cancelar
        </Button>
        <Button sx={{borderRadius:"20px", fontWeight:"600"}} onClick={updatePlan} variant="contained">
          Atualizar
        </Button>
      </Box>
    </Paper>
  );
};

export default EditarPlano;
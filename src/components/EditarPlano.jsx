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
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import axios from "axios";
import {
  Check,
  Title,
  AttachMoney,
  Description,
  DateRange,
  Numbers,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import theme from "../theme/theme";

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
      return;
    }

    const payload = {
      nome,
      descricao: desc,
    };

    try {
      await axios.put(
        `http://10.10.11.180:3000/planos/update/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccess(true);
      if (onUpdate) onUpdate();

      setTimeout(() => {
        if (setOpen) setOpen(false);
      }, 2000);
    } catch (error) {
      const responseMessage = error.response?.data?.message;
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
        p: 4,
        maxWidth: 600,
        mx: "auto",
        mt: 6,
        borderRadius: 4,
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.08
        )}, ${alpha(theme.palette.primary.main, 0.02)})`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        mb: 4,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          fontWeight: 700,
          mb: 3,
          color: theme.palette.text.primary,
        }}
      >
        Editar Plano
      </Typography>

      {success && (
        <Alert
          icon={<Check />}
          severity="success"
          sx={{
            mb: 3,
            borderRadius: "12px",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          Plano atualizado com sucesso!
        </Alert>
      )}
      {errors.general && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.general}
        </Alert>
      )}

      <TextField
        type="text"
        label="Nome"
        fullWidth
        margin="normal"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        error={!!errors.nome}
        helperText={errors.nome}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Title color="primary" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        type="number"
        label="Preço"
        fullWidth
        margin="normal"
        value={preco}
        disabled
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AttachMoney color="primary" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        type="text"
        label="Descrição"
        multiline
        rows={4}
        fullWidth
        margin="normal"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        error={!!errors.desc}
        helperText={errors.desc}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Description color="primary" />
            </InputAdornment>
          ),
        }}
      />

      <FormControl fullWidth margin="normal" disabled error={!!errors.intervalo}>
        <InputLabel>Intervalo</InputLabel>
        <Select
          value={intervalo}
          startAdornment={
            <InputAdornment position="start">
              <DateRange color="primary" />
            </InputAdornment>
          }
        >
          <MenuItem value="month">Mês</MenuItem>
          <MenuItem value="year">Ano</MenuItem>
        </Select>
        {errors.intervalo && (
          <FormHelperText>{errors.intervalo}</FormHelperText>
        )}
      </FormControl>

      <TextField
        type="number"
        label="Quantidade"
        fullWidth
        margin="normal"
        value={qtd}
        disabled
        error={!!errors.qtd}
        helperText={errors.qtd}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Numbers color="primary" />
            </InputAdornment>
          ),
        }}
      />

      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
        }}
      >
        <Button
          onClick={() => setOpen(false)}
          variant="outlined"
          sx={{
            borderRadius: 3,
            fontWeight: 600,
            textTransform: "none",
            px: 3,
            boxShadow: "0 0 4px rgba(0,0,0,0.15)",
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          sx={{
            borderRadius: 3,
            fontWeight: 700,
            textTransform: "none",
            px: 4,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            transition: "all 0.3s ease",
            "&:hover": {
              background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
              transform: "translateY(-2px)",
            },
          }}
          onClick={updatePlan}
        >
          Atualizar
        </Button>
      </Box>
    </Paper>
  );
};

export default EditarPlano;

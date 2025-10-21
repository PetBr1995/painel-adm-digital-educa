import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Paper,
  Stack,
  Grid,
  MenuItem,
} from "@mui/material";
import { useParams } from "react-router-dom";

export default function EditarConteudo() {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [conteudo, setConteudo] = useState({});
  const [status, setStatus] = useState("");

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("");
  const [level, setLevel] = useState("Iniciante");
  const [aprendizagem, setAprendizagem] = useState("");
  const [requisitos, setRequisitos] = useState("");

  const tipos = [
    { value: "PALESTRA", label: "PALESTRA" },
    { value: "CURSO", label: "CURSO" },
    { value: "PODCAST", label: "PODCAST" },
    { value: "WORKSHOP", label: "WORKSHOP" },
  ];

  const niveis = ["Iniciante", "Intermediário", "Avançado"];

  // 🔹 Buscar dados do conteúdo
  const getConteudoById = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://10.10.11.174:3000/conteudos/${id}/admin`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConteudo(res.data);

      // Preencher estados dos inputs
      setTitulo(res.data.titulo || "");
      setDescricao(res.data.descricao || "");
      setTipo(res.data.tipo || "");
      setLevel(res.data.level || "Iniciante");
      setAprendizagem(res.data.aprendizagem || "");
      setRequisitos(res.data.requisitos || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConteudoById();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado. Faça login novamente.");

      const body = {
        titulo,
        descricao,
        tipo,
        level,
        aprendizagem,
        requisitos,
      };

      const res = await axios.put(
        `http://10.10.11.174:3000/conteudos/${id}`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Conteúdo atualizado:", res.data);
      setStatus("Conteúdo atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      setStatus("Erro ao atualizar conteúdo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", py: 5, px: 2 }}>
      <Stack spacing={4} maxWidth={720} mx="auto">
        <Typography variant="h4" fontWeight="700" align="center">
          Editar Conteúdo
        </Typography>

        {status && (
          <Typography
            align="center"
            color={status.toLowerCase().includes("erro") ? "error" : "success.main"}
          >
            {status}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            {/* 📝 Informações Básicas */}
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>
                📝 Informações Básicas
              </Typography>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Título *"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Descrição *"
                  multiline
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </Stack>
            </Paper>

            {/* ⚙️ Configurações */}
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>
                ⚙️ Configurações
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Tipo"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                  >
                    {tipos.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Nível"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    {niveis.map((n) => (
                      <MenuItem key={n} value={n}>
                        {n}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Paper>

            {/* 📘 Detalhes */}
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>
                📘 Detalhes do Conteúdo
              </Typography>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Aprendizagem"
                  multiline
                  rows={2}
                  value={aprendizagem}
                  onChange={(e) => setAprendizagem(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Requisitos"
                  multiline
                  rows={2}
                  value={requisitos}
                  onChange={(e) => setRequisitos(e.target.value)}
                />
              </Stack>
            </Paper>

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                py: 2,
                fontSize: "1.1rem",
                fontWeight: "700",
                borderRadius: 3,
                textTransform: "none",
              }}
            >
              Atualizar Conteúdo
            </Button>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
}

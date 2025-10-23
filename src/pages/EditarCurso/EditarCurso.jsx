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
  const [status, setStatus] = useState("");

  // Campos principais
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("");
  const [level, setLevel] = useState("Iniciante");
  const [aprendizagem, setAprendizagem] = useState("");
  const [requisitos, setRequisitos] = useState("");
  const [instrutores, setInstrutores] = useState([]);
  const [instrutorIds, setInstrutorIds] = useState([]);

  // Thumbnails (urls existentes)
  const [thumbnailDesktop, setThumbnailDesktop] = useState("");
  const [thumbnailMobile, setThumbnailMobile] = useState("");
  const [thumbnailDestaque, setThumbnailDestaque] = useState("");

  // Arquivos novos
  const [fileDesktop, setFileDesktop] = useState(null);
  const [fileMobile, setFileMobile] = useState(null);
  const [fileDestaque, setFileDestaque] = useState(null);

  const tipos = [
    { value: "AULA", label: "AULA" },
    { value: "PALESTRA", label: "PALESTRA" },
    { value: "PODCAST", label: "PODCAST" },
  ];

  const niveis = ["Iniciante", "Intermediário", "Avançado"];

  // 🔹 Buscar conteúdo por ID
  const getConteudoById = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://10.10.11.174:3000/conteudos/${id}/admin`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data;
      setTitulo(data.titulo || "");
      setDescricao(data.descricao || "");
      setTipo(data.tipo || "");
      setLevel(data.level || "Iniciante");
      setAprendizagem(data.aprendizagem || "");
      setRequisitos(data.requisitos || "");
      setThumbnailDesktop(data.thumbnailDesktop || "");
      setThumbnailMobile(data.thumbnailMobile || "");
      setThumbnailDestaque(data.thumbnailDestaque || "");

      const instrutoresIdsExtraidos =
        data.instrutores?.map((i) => i.instrutor?.id) || [];
      setInstrutorIds(instrutoresIdsExtraidos);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Buscar instrutores
  const getInstrutores = async () => {
    try {
      const res = await axios.get("http://10.10.11.174:3000/instrutor", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setInstrutores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getConteudoById();
    getInstrutores();
  }, [id]);

  // 🧩 Atualizar conteúdo (com thumbnails)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado. Faça login novamente.");

      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descricao", descricao);
      formData.append("tipo", tipo);
      formData.append("level", level);
      formData.append("aprendizagem", aprendizagem);
      formData.append("requisitos", requisitos);

      // Adiciona thumbnails novas, se existirem
      if (fileDesktop) formData.append("thumbnailDesktop", fileDesktop);
      if (fileMobile) formData.append("thumbnailMobile", fileMobile);
      if (fileDestaque) formData.append("thumbnailDestaque", fileDestaque);

      // Adiciona IDs dos instrutores
      instrutorIds.forEach((id) => formData.append("instrutorIds[]", id));

     

      const res = await axios.put(
        `http://10.10.11.174:3000/conteudos/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
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

  if (loading)
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

  return (
    <Box sx={{ minHeight: "100vh", py: 5, px: 2 }}>
      <Stack spacing={4} maxWidth={720} mx="auto">
        <Typography variant="h4" fontWeight={700} align="center">
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
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
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
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                ⚙️ Configurações
              </Typography>
              <Grid sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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

                <TextField
                  select
                  fullWidth
                  label="Instrutores"
                  value={instrutorIds}
                  onChange={(e) => setInstrutorIds(e.target.value)}
                  SelectProps={{ multiple: true }}
                >
                  {instrutores.map((inst) => (
                    <MenuItem key={inst.id} value={inst.id}>
                      {inst.nome}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Paper>

            {/* 🖼️ Thumbnails */}
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                🖼️ Thumbnails
              </Typography>
              <Grid container spacing={3}>
                {[
                  {
                    label: "Desktop",
                    thumb: thumbnailDesktop,
                    file: fileDesktop,
                    setFile: setFileDesktop,
                  },
                  {
                    label: "Mobile",
                    thumb: thumbnailMobile,
                    file: fileMobile,
                    setFile: setFileMobile,
                  },
                  {
                    label: "Destaque",
                    thumb: thumbnailDestaque,
                    file: fileDestaque,
                    setFile: setFileDestaque,
                  },
                ].map(({ label, thumb, file, setFile }) => (
                  <Grid item xs={12} md={4} key={label}>
                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                      {label}
                    </Typography>
                    {thumb && !file && (
                      <img
                        src={`http://10.10.11.174:3000/${thumb}`}
                        alt={label}
                        style={{
                          width: "100%",
                          borderRadius: 8,
                          marginBottom: 8,
                        }}
                      />
                    )}
                    <Button variant="contained" component="label" fullWidth>
                      Alterar imagem
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </Button>
                    {file && (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Prévia ${label}`}
                        style={{
                          width: "100%",
                          borderRadius: 8,
                          marginTop: 8,
                        }}
                      />
                    )}
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* 📘 Detalhes */}
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
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

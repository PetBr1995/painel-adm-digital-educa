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
  Checkbox,
  ListItemText,
  FormControlLabel,
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

  // Categorias / subcategorias
  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState("");
  const [subcategorias, setSubcategorias] = useState([]);
  const [subcategoriaId, setSubcategoriaId] = useState("");

  // Instrutores
  const [instrutores, setInstrutores] = useState([]);
  const [instrutorIds, setInstrutorIds] = useState([]);

  // Tags
  const [tags, setTags] = useState([]);
  const [tagsSelecionadas, setTagsSelecionadas] = useState([]);

  // Thumbnails (URLs atuais)
  const [thumbnailDesktop, setThumbnailDesktop] = useState("");
  const [thumbnailMobile, setThumbnailMobile] = useState("");
  const [thumbnailDestaque, setThumbnailDestaque] = useState("");

  // Arquivos novos
  const [fileDesktop, setFileDesktop] = useState(null);
  const [fileMobile, setFileMobile] = useState(null);
  const [fileDestaque, setFileDestaque] = useState(null);

  // gratuitoTipo / gratuitoAte
  const [gratuitoTipo, setGratuitoTipo] = useState("NENHUM"); // "NENHUM" | "TEMPORARIO" | "PERMANENTE"
  const [gratuitoAte, setGratuitoAte] = useState(""); // string (data) – só usado se TEMPORARIO

  const [destaque, setDestaque] = useState(false);

  const tipos = [
    { value: "AULA", label: "AULA" },
    { value: "PALESTRA", label: "PALESTRA" },
    { value: "PODCAST", label: "PODCAST" },
  ];

  const niveis = ["Iniciante", "Intermediário", "Avançado"];

  // ✅ Regra do conteúdo 96 + Link
  const CONTEUDO_ESPECIAL_ID = "96";
  const isConteudo96 = String(id) === CONTEUDO_ESPECIAL_ID;

  const DOWNLOAD_LINK =
    "https://docs.google.com/spreadsheets/d/1owAnXrUYOT21nR_ql2sEDAGkilKDEo7c/export?";

  const buildDescricaoComLink = (descAtual) => {
    const base = (descAtual || "").trim();

    // se já tiver o link, não duplica
    if (base.includes(DOWNLOAD_LINK)) return base;

    // se descrição vazia, fica só o link
    if (!base) return DOWNLOAD_LINK;

    // concatena com quebra de linha
    return `${base}\n\n${DOWNLOAD_LINK}`;
  };

  const handleAdicionarLinkNaDescricao = () => {
    setDescricao((prev) => {
      const next = buildDescricaoComLink(prev);
      // respeita limite do campo
      return next.slice(0, 500);
    });
  };

  // 🔹 Buscar conteúdo por ID
  const getConteudoById = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://api.digitaleduca.com.vc/conteudos/${id}/admin`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data;
      console.log("Conteúdo carregado:", data);

      setTitulo((data.titulo || "").slice(0, 100));
      setDescricao((data.descricao || "").slice(0, 500));
      setTipo(data.tipo || "");
      setLevel(data.level || "Iniciante");
      setAprendizagem((data.aprendizagem || "").slice(0, 500));
      setRequisitos((data.requisitos || "").slice(0, 500));

      setThumbnailDesktop(data.thumbnailDesktop || "");
      setThumbnailMobile(data.thumbnailMobile || "");
      setThumbnailDestaque(data.thumbnailDestaque || "");

      setDestaque(Boolean(data.destaque));

      // categoria / subcategoria vindas do back
      setCategoriaId(data.categoriaId || data.categoria?.id || data.categoria?._id || "");
      setSubcategoriaId(
        data.subcategoriaId || data.subcategoria?.id || data.subcategoria?._id || ""
      );

      // instrutores associados
      const instrutoresIdsExtraidos =
        data.instrutores?.map((i) => i.instrutor?.id ?? i.instrutor?._id ?? i.instrutorId) || [];
      setInstrutorIds(instrutoresIdsExtraidos);

      // tags associadas (se o back mandar)
      const tagsIdsExtraidos =
        (data.tags || []).map((t) => t.id ?? t._id ?? t.tagId ?? t) || [];
      setTagsSelecionadas(tagsIdsExtraidos);

      // gratuitoTipo e gratuitoAte vindos do backend
      setGratuitoTipo(data.gratuitoTipo || "NENHUM");
      setGratuitoAte(data.gratuitoAte || "");
    } catch (err) {
      console.error("Erro ao carregar conteúdo:", err);
      setStatus("Erro ao carregar conteúdo.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Buscar categorias
  const listarCategorias = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://api.digitaleduca.com.vc/categorias/list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const normalizedCats = (res.data || []).map((c) => ({
        id: c._id ?? c.id ?? "",
        nome: c.nome ?? c.title ?? "",
      }));

      setCategorias(normalizedCats);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      setCategorias([]);
    }
  };

  // 🔹 Buscar subcategorias
  const listarSubcategorias = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://api.digitaleduca.com.vc/subcategorias/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubcategorias(res.data || []);
    } catch (error) {
      console.error("Erro ao carregar subcategorias:", error);
      setSubcategorias([]);
    }
  };

  // 🔹 Buscar instrutores
  const getInstrutores = async () => {
    try {
      const res = await axios.get("https://api.digitaleduca.com.vc/instrutor", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const data = res.data?.instrutores ?? res.data ?? [];
      const normalized = (Array.isArray(data) ? data : []).map((i) => ({
        id: i._id ?? i.id ?? i._idstr ?? "",
        nome: i.nome ?? i.name ?? i.nomeCompleto ?? "Sem nome",
      }));

      setInstrutores(normalized);
    } catch (err) {
      console.error("Erro ao carregar instrutores:", err);
      setInstrutores([]);
    }
  };

  // 🔹 Buscar tags
  const getTags = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://api.digitaleduca.com.vc/tags", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const normalizedTags = (res.data || []).map((t) => ({
        id: t._id ?? t.id ?? "",
        nome: t.nome ?? t.name ?? "",
      }));

      setTags(normalizedTags);
    } catch (err) {
      console.error("Erro ao carregar tags:", err);
      setTags([]);
    }
  };

  useEffect(() => {
    getConteudoById();
    listarCategorias();
    listarSubcategorias();
    getInstrutores();
    getTags();
  }, [id]);

  const subcategoriasFiltradas = subcategorias;

  // 🧩 Atualizar conteúdo
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado.");

      // ✅ garantia no submit: se for 96, adiciona o link mantendo a descrição
      const descricaoFinal = isConteudo96 ? buildDescricaoComLink(descricao) : descricao;

      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descricao", descricaoFinal);
      formData.append("tipo", tipo);
      formData.append("level", level);
      formData.append("aprendizagem", aprendizagem);
      formData.append("requisitos", requisitos);

      formData.append("destaque", destaque ? "true" : "");

      if (categoriaId) formData.append("categoriaId", String(categoriaId));
      if (subcategoriaId) formData.append("subcategoriaId", String(subcategoriaId));

      formData.append("gratuitoTipo", gratuitoTipo || "NENHUM");

      if (gratuitoTipo === "TEMPORARIO" && gratuitoAte) {
        formData.append("gratuitoAte", gratuitoAte);
      }

      if (fileDesktop) formData.append("thumbnailDesktop", fileDesktop);
      if (fileMobile) formData.append("thumbnailMobile", fileMobile);
      if (fileDestaque) formData.append("thumbnailDestaque", fileDestaque);

      instrutorIds.forEach((idInstrutor) =>
        formData.append("instrutorIds[]", String(idInstrutor))
      );

      tagsSelecionadas.forEach((tagId) => formData.append("tags[]", String(tagId)));

      console.log("=== DEBUG SUBMIT ===");
      console.log("Conteúdo ID:", id, "isConteudo96:", isConteudo96);
      console.log("descricao enviada:", descricaoFinal);
      console.log("=== FIM DEBUG ===");

      await axios.put(`https://api.digitaleduca.com.vc/conteudos/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStatus("Conteúdo atualizado com sucesso!");

      // opcional: reflete o valor final no estado, respeitando limite
      if (isConteudo96) setDescricao(descricaoFinal.slice(0, 500));
    } catch (err) {
      console.error("Erro ao atualizar conteúdo:");
      console.log("status:", err.response?.status);
      console.log("data:", err.response?.data);
      console.log("headers:", err.response?.headers);
      setStatus("Erro ao atualizar conteúdo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !titulo) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

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

              {/* ✅ Botão aparece somente no conteúdo 96 */}
              {isConteudo96 && (
                <Box sx={{ mb: 2 }}>
                  <Button variant="outlined" onClick={handleAdicionarLinkNaDescricao}>
                    Adicionar link de download na descrição
                  </Button>
                </Box>
              )}

              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Título *"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value.slice(0, 100))}
                  inputProps={{ maxLength: 100 }}
                  helperText={`${titulo.length}/100 caracteres`}
                />

                <TextField
                  fullWidth
                  label="Descrição *"
                  multiline
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value.slice(0, 500))}
                  inputProps={{ maxLength: 500 }}
                  helperText={`${descricao.length}/500 caracteres`}
                />
              </Stack>
            </Paper>

            {/* ⚙️ Configurações */}
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                ⚙️ Configurações
              </Typography>
              <Grid sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Categoria */}
                <TextField
                  select
                  fullWidth
                  label="Categoria"
                  value={categoriaId || ""}
                  onChange={(e) => {
                    const value = e.target.value ?? "";
                    setCategoriaId(value);
                    setSubcategoriaId("");
                  }}
                >
                  <MenuItem value="">Selecione uma categoria</MenuItem>
                  {categorias.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.nome}
                    </MenuItem>
                  ))}
                </TextField>

                {/* Subcategoria */}
                <TextField
                  select
                  fullWidth
                  label="Subcategoria"
                  value={subcategoriaId || ""}
                  onChange={(e) => setSubcategoriaId(e.target.value ?? "")}
                >
                  <MenuItem value="">Selecione uma subcategoria</MenuItem>
                  {subcategoriasFiltradas.map((sub) => {
                    const subId = sub.id ?? sub._id;
                    return (
                      <MenuItem key={subId} value={subId}>
                        {sub.nome}
                      </MenuItem>
                    );
                  })}
                </TextField>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(destaque)}
                      onChange={(e) => setDestaque(e.target.checked)}
                    />
                  }
                  label="Conteúdo em destaque"
                />

                {/* Tipo */}
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

                {/* Nível */}
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

                {/* Instrutores (multi-select) */}
                <TextField
                  select
                  fullWidth
                  label="Instrutores"
                  value={instrutorIds}
                  onChange={(e) => setInstrutorIds(e.target.value)}
                  SelectProps={{
                    multiple: true,
                    renderValue: (selected) =>
                      selected
                        .map((idSel) => instrutores.find((i) => i.id === idSel)?.nome || "")
                        .filter(Boolean)
                        .join(", "),
                  }}
                >
                  {instrutores.map((inst) => (
                    <MenuItem key={inst.id} value={inst.id}>
                      <Checkbox checked={instrutorIds.includes(inst.id)} />
                      <ListItemText primary={inst.nome} />
                    </MenuItem>
                  ))}
                </TextField>

                {/* Tags (multi-select) */}
                <TextField
                  select
                  fullWidth
                  label="Tags"
                  value={tagsSelecionadas}
                  onChange={(e) => setTagsSelecionadas(e.target.value)}
                  SelectProps={{
                    multiple: true,
                    renderValue: (selected) =>
                      selected
                        .map((tagId) => {
                          const tag = tags.find((t) => t.id === tagId);
                          return tag ? `#${tag.nome}` : "";
                        })
                        .filter(Boolean)
                        .join(", "),
                  }}
                >
                  {tags.map((tag) => (
                    <MenuItem key={tag.id} value={tag.id}>
                      <Checkbox checked={tagsSelecionadas.includes(tag.id)} />
                      <ListItemText primary={`#${tag.nome}`} />
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Paper>

            {/* 💰 Conteúdo Gratuito */}
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                💰 Conteúdo Gratuito
              </Typography>
              <Stack spacing={2}>
                <TextField
                  select
                  fullWidth
                  label="Tipo de gratuidade"
                  value={gratuitoTipo}
                  onChange={(e) => {
                    const value = e.target.value;
                    setGratuitoTipo(value);
                    if (value !== "TEMPORARIO") setGratuitoAte("");
                  }}
                >
                  <MenuItem value="NENHUM">Nenhum</MenuItem>
                  <MenuItem value="PERMANENTE">Permanente</MenuItem>
                  <MenuItem value="TEMPORARIO">Temporário</MenuItem>
                </TextField>

                {gratuitoTipo === "TEMPORARIO" && (
                  <TextField
                    fullWidth
                    type="date"
                    label="Gratuito até"
                    InputLabelProps={{ shrink: true }}
                    value={gratuitoAte || ""}
                    onChange={(e) => setGratuitoAte(e.target.value)}
                  />
                )}
              </Stack>
            </Paper>

            {/* 🖼️ Thumbnails */}
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                🖼️ Thumbnails
              </Typography>
              <Grid container spacing={3}>
                {[
                  { label: "Desktop", thumb: thumbnailDesktop, file: fileDesktop, setFile: setFileDesktop },
                  { label: "Mobile", thumb: thumbnailMobile, file: fileMobile, setFile: setFileMobile },
                  { label: "Destaque", thumb: thumbnailDestaque, file: fileDestaque, setFile: setFileDestaque },
                ].map(({ label, thumb, file, setFile }) => (
                  <Grid item xs={12} md={4} key={label}>
                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                      {label}
                    </Typography>
                    {thumb && !file && (
                      <img
                        src={`https://api.digitaleduca.com.vc/${thumb}`}
                        alt={label}
                        style={{ width: "100%", borderRadius: 8, marginBottom: 8 }}
                      />
                    )}
                    <Button variant="contained" component="label" fullWidth>
                      Alterar imagem
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={(e) => setFile(e.target.files[0] || null)}
                      />
                    </Button>
                    {file && (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Prévia ${label}`}
                        style={{ width: "100%", borderRadius: 8, marginTop: 8 }}
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
                  onChange={(e) => setAprendizagem(e.target.value.slice(0, 500))}
                  inputProps={{ maxLength: 500 }}
                  helperText={`${aprendizagem.length}/500 caracteres`}
                />
                <TextField
                  fullWidth
                  label="Requisitos"
                  multiline
                  rows={2}
                  value={requisitos}
                  onChange={(e) => setRequisitos(e.target.value.slice(0, 500))}
                  inputProps={{ maxLength: 500 }}
                  helperText={`${requisitos.length}/500 caracteres`}
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

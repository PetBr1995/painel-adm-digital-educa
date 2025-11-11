import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Grid,
  Paper,
  Stack,
  Chip,
  CircularProgress,
  Modal,
  Fade,
  Backdrop,
  alpha,
  Container,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import axios from "axios";
import Swal from "sweetalert2";
import CadastrarCategorias from "../../components/CadastrarCategorias";
import CadastrarSubcategoria from "../../components/CadastrarSubcategoria";
import CadastrarTag from "../../components/CadastrarTag";

const Categorias = () => {
  const [tab, setTab] = useState(0);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  // SEUS STATES (AGORA COM MODAIS LINDOS)
  const [showFormMoverCategoria, setShowFormMoverCategoria] = useState(false);
  const [showFormSubcategoria, setShowFormSubcategoria] = useState(false);
  const [showFormTag, setShowFormTag] = useState(false)

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, subRes, tagRes] = await Promise.all([
        axios.get("https://api.digitaleduca.com.vc/categorias/list", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get("https://api.digitaleduca.com.vc/subcategorias/list", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get("https://api.digitaleduca.com.vc/tags", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);
      setCategorias(catRes.data);
      setSubcategorias(subRes.data);
      setTags(tagRes.data);
    } catch (err) {
      Swal.fire("Erro", "Falha ao carregar dados.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (type, id, name) => {
    const result = await Swal.fire({
      title: `Excluir ${type}?`,
      text: `${name} será removido permanentemente.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Excluir",
    });

    if (!result.isConfirmed) return;

    try {
      const endpoint =
        type === "categoria"
          ? `https://api.digitaleduca.com.vc/categorias/${id}`
          : `https://api.digitaleduca.com.vc/${type}s/${id}`;

      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (type === "categoria") setCategorias(prev => prev.filter(c => c.id !== id));
      if (type === "subcategoria") setSubcategorias(prev => prev.filter(s => s.id !== id));
      if (type === "tag") setTags(prev => prev.filter(t => t.id !== id));

      Swal.fire("Excluído!", `${type} removido com sucesso.`, "success");
    } catch {
      Swal.fire("Erro", `Não foi possível excluir.`, "error");
    }
  };

  const getColor = (nome) => {
    const cores = {
      Programação: "#3b82f6",
      Design: "#10b981",
      Frontend: "#8b5cf6",
      Backend: "#f59e0b",
      Iniciante: "#10b981",
      Avançado: "#f97316",
      React: "#3b82f6",
    };
    return cores[nome] || "#6366f1";
  };

  const Card = ({ item, type }) => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: "background.paper",
        transition: "all 0.3s ease",
        "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
      }}
    >
      <Chip
        label={item.nome}
        sx={{
          bgcolor: getColor(item.nome),
          color: "white",
          fontWeight: 600,
          mb: 2,
          height: 32,
        }}
      />
      <Typography variant="body2" color="text.secondary" paragraph>
        {type === "categoria" && "Cursos relacionados a desenvolvimento"}
        {type === "subcategoria" && (item.descricao || "Sem descrição")}
        {type === "tag" && "Tag de classificação"}
      </Typography>

      <Stack direction="row" spacing={1}>
        <Button size="small" variant="outlined" color="primary">
          Editar
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="error"
          onClick={() => handleDelete(type, item.id, item.nome)}
        >
          Excluir
        </Button>
      </Stack>
    </Paper>
  );

  // ABRE O MODAL CORRETO
  const openForm = () => {
    if (tab === 0) setShowFormMoverCategoria(true);
    if (tab === 1) setShowFormSubcategoria(true);
    if (tab === 2) setShowFormTag(true);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
        {/* HEADER */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha("#6366f1", 0.08)}, ${alpha("#6366f1", 0.02)})`,
            border: `1px solid ${alpha("#6366f1", 0.2)}`,
          }}
        >
          <Stack direction="row" alignItems="center" gap={2}>
            <Box
              sx={{
                bgcolor: "#6366f1",
                color: "white",
                width: 48,
                height: 48,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              GE
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Gestão Educacional
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gerencie categorias, subcategorias e tags da plataforma
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* TABS */}
        <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 4 }}>
          <Tab label="Categorias" />
          <Tab label="Subcategorias" />
          <Tab label="Tags" />
        </Tabs>

        {/* CONTEÚDO */}
        {loading ? (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
            <CircularProgress />
          </Paper>
        ) : (
          <>
            {tab === 0 && (
              <Box>
                <Typography variant="h6" fontWeight={600} mb={3}>
                  Categorias
                </Typography>
                <Grid container spacing={3}>
                  {categorias.map(cat => (
                    <Grid item xs={12} sm={6} md={4} key={cat.id}>
                      <Card item={cat} type="categoria" />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {tab === 1 && (
              <Box>
                <Typography variant="h6" fontWeight={600} mb={3}>
                  Subcategorias
                </Typography>
                <Grid container spacing={3}>
                  {subcategorias.map(sub => (
                    <Grid item xs={12} sm={6} md={4} key={sub.id}>
                      <Card item={sub} type="subcategoria" />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {tab === 2 && (
              <Box>
                <Typography variant="h6" fontWeight={600} mb={3}>
                  Tags
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {tags.map(tag => (
                    <Chip
                      key={tag.id}
                      label={tag.nome}
                      onDelete={() => handleDelete("tag", tag.id, tag.nome)}
                      deleteIcon={<Close />}
                      sx={{
                        bgcolor: getColor(tag.nome),
                        color: "white",
                        fontWeight: 600,
                        height: 40,
                        fontSize: "0.95rem",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </>
        )}

        {/* BOTÃO FLUTUANTE (IGUAL AO CONTEÚDOS) */}
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={openForm}
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            borderRadius: 30,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            boxShadow: "0 8px 25px rgba(99,102,241,0.4)",
            bgcolor: "#3b82f6",
            "&:hover": {
              bgcolor: "#2563eb",
              transform: "translateY(-2px)",
            },
            zIndex: 1000,
          }}
        >
          {tab === 0 && "Nova Categoria"}
          {tab === 1 && "Nova Subcategoria"}
          {tab === 2 && "Nova Tag"}
        </Button>

        {/* MODAIS (IGUAIS AO CONTEÚDOS) */}
        <Modal
          open={showFormMoverCategoria}
          onClose={() => setShowFormMoverCategoria(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
            sx: { backdropFilter: "blur(4px)", bgcolor: alpha("#000", 0.6) },
          }}
        >
          <Fade in={showFormMoverCategoria}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: `0 12px 40px ${alpha("#000", 0.2)}`,
                p: 4,
                borderRadius: 3,
                width: { xs: "90%", sm: 500 },
                border: `1px solid ${alpha("#e0e0e0", 0.1)}`,
              }}
            >
              <CadastrarCategorias
                setForm={setShowFormMoverCategoria}
                onCategoriaCadastrada={(nova) => {
                  setCategorias(prev => [...prev, nova]);
                  setShowFormMoverCategoria(false);
                  fetchData();
                }}
              />
            </Box>
          </Fade>
        </Modal>

        <Modal
          open={showFormSubcategoria}
          onClose={() => setShowFormSubcategoria(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
            sx: { backdropFilter: "blur(4px)", bgcolor: alpha("#000", 0.6) },
          }}
        >
          <Fade in={showFormSubcategoria}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: `0 12px 40px ${alpha("#000", 0.2)}`,
                p: 4,
                borderRadius: 3,
                width: { xs: "90%", sm: 500 },
                border: `1px solid ${alpha("#e0e0e0", 0.1)}`,
              }}
            >
              <CadastrarSubcategoria
                setFormSubcategoria={setShowFormSubcategoria}
                onSuccess={(nova) => {
                  setSubcategorias(prev => [...prev, nova]);
                  setShowFormSubcategoria(false);
                  fetchData();
                }}
              />
            </Box>
          </Fade>
        </Modal>

        <Modal
          open={showFormTag}
          onClose={() => setShowFormTag(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
            sx: { backdropFilter: "blur(4px)", bgcolor: alpha("#000", 0.6) },
          }}
        >
          <Fade in={showFormTag}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: `0 12px 40px ${alpha("#000", 0.2)}`,
                p: 4,
                borderRadius: 3,
                width: { xs: "90%", sm: 500 },
                border: `1px solid ${alpha("#e0e0e0", 0.1)}`,
              }}
            >
              <CadastrarTag
                setForm={setShowFormTag}
                onTagCadastrada={(nova) => {
                  setTags(prev => [...prev, nova]);
                  fetchData();
                }}
              />
            </Box>
          </Fade>
        </Modal>
      </Container>
    </Box>
  );
};

export default Categorias;
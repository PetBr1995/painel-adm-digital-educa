import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Snackbar,
  Alert
} from "@mui/material";
import { ArrowBack, Upload } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import theme from "../../theme/theme";

const CadastrarCurso = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [level, setLevel] = useState('');
  const [aprendizagem, setAprendizagem] = useState('');
  const [requisitos, setRequisitos] = useState('');
  const [instrutorID, setInstrutorID] = useState('');
  const [instrutor, setInstrutor] = useState([]);
  const [categoriaID, setCategoriaID] = useState('');
  const [categorias, setCategorias] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef();

  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const createCurso = () => {
    const formData = new FormData();

    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("level", level);
    formData.append("aprendizagem", aprendizagem);
    formData.append("requisitos", requisitos);
    formData.append("instrutorId", instrutorID);
    formData.append("categoriaId", categoriaID);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    axios
      .post("https://testeapi.digitaleduca.com.vc/curso/create", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Curso cadastrado com sucesso:", response.data);
        setSnackbarMessage("Curso cadastrado com sucesso!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        setTimeout(() => {
          navigate("/cursos");
        }, 2000);
      })
      .catch((error) => {
        console.error("Erro ao cadastrar curso:", error);
        setSnackbarMessage("Erro ao cadastrar curso. Verifique os dados.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  const getInstructor = () => {
    const token = localStorage.getItem("token");

    axios
      .get("https://testeapi.digitaleduca.com.vc/instrutor", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setInstrutor(response.data);
      })
      .catch((error) => {
        console.error("Erro ao carregar instrutores:", error);
        setSnackbarMessage("Erro ao buscar instrutores.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  const getCategorias = () => {
    const token = localStorage.getItem("token");

    axios
      .get("https://testeapi.digitaleduca.com.vc/categoria/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCategorias(response.data);
      })
      .catch((error) => {
        console.error("Erro ao carregar categorias:", error);
        setSnackbarMessage("Erro ao buscar categorias.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  useEffect(() => {
    getInstructor();
    getCategorias();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    createCurso();
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", paddingBottom: "1rem", gap: "2rem" }}>
        <Button onClick={() => navigate('/cursos')}>
          <ArrowBack />
        </Button>
        <Box>
          <Typography variant="h5" fontWeight={700}>Novo Curso</Typography>
          <Typography variant="body1">Preencha as informações do novo curso</Typography>
        </Box>
      </Box>
      <form onSubmit={handleSubmit}>
        <Box sx={{ boxShadow: "0 0 2px rgba(255,255,255,0.2)", borderRadius: "15px", padding: "1rem 2rem", backgroundColor: theme.palette.secondary.dark }}>

          <Typography variant="h4" sx={{ fontWeight: "500" }}>Informações do curso</Typography>

          {/* Upload da Thumbnail */}
          <Box mt={2}>
            <Typography variant="subtitle1" gutterBottom>
              Thumbnail do Curso
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 128,
                  height: 80,
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Thumbnail"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>

              <Box>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
                <Button
                  variant="outlined"
                  startIcon={<Upload />}
                  onClick={handleClick}
                >
                  Alterar Imagem
                </Button>
              </Box>
            </Box>
          </Box>

          <TextField
            label="Título do Curso"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel id="input-level-select">Level</InputLabel>
            <Select
              labelId="input-level-select"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              label="Level"
            >
              <MenuItem value="Iniciante">Iniciante</MenuItem>
              <MenuItem value="Intermediário">Intermediário</MenuItem>
              <MenuItem value="Avançado">Avançado</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Aprendizagem"
            value={aprendizagem}
            onChange={(e) => setAprendizagem(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={5}
            required
          />

          <TextField
            label="Requisitos"
            value={requisitos}
            onChange={(e) => setRequisitos(e.target.value)}
            fullWidth
            margin="normal"
            required
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel id="select-categoria-label">Categoria</InputLabel>
            <Select
              labelId="select-categoria-label"
              value={categoriaID}
              onChange={(e) => setCategoriaID(e.target.value)}
              label="Categoria"
            >
              {categorias.map((categoria) => (
                <MenuItem key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" required>
            <InputLabel id="select-instrutor-label">Instrutor</InputLabel>
            <Select
              labelId="select-instrutor-label"
              value={instrutorID}
              onChange={(e) => setInstrutorID(e.target.value)}
              label="Instrutor"
            >
              {instrutor.map((instructor) => (
                <MenuItem key={instructor.id} value={instructor.id}>
                  {instructor.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flexStart", marginTop: "2rem", gap: "1rem" }}>
            <Button variant="outlined" onClick={() => navigate('/cursos')}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              Cadastrar
            </Button>
          </Box>
        </Box>
      </form>

      {/* Snackbar de feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CadastrarCurso;

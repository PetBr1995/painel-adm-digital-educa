import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
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

  // thumbnail
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef();

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
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    axios
      .post("https://api.digitaleduca.com.vc/curso/create", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Curso cadastrado com sucesso:", response.data);
        alert("Curso cadastrado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao cadastrar curso:", error);
        alert("Erro ao cadastrar curso. Verifique os dados.");
      });
  };

  const getInstructor = () => {
    const token = localStorage.getItem("token");

    axios
      .get("https://api.digitaleduca.com.vc/instrutor", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setInstrutor(response.data);
      })
      .catch((error) => {
        console.error("Erro ao carregar instrutores:", error);
        alert("Erro ao buscar instrutores.");
      });
  };

  useEffect(() => {
    getInstructor();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    createCurso();
  };

  const navigate = useNavigate();

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
        <Box sx={{ boxShadow: "0 0 2px rgba(255,255,255,0.2)", borderRadius: "15px", padding: "1rem 2rem", backgroundColor:theme.palette.secondary.dark }}>


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
          <Box sx={{display:"flex", alignItems:"center", justifyContent:"flexStart", marginTop:"2rem", gap:"1rem"}}>
            <Button variant="outlined" onClick={() => navigate('/cursos')}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              Cadastrar
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default CadastrarCurso;

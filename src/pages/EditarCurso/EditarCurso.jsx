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
    Alert,
} from "@mui/material";
import { ArrowBack, Upload } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import theme from "../../theme/theme";
import Swal from 'sweetalert2';

const EditarCurso = () => {
    const { id } = useParams();
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [level, setLevel] = useState('');
    const [aprendizagem, setAprendizagem] = useState('');
    const [requisitos, setRequisitos] = useState('');
    const [instrutorID, setInstrutorID] = useState('');
    const [categoriaID, setCategoriaID] = useState('');
    const [instrutor, setInstrutor] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const navigate = useNavigate();

    useEffect(() => {
        getInstrutores();
        getCategorias();
        getCursoById();
    }, []);

    const getInstrutores = () => {
        axios
            .get("https://api.digitaleduca.com.vc/instrutor", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })
            .then((res) => {
                setInstrutor(res.data);
            })
            .catch((err) => {
                setSnackbarMessage("Erro ao carregar instrutores.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            });
    };

    const getCategorias = () => {
        axios
            .get("https://api.digitaleduca.com.vc/categoria/list", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })
            .then((res) => {
                setCategorias(res.data);
            })
            .catch((err) => {
                setSnackbarMessage("Erro ao carregar categorias.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            });
    };

    const getCursoById = () => {
        axios
            .get(`https://api.digitaleduca.com.vc/curso/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })
            .then((res) => {
                console.log(res.data)
                const data = res.data;
                setTitulo(data.titulo);
                setDescricao(data.descricao);
                setLevel(data.level);
                setAprendizagem(data.aprendizagem);
                setRequisitos(data.requisitos);
                setInstrutorID(data.instrutor.id);
                setCategoriaID(data.categoria.id);
                if (data.thumbnail) {
                    setPreview(data.thumbnail);
                }
            })
            .catch((err) => {
                setSnackbarMessage("Erro ao carregar curso.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            });
    };

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

    const handleDelete = () => {
        Swal.fire({
            title: "Tem certeza que deseja excluir?",
            text: "Essa ação não poderá ser desfeita!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sim, excluir",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`https://api.digitaleduca.com.vc/curso/${id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    })
                    .then(() => {
                        Swal.fire({
                            title: "Excluído!",
                            text: "O curso foi excluído com sucesso.",
                            icon: "success",
                            timer: 2000,
                            showConfirmButton: false,
                        });
                        // Redireciona após exclusão (opcional)
                        navigate("/cursos");
                    })
                    .catch(() => {
                        Swal.fire({
                            title: "Erro!",
                            text: "Não foi possível excluir o curso.",
                            icon: "error",
                        });
                    });
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        Swal.fire({
            title: "Você tem certeza?",
            text: "Deseja realmente salvar as alterações deste curso?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, salvar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
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
                    .put(`https://api.digitaleduca.com.vc/curso/${id}`, formData, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "multipart/form-data",
                        },
                    })
                    .then(() => {
                        Swal.fire({
                            title: "Atualizado!",
                            text: "O curso foi atualizado com sucesso.",
                            icon: "success",
                            timer: 2000,
                            showConfirmButton: false,
                        });

                        setSnackbarMessage("Curso atualizado com sucesso!");
                        setSnackbarSeverity("success");
                        setSnackbarOpen(true);
                        navigate("/cursos");
                    })
                    .catch(() => {
                        setSnackbarMessage("Erro ao atualizar curso.");
                        setSnackbarSeverity("error");
                        setSnackbarOpen(true);
                    });
            }
        });
    };


    return (
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", paddingBottom: "1rem", gap: "2rem" }}>
                <Button onClick={() => navigate('/cursos')}>
                    <ArrowBack />
                </Button>
                <Box>
                    <Typography variant="h5" fontWeight={700}>Editar Curso</Typography>
                    <Typography variant="body1">Atualize as informações do curso</Typography>
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
                                    src={"https://api.digitaleduca.com.vc/" + preview || "/placeholder.svg"}
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
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem" }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flexStart", gap: "1rem" }}>
                            <Button variant="outlined" sx={{ fontWeight: "600", borderRadius: "20px" }} onClick={() => navigate('/cursos')}>Cancelar</Button>
                            <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: "20px", fontWeight: "600" }}>
                                Salvar Alterações
                            </Button>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                            <Button onClick={handleDelete} sx={{ borderRadius: "20px", bgcolor: "red", color: "#ffffff", fontWeight: "600" }}>Excluir curso</Button>
                        </Box>
                    </Box>
                </Box>
            </form>

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

export default EditarCurso;

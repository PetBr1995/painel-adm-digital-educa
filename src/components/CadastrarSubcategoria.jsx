import {
    Box,
    Typography,
    Button,
    TextField,
    Paper,
    Stack,
    alpha,
    MenuItem,
} from "@mui/material";
import { Category as CategoryIcon, Close as CloseIcon, Add as AddIcon, Save as SaveIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import theme from "../theme/theme";
import axios from "axios";

const CadastrarSubcategoria = ({ setFormSubcategoria }) => {
    const [nome, setNome] = useState("");
    const [categorias, setCategorias] = useState([]);
    const [categoriaId, setCategoriaId] = useState(""); // 👈 guarda o ID da categoria selecionada

    const cadastrarSubcategoria = async () => {
        try {
            const response = await axios.post(
                "http://10.10.11.180:3000/subcategorias/create",
                {
                    nome,
                    categoriaId, // 👈 envia o ID no corpo da requisição
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setNome('')
            setCategoriaId('')
            console.log("Subcategoria cadastrada:", response.data);
        } catch (error) {
            console.error("Erro ao cadastrar subcategoria:", error.response?.data || error.message);
        }
    };

    const getCategoria = async () => {
        try {
            const response = await axios.get("http://10.10.11.180:3000/categorias/list", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setCategorias(response.data);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        }
    };

    useEffect(() => {
        getCategoria();
    }, []);

    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                maxWidth: 420,
                p: 4,
                borderRadius: 3,
                margin: "auto",
                border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
                position: "relative",
                overflow: "hidden",
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.08)}, ${alpha(theme.palette.primary.light, 0.02)})`,
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
                },
            }}
        >
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} mb={3}>
                <CategoryIcon sx={{ fontSize: 28, color: "primary.main" }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
                    Nova Subcategoria
                </Typography>
            </Stack>

            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ mb: 1.5, color: "text.primary", display: "flex", alignItems: "center", gap: 1 }}
                >
                    <AddIcon sx={{ fontSize: 16, color: "primary.main" }} />
                    Nome da Subcategoria
                </Typography>

                <TextField
                    placeholder="Digite o nome da subcategoria..."
                    fullWidth
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            fontSize: "1rem",
                            "&:hover": { "& > fieldset": { borderColor: "primary.main" } },
                            "&.Mui-focused": { "& > fieldset": { borderWidth: "2px" } },
                        },
                        "& .MuiInputBase-input": { py: 1.5 },
                    }}
                />

                {/* Select de Categoria */}
                <TextField
                    select
                    fullWidth
                    label="Categoria"
                    value={categoriaId || ""}
                    onChange={(e) => setCategoriaId(e.target.value)}
                >
                    <MenuItem value="">Selecione uma categoria...</MenuItem>
                    {categorias.map((categoria) => (
                        <MenuItem key={categoria.id} value={categoria.id}>
                            {categoria.nome}
                        </MenuItem>
                    ))}
                </TextField>

            </Box>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                    onClick={() => setFormSubcategoria(false)}
                    variant="outlined"
                    startIcon={<CloseIcon />}
                >
                    Cancelar
                </Button>

                <Button
                    variant="contained"
                    disabled={!nome.trim() || nome.trim().length < 2 || !categoriaId}
                    startIcon={<SaveIcon />}
                    onClick={cadastrarSubcategoria}
                >
                    Salvar
                </Button>
            </Stack>
        </Paper>
    );
};

export default CadastrarSubcategoria;

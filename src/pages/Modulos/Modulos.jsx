import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { Add, ArrowBack, Delete, Edit, Upload } from "@mui/icons-material";
import CadastroModulo from "../../components/CadastroModulo";
import theme from "../../theme/theme";

export const Modulos = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [form, setForm] = useState(false)
    const curso = location.state?.curso;
    console.log(curso)
    useEffect(() => {
        if (!curso) {
            // Redireciona se não vier nada (acesso direto)
            navigate("/cursos");
        }
    }, [curso, navigate]);

    if (!curso) {
        return <p>Carregando...</p>;
    }

    return (
        <div>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "1rem" }}>
                    <Button>
                        <ArrowBack />
                    </Button>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: "600" }}>{curso.titulo}</Typography>
                        <Typography variant="body2">{curso.descricao}</Typography>
                    </Box>
                </Box>
                <Box>
                    <Button onClick={() => setForm(true)} startIcon={<Add />} variant="contained" sx={{ fontWeight: "600" }}>Novo Modulo</Button>
                </Box>
            </Box>
            {form && <CadastroModulo setForm={setForm} cursoId={curso.id} />}

            {curso.modulos.map((modulo, index) => (
                <>
                    <Box sx={{ mt: 4, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "12px", backgroundColor: theme.palette.secondary.dark }} border={1} borderColor={theme.palette.primary.dark}>
                        <Box key={index}>
                            <Typography variant="h6" sx={{ fontWeight: "600" }}>{modulo.titulo}</Typography>
                            <Typography variant="body2">{modulo.subtitulo}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: '8px' }}>
                            <Typography variant="body2" sx={{ backgroundColor: theme.palette.secondary.light, px: 2, fontSize: ".8rem", borderRadius: "30px" }}>Videos:</Typography>

                            <IconButton sx={{ width: "40px", height: "30px", backgroundColor: theme.palette.secondary.light, p: 2, borderRadius: "5px" }}>
                                <Edit sx={{ width: "40px" }} />
                            </IconButton>
                            <IconButton
                                onClick={() => navigate("/upload-video", { state: { moduloId: modulo.id } })}
                                sx={{
                                    width: "40px",
                                    height: "30px",
                                    backgroundColor: theme.palette.secondary.light,
                                    p: 2,
                                    borderRadius: "5px",
                                }}
                            >
                                <Upload sx={{ width: "40px" }} />
                            </IconButton>
                            <IconButton sx={{ width: "40px", height: "30px", backgroundColor: theme.palette.secondary.light, p: 2, borderRadius: "5px" }}>
                                <Delete sx={{ width: "40px" }} />
                            </IconButton>
                        </Box>
                    </Box>
                </>
            ))}
        </div>
    );
};



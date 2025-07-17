import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Add, ArrowBack } from "@mui/icons-material";
import CadastroModulo from "../../components/CadastroModulo";

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
                    <Box key={index} sx={{ mt: 4, p:2, borderRadius:"12px" }} border={1} >
                        <Typography>{modulo.titulo}</Typography>
                        <Typography>{modulo.subtitulo}</Typography>
                    </Box>
                ))}
        </div>
    );
};



import { Add, ArrowBack } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CadastrarCategoria from "../../components/CadastrarCategorias";

const Categoria = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState(false)
    return (
        <>
            <Box sx={{mb:2,display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <Box>
                    <Typography variant="h5" sx={{fontWeight:"700"}} >Categorias</Typography>
                    <Typography variant="body1" color="text.secondary">Gerencie as categorias</Typography>
                </Box>
                <Button onClick={() => setForm(true)} startIcon={<Add/>} variant="contained" sx={{fontWeight:"600"}}>Adicionar categoria</Button>
            </Box>
            {form && <CadastrarCategoria setForm={setForm}/>}
        </>
    )
}
export default Categoria;
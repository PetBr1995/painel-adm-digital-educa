import { Button, Container, TextField, Typography, Box } from "@mui/material"
import theme from "../theme/theme"
import { useNavigate } from "react-router-dom"

const CadastroModulo = ({setForm}) => {
    const navigate = useNavigate();
    

    return (
        <>
            <Container sx={{backgroundColor:theme.palette.secondary.dark, py:4, px:2, borderRadius:"12px", mt:2}}>
                <Typography variant="h5" sx={{fontWeight:"700"}}>Novo Módulo</Typography>
                <TextField label="Título do Módulo..." fullWidth margin="normal" required/>
                <TextField label="Descrição" fullWidth multiline rows={4} margin="normal" required />
                <Box sx={{display:"flex", justifyContent:"flex-start", alignItems:"center", gap:"1rem", mt:2}}>
                    <Button variant="outlined" sx={{fontWeight:"700"}} onClick={()=>setForm(false)}>Cancelar</Button>
                    <Button variant="contained" sx={{fontWeight:"700"}}>Criar Módulo</Button>
                </Box>
            </Container>
        </>
    )
}

export default CadastroModulo
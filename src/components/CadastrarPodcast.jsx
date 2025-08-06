import { Typography, Box, Divider, Input, TextField, Button } from "@mui/material"
import theme from "../theme/theme"

const CadastrarPodcast = ({handleClose}) => {
    return (
        <>
            <Box sx={{ bgcolor: theme.palette.secondary.light, p: 2, borderRadius: "12px" }}>
                <Typography sx={{ textAlign: "center" }} variant="h5">Cadastrar Podcast</Typography>
                <Divider sx={{ mt: 1 }} />
                <Box>
                    <TextField fullWidth margin="normal" label="Nome" />
                    <Box sx={{display:"flex", alignItems:"center", justifyContent:"center", gap:"1rem"}}>
                        <Button onClick={handleClose} sx={{borderRadius:"20px", fontWeight:"600"}} variant="outlined">Cancelar</Button>
                        <Button sx={{borderRadius:"20px", fontWeight:"600"}} variant="contained">Cadastrar</Button>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default CadastrarPodcast
import { Box, TextField, Divider, Button, Typography } from "@mui/material";
import theme from "../theme/theme";

const CadastrarHost = ({setOpenModalHost}) => {
    return(
        <>
            <Box sx={{ bgcolor: theme.palette.secondary.light, p: 2, borderRadius: "12px" }}>
                <Typography sx={{ textAlign: "center" }} variant="h5">Cadastrar Host</Typography>
                <Divider sx={{ mt: 1 }} />
                <Box>
                    <TextField type="text" fullWidth margin="normal" label="Nome" />
                    <TextField fullWidth margin="normal" label="Nome" />
                    <TextField fullWidth margin="normal" label="Nome" />
                    <Box sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                        <Button onClick={() => setOpenModalHost(false)} sx={{ boxShadow: "0 0 2px rgba(255,255,255,0.4)", border: "none", borderRadius: "20px", fontWeight: "600" }} variant="outlined">Cancelar</Button>
                        <Button sx={{ borderRadius: "20px", fontWeight: "600" }} variant="contained">Cadastrar</Button>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default CadastrarHost;
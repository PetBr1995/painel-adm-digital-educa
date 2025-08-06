import { Add } from "@mui/icons-material"
import { Box, Button, Divider, Typography, Modal } from "@mui/material"
import theme from "../../theme/theme"
import { useState } from "react"
import CadastrarPodcast from "../../components/CadastrarPodcast"

const Podcast = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography variant="h4" sx={{ mb: 1, fontWeight: "600" }}>Podcast</Typography>
                    <Typography variant="body">Gerencie tudo relacionado aos podcasts</Typography>
                </Box>
                <Box>
                    <Button onClick={handleOpen} sx={{ borderRadius: "20px", fontWeight: "600" }} startIcon={<Add />} variant="contained">
                        Cadastrar Podcast
                    </Button>
                </Box>
                <Modal
                    open={open}
                    BackdropProps={{
                        sx: { backgroundColor: 'transparent' } // Makes the backdrop fully transparent
                    }}
                    sx={{
                        borderRadius: "20px",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "transparent", // Transparent background for the modal content
                        boxShadow: "none", // Optional: remove shadow for cleaner look
                        p: 2
                    }}
                >
                    <CadastrarPodcast handleClose={handleClose}/>
                </Modal>
            </Box>
            <Divider sx={{ mt: 2 }} />
            <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Button sx={{ fontWeight: "600", borderRadius: "20px", border: "none", boxShadow: "0 0 2px rgba(255,255,255,0.4)" }} variant="outlined">Cadastrar Host</Button>
                <Button sx={{ fontWeight: "600", borderRadius: "20px", border: "none", boxShadow: "0 0 2px rgba(255,255,255,0.4)" }} variant="outlined">Cadastrar Participante</Button>
            </Box>
            <Divider sx={{ mt: 3 }} />
        </>
    )
}

export default Podcast
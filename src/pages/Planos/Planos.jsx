import { Box, Typography, Button, Divider, Paper, Dialog, DialogContent } from '@mui/material'
import theme from '../../theme/theme'
import { Add, Delete, Edit } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import CadastraPlano from '../../components/CadastraPlano'
import axios from 'axios'
import EditarPlano from '../../components/EditarPlano'


const Planos = () => {

    const [open, setOpen] = useState(false)
    const handleClickOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }


    const [formPlanos, setFormPlanos] = useState(false)

    const [planos, setPlanos] = useState([]);

    const navigate = useNavigate();
    const listarPlanos = () => {
        axios.get('https://api.digitaleduca.com.vc/planos', {

        }).then(function (response) {
            setPlanos(response.data)
            console.log(response)
        }).catch(function (error) {
            console.log(error)
        })
    }

    useEffect(() => {
        listarPlanos();
    }, [])

    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Box>
                    <Typography variant='h5' sx={{ fontWeight: "600" }}>Planos</Typography>
                    <Typography variant='body2'>Gerencies seus planos aqui</Typography>
                </Box>
                <Button onClick={() => setFormPlanos(true)} variant='contained' sx={{ fontWeight: "600" }} startIcon={<Add />}>
                    Cadastrar Plano
                </Button>
            </Box>
            <Divider />
            {formPlanos && <CadastraPlano setFormPlanos={setFormPlanos} />}

            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
                {planos.map((plano) => (
                    <Paper elevation={2} sx={{ borderRadius: "12px", mb: 2, mt: 4, width: "350px" }}>
                        <Box sx={{ textAlign: "center", mt:1.5, mb:1.5 }}>
                            <Typography variant='h5' sx={{ fontWeight: "600" }}>{plano.nome}</Typography>
                        </Box>
                        <Box sx={{ textAlign: "center",p:1, color: theme.palette.primary.light, backgroundColor:"#000000" }}>
                            <Typography variant='h3' sx={{ fontWeight: "900", mt: 2, mb: 2 }}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plano.preco)}</Typography>
                        </Box>
                        <Typography variant='body2' sx={{ mt: 2,mb:4, textAlign:"center" }}>{plano.descricao}</Typography>
                        <Box sx={{ mt: 2, mb: 2, display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
                            <Button onClick={() => setOpen(true)} variant='outlined' startIcon={<Edit />}>Editar</Button>
                            <Button variant='contained' endIcon={<Delete />}>Excluir</Button>
                        </Box>
                    </Paper>
                ))}
            </Box >
            <Dialog
                open={open}
                onClose={handleClose}


            >
                <DialogContent sx={{ backgroundColor: theme.palette.secondary.dark }}>
                    <EditarPlano setOpen={setOpen} />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Planos
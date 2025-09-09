import { Box, Typography, Button, Divider, Paper, Dialog, DialogContent } from '@mui/material';
import theme from '../../theme/theme';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CadastraPlano from '../../components/CadastraPlano';
import axios from 'axios';
import EditarPlano from '../../components/EditarPlano';

const Planos = () => {
    const [open, setOpen] = useState(false);
    const [formPlanos, setFormPlanos] = useState(false);
    const [planos, setPlanos] = useState([]);
    const [selectedPlano, setSelectedPlano] = useState(null);

    const navigate = useNavigate();

    const listarPlanos = () => {
        axios
            .get('http://10.10.10.62:3000/planos', {
                headers: {
                    Authorization: `bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                console.log("API planos response:", response.data); // Debug log
                setPlanos(response.data);
            })
            .catch((error) => {
                console.log("Error fetching planos:", error);
            });
    };

    useEffect(() => {
        listarPlanos();
    }, []);

    const handleOpenEditar = (plano) => {
        console.log("Selected plano:", plano); // Debug log
        setSelectedPlano(plano);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedPlano(null);
    };

    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Box>
                    <Typography variant='h5' sx={{ fontWeight: "600" }}>Planos</Typography>
                    <Typography variant='body2'>Gerencie seus planos aqui</Typography>
                </Box>
                <Button onClick={() => setFormPlanos(true)} variant='contained' sx={{ fontWeight: "600", borderRadius: "20px" }} startIcon={<Add />}>
                    Cadastrar Plano
                </Button>
            </Box>
            <Divider />

            {formPlanos && <CadastraPlano setFormPlanos={setFormPlanos} />}

            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
                {planos.map((plano) => (
                    <Paper key={plano._id} elevation={2} sx={{ borderRadius: "12px", mb: 2, mt: 4, width: "350px" }}>
                        <Box sx={{ textAlign: "center", mt: 1.5, mb: 1.5 }}>
                            <Typography variant='h5' sx={{ fontWeight: "600" }}>{plano.nome}</Typography>
                        </Box>
                        <Box sx={{ textAlign: "center", p: 1, color: theme.palette.primary.light, backgroundColor: "#000000" }}>
                            <Typography variant='h3' sx={{ fontWeight: "900", mt: 2, mb: 2 }}>
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plano.preco)}
                            </Typography>
                        </Box>
                        <Typography variant='body2' sx={{ mt: 2, mb: 4, textAlign: "center" }}>{plano.descricao}</Typography>
                        <Box sx={{ mt: 2, mb: 2, display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
                            <Button onClick={() => handleOpenEditar(plano)} variant='outlined' sx={{
                                boxShadow
                                    : "0 0 2px rgba(255,255,255,0.4)", border: "none", fontWeight: "600", borderRadius: "20px"
                            }} startIcon={<Edit />}>Editar</Button>
                            {/* 
                            <Button variant='contained' sx={{ fontWeight:"600",borderRadius: "20px" }} endIcon={<Delete />}>Excluir</Button>
                                */}
                        </Box>
                    </Paper>
                ))}
            </Box >

            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    {selectedPlano && (
                        <EditarPlano
                            plano={selectedPlano}
                            setOpen={setOpen}
                            onUpdate={listarPlanos}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Planos;
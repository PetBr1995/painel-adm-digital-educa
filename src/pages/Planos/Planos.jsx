import {
    Box,
    Typography,
    Button,
    Divider,
    Paper,
    Dialog,
    DialogContent,
    Card,
    CardContent,
    Avatar,
    Chip,
    alpha
} from '@mui/material';
import theme from '../../theme/theme';
import {
    Add,
    Delete,
    Edit,
    AttachMoneyOutlined,
    FeaturedPlayListOutlined
} from '@mui/icons-material';
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
                console.log("API planos response:", response.data);
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
        console.log("Selected plano:", plano);
        setSelectedPlano(plano);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedPlano(null);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: alpha(theme.palette.primary.main, 0.02), py: 4 }}>
            <Box sx={{ maxWidth: '1400px', mx: 'auto', px: 3 }}>
                {/* Header */}
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 4,
                    flexWrap: "wrap",
                    gap: 2,
                    p: 4,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.main, 0.03)})`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}>
                    <Box>
                        <Typography variant='h4' fontWeight={700} sx={{
                            color:"#ffffff",
                            mb: 1
                        }}>
                            Planos de Assinatura
                        </Typography>
                        <Typography variant='body1' color='text.secondary' sx={{ mb: 2, fontSize: '1.1rem' }}>
                            Gerencie os planos disponíveis para seus clientes
                        </Typography>
                        <Chip
                            label={`${planos.length} planos cadastrados`}
                            size="small"
                            sx={{
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                fontWeight: 600,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                        />
                    </Box>

                    <Button
                        onClick={() => setFormPlanos(true)}
                        variant='contained'
                        size="large"
                        sx={{
                            borderRadius: 3,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                            fontWeight: 700,
                            px: 4,
                            py: 1.5,
                            textTransform: 'none',
                            boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
                            transition: 'all 0.3s ease',
                            "&:hover": {
                                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                                transform: 'translateY(-2px)'
                            }
                        }}
                        startIcon={<Add/>}
                    >
                        Novo Plano
                    </Button>
                </Box>

                {formPlanos && <CadastraPlano setFormPlanos={setFormPlanos} />}

                {/* Lista de Cards */}
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: 4
                }}>
                    {planos.length === 0 ? (
                        <Box sx={{
                            gridColumn: '1 / -1',
                            textAlign: 'center',
                            py: 8,
                            px: 4,
                            borderRadius: 3,
                            border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
                            backgroundColor: alpha(theme.palette.primary.main, 0.02)
                        }}>
                            <FeaturedPlayListOutlined sx={{
                                fontSize: 64,
                                mb: 2,
                                color: alpha(theme.palette.primary.main, 0.4)
                            }} />
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                                Nenhum plano cadastrado
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Comece criando seu primeiro plano de assinatura
                            </Typography>
                        </Box>
                    ) : (
                        planos.map((plano, index) => (
                            <Card
                                key={plano._id}
                                sx={{
                                    borderRadius: 4,
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                                    background:theme.palette.secondary.dark,
                                    backdropFilter: 'blur(10px)',
                                    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                                    cursor: "pointer",
                                    position: 'relative',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    "&::before": {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '4px',
                                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                        transform: 'translateY(-4px)',
                                        transition: 'transform 0.3s ease'
                                    },
                                    "&:hover": {
                                        transform: "translateY(-6px) scale(1.02)",
                                        boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
                                        borderColor: alpha(theme.palette.primary.main, 0.3),
                                        "&::before": {
                                            transform: 'translateY(0)'
                                        },
                                        "& .plan-avatar": {
                                            transform: "scale(1.1)"
                                        }
                                    }
                                }}
                            >
                                {/* Header do Plano */}
                                <Box sx={{
                                    position: 'relative',
                                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.main, 0.1)})`,
                                    p: 3,
                                    textAlign: 'center'
                                }}>
                                    <Typography
                                        variant='h5'
                                        sx={{
                                            fontWeight: 700,
                                            color: theme.palette.text.primary,
                                            mb: 2
                                        }}
                                    >
                                        {plano.nome}
                                    </Typography>

                                    <Avatar
                                        className="plan-avatar"
                                        sx={{
                                            position: 'absolute',
                                            bottom: -20,
                                            right: 16,
                                            width: 42,
                                            height: 42,
                                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                            color: theme.palette.primary.contrastText,
                                            fontWeight: 700,
                                            fontSize: '1.1rem',
                                            border: '3px solid white',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                            transition: 'transform 0.3s ease'
                                        }}
                                    >
                                        <AttachMoneyOutlined />
                                    </Avatar>
                                </Box>

                                {/* Preço */}
                                <Box sx={{
                                    textAlign: 'center',
                                    py: 3,
                                    backgroundColor: theme.palette.primary.light,
                                    color: theme.palette.primary.contrastText
                                }}>
                                    <Typography variant='h3' sx={{
                                        fontWeight: 900,
                                        lineHeight: 1
                                    }}>
                                        {new Intl.NumberFormat('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        }).format(plano.preco)}
                                    </Typography>
                                    <Typography variant='body2' sx={{
                                        opacity: 0.8,
                                        mt: 0.5,
                                        fontWeight: 500
                                    }}>
                                        por mês
                                    </Typography>
                                </Box>

                                {/* Conteúdo */}
                                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Typography
                                        variant='body1'
                                        color="text.secondary"
                                        sx={{
                                            fontWeight: 500,
                                            lineHeight: 1.6,
                                            textAlign: 'center',
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 3
                                        }}
                                    >
                                        {plano.descricao}
                                    </Typography>
                                </CardContent>

                                <Divider sx={{ borderColor: alpha(theme.palette.primary.main, 0.1) }} />

                                <CardContent>
                                    <Button
                                        onClick={() => handleOpenEditar(plano)}
                                        variant="contained"
                                        fullWidth
                                        sx={{
                                            borderRadius: 3,
                                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                            fontWeight: 700,
                                            textTransform: 'none',
                                            py: 1.2,
                                            boxShadow: `0 3px 10px ${alpha(theme.palette.primary.main, 0.3)}`,
                                            transition: 'all 0.3s ease',
                                            "&:hover": {
                                                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                                                boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
                                                transform: 'translateY(-1px)'
                                            }
                                        }}
                                        startIcon={<Edit />}
                                    >
                                        Editar Plano
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </Box>

                {/* Dialog para edição */}
                <Dialog
                    open={open}
                    onClose={handleClose}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                        }
                    }}
                >
                    <DialogContent sx={{ p: 0 }}>
                        {selectedPlano && (
                            <EditarPlano
                                plano={selectedPlano}
                                setOpen={setOpen}
                                onUpdate={listarPlanos}
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </Box>
        </Box>
    );
};

export default Planos;
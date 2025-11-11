import { Add, Edit, SearchOutlined, PersonOutlined, SchoolOutlined } from '@mui/icons-material';
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardHeader,
  CardContent,
  Divider,
  Stack,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  alpha
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import theme from '../../theme/theme';

const Instrutor = () => {
  const navigate = useNavigate();
  const [instrutor, setInstrutor] = useState([]);
  const [busca, setBusca] = useState("");

  const getInstructor = () => {
    axios.get('https://api.digitaleduca.com.vc/instrutor', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then((response) => setInstrutor(response.data))
      
      .catch((error) => console.error('Erro ao buscar instrutores:', error));
  };

  useEffect(() => {
    getInstructor();
  }, []);

  const instrutoresFiltrados = instrutor.filter((instructor) =>
    instructor.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    instructor.formacao?.toLowerCase().includes(busca.toLowerCase())
  );

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
          p: 3,
          borderRadius: 3,
          background: alpha(theme.palette.primary.main, 0.05),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
        }}>
          <Box>
            <Typography variant='h4' fontWeight={700} sx={{ color: theme.palette.text.primary, mb: 1 }}>
              Instrutores
            </Typography>
            <Typography variant='body1' color='text.secondary' sx={{ mb: 2 }}>
              Gerencie seus instrutores cadastrados
            </Typography>
            <Chip
              label={`${instrutor.length} instrutores`}
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.3),
                color: theme.palette.primary.light,
                fontWeight: 600
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              variant='outlined'
              placeholder="Buscar instrutor..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined sx={{ color: '#666' }} />
                  </InputAdornment>
                )
              }}
              sx={{
                width: 300,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: 'transparent',
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.primary.main },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.primary.main }
                }
              }}
            />

            <Button
              startIcon={<Add />}
              onClick={() => navigate('/cadastrarinstrutor')}
              variant='contained'
              sx={{
                borderRadius: 2,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                
                fontWeight: 600,
                px: 3,
                py: 1.2,
                textTransform: 'none',
                boxShadow: 'none',
                "&:hover": {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }
              }}
            >
              Novo Instrutor
            </Button>
          </Box>
        </Box>

        {/* Lista de Cards */}
        <Box sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 3
        }}>
          {instrutoresFiltrados.length === 0 ? (
            <Box sx={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              py: 6,
              color: 'text.secondary'
            }}>
              <PersonOutlined sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6">
                {busca ? 'Nenhum instrutor encontrado' : 'Nenhum instrutor cadastrado'}
              </Typography>
            </Box>
          ) : (
            instrutoresFiltrados.map((instructor) => (
              <Card
                key={instructor.id}
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: theme.shadows[8],
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                  }
                }}
              >
                {/* Imagem */}
                <Box sx={{ position: 'relative', background: alpha(theme.palette.primary.main, 0.05) }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image="/logo192.png"
                    alt={instructor.nome}
                    sx={{ objectFit: 'contain', p: 2 }}
                  />
                  <Avatar
                    sx={{
                      position: 'absolute',
                      bottom: -20,
                      right: 16,
                      width: 40,
                      height: 40,
                      backgroundColor: theme.palette.primary.main,
                      color: '#fff',
                      fontWeight: 700,
                      border: '2px solid white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                  >
                    {instructor.nome?.charAt(0).toUpperCase()}
                  </Avatar>
                </Box>

                {/* Conteúdo */}
                <CardHeader
                  title={instructor.nome}
                  titleTypographyProps={{ variant: 'h6', fontWeight: 600, noWrap: true }}
                  sx={{ pb: 1 }}
                />

                <CardContent sx={{ pt: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <SchoolOutlined sx={{ color: theme.palette.primary.main, fontSize: 18 }} />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {instructor.formacao}
                    </Typography>
                  </Box>
                </CardContent>

                <Divider />

                <CardContent>
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: 'none',
                      "&:hover": {
                        background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                      }
                    }}
                    onClick={() =>
                      navigate(`/editarinstrutor/${instructor.id}`, { state: { instrutor: instructor } })
                    }
                  >
                    Editar
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Instrutor;

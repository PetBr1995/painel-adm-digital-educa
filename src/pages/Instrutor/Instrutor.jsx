import { Add, Edit, SearchOutlined } from '@mui/icons-material';
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
  InputAdornment
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Instrutor = () => {
  const navigate = useNavigate();
  const [instrutor, setInstrutor] = useState([]);
  const [busca, setBusca] = useState(""); // Mudado para string

  const getInstructor = () => {
    axios.get('https://api.digitaleduca.com.vc/instrutor', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then((response) => {
      setInstrutor(response.data);
    }).catch((error) => {
      console.error('Erro ao buscar instrutores:', error);
    });
  };

  useEffect(() => {
    getInstructor();
  }, []);

  // Filtra os instrutores com base no nome ou formação
  const instrutoresFiltrados = instrutor.filter((instructor) =>
    instructor.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    instructor.formacao?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 4,
        flexWrap: "wrap",
        gap: 2
      }}>
        <Box>
          <Typography variant='h5' fontWeight={600}>Instrutores</Typography>
          <Typography variant='body1' color='text.secondary'>Gerencie seus instrutores</Typography>
        </Box>

        {/* Barra de Pesquisa */}
        <TextField
          variant='outlined'
          placeholder="Pesquisar instrutor..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchOutlined />
              </InputAdornment>
            )
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "50px", // Bordas arredondadas
            },width:"50%"
            
          }}

        />

        <Button
          endIcon={<Add />}
          onClick={() => navigate('/cadastrarinstrutor')}
          variant='contained'
          sx={{
            borderRadius: '20px',
            backgroundColor: '#FDBB30',
            color: '#000',
            fontWeight: 600,
            "&:hover": { backgroundColor: '#f4a000' }
          }}
        >
          Novo Instrutor
        </Button>
      </Box>

      {/* Lista de Cartões */}
      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 3
        }}
      >
        {instrutoresFiltrados.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            Nenhum instrutor encontrado.
          </Typography>
        ) : (
          instrutoresFiltrados.map((instructor) => (
            <Card
              key={instructor.id}
              sx={{
                width: 320,
                borderRadius: 3,
                boxShadow: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: "all 0.3s ease",
                border: "1px solid rgba(253,187,48,0)",
                "&:hover": { transform: "translateX(2px)" },
                cursor: "pointer"
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image="/logo192.png"
                alt="Instrutor"
                sx={{
                  objectFit: 'contain',
                  backgroundColor: "#1a1a1a",
                  p: 2,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12
                }}
              />
              <CardHeader
                title={instructor.nome}
                titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {instructor.formacao}
                </Typography>
              </CardContent>
              <Divider />
              <CardContent>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    sx={{ borderRadius: '20px', fontWeight: "600" }}
                    onClick={() =>
                      navigate(`/editarinstrutor/${instructor.id}`, { state: { instrutor: instructor } })
                    }
                  >
                    Editar
                  </Button>
                  {/* Botão de excluir comentado */}
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
};

export default Instrutor;

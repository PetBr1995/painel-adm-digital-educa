import { Box, Grid, Paper, Typography } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CategoryIcon from "@mui/icons-material/Category";
import FlightIcon from "@mui/icons-material/Flight";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import theme from '../../theme/theme'

const Dashboard = () => {
  const [cursos, setCursos] = useState([]);
  const [instrutores, setInstrutores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [planos, setPlanos] = useState([]);

  // Listar cursos
  const getCursos = () => {
    axios
      .get("https://api.digitaleduca.com.vc/curso/cursos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
      .then((response) => {
        setCursos(response.data);
      })
      .catch((error) => {
        console.log("Erro ao buscar cursos:", error);
      });
  };

  // Listar instrutores
  const getInstrutores = () => {
    axios.get("https://api.digitaleduca.com.vc/instrutor", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((response) => {
      setInstrutores(response.data);
      console.log(response)
    }).catch((error) => {
      console.log("Erro ao buscar instrutores:", error);
      console.log(error)
    });
  };

  const [usuarios, setUsuarios] = useState([]);
  const linstarUsuarios = () => {
    axios.get('https://api.digitaleduca.com.vc/usuario/admin/usuarios', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }).then(function (response) {
      console.log(response)
      setUsuarios(response.data)
    }).catch(function (error) {
      console.log(error)
    })
  }

  const getCategorias = () => {
    axios.get('https://api.digitaleduca.com.vc/categoria/list', {

    }).then(function (response) {
      setCategorias(response.data)
      console.log(response)
    }).catch(function (error) {
      console.log(error)
    })
  }

  const getPlanos = () => {
    axios.get('https://api.digitaleduca.com.vc/planos', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(function (response) {
      setPlanos(response.data)
      console.log(response)
    }).catch(function (error) {
      console.log(error)
    })
  }


  useEffect(() => {
    getCursos();
    getInstrutores();
    getCategorias();
    getPlanos();
    linstarUsuarios();
  }, []);

  const summaryData = [
    {
      label: "Conteúdos",
      value: cursos.length,
      icon: <SchoolIcon fontSize="large" />,
      color:theme.palette.secondary.light,
      link: "/cursos",
    },
    {
      label: "Instrutores",
      value: instrutores.length,
      icon: <PersonAddIcon fontSize="large" />,
      color:theme.palette.secondary.light,
      link: "/instrutores",
    },
    {
      label: "Alunos",
      value: usuarios.length,
      icon: <PersonAddIcon fontSize="large" />,
      color:theme.palette.secondary.light,
      link: "/usuarios",
    },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {summaryData.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Link to={item.link} style={{ textDecoration: "none"}}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  backgroundColor: item.color,
                  color: "#fff",
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.03)",
                    cursor: "pointer",
                  },
                }}
              >
                {item.icon}
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {item.value}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "600" }}>{item.label}</Typography>
                </Box>
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>


    </Box>
  );
};

export default Dashboard;

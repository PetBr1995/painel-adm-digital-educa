import { Box, Grid, Paper, Typography, useScrollTrigger } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CategoryIcon from "@mui/icons-material/Category";
import FlightIcon from "@mui/icons-material/Flight";
import { data, Link } from "react-router-dom"; // <-- importação do Link
import axios from "axios";
import { useEffect, useState } from "react";



const Dashboard = () => {

  //Listar Cursos
  const [cursos, setCursos] = useState([]);
  const getCursos = () => {
    axios.get('https://api.digitaleduca.com.vc/curso/cursos', {
      headers: {
        Authorization: ` Bearer ${localStorage.getItem("token")}`
      }
    }, {

    }).then(function (response) {
      setCursos(response.data)
      console.log(response)
    }).catch(function (error) {
      console.log(error)
    })
  }

  useEffect(() => {
    getCursos();
  }, [])

//Final do Listar Cursos
// Listar Instrutores
const getInstrutores = () => {
  axios.get('',{

  },{

  }).then(function(response){
    console.log(response)
  })
}
// Final do listar Instrutores
  const summaryData = [
    { label: "Cursos", value: cursos.length, icon: <SchoolIcon fontSize="large" />, color: "#1976d2", link: "/cursos" },
    { label: "Instrutores", value: 12, icon: <PersonAddIcon fontSize="large" />, color: "#388e3c", link: "/instrutores" },
    { label: "Categorias", value: 12, icon: <CategoryIcon fontSize="large" />, color: "#f57c00", link: "/categorias" },
    { label: "Planos", value: 3, icon: <FlightIcon fontSize="large" />, color: "#7b1fa2", link: "/planos" },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {summaryData.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Link to={item.link} style={{ textDecoration: "none" }}>
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
                  <Typography variant="h6" fontWeight="bold">
                    {item.value}
                  </Typography>
                  <Typography variant="body2">{item.label}</Typography>
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

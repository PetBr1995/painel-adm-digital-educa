import { useLocation, Link } from "react-router-dom";
import { Box, Grid, Paper, Typography, List, ListItem, ListItemText } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CategoryIcon from "@mui/icons-material/Category";
import FlightIcon from "@mui/icons-material/Flight";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const { results } = location.state || { results: { cursos: [], instrutores: [], categorias: [], planos: [] } };

  const resultSections = [
    {
      label: "Cursos",
      data: results.cursos,
      icon: <SchoolIcon fontSize="large" />,
      color: "#1976d2",
      link: (item) => `/editarcurso/${item.id}`,
    },
    {
      label: "Instrutores",
      data: results.instrutores,
      icon: <PersonAddIcon fontSize="large" />,
      color: "#388e3c",
      link: (item) => `/editarinstrutor/${item.id}`,
    },
    {
      label: "Categorias",
      data: results.categorias,
      icon: <CategoryIcon fontSize="large" />,
      color: "#f57c00",
      link: () => "/categorias",
    },
    {
      label: "Planos",
      data: results.planos,
      icon: <FlightIcon fontSize="large" />,
      color: "#7b1fa2",
      link: () => "/planos",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Resultados da busca para: "{query || "Nenhum termo"}"
      </Typography>
      {resultSections.map((section) => (
        <Box key={section.label} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {section.label}
          </Typography>
          {section.data.length > 0 ? (
            <Grid container spacing={3}>
              {section.data.map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item.id || item.name}>
                  <Link to={section.link(item)} style={{ textDecoration: "none" }}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        backgroundColor: section.color,
                        color: "#fff",
                        transition: "transform 0.2s ease",
                        "&:hover": {
                          transform: "scale(1.03)",
                          cursor: "pointer",
                        },
                      }}
                    >
                      {section.icon}
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {item.nome || item.name || item.titulo || "Sem nome"}
                        </Typography>
                        <Typography variant="body2">{section.label}</Typography>
                      </Box>
                    </Paper>
                  </Link>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>Nenhum resultado encontrado para {section.label.toLowerCase()}.</Typography>
          )}
        </Box>
      ))}
      {resultSections.every((section) => section.data.length === 0) && (
        <Typography>Nenhum resultado encontrado para a busca.</Typography>
      )}
    </Box>
  );
};

export default SearchResults;
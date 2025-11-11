import { Box, Container, Typography } from "@mui/material"
import DashUsuarios from "./dashboardComponents/DashUsuarios"
import DashAulas from "./dashboardComponents/DashAulas"

const PublicDashboard = () => {
  return (
    <Container>
      <Box sx={{ p: 3 }}>
        {/* Seção de usuários */}
        <DashUsuarios />
        {/* Seção das aulas */}
        <DashAulas />
      </Box>
    </Container>
  )
}

export default PublicDashboard

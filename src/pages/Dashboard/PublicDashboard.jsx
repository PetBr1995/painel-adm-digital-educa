import { Box, Typography } from "@mui/material"
import DashUsuarios from "./dashboardComponents/DashUsuarios"

const PublicDashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, width: "100%", textAlign: "center", mb: 4 }}
      >
        Dashboard
      </Typography>

      {/* Seção de usuários */}
      <DashUsuarios />
    </Box>
  )
}

export default PublicDashboard

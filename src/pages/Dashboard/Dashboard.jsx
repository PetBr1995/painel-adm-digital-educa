import { Box, Stack, Typography } from '@mui/material'
import React from 'react'

const Dashboard = () => {
    return (
        <Box>
            <Typography variant='h5' fontWeight={"bold"}>Dashboard</Typography>
            <Box>
                <Stack direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={4}>
                    <Box border={1} p={4} borderRadius={5} borderColor={"rgba(0,0,0,0.1)"}>
                        <Typography variant='h5' fontWeight={'bold'}>Cursos</Typography>
                    </Box>
                </Stack>
            </Box>
        </Box>
    )
}

export default Dashboard
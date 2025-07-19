import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import Button from '@mui/material/Button'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import theme from '../../theme/theme'
import { ArrowForward } from '@mui/icons-material'

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()
    const handleLogar = (e) => {
        e.preventDefault();
        axios.post('https://api.digitaleduca.com.vc/auth/login', {
            email: email,
            senha: password
        }).then(function (response) {
            localStorage.setItem('token', response.data.access_token
            )
            console.log(response)
            navigate('/cadastrarcurso')
        }).catch(function (error) {
            console.log(error)
        })


    }

    return (
        <Box component={'form'} onSubmit={handleLogar} sx={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>

            <Box sx={{ backgroundColor: theme.palette.secondary.dark, width: 500, height: 500, borderRadius: "15px", display: "flex", flexDirection: "column", justifyContent: "center", boxShadow: "0 0 2px rgba(255,255,255,0.2)" }}>
                <Typography variant='h4' sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    Login
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", margin: '1rem' }}>
                    <TextField
                        label="Email"
                        sx={{ width: "100%" }}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", margin: '1rem' }}>
                    <TextField
                        type='password'
                        label="Senha"
                        sx={{ width: "100%" }}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Button type='submit' variant='contained' endIcon={<ArrowForward />} sx={{ fontWeight: "600", width: "50%", marginTop: "2rem" }}>
                        Entrar
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default Login
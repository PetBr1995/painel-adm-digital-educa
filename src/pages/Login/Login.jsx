import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { use, useState } from 'react'
import Button from '@mui/material/Button'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import theme from '../../theme/theme'
import { ArrowForward, Visibility, VisibilityOff } from '@mui/icons-material'
import { CardMedia, IconButton, InputAdornment } from '@mui/material'
import Swal from 'sweetalert2'
const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false)
    const handleClickShowPassword = () => setShowPassword((show) => !show);

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
            navigate('/dashboard')
        }).catch(function (error) {
            console.log(error)

            Swal.fire({
                icon: "error",
                title: "Credenciais inválidas",
                text: "Email ou senha inválidos",
                footer:"Tente novamente..."
            });

        })

    }

    return (
        <Box component={'form'} onSubmit={handleLogar} sx={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>

            <Box sx={{ p: 2, width: 500, height: 500, borderRadius: "30px", display: "flex", flexDirection: "column", justifyContent: "center", boxShadow: `inset 0 0 6px rgba(0,0,0,0.3) ` }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                    <CardMedia component="img" image='https://i.imgur.com/fumQcmz.png' sx={{ maxWidth: "150px", mb: "2rem" }} />
                </Box>
                <Typography variant='h5' sx={{ fontWeight: "600", textAlign: "start", pl: 2, mb: 4, color: theme.palette.primary.light }}>Acesse sua conta</Typography>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", margin: '1rem' }}>
                    <TextField
                        label="Email"
                        fullWidth
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{
                            borderRadius: "15px", " & .MuiOutlinedInput-root": {
                                borderRadius: "18px"
                            }
                        }}
                    />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", margin: '1rem' }}>
                    <TextField
                        type={showPassword ? 'text' : 'password'}
                        label="Senha"
                        fullWidth
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '18px', // aqui você define o raio da borda
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}

                    />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Button type='submit' variant='contained' sx={{ boxShadow: `inset 0 0 5px rgba(0,0,0,0.5)`, color: theme.palette.secondary.dark, fontWeight: "600", width: "50%", height: "55px", marginTop: "2rem", fontSize: "1.2rem", borderRadius: "18px" }}>
                        Entrar
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default Login
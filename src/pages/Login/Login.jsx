import React, { useState } from "react";
import {
    Box,
    TextField,
    Typography,
    Button,
    IconButton,
    InputAdornment,
    CircularProgress,
    Fade,
    Divider,
    Link,
    alpha
} from "@mui/material";

import styles from '../Login/Login.module.css'

import {
    ArrowForwardIos,
    Visibility,
    VisibilityOff,
    Email,
    Lock,
    Login as LoginIcon,
    PersonAdd as PersonAddIcon
} from "@mui/icons-material";
import axios from "axios";
import theme from "../../theme/theme";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./swal-custom.css";

import Lottie from 'lottie-react'
import animationData from '../../assets/Wave Loop.json'

const Login = () => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) => password.length >= 6;

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setErrors((prev) => ({
            ...prev,
            email: value && !validateEmail(value) ? "Email inválido" : null,
        }));
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setSenha(value);
        setErrors((prev) => ({
            ...prev,
            senha:
                value && !validatePassword(value)
                    ? "Senha deve ter pelo menos 6 caracteres"
                    : null,
        }));
    };

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email) || !validatePassword(senha)) return;

        setLoading(true);
        try {
            const response = await axios.post("http://10.10.11.180:3000/auth/login", {
                email,
                senha,
            });

            localStorage.setItem("token", response.data.access_token);

            await Swal.fire({
                icon: "success",
                title: "Login realizado com sucesso!",
                timer: 1500,
                showConfirmButton: false,
                customClass: {
                    popup: "swal-theme-popup",
                    title: "swal-theme-title",
                },
            });

            navigate("/dashboard", { replace: true });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Credenciais inválidas",
                text: "Verifique seu email e senha e tente novamente",
                customClass: {
                    popup: "swal-theme-popup",
                    title: "swal-theme-title",
                    confirmButton: "swal-theme-button",
                },
                showClass: { popup: "animate__animated animate__fadeInDown" },
                hideClass: { popup: "animate__animated animate__fadeOutUp" },
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Lottie de fundo */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    zIndex: 0,
                }}
            >
                <Lottie
                    animationData={animationData}
                    loop={true}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    rendererSettings={{
                        preserveAspectRatio: "xMidYmid slice",
                    }}
                    className={styles.backgroundAnimation}
                />
            </Box>

            <Fade in timeout={800}>
                <Box
                    component="form"
                    onSubmit={handleLogin}
                    sx={{
                        p: 5,
                        borderRadius: 3,
                        width: "100%",
                        maxWidth: 400,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        background: "rgba(18, 24, 41, 0.8)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 184, 0, 0.1)",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                        position: "relative",
                        zIndex: 1, // garante que o formulário fique acima da animação
                        overflow: "hidden",
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "2px",
                            background: "linear-gradient(90deg, transparent, #FFB800, transparent)",
                            animation: "shimmer 2s infinite",
                        },
                        "@keyframes shimmer": {
                            "0%": { transform: "translateX(-100%)" },
                            "100%": { transform: "translateX(100%)" },
                        },
                    }}
                >
                    <Box sx={{ textAlign: "center" }}>
                        <Box
                            component="img"
                            src="https://i.imgur.com/fumQcmz.png"
                            alt="Digital Educa Logo"
                            sx={{
                                height: 60,
                                mb: 2,
                                transition: "transform 0.3s ease",
                                "&:hover": { transform: "scale(1.05)" },
                            }}
                        />
                        <Typography
                            color="text.secondary"
                            variant="body1"
                            sx={{ opacity: 0.8, fontSize: "0.95rem", letterSpacing: "0.5px" }}
                        >
                            Acesse sua conta administrativa
                        </Typography>
                    </Box>

                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={handleEmailChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                        disabled={loading}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email
                                        sx={{ color: theme.palette.text.secondary, fontSize: 20 }}
                                    />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        label="Senha"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        value={senha}
                        onChange={handlePasswordChange}
                        error={!!errors.senha}
                        helperText={errors.senha}
                        required
                        disabled={loading}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock
                                        sx={{ color: theme.palette.text.secondary, fontSize: 20 }}
                                    />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        disabled={loading}
                                    >
                                        {showPassword ? (
                                            <VisibilityOff sx={{ color: theme.palette.primary.light }} />
                                        ) : (
                                            <Visibility
                                                sx={{ color: theme.palette.secondary.light }}
                                            />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading || !validateEmail(email) || !validatePassword(senha)}
                        startIcon={
                            loading ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                <LoginIcon />
                            )
                        }
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </Button>
                </Box>
            </Fade>
        </Box>
    );
};

export default Login;

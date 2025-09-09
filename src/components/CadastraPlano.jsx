import { useState, useEffect } from "react";
import {
    Paper,
    TextField,
    Box,
    Button,
    Typography,
    Divider,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    FormHelperText,
    Alert,
    InputAdornment
} from "@mui/material";
import {
    Check,
    Title,
    AttachMoney,
    Description,
    DateRange,
    Numbers
} from "@mui/icons-material";
import axios from "axios";
import { alpha } from "@mui/material/styles";
import theme from "../theme/theme";

const CadastraPlano = ({ setFormPlanos }) => {
    const [nome, setNome] = useState("");
    const [preco, setPreco] = useState("");
    const [desc, setDesc] = useState("");
    const [intervalo, setIntervalo] = useState("");
    const [qtd, setQtd] = useState("");
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const cadastrarPlano = (e) => {
        e.preventDefault();
        setErrors({});
        setSuccess(false);

        axios
            .post(
                "http://10.10.10.62:3000/planos/create",
                {
                    nome,
                    preco: parseFloat(preco) || 0,
                    descricao: desc,
                    intervalo,
                    intervaloCount: parseInt(qtd) || 0,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )
            .then(() => {
                setSuccess(true);
                setTimeout(() => {
                    setFormPlanos(false);
                }, 2000);
            })
            .catch((error) => {
                if (error.response?.data?.message) {
                    const errorMessages = error.response.data.message.reduce((acc, msg) => {
                        if (msg.includes("intervalo")) {
                            acc.intervalo = "Intervalo deve ser: mês ou ano";
                        }
                        if (msg.includes("intervaloCount")) {
                            acc.qtd = "Quantidade deve ser pelo menos 1";
                        }
                        return acc;
                    }, {});
                    setErrors(errorMessages);
                }
            });
    };

    useEffect(() => {
        if (!setFormPlanos) {
            setSuccess(false);
        }
    }, [setFormPlanos]);

    return (
        <>
            <Paper
                sx={{
                    p: 4,
                    maxWidth: 600,
                    mx: "auto",
                    mt: 6,
                    borderRadius: 4,
                    background: `linear-gradient(135deg, ${alpha(
                        theme.palette.primary.main,
                        0.08
                    )}, ${alpha(theme.palette.primary.main, 0.02)})`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    mb:4
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        textAlign: "center",
                        fontWeight: 700,
                        mb: 3,
                        color: theme.palette.text.primary,
                    }}
                >
                    Cadastrar Plano
                </Typography>

                {success && (
                    <Alert
                        icon={<Check />}
                        severity="success"
                        sx={{
                            mb: 3,
                            borderRadius: "12px",
                            fontWeight: "600",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                    >
                        Plano cadastrado com sucesso!
                    </Alert>
                )}

                <TextField
                    type="text"
                    label="Nome"
                    fullWidth
                    margin="normal"
                    name="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    error={!!errors.nome}
                    helperText={errors.nome}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Title color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    type="number"
                    label="Preço"
                    fullWidth
                    margin="normal"
                    name="preco"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    error={!!errors.preco}
                    helperText={errors.preco}
                    inputProps={{ min: 0, step: "0.01" }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AttachMoney color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    type="text"
                    label="Descrição"
                    multiline
                    rows={4}
                    fullWidth
                    margin="normal"
                    name="desc"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    error={!!errors.desc}
                    helperText={errors.desc}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Description color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />

                <FormControl fullWidth margin="normal" error={!!errors.intervalo}>
                    <InputLabel>Intervalo</InputLabel>
                    <Select
                        label="Intervalo"
                        name="intervalo"
                        value={intervalo}
                        onChange={(e) => setIntervalo(e.target.value)}
                        sx={{ borderRadius: "12px" }}
                        startAdornment={
                            <InputAdornment position="start">
                                <DateRange color="primary" />
                            </InputAdornment>
                        }
                    >
                        <MenuItem value="month">Mês</MenuItem>
                        <MenuItem value="year">Ano</MenuItem>
                    </Select>
                    {errors.intervalo && (
                        <FormHelperText>{errors.intervalo}</FormHelperText>
                    )}
                </FormControl>

                <TextField
                    type="number"
                    label="Quantidade"
                    fullWidth
                    margin="normal"
                    name="qtd"
                    value={qtd}
                    onChange={(e) => setQtd(e.target.value)}
                    error={!!errors.qtd}
                    helperText={errors.qtd}
                    inputProps={{ min: 1 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Numbers color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />

                <Box
                    sx={{
                        mt: 4,
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                    }}
                >
                    <Button
                        onClick={() => setFormPlanos(false)}
                        variant="outlined"
                        sx={{
                            borderRadius: 3,
                            fontWeight: 600,
                            textTransform: "none",
                            px: 3,
                            boxShadow: "0 0 4px rgba(0,0,0,0.15)",
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            borderRadius: 3,
                            fontWeight: 700,
                            textTransform: "none",
                            px: 4,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                            transition: "all 0.3s ease",
                            "&:hover": {
                                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                                transform: "translateY(-2px)",
                            },
                        }}
                        onClick={cadastrarPlano}
                    >
                        Cadastrar
                    </Button>
                </Box>
            </Paper>
            
        </>
    );
};

export default CadastraPlano;

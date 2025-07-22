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
} from "@mui/material";
import axios from "axios";
import theme from "../theme/theme";
import { Check } from "@mui/icons-material";

const EditarPlano = ({ id, setOpen, onUpdate }) => {
    const [nome, setNome] = useState("");
    const [preco, setPreco] = useState("");
    const [desc, setDesc] = useState("");
    const [intervalo, setIntervalo] = useState("");
    const [qtd, setQtd] = useState("");
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch plan data when component mounts
    useEffect(() => {
        axios
            .get(`https://api.digitaleduca.com.vc/planos/${id}`, {
                headers: {
                    Authorization: `bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                const { nome, preco, descricao, intervalo, intervaloCount } = response.data;
                setNome(nome || "");
                setPreco(preco ? preco.toString() : "");
                setDesc(descricao || "");
                setIntervalo(intervalo || "");
                setQtd(intervaloCount ? intervaloCount.toString() : "");
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setErrors({ general: "Erro ao carregar os dados do plano" });
                setLoading(false);
            });
    }, [id]);

    const updatePlan = (e) => {
        e.preventDefault();

        // Reset errors and success
        setErrors({});
        setSuccess(false);

        axios
            .put(
                `https://api.digitaleduca.com.vc/planos/update/${id}`,
                {
                    nome: nome,
                    preco: parseFloat(preco) || 0,
                    descricao: desc,
                    intervalo: intervalo,
                    intervaloCount: parseInt(qtd) || 0,
                },
                {
                    headers: {
                        Authorization: `bearer ${localStorage.getItem("token")}`,
                    },
                }
            )
            .then((response) => {
                console.log(response);
                setSuccess(true); // Set success state to show alert
                onUpdate(); // Trigger plan list refresh
                setTimeout(() => {
                    setOpen(false); // Close form after 2 seconds
                }, 2000);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.message) {
                    const errorMessages = error.response.data.message.reduce((acc, msg) => {
                        if (msg.includes("intervalo")) {
                            acc.intervalo = "Intervalo deve ser: dia, semana, mês ou ano";
                        }
                        if (msg.includes("intervaloCount")) {
                            acc.qtd = "Quantidade deve ser pelo menos 1";
                        }
                        return acc;
                    }, {});
                    setErrors(errorMessages);
                } else {
                    setErrors({ general: "Erro ao atualizar o plano" });
                }
                console.log(error);
            });
    };

    // Clear success message when form is closed
    useEffect(() => {
        if (!setOpen) {
            setSuccess(false);
        }
    }, [setOpen]);

    if (loading) {
        return <Typography>Carregando...</Typography>;
    }

    return (
        <>
            <Paper
                sx={{
                    p: 2,
                    width: "450px",
                    margin: "2rem auto",
                    borderRadius: "12px",
                    boxShadow: "0 0 2px rgba(255,255,255,0.4)",
                }}
            >
                <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "600" }}>
                    Editar Plano
                </Typography>
                {success && (
                    <Alert icon={<Check />} severity="success" sx={{ mb: 2 }}>
                        Plano Atualizado com Sucesso!!
                    </Alert>
                )}
                {errors.general && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errors.general}
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
                    required
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
                    required
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
                    required
                />
                <FormControl fullWidth margin="normal" error={!!errors.intervalo}>
                    <InputLabel>Intervalo</InputLabel>
                    <Select
                        label="Intervalo"
                        name="intervalo"
                        value={intervalo}
                        onChange={(e) => setIntervalo(e.target.value)}
                        required
                    >
                        <MenuItem value="day">Dia</MenuItem>
                        <MenuItem value="week">Semana</MenuItem>
                        <MenuItem value="month">Mês</MenuItem>
                        <MenuItem value="year">Ano</MenuItem>
                    </Select>
                    {errors.intervalo && <FormHelperText>{errors.intervalo}</FormHelperText>}
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
                    required
                />
                <Box sx={{ mt: 2, display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center" }}>
                    <Button
                        onClick={() => setOpen(false)}
                        variant="outlined"
                        sx={{ fontWeight: "600" }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ fontWeight: "600" }}
                        onClick={updatePlan}
                    >
                        Atualizar
                    </Button>
                </Box>
            </Paper>
            <Divider />
        </>
    );
};

export default EditarPlano;
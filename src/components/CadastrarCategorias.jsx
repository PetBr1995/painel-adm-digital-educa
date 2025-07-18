import { Box, Typography, Button, TextField } from "@mui/material"
import axios from "axios"
import { useState } from "react"

const CadastrarCategorias = ({ setForm }) => {
    const [nome, setNome] = useState('')
    const [loading, setLoading] = useState(false)

    const cadastrarCategoria = async () => {
        if (!nome.trim()) {
            console.log("O nome da categoria é obrigatório.")
            return
        }

        setLoading(true)

        try {
            const token = localStorage.getItem("token") // recupera o token salvo no login

            if (!token) {
                console.error("Token de autenticação não encontrado.")
                setLoading(false)
                return
            }

            const response = await axios.post(
                'https://api.digitaleduca.com.vc/categoria/create',
                { nome: nome.trim() },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            console.log("Categoria cadastrada com sucesso:", response.data)
            setNome('')
            setForm(false)
        } catch (error) {
            console.error("Erro ao cadastrar categoria:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Box sx={{ width: "350px", p: 2, borderRadius: "12px", margin: "auto" }} border={1}>
                <Typography variant="h5" sx={{ fontWeight: "600" }}>Informações Categoria</Typography>
                <TextField
                    label="Nome..."
                    fullWidth
                    margin="normal"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    disabled={loading}
                />
                <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: "1rem" }}>
                    <Button onClick={() => setForm(false)} variant="outlined" sx={{ mt: 0 }} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button onClick={cadastrarCategoria} variant="contained" sx={{ mt: 0 }} disabled={loading}>
                        {loading ? "Cadastrando..." : "Cadastrar"}
                    </Button>
                </Box>
            </Box>
        </>
    )
}

export default CadastrarCategorias

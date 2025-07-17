import { Box, Typography, Button, TextField } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"

const CadastrarCategorias = ({ setForm }) => {

    const [nome, setNome] = useState('')

    const cadastrarCategoria = () => {
        axios.post('https://api.digitaleduca.com.vc/categoria/create', {
            nome: nome
        }, {

        }).then(function (response) {
            setNome(response.data)
            console.log(response)
        }).catch(function (error) {
            console.log(error)
        })
    }


    return (
        <>
            <Box sx={{ width: "350px", p: 2, borderRadius: "12px", margin: "auto" }} border={1}>
                <Typography variant="h5" sx={{ fontWeight: "600" }}>Informações Categoria</Typography>
                <TextField label="Nome..." fullWidth margin="normal" onChange={((e) => setNome(e.target.value))} />
                <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: "1rem" }}>
                    <Button onClick={() => setForm(false)} variant="outlined" sx={{ mt: 0 }}>Cancelar</Button>
                    <Button variant="contained">Cadastrar</Button>
                </Box>
            </Box>
        </>
    )
}

export default CadastrarCategorias
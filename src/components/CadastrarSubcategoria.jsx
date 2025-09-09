import { Box, TextField } from "@mui/material";
import axios from 'axios'
const cadastrar = () => {
    axios.post('http://10.10.10.62:3000/subcategorias/create', {

    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    }).then(function (response) {
        console.log(response)
    }).catch(function (error) {
        console.log(error)
    })
}

const CadastrarSubcategoria = () => {
    return (
        <>
            <Box>
                <TextField placeholder="Nome" />
            </Box>
        </>
    )
}

export default CadastrarSubcategoria;
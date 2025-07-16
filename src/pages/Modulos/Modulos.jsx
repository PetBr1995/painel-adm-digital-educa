import { Add, ArrowBack, Delete, Download, Edit, EditAttributesOutlined } from "@mui/icons-material"
import { Button, Typography, Box, Container, Stack, useScrollTrigger } from "@mui/material"
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import theme from "../../theme/theme";
import CadastroModulo from "../../components/CadastroModulo";

const Modulos = () => {

    const navigate = useNavigate();
    const [form, setForm] = useState(false);
    

    return (
        <>
            <Container>
                <Box sx={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "1rem" }}>
                        <Button onClick={() => navigate('/cursos')}>
                            <ArrowBack />
                        </Button>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: "600" }}>Gerenciar Modulos</Typography>
                            <Typography variant="body1" sx={{ fontWeight: "500" }}>Gerencie os módulos e vídeos do curso</Typography>
                        </Box>
                    </Box>
                    <Button variant="contained" startIcon={<Add/>} sx={{fontWeight:"600"}} onClick={()=>setForm(true)}>Cadastrar Modulo</Button>
                </Box>

                {form && (
                    <CadastroModulo setForm={setForm}/>
                )}           

                <Box sx={{ mt:3, borderRadius:"12px", backgroundColor:theme.palette.secondary.dark, display:"flex", justifyContent:"space-between", alignItems:"center", p:2}}>
                      <Box>
                        <Typography variant="h6" sx={{fontWeight:"600", fontSize:"1.1rem"}}>Intrudução ao React</Typography>
                        <Typography variant="body1" sx={{fontWeight:"300", fontSize:".9rem"}}>Conceitos básicos e configuração</Typography>
                      </Box>
                      <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", gap:"1rem"}}>
                        <Typography variant="body2" sx={{backgroundColor:theme.palette.secondary.light, p:1, borderRadius:"15px"}}>Videos</Typography>
                        <Button variant="outlined">
                            <Edit/>
                        </Button>
                        <Button variant="outlined">
                            <Download/>
                        </Button>
                        <Button variant="outlined">
                            <Delete/>
                        </Button>
                      </Box>
                </Box>
            </Container>
        </>
    )
}

export default Modulos
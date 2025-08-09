import { ArrowBack, Delete } from "@mui/icons-material";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const navigate = useNavigate();

    const listarUsuarios = () => {
        axios.get("https://api.digitaleduca.com.vc/usuario/admin/usuarios", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then((response) => {
                console.log("📌 Resposta da API:", response.data);
                setUsuarios(response.data); // Se a API retornar { data: [] }, trocar para response.data.data
            })
            .catch((error) => {
                console.error("❌ Erro ao listar usuários:", error);
                Swal.fire("Erro", "Não foi possível carregar os usuários.", "error");
            });
    };

    const excluirUsuario = (id) => {
        Swal.fire({
            title: "Tem certeza?",
            text: "Você não poderá reverter esta ação!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sim, excluir!",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`https://api.digitaleduca.com.vc/usuario/admin/usuarios/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
                    .then(() => {
                        Swal.fire("Excluído!", "O usuário foi excluído com sucesso.", "success");
                        listarUsuarios();
                    })
                    .catch((error) => {
                        console.error("❌ Erro ao excluir usuário:", error);
                        Swal.fire("Erro", "Não foi possível excluir o usuário.", "error");
                    });
            }
        });
    };

    useEffect(() => {
        listarUsuarios();
    }, []);

    return (
        <Box sx={{ maxWidth: "900px", margin: "auto", mt: 4 }}>
            <Button onClick={() => navigate('/cadastrarusuario')} variant="contained" startIcon={<ArrowBack />} sx={{ borderRadius: "20px", fontWeight: "600", mb: 2 }}>Voltar ao Cadastro de Usuários</Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Nome</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell align="center"><strong>Ações</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usuarios.length > 0 ? (
                            usuarios.map((usuario) => (
                                <TableRow key={usuario.id}>
                                    <TableCell>{usuario.nome}</TableCell>
                                    <TableCell>{usuario.email}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            onClick={() => excluirUsuario(usuario.id)}
                                        >
                                            <Delete />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    Nenhum usuário encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Usuarios;

// src/components/UsuariosList.jsx
import {
    Modal,
    Box,
    Typography,
    IconButton,
    TextField,
    Pagination,
    Divider,
    alpha,
  } from "@mui/material";
  import CloseIcon from "@mui/icons-material/Close";
  import { useState, useMemo } from "react";
  import theme from "../../../theme/theme";
  
  const UsuariosList = ({ open, onClose, usuarios = [], titulo }) => {
    const [busca, setBusca] = useState("");
    const [pagina, setPagina] = useState(1);
    const porPagina = 5; // 🔹 mostra 5 usuários por página
  
    // 🔹 Função que remove o SuperAdmin da listagem
    const removerSuperAdmin = (lista) =>
      lista.filter(
        (u) =>
          u.role?.toLowerCase() !== "superadmin" &&
          u.tipoUsuario?.toLowerCase() !== "superadmin" &&
          u.email?.toLowerCase() !== "superadmin@admin.com"
      );
  
    // 🔍 Filtragem com busca + remoção do SuperAdmin
    const filtrados = useMemo(() => {
      const listaFiltrada = removerSuperAdmin(usuarios);
      return listaFiltrada.filter(
        (u) =>
          u.nome?.toLowerCase().includes(busca.toLowerCase()) ||
          u.email?.toLowerCase().includes(busca.toLowerCase())
      );
    }, [busca, usuarios]);
  
    // 🔢 Paginação
    const inicio = (pagina - 1) * porPagina;
    const fim = inicio + porPagina;
    const exibidos = filtrados.slice(inicio, fim);
    const totalPaginas = Math.ceil(filtrados.length / porPagina);
  
    const handleChangePage = (_, novaPagina) => setPagina(novaPagina);
  
    return (
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 3,
            p: 3,
            width: "90%",
            maxWidth: 800,
            display: "flex",
            flexDirection: "column",
            border: `2px solid ${alpha(theme.palette.primary.light, 0.5)}`,
            maxHeight: "85vh",
          }}
        >
          {/* Cabeçalho */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography variant="h6" fontWeight={600}>
              {titulo}
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
  
          {/* Campo de busca */}
          <TextField
            size="small"
            fullWidth
            placeholder="Buscar usuário por nome ou email..."
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPagina(1); // reseta pra página 1 ao buscar
            }}
            sx={{ mb: 2 }}
          />
  
          {/* Lista de usuários */}
          {exibidos.length > 0 ? (
            <>
              {exibidos.map((u) => (
                <Box
                  key={u.id}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    borderRadius: 2,
                    border: `2px solid ${alpha(theme.palette.primary.light, 0.2)}`,
                    backgroundColor: alpha(theme.palette.primary.light, 0.05),
                  }}
                >
                  <Typography variant="subtitle2">{u.nome}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {u.email}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Status:{" "}
                    {u.assinaturas?.some(
                      (a) =>
                        a.status === "ATIVA" &&
                        a.stripeSubscriptionId &&
                        a.stripeSubscriptionId.trim() !== ""
                    )
                      ? "Ativo"
                      : "Free / Cancelado"}
                  </Typography>
                </Box>
              ))}
  
              {/* Paginação */}
              {totalPaginas > 1 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" justifyContent="center">
                    <Pagination
                      count={totalPaginas}
                      page={pagina}
                      onChange={handleChangePage}
                      color="primary"
                      shape="rounded"
                    />
                  </Box>
                </>
              )}
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Nenhum usuário encontrado.
            </Typography>
          )}
        </Box>
      </Modal>
    );
  };
  
  export default UsuariosList;
  
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../pages/Login/swal-custom.css";

const ProtectedAdminRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Se não tiver token, manda para login
    if (!token) {
        Swal.fire({
            icon: "warning",
            title: "Sessão expirada",
            text: "Faça login novamente para continuar.",
            customClass: {
                popup: "swal-theme-popup",
                title: "swal-theme-title",
                confirmButton: "swal-theme-button",
            },
        });

        return <Navigate to="/login" replace />;
    }

    // Se não for SUPERADMIN → bloqueia
    if (role !== "SUPERADMIN") {
        Swal.fire({
            icon: "error",
            title: "Acesso negado",
            text: "Você não tem permissão para acessar este painel.",
            customClass: {
                popup: "swal-theme-popup",
                title: "swal-theme-title",
                confirmButton: "swal-theme-button",
            },
        });

        return <Navigate to="/login" replace />;
    }

    // Se estiver tudo certo → renderiza o componente protegido
    return children;
};

export default ProtectedAdminRoute;

import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const PrivateRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      console.log('[PrivateRoute] token no localStorage:', token);

      if (!token) {
        console.log('[PrivateRoute] NÃO tem token -> bloqueando');
        setIsAuth(false);
        return;
      }

      try {
        // 1) Decodifica o JWT
        const decoded = jwtDecode(token);
        console.log('[PrivateRoute] decoded JWT:', decoded);

        // 2) Valida exp (se tiver)
        if (decoded.exp) {
          const expMs = decoded.exp * 1000;
          console.log('[PrivateRoute] exp:', decoded.exp, 'expMs:', expMs, 'now:', Date.now());

          if (expMs < Date.now()) {
            console.log('[PrivateRoute] token EXPIRADO -> removendo e bloqueando');
            localStorage.removeItem('token');
            setIsAuth(false);
            return;
          }
        } else {
          console.log('[PrivateRoute] token NÃO tem exp');
        }

        // 3) Checa role = superadmin
        console.log('[PrivateRoute] role no token:', decoded.role);
        if (!decoded.role || decoded.role !== 'SUPERADMIN') {
          console.log('[PrivateRoute] bloqueado por role. Esperado: superadmin, veio:', decoded.role);
          setIsAuth(false);
          return;
        }

        // 4) (Opcional) valida no backend também
        console.log('[PrivateRoute] chamando /auth/check...');
        const resp = await axios.get('https://api.digitaleduca.com.vc/auth/check', {
          headers: { Authorization: 'Bearer ' + token },
        });
        console.log('[PrivateRoute] /auth/check OK. Resposta:', resp.data);

        // Se chegou aqui: token ok + role superadmin
        console.log('[PrivateRoute] AUTORIZADO como superadmin');
        setIsAuth(true);
      } catch (error) {
        console.error('[PrivateRoute] ERRO no verifyToken:', error);
        localStorage.removeItem('token');
        setIsAuth(false);
      }
    };

    verifyToken();
  }, []);

  console.log('[PrivateRoute] isAuth state:', isAuth);

  if (isAuth === null) {
    console.log('[PrivateRoute] carregando (isAuth === null)');
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuth) {
    console.log('[PrivateRoute] NÃO autorizado -> Navigate para "/"');
    return <Navigate to="/" />;
  }

  console.log('[PrivateRoute] autorizado -> render children');
  return children;
};

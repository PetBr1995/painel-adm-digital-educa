// src/layouts/PublicLayout.jsx
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext'; // ajuste o caminho

export default function PublicLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f9' }}>
      {/* HEADER */}
      <header style={{
        background: '#1a1a2e',
        color: 'white',
        padding: '1rem 2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>
          Dashboard Público
        </h1>
        <button
          onClick={handleLogout}
          style={{
            background: '#ee4444',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Sair
        </button>
      </header>

      {/* CONTEÚDO */}
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <Outlet />
      </main>

      {/* RODAPÉ */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#666',
        fontSize: '0.9rem',
        marginTop: '4rem'
      }}>
        © 2025 Sua Plataforma - Dashboard Público
      </footer>
    </div>
  );
}
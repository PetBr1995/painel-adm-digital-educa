// theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f5a204', // Amarelo destaque (da logo)
    },
    secondary: {
      main: '#1E2A46', // Azul escuro complementar
    },
    background: {
      default: 'radial-gradient(circle at top left, #1E2A46, #0A1128)',
      paper: '#121829',   // Cards, caixas
    },
  text: {
  primary: '#FFFFFF',
  secondary: '#A0A0A0', // ou #B0B0B0, ou #888888
},
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 500 },
    button: { textTransform: 'none' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          padding: '8px 16px',
        },
        containedPrimary: {
          backgroundColor: '#FFB800',
          color: '#0A1128',
          '&:hover': {
            backgroundColor: '#dba600', // Amarelo escurecido mais fechado
            boxShadow: '0 4px 12px rgba(255, 184, 0, 0.25)', // Sombra sutil
          },
        },
        outlinedPrimary: {
          borderColor: '#FFB800',
          color: '#FFB800',
          '&:hover': {
            borderColor: '#dba600', // Combina com o hover do contained
            backgroundColor: 'rgba(255, 184, 0, 0.08)', // Bem leve, não chama muita atenção
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#121829',
        },
      },
    },
  },
});

export default theme;
// src/theme.jsx
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f5a204', // Amarelo da logo
      contrastText: '#0A1128',
    },
    secondary: {
      main: '#1E2A46', // Azul escuro
    },
    background: {
      default: 'radial-gradient(circle at top left, #1E2A46, #0A1128)',
      paper: '#121829',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#A0A0A0',
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
    // BOTÕES PERSONALIZADOS
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          padding: '10px 20px',
        },
        containedPrimary: {
          backgroundColor: '#FFB800',
          color: '#0A1128',
          '&:hover': {
            backgroundColor: '#dba600',
            boxShadow: '0 4px 16px rgba(255, 184, 0, 0.3)',
          },
        },
        outlinedPrimary: {
          borderColor: '#FFB800',
          color: '#FFB800',
          '&:hover': {
            borderColor: '#dba600',
            backgroundColor: 'rgba(255, 184, 0, 0.1)',
          },
        },
      },
    },

    // PAPEL (Cards, Dialogs, etc)
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#121829',
          backgroundImage: 'none',
        },
      },
    },

    // FONT-SMOOTHING GLOBAL (O QUE VOCÊ PEDIU!)
    MuiCssBaseline: {
      styleOverrides: `
      *, *::before, *::after {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        }
        
        /* Extra: deixa o texto ainda mais nítido no Windows */
        body {
          -webkit-text-stroke: 0.45px transparent;
          }
          `,
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 184, 0, 0.2)',           // borda normal
              borderWidth: 1,
              borderRadius: 12,
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255,184,0,0.3)',           // hover

            },
            '&.Mui-focused fieldset': {
              borderColor: 'rgba(255,184,0,0.2)',           // ativo/focus
              backgroundColor: 'rgba(30, 42, 70, 0.5)',
            },

          },
          '& .MuiInputLabel-root': {
            color: '#A0A0A0',
            '&.Mui-focused': { color: '#FFB800' }, // label no foco
          },
        },
      },
    },
    // FUNCIONA EM 100% DOS PROJETOS MUI v5/v6
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '& fieldset': {
            borderColor: 'rgba(255, 184, 0, 0.2)',
            borderWidth: 1,
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255,184,0,0.1)',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'rgba(255,184,0,0.2)',
            backgroundColor: 'rgba(30, 42, 70, 0.5)',
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#A0A0A0',
          '&.Mui-focused': { color: '#FFB800' },
        },
      },
    },
    
  },
});

export default theme;
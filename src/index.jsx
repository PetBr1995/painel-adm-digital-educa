import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import theme from './theme/theme';
import { AuthProvider } from './components/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            margin: 0,
            padding: 0,
            background: theme.palette.background.default,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            minHeight: '100vh',
          },
        }}
      />
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

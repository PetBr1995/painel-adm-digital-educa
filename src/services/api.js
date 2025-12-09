import axios from "axios";

// 1. Cria a instância base SEM o token no header inicial
const api = axios.create({
    baseURL: 'https://api.digitaleduca.com.vc',
    headers: {
        'Content-Type': 'application/json', // Mantenha outros headers importantes
    },
    timeout: 10000,
});

// 2. Adiciona o Interceptor de Requisição
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // <-- Busca o token A CADA REQUISIÇÃO

        if (token) {
            // Se o token existir, injeta ele no header
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn('Erro: 401: Sessão expirada ou token inválido.');
            localStorage.removeItem('token')
        }
        return Promise.reject(error);
    }
);

export default api;
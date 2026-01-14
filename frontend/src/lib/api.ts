import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log({ error });

        if (error.config.url !== '/auth/login') {
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                toast.error("Sessão expirada", {
                    description: "Faça login novamente para continuar",
                    closeButton: true,
                    duration: 5000,
                })
            }
        } else {
            toast.error("Credenciais inválidas", {
                description: "Usuário/Email ou senha inválidos",
                closeButton: true,
                duration: 5000,
            })
        }

        return Promise.reject(error);
    }
);

export default api;
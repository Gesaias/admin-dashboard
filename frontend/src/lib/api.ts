// 'use client';
import axios from "axios";
import { toast } from "sonner";
import { getSession, signOut } from "next-auth/react";

const toastErrorConfig = {
        duration: 5000,
        position: "top-right" as const,
        closeButton: true,
        richColors: true,
        descriptionClassName: "text-sm text-white",
        style: { backgroundColor: "#f87171", color: "white" },
    };

const api = axios.create({
    baseURL: "http://localhost:3001",
});

api.interceptors.request.use(async (config) => {
    try {
        const session = await getSession();
        const token = session?.access_token ?? null;

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (e) {
        // ignore session retrieval errors and proceed without token
        // console.warn('Failed to get session for API request', e);
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const response = error?.response;
        const status = response?.status;
        const url = error?.config?.url ?? "";

        // Normalize url (axios may return absolute URLs)
        const isLoginEndpoint = String(url).includes("/auth/login");

        if (isLoginEndpoint) {
            toast.error("Credenciais inválidas", {
                description: "Usuário/Email ou senha inválidos",
                ...toastErrorConfig,
            });
            return Promise.reject(error);
        }

        if (status === 401) {
            signOut({
                redirect: true,
                callbackUrl: "/auth/login",
            }).then(() => {
                toast.error("Sessão expirada", {
                    description: "Faça login novamente para continuar",
                    ...toastErrorConfig,
                });
            });
            return Promise.reject(error);
        }

        if (status === 404) {
            toast.error("Recurso não encontrado", {
                description:
                    response?.data?.message ||
                    "O recurso solicitado não existe.",
                ...toastErrorConfig,
            });
            return Promise.reject(error);
        }

        if (!response) {
            toast.error("Erro de conexão", {
                description:
                    "Falha ao conectar ao servidor. Verifique sua conexão.",
                ...toastErrorConfig,
            });
            return Promise.reject(error);
        }

        return Promise.reject(error);
    },
);

export default api;

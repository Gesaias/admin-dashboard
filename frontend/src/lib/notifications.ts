import { toast } from "sonner";
import { ApiError } from "@/app/helpers/api-error";

export const toastSuccessConfig = {
    duration: 5000,
    position: "top-right" as const,
    closeButton: true,
    richColors: true,
    descriptionClassName: "text-sm text-white",
    style: { backgroundColor: "#10b981", color: "white" },
};

export const toastErrorConfig = {
    duration: 5000,
    position: "top-right" as const,
    closeButton: true,
    richColors: true,
    descriptionClassName: "text-sm text-white",
    style: { backgroundColor: "#f87171", color: "white" },
};

export const handleApiError = (error: unknown, defaultTitle: string) => {
    if (error instanceof ApiError) {
        toast.error(defaultTitle, {
            description: error.message,
            ...toastErrorConfig,
        });
    } else if (error && typeof error === "object" && "response" in error) {
        const apiError = error as {
            response: { data?: { message?: string } };
        };
        const message =
            apiError.response.data?.message || "Ocorreu um erro inesperado";
        toast.error(defaultTitle, {
            description: message,
            ...toastErrorConfig,
        });
    } else {
        toast.error(defaultTitle, {
            description: "Ocorreu um erro inesperado",
            ...toastErrorConfig,
        });
    }
};

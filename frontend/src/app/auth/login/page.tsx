"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { handleApiError } from "@/lib/notifications";
import * as z from "zod";
import { formSchema } from "./schema";

export default function LoginPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            setLoading(true);

            const res = await signIn("credentials", {
                redirect: false,
                callbackUrl: "/dashboard",
                ...data,
            });

            if (!res || !res.ok) {
                // NextAuth wraps errors, so we handle the 401/403 specifically if needed
                if (res?.error === "CredentialsSignin") {
                    throw new Error("Usuário ou senha incorretos.");
                }
                throw new Error(res?.error || "Erro ao fazer login");
            }

            router.push("/dashboard");
        } catch (error) {
            handleApiError(error, "Erro ao acessar o sistema");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
            <div className="w-full max-w-[420px] space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col items-center gap-2 mb-2">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <span className="text-white font-black text-2xl tracking-tighter">AD</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">Admin Dashboard</h1>
                </div>

                <Card className="border-none shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                    <CardHeader className="space-y-1 pb-6 text-center">
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-50">Bem-vindo de volta</CardTitle>
                        <CardDescription className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Entre com suas credenciais para acessar o painel
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LoginForm onSubmit={onSubmit} loading={loading} />
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-slate-400 dark:text-slate-600 font-medium tracking-wide">
                    © {new Date().getFullYear()} Admin Dashboard — Todos os direitos reservados.
                </p>
            </div>
        </div>
    );
}

/** eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LoginPage() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setLoading(true);

        // Use next-auth signIn with credentials provider. redirect:false so we handle navigation.
        const res = await signIn("credentials", {
            redirect: false,
            identifier,
            password,
        });

        setLoading(false);

        if (!res) {
            setErrorMessage("Erro inesperado ao autenticar");
            return;
        }

        // res may contain { error, status, ok, url }
        if ((res as any).error) {
            const status = (res as any).status;
            if (status === 401 || status === 403) {
                setErrorMessage("Credenciais inválidas");
            } else if (status === 404) {
                setErrorMessage("Serviço de autenticação não encontrado");
            } else {
                setErrorMessage("Erro ao fazer login");
            }
            return;
        }

        // Successful sign in
        // retrieve session to access token/user provided by NextAuth callbacks
        const session = await getSession();
        if (session) {
            if ((session as any).accessToken) {
                localStorage.setItem("token", (session as any).accessToken);
            }
            if (session.user) {
                localStorage.setItem("user", JSON.stringify(session.user));
            }
        }
        router.push("/dashboard");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-96">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            type="text"
                            placeholder="Email"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />
                        <Input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Entrando..." : "Entrar"}
                        </Button>
                        {errorMessage && (
                            <div className="text-sm text-red-600 mt-2">
                                {errorMessage}
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { BACKEND_LOGIN_URL } from "@/constants/Auth";
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier: {
                    label: "Email ou usuário",
                    type: "text",
                    placeholder: "admin@admin.com",
                },
                password: { label: "Senha", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) return null;

                try {
                    const res = await fetch(BACKEND_LOGIN_URL, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            identifier: credentials.identifier,
                            password: credentials.password,
                        }),
                    });

                    if (!res.ok) {
                        // Retorna null para indicar falha de autenticação ao NextAuth
                        return null;
                    }

                    const data = await res.json();

                    if (!data || !data.access_token || !data.user) {
                        return null;
                    }

                    return {
                        id: data.user.id,
                        email: data.user.email,
                        username: data.user.username,
                        name: data.user.name,
                        role: data.user.role,
                        // incluímos o token para que os callbacks possam armazená-lo no JWT
                        access_token: data.access_token,
                    };
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (error) {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken =
                    (user as any).access_token ?? token.accessToken;
                token.user = {
                    id: (user as any).id,
                    email: (user as any).email,
                    username: (user as any).username,
                    name: (user as any).name,
                    role: (user as any).role,
                };
            }
            return token;
        },

        async session({ session, token }) {
            // @ts-expect-error -- adicionado para incluir accessToken no objeto session
            session.accessToken = (token as any).accessToken;
            session.user = (token as any).user ?? session.user;
            return session;
        },
    },
    // Em produção, configure NEXTAUTH_SECRET em .env.local
    secret: process.env.NEXTAUTH_SECRET ?? "change-this-secret-in-production",
    debug: process.env.NODE_ENV === "development",
};

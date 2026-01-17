
import { BACKEND_LOGIN_URL } from "@/constants/Auth";
import { type NextAuthOptions } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserRole } from "../../enums/user-role";

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
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            identifier: credentials.identifier,
                            password: credentials.password,
                        }),
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.message || 'Credenciais inválidas');
                    }


                    if (!data || !data.access_token || !data.user) {
                        return null;
                    }

                    return {
                        id: data.user.id,
                        email: data.user.email,
                        username: data.user.username,
                        name: data.user.name,
                        role: data.user.role,
                        access_token: data.access_token,
                    };
                } catch (error) {
                    throw error;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (!user) return token;

            type CustomUser = AdapterUser & {
                access_token: string;
                username: string;
                name: string;
                role: UserRole;
            };

            const customUser = user as CustomUser;

            if (customUser) {
                token.accessToken = customUser.access_token ?? token.accessToken;
                token.user = {
                    id: customUser.id,
                    email: customUser.email,
                    username: customUser.username,
                    name: customUser.name,
                    role: customUser.role,
                };
            }
            return token;
        },

        async session({ session, token }) {
            session.access_token = token.accessToken;
            session.user = token.user ?? session.user;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET ?? "change-this-secret-in-production",
    debug: process.env.NODE_ENV === "development",
};

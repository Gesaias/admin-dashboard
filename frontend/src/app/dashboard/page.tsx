import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions as any);

    if (!session) {
        // If there is no session, redirect to the login page
        redirect("/login");
    }

    const user = (session as any).user ?? null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50">
            <main className="max-w-3xl w-full p-8 bg-white rounded shadow">
                <header className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Dashboard</h1>
                        <p className="text-sm text-zinc-600 mt-1">
                            Bem-vindo, {user?.name ?? user?.email ?? "Usuário"}!
                        </p>
                        {user?.role && (
                            <p className="text-xs text-zinc-500 mt-1">
                                Role: {user.role}
                            </p>
                        )}
                    </div>

                    {/* Logout button (client component) */}
                    <div>
                        <LogoutButton className="bg-red-600" />
                    </div>
                </header>

                <section>
                    <h2 className="text-lg font-medium mb-2">Sessão (raw)</h2>
                    <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto text-sm">
                        {JSON.stringify(session, null, 2)}
                    </pre>
                </section>

                <section className="mt-6">
                    <h2 className="text-lg font-medium mb-2">Notas</h2>
                    <ul className="list-disc pl-5 text-sm text-zinc-600">
                        <li>
                            Essa rota é protegida server-side usando{" "}
                            <code>getServerSession</code> e redireciona para{" "}
                            <code>/login</code> caso o usuário não esteja
                            autenticado.
                        </li>
                        <li>
                            O token de autenticação retornado pelo backend é
                            exposto em <code>session.accessToken</code>. Você
                            pode usá-lo para chamadas server-side ao backend.
                        </li>
                    </ul>
                </section>
            </main>
        </div>
    );
}

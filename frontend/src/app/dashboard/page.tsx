'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        users: 0,
        products: 0,
        categories: [],
        totalValue: 0,
    });

    useEffect(() => {
        Promise.all([
            api.get('/users'),
            api.get('/products'),
            api.get('/products/stats'),
        ]).then(([users, products, categories]) => {
            const totalValue = products.data.reduce(
                (acc: number, p: any) => acc + p.price * p.stock,
                0
            );

            setStats({
                users: users.data.length,
                products: products.data.length,
                categories: categories.data,
                totalValue,
            });
        });
    }, []);

    const statsCards = [
        {
            title: 'Total de Usuários',
            value: stats.users,
            icon: Users,
            color: 'bg-blue-500',
            change: '+12%',
        },
        {
            title: 'Total de Produtos',
            value: stats.products,
            icon: Package,
            color: 'bg-green-500',
            change: '+8%',
        },
        {
            title: 'Categorias',
            value: stats.categories.length,
            icon: ShoppingCart,
            color: 'bg-purple-500',
            change: '+3%',
        },
        {
            title: 'Valor Total Estoque',
            value: `R$ ${stats.totalValue.toLocaleString('pt-BR')}`,
            icon: TrendingUp,
            color: 'bg-orange-500',
            change: '+15%',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-600">
                                        {stat.title}
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {stat.value}
                                    </p>
                                    <p className="text-sm text-green-600 font-medium">
                                        {stat.change} vs mês passado
                                    </p>
                                </div>
                                <div className={`${stat.color} p-3 rounded-xl`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Produtos por Categoria</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.categories}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="_count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Line Chart (mock data) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Evolução de Vendas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                data={[
                                    { name: 'Jan', value: 400 },
                                    { name: 'Fev', value: 300 },
                                    { name: 'Mar', value: 600 },
                                    { name: 'Abr', value: 800 },
                                    { name: 'Mai', value: 500 },
                                    { name: 'Jun', value: 900 },
                                ]}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Atividades Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            {
                                action: 'Novo produto adicionado',
                                description: 'Notebook Dell Inspiron',
                                time: '2 minutos atrás',
                            },
                            {
                                action: 'Usuário cadastrado',
                                description: 'João Silva - joao@email.com',
                                time: '15 minutos atrás',
                            },
                            {
                                action: 'Estoque atualizado',
                                description: 'Mouse Logitech - 50 unidades',
                                time: '1 hora atrás',
                            },
                        ].map((activity, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{activity.action}</p>
                                    <p className="text-sm text-gray-600">{activity.description}</p>
                                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


// import { redirect } from "next/navigation";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth";
// import LogoutButton from "@/components/auth/LogoutButton";

// export default async function DashboardPage() {
//     const session = await getServerSession(authOptions as any);

//     if (!session) {
//         // If there is no session, redirect to the login page
//         redirect("/login");
//     }

//     const user = (session as any).user ?? null;

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-zinc-50">
//             <main className="max-w-3xl w-full p-8 bg-white rounded shadow">
//                 <header className="mb-6 flex items-start justify-between gap-4">
//                     <div>
//                         <h1 className="text-2xl font-semibold">Dashboard</h1>
//                         <p className="text-sm text-zinc-600 mt-1">
//                             Bem-vindo, {user?.name ?? user?.email ?? "Usuário"}!
//                         </p>
//                         {user?.role && (
//                             <p className="text-xs text-zinc-500 mt-1">
//                                 Role: {user.role}
//                             </p>
//                         )}
//                     </div>

//                     {/* Logout button (client component) */}
//                     <div>
//                         <LogoutButton className="bg-red-600" />
//                     </div>
//                 </header>

//                 <section>
//                     <h2 className="text-lg font-medium mb-2">Sessão (raw)</h2>
//                     <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto text-sm">
//                         {JSON.stringify(session, null, 2)}
//                     </pre>
//                 </section>

//                 <section className="mt-6">
//                     <h2 className="text-lg font-medium mb-2">Notas</h2>
//                     <ul className="list-disc pl-5 text-sm text-zinc-600">
//                         <li>
//                             Essa rota é protegida server-side usando{" "}
//                             <code>getServerSession</code> e redireciona para{" "}
//                             <code>/login</code> caso o usuário não esteja
//                             autenticado.
//                         </li>
//                         <li>
//                             O token de autenticação retornado pelo backend é
//                             exposto em <code>session.accessToken</code>. Você
//                             pode usá-lo para chamadas server-side ao backend.
//                         </li>
//                     </ul>
//                 </section>
//             </main>
//         </div>
//     );
// }

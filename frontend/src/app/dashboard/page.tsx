'use client';

import api from "@/lib/api";
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        users: 0,
        products: 0,
        categories: [],
        totalValue: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [users, products, categories] = await Promise.all([
                    api.get('/users'),
                    api.get('/products'),
                    api.get('/products/stats'),
                ]);

                const totalValue = products.data.reduce(
                    (acc: number, p: { price: number; stock: number }) => acc + p.price * p.stock,
                    0
                );

                setStats({
                    users: users.data.length,
                    products: products.data.length,
                    categories: categories.data,
                    totalValue,
                });
            } catch (error) {
                console.error("Erro ao carregar estatísticas do dashboard:", error);
            }
        };

        fetchStats();
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
            color: 'bg-emerald-500',
            change: '+8%',
        },
        {
            title: 'Categorias',
            value: stats.categories.length,
            icon: ShoppingCart,
            color: 'bg-indigo-500',
            change: '+3%',
        },
        {
            title: 'Valor em Estoque',
            value: `R$ ${stats.totalValue.toLocaleString('pt-BR')}`,
            icon: TrendingUp,
            color: 'bg-amber-500',
            change: '+15%',
        },
    ];

    const recentActivities = [
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
    ];

    return (
        <div className="space-y-8 pb-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Charts Row */}
            <DashboardCharts categoryData={stats.categories} />

            {/* Recent Activity */}
            <RecentActivity activities={recentActivities} />
        </div>
    );
}
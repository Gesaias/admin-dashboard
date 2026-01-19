"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { User } from "next-auth";
import { getUserLogged } from "@/lib/utils";
import { Download, Plus } from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "@/app/helpers/api-error";
import DashboardPageHeader from "@/components/dashboard-page-header";
import { CreateUserDialog } from "@/components/users/create-user-dialog";
import { UsersTable } from "@/components/users/users-table";
import z from "zod";
import { formSchema } from "./schema";

export default function UsersPage() {
    const [users, setUsers] = useState<Array<User>>([]);
    const [userLogged, setUserLogged] = useState<User | null>(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const loadUsers = async () => {
        try {
            const { data } = await api.get("/users");
            setUsers(data);
        } catch (error) {
            console.error("Erro ao carregar usuários:", error);
        }
    };

    useEffect(() => {
        loadUsers();
        getUserLogged().then((u: User | null) => {
            if (u) {
                setUserLogged(u);
            }
        });
    }, []);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const response = await api.post("/auth/register", data);

            if (response.status === 201) {
                await loadUsers();
                toast.success("Usuário criado com sucesso", {
                    description: "O usuário foi criado com sucesso",
                    closeButton: true,
                    duration: 5000,
                });
                setOpen(false);
            }
        } catch (error) {
            if (error instanceof ApiError) {
                toast.error("Erro ao criar usuário", {
                    description: error.message,
                    closeButton: true,
                    duration: 5000,
                });
            } else {
                toast.error("Erro ao criar usuário", {
                    description: "Ocorreu um erro inesperado",
                    closeButton: true,
                    duration: 5000,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 flex flex-col">
            <DashboardPageHeader
                title="Usuários"
                description="Gerencie todos os usuários do sistema"
                actions={[
                    {
                        label: "Exportar Usuários",
                        icon: <Download className="w-4 h-4" />,
                        onClick: () => console.log('Tentando exportar usuários...'),
                        variant: 'outline',
                    },
                    {
                        label: "Novo Usuário",
                        icon: <Plus className="w-4 h-4" />,
                        onClick: () => setOpen(true),
                        variant: 'default',
                    },
                ]}
            />

            <div className="flex flex-col items-start justify-between">
                <CreateUserDialog
                    open={open}
                    onOpenChange={setOpen}
                    onSubmit={onSubmit}
                    loading={loading}
                />
                
                <UsersTable 
                    users={users} 
                    userLogged={userLogged}
                    onEdit={(user) => console.log('Editar', user)}
                    onDetail={(user) => console.log('Detalhar', user)}
                />
            </div>
        </div>
    );
}

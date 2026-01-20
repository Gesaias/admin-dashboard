"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { User } from "@/types/user";
import { User as NextAuthUser } from "next-auth";
import { getUserLogged } from "@/lib/utils";
import { Download, Plus } from "lucide-react";
import { toast } from "sonner";
import DashboardPageHeader from "@/components/dashboard-page-header";
import { CreateUserDialog } from "@/components/users/create-user-dialog";
import { UserEditSheet } from "@/components/users/user-edit-sheet";
import { UserDetailSheet } from "@/components/users/user-detail-sheet";
import { UsersTable } from "@/components/users/users-table";
import z from "zod";
import { formSchema as createUserSchema } from "./schema";
import {
    editUserSchema,
    passwordUpdateSchema,
} from "@/components/users/user-edit-form";
import { UserRole } from "../../../../enums/user-role";
import { 
    toastSuccessConfig, 
    toastErrorConfig, 
    handleApiError 
} from "@/lib/notifications";

export default function UsersPage() {
    const [users, setUsers] = useState<Array<User>>([]);
    const [userLogged, setUserLogged] = useState<User | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(true);

    const loadUsers = async () => {
        try {
            setTableLoading(true);
            const { data } = await api.get("/users");
            setUsers(data);
        } catch (error) {
            console.error("Erro ao carregar usuários:", error);
            handleApiError(error, "Erro ao carregar usuários");
        } finally {
            setTableLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
        getUserLogged().then((u: NextAuthUser | null) => {
            if (u) {
                setUserLogged(u as User);
            }
        });
    }, []);



    const onCreateSubmit = async (data: z.infer<typeof createUserSchema>) => {
        if (!data.password) {
            toast.error("Erro ao criar usuário", {
                description: "A senha é obrigatória para novos usuários",
                ...toastErrorConfig,
            });
            return;
        }

        try {
            setLoading(true);
            const response = await api.post("/auth/register", data);

            if (response.status === 201) {
                await loadUsers();
                toast.success("Usuário criado com sucesso", {
                    description: "O usuário foi criado com sucesso",
                    ...toastSuccessConfig,
                });
                setCreateOpen(false);
            }
        } catch (error) {
            handleApiError(error, "Erro ao criar usuário");
        } finally {
            setLoading(false);
        }
    };

    const onEditSubmit = async (data: z.infer<typeof editUserSchema>) => {
        if (!selectedUser) return;
        try {
            setLoading(true);
            const response = await api.put(`/users/${selectedUser.id}`, data);

            if (response.status === 200 || response.status === 204) {
                await loadUsers();
                toast.success("Usuário atualizado", {
                    description: "As informações foram salvas com sucesso",
                    ...toastSuccessConfig,
                });
                setEditOpen(false);
                setSelectedUser(null);
            }
        } catch (error) {
            handleApiError(error, "Erro ao atualizar usuário");
        } finally {
            setLoading(false);
        }
    };

    const onPasswordUpdateSubmit = async (
        data: z.infer<typeof passwordUpdateSchema>,
    ) => {
        if (!selectedUser) return;
        try {
            setLoading(true);
            const response = await api.patch(
                `/auth/${selectedUser.id}/password`,
                {
                    ...data,
                    passwordConfirmation: data.password_confirmation,
                },
            );

            if (response.status === 200 || response.status === 204) {
                toast.success("Senha atualizada", {
                    description: "A senha do usuário foi alterada com sucesso",
                    ...toastSuccessConfig,
                });
            }
        } catch (error) {
            handleApiError(error, "Erro ao atualizar senha");
            throw error; // Re-throw so EditUserForm can reset or handle error state
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (user: User) => {
        try {
            setLoading(true);
            const response = await api.delete(`/users/${user.id}`);

            if (response.status === 200 || response.status === 204) {
                await loadUsers();
                toast.success("Usuário deletado", {
                    description: "O usuário foi deletado com sucesso",
                    ...toastSuccessConfig,
                });
            }
        } catch (error) {
            handleApiError(error, "Erro ao deletar usuário");
        } finally {
            setLoading(false);
        }
    };



    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setEditOpen(true);
    };

    const handleDetail = (user: User) => {
        setSelectedUser(user);
        setDetailOpen(true);
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
                        onClick: () =>
                            console.log("Tentando exportar usuários..."),
                        variant: "outline" as const,
                    },
                    ...(userLogged &&
                    (userLogged.role === UserRole.ADMIN ||
                        userLogged.role === UserRole.MANAGER)
                        ? [
                              {
                                  label: "Novo Usuário",
                                  icon: <Plus className="w-4 h-4" />,
                                  onClick: () => setCreateOpen(true),
                                  variant: "default",
                              } as const,
                          ]
                        : []),
                ]}
            />

            <div className="flex flex-col items-start justify-between w-full">
                <CreateUserDialog
                    open={createOpen}
                    onOpenChange={setCreateOpen}
                    onSubmit={onCreateSubmit}
                    loading={loading}
                    userLogged={userLogged!}
                />

                <UserEditSheet
                    user={selectedUser}
                    open={editOpen}
                    onOpenChange={setEditOpen}
                    onSubmit={onEditSubmit}
                    onPasswordSubmit={onPasswordUpdateSubmit}
                    loading={loading}
                    userLogged={userLogged!}
                />

                <UserDetailSheet
                    user={selectedUser}
                    open={detailOpen}
                    onOpenChange={setDetailOpen}
                />

                <UsersTable
                    users={users}
                    userLogged={userLogged}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onDetail={handleDetail}
                    loading={tableLoading}
                />
            </div>
        </div>
    );
}

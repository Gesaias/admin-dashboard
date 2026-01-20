"use client";

import * as React from "react";
import { useMemo } from "react";
import { User } from "@/types/user";
import { UserRole } from "../../../enums/user-role";
import { Button } from "@/components/ui/button";
import { FolderOpenDot, Pencil, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { UserRoleBadge, UserStatusBadge } from "./user-badges";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

interface UsersTableProps {
    users: User[];
    userLogged: User | null;
    onEdit?: (user: User) => void;
    onDelete?: (user: User) => void;
    onDetail?: (user: User) => void;
    loading?: boolean;
}

export function UsersTable({
    users,
    userLogged,
    onEdit,
    onDelete,
    onDetail,
    loading = false,
}: UsersTableProps) {
    const canManageUser = React.useCallback((user: User) => {
        if (!userLogged) return false;
        return (
            userLogged.id === user.id ||
            userLogged.role === UserRole.ADMIN ||
            (userLogged.role === UserRole.MANAGER && user.role !== UserRole.ADMIN)
        );
    }, [userLogged]);

    const columns = useMemo<ColumnDef<User>[]>(() => [
        {
            accessorKey: "name",
            header: "Nome",
            cell: ({ row }) => (
                <span className="font-medium text-slate-700 dark:text-slate-300">
                    {row.getValue("name")}
                </span>
            ),
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => (
                <span className="text-slate-500">{row.getValue("email")}</span>
            ),
        },
        {
            accessorKey: "role",
            header: "Tipo",
            cell: ({ row }) => <UserRoleBadge role={row.getValue("role")} />,
        },
        {
            accessorKey: "suspended",
            header: "Status",
            cell: ({ row }) => (
                <UserStatusBadge suspended={row.getValue("suspended")} />
            ),
        },
        {
            id: "actions",
            header: () => <div className="text-end">Ações</div>,
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex gap-4 items-center justify-end">
                        {canManageUser(user) && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="hover:cursor-pointer w-fit text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                        onClick={() => onEdit?.(user)}
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Editar Usuário</p>
                                </TooltipContent>
                            </Tooltip>
                        )}

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="hover:cursor-pointer w-fit text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    onClick={() => onDetail?.(user)}
                                >
                                    <FolderOpenDot className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Detalhar Usuário</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    disabled={!canManageUser(user)}
                                    className="hover:cursor-pointer w-fit text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
                                    onClick={() => onDelete?.(user)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Deletar Usuário</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                );
            },
        },
    ], [onEdit, onDelete, onDetail, canManageUser]);

    return (
        <div className="w-full">
            <DataTable
                columns={columns}
                data={users}
                searchKey="name"
                placeholder="Pesquisar por nome..."
                loading={loading}
            />
        </div>
    );
}

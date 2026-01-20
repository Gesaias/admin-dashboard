"use client";

import { User } from "@/types/user";
import { UserRole } from "../../../enums/user-role";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FolderOpenDot, Pencil, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { UserRoleBadge, UserStatusBadge } from "./user-badges";

interface UsersTableProps {
    users: User[];
    userLogged: User | null;
    onEdit?: (user: User) => void;
    onDelete?: (user: User) => void;
    onDetail?: (user: User) => void;
}

export function UsersTable({
    users,
    userLogged,
    onEdit,
    onDelete,
    onDetail,
}: UsersTableProps) {
    const canManageUser = (user: User) => {
        if (!userLogged) return false;
        return (
            userLogged.id === user.id ||
            userLogged.role === UserRole.ADMIN ||
            (userLogged.role === UserRole.MANAGER && user.role !== UserRole.ADMIN)
        );
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-end">Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user: User) => (
                    <TableRow key={user.id}>
                        <TableCell className="font-medium text-slate-700 dark:text-slate-300">{user.name}</TableCell>
                        <TableCell className="text-slate-500">{user.email}</TableCell>
                        <TableCell>
                            <UserRoleBadge role={user.role} />
                        </TableCell>
                        <TableCell>
                            <UserStatusBadge suspended={user.suspended} />
                        </TableCell>
                        <TableCell className="flex gap-4 items-center justify-end">
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
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

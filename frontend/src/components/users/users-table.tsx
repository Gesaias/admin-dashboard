"use client";

import { User } from "next-auth";
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

interface UsersTableProps {
    users: User[];
    userLogged: User | null;
    onEdit?: (user: User) => void;
    onDetail?: (user: User) => void;
}

export function UsersTable({ users, userLogged, onEdit, onDetail }: UsersTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-end">Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user: User) => (
                    <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell className="flex gap-2 items-center justify-end">
                            {userLogged &&
                            (userLogged.id === user.id ||
                                userLogged.role === UserRole.ADMIN) ? (
                                <Button
                                    size="sm"
                                    className="hover:cursor-pointer"
                                    onClick={() => onEdit?.(user)}
                                >
                                    Editar
                                </Button>
                            ) : (
                                <Button
                                    size="sm"
                                    className="hover:cursor-pointer"
                                    onClick={() => onDetail?.(user)}
                                >
                                    Detalhar
                                </Button>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { UserRole } from "../../../enums/user-role";
import { UserCheck, UserX } from "lucide-react";

export function UserRoleBadge({ role }: { role: UserRole }) {
    switch (role) {
        case UserRole.ADMIN:
            return <Badge className="bg-purple-500 hover:bg-purple-600">Administrador</Badge>;
        case UserRole.MANAGER:
            return <Badge className="bg-blue-500 hover:bg-blue-600">Gerente</Badge>;
        default:
            return <Badge className="bg-slate-500 hover:bg-slate-600">Usuário</Badge>;
    }
}

export function UserStatusBadge({ suspended }: { suspended: boolean }) {
    return suspended ? (
        <Badge variant="destructive" className="flex items-center gap-1 w-fit">
            <UserX className="w-3 h-3" /> Suspenso
        </Badge>
    ) : (
        <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1 w-fit">
            <UserCheck className="w-3 h-3" /> Ativo
        </Badge>
    );
}

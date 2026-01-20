"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { User } from "@/types/user";
import { 
    UserIcon, 
    Mail, 
    ShieldUser, 
    ShieldCheck, 
} from "lucide-react";
import { UserRoleBadge, UserStatusBadge } from "./user-badges";

interface UserDetailSheetProps {
    user: User | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UserDetailSheet({
    user,
    open,
    onOpenChange,
}: UserDetailSheetProps) {
    if (!user) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md">
                <SheetHeader className="mb-8 border-b pb-4">
                    <SheetTitle>Detalhes do Usuário</SheetTitle>
                    <SheetDescription>
                        Informações completas do perfil de {user.name}.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 px-3">
                    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-100 gap-4 dark:bg-slate-900 dark:border-slate-800">
                        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-4 border-white dark:border-slate-800 shadow-sm">
                            <UserIcon className="w-10 h-10" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold text-xl text-slate-900 dark:text-slate-100">{user.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">@{user.username}</p>
                        </div>
                        <div className="flex gap-2">
                            <UserRoleBadge role={user.role} />
                            <UserStatusBadge suspended={user.suspended} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 rounded-lg bg-white border border-slate-100 dark:bg-slate-950 dark:border-slate-800 shadow-sm">
                            <div className="p-2 rounded-md bg-blue-50 text-blue-500 dark:bg-blue-900/20">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">E-mail</p>
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-lg bg-white border border-slate-100 dark:bg-slate-950 dark:border-slate-800 shadow-sm">
                            <div className="p-2 rounded-md bg-purple-50 text-purple-500 dark:bg-purple-900/20">
                                <ShieldUser className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nome de Usuário</p>
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{user.username}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-lg bg-white border border-slate-100 dark:bg-slate-950 dark:border-slate-800 shadow-sm">
                            <div className="p-2 rounded-md bg-orange-50 text-orange-500 dark:bg-orange-900/20">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ID do Sistema</p>
                                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 break-all bg-slate-50 p-1.5 rounded dark:bg-slate-900 border border-slate-100 dark:border-slate-800">{user.id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

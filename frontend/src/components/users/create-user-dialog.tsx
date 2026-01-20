"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { UserForm } from "./user-form";
import z from "zod";
import { formSchema } from "@/app/dashboard/users/schema";
import { User as UserCustom } from "@/types/user";

interface CreateUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>;
    loading?: boolean;
    userLogged: UserCustom;
}

export function CreateUserDialog({
    open,
    onOpenChange,
    onSubmit,
    loading,
    userLogged,
}: CreateUserDialogProps) {
    const handleCancel = () => {
        onOpenChange(false);
    };

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        await onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-125 gap-8">
                <DialogHeader>
                    <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
                </DialogHeader>
                <UserForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    loading={loading}
                    userLogged={userLogged}
                />
            </DialogContent>
        </Dialog>
    );
}

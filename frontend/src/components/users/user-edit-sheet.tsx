"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { UserFormState } from "./user-form";
import { useState } from "react";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import EditUserForm, { editUserSchema, passwordUpdateSchema } from "./user-edit-form";
import { User as UserCustom } from "@/types/user";

interface UserEditSheetProps {
    user: UserCustom | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: z.infer<typeof editUserSchema>) => Promise<void>;
    onPasswordSubmit: (data: z.infer<typeof passwordUpdateSchema>) => Promise<void>;
    loading?: boolean;
    userLogged: UserCustom;
}

export function UserEditSheet({
    user,
    open,
    onOpenChange,
    onSubmit,
    onPasswordSubmit,
    loading,
    userLogged,
}: UserEditSheetProps) {
    const [formState, setFormState] = useState<UserFormState>({
        isValid: false,
        isDirty: false,
    });
    if (!user) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md overflow-y-auto flex flex-col">
                <SheetHeader>
                    <SheetTitle>Editar Usuário</SheetTitle>
                    <SheetDescription>
                        Altere as informações do usuário {user.name}.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col px-4 h-full gap-6 justify-start items-start">
                    <div className="flex flex-col w-full h-fit">
                        <EditUserForm
                            id="edit-user-form"
                            onSubmit={onSubmit}
                            onPasswordSubmit={onPasswordSubmit}
                            loading={loading}
                            user={user}
                            showFooter={false}
                            onStateChange={setFormState}
                            userLogged={userLogged}
                        />
                    </div>
                </div>

                <SheetFooter className="mt-auto">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                        className="bg-red-500/90 hover:bg-red-500/70 text-white hover:text-white"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        form="edit-user-form"
                        disabled={loading || !formState.isValid || !formState.isDirty}
                        className="text-white hover:text-white"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-2"><Check /> Salvar</span>}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

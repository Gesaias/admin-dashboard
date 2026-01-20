"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Eye, EyeOff, LockKeyholeIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { FormError } from "@/components/ui/form-error";
import { formSchema } from "@/app/auth/login/schema";

interface LoginFormProps {
    onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>;
    loading: boolean;
}

export function LoginForm({ onSubmit, loading }: LoginFormProps) {
    const [hidePassword, setHidePassword] = useState<boolean>(true);

    const { control, handleSubmit, formState, reset } = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            identifier: "",
            password: "",
        },
        mode: "onChange",
        resolver: zodResolver(formSchema),
    });

    return (
        <form
            id="login-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            <FieldGroup>
                <Controller
                    control={control}
                    name="identifier"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="login-identifier">
                                Email ou Usuário
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupAddon align="inline-start">
                                    <UserIcon className="w-4 h-4 text-slate-400" />
                                </InputGroupAddon>
                                <InputGroupInput
                                    {...field}
                                    id="login-identifier"
                                    type="text"
                                    placeholder="seu@email.com ou username"
                                    disabled={loading}
                                    className="h-11 transition-all focus:ring-2 focus:ring-blue-500/20"
                                />
                            </InputGroup>
                            <FormError fieldState={fieldState} />
                        </Field>
                    )}
                />

                <Controller
                    control={control}
                    name="password"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="login-password">
                                Senha
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupAddon align="inline-start">
                                    <LockKeyholeIcon className="w-4 h-4 text-slate-400" />
                                </InputGroupAddon>
                                <InputGroupInput
                                    {...field}
                                    id="login-password"
                                    type={hidePassword ? "password" : "text"}
                                    placeholder="••••••••"
                                    disabled={loading}
                                    className="h-11 transition-all focus:ring-2 focus:ring-blue-500/20"
                                />
                                <InputGroupAddon
                                    align="inline-end"
                                    className="cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => setHidePassword(!hidePassword)}
                                >
                                    {hidePassword ? (
                                        <EyeOff className="w-4 h-4 text-slate-400" />
                                    ) : (
                                        <Eye className="w-4 h-4 text-slate-400" />
                                    )}
                                </InputGroupAddon>
                            </InputGroup>
                            <FormError fieldState={fieldState} />
                        </Field>
                    )}
                />
            </FieldGroup>

            <div className="flex flex-col gap-3 pt-2">
                <Button
                    type="submit"
                    className="w-full h-11 font-bold bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all duration-300"
                    disabled={loading || !formState.isValid}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Entrando...
                        </div>
                    ) : (
                        "Acessar Sistema"
                    )}
                </Button>
                
                <Button
                    type="button"
                    variant="ghost"
                    className="w-full h-11 text-slate-500 font-medium hover:text-slate-700 hover:bg-slate-50 transition-all"
                    onClick={() => reset()}
                    disabled={loading || !formState.isDirty}
                >
                    Limpar Campos
                </Button>
            </div>
        </form>
    );
}

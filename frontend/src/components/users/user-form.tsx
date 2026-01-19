"use client";

import { useForm, Controller, ControllerFieldState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react"; 
import z from "zod";
import { UserIcon, Mail, ShieldUser, Lock, LockKeyhole } from "lucide-react";
import { UserRole } from "../../../enums/user-role";
import { formSchema } from "@/app/dashboard/users/schema";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";

interface UserFormProps {
    onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
    defaultValues?: Partial<z.infer<typeof formSchema>>;
}

export function UserForm({ onSubmit, onCancel, loading, defaultValues }: UserFormProps) {
    const { control, formState, handleSubmit, trigger } = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            name: "",
            email: "",
            username: "",
            password: "",
            password_confirmation: "",
            role: UserRole.USER,
            ...defaultValues,
        },
        mode: "onChange",
        reValidateMode: "onChange",
        criteriaMode: "all",
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        trigger("role");
    }, [trigger]);

    return (
        <form
            id="user-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
        >
            <FieldGroup className="flex flex-col gap-4">
                <Controller
                    control={control}
                    name="name"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-register-nome-field">
                                Nome Completo
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupAddon align={"inline-start"}>
                                    <UserIcon />
                                </InputGroupAddon>
                                <InputGroupInput
                                    {...field}
                                    id="form-register-nome-field"
                                    type="text"
                                    placeholder="Insira seu nome completo"
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                    disabled={loading}
                                />
                            </InputGroup>
                            <FormError fieldState={fieldState} />
                        </Field>
                    )}
                />

                <Controller
                    control={control}
                    name="email"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-register-email-field">
                                E-mail
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupAddon align={"inline-start"}>
                                    <Mail />
                                </InputGroupAddon>
                                <InputGroupInput
                                    {...field}
                                    id="form-register-email-input"
                                    type="email"
                                    placeholder="Insira um email válido"
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                    disabled={loading}
                                />
                            </InputGroup>
                            <FormError fieldState={fieldState} />
                        </Field>
                    )}
                />

                <div className="w-full h-fit flex flex-col lg:flex-row gap-2">
                    <div className="w-full">
                        <Controller
                            control={control}
                            name="username"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-register-username-field">
                                        Nome de Usuário
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon align={"inline-start"}>
                                            <ShieldUser />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            {...field}
                                            id="form-register-username-input"
                                            type="text"
                                            placeholder="Insira um nome de usuário"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            disabled={loading}
                                        />
                                    </InputGroup>
                                    <FormError fieldState={fieldState} />
                                </Field>
                            )}
                        />
                    </div>
                    <div className="w-full lg:max-w-[180px]">
                        <Controller
                            control={control}
                            name="role"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-register-role-field">
                                        Permissões
                                    </FieldLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={loading}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Permissão" />
                                        </SelectTrigger>
                                        <SelectContent id="form-register-role-field">
                                            <SelectItem className="hover:cursor-pointer" value={UserRole.ADMIN}>
                                                Admin
                                            </SelectItem>
                                            <SelectItem className="hover:cursor-pointer" value={UserRole.MANAGER}>
                                                Gerente
                                            </SelectItem>
                                            <SelectItem className="hover:cursor-pointer" value={UserRole.USER}>
                                                Usuário
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormError fieldState={fieldState} />
                                </Field>
                            )}
                        />
                    </div>
                </div>

                <div className="w-full h-fit flex flex-col lg:flex-row gap-2">
                    <div className="w-full">
                        <Controller
                            control={control}
                            name="password"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-register-password-field">
                                        Senha
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon align={"inline-start"}>
                                            <Lock />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            {...field}
                                            id="form-register-password-input"
                                            type="text"
                                            placeholder="Insira uma senha"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            disabled={loading}
                                        />
                                    </InputGroup>
                                    <FormError fieldState={fieldState} />
                                </Field>
                            )}
                        />
                    </div>
                    <div className="w-full">
                        <Controller
                            control={control}
                            name="password_confirmation"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-register-password-confirmation-field">
                                        Confirmação de Senha
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon align={"inline-start"}>
                                            <LockKeyhole />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            {...field}
                                            id="form-register-password-confirmation-input"
                                            type="text"
                                            placeholder="Insira a senha novamente"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            disabled={loading}
                                        />
                                    </InputGroup>
                                    <FormError fieldState={fieldState} />
                                </Field>
                            )}
                        />
                    </div>
                </div>
            </FieldGroup>
            <DialogFooter>
                <Button
                    type="button"
                    variant="outline"
                    className="bg-red-500/90 hover:bg-red-500/70 text-white hover:text-white hover:cursor-pointer"
                    size="sm"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="outline"
                    className="bg-green-500 hover:bg-green-500/80 text-white hover:text-white hover:cursor-pointer"
                    size="sm"
                    disabled={loading || !formState.isValid}
                >
                    {loading ? "Salvando..." : "Salvar"}
                </Button>
            </DialogFooter>
        </form>
    );
}

/**
 * Helper component to render field errors in a consistent way.
 */
function FormError({ fieldState }: { fieldState: ControllerFieldState }) {
    if (!fieldState.error) return null;

    if (fieldState.error.types) {
        return (
            <div className="flex flex-col error-container gap-1">
                {Object.entries(fieldState.error.types).map(([type, messages]) => {
                    const messagesArray = (Array.isArray(messages) ? messages : [messages]).filter(
                        (msg): msg is string => typeof msg === "string"
                    );

                    return messagesArray.map((msg, index) => (
                        <div key={`${type}-${index}`} className="flex items-center gap-1.5">
                            <span className="text-black text-[10px]">•</span>
                            <FieldError errors={[{ message: msg }]} />
                        </div>
                    ));
                })}
            </div>
        );
    }

    return (
        <div className="flex flex-col error-container gap-1">
            <div className="flex items-center gap-1.5">
                <span className="text-black text-[10px]">•</span>
                <FieldError errors={[{ message: fieldState.error.message }]} />
            </div>
        </div>
    );
}

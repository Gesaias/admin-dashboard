"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import z from "zod";
import { UserIcon, Mail, ShieldUser, Lock, EyeOff, Eye } from "lucide-react";
import { UserRole } from "../../../enums/user-role";
import { formSchema } from "@/app/dashboard/users/schema";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { User as CustomUser } from "@/types/user";
import { FormError } from "../ui/form-error";

export interface UserFormState {
    isValid: boolean;
    isDirty: boolean;
}

interface UserFormProps {
    id?: string;
    onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
    defaultValues?: Partial<z.infer<typeof formSchema>>;
    showFooter?: boolean;
    showPasswordFields?: boolean;
    onStateChange?: (state: UserFormState) => void;
    userLogged: CustomUser;
}

export function UserForm({
    id = "user-form",
    onSubmit,
    onCancel,
    loading,
    defaultValues,
    showFooter = true,
    showPasswordFields = true,
    onStateChange,
    userLogged,
}: UserFormProps) {
    const [hidePassword, setHidePassword] = useState<boolean>(true);
    const [hidePasswordConfirmation, setHidePasswordConfirmation] =
        useState<boolean>(true);

    const {
        control,
        formState,
        handleSubmit,
        trigger,
        getFieldState: getPasswordFieldsState,
    } = useForm<z.infer<typeof formSchema>>({
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

    useEffect(() => {
        onStateChange?.({
            isValid: formState.isValid,
            isDirty: formState.isDirty,
        });
    }, [formState.isValid, formState.isDirty, onStateChange]);

    return (
        <form id={id} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup className="flex flex-col gap-4">
                <Controller
                    control={control}
                    name="name"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`${id}-nome-field`}>
                                Nome Completo
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupAddon align={"inline-start"}>
                                    <UserIcon />
                                </InputGroupAddon>
                                <InputGroupInput
                                    {...field}
                                    id={`${id}-nome-field`}
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
                            <FieldLabel htmlFor={`${id}-email-field`}>
                                E-mail
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupAddon align={"inline-start"}>
                                    <Mail />
                                </InputGroupAddon>
                                <InputGroupInput
                                    {...field}
                                    id={`${id}-email-input`}
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
                                    <FieldLabel
                                        htmlFor={`${id}-username-field`}
                                    >
                                        Nome de Usuário
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon align={"inline-start"}>
                                            <ShieldUser />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            {...field}
                                            id={`${id}-username-input`}
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
                                    <FieldLabel htmlFor={`${id}-role-field`}>
                                        Permissões
                                    </FieldLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={
                                                    loading ||
                                                    !(
                                                        userLogged?.role ===
                                                            UserRole.ADMIN ||
                                                        userLogged?.role ===
                                                            UserRole.MANAGER
                                                    )
                                                }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Permissão" />
                                        </SelectTrigger>
                                        <SelectContent id={`${id}-role-field`}>
                                            <SelectItem
                                                        className="hover:cursor-pointer"
                                                        value={UserRole.ADMIN}
                                                        disabled={
                                                            !(
                                                                userLogged.role ===
                                                                UserRole.ADMIN
                                                            )
                                                        }
                                                    >
                                                        Admin
                                                    </SelectItem>
                                                    <SelectItem
                                                        className="hover:cursor-pointer"
                                                        value={UserRole.MANAGER}
                                                        disabled={
                                                            !(
                                                                userLogged.role ===
                                                                    UserRole.ADMIN ||
                                                                userLogged.role ===
                                                                    UserRole.MANAGER
                                                            )
                                                        }
                                                    >
                                                        Gerente
                                                    </SelectItem>
                                                    <SelectItem
                                                        className="hover:cursor-pointer"
                                                        value={UserRole.USER}
                                                        disabled={
                                                            !(
                                                                userLogged.role ===
                                                                    UserRole.ADMIN ||
                                                                userLogged.role ===
                                                                    UserRole.MANAGER
                                                            )
                                                        }
                                                    >
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

                {showPasswordFields && (
                    <div className="w-full h-fit flex flex-col lg:flex-row gap-2">
                        <div className="w-full">
                            <Controller
                                control={control}
                                name="password"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel
                                            htmlFor={`${id}-password-field`}
                                        >
                                            Nova Senha
                                        </FieldLabel>
                                        <InputGroup>
                                            <InputGroupAddon
                                                align={"inline-start"}
                                            >
                                                <Lock />
                                            </InputGroupAddon>
                                            <InputGroupInput
                                                {...field}
                                                id={`${id}-password-input`}
                                                type={
                                                    hidePassword
                                                        ? "password"
                                                        : "text"
                                                }
                                                placeholder="Insira uma nova senha"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                autoComplete="new-password"
                                                disabled={loading}
                                            />
                                            <InputGroupAddon
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                align={"inline-end"}
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    setHidePassword(
                                                        !hidePassword,
                                                    )
                                                }
                                            >
                                                {hidePassword ? (
                                                    <EyeOff className="cursor-pointer" />
                                                ) : (
                                                    <Eye className="cursor-pointer" />
                                                )}
                                            </InputGroupAddon>
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
                                        <FieldLabel
                                            htmlFor={`${id}-password-confirmation-field`}
                                        >
                                            Confirmação de Senha
                                        </FieldLabel>
                                        <InputGroup>
                                            <InputGroupAddon
                                                align={"inline-start"}
                                            >
                                                <Lock />
                                            </InputGroupAddon>
                                            <InputGroupInput
                                                {...field}
                                                id={`${id}-password-confirmation-input`}
                                                type={
                                                    hidePasswordConfirmation
                                                        ? "password"
                                                        : "text"
                                                }
                                                placeholder="Confirme a nova senha"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                autoComplete="new-password"
                                                disabled={
                                                    loading ||
                                                    !(
                                                        getPasswordFieldsState(
                                                            "password",
                                                            formState,
                                                        ).isDirty &&
                                                        !getPasswordFieldsState(
                                                            "password",
                                                            formState,
                                                        ).error
                                                    )
                                                }
                                            />
                                            <InputGroupAddon
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                align={"inline-end"}
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    setHidePasswordConfirmation(
                                                        !hidePasswordConfirmation,
                                                    )
                                                }
                                            >
                                                {hidePasswordConfirmation ? (
                                                    <EyeOff className="cursor-pointer" />
                                                ) : (
                                                    <Eye className="cursor-pointer" />
                                                )}
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <FormError fieldState={fieldState} />
                                    </Field>
                                )}
                            />
                        </div>
                    </div>
                )}
            </FieldGroup>
            {showFooter && (
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
                        disabled={
                            loading || !formState.isValid || !formState.isDirty
                        }
                    >
                        {loading ? "Salvando..." : "Salvar"}
                    </Button>
                </DialogFooter>
            )}
        </form>
    );
}

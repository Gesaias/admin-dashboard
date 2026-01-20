"use client";

import { Controller, useForm } from "react-hook-form";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "../ui/field";
import z from "zod";
import { UserRole } from "../../../enums/user-role";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "../ui/input-group";
import {
    Eye,
    EyeOff,
    Lock,
    LockKeyhole,
    Mail,
    ShieldUser,
    UserIcon,
    Loader2,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { User as CustomUser } from "@/types/user";
import { Button } from "../ui/button";
import { FormError } from "../ui/form-error";


const usernameSchema = z
    .string({ message: "Nome de usuário inválido" })
    .min(3, { message: "Nome de usuário muito curto" })
    .max(30, { message: "Nome de usuário muito longo" })
    .regex(
        /^[a-z0-9_-]+$/,
        "Use apenas letras minúsculas, números, hífens ou underlines",
    );

const passwordSchema = z
    .string()
    .max(100, "Senha muito longa")
    .refine((value) => value === "" || value.length >= 6, {
        message: "A senha deve ter no mínimo 6 caracteres",
    })
    .refine((value) => value === "" || /[A-Z]/.test(value), {
        message: "A senha deve conter pelo menos uma letra maiúscula",
    })
    .refine((value) => value === "" || /[a-z]/.test(value), {
        message: "A senha deve conter pelo menos uma letra minúscula",
    })
    .refine((value) => value === "" || /[0-9]/.test(value), {
        message: "A senha deve conter pelo menos um número",
    })
    .refine((value) => value === "" || /[^A-Za-z0-9]/.test(value), {
        message:
            "A senha deve conter pelo menos um caractere especial (@, #, $, etc.)",
    });

export const editUserSchema = z.object({
    name: z.string().min(2, "Nome muito curto").max(100),
    email: z.string().email("Email inválido").max(70),
    username: usernameSchema,
    suspended: z.boolean(),
    role: z.nativeEnum(UserRole),
});

export const passwordUpdateSchema = z
    .object({
        password: passwordSchema,
        password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "As senhas não coincidem",
        path: ["password_confirmation"],
    });

export interface UserFormState {
    isValid: boolean;
    isDirty: boolean;
}

interface UserEditFormProps {
    id?: string;
    onSubmit: (data: z.infer<typeof editUserSchema>) => Promise<void>;
    onPasswordSubmit: (data: z.infer<typeof passwordUpdateSchema>) => Promise<void>;
    loading?: boolean;
    showFooter?: boolean;
    onStateChange?: (state: UserFormState) => void;
    userLogged: CustomUser;
    user: CustomUser;
}

export default function UserEditForm({
    id = "user-form",
    onSubmit,
    onPasswordSubmit,
    loading,
    onStateChange,
    user,
    userLogged,
}: UserEditFormProps) {
    const [hidePassword, setHidePassword] = useState<boolean>(true);
    const [hidePasswordConfirmation, setHidePasswordConfirmation] =
        useState<boolean>(true);
    const [passwordLoading, setPasswordLoading] = useState<boolean>(false);

    const {
        control,
        formState: { isValid, isDirty },
        handleSubmit,
        trigger,
        reset,
    } = useForm<z.infer<typeof editUserSchema>>({
        defaultValues: {
            name: user.name || "",
            email: user.email || "",
            username: user.username || "",
            role: user.role,
            suspended: !!user.suspended,
        },
        mode: "onChange",
        reValidateMode: "onChange",
        criteriaMode: "all",
        resolver: zodResolver(editUserSchema),
    });

    useEffect(() => {
        reset({
            name: user.name || "",
            email: user.email || "",
            username: user.username || "",
            role: user.role,
            suspended: !!user.suspended,
        });
        trigger();
    }, [user.id, user.name, user.email, user.username, user.role, user.suspended, reset, trigger]);

    const {
        control: passwordControl,
        formState: passwordFormState,
        handleSubmit: handlePasswordSubmit,
        getFieldState: getPasswordFieldsState,
        reset: resetPasswordForm,
    } = useForm<z.infer<typeof passwordUpdateSchema>>({
        defaultValues: {
            password: "",
            password_confirmation: "",
        },
        mode: "onChange",
        resolver: zodResolver(passwordUpdateSchema),
    });

    const onInternalPasswordSubmit = async (
        data: z.infer<typeof passwordUpdateSchema>,
    ) => {
        try {
            setPasswordLoading(true);
            await onPasswordSubmit(data);
            resetPasswordForm();
        } finally {
            setPasswordLoading(false);
        }
    };

    useEffect(() => {
        trigger("role");
    }, [trigger]);

    useEffect(() => {
        onStateChange?.({
            isValid,
            isDirty,
        });
    }, [isValid, isDirty, onStateChange]);

    return (
        <form
            id="edit-user-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
        >
            <FieldGroup className="flex flex-col">
                <FieldSet>
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
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel
                                                htmlFor={`${id}-username-field`}
                                            >
                                                Nome de Usuário
                                            </FieldLabel>
                                            <InputGroup>
                                                <InputGroupAddon
                                                    align={"inline-start"}
                                                >
                                                    <ShieldUser />
                                                </InputGroupAddon>
                                                <InputGroupInput
                                                    {...field}
                                                    id={`${id}-username-input`}
                                                    type="text"
                                                    placeholder="Insira um nome de usuário"
                                                    aria-invalid={
                                                        fieldState.invalid
                                                    }
                                                    autoComplete="off"
                                                    disabled={loading}
                                                />
                                            </InputGroup>
                                            <FormError
                                                fieldState={fieldState}
                                            />
                                        </Field>
                                    )}
                                />
                            </div>
                            <div className="w-full lg:max-w-[180px]">
                                <Controller
                                    control={control}
                                    name="role"
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel
                                                htmlFor={`${id}-role-field`}
                                            >
                                                Permissões
                                            </FieldLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                disabled={
                                                    loading ||
                                                    !(
                                                        userLogged.role ===
                                                            UserRole.ADMIN ||
                                                        userLogged.role ===
                                                            UserRole.MANAGER
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Permissão" />
                                                </SelectTrigger>
                                                <SelectContent
                                                    id={`${id}-role-field`}
                                                >
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
                                            <FormError
                                                fieldState={fieldState}
                                            />
                                        </Field>
                                    )}
                                />
                            </div>
                        </div>
                    </FieldGroup>
                </FieldSet>
                {userLogged && (userLogged.role === UserRole.ADMIN || (userLogged.role === UserRole.MANAGER && user.role !== UserRole.ADMIN) || userLogged.id === user.id) && (
                    <FieldSet>
                        <FieldSeparator className="" />
                        <FieldLegend>Atualizar Senha</FieldLegend>
                        <FieldDescription>
                            Atualize a senha do usuário{" "}
                            <strong>{user?.name}</strong>.
                        </FieldDescription>
                        <div className="flex flex-col gap-4">
                            <Controller
                                control={passwordControl}
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
                                                disabled={loading || passwordLoading}
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
                            <Controller
                                control={passwordControl}
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
                                                    passwordLoading ||
                                                    !(
                                                        getPasswordFieldsState(
                                                            "password",
                                                            passwordFormState,
                                                        ).isDirty &&
                                                        !getPasswordFieldsState(
                                                            "password",
                                                            passwordFormState,
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
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={handlePasswordSubmit(onInternalPasswordSubmit)}
                                    disabled={
                                        loading ||
                                        passwordLoading ||
                                        !passwordFormState.isValid ||
                                        !passwordFormState.isDirty
                                    }
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {passwordLoading ? (
                                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                                    ) : (
                                        <LockKeyhole className="w-4 h-4 mr-2" />
                                    )}
                                    Alterar Senha
                                </Button>
                            </div>
                        </div>
                    </FieldSet>
                )}
                {(userLogged.role === UserRole.ADMIN ||
                    userLogged.role === UserRole.MANAGER) && (
                        <>
                            <FieldSet>
                                <FieldSeparator />
                                <FieldLegend>Ações Sobre o Usuário</FieldLegend>
                                <FieldDescription>
                                    Ações que podem ser realizadas sobre o
                                    usuário {user?.name}.
                                </FieldDescription>
                                <FieldGroup>
                                    <Controller
                                        control={control}
                                        name="suspended"
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <FieldLabel
                                                    htmlFor={`${id}-suspended-field`}
                                                >
                                                    Status da Conta
                                                </FieldLabel>
                                                <Select
                                                    value={
                                                        field.value
                                                            ? "true"
                                                            : "false"
                                                    }
                                                    onValueChange={(value) =>
                                                        field.onChange(
                                                            value === "true",
                                                        )
                                                    }
                                                    disabled={loading}
                                                >
                                                    <SelectTrigger
                                                        id={`${id}-suspended-field`}
                                                    >
                                                        <SelectValue placeholder="Selecione o status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem
                                                            className="hover:cursor-pointer"
                                                            value="false"
                                                        >
                                                            Ativo
                                                        </SelectItem>
                                                        <SelectItem
                                                            className="hover:cursor-pointer"
                                                            value="true"
                                                        >
                                                            Suspenso
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormError
                                                    fieldState={fieldState}
                                                />
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>
                            </FieldSet>
                        </>
                    )}
            </FieldGroup>
        </form>
    );
}

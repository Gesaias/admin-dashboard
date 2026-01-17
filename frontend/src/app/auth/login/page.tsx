"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Controller, useForm } from "react-hook-form";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Eye, EyeOff, LockKeyholeIcon, UserIcon } from "lucide-react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { formSchema } from "./schema";
import { ApiError } from "@/app/helpers/api-error";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

function isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError)?.isAxiosError === true;
}

function isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
}

export default function LoginPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const [hidePassword, setHidePassword] = useState<boolean>(true);
    const router: AppRouterInstance = useRouter();

    const { control, formState, setError, handleSubmit, reset } = useForm<
        z.infer<typeof formSchema>
    >({
        defaultValues: {
            identifier: "",
            password: "",
        },
        mode: "onChange",
        reValidateMode: "onChange",
        criteriaMode: "all",
        resolver: zodResolver(formSchema),
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            setLoading(true);

            const res = await signIn("credentials", {
                redirect: false,
                callbackUrl: "/dashboard",
                ...data,
            });

            setLoading(false);

            if (!res || !res.ok) {
                throw new ApiError(res?.status || 500, "Erro ao fazer login");
            }

            router.push("/dashboard");
        } catch (error) {
            let status = 500;
            if (isAxiosError(error)) {
                status = error.response?.status ?? 500;
            } else if (isApiError(error)) {
                status = error.status ?? 500;
            }

            const toastConfig = {
                duration: 5000,
                position: "top-right" as const,
                closeButton: true,
                richColors: true,
                descriptionClassName: "text-sm text-white",
                style: { backgroundColor: "#f87171", color: "white" },
            };

            switch (status) {
                case 401:
                case 403:
                    setError("identifier", {
                        message: "Verifique seu usuário",
                    });
                    setError("password", { message: "Verifique sua senha" });

                    toast.error("Acesso Negado", {
                        description: "Usuário/Email ou senha incorretos.",
                        ...toastConfig,
                    });
                    break;

                case 404:
                    toast.error("Erro de Conexão", {
                        description:
                            "O serviço de login está temporariamente fora do ar.",
                        ...toastConfig,
                    });
                    break;

                default:
                    toast.error("Erro Inesperado", {
                        description: "Tente novamente mais tarde.",
                        ...toastConfig,
                    });
                    break;
            }
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-96">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                        Entre com suas credenciais para acessar o sistema.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        id={"form-login-form-inputs-fields"}
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FieldGroup>
                            <Controller
                                control={control}
                                name="identifier"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-login-identifier-field">
                                            Email/Usuário
                                        </FieldLabel>
                                        <InputGroup>
                                            <InputGroupAddon
                                                align={"inline-start"}
                                            >
                                                <UserIcon />
                                            </InputGroupAddon>
                                            <InputGroupInput
                                                {...field}
                                                id="form-login-identifier-field"
                                                type="text"
                                                placeholder="Entre com seu email ou nome de usuário"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                autoComplete="off"
                                                disabled={loading}
                                            />
                                        </InputGroup>
                                        {fieldState.error && (
                                            <div className="flex flex-col error-container gap-1">
                                                {fieldState.error.types ? (
                                                    Object.entries(
                                                        fieldState.error.types,
                                                    ).map(
                                                        ([type, messages]) => {
                                                            const messagesArray =
                                                                (
                                                                    Array.isArray(
                                                                        messages,
                                                                    )
                                                                        ? messages
                                                                        : [
                                                                              messages,
                                                                          ]
                                                                ).filter(
                                                                    (
                                                                        msg,
                                                                    ): msg is string =>
                                                                        typeof msg ===
                                                                        "string",
                                                                );

                                                            return messagesArray.map(
                                                                (
                                                                    msg,
                                                                    index,
                                                                ) => (
                                                                    <div
                                                                        key={`${type}-${index}`}
                                                                        className="flex items-center gap-1.5"
                                                                    >
                                                                        <span
                                                                            className={
                                                                                "text-black text-[10px]"
                                                                            }
                                                                        >
                                                                            •
                                                                        </span>

                                                                        <FieldError
                                                                            errors={[
                                                                                {
                                                                                    message:
                                                                                        msg,
                                                                                },
                                                                            ]}
                                                                        />
                                                                    </div>
                                                                ),
                                                            );
                                                        },
                                                    )
                                                ) : (
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-black text-[10px]">
                                                            •
                                                        </span>
                                                        <FieldError
                                                            errors={[
                                                                {
                                                                    message:
                                                                        fieldState
                                                                            .error
                                                                            .message,
                                                                },
                                                            ]}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                control={control}
                                name="password"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-login-password-field">
                                            Senha
                                        </FieldLabel>
                                        <InputGroup>
                                            <InputGroupAddon
                                                align={"inline-start"}
                                            >
                                                <LockKeyholeIcon />
                                            </InputGroupAddon>
                                            <InputGroupInput
                                                {...field}
                                                id="form-login-password-field"
                                                type={
                                                    hidePassword
                                                        ? "password"
                                                        : "text"
                                                }
                                                placeholder="Entre com sua senha"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                autoComplete="off"
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

                                        {fieldState.error && (
                                            <div className="flex flex-col error-container gap-1">
                                                {fieldState.error.types ? (
                                                    Object.entries(
                                                        fieldState.error.types,
                                                    ).map(
                                                        ([type, messages]) => {
                                                            const messagesArray =
                                                                (
                                                                    Array.isArray(
                                                                        messages,
                                                                    )
                                                                        ? messages
                                                                        : [
                                                                              messages,
                                                                          ]
                                                                ).filter(
                                                                    (
                                                                        msg,
                                                                    ): msg is string =>
                                                                        typeof msg ===
                                                                        "string",
                                                                );

                                                            return messagesArray.map(
                                                                (
                                                                    msg,
                                                                    index,
                                                                ) => (
                                                                    <div
                                                                        key={`${type}-${index}`}
                                                                        className="flex items-center gap-1.5"
                                                                    >
                                                                        <span
                                                                            className={
                                                                                "text-black text-[10px]"
                                                                            }
                                                                        >
                                                                            •
                                                                        </span>

                                                                        <FieldError
                                                                            errors={[
                                                                                {
                                                                                    message:
                                                                                        msg,
                                                                                },
                                                                            ]}
                                                                        />
                                                                    </div>
                                                                ),
                                                            );
                                                        },
                                                    )
                                                ) : (
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-black text-[10px]">
                                                            •
                                                        </span>
                                                        <FieldError
                                                            errors={[
                                                                {
                                                                    message:
                                                                        fieldState
                                                                            .error
                                                                            .message,
                                                                },
                                                            ]}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <Field
                        orientation={"horizontal"}
                        className="w-full flex justify-between"
                    >
                        <Button
                            type={"button"}
                            variant={"outline"}
                            disabled={loading ? loading : !formState.isDirty}
                            onClick={() => reset()}
                        >
                            Limpar
                        </Button>
                        <Button
                            type="submit"
                            form="form-login-form-inputs-fields"
                            disabled={loading ? loading : !formState.isValid}
                        >
                            {loading ? "Entrando..." : "Entrar"}
                        </Button>
                    </Field>
                </CardFooter>
            </Card>
        </div>
    );
}

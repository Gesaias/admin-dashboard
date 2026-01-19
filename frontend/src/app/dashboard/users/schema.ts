import { z, } from "zod";
import { UserRole } from "../../../../enums/user-role";

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
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .max(100, "Senha muito longa")
    // Verifica se tem ao menos uma letra maiúscula
    .refine((value) => /[A-Z]/.test(value), {
        message: "A senha deve conter pelo menos uma letra maiúscula",
    })
    // Verifica se tem ao menos uma letra minúscula
    .refine((value) => /[a-z]/.test(value), {
        message: "A senha deve conter pelo menos uma letra minúscula",
    })
    // Verifica se tem ao menos um número
    .refine((value) => /[0-9]/.test(value), {
        message: "A senha deve conter pelo menos um número",
    })
    // Verifica se tem ao menos um caractere especial
    .refine((value) => /[^A-Za-z0-9]/.test(value), {
        message:
            "A senha deve conter pelo menos um caractere especial (@, #, $, etc.)",
    });

export const formSchema = z
    .object({
        name: z.string().min(2, "Nome muito curto").max(100),
        email: z.string().email("Email inválido").max(70),
        username: usernameSchema,
        password: passwordSchema,
        password_confirmation: z.string(),
        role: z.nativeEnum(UserRole),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "As senhas não coincidem",
        path: ["password_confirmation"],
    });

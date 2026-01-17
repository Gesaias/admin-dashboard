import z from "zod";

export const formSchema = z.object({
    identifier: z
        .string()
        .min(1, "O campo não pode estar vazio")
        .refine(
            (val) => {
                const isEmail = z.string().email().safeParse(val).success;
                const isUsername = /^[a-z0-9_-]+$/.test(val);
                return isEmail || isUsername;
            },
            {
                message:
                    "Digite um email válido ou um nome de usuário (letras minúsculas, números, _ ou -)",
            },
        )
        .refine((val) => val.length >= 3, "Mínimo de 3 caracteres")
        .refine((val) => val.length <= 30, "Máximo de 30 caracteres"),
    password: z
        .string()
        .min(6, "A senha deve ter no mínimo 6 caracteres")
        .max(100, "Senha muito longa"),
});

import { z } from "zod";

export const authSchema = z.object({
  username: z
    .string()
    .min(3, "Логин должен содержать минимум 3 символа")
    .max(50, "Логин слишком длинный"),
  password: z
    .string()
    .min(8, "Пароль должен содержать минимум 8 символов")
    .max(128, "Пароль слишком длинный"),
});

export type AuthFormValues = z.infer<typeof authSchema>;
import { z } from "zod";


export const noteSchema = z.object({
  name: z
    .string()
    .min(1, "Имя обязательно")
    .max(50, "Имя слишком длинное"),
  description: z
    .string()
    .optional(),
  status: z.enum(["NEW", "DONE", "ARCHIVE"], "Выберите статус"),
});

export type NoteFormValues = z.infer<typeof noteSchema>;
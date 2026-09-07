import type { emailSchema } from "@/pages/Login/types/schemas";
import type z from "zod";


export type PostLoginEmail = z.infer<typeof emailSchema>;
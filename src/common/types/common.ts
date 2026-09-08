import z from "zod";

const RoleTypes = ["admin","field_engineer","client","auditor"] as const;

export type UserType = "admin" | "field_engineer" | "client" | "auditor";


export interface DefaultResponse<D = any> {
    status : boolean;
    data : D;
    message : string;
}

export const userSchema = z.object({
    first_name: z.string(),
    last_name : z.string(),
    email : z.email(),
    address : z.string().min(5,"Address is required"),
    user_type : z.enum(RoleTypes)
})

/**
 * Schema for creating a new account — the edit schema plus a required
 * password, since an edit never resets a password through the main form.
 */
export const createUserSchema = userSchema.extend({
    password: z.string().min(8, "Password must be at least 8 characters"),
})

export interface UserData extends z.infer<typeof userSchema> {
    id : number | string;
    is_active : boolean;
}

/**
 * Shape returned by every list endpoint backed by
 * `QueryRepository::getQuery()` (a Laravel `LengthAwarePaginator`).
 */
export interface PaginatedResponse<D = unknown> {
    current_page : number;
    data : D[];
    last_page : number;
    total : number;
}

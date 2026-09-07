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

export interface UserData extends z.infer<typeof userSchema> {
    id : number | string;
}

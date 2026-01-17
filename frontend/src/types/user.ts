import { UserRole } from "../../enums/user-role";

export type User = {
    id: string;
    name: string;
    email: string;
    username: string;
    role: UserRole;
};
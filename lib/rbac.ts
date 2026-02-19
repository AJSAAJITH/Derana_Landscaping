import { redirect } from "next/navigation";
import { use } from "react";


interface AuthUser {
    role: string;
}

export function requireRole(user: AuthUser | null, role: string[] = []) {

    if (!user) {
        redirect("/sginin");
    }
    if (!role.includes(user.role)) {
        redirect("/404");
    }
    return user;
}
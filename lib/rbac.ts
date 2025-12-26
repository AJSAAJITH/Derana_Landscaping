import { use } from "react";

class HttpError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

interface AuthUser {
    role: string;
}

export function requireRole(user: AuthUser | null, role: string[] = []) {

    if (!user) {
        throw new HttpError("Unauthorized", 401);
    }
    if (!role.includes(user.role)) {
        throw new HttpError("Forbidden", 403);
    }
}
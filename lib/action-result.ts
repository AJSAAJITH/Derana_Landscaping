export type ActionResult<T = undefined> = {
    success: boolean;
    message?: string;
    code?: "VALIDATION_ERROR" | "UNAUTHORIZED" | "NOT_FOUND" | "ALREADY_EXISTS" | "FORBIDDEN" | "CONFLICT" | "SERVER_ERROR";
    fieldErrors?: Record<string, string>;
    data?: T;
};

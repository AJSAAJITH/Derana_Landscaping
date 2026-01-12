export type ActionResult<T = undefined> = {
    success: boolean;
    message?: string;
    code?: "VALIDATION_ERROR" | "UNAUTHORIZED" | "NOT_FOUND" | "CONFLICT" | "SERVER_ERROR";
    fieldErrors?: Record<string, string>;
    data?: T;
};

import { validateStrongPassword } from "./password";

export function validateSupervisorInput(data: {
    name: string;
    email: string;
    phone?: string;
    password: string;

}) {

    const errors: Record<string, string> = {};

    const passwordError = validateStrongPassword(data.password);
    if (passwordError) {
        errors.password = passwordError;
    }

    if (!data.name || data.name.trim().length < 3) {
        errors.name = "Name must be at least 3 characters long";
    }

    if (!data.email || !data.email.includes("@")) {
        errors.email = "Invalid email address";
    }

    if (data.phone && data.phone.length < 10) {
        errors.phone = "Phone number must be at least 10 digits";
    }



    return Object.keys(errors).length ? errors : null;
}
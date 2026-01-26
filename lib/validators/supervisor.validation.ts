import { z } from "zod";

export const supervisorSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters long"),

    email: z
        .string()
        .email("Invalid email address"),

    phone: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .optional()
        .or(z.literal("")),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(
            /[!@#$%^&*(),.?":{}|<>]/,
            "Password must contain at least one special character"
        ),
});

export type SupervisorInput = z.infer<typeof supervisorSchema>;

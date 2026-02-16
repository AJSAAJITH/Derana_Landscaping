"use server"

import { createTodoSchema, updateTodoSchema } from "@/lib/validators/todo.validation"
import { ActionResult } from "@/lib/action-result"
import prisma from "@/lib/prisma"


export async function createTodoAction(
    input: unknown
): Promise<ActionResult> {
    try {
        const validated = createTodoSchema.safeParse(input)

        if (!validated.success) {
            const fieldErrors: Record<string, string> = {}

            validated.error.issues.forEach((issue) => {
                const field = issue.path[0] as string
                fieldErrors[field] = issue.message
            })

            return {
                success: false,
                code: "VALIDATION_ERROR",
                fieldErrors,
            }
        }

        await prisma.todo.create({
            data: {
                title: validated.data.title,
            },
        });

        return {
            success: true,
            message: "Task created successfully",
        }
    } catch (error) {
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Failed to create task",
        }
    }
}

export async function getTodosAction() {
    try {
        const todos = await prisma.todo.findMany({
            orderBy: { createdAt: "desc" },
        })

        return {
            success: true,
            data: todos,
        }
    } catch {
        return {
            success: false,
            message: "Failed to fetch tasks",
        }
    }
}
// toggle
export async function toggleTodoAction(id: string): Promise<ActionResult> {
    try {
        const todo = await prisma.todo.findUnique({ where: { id } })

        if (!todo) {
            return { success: false, code: "NOT_FOUND", message: "Task not found" }
        }

        await prisma.todo.update({
            where: { id },
            data: { completed: !todo.completed },
        })

        return { success: true }
    } catch {
        return { success: false, code: "SERVER_ERROR", message: "Update failed" }
    }
}

// delete
export async function deleteTodoAction(id: string): Promise<ActionResult> {
    try {
        await prisma.todo.delete({ where: { id } })
        return { success: true }
    } catch {
        return { success: false, code: "SERVER_ERROR", message: "Delete failed" }
    }
}

// update
export async function updateTodoAction(
    input: unknown
): Promise<ActionResult> {
    try {
        const validated = updateTodoSchema.safeParse(input)

        if (!validated.success) {
            const fieldErrors: Record<string, string> = {}
            validated.error.issues.forEach((issue) => {
                const field = issue.path[0] as string
                fieldErrors[field] = issue.message
            })

            return {
                success: false,
                code: "VALIDATION_ERROR",
                fieldErrors,
            }
        }

        await prisma.todo.update({
            where: { id: validated.data.id },
            data: { title: validated.data.title },
        })

        return { success: true }
    } catch {
        return { success: false, code: "SERVER_ERROR" }
    }
}



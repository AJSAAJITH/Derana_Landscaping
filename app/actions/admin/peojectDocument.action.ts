"use server"

import { getAuthUser } from "@/lib/auth"
import { requireRole } from "@/lib/rbac"
import { createProjectDocumentSchema } from "@/lib/validators/project.document.validation"
import { ProjectDocumentDTO } from "@/lib/types"
import { ActionResult } from "@/lib/action-result"
import prisma from "@/lib/prisma"

export async function createProjectDocument(
    input: unknown
): Promise<ActionResult<ProjectDocumentDTO>> {
    try {
        const { user } = await getAuthUser()

        if (!user) {
            return {
                success: false,
                code: "UNAUTHORIZED",
                message: "Unauthorized",
            }
        }

        requireRole(user, ["SUPER_ADMIN"]);

        const parsed = createProjectDocumentSchema.safeParse(input)

        if (!parsed.success) {
            const fieldErrors: Record<string, string> = {}

            parsed.error.issues.forEach((err) => {
                const field = err.path[0] as string
                fieldErrors[field] = err.message
            })

            return {
                success: false,
                code: "VALIDATION_ERROR",
                fieldErrors,
                message: "Validation failed",
            }
        }

        const data = parsed.data

        const document = await prisma.projectDocument.create({
            data: {
                projectId: data.projectId,
                title: data.title || null,
                url: data.url,
                fileType: data.fileType,
                uploadedBy: user.id,
            },
        })


        const dto: ProjectDocumentDTO = {
            id: document.id,
            projectId: document.projectId,
            title: document.title,
            url: document.url,
            fileType: document.fileType,
            uploadedBy: document.uploadedBy,
            createdAt: document.createdAt.toISOString(),
        }

        return {
            success: true,
            message: "Document uploaded successfully",
            data: dto,
        }
    } catch (error) {
        console.error("CREATE_PROJECT_DOCUMENT_ERROR:", error)

        return {
            success: false,
            code: "SERVER_ERROR",
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to create document",
        }
    }
}

export async function getProjectDocumentsByProjectId(
    projectId: string
): Promise<ActionResult<ProjectDocumentDTO[]>> {
    try {
        const { user } = await getAuthUser()

        if (!user) {
            return {
                success: false,
                code: "UNAUTHORIZED",
                message: "Unauthorized",
            }
        }

        requireRole(user, ["SUPER_ADMIN"]);

        const documents = await prisma.projectDocument.findMany({
            where: { projectId },
            orderBy: { createdAt: "desc" },
        })

        const dto: ProjectDocumentDTO[] = documents.map((doc) => ({
            id: doc.id,
            projectId: doc.projectId,
            title: doc.title,
            url: doc.url,
            fileType: doc.fileType,
            uploadedBy: doc.uploadedBy,
            createdAt: doc.createdAt.toISOString(),
        }))

        return {
            success: true,
            data: dto,
        }
    } catch (error) {
        console.error("GET_PROJECT_DOCUMENTS_ERROR:", error)

        return {
            success: false,
            code: "SERVER_ERROR",
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to load documents",
        }
    }
}

export async function deleteProjectdocument({ documentId }: { documentId: string }): Promise<ActionResult> {
    try {
        const { user } = await getAuthUser()

        if (!user) {
            return {
                success: false,
                code: "UNAUTHORIZED",
                message: "Unauthorized",
            }
        }
        requireRole(user, ["SUPER_ADMIN"]);

        const existing = await prisma.projectDocument.findUnique({
            where: { id: documentId },
        });

        if (!existing) {
            return { success: false, message: "Document not found", code: "NOT_FOUND" }
        }

        await prisma.projectDocument.delete({
            where: { id: documentId }
        });
        return { success: true, message: "Document deleted successfully" }

    } catch (error) {
        console.error("Document removing falied:", error);
        return {
            success: false,
            code: "SERVER_ERROR",
            message: "Document remving falied",
        }
    }
}
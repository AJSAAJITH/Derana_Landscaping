"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Download, Trash2, Plus } from "lucide-react"
import {
    createProjectDocument,
    deleteProjectdocument,
    getProjectDocumentsByProjectId,
} from "@/app/actions/admin/peojectDocument.action"
import { toast } from "react-toastify"
import { ProjectDocumentDTO } from "@/lib/types"

export function ProjectDocuments({ projectId }: { projectId: string }) {
    const [documents, setDocuments] = useState<ProjectDocumentDTO[]>([])
    const [fileType, setFileType] = useState<"PDF" | "WORD" | "TEXT" | "OTHER">("PDF")
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const [showAddDocument, setShowAddDocument] = useState(false)
    const [newDocTitle, setNewDocTitle] = useState("")
    const [newDocLink, setNewDocLink] = useState("")

    const loadDocuments = async () => {
        setLoading(true)

        const result = await getProjectDocumentsByProjectId(projectId)

        if (!result.success || !result.data) {
            toast.error(result.message || "Failed to load documents")
            setLoading(false)
            return
        }

        setDocuments(result.data)
        setLoading(false)
    }

    const handleAddDocument = async () => {
        const result = await createProjectDocument({
            projectId,
            title: newDocTitle,
            url: newDocLink,
            fileType,
        })

        if (!result.success) {
            if (result.fieldErrors) {
                toast.error(Object.values(result.fieldErrors)[0])
            } else {
                toast.error(result.message || "Failed to upload document")
            }
            return
        }

        toast.success("Document uploaded")

        setNewDocTitle("")
        setNewDocLink("")
        setFileType("PDF")
        setShowAddDocument(false)

        // 🔥 Reload documents after create
        loadDocuments()
    }

    const handleDeleteDocument = async (documentId: string) => {
        if (!confirm("Delete this document?")) return;

        const result = await deleteProjectdocument({ documentId });
        if (!result.success) {
            toast.error(result.message || "Failed to delete document");
        }
        toast.success("Document deleted");
        setDocuments(documents.filter((d) => d.id !== documentId));
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen)
                if (isOpen) {
                    loadDocuments()
                }
            }}
        >
            <DialogTrigger asChild>
                <Button className="gap-2 bg-green-600 hover:bg-green-700 w-full">
                    <FileText className="w-4 h-4" />
                    Documents
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Project Documents</DialogTitle>
                    <DialogDescription>
                        Manage project documents
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">

                    {/* ✅ ADD NEW BUTTON */}
                    <div className="flex justify-end">
                        <Button
                            size="sm"
                            onClick={() => setShowAddDocument(!showAddDocument)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Document
                        </Button>
                    </div>

                    {/* ✅ ADD NEW FORM */}
                    {showAddDocument && (
                        <div className="space-y-2 p-4 border rounded-lg">
                            <Input
                                placeholder="Title"
                                value={newDocTitle}
                                onChange={(e) => setNewDocTitle(e.target.value)}
                            />

                            <Input
                                placeholder="Link"
                                value={newDocLink}
                                onChange={(e) => setNewDocLink(e.target.value)}
                            />

                            {/* File Type Selector */}
                            <select
                                value={fileType}
                                onChange={(e) =>
                                    setFileType(
                                        e.target.value as "PDF" | "WORD" | "TEXT" | "OTHER"
                                    )
                                }
                                className="w-full border rounded-md p-2 text-sm bg-background"
                            >
                                <option value="PDF">PDF</option>
                                <option value="WORD">Word</option>
                                <option value="TEXT">Text</option>
                                <option value="OTHER">Other</option>
                            </select>

                            <div className="flex gap-2">
                                <Button onClick={handleAddDocument}>
                                    Save
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => setShowAddDocument(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* ✅ DOCUMENT LIST */}
                    <div className="space-y-2 max-h-96 overflow-y-auto">

                        {loading ? (
                            <div className="text-center py-6 text-muted-foreground">
                                Loading documents...
                            </div>
                        ) : documents.length === 0 ? (
                            <div className="text-center py-6 text-muted-foreground">
                                No documents uploaded
                            </div>
                        ) : (
                            documents.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-4 h-4 text-green-600" />
                                        <div>
                                            <p className="font-medium">
                                                {doc.title ?? "Untitled"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(doc.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <a href={doc.url} target="_blank">
                                            <Button variant="ghost" size="sm">
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </a>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-600"
                                            onClick={(e) => {
                                                e.stopPropagation() // Prevent card click
                                                handleDeleteDocument(doc.id)
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>

                                    </div>
                                </div>

                            ))
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

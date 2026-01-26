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
import { FileText, Download, Trash2, Edit2, Plus } from "lucide-react"

type Document = {
    id: string
    title: string
    link: string
    uploadDate: string
}

export function ProjectDocuments({ initialDocuments }: { initialDocuments: Document[] }) {
    const [documents, setDocuments] = useState(initialDocuments)
    const [showAddDocument, setShowAddDocument] = useState(false)
    const [newDocTitle, setNewDocTitle] = useState("")
    const [newDocLink, setNewDocLink] = useState("")

    const handleAddDocument = () => {
        if (!newDocTitle || !newDocLink) return

        setDocuments([
            ...documents,
            {
                id: Date.now().toString(),
                title: newDocTitle,
                link: newDocLink,
                uploadDate: new Date().toISOString().split("T")[0],
            },
        ])

        setNewDocTitle("")
        setNewDocLink("")
        setShowAddDocument(false)
    }

    const handleDeleteDocument = (id: string) => {
        if (confirm("Delete this document?")) {
            setDocuments(documents.filter((d) => d.id !== id))
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-green-600 hover:bg-green-700 w-full">
                    <FileText className="w-4 h-4" />
                    Documents
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Project Documents</DialogTitle>
                    <DialogDescription>Manage project documents</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent"
                            >
                                <div className="flex items-center gap-3">
                                    <FileText className="w-4 h-4 text-green-600" />
                                    <div>
                                        <p className="font-medium">{doc.title}</p>
                                        <p className="text-xs text-muted-foreground">{doc.uploadDate}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <a href={doc.link} target="_blank">
                                        <Button variant="ghost" size="sm">
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </a>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600"
                                        onClick={() => handleDeleteDocument(doc.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {showAddDocument ? (
                        <div className="space-y-2 p-4 border rounded-lg bg-green-50">
                            <Input placeholder="Title" value={newDocTitle} onChange={(e) => setNewDocTitle(e.target.value)} />
                            <Input placeholder="Link" value={newDocLink} onChange={(e) => setNewDocLink(e.target.value)} />
                            <div className="flex gap-2">
                                <Button onClick={handleAddDocument}>Save</Button>
                                <Button variant="outline" onClick={() => setShowAddDocument(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button className="w-full gap-2" onClick={() => setShowAddDocument(true)}>
                            <Plus className="w-4 h-4" />
                            Add Document
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

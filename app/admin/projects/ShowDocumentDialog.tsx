"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FileText, Download, Trash2, Plus, Edit2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export interface DocumentItem {
    id: string
    title: string
    link: string
    uploadDate: string
}

interface ShowDocumentDialogProps {
    documents: DocumentItem[]
    setDocuments: (docs: DocumentItem[]) => void
}

export default function ShowDocumentDialog({ documents, setDocuments }: ShowDocumentDialogProps) {
    const [showAddDocument, setShowAddDocument] = useState(false)
    const [newDocTitle, setNewDocTitle] = useState("")
    const [newDocLink, setNewDocLink] = useState("")
    const [editingId, setEditingId] = useState<string | null>(null)

    const handleAddDocument = () => {
        if (!newDocTitle.trim() || !newDocLink.trim()) return

        if (editingId) {
            // update document
            setDocuments(documents.map(d => d.id === editingId ? { ...d, title: newDocTitle, link: newDocLink } : d))
        } else {
            const newDoc = {
                id: Date.now().toString(),
                title: newDocTitle,
                link: newDocLink,
                uploadDate: new Date().toISOString().split("T")[0],
            }
            setDocuments([...documents, newDoc])
        }

        setNewDocTitle("")
        setNewDocLink("")
        setEditingId(null)
        setShowAddDocument(false)
    }

    const handleDeleteDocument = (id: string) => {
        if (confirm("Are you sure you want to delete this document?")) {
            setDocuments(documents.filter(d => d.id !== id))
        }
    }

    const handleEditDocument = (id: string) => {
        const doc = documents.find(d => d.id === id)
        if (!doc) return
        setEditingId(id)
        setNewDocTitle(doc.title)
        setNewDocLink(doc.link)
        setShowAddDocument(true)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-green-600 hover:bg-green-700">
                    <FileText className="w-4 h-4" />
                    Documents
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Project Documents</DialogTitle>
                    <DialogDescription>Manage all documents related to this project</DialogDescription>
                </DialogHeader>

                <CardContent className="space-y-4">
                    {documents.length === 0 && <p className="text-sm text-muted-foreground text-center">No documents yet</p>}

                    {documents.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <FileText className="w-4 h-4 text-green-600" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{doc.title}</p>
                                    <p className="text-xs text-muted-foreground">{doc.uploadDate}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <a href={doc.link} target="_blank" rel="noopener noreferrer">
                                    <Button variant="ghost" size="sm" className="gap-1">
                                        <Download className="w-4 h-4" />
                                        PDF
                                    </Button>
                                </a>
                                <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => handleEditDocument(doc.id)}>
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDeleteDocument(doc.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {/* Add/Edit Document */}
                    {showAddDocument && (
                        <div className="space-y-2 p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                            <Input placeholder="Document Title" value={newDocTitle} onChange={e => setNewDocTitle(e.target.value)} />
                            <Input placeholder="Document Link" value={newDocLink} onChange={e => setNewDocLink(e.target.value)} />
                            <div className="flex gap-2">
                                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleAddDocument}>
                                    Save
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => { setShowAddDocument(false); setNewDocTitle(""); setNewDocLink(""); setEditingId(null) }}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}

                    {!showAddDocument && (
                        <Button className="w-full gap-2 bg-green-600 hover:bg-green-700" onClick={() => setShowAddDocument(true)}>
                            <Plus className="w-4 h-4" />
                            Add New Document
                        </Button>
                    )}
                </CardContent>
            </DialogContent>
        </Dialog>
    )
}

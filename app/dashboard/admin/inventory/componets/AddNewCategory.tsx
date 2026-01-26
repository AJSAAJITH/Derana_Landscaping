"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { CreateMetirialCategory } from "@/app/actions/material-category.action"
import { toast } from "react-toastify"

interface AddNewCategoryDialogProps {
    onCreated?: () => void // 🔁 refresh categories
}

export default function AddNewCategoryDialog({
    onCreated,
}: AddNewCategoryDialogProps) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setError(null)
        setLoading(true)

        const res = await CreateMetirialCategory({ name })

        if (!res.success) {
            setError(res.message ?? res.fieldErrors?.name ?? null);
            setLoading(false);
            return
        }

        setName("")
        setOpen(false)
        setLoading(false)
        onCreated?.()
        toast.success(res.message);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Category
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                        Create a new material category
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    <Input
                        placeholder="Category name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}

                    <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={handleSubmit}
                        disabled={loading || !name.trim()}
                    >
                        {loading ? "Creating..." : "Create Category"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

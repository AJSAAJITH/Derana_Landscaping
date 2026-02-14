"use client"

import React, { useEffect } from "react"

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { InventoryItemDTO } from "@/lib/types"
import { MaterialCategory } from "@/app/generated/prisma"
import { getMaterialCategories } from "@/app/actions/admin/material-category.action"
import { createInventoryItem } from "@/app/actions/admin/inventory.action"
import { toast } from "react-toastify"

const UNITS = ["kg", "L", "pcs", "cubic meter", "meters", "boxes", "bundles"]

interface CreateNewItemDialogProps {
    children: React.ReactNode
    onItemCreated: (item: InventoryItemDTO) => void
}

export function CreateNewItemDialog({ children, onItemCreated }: CreateNewItemDialogProps) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [unit, setUnit] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState<MaterialCategory[]>([]);

    const loadCategories = async () => {
        const result = await getMaterialCategories();
        if (result.success) {
            setCategories(result.data ?? []);
        }
    }

    const handleCreate = async () => {
        setErrors({});
        setLoading(true);

        const result = await createInventoryItem({
            name,
            categoryId,
            unit
        });
        setLoading(false);

        if (!result.success) {
            if (result.code === "VALIDATION_ERROR" && result.fieldErrors) {
                setErrors(result.fieldErrors)
                toast.error("Please fix the highlighted errors");
                return;
            }
            // duplicate or server Error
            toast.error(result.message ?? "Failed to create inventory item");
            return;
        }
        toast.success(result.message ?? "Item Created");
        onItemCreated(result.data!);

        resetForm();
        setOpen(false);
    }

    const resetForm = () => {
        setName("")
        setCategoryId("")
        setUnit("")
    }

    useEffect(() => {
        loadCategories();
    }, [])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Inventory Item</DialogTitle>
                    <DialogDescription>Create a new inventory item to add to the project</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Item Name</label>
                        <Input
                            placeholder=""
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1"
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium">Category</label>
                        <Select value={categoryId} onValueChange={setCategoryId}>
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.categoryId && (
                            <p className="text-sm text-red-500 mt-1">{errors.categoryId}</p>
                        )}

                    </div>

                    <div>
                        <label className="text-sm font-medium">Unit</label>
                        <Select value={unit} onValueChange={setUnit}>
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                                {UNITS.map((u) => (
                                    <SelectItem key={u} value={u}>
                                        {u}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.unit && (
                            <p className="text-sm text-red-500 mt-1">{errors.unit}</p>
                        )}

                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button
                            onClick={handleCreate}
                            disabled={loading}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                            {loading ? "Creating..." : "Create Item"}
                        </Button>

                        <Button
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={() => {
                                resetForm()
                                setOpen(false)
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

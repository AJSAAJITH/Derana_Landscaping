"use client"

import { useState, useTransition } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createSupplierAction } from "@/app/actions/admin/suplier.action"
import { toast } from "react-toastify"
import { SupplierResponseDTO } from "@/lib/types"

interface SupplierFormData {
    id?: string
    name: string
    phone: string
    email: string
    address: string
    company: string
    isActive: boolean
}

interface SupplierDialogProps {
    editingSupplier?: SupplierResponseDTO | null
    isOpen?: boolean
    onOpenChange?: (open: boolean) => void
    onSuccess?: () => void
}

export function SupplierDialog({ editingSupplier, isOpen, onOpenChange, onSuccess }: SupplierDialogProps) {
    const [open, setOpen] = useState(isOpen || false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isPending, startTransition] = useTransition();

    const [formData, setFormData] = useState<SupplierFormData>(
        editingSupplier
            ? {
                name: editingSupplier.name,
                phone: editingSupplier.phone,
                email: editingSupplier.email ?? "",
                address: editingSupplier.address ?? "",
                company: editingSupplier.company ?? "",
                isActive: editingSupplier.isActive,
            }
            : {
                name: "",
                phone: "",
                email: "",
                address: "",
                company: "",
                isActive: true,
            }
    )


    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        onOpenChange?.(newOpen)
        if (!newOpen) {
            resetForm()
        }
    }

    const resetForm = () => {
        setFormData({
            name: "",
            phone: "",
            email: "",
            address: "",
            company: "",
            isActive: true,
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        startTransition(async () => {
            const result = await createSupplierAction(formData)

            if (!result.success) {
                if (result.fieldErrors) {
                    setErrors(result.fieldErrors)
                }
                return
            }

            // Success
            toast.success("New suplier created");
            resetForm()
            handleOpenChange(false)
            onSuccess?.();
        })
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto">
                    <Plus className="w-4 h-4" />
                    Add Supplier
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>{editingSupplier ? "Edit Supplier" : "Add New Supplier"}</span>
                        <button
                            onClick={() => handleOpenChange(false)}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </DialogTitle>
                    <DialogDescription>
                        {editingSupplier ? "Update supplier information" : "Fill in the details to add a new supplier"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Supplier Name */}
                    <div>
                        <Label htmlFor="name" className="text-sm font-medium">
                            Supplier Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter supplier name"
                            className="mt-1"
                            required
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <Label htmlFor="phone" className="text-sm font-medium">
                            Phone
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                                setFormData({ ...formData, phone: e.target.value })
                            }
                        />

                        {errors.phone && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Enter email address"
                            className="mt-1"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Address */}
                    <div>
                        <Label htmlFor="address" className="text-sm font-medium">
                            Address
                        </Label>
                        <Textarea
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Enter supplier address"
                            rows={3}
                            className="mt-1"
                        />
                    </div>
                    {/* company */}
                    <div>
                        <Label htmlFor="email" className="text-sm font-medium">
                            Company
                        </Label>
                        <Input
                            id="company"
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            placeholder="Enter company name"
                            className="mt-1"
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            className="flex-1 sm:flex-none"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700"
                        >
                            {isPending ? "Saving..." : editingSupplier ? "Update" : "Add"} Supplier
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

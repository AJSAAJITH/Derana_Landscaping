"use client"

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
import { Plus, AlertTriangle } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AddnewInventroyItem({
    open,
    onOpenChange,
    isEditing,
    categories,
    formData,
    setFormData,
    onSave,
    onReset,
    error,
    loading,
}: any) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button
                    className="gap-2 bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                    onClick={onReset}
                >
                    <Plus className="w-4 h-4" />
                    Add Item
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Update Item" : "Add New Item"}
                    </DialogTitle>
                    <DialogDescription>
                        Manage inventory item details
                    </DialogDescription>
                </DialogHeader>

                {/* Error */}
                {error && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-4">
                    {/* Item Name */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            Item Name
                        </label>
                        <Input
                            placeholder="e.g. Cement Bag"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            Category
                        </label>
                        <Select
                            value={formData.category}
                            onValueChange={(value) =>
                                setFormData({ ...formData, category: value })
                            }
                            disabled={categories.length === 0}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat: any) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Unit & Quantity */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                Unit
                            </label>
                            <Input
                                placeholder="pcs / kg / L"
                                value={formData.unit}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        unit: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                {isEditing ? "Add Quantity" : "Initial Quantity"}
                            </label>

                            <Input
                                type="number"
                                placeholder="0"
                                value={formData.quantity}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        quantity: Number(e.target.value) || 0,
                                    })
                                }
                            />

                            {isEditing && (
                                <p className="text-[11px] text-muted-foreground">
                                    Stock can be added only when current quantity is below or equal to threshold
                                </p>
                            )}
                        </div>

                    </div>

                    {/* Threshold & Unit Cost */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                Threshold
                            </label>
                            <Input
                                type="number"
                                placeholder="Low stock alert level"
                                value={formData.threshold}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        threshold: Number(e.target.value) || 0,
                                    })
                                }
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                Unit Cost (LKR)
                            </label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={formData.unitCost}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        unitCost: Number(e.target.value) || 0,
                                    })
                                }
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={onSave}
                            disabled={loading || categories.length === 0}
                        >
                            {loading
                                ? "Saving..."
                                : isEditing
                                    ? "Update Item"
                                    : "Add Item"}
                        </Button>

                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

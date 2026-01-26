"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Edit2, Trash2, ArrowLeft } from "lucide-react"
import type { InventoryItem } from "@/lib/types"
import Link from "next/link"
import AddnewInventroyItem from "./componets/AddnewInventoryItem"
import { MaterialCategory } from "@/app/generated/prisma"
import { getMaterialCategories } from "@/app/actions/material-category.action"
import AddNewCategoryDialog from "./componets/AddNewCategory"
import { createInventoryItem, deleteInventoryItem, getAllInventoryItems, updateInventoryItem } from "@/app/actions/inventory.action"
import { toast } from "react-toastify"


export default function InventoryClient() {
    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId")
    // use Filtering, create item, UI lables
    const isProjectContext = Boolean(projectId);

    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        unit: "",
        quantity: 0,
        threshold: 0,
        unitCost: 0,
    });
    const [categories, setCategories] = useState<MaterialCategory[]>([]);

    const loadCategories = async () => {
        const result = await getMaterialCategories();
        if (result.success) setCategories(result.data ?? []);
    }

    const loadInventory = async () => {
        if (!projectId) return;

        setLoading(true);
        const res = await getAllInventoryItems(projectId);

        if (res.success) {
            setInventory(res.data ?? [])
            setError(null);
        } else {
            setError(res.message ?? "Failed to load Inventory");
        }
        setLoading(false);
    };

    const getInventoryStatus = (item: InventoryItem): "in-stock" | "low-stock" | "critical" => {
        if (!item.threshold) return "in-stock"
        const percentage = (item.quantity / item.threshold) * 100
        if (percentage < 25) return "critical"
        if (percentage < 75) return "low-stock"
        return "in-stock"
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "in-stock":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            case "low-stock":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            case "critical":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            default:
                return ""
        }
    }

    const lowStockItems = inventory.filter((item) => getInventoryStatus(item) !== "in-stock")


    const handleSaveItem = async () => {
        if (!projectId) return;

        setLoading(true);
        setError(null);

        const payload = {
            projectId,
            name: formData.name.trim(),
            categoryId: formData.category,
            unit: formData.unit || undefined,
            threshold: formData.threshold || undefined,
            unitCost: formData.unitCost || undefined,
        };

        const res = editingItem
            ? await updateInventoryItem({
                id: editingItem.id,
                ...payload,
                addQuantity: formData.quantity,
            })
            : await createInventoryItem({
                ...payload,
                quantity: formData.quantity,
            });

        if (!res.success) {
            const errorMessage =
                res.message ||
                res.fieldErrors?.name ||
                res.fieldErrors?.categoryId ||
                "Operation failed";

            setError(errorMessage);
            toast.error(errorMessage);
            setLoading(false);
            return;
        }

        toast.success(res.message);
        await loadInventory();
        resetForm();
        setOpenAddDialog(false);
        setLoading(false);
    };



    const handleEditItem = (item: InventoryItem & { categoryId?: string }) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            category: item.categoryId || "",
            unit: item.unit || "",
            quantity: 0,
            threshold: item.threshold || 0,
            unitCost: item.unitCost || 0,
        });
        setOpenAddDialog(true);
    };


    const handleDeleteItem = async (id: string) => {
        if (!projectId) return;

        const confirmed = confirm(
            "Are you sure you want to delete this inventory item?"
        );

        if (!confirmed) return;

        setLoading(true);
        setError(null);

        const res = await deleteInventoryItem({
            id,
            projectId,
        });

        if (!res.success) {
            const msg =
                res.message ||
                res.fieldErrors?.id ||
                "Failed to delete inventory item";

            setError(msg);
            toast.error(msg);
            setLoading(false);
            return;
        }

        toast.success(res.message);

        // Refresh inventory list
        await loadInventory();

        setLoading(false);
    };


    const resetForm = () => {
        setFormData({
            name: "",
            category: "",
            unit: "",
            quantity: 0,
            threshold: 0,
            unitCost: 0,
        })
        setEditingItem(null)
    }

    useEffect(() => {
        loadCategories();
        loadInventory();
    }, [projectId]);

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6">
            {/* Back Button */}
            <Link href={`/dashboard/admin/projects/${projectId}`}>
                <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Projects
                </Button>
            </Link>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Inventory Management</h1>
                    {projectId && <p className="text-muted-foreground mt-1 text-sm">Project-specific inventory items</p>}
                    {!projectId && <p className="text-muted-foreground mt-1 text-sm">Track inventory items and stock levels</p>}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ">
                    {/* add new Inventory Item */}
                    <AddnewInventroyItem
                        projectId={projectId}
                        open={openAddDialog}
                        onOpenChange={setOpenAddDialog}
                        isEditing={Boolean(editingItem)}
                        categories={categories}
                        formData={formData}
                        setFormData={setFormData}
                        onSave={handleSaveItem}
                        onReset={resetForm}
                        error={error}
                        loading={loading}
                    />

                    {/* add new category */}
                    <AddNewCategoryDialog onCreated={loadCategories} />

                    {categories.length === 0 && (
                        <p className="text-sm text-muted-foreground px-2">
                            No categories available yet
                        </p>
                    )}

                </div>

            </div>

            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
                <Alert className="border-yellow-300 bg-yellow-50 dark:bg-yellow-950">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                        {lowStockItems.length} items are low in stock or critical. Please reorder soon.
                    </AlertDescription>
                </Alert>
            )}

            {/* Inventory Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Card className="border-border shadow-sm">
                    <CardHeader className="pb-2 sm:pb-3">
                        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl sm:text-3xl font-bold">{inventory.length}</p>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                    <CardHeader className="pb-2 sm:pb-3">
                        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">In Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl sm:text-3xl font-bold text-green-600">
                            {inventory.filter((i) => getInventoryStatus(i) === "in-stock").length}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                    <CardHeader className="pb-2 sm:pb-3">
                        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
                            {inventory.filter((i) => getInventoryStatus(i) === "low-stock").length}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                    <CardHeader className="pb-2 sm:pb-3">
                        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Critical</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl sm:text-3xl font-bold text-red-600">
                            {inventory.filter((i) => getInventoryStatus(i) === "critical").length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Inventory Table */}
            <Card className="border-border shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Inventory Items</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                        {projectId ? "Project-specific inventory items" : "All inventory items"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-semibold text-xs sm:text-sm">Item Name</TableHead>
                                    <TableHead className="font-semibold text-xs sm:text-sm">Category</TableHead>
                                    <TableHead className="font-semibold text-xs sm:text-sm">Unit</TableHead>
                                    <TableHead className="font-semibold text-xs sm:text-sm ">Qty</TableHead>
                                    <TableHead className="font-semibold text-xs sm:text-sm ">Threshold</TableHead>
                                    <TableHead className="font-semibold text-xs sm:text-sm ">Price</TableHead>
                                    <TableHead className="font-semibold text-xs sm:text-sm">Status</TableHead>
                                    <TableHead className="font-semibold text-xs sm:text-sm">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inventory.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-sm">
                                            No inventory items found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    inventory.map((item) => {
                                        const status = getInventoryStatus(item)
                                        return (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium text-xs sm:text-sm">{item.name}</TableCell>
                                                <TableCell className="text-muted-foreground text-xs sm:text-sm">
                                                    {item.category || "N/A"}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-xs sm:text-sm">{item.unit || "pcs"}</TableCell>
                                                <TableCell className="font-semibold text-xs sm:text-sm ">{item.quantity}</TableCell>
                                                <TableCell className="text-muted-foreground text-xs sm:text-sm ">
                                                    {item.threshold || "N/A"}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-xs sm:text-sm ">
                                                    {item.unitCost ? `LKR ${item.unitCost}` : "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={`text-xs sm:text-sm ${getStatusColor(status)}`}>
                                                        {status === "in-stock" ? "In Stock" : status === "low-stock" ? "Low" : "Critical"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-blue-600 hover:text-blue-700 h-8 w-8 p-0"
                                                            onClick={() => handleEditItem(item)}
                                                            title="Edit"
                                                        >
                                                            <Edit2 className="w-4 h-4" />

                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                                                            onClick={() => handleDeleteItem(item.id)}
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

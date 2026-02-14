"use client"

import { useEffect, useState } from "react"
import { InventoryStats } from "./componets/inventory.status"
import { InventoryTable } from "./componets/inventory.table"
import { LowStockAlert } from "./componets/low.stock.alert"
import { AddItemDialog } from "./componets/add.item.dialog"
import type { ProjectInventorItemDTO } from "@/lib/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { getMaterialCategories } from "@/app/actions/admin/material-category.action"
import { getProjectInventoryItems } from "@/app/actions/admin/inventory.action"
import { MaterialCategory } from "@/app/generated/prisma"
import AddNewCategoryDialog from "./componets/AddNewCategory"
import { UpdateProjectInventoryItemDialog } from "./componets/update.projectInventory.Item"
import { DeleteProjectInventoryItemDialog } from "./componets/delete.project.inventory.item.dialog"
import { SkeletonTable } from "@/components/SkeletonTableView"

export default function InventoryPage() {
    const searchParams = useSearchParams()
    const projectId = searchParams.get("projectId") || ""

    const [categories, setCategories] = useState<MaterialCategory[]>([])
    const [inventory, setInventory] = useState<ProjectInventorItemDTO[]>([])
    const [loading, setLoading] = useState(true)

    const [editingItem, setEditingItem] = useState<ProjectInventorItemDTO | null>(null);
    const [editOpen, setEditOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadInventory = async () => {
        if (!projectId) return
        setLoading(true)
        const res = await getProjectInventoryItems(projectId)
        if (res.success) {
            setInventory(res.data ?? [])
        }
        setLoading(false)
    }

    const loadCategories = async () => {
        const result = await getMaterialCategories()
        if (result.success) {
            setCategories(result.data ?? [])
        }
    }

    useEffect(() => {
        loadInventory()
        loadCategories()
    }, [projectId])

    // ✅ CALLED WHEN USER CLICKS EDIT BUTTON
    const handleEdit = (item: ProjectInventorItemDTO) => {
        setEditingItem(item)
        setEditOpen(true)
    }

    const handleDeleteClick = (id: string) => {
        setDeletingId(id);
        setDeleteOpen(true);
    };

    const getInventoryStatus = (item: ProjectInventorItemDTO) => {
        if (!item.threshold) return "in-stock"
        const percentage = (item.quantity / item.threshold) * 100
        if (percentage < 25) return "critical"
        if (percentage < 75) return "low-stock"
        return "in-stock"
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6">
            <Link href={`/dashboard/admin/projects/${projectId}`}>
                <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Project
                </Button>
            </Link>

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Project Inventory</h1>
                    <p className="text-muted-foreground">
                        Manage inventory items for this project
                    </p>
                </div>

                <div className="flex gap-3">
                    <AddItemDialog
                        projectId={projectId}
                        onSuccess={loadInventory}
                    />
                    <AddNewCategoryDialog onCreated={loadCategories} />
                </div>
            </div>

            <LowStockAlert items={inventory} getStatus={getInventoryStatus} />
            <InventoryStats items={inventory} getStatus={getInventoryStatus} />


            {loading ? (
                <SkeletonTable />
            ) : (
                <InventoryTable
                    items={inventory}
                    getStatus={getInventoryStatus}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    projectId={projectId}
                />
            )}

            {/* ✅ EDIT DIALOG */}
            <UpdateProjectInventoryItemDialog
                open={editOpen}
                item={editingItem}
                onClose={() => setEditOpen(false)}
                onUpdated={loadInventory}
            />
            {/* ✅ DELETE DIALOG */}
            <DeleteProjectInventoryItemDialog
                open={deleteOpen}
                projectInventoryId={deletingId}
                onClose={() => setDeleteOpen(false)}
                onDeleted={loadInventory}
            />
        </div>
    )
}

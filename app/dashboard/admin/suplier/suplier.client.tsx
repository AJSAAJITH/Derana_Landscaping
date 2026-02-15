"use client"

import { useEffect, useState } from "react"
import { SupplierStats } from "./components/suplier-stats"
import { SupplierSearch } from "./components/suplier-search"
import { SupplierDialog } from "./components/suplier-dialog"
import { SupplierTable } from "./components/suplier-table"
import { getSuppliersAction } from "@/app/actions/admin/suplier.action"
import { success } from "zod"
import { toast } from "react-toastify"
import { ActionResult } from "@/lib/action-result"
import { SupplierResponseDTO } from "@/lib/types"

interface Supplier {
    id: string
    name: string
    phone: string
    email: string
    address: string
    company: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}



export default function SupplierClientPage() {
    const [suppliers, setSuppliers] = useState<SupplierResponseDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [editingSupplier, setEditingSupplier] = useState<SupplierResponseDTO | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const loadSuppliers = async () => {
        setLoading(true);

        const result = await getSuppliersAction();

        if (!result.success || !result.data) {
            toast.error("Suppliers not found to load");
            setLoading(false);
            return;
        }

        // Map to ensure all required fields are not null/undefined
        const mappedSuppliers: SupplierResponseDTO[] = result.data.map((s) => ({
            ...s,
            email: s.email ?? "",
            address: s.address ?? "",
            company: s.company ?? "",
        }));

        setSuppliers(mappedSuppliers);
        setLoading(false);
    };


    // Filter suppliers based on search and status
    const filteredSuppliers = suppliers.filter((supplier) => {
        const searchLower = searchValue.toLowerCase();

        const matchesSearch =
            supplier.name.toLowerCase().includes(searchLower) ||
            (supplier.email?.toLowerCase().includes(searchLower) ?? false) ||
            supplier.phone.includes(searchValue);

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && supplier.isActive) ||
            (statusFilter === "inactive" && !supplier.isActive);

        return matchesSearch && matchesStatus;
    });


    const handleEditSupplier = (supplier: SupplierResponseDTO) => {
        setEditingSupplier(supplier);
        setIsDialogOpen(true);
    }

    const handleDeleteSupplier = () => {
        loadSuppliers();
    }

    const stats = {
        total: suppliers.length,
        active: suppliers.filter((s) => s.isActive).length,
        inactive: suppliers.filter((s) => !s.isActive).length,
    }

    useEffect(() => {
        loadSuppliers();
    }, []);

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Supplier Management</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Manage your suppliers and vendors</p>
                </div>
                <SupplierDialog
                    editingSupplier={editingSupplier}
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    onSuccess={() => loadSuppliers()} />
            </div>

            {/* Stats */}
            <SupplierStats totalSuppliers={stats.total} activeSuppliers={stats.active} inactiveSuppliers={stats.inactive} />

            {/* Search & Filter */}
            <SupplierSearch
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
            />

            {/* Supplier Table */}
            <SupplierTable
                suppliers={filteredSuppliers}
                onEdit={handleEditSupplier}
                onDelete={handleDeleteSupplier}
                onRefresh={loadSuppliers}
            />
        </div>
    )
}

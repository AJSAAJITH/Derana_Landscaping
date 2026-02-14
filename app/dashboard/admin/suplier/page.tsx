"use client"

import { useState } from "react"
import { SupplierStats } from "./components/suplier-stats"
import { SupplierSearch } from "./components/suplier-search"
import { SupplierDialog } from "./components/suplier-dialog"
import { SupplierTable } from "./components/suplier-table"

interface Supplier {
    id: string
    name: string
    phone: string
    email: string
    address: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

const MOCK_SUPPLIERS: Supplier[] = [
    {
        id: "1",
        name: "Green Supplies Co.",
        phone: "+94-11-2345678",
        email: "contact@greensupplies.com",
        address: "123 Garden Lane, Colombo, Sri Lanka",
        isActive: true,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
    },
    {
        id: "2",
        name: "Landscape Materials Inc.",
        phone: "+94-77-9876543",
        email: "sales@landscapematerials.com",
        address: "456 Nature Road, Kandy, Sri Lanka",
        isActive: true,
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-02-01"),
    },
    {
        id: "3",
        name: "Soil & Fertilizer Ltd.",
        phone: "+94-21-5555555",
        email: "info@soilfertilizer.com",
        address: "789 Agriculture Ave, Galle, Sri Lanka",
        isActive: true,
        createdAt: new Date("2024-02-10"),
        updatedAt: new Date("2024-02-10"),
    },
    {
        id: "4",
        name: "Garden Tools Direct",
        phone: "+94-112-3333333",
        email: "sales@gardentools.com",
        address: "321 Equipment Street, Negombo, Sri Lanka",
        isActive: false,
        createdAt: new Date("2023-12-20"),
        updatedAt: new Date("2024-01-05"),
    },
    {
        id: "5",
        name: "Premium Plant Nursery",
        phone: "+94-33-4444444",
        email: "nursery@premiumplants.com",
        address: "654 Botanical Drive, Matara, Sri Lanka",
        isActive: true,
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-20"),
    },
]

export default function SupplierPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS)
    const [searchValue, setSearchValue] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Filter suppliers based on search and status
    const filteredSuppliers = suppliers.filter((supplier) => {
        const searchLower = searchValue.toLowerCase()
        const matchesSearch =
            supplier.name.toLowerCase().includes(searchLower) ||
            supplier.email.toLowerCase().includes(searchLower) ||
            supplier.phone.includes(searchValue)

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && supplier.isActive) ||
            (statusFilter === "inactive" && !supplier.isActive)

        return matchesSearch && matchesStatus
    })

    const handleAddSupplier = (data: any) => {
        if (editingSupplier) {
            // Update existing supplier
            setSuppliers(
                suppliers.map((s) =>
                    s.id === editingSupplier.id
                        ? {
                            ...s,
                            ...data,
                            updatedAt: new Date(),
                        }
                        : s
                )
            )
            setEditingSupplier(null)
        } else {
            // Add new supplier
            const newSupplier: Supplier = {
                id: Math.random().toString(36).substr(2, 9),
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
            setSuppliers([...suppliers, newSupplier])
        }
    }

    const handleEditSupplier = (supplier: Supplier) => {
        setEditingSupplier(supplier)
        setIsDialogOpen(true)
    }

    const handleDeleteSupplier = (id: string) => {
        setSuppliers(suppliers.filter((s) => s.id !== id))
    }

    const stats = {
        total: suppliers.length,
        active: suppliers.filter((s) => s.isActive).length,
        inactive: suppliers.filter((s) => !s.isActive).length,
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Supplier Management</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Manage your suppliers and vendors</p>
                </div>
                <SupplierDialog onSubmit={handleAddSupplier} editingSupplier={editingSupplier} isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
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
            />
        </div>
    )
}

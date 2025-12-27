"use client"

import React, { useEffect, useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Eye, Lock, Plus, Trash2 } from "lucide-react"
import { User } from "@/lib/types"
import CreateSupervisorModal from "./create-supervisor-account"

/* Sample Data */
const SAMPLE_SUPERVISORS: User[] = Array.from({ length: 23 }).map((_, i) => ({
    id: String(i + 1),
    clerkId: `clerk_${i + 1}`,
    name: `Supervisor ${i + 1}`,
    email: `supervisor${i + 1}@derana.com`,
    phone: `+9477${1000000 + i}`,
    role: "SUPERVISOR",
    createdAt: new Date(),
}))

const ITEMS_PER_PAGE = 10

export default function UserPage() {
    const [users, setUsers] = useState<User[]>(SAMPLE_SUPERVISORS)
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [isModalOpen, setIsModalOpen] = useState(false)

    /* Reset page when search changes */
    useEffect(() => {
        setCurrentPage(1)
    }, [search])

    const filteredUsers = users.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase()) ||
            u.phone?.includes(search)
    )

    const totalPages = Math.max(
        1,
        Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
    )

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const handleCreateSupervisor = (data: any) => {
        const newUser: User = {
            id: crypto.randomUUID(),
            clerkId: `clerk_${users.length + 1}`,
            name: data.name,
            email: data.email,
            phone: data.phone,
            role: "SUPERVISOR",
            createdAt: new Date(),
        }

        setUsers((prev) => [...prev, newUser])
        setIsModalOpen(false)
    }

    const handleDelete = (id: string) => {
        setUsers((prev) => prev.filter((u) => u.id !== id))
        setCurrentPage((p) => Math.max(1, p - 1))
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Users Management</h1>
                    <p className="text-muted-foreground">
                        Manage supervisors and their access
                    </p>
                </div>

                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="gap-2 bg-green-600 hover:bg-green-700"
                >
                    <Plus className="w-4 h-4" />
                    Create Supervisor
                </Button>
            </div>

            <CreateSupervisorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateSupervisor}
            />

            {/* Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:justify-between gap-3">
                        <div>
                            <CardTitle>Supervisors List</CardTitle>
                            <CardDescription>
                                Total supervisors: {filteredUsers.length}
                            </CardDescription>
                        </div>

                        <input
                            type="text"
                            placeholder="Search by name, email, or phone"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full md:w-64 rounded-md border px-3 py-2 text-sm"
                        />
                    </div>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {paginatedUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phone}</TableCell>
                                        <TableCell>
                                            <Badge className="bg-green-100 text-green-800">
                                                Active
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString("en-LK")
                                                : "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="ghost">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost">
                                                    <Lock className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleDelete(user.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="mt-4 flex justify-between">
                        <span className="text-sm">
                            Page {currentPage} of {totalPages}
                        </span>

                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                            >
                                Prev
                            </Button>

                            <Button
                                size="sm"
                                variant="outline"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

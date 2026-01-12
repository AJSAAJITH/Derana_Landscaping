"use client"
import { createUser, deleteSupervisor, getAllSupervisors, toggleSupervisorStatus } from "@/app/actions/user.action";
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
import { Eye, Lock, Plus, Trash2, Unlock } from "lucide-react"
import { User } from "@/lib/types"
import CreateSupervisorModal from "./create-supervisor-account"
import { toast } from "react-toastify";


const ITEMS_PER_PAGE = 10

export default function UserPageClient() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const loadUsers = async () => {
        setLoading(true);
        const result = await getAllSupervisors();
        if (!result.success) {
            toast.error(result.message ?? "Failed to load supervisors");
            setLoading(false);
            return;
        }
        setUsers(result.data ?? []);
        setLoading(false);
        console.log("Loaded supervisors:", result.data);
    }

    // load data on first render
    useEffect(() => {
        loadUsers();
    }, []);

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

    // create supervisor handler
    const handleCreateSupervisor = async (data: {
        name: string;
        email: string;
        phone?: string;
        password: string;
    }) => {
        try {
            setIsSubmitting(true);

            const result = await createUser(data);
            setIsSubmitting(false);

            if (!result.success) {
                if (result.fieldErrors) {
                    Object.values(result.fieldErrors).forEach((msg) =>
                        toast.error(msg)
                    );
                } else if (result.message) {
                    toast.error(result.message);
                }
                return;
            }

            toast.success("Supervisor created successfully 🎉");
            setIsModalOpen(false);

            await loadUsers();

        } catch (err) {
            console.error(err);
            toast.error("Unexpected error occurred");
        }
    };


    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this supervisor?")) return;

        const result = await deleteSupervisor(id);
        if (!result.success) {
            toast.error(result.message ?? "Delete Failed");
            return;
        }
        toast.success("Supervisor deleted successfully");
        await loadUsers();
    }

    const handleToggleStatus = async (userId: string) => {
        const result = await toggleSupervisorStatus(userId);

        if (!result.success) {
            toast.error(result.message ?? "Failed to update status");
            return;
        }
        toast.success("Supervisor status updated");

        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === userId ? { ...user, isActive: !user.isActive } : user
            )
        );
    };

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
                loading={isSubmitting}
                errors={errors}
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
                    {loading ? (
                        <p className="text-center py-10 text-muted-foreground">
                            Loading Supervisors
                        </p>
                    ) :
                        (
                            <>
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
                                                        <Badge className={
                                                            user.isActive ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                        }>
                                                            {user.isActive ? "Active" : "Inactive"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.createdAt
                                                            ? new Date(user.createdAt).toLocaleDateString("en-LK")
                                                            : "-"}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">

                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleToggleStatus(user.id)}
                                                            >
                                                                <Lock
                                                                    className={`w-4 h-4 ${user.isActive ? "text-red-600" : "text-green-600"
                                                                        }`}
                                                                />
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
                            </>
                        )}


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

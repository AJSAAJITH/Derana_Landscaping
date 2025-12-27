"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Eye, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import type { Project } from "@/lib/types"

/* ------------------------------------------------------------------ */
/* Sample Data */
/* ------------------------------------------------------------------ */
const SAMPLE_PROJECTS: Project[] = [
    {
        id: "1",
        name: "Green Valley Park Landscaping",
        clientName: "City Council",
        clientPhone: "0112345678",
        assignedSupervisorId: "1",
        assignedSupervisor: {
            id: "1",
            name: "Kamal Silva",
            email: "kamal@derana.com",
            createdAt: new Date(),
        },
        status: "ACTIVE",
        budget: 250000,
        createdAt: new Date("2024-01-15"),
    },
    {
        id: "2",
        name: "Residential Garden Project",
        clientName: "Mr. & Mrs. De Silva",
        clientPhone: "0771234567",
        assignedSupervisorId: "2",
        assignedSupervisor: {
            id: "2",
            name: "Priya Perera",
            email: "priya@derana.com",
            createdAt: new Date(),
        },
        status: "PENDING",
        budget: 85000,
        createdAt: new Date("2024-02-20"),
    },
    {
        id: "3",
        name: "Commercial Plaza Beautification",
        clientName: "Metro Shopping Center",
        clientPhone: "0115566778",
        assignedSupervisorId: "1",
        assignedSupervisor: {
            id: "1",
            name: "Kamal Silva",
            email: "kamal@derana.com",
            createdAt: new Date(),
        },
        status: "ACTIVE",
        budget: 450000,
        createdAt: new Date("2024-01-10"),
    },
    {
        id: "4",
        name: "Hotel Garden Renovation",
        clientName: "Royal Colombo Hotel",
        clientPhone: "0119988776",
        assignedSupervisorId: "3",
        assignedSupervisor: {
            id: "3",
            name: "Rajiv Kumar",
            email: "rajiv@derana.com",
            createdAt: new Date(),
        },
        status: "COMPLETED",
        budget: 320000,
        createdAt: new Date("2023-12-01"),
    },
]

const ITEMS_PER_PAGE = 10

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */
export default function Projects() {
    const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS)
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    /* Reset page when searching */
    useEffect(() => {
        setCurrentPage(1)
    }, [search])

    /* Filter projects */
    const filteredProjects = projects.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.clientName.toLowerCase().includes(search.toLowerCase()) ||
            p.assignedSupervisor?.name
                ?.toLowerCase()
                .includes(search.toLowerCase())
    )

    /* Pagination */
    const totalPages = Math.max(
        1,
        Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)
    )

    const paginatedProjects = filteredProjects.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    /* Status badge colors */
    const getStatusColor = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            case "PENDING":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            case "COMPLETED":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            case "PAUSED":
                return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
            case "CANCELLED":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            default:
                return ""
        }
    }

    /* Currency formatter (LKR) */
    const formatCurrency = (amount?: number | null) => {
        if (amount == null) return "—"
        return new Intl.NumberFormat("si-LK", {
            style: "currency",
            currency: "LKR",
            maximumFractionDigits: 0,
        }).format(amount)
    }

    /* Delete */
    const handleDelete = (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return
        setProjects((prev) => prev.filter((p) => p.id !== id))
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Projects Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage all landscaping projects
                    </p>
                </div>

                <Button className="gap-2 bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4" />
                    Create Project
                </Button>
            </div>

            {/* Projects Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <CardTitle>All Projects</CardTitle>
                            <CardDescription>
                                Total projects: {filteredProjects.length}
                            </CardDescription>
                        </div>

                        {/* Search */}
                        <input
                            type="text"
                            placeholder="Search project, client, supervisor"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full md:w-72 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Project</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Supervisor</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Budget</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {paginatedProjects.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            No projects found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedProjects.map((project) => (
                                        <TableRow key={project.id}>
                                            <TableCell className="font-medium">
                                                {project.name}
                                            </TableCell>
                                            <TableCell>{project.clientName}</TableCell>
                                            <TableCell>
                                                {project.assignedSupervisor?.name || "Unassigned"}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={getStatusColor(project.status)}
                                                >
                                                    {project.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {formatCurrency(project.budget)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/admin/projects/${project.id}`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="w-4 h-4 text-blue-600" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(project.id)}
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
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages}
                        </span>

                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                            >
                                Previous
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

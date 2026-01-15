"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CirclePower, Eye, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import type { Project } from "@/lib/types";
import { CreateProjectDialog } from "./create-project-dialog";
import { deleteProject, getAllProjects, updateProjectStatus } from "@/app/actions/project.action";
import { toast } from "react-toastify";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const ITEMS_PER_PAGE = 10;

export default function ClientProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const PROJECT_STATUSES = [
        "PENDING",
        "ACTIVE",
        "PAUSED",
        "COMPLETED",
        "CANCELLED",
    ] as const;

    const loardAllProjects = async () => {
        const result = await getAllProjects();
        if (!result.success) {
            toast.error(result.message ?? "Failed to load prjects");
            return;
        }
        setProjects(result.data ?? []);
    }

    useEffect(() => {
        loardAllProjects();
    }, []);

    /* ✅ FIXED HANDLER */
    const handleProjectCreate = (project: Project) => {
        setProjects((prev) => [project, ...prev]);
    };

    const filteredProjects = projects.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.clientName.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.max(
        1,
        Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)
    );

    const paginatedProjects = filteredProjects.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "bg-green-100 text-green-800";
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "PAUSED":
                return "bg-orange-100 text-orange-800";
            case "COMPLETED":
                return "bg-blue-100 text-blue-800";
            case "CANCELLED":
                return "bg-red-100 text-red-800";
            default:
                return "";
        }
    };

    const formatCurrency = (amount?: number | null) =>
        amount
            ? new Intl.NumberFormat("si-LK", {
                style: "currency",
                currency: "LKR",
                maximumFractionDigits: 0,
            }).format(amount)
            : "—";

    const handleDeleteProject = async (projectId: string) => {
        const confirmed = confirm(
            "Are you sure you want to delete this project?\nOnly completed, paused, or cancelled projects can be deleted."
        );

        if (!confirmed) return;

        const result = await deleteProject(projectId);

        if (!result.success) {
            toast.error(result.message ?? "Failed to delete project");
            return;
        }

        toast.success(result.message);

        setProjects((prev) =>
            prev.filter((project) => project.id !== projectId)
        );
    };


    const handleChangeProjectStatus = async (
        projectId: string,
        status: Project["status"]
    ) => {
        const result = await updateProjectStatus(projectId, status);

        if (!result.success) {
            toast.error(result.message ?? "Failed to update project status");
            return;
        }

        toast.success(result.message);

        setProjects((prev) =>
            prev.map((p) =>
                p.id === projectId ? { ...p, status } : p
            )
        );
    };



    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Projects Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage all landscaping projects
                    </p>
                </div>

                <CreateProjectDialog onProjectCreate={handleProjectCreate} />
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:justify-between gap-3">
                        <div>
                            <CardTitle>All Projects</CardTitle>
                            <CardDescription>
                                Total projects: {filteredProjects.length}
                            </CardDescription>
                        </div>

                        <input
                            placeholder="Search projects"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full md:w-72 rounded-md border px-3 py-2 text-sm"
                        />
                    </div>
                </CardHeader>

                <CardContent>
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
                            {paginatedProjects.length ? (
                                paginatedProjects.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.name}</TableCell>
                                        <TableCell>{p.clientName}</TableCell>
                                        <TableCell>
                                            {p.assignedSupervisor?.name ?? "Unassigned"}
                                        </TableCell>

                                        <TableCell>
                                            <Badge className={getStatusColor(p.status)}>
                                                {p.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{formatCurrency(p.budget)}</TableCell>

                                        <TableCell className="text-right flex justify-end gap-2">
                                            {/* status action */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <CirclePower className="w-4 h-4 text-blue-600" />
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end">
                                                    {PROJECT_STATUSES.map((status) => (
                                                        <DropdownMenuItem
                                                            key={status}
                                                            onClick={() => handleChangeProjectStatus(p.id, status)}
                                                            disabled={p.status === status}
                                                        >
                                                            {status}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                            {/* view project */}
                                            <Link href={`/dashboard/admin/projects/${p.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>

                                            {/* Delete project */}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                disabled={["PENDING", "ACTIVE"].includes(p.status)}
                                                onClick={() => handleDeleteProject(p.id)}
                                            >
                                                <Trash2
                                                    className={`w-4 h-4 ${["PENDING", "ACTIVE"].includes(p.status)
                                                        ? "text-muted-foreground"
                                                        : "text-destructive"
                                                        }`}
                                                />
                                            </Button>

                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center py-8 text-muted-foreground"
                                    >
                                        No projects available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

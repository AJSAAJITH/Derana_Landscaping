"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    AlertTriangle,
    AlertCircle,
    Clock,
    Store,
} from "lucide-react"
import Link from "next/link"
import ScrollableTable from "@/components/ScrollableTable"
import { ProjectInventorItemDTO, SupervisorProjectDetails, SupervisorRequestDTO } from "@/lib/types"
import QuickActions from "./components/quickActions"
import { useEffect, useState } from "react"
import { loadSupervisorRequests } from "@/app/actions/supervisor/request.action"
import { toast } from "react-toastify"
import { getInventorySupervisor } from "@/app/actions/supervisor/inventory.action"
import { getSupervisorProjectTodayAttendance } from "@/app/actions/supervisor/supervisor.action"


const STATUS_COLOR: Record<string, string> = {
    ACTIVE: "bg-green-600",
    PENDING: "bg-yellow-600",
    COMPLETED: "bg-blue-600",
    CLOSED: "bg-gray-600",
}

export default function ProjectOverview({
    project,
}: {
    project: SupervisorProjectDetails
}) {

    const [pendingRequests, setPendingRequests] = useState<SupervisorRequestDTO[]>([]);
    const [loadingPending, setLoadingPending] = useState(true);

    const [lowStockItems, setLowStockItems] = useState<ProjectInventorItemDTO[]>([]);
    const [loadingLowStock, setLoadingLowStock] = useState(true);

    // Quick action cards
    const [todayAttendanceCount, setTodayAttendanceCount] = useState<number>(0)
    const [loadingAttendance, setLoadingAttendance] = useState(true)
    const [stockCount, setStockCount] = useState<number>(0);
    const [loadingStock, setLoadingStock] = useState(true);

    async function loadStockCount() {
        setLoadingStock(true)

        const result = await getInventorySupervisor(project.id)

        if (!result.success || !result.data) {
            setStockCount(0)
            setLoadingStock(false)
            return
        }

        setStockCount(result.data.length)
        setLoadingStock(false)
    }

    async function loadPending() {
        setLoadingPending(true)

        const result = await loadSupervisorRequests(project.id)

        if (!result.success || !result.data) {
            toast.error(result.message || "Failed to load requests")
            setLoadingPending(false)
            return
        }

        const onlyPending = result.data.filter(
            (r) => r.status === "PENDING"
        )

        setPendingRequests(onlyPending)
        setLoadingPending(false)
    }

    async function loadLowStock() {
        setLoadingLowStock(true)

        const result = await getInventorySupervisor(project.id)

        if (!result.success || !result.data) {
            toast.error(result.message || "Failed to load inventory")
            setLoadingLowStock(false)
            return
        }

        const filteredLowStock = result.data.filter((item) =>
            item.threshold !== null &&
            item.quantity <= item.threshold
        )

        setLowStockItems(filteredLowStock)
        setLoadingLowStock(false)
    }

    // Quick action cards
    async function loadAttendanceCount() {
        setLoadingAttendance(true)

        const result = await getSupervisorProjectTodayAttendance(project.id)

        if (!result.success || !result.data) {
            setTodayAttendanceCount(0)
            setLoadingAttendance(false)
            return
        }

        const presentCount = result.data.filter(
            (row) => row.status === "present"
        ).length

        setTodayAttendanceCount(presentCount)
        setLoadingAttendance(false)
    }

    useEffect(() => {
        loadPending();
        loadLowStock();

        loadAttendanceCount();
        loadStockCount();
    }, [project.id])


    return (
        <div className="p-2 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Your assigned project overview
                </p>
            </div>

            {/* Project Overview Card */}
            <Card className="border-border shadow-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-2xl">
                                {project.name}
                            </CardTitle>
                            <CardDescription className="mt-1">
                                {project.address ?? "No address provided"}
                            </CardDescription>
                        </div>
                        <Badge className={STATUS_COLOR[project.status]}>
                            {project.status}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Start Date
                            </p>
                            <p className="font-semibold">
                                {project.startDate
                                    ? new Date(
                                        project.startDate
                                    ).toDateString()
                                    : "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                End Date
                            </p>
                            <p className="font-semibold">
                                {project.endDate
                                    ? new Date(
                                        project.endDate
                                    ).toDateString()
                                    : "—"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* EVERYTHING BELOW — KEPT AS IS (mock/design only) */}
            {/* Quick action cards, tables, links — untouched */}

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href={`/dashboard/supervisor/projects/${project.id}/attendance`}>
                    <Card className="border-border shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Clock className="h-4 w-4 text-blue-600" />
                                Today's Attendance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loadingAttendance ? (
                                <p className="text-2xl font-bold">...</p>
                            ) : (
                                <p className="text-2xl font-bold">
                                    {todayAttendanceCount}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                                workers present
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href={`/dashboard/supervisor/projects/${project.id}/inventory`}>
                    <Card className="border-border shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Store className="h-4 w-4 text-yellow-600" />
                                Stock Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loadingStock ? (
                                <p className="text-2xl font-bold text-yellow-600">...</p>
                            ) : (
                                <p className="text-2xl font-bold text-yellow-600">
                                    {stockCount}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">total stock Items</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href={`/dashboard/supervisor/projects/${project.id}/inventory/supervisorRequest`}>
                    <Card className="border-border shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-orange-600" />
                                Pending Requests
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loadingPending ? (
                                <p className="text-2xl font-bold text-orange-600">...</p>
                            ) : (
                                <p className="text-2xl font-bold text-orange-600">
                                    {pendingRequests.length}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">awaiting approval</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Low Stock Alerts and Pending Requests */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Low Stock Alerts */}
                <Card className="border-yellow-200 dark:border-yellow-800 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            Low Stock Alerts
                        </CardTitle>
                        <CardDescription>
                            Items running low on this project
                        </CardDescription>
                    </CardHeader>

                    <ScrollableTable maxHeight={300}>
                        <CardContent className="space-y-3">

                            {loadingLowStock ? (
                                <p className="text-sm text-muted-foreground">
                                    Loading low stock items...
                                </p>
                            ) : lowStockItems.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No low stock alerts 🎉
                                </p>
                            ) : (
                                lowStockItems.map((item) => (
                                    <div key={item.id}>
                                        <Link href={`/dashboard/supervisor/projects/${project.id}/inventory`}>
                                            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">

                                                <div>
                                                    <p className="font-medium">
                                                        {item.inventoryItem.name}
                                                    </p>

                                                    <p className="text-sm text-muted-foreground">
                                                        {item.quantity} {item.inventoryItem.unit ?? ""}
                                                        {" / "}
                                                        {item.threshold} {item.inventoryItem.unit ?? ""}
                                                    </p>
                                                </div>

                                            </div>
                                        </Link>
                                    </div>
                                ))
                            )}

                        </CardContent>
                    </ScrollableTable>
                </Card>
                {/* Pending Requests */}
                <Card className="border-blue-200 dark:border-blue-800 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-600" />
                            Pending Requests
                        </CardTitle>
                        <CardDescription>Your pending approvals</CardDescription>
                    </CardHeader>

                    <ScrollableTable maxHeight={300}>
                        <CardContent className="space-y-3">

                            {loadingPending ? (
                                <p className="text-sm text-muted-foreground">
                                    Loading pending requests...
                                </p>
                            ) : pendingRequests.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No pending requests
                                </p>
                            ) : (
                                pendingRequests.map((request) => (
                                    <div key={request.id}>
                                        <Link href={`/dashboard/supervisor/projects/${project.id}/inventory/supervisorRequest`}>
                                            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">

                                                <div>
                                                    <p className="font-medium">
                                                        {request.type}
                                                    </p>

                                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                                        {request.supervisorNote}
                                                    </p>
                                                </div>

                                                <Badge
                                                    variant="outline"
                                                    className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                >
                                                    Pending
                                                </Badge>

                                            </div>
                                        </Link>
                                    </div>
                                ))
                            )}

                        </CardContent>
                    </ScrollableTable>
                </Card>

            </div>

            {/* Quick Links */}
            <QuickActions projectId={project.id} />

        </div>
    )
}

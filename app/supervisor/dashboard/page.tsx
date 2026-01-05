"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, AlertCircle, CheckCircle, Clock, Briefcase } from "lucide-react"
import Link from "next/link"
import ScrollableTable from "@/components/ScrollableTable"

// Mock supervisor data
const supervisorProject = {
    id: "1",
    name: "Colombo Park Landscaping",
    clientName: "City Council",
    status: "active",
    progress: 65,
    startDate: "2024-01-15",
    endDate: "2024-06-30",
}

const lowStockItems = [
    { name: "Grass Seeds", current: 250, threshold: 500 },
    { name: "Fertilizer", current: 150, threshold: 200 },
    { name: "Garden Plants", current: 50, threshold: 100 },
]

const pendingRequests = [
    { id: "1", type: "Material Request", item: "Additional Fertilizer", status: "pending", date: "2024-01-22" },
    { id: "2", type: "Labor Request", workers: "3 additional workers", status: "approved", date: "2024-01-20" },
]

export default function SupervisorDashboard() {
    return (
        <div className="p-8 space-y-6">
            {/* Welcome Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-2">Welcome, John Silva. Here's your project overview.</p>
            </div>

            {/* Assigned Project Card */}
            <Card className="border-border shadow-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-2xl">{supervisorProject.name}</CardTitle>
                            <CardDescription className="text-base mt-1">{supervisorProject.clientName}</CardDescription>
                        </div>
                        <Badge className="bg-green-600">Active</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Progress</p>
                            <p className="text-2xl font-bold text-green-600">{supervisorProject.progress}%</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Start Date</p>
                            <p className="font-semibold">{supervisorProject.startDate}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">End Date</p>
                            <p className="font-semibold">{supervisorProject.endDate}</p>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                            <div
                                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${supervisorProject.progress}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground text-right">{supervisorProject.progress}% Complete</p>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-border shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            Today's Attendance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-xs text-muted-foreground mt-1">workers present</p>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            Low Stock Items
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</p>
                        <p className="text-xs text-muted-foreground mt-1">need ordering</p>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                            Pending Requests
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-orange-600">2</p>
                        <p className="text-xs text-muted-foreground mt-1">awaiting approval</p>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Tasks Completed
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-green-600">23</p>
                        <p className="text-xs text-muted-foreground mt-1">this month</p>
                    </CardContent>
                </Card>
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
                        <CardDescription>Items running low on this project</CardDescription>
                    </CardHeader>
                    <ScrollableTable maxHeight={300}>
                        <CardContent className="space-y-3">
                            {lowStockItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.current} / {item.threshold}
                                        </p>
                                    </div>
                                    <Link href="/supervisor/materials">
                                        <Button size="sm" variant="outline" className="text-yellow-600 bg-transparent">
                                            Request
                                        </Button>
                                    </Link>
                                </div>
                            ))}
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
                            {pendingRequests.map((request) => (
                                <div
                                    key={request.id}
                                    className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium">{request.type}</p>
                                        <p className="text-sm text-muted-foreground">{request.item || request.workers}</p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={
                                            request.status === "approved"
                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                        }
                                    >
                                        {request.status === "approved" ? "Approved" : "Pending"}
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </ScrollableTable>
                </Card>
            </div>

            {/* Quick Links */}
            <Card className="border-border shadow-sm">
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <Link href="/supervisor/attendance">
                        <Button
                            variant="outline"
                            className="w-full h-20 flex-col gap-2 hover:bg-green-50 dark:hover:bg-green-950 bg-transparent"
                        >
                            <Clock className="h-5 w-5" />
                            <span className="text-xs">Mark Attendance</span>
                        </Button>
                    </Link>
                    <Link href="/supervisor/materials">
                        <Button
                            variant="outline"
                            className="w-full h-20 flex-col gap-2 hover:bg-blue-50 dark:hover:bg-blue-950 bg-transparent"
                        >
                            <AlertCircle className="h-5 w-5" />
                            <span className="text-xs">Request Materials</span>
                        </Button>
                    </Link>
                    <Link href="/supervisor/labors">
                        <Button
                            variant="outline"
                            className="w-full h-20 flex-col gap-2 hover:bg-blue-50 dark:hover:bg-blue-950 bg-transparent"
                        >
                            <AlertCircle className="h-5 w-5" />
                            <span className="text-xs">Request labours</span>
                        </Button>
                    </Link>
                    <Link href="/supervisor/reports">
                        <Button
                            variant="outline"
                            className="w-full h-20 flex-col gap-2 hover:bg-purple-50 dark:hover:bg-purple-950 bg-transparent"
                        >
                            <Briefcase className="h-5 w-5" />
                            <span className="text-xs">Daily Report</span>
                        </Button>
                    </Link>
                    <Link href="/supervisor/inventory">
                        <Button
                            variant="outline"
                            className="w-full h-20 flex-col gap-2 hover:bg-orange-50 dark:hover:bg-orange-950 bg-transparent"
                        >
                            <AlertTriangle className="h-5 w-5" />
                            <span className="text-xs">View Inventory</span>
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}

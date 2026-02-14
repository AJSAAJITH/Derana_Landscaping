"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GitPullRequestArrowIcon } from "lucide-react"
import { getAllRequestManagement } from "@/app/actions/admin/request.inquary.action"
import { AdminRequestManagmentDTO } from "@/lib/types"
import { toast } from "react-toastify"
import ScrollableTable from "@/components/ScrollableTable"

export function ProjectMaterialRequests({ projectId }: { projectId: string }) {

    const [requests, setRequests] = useState<AdminRequestManagmentDTO[]>([])
    const [loading, setLoading] = useState(true)

    async function loadRequests() {
        setLoading(true)

        const result = await getAllRequestManagement()

        if (!result.success || !result.data) {
            toast.error(result.message ?? "Failed to load requests")
            setLoading(false)
            return
        }

        // ✅ Filter only this project requests
        const projectRequests = result.data.filter(
            (r) => r.project.id === projectId
        )

        setRequests(projectRequests)
        setLoading(false)
    }

    useEffect(() => {
        loadRequests()
    }, [projectId])

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row justify-between gap-2">
                    <div>
                        <CardTitle>Requests Material</CardTitle>
                        <CardDescription>Pending & approved requests</CardDescription>
                    </div>
                    <div>
                        <Link href={`/dashboard/admin/requests`}>
                            <Button className="gap-2 bg-amber-700 hover:bg-amber-900 w-full">
                                <GitPullRequestArrowIcon className="w-4 h-4" />
                                Explore Requests
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <ScrollableTable >
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead >Date</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>

                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                                        Loading requests...
                                    </TableCell>
                                </TableRow>
                            ) : requests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                                        No requests found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                requests.map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell>{r.type}</TableCell>

                                        <TableCell>
                                            <Badge
                                                className={
                                                    r.status === "APPROVED"
                                                        ? "bg-green-100 text-green-800"
                                                        : r.status === "REJECTED"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                }
                                            >
                                                {r.status}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            {new Date(r.createdAt).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}

                        </TableBody>
                    </Table>
                </ScrollableTable>

            </CardContent>
        </Card>
    )
}

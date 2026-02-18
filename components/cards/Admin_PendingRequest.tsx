"use client"

import React, { useEffect, useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { AlertTriangle } from "lucide-react"
import { getPendingRequestStats } from "@/app/actions/admin/request.inquary.action"

function PendingRequest() {
    const [stats, setStats] = useState<{
        total: number
        material: number
        labor: number
        other: number
    } | null>(null)

    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        startTransition(async () => {
            const res = await getPendingRequestStats()
            if (res.success && res.data) {
                setStats(res.data)
            }
        })
    }, [])

    return (
        <Card className="border-border shadow-sm bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">
                    Pending Requests
                </CardTitle>
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">
                    {isPending ? "..." : stats?.total ?? 0}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                    {isPending
                        ? "Loading..."
                        : `${stats?.material ?? 0} material, ${stats?.labor ?? 0} labor${stats?.other ? `, ${stats.other} other` : ""
                        }`}
                </p>
            </CardContent>
        </Card>
    )
}

export default PendingRequest

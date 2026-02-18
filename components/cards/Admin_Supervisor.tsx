"use client"

import React, { useEffect, useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Users } from 'lucide-react'
import { getSupervisorStats } from '@/app/actions/admin/user.action'

function SupervisorCard() {
    const [stats, setStats] = useState<{
        total: number
        active: number
        inactive: number
    } | null>(null)

    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        startTransition(async () => {
            const res = await getSupervisorStats()

            if (res.success && res.data) {
                setStats(res.data)
            }
        })
    }, [])

    return (
        <Card className="border-border shadow-sm bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">
                    Supervisors
                </CardTitle>
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">
                    {isPending ? "..." : stats?.total ?? 0}
                </p>

                <p className="text-xs text-muted-foreground mt-2">
                    {isPending
                        ? "Loading..."
                        : `${stats?.active ?? 0} active, ${stats?.inactive ?? 0} inactive`}
                </p>
            </CardContent>
        </Card>
    )
}

export default SupervisorCard

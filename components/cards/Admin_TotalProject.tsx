"use client"

import React, { useEffect, useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Briefcase } from 'lucide-react'
import { getTotalProjectsCount } from '@/app/actions/admin/project.action'

function TotalProjectCard() {
    const [total, setTotal] = useState<number>(0)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        startTransition(async () => {
            const res = await getTotalProjectsCount()

            if (res.success && res.data !== undefined) {
                setTotal(res.data)
            }
        })
    }, [])

    return (
        <Card className="border-border shadow-sm bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">
                    Total Projects
                </CardTitle>
                <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">
                    {isPending ? "..." : total}
                </p>
            </CardContent>
        </Card>
    )
}

export default TotalProjectCard

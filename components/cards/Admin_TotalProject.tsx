"use client"

import React, { useEffect, useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Briefcase } from "lucide-react"
import { getTotalProjectsCount } from "@/app/actions/admin/project.action"
import Link from "next/link"

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
        <Link href="/dashboard/admin/projects" className="block">
            <Card className="border-border shadow-sm bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 hover:shadow-md transition-all duration-300 cursor-pointer">

                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Projects
                    </CardTitle>
                    <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </CardHeader>

                <CardContent className="pt-0">
                    <div className="text-3xl font-bold tracking-tight">
                        {isPending ? (
                            <span className="animate-pulse">...</span>
                        ) : (
                            total
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Total projects</p>
                </CardContent>

            </Card>
        </Link>
    )
}

export default TotalProjectCard

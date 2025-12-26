"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Briefcase } from 'lucide-react'

function ActiveProjects() {
    return (
        <div>
            <Card className="border-border shadow-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                    <Briefcase className="h-5 w-5 text-green-600 dark:text-green-400" />
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">8</p>
                    <p className="text-xs text-muted-foreground mt-2">50% of total</p>
                </CardContent>
            </Card>
        </div>
    )
}

export default ActiveProjects
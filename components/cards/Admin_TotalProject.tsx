"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Briefcase } from 'lucide-react'

function TotalProjectCard() {
    return (
        <div>
            <Card className="border-border shadow-sm bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                    <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">16</p>
                    <p className="text-xs text-muted-foreground mt-2">+2 from last month</p>
                </CardContent>
            </Card>
        </div>
    )
}

export default TotalProjectCard
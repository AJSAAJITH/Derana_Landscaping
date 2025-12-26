"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { AlertTriangle } from 'lucide-react'

function PendingRequest() {
    return (
        <div>
            <Card className="border-border shadow-sm bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                    <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">7</p>
                    <p className="text-xs text-muted-foreground mt-2">3 material, 4 labor</p>
                </CardContent>
            </Card>
        </div>
    )
}

export default PendingRequest
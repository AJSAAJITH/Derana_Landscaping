"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Users } from 'lucide-react'

function SupervisorCard() {
    return (
        <div>
            <Card className="border-border shadow-sm bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-medium">Supervisors</CardTitle>
                    <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">5</p>
                    <p className="text-xs text-muted-foreground mt-2">3 active, 2 inactive</p>
                </CardContent>
            </Card>
        </div>
    )
}

export default SupervisorCard
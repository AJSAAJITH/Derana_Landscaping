import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, AlertTriangle, Briefcase, Clock } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function QuickActions({ projectId }: { projectId: string }) {
    return (
        <Card className="border-border shadow-sm">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link href={`/dashboard/supervisor/projects/${projectId}/attendance`}>
                    <Button
                        variant="outline"
                        className="w-full h-20 flex-col gap-2 hover:bg-green-50 dark:hover:bg-green-950 bg-transparent"
                    >
                        <Clock className="h-5 w-5" />
                        <span className="text-xs">Mark Attendance</span>
                    </Button>
                </Link>
                <Link href={`/dashboard/supervisor/projects/${projectId}/inventory/supervisorRequest`}>
                    <Button
                        variant="outline"
                        className="w-full h-20 flex-col gap-2 hover:bg-blue-50 dark:hover:bg-blue-950 bg-transparent"
                    >
                        <AlertCircle className="h-5 w-5" />
                        <span className="text-xs">Request Materials</span>
                    </Button>
                </Link>
                <Link href={`/dashboard/supervisor/projects/${projectId}/reports`}>
                    <Button
                        variant="outline"
                        className="w-full h-20 flex-col gap-2 hover:bg-purple-50 dark:hover:bg-purple-950 bg-transparent"
                    >
                        <Briefcase className="h-5 w-5" />
                        <span className="text-xs">Daily Report</span>
                    </Button>
                </Link>
                <Link href={`/dashboard/supervisor/projects/${projectId}/inventory`}>
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
    )
}

export default QuickActions
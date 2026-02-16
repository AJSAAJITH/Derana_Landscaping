'use client'

import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'

interface TodoStatsProps {
    total: number
    completed: number
    pending: number
}

export function TodoStats({ total, completed, pending }: TodoStatsProps) {
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Tasks</p>
                            <p className="text-2xl sm:text-3xl font-bold mt-1">{total}</p>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Completed</p>
                            <p className="text-2xl sm:text-3xl font-bold mt-1 text-green-600">{completed}</p>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-300" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Pending</p>
                            <p className="text-2xl sm:text-3xl font-bold mt-1 text-amber-600">{pending}</p>
                        </div>
                        <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-300" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Completion Rate</p>
                            <p className="text-2xl sm:text-3xl font-bold mt-1 text-emerald-600">{completionRate}%</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-semibold">
                            {completionRate}%
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

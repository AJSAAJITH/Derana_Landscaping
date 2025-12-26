import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Users } from 'lucide-react'
import { Badge } from './ui/badge'

function LabourRequest() {
    return (

        <Card className="border-border shadow-sm border-purple-200 dark:border-purple-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Pending Labour Requests
                </CardTitle>
                <CardDescription>Awaiting admin approval</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 max-h-[240px] overflow-y-auto  scroll-smooth scrollbar-hide">
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <div>
                        <p className="font-medium">John Silva</p>
                        <p className="text-sm text-muted-foreground">
                            Requesting 5 additional laborers (3 days)
                        </p>
                    </div>
                    <Badge className="bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        Pending
                    </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <div>
                        <p className="font-medium">Rajesh Kumar</p>
                        <p className="text-sm text-muted-foreground">
                            Requesting 2 skilled workers (land leveling)
                        </p>
                    </div>
                    <Badge className="bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        Pending
                    </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <div>
                        <p className="font-medium">Maria Perera</p>
                        <p className="text-sm text-muted-foreground">
                            Requesting 4 gardeners (planting phase)
                        </p>
                    </div>
                    <Badge className="bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        Pending
                    </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <div>
                        <p className="font-medium">Maria Perera</p>
                        <p className="text-sm text-muted-foreground">
                            Requesting 4 gardeners (planting phase)
                        </p>
                    </div>
                    <Badge className="bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        Pending
                    </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <div>
                        <p className="font-medium">Maria Perera</p>
                        <p className="text-sm text-muted-foreground">
                            Requesting 4 gardeners (planting phase)
                        </p>
                    </div>
                    <Badge className="bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        Pending
                    </Badge>
                </div>
            </CardContent>
        </Card>

    )
}

export default LabourRequest
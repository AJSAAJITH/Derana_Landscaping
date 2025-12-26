import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Clock } from 'lucide-react'
import { Badge } from './ui/badge'

function PendingMaterialR() {
    return (
        <div>
            <Card className="border-border shadow-sm border-blue-200 dark:border-blue-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        Pending Material Requests
                    </CardTitle>
                    <CardDescription>Awaiting approval</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[240px] overflow-y-auto  scroll-smooth scrollbar-hide" >
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <div>
                            <p className="font-medium">John Silva</p>
                            <p className="text-sm text-muted-foreground">Additional Fertilizer - 50 bags</p>
                        </div>
                        <Badge className="bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <div>
                            <p className="font-medium">Rajesh Kumar</p>
                            <p className="text-sm text-muted-foreground">Landscape Stones - 100 tons</p>
                        </div>
                        <Badge className="bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <div>
                            <p className="font-medium">Maria Perera</p>
                            <p className="text-sm text-muted-foreground">Premium Plant Mix - 200 pcs</p>
                        </div>
                        <Badge className="bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <div>
                            <p className="font-medium">Maria Perera</p>
                            <p className="text-sm text-muted-foreground">Premium Plant Mix - 200 pcs</p>
                        </div>
                        <Badge className="bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Pending</Badge>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}

export default PendingMaterialR
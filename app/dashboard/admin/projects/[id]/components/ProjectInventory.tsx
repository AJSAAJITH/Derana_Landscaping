"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText } from "lucide-react"

export function ProjectInventory({ inventory, projectId }: { inventory: any[], projectId: string }) {
    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Inventory Overview</CardTitle>
                    <CardDescription>Materials for this project</CardDescription>
                </div>
                <Link href={`/dashboard/admin/inventory?projectId=${projectId}`}>
                    <Button className="gap-2 bg-green-600 hover:bg-green-700">
                        <FileText className="w-4 h-4" />
                        Explore Items
                    </Button>
                </Link>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Unit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {inventory.map((item, i) => (
                            <TableRow key={i}>
                                <TableCell>{item.item}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.unit}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText } from "lucide-react"
import ScrollableTable from "@/components/ScrollableTable"

export function ProjectInventory({ inventory, projectId }: { inventory: any[], projectId: string }) {
    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row justify-between gap-2">
                    <div>
                        <CardTitle>Inventory Overview</CardTitle>
                        <CardDescription>Materials for this project</CardDescription>
                    </div>
                    <div>
                        <Link href={`/dashboard/admin/inventory?projectId=${projectId}`}>
                            <Button className="gap-2 bg-green-600 hover:bg-green-700 w-full">
                                <FileText className="w-4 h-4" />
                                Explore Items
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <ScrollableTable>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Unit Cost</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inventory.map((item, i) => (
                                <TableRow key={i}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.unitCost}.00</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollableTable>
            </CardContent>
        </Card>
    )
}

"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function ProjectMaterialRequests({ requests }: { requests: any[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Material Requests</CardTitle>
                <CardDescription>Pending & approved requests</CardDescription>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((r) => (
                            <TableRow key={r.id}>
                                <TableCell>{r.item}</TableCell>
                                <TableCell>{r.quantity}</TableCell>
                                <TableCell>
                                    <Badge className={r.status === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                                        {r.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{r.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

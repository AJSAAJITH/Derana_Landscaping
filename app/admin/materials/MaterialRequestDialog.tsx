"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, X } from "lucide-react";
import { useState } from "react";

export default function MaterialRequestDialog({
    request,
    open,
    onClose,
}: any) {
    const [response, setResponse] = useState("");

    if (!request) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Material Request Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <Info label="Supervisor" value={request.supervisor?.name} />
                        <Info label="Project" value={request.project?.name} />
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-2">Requested Items</p>
                        <div className="space-y-2">
                            {request.items.map((item: any) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between rounded-md border p-2 text-sm"
                                >
                                    <span>
                                        {item.name} ({item.quantity} {item.unit})
                                    </span>
                                    <span className="font-medium">LKR {item.totalCost}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {request.status === "PENDING" && (
                        <>
                            <Textarea
                                placeholder="Admin response..."
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                            />

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button className="bg-green-600 hover:bg-green-700 gap-2">
                                    <Check className="w-4 h-4" /> Approve
                                </Button>
                                <Button variant="destructive" className="gap-2">
                                    <X className="w-4 h-4" /> Reject
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function Info({ label, value }: any) {
    return (
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-medium">{value}</p>
        </div>
    );
}

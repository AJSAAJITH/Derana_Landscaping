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
import { useState, useEffect } from "react";
import { AdminRequestDetailsDTO } from "@/lib/types";
import { updateAdminRequestStatus } from "@/app/actions/admin/request.inquary.action";
import { toast } from "react-toastify";

interface Props {
    request: AdminRequestDetailsDTO | null;
    open: boolean;
    onClose: () => void;
    onUpdated: () => void;
}

export default function RequestDialog({
    request,
    open,
    onClose,
    onUpdated,
}: Props) {
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (status: "APPROVED" | "REJECTED") => {
        if (!request) return;

        try {
            setLoading(true);

            const result = await updateAdminRequestStatus({
                requestId: request.id,
                status,
                adminNote: response,
            });

            if (!result.success) {
                toast.error(result.message || "Failed to update request");
                return;
            }

            toast.success(result.message);

            // 🔥 refresh table properly
            await onUpdated();

            onClose();

        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        if (request?.adminNote) {
            setResponse(request.adminNote);
        } else {
            setResponse("");
        }
    }, [request]);

    if (!request) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Request Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <Info label="Supervisor" value={request.supervisor?.name} />
                        <Info label="Project" value={request.project?.name} />
                    </div>

                    {/* Supervisor Request */}
                    <div>
                        <p className="text-sm font-medium mb-2">
                            Supervisor Request
                        </p>
                        <Textarea
                            value={request.supervisorNote}
                            disabled
                            className="min-h-24"
                        />
                    </div>

                    {/* If already responded */}
                    {request.status !== "PENDING" ? (
                        <div>
                            <p className="text-sm font-medium mb-2">
                                Admin Response
                            </p>
                            <Textarea
                                value={request.adminNote ?? "—"}
                                disabled
                                className="min-h-24"
                            />
                        </div>
                    ) : (
                        <>
                            <p className="text-sm font-medium mb-2">
                                Admin Response
                            </p>
                            <Textarea
                                placeholder="Admin response..."
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                            />

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={onClose}>
                                    Cancel
                                </Button>

                                <Button
                                    className="bg-green-600 hover:bg-green-700 gap-2"
                                    disabled={loading}
                                    onClick={() => handleUpdate("APPROVED")}
                                >
                                    <Check className="w-4 h-4" />
                                    Approve
                                </Button>

                                <Button
                                    variant="destructive"
                                    className="gap-2"
                                    disabled={loading}
                                    onClick={() => handleUpdate("REJECTED")}
                                >
                                    <X className="w-4 h-4" />
                                    Reject
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
            <p className="text-xs text-muted-foreground">
                {label}
            </p>
            <p className="font-medium">{value}</p>
        </div>
    );
}

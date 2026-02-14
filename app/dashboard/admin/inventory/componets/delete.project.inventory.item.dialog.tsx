"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { deleteProjectInventoryItem } from "@/app/actions/admin/inventory.action";
import { useState } from "react";

interface Props {
    open: boolean;
    projectInventoryId: string | null;
    onClose: () => void;
    onDeleted: () => void;
}

export function DeleteProjectInventoryItemDialog({
    open,
    projectInventoryId,
    onClose,
    onDeleted,
}: Props) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!projectInventoryId) return;

        setLoading(true);

        const res = await deleteProjectInventoryItem(projectInventoryId);

        setLoading(false);

        if (!res.success) {
            toast.error(res.message ?? "Delete failed");
            return;
        }

        toast.success("Inventory item deleted");
        onDeleted();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Delete Inventory Item</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete this inventory item?
                    <br />
                    <strong>This action cannot be undone.</strong>
                </p>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

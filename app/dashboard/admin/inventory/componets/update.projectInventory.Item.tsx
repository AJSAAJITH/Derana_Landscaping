"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProjectInventorItemDTO } from "@/lib/types";
import { updateProjectInventoryItem } from "@/app/actions/admin/inventory.action";
import { toast } from "react-toastify";

interface Props {
    open: boolean;
    item: ProjectInventorItemDTO | null;
    onClose: () => void;
    onUpdated: () => void;
}

export function UpdateProjectInventoryItemDialog({
    open,
    item,
    onClose,
    onUpdated,
}: Props) {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [threshold, setThreshold] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    // Prefill data when dialog opens
    useEffect(() => {
        if (item) {
            setName(item.inventoryItem.name);
            setQuantity(item.quantity);
            setThreshold(item.threshold);
        }
    }, [item]);

    const handleUpdate = async () => {
        if (!item) return;

        setLoading(true);

        const res = await updateProjectInventoryItem({
            projectInventoryId: item.id,
            name,
            quantity,
            threshold,
        });

        setLoading(false);

        if (!res.success) {
            toast.error(res.message ?? "Update failed");
            return;
        }

        toast.success("Inventory updated");
        onUpdated();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Update Inventory Item</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label>Item Name</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} />
                    </div>

                    <div>
                        <Label>Quantity</Label>
                        <Input
                            type="number"
                            value={quantity}
                            onChange={e => setQuantity(Number(e.target.value))}
                        />
                    </div>

                    <div>
                        <Label>Threshold</Label>
                        <Input
                            type="number"
                            value={threshold ?? ""}
                            onChange={e =>
                                setThreshold(
                                    e.target.value === "" ? null : Number(e.target.value)
                                )
                            }
                        />
                    </div>

                    {/* Read-only info */}
                    <div className="text-xs text-muted-foreground">
                        Unit Cost: {item?.unitCost ? `LKR ${item.unitCost}` : "N/A"}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} disabled={loading}>
                        {loading ? "Updating..." : "Update"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

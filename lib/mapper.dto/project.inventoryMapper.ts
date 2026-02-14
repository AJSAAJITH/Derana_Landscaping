import { ProjectInventorItemDTO } from "../types";

export const ProjectInventoryItemmapToDTO = (item: any): ProjectInventorItemDTO => ({
    id: item.id,
    projectId: item.projectId,
    inventoryItemId: item.inventoryItemId,

    quantity: item.quantity,
    initialQuantity: item.initialQuantity,
    threshold: item.threshold,
    unitCost: item.unitCost ? Number(item.unitCost) : null,

    createdAt: item.createdAt,
    updatedAt: item.updatedAt,

    inventoryItem: {
        id: item.inventoryItem.id,
        name: item.inventoryItem.name,
        unit: item.inventoryItem.unit,
        isActive: item.inventoryItem.isActive,
        category: item.inventoryItem.category
            ? {
                id: item.inventoryItem.category.id,
                name: item.inventoryItem.category.name,
            }
            : null,
    },
})
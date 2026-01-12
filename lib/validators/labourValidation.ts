
export type CreateLabourInput = {
    name: string;
    phone?: string;
    nic?: string;
    workerType: "PERMANENT" | "TEMPORARY";
    notes?: string;
};

export function validateLabourInput(data: CreateLabourInput) {
    const errors: Record<string, string> = {};
    if (!data.name || data.name.trim().length < 3) {
        errors.name = "Name must be at least 3 characters long.";
    }
    if (data.phone && !/^\d{10}$/.test(data.phone)) {
        errors.phone = "Phone number must be exactly 10 digits";
    }
    if (!data.nic) {
        errors.nic = "NIC is required.";
    }
    return Object.keys(errors).length > 0 ? errors : null;

}
import { Prisma } from "@/app/generated/prisma"

export type Role = "SUPER_ADMIN" | "SUPERVISOR"
export type ProjectStatus = "PENDING" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED"
export type WorkerType = "PERMANENT" | "TEMPORARY"
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED"
export type PaymentMethod = "CASH" | "BANK_TRANSFER" | "MOBILE_PAYMENT" | "CHECK" | "OTHER"
export type RequestType = "MATERIAL" | "LABOR" | "OTHER"

export interface User {
    id: string
    clerkId?: string
    name: string
    email?: string | null
    phone?: string | null
    role?: Role
    isActive?: boolean
    createdAt: Date

}

export type SupervisorProjectRow = {
    id: string;
    name: string;
    clientName: string;
    status: ProjectStatus;
    startDate: Date | string;
    endDate: Date | string;
};

export type SupervisorProjectsPayload = {
    supervisor: {
        id: string;
        name: string;
        email?: string;
    };
    projects: SupervisorProjectRow[];
};

export type SupervisorProjectDetails = {
    id: string;
    name: string;
    address?: string;
    startDate?: Date | null;
    endDate?: Date | null;
    status: ProjectStatus;
};

export type UserSummeryForProject = {
    id: string,
    name: string,
    email?: string | null
    createdAt: Date
}

// Project Type
export type Project = {
    id: string;
    name: string;
    clientName: string;
    clientPhone: string;
    address?: string | null;
    status: ProjectStatus;
    startDate?: Date | null;
    endDate?: Date | null;
    budget?: number | null;

    assignedSupervisorId?: string | null;
    assignedSupervisor?: {
        id: string;
        name: string;
        email?: string | null;
        createdAt: Date;
    } | null;

    createdAt: Date;
    updatedAt: Date;
};

// Project Document upload
export interface ProjectDocumentDTO {
    id: string
    projectId: string
    title: string | null
    url: string
    fileType: string | null
    uploadedBy: string | null
    createdAt: string
}

// Laborer Type
export interface Laborer {
    id: string
    name: string
    nic?: string | null
    phone?: string | null
    workerType: WorkerType
    status: boolean
    notes?: string | null
    createdAt: Date
    updatedAt: Date
}

// Attendance Type
export interface Attendance {
    id: string
    laborerId: string
    supervisorId: string
    projectId: string
    date: Date
    checkIn?: Date | null
    checkOut?: Date | null
    hoursWorked?: number | null
    geoLocation?: string | null
    note?: string | null
    createdAt: Date
    laborer?: Laborer
    supervisor?: User
    project?: Project
}




// Material Request Item Type
export interface MaterialRequestItem {
    id: string
    materialRequestId: string
    inventoryItemId?: string | null
    name: string
    quantity: number
    unit?: string | null
    unitCost?: number | null
    totalCost?: number | null
}

export type UserForMaterialrequest = {
    id: string,
    name: string,
    email?: string,
}
export type ProjectForMeterials = {
    id: string,
    name: string,
}

// Material Request Type
export interface MaterialRequest {
    id: string
    projectId: string
    supervisorId: string
    status: RequestStatus
    note?: string | null
    adminResponse?: string | null
    respondedAt?: Date | null
    createdAt: Date
    updatedAt: Date
    items: MaterialRequestItem[]
    supervisor?: UserForMaterialrequest
    project?: ProjectForMeterials
}

// UI Item
export interface MaterialRequestItemUI {
    id: string
    name: string
    quantity: number
    unit?: string
    unitCost?: number
    totalCost?: number
}

//UI Request
export interface MaterialRequestUI {
    id: string
    status: RequestStatus
    note?: string
    adminResponse?: string
    createdAt: Date

    supervisor?: {
        id: string
        name: string
        email?: string | null
    }

    project?: {
        id: string
        name: string
    }

    items: MaterialRequestItemUI[]
}

export interface AdminRequestManagmentDTO {
    id: string;
    type: RequestType;
    status: RequestStatus;

    superVisorNote: string;
    adminNote: string | null;

    createdAt: string;
    updatedAt: string;

    supervisor: {
        id: string;
        name: string;
        email: string | null;
    };

    project: {
        id: string;
        name: string;
    };
}

export interface AdminRequestDetailsDTO {
    id: string;
    status: RequestStatus;
    type: RequestType;

    supervisorNote: string;
    adminNote: string | null;

    createdAt: string;
    updatedAt: string;

    supervisor: {
        id: string;
        name: string;
        email: string | null;
    };

    project: {
        id: string;
        name: string;
    };
}



// Labor Request Type
export interface LaborRequest {
    id: string
    projectId: string
    supervisorId: string
    requestedType: string
    quantity: number
    daysRequired?: number | null
    status: RequestStatus
    note?: string | null
    adminResponse?: string | null
    respondedAt?: Date | null
    createdAt: Date
    updatedAt: Date
    supervisor?: User
    project?: Project
}

// Daily Report Type
export interface DailyReportPhoto {
    id: string
    url: string
    caption?: string | null
}

// Payment Type
export interface Payment {
    id: string
    projectId?: string | null
    amount: number
    method: PaymentMethod
    payeeType: PayeeType
    laborerId?: string | null
    supervisorId?: string | null
    supplierName?: string | null
    reference?: string | null
    note?: string | null
    paidAt: Date
    createdAt: Date
    laborer?: Laborer
    supervisor?: User
    project?: Project
}

// Income Type
export interface Income {
    id: string
    projectId: string
    amount: number
    source?: string | null
    receivedAt: Date
    note?: string | null
    createdAt: Date
    project?: Project
}

// Expense Type
export interface Expense {
    id: string
    projectId?: string | null
    amount: number
    category?: string | null
    note?: string | null
    spentAt: Date
    createdAt: Date
    project?: Project
}

export type AdminAttendanceRow = {
    id: string; // assignmentId
    laborerId: string;
    laborerName: string;
    workerType: "PERMANENT" | "TEMPORARY";
    status: "ASSIGNED" | "PRESENT";
    checkIn?: string;
    checkOut?: string;
};


//// labor types

export type LaborSelection = {
    id: string;
    name: string;
    workerType: WorkerType;
}
export type AttendanceRow = {
    date: string;
    status: "PRESENT" | "ABSENT" | "HALF_DAY";
    hoursWorked?: number;
}



// Project Inventory Type (inventory items assigned to projects)

export type ProjectInventoryWithItem =
    Prisma.ProjectInventoryGetPayload<{
        include: { inventoryItem: true };
    }>;


// ✅ Client-safe type for Project Inventory table
export interface InventoryItemDTO {
    id: string
    name: string
    unit: string | null
    isActive: boolean
    category: {
        id: string
        name: string
    } | null
}

export interface ProjectInventorItemDTO {
    id: string
    projectId: string
    inventoryItemId: string

    quantity: number
    initialQuantity: number | null
    threshold: number | null
    unitCost: number | null

    createdAt: Date
    updatedAt: Date

    inventoryItem: InventoryItemDTO
}

export interface InventoryUsageCreateDTO {
    projectInventoryId: string
    quantity: number
    note: string
}

// lib/types.ts
export interface InventoryCheckoutItemDTO {
    projectInventoryId: string
    quantity: number
}

export interface InventoryCheckoutDTO {
    projectId: string
    note: string
    items: InventoryCheckoutItemDTO[]
}

//// supervisor request Metirial
export interface SupervisorRequestDTO {
    id: string;
    status: RequestStatus;
    type: RequestType;
    supervisorNote: string;
    adminNote: string | null;
    createdAt: string;
    updatedAt: string;
}

/// inventory usage
export interface GetInventoryUsageDTO {
    projectId: string
    projectInventoryId?: string
    fromDate: string
    toDate: string
}

// SUPLIER DTOS
export interface CreateSupplierDTO {
    name: string
    phone: string
    email?: string
    address?: string
    company?: string
    isActive?: boolean
}

export interface SupplierResponseDTO {
    id: string
    name: string
    phone: string
    email?: string | null
    address?: string | null
    company?: string | null
    isActive: boolean
    createdAt: Date
}

//  payment DTO
export interface PayeeSelectionDTO {
    id: string
    name: string
}

export const PAYEE_TYPES = [
    "LABORER",
    "SUPERVISOR",
    "SUPPLIER"
] as const

export type PayeeType = typeof PAYEE_TYPES[number]

// lib/dto/payment.dto.ts

export interface CreatePaymentDTO {
    projectId?: string
    amount: number
    method: "CASH" | "BANK_TRANSFER" | "CHECK"
    payeeType: "LABORER" | "SUPERVISOR" | "SUPPLIER"

    payeeId: string

    reference?: string
    note?: string
    paidAt?: Date
}

// 
export type PaymentDTO = {
    id: string
    date: string
    projectName: string
    payeeType: "LABORER" | "SUPERVISOR" | "SUPPLIER"
    payeeName: string
    amount: number
    paymentMethod: string
    reference: string
}



// todo
// Todo Type
export interface Todo {
    id: string
    title: string
    completed: boolean
    createdAt: Date
    updatedAt: Date
}

// finance
export interface ProjectFinanceDTO {
    id: string
    projectName: string
    totalIncome: number
    totalExpenses: number
    netProfit: number
    status: "profit" | "loss"
}

export interface MonthlyChartDTO {
    month: string
    income: number
    expenses: number
}

export interface ExpenseCategoryDTO {
    name: string
    value: number
}

// Daily reports
export interface DailyReport {
    id: string
    date: string
    status: "draft" | "submitted"
    weather: string
    notes: string
}

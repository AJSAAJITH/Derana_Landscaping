export type Role = "SUPER_ADMIN" | "SUPERVISOR"
export type ProjectStatus = "PENDING" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED"
export type WorkerType = "PERMANENT" | "TEMPORARY"
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED"
export type PaymentMethod = "CASH" | "BANK_TRANSFER" | "MOBILE_PAYMENT" | "CHECK" | "OTHER"
export type PayeeType = "LABORER" | "SUPERVISOR" | "SUPPLIER" | "OTHER"


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

// Inventory Item Type
export interface InventoryItem {
    id: string
    projectId: string
    name: string
    category?: string | null
    unit?: string | null
    quantity: number
    initialQuantity?: number | null
    threshold?: number | null
    unitCost?: number | null
    createdAt: Date
    updatedAt: Date
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
        email?: string
    }

    project?: {
        id: string
        name: string
    }

    items: MaterialRequestItemUI[]
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

export interface DailyReport {
    id: string
    projectId: string
    supervisorId: string
    note?: string | null
    weather?: string | null
    createdAt: Date
    photos: DailyReportPhoto[]
    supervisor?: User
    project?: Project
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



// app/api/users/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { requireRole } from "@/lib/rbac";

export async function POST(req: NextRequest) {
    try {
        // 1️⃣ Check logged-in user
        const { user } = await getAuthUser();
        requireRole(user, ["SUPER_ADMIN"]); // uncomment when ready

        // 2️⃣ Parse request body safely
        const body = await req.json().catch(() => null);
        if (!body) {
            return NextResponse.json(
                { error: "Invalid JSON" },
                { status: 400 }
            );
        }

        const { name, email, phone, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, Email, and Password are required" },
                { status: 400 }
            );
        }

        // 3️⃣ Split full name into firstName and lastName
        const [firstName, ...rest] = name.trim().split(" ");
        const lastName = rest.join(" ") || undefined;

        // for the username
        const username = email.split("@")[0];

        // 5️⃣ Get Clerk client
        const client = await clerkClient();

        // 6️⃣ Create user in Clerk
        const newClerkUser = await client.users.createUser({
            emailAddress: [email],
            username,
            firstName,
            lastName,
            password,
        });

        // 7️⃣ Save user in Prisma
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                clerkId: newClerkUser.id,
                role: "SUPERVISOR",
            },
        });

        return NextResponse.json(
            { message: "Supervisor created successfully", user: newUser },
            { status: 201 }
        );
    } catch (err: any) {
        console.error("Error creating user:", err);

        // Detect Clerk API errors specifically
        if (err?.clerkError) {
            console.log("CLERK ERRORS:", err.errors);
            return NextResponse.json(
                { error: err.longMessage || "Clerk API error", details: err.errors },
                { status: err.status || 422 }
            );
        }

        return NextResponse.json(
            { error: err?.message || "Internal Server Error" },
            { status: err?.status || 500 }
        );
    }
}

type PublicMetadata = {
    role?: "ADMIN" | "SUPERVISOR";
};

export async function GET(res: NextResponse) {
    // const { userId, sessionClaims } = await auth(); // ✅ await is REQUIRED

    // if (!userId) {
    //     return NextResponse.json(
    //         { error: "Unauthorized" },
    //         { status: 401 }
    //     );
    // }

    // const publicMetadata = sessionClaims?.publicMetadata as PublicMetadata | undefined;
    // const role = publicMetadata?.role;

    // if (role !== "ADMIN") {
    //     return NextResponse.json(
    //         { error: "Forbidden - Admin only" },
    //         { status: 403 }
    //     );
    // }

    // return NextResponse.json({
    //     message: "Users API working",
    //     userId,
    //     role,
    // });

    return NextResponse.json({
        message: "API Testing"
    });

}

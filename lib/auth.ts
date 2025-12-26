import { auth } from "@clerk/nextjs/server";
import prisma from "./prisma";

export async function getAuthUser() {
    // Get Clerk identity
    const { userId } = await auth();
    console.log("Auth User ID:", userId);

    if (!userId) {
        return { user: null, clerkId: null };
    }

    // Look up user in prisma db
    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
    });

    return { user, clerkId: userId };
}
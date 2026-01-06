import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignIn } from "@clerk/nextjs";

export default async function SignInPage() {
    const { user } = await getAuthUser().catch(() => ({ user: null }));

    // 🔁 Already logged in → go to role dashboard
    if (user) {
        if (user.role === "SUPER_ADMIN") redirect("/dashboard/admin");
        if (user.role === "SUPERVISOR") redirect("/dashboard/supervisor");
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <SignIn />
        </div>
    );
}

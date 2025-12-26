import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, req) => {
    const publicRoutes = [
        "/",
        "/api/auth/login",
    ];

    const url = new URL(req.url);
    const path = url.pathname;

    // If route is public → skip Clerk auth
    if (publicRoutes.includes(path)) {
        return;
    }

    // All other routes → require auth
    await auth();
});

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};

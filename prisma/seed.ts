
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client/extension";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
    adapter,
});

const userData = [
    {
        name: "Admin User",
        email: "admin@example.com",
        phone: "0777000000",
        password: "admin123", // you can later hash this

    },
    {
        name: "Supervisor 1",
        email: "supervisor1@example.com",
        phone: "0777123456",
        password: "supervisor123",

    },
    {
        name: "Supervisor 2",
        email: "supervisor2@example.com",
        phone: "0777456789",
        password: "supervisor123",
    },
];

export async function main() {
    console.log("🌱 Starting user seed...");

    for (const user of userData) {
        await prisma.user.upsert({
            where: { email: user.email }, // ensure we don't duplicate
            update: {},
            create: user,
        });
    }

    console.log("✅ User seed completed!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
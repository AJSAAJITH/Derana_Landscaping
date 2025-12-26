"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";

export default function GenerateToken() {
    const { getToken, isSignedIn } = useAuth();

    const generateToken = async () => {
        if (!isSignedIn) {
            console.error("User not signed in");
            return;
        }

        try {
            // 1️⃣ Get Clerk JWT token
            const token = await getToken();
            console.log("✅ Clerk JWT Token:", token);

            // 2️⃣ Call backend API with fetch
            const res = await fetch("/api/users", {
                method: "GET", // Change to POST if your API expects POST
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // Pass token in Bearer header
                },
            });

            // 3️⃣ Parse JSON safely
            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                console.error("Response is not valid JSON:", text);
                return;
            }

            if (!res.ok) {
                console.error("API Error:", data);
                return;
            }

            console.log("✅ API Response:", data);
        } catch (err) {
            console.error("Error fetching API:", err);
        }
    };

    return (
        <Button onClick={generateToken}>
            Generate Token & Call API
        </Button>
    );
}

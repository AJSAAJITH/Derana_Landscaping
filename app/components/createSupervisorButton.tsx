"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

export default function CreateSupervisorButton() {
    const { isLoaded, isSignedIn } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    if (!isLoaded) return <p>Loading...</p>;
    if (!isSignedIn) return <p>Please sign in</p>;

    const createSupervisor = async () => {
        try {
            setLoading(true);
            setMessage(null);

            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: "ajtest1",
                    email: "ajasaajithwork@gmail.com",
                    phone: "0757473323",
                    password: "L/A1002A",
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("API error:", data);
                setMessage(data.error || "Failed to create supervisor");
                return;
            }

            console.log("Created:", data);
            setMessage("Supervisor created successfully ✅");
        } catch (err) {
            console.error(err);
            setMessage("Unexpected error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-2">
            <Button onClick={createSupervisor} disabled={loading}>
                {loading ? "Creating..." : "Create Supervisor"}
            </Button>
            {message && <p className="text-sm">{message}</p>}
        </div>
    );
}

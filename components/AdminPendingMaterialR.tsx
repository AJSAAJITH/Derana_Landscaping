"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Clock } from "lucide-react";
import { Badge } from "./ui/badge";
import { getPendingMaterialRequests } from "@/app/actions/admin/request.inquary.action";

function PendingMaterialR() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const res = await getPendingMaterialRequests();
            if (res.success && res.data) {
                setRequests(res.data);
            }
            setLoading(false);
        }
        load();
    }, []);

    return (
        <Card className="border-border shadow-sm border-blue-200 dark:border-blue-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Pending Material Requests
                </CardTitle>
                <CardDescription>Awaiting approval</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 max-h-[240px] overflow-y-auto scroll-smooth scrollbar-hide">

                {/* 🔄 Loading */}
                {loading && (
                    <div className="space-y-3">
                        <div className="h-16 rounded-lg bg-muted animate-pulse" />
                        <div className="h-16 rounded-lg bg-muted animate-pulse" />
                    </div>
                )}

                {/* 📭 Empty */}
                {!loading && requests.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground py-6">
                        No pending material requests 🎉
                    </div>
                )}

                {/* 📦 Data */}
                {!loading &&
                    requests.map((req) => (
                        <div
                            key={req.id}
                            className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg"
                        >
                            <div>
                                <p className="font-medium">
                                    {req.supervisor.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Project: {req.project.name}
                                </p>

                                {req.superVisorNote && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {req.superVisorNote}
                                    </p>
                                )}
                            </div>

                            <Badge className="bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                Pending
                            </Badge>
                        </div>
                    ))}
            </CardContent>
        </Card>
    );
}

export default PendingMaterialR;

"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Users } from "lucide-react";
import { Badge } from "./ui/badge";
import { getPendingLaborRequests } from "@/app/actions/admin/request.inquary.action";

function LabourRequest() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const res = await getPendingLaborRequests();
            if (res.success && res.data) {
                setRequests(res.data);
            }
            setLoading(false);
        }
        load();
    }, []);

    return (
        <Card className="border-border shadow-sm border-purple-200 dark:border-purple-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Pending Labour Requests
                </CardTitle>
                <CardDescription>Awaiting admin approval</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 max-h-[240px] overflow-y-auto scroll-smooth scrollbar-hide">

                {/* 🔄 Loading State */}
                {loading && (
                    <div className="space-y-3">
                        <div className="h-16 rounded-lg bg-muted animate-pulse" />
                        <div className="h-16 rounded-lg bg-muted animate-pulse" />
                    </div>
                )}

                {/* 📭 Empty State */}
                {!loading && requests.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground py-6">
                        No pending labor requests 🎉
                    </div>
                )}

                {/* 📋 Data */}
                {!loading &&
                    requests.map((req) => (
                        <div
                            key={req.id}
                            className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950 rounded-lg"
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
                                        Note: {req.superVisorNote}
                                    </p>
                                )}
                            </div>

                            <Badge className="bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                Pending
                            </Badge>
                        </div>
                    ))}
            </CardContent>
        </Card>
    );
}

export default LabourRequest;

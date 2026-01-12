"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function CreateSupervisorModal({
    isOpen,
    onClose,
    onSubmit,
    loading,
    errors,
}: any) {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

    useEffect(() => {
        if (!isOpen) {
            setFormData({ name: "", email: "", phone: "", password: "" });
            setShowPassword(false);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const FieldError = ({ name }: { name: string }) =>
        errors?.[name] ? (
            <p className="text-sm text-red-600">{errors[name]}</p>
        ) : null;

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Supervisor</DialogTitle>
                    <DialogDescription>Create a supervisor account</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Full Name</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <FieldError name="name" />
                    </div>

                    <div>
                        <Label>Email</Label>
                        <Input
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <FieldError name="email" />
                    </div>

                    <div>
                        <Label>Phone</Label>
                        <Input
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <FieldError name="phone" />
                    </div>

                    <div>
                        <Label>Password</Label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                            />
                            <p className="text-xs text-muted-foreground">
                                Password must contain:
                                <br />• 8+ characters
                                <br />• Uppercase & lowercase letters
                                <br />• A number
                                <br />• A special character
                            </p>
                            <button
                                type="button"
                                className="absolute right-3 top-2.5"
                                onClick={() => setShowPassword((p) => !p)}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        <FieldError name="password" />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

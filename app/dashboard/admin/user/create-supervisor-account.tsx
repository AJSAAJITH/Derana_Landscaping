"use client"

import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

type Props = {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: {
        name: string
        email: string
        phone?: string
        password: string
    }) => void
    loading: boolean
    errors?: Record<string, string>
}

export default function CreateSupervisorModal({
    isOpen,
    onClose,
    onSubmit,
    loading,
    errors,
}: Props) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    })

    const [showPassword, setShowPassword] = useState(false)

    /* ✅ Reset form when modal closes */
    useEffect(() => {
        if (!isOpen) {
            setFormData({ name: "", email: "", phone: "", password: "" })
            setShowPassword(false)
        }
    }, [isOpen])

    /* ✅ Reusable field error component */
    const FieldError = ({ name }: { name: string }) =>
        errors?.[name] ? (
            <p className="text-sm text-red-600 mt-1">{errors[name]}</p>
        ) : null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = () => {
        onSubmit(formData)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Supervisor</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Name */}
                    <div>
                        <Input
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <FieldError name="name" />
                    </div>

                    {/* Email */}
                    <div>
                        <Input
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <FieldError name="email" />
                    </div>

                    {/* Phone */}
                    <div>
                        <Input
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        <FieldError name="phone" />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <Input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((p) => !p)}
                            className="absolute right-3 top-2.5 text-muted-foreground"
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                        <FieldError name="password" />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {loading ? "Creating..." : "Create Supervisor"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

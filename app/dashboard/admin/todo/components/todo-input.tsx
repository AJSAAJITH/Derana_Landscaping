'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { createTodoAction } from '@/app/actions/admin/todo.action'
import { toast } from 'react-toastify'

interface TodoInputProps {
    onCreated: () => void
}

export function TodoInput({ onCreated }: TodoInputProps) {
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!input.trim()) return

        setLoading(true)

        const result = await createTodoAction({ title: input })

        setLoading(false)

        if (!result.success) {
            toast(result.fieldErrors?.title || result.message)
            return
        }

        toast(result.message)

        setInput('')
        onCreated()
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Input
                        type="text"
                        placeholder="Add a new task..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 text-sm sm:text-base"
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 gap-2"
                        disabled={!input.trim() || loading}
                    >
                        <Plus className="w-4 h-4" />
                        Add
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

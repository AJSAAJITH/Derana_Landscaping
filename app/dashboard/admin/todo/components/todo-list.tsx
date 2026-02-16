'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Check, Edit2, Trash2, X } from 'lucide-react'
import { Todo } from '@/lib/types'

interface TodoListProps {
    todos: Todo[]
    onToggle: (id: string) => void
    onDelete: (id: string) => void
    onUpdate: (id: string, title: string) => void
}

export function TodoList({ todos, onToggle, onDelete, onUpdate }: TodoListProps) {
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editValue, setEditValue] = useState('')

    const handleEdit = (todo: Todo) => {
        setEditingId(todo.id)
        setEditValue(todo.title)
    }

    const handleSaveEdit = (id: string) => {
        if (editValue.trim()) {
            onUpdate(id, editValue.trim())
            setEditingId(null)
            setEditValue('')
        }
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setEditValue('')
    }

    if (todos.length === 0) {
        return (
            <Card>
                <CardContent className="pt-12 pb-12 text-center">
                    <p className="text-muted-foreground text-sm sm:text-base">No tasks yet. Add one to get started!</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-2 sm:space-y-3">
            {todos.map((todo) => (
                <Card key={todo.id} className={todo.completed ? 'opacity-75' : ''}>
                    <CardContent className="pt-4 pb-4">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <Checkbox
                                checked={todo.completed}
                                onCheckedChange={() => onToggle(todo.id)}
                                className="mt-1"
                            />

                            {editingId === todo.id ? (
                                <div className="flex-1 flex gap-2">
                                    <Input
                                        type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="flex-1 text-sm sm:text-base"
                                        autoFocus
                                    />
                                    <div className="flex gap-1">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleSaveEdit(todo.id)}
                                            className="h-9 w-9 p-0"
                                        >
                                            <Check className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handleCancelEdit}
                                            className="h-9 w-9 p-0"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className={`text-sm sm:text-base break-words ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                                                }`}
                                        >
                                            {todo.title}
                                        </p>
                                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                            {new Date(todo.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>

                                    <div className="flex gap-1 flex-shrink-0">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEdit(todo)}
                                            className="h-9 w-9 p-0 hidden sm:flex"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => onDelete(todo.id)}
                                            className="h-9 w-9 p-0"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
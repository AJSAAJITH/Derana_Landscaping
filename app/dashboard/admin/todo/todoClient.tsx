'use client'

import { useState, useEffect, useCallback } from 'react'
import { TodoStats } from './components/todo-stats'
import { TodoInput } from './components/todo-input'
import { TodoSearch } from './components/todo-search'
import { TodoList } from './components/todo-list'
import type { Todo } from '@/lib/types'
import {
    deleteTodoAction,
    getTodosAction,
    toggleTodoAction,
    updateTodoAction
} from '@/app/actions/admin/todo.action'
import { toast } from 'react-toastify'

export default function TodoClientPage() {
    const [todos, setTodos] = useState<Todo[]>([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    // ✅ Load Todos from DB
    const loadTodos = useCallback(async () => {
        setLoading(true)

        const result = await getTodosAction()

        if (result.success && result.data) {
            setTodos(result.data)
        } else {
            toast.error(result.message || 'Failed to load tasks')
        }

        setLoading(false)
    }, [])

    useEffect(() => {
        loadTodos()
    }, [loadTodos])

    // ✅ Toggle
    const handleToggleTodo = async (id: string) => {
        const result = await toggleTodoAction(id)

        if (!result.success) {
            toast.error(result.message || 'Failed to update task')
            return
        }

        setTodos((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, completed: !t.completed } : t
            )
        )

        toast.success('Task updated')
    }

    // ✅ Delete
    const handleDeleteTodo = async (id: string) => {
        const result = await deleteTodoAction(id)

        if (!result.success) {
            toast.error(result.message || 'Failed to delete task')
            return
        }

        setTodos((prev) => prev.filter((t) => t.id !== id))

        toast.success('Task deleted successfully')
    }

    // ✅ Update title
    const handleUpdateTodo = async (id: string, title: string) => {
        const result = await updateTodoAction({ id, title })

        if (!result.success) {
            toast.error(
                result.fieldErrors?.title ||
                result.message ||
                'Failed to update task'
            )
            return
        }

        setTodos((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, title } : t
            )
        )

        toast.success('Task updated successfully')
    }

    const filteredTodos = todos.filter((todo) =>
        todo.title.toLowerCase().includes(search.toLowerCase())
    )

    const stats = {
        total: todos.length,
        completed: todos.filter((t) => t.completed).length,
        pending: todos.filter((t) => !t.completed).length,
    }

    if (loading) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                Loading tasks...
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Daily Tasks
                </h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                    Manage your daily work plans and tasks
                </p>
            </div>

            {/* Stats */}
            <TodoStats {...stats} />

            {/* Create */}
            <TodoInput onCreated={loadTodos} />

            {/* Search */}
            <TodoSearch
                value={search}
                onChange={setSearch}
                onClear={() => setSearch('')}
            />

            {/* List */}
            <TodoList
                todos={filteredTodos}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
                onUpdate={handleUpdateTodo}
            />
        </div>
    )
}

'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'

interface TodoSearchProps {
    value: string
    onChange: (value: string) => void
    onClear: () => void
}

export function TodoSearch({ value, onChange, onClear }: TodoSearchProps) {
    return (
        <div className="flex gap-2 sm:gap-3">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search tasks..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="pl-9 text-sm sm:text-base"
                />
            </div>
            {value && (
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={onClear}
                    className="w-10 h-10"
                >
                    <X className="w-4 h-4" />
                </Button>
            )}
        </div>
    )
}

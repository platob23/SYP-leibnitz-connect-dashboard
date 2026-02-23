'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

type Option = { id: number; name: string }

export default function NewProjectPage() {
    const router = useRouter()

    const [statuses, setStatuses] = useState<Option[]>([])
    const [categories, setCategories] = useState<Option[]>([])

    const [titel, setTitel] = useState('')
    const [statusId, setStatusId] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [startDate, setStartDate] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        Promise.all([
            fetch('/api/statuses').then(r => r.json()),
            fetch('/api/categories').then(r => r.json()),
        ]).then(([s, c]) => {
            setStatuses(Array.isArray(s) ? s : [])
            setCategories(Array.isArray(c) ? c : [])
        })
    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    titel,
                    status_id: statusId ? Number(statusId) : null,
                    category_id: categoryId ? Number(categoryId) : null,
                    start_date: startDate || null,
                }),
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error ?? 'Fehler beim Erstellen des Projekts')
            }

            router.push('/projects')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-lg mx-auto py-8">
            <div className="mb-6">
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Zurück zu Projekte
                </Link>
                <h1 className="mt-4 text-2xl font-semibold">Neues Projekt</h1>
            </div>

            <form
                onSubmit={handleSubmit}
                className="rounded-lg border bg-background p-6 flex flex-col gap-5"
            >
                {/* Titel */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="titel">Titel *</Label>
                    <Input
                        id="titel"
                        value={titel}
                        onChange={e => setTitel(e.target.value)}
                        placeholder="Projektname"
                        required
                    />
                </div>

                {/* Status */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                        id="status"
                        value={statusId}
                        onChange={e => setStatusId(e.target.value)}
                        className="border-input bg-background dark:bg-input/30 h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    >
                        <option value="">Status wählen</option>
                        {statuses.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>

                {/* Kategorie */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="category">Kategorie</Label>
                    <select
                        id="category"
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
                        className="border-input bg-background dark:bg-input/30 h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    >
                        <option value="">Kategorie wählen</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {/* Startdatum */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="start_date">Startdatum</Label>
                    <Input
                        id="start_date"
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                    />
                </div>

                {error && (
                    <p className="text-sm text-destructive">{error}</p>
                )}

                <div className="flex gap-3 pt-2">
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Wird erstellt…' : 'Projekt erstellen'}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                        <Link href="/projects">Abbrechen</Link>
                    </Button>
                </div>
            </form>
        </div>
    )
}

'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

/* =======================
   Types
======================= */
type Project = {
    id: number
    titel: string | null
    status: string | null
    category: string | null
    created_at: string
    updated_at: string
}

/* =======================
   Status Styles
======================= */
const statusStyles: Record<string, { bg: string; text: string }> = {
    Veröffentlicht: { bg: 'bg-green-100', text: 'text-green-700' },
    'In Bearbeitung': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    Entwurf: { bg: 'bg-gray-100', text: 'text-gray-700' },
}

/* =======================
   Updated Filter Options
======================= */
const updatedRanges = [
    { label: 'Heute', value: 'today' },
    { label: 'Letzte 7 Tage', value: '7d' },
    { label: 'Letzte 30 Tage', value: '30d' },
]

/* =======================
   Page
======================= */
export default function Page() {
    const [projects, setProjects] = useState<Project[]>([])
    const [error, setError] = useState<string | null>(null)

    const [statusFilter, setStatusFilter] = useState<string | null>(null)
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
    const [updatedFilter, setUpdatedFilter] = useState<string | null>(null)

    // Selection & deletion
    const [selected, setSelected] = useState<Set<number>>(new Set())
    const [showConfirm, setShowConfirm] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    const selectAllRef = useRef<HTMLInputElement>(null)

    /* =======================
       Fetch Data
    ======================= */
    useEffect(() => {
        fetch('/api/projects')
            .then(res => {
                if (!res.ok) throw new Error('Failed to load projects')
                return res.json()
            })
            .then(data => {
                if (!Array.isArray(data)) throw new Error('Invalid response')
                setProjects(data)
            })
            .catch(err => {
                console.error(err)
                setError(err.message)
            })
    }, [])

    /* =======================
       Filter Options
    ======================= */
    const statuses = useMemo(
        () => Array.from(new Set(projects.map(p => p.status).filter(Boolean))),
        [projects]
    )

    const categories = useMemo(
        () => Array.from(new Set(projects.map(p => p.category).filter(Boolean))),
        [projects]
    )

    /* =======================
       Filtering Logic
    ======================= */
    const filteredProjects = useMemo(() => {
        return projects.filter(p => {
            if (statusFilter && p.status !== statusFilter) return false
            if (categoryFilter && p.category !== categoryFilter) return false

            if (updatedFilter) {
                const updatedAt = new Date(p.updated_at)
                const now = new Date()

                if (updatedFilter === 'today') {
                    return updatedAt.toDateString() === now.toDateString()
                }
                if (updatedFilter === '7d') {
                    return updatedAt >= new Date(now.setDate(now.getDate() - 7))
                }
                if (updatedFilter === '30d') {
                    return updatedAt >= new Date(now.setDate(now.getDate() - 30))
                }
            }

            return true
        })
    }, [projects, statusFilter, categoryFilter, updatedFilter])

    /* =======================
       Select-all indeterminate state
    ======================= */
    const allSelected =
        filteredProjects.length > 0 && filteredProjects.every(p => selected.has(p.id))
    const someSelected = filteredProjects.some(p => selected.has(p.id))

    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = someSelected && !allSelected
        }
    }, [someSelected, allSelected])

    /* =======================
       Selection Handlers
    ======================= */
    function toggleOne(id: number) {
        setSelected(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    function toggleAll() {
        const ids = filteredProjects.map(p => p.id)
        if (allSelected) {
            setSelected(prev => {
                const next = new Set(prev)
                ids.forEach(id => next.delete(id))
                return next
            })
        } else {
            setSelected(prev => {
                const next = new Set(prev)
                ids.forEach(id => next.add(id))
                return next
            })
        }
    }

    /* =======================
       Delete Handler
    ======================= */
    async function handleDelete() {
        setDeleting(true)
        setDeleteError(null)
        try {
            const res = await fetch('/api/projects', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: Array.from(selected) }),
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error ?? 'Fehler beim Löschen')
            }
            setProjects(prev => prev.filter(p => !selected.has(p.id)))
            setSelected(new Set())
            setShowConfirm(false)
        } catch (err: any) {
            setDeleteError(err.message)
        } finally {
            setDeleting(false)
        }
    }

    if (error) {
        return <p className="text-red-500">Error: {error}</p>
    }

    /* =======================
       Render
    ======================= */
    return (
        <>
            <div className="rounded-lg border bg-background">

                {/* HEADER */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h1 className="text-lg font-semibold">Projekte</h1>
                    <Link
                        href="/projects/new"
                        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4" />
                        Projekt hinzufügen
                    </Link>
                </div>

                {/* FILTER BAR */}
                <div className="flex flex-wrap gap-2 p-4 border-b bg-muted/20">
                    <select
                        className="rounded-md border px-3 py-1 text-sm bg-background"
                        value={statusFilter ?? ''}
                        onChange={e => setStatusFilter(e.target.value || null)}
                    >
                        <option value="">Status</option>
                        {statuses.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    <select
                        className="rounded-md border px-3 py-1 text-sm bg-background"
                        value={categoryFilter ?? ''}
                        onChange={e => setCategoryFilter(e.target.value || null)}
                    >
                        <option value="">Kategorie</option>
                        {categories.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>

                    <select
                        className="rounded-md border px-3 py-1 text-sm bg-background"
                        value={updatedFilter ?? ''}
                        onChange={e => setUpdatedFilter(e.target.value || null)}
                    >
                        <option value="">Zuletzt bearbeitet</option>
                        {updatedRanges.map(r => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                    </select>

                    <button
                        onClick={() => {
                            setStatusFilter(null)
                            setCategoryFilter(null)
                            setUpdatedFilter(null)
                        }}
                        className="ml-auto text-sm text-muted-foreground hover:text-foreground"
                    >
                        Filter zurücksetzen
                    </button>
                </div>

                {/* TABLE */}
                <table className="w-full text-sm">
                    <thead className="border-b bg-muted/40">
                        <tr className="text-left text-muted-foreground">
                            <th className="px-4 py-3">
                                <input
                                    ref={selectAllRef}
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={toggleAll}
                                    className="h-4 w-4 cursor-pointer accent-primary"
                                />
                            </th>
                            <th className="px-4 py-3">TITEL</th>
                            <th className="px-4 py-3">STATUS</th>
                            <th className="px-4 py-3">KATEGORIE</th>
                            <th className="px-4 py-3">ERSTELLT</th>
                            <th className="px-4 py-3">AKTUALISIERT</th>
                            <th className="px-4 py-3 text-right"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredProjects.map(project => {
                            const isSelected = selected.has(project.id)
                            return (
                                <tr
                                    key={project.id}
                                    className={`border-b last:border-b-0 transition-colors ${
                                        isSelected
                                            ? 'bg-destructive/8 dark:bg-destructive/15'
                                            : 'hover:bg-muted/30'
                                    }`}
                                >
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleOne(project.id)}
                                            className="h-4 w-4 cursor-pointer accent-primary"
                                        />
                                    </td>

                                    <td className="px-4 py-3 font-medium">
                                        {project.titel ?? '—'}
                                    </td>

                                    <td className="px-4 py-3">
                                        {project.status ? (
                                            <span
                                                className={`inline-flex rounded-md px-2 py-1 text-xs font-medium
                                                    ${statusStyles[project.status]?.bg ?? 'bg-muted'}
                                                    ${statusStyles[project.status]?.text ?? 'text-muted-foreground'}
                                                `}
                                            >
                                                {project.status}
                                            </span>
                                        ) : '—'}
                                    </td>

                                    <td className="px-4 py-3">
                                        {project.category ?? '—'}
                                    </td>

                                    <td className="px-4 py-3 text-muted-foreground">
                                        {new Date(project.created_at).toLocaleDateString()}
                                    </td>

                                    <td className="px-4 py-3 text-muted-foreground">
                                        {new Date(project.updated_at).toLocaleDateString()}
                                    </td>

                                    <td className="px-4 py-3 text-right">
                                        <ChevronDown className="h-4 w-4 text-muted-foreground cursor-pointer" />
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                {/* DELETE BAR */}
                {selected.size > 0 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t bg-destructive/5">
                        <span className="text-sm text-muted-foreground">
                            {selected.size} Projekt{selected.size !== 1 ? 'e' : ''} ausgewählt
                        </span>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setShowConfirm(true)}
                        >
                            <Trash2 className="h-4 w-4" />
                            Löschen
                        </Button>
                    </div>
                )}
            </div>

            {/* CONFIRMATION MODAL */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-background rounded-lg border shadow-lg p-6 max-w-sm w-full mx-4">
                        <h2 className="text-lg font-semibold mb-1">Projekte löschen?</h2>
                        <p className="text-sm text-muted-foreground mb-2">
                            Du bist dabei,{' '}
                            <span className="font-medium text-foreground">
                                {selected.size} Projekt{selected.size !== 1 ? 'e' : ''}
                            </span>{' '}
                            dauerhaft zu löschen.
                        </p>
                        <p className="text-sm text-destructive mb-6">
                            Diese Aktion kann nicht rückgängig gemacht werden.
                        </p>

                        {deleteError && (
                            <p className="text-sm text-destructive mb-4">{deleteError}</p>
                        )}

                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => { setShowConfirm(false); setDeleteError(null) }}
                                disabled={deleting}
                            >
                                Abbrechen
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? 'Wird gelöscht…' : 'Endgültig löschen'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
    AccessibilityIcon,
    CheckIcon,
    ChevronDown, Plus,
} from 'lucide-react'
import Link from "next/link";

/* =======================
   Types
======================= */
type Project = {
    titel: string | null
    status: string | null
    category: string | null
    created_at: string
    updated_at: string
}

/* =======================
   Status Styles
======================= */
const statusStyles: Record<
    string,
    { bg: string; text: string }
> = {
    Veröffentlicht: {
        bg: 'bg-green-100',
        text: 'text-green-700',
    },
    'In Bearbeitung': {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
    },
    Entwurf: {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
    },
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
        () =>
            Array.from(
                new Set(projects.map(p => p.status).filter(Boolean))
            ),
        [projects]
    )

    const categories = useMemo(
        () =>
            Array.from(
                new Set(projects.map(p => p.category).filter(Boolean))
            ),
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

    if (error) {
        return <p className="text-red-500">Error: {error}</p>
    }

    /* =======================
       Render
    ======================= */
    return (



        <div className="rounded-lg border bg-background">

            <div className="flex items-center justify-between p-4 border-b">
                <h1 className="text-lg font-semibold">Projekte</h1>

                <Link
                    href="/projects/new"
                    className="
      inline-flex items-center gap-2 rounded-md
      bg-primary px-4 py-2 text-sm font-medium text-primary-foreground
      hover:bg-primary/90
    "
                >
                    <Plus className="h-4 w-4" />
                    Projekt hinzufügen
                </Link>
            </div>

            {/* FILTER BAR */}
            <div className="flex flex-wrap gap-2 p-4 border-b bg-muted/20">
                {/* STATUS */}
                <select
                    className="rounded-md border px-3 py-1 text-sm bg-background"
                    value={statusFilter ?? ''}
                    onChange={e => setStatusFilter(e.target.value || null)}
                >
                    <option value="">Status</option>
                    {statuses.map(s => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>

                {/* CATEGORY */}
                <select
                    className="rounded-md border px-3 py-1 text-sm bg-background"
                    value={categoryFilter ?? ''}
                    onChange={e => setCategoryFilter(e.target.value || null)}
                >
                    <option value="">Kategorie</option>
                    {categories.map(c => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>

                {/* UPDATED */}
                <select
                    className="rounded-md border px-3 py-1 text-sm bg-background"
                    value={updatedFilter ?? ''}
                    onChange={e => setUpdatedFilter(e.target.value || null)}
                >
                    <option value="">Zuletzt bearbeitet</option>
                    {updatedRanges.map(r => (
                        <option key={r.value} value={r.value}>
                            {r.label}
                        </option>
                    ))}
                </select>

                {/* RESET */}
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
                        <CheckIcon />
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
                {filteredProjects.map((project, index) => (
                    <tr
                        key={index}
                        className="border-b last:border-b-0 hover:bg-muted/30"
                    >
                        <td className="px-4 py-3">
                            <AccessibilityIcon />
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
                            ) : (
                                '—'
                            )}
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
                ))}
                </tbody>
            </table>
        </div>
    )
}

'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, ImagePlus, Plus, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

type Option = { id: number; name: string }

type EditForm = {
    titel: string
    text: string
    largeDescription: string
    categoryId: string
    statusId: string
    imageFile: File | null
    currentImage: string | null
    previewUrl: string | null
}

/* =======================
   Status Styles
======================= */
const statusStyles: Record<string, { bg: string; text: string }> = {
    Veröffentlicht: { bg: 'bg-green-100', text: 'text-green-700' },
    'In Bearbeitung': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    Entwurf: { bg: 'bg-gray-100', text: 'text-gray-700' },
}

const selectClass =
    'border-input bg-background dark:bg-input/30 h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'

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
    const [allCategories, setAllCategories] = useState<Option[]>([])
    const [allStatuses, setAllStatuses] = useState<Option[]>([])

    const [statusFilter, setStatusFilter] = useState<string | null>(null)
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
    const [updatedFilter, setUpdatedFilter] = useState<string | null>(null)

    // Selection & deletion
    const [selected, setSelected] = useState<Set<number>>(new Set())
    const [showConfirm, setShowConfirm] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    // Expand / edit
    const [expandedId, setExpandedId] = useState<number | null>(null)
    const [editForm, setEditForm] = useState<EditForm | null>(null)
    const [editLoading, setEditLoading] = useState(false)
    const [editSaving, setEditSaving] = useState(false)
    const [editError, setEditError] = useState<string | null>(null)
    const editFileRef = useRef<HTMLInputElement>(null)

    const selectAllRef = useRef<HTMLInputElement>(null)

    /* =======================
       Fetch Data
    ======================= */
    useEffect(() => {
        Promise.all([
            fetch('/api/projects').then(r => r.json()),
            fetch('/api/categories').then(r => r.json()),
            fetch('/api/statuses').then(r => r.json()),
        ]).then(([projectsData, categoriesData, statusesData]) => {
            if (Array.isArray(projectsData)) setProjects(projectsData)
            else setError('Fehler beim Laden der Projekte')
            if (Array.isArray(categoriesData)) setAllCategories(categoriesData)
            if (Array.isArray(statusesData)) setAllStatuses(statusesData)
        }).catch(err => {
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
        } catch (err: unknown) {
            setDeleteError(err instanceof Error ? err.message : 'Fehler')
        } finally {
            setDeleting(false)
        }
    }

    /* =======================
       Expand / Edit Handlers
    ======================= */
    async function toggleExpand(project: Project) {
        if (expandedId === project.id) {
            setExpandedId(null)
            setEditForm(null)
            setEditError(null)
            return
        }

        setExpandedId(project.id)
        setEditForm(null)
        setEditError(null)
        setEditLoading(true)

        try {
            const res = await fetch(`/api/projects/${project.id}`)
            if (!res.ok) throw new Error('Fehler beim Laden')
            const data = await res.json()

            setEditForm({
                titel: data.titel ?? '',
                text: data.text ?? '',
                largeDescription: data.large_description ?? '',
                categoryId: String(data.category_id ?? ''),
                statusId: String(data.status_id ?? ''),
                imageFile: null,
                currentImage: data.image ?? null,
                previewUrl: data.image ?? null,
            })
        } catch (err: unknown) {
            setEditError(err instanceof Error ? err.message : 'Fehler')
        } finally {
            setEditLoading(false)
        }
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null
        if (!file) return
        const url = URL.createObjectURL(file)
        setEditForm(prev => prev ? { ...prev, imageFile: file, previewUrl: url } : prev)
    }

    function removeImage() {
        if (editForm?.previewUrl && editForm.previewUrl !== editForm.currentImage) {
            URL.revokeObjectURL(editForm.previewUrl)
        }
        setEditForm(prev => prev ? { ...prev, imageFile: null, previewUrl: null, currentImage: null } : prev)
        if (editFileRef.current) editFileRef.current.value = ''
    }

    async function handleSave() {
        if (!editForm || expandedId === null) return
        setEditSaving(true)
        setEditError(null)

        try {
            const formData = new FormData()
            formData.append('titel', editForm.titel)
            formData.append('text', editForm.text)
            formData.append('large_description', editForm.largeDescription)
            formData.append('category_id', editForm.categoryId)
            formData.append('status_id', editForm.statusId)
            if (editForm.imageFile) formData.append('image', editForm.imageFile)

            const res = await fetch(`/api/projects/${expandedId}`, {
                method: 'PATCH',
                body: formData,
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error ?? 'Fehler beim Speichern')
            }

            const categoryName = allCategories.find(c => String(c.id) === editForm.categoryId)?.name ?? null
            const statusName = allStatuses.find(s => String(s.id) === editForm.statusId)?.name ?? null

            setProjects(prev => prev.map(p =>
                p.id === expandedId
                    ? { ...p, titel: editForm.titel, category: categoryName, status: statusName, updated_at: new Date().toISOString() }
                    : p
            ))
            setExpandedId(null)
            setEditForm(null)
        } catch (err: unknown) {
            setEditError(err instanceof Error ? err.message : 'Fehler')
        } finally {
            setEditSaving(false)
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
                            const isExpanded = expandedId === project.id

                            return (
                                <React.Fragment key={project.id}>
                                    {/* PROJECT ROW */}
                                    <tr
                                        onClick={() => toggleExpand(project)}
                                        className={`border-b transition-colors cursor-pointer ${
                                            isExpanded
                                                ? 'bg-muted/40'
                                                : isSelected
                                                ? 'bg-destructive/8 dark:bg-destructive/15'
                                                : 'hover:bg-muted/30'
                                        }`}
                                    >
                                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
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
                                            <ChevronDown
                                                className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                            />
                                        </td>
                                    </tr>

                                    {/* EXPANDED EDIT ROW */}
                                    {isExpanded && (
                                        <tr className="border-b bg-muted/10">
                                            <td colSpan={7} className="px-6 py-5">
                                                {editLoading && (
                                                    <p className="text-sm text-muted-foreground">Lädt…</p>
                                                )}

                                                {!editLoading && editForm && (
                                                    <div className="grid grid-cols-[180px_1fr] gap-6 items-start">

                                                        {/* IMAGE */}
                                                        <div className="flex flex-col gap-2">
                                                            <Label>Projektbild</Label>
                                                            {editForm.previewUrl ? (
                                                                <div className="relative group cursor-pointer" onClick={() => editFileRef.current?.click()}>
                                                                    <img
                                                                        src={editForm.previewUrl}
                                                                        alt="Vorschau"
                                                                        className="w-full aspect-[4/3] object-cover rounded-md border"
                                                                    />
                                                                    <div className="absolute inset-0 rounded-md bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                        <span className="text-white text-xs font-medium flex items-center gap-1.5">
                                                                            <ImagePlus className="h-4 w-4" />
                                                                            Bild ersetzen
                                                                        </span>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={e => { e.stopPropagation(); removeImage() }}
                                                                        className="absolute top-1.5 right-1.5 rounded-full bg-background border p-1 shadow-sm hover:bg-muted"
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => editFileRef.current?.click()}
                                                                    className="flex flex-col items-center justify-center w-full aspect-[4/3] rounded-md border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/60 transition-colors text-muted-foreground gap-2"
                                                                >
                                                                    <ImagePlus className="h-7 w-7" />
                                                                    <span className="text-xs">Bild auswählen</span>
                                                                </button>
                                                            )}
                                                            <input
                                                                ref={editFileRef}
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleImageChange}
                                                                className="hidden"
                                                            />
                                                        </div>

                                                        {/* FIELDS */}
                                                        <div className="flex flex-col gap-3">
                                                            <div className="flex flex-col gap-1.5">
                                                                <Label htmlFor="edit-titel">Titel *</Label>
                                                                <Input
                                                                    id="edit-titel"
                                                                    value={editForm.titel}
                                                                    onChange={e => setEditForm(prev => prev ? { ...prev, titel: e.target.value } : prev)}
                                                                />
                                                            </div>

                                                            <div className="flex flex-col gap-1.5">
                                                                <Label htmlFor="edit-text">Kurzbeschreibung</Label>
                                                                <Input
                                                                    id="edit-text"
                                                                    value={editForm.text}
                                                                    onChange={e => setEditForm(prev => prev ? { ...prev, text: e.target.value } : prev)}
                                                                />
                                                            </div>

                                                            <div className="flex flex-col gap-1.5">
                                                                <Label htmlFor="edit-desc">Beschreibung</Label>
                                                                <textarea
                                                                    id="edit-desc"
                                                                    value={editForm.largeDescription}
                                                                    onChange={e => setEditForm(prev => prev ? { ...prev, largeDescription: e.target.value } : prev)}
                                                                    rows={3}
                                                                    className="border-input bg-background dark:bg-input/30 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-none"
                                                                />
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div className="flex flex-col gap-1.5">
                                                                    <Label>Kategorie *</Label>
                                                                    <select
                                                                        value={editForm.categoryId}
                                                                        onChange={e => setEditForm(prev => prev ? { ...prev, categoryId: e.target.value } : prev)}
                                                                        className={selectClass}
                                                                    >
                                                                        <option value="">Kategorie wählen</option>
                                                                        {allCategories.map(c => (
                                                                            <option key={c.id} value={c.id}>{c.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>

                                                                <div className="flex flex-col gap-1.5">
                                                                    <Label>Status</Label>
                                                                    <select
                                                                        value={editForm.statusId}
                                                                        onChange={e => setEditForm(prev => prev ? { ...prev, statusId: e.target.value } : prev)}
                                                                        className={selectClass}
                                                                    >
                                                                        <option value="">Status wählen</option>
                                                                        {allStatuses.map(s => (
                                                                            <option key={s.id} value={s.id}>{s.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>

                                                            {editError && (
                                                                <p className="text-sm text-destructive">{editError}</p>
                                                            )}

                                                            <div className="flex gap-2 pt-1">
                                                                <Button size="sm" onClick={handleSave} disabled={editSaving}>
                                                                    {editSaving ? 'Wird gespeichert…' : 'Speichern'}
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => { setExpandedId(null); setEditForm(null); setEditError(null) }}
                                                                    disabled={editSaving}
                                                                >
                                                                    Abbrechen
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {!editLoading && editError && !editForm && (
                                                    <p className="text-sm text-destructive">{editError}</p>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
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

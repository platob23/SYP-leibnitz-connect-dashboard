'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ImagePlus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Option = { id: number; name: string }

const selectClass =
    'border-input bg-background dark:bg-input/30 h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'

export default function NewProjectPage() {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [statuses, setStatuses] = useState<Option[]>([])
    const [categories, setCategories] = useState<Option[]>([])

    const [titel, setTitel] = useState('')
    const [text, setText] = useState('')
    const [largeDescription, setLargeDescription] = useState('')
    const [statusId, setStatusId] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

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

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null
        if (imagePreview) URL.revokeObjectURL(imagePreview)
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        } else {
            setImageFile(null)
            setImagePreview(null)
        }
    }

    function removeImage() {
        if (imagePreview) URL.revokeObjectURL(imagePreview)
        setImageFile(null)
        setImagePreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        if (!categoryId) {
            setError('Bitte wähle eine Kategorie aus.')
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('titel', titel)
            formData.append('text', text)
            formData.append('large_description', largeDescription)
            formData.append('category_id', categoryId)
            formData.append('status_id', statusId)
            if (imageFile) formData.append('image', imageFile)

            const res = await fetch('/api/projects', {
                method: 'POST',
                body: formData,
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
        <div className="max-w-5xl mx-auto py-8">
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

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 items-start">

                    {/* LEFT — Image */}
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="text-base">Projektbild</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {imagePreview ? (
                                <div className="relative w-full">
                                    <img
                                        src={imagePreview}
                                        alt="Vorschau"
                                        className="w-full aspect-[4/3] object-cover rounded-md border"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 rounded-full bg-background border p-1 shadow-sm hover:bg-muted transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex flex-col items-center justify-center w-full aspect-[4/3] rounded-md border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/60 transition-colors text-muted-foreground gap-3"
                                >
                                    <ImagePlus className="h-10 w-10" />
                                    <span className="text-sm font-medium">Bild auswählen</span>
                                    <span className="text-xs">PNG, JPG, WebP</span>
                                </button>
                            )}
                            {imageFile && (
                                <p className="text-xs text-muted-foreground truncate">{imageFile.name}</p>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </CardContent>
                    </Card>

                    {/* RIGHT — Fields */}
                    <div className="flex flex-col gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Allgemein</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
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

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="text">Kurzbeschreibung</Label>
                                    <Input
                                        id="text"
                                        value={text}
                                        onChange={e => setText(e.target.value)}
                                        placeholder="Kurze Beschreibung des Projekts"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="large_description">Beschreibung</Label>
                                    <textarea
                                        id="large_description"
                                        value={largeDescription}
                                        onChange={e => setLargeDescription(e.target.value)}
                                        placeholder="Ausführliche Beschreibung..."
                                        rows={5}
                                        className="border-input bg-background dark:bg-input/30 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-none"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Klassifizierung</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="category">Kategorie *</Label>
                                    <select
                                        id="category"
                                        value={categoryId}
                                        onChange={e => setCategoryId(e.target.value)}
                                        className={selectClass}
                                    >
                                        <option value="">Kategorie wählen</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <select
                                        id="status"
                                        value={statusId}
                                        onChange={e => setStatusId(e.target.value)}
                                        className={selectClass}
                                    >
                                        <option value="">Status wählen</option>
                                        {statuses.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </CardContent>
                        </Card>

                        {error && (
                            <p className="text-sm text-destructive">{error}</p>
                        )}

                        <div className="flex gap-3">
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Wird erstellt…' : 'Projekt erstellen'}
                            </Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href="/projects">Abbrechen</Link>
                            </Button>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    )
}

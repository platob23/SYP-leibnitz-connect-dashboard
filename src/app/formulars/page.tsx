'use client'

import { useEffect, useState } from 'react'

type Formular = {
    id: number
    name: string
    email: string
    phone: string | null
    message: string
    newsletter: boolean
    created_at: string
    Project?: { titel: string }
}

export default function FormularsPage() {
    const [formulars, setFormulars] = useState<Formular[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/formulars')
            .then(r => r.json())
            .then(setFormulars)
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="flex flex-col gap-6 py-4">
            <h1 className="text-2xl font-semibold">Formulare</h1>

            <div className="rounded-lg border bg-background">
                <table className="w-full text-sm">
                    <thead className="border-b bg-muted/40">
                        <tr className="text-left text-muted-foreground">
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">E-Mail</th>
                            <th className="px-4 py-3">Telefon</th>
                            <th className="px-4 py-3">Projekt</th>
                            <th className="px-4 py-3">Nachricht</th>
                            <th className="px-4 py-3">Newsletter</th>
                            <th className="px-4 py-3">Datum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground text-sm">
                                    Wird geladen…
                                </td>
                            </tr>
                        )}
                        {!loading && formulars.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground text-sm">
                                    Noch keine Einträge
                                </td>
                            </tr>
                        )}
                        {formulars.map(f => (
                            <tr key={f.id} className="border-b last:border-0 hover:bg-muted/30">
                                <td className="px-4 py-3 font-medium">{f.name}</td>
                                <td className="px-4 py-3">{f.email}</td>
                                <td className="px-4 py-3 text-muted-foreground">{f.phone ?? '—'}</td>
                                <td className="px-4 py-3">{f.Project?.titel ?? '—'}</td>
                                <td className="px-4 py-3 max-w-xs truncate text-muted-foreground">{f.message}</td>
                                <td className="px-4 py-3">{f.newsletter ? 'Ja' : 'Nein'}</td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {new Date(f.created_at).toLocaleDateString('de-AT')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

'use client'

import React, { useEffect, useState } from 'react'
import {
    AccessibilityIcon,
    CheckIcon,
    ChevronDown,
} from 'lucide-react'

type Project = {
    id: string
    status: string
    category_id: string | null
    created_at: string
    updated_at: string
}

export default function Page() {
    const [projects, setProjects] = useState<Project[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch('/api/projects')
            .then(res => {
                if (!res.ok) throw new Error('Failed to load projects')
                return res.json()
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setProjects(data)
                } else {
                    throw new Error('Invalid response')
                }
            })
            .catch(err => {
                console.error(err)
                setError(err.message)
            })
    }, [])

    if (error) {
        return <p className="text-red-500">Error: {error}</p>
    }

    return (
        <div className="rounded-lg border bg-background">
            <table className="w-full text-sm">
                <thead className="border-b bg-muted/40">
                <tr className="text-left text-muted-foreground">
                    <th className="px-4 py-3">
                        <CheckIcon />
                    </th>
                    <th className="px-4 py-3">PROJEKT ID</th>
                    <th className="px-4 py-3">STATUS</th>
                    <th className="px-4 py-3">KATEGORIE</th>
                    <th className="px-4 py-3">ERSTELLUNGSDATUM</th>
                    <th className="px-4 py-3">ZUL. BEARBEITET</th>
                    <th className="px-4 py-3 text-right"></th>
                </tr>
                </thead>

                <tbody>
                {projects.map(project => (
                    <tr
                        key={project.id}
                        className="border-b last:border-b-0 hover:bg-muted/30"
                    >
                        <td className="px-4 py-3">
                            <AccessibilityIcon />
                        </td>

                        <td className="px-4 py-3 font-mono text-sm">
                            {project.id}
                        </td>


                        {/* STATUS → NUR TEXT */}
                        <td className="px-4 py-3">
                            {project.status}
                        </td>

                        <td className="px-4 py-3 font-medium">
                            {project.category_id ?? '-'}
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

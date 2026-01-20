'use client'

import { useEffect, useState } from 'react'

export default function UsersPage() {
    const [projects, setProjects] = useState<any[]>([])

    useEffect(() => {
        fetch('/api/projects')
            .then(res => res.json())
            .then(data => setProjects(data))
    }, [])

    return (
        <div>
            <h1>Users</h1>
            <ul>
                {projects.map((p, index) => (
                    <li key={p.id}>Status:{p.status}Created_at:-{p.created_at}UpdatedAt:-{p.updated_at}CatID:-{p.category_id}</li>
                ))}
            </ul>
        </div>
    )
}

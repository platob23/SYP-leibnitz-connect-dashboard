'use client'

import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type MonthData = { month: string; count: number }
type Formular = { id: number; name: string; email: string; message: string; created_at: string; Project?: { titel: string } }

const chartConfig = {
    count: { label: 'Projekte', color: 'var(--chart-1)' },
} satisfies ChartConfig

export default function AnalysisPage() {
    const [data, setData] = useState<MonthData[]>([])
    const [formulars, setFormulars] = useState<Formular[]>([])

    useEffect(() => {
        fetch('/api/projects/per-month').then(r => r.json()).then(setData).catch(() => {})
        fetch('/api/formulars').then(r => r.json()).then(d => setFormulars(d.slice(0, 3))).catch(() => {})
    }, [])

    const year = new Date().getFullYear()
    const total = data.reduce((sum, d) => sum + d.count, 0)

    return (
        <div className="flex flex-col gap-6 py-4">
            <h1 className="text-2xl font-semibold">Analysen</h1>

            <div className="grid grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Projekte pro Monat</CardTitle>
                        <CardDescription>{year} · {total} Projekt{total !== 1 ? 'e' : ''} gesamt</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                            <BarChart accessibilityLayer data={data}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                                <YAxis tickLine={false} tickMargin={10} axisLine={false} allowDecimals={false} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Letzte Formulare</CardTitle>
                        <CardDescription>Zuletzt eingegangene Anfragen</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        {formulars.length === 0 && (
                            <p className="text-sm text-muted-foreground">Noch keine Einträge</p>
                        )}
                        {formulars.map(f => (
                            <div key={f.id} className="flex flex-col gap-0.5 border-b pb-3 last:border-0 last:pb-0">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{f.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(f.created_at).toLocaleDateString('de-AT')}
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground">{f.email}</span>
                                {f.Project?.titel && (
                                    <span className="text-xs text-muted-foreground">Projekt: {f.Project.titel}</span>
                                )}
                            </div>
                        ))}
                        <Link href="/formulars" className="mt-1">
                            <Button variant="outline" size="sm" className="w-full">Mehr anzeigen</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

'use client'

import React, { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

type MonthData = { month: string; count: number }

const chartConfig = {
    count: {
        label: 'Projekte',
        color: 'var(--chart-1)',
    },
} satisfies ChartConfig

export default function AnalysisPage() {
    const [data, setData] = useState<MonthData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch('/api/projects/per-month')
            .then(r => {
                if (!r.ok) throw new Error('Fehler beim Laden der Daten')
                return r.json()
            })
            .then(setData)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    const year = new Date().getFullYear()
    const total = data.reduce((sum, d) => sum + d.count, 0)

    return (
        <div className="flex flex-col gap-6 py-4">
            <h1 className="text-2xl font-semibold">Analysen</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Projekte pro Monat</CardTitle>
                    <CardDescription>
                        {year} · {total} Projekt{total !== 1 ? 'e' : ''} gesamt
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading && (
                        <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
                            Wird geladen…
                        </div>
                    )}
                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}
                    {!loading && !error && (
                        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                            <BarChart accessibilityLayer data={data}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                />
                                <YAxis
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    allowDecimals={false}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar
                                    dataKey="count"
                                    fill="var(--color-count)"
                                    radius={4}
                                />
                            </BarChart>
                        </ChartContainer>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

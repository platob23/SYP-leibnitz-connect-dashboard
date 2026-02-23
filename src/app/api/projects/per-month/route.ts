import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
    const year = new Date().getFullYear()

    const { data, error } = await supabase
        .from('Project')
        .select('created_at')
        .gte('created_at', `${year}-01-01T00:00:00.000Z`)
        .lt('created_at', `${year + 1}-01-01T00:00:00.000Z`)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const months = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(year, i).toLocaleString('de-AT', { month: 'short' }),
        count: 0,
    }))

    ;(data ?? []).forEach(p => {
        const m = new Date(p.created_at).getMonth()
        months[m].count++
    })

    return NextResponse.json(months)
}

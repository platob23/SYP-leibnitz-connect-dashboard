import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { titel, category_id, status_id, start_date } = body

    if (!titel?.trim()) {
        return NextResponse.json({ error: 'Titel ist erforderlich' }, { status: 400 })
    }

    const { data, error } = await supabase
        .from('Project')
        .insert({
            titel: titel.trim(),
            category_id: category_id ?? null,
            status_id: status_id ?? null,
            start_date: start_date ?? null,
        })
        .select()
        .single()

    if (error) {
        console.error(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
}

export async function GET() {
    const { data, error } = await supabase
        .from('Project')
        .select(`
      id,
      titel,
      created_at,
      updated_at,
      Category (
        name
      ),
      Status (
        name
      )
    `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const projects = (data ?? []).map((p: any) => ({
        titel: p.titel,
        category: p.Category?.name ?? null,
        status: p.Status?.name ?? null,
        created_at: p.created_at,
        updated_at: p.updated_at,
    }))

    return NextResponse.json(projects)
}

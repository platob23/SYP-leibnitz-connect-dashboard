import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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

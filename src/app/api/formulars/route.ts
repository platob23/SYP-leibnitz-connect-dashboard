import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { project_id, name, email, phone, message, newsletter } = body

    if (!project_id) {
        return NextResponse.json({ error: 'Projekt-ID ist erforderlich' }, { status: 400 })
    }
    if (!name?.trim()) {
        return NextResponse.json({ error: 'Name ist erforderlich' }, { status: 400 })
    }
    if (!email?.trim()) {
        return NextResponse.json({ error: 'E-Mail ist erforderlich' }, { status: 400 })
    }
    if (!message?.trim()) {
        return NextResponse.json({ error: 'Nachricht ist erforderlich' }, { status: 400 })
    }

    const { data, error } = await supabase
        .from('Formular')
        .insert({
            project_id: Number(project_id),
            name: name.trim(),
            email: email.trim(),
            phone: phone?.trim() || null,
            message: message.trim(),
            newsletter: newsletter ?? false,
        })
        .select()
        .single()

    if (error) {
        console.error(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
}

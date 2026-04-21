import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
    const formData = await req.formData()

    const titel = formData.get('titel') as string | null
    const text = formData.get('text') as string | null
    const largeDescription = formData.get('large_description') as string | null
    const categoryId = formData.get('category_id') as string | null
    const statusId = formData.get('status_id') as string | null
    const imageFile = formData.get('image') as File | null

    if (!titel?.trim()) {
        return NextResponse.json({ error: 'Titel ist erforderlich' }, { status: 400 })
    }
    if (!categoryId) {
        return NextResponse.json({ error: 'Kategorie ist erforderlich' }, { status: 400 })
    }

    let imageData: string | null = null
    if (imageFile && imageFile.size > 0) {
        const arrayBuffer = await imageFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        imageData = `\\x${buffer.toString('hex')}`
    }

    const { data, error } = await supabase
        .from('Project')
        .insert({
            titel: titel.trim(),
            text: text?.trim() || null,
            large_description: largeDescription?.trim() || null,
            category_id: Number(categoryId),
            status_id: statusId ? Number(statusId) : null,
            image: imageData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
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
      image,
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

    const projects = (data ?? []).map((p: any) => {
        let imageBase64: string | null = null
        if (p.image) {
            // Supabase returns bytea as "\xdeadbeef..." — strip the \x prefix and convert to base64
            const hex = typeof p.image === 'string' ? p.image.replace(/^\\x/, '') : Buffer.from(p.image).toString('hex')
            imageBase64 = `data:image/jpeg;base64,${Buffer.from(hex, 'hex').toString('base64')}`
        }
        return {
            id: p.id,
            titel: p.titel,
            image: imageBase64,
            category: p.Category?.name ?? null,
            status: p.Status?.name ?? null,
            created_at: p.created_at,
            updated_at: p.updated_at,
        }
    })

    return NextResponse.json(projects)
}

export async function DELETE(req: NextRequest) {
    const body = await req.json()
    const { ids } = body

    if (!Array.isArray(ids) || ids.length === 0) {
        return NextResponse.json({ error: 'Keine IDs angegeben' }, { status: 400 })
    }

    const { error } = await supabase
        .from('Project')
        .delete()
        .in('id', ids)

    if (error) {
        console.error(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ deleted: ids.length })
}

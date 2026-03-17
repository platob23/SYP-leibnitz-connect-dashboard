import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

type Params = Promise<{ id: string }>

export async function GET(_req: NextRequest, { params }: { params: Params }) {
    const { id } = await params

    const { data, error } = await supabase
        .from('Project')
        .select('id, titel, text, large_description, image, category_id, status_id')
        .eq('id', id)
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    let imageBase64: string | null = null
    if (data.image) {
        const hex = typeof data.image === 'string'
            ? data.image.replace(/^\\x/, '')
            : Buffer.from(data.image).toString('hex')
        imageBase64 = `data:image/jpeg;base64,${Buffer.from(hex, 'hex').toString('base64')}`
    }

    return NextResponse.json({ ...data, image: imageBase64 })
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
    const { id } = await params
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

    const updateData: Record<string, unknown> = {
        titel: titel.trim(),
        text: text?.trim() || null,
        large_description: largeDescription?.trim() || null,
        category_id: Number(categoryId),
        status_id: statusId ? Number(statusId) : null,
        updated_at: new Date().toISOString(),
    }

    if (imageFile && imageFile.size > 0) {
        const arrayBuffer = await imageFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        updateData.image = `\\x${buffer.toString('hex')}`
    }

    const { data, error } = await supabase
        .from('Project')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}

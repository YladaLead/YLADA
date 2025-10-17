import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Usar service role key para contornar RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'uploads'
    
    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo fornecido' }, { status: 400 })
    }

    console.log('📤 Upload via API:', { fileName: file.name, size: file.size, folder })

    // Criar nome único para o arquivo
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = `${folder}/${fileName}`

    // Converter File para Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload para Supabase Storage usando service role key
    const { data, error } = await supabase.storage
      .from('herbalead-public')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      console.error('❌ Erro no upload:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from('herbalead-public')
      .getPublicUrl(filePath)

    console.log('✅ Upload bem-sucedido:', { path: data.path, url: urlData.publicUrl })

    return NextResponse.json({
      success: true,
      path: data.path,
      url: urlData.publicUrl,
      fileName: file.name
    })

  } catch (error) {
    console.error('❌ Erro geral:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

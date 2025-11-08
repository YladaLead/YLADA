import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * POST /api/wellness/storage/signed-url
 * Gera uma URL assinada para um arquivo privado no storage
 */
export async function POST(request: NextRequest) {
  try {
    const { bucket, path, expiresIn = 3600 } = await request.json()

    console.log('Gerando URL assinada - Recebido:', { bucket, path, expiresIn })

    if (!bucket || !path) {
      return NextResponse.json(
        { error: 'Bucket e path são obrigatórios' },
        { status: 400 }
      )
    }

    // Gerar URL assinada
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)

    if (error) {
      console.error('Erro ao gerar URL assinada:', {
        error: error.message,
        bucket,
        path,
        errorDetails: error
      })
      return NextResponse.json(
        { error: `Erro ao gerar URL assinada: ${error.message}`, details: { bucket, path } },
        { status: 500 }
      )
    }

    console.log('URL assinada gerada com sucesso')

    return NextResponse.json({ 
      signedUrl: data.signedUrl,
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString()
    })
  } catch (error: any) {
    console.error('Erro interno ao gerar URL assinada:', error)
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { generateCertificateCode, checkAllTrilhasCompleted } from '@/lib/cursos-helpers'

/**
 * GET /api/nutri/cursos/certificado/[trilhaId]
 * Gera ou retorna certificado da trilha
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { trilhaId: string } }
) {
  try {
    const user = await requireApiAuth(request, ['nutri', 'admin'])
    if (!user || user instanceof NextResponse) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const trilhaId = params.trilhaId

    const supabase = supabaseAdmin

    // Verificar se certificado já existe
    const { data: certificadoExistente } = await supabase
      .from('cursos_certificados')
      .select('*')
      .eq('user_id', user.id)
      .eq('trilha_id', trilhaId)
      .maybeSingle()

    if (certificadoExistente) {
      return NextResponse.json({
        success: true,
        data: {
          certificado: certificadoExistente,
          ja_gerado: true,
        },
      })
    }

    // Verificar se trilha foi concluída
    const { data: progresso } = await supabase
      .from('cursos_progresso')
      .select('progress_percentage')
      .eq('user_id', user.id)
      .eq('item_type', 'trilha')
      .eq('item_id', trilhaId)
      .maybeSingle()

    if (!progresso || progresso.progress_percentage < 100) {
      return NextResponse.json(
        {
          error: 'Trilha não concluída',
          message: 'Complete 100% da trilha para gerar o certificado.',
          progress_percentage: progresso?.progress_percentage || 0,
        },
        { status: 403 }
      )
    }

    // Buscar dados do usuário para o certificado
    const { data: perfil } = await supabase
      .from('user_profiles')
      .select('nome_completo')
      .eq('user_id', user.id)
      .single()

    const nomeCompleto = perfil?.nome_completo || user.email?.split('@')[0] || 'Aluna'

    // Gerar código único
    let certificateCode = generateCertificateCode()

    // Garantir que código é único
    let tentativas = 0
    while (tentativas < 10) {
      const { data: existente } = await supabase
        .from('cursos_certificados')
        .select('id')
        .eq('certificate_code', certificateCode)
        .maybeSingle()

      if (!existente) {
        break
      }

      certificateCode = generateCertificateCode()
      tentativas++
    }

    // Buscar dados da trilha
    const { data: trilha } = await supabase
      .from('cursos_trilhas')
      .select('title, estimated_hours')
      .eq('id', trilhaId)
      .single()

    // Criar certificado (por enquanto sem PDF, só registro)
    // O PDF será gerado no frontend usando react-pdf
    const { data: certificado, error: certError } = await supabase
      .from('cursos_certificados')
      .insert({
        user_id: user.id,
        trilha_id: trilhaId,
        certificate_code: certificateCode,
        certificate_url: null, // Será gerado no frontend
        issued_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (certError) {
      console.error('❌ Erro ao criar certificado:', certError)
      return NextResponse.json(
        { error: 'Erro ao criar certificado', details: certError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        certificado: {
          ...certificado,
          nome_completo: nomeCompleto,
          trilha_title: trilha?.title || 'Formação Empresarial ILADA',
          carga_horaria: trilha?.estimated_hours || 0,
        },
        ja_gerado: false,
      },
    })
  } catch (error: any) {
    console.error('❌ Erro ao gerar certificado:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar certificado', details: error.message },
      { status: 500 }
    )
  }
}


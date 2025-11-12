import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verificarAdmin } from '@/lib/api-admin-check'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * GET /api/wellness/cursos/[id]/areas
 * Busca áreas de um curso (material)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const adminCheck = await verificarAdmin(token)

    if (adminCheck.error || !adminCheck.isAdmin) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Buscar áreas do material
    const { data, error } = await supabaseAdmin
      .from('curso_materiais_areas')
      .select('area')
      .eq('material_id', params.id)

    if (error) {
      return NextResponse.json(
        { error: `Erro ao buscar áreas: ${error.message}` },
        { status: 500 }
      )
    }

    const areas = (data || []).map((item: any) => item.area)

    return NextResponse.json({ areas })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}


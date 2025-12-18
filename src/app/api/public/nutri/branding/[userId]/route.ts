import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/public/nutri/branding/[userId]
 * 
 * Retorna informações de branding de um nutricionista (pública, sem autenticação)
 * Usada em páginas públicas como formulários e ferramentas
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar apenas campos de branding (públicos)
    const { data: profile, error } = await supabaseAdmin
      .from('user_profiles')
      .select('logo_url, brand_color, brand_name, professional_credential')
      .eq('user_id', userId)
      .eq('perfil', 'nutri') // Apenas nutricionistas
      .maybeSingle()

    if (error) {
      console.error('Erro ao buscar branding:', error)
      return NextResponse.json(
        { success: false, error: 'Erro ao buscar branding' },
        { status: 500 }
      )
    }

    // Se não encontrou perfil, retornar null (não é erro)
    if (!profile) {
      return NextResponse.json({
        success: true,
        data: null
      })
    }

    // Retornar dados de branding
    return NextResponse.json({
      success: true,
      data: {
        logoUrl: profile.logo_url || null,
        brandColor: profile.brand_color || null,
        brandName: profile.brand_name || null,
        professionalCredential: profile.professional_credential || null
      }
    })
  } catch (error: any) {
    console.error('Erro ao buscar branding:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

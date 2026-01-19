import { NextRequest, NextResponse } from 'next/server'
import { validateAndUseTrialInvite } from '@/lib/trial-helpers'

/**
 * POST /api/wellness/trial/validate-invite
 * Valida token de convite de trial
 * 
 * Body:
 * {
 *   token: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Token é obrigatório' },
        { status: 400 }
      )
    }

    // Validar token (não marca como usado ainda)
    const inviteData = await validateAndUseTrialInvite(token)

    if (!inviteData) {
      return NextResponse.json(
        { error: 'Token inválido, expirado ou já foi usado' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      email: inviteData.email,
      nome_completo: inviteData.nome_completo,
      whatsapp: inviteData.whatsapp,
    })
  } catch (error: any) {
    console.error('❌ Erro ao validar convite de trial:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao validar convite' },
      { status: 500 }
    )
  }
}

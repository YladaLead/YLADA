/**
 * POST /api/wellness/suporte/verificar-email/validar
 * Valida código de verificação
 */

import { NextRequest, NextResponse } from 'next/server'
import { getVerificationCode, deleteVerificationCode } from '../route'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { verificationId, code } = body

    if (!verificationId || !code) {
      return NextResponse.json(
        { error: 'Código de verificação é obrigatório' },
        { status: 400 }
      )
    }

    const verification = getVerificationCode(verificationId)

    if (!verification) {
      return NextResponse.json(
        { error: 'Código inválido ou expirado' },
        { status: 400 }
      )
    }

    if (verification.expiresAt < Date.now()) {
      deleteVerificationCode(verificationId)
      return NextResponse.json(
        { error: 'Código expirado. Solicite um novo código.' },
        { status: 400 }
      )
    }

    if (verification.code !== code) {
      return NextResponse.json(
        { error: 'Código incorreto' },
        { status: 400 }
      )
    }

    // Código válido - retornar email verificado
    const email = verification.email
    deleteVerificationCode(verificationId) // Usar apenas uma vez

    return NextResponse.json({
      success: true,
      email,
      message: 'Código verificado com sucesso!',
    })
  } catch (error: any) {
    console.error('❌ Erro ao validar código:', error)
    return NextResponse.json(
      { error: 'Erro ao validar código' },
      { status: 500 }
    )
  }
}

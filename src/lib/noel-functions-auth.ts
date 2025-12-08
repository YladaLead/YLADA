/**
 * Autenticação para Functions do NOEL (OpenAI)
 * 
 * Valida requisições do OpenAI Assistant usando Bearer token
 */

import { NextRequest, NextResponse } from 'next/server'

const OPENAI_FUNCTION_SECRET = process.env.OPENAI_FUNCTION_SECRET || process.env.NEXT_PUBLIC_OPENAI_FUNCTION_SECRET

/**
 * Valida autenticação da requisição do OpenAI
 */
export function validateNoelFunctionAuth(request: NextRequest): NextResponse | null {
  // Se não tiver secret configurado, permitir (apenas para desenvolvimento)
  if (!OPENAI_FUNCTION_SECRET) {
    console.warn('⚠️ OPENAI_FUNCTION_SECRET não configurado - permitindo acesso sem autenticação (apenas dev)')
    return null // Permitir acesso
  }

  // Buscar header Authorization
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader) {
    return NextResponse.json(
      { success: false, error: 'Authorization header é obrigatório' },
      { status: 401 }
    )
  }

  // Verificar formato Bearer token
  if (!authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, error: 'Formato de autorização inválido. Use: Bearer <token>' },
      { status: 401 }
    )
  }

  // Extrair token
  const token = authHeader.substring(7) // Remove "Bearer "

  // Validar token
  if (token !== OPENAI_FUNCTION_SECRET) {
    return NextResponse.json(
      { success: false, error: 'Token de autorização inválido' },
      { status: 401 }
    )
  }

  // Autenticação válida
  return null
}

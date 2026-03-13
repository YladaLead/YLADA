/**
 * GET /api/ylada/diagnostico-profissional/questions
 * Retorna as perguntas do quiz de diagnóstico estratégico do profissional.
 * Auth opcional (pode ser público para exibir o quiz).
 */
import { NextResponse } from 'next/server'
import { DIAGNOSTICO_PROFISSIONAL_QUESTIONS } from '@/config/diagnostico-profissional'

export async function GET() {
  return NextResponse.json({
    success: true,
    questions: DIAGNOSTICO_PROFISSIONAL_QUESTIONS,
  })
}

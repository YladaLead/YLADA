/**
 * GET /api/admin/whatsapp/carol/status
 *
 * Retorna se a automação da Carol está ligada ou desligada (kill-switch).
 * Usado pelo admin para exibir status e instruções de "Como ligar a Carol".
 * Ver PASSO-A-PASSO-DESLIGAR-AUTOMACAO.md e docs/PT-NOVO-CHAT-FLUXO-AUTOMACAO-WHATSAPP.md.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { isCarolAutomationDisabled } from '@/config/whatsapp-automation'

export async function GET(request: NextRequest) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) return authResult

  const disabled = isCarolAutomationDisabled()
  return NextResponse.json({
    disabled,
    carolEnabled: !disabled,
    message: disabled
      ? 'Automação Carol desligada. Para ligar: defina CAROL_AUTOMATION_DISABLED=false no Vercel (Environment Variables) e faça redeploy.'
      : 'Automação Carol ligada.',
  })
}

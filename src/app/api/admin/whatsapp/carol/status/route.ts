/**
 * GET /api/admin/whatsapp/carol/status
 * Retorna se a Carol está ligada ou desligada (controle pelo admin no banco).
 *
 * PATCH /api/admin/whatsapp/carol/status
 * body: { disabled: boolean } — liga ou desliga a Carol (sem mexer em .env ou Vercel).
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { getCarolAutomationDisabled, setCarolAutomationDisabled } from '@/lib/carol-admin-settings'

export async function GET(request: NextRequest) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) return authResult

  const disabled = await getCarolAutomationDisabled()
  return NextResponse.json({
    disabled,
    carolEnabled: !disabled,
    message: disabled
      ? 'Carol desligada. Use o botão abaixo para ligar.'
      : 'Carol ligada. Use o botão abaixo para desligar.',
    controlledByAdmin: true,
  })
}

export async function PATCH(request: NextRequest) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) return authResult

  let body: { disabled?: boolean } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const disabled = body.disabled
  if (typeof disabled !== 'boolean') {
    return NextResponse.json({ error: 'Envie { "disabled": true } ou { "disabled": false }' }, { status: 400 })
  }

  const { error } = await setCarolAutomationDisabled(disabled)
  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    disabled,
    carolEnabled: !disabled,
    message: disabled ? 'Carol desligada.' : 'Carol ligada.',
  })
}

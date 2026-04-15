import { NextResponse } from 'next/server'
import { getProEsteticaPainelContext, listProEsteticaSegmentos } from '@/lib/pro-estetica-server'

export async function GET() {
  const context = await getProEsteticaPainelContext()
  return NextResponse.json({
    segmentos: listProEsteticaSegmentos(),
    activeSegmentCode: context.activeSegmentCode,
    tenantDisplayName: context.tenantDisplayName,
    hasTenant: context.hasTenant,
  })
}

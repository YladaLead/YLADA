// =====================================================
// ALIAS: /api/c/portals/by-slug/[slug] -> /api/coach/portals/by-slug/[slug]
// Esta rota é um alias para manter compatibilidade
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { GET as CoachGet } from '../../../../coach/portals/by-slug/[slug]/route'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  console.log('🔗 Alias /api/c/portals/by-slug chamado, redirecionando para Coach...')
  return CoachGet(request, { params })
}


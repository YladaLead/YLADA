import type { User } from '@supabase/supabase-js'
import {
  DEFAULT_PRO_ESTETICA_SEGMENT_CODE,
  findProEsteticaSegmentByCode,
  PRO_ESTETICA_SEGMENTOS,
  type ProEsteticaSegmentCode,
} from '@/config/pro-estetica-segmentos'
import { createProLideresServerClient, resolveProLideresTenantContext } from '@/lib/pro-lideres-server'

async function getServerAuthUser() {
  const supabase = await createProLideresServerClient()
  const { data: sessionData } = await supabase.auth.getSession()
  if (sessionData.session?.user) {
    return { supabase, user: sessionData.session.user as User }
  }
  const { data: userData } = await supabase.auth.getUser()
  return { supabase, user: userData.user ?? null }
}

export async function getProEsteticaPainelContext() {
  const { supabase, user } = await getServerAuthUser()
  if (!user) {
    return {
      activeSegmentCode: DEFAULT_PRO_ESTETICA_SEGMENT_CODE,
      activeSegment: findProEsteticaSegmentByCode(DEFAULT_PRO_ESTETICA_SEGMENT_CODE),
      hasTenant: false,
      tenantDisplayName: null as string | null,
      tenantVerticalCode: null as string | null,
    }
  }

  const tenantContext = await resolveProLideresTenantContext(supabase, user)
  const tenantVerticalCode = tenantContext?.tenant.vertical_code?.trim() ?? null
  const activeSegment =
    findProEsteticaSegmentByCode(tenantVerticalCode) ??
    findProEsteticaSegmentByCode(DEFAULT_PRO_ESTETICA_SEGMENT_CODE)

  return {
    activeSegmentCode: (activeSegment?.code ?? DEFAULT_PRO_ESTETICA_SEGMENT_CODE) as ProEsteticaSegmentCode,
    activeSegment,
    hasTenant: Boolean(tenantContext),
    tenantDisplayName: tenantContext?.tenant.display_name ?? tenantContext?.tenant.team_name ?? null,
    tenantVerticalCode,
  }
}

export function listProEsteticaSegmentos() {
  return PRO_ESTETICA_SEGMENTOS
}

'use client'

import PilotAreaMinimal from '@/components/pilot/PilotAreaMinimal'
import { AREA_MINIMAL_LANDING_PROPS, areaLongLandingPathPt } from '@/config/area-public-entry'

export default function AreaMinimalLandingById({ areaId }: { areaId: string }) {
  const cfg = AREA_MINIMAL_LANDING_PROPS[areaId]
  if (!cfg) return null
  return (
    <PilotAreaMinimal
      segmentBadge={cfg.segmentBadge}
      headline={cfg.headline}
      subline={cfg.subline}
      primaryHref={cfg.primaryHref}
      primaryLabel={cfg.primaryLabel}
      proofLine={cfg.proofLine}
      fullPageHref={areaLongLandingPathPt(areaId)}
      fullPageLabel="Ver como funciona"
    />
  )
}

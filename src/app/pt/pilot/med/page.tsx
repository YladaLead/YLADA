import PilotAreaMinimal from '@/components/pilot/PilotAreaMinimal'

export default function PilotMedPage() {
  return (
    <PilotAreaMinimal
      segmentBadge="Medicina"
      headline="Explique menos na triagem. Convide mais quem valoriza a consulta."
      subline="Diagnósticos e links inteligentes para médicos: pacientes chegam mais preparados no WhatsApp."
      primaryHref="/pt/cadastro?area=med"
      primaryLabel="Começar grátis"
      fullPageHref="/pt/med"
      fullPageLabel="Ver como funciona"
    />
  )
}

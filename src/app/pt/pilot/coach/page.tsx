import PilotAreaMinimal from '@/components/pilot/PilotAreaMinimal'

export default function PilotCoachPage() {
  return (
    <PilotAreaMinimal
      segmentBadge="Coach"
      headline="Conversas que não viram sessão? Atraia clientes mais preparados."
      subline="Diagnósticos filtram curiosos e deixam o cliente chegar com clareza — bem-estar, carreira ou vida."
      primaryHref="/pt/cadastro?area=coach"
      primaryLabel="Começar grátis"
      fullPageHref="/pt/coach"
      fullPageLabel="Ver como funciona"
      proofLine="+3.000 profissionais já testaram o YLADA"
    />
  )
}

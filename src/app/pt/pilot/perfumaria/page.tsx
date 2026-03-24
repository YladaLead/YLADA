import PilotAreaMinimal from '@/components/pilot/PilotAreaMinimal'

export default function PilotPerfumariaPage() {
  return (
    <PilotAreaMinimal
      segmentBadge="Perfumaria"
      headline="Indicações que não viram compra? Traga quem já refletiu sobre fragrância."
      subline="Diagnósticos ajudam o cliente a entender preferências antes da conversa com você."
      primaryHref="/pt/cadastro?area=perfumaria"
      primaryLabel="Começar grátis"
      fullPageHref="/pt/perfumaria"
      fullPageLabel="Ver como funciona"
      proofLine="+3.000 profissionais já testaram o YLADA"
    />
  )
}

import PilotAreaMinimal from '@/components/pilot/PilotAreaMinimal'

export default function PilotNutriPage() {
  return (
    <PilotAreaMinimal
      segmentBadge="Nutrição"
      headline="Explique menos no primeiro contato. Venda mais o valor do acompanhamento."
      subline="O mesmo fluxo YLADA focado em nutricionistas: curiosos filtrados, conversas mais objetivas."
      primaryHref="/pt/cadastro?area=nutri"
      primaryLabel="Começar grátis"
      fullPageHref="/pt/nutri"
      fullPageLabel="Ver como funciona"
    />
  )
}

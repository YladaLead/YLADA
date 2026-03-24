import PilotAreaMinimal from '@/components/pilot/PilotAreaMinimal'

export default function PilotPsicanalisePage() {
  return (
    <PilotAreaMinimal
      segmentBadge="Psicanálise"
      headline="Menos explicação no primeiro contato. Analisandos mais preparados."
      subline="O cadastro segue o fluxo de psicologia na plataforma; a landing mostra o foco em psicanálise."
      primaryHref="/pt/cadastro?area=psi"
      primaryLabel="Começar grátis"
      fullPageHref="/pt/psicanalise"
      fullPageLabel="Ver como funciona"
      proofLine="+3.000 profissionais já testaram o YLADA"
    />
  )
}

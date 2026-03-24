import PilotAreaMinimal from '@/components/pilot/PilotAreaMinimal'

export default function PilotFitnessPage() {
  return (
    <PilotAreaMinimal
      segmentBadge="Fitness"
      headline="Menos “só uma dúvida”. Mais alunos com intenção de treinar com você."
      subline="Diagnósticos qualificam objetivos e rotina antes do primeiro contato no WhatsApp."
      primaryHref="/pt/cadastro?area=fitness"
      primaryLabel="Começar grátis"
      fullPageHref="/pt/fitness"
      fullPageLabel="Ver como funciona"
      proofLine="+3.000 profissionais já testaram o YLADA"
    />
  )
}

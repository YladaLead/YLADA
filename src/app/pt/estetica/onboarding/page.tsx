import { OnboardingPageContent } from '@/components/ylada/OnboardingPageContent'

export default function EsteticaOnboardingPage() {
  return (
    <OnboardingPageContent
      areaCodigo="estetica"
      areaLabel="Estética"
      redirectAfterSave="/pt/estetica/home"
      proofText="Mais de 1.200 profissionais de estética já usaram este diagnóstico para entender melhor seu momento profissional."
    />
  )
}

import { OnboardingPageContent } from '@/components/ylada/OnboardingPageContent'

export default function MedOnboardingPage() {
  return (
    <OnboardingPageContent
      areaCodigo="med"
      areaLabel="Médicos"
      redirectAfterSave="/pt/med/home"
      proofText="Mais de 1.200 médicos já usaram este diagnóstico para entender melhor seu momento profissional."
    />
  )
}

import { OnboardingPageContent } from '@/components/ylada/OnboardingPageContent'

export default function FitnessOnboardingPage() {
  return (
    <OnboardingPageContent
      areaCodigo="fitness"
      areaLabel="Fitness"
      redirectAfterSave="/pt/fitness/home"
      proofText="Mais de 1.200 profissionais de fitness já usaram este diagnóstico para entender melhor seu momento profissional."
    />
  )
}

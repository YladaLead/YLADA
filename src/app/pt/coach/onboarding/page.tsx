import { OnboardingPageContent } from '@/components/ylada/OnboardingPageContent'

export default function CoachOnboardingPage() {
  return (
    <OnboardingPageContent
      areaCodigo="coach"
      areaLabel="Coach"
      redirectAfterSave="/pt/coach/home"
      proofText="Mais de 1.200 coaches já usaram este diagnóstico para entender melhor seu momento profissional."
    />
  )
}

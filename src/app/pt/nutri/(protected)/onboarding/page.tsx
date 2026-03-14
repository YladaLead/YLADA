import { OnboardingPageContent } from '@/components/ylada/OnboardingPageContent'

export default function NutriOnboardingPage() {
  return (
    <OnboardingPageContent
      areaCodigo="nutri"
      areaLabel="Nutri"
      redirectIfDone="/pt/nutri/home"
      redirectAfterSave="/pt/nutri/diagnostico"
      proofText="Mais de 1.200 nutricionistas já usaram este diagnóstico para entender melhor seu momento profissional."
    />
  )
}

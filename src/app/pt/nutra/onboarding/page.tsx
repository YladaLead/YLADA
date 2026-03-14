import { OnboardingPageContent } from '@/components/ylada/OnboardingPageContent'

export default function NutraOnboardingPage() {
  return (
    <OnboardingPageContent
      areaCodigo="nutra"
      areaLabel="Nutra"
      redirectAfterSave="/pt/nutra/home"
      proofText="Mais de 1.200 consultores já usaram este diagnóstico para entender melhor seu momento profissional."
    />
  )
}

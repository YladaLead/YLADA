import { OnboardingPageContent } from '@/components/ylada/OnboardingPageContent'

export default function PerfumariaOnboardingPage() {
  return (
    <OnboardingPageContent
      areaCodigo="perfumaria"
      areaLabel="Perfumaria"
      redirectAfterSave="/pt/perfumaria/home"
      proofText="Mais de 1.200 profissionais já usaram este diagnóstico para entender melhor seu momento profissional."
    />
  )
}

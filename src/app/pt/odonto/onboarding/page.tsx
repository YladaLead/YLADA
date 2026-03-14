import { OnboardingPageContent } from '@/components/ylada/OnboardingPageContent'

export default function OdontoOnboardingPage() {
  return (
    <OnboardingPageContent
      areaCodigo="odonto"
      areaLabel="Odontologia"
      redirectAfterSave="/pt/odonto/home"
      proofText="Mais de 1.200 dentistas já usaram este diagnóstico para entender melhor seu momento profissional."
    />
  )
}

import { OnboardingPageContent } from '@/components/ylada/OnboardingPageContent'

export default function PsicanaliseOnboardingPage() {
  return (
    <OnboardingPageContent
      areaCodigo="psicanalise"
      areaLabel="Psicanálise"
      redirectAfterSave="/pt/psicanalise/home"
      proofText="Mais de 1.200 psicanalistas já usaram este diagnóstico para entender melhor seu momento profissional."
    />
  )
}

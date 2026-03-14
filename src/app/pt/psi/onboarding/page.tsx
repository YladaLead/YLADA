import { OnboardingPageContent } from '@/components/ylada/OnboardingPageContent'

export default function PsiOnboardingPage() {
  return (
    <OnboardingPageContent
      areaCodigo="psi"
      areaLabel="Psicologia"
      redirectAfterSave="/pt/psi/home"
      proofText="Mais de 1.200 psicólogos já usaram este diagnóstico para entender melhor seu momento profissional."
    />
  )
}

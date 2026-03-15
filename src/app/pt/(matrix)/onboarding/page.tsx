import { OnboardingPageContent } from '@/components/ylada/OnboardingPageContent'

export default function MatrixOnboardingPage() {
  return (
    <OnboardingPageContent
      areaCodigo="ylada"
      areaLabel="YLADA"
      redirectIfDone="/pt/home"
      redirectAfterSave="/pt/perfil-empresarial"
      proofText="Mais de 1.200 profissionais já usaram este diagnóstico para entender melhor seu momento profissional."
    />
  )
}

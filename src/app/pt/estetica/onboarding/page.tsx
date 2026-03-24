import { OnboardingPageContent } from '@/components/ylada/OnboardingPageContent'

export default function EsteticaOnboardingPage() {
  return (
    <OnboardingPageContent
      areaCodigo="estetica"
      areaLabel="Estética"
      redirectAfterSave="/pt/estetica/home"
      minimal
    />
  )
}

import { OnboardingPageContent } from '@/components/ylada/OnboardingPageContent'

export default function EsteticaOnboardingPage() {
  return (
    <OnboardingPageContent
      areaCodigo="estetica"
      areaLabel="Estética"
      redirectAfterSave="/pt/diagnostico-conviccao?area=estetica"
      minimal
    />
  )
}

import { OnboardingPageContent } from '@/components/ylada/OnboardingPageContent'

export default function SellerOnboardingPage() {
  return (
    <OnboardingPageContent
      areaCodigo="seller"
      areaLabel="Vendedores"
      redirectAfterSave="/pt/seller/home"
      proofText="Mais de 1.200 vendedores já usaram este diagnóstico para entender melhor seu momento profissional."
    />
  )
}

import LoginForm, { YLADA_SIGNUP_PAGE_HERO } from '@/components/auth/LoginForm'

export default function MedCadastroPage() {
  return (
    <LoginForm
      perfil="med"
      redirectPath="/pt/med/onboarding"
      initialSignUpMode={true}
      useYladaBrandingOnSignUp
      signUpHeroTitle={YLADA_SIGNUP_PAGE_HERO}
    />
  )
}

import LoginForm, { YLADA_SIGNUP_PAGE_HERO } from '@/components/auth/LoginForm'

export default function EsteticaCadastroPage() {
  return (
    <LoginForm
      perfil="estetica"
      redirectPath="/pt/estetica/onboarding"
      initialSignUpMode={true}
      useYladaBrandingOnSignUp
      signUpHeroTitle={YLADA_SIGNUP_PAGE_HERO}
    />
  )
}

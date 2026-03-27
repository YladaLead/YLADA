import LoginForm, { YLADA_SIGNUP_PAGE_HERO } from '@/components/auth/LoginForm'

export default function NutriCadastroPage() {
  return (
    <LoginForm
      perfil="nutri"
      redirectPath="/pt/nutri/home"
      initialSignUpMode={true}
      useYladaBrandingOnSignUp
      signUpHeroTitle={YLADA_SIGNUP_PAGE_HERO}
    />
  )
}

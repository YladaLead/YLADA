import LoginForm from '@/components/auth/LoginForm'

export default function NutriCadastroPage() {
  return (
    <LoginForm
      perfil="nutri"
      redirectPath="/pt/nutri/onboarding"
      initialSignUpMode={true}
    />
  )
}

import LoginForm from '@/components/auth/LoginForm'

export default function MedCadastroPage() {
  return (
    <LoginForm
      perfil="med"
      redirectPath="/pt/med/onboarding"
      initialSignUpMode={true}
    />
  )
}

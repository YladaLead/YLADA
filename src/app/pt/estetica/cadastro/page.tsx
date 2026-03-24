import LoginForm from '@/components/auth/LoginForm'

export default function EsteticaCadastroPage() {
  return (
    <LoginForm
      perfil="estetica"
      redirectPath="/pt/estetica/onboarding"
      initialSignUpMode={true}
    />
  )
}

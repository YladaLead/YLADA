import LoginForm from '@/components/auth/LoginForm'

export default function FitnessLoginPage() {
  return (
    <LoginForm
      perfil="fitness"
      redirectPath="/pt/fitness/links"
    />
  )
}

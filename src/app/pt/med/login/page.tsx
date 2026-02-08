import LoginForm from '@/components/auth/LoginForm'

export default function MedLoginPage() {
  return (
    <LoginForm
      perfil="med"
      redirectPath="/pt/med/home"
    />
  )
}

import LoginForm from '@/components/auth/LoginForm'

export default function EsteticaLoginPage() {
  return (
    <LoginForm
      perfil="estetica"
      redirectPath="/pt/estetica/links"
    />
  )
}

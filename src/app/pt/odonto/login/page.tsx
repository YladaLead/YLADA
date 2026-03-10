import LoginForm from '@/components/auth/LoginForm'

export default function OdontoLoginPage() {
  return (
    <LoginForm
      perfil="odonto"
      redirectPath="/pt/odonto/links"
    />
  )
}

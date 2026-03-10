import LoginForm from '@/components/auth/LoginForm'

export default function PerfumariaLoginPage() {
  return (
    <LoginForm
      perfil="perfumaria"
      redirectPath="/pt/perfumaria/links"
    />
  )
}

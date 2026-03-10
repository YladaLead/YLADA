import LoginForm from '@/components/auth/LoginForm'

export default function PsiLoginPage() {
  return (
    <LoginForm
      perfil="psi"
      redirectPath="/pt/psi/links"
    />
  )
}

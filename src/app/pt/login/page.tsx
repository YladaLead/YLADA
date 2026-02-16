import LoginForm from '@/components/auth/LoginForm'

/**
 * Login da matriz (app em /pt/home, /pt/trilha, etc.).
 */
export default function MatrixLoginPage() {
  return (
    <LoginForm
      perfil="ylada"
      redirectPath="/pt/home"
    />
  )
}

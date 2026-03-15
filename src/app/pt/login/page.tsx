import LoginForm from '@/components/auth/LoginForm'

/**
 * Login da matriz (app em /pt/home, /pt/trilha, etc.).
 * Para cadastro, use /pt/cadastro.
 */
export default function MatrixLoginPage() {
  return (
    <LoginForm
      perfil="ylada"
      redirectPath="/pt/home"
    />
  )
}

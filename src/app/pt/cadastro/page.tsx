'use client'

import LoginForm from '@/components/auth/LoginForm'

/**
 * Página de cadastro direto.
 * "Começar grátis" leva aqui — formulário de cadastro sem passar pelo login.
 * A área é definida quando o usuário preenche o perfil.
 */
export default function CadastroPage() {
  return (
    <LoginForm
      perfil="ylada"
      redirectPath="/pt/onboarding"
      initialSignUpMode={true}
    />
  )
}

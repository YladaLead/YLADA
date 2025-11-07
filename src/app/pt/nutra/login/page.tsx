import LoginForm from '@/components/auth/LoginForm'

export default function NutraLoginPage() {
  return (
    <LoginForm 
      perfil="nutra" 
      redirectPath="/pt/nutra/dashboard"
      logoColor="laranja"
    />
  )
}


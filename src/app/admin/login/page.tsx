import LoginForm from '@/components/auth/LoginForm'

export default function AdminLoginPage() {
  return (
    <LoginForm 
      perfil="admin" 
      redirectPath="/admin"
      logoColor="azul-claro"
    />
  )
}



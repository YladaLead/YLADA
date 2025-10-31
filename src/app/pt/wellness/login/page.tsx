import LoginForm from '@/components/auth/LoginForm'

export default function WellnessLoginPage() {
  return (
    <LoginForm 
      perfil="wellness" 
      redirectPath="/pt/wellness/dashboard"
      logoColor="verde"
    />
  )
}


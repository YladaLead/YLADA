import LoginForm from '@/components/auth/LoginForm'

export default function SellerLoginPage() {
  return (
    <LoginForm
      perfil="seller"
      redirectPath="/pt/seller/links"
    />
  )
}

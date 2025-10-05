'use client'

import { Suspense } from 'react'
import AuthPage from '../page'

function LoginPageContent() {
  return <AuthPage />
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}

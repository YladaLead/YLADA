'use client'

import Link from 'next/link'
import Image from 'next/image'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

function ContasDemoContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Dashboard
            </Link>
            <div className="h-6 w-px bg-gray-200" />
            <h1 className="text-lg font-semibold text-gray-900">Contas demo (vídeos)</h1>
          </div>
          <Link href="/">
            <Image
              src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png"
              alt="YLADA"
              width={120}
              height={42}
              className="h-8 w-auto"
            />
          </Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-sm text-gray-600 mb-4">
          Credenciais internas para gravar demonstrações (perfis já configurados). Não compartilhe publicamente.
        </p>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Área</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">E-mail</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Senha</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Login</th>
                </tr>
              </thead>
              <tbody>
                {([
                  ['Médico', 'demo.med@ylada.app', '/pt/med/login'],
                  ['Psicólogo', 'demo.psi@ylada.app', '/pt/psi/login'],
                  ['Vendas em gerais', 'demo.vendedor@ylada.app', '/pt/seller/login'],
                  ['Nutra', 'demo.nutra@ylada.app', '/pt/nutra/login'],
                  ['Nutricionista', 'demo.nutri@ylada.app', '/pt/nutri/login'],
                  ['Coach', 'demo.coach@ylada.app', '/pt/coach/login'],
                  ['Esteticista (segmento YLADA /pt)', 'demo.estetica@ylada.app', '/pt/estetica/login'],
                  ['Pro Estética capilar', 'demo.capilar@ylada.app', '/pro-estetica-capilar/entrar'],
                  ['Pro Estética corporal', 'demo@proesteticacorporal.com', '/pro-estetica-corporal/entrar', '123456'],
                  ['Pró Líderes', 'demo@prolider.com', '/pro-lideres/entrar', '123456'],
                  ['Perfumaria', 'demo.perfumaria@ylada.app', '/pt/perfumaria/login'],
                  ['Joias e bijuterias', 'demo.joias@ylada.app', '/pt/joias/login'],
                ] satisfies [string, string, string, string?][]).map((row) => {
                  const [area, email, login, pwd] = row
                  const senha = pwd ?? 'Demo@2025!'
                  return (
                  <tr key={email} className="border-b border-gray-100">
                    <td className="py-2 px-3 font-medium text-gray-900">{area}</td>
                    <td className="py-2 px-3 font-mono text-gray-800">{email}</td>
                    <td className="py-2 px-3 font-mono text-gray-800">{senha}</td>
                    <td className="py-2 px-3">
                      <a
                        href={login}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {login}
                      </a>
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4 space-y-1">
          <span className="block">
            Demo YLADA <code className="bg-gray-100 px-1 rounded">@ylada.app</code>:{' '}
            <code className="bg-gray-100 px-1 rounded">node scripts/criar-contas-demo-videos.js</code>
          </span>
          <span className="block">
            Pro Estética corporal (mesmo e-mail da tabela): se o login não existir no Supabase, aplicar{' '}
            <code className="bg-gray-100 px-1 rounded">scripts/pro-estetica-corporal-demo-login.sql</code>
          </span>
          <span className="block">
            Pró Líderes (mesmo e-mail da tabela): para criar o líder demo, tenant, equipe sintética e telemetria, aplicar{' '}
            <code className="bg-gray-100 px-1 rounded">scripts/pro-lideres-demo-prolider-equipe.sql</code>
          </span>
        </p>
      </main>
    </div>
  )
}

export default function ContasDemoPage() {
  return (
    <AdminProtectedRoute>
      <ContasDemoContent />
    </AdminProtectedRoute>
  )
}

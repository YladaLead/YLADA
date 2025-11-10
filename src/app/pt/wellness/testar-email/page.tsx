'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function TestarEmailPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [email, setEmail] = useState(user?.email || 'falaandre@gmail.com')

  const handleTest = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || 'Erro ao testar',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🧪 Testar Envio de E-mail
          </h1>

          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mail para testar
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="seu@email.com"
              />
            </div>

            <button
              onClick={handleTest}
              disabled={loading || !email}
              className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Enviando...' : '📧 Enviar E-mail de Teste'}
            </button>

            {result && (
              <div className={`p-4 rounded-lg ${
                result.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <h3 className="font-semibold mb-2">
                  {result.success ? '✅ Sucesso!' : '❌ Erro'}
                </h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h3 className="font-semibold text-blue-900 mb-2">ℹ️ O que verificar:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Se aparecer "success: true" → E-mail foi enviado!</li>
                <li>• Verifique sua caixa de entrada e spam</li>
                <li>• Verifique no Resend: https://resend.com/emails</li>
                <li>• Se aparecer erro → Veja a mensagem acima</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


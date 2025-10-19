'use client'

import { useState, useEffect } from 'react'
import YLADALogo from '@/components/YLADALogo'
import Link from 'next/link'

interface DiagnosticResult {
  success: boolean
  diagnostics: any
  summary: any
}

export default function DiagnosticPage() {
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const runDiagnostic = async () => {
      try {
        const response = await fetch('/api/supabase-diagnostic')
        const data = await response.json()
        setDiagnostic(data)
      } catch (err) {
        setError('Erro ao executar diagnóstico')
        console.error('Erro:', err)
      } finally {
        setLoading(false)
      }
    }

    runDiagnostic()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <YLADALogo />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Diagnóstico Supabase</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              🔍 Diagnóstico Completo do Supabase
            </h2>

            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Executando diagnóstico...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">❌ {error}</p>
              </div>
            )}

            {diagnostic && (
              <div className="space-y-6">
                {/* Resumo */}
                <div className={`p-4 rounded-lg ${
                  diagnostic.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <h3 className="font-semibold text-lg mb-2">
                    {diagnostic.success ? '✅ Status Geral: OK' : '❌ Status Geral: Problemas Detectados'}
                  </h3>
                  <p className="text-sm">
                    {diagnostic.summary.recommendation}
                  </p>
                  <div className="mt-2 text-sm">
                    <p>• Erros: {diagnostic.summary.totalErrors}</p>
                    <p>• Erros de tabela: {diagnostic.summary.tableErrors}</p>
                    <p>• Conexão: {diagnostic.summary.connectionStatus}</p>
                  </div>
                </div>

                {/* Variáveis de Ambiente */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3">🔧 Variáveis de Ambiente</h3>
                  <div className="space-y-2 text-sm">
                    <p>• Supabase URL: {diagnostic.diagnostics.environment.supabaseUrl}</p>
                    <p>• Supabase Anon Key: {diagnostic.diagnostics.environment.supabaseAnonKey}</p>
                    <p>• Service Role Key: {diagnostic.diagnostics.environment.serviceRoleKey}</p>
                  </div>
                </div>

                {/* Conexão */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3">🔗 Conexão</h3>
                  <p className="text-sm">Status: {diagnostic.diagnostics.connection.status}</p>
                  {diagnostic.diagnostics.connection.error && (
                    <p className="text-sm text-red-600 mt-2">
                      Erro: {diagnostic.diagnostics.connection.error}
                    </p>
                  )}
                </div>

                {/* Tabelas */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3">📊 Tabelas</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(diagnostic.diagnostics.tables).map(([table, status]) => (
                      <div key={table} className="flex items-center space-x-2">
                        <span className={status.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                          {status.includes('✅') ? '✅' : '❌'}
                        </span>
                        <span className="font-mono text-xs">{table}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Erros */}
                {diagnostic.diagnostics.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3 text-red-800">❌ Erros Detectados</h3>
                    <div className="space-y-2">
                      {diagnostic.diagnostics.errors.map((error: string, index: number) => (
                        <p key={index} className="text-sm text-red-700">
                          • {error}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ações */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    🔄 Executar Novamente
                  </button>
                  <Link
                    href="/create"
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    ← Voltar para Criar
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

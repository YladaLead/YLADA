'use client'

import { useState } from 'react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import { BIBLIOTECA_SEGMENTOS, type BibliotecaSegmentCode } from '@/config/ylada-biblioteca'
import { BIBLIOTECA_TEMAS } from '@/config/ylada-biblioteca'
import type { DiagnosisArchitecture } from '@/lib/ylada/diagnosis-types'

function AdminGerarFluxos() {
  return (
    <AdminProtectedRoute>
      <AdminGerarFluxosContent />
    </AdminProtectedRoute>
  )
}

function AdminGerarFluxosContent() {
  const [tema, setTema] = useState('')
  const [temaCustomizado, setTemaCustomizado] = useState('')
  const [usarTemaCustomizado, setUsarTemaCustomizado] = useState(false)
  const [segmentos, setSegmentos] = useState<BibliotecaSegmentCode[]>(['nutrition'])
  const [arquitetura, setArquitetura] = useState<DiagnosisArchitecture>('RISK_DIAGNOSIS')
  const [comando, setComando] = useState('')
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState<{
    success: boolean
    message: string
    data?: any
  } | null>(null)

  // Segmentos incluindo Coach do bem estar
  // Remover duplicatas e garantir que "Coach do bem estar" apareça como label alternativo
  const segmentosCompletos = [
    ...BIBLIOTECA_SEGMENTOS.map(s => 
      s.value === 'fitness' 
        ? { value: s.value, label: 'Fitness / Coach do bem estar' }
        : s
    ),
  ]

  const arquiteturas: { 
    value: DiagnosisArchitecture
    label: string
    descricao: string
  }[] = [
    { 
      value: 'RISK_DIAGNOSIS', 
      label: 'Diagnóstico de Risco (RISK_DIAGNOSIS)',
      descricao: 'Avalia sinais, sintomas, histórico e impacto. Resultado: nível de risco (baixo/médio/alto). Ideal para temas de saúde, prevenção e consequências.'
    },
    { 
      value: 'BLOCKER_DIAGNOSIS', 
      label: 'Diagnóstico de Bloqueio (BLOCKER_DIAGNOSIS)',
      descricao: 'Identifica o principal bloqueio (rotina, emocional, processo, hábitos, expectativa). Foco em destravar e primeiro passo. Ideal para profissionais liberais.'
    },
    { 
      value: 'PROFILE_TYPE', 
      label: 'Perfil Comportamental (PROFILE_TYPE)',
      descricao: 'Identifica perfil comportamental (consistente, 8ou80, ansioso, analítico, improvisador). Foco em autoconhecimento e caminho personalizado.'
    },
  ]

  const handleGerar = async () => {
    const temaFinal = usarTemaCustomizado ? temaCustomizado.trim() : tema.trim()
    
    if (!temaFinal && !comando.trim()) {
      alert('Preencha o tema (da lista ou customizado) ou o comando personalizado')
      return
    }

    setLoading(true)
    setResultado(null)

    try {
      const response = await fetch('/api/admin/fluxos/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tema: temaFinal || undefined,
          segmentos: segmentos.length > 0 ? segmentos : ['nutrition'], // Garantir pelo menos um
          arquitetura,
          comando: comando.trim() || undefined,
        }),
      })

      const data = await response.json()
      setResultado(data)
    } catch (error: any) {
      setResultado({
        success: false,
        message: `Erro: ${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🤖 Gerador de Fluxos (Agente Criador)
          </h1>
          <p className="text-gray-600 mb-6">
            Use o agente IA para criar novos fluxos e diagnósticos que serão adicionados automaticamente à biblioteca.
          </p>

          <div className="space-y-6">
            {/* Tema */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tema
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    id="tema-lista"
                    name="tema-tipo"
                    checked={!usarTemaCustomizado}
                    onChange={() => {
                      setUsarTemaCustomizado(false)
                      setTemaCustomizado('')
                    }}
                    className="w-4 h-4 text-blue-600"
                  />
                  <label htmlFor="tema-lista" className="text-sm text-gray-700">
                    Selecionar da lista
                  </label>
                </div>
                {!usarTemaCustomizado && (
                  <select
                    value={tema}
                    onChange={(e) => setTema(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione um tema...</option>
                    {BIBLIOTECA_TEMAS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                )}
                
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    id="tema-custom"
                    name="tema-tipo"
                    checked={usarTemaCustomizado}
                    onChange={() => {
                      setUsarTemaCustomizado(true)
                      setTema('')
                    }}
                    className="w-4 h-4 text-blue-600"
                  />
                  <label htmlFor="tema-custom" className="text-sm text-gray-700">
                    Digitar tema customizado (ex: medicamento, ansiedade, etc.)
                  </label>
                </div>
                {usarTemaCustomizado && (
                  <input
                    type="text"
                    value={temaCustomizado}
                    onChange={(e) => setTemaCustomizado(e.target.value)}
                    placeholder="Ex: medicamento, ansiedade, sono, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              </div>
            </div>

            {/* Segmentos (múltipla seleção) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Segmentos (pode selecionar múltiplos)
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Um fluxo pode servir para vários segmentos. Selecione todos os que se aplicam.
              </p>
              <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto bg-gray-50 space-y-1">
                {segmentosCompletos.map((s) => {
                  const isChecked = segmentos.includes(s.value)
                  return (
                    <div 
                      key={s.value}
                      className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        id={`segmento-${s.value}`}
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSegmentos(prev => [...prev, s.value])
                          } else {
                            setSegmentos(prev => prev.filter(seg => seg !== s.value))
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <label 
                        htmlFor={`segmento-${s.value}`}
                        className="text-sm text-gray-700 cursor-pointer flex-1"
                      >
                        {s.label}
                      </label>
                    </div>
                  )
                })}
              </div>
              {segmentos.length === 0 && (
                <p className="mt-2 text-sm text-amber-600">
                  ⚠️ Selecione pelo menos um segmento
                </p>
              )}
              {segmentos.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  ✅ {segmentos.length} segmento(s) selecionado(s)
                </p>
              )}
            </div>

            {/* Arquitetura */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Diagnóstico
              </label>
              <select
                value={arquitetura}
                onChange={(e) => setArquitetura(e.target.value as DiagnosisArchitecture)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {arquiteturas.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
              {/* Descrição do tipo selecionado */}
              {arquiteturas.find(a => a.value === arquitetura) && (
                <p className="mt-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                  <strong>ℹ️ {arquiteturas.find(a => a.value === arquitetura)?.label}:</strong><br />
                  {arquiteturas.find(a => a.value === arquitetura)?.descricao}
                </p>
              )}
            </div>

            {/* Comando personalizado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comando Personalizado (opcional)
              </label>
              <p className="text-sm text-gray-600 mb-2">
                Use este campo para dar instruções específicas ao agente. Exemplos:
              </p>
              <ul className="text-sm text-gray-600 mb-3 list-disc list-inside space-y-1">
                <li>"Criar um diagnóstico sobre ansiedade para psicólogos"</li>
                <li>"Focar em perguntas sobre rotina e hábitos"</li>
                <li>"Usar linguagem mais técnica para médicos"</li>
                <li>"Criar perguntas sobre medicamentos e tratamentos"</li>
              </ul>
              <textarea
                value={comando}
                onChange={(e) => setComando(e.target.value)}
                placeholder="Ex: Criar um diagnóstico sobre ansiedade para psicólogos, focando em sintomas físicos e emocionais..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-2 text-xs text-gray-500">
                💡 Dica: Se você preencheu o tema acima, este campo é opcional. Use para adicionar detalhes específicos ou instruções extras.
              </p>
            </div>

            {/* Botão */}
            <button
              onClick={handleGerar}
              disabled={loading || ((!tema && !temaCustomizado) && !comando) || segmentos.length === 0}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '⏳ Gerando fluxo...' : '🚀 Gerar Fluxo'}
            </button>

            {/* Resultado */}
            {resultado && (
              <div
                className={`p-4 rounded-md ${
                  resultado.success
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <p
                  className={`font-medium ${
                    resultado.success ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {resultado.success ? '✅ Sucesso!' : '❌ Erro'}
                </p>
                <p
                  className={`mt-2 text-sm ${
                    resultado.success ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {resultado.message}
                </p>
                {resultado.data && (
                  <pre className="mt-4 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-96">
                    {JSON.stringify(resultado.data, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminGerarFluxos

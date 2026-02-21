'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import RequireDiagnostico from '@/components/auth/RequireDiagnostico'
import NutriSidebar from '@/components/nutri/NutriSidebar'
import NoelRespostaView from '@/components/nutri/NoelRespostaView'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'

const PERGUNTAS_TESTE: Array<{ categoria: string; pergunta: string }> = [
  { categoria: 'Captação', pergunta: 'Qual meu link para enviar para cliente?' },
  { categoria: 'Captação', pergunta: 'Qual o link do meu quiz?' },
  { categoria: 'Captação', pergunta: 'Tenho mais de um quiz, qual você recomenda?' },
  { categoria: 'Captação', pergunta: 'Quero ativar conversas' },
  { categoria: 'Captação', pergunta: 'Qual link eu uso para captar emagrecimento?' },
  { categoria: 'Captação', pergunta: 'Não tenho cliente, por onde começo?' },
  { categoria: 'Conversão', pergunta: 'Como fecho consulta?' },
  { categoria: 'Conversão', pergunta: 'Lead respondeu, o que mando?' },
  { categoria: 'Conversão', pergunta: 'Preciso de script de fechamento' },
  { categoria: 'Organização', pergunta: 'Como organizo minha agenda?' },
  { categoria: 'Organização', pergunta: 'O que fazer hoje?' },
  { categoria: 'Organização', pergunta: 'Como organizar minha semana?' },
  { categoria: 'Desbloqueio', pergunta: 'Não sei o que fazer' },
  { categoria: 'Desbloqueio', pergunta: 'Me ajuda' },
  { categoria: 'Desbloqueio', pergunta: 'Por onde começo?' },
  { categoria: 'Anti-alucinação', pergunta: 'Qual o link do meu quiz de endometriose?' },
]

interface ResultadoTeste {
  categoria: string
  pergunta: string
  resposta?: string
  erro?: string
}

function NoelTestContent() {
  const authenticatedFetch = useAuthenticatedFetch()
  const [pergunta, setPergunta] = useState('')
  const [resposta, setResposta] = useState('')
  const [modelUsed, setModelUsed] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [historico, setHistorico] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [rodandoTodos, setRodandoTodos] = useState(false)
  const [progresso, setProgresso] = useState({ atual: 0, total: 0 })
  const [resultadosTodos, setResultadosTodos] = useState<ResultadoTeste[]>([])

  const enviar = async () => {
    const msg = pergunta.trim()
    if (!msg || loading) return
    setLoading(true)
    setErro('')
    setResposta('')
    setModelUsed('')
    try {
      const res = await authenticatedFetch('/api/nutri/noel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          conversationHistory: historico
        })
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErro(data.error || data.message || `Erro ${res.status}`)
        return
      }
      const text = data.response || data.message || ''
      setResposta(text)
      setModelUsed(data.modelUsed || '')
      setHistorico(prev => [...prev, { role: 'user', content: msg }, { role: 'assistant', content: text }])
      setPergunta('')
    } catch (e: any) {
      setErro(e?.message || 'Erro ao chamar o Noel.')
    } finally {
      setLoading(false)
    }
  }

  const executarTodosOsTestes = async () => {
    setRodandoTodos(true)
    setProgresso({ atual: 0, total: PERGUNTAS_TESTE.length })
    setResultadosTodos([])
    const resultados: ResultadoTeste[] = []
    for (let i = 0; i < PERGUNTAS_TESTE.length; i++) {
      setProgresso({ atual: i + 1, total: PERGUNTAS_TESTE.length })
      const { categoria, pergunta: p } = PERGUNTAS_TESTE[i]
      try {
        const res = await authenticatedFetch('/api/nutri/noel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: p, conversationHistory: [] })
        })
        const data = await res.json().catch(() => ({}))
        if (res.ok) {
          resultados.push({ categoria, pergunta: p, resposta: data.response || data.message || '' })
        } else {
          resultados.push({ categoria, pergunta: p, erro: data.error || data.message || `Erro ${res.status}` })
        }
      } catch (e: any) {
        resultados.push({ categoria, pergunta: p, erro: e?.message || 'Erro ao chamar o Noel.' })
      }
      setResultadosTodos([...resultados])
    }
    setRodandoTodos(false)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <NutriSidebar />
      <main className="flex-1 p-6 max-w-2xl mx-auto">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Testar Noel (Nutri)</h1>
        <p className="text-sm text-gray-600 mb-4">
          Faça qualquer pergunta: links, agenda, ativar conversas, leads, fechar consulta, jornada, ferramentas.
          O Noel usa seus links reais (nomes e URLs) do contexto.
        </p>

        <div className="mb-6 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Executar todos os testes em sequência</h2>
          <p className="text-xs text-gray-500 mb-3">
            {PERGUNTAS_TESTE.length} perguntas (Captação, Conversão, Organização, Desbloqueio, Anti-alucinação). Respostas aparecem abaixo em seguida.
          </p>
          <button
            type="button"
            onClick={executarTodosOsTestes}
            disabled={rodandoTodos}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {rodandoTodos ? `Testando ${progresso.atual}/${progresso.total}...` : `Executar todos os testes (${PERGUNTAS_TESTE.length} perguntas)`}
          </button>
        </div>

        <h2 className="text-sm font-semibold text-gray-700 mb-2">Ou teste uma pergunta</h2>
        <div className="space-y-3">
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 text-sm min-h-[80px]"
            placeholder="Ex: Qual meu link de quiz? / Como ativo uma conversa? / O que fazer hoje?"
            value={pergunta}
            onChange={e => setPergunta(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), enviar())}
          />
          <button
            type="button"
            onClick={enviar}
            disabled={loading || !pergunta.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
        {erro && <p className="text-red-600 text-sm mt-2">{erro}</p>}
        {resposta && (
          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <p className="text-xs text-gray-500 mb-2">Resposta {modelUsed && `(${modelUsed})`}</p>
            <NoelRespostaView texto={resposta} />
          </div>
        )}
        {historico.length > 0 && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setHistorico([])}
              className="text-xs text-gray-500 hover:underline"
            >
              Limpar histórico
            </button>
          </div>
        )}

        {resultadosTodos.length > 0 && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              Resultados dos testes ({resultadosTodos.length}/{PERGUNTAS_TESTE.length})
            </h2>
            <div className="space-y-4">
              {resultadosTodos.map((r, i) => (
                <div key={i} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <p className="text-xs font-medium text-gray-500 mb-1">{r.categoria}</p>
                  <p className="text-sm font-medium text-gray-900 mb-2">&quot;{r.pergunta}&quot;</p>
                  {r.erro ? (
                    <p className="text-sm text-red-600">{r.erro}</p>
                  ) : (
                    <NoelRespostaView texto={r.resposta ?? ''} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function NoelTestPage() {
  return (
    <RequireDiagnostico area="nutri">
      <NoelTestContent />
    </RequireDiagnostico>
  )
}

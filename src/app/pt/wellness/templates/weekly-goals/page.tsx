'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getDiagnostico, DiagnosticoCompleto } from '@/lib/diagnosticos-nutri'

interface MetaConfig {
  id: string
  label: string
  unidade: string
  sugestao: string
}

interface Resultado {
  nivel: 'metasBasicas' | 'metasIntermediarias' | 'metasAvancadas'
  metasSelecionadas: Array<{ id: string; alvo: number }>
  recomendacoes: string[]
}

const METAS: MetaConfig[] = [
  { id: 'agua', label: 'Água (L/dia)', unidade: 'L/dia', sugestao: '2.0' },
  { id: 'sono', label: 'Sono (h/noite)', unidade: 'h/noite', sugestao: '7.0' },
  { id: 'passos', label: 'Passos (mil/dia)', unidade: 'mil/dia', sugestao: '8' },
  { id: 'treinos', label: 'Treinos/semana', unidade: 'x/sem', sugestao: '3' },
  { id: 'proteina', label: 'Refeições com proteína/dia', unidade: 'x/dia', sugestao: '3' },
  { id: 'vegetais', label: 'Porções de vegetais/dia', unidade: 'x/dia', sugestao: '3' }
]

export default function TabelaMetasSemanais({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'formulario' | 'resultado'>('landing')
  const [experiencia, setExperiencia] = useState('')
  const [metas, setMetas] = useState<Record<string, string>>({})
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [diagnostico, setDiagnostico] = useState<DiagnosticoCompleto | null>(null)

  const iniciar = () => setEtapa('formulario')

  const toggleMeta = (id: string) => {
    if (metas[id] !== undefined) {
      const clone = { ...metas }
      delete clone[id]
      setMetas(clone)
    } else {
      setMetas({ ...metas, [id]: METAS.find((m) => m.id === id)?.sugestao || '' })
    }
  }

  const atualizarAlvo = (id: string, valor: string) => {
    setMetas({ ...metas, [id]: valor })
  }

  const calcular = () => {
    if (!experiencia) {
      alert('Selecione seu nível atual.')
      return
    }

    const selecionadas = Object.entries(metas).map(([id, alvo]) => ({ id, alvo: parseFloat(alvo || '0') }))

    let nivel: Resultado['nivel'] = 'metasBasicas'
    if (experiencia === 'intermediario') nivel = 'metasIntermediarias'
    if (experiencia === 'avancado') nivel = 'metasAvancadas'

    const recomendacoesBase = [
      'Use checkboxes diários para marcar suas metas cumpridas',
      'Defina revisão no domingo para ajustar a próxima semana',
      'Priorize consistência > intensidade. Evolua 10–20% por semana'
    ]

    const diag = getDiagnostico('tabela-metas-semanais', 'nutri', nivel)
    setDiagnostico(diag)

    setResultado({
      nivel,
      metasSelecionadas: selecionadas,
      recomendacoes: recomendacoesBase
    })
    setEtapa('resultado')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Tabela de Metas Semanais"
        defaultDescription="Defina metas simples e mensuráveis para evoluir com consistência"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (
          <WellnessLanding
            config={config}
            defaultEmoji="🎯"
            defaultTitle="Tabela de Metas Semanais"
            defaultDescription={
              <>
                <p className="text-xl text-gray-600 mb-2">Construa consistência com metas simples</p>
                <p className="text-gray-600">Água, sono, movimento, proteína e vegetais — comece hoje</p>
              </>
            }
            benefits={[
              'Metas simples e realistas para sua semana',
              'Checklist diário para manter consistência',
              'Revisão semanal e progressão inteligente',
              'Diagnóstico personalizado por nível'
            ]}
            onStart={iniciar}
            buttonText="▶️ Definir Minhas Metas - É Grátis"
          />
        )}

        {etapa === 'formulario' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-emerald-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Suas Metas para esta Semana</h2>
              <p className="text-gray-600">Selecione metas e ajuste os alvos sugeridos.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {METAS.map((m) => (
                <div key={m.id} className={`rounded-xl p-4 border-2 ${metas[m.id] !== undefined ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <label className="font-semibold text-gray-900">{m.label}</label>
                    <button
                      type="button"
                      onClick={() => toggleMeta(m.id)}
                      className={`px-3 py-1 rounded-lg text-sm ${metas[m.id] !== undefined ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {metas[m.id] !== undefined ? 'Remover' : 'Adicionar'}
                    </button>
                  </div>
                  {metas[m.id] !== undefined && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={metas[m.id]}
                        onChange={(e) => atualizarAlvo(m.id, e.target.value)}
                        step="0.1"
                        className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <span className="text-gray-600 text-sm">{m.unidade}</span>
                      <span className="text-gray-400 text-xs ml-2">Sugestão: {m.sugestao} {m.unidade}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Seu nível atual</label>
              <select
                value={experiencia}
                onChange={(e) => setExperiencia(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
              >
                <option value="">Selecione</option>
                <option value="iniciante">Iniciante</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </select>
            </div>

            <button
              onClick={calcular}
              className="w-full mt-2 text-white py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02] shadow-lg"
              style={config?.custom_colors
                ? { background: `linear-gradient(135deg, ${config.custom_colors.principal} 0%, ${config.custom_colors.secundaria} 100%)` }
                : { background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
            >
              Gerar Minha Semana →
            </button>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-emerald-300">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Suas Metas da Semana</h2>
                <p className="text-gray-600 text-lg">
                  {resultado.nivel === 'metasBasicas' && 'Nível: Básico (consistência)'}
                  {resultado.nivel === 'metasIntermediarias' && 'Nível: Intermediário (evolução)'}
                  {resultado.nivel === 'metasAvancadas' && 'Nível: Avançado (refinamento)'}
                </p>
              </div>

              <div className="bg-emerald-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-emerald-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">📋</span>
                  Checklist Diário
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {resultado.metasSelecionadas.map((m) => {
                    const meta = METAS.find((x) => x.id === m.id)
                    if (!meta) return null
                    return (
                      <div key={m.id} className="bg-white rounded-lg p-4 border border-emerald-200">
                        <div className="font-semibold text-gray-900 mb-2">{meta.label}</div>
                        <div className="text-gray-700 text-sm mb-3">Meta: {m.alvo} {meta.unidade}</div>
                        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-600">
                          {['S','T','Q','Q','S','S','D'].map((d, i) => (
                            <div key={i} className="py-2 rounded-md border border-emerald-200 bg-emerald-100">{d}</div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Diagnóstico Nutricional */}
              {diagnostico && (
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border-2 border-emerald-200">
                    <h3 className="font-bold text-gray-900 mb-4 text-xl flex items-center">
                      <span className="text-2xl mr-2">🔎</span>
                      Diagnóstico e Direcionamento
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4"><p className="text-gray-800 whitespace-pre-line">{diagnostico.diagnostico}</p></div>
                      <div className="bg-white rounded-lg p-4"><p className="text-gray-800 whitespace-pre-line">{diagnostico.causaRaiz}</p></div>
                      <div className="bg-white rounded-lg p-4"><p className="text-gray-800 whitespace-pre-line">{diagnostico.acaoImediata}</p></div>
                      <div className="bg-white rounded-lg p-4"><p className="text-gray-800 whitespace-pre-line">{diagnostico.plano7Dias}</p></div>
                      <div className="bg-white rounded-lg p-4"><p className="text-gray-800 whitespace-pre-line">{diagnostico.suplementacao}</p></div>
                      <div className="bg-white rounded-lg p-4"><p className="text-gray-800 whitespace-pre-line">{diagnostico.alimentacao}</p></div>
                      {diagnostico.proximoPasso && (
                        <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg p-4 border-l-4 border-emerald-500">
                          <p className="text-gray-900 font-semibold whitespace-pre-line">{diagnostico.proximoPasso}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💡</span>
                  Recomendações
                </h3>
                <ul className="space-y-2 text-gray-700">
                  {resultado.recomendacoes.map((r, i) => (
                    <li key={i} className="flex items-start"><span className="text-emerald-600 mr-2">✓</span><span>{r}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <WellnessCTAButton
              config={config}
              resultadoTexto={`Metas: ${resultado.metasSelecionadas.length} | Nível: ${resultado.nivel}`}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => { setMetas({}); setExperiencia(''); setResultado(null); setDiagnostico(null); setEtapa('formulario') }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                ↺ Ajustar Metas
              </button>
              <button
                onClick={() => { setMetas({}); setExperiencia(''); setResultado(null); setDiagnostico(null); setEtapa('landing') }}
                className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                🏠 Voltar ao Início
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getDiagnostico, DiagnosticoCompleto } from '@/lib/diagnosticos-coach'

interface DadosFormulario {
  nome: string
  idade: string
  objetivo: string
  restricoes: string[]
  atividade: string
  alimentacao: string
  sintomas: string[]
  observacoes: string
}

export default function FormularioRecomendacao({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'formulario' | 'resultado'>('landing')
  const [dados, setDados] = useState<DadosFormulario>({
    nome: '',
    idade: '',
    objetivo: '',
    restricoes: [],
    atividade: '',
    alimentacao: '',
    sintomas: [],
    observacoes: ''
  })
  const [diagnostico, setDiagnostico] = useState<DiagnosticoCompleto | null>(null)

  const iniciarFormulario = () => {
    setEtapa('formulario')
  }

  const handleInputChange = (campo: keyof DadosFormulario, valor: string | string[]) => {
    setDados(prev => ({ ...prev, [campo]: valor }))
  }

  const handleCheckboxChange = (campo: 'restricoes' | 'sintomas', valor: string) => {
    setDados(prev => {
      const array = prev[campo] as string[]
      const novoArray = array.includes(valor)
        ? array.filter(item => item !== valor)
        : [...array, valor]
      return { ...prev, [campo]: novoArray }
    })
  }

  const enviarFormulario = () => {
    if (!dados.nome || !dados.idade || !dados.objetivo || !dados.atividade || !dados.alimentacao) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    // Obter diagnóstico
    const diagnosticoCompleto = getDiagnostico('formulario-recomendacao', 'nutri', 'recomendacaoBasica')
    setDiagnostico(diagnosticoCompleto)
    setEtapa('resultado')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <WellnessHeader config={config} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {etapa === 'landing' && (
          <WellnessLanding
            config={config}
            defaultEmoji="📝"
            defaultTitle="Formulário de Recomendação Nutricional"
            defaultDescription={
              <>
                <p className="text-xl text-gray-600 mb-2">
                  Receba recomendações nutricionais personalizadas
                </p>
                <p className="text-gray-600">
                  Preencha o formulário e receba orientações direcionadas para seus objetivos
                </p>
              </>
            }
            discover={[
              'Recomendações nutricionais básicas e direcionadas',
              'Plano de ação claro e acessível',
              'Orientações personalizadas para seus objetivos',
              'Fundamentos sólidos para mudanças sustentáveis'
            ]}
            benefits={[
              'Recomendações básicas estruturadas criam base sólida',
              '65% mais sucesso em manter mudanças',
              'Identifica necessidades fundamentais',
              'Plano de ação claro e acessível'
            ]}
            onStart={iniciarFormulario}
            buttonText="📝 Preencher Formulário - É Grátis"
          />
        )}

        {etapa === 'formulario' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Formulário de Recomendação</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={dados.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Idade *
                </label>
                <input
                  type="number"
                  value={dados.idade}
                  onChange={(e) => handleInputChange('idade', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Sua idade"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Objetivo Principal *
                </label>
                <select
                  value={dados.objetivo}
                  onChange={(e) => handleInputChange('objetivo', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Selecione seu objetivo</option>
                  <option value="emagrecimento">Emagrecimento</option>
                  <option value="ganho-peso">Ganho de Peso</option>
                  <option value="manutencao">Manutenção</option>
                  <option value="melhoria-saude">Melhoria da Saúde</option>
                  <option value="performance">Performance Esportiva</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nível de Atividade Física *
                </label>
                <select
                  value={dados.atividade}
                  onChange={(e) => handleInputChange('atividade', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Selecione seu nível</option>
                  <option value="sedentario">Sedentário</option>
                  <option value="leve">Leve (1-3x/semana)</option>
                  <option value="moderada">Moderada (3-5x/semana)</option>
                  <option value="intensa">Intensa (6-7x/semana)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Padrão Alimentar Atual *
                </label>
                <select
                  value={dados.alimentacao}
                  onChange={(e) => handleInputChange('alimentacao', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Selecione seu padrão</option>
                  <option value="onivoro">Onívoro</option>
                  <option value="vegetariano">Vegetariano</option>
                  <option value="vegano">Vegano</option>
                  <option value="cetogenico">Cetogênico</option>
                  <option value="low-carb">Low Carb</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 mb-3">
                  Restrições Alimentares
                </label>
                <div className="space-y-2">
                  {['Lactose', 'Glúten', 'Soja', 'Ovos', 'Frutos do mar', 'Nozes'].map(restricao => (
                    <label key={restricao} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dados.restricoes.includes(restricao)}
                        onChange={() => handleCheckboxChange('restricoes', restricao)}
                        className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-gray-700">{restricao}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 mb-3">
                  Sintomas ou Queixas
                </label>
                <div className="space-y-2">
                  {['Fadiga', 'Dores de cabeça', 'Problemas digestivos', 'Insônia', 'Ansiedade', 'Dores articulares'].map(sintoma => (
                    <label key={sintoma} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dados.sintomas.includes(sintoma)}
                        onChange={() => handleCheckboxChange('sintomas', sintoma)}
                        className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-gray-700">{sintoma}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Observações Adicionais
                </label>
                <textarea
                  value={dados.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Informações adicionais que considera relevantes..."
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setEtapa('landing')}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Voltar
              </button>
              <button
                onClick={enviarFormulario}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition shadow-lg"
              >
                Enviar Formulário
              </button>
            </div>
          </div>
        )}

        {etapa === 'resultado' && diagnostico && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-orange-300">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">📝</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Formulário Recebido!</h2>
                <p className="text-gray-600 text-lg">
                  Suas informações foram analisadas. Veja suas recomendações abaixo.
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-2">📝</span>
                    Diagnóstico
                  </h3>
                  <p className="text-gray-800 text-lg leading-relaxed">
                    {diagnostico.diagnostico}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-2">🔍</span>
                    Causa Raiz
                  </h3>
                  <p className="text-gray-800 leading-relaxed">
                    {diagnostico.causaRaiz}
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-2">⚡</span>
                    Ação Imediata
                  </h3>
                  <p className="text-gray-800 leading-relaxed">
                    {diagnostico.acaoImediata}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-2">📅</span>
                    Plano 7 Dias
                  </h3>
                  <p className="text-gray-800 leading-relaxed">
                    {diagnostico.plano7Dias}
                  </p>
                </div>

                <div className="bg-yellow-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-2">💊</span>
                    Suplementação
                  </h3>
                  <p className="text-gray-800 leading-relaxed">
                    {diagnostico.suplementacao}
                  </p>
                </div>

                <div className="bg-emerald-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-2">🍎</span>
                    Alimentação
                  </h3>
                  <p className="text-gray-800 leading-relaxed">
                    {diagnostico.alimentacao}
                  </p>
                </div>

                <div className="bg-pink-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-2">🎯</span>
                    Próximo Passo
                  </h3>
                  <p className="text-gray-800 leading-relaxed">
                    {diagnostico.proximoPasso}
                  </p>
                </div>
              </div>
            </div>

            <WellnessCTAButton
              config={config}
              resultadoTexto={`Formulário de Recomendação Nutricional preenchido - ${dados.nome}`}
            />

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setEtapa('formulario')
                  setDiagnostico(null)
                }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Preencher Novamente
              </button>
              <button
                onClick={() => setEtapa('landing')}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition shadow-lg"
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}













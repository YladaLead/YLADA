'use client'

import { useState } from 'react'
import { guiaHidratacaoDiagnosticos } from '@/lib/diagnostics'

interface GuiaHidratacaoPreviewProps {
  etapa: number
  onEtapaChange: (etapa: number) => void
}

export default function GuiaHidratacaoPreview({ etapa, onEtapaChange }: GuiaHidratacaoPreviewProps) {
  const diagnosticos = guiaHidratacaoDiagnosticos.wellness
  const totalEtapas = 7 // 0=landing, 1-5=conteúdo, 6=formulário, 7=diagnósticos
  
  const [dadosFormulario, setDadosFormulario] = useState({
    peso: '',
    atividade: '',
    clima: '',
    aguaAtual: '',
    sintomas: [] as string[]
  })
  
  const toggleSintoma = (sintoma: string) => {
    if (dadosFormulario.sintomas.includes(sintoma)) {
      setDadosFormulario({
        ...dadosFormulario,
        sintomas: dadosFormulario.sintomas.filter(s => s !== sintoma)
      })
    } else {
      setDadosFormulario({
        ...dadosFormulario,
        sintomas: [...dadosFormulario.sintomas, sintoma]
      })
    }
  }

  const handleNext = () => {
    onEtapaChange(Math.min(totalEtapas, etapa + 1))
  }

  const handlePrevious = () => {
    onEtapaChange(Math.max(0, etapa - 1))
  }

  const labels = ['Início', '1', '2', '3', '4', '5', 'Formulário', 'Diagnósticos']

  const conteudos = [
    {
      numero: 1,
      titulo: 'Por que Hidratação é Fundamental?',
      emoji: '💧',
      cor: 'blue',
      descricao: 'Entenda como a hidratação adequada impacta energia, metabolismo e saúde geral.'
    },
    {
      numero: 2,
      titulo: 'Quanta Água Você Precisa?',
      emoji: '📊',
      cor: 'cyan',
      descricao: 'Aprenda a calcular sua necessidade hídrica diária baseada no seu perfil.'
    },
    {
      numero: 3,
      titulo: 'Sinais de Desidratação',
      emoji: '⚠️',
      cor: 'sky',
      descricao: 'Identifique os sinais de que seu corpo precisa de mais hidratação.'
    },
    {
      numero: 4,
      titulo: 'Estratégias de Hidratação',
      emoji: '🎯',
      cor: 'blue',
      descricao: 'Como manter-se hidratado ao longo do dia de forma eficiente.'
    },
    {
      numero: 5,
      titulo: 'Hidratação e Performance',
      emoji: '⚡',
      cor: 'cyan',
      descricao: 'Como otimizar hidratação para atletas e pessoas ativas.'
    }
  ]

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        💧 Preview do Guia de Hidratação - "Tudo sobre Hidratação"
      </h3>
      
      <div className="relative">
        {/* Tela de Abertura - Etapa 0 */}
        {etapa === 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border-2 border-blue-200">
            <h4 className="text-xl font-bold text-gray-900 mb-2">💧 Guia Completo de Hidratação</h4>
            <p className="text-gray-700 mb-4 font-medium">Aprenda tudo sobre hidratação e como otimizar seu consumo de água para saúde e performance.</p>
            <div className="bg-white rounded-lg p-4 mb-4 border border-blue-200">
              <p className="text-sm text-gray-700 mb-2"><strong>💡 O que você vai aprender:</strong></p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>✓ Por que hidratação é fundamental</p>
                <p>✓ Como calcular sua necessidade diária</p>
                <p>✓ Estratégias práticas para manter-se hidratado</p>
              </div>
            </div>
            <button className="mt-4 w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-colors shadow-lg">
              ▶️ Começar Leitura
            </button>
          </div>
        )}

        {/* Conteúdo 1-5 */}
        {etapa >= 1 && etapa <= 5 && (
          <div className="space-y-6">
            {conteudos.map((conteudo) => {
              if (etapa === conteudo.numero) {
                const bgColor = {
                  blue: 'bg-blue-50',
                  cyan: 'bg-cyan-50',
                  sky: 'bg-sky-50'
                }[conteudo.cor] || 'bg-gray-50'
                
                const textColor = {
                  blue: 'text-blue-900',
                  cyan: 'text-cyan-900',
                  sky: 'text-sky-900'
                }[conteudo.cor] || 'text-gray-900'

                const borderColor = {
                  blue: 'border-blue-200',
                  cyan: 'border-cyan-200',
                  sky: 'border-sky-200'
                }[conteudo.cor] || 'border-gray-200'

                const badgeColor = {
                  blue: 'bg-blue-600',
                  cyan: 'bg-cyan-600',
                  sky: 'bg-sky-600'
                }[conteudo.cor] || 'bg-gray-600'

                return (
                  <div key={conteudo.numero} className={`${bgColor} p-6 rounded-lg border-2 ${borderColor}`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                        Seção {conteudo.numero} de 5
                      </span>
                      <span className="text-xs text-gray-600 font-medium">Guia Hidratação</span>
                    </div>
                    <h4 className={`text-xl font-bold ${textColor} mb-3`}>
                      {conteudo.emoji} {conteudo.titulo}
                    </h4>
                    <div className="bg-white rounded-lg p-5 space-y-3">
                      <p className="text-gray-700">{conteudo.descricao}</p>
                      <div className="border-t border-gray-200 pt-3">
                        <p className="text-sm text-gray-600">
                          <strong>Conteúdo completo:</strong> Esta seção inclui informações detalhadas, exemplos práticos e orientações específicas sobre {conteudo.titulo.toLowerCase()}.
                        </p>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            })}
          </div>
        )}

        {/* Tela de Formulário - Etapa 6 */}
        {etapa === 6 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-300">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">📝 Formulário de Avaliação</h4>
                  <p className="text-gray-700">Preencha as informações para receber seu guia personalizado de hidratação.</p>
                </div>
                <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Etapa 6
                </span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200">
              <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seu peso (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={dadosFormulario.peso}
                  onChange={(e) => setDadosFormulario({ ...dadosFormulario, peso: e.target.value })}
                  placeholder="Ex: 70"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de atividade física <span className="text-red-500">*</span>
                </label>
                <select
                  value={dadosFormulario.atividade}
                  onChange={(e) => setDadosFormulario({ ...dadosFormulario, atividade: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="sedentario">Sedentário - Pouco ou nenhum exercício</option>
                  <option value="leve">Leve - Exercício leve 1-3x por semana</option>
                  <option value="moderada">Moderada - Exercício moderado 3-5x por semana</option>
                  <option value="intensa">Intensa - Exercício intenso 5-7x por semana</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clima onde você vive/trabalha <span className="text-red-500">*</span>
                </label>
                <select
                  value={dadosFormulario.clima}
                  onChange={(e) => setDadosFormulario({ ...dadosFormulario, clima: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="temperado">Temperado - Clima ameno</option>
                  <option value="quente">Quente - Calor moderado</option>
                  <option value="muito-quente">Muito Quente - Calor intenso</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quanto de água você bebe atualmente? (litros/dia) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={dadosFormulario.aguaAtual}
                  onChange={(e) => setDadosFormulario({ ...dadosFormulario, aguaAtual: e.target.value })}
                  placeholder="Ex: 1.5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">Não precisa ser exato, apenas uma estimativa</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Você já sentiu algum destes sintomas? (opcional)
                </label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {['Sede frequente', 'Boca seca', 'Urina escura', 'Cansaço', 'Dor de cabeça', 'Pele seca'].map((sintoma) => (
                    <button
                      key={sintoma}
                      type="button"
                      onClick={() => toggleSintoma(sintoma)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors text-left text-sm ${
                        dadosFormulario.sintomas.includes(sintoma)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {dadosFormulario.sintomas.includes(sintoma) && '✓ '}{sintoma}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>💡 Preview:</strong> No template real, ao preencher e enviar, você receberá um cálculo personalizado da sua necessidade hídrica diária, estratégias práticas e um cronograma de hidratação.
                </p>
              </div>
              
              <button
                type="button"
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02] shadow-lg"
              >
                Gerar Meu Guia de Hidratação →
              </button>
              </div>
            </div>
          </div>
        )}

        {/* Tela de Diagnósticos - Etapa 7 */}
        {etapa === 7 && (
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Diagnósticos Possíveis</h4>
            
            {/* Resultado 1: Baixa Hidratação */}
            <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-red-900">💧 Baixa Hidratação</h5>
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">&lt; 1.5L/dia</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="font-semibold text-gray-900">{diagnosticos.baixaHidratacao.diagnostico}</p>
                <p className="text-gray-700">{diagnosticos.baixaHidratacao.causaRaiz}</p>
                <p className="text-gray-700">{diagnosticos.baixaHidratacao.acaoImediata}</p>
                <p className="text-gray-700">{diagnosticos.baixaHidratacao.plano7Dias}</p>
                <p className="text-gray-700">{diagnosticos.baixaHidratacao.suplementacao}</p>
                <p className="text-gray-700">{diagnosticos.baixaHidratacao.alimentacao}</p>
                {diagnosticos.baixaHidratacao.proximoPasso && (
                  <p className="text-gray-700 font-semibold bg-blue-50 p-3 rounded-lg mt-2">{diagnosticos.baixaHidratacao.proximoPasso}</p>
                )}
              </div>
            </div>

            {/* Resultado 2: Hidratação Moderada */}
            <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-yellow-900">💧 Hidratação Moderada</h5>
                <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">1.5-2.5L/dia</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="font-semibold text-gray-900">{diagnosticos.hidratacaoModerada.diagnostico}</p>
                <p className="text-gray-700">{diagnosticos.hidratacaoModerada.causaRaiz}</p>
                <p className="text-gray-700">{diagnosticos.hidratacaoModerada.acaoImediata}</p>
                <p className="text-gray-700">{diagnosticos.hidratacaoModerada.plano7Dias}</p>
                <p className="text-gray-700">{diagnosticos.hidratacaoModerada.suplementacao}</p>
                <p className="text-gray-700">{diagnosticos.hidratacaoModerada.alimentacao}</p>
                {diagnosticos.hidratacaoModerada.proximoPasso && (
                  <p className="text-gray-700 font-semibold bg-blue-50 p-3 rounded-lg mt-2">{diagnosticos.hidratacaoModerada.proximoPasso}</p>
                )}
              </div>
            </div>

            {/* Resultado 3: Alta Hidratação */}
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-green-900">💧 Alta Hidratação</h5>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">&gt; 2.5L/dia</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="font-semibold text-gray-900">{diagnosticos.altaHidratacao.diagnostico}</p>
                <p className="text-gray-700">{diagnosticos.altaHidratacao.causaRaiz}</p>
                <p className="text-gray-700">{diagnosticos.altaHidratacao.acaoImediata}</p>
                <p className="text-gray-700">{diagnosticos.altaHidratacao.plano7Dias}</p>
                <p className="text-gray-700">{diagnosticos.altaHidratacao.suplementacao}</p>
                <p className="text-gray-700">{diagnosticos.altaHidratacao.alimentacao}</p>
                {diagnosticos.altaHidratacao.proximoPasso && (
                  <p className="text-gray-700 font-semibold bg-blue-50 p-3 rounded-lg mt-2">{diagnosticos.altaHidratacao.proximoPasso}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navegação com Setinhas */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={handlePrevious}
            disabled={etapa === 0}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>
          
          <div className="flex space-x-2 flex-wrap gap-2">
            {Array.from({ length: totalEtapas + 1 }, (_, i) => (
              <button
                key={i}
                onClick={() => onEtapaChange(i)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  etapa === i
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={labels[i] || `Etapa ${i}`}
              >
                {labels[i] || `${i}`}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={etapa === totalEtapas}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima →
          </button>
        </div>
      </div>
    </div>
  )
}


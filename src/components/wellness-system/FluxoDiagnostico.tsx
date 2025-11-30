'use client'

import { useState, useEffect } from 'react'
import { FluxoCliente, RespostaFluxo } from '@/types/wellness-system'
import { getKitByTipo } from '@/lib/wellness-system/produtos'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'

interface FluxoDiagnosticoProps {
  fluxo: FluxoCliente
  whatsappNumber?: string
  countryCode?: string
  mostrarProdutos?: boolean
}

export default function FluxoDiagnostico({ 
  fluxo, 
  whatsappNumber,
  countryCode = 'BR',
  mostrarProdutos = true 
}: FluxoDiagnosticoProps) {
  const [respostas, setRespostas] = useState<Record<string, string | number>>({})
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [mostrarResultado, setMostrarResultado] = useState(false)
  const [diagnosticoId, setDiagnosticoId] = useState<string | null>(null)

  const pergunta = fluxo.perguntas[perguntaAtual]
  const todasRespondidas = perguntaAtual === fluxo.perguntas.length - 1 && respostas[pergunta.id] !== undefined

  const handleResposta = (valor: string | number) => {
    const novasRespostas = { ...respostas, [pergunta.id]: valor }
    setRespostas(novasRespostas)

    if (perguntaAtual < fluxo.perguntas.length - 1) {
      setPerguntaAtual(perguntaAtual + 1)
    } else {
      // Última pergunta respondida
      setMostrarResultado(true)
    }
  }

  const handleVoltar = () => {
    if (perguntaAtual > 0) {
      setPerguntaAtual(perguntaAtual - 1)
    }
  }

  const calcularKitRecomendado = (): 'energia' | 'acelera' => {
    // Se o fluxo já tem kit definido e não é 'ambos', usar ele
    if (fluxo.kitRecomendado !== 'ambos') {
      return fluxo.kitRecomendado
    }

    // Lógica para decidir entre energia e acelera baseado nas respostas
    // Por enquanto, retorna energia como padrão
    // TODO: Implementar lógica mais sofisticada baseada nas respostas
    return 'energia'
  }

  const calcularScore = (): number => {
    // Calcular score baseado nas respostas
    // Score simples: porcentagem de respostas positivas
    const totalPerguntas = fluxo.perguntas.length
    if (totalPerguntas === 0) return 0

    let respostasPositivas = 0

    Object.values(respostas).forEach((resposta) => {
      if (typeof resposta === 'string' && resposta.toLowerCase() === 'sim') {
        respostasPositivas++
      } else if (typeof resposta === 'number' && resposta >= 5) {
        respostasPositivas++
      } else if (typeof resposta === 'string' && resposta.length > 0) {
        respostasPositivas++
      }
    })

    return Math.round((respostasPositivas / totalPerguntas) * 100)
  }

  const salvarDiagnostico = async (conversao: boolean = false) => {
    try {
      const kitRecomendado = calcularKitRecomendado()
      const score = calcularScore()

      const response = await fetch('/api/wellness/diagnosticos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          fluxo_id: fluxo.id,
          fluxo_tipo: mostrarProdutos ? 'cliente' : 'recrutamento',
          fluxo_nome: fluxo.nome,
          respostas,
          perfil_identificado: fluxo.diagnostico.titulo,
          kit_recomendado: mostrarProdutos ? kitRecomendado : null,
          score,
          conversao
        })
      })

      if (!response.ok) {
        console.error('Erro ao salvar diagnóstico')
      } else {
        const data = await response.json()
        return data.diagnostico?.id
      }
    } catch (error) {
      console.error('Erro ao salvar diagnóstico:', error)
      // Não interromper o fluxo se falhar
    }
    return null
  }

  const rastrearConversao = async (diagnosticoId: string) => {
    try {
      await fetch('/api/wellness/diagnosticos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          diagnostico_id: diagnosticoId,
          conversao: true
        })
      })
    } catch (error) {
      console.error('Erro ao rastrear conversão:', error)
    }
  }

  const kitRecomendado = calcularKitRecomendado()
  const kit = getKitByTipo(kitRecomendado)

  // Salvar diagnóstico quando mostrar resultado
  useEffect(() => {
    if (mostrarResultado && !diagnosticoId && Object.keys(respostas).length === fluxo.perguntas.length) {
      salvarDiagnostico(false).then((id) => {
        if (id) {
          setDiagnosticoId(id)
        }
      })
    }
  }, [mostrarResultado]) // eslint-disable-line react-hooks/exhaustive-deps

  if (mostrarResultado) {
    return (
      <div className="max-w-3xl mx-auto">
        {/* Resultado do Diagnóstico */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {fluxo.diagnostico.titulo}
            </h2>
            <p className="text-gray-600 text-lg">
              {fluxo.diagnostico.descricao}
            </p>
          </div>

          {/* Sintomas */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="font-semibold text-gray-900 mb-3">
              Pessoas com seu perfil geralmente relatam:
            </p>
            <ul className="space-y-2">
              {fluxo.diagnostico.sintomas.map((sintoma, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-600 mr-2">✔</span>
                  <span className="text-gray-700 capitalize">{sintoma}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mensagem Positiva */}
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <p className="text-gray-800 font-medium">
              {fluxo.diagnostico.mensagemPositiva}
            </p>
            <ul className="mt-3 space-y-2">
              {fluxo.diagnostico.beneficios.map((beneficio, index) => (
                <li key={index} className="text-gray-700">
                  • {beneficio}
                </li>
              ))}
            </ul>
          </div>

          {/* Recomendação do Kit (se mostrarProdutos) */}
          {mostrarProdutos && kit && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 mb-6 border-2 border-green-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                👉 {kit.nome}
              </h3>
              <p className="text-gray-700 mb-4">
                {kit.conteudo}
              </p>
              <ul className="space-y-2 mb-4">
                {kit.uso.map((uso, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span className="text-gray-700">{uso}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-600 italic">
                {kit.indicacao}
              </p>
            </div>
          )}

          {/* CTA Button */}
          <div className="text-center">
            {whatsappNumber ? (
              <div onClick={async () => {
                // Rastrear conversão quando clicar no botão
                if (diagnosticoId) {
                  await rastrearConversao(diagnosticoId)
                }
              }}>
                <WellnessCTAButton
                  config={{
                    cta_type: 'whatsapp',
                    whatsapp_number: whatsappNumber,
                    country_code: countryCode,
                    cta_button_text: fluxo.cta,
                    custom_whatsapp_message: `Olá! Completei o diagnóstico "${fluxo.nome}" e gostaria de saber mais sobre o ${kit?.nome || 'kit recomendado'}.`,
                    show_whatsapp_button: true
                  }}
                />
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  ⚠️ WhatsApp não configurado. Configure seu WhatsApp no perfil para usar esta funcionalidade.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Pergunta {perguntaAtual + 1} de {fluxo.perguntas.length}</span>
          <span>{Math.round(((perguntaAtual + 1) / fluxo.perguntas.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((perguntaAtual + 1) / fluxo.perguntas.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Pergunta */}
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          {pergunta.texto}
        </h2>

        {/* Opções de Resposta */}
        <div className="space-y-3">
          {pergunta.tipo === 'sim_nao' && (
            <>
              <button
                onClick={() => handleResposta('sim')}
                className="w-full p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Sim
              </button>
              <button
                onClick={() => handleResposta('nao')}
                className="w-full p-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Não
              </button>
            </>
          )}

          {pergunta.tipo === 'escala' && (
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: (pergunta.escalaMax || 10) - (pergunta.escalaMin || 0) + 1 }, (_, i) => {
                const valor = (pergunta.escalaMin || 0) + i
                return (
                  <button
                    key={valor}
                    onClick={() => handleResposta(valor)}
                    className={`p-4 rounded-lg font-medium transition-colors ${
                      respostas[pergunta.id] === valor
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {valor}
                  </button>
                )
              })}
            </div>
          )}

          {pergunta.tipo === 'multipla_escolha' && pergunta.opcoes && (
            <div className="space-y-3">
              {pergunta.opcoes.map((opcao, index) => (
                <button
                  key={index}
                  onClick={() => handleResposta(opcao)}
                  className={`w-full p-4 rounded-lg font-medium transition-colors text-left ${
                    respostas[pergunta.id] === opcao
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {opcao}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Botão Voltar */}
        {perguntaAtual > 0 && (
          <button
            onClick={handleVoltar}
            className="mt-6 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Voltar
          </button>
        )}
      </div>
    </div>
  )
}


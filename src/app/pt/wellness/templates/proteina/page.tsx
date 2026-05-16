'use client'

import { useState } from 'react'
import { usePathname, useParams } from 'next/navigation'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import LeadCapturePostResult from '@/components/wellness/LeadCapturePostResult'
import WellnessActionButtons from '@/components/wellness/WellnessActionButtons'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry'
import { getTemplateBenefits } from '@/lib/template-benefits'
import { calculadoraProteinaDiagnosticos } from '@/lib/diagnostics/wellness/calculadora-proteina'
import { calculadoraProteinaDiagnosticos as calculadoraProteinaDiagnosticosCoach } from '@/lib/diagnostics/coach/calculadora-proteina'

interface ResultadoProteina {
  proteinaDiaria: number
  proteinaPorKg: number
  porRefeicao: number
  interpretacao: string
  cor: 'green' | 'blue' | 'orange'
  recomendacoes: string[]
  diagnostico?: typeof calculadoraProteinaDiagnosticos.wellness.baixaProteina | typeof calculadoraProteinaDiagnosticosCoach.coach.baixaProteina
}

export default function CalculadoraProteina({ config }: TemplateBaseProps) {
  const pathname = usePathname()
  const params = useParams()
  const isCoach = config?.vertical === 'coach-bem-estar' || config?.vertical === 'coach'
    || pathname?.includes('/coach/') || pathname?.includes('/c/') || pathname?.includes('/coach-bem-estar/')
  const toolSlug = params?.['tool-slug'] as string | undefined
  const userSlug = params?.['user-slug'] as string | undefined
  
  const [etapa, setEtapa] = useState<'landing' | 'formulario' | 'resultado'>('landing')
  const [idade, setIdade] = useState('')
  const [genero, setGenero] = useState('')
  const [peso, setPeso] = useState('')
  const [altura, setAltura] = useState('')
  const [atividade, setAtividade] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [resultado, setResultado] = useState<ResultadoProteina | null>(null)
  
  // Estados para captura de lead (Coach)
  const [nomeLead, setNomeLead] = useState('')
  const [telefoneLead, setTelefoneLead] = useState('')
  const [phoneCountryCode, setPhoneCountryCode] = useState('BR')
  const [enviandoLead, setEnviandoLead] = useState(false)
  const [leadEnviado, setLeadEnviado] = useState(false)

  const iniciarCalculo = () => {
    setEtapa('formulario')
  }

  // Função para salvar lead (Coach)
  const handleSalvarLead = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nomeLead.trim()) {
      alert('Por favor, preencha seu nome.')
      return
    }

    if (!telefoneLead.trim()) {
      alert('Por favor, preencha seu telefone.')
      return
    }

    setEnviandoLead(true)

    try {
      const dadosEnvio = {
        name: nomeLead.trim(),
        phone: telefoneLead,
        phone_country_code: phoneCountryCode,
        tool_slug: toolSlug,
        user_slug: userSlug,
        ferramenta: 'Calculadora de Proteína',
        resultado: `${resultado?.proteinaDiaria}g de proteína/dia`,
        template_id: config?.id
      }

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosEnvio)
      })

      const data = await response.json()

      if (data.success) {
        setLeadEnviado(true)
        console.log('✅ Lead capturado com sucesso! ID:', data.data?.leadId)
      } else {
        const errorMessage = data.error || 'Erro ao enviar contato. Tente novamente.'
        alert(`Erro: ${errorMessage}`)
      }
    } catch (error: any) {
      console.error('❌ Erro ao enviar lead:', error)
      alert(`Erro ao enviar contato: ${error.message || 'Erro desconhecido'}.`)
    } finally {
      setEnviandoLead(false)
    }
  }

  const calcularProteina = () => {
    // 🚀 CORREÇÃO: Validar todos os campos obrigatórios antes de calcular
    const pesoNum = parseFloat(peso)
    const alturaNum = parseFloat(altura)
    const idadeNum = parseFloat(idade)

    // Validar campos numéricos
    if (!pesoNum || !alturaNum || !idadeNum || pesoNum <= 0 || alturaNum <= 0 || idadeNum <= 0) {
      alert('Por favor, preencha todos os campos com valores válidos.')
      return
    }

    // Validar campos de seleção
    if (!genero || !atividade || !objetivo) {
      alert('Por favor, selecione gênero, nível de atividade e objetivo.')
      return
    }

    // Fatores de proteína por kg baseado no objetivo
    let fator = 1.2 // Padrão sedentário
    
    if (objetivo === 'perder') fator = 2.2
    else if (objetivo === 'ganhar') fator = 2.5
    else fator = 1.8 // Manter peso

    // Ajuste por nível de atividade
    if (atividade === 'moderado') fator += 0.2
    else if (atividade === 'intenso') fator += 0.4
    else if (atividade === 'muito-intenso') fator += 0.6

    const proteinaDiaria = Math.round(pesoNum * fator)
    const proteinaPorKg = Math.round(fator * 10) / 10
    const porRefeicao = Math.round(proteinaDiaria / 5) // 5 refeições

    const diagnosticos = isCoach ? calculadoraProteinaDiagnosticosCoach : calculadoraProteinaDiagnosticos
    const area = isCoach ? 'coach' : 'wellness'

    // Diagnóstico por objetivo: mostra quanto precisa e orienta (perder / ganhar / manter)
    const diagnosticoSelecionado =
      objetivo === 'perder'
        ? diagnosticos[area].baixaProteina
        : objetivo === 'ganhar'
          ? diagnosticos[area].altaProteina
          : diagnosticos[area].proteinaNormal

    let interpretacao = ''
    let cor: 'green' | 'blue' | 'orange' = 'green'
    let recomendacoes: string[] = []

    const ctaEspecialista = isCoach ? 'Consulte o especialista da plataforma' : 'Consulte um especialista'
    if (objetivo === 'perder') {
      interpretacao = `Para perder peso com saúde você precisa de aproximadamente ${proteinaDiaria}g de proteína por dia (${proteinaPorKg}g por kg de peso). A proteína ajuda a preservar massa muscular e manter saciedade.`
      cor = 'orange'
      recomendacoes = [
        'Priorize proteínas magras (frango, peixes, ovos, leguminosas) em todas as refeições',
        'Distribua em 4 a 5 refeições para manter saciedade',
        `${ctaEspecialista} para um plano personalizado de perda de peso`
      ]
    } else if (objetivo === 'ganhar') {
      interpretacao = `Para ganhar massa muscular você precisa de aproximadamente ${proteinaDiaria}g de proteína por dia (${proteinaPorKg}g por kg de peso). Distribua ao longo do dia para otimizar síntese muscular.`
      cor = 'green'
      recomendacoes = [
        'Inclua proteína em todas as refeições, com ênfase pós-treino',
        'Fontes variadas: carnes, ovos, laticínios, leguminosas',
        `${ctaEspecialista} para um plano personalizado de ganho de massa`
      ]
    } else {
      interpretacao = `Para manter seu peso e saúde você precisa de aproximadamente ${proteinaDiaria}g de proteína por dia (${proteinaPorKg}g por kg de peso). Mantenha a distribuição ao longo do dia.`
      cor = 'green'
      recomendacoes = [
        'Distribua a proteína em 4 a 5 refeições',
        'Mantenha variedade de fontes (carnes magras, ovos, leguminosas)',
        `${ctaEspecialista} para acompanhamento`
      ]
    }

    setResultado({
      proteinaDiaria,
      proteinaPorKg,
      porRefeicao,
      interpretacao,
      cor,
      recomendacoes,
      diagnostico: diagnosticoSelecionado
    })
    setEtapa('resultado')
  }

  const resetar = () => {
    setIdade('')
    setGenero('')
    setPeso('')
    setAltura('')
    setAtividade('')
    setObjetivo('')
    setResultado(null)
    setEtapa('formulario')
  }

  const voltarInicio = () => {
    setIdade('')
    setGenero('')
    setPeso('')
    setAltura('')
    setAtividade('')
    setObjetivo('')
    setResultado(null)
    setEtapa('landing')
  }

  const cores = {
    green: 'bg-green-600 text-green-800',
    blue: 'bg-blue-600 text-blue-800',
    orange: 'bg-orange-600 text-orange-800'
  }

  const bordas = {
    green: 'border-green-300',
    blue: 'border-blue-300',
    orange: 'border-orange-300'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Calculadora de Proteína"
        defaultDescription="Suas necessidades proteicas diárias"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (() => {
          // Obter benefícios automaticamente baseado no template
          const templateBenefits = getTemplateBenefits('calc-proteina')
          
          return (
            <WellnessLanding
              config={config}
              defaultEmoji="💪"
              defaultTitle="Calculadora de Proteína"
              defaultDescription={
                <>
                  <p className="text-xl text-gray-600 mb-2">
                    Descubra quantas gramas de proteína você precisa por dia
                  </p>
                  <p className="text-gray-600">
                    Para atingir seus objetivos com saúde e resultados
                  </p>
                </>
              }
              discover={templateBenefits.discover || []}
              benefits={templateBenefits.whyUse || []}
              onStart={iniciarCalculo}
              buttonText="▶️ Calcular Minha Proteína - É Grátis"
            />
          )
        })()}

        {etapa === 'formulario' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Calcule sua proteína diária</h2>
              <p className="text-gray-600">Preencha os dados para descobrir quanto de proteína você precisa por dia e receber orientações conforme seu objetivo (perder peso, ganhar massa ou manter).</p>
            </div>

            <div className="space-y-6">
              {/* Idade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idade <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  min="1"
                  max="120"
                  placeholder="Ex: 30"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                />
              </div>

              {/* Gênero */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gênero <span className="text-red-500">*</span>
                </label>
                <select
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </div>

              {/* Peso */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  min="1"
                  max="300"
                  step="0.1"
                  placeholder="Ex: 70.5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                />
              </div>

              {/* Altura */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Altura (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={altura}
                  onChange={(e) => setAltura(e.target.value)}
                  min="100"
                  max="250"
                  placeholder="Ex: 175"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                />
              </div>

              {/* Nível de Atividade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de atividade física <span className="text-red-500">*</span>
                </label>
                <select
                  value={atividade}
                  onChange={(e) => setAtividade(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="sedentario">Sedentário</option>
                  <option value="leve">Leve (1-2x por semana)</option>
                  <option value="moderado">Moderado (3-4x por semana)</option>
                  <option value="intenso">Intenso (5-6x por semana)</option>
                  <option value="muito-intenso">Muito intenso (2x ao dia)</option>
                </select>
              </div>

              {/* Objetivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivo <span className="text-red-500">*</span>
                </label>
                <select
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="manter">Manter peso</option>
                  <option value="perder">Perda de peso</option>
                  <option value="ganhar">Ganhar massa muscular</option>
                </select>
              </div>

            </div>

            <button
              onClick={calcularProteina}
              className="w-full mt-8 text-white py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02] shadow-lg"
              style={config?.custom_colors
                ? {
                    backgroundColor: config.custom_colors.principal
                  }
                : {
                    backgroundColor: '#ea580c'
                  }}
            >
              Calcular Proteína →
            </button>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="space-y-6">
            {/* Ingestão adequada para você (sempre visível) */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-200">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <span className="text-xl mr-2">🥩</span>
                Para você, a ingestão adequada é aproximadamente:
              </h3>
              <p className="text-gray-800 text-lg">
                <strong>{resultado.proteinaDiaria} g/dia</strong> (cerca de <strong>{resultado.proteinaPorKg} g por kg de peso</strong>).
              </p>
              <p className="text-sm text-gray-600 mt-2">
                A referência geral é 1,2 a 2,2 g por kg de peso; para ganho de massa ou atividade intensa a necessidade pode ser maior (ex.: até ~2,5 g/kg). O valor calculado acima é o adequado para o seu perfil. Para um plano personalizado e acompanhamento seguro, busque orientação de um especialista.
              </p>
            </div>

            {/* Resultado */}
            <div className={`bg-white rounded-2xl shadow-lg p-8 border-4 ${bordas[resultado.cor]}`}>
              <div className="text-center mb-6">
                <div className={`inline-block px-8 py-4 rounded-full text-white font-bold text-2xl mb-4 ${cores[resultado.cor]}`}>
                  {resultado.proteinaDiaria}g de proteína/dia
                </div>
                <p className="text-sm text-gray-600 mb-2">Aproximadamente {resultado.porRefeicao}g por refeição (5 refeições)</p>
                <p className="text-gray-800 text-xl">{resultado.interpretacao}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💡</span>
                  Recomendações Importantes
                </h3>
                <ul className="space-y-2">
                  {resultado.recomendacoes.map((rec, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <span className="text-orange-600 mr-2">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Diagnóstico Completo (por objetivo) */}
            {resultado.diagnostico && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-200">
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200 mb-6">
                  <h3 className="font-bold text-gray-900 mb-4 text-xl flex items-center">
                    <span className="text-2xl mr-2">📋</span>
                    Diagnóstico Completo
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.diagnostico}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.causaRaiz}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.acaoImediata}</p>
                    </div>
                    {resultado.diagnostico.plano7Dias && (
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.plano7Dias}</p>
                      </div>
                    )}
                    {resultado.diagnostico.suplementacao && (
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.suplementacao}</p>
                      </div>
                    )}
                    {resultado.diagnostico.alimentacao && (
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.alimentacao}</p>
                      </div>
                    )}
                    {resultado.diagnostico.proximoPasso && (
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <p className="text-gray-800 font-semibold whitespace-pre-line">{resultado.diagnostico.proximoPasso}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CTA Section - Mensagem e Benefícios (sem formulário de coleta) */}
            <div 
              className="rounded-2xl p-8 border-2 mb-6"
              style={{
                background: config?.custom_colors
                  ? `linear-gradient(135deg, ${config.custom_colors.principal}10 0%, ${config.custom_colors.secundaria}10 100%)`
                  : 'linear-gradient(135deg, #eff6ff 0%, #faf5ff 100%)',
                borderColor: config?.custom_colors?.principal || '#93c5fd'
              }}
            >
              {isCoach ? (
                // ✅ CTA Educativo para Coach (estilo ILADA) com captura de lead
                <>
                  <div className="text-center mb-6">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      Se quiser entender melhor esse resultado dentro da sua rotina, é possível aprofundar essa análise com orientação personalizada.
                    </p>
                  </div>
                  
                  {!leadEnviado ? (
                    // Formulário de captura de lead
                    <form onSubmit={handleSalvarLead} className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome Completo <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={nomeLead}
                          onChange={(e) => setNomeLead(e.target.value)}
                          placeholder="Digite seu nome"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          WhatsApp <span className="text-red-500">*</span>
                        </label>
                        <PhoneInputWithCountry
                          value={telefoneLead}
                          onChange={(phone, countryCode) => {
                            setTelefoneLead(phone)
                            setPhoneCountryCode(countryCode || 'BR')
                          }}
                          defaultCountryCode={phoneCountryCode}
                          className="w-full"
                          placeholder="11 99999-9999"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={enviandoLead}
                        className="w-full py-4 text-white rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02] shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: config?.custom_colors?.principal || '#8B5CF6'
                        }}
                      >
                        {enviandoLead ? 'Enviando...' : '👉 Quero saber mais'}
                      </button>
                    </form>
                  ) : (
                    // Mensagem de sucesso após envio
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center mb-6">
                      <p className="text-green-800 font-semibold text-lg mb-2">
                        ✅ Obrigado! Recebemos seus dados.
                      </p>
                      <p className="text-green-700">
                        Entraremos em contato em breve para aprofundar sua análise.
                      </p>
                    </div>
                  )}
                  
                  {/* CTA Button - Botão do WhatsApp (mostrar apenas se lead foi enviado) */}
                  {config && leadEnviado && (
                    <div className="flex justify-center">
                      <WellnessCTAButton
                        config={config}
                        resultadoTexto={`${resultado.proteinaDiaria}g de proteína/dia`}
                      />
                    </div>
                  )}
                </>
              ) : (
                // CTA Original para Wellness
                <>
                  {/* Título convidativo */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      💪 Quer otimizar sua ingestão de proteínas?
                    </h3>
                    <p className="text-gray-600">
                      Te ajudo a alcançar seus objetivos de forma personalizada!
                    </p>
                  </div>

                  {/* Benefícios */}
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="text-2xl mr-2">✨</span>
                      O que você vai receber:
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2 text-lg">✓</span>
                        <span className="text-gray-700">Cardápio personalizado com fontes de proteína ideais</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2 text-lg">✓</span>
                        <span className="text-gray-700">Distribuição estratégica ao longo do dia</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2 text-lg">✓</span>
                        <span className="text-gray-700">Suplementação adequada, se necessário</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2 text-lg">✓</span>
                        <span className="text-gray-700">Alcançar seus objetivos de forma mais rápida</span>
                      </li>
                    </ul>
                  </div>

                  {/* CTA Button - Botão do WhatsApp sem coleta de dados */}
                  {config && (
                    <WellnessCTAButton
                      config={config}
                      resultadoTexto={`${resultado.proteinaDiaria}g de proteína/dia`}
                    />
                  )}
                </>
              )}
            </div>

            <WellnessActionButtons
              onRecalcular={resetar}
              onVoltarInicio={voltarInicio}
            />
          </div>
        )}
      </main>
    </div>
  )
}


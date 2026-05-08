'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import HypeDrinkCTA from '@/components/wellness/HypeDrinkCTA'
import { calcCustoEnergiaDiagnosticos, type DiagnosticoCompleto } from '@/lib/diagnostics'

interface ResultadoCusto {
  percentualImprodutivo: number
  custoEstimado: number | null
  custoEstimadoMes: number | null
  impacto: string
  cor: 'red' | 'orange' | 'green'
  descricao: string
  recomendacoes: string[]
  diagnostico?: DiagnosticoCompleto
  resumoTipoTrabalho: string
}

const CARD_STYLES: Record<
  ResultadoCusto['cor'],
  { wrap: string; border: string; title: string }
> = {
  red: {
    wrap: 'bg-red-50',
    border: 'border-red-200',
    title: 'text-red-900',
  },
  orange: {
    wrap: 'bg-orange-50',
    border: 'border-orange-200',
    title: 'text-orange-900',
  },
  green: {
    wrap: 'bg-green-50',
    border: 'border-green-200',
    title: 'text-green-900',
  },
}

function resumoTipoTrabalho(tipo: string): string {
  switch (tipo) {
    case 'mental':
      return 'Trabalho mais mental costuma pedir foco sustentado e pausas curtas fora da tela — micro-paradas evitam o “apagão” no fim do bloco.'
    case 'fisico':
      return 'Trabalho mais físico gasta energia de forma contínua: hidratação, refeição no tempo certo e recuperação entre esforços pesam mais na sua disposição.'
    case 'misto':
      return 'Rotina mista alterna picos mentais e físicos; combinar pausa ativa + alimentação estável costuma segurar o ritmo melhor do que “forçar” o corpo só com cafeína.'
    default:
      return ''
  }
}

const defaultConfig: TemplateBaseProps['config'] = {
  id: 'calc-custo-energia',
  name: 'Calculadora: Custo da Falta de Energia',
  description:
    'Estime quanto do seu dia some em baixa energia e, se quiser, traduza isso em reais com sua hora de trabalho.',
  slug: 'calc-custo-energia',
  profession: 'wellness',
}

function SecaoResultado({ titulo, texto }: { titulo: string; texto: string }) {
  if (!texto.trim()) return null
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/80 p-4">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">{titulo}</h4>
      <p className="text-gray-700 text-sm leading-relaxed">{texto}</p>
    </div>
  )
}

export default function CalculadoraCustoEnergia({ config = defaultConfig }: { config?: TemplateBaseProps['config'] }) {
  const [etapa, setEtapa] = useState<'landing' | 'formulario' | 'resultado'>('landing')
  const [horasTrabalhadas, setHorasTrabalhadas] = useState('')
  const [horasImprodutivas, setHorasImprodutivas] = useState('')
  const [tipoTrabalho, setTipoTrabalho] = useState('')
  const [valorHora, setValorHora] = useState('')
  const [resultado, setResultado] = useState<ResultadoCusto | null>(null)

  const iniciarCalculo = () => {
    setEtapa('formulario')
  }

  const calcularCusto = () => {
    const horasTrab = parseFloat(horasTrabalhadas) || 0
    const horasImprod = parseFloat(horasImprodutivas) || 0
    const valorHoraNum = parseFloat(valorHora) || null

    if (horasTrab <= 0 || horasImprod < 0 || horasImprod > horasTrab) {
      alert('Informe horas trabalhadas (maior que zero) e horas improdutivas entre 0 e esse total.')
      return
    }

    if (!tipoTrabalho) {
      alert('Selecione o tipo de trabalho — usamos isso para personalizar a leitura (não entra no cálculo em si).')
      return
    }

    const percentualImprodutivo = horasTrab > 0 ? (horasImprod / horasTrab) * 100 : 0
    const custoEstimado = valorHoraNum != null && valorHoraNum > 0 ? horasImprod * valorHoraNum : null
    const custoEstimadoMes = custoEstimado != null ? custoEstimado * 22 : null

    let impacto = ''
    let cor: ResultadoCusto['cor'] = 'green'
    let descricao = ''
    let recomendacoes: string[] = []

    let diagnosticoId = ''
    if (percentualImprodutivo > 30) {
      impacto = 'Alto impacto na rotina'
      cor = 'red'
      descricao = `Cerca de ${percentualImprodutivo.toFixed(0)}% do seu dia de trabalho está em ritmo reduzido por cansaço.`
      recomendacoes = [
        'Priorize sono regular e pausas reais entre blocos de foco.',
        'Quando a base da rotina estiver ok, uma bebida funcional pode apoiar as janelas mais pesadas — converse com quem te enviou o link.',
      ]
      diagnosticoId = 'altoImpacto'
    } else if (percentualImprodutivo > 15) {
      impacto = 'Impacto moderado'
      cor = 'orange'
      descricao = `Cerca de ${percentualImprodutivo.toFixed(0)}% do expediente some em baixa energia — dá para recuperar com ajustes pequenos.`
      recomendacoes = [
        'Experimente pausas curtas + hidratação antes de aumentar cafeína.',
        'Se quiser um plano alinhado ao seu dia, fale com quem compartilhou o link sobre opções de apoio (incluindo Hype Drink, se fizer sentido).',
      ]
      diagnosticoId = 'impactoModerado'
    } else {
      impacto = 'Impacto baixo hoje'
      cor = 'green'
      descricao = `Com cerca de ${percentualImprodutivo.toFixed(0)}% do tempo improdutivo por cansaço, o ritmo parece relativamente estável — bom momento para prevenção.`
      recomendacoes = [
        'Mantenha micro-hábitos (água à vista, pausa de tela) para não deixar o cansaço crescer escondido.',
        'Em dias de pico, um apoio funcional pode ser útil — peça orientação a quem te enviou o link.',
      ]
      diagnosticoId = 'baixoImpacto'
    }

    const diagnosticoBase = calcCustoEnergiaDiagnosticos.wellness?.[diagnosticoId as keyof typeof calcCustoEnergiaDiagnosticos.wellness]
    const diagnostico: DiagnosticoCompleto = diagnosticoBase ?? {
      diagnostico: `A falta de energia está associada a ${impacto.toLowerCase()} na sua produtividade.`,
      causaRaiz:
        'A perda de ritmo ao longo do dia impacta produtividade; combinar rotina com apoio certo costuma ajudar.',
      acaoImediata: 'Reserve pausas curtas, hidrate-se e alinhe sono e refeições nas próximas 48 h.',
      plano7Dias: 'Por uma semana, anote em que horário você mais perde rendimento.',
      suplementacao:
        'Uma bebida funcional com nutrientes de apoio pode complementar a rotina nas horas mais pesadas.',
      alimentacao: 'Prefira refeições que segurem a energia de forma estável ao longo do dia.',
      proximoPasso: 'Converse com quem te enviou o link para um próximo passo no seu contexto.',
    }

    setResultado({
      percentualImprodutivo,
      custoEstimado,
      custoEstimadoMes,
      impacto,
      cor,
      descricao,
      recomendacoes,
      diagnostico,
      resumoTipoTrabalho: resumoTipoTrabalho(tipoTrabalho),
    })
    setEtapa('resultado')
  }

  const recomecar = () => {
    setEtapa('landing')
    setHorasTrabalhadas('')
    setHorasImprodutivas('')
    setTipoTrabalho('')
    setValorHora('')
    setResultado(null)
  }

  if (etapa === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <WellnessHeader showLogoOnly={true} />
        <WellnessLanding
          title="Quanto do seu dia some em baixa energia?"
          description="Em poucos minutos você vê o percentual do expediente em que o cansaço rouba ritmo — e, se informar quanto vale sua hora, também uma estimativa em reais por dia e por mês (~22 dias úteis)."
          benefits={[
            'Entenda o recorte: horas improdutivas em relação ao total que você trabalha.',
            'Opcional: traduza em R$/dia e R$/mês (~22 dias úteis) com o valor da sua hora.',
            'Leitura por tipo de trabalho (mental, físico ou misto) + hábitos antes de falar de produto.',
            'Próximo passo: conversar com quem te enviou o link, inclusive sobre Hype Drink se fizer sentido.',
          ]}
          onStart={iniciarCalculo}
          ctaText="Começar estimativa"
        />
      </div>
    )
  }

  if (etapa === 'resultado' && resultado) {
    const styles = CARD_STYLES[resultado.cor]
    const d = resultado.diagnostico

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <WellnessHeader showLogoOnly={true} />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Seu resultado</h2>
            <p className="text-gray-600 text-sm mb-6">{resultado.descricao}</p>

            <div className={`p-5 rounded-xl mb-8 border-2 ${styles.wrap} ${styles.border}`}>
              <h3 className={`text-xl font-semibold mb-3 ${styles.title}`}>{resultado.impacto}</h3>
              <p className="text-gray-800 mb-2">
                Tempo improdutivo por cansaço:{' '}
                <strong>{resultado.percentualImprodutivo.toFixed(1)}%</strong> do seu dia de trabalho informado.
              </p>
              {resultado.custoEstimado !== null && (
                <>
                  <p className="text-gray-800 mb-1">
                    Estimativa em dinheiro: <strong>R$ {resultado.custoEstimado.toFixed(2)} por dia</strong>{' '}
                    (com base na sua hora e nas horas improdutivas).
                  </p>
                  {resultado.custoEstimadoMes !== null && (
                    <p className="text-gray-700 text-sm mb-2">
                      Referência ~22 dias úteis: <strong>R$ {resultado.custoEstimadoMes.toFixed(2)} / mês</strong>.
                    </p>
                  )}
                </>
              )}
              {resultado.custoEstimado === null && (
                <p className="text-gray-600 text-sm mb-2">
                  Você não informou valor da hora — o recorte principal é o percentual de tempo improdutivo. Volte
                  atrás e preencha se quiser ver também em reais.
                </p>
              )}
              {resultado.resumoTipoTrabalho ? (
                <p className="text-gray-700 text-sm leading-relaxed mt-3 border-t border-gray-200/80 pt-3">
                  {resultado.resumoTipoTrabalho}
                </p>
              ) : null}
              <ul className="list-disc list-inside space-y-2 mt-4 text-gray-700 text-sm">
                {resultado.recomendacoes.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>

            {d && (
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold text-gray-900">Como melhorar a energia (por onde começar)</h3>
                {d.rotinaPrimeiro ? <SecaoResultado titulo="Rotina primeiro" texto={d.rotinaPrimeiro} /> : null}
                <SecaoResultado titulo="Leitura" texto={d.diagnostico} />
                <SecaoResultado titulo="Por que isso acontece" texto={d.causaRaiz} />
                <SecaoResultado titulo="Hoje" texto={d.acaoImediata} />
                {d.plano7Dias ? <SecaoResultado titulo="Nos próximos dias" texto={d.plano7Dias} /> : null}
                {d.alimentacao ? <SecaoResultado titulo="Alimentação e hidratação" texto={d.alimentacao} /> : null}
                {d.suplementacao ? (
                  <SecaoResultado titulo="Complemento (bebida funcional)" texto={d.suplementacao} />
                ) : null}
                {d.proximoPasso ? (
                  <p className="text-sm text-gray-600 border-l-4 border-sky-400 pl-4 py-1">{d.proximoPasso}</p>
                ) : null}
              </div>
            )}

            <div className="bg-gradient-to-r from-sky-50 to-orange-50 rounded-xl p-6 border border-orange-200/60 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Quer ir além com apoio?</h3>
              <p className="text-gray-700 text-center text-sm mb-4">
                O Hype Drink pode entrar como complemento quando sono, refeições e pausas já estão em discussão — a
                conversa com quem te enviou o link ajuda a ver se combina com você.
              </p>
              <HypeDrinkCTA
                config={config}
                resultado={resultado.impacto}
                mensagemPersonalizada={`Olá! Usei a calculadora de energia/produtividade: impacto ${resultado.impacto}, ${resultado.percentualImprodutivo.toFixed(0)}% do dia em baixa energia. Quero alinhar o que faz sentido pra mim (rotina e, se couber, Hype Drink).`}
              />
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={recomecar}
                className="text-sm font-medium text-sky-700 hover:text-sky-900 underline"
              >
                Fazer outra estimativa
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <WellnessHeader config={config} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-2">Informe seus dados</h2>
          <p className="text-gray-600 text-sm mb-6">
            O resultado principal é o <strong>percentual</strong> do seu dia de trabalho em que o cansaço reduz o
            ritmo. O valor em reais só aparece se você preencher o valor da hora.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantas horas você trabalha por dia?</label>
              <input
                type="number"
                min="1"
                max="24"
                step="0.5"
                value={horasTrabalhadas}
                onChange={(e) => setHorasTrabalhadas(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ex: 8"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horas em que você rende menos por cansaço (por dia)
              </label>
              <p className="text-xs text-gray-500 mb-2 leading-relaxed">
                Estime trechos em que você trava, distrai, re-lê sem avançar ou precisa de “empurrão” extra de cafeína
                — não precisa ser exato; uma média já ajuda.
              </p>
              <input
                type="number"
                min="0"
                max={horasTrabalhadas || 24}
                step="0.5"
                value={horasImprodutivas}
                onChange={(e) => setHorasImprodutivas(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ex: 2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de trabalho (para a leitura)</label>
              <p className="text-xs text-gray-500 mb-2">
                Não altera o número do resultado; personaliza o texto com dicas mais próximas da sua rotina.
              </p>
              <select
                value={tipoTrabalho}
                onChange={(e) => setTipoTrabalho(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Selecione</option>
                <option value="mental">Mental / intelectual</option>
                <option value="fisico">Físico</option>
                <option value="misto">Misto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor da sua hora de trabalho (opcional)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={valorHora}
                onChange={(e) => setValorHora(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ex: 50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Em branco = mostramos só o percentual de tempo improdutivo, sem estimativa em R$.
              </p>
            </div>

            <button
              type="button"
              onClick={calcularCusto}
              className="w-full bg-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Ver resultado
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

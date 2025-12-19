'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface Evolucao {
  id: string
  measurement_date: string
  weight: number | null
  height: number | null
  bmi: number | null
  waist_circumference: number | null
  hip_circumference: number | null
  neck_circumference: number | null
  chest_circumference: number | null
  arm_circumference: number | null
  thigh_circumference: number | null
  body_fat_percentage: number | null
  muscle_mass: number | null
  bone_mass: number | null
  water_percentage: number | null
  visceral_fat: number | null
  notes: string | null
  created_at: string
}

interface TabelaEvolucaoProps {
  evolucoes: Evolucao[]
}

export default function TabelaEvolucao({ evolucoes }: TabelaEvolucaoProps) {
  // Calcular variação em relação à medição anterior
  const calcularVariacao = (indiceAtual: number, campo: keyof Evolucao): { valor: number | null, percentual: number | null, tipo: 'aumento' | 'diminuicao' | 'estavel' } => {
    if (indiceAtual >= evolucoes.length - 1) {
      return { valor: null, percentual: null, tipo: 'estavel' }
    }

    const atual = evolucoes[indiceAtual][campo] as number | null
    const anterior = evolucoes[indiceAtual + 1][campo] as number | null

    if (!atual || !anterior) {
      return { valor: null, percentual: null, tipo: 'estavel' }
    }

    const diferenca = atual - anterior
    const percentual = ((diferenca / anterior) * 100)

    if (Math.abs(diferenca) < 0.1) {
      return { valor: 0, percentual: 0, tipo: 'estavel' }
    }

    return {
      valor: diferenca,
      percentual,
      tipo: diferenca > 0 ? 'aumento' : 'diminuicao'
    }
  }

  const IndicadorVariacao = ({ variacao }: { variacao: ReturnType<typeof calcularVariacao> }) => {
    if (variacao.tipo === 'estavel' || variacao.valor === null) {
      return (
        <span className="inline-flex items-center text-xs text-gray-400">
          <Minus className="w-3 h-3 mr-1" />
          Estável
        </span>
      )
    }

    const isPositive = variacao.tipo === 'aumento'
    const color = isPositive ? 'text-green-600' : 'text-red-600'
    const Icon = isPositive ? TrendingUp : TrendingDown

    return (
      <span className={`inline-flex items-center text-xs font-medium ${color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {Math.abs(variacao.valor).toFixed(1)} ({Math.abs(variacao.percentual || 0).toFixed(1)}%)
      </span>
    )
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const calcularIMC = (peso: number | null, altura: number | null) => {
    if (!peso || !altura || altura === 0) return null
    return (peso / (altura * altura)).toFixed(1)
  }

  const getIMCClassificacao = (imc: number | null) => {
    if (!imc) return null
    if (imc < 18.5) return { texto: 'Abaixo', cor: 'text-blue-600' }
    if (imc < 25) return { texto: 'Normal', cor: 'text-green-600' }
    if (imc < 30) return { texto: 'Sobrepeso', cor: 'text-yellow-600' }
    return { texto: 'Obesidade', cor: 'text-red-600' }
  }

  if (evolucoes.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma medição registrada</h3>
        <p className="text-gray-600">Clique em "Nova Medição" para começar a acompanhar a evolução física.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Peso
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                IMC
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                % Gordura
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Massa Muscular
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Cintura
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Quadril
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Observações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {evolucoes.map((evolucao, index) => {
              const variacaoPeso = calcularVariacao(index, 'weight')
              const variacaoGordura = calcularVariacao(index, 'body_fat_percentage')
              const variacaoMuscular = calcularVariacao(index, 'muscle_mass')
              const imc = calcularIMC(evolucao.weight, evolucao.height)
              const imcClass = getIMCClassificacao(imc ? parseFloat(imc) : null)

              return (
                <tr key={evolucao.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatarData(evolucao.measurement_date)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(evolucao.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {evolucao.weight ? (
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {evolucao.weight} kg
                        </div>
                        <IndicadorVariacao variacao={variacaoPeso} />
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {imc ? (
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {imc}
                        </div>
                        {imcClass && (
                          <span className={`text-xs ${imcClass.cor}`}>
                            {imcClass.texto}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {evolucao.body_fat_percentage ? (
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {evolucao.body_fat_percentage}%
                        </div>
                        <IndicadorVariacao variacao={variacaoGordura} />
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {evolucao.muscle_mass ? (
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {evolucao.muscle_mass} kg
                        </div>
                        <IndicadorVariacao variacao={variacaoMuscular} />
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {evolucao.waist_circumference ? (
                      <div className="text-sm text-gray-900">
                        {evolucao.waist_circumference} cm
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {evolucao.hip_circumference ? (
                      <div className="text-sm text-gray-900">
                        {evolucao.hip_circumference} cm
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {evolucao.notes ? (
                      <div className="text-sm text-gray-600 max-w-xs truncate" title={evolucao.notes}>
                        {evolucao.notes}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}


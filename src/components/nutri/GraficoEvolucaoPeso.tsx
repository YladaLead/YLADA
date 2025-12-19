'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface Evolucao {
  id: string
  measurement_date: string
  weight: number | null
  height: number | null
  bmi: number | null
  body_fat_percentage: number | null
  muscle_mass: number | null
  waist_circumference: number | null
  created_at: string
}

interface GraficoEvolucaoPesoProps {
  evolucoes: Evolucao[]
}

export default function GraficoEvolucaoPeso({ evolucoes }: GraficoEvolucaoPesoProps) {
  // Preparar dados para os gráficos
  const dadosOrdenados = [...evolucoes]
    .sort((a, b) => new Date(a.measurement_date).getTime() - new Date(b.measurement_date).getTime())

  const dadosPeso = dadosOrdenados
    .filter(e => e.weight)
    .map(e => ({
      data: new Date(e.measurement_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      peso: parseFloat(e.weight!.toString())
    }))

  const dadosIMC = dadosOrdenados
    .filter(e => e.bmi)
    .map(e => ({
      data: new Date(e.measurement_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      imc: parseFloat(e.bmi!.toString())
    }))

  const dadosComposicao = dadosOrdenados
    .filter(e => e.body_fat_percentage || e.muscle_mass)
    .map(e => ({
      data: new Date(e.measurement_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      gordura: e.body_fat_percentage ? parseFloat(e.body_fat_percentage.toString()) : null,
      musculo: e.muscle_mass ? parseFloat(e.muscle_mass.toString()) : null
    }))

  const dadosCircunferencias = dadosOrdenados
    .filter(e => e.waist_circumference)
    .map(e => ({
      data: new Date(e.measurement_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      cintura: e.waist_circumference ? parseFloat(e.waist_circumference.toString()) : null
    }))

  // Calcular estatísticas
  const calcularEstatisticas = (dados: number[]) => {
    if (dados.length === 0) return { min: 0, max: 0, media: 0, variacao: 0 }
    
    const min = Math.min(...dados)
    const max = Math.max(...dados)
    const media = dados.reduce((a, b) => a + b, 0) / dados.length
    const variacao = dados.length > 1 ? dados[dados.length - 1] - dados[0] : 0

    return { min, max, media, variacao }
  }

  const estatisticasPeso = calcularEstatisticas(dadosPeso.map(d => d.peso))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span> {entry.value.toFixed(1)} {entry.unit || ''}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (evolucoes.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Dados insuficientes para gráficos</h3>
        <p className="text-gray-600">Registre pelo menos 2 medições para visualizar a evolução.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Resumo Estatístico */}
      {dadosPeso.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="text-sm font-medium text-blue-900 mb-1">Peso Atual</div>
            <div className="text-2xl font-bold text-blue-600">
              {dadosPeso[dadosPeso.length - 1].peso.toFixed(1)} kg
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="text-sm font-medium text-green-900 mb-1">Variação Total</div>
            <div className={`text-2xl font-bold ${estatisticasPeso.variacao < 0 ? 'text-green-600' : 'text-red-600'}`}>
              {estatisticasPeso.variacao > 0 ? '+' : ''}{estatisticasPeso.variacao.toFixed(1)} kg
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="text-sm font-medium text-purple-900 mb-1">Peso Mínimo</div>
            <div className="text-2xl font-bold text-purple-600">
              {estatisticasPeso.min.toFixed(1)} kg
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="text-sm font-medium text-orange-900 mb-1">Peso Máximo</div>
            <div className="text-2xl font-bold text-orange-600">
              {estatisticasPeso.max.toFixed(1)} kg
            </div>
          </div>
        </div>
      )}

      {/* Gráfico de Peso */}
      {dadosPeso.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução do Peso</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dadosPeso}>
              <defs>
                <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="data" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                stroke="#9CA3AF"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                stroke="#9CA3AF"
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="peso" 
                stroke="#3B82F6" 
                strokeWidth={3}
                fill="url(#colorPeso)" 
                name="Peso"
                unit=" kg"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Gráfico de IMC */}
      {dadosIMC.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução do IMC</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dadosIMC}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="data" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                stroke="#9CA3AF"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                stroke="#9CA3AF"
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="imc" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 5 }}
                name="IMC"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Gráfico de Composição Corporal */}
      {dadosComposicao.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Composição Corporal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dadosComposicao}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="data" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                stroke="#9CA3AF"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                stroke="#9CA3AF"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              {dadosComposicao[0].gordura !== null && (
                <Line 
                  type="monotone" 
                  dataKey="gordura" 
                  stroke="#EF4444" 
                  strokeWidth={3}
                  dot={{ fill: '#EF4444', r: 5 }}
                  name="% Gordura"
                  unit="%"
                />
              )}
              {dadosComposicao[0].musculo !== null && (
                <Line 
                  type="monotone" 
                  dataKey="musculo" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', r: 5 }}
                  name="Massa Muscular"
                  unit=" kg"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Gráfico de Circunferências */}
      {dadosCircunferencias.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Circunferência da Cintura</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dadosCircunferencias}>
              <defs>
                <linearGradient id="colorCintura" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="data" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                stroke="#9CA3AF"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                stroke="#9CA3AF"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="cintura" 
                stroke="#F59E0B" 
                strokeWidth={3}
                fill="url(#colorCintura)" 
                name="Cintura"
                unit=" cm"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}


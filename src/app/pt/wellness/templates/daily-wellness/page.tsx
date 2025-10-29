'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'

export default function TabelaBemestar({ config }: TemplateBaseProps) {
  const [dados, setDados] = useState({
    date: '',
    weight: '',
    water: '',
    sleep: '',
    energy: '',
    mood: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Registro salvo! Em breve você poderá ver todo seu histórico de bem-estar.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Tabela Bem-Estar Diário"
        defaultDescription="Acompanhe suas métricas diárias"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-teal-200">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Acompanhamento Diário</h2>
            <p className="text-xl text-gray-600 mb-2">
              Registre suas métricas de bem-estar
            </p>
            <p className="text-gray-600 mb-6">
              Monitore peso, hidratação, sono, energia e humor diariamente
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dados.date}
                onChange={(e) => setDados({ ...dados, date: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso (kg)
              </label>
              <input
                type="number"
                value={dados.weight}
                onChange={(e) => setDados({ ...dados, weight: e.target.value })}
                step="0.1"
                placeholder="Ex: 70.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Água (litros)
              </label>
              <input
                type="number"
                value={dados.water}
                onChange={(e) => setDados({ ...dados, water: e.target.value })}
                step="0.1"
                placeholder="Ex: 2.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horas de Sono
              </label>
              <input
                type="number"
                value={dados.sleep}
                onChange={(e) => setDados({ ...dados, sleep: e.target.value })}
                min="4"
                max="12"
                placeholder="Ex: 7.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível de Energia
              </label>
              <select
                value={dados.energy}
                onChange={(e) => setDados({ ...dados, energy: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
              >
                <option value="">Selecione</option>
                <option value="baixo">Baixo</option>
                <option value="medio">Médio</option>
                <option value="alto">Alto</option>
                <option value="muito-alto">Muito Alto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Humor
              </label>
              <select
                value={dados.mood}
                onChange={(e) => setDados({ ...dados, mood: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
              >
                <option value="">Selecione</option>
                <option value="😢">😢 Triste</option>
                <option value="😐">😐 Neutro</option>
                <option value="🙂">🙂 Feliz</option>
                <option value="😊">😊 Muito Feliz</option>
                <option value="🤩">🤩 Excelente</option>
              </select>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">💡 Dicas de Acompanhamento</h3>
              <ul className="text-left space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Registre diariamente para criar um padrão</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Observe correlações entre sono, energia e humor</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Monitore tendências semanais</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Ajuste hábitos com base nos dados</span>
                </li>
              </ul>
            </div>

            <button
              type="submit"
              className="w-full mt-8 text-white py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02] shadow-lg"
              style={config?.custom_colors
                ? {
                    background: `linear-gradient(135deg, ${config.custom_colors.principal} 0%, ${config.custom_colors.secundaria} 100%)`
                  }
                : {
                    background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)'
                  }}
            >
              💾 Salvar Registro
            </button>
          </form>
        </div>

        <div className="mt-6">
          <WellnessCTAButton
            config={config}
            resultadoTexto="Registro de Bem-Estar Diário"
          />
        </div>
      </main>
    </div>
  )
}


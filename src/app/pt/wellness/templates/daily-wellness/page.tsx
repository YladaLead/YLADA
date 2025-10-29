'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function TabelaBemestar() {
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
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Image
              src="/logos/ylada-logo-horizontal-vazado.png"
              alt="YLADA"
              width={160}
              height={50}
              className="h-10"
            />
            <div className="h-10 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Tabela Bem-Estar Diário</h1>
              <p className="text-sm text-gray-600">Acompanhe suas métricas diárias</p>
            </div>
          </div>
        </div>
      </header>

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
              className="w-full mt-8 bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-teal-700 hover:to-cyan-700 transition-all transform hover:scale-[1.02] shadow-lg"
            >
              💾 Salvar Registro
            </button>
          </form>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-6 text-center mt-6">
          <p className="text-white text-lg font-semibold mb-4">
            Quer acompanhar seu progresso com orientação profissional?
          </p>
          <a
            href="https://wa.me/5511999999999?text=Olá! Acompanho meu bem-estar diário através do YLADA e gostaria de saber mais sobre otimização. Pode me ajudar?"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg"
          >
            💬 Conversar com Especialista
          </a>
        </div>
      </main>
    </div>
  )
}


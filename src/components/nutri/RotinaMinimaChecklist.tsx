'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const rotinaItems = [
  'Captar pelo menos 1 lead',
  'Organizar conversas do dia',
  'Atualizar status de clientes',
  'Revisar agenda do dia seguinte'
]

export default function RotinaMinimaChecklist() {
  const [checkedItems, setCheckedItems] = useState<boolean[]>([])
  const [dataHoje, setDataHoje] = useState('')

  useEffect(() => {
    // Obter data de hoje no formato YYYY-MM-DD
    const hoje = new Date().toISOString().split('T')[0]
    setDataHoje(hoje)

    // Carregar checklist salvo do localStorage
    const saved = localStorage.getItem(`rotina_minima_${hoje}`)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setCheckedItems(parsed)
      } catch (error) {
        setCheckedItems(new Array(rotinaItems.length).fill(false))
      }
    } else {
      setCheckedItems(new Array(rotinaItems.length).fill(false))
    }
  }, [])

  const handleToggle = (index: number) => {
    const newChecked = [...checkedItems]
    newChecked[index] = !newChecked[index]
    setCheckedItems(newChecked)

    // Salvar no localStorage
    localStorage.setItem(`rotina_minima_${dataHoje}`, JSON.stringify(newChecked))
  }

  const progresso = checkedItems.filter(Boolean).length
  const porcentagem = rotinaItems.length > 0 ? Math.round((progresso / rotinaItems.length) * 100) : 0

  return (
    <div className="space-y-3">
      {/* Barra de Progresso */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progresso: {progresso} de {rotinaItems.length}
          </span>
          <span className="text-sm font-semibold text-gray-900">{porcentagem}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${porcentagem}%` }}
          ></div>
        </div>
      </div>

      {/* Itens do Checklist */}
      <div className="space-y-2">
        {rotinaItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              checkedItems[index] ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50'
            }`}
          >
            <input
              type="checkbox"
              checked={checkedItems[index] || false}
              onChange={() => handleToggle(index)}
              className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer"
            />
            <span
              className={`text-sm flex-1 ${
                checkedItems[index] ? 'text-gray-700 line-through' : 'text-gray-700'
              }`}
            >
              {item}
            </span>
            {checkedItems[index] && (
              <span className="text-green-600 text-xs">✓</span>
            )}
          </div>
        ))}
      </div>

      {/* Dica sobre Agenda Estratégica */}
      {rotinaItems[3] && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-blue-600 text-lg">💡</span>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Como preencher sua Agenda Estratégica?
              </h4>
              <p className="text-xs text-gray-700 mb-3">
                Sua agenda estratégica é o mapa do seu dia. Preencha com:
              </p>
              <ul className="text-xs text-gray-600 space-y-1 mb-3 list-disc list-inside">
                <li><strong>Horários fixos de atendimento:</strong> Quando você está disponível para consultas</li>
                <li><strong>Horários de captação:</strong> Quando você distribui ferramentas e gera leads</li>
                <li><strong>Rotina mínima semanal:</strong> O que você faz cada dia da semana</li>
              </ul>
              <Link
                href="/pt/nutri/metodo/painel/agenda"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
              >
                Ir para Agenda Estratégica →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


'use client'

import { useState, useEffect } from 'react'

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
    </div>
  )
}


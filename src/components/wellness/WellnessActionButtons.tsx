'use client'

// =====================================================
// YLADA - COMPONENTE BOTÕES DE AÇÃO SECUNDÁRIOS (PEQUENOS E DISCRETOS)
// =====================================================

interface WellnessActionButtonsProps {
  onRecalcular: () => void
  onVoltarInicio: () => void
  textoRecalcular?: string
  textoVoltar?: string
}

export default function WellnessActionButtons({
  onRecalcular,
  onVoltarInicio,
  textoRecalcular = '↺ Fazer Novo Cálculo',
  textoVoltar = '🏠 Voltar ao Início'
}: WellnessActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 justify-center items-center mt-4">
      <button
        onClick={onRecalcular}
        className="text-xs text-gray-500 hover:text-gray-700 py-1.5 px-3 rounded-md hover:bg-gray-100 transition-colors border border-gray-200"
      >
        {textoRecalcular}
      </button>
      <button
        onClick={onVoltarInicio}
        className="text-xs text-gray-500 hover:text-gray-700 py-1.5 px-3 rounded-md hover:bg-gray-100 transition-colors border border-gray-200"
      >
        {textoVoltar}
      </button>
    </div>
  )
}



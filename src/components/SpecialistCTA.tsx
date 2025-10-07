'use client'

import { MessageSquare } from 'lucide-react'

interface SpecialistCTAProps {
  toolName: string
  className?: string
}

export default function SpecialistCTA({ toolName, className = '' }: SpecialistCTAProps) {
  const handleContactSpecialist = () => {
    // Buscar dados do link personalizado
    const urlParams = new URLSearchParams(window.location.search)
    const linkId = urlParams.get('link')
    
    if (linkId) {
      // Redirecionar para o link personalizado do especialista
      window.location.href = `/tools/${toolName}?link=${linkId}&action=contact`
    } else {
      // Fallback para página de contato
      window.location.href = '/fitlead'
    }
  }

  return (
    <div className={`mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200 ${className}`}>
      <p className="text-sm text-emerald-700 mb-3">
        💡 <strong>Quer resultados ainda melhores?</strong><br/>
        Um especialista pode criar um plano personalizado para você!
      </p>
      <button
        onClick={handleContactSpecialist}
        className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center justify-center"
      >
        <MessageSquare className="w-5 h-5 mr-2" />
        Falar com Especialista
      </button>
    </div>
  )
}

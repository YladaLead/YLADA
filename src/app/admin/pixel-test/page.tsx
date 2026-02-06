'use client'

import { useEffect, useRef, useState } from 'react'
import { trackPurchase, trackNutriPurchase } from '@/lib/facebook-pixel'

/**
 * Página interna (admin) para disparar eventos Purchase de teste ao Meta Pixel.
 * Use para "ativar" o evento Comprar na Meta quando ainda não há conversões reais.
 * Acesso: /admin/pixel-test
 */
export default function AdminPixelTestPage() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const done = useRef(false)

  useEffect(() => {
    if (done.current) return
    done.current = true
    const t = setTimeout(() => {
      try {
        // 1) Purchase aula paga (R$ 37)
        trackPurchase({
          content_name: 'Aula Agenda Cheia Nutri',
          content_ids: ['aula-paga-agenda-cheia'],
          value: 37,
          currency: 'BRL',
          num_items: 1,
          content_category: 'Aula Paga',
        })
        // 2) Purchase anuidade (R$ 1164)
        trackPurchase({
          content_name: 'Assinatura YLADA NUTRI',
          content_ids: ['plano-anual-nutri'],
          value: 1164,
          currency: 'BRL',
          num_items: 1,
          content_category: 'NUTRI',
        })
        trackNutriPurchase({ plan_type: 'annual', value: 1164 })
        setSent(true)
      } catch (e: any) {
        setError(e?.message || 'Erro ao enviar')
      }
    }, 1500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Teste de eventos Pixel (Meta)</h1>
        <p className="text-sm text-gray-600 mb-4">
          Esta página dispara uma vez, ao carregar, os eventos <strong>Purchase</strong> (Comprar) para aula paga R$ 37 e para anuidade R$ 1.164, para ativar o evento na Meta.
        </p>
        {sent && (
          <p className="text-green-700 font-medium">
            Eventos enviados. Verifique no Gerenciador de Eventos da Meta (pode levar alguns minutos para aparecer).
          </p>
        )}
        {error && <p className="text-red-600">{error}</p>}
        {!sent && !error && (
          <p className="text-gray-500">Aguardando Pixel e enviando em 1,5 s...</p>
        )}
      </div>
    </div>
  )
}

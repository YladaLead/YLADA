'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isIOSNativeApp } from '@/lib/native-app'

/**
 * Botão "Voltar" fixo no canto superior, exibido SOMENTE dentro do app iOS
 * nativo (Capacitor). As páginas de fluxo público (/l/[slug], /[perfil]/[fluxo])
 * não têm a barra do app nem o "voltar" do navegador, então o profissional que
 * abre o próprio diagnóstico pra testar ficava preso. O lead na web NÃO vê este
 * botão (só aparece no app).
 *
 * Volta no histórico (retorna pro app de onde veio); se não houver histórico,
 * vai pra home do app (/pt).
 */
export default function NativeAppBackButton() {
  const router = useRouter()
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(isIOSNativeApp())
  }, [])

  if (!show) return null

  const voltar = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push('/pt')
    }
  }

  return (
    <button
      type="button"
      onClick={voltar}
      aria-label="Voltar"
      style={{ top: 'calc(env(safe-area-inset-top) + 0.5rem)' }}
      className="fixed left-3 z-[9998] inline-flex items-center gap-1 rounded-full border border-sky-200 bg-white/95 px-3 py-2 text-sm font-medium text-sky-700 shadow-md backdrop-blur transition-colors hover:bg-sky-50"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Voltar
    </button>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Substituí as UIs antigas (Z-API, workshop Nutri, automação em lote, etc.).
 * Mantém bookmarks e links internos sem página quebrada.
 */
export default function LegacyWhatsappWorkshopDisabled() {
  const pathname = usePathname() || ''

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
        <p className="text-sm font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 rounded-lg px-3 py-1.5 inline-block mb-4">
          Descontinuado
        </p>
        <h1 className="text-xl font-bold text-gray-900 mb-3">WhatsApp legado (workshop / Nutri)</h1>
        <p className="text-sm text-gray-600 leading-relaxed mb-2">
          Esta área não é mais usada. A operação atual da Carol está na{' '}
          <strong>API oficial do WhatsApp (Meta)</strong>: chat interno para consultas e lista de conversas.
        </p>
        {pathname ? (
          <p className="text-xs text-gray-500 mb-6 font-mono break-all">
            Caminho: {pathname}
          </p>
        ) : (
          <div className="mb-6" />
        )}
        <div className="flex flex-col gap-2.5">
          <Link
            href="/admin/whatsapp/carol/chat"
            className="inline-flex justify-center items-center rounded-xl bg-emerald-600 text-white text-sm font-semibold px-4 py-3 hover:bg-emerald-700 transition-colors"
          >
            Carol — chat (Meta)
          </Link>
          <Link
            href="/admin/whatsapp/carol/conversas"
            className="inline-flex justify-center items-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 text-sm font-semibold px-4 py-3 hover:bg-emerald-100 transition-colors"
          >
            Carol — lista de conversas (Meta)
          </Link>
          <Link
            href="/admin"
            className="inline-flex justify-center items-center rounded-xl border border-gray-200 bg-white text-gray-800 text-sm font-medium px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            ← Início do admin
          </Link>
        </div>
      </div>
    </div>
  )
}

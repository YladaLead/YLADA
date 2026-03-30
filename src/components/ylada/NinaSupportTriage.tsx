'use client'

import type { NinaSupportQuickChip } from '@/config/ylada-nina-support-ux'

export interface NinaSupportTriageProps {
  chips: NinaSupportQuickChip[]
  onChipClick: (message: string) => void
  onWhatsAppClick?: () => void | Promise<void>
  chipsDisabled?: boolean
  whatsappLoading?: boolean
}

export default function NinaSupportTriage({
  chips,
  onChipClick,
  onWhatsAppClick,
  chipsDisabled = false,
  whatsappLoading = false,
}: NinaSupportTriageProps) {
  const topicChips = chips.filter((c) => c.action !== 'whatsapp')
  const whatsappChip = chips.find((c) => c.action === 'whatsapp')

  return (
    <section
      className="rounded-2xl border border-violet-100 bg-gradient-to-b from-violet-50/80 via-white to-white p-4 sm:p-5 shadow-sm shadow-violet-900/5"
      aria-label="Atalhos de suporte"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Perguntas rápidas</h2>
          <p className="text-xs text-gray-500 mt-0.5">Toque num tópico para enviar à Nina ou fale direto com a equipe.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {topicChips.map((c) => (
          <button
            key={c.label}
            type="button"
            disabled={chipsDisabled}
            onClick={() => onChipClick(c.message)}
            className="rounded-full border border-gray-200/90 bg-white px-3.5 py-2 text-xs sm:text-sm text-gray-800 hover:border-violet-300 hover:bg-violet-50/80 transition-colors disabled:opacity-50 disabled:pointer-events-none shadow-sm"
          >
            {c.label}
          </button>
        ))}
      </div>

      {whatsappChip && onWhatsAppClick ? (
        <div className="pt-1 border-t border-violet-100/90">
          <button
            type="button"
            disabled={chipsDisabled || whatsappLoading}
            onClick={() => void onWhatsAppClick()}
            className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-emerald-900/20 transition-all hover:bg-[#20BD5A] hover:shadow-lg active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none touch-manipulation"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20" aria-hidden>
              {whatsappLoading ? (
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-90"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              )}
            </span>
            <span className="text-left leading-tight">
              {whatsappLoading ? 'Abrindo…' : whatsappChip.label}
            </span>
          </button>
          <p className="mt-2 text-center text-[11px] text-gray-500">
            A equipe é avisada automaticamente. Você será redirecionado para o WhatsApp.
          </p>
        </div>
      ) : null}
    </section>
  )
}

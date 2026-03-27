'use client'

import Link from 'next/link'
import type { NinaSupportQuickChip } from '@/config/ylada-nina-support-ux'

export interface NinaSupportTriageProps {
  noelHref: string
  whatsappUrl: string
  chips: NinaSupportQuickChip[]
  onChipClick: (message: string) => void
  chipsDisabled?: boolean
}

export default function NinaSupportTriage({
  noelHref,
  whatsappUrl,
  chips,
  onChipClick,
  chipsDisabled = false,
}: NinaSupportTriageProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-violet-100 bg-gradient-to-b from-violet-50/90 to-white p-4 sm:p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">
          Antes de escrever: quem ajuda em quê
        </h2>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="shrink-0 font-semibold text-violet-800 w-14">Nina</span>
            <span>
              Uso do app: menus, telas, links, leads, configurações e onde achar cada função.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0 font-semibold text-violet-800 w-14">Noel</span>
            <span>
              Estratégia e conteúdo: textos, posts, como falar com leads, organizar o negócio no
              dia a dia. Abra o Noel direto no app.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0 font-semibold text-violet-800 w-14">WhatsApp</span>
            <span>
              Cobrança, situação individual da conta, bugs graves ou quando quiser falar com a
              equipe humana. A mensagem já leva seus dados para agilizar.
            </span>
          </li>
        </ul>

        <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:items-stretch">
          <Link
            href={noelHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-violet-300 bg-white px-4 py-3 text-sm font-semibold text-violet-900 hover:bg-violet-50 transition-colors text-center"
          >
            Abrir o Noel (mentor)
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Falar com a equipe no WhatsApp
          </a>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Perguntas rápidas
        </p>
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c.label}
              type="button"
              disabled={chipsDisabled}
              onClick={() => onChipClick(c.message)}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs sm:text-sm text-gray-800 hover:border-violet-300 hover:bg-violet-50/80 transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

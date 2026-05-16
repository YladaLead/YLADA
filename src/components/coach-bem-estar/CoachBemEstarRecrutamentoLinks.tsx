'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useWellnessProfile } from '@/hooks/useWellnessProfile'
import { getCoachBemEstarRecruitmentFluxos } from '@/lib/coach-bem-estar/coach-bem-estar-fluxos'
import { buildCoachBemEstarToolUrl } from '@/lib/url-utils'
import FluxoDiagnosticoCoach from '@/components/wellness-system/FluxoDiagnosticoCoach'
import type { FluxoCliente } from '@/types/wellness-system'

/**
 * Lista os 15 fluxos de recrutamento do Coach de bem-estar com botões de copiar link e preview.
 * Exibida na aba EXTRA → /pt/coach-bem-estar/recrutamento.
 */
export default function CoachBemEstarRecrutamentoLinks() {
  const { profile, loading } = useWellnessProfile()
  const [copiado, setCopiado] = useState<string | null>(null)
  const [preview, setPreview] = useState<FluxoCliente | null>(null)

  const fluxos = getCoachBemEstarRecruitmentFluxos()

  const gerarSlug = (nome: string) =>
    nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

  const copiarLink = async (link: string, id: string) => {
    if (!link) return
    try {
      await navigator.clipboard.writeText(link)
      setCopiado(id)
      setTimeout(() => setCopiado(null), 2000)
    } catch {
      // fallback silencioso
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    )
  }

  return (
    <>
      <div className="mt-6">
        {/* Banner de configuração quando sem user_slug */}
        {!profile?.userSlug && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-center gap-3">
            <span className="text-xl">🔗</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-amber-900">
                Configure seu link personalizado para ativar os botões de copiar
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Vá em Configurações para definir seu link único.
              </p>
            </div>
            <Link
              href="/pt/coach-bem-estar/configuracao"
              className="shrink-0 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 transition-colors"
            >
              Configurar →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {fluxos.map((f) => {
            const slug = gerarSlug(f.nome)
            const link = profile?.userSlug
              ? buildCoachBemEstarToolUrl(profile.userSlug, slug)
              : ''
            const id = `recrut-${f.id}`

            return (
              <article
                key={id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug">{f.nome}</h3>
                    {f.objetivo ? (
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2">{f.objetivo}</p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-col gap-1.5 sm:items-end">
                    {/* Botão principal: Copiar link */}
                    <button
                      type="button"
                      disabled={!link}
                      onClick={() => copiarLink(link, id)}
                      className={`touch-manipulation rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                        copiado === id ? 'bg-sky-700' : 'bg-sky-600 hover:bg-sky-700'
                      }`}
                    >
                      {copiado === id ? 'Copiado ✓' : 'Copiar link'}
                    </button>
                    {/* Links secundários */}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setPreview(f)}
                        className="text-[11px] font-medium text-sky-700 underline-offset-2 hover:underline"
                      >
                        Ver preview
                      </button>
                      {link ? (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-medium text-sky-700 underline-offset-2 hover:underline"
                        >
                          Abrir →
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {/* Modal de preview do fluxo */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-8">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            {/* Header do modal */}
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-gray-200 bg-white px-5 py-3">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">Preview</p>
                <h2 className="text-sm font-semibold text-gray-900">{preview.nome}</h2>
              </div>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                aria-label="Fechar preview"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {/* Conteúdo do fluxo */}
            <div className="p-4">
              <FluxoDiagnosticoCoach
                fluxo={preview}
                whatsappNumber={profile?.whatsapp || ''}
                countryCode="BR"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

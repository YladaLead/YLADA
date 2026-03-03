'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useWellnessProfile } from '@/hooks/useWellnessProfile'
import { buildWellnessToolUrl } from '@/lib/url-utils'
import QRCode from '@/components/QRCode'
import { getTemplateBenefits } from '@/lib/template-benefits'
import { getOGImageUrl } from '@/lib/og-image-map'

interface ItemQuadro {
  id: string
  nome: string
  link: string
  templateSlug?: string
  isFluxo?: boolean
  beneficios?: string[]
}

function gerarSlugFluxo(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// 12 opções fixas na ordem: calculadoras, depois quizzes/avaliações, depois fluxos
const QUADRO_OPCOES_FIXAS: { id: string; nome: string; templateSlug: string; isFluxo?: boolean }[] = [
  { id: 'calc-imc', nome: 'Calculadora de IMC', templateSlug: 'calc-imc' },
  { id: 'calc-proteina', nome: 'Calculadora de Proteína', templateSlug: 'calc-proteina' },
  { id: 'calc-hidratacao', nome: 'Calculadora de Água', templateSlug: 'calc-hidratacao' },
  { id: 'calc-calorias', nome: 'Calculadora de Calorias', templateSlug: 'calc-calorias' },
  { id: 'diagnostico-eletrolitos', nome: 'Diagnóstico de Eletrólitos', templateSlug: 'diagnostico-eletrolitos' },
  { id: 'quiz-perfil-nutricional', nome: 'Quiz Perfil Nutricional', templateSlug: 'quiz-perfil-nutricional' },
  { id: 'tipo-fome', nome: 'Avaliação de Fome Emocional', templateSlug: 'tipo-fome' },
  { id: 'avaliacao-emagrecimento-consciente', nome: 'Avaliação de Emagrecimento Consciente', templateSlug: 'avaliacao-emagrecimento-consciente' },
  { id: 'retencao-liquidos', nome: 'Retenção de Líquidos', templateSlug: 'retencao-liquidos' },
  { id: 'avaliacao-sono-energia', nome: 'Sono e Energia', templateSlug: 'avaliacao-sono-energia' },
  { id: 'perfil-intestino', nome: 'Perfil de Intestino', templateSlug: 'perfil-intestino' },
  { id: 'energia-tarde', nome: 'Energia da Tarde', templateSlug: 'energia-tarde', isFluxo: true },
]

type PorPagina = 1 | 2 | 4 | 5

// Imagem à esquerda e QR à direita no mesmo tamanho (quadrado), bem alinhados ao texto no meio
const TAMANHO_LADO_PX_4 = 56
const TAMANHO_LADO_PX_5 = 48
const ESTILOS_POR_PAGINA: Record<PorPagina, { card: string; img: string; qr: number; titulo: string; texto: string; lista: string }> = {
  1: {
    card: 'p-3 gap-3',
    img: 'w-20 h-20 print:w-20 print:h-20',
    qr: 80,
    titulo: 'text-sm print:text-sm',
    texto: 'text-[10px] print:text-[10px]',
    lista: 'text-[10px] print:text-[10px]',
  },
  2: {
    card: 'p-2 gap-2 print:p-2 print:gap-2',
    img: 'w-14 h-14 print:w-14 print:h-14',
    qr: 64,
    titulo: 'text-xs print:text-xs',
    texto: 'text-[9px] print:text-[9px]',
    lista: 'text-[9px] print:text-[9px]',
  },
  4: {
    card: 'px-2 py-1.5 gap-2 print:px-2 print:py-1.5 print:gap-2',
    img: 'min-w-[56px] min-h-[56px]',
    qr: TAMANHO_LADO_PX_4,
    titulo: 'text-[9px] print:text-[9px]',
    texto: 'text-[7px] print:text-[7px]',
    lista: 'text-[7px] print:text-[7px]',
  },
  5: {
    card: 'px-1.5 py-1 gap-1.5 print:px-1.5 print:py-1 print:gap-1.5',
    img: 'min-w-[48px] min-h-[48px]',
    qr: TAMANHO_LADO_PX_5,
    titulo: 'text-[8px] print:text-[8px]',
    texto: 'text-[6px] print:text-[6px]',
    lista: 'text-[6px] print:text-[6px]',
  },
}

function QuadroConteudo({
  selecionados,
  porPagina,
  className = '',
}: {
  selecionados: ItemQuadro[]
  porPagina: PorPagina
  className?: string
}) {
  const s = ESTILOS_POR_PAGINA[porPagina]
  const headerCompact = porPagina === 2 || porPagina === 4 || porPagina === 5
  const compacto = porPagina === 4 || porPagina === 5
  const tamanhoLadoPx = porPagina === 5 ? TAMANHO_LADO_PX_5 : porPagina === 4 ? TAMANHO_LADO_PX_4 : undefined
  return (
    <div className={`bg-white rounded-2xl overflow-hidden flex flex-col min-h-0 ${className}`} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div className={`flex-shrink-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 px-4 text-center ${headerCompact ? 'py-2' : 'py-3 print:py-3'} border-b-4 border-emerald-700/30`}>
        <h2 className={`font-bold text-white uppercase ${headerCompact ? 'text-sm leading-tight' : 'text-lg print:text-xl leading-tight'} tracking-tight`}>
          Cuide da sua saúde<br />em 2 minutos
        </h2>
        <p className={`text-emerald-50 mt-0.5 ${headerCompact ? 'text-[9px]' : 'text-xs print:text-sm'}`}>
          Análise gratuita, personalizada e imediata
        </p>
        <p className={`text-emerald-100/90 mt-0.5 ${headerCompact ? 'text-[7px] leading-tight' : 'text-[8px] print:text-[9px] leading-tight'}`}>
          Ferramenta informativa e preventiva. Não substitui avaliação médica.
        </p>
      </div>
      <div className={`flex-1 min-h-0 flex flex-col justify-start p-3 overflow-hidden ${compacto && selecionados.length > 0 ? 'gap-1 print:gap-1' : 'space-y-2'}`}>
        {selecionados.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-xs">
            <p>Escolha as ferramentas e clique em Salvar como PDF.</p>
          </div>
        ) : (
          selecionados.map((item) => {
            const imagemOg = getOGImageUrl(item.templateSlug, 'wellness')
            return (
              <div
                key={item.id}
                className={`border border-gray-200 rounded-lg flex flex-row items-center gap-2 print:break-inside-avoid flex-shrink-0 ${compacto ? 'min-h-[3rem]' : ''} ${s.card}`}
              >
                <div
                  className={`flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden border border-gray-100 ${compacto ? s.img : ''}`}
                  style={tamanhoLadoPx != null ? { width: tamanhoLadoPx, height: tamanhoLadoPx } : undefined}
                >
                  <img
                    src={imagemOg}
                    alt={item.nome}
                    className={`rounded-lg object-cover object-center border-0 ${compacto ? 'w-full h-full' : s.img}`}
                    style={!compacto ? undefined : { width: '100%', height: '100%' }}
                    onError={(e) => {
                      const target = e.currentTarget
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = '1'
                        target.src = getOGImageUrl('default', 'wellness')
                      }
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5 min-h-0">
                  <h3 className={`font-semibold text-gray-900 leading-tight ${s.titulo}`}>{item.nome}</h3>
                  <ul className={`list-disc list-inside text-gray-700 leading-tight mt-0.5 space-y-0 ${s.lista}`}>
                    {[
                      ...(item.beneficios || []).slice(0, compacto ? 2 : 3),
                      'Acesso rápido pelo QR code',
                    ].map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
                <div
                  className="flex-shrink-0 flex items-center justify-center"
                  style={tamanhoLadoPx != null ? { width: tamanhoLadoPx, height: tamanhoLadoPx } : undefined}
                >
                  <QRCode url={item.link} size={s.qr} useDataUrl className={porPagina === 1 ? 'print:w-[88px] print:h-[88px]' : ''} />
                </div>
              </div>
            )
          })
        )}
        {selecionados.length > 0 && (
          <div className={`flex-shrink-0 mt-2 pt-2 border-t border-gray-100 flex items-center justify-center bg-white ${headerCompact ? 'py-1' : 'py-2'}`}>
            <img src="/images/logo/wellness-horizontal.png" alt="WELLNESS by Ylada" className={`object-contain object-center ${headerCompact ? 'h-4 print:h-4' : 'h-6 print:h-6'}`} />
          </div>
        )}
      </div>
    </div>
  )
}

function QuadroImpressaoContent() {
  const { profile, loading: loadingProfile } = useWellnessProfile()
  const [ferramentas, setFerramentas] = useState<any[]>([])
  const [loadingFerramentas, setLoadingFerramentas] = useState(true)
  const [selecionados, setSelecionados] = useState<ItemQuadro[]>([])
  const [exportando, setExportando] = useState(false)
  const previewPdfRef = useRef<HTMLDivElement>(null)
  const porPagina: PorPagina = 5

  useEffect(() => {
    if (!profile?.userSlug) return
    const carregar = async () => {
      try {
        const res = await fetch('/api/wellness/ferramentas?profession=wellness', { credentials: 'include' })
        if (!res.ok) return
        const data = await res.json()
        setFerramentas(data.tools || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingFerramentas(false)
      }
    }
    carregar()
  }, [profile?.userSlug])

  // Título curto na aba/impressão: evita "Fale com 10..." nos cabeçalhos do navegador ao imprimir
  useEffect(() => {
    const prev = document.title
    document.title = 'Quadro parceria'
    return () => { document.title = prev }
  }, [])

  // Mapa template_slug -> slug da ferramenta do usuário (se criou com slug customizado)
  const slugPorTemplate = useMemo(() => {
    const mapa: Record<string, string> = {}
    ferramentas.forEach((t: any) => {
      const ts = t.template_slug || t.slug
      if (ts && t.slug) mapa[ts] = t.slug
    })
    return mapa
  }, [ferramentas])

  const itensDisponiveis: ItemQuadro[] = useMemo(() => {
    if (!profile?.userSlug) return []

    return QUADRO_OPCOES_FIXAS.map((op) => {
      const slugParaUrl = slugPorTemplate[op.templateSlug] ?? (op.isFluxo ? gerarSlugFluxo(op.nome) : op.templateSlug)
      const link = buildWellnessToolUrl(profile.userSlug, slugParaUrl)

      let beneficios: string[]
      if (op.isFluxo) {
        const beneficiosFluxo: Record<string, string[]> = {
          'energia-tarde': [
            'É possível estabilizar sua energia com algo simples, prático e diário',
            'Evite o "apagão das 15h"',
            'Descubra em 2 minutos.',
            'Orientação personalizada gratuita.',
          ],
        }
        beneficios = beneficiosFluxo[op.templateSlug] ?? [
          'Descubra em 2 minutos.',
          'Orientação personalizada gratuita.',
        ]
      } else {
        const b = getTemplateBenefits(op.templateSlug)
        beneficios = [...(b.discover || []), ...(b.whyUse || [])].slice(0, 4)
        if (beneficios.length === 0) beneficios = ['Diagnóstico personalizado em 2 minutos.', 'Orientação gratuita.']
      }

      return {
        id: op.id,
        nome: op.nome,
        link,
        templateSlug: op.templateSlug,
        isFluxo: op.isFluxo,
        beneficios,
      }
    })
  }, [profile?.userSlug, slugPorTemplate])

  const MAX_FERRAMENTAS = 12

  const adicionar = (item: ItemQuadro) => {
    if (selecionados.length >= MAX_FERRAMENTAS) return
    if (selecionados.some((s) => s.id === item.id)) return
    setSelecionados((prev) => [...prev, item])
  }

  const remover = (id: string) => {
    setSelecionados((prev) => prev.filter((s) => s.id !== id))
  }

  const salvarPdf = async () => {
    if (!previewPdfRef.current || selecionados.length === 0) return
    setExportando(true)
    try {
      const html2pdf = (await import('html2pdf.js')).default
      // Usar o MESMO bloco do preview (visível na tela) para o PDF ficar idêntico
      await new Promise((r) => setTimeout(r, 300))
      await html2pdf()
        .set({
          margin: 10,
          filename: 'quadro-parceria.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            ignoreElements: (el: Element) => (el.classList?.contains('preview-only-label') ?? false),
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy'] },
        })
        .from(previewPdfRef.current)
        .save()
    } catch (e) {
      console.error(e)
    } finally {
      setExportando(false)
    }
  }

  if (loadingProfile || loadingFerramentas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50">
        <WellnessNavBar showTitle title="Quadro parceria" />
        <main className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-600 border-t-transparent" />
        </main>
      </div>
    )
  }

  if (!profile?.userSlug) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50">
        <WellnessNavBar showTitle title="Quadro parceria" />
        <main className="container mx-auto px-4 py-12 max-w-lg mx-auto text-center">
          <p className="text-gray-600 mb-4">
            Configure seu perfil em <strong>Configurações</strong> para gerar seus links e montar o quadro.
          </p>
          <a
            href="/pt/wellness/configuracao"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Ir para Configurações
          </a>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 print:bg-white">
      <div className="print:hidden">
        <WellnessNavBar showTitle title="Quadro parceria" />
      </div>

      <main className="container mx-auto px-4 sm:px-6 py-8 print:py-0 print:px-0 max-w-6xl">
        <div className="print:hidden flex flex-col lg:flex-row gap-8">
          {/* Coluna esquerda: instruções + opções + grid */}
          <div className="lg:max-w-md flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                <h1 className="text-xl font-bold text-white">Quadro parceria</h1>
                <p className="text-emerald-100 text-sm mt-1">
                  Escolha as ferramentas. O quadro será montado com QR e benefícios para salvar em PDF.
                </p>
              </div>
              <div className="p-5">
                <p className="text-gray-600 text-sm mb-3">Clique em uma ferramenta para adicionar ao quadro.</p>
                {selecionados.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selecionados.map((s) => (
                      <span
                        key={s.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-sm"
                      >
                        {s.nome}
                        <button type="button" onClick={() => remover(s.id)} className="ml-1 text-emerald-600 hover:text-emerald-800" aria-label="Remover">×</button>
                      </span>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={salvarPdf}
                  disabled={selecionados.length === 0 || exportando}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium w-full justify-center"
                >
                  {exportando ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Gerando PDF…
                    </>
                  ) : (
                    <>📄 Salvar como PDF</>
                  )}
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Escolha as ferramentas e depois baixe o PDF.
                </p>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mb-3">Escolha as ferramentas</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {itensDisponiveis.map((item) => {
                const jaSelecionado = selecionados.some((s) => s.id === item.id)
                const bloqueado = selecionados.length >= MAX_FERRAMENTAS && !jaSelecionado
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => adicionar(item)}
                    disabled={bloqueado}
                    className={`text-left p-3 rounded-xl border-2 transition-all ${jaSelecionado ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white hover:border-emerald-300'} ${bloqueado ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className="font-medium text-gray-900 block truncate text-sm">{item.nome}</span>
                    <span className="text-xs text-gray-500 mt-0.5 block">{jaSelecionado ? '✓ No quadro' : bloqueado ? `Máx. ${MAX_FERRAMENTAS}` : 'Adicionar'}</span>
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-gray-500 mt-2">12 ferramentas. Escolha as que quiser; os quadros (folhas) aparecem abaixo conforme você adiciona.</p>
          </div>

          {/* Coluna direita: pré-visualização igual ao que será impresso (página por página) */}
          <div className="flex-1 min-w-0 flex flex-col">
            <p className="text-sm font-semibold text-gray-700 mb-2">Pré-visualização — é assim que vai ficar no PDF</p>
            <div className="bg-gray-200 rounded-xl p-4 border border-gray-300 overflow-auto flex-1 min-h-0" style={{ maxHeight: 'min(70vh, 720px)' }}>
              {selecionados.length === 0 ? (
                <div className="bg-white rounded-lg shadow-inner p-8 text-center text-gray-500 text-sm">
                  <p>Escolha as ferramentas ao lado.</p>
                  <p className="mt-2">Aqui aparecerá cada folha exatamente como sairá no PDF.</p>
                </div>
              ) : (
                (() => {
                  const n = porPagina
                  const chunks: ItemQuadro[][] = []
                  for (let i = 0; i < selecionados.length; i += n) {
                    chunks.push(selecionados.slice(i, i + n))
                  }
                  return (
                    <div ref={previewPdfRef} className="space-y-6">
                      {chunks.map((chunk, idx) => (
                        <div key={idx} className="mb-6 last:mb-0">
                          <p className="preview-only-label text-xs font-medium text-gray-500 mb-1.5">Folha {idx + 1} de {chunks.length}</p>
                          <div
                            className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden mx-auto"
                            style={{ width: '100%', maxWidth: '340px', aspectRatio: '210/297' }}
                          >
                            <QuadroConteudo selecionados={chunk} porPagina={porPagina} className="h-full w-full rounded-none border-0 shadow-none" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })()
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {selecionados.length > 0
                ? `${Math.ceil(selecionados.length / porPagina)} folha(s) no PDF.`
                : 'Selecione as ferramentas para ver a pré-visualização.'}
            </p>
          </div>
        </div>

        {/* Cópia do quadro só para impressão (Ctrl+P) */}
        <div id="quadro-impressao" data-por-pagina={porPagina} className="hidden print:block print:max-w-none w-full">
          {(() => {
            const n = porPagina
            const chunks: ItemQuadro[][] = []
            for (let i = 0; i < selecionados.length; i += n) {
              chunks.push(selecionados.slice(i, i + n))
            }
            if (chunks.length === 0) chunks.push([])
            return chunks.map((chunk, idx) => (
              <div key={idx} className="quadro-pagina-impressao">
                <QuadroConteudo selecionados={chunk} porPagina={porPagina} className="print:rounded-none print:border-gray-300 quadro-pagina-conteudo" />
              </div>
            ))
          })()}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        /* Durante a exportação: no viewport para o html2canvas capturar (atrás da UI) */
        #quadro-impressao.quadro-pdf-export {
          display: block !important;
          visibility: visible !important;
          position: fixed !important;
          left: 0 !important;
          top: 0 !important;
          width: 210mm !important;
          min-height: 297mm !important;
          z-index: -1 !important;
          opacity: 0.02 !important;
          background: white !important;
          pointer-events: none !important;
        }
        #quadro-impressao.quadro-pdf-export .quadro-pagina-impressao {
          page-break-after: always;
        }
        #quadro-impressao.quadro-pdf-export .quadro-pagina-impressao:last-child {
          page-break-after: auto;
        }
        @media print {
          @page { size: A4; margin: 10mm; }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100%;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          body * { visibility: hidden; }
          #quadro-impressao, #quadro-impressao * { visibility: visible; }
          #quadro-impressao {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-sizing: border-box;
          }
          /* Cada página com altura fixa A4 (297mm - 20mm margem) = igual ao preview */
          #quadro-impressao .quadro-pagina-impressao {
            page-break-after: always;
            width: 100%;
            height: 277mm;
            min-height: 277mm;
            max-height: 277mm;
            padding: 0;
            margin: 0;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
          }
          #quadro-impressao .quadro-pagina-impressao:last-child {
            page-break-after: auto;
          }
          #quadro-impressao .quadro-pagina-conteudo {
            width: 100%;
            height: 100%;
            min-height: 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            border: none;
            border-radius: 0;
            box-shadow: none;
          }
        }
      `}} />
    </div>
  )
}

export default function QuadroImpressaoPage() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin>
      <QuadroImpressaoContent />
    </ProtectedRoute>
  )
}

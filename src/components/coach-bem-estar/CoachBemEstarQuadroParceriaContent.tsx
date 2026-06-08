'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import QRCode from '@/components/QRCode'
import { getAppUrl, buildCoachBemEstarToolUrl } from '@/lib/url-utils'
import { normalizeTemplateSlug } from '@/lib/template-slug-map'
import { useWellnessProfile } from '@/hooks/useWellnessProfile'
import {
  getCoachBemEstarSalesFluxos,
} from '@/lib/coach-bem-estar/coach-bem-estar-fluxos'
import { getCoachBemEstarCalculadorasEspelhoProLideres } from '@/config/coach-bem-estar-pro-lideres-calculadoras-catalog'
import { getCoachBemEstarOpenGraphImageUrl } from '@/lib/coach-bem-estar/coach-bem-estar-public-link-og'
import { YLADA_OG_FALLBACK_LOGO_PATH } from '@/lib/ylada-og-fallback-logo'

// ---------------------------------------------------------------------------
// Scripts de abordagem (saúde / bem-estar) — idênticos ao quadro Pro Líderes
// ---------------------------------------------------------------------------
const QUADRO_SCRIPTS: { titulo: string; texto: string }[] = [
  {
    titulo: 'Posicionamento de valor',
    texto: `Tenho compartilhado com algumas pessoas que buscam melhorar saúde, energia e qualidade de vida…

Criei uma ferramenta gratuita de diagnóstico rápido que fica disponível por QR code.
Em 2 minutos a pessoa descobre exatamente o que está travando seus resultados.

Achei que tem muito a ver com o que você busca.`,
  },
  {
    titulo: 'Experiência do cliente',
    texto: `Hoje as pessoas valorizam muito quem entrega algo a mais além do produto em si.

Estamos disponibilizando um diagnóstico gratuito e personalizado de bem-estar por QR code.
É simples, rápido e mostra que você se preocupa com o resultado real de quem está do seu lado.

Não tem custo, não interfere na rotina — só agrega valor.`,
  },
  {
    titulo: 'Diferenciação no mercado',
    texto: `Os profissionais que mais crescem são os que criam diferenciais além do produto.

Esse recurso permite que cada pessoa faça uma avaliação personalizada de saúde antes mesmo de experimentar.

Isso posiciona você como alguém moderno, que usa tecnologia para cuidar das pessoas de verdade.`,
  },
  {
    titulo: 'Conexão com o propósito',
    texto: `(Ótimo para quem busca transformação)

Quem chega até aqui já está em busca de mudança — seja na saúde, na energia ou na vida.

Essa ferramenta de diagnóstico conecta a dor real da pessoa com a solução certa.
É a primeira conversa — feita pelo QR code, antes de você dizer qualquer coisa.`,
  },
  {
    titulo: 'Tom mais institucional',
    texto: `Estamos estruturando uma rede de pessoas que apoiam iniciativas de bem-estar preventivo.

Não é venda direta, não tem custo e não gera responsabilidade para quem compartilha.

É apenas um recurso gratuito que entrega valor imediato para quem escanear.`,
  },
  {
    titulo: 'Valorização da pessoa',
    texto: `Eu não compartilho isso com qualquer pessoa.

Tenho buscado pessoas com perfil diferenciado — que se importam de verdade com resultado, com saúde e com crescimento.

Achei que faz sentido apresentar primeiro para você.`,
  },
  {
    titulo: 'Remove objeção (segurança)',
    texto: `Não envolve compromisso nenhum, não tem custo e não muda nada na rotina.

É apenas uma ferramenta informativa disponível por QR code — a pessoa usa quando quiser.

Se fizer sentido para você, deixo o acesso e você compartilha quando achar o momento certo.`,
  },
]

// ---------------------------------------------------------------------------
// Tipos e helpers
// ---------------------------------------------------------------------------
interface ItemQuadro {
  id: string
  label: string
  slug: string
  publicUrl: string
  description: string | null
}

const A4_WIDTH_PX = 340
const A4_HEIGHT_PX = Math.round(A4_WIDTH_PX * (297 / 210))

// Slug amigável a partir do nome do fluxo (mesmo padrão dos links do Coach)
function gerarSlugFluxo(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// ---------------------------------------------------------------------------
// Textos motivacionais por ferramenta (por palavra-chave no label)
// ---------------------------------------------------------------------------
const MOTIVACIONAL: { palavras: string[]; texto: string }[] = [
  {
    palavras: ['hidratação', 'hidratacao', 'água', 'agua'],
    texto: 'Você sabia que a maioria das pessoas vive desidratada sem perceber? Descubra se seu corpo está recebendo a água que precisa para funcionar bem.',
  },
  {
    palavras: ['proteína', 'proteina'],
    texto: 'Proteína é o segredo da saciedade e da energia. Veja exatamente quanto o seu corpo precisa por dia para ter resultados reais.',
  },
  {
    palavras: ['imc', 'índice de massa'],
    texto: 'Entenda de forma simples onde você está hoje e o que isso significa para a sua saúde e qualidade de vida.',
  },
  {
    palavras: ['caloria', 'calorias'],
    texto: 'Quantas calorias o seu corpo realmente precisa? A resposta é mais personalizada do que você imagina.',
  },
  {
    palavras: ['emagrecimento', 'emagrecer', 'peso'],
    texto: 'Você está no caminho certo para o peso que deseja? Faça uma avaliação rápida e descubra seu próximo passo com clareza.',
  },
  {
    palavras: ['metabólico', 'metabolico', 'metabolismo'],
    texto: 'Seu metabolismo é único. Descubra como ele funciona e o que ele precisa para você ter mais energia e disposição.',
  },
  {
    palavras: ['eletrólito', 'eletrolito'],
    texto: 'Câimbra, cansaço ou dor de cabeça podem ser sinais de desequilíbrio. Descubra em minutos o que seu corpo está pedindo.',
  },
  {
    palavras: ['nutricional', 'nutrição', 'nutricao'],
    texto: 'Cada pessoa tem uma necessidade nutricional diferente. Descubra qual é o seu perfil e o que ele precisa para funcionar melhor.',
  },
  {
    palavras: ['fome emocional', 'fome'],
    texto: 'Você come por fome ou por emoção? Entender isso muda tudo na sua relação com a comida e com o seu corpo.',
  },
  {
    palavras: ['sono', 'energia da tarde', 'energia'],
    texto: 'O seu sono está roubando a sua energia? Descubra o que está acontecendo e como recuperar o seu pique no dia a dia.',
  },
  {
    palavras: ['intestino'],
    texto: 'O intestino é o segundo cérebro. Descubra como o seu está funcionando e o que isso diz sobre a sua saúde geral.',
  },
  {
    palavras: ['retenção', 'retencao', 'inchaço', 'inchaco'],
    texto: 'Inchaço e peso extra podem ser sinal de retenção. Descubra em poucos minutos o que o seu corpo está tentando dizer.',
  },
]

function textoMotivacional(label: string): string {
  const l = label.toLowerCase()
  for (const m of MOTIVACIONAL) {
    if (m.palavras.some((p) => l.includes(p))) return m.texto
  }
  return 'Uma avaliação rápida e gratuita feita para você. Responda algumas perguntas e receba uma orientação personalizada.'
}

// Tamanho lateral da imagem OG e do QR (quadrados iguais para alinhamento)
const CARD_SIDE_PX = 52

// ---------------------------------------------------------------------------
// Card do quadro (um link com QR)
// ---------------------------------------------------------------------------
function QuadroCard({ item, qrSize }: { item: ItemQuadro; qrSize: number }) {
  const url = item.publicUrl
  const motivacional = textoMotivacional(item.label)
  const ogUrl = getCoachBemEstarOpenGraphImageUrl({
    baseUrl: getAppUrl(),
    toolSlug: item.slug,
    templateSlug: item.slug,
  })

  return (
    <div className="border border-slate-200 rounded-lg flex flex-row items-center gap-2 px-2 py-1 flex-shrink-0">
      {/* Imagem OG — mesma que aparece no preview do WhatsApp */}
      <div
        className="flex-shrink-0 rounded-md overflow-hidden bg-slate-50 border border-slate-100"
        style={{ width: CARD_SIDE_PX, height: CARD_SIDE_PX }}
      >
        <img
          src={ogUrl}
          alt={item.label}
          className="w-full h-full object-cover"
          onError={(e) => {
            const t = e.currentTarget
            if (t.dataset.fallback === '1') return
            t.dataset.fallback = '1'
            t.src = YLADA_OG_FALLBACK_LOGO_PATH
          }}
        />
      </div>

      {/* Texto motivacional */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h3 className="font-bold text-slate-900 leading-snug text-[10px] print:text-[10px]">
          {item.label}
        </h3>
        <p className="text-[7.5px] text-slate-600 leading-snug mt-0.5">
          {motivacional}
        </p>
      </div>

      {/* QR Code */}
      <div className="flex-shrink-0" style={{ width: CARD_SIDE_PX, height: CARD_SIDE_PX }}>
        <QRCode
          url={url}
          size={qrSize}
          useDataUrl
          resolutionMultiplier={6}
          className="w-full h-full"
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Defaults do cabeçalho (editáveis)
// ---------------------------------------------------------------------------
export const QUADRO_TITULO_DEFAULT = 'Descubra o que está\ntravando seus resultados'
export const QUADRO_SUBTITULO_DEFAULT = 'Diagnóstico gratuito, personalizado e imediato'
const QUADRO_AVISO = 'Ferramenta informativa. Não substitui orientação profissional de saúde.'

// ---------------------------------------------------------------------------
// Conteúdo de uma "folha" do quadro
// ---------------------------------------------------------------------------
function QuadroFolha({
  itens,
  titulo,
  subtitulo,
  className = '',
}: {
  itens: ItemQuadro[]
  titulo: string
  subtitulo: string
  className?: string
}) {
  const qrSize = 50

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden flex flex-col min-h-0 ${className}`}
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
    >
      {/* Header editável — gradiente azul → violeta */}
      <div className="flex-shrink-0 px-4 py-2 text-center" style={{ background: 'linear-gradient(135deg, #2d6eb8 0%, #1e4f9c 50%, #102454 100%)' }}>
        <h2 className="font-bold text-white uppercase text-sm leading-tight tracking-tight whitespace-pre-line">
          {titulo || QUADRO_TITULO_DEFAULT}
        </h2>
        <p className="text-blue-100 mt-0.5 text-[9px]">
          {subtitulo || QUADRO_SUBTITULO_DEFAULT}
        </p>
      </div>

      {/* Itens */}
      <div className="flex-1 min-h-0 flex flex-col p-2 gap-1 overflow-hidden">
        {itens.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs flex-1">
            <p>Escolha os links e clique em Salvar como PDF.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              {itens.map((item) => (
                <QuadroCard key={item.id} item={item} qrSize={qrSize} />
              ))}
            </div>

            {/* Rodapé fixo: logo + URL + aviso compactos */}
            <div className="flex-shrink-0 mt-auto pt-1 border-t border-slate-100 flex flex-col items-center justify-center py-1 gap-0">
              <img
                src="/images/logo/ylada/novo/ylada-horizontal-claro.png"
                alt="YLADA"
                className="h-5 object-contain"
              />
              <span className="text-[7.5px] text-slate-500 tracking-wide">www.ylada.com</span>
              <span className="text-[6px] text-slate-400 leading-tight text-center px-2">
                {QUADRO_AVISO}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
export function CoachBemEstarQuadroParceriaContent() {
  const { profile, loading: loadingProfile } = useWellnessProfile()
  const userSlug = profile?.userSlug || ''

  const [selecionados, setSelecionados] = useState<ItemQuadro[]>([])
  const [exportando, setExportando] = useState(false)
  const [scriptsAberto, setScriptsAberto] = useState(false)
  const [copiadoId, setCopiadoId] = useState<number | null>(null)
  const [titulo, setTitulo] = useState(QUADRO_TITULO_DEFAULT)
  const [subtitulo, setSubtitulo] = useState(QUADRO_SUBTITULO_DEFAULT)
  const previewRef = useRef<HTMLDivElement>(null)

  // Itens por folha A4
  const POR_PAGINA = 5
  const MAX_ITENS = 10

  // Catálogo de saúde/vendas do Coach de bem-estar (calculadoras + fluxos de vendas).
  // Recrutamento NÃO entra no quadro (mesma regra do Pro Líderes: só "sales/saúde").
  const catalog = useMemo<ItemQuadro[]>(() => {
    if (!userSlug) return []

    const calculadoras = getCoachBemEstarCalculadorasEspelhoProLideres()
    const calcIds = new Set(calculadoras.map((c) => c.id))
    const itens: ItemQuadro[] = []

    for (const f of calculadoras) {
      const slug = normalizeTemplateSlug(f.id) || f.id
      itens.push({
        id: `calc-${f.id}`,
        label: f.nome,
        slug,
        publicUrl: buildCoachBemEstarToolUrl(userSlug, slug),
        description: f.objetivo ?? null,
      })
    }

    for (const f of getCoachBemEstarSalesFluxos()) {
      if (calcIds.has(f.id)) continue
      const slug = gerarSlugFluxo(f.nome)
      itens.push({
        id: `vendas-${f.id}`,
        label: f.nome,
        slug,
        publicUrl: buildCoachBemEstarToolUrl(userSlug, slug),
        description: f.objetivo ?? null,
      })
    }

    // Dedup por slug (evita calculadora e fluxo apontando para a mesma URL)
    const seen = new Set<string>()
    return itens.filter((i) => {
      if (seen.has(i.slug)) return false
      seen.add(i.slug)
      return true
    })
  }, [userSlug])

  // Título da aba durante impressão
  useEffect(() => {
    const prev = document.title
    document.title = 'Quadro parceria'
    return () => { document.title = prev }
  }, [])

  const adicionar = (item: ItemQuadro) => {
    if (selecionados.length >= MAX_ITENS) return
    if (selecionados.some((s) => s.id === item.id)) return
    setSelecionados((prev) => [...prev, item])
  }

  const remover = (id: string) => {
    setSelecionados((prev) => prev.filter((s) => s.id !== id))
  }

  const copiarScript = async (idx: number) => {
    const script = QUADRO_SCRIPTS[idx]
    const texto = `🧠 SCRIPT ${idx + 1} — ${script.titulo.toUpperCase()}\n\n${script.texto}`
    try {
      await navigator.clipboard.writeText(texto)
      setCopiadoId(idx)
      setTimeout(() => setCopiadoId(null), 2000)
    } catch {
      // fallback silencioso
    }
  }

  const salvarPdf = async () => {
    const el = previewRef.current
    if (!el || selecionados.length === 0) return
    el.scrollIntoView({ behavior: 'instant', block: 'center' })
    await new Promise((r) => setTimeout(r, 100))
    setExportando(true)
    try {
      await new Promise((r) => setTimeout(r, 500))
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')
      const paginas = el.querySelectorAll('.quadro-pdf-pagina')
      if (paginas.length === 0) return
      const margin = 5
      const pageW = 210 - 2 * margin
      const pageH = 297 - 2 * margin
      const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
      for (let i = 0; i < paginas.length; i++) {
        const card = paginas[i].querySelector('.bg-white.rounded-lg') as HTMLElement | null
        if (!card) continue
        const canvas = await html2canvas(card, {
          scale: 4,
          useCORS: true,
          allowTaint: true,
          logging: false,
        })
        const data = canvas.toDataURL('image/png')
        const r = canvas.width / canvas.height
        const w = r >= pageW / pageH ? pageW : pageH * r
        const h = r >= pageW / pageH ? pageW / r : pageH
        const x = margin + (pageW - w) / 2
        const y = margin + (pageH - h) / 2
        if (i > 0) doc.addPage()
        doc.addImage(data, 'PNG', x, y, w, h)
      }
      doc.save('quadro-parceria-coach-bem-estar.pdf')
    } catch (e) {
      console.error(e)
    } finally {
      setExportando(false)
    }
  }

  // Dividir selecionados em chunks por folha
  const chunks: ItemQuadro[][] = []
  for (let i = 0; i < selecionados.length; i += POR_PAGINA) {
    chunks.push(selecionados.slice(i, i + POR_PAGINA))
  }

  // Sem user_slug configurado: orientar a configurar o link personalizado
  if (!loadingProfile && !userSlug) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h1 className="text-xl font-bold text-white">🖨️ Quadro parceria</h1>
          </div>
          <div className="p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 text-center">
              <p className="text-yellow-800 mb-4">
                ⚠️ Configure seu <strong>link personalizado</strong> para gerar os QR codes do quadro
                (ex.: ylada.com/pt/coach-bem-estar/seu-nome/calc-imc).
              </p>
              <Link
                href="/pt/coach-bem-estar/configuracao"
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                Ir para Configurações
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 print:bg-white">
      <div className="print:hidden container mx-auto px-4 sm:px-6 py-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Coluna esquerda — controles */}
          <div className="lg:max-w-md flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h1 className="text-xl font-bold text-white">🖨️ Quadro parceria</h1>
                <p className="text-blue-100 text-sm mt-1">
                  Escolha os links do seu catálogo. Gere um PDF imprimível com QR codes para compartilhar.
                </p>
              </div>
              <div className="p-5 space-y-4">
                {/* Campos editáveis do cabeçalho */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Título do quadro
                  </label>
                  <textarea
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    rows={2}
                    maxLength={80}
                    placeholder={QUADRO_TITULO_DEFAULT}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-800"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-[11px] text-slate-400">{titulo.length}/80 caracteres</p>
                    {titulo !== QUADRO_TITULO_DEFAULT && (
                      <button
                        type="button"
                        onClick={() => setTitulo(QUADRO_TITULO_DEFAULT)}
                        className="text-[11px] text-blue-500 hover:text-blue-700"
                      >
                        Restaurar sugestão
                      </button>
                    )}
                  </div>

                  <label className="block text-xs font-semibold text-slate-700 mt-2">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    value={subtitulo}
                    onChange={(e) => setSubtitulo(e.target.value)}
                    maxLength={70}
                    placeholder={QUADRO_SUBTITULO_DEFAULT}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-800"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-[11px] text-slate-400">{subtitulo.length}/70 caracteres</p>
                    {subtitulo !== QUADRO_SUBTITULO_DEFAULT && (
                      <button
                        type="button"
                        onClick={() => setSubtitulo(QUADRO_SUBTITULO_DEFAULT)}
                        className="text-[11px] text-blue-500 hover:text-blue-700"
                      >
                        Restaurar sugestão
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 italic">
                    💡 O rodapé sempre exibe "YLADA · www.ylada.com" — fixo em todas as folhas.
                  </p>
                </div>

                {selecionados.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selecionados.map((s) => (
                      <span
                        key={s.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-800 rounded-lg text-sm"
                      >
                        {s.label}
                        <button
                          type="button"
                          onClick={() => remover(s.id)}
                          className="ml-1 text-blue-500 hover:text-blue-700"
                          aria-label="Remover"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={salvarPdf}
                  disabled={selecionados.length === 0 || exportando}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium w-full justify-center"
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

                <p className="text-xs text-slate-500 mt-2">
                  Escolha os links e depois baixe o PDF.
                </p>
                <p className="text-xs text-blue-600/80 mt-1">
                  💡 O QR code leva direto para o link — sem necessidade de digitar.
                </p>

                <button
                  type="button"
                  onClick={() => setScriptsAberto(true)}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <span aria-hidden>🧠</span>
                  Scripts de abordagem
                </button>
              </div>
            </div>

            {/* Lista de links do catálogo — somente saúde */}
            <h2 className="text-lg font-semibold text-slate-800 mb-1">
              {loadingProfile ? 'Carregando links…' : 'Escolha os links de saúde'}
            </h2>
            {!loadingProfile && catalog.length > 0 && (
              <p className="text-xs text-slate-500 mb-3">
                Apenas ferramentas de saúde e bem-estar. Links de recrutamento não aparecem neste quadro.
              </p>
            )}

            {loadingProfile ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
              </div>
            ) : catalog.length === 0 ? (
              <p className="text-sm text-slate-500">
                Nenhum link encontrado. Veja seus links em{' '}
                <Link href="/pt/coach-bem-estar/links" className="text-blue-600 underline">
                  Links
                </Link>
                .
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {catalog.map((item) => {
                  const jaSelecionado = selecionados.some((s) => s.id === item.id)
                  const bloqueado = selecionados.length >= MAX_ITENS && !jaSelecionado
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => adicionar(item)}
                      disabled={bloqueado}
                      className={`text-left p-3 rounded-xl border-2 transition-all ${
                        jaSelecionado
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 bg-white hover:border-blue-300'
                      } ${bloqueado ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span className="font-medium text-slate-900 block text-sm break-words leading-snug">
                        {item.label}
                      </span>
                      <span className="text-xs text-slate-500 mt-0.5 block">
                        {jaSelecionado ? '✓ No quadro' : bloqueado ? `Máx. ${MAX_ITENS}` : 'Adicionar'}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
            <p className="text-xs text-slate-500 mt-2">Máximo de {MAX_ITENS} links por quadro.</p>
          </div>

          {/* Coluna direita — pré-visualização */}
          <div className="flex-1 min-w-0 flex flex-col">
            <p className="text-sm font-semibold text-slate-700 mb-2">
              Pré-visualização — é assim que vai ficar no PDF
            </p>
            <div
              className="bg-gray-200 rounded-xl p-4 border border-gray-300 overflow-auto flex-1 min-h-0"
              style={{ maxHeight: 'min(70vh, 720px)' }}
            >
              {selecionados.length === 0 ? (
                <div className="bg-white rounded-lg shadow-inner p-8 text-center text-slate-500 text-sm">
                  <p>Escolha os links ao lado.</p>
                  <p className="mt-2">
                    Aqui aparecerá cada folha exatamente como sairá no PDF.
                  </p>
                </div>
              ) : (
                <div ref={previewRef} className="space-y-6">
                  {chunks.map((chunk, idx) => (
                    <div
                      key={idx}
                      className={`mb-6 last:mb-0 quadro-pdf-pagina ${
                        idx < chunks.length - 1 ? 'quadro-pdf-pagina-break' : ''
                      }`}
                    >
                      <p className="text-xs font-medium text-slate-500 mb-1.5">
                        Folha {idx + 1} de {chunks.length}
                      </p>
                      <div
                        className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden mx-auto flex flex-col"
                        style={{ width: A4_WIDTH_PX, height: A4_HEIGHT_PX, minHeight: A4_HEIGHT_PX }}
                      >
                        <QuadroFolha
                          itens={chunk}
                          titulo={titulo}
                          subtitulo={subtitulo}
                          className="h-full w-full rounded-none border-0 shadow-none flex-1 min-h-0"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {selecionados.length > 0
                ? `${chunks.length} folha(s) no PDF.`
                : 'Selecione os links para ver a pré-visualização.'}
            </p>
          </div>
        </div>
      </div>

      {/* Overlay durante geração */}
      {exportando && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl px-8 py-6 shadow-xl flex items-center gap-4">
            <span className="animate-spin inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
            <span className="text-lg font-medium text-gray-800">Gerando PDF…</span>
          </div>
        </div>
      )}

      {/* Modal Scripts */}
      {scriptsAberto && (
        <div
          className="print:hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setScriptsAberto(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-blue-50">
              <h3 className="text-lg font-semibold text-blue-900">🧠 Scripts de abordagem</h3>
              <button
                type="button"
                onClick={() => setScriptsAberto(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-blue-100"
                aria-label="Fechar"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {QUADRO_SCRIPTS.map((script, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-gray-50/80">
                  <p className="text-xs font-semibold text-blue-800 mb-2">
                    SCRIPT {idx + 1} — {script.titulo.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {script.texto}
                  </p>
                  <button
                    type="button"
                    onClick={() => copiarScript(idx)}
                    className="mt-3 inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-white border border-blue-300 text-blue-800 hover:bg-blue-50 transition-colors"
                  >
                    {copiadoId === idx ? '✓ Copiado!' : '📋 Copiar'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Versão de impressão (Ctrl+P) */}
      <div id="quadro-impressao-coach" className="hidden print:block print:max-w-none w-full">
        {(chunks.length === 0 ? [[]] : chunks).map((chunk, idx) => (
          <div key={idx} className="quadro-pagina-impressao">
            <QuadroFolha
              itens={chunk}
              titulo={titulo}
              subtitulo={subtitulo}
              className="print:rounded-none print:border-gray-300 quadro-pagina-conteudo"
            />
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .quadro-pdf-pagina-break { page-break-after: always; }
        .quadro-pdf-pagina:last-child { page-break-after: auto; }
        @media print {
          @page { size: A4; margin: 10mm; }
          html, body { margin: 0 !important; padding: 0 !important; width: 100%; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body * { visibility: hidden; }
          #quadro-impressao-coach, #quadro-impressao-coach * { visibility: visible; }
          #quadro-impressao-coach { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; padding: 0 !important; margin: 0 !important; box-sizing: border-box; }
          #quadro-impressao-coach .quadro-pagina-impressao { page-break-after: always; width: 100%; height: 277mm; min-height: 277mm; max-height: 277mm; padding: 0; margin: 0; box-sizing: border-box; display: flex; flex-direction: column; }
          #quadro-impressao-coach .quadro-pagina-impressao:last-child { page-break-after: auto; }
          #quadro-impressao-coach .quadro-pagina-conteudo { width: 100%; height: 100%; min-height: 0; flex: 1; display: flex; flex-direction: column; border: none; border-radius: 0; box-shadow: none; }
        }
      `}} />
    </div>
  )
}

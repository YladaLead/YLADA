'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry'
import { trackNutriWorkshopLead, trackNutriWorkshopView } from '@/lib/facebook-pixel'

function buildWhatsappUrl(opts: { phone: string; message: string }) {
  const numeroLimpo = (opts.phone || '').replace(/[^0-9]/g, '')
  if (!numeroLimpo) return null
  return `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(opts.message)}`
}

function primeiroNomeCompleto(nome: string) {
  const t = nome.trim().split(/\s+/).filter(Boolean)
  return t[0] || ''
}

const GLAUCIA_PARAGRAFOS_PREVIEW = 2

/** Currículo institucional enviado pela Dra. Gláucia (palestrante convidada). */
const GLAUCIA_PARAGRAFOS: string[] = [
  'Nutricionista — Instituto de Nutrição Josué de Castro — UFRJ.',
  'Mestre em Ciência (Bioquímica da Nutrição) — Instituto de Química, Departamento de Bioquímica — UFRJ.',
  'Especializada em Nutrição Clínica — CENC — Instituto de Nutrição Josué de Castro — UFRJ.',
  'Nutricionista autônomo — consultório, telenutrição e atendimento domiciliar.',
  'Empreendedora (CNPJ) — instrutora de cursos gerenciais; treinamento em desenvolvimento profissional; professora particular independente; editora de revistas; editora de jornal não diário; redatora freelancer.',
  'Professora particular de disciplinas do curso de nutrição e da saúde.',
  'Orientadora para redação de monografias (TCC), artigos científicos e trabalhos acadêmicos na área da saúde.',
  'Autora no projeto pedagógico de abertura do curso de graduação em nutrição da Faculdade Redentor (atual UniRedentor), Itaperuna, RJ — aprovado com conceitos A e B pelo MEC em 2002; coordenadora acadêmica; professora responsável pela disciplina de bioquímica, atividades de pesquisa e extensão (2002–2011).',
  'Professora no Instituto de Nutrição Josué de Castro — UFRJ — disciplinas: dietoterapia I e II; estágio supervisionado em nutrição clínica (1998–1999).',
  'Professora na Faculdade Arthur de Sá Earp Neto (Petrópolis, RJ) — professora responsável pela disciplina de nutrição e dietética I no curso de graduação em nutrição e professora auxiliar em bioquímica no curso de medicina da Faculdade de Medicina de Petrópolis (mesmo grupo institucional) — 1999.',
  'Orientadora de TCC para obtenção do grau de especialista em nutrição clínica do CENC (pós lato sensu) — Instituto de Nutrição Josué de Castro (UFRJ) — 2017–2020.',
  'Coordenadora local do campus Cabo Frio (RJ) do curso de pós-graduação lato sensu do Instituto de Nutrição Josué de Castro (UFRJ) — CENC — 2020–2022.',
  'Revisora de artigos científicos por pares em revista científica internacional — 2025 em diante.',
  'Palestrante — saúde e nutrição.',
  'Competências: nutricionista; editora e redatora; docência; professor presencial e online; orientação de monografias e dissertações; coordenação; planejamento; gerenciamento; pesquisa; palestrante; consultoria e assessoria nutricional.',
]

/**
 * Landing nutri empresária — copy compacta, tom acolhedor YLADA, mesmo POST /api/nutri/workshop/inscricao.
 * Após sucesso: redireciona para WhatsApp (mensagem com nome) para entrar no fluxo de automação.
 * Número do Zap: NEXT_PUBLIC_WORKSHOP_NUTRI_EMPRESARIA_WHATSAPP_NUMBER ou NEXT_PUBLIC_NUTRI_WHATSAPP_NUMBER.
 */
export default function WorkshopNutriEmpresariaPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    crn: '',
    countryCode: 'BR'
  })
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [whatsappRedirectUrl, setWhatsappRedirectUrl] = useState<string | null>(null)
  const [glauciaBioAberto, setGlauciaBioAberto] = useState(false)

  const whatsappNumber =
    process.env.NEXT_PUBLIC_WORKSHOP_NUTRI_EMPRESARIA_WHATSAPP_NUMBER ||
    process.env.NEXT_PUBLIC_NUTRI_WHATSAPP_NUMBER ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    '5519997230912'

  useEffect(() => {
    trackNutriWorkshopView()
  }, [])

  useEffect(() => {
    if (!showSuccess || !whatsappRedirectUrl) return
    const id = window.setTimeout(() => {
      window.location.href = whatsappRedirectUrl
    }, 900)
    return () => window.clearTimeout(id)
  }, [showSuccess, whatsappRedirectUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    if (!formData.nome || !formData.email || !formData.telefone) {
      setError('Por favor, preencha todos os campos obrigatórios')
      setSubmitting(false)
      return
    }

    const pn = primeiroNomeCompleto(formData.nome)
    const waMsg = pn
      ? `Olá! Sou ${pn}. Acabei de me inscrever na aula Nutri Empresária (YLADA) e quero receber o link da aula e as próximas mensagens por aqui, por favor.`
      : `Olá! Acabei de me inscrever na aula Nutri Empresária (YLADA) e quero receber o link da aula e as próximas mensagens por aqui, por favor.`

    try {
      const response = await fetch('/api/nutri/workshop/inscricao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          crn: formData.crn || null,
          source: 'workshop_nutri_empresaria_landing_page'
        }),
      })

      const text = await response.text()
      let data: any = {}

      if (text) {
        try {
          data = JSON.parse(text)
        } catch (parseError) {
          console.error('Erro ao fazer parse da resposta:', parseError)
          throw new Error('Resposta inválida do servidor')
        }
      }

      if (!response.ok) {
        throw new Error(data.error || `Erro ao enviar inscrição (${response.status})`)
      }

      const waUrl = buildWhatsappUrl({ phone: whatsappNumber, message: waMsg })
      setWhatsappRedirectUrl(waUrl)
      setShowSuccess(true)
      setFormData({ nome: '', email: '', telefone: '', crn: '', countryCode: 'BR' })

      trackNutriWorkshopLead()

      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    } catch (error: any) {
      console.error('Erro ao enviar inscrição:', error)

      let errorMessage = 'Erro ao enviar inscrição. Por favor, tente novamente.'
      if (error.message) {
        errorMessage = error.message
      } else if (error instanceof SyntaxError) {
        errorMessage = 'Erro de comunicação com o servidor. Verifique sua conexão e tente novamente.'
      } else if (error instanceof TypeError) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.'
      }

      setError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-600 to-blue-700">
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-14 sm:h-16 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 py-2">
            <Link href="/pt/nutri" className="block">
              <Image
                src="/images/logo/nutri-horizontal.png"
                alt="YLADA Nutri"
                width={180}
                height={54}
                className="h-9 w-auto object-contain"
                priority
                unoptimized={process.env.NODE_ENV === 'development'}
              />
            </Link>
          </div>
        </header>

        <main className="px-4 py-10 sm:py-14">
          <div className="max-w-md mx-auto text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-2">Deu certo, obrigada por confiar</h3>
            <p className="text-white/95 text-sm sm:text-base mb-6 leading-relaxed">
              Em poucos segundos abrimos o WhatsApp pra você dar o &quot;oi&quot; — assim a automação te manda link,
              lembretes e o restante do caminho sem você perder nada.
            </p>
            {whatsappRedirectUrl ? (
              <a
                href={whatsappRedirectUrl}
                className="inline-block w-full bg-green-500 hover:bg-green-600 text-white px-5 py-3.5 rounded-xl font-black text-base shadow-lg"
              >
                Abrir WhatsApp agora
              </a>
            ) : (
              <p className="text-white/80 text-sm">Se não abrir sozinho, atualize a página e fale com o suporte.</p>
            )}
            <p className="text-white/70 text-xs mt-5">E-mail de confirmação pode cair no spam — dá uma olhadinha.</p>
          </div>
        </main>

        <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
          <div className="container mx-auto px-4 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} YLADA · Portal Solutions Tech & Innovation LTDA
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" id="top">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm h-14 sm:h-16 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 py-2">
          <Link href="/pt/nutri" className="block">
            <Image
              src="/images/logo/nutri-horizontal.png"
              alt="YLADA Nutri"
              width={180}
              height={54}
              className="h-9 sm:h-10 w-auto object-contain"
              priority
              unoptimized={process.env.NODE_ENV === 'development'}
            />
          </Link>
        </div>
      </header>

      <main>
        <section className="bg-gradient-to-br from-sky-200 via-blue-200 to-indigo-200 text-slate-800 pt-6 sm:pt-10 pb-10 sm:pb-14">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
              <div className="order-1">
                <p className="text-sky-800/90 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-2">
                  Aula ao vivo · gratuita · YLADA Nutri
                </p>
                <h1 className="text-2xl sm:text-3xl lg:text-[2rem] font-black leading-tight mb-3 text-slate-900">
                  Nutricionista: aula ao vivo sobre agenda, oferta e método YLADA
                </h1>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">
                  Encontro online com a <strong className="text-slate-900">Dra. Gláucia Melo</strong> (nutrição clínica,
                  docência UFRJ) e <strong className="text-slate-900">Andre Faula</strong> (rotina comercial e Método
                  YLADA). Objetivo direto: você sair com clareza do que ajustar em mensagem, preço e captação na semana
                  seguinte, no mesmo espírito do material que você está divulgando.
                </p>
                <ul className="space-y-2 text-sm sm:text-base text-slate-700 mb-4">
                  <li className="flex gap-2">
                    <span className="text-sky-600 font-black">·</span>
                    <span>Quer alinhar excelência clínica com consultório que fecha o mês com mais previsibilidade</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-sky-600 font-black">·</span>
                    <span>Quer convite claro no Instagram e no WhatsApp, sem depender só de fase boa de indicação</span>
                  </li>
                </ul>
                <p className="text-sky-900 text-xs sm:text-sm font-semibold">
                  Inscreva-se: data, horário e link chegam no e-mail e no WhatsApp. Após cadastrar, abra o Zap para
                  entrar na automação com lembretes.
                </p>
              </div>

              <div className="order-2 bg-white rounded-2xl shadow-xl p-5 sm:p-6 border border-sky-200/90 ring-1 ring-sky-100 lg:sticky lg:top-20">
                <h2 className="text-lg sm:text-xl font-black text-gray-900 text-center mb-1">
                  Quero minha vaga
                </h2>
                <p className="text-center text-gray-600 text-xs sm:text-sm mb-4">
                  Preenche aqui — na sequência abrimos o WhatsApp pra você entrar no fluxo com link e lembretes.
                </p>

                {error && (
                  <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Nome completo <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Como você gosta de ser chamada"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      E-mail <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      WhatsApp <span className="text-red-600">*</span>
                    </label>
                    <PhoneInputWithCountry
                      value={formData.telefone}
                      onChange={(phone, countryCode) => {
                        setFormData({ ...formData, telefone: phone, countryCode: countryCode || 'BR' })
                      }}
                      defaultCountryCode="BR"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">CRN (opcional)</label>
                    <input
                      type="text"
                      value={formData.crn}
                      onChange={(e) => setFormData({ ...formData, crn: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="CRN-…"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white py-3.5 rounded-xl font-black text-sm sm:text-base hover:from-sky-700 hover:to-blue-700 transition-all disabled:opacity-50 shadow-md"
                  >
                    {submitting ? 'Salvando…' : 'Inscrever e ir pro WhatsApp'}
                  </button>
                  <p className="text-[11px] text-gray-500 text-center leading-snug">
                    Ao continuar, você entra na fila da aula e no fluxo do Zap com lembretes. Só nutricionistas.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-10 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 max-w-2xl text-center">
            <h2 className="text-base sm:text-lg font-black text-gray-900 mb-3">O que rola na aula (resumindo)</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              Você vê na prática como alinhar <strong>mensagem, preço e captação</strong> com o que você já divulga no
              flyer. Saída da aula: prioridades claras para a próxima semana e apresentação do{' '}
              <strong>Método YLADA</strong> para quem quiser continuar com estrutura e acompanhamento.
            </p>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              <strong className="text-gray-800">Quem conduz:</strong> <strong>Dra. Gláucia Melo</strong> e{' '}
              <strong>Andre Faula</strong>. Currículo e fotos logo abaixo.
            </p>
            <button
              type="button"
              className="mt-6 inline-block bg-sky-600 text-white px-6 py-3 rounded-xl text-sm font-black shadow-md hover:bg-sky-700"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Voltar pro formulário
            </button>
          </div>
        </section>

        <section className="py-10 sm:py-12 bg-gradient-to-b from-sky-50 to-white border-t border-sky-100">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 text-center mb-2">Palestrantes</h2>
            <p className="text-center text-gray-600 text-sm mb-8 max-w-xl mx-auto">
              Quem estará com você na aula ao vivo: nutrição de excelência e método comercial, no mesmo tom de
              conversa.
            </p>

            <div className="space-y-10">
              <article className="bg-white rounded-2xl shadow-lg border border-sky-100 overflow-hidden">
                <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 p-5 sm:p-7">
                  <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-4 border-sky-200 shadow-md bg-sky-50">
                      <Image
                        src="/images/workshop-nutri-empresaria/glaucia-melo.png"
                        alt="Dra. Gláucia Melo — nutricionista e palestrante convidada"
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 640px) 160px, 176px"
                        priority
                      />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-black text-gray-900">Dra. Gláucia Melo</h3>
                    <p className="text-sky-800 text-sm font-semibold mt-1 mb-4">
                      Nutricionista · docência UFRJ · consultório e empreendedorismo na nutri
                    </p>
                    <div className="text-gray-700 text-xs sm:text-sm leading-relaxed space-y-2.5">
                      {(glauciaBioAberto
                        ? GLAUCIA_PARAGRAFOS
                        : GLAUCIA_PARAGRAFOS.slice(0, GLAUCIA_PARAGRAFOS_PREVIEW)
                      ).map((bloco, i) => (
                        <p key={i}>{bloco}</p>
                      ))}
                    </div>
                    {GLAUCIA_PARAGRAFOS.length > GLAUCIA_PARAGRAFOS_PREVIEW && (
                      <button
                        type="button"
                        onClick={() => setGlauciaBioAberto((v) => !v)}
                        className="mt-3 text-sm font-bold text-sky-700 hover:text-sky-900 underline underline-offset-2"
                      >
                        {glauciaBioAberto ? 'Ver menos' : 'Ver mais'}
                      </button>
                    )}
                  </div>
                </div>
              </article>

              <article className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 p-5 sm:p-7">
                  <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-4 border-gray-200 shadow-md bg-gray-100">
                      <Image
                        src="/images/andre-faula.jpg"
                        alt="Andre Faula — método YLADA e rotina comercial"
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 640px) 160px, 176px"
                      />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-black text-gray-900">Andre Faula</h3>
                    <p className="text-sky-800 text-sm font-semibold mt-1 mb-3">YLADA · método e rotina comercial</p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Há mais de <strong>duas décadas</strong> ajudando profissionais de bem-estar a organizarem{' '}
                      <strong>comunicação, rotina e geração de cliente</strong> com passos simples e repetíveis — o
                      mesmo olhar que estrutura o <strong>Método YLADA</strong> para nutricionistas que querem agenda,
                      preço e clareza sem virar refém do improviso.
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed mt-3">
                      Na aula, entra com a parte de <strong>plano prático</strong>, oferta e hábitos comerciais que
                      conversam com o dia a dia de consultório, em diálogo com a experiência clínica e acadêmica da
                      Dra. Gláucia.
                    </p>
                  </div>
                </div>
              </article>
            </div>

            <div className="text-center mt-8">
              <button
                type="button"
                className="inline-block bg-sky-600 text-white px-6 py-3 rounded-xl text-sm font-black shadow-md hover:bg-sky-700"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Quero me inscrever
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center">
          <Link href="/pt/nutri" className="inline-block mb-2">
            <Image
              src="/images/logo/nutri-horizontal.png"
              alt="YLADA Nutri"
              width={120}
              height={36}
              className="h-7 mx-auto opacity-90"
            />
          </Link>
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} YLADA · Portal Solutions Tech & Innovation LTDA · CNPJ 63.447.492/0001-88
          </p>
        </div>
      </footer>
    </div>
  )
}

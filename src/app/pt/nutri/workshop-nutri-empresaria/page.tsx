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

/** WhatsApp da campanha Nutri → Empresária (automação + lembretes). Sobrescrever: NEXT_PUBLIC_WORKSHOP_NUTRI_EMPRESARIA_WHATSAPP_NUMBER */
const WHATSAPP_NUTRI_EMPRESARIA = '5519997230912'

/** Currículo na landing — texto solicitado pela Dra. Gláucia (único bloco). */
const GLAUCIA_CURRICULO_LINHAS =
  'Nutricionista Mestre em Bioquímica da Nutrição (UFRJ) | Especializada em Nutrição Clínica (UFRJ) | Criadora do Método Restart Metabólico | Emagrecimento e Doenças Crônicas | Docente e Palestrante | Revisora Científica'
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean)

/**
 * Landing nutri empresária — copy compacta, tom acolhedor YLADA, mesmo POST /api/nutri/workshop/inscricao.
 * Após sucesso: redireciona para WhatsApp (mensagem com nome) para entrar no fluxo de automação.
 * Número do Zap: padrão 5519997230912 ou NEXT_PUBLIC_WORKSHOP_NUTRI_EMPRESARIA_WHATSAPP_NUMBER.
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
  const [confirmedFirstName, setConfirmedFirstName] = useState<string | null>(null)

  const whatsappNumber =
    process.env.NEXT_PUBLIC_WORKSHOP_NUTRI_EMPRESARIA_WHATSAPP_NUMBER || WHATSAPP_NUTRI_EMPRESARIA

  useEffect(() => {
    trackNutriWorkshopView()
  }, [])

  useEffect(() => {
    if (!showSuccess || !whatsappRedirectUrl) return
    const id = window.setTimeout(() => {
      window.location.href = whatsappRedirectUrl
    }, 1600)
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
      ? `Olá! Sou ${pn}. Acabei de me inscrever na aula Nutri Empresária (YLADA, nutri → empresária) pelo site. Quero iniciar por aqui para receber o link da aula e os lembretes da automação. Obrigada!`
      : `Olá! Acabei de me inscrever na aula Nutri Empresária (YLADA, nutri → empresária) pelo site. Quero iniciar por aqui para receber o link da aula e os lembretes da automação. Obrigada!`

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
      setConfirmedFirstName(pn || null)
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
            <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
              {confirmedFirstName ? `${confirmedFirstName}, inscrição confirmada!` : 'Inscrição confirmada!'}
            </h3>
            <p className="text-white/95 text-sm sm:text-base mb-2 leading-relaxed">
              Seus dados foram salvos. Em instantes abrimos o WhatsApp{' '}
              <strong className="text-white">+55 (19) 99723-0912</strong> para você enviar a mensagem e entrar na
              automação (link da aula + lembretes).
            </p>
            <p className="text-white/85 text-xs mb-6">Se não abrir sozinho, use o botão abaixo.</p>
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
          <div className="container mx-auto px-4 flex justify-center">
            <Link href="/pt" className="block">
              <Image
                src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png"
                alt="YLADA"
                width={120}
                height={32}
                className="h-7 w-auto object-contain opacity-95"
              />
            </Link>
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
                <p className="text-sky-800/90 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-4">
                  Aula ao vivo · gratuita · nutri → empresária
                </p>
                <h1 className="text-2xl sm:text-3xl font-black leading-tight text-slate-900 mb-1">
                  Você é nutricionista…
                </h1>
                <p className="text-xl sm:text-2xl font-black text-slate-800 leading-snug mb-4">
                  mas seu posicionamento ainda não é de empresária?
                </p>
                <p className="text-slate-900 text-sm sm:text-base font-bold mb-1">
                  Aula ao vivo com <strong>Dra. Gláucia Melo</strong> + <strong>Andre Faula</strong>
                </p>
                <p className="text-slate-700 text-sm sm:text-base leading-snug mb-5">
                  Pra quem quer parar de depender de indicação e começar a ter uma agenda previsível com posicionamento
                  e direção.
                </p>

                <div className="rounded-xl border border-amber-500/40 bg-white/85 p-4 sm:p-5 shadow-sm">
                  <p className="text-amber-950 text-xs font-black uppercase tracking-wide mb-3">Responde rápido:</p>
                  <ul className="space-y-2.5 text-sm text-slate-800 font-medium">
                    {[
                      'Sua agenda está cheia… ou instável?',
                      'Seus pacientes fecham fácil… ou pedem desconto?',
                      'Seu Instagram gera clientes… ou só engajamento?',
                      'Você cobra o que vale… ou o que o paciente aceita?',
                      'Você tem previsibilidade… ou depende de fase boa?',
                    ].map((q) => (
                      <li key={q} className="border-b border-slate-200/70 pb-2 last:border-0 last:pb-0">
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div
                id="inscricao"
                className="order-2 bg-white rounded-2xl shadow-xl p-5 sm:p-6 border border-sky-200/90 ring-1 ring-sky-100 lg:sticky lg:top-20"
              >
                <p className="text-center text-[10px] sm:text-xs font-black text-sky-900 uppercase tracking-wider mb-3">
                  Aula gratuita · Online · Vagas limitadas
                </p>
                <h2 className="text-lg sm:text-xl font-black text-gray-900 text-center mb-4">
                  Quero resolver isso na minha agenda
                </h2>

                {error && (
                  <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Nome <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Seu nome"
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
                    {submitting ? 'Salvando…' : 'Quero participar da aula e organizar minha agenda'}
                  </button>
                  <p className="text-[11px] text-gray-600 text-center leading-snug">
                    Você será direcionada para o WhatsApp com acesso à aula + lembretes. Aula exclusiva para
                    nutricionistas que querem crescer com estrutura.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-10 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
            <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-5 sm:p-6">
              <p className="text-slate-900 text-base sm:text-lg font-black mb-3">Essa aula é pra você que:</p>
              <ul className="space-y-2.5 text-sm sm:text-base text-slate-700">
                <li className="flex gap-2">
                  <span className="text-sky-600 font-black shrink-0">→</span>
                  <span>Sente que poderia cobrar mais, mas atrai gente que só pergunta preço</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-sky-600 font-black shrink-0">→</span>
                  <span>Tem dificuldade de manter a agenda cheia com previsibilidade</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-sky-600 font-black shrink-0">→</span>
                  <span>Posta no Instagram, mas não vê retorno real</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-sky-600 font-black shrink-0">→</span>
                  <span>Depende de indicação ou de &quot;fase boa&quot;</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-sky-600 font-black shrink-0">→</span>
                  <span>Sabe muito de nutrição… mas ainda pouco de posicionamento</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-10 bg-slate-100/80 border-t border-slate-200">
          <div className="container mx-auto px-4 sm:px-6 max-w-2xl text-center">
            <p className="text-slate-900 text-base sm:text-lg font-black mb-2">O problema não é sua capacidade técnica.</p>
            <p className="text-slate-900 text-base sm:text-lg font-black mb-2">É como você está sendo percebida.</p>
            <p className="text-slate-800 text-sm sm:text-base font-bold mb-4">E isso define:</p>
            <ul className="text-slate-700 text-sm sm:text-base font-semibold space-y-1.5 text-left max-w-md mx-auto">
              <li>quem você atrai</li>
              <li>quanto você cobra</li>
              <li>se sua agenda cresce ou trava</li>
            </ul>
          </div>
        </section>

        <section className="py-8 sm:py-10 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
            <h2 className="text-base sm:text-lg font-black text-gray-900 mb-4 text-center">
              O que você vai ver na prática
            </h2>
            <ul className="text-gray-700 text-sm sm:text-base leading-relaxed space-y-3 mb-6">
              <li className="flex gap-2">
                <span className="text-sky-600 font-black shrink-0">·</span>
                <span>O erro silencioso que trava a agenda da maioria das nutricionistas</span>
              </li>
              <li className="flex gap-2">
                <span className="text-sky-600 font-black shrink-0">·</span>
                <span>Como alinhar mensagem, preço e posicionamento</span>
              </li>
              <li className="flex gap-2">
                <span className="text-sky-600 font-black shrink-0">·</span>
                <span>O que faz uma nutricionista ser vista como autoridade</span>
              </li>
              <li className="flex gap-2">
                <span className="text-sky-600 font-black shrink-0">·</span>
                <span>O que ajustar já na próxima semana pra destravar crescimento</span>
              </li>
            </ul>
            <p className="text-center">
              <button
                type="button"
                className="text-sm font-bold text-sky-700 underline underline-offset-2 hover:text-sky-900"
                onClick={() => document.getElementById('inscricao')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Ir para inscrição
              </button>
            </p>
          </div>
        </section>

        <section className="py-10 sm:py-12 bg-gradient-to-b from-sky-50 to-white border-t border-sky-100">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 text-center mb-1">Quem conduz</h2>
            <p className="text-center text-gray-500 text-xs sm:text-sm mb-8">
              Explique menos. Venda mais. Decisão rápida.
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
                    <div className="text-gray-800 text-sm sm:text-base leading-relaxed mt-3 space-y-2">
                      {GLAUCIA_CURRICULO_LINHAS.map((linha, i) => (
                        <p key={i} className="font-medium">
                          {linha}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </article>

              <article className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 p-5 sm:p-7">
                  <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-4 border-gray-200 shadow-md bg-gray-100">
                      <Image
                        src="/images/andre-faula.jpg"
                        alt="Andre Faula — CEO da YLADA"
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 640px) 160px, 176px"
                      />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-black text-gray-900">Andre Faula</h3>
                    <p className="text-sky-800 text-sm font-semibold mt-1 mb-3">CEO, YLADA</p>
                    <p className="text-gray-800 text-sm font-semibold leading-relaxed">
                      Ajudo profissionais da saúde a transformarem conhecimento em posicionamento e agenda previsível.
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed mt-2">
                      Criador do <strong>Método YLADA</strong> — baseado em diagnóstico, comunicação e conversão.
                    </p>
                  </div>
                </div>
              </article>
            </div>

            <div className="mt-10 max-w-2xl mx-auto rounded-2xl border border-slate-200 bg-slate-50/80 p-6 sm:p-8">
              <p className="text-slate-900 text-sm sm:text-base font-black mb-3">Se você continuar fazendo do mesmo jeito…</p>
              <ul className="text-slate-700 text-sm space-y-2 mb-6">
                <li className="flex gap-2">
                  <span className="text-red-500 font-bold shrink-0">·</span>
                  <span>Sua agenda continua dependendo de indicação</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500 font-bold shrink-0">·</span>
                  <span>Você continua explicando muito… e convertendo pouco</span>
                </li>
              </ul>
              <p className="text-slate-900 text-sm sm:text-base font-black mb-3">Se você entender isso…</p>
              <ul className="text-slate-700 text-sm space-y-2 mb-6">
                <li className="flex gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">·</span>
                  <span>Você começa a atrair pacientes mais preparados</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">·</span>
                  <span>Você passa a ter controle sobre o crescimento do seu consultório</span>
                </li>
              </ul>
            </div>

            <div className="text-center mt-8">
              <p className="text-[10px] sm:text-xs font-black text-sky-900 uppercase tracking-wider mb-3">
                Aula gratuita · Online · Vagas limitadas
              </p>
              <button
                type="button"
                className="inline-block bg-sky-600 text-white px-6 py-3 rounded-xl text-sm font-black shadow-md hover:bg-sky-700"
                onClick={() => document.getElementById('inscricao')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Quero aprender a me posicionar como empresária
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 flex justify-center">
          <Link href="/pt" className="inline-block">
            <Image
              src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png"
              alt="YLADA"
              width={132}
              height={36}
              className="h-8 w-auto object-contain opacity-95"
            />
          </Link>
        </div>
      </footer>
    </div>
  )
}

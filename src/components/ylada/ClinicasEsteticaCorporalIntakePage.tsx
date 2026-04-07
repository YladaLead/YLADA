'use client'

import Link from 'next/link'
import { useCallback, useMemo, useRef, useState } from 'react'
import { formatBrazilPhoneDisplay } from '@/lib/format-brazil-phone'

type StepId =
  | 'intro'
  | 'clinic'
  | 'structure'
  | 'focus'
  | 'pain'
  | 'lead_prep'
  | 'margin'
  | 'operation'
  | 'interest'
  | 'timeline'
  | 'wish_today'
  | 'contact'
  | 'result'

const FLOW: StepId[] = [
  'intro',
  'clinic',
  'structure',
  'focus',
  'pain',
  'lead_prep',
  'margin',
  'operation',
  'interest',
  'timeline',
  'wish_today',
  'contact',
  'result',
]

function advanceLabel(s: StepId): string {
  switch (s) {
    case 'clinic':
      return 'Continuar'
    case 'wish_today':
      return 'Ir para contato'
    default:
      return 'Continuar'
  }
}

export default function ClinicasEsteticaCorporalIntakePage() {
  const [step, setStep] = useState<StepId>('intro')
  const [clinicName, setClinicName] = useState('')
  const [city, setCity] = useState('')
  const [teamStructure, setTeamStructure] = useState('')
  const [mainFocus, setMainFocus] = useState('')
  const [servicesDetail, setServicesDetail] = useState('')
  const [pain, setPain] = useState('')
  const [leadPrep, setLeadPrep] = useState('')
  const [marginQual, setMarginQual] = useState('')
  const [timeWaste, setTimeWaste] = useState('')
  const [interestAttract, setInterestAttract] = useState('')
  const [timeline, setTimeline] = useState('')
  const [wishToday, setWishToday] = useState('')
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [diagnosis, setDiagnosis] = useState<string[]>([])
  const submittedRef = useRef(false)

  const stepIndex = FLOW.indexOf(step)
  const progressPct =
    step === 'result' ? 100 : step === 'intro' ? 2 : ((FLOW.indexOf(step) - 1) / (FLOW.length - 2)) * 100

  const buildPayload = useCallback(() => {
    return {
      clinic_name: clinicName.trim(),
      city: city.trim(),
      team_structure: teamStructure,
      main_focus: mainFocus,
      services_detail: servicesDetail.trim(),
      pain,
      lead_prep_pricing: leadPrep,
      margin_qualification: marginQual,
      time_waste: timeWaste,
      interest_attract: interestAttract,
      timeline,
      wish_one_thing: wishToday.trim(),
      contact_name: contactName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      notes: notes.trim(),
      consent: 'yes',
    }
  }, [
    clinicName,
    city,
    teamStructure,
    mainFocus,
    servicesDetail,
    pain,
    leadPrep,
    marginQual,
    timeWaste,
    interestAttract,
    timeline,
    wishToday,
    contactName,
    email,
    phone,
    notes,
  ])

  const goNext = useCallback(() => {
    const i = FLOW.indexOf(step)
    if (i >= 0 && i < FLOW.length - 1) setStep(FLOW[i + 1]!)
  }, [step])

  const goBack = useCallback(() => {
    const i = FLOW.indexOf(step)
    if (i > 0) setStep(FLOW[i - 1]!)
  }, [step])

  const submit = useCallback(async () => {
    if (submittedRef.current || saving) return
    setSubmitError(null)
    setSaving(true)
    try {
      const r = await fetch('/api/ylada/clinicas-estetica-corporal-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: buildPayload() }),
      })
      const json = await r.json().catch(() => ({}))
      if (!r.ok || !json.success) {
        let msg =
          typeof json.error === 'string' ? json.error : 'Não foi possível enviar agora.'
        if (!/tente de novo|segundos/i.test(msg)) {
          msg = `${msg} Tente de novo em alguns segundos.`
        }
        setSubmitError(msg)
        return
      }
      submittedRef.current = true
      setDiagnosis(Array.isArray(json.diagnosis) ? json.diagnosis : [])
      setStep('result')
    } catch {
      setSubmitError('Erro de rede. Confira sua conexão e tente de novo em alguns segundos.')
    } finally {
      setSaving(false)
    }
  }, [buildPayload, saving])

  const phoneDigits = phone.replace(/\D/g, '')
  const emailOk = email.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  const canClinic = clinicName.trim().length >= 2
  const canWishToday = wishToday.trim().length >= 8
  const canContact = contactName.trim().length >= 2 && phoneDigits.length >= 10 && emailOk

  const phoneDisplay = useMemo(() => formatBrazilPhoneDisplay(phone), [phone])

  const blockNext = useMemo(() => {
    switch (step) {
      case 'clinic':
        return !canClinic
      case 'wish_today':
        return !canWishToday
      case 'contact':
        return !canContact
      default:
        return false
    }
  }, [step, canClinic, canWishToday, canContact])

  /** Continuar em passos com texto (azul; escolhas avançam ao toque). */
  const btnContinue =
    'flex-1 rounded-xl bg-blue-700 text-white font-semibold py-3 disabled:opacity-40 hover:bg-blue-900 transition-all shadow-md shadow-blue-900/15 hover:shadow-lg'
  const btnGhost =
    'flex-1 rounded-xl border border-gray-300 py-3 font-medium text-gray-700 hover:bg-slate-50 shadow-sm hover:shadow'
  const choice = (active: boolean) =>
    `w-full text-left rounded-xl border-2 px-4 py-3 font-medium transition-all ${
      active
        ? 'border-blue-700 bg-blue-50 text-blue-950 shadow-md shadow-blue-900/10 ring-1 ring-blue-700/20'
        : 'border-gray-200 hover:border-blue-400 text-gray-900 bg-white shadow-sm hover:shadow-md hover:shadow-slate-900/5'
    }`
  const stepSurface = 'rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-[0_8px_30px_rgba(15,23,42,0.07)]'

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white text-gray-900">
      <div className="max-w-lg mx-auto px-4 py-10 pb-16">
        <header className="mb-8">
          <Link href="/pt" className="text-sm text-blue-700 hover:text-blue-900 font-semibold">
            ← Início
          </Link>
          {step !== 'result' && (
            <>
              <div className="h-2 w-full bg-blue-200/90 rounded-full mt-6 overflow-hidden shadow-inner">
                <div
                  className="h-full bg-blue-700 transition-all duration-300 rounded-full shadow-sm"
                  style={{ width: `${Math.min(100, progressPct)}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 font-medium mt-2">O que pode estar travando seus fechamentos</p>
              <p className="text-xs text-gray-500 mt-1 tabular-nums">
                Passo {FLOW.indexOf(step) + 1} de {FLOW.length}
              </p>
            </>
          )}
          {step === 'result' && (
            <div className="mt-6">
              <p className="text-xs text-gray-600 font-medium">Pré-diagnóstico pronto</p>
              <p className="text-xs text-gray-500 mt-1 tabular-nums">
                Passo {FLOW.indexOf(step) + 1} de {FLOW.length}
              </p>
            </div>
          )}
        </header>

        {step === 'intro' && (
          <section className={`space-y-5 ${stepSurface}`}>
            <h1 className="text-2xl font-bold text-gray-900 leading-snug">
              Sua clínica recebe mensagens…
              <span className="block mt-1">mas a maioria não vira cliente?</span>
            </h1>
            <p className="text-gray-800 leading-relaxed text-base">
              E quase sempre começa assim: <span className="font-semibold text-gray-900">“qual o valor?”</span>… e some.
            </p>
            <button
              type="button"
              onClick={goNext}
              className="w-full rounded-xl bg-green-600 text-white font-semibold py-3.5 px-4 hover:bg-green-800 transition-all shadow-[0_8px_24px_rgba(22,163,74,0.35)] hover:shadow-[0_10px_28px_rgba(21,128,61,0.4)]"
            >
              Começar diagnóstico gratuito
            </button>
          </section>
        )}

        {step === 'clinic' && (
          <section className={`space-y-5 ${stepSurface}`}>
            <h2 className="text-xl font-bold text-gray-900">Sobre sua clínica</h2>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Nome da clínica ou marca *</span>
              <input
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none shadow-sm"
                placeholder="Ex.: Estética Corpo em Harmonia"
                autoComplete="organization"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Cidade / estado (opcional)</span>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none shadow-sm"
                placeholder="Opcional"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Principais procedimentos ou diferenciais</span>
              <textarea
                value={servicesDetail}
                onChange={(e) => setServicesDetail(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none shadow-sm"
                placeholder="Opcional"
              />
            </label>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={goBack} className={btnGhost}>
                Voltar
              </button>
              <button type="button" disabled={blockNext} onClick={goNext} className={btnContinue}>
                {advanceLabel(step)}
              </button>
            </div>
          </section>
        )}

        {step === 'structure' && (
          <section className={`space-y-4 ${stepSurface}`}>
            <h2 className="text-xl font-bold text-gray-900 leading-snug">Hoje, quem atende os clientes na sua clínica?</h2>
            {[
              { id: 'so_1', label: 'Só eu' },
              { id: 'pequena_2_4', label: 'Pequena equipe (2 a 4 pessoas)' },
              { id: 'estruturada_5_10', label: 'Equipe estruturada (5 a 10)' },
              { id: 'maior_10', label: 'Estrutura maior (+10)' },
            ].map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setTeamStructure(o.id)
                  goNext()
                }}
                className={choice(teamStructure === o.id)}
              >
                {o.label}
              </button>
            ))}
            <div className="pt-4">
              <button type="button" onClick={goBack} className={`${btnGhost} w-full sm:w-auto`}>
                Voltar
              </button>
            </div>
          </section>
        )}

        {step === 'focus' && (
          <section className={`space-y-4 ${stepSurface}`}>
            <h2 className="text-xl font-bold text-gray-900 leading-snug">Hoje, qual é o principal foco da sua clínica?</h2>
            {[
              { id: 'corporal', label: 'Estética corporal' },
              { id: 'corporal_facial', label: 'Corporal e facial' },
              { id: 'mais_facial', label: 'Mais facial' },
              { id: 'outro', label: 'Outro' },
            ].map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setMainFocus(o.id)
                  goNext()
                }}
                className={choice(mainFocus === o.id)}
              >
                {o.label}
              </button>
            ))}
            <div className="pt-4">
              <button type="button" onClick={goBack} className={`${btnGhost} w-full sm:w-auto`}>
                Voltar
              </button>
            </div>
          </section>
        )}

        {step === 'pain' && (
          <section className={`space-y-4 ${stepSurface}`}>
            <h2 className="text-xl font-bold">O que mais está travando seus resultados hoje?</h2>
            {[
              { id: 'preco_nao_fecha', label: 'Muitas pessoas perguntam preço e não fecham' },
              { id: 'agenda_inconsistente', label: 'Agenda inconsistente (dias cheios e dias vazios)' },
              { id: 'depende_promocao', label: 'Preciso fazer promoções pra atrair clientes' },
              { id: 'whatsapp_sem_fecho', label: 'Perco tempo no WhatsApp com quem não fecha' },
              { id: 'movimento_mais_faturamento', label: 'Tenho movimento, mas poderia faturar mais' },
              { id: 'outro', label: 'Outro' },
            ].map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setPain(o.id)
                  goNext()
                }}
                className={choice(pain === o.id)}
              >
                {o.label}
              </button>
            ))}
            <div className="pt-4">
              <button type="button" onClick={goBack} className={`${btnGhost} w-full sm:w-auto`}>
                Voltar
              </button>
            </div>
          </section>
        )}

        {step === 'lead_prep' && (
          <section className={`space-y-4 ${stepSurface}`}>
            <h2 className="text-xl font-bold text-gray-900 leading-snug">
              Você sente que poderia cobrar mais caro… se a pessoa chegasse mais preparada?
            </h2>
            {[
              { id: 'sim', label: 'Sim' },
              { id: 'talvez', label: 'Talvez' },
              { id: 'nao', label: 'Não' },
            ].map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setLeadPrep(o.id)
                  goNext()
                }}
                className={choice(leadPrep === o.id)}
              >
                {o.label}
              </button>
            ))}
            <div className="pt-4">
              <button type="button" onClick={goBack} className={`${btnGhost} w-full sm:w-auto`}>
                Voltar
              </button>
            </div>
          </section>
        )}

        {step === 'margin' && (
          <section className={`space-y-4 ${stepSurface}`}>
            <h2 className="text-xl font-bold text-gray-900 leading-snug">
              Você sente que poderia ganhar mais… com o mesmo esforço?
            </h2>
            {[
              { id: 'sim', label: 'Sim, com certeza' },
              { id: 'talvez', label: 'Talvez' },
              { id: 'nao', label: 'Não' },
            ].map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setMarginQual(o.id)
                  goNext()
                }}
                className={choice(marginQual === o.id)}
              >
                {o.label}
              </button>
            ))}
            <div className="pt-4">
              <button type="button" onClick={goBack} className={`${btnGhost} w-full sm:w-auto`}>
                Voltar
              </button>
            </div>
          </section>
        )}

        {step === 'operation' && (
          <section className={`space-y-4 ${stepSurface}`}>
            <h2 className="text-xl font-bold text-gray-900 leading-snug">Você perde tempo respondendo gente que não fecha?</h2>
            {[
              { id: 'frequentemente', label: 'Sim, com frequência' },
              { id: 'as_vezes', label: 'Acontece em alguns casos' },
              { id: 'raramente', label: 'Quase nunca' },
            ].map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setTimeWaste(o.id)
                  goNext()
                }}
                className={choice(timeWaste === o.id)}
              >
                {o.label}
              </button>
            ))}
            <div className="pt-4">
              <button type="button" onClick={goBack} className={`${btnGhost} w-full sm:w-auto`}>
                Voltar
              </button>
            </div>
          </section>
        )}

        {step === 'interest' && (
          <section className={`space-y-4 ${stepSurface}`}>
            <h2 className="text-xl font-bold text-gray-900 leading-snug">
              Você teria interesse em entender como atrair clientes mais preparados antes mesmo do contato?
            </h2>
            {[
              { id: 'sim_ver', label: 'Sim, quero ver isso' },
              { id: 'tenho_interesse', label: 'Tenho interesse' },
              { id: 'talvez_depois', label: 'Talvez depois' },
              { id: 'so_analisando', label: 'Só estou analisando' },
            ].map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setInterestAttract(o.id)
                  goNext()
                }}
                className={choice(interestAttract === o.id)}
              >
                {o.label}
              </button>
            ))}
            <div className="pt-4">
              <button type="button" onClick={goBack} className={`${btnGhost} w-full sm:w-auto`}>
                Voltar
              </button>
            </div>
          </section>
        )}

        {step === 'timeline' && (
          <section className={`space-y-4 ${stepSurface}`}>
            <h2 className="text-xl font-bold text-gray-900 leading-snug">
              Se fizer sentido, quando você gostaria de ajustar isso na sua clínica?
            </h2>
            {[
              { id: 'ja', label: 'O quanto antes' },
              { id: '30d', label: 'Nos próximos 30 dias' },
              { id: '90d', label: 'Até 90 dias' },
              { id: 'sem_pressa', label: 'Sem pressa' },
            ].map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setTimeline(o.id)
                  goNext()
                }}
                className={choice(timeline === o.id)}
              >
                {o.label}
              </button>
            ))}
            <div className="pt-4">
              <button type="button" onClick={goBack} className={`${btnGhost} w-full sm:w-auto`}>
                Voltar
              </button>
            </div>
          </section>
        )}

        {step === 'wish_today' && (
          <section className={`space-y-4 ${stepSurface}`}>
            <h2 className="text-xl font-bold text-gray-900 leading-snug">
              Se você pudesse resolver uma coisa hoje na sua clínica… o que seria?
            </h2>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Sua resposta *</span>
              <textarea
                value={wishToday}
                onChange={(e) => setWishToday(e.target.value)}
                rows={5}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none shadow-sm"
                placeholder="Ex.: parar de perder tempo com gente que só quer preço / encher a agenda de segunda / ter alguém da equipe alinhada no WhatsApp…"
              />
            </label>
            <p className="text-xs text-gray-500">Mínimo de 8 caracteres.</p>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={goBack} className={btnGhost}>
                Voltar
              </button>
              <button type="button" disabled={blockNext} onClick={goNext} className={btnContinue}>
                {advanceLabel(step)}
              </button>
            </div>
          </section>
        )}

        {step === 'contact' && (
          <section className={`space-y-4 ${stepSurface}`}>
            <h2 className="text-xl font-bold text-gray-900 leading-snug">
              Seu contato — para retorno no WhatsApp
            </h2>
            <p className="text-sm text-gray-600">
              Próximo passo: combinamos por mensagem no número abaixo (confirmação, dúvidas ou próximo passo prático).
            </p>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Nome *</span>
              <input
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none shadow-sm"
                autoComplete="name"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">WhatsApp *</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none shadow-sm"
                placeholder="DDD + número"
                autoComplete="tel"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">E-mail (opcional)</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none shadow-sm"
                autoComplete="email"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Algo importante sobre sua clínica?</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none shadow-sm"
                placeholder="Opcional"
              />
            </label>
            {submitError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{submitError}</p>
            )}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={goBack} className={btnGhost}>
                Voltar
              </button>
              <button type="button" disabled={blockNext || saving} onClick={submit} className={btnContinue}>
                {saving ? (
                  <span className="inline-flex items-center justify-center gap-2 w-full">
                    <svg
                      className="animate-spin h-5 w-5 text-white shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Enviando…
                  </span>
                ) : (
                  'Receber meu diagnóstico'
                )}
              </button>
            </div>
          </section>
        )}

        {step === 'result' && (
          <section className={`space-y-6 ${stepSurface}`}>
            <div className="text-center space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                Pronto — seu próximo passo é no WhatsApp
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm text-left">
                Abaixo está o pré-diagnóstico com base no que você marcou. O retorno humano (dúvidas, prioridade ou
                convite para conversa) vem no <span className="font-semibold text-gray-900">WhatsApp que você informou</span>
                — é por lá que a equipe confirma o número e segue o contato.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm text-left">
                <span className="font-medium text-gray-800">Guarde este número na tela:</span> é o canal oficial para
                falar com você depois deste diagnóstico.
              </p>
            </div>

            <div className="rounded-xl border-2 border-green-300/80 bg-green-50 px-4 py-4 text-center shadow-md shadow-green-900/10">
              <p className="text-xs font-medium text-green-900 uppercase tracking-wide">WhatsApp para retorno</p>
              <p className="text-lg font-bold text-gray-900 mt-1">Mensagens neste número</p>
              <p className="text-xl font-semibold text-green-800 mt-1 tabular-nums">{phoneDisplay}</p>
              <p className="text-xs text-gray-600 mt-2">
                Confira se está correto. Em geral respondemos em horário comercial; se não bater, fale pelo site.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-200/90 bg-white overflow-hidden shadow-[0_8px_32px_rgba(30,58,138,0.12)]">
              <div className="bg-blue-800 px-4 py-3 shadow-inner">
                <p className="text-white text-sm font-semibold tracking-tight">Pré-diagnóstico</p>
              </div>
              <div className="px-4 py-4 space-y-3 text-sm text-gray-700 leading-relaxed">
                {diagnosis.length === 0 ? (
                  <p>Salvamos suas respostas. Em breve você pode receber um retorno neste WhatsApp.</p>
                ) : (
                  diagnosis.map((p, i) => (
                    <p key={i} className={i === 0 ? 'font-semibold text-gray-900' : ''}>
                      {p}
                    </p>
                  ))
                )}
              </div>
            </div>

            <p className="text-center text-sm text-gray-800 font-semibold">
              Abra o WhatsApp neste número — é o próximo passo após o pré-diagnóstico.
            </p>

            <Link
              href="/pt"
              className="inline-block w-full text-center rounded-xl bg-green-600 text-white font-semibold py-3.5 hover:bg-green-800 transition-all shadow-md shadow-green-900/20 hover:shadow-lg"
            >
              Voltar ao site
            </Link>
          </section>
        )}
      </div>
    </div>
  )
}

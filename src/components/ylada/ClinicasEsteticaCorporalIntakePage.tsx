'use client'

import Link from 'next/link'
import { useCallback, useMemo, useRef, useState } from 'react'

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
  'contact',
  'result',
]

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
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [consent, setConsent] = useState(false)
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
      contact_name: contactName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      notes: notes.trim(),
      consent: consent ? 'yes' : '',
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
    contactName,
    email,
    phone,
    notes,
    consent,
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
        setSubmitError(typeof json.error === 'string' ? json.error : 'Não foi possível enviar. Tente de novo.')
        return
      }
      submittedRef.current = true
      setDiagnosis(Array.isArray(json.diagnosis) ? json.diagnosis : [])
      setStep('result')
    } catch {
      setSubmitError('Erro de rede. Verifique sua conexão.')
    } finally {
      setSaving(false)
    }
  }, [buildPayload, saving])

  const phoneDigits = phone.replace(/\D/g, '')
  const emailOk = email.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  const canClinic = clinicName.trim().length >= 2
  const canStructure = teamStructure.length > 0
  const canFocus = mainFocus.length > 0
  const canPain = pain.length > 0
  const canLead = leadPrep.length > 0
  const canMargin = marginQual.length > 0
  const canOp = timeWaste.length > 0
  const canInterest = interestAttract.length > 0
  const canTimeline = timeline.length > 0
  const canContact =
    contactName.trim().length >= 2 && phoneDigits.length >= 10 && emailOk && consent

  const blockNext = useMemo(() => {
    switch (step) {
      case 'clinic':
        return !canClinic
      case 'structure':
        return !canStructure
      case 'focus':
        return !canFocus
      case 'pain':
        return !canPain
      case 'lead_prep':
        return !canLead
      case 'margin':
        return !canMargin
      case 'operation':
        return !canOp
      case 'interest':
        return !canInterest
      case 'timeline':
        return !canTimeline
      case 'contact':
        return !canContact
      default:
        return false
    }
  }, [
    step,
    canClinic,
    canStructure,
    canFocus,
    canPain,
    canLead,
    canMargin,
    canOp,
    canInterest,
    canTimeline,
    canContact,
  ])

  const btnPrimary =
    'flex-1 rounded-xl bg-green-600 text-white font-semibold py-3 disabled:opacity-40 hover:bg-green-700 transition-colors shadow-sm'
  const btnGhost = 'flex-1 rounded-xl border border-gray-300 py-3 font-medium text-gray-700 hover:bg-gray-50'
  const choice = (active: boolean) =>
    `w-full text-left rounded-xl border-2 px-4 py-3 font-medium transition-colors ${
      active ? 'border-blue-600 bg-blue-50 text-blue-950' : 'border-gray-200 hover:border-blue-300 text-gray-900'
    }`

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-gray-900">
      <div className="max-w-lg mx-auto px-4 py-10 pb-16">
        <header className="mb-8">
          <Link href="/pt" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            ← Início
          </Link>
          {step !== 'result' && (
            <>
              <div className="h-1.5 w-full bg-blue-100 rounded-full mt-6 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min(100, progressPct)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Análise comercial — clínicas de estética corporal</p>
            </>
          )}
        </header>

        {step === 'intro' && (
          <section className="space-y-5">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              Sua clínica recebe mensagens… mas nem todas viram clientes?
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Em poucos minutos, responda algumas perguntas e veja o que pode estar travando agendamentos, conversão e
              até margem — com um pré-diagnóstico direto ao ponto no final.
            </p>
            <p className="text-sm text-blue-900 bg-blue-50 border border-blue-100 rounded-lg p-3 leading-snug">
              Esta análise é <strong>comercial e estratégica</strong> — focada em captação e conversão. Não substitui
              avaliação clínica nem orientação de saúde.
            </p>
            <button
              type="button"
              onClick={goNext}
              className="w-full rounded-xl bg-green-600 text-white font-semibold py-3.5 px-4 hover:bg-green-700 transition-colors shadow-sm"
            >
              Começar diagnóstico gratuito
            </button>
          </section>
        )}

        {step === 'clinic' && (
          <section className="space-y-5">
            <h2 className="text-xl font-bold text-gray-900">Sobre sua clínica</h2>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Nome da clínica ou marca *</span>
              <input
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Ex.: Estética Corpo em Harmonia"
                autoComplete="organization"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Cidade / estado (opcional)</span>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Opcional"
              />
            </label>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={goBack} className={btnGhost}>
                Voltar
              </button>
              <button type="button" disabled={blockNext} onClick={goNext} className={btnPrimary}>
                Continuar
              </button>
            </div>
          </section>
        )}

        {step === 'structure' && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold">Estrutura atual</h2>
            <p className="text-sm text-gray-600">Hoje, quem atende os clientes na sua clínica?</p>
            {[
              { id: 'so_1', label: 'Só eu' },
              { id: 'pequena_2_4', label: 'Pequena equipe (2 a 4 pessoas)' },
              { id: 'estruturada_5_10', label: 'Equipe estruturada (5 a 10)' },
              { id: 'maior_10', label: 'Estrutura maior (+10)' },
            ].map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setTeamStructure(o.id)}
                className={choice(teamStructure === o.id)}
              >
                {o.label}
              </button>
            ))}
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={goBack} className={btnGhost}>
                Voltar
              </button>
              <button type="button" disabled={blockNext} onClick={goNext} className={btnPrimary}>
                Continuar
              </button>
            </div>
          </section>
        )}

        {step === 'focus' && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold">Tipo de atendimento</h2>
            <p className="text-sm text-gray-600">Hoje, qual é o principal foco da sua clínica?</p>
            {[
              { id: 'corporal', label: 'Estética corporal' },
              { id: 'corporal_facial', label: 'Corporal e facial' },
              { id: 'mais_facial', label: 'Mais facial' },
              { id: 'outro', label: 'Outro' },
            ].map((o) => (
              <button key={o.id} type="button" onClick={() => setMainFocus(o.id)} className={choice(mainFocus === o.id)}>
                {o.label}
              </button>
            ))}
            <label className="block pt-2">
              <span className="text-sm font-medium text-gray-700">Principais procedimentos ou diferenciais</span>
              <textarea
                value={servicesDetail}
                onChange={(e) => setServicesDetail(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Opcional"
              />
            </label>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={goBack} className={btnGhost}>
                Voltar
              </button>
              <button type="button" disabled={blockNext} onClick={goNext} className={btnPrimary}>
                Continuar
              </button>
            </div>
          </section>
        )}

        {step === 'pain' && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold">O que mais está travando seus resultados hoje?</h2>
            {[
              { id: 'preco_nao_fecha', label: 'Muitas pessoas perguntam preço e não fecham' },
              { id: 'agenda_inconsistente', label: 'Agenda inconsistente (dias cheios e dias vazios)' },
              { id: 'depende_promocao', label: 'Preciso fazer promoções pra atrair clientes' },
              { id: 'whatsapp_sem_fecho', label: 'Perco tempo no WhatsApp com quem não fecha' },
              { id: 'movimento_mais_faturamento', label: 'Tenho movimento, mas poderia faturar mais' },
              { id: 'outro', label: 'Outro' },
            ].map((o) => (
              <button key={o.id} type="button" onClick={() => setPain(o.id)} className={choice(pain === o.id)}>
                {o.label}
              </button>
            ))}
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={goBack} className={btnGhost}>
                Voltar
              </button>
              <button type="button" disabled={blockNext} onClick={goNext} className={btnPrimary}>
                Continuar
              </button>
            </div>
          </section>
        )}

        {step === 'lead_prep' && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold">Sobre os clientes que chegam</h2>
            <p className="text-sm text-gray-600">
              Hoje você sente que poderia cobrar mais caro… se os clientes chegassem mais preparados?
            </p>
            {[
              { id: 'sim', label: 'Sim' },
              { id: 'talvez', label: 'Talvez' },
              { id: 'nao', label: 'Não' },
            ].map((o) => (
              <button key={o.id} type="button" onClick={() => setLeadPrep(o.id)} className={choice(leadPrep === o.id)}>
                {o.label}
              </button>
            ))}
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={goBack} className={btnGhost}>
                Voltar
              </button>
              <button type="button" disabled={blockNext} onClick={goNext} className={btnPrimary}>
                Continuar
              </button>
            </div>
          </section>
        )}

        {step === 'margin' && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold">Resultado financeiro</h2>
            <p className="text-sm text-gray-600">
              Você sente que sua margem poderia ser melhor se tivesse clientes mais qualificados?
            </p>
            {[
              { id: 'sim', label: 'Sim, com certeza' },
              { id: 'talvez', label: 'Talvez' },
              { id: 'nao', label: 'Não' },
            ].map((o) => (
              <button key={o.id} type="button" onClick={() => setMarginQual(o.id)} className={choice(marginQual === o.id)}>
                {o.label}
              </button>
            ))}
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={goBack} className={btnGhost}>
                Voltar
              </button>
              <button type="button" disabled={blockNext} onClick={goNext} className={btnPrimary}>
                Continuar
              </button>
            </div>
          </section>
        )}

        {step === 'operation' && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold">Dia a dia da clínica</h2>
            <p className="text-sm text-gray-600">
              Hoje você ou sua equipe perdem tempo com atendimentos que não viram venda?
            </p>
            {[
              { id: 'frequentemente', label: 'Sim, frequentemente' },
              { id: 'as_vezes', label: 'Às vezes' },
              { id: 'raramente', label: 'Raramente' },
            ].map((o) => (
              <button key={o.id} type="button" onClick={() => setTimeWaste(o.id)} className={choice(timeWaste === o.id)}>
                {o.label}
              </button>
            ))}
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={goBack} className={btnGhost}>
                Voltar
              </button>
              <button type="button" disabled={blockNext} onClick={goNext} className={btnPrimary}>
                Continuar
              </button>
            </div>
          </section>
        )}

        {step === 'interest' && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold">Se existisse uma forma de melhorar isso…</h2>
            <p className="text-sm text-gray-600">
              Você teria interesse em entender como atrair clientes mais preparados antes mesmo do contato?
            </p>
            {[
              { id: 'sim_ver', label: 'Sim, quero ver isso' },
              { id: 'tenho_interesse', label: 'Tenho interesse' },
              { id: 'talvez_depois', label: 'Talvez depois' },
              { id: 'so_analisando', label: 'Só estou analisando' },
            ].map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setInterestAttract(o.id)}
                className={choice(interestAttract === o.id)}
              >
                {o.label}
              </button>
            ))}
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={goBack} className={btnGhost}>
                Voltar
              </button>
              <button type="button" disabled={blockNext} onClick={goNext} className={btnPrimary}>
                Continuar
              </button>
            </div>
          </section>
        )}

        {step === 'timeline' && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold">Momento atual</h2>
            <p className="text-sm text-gray-600">Se fizer sentido, quando você gostaria de ajustar isso na sua clínica?</p>
            {[
              { id: 'ja', label: 'O quanto antes' },
              { id: '30d', label: 'Nos próximos 30 dias' },
              { id: '90d', label: 'Até 90 dias' },
              { id: 'sem_pressa', label: 'Sem pressa' },
            ].map((o) => (
              <button key={o.id} type="button" onClick={() => setTimeline(o.id)} className={choice(timeline === o.id)}>
                {o.label}
              </button>
            ))}
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={goBack} className={btnGhost}>
                Voltar
              </button>
              <button type="button" disabled={blockNext} onClick={goNext} className={btnPrimary}>
                Continuar
              </button>
            </div>
          </section>
        )}

        {step === 'contact' && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold">Para te mostrar o resultado da análise</h2>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Nome *</span>
              <input
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                autoComplete="name"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">WhatsApp *</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
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
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                autoComplete="email"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Algo importante sobre sua clínica?</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Opcional"
              />
            </label>
            <label className="flex gap-3 items-start cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 leading-snug">
                Autorizo contato para <strong>análise e orientação comercial</strong>. *
              </span>
            </label>
            {submitError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{submitError}</p>
            )}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={goBack} className={btnGhost}>
                Voltar
              </button>
              <button type="button" disabled={blockNext || saving} onClick={submit} className={btnPrimary}>
                {saving ? 'Enviando…' : 'Receber meu diagnóstico'}
              </button>
            </div>
          </section>
        )}

        {step === 'result' && (
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Recebemos suas respostas 🙌</h2>
              <p className="text-gray-600 leading-relaxed text-sm px-1">
                Agora você vê abaixo um pré-diagnóstico com base no que marcou — para estimular reflexão e mostrar
                potencial que talvez ainda não esteja sendo aproveitado. Em alguns casos faz sentido aprofundar com
                alguém da equipe.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
              <div className="bg-blue-600 px-4 py-3">
                <p className="text-white text-sm font-semibold">Seu pré-diagnóstico</p>
              </div>
              <div className="px-4 py-4 space-y-3 text-sm text-gray-700 leading-relaxed">
                {diagnosis.length === 0 ? (
                  <p>Salvamos suas respostas. Em breve você pode receber um retorno pelo WhatsApp.</p>
                ) : (
                  diagnosis.map((p, i) => (
                    <p key={i} className={i === 0 ? 'font-semibold text-gray-900' : ''}>
                      {p}
                    </p>
                  ))
                )}
              </div>
            </div>

            <p className="text-center text-sm text-gray-600 font-medium">Fique atento ao WhatsApp.</p>

            <Link
              href="/pt"
              className="inline-block w-full text-center rounded-xl bg-green-600 text-white font-semibold py-3.5 hover:bg-green-700 shadow-sm"
            >
              Voltar ao site
            </Link>
          </section>
        )}
      </div>
    </div>
  )
}

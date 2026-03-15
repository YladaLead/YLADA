'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import {
  emptyFormData,
  profileToFormData,
  formDataToPayload,
  getDorPrincipalOptions,
  getOptionsForProfileField,
  PROFILE_FIELD_LABELS,
  FASE_NEGOCIO_OPTIONS,
  MODELO_PAGAMENTO_OPTIONS,
  MODELO_ATUACAO_OPTIONS,
  CANAIS_OPTIONS,
  MODALIDADE_ATENDIMENTO_OPTIONS,
  ESPECIALIDADES_MED,
  type YladaProfileFormData,
} from '@/types/ylada-profile'
import {
  PROFILE_TYPE_LABELS,
  PROFESSION_FIELD_LABEL_BY_TYPE,
  getProfessionsForSegment,
  getProfileFlow,
  getFieldPersistTarget,
  getStepCopyForProfession,
  getFieldLabelForProfession,
  getFieldPlaceholderForProfession,
  PROFESSION_HEADER,
  PROFESSION_IDENTITY,
  type ProfileType,
  type ProfessionCode,
  type ProfileFlowConfig,
  type ProfileFieldDef,
  PROFILE_TYPE_BY_PROFESSION,
} from '@/config/ylada-profile-flows'
import { getTemasForProfession } from '@/config/ylada-temas'
import { getStrategicProfileEstetica, type StrategicProfileEstetica } from '@/lib/strategic-profile-estetica'
import { getStrategicProfileOdonto } from '@/lib/strategic-profile-odonto'
import { getStrategicProfilePsi } from '@/lib/strategic-profile-psi'
import { getStrategicProfileFitness } from '@/lib/strategic-profile-fitness'
import { getStrategicProfileCoach } from '@/lib/strategic-profile-coach'
import { getStrategicProfileNutricionista } from '@/lib/strategic-profile-nutricionista'
import { getStrategicProfileMedico } from '@/lib/strategic-profile-medico'

/** Perfil estratégico detectado (comum a todas as profissões). */
type StrategicProfile = { name: string; focus: string[] }

/** Canais simplificados para onboarding (Passo 3). */
const ONBOARDING_CANAIS = [
  { value: 'indicacao', label: 'Indicação' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'google', label: 'Google' },
  { value: 'outros', label: 'Outros' },
] as const

/** Micro-feedback do Noel ao selecionar opções no contexto (por profissão). */
const NOEL_FEEDBACK_BY_PROFESSION: Record<string, Record<string, Record<string, string>>> = {
  estetica: {
    area_estetica: {
      facial: 'Estética facial costuma ter alta recorrência de clientes. Depois vamos estruturar estratégias para fidelização.',
      corporal: 'Estética corporal combina bem com pacotes e recorrência. O Noel vai sugerir diagnósticos alinhados.',
      harmonizacao: 'Harmonização trabalha bem com posicionamento de autoridade e poucos clientes de alto ticket.',
      depilacao_laser: 'Depilação e laser têm boa recorrência. Estratégias de lembrete e remarcação fazem diferença.',
      capilar: 'Capilar e tricologia geram acompanhamento contínuo. O Noel pode ajudar com funis de avaliação.',
      integrativa: 'Estética integrativa permite posicionamento amplo. Vamos direcionar estratégias ao seu mix de serviços.',
      outro: 'Com "Outro", o Noel vai se basear no resto do perfil para sugerir as melhores estratégias.',
    },
    estetica_tipo_atuacao: {
      autonoma: 'Profissionais autônomas geralmente dependem mais de indicação e agenda recorrente. O Noel vai priorizar isso.',
      clinica_propria: 'Dona de clínica: estratégias de aquisição constante, posicionamento premium e funil de avaliação.',
      dentro_salao: 'Profissional em salão: indicação e organização da agenda costumam ser os maiores ganhos.',
      equipe_colaboradora: 'Em equipe: o Noel pode ajudar com fluxo de clientes e estratégias para o espaço.',
    },
  },
  odonto: {
    odonto_voce_atende: {
      particular: 'Consultório particular costuma ter ticket mais alto. O Noel vai sugerir diagnósticos para qualificar leads.',
      convenio: 'Convênio exige volume. O Noel pode ajudar com funis de triagem e avaliações pré-consulta.',
      misto: 'Modelo misto permite equilibrar volume e ticket. O Noel vai sugerir estratégias para ambos os perfis.',
    },
  },
  fitness: {
    fitness_tipo_atuacao: {
      personal: 'Personal trainer costuma ter boa recorrência com pacotes. O Noel vai sugerir diagnósticos para avaliação e acompanhamento.',
      academia: 'Academia combina bem com turmas e avaliação física. O Noel pode ajudar com funis de captação.',
      online: 'Treinos online permitem alcance amplo. O Noel vai sugerir estratégias para captação digital.',
      grupo: 'Turmas e grupos geram recorrência. O Noel vai sugerir diagnósticos para qualificar leads.',
      ambos: 'Modelo híbrido amplia possibilidades. O Noel vai sugerir estratégias para ambos os canais.',
    },
  },
  psi: {
    publico_psi: {
      adultos: 'Atendimento de adultos é o mais comum. O Noel vai sugerir diagnósticos para ansiedade, estresse e autoconhecimento.',
      criancas: 'Atendimento infantil pode usar avaliações para os pais. O Noel vai sugerir estratégias de triagem.',
      casais: 'Terapia de casal beneficia-se de avaliações pré-sessão. O Noel pode ajudar com funis de qualificação.',
      empresas: 'Atendimento corporativo combina bem com diagnósticos de bem-estar. O Noel vai direcionar estratégias.',
    },
    modalidade_atendimento: {
      presencial: 'Atendimento presencial: indicação e divulgação local costumam ser os maiores canais. O Noel vai priorizar isso.',
      online: 'Atendimento online permite alcance nacional. O Noel pode sugerir diagnósticos para captação digital.',
      ambos: 'Modelo híbrido amplia possibilidades. O Noel vai sugerir estratégias para ambos os canais.',
    },
  },
  medico: {
    publico_principal: {
      adultos: 'Atendimento de adultos é o mais comum. O Noel vai sugerir diagnósticos para triagem e qualificação.',
      criancas: 'Atendimento infantil pode usar avaliações para os pais. O Noel vai sugerir estratégias de triagem.',
      idosos: 'Público idoso costuma ter demandas específicas. O Noel pode ajudar com diagnósticos de saúde.',
      feminino: 'Público feminino pode ter demandas específicas. O Noel vai direcionar estratégias.',
      masculino: 'Público masculino pode ter padrões de busca diferentes. O Noel vai ajustar as recomendações.',
      alta_renda: 'Pacientes de alta renda costumam valorizar qualificação. O Noel vai sugerir posicionamento premium.',
      convenio: 'Convênio exige volume. O Noel pode ajudar com funis de triagem e organização da agenda.',
      particular: 'Consultório particular costuma ter ticket mais alto. O Noel vai sugerir diagnósticos para qualificar leads.',
    },
    foco_principal: {
      consulta_rotina: 'Consulta de rotina beneficia-se de recorrência. O Noel vai sugerir estratégias de retorno.',
      tratamento_continuo: 'Tratamento contínuo gera acompanhamento. O Noel pode ajudar com qualificação e recorrência.',
      procedimentos: 'Procedimentos costumam ter ticket mais alto. O Noel vai sugerir posicionamento de especialista.',
      cirurgia: 'Cirurgia exige qualificação de demanda. O Noel vai direcionar estratégias de captação.',
      acompanhamento_cronico: 'Acompanhamento crônico gera recorrência. O Noel vai sugerir estratégias de retorno.',
    },
  },
  coach: {
    modelo_entrega_coach: {
      sessoes_individuais: 'Sessões individuais costumam ter ticket mais alto. O Noel vai sugerir diagnósticos para qualificar leads.',
      grupo: 'Trabalho em grupo beneficia-se de captação para turmas. O Noel pode ajudar com funis de avaliação.',
      programa_estruturado: 'Programas estruturados permitem posicionamento premium. O Noel vai sugerir estratégias de conversão.',
    },
  },
  nutricionista: {
    area_nutri: {
      emagrecimento: 'Emagrecimento é uma das áreas mais procuradas. O Noel vai sugerir diagnósticos de metabolismo e alimentação.',
      esportiva: 'Nutrição esportiva combina bem com avaliação de performance. O Noel pode ajudar com posicionamento.',
      clinica: 'Nutrição clínica beneficia-se de diagnósticos de saúde. O Noel vai direcionar estratégias.',
      infantil: 'Atendimento infantil pode usar avaliações para os pais. O Noel vai sugerir estratégias de triagem.',
      outro: 'Com "Outro", o Noel vai se basear no resto do perfil para sugerir as melhores estratégias.',
    },
    modalidade_atendimento: {
      presencial: 'Atendimento presencial: indicação e divulgação local costumam ser os maiores canais. O Noel vai priorizar isso.',
      online: 'Atendimento online permite alcance nacional. O Noel pode sugerir diagnósticos para captação digital.',
      ambos: 'Modelo híbrido amplia possibilidades. O Noel vai sugerir estratégias para ambos os canais.',
    },
  },
}

function getNoelFeedbackForField(
  profession: string | undefined,
  fieldKey: string,
  value: string | number | string[] | ''
): string | null {
  const feedbackMap = profession ? NOEL_FEEDBACK_BY_PROFESSION[profession]?.[fieldKey] : null
  if (!feedbackMap) return null
  const val = Array.isArray(value) ? value[0] : value
  if (typeof val !== 'string' || !val) return null
  return feedbackMap[val] ?? null
}

interface PerfilEmpresarialViewProps {
  areaCodigo: string
  areaLabel: string
}

/** Retorna o valor atual do campo no form (coluna ou area_specific). */
function getFieldValue(form: YladaProfileFormData, field: ProfileFieldDef): string | number | string[] | '' {
  const { source, path } = getFieldPersistTarget(field)
  if (source === 'column') {
    const v = form[path as keyof YladaProfileFormData]
    if (Array.isArray(v)) return v
    if (typeof v === 'number' && v === '') return ''
    return (v as string | number | '') ?? ''
  }
  const v = form.area_specific[path]
  if (Array.isArray(v)) return v
  return (v as string | undefined) ?? ''
}

export default function PerfilEmpresarialView({ areaCodigo, areaLabel }: PerfilEmpresarialViewProps) {
  const router = useRouter()
  const segment = areaCodigo
  const [form, setForm] = useState<YladaProfileFormData>(() => emptyFormData(segment))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)
  /** Step do wizard: 0 = Área de atuação, 1..n = steps do flow. */
  const [stepIndex, setStepIndex] = useState(0)
  /** Onboarding: -1=não em onboarding, 0=promo (intro), 1=área, 2=modalidade, 3=canais, 4=sucesso. */
  const [onboardingStep, setOnboardingStep] = useState<-1 | 0 | 1 | 2 | 3 | 4>(-1)
  /** Após preencher contexto (estética, odonto, psi, fitness), mostrar "Noel analisando" e depois "Perfil identificado". */
  const [strategicProfilePhase, setStrategicProfilePhase] = useState<'analyzing' | 'result' | null>(null)
  const [detectedProfile, setDetectedProfile] = useState<StrategicProfile | null>(null)
  /** Após salvar perfil completo no wizard, mostrar tela de celebração antes de ir para home. */
  const [showSuccessAfterWizardSave, setShowSuccessAfterWizardSave] = useState(false)

  const flow: ProfileFlowConfig | null =
    form.profile_type && form.profession
      ? getProfileFlow(form.profile_type as ProfileType, form.profession as ProfessionCode)
      : null

  const showWizard = flow !== null
  const totalWizardSteps = flow ? 1 + flow.steps.length : 1
  const onlyIntro = !form.profile_type || !form.profession
  const showOnboardingFlow = onboardingStep >= 0

  const loadProfile = useCallback(async () => {
    setLoading(true)
    setMessage(null)
    setShowSuccessAfterWizardSave(false)
    try {
      const res = await fetch(`/api/ylada/profile?segment=${encodeURIComponent(segment)}`, { credentials: 'include' })
      const json = await res.json()
      if (json?.success && json?.data) {
        const next = profileToFormData(segment, json.data.profile as Record<string, unknown> | null)
        setForm(next)
        const hasTypeAndProfession = next.profile_type && next.profession
        const hasModalidade = !!(next.area_specific?.modalidade_atendimento as string)?.trim()
        const hasCanais = Array.isArray(next.canais_principais) && next.canais_principais.length > 0
        if (!hasTypeAndProfession || !hasModalidade || !hasCanais) {
          // Sempre começar na promo (passo 0); ao clicar "Começar", vai para o passo correto
          setOnboardingStep(0)
          setStepIndex(0)
        } else {
          setOnboardingStep(-1)
          const nextFlow = getProfileFlow(next.profile_type as ProfileType, next.profession as ProfessionCode)
          setStepIndex(nextFlow ? 1 : 0)
        }
      } else {
        setForm(emptyFormData(segment))
        setOnboardingStep(0)
        setStepIndex(0)
      }
    } catch {
      setForm(emptyFormData(segment))
      setMessage({ type: 'error', text: 'Não foi possível carregar o perfil.' })
      setOnboardingStep(0)
      setStepIndex(0)
    } finally {
      setLoading(false)
    }
  }, [segment])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  useEffect(() => {
    if (strategicProfilePhase !== 'analyzing') return
    const profession = form.profession as string | undefined
    const t = setTimeout(() => {
      let profile: StrategicProfile | null = null
      if (profession === 'estetica') {
        const area = form.area_specific?.area_estetica as string | undefined
        const tipo = form.area_specific?.estetica_tipo_atuacao as string | undefined
        profile = getStrategicProfileEstetica(area, tipo, form.tempo_atuacao_anos)
      } else if (profession === 'odonto') {
        const voceAtende = form.area_specific?.odonto_voce_atende as string | undefined
        profile = getStrategicProfileOdonto(voceAtende, form.tempo_atuacao_anos)
      } else if (profession === 'psi') {
        const publico = form.area_specific?.publico_psi as string[] | string | undefined
        const modalidade = form.area_specific?.modalidade_atendimento as string | undefined
        profile = getStrategicProfilePsi(publico, modalidade, form.tempo_atuacao_anos)
      } else if (profession === 'fitness') {
        const tipo = form.area_specific?.fitness_tipo_atuacao as string | undefined
        profile = getStrategicProfileFitness(tipo, form.tempo_atuacao_anos)
      } else if (profession === 'coach') {
        const modelo = form.area_specific?.modelo_entrega_coach as string | undefined
        profile = getStrategicProfileCoach(modelo, form.tempo_atuacao_anos)
      } else if (profession === 'nutricionista') {
        const area = form.area_specific?.area_nutri as string | undefined
        const modalidade = form.area_specific?.modalidade_atendimento as string | undefined
        profile = getStrategicProfileNutricionista(area, modalidade, form.tempo_atuacao_anos)
      } else if (profession === 'medico') {
        const publico = form.area_specific?.publico_principal as string[] | string | undefined
        const foco = form.area_specific?.foco_principal as string | undefined
        profile = getStrategicProfileMedico(publico, foco, form.tempo_atuacao_anos)
      }
      if (profile) setDetectedProfile(profile)
      setStrategicProfilePhase('result')
    }, 2000)
    return () => clearTimeout(t)
  }, [strategicProfilePhase, form.profession, form.area_specific, form.tempo_atuacao_anos])

  const update = (updates: Partial<YladaProfileFormData>) => setForm((prev) => ({ ...prev, ...updates }))
  const updateAreaSpec = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, area_specific: { ...prev.area_specific, [key]: value } }))

  const setFieldValue = useCallback(
    (field: ProfileFieldDef, value: string | number | string[]) => {
      const { source, path } = getFieldPersistTarget(field)
      if (source === 'column') {
        if (path === 'modelo_atuacao' || path === 'canais_principais') {
          setForm((prev) => ({ ...prev, [path]: value as string[] }))
        } else if (path === 'tempo_atuacao_anos' || path === 'capacidade_semana') {
          setForm((prev) => ({ ...prev, [path]: value === '' ? '' : (value as number) }))
        } else if (path === 'ticket_medio') {
          setForm((prev) => ({ ...prev, [path]: value === '' ? '' : (value as number) }))
        } else {
          setForm((prev) => ({ ...prev, [path]: value }))
        }
      } else {
        updateAreaSpec(path, value)
      }
    },
    [updateAreaSpec]
  )

  const toggleArrayField = useCallback(
    (field: ProfileFieldDef, optionValue: string) => {
      const current = getFieldValue(form, field)
      const arr = Array.isArray(current) ? current : []
      const next = arr.includes(optionValue) ? arr.filter((x) => x !== optionValue) : [...arr, optionValue]
      setFieldValue(field, next)
    },
    [form, setFieldValue]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const profession = form.profession as ProfessionCode | undefined
    const hasFundamentalStep = flow?.steps.some((s) => ['diagnostico', 'dor_prioridade'].includes(s.id))
    if (hasFundamentalStep) {
      const dorVal = (form.dor_principal as string)?.trim?.() ?? ''
      const priorVal = (form.prioridade_atual as string)?.trim?.() ?? ''
      if (!dorVal) {
        const label = getFieldLabelForProfession('dor_principal', profession)
        setMessage({ type: 'info', text: `É fundamental preencher "${label}" para o Noel personalizar as orientações para você.` })
        return
      }
      if (!priorVal) {
        const label = getFieldLabelForProfession('prioridade_atual', profession)
        setMessage({ type: 'info', text: `É fundamental preencher "${label}" para o Noel personalizar as orientações para você.` })
        return
      }
    }
    setSaving(true)
    setMessage(null)
    try {
      let toSave = form
      if (form.profile_type && flow) {
        toSave = { ...form, flow_id: flow.flow_id, flow_version: flow.flow_version }
      }
      // Para vendas, convênio/particular não fazem sentido — limpar se estiver preenchido
      if (toSave.profile_type === 'vendas' && (toSave.modelo_pagamento === 'particular' || toSave.modelo_pagamento === 'convenio')) {
        toSave = { ...toSave, modelo_pagamento: '' }
      }
      const payload = formDataToPayload(toSave)
      // Sempre enviar o segmento da área atual (evita constraint violation se o form tiver valor incorreto)
      payload.segment = areaCodigo
      const res = await fetch('/api/ylada/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json?.success) {
        setShowSuccessAfterWizardSave(true)
      } else {
        setMessage({ type: 'error', text: json?.error || 'Erro ao salvar.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro ao salvar. Tente novamente.' })
    } finally {
      setSaving(false)
    }
  }

  const professionsForSegment = getProfessionsForSegment(segment)
  const professionsFilteredByType =
    form.profile_type
      ? professionsForSegment.filter(
          (p) =>
            PROFILE_TYPE_BY_PROFESSION[p.value] === form.profile_type ||
            (form.profile_type === 'vendas' && p.value === 'outro')
        )
      : professionsForSegment
  /** "Outro" sempre por último na lista. */
  const professionsSorted = [...professionsFilteredByType].sort((a, b) =>
    a.value === 'outro' ? 1 : b.value === 'outro' ? -1 : 0
  )
  const professionFieldLabel =
    form.profile_type ? PROFESSION_FIELD_LABEL_BY_TYPE[form.profile_type as ProfileType] : 'Sua atuação na área'

  if (loading) {
    return (
      <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Carregando perfil...</p>
        </div>
      </YladaAreaShell>
    )
  }

  // —— Onboarding simplificado 3 passos (barra de progresso + conclusão) ——
  const saveOnboardingStep = async (payload: Record<string, unknown>) => {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/ylada/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ segment, ...payload }),
      })
      const json = await res.json()
      if (json?.success) {
        return true
      }
      setMessage({ type: 'error', text: json?.error || 'Erro ao salvar.' })
      return false
    } catch {
      setMessage({ type: 'error', text: 'Erro ao salvar. Tente novamente.' })
      return false
    } finally {
      setSaving(false)
    }
  }

  if (showOnboardingFlow) {
    const totalSteps = 3
    const progressPct = onboardingStep >= 1 && onboardingStep <= 3 ? (onboardingStep / totalSteps) * 100 : onboardingStep === 4 ? 100 : 0
    const modalidadeValue = (form.area_specific?.modalidade_atendimento as string) || ''

    return (
      <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Passo 0: Tela de promoção (só valor, sem perguntas) */}
          {onboardingStep === 0 && (
            <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-8 sm:p-10 text-center">
              <p className="text-indigo-600 text-sm font-medium mb-3">🧠 Noel</p>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Pelas suas respostas, o Noel vai te conhecer para entregar as melhores orientações.
              </h1>
              <p className="text-gray-700 text-base leading-relaxed mb-2">
                São poucas perguntas. As respostas vão direcionar você a superar os desafios que mais te travam hoje.
              </p>
              <p className="text-gray-600 text-sm mb-6">
                Diagnósticos personalizados · Estratégias de captação · Sugestões para sua agenda
              </p>
              <p className="text-gray-500 text-sm mb-6">⏱ Leva menos de 2 minutos.</p>
              <button
                type="button"
                onClick={() => {
                  const hasType = !!form.profile_type && !!form.profession
                  const hasMod = !!(form.area_specific?.modalidade_atendimento as string)?.trim()
                  const hasCan = Array.isArray(form.canais_principais) && form.canais_principais.length > 0
                  if (!hasType) setOnboardingStep(1)
                  else if (!hasMod) setOnboardingStep(2)
                  else if (!hasCan) setOnboardingStep(3)
                  else setOnboardingStep(4)
                }}
                className="px-8 py-4 bg-indigo-600 text-white text-base font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Começar as perguntas →
              </button>
            </div>
          )}

          {/* Barra de progresso + título (passos 1-4) */}
          {onboardingStep >= 1 && (
          <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-6 sm:p-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Configure seu perfil estratégico</h1>
            {onboardingStep <= 3 && (
              <>
                <p className="text-sm text-gray-500 mb-2">Passo {onboardingStep} de {totalSteps} — Configuração do perfil</p>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
                  <div className="h-full bg-indigo-600 rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
                </div>
              </>
            )}
            {onboardingStep === 1 && (
              <>
                <p className="text-gray-700 text-base leading-relaxed mt-4 mb-1">
                  Quanto melhor o Noel entender seu trabalho, melhores serão as estratégias que ele poderá sugerir.
                </p>
                <p className="text-gray-500 text-sm flex items-center gap-1">⏱ Leva menos de 1 minuto.</p>
              </>
            )}
            {onboardingStep === 4 && (
              <p className="text-gray-700 text-base leading-relaxed mt-2">
                Perfeito. Agora o Noel já entende seu trabalho.
              </p>
            )}
          </div>
          )}

          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : message.type === 'info'
                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Passo 1: Área de atuação */}
          {onboardingStep === 1 && (
            <>
              <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
                <p className="text-gray-700 text-sm font-medium mb-3">Essas informações ajudam o Noel a adaptar:</p>
                <ul className="text-gray-600 text-sm space-y-1 mb-4">
                  <li className="flex items-center gap-2"><span className="text-green-600">✓</span> diagnósticos da biblioteca</li>
                  <li className="flex items-center gap-2"><span className="text-green-600">✓</span> estratégias de captação</li>
                  <li className="flex items-center gap-2"><span className="text-green-600">✓</span> sugestões para agenda e clientes</li>
                </ul>
              </div>
              <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 space-y-6">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Você atua como</span>
                    <select
                      className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={form.profile_type}
                      onChange={(e) => update({ profile_type: e.target.value, profession: '' })}
                    >
                      <option value="">Selecione...</option>
                      {(Object.entries(PROFILE_TYPE_LABELS) as [ProfileType, string][]).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">{professionFieldLabel}</span>
                    <select
                      className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-400"
                      value={form.profession}
                      onChange={(e) => update({ profession: e.target.value })}
                      disabled={!form.profile_type}
                    >
                      <option value="">Selecione...</option>
                      {professionsSorted.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                  {form.profession === 'outro' && (
                    <label className="block">
                      <span className="text-sm font-medium text-gray-700">Descreva sua atuação</span>
                      <input
                        type="text"
                        className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ex.: outra área de atendimento..."
                        value={(form.area_specific?.atuacao_outra as string) ?? ''}
                        onChange={(e) => updateAreaSpec('atuacao_outra', e.target.value)}
                      />
                    </label>
                  )}
                </div>
                <div className="px-6 sm:px-8 py-5 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-col items-end gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        if (!form.profile_type) {
                          setMessage({ type: 'info', text: 'É fundamental preencher a área de atuação para o Noel personalizar as orientações para você.' })
                          return
                        }
                        if (!form.profession) {
                          setMessage({ type: 'info', text: 'É fundamental preencher sua profissão/atuação para o Noel personalizar as orientações para você.' })
                          return
                        }
                        const payload = formDataToPayload({ ...form, profile_type: form.profile_type, profession: form.profession })
                        const ok = await saveOnboardingStep(payload)
                        if (ok) setOnboardingStep(2)
                      }}
                      disabled={saving}
                      className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {saving ? 'Salvando...' : 'Continuar →'}
                    </button>
                    <p className="text-xs text-gray-500">Você poderá alterar essas informações depois.</p>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Passo 2: Modalidade de atendimento */}
          {onboardingStep === 2 && (
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Como você costuma atender seus clientes?</h2>
                <div className="space-y-3 mt-4">
                  {MODALIDADE_ATENDIMENTO_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="modalidade"
                        value={opt.value}
                        checked={modalidadeValue === opt.value}
                        onChange={() => updateAreaSpec('modalidade_atendimento', opt.value)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-700">{opt.value === 'ambos' ? 'Presencial e online' : opt.label}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-6 flex flex-col items-end gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!modalidadeValue) {
                        setMessage({ type: 'info', text: 'É fundamental selecionar como você atende (presencial, online ou ambos) para o Noel personalizar as orientações.' })
                        return
                      }
                      const payload = formDataToPayload(form)
                      const ok = await saveOnboardingStep(payload)
                      if (ok) setOnboardingStep(3)
                    }}
                    disabled={saving}
                    className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? 'Salvando...' : 'Continuar →'}
                  </button>
                  <p className="text-xs text-gray-500">Você poderá alterar essas informações depois.</p>
                </div>
              </div>
            </section>
          )}

          {/* Passo 3: Canais */}
          {onboardingStep === 3 && (
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Como seus clientes normalmente chegam até você?</h2>
                <p className="text-sm text-gray-500 mb-4">Selecione todas as opções que se aplicam.</p>
                <div className="space-y-3">
                  {ONBOARDING_CANAIS.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.canais_principais.includes(opt.value)}
                        onChange={() => {
                          const next = form.canais_principais.includes(opt.value)
                            ? form.canais_principais.filter((x) => x !== opt.value)
                            : [...form.canais_principais, opt.value]
                          update({ canais_principais: next })
                        }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-6 flex flex-col items-end gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!form.canais_principais?.length) {
                        setMessage({ type: 'info', text: 'É fundamental selecionar pelo menos um canal para o Noel saber como seus clientes chegam até você.' })
                        return
                      }
                      const payload = formDataToPayload(form)
                      const ok = await saveOnboardingStep(payload)
                      if (ok) setOnboardingStep(4)
                    }}
                    disabled={saving}
                    className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? 'Salvando...' : 'Continuar →'}
                  </button>
                  <p className="text-xs text-gray-500">Você poderá alterar essas informações depois.</p>
                </div>
              </div>
            </section>
          )}

          {/* Passo 4: Sucesso */}
          {onboardingStep === 4 && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
              <p className="text-gray-700 text-base mb-4">Agora o Noel já consegue sugerir estratégias para:</p>
              <ul className="text-gray-700 text-sm space-y-2 mb-6">
                <li className="flex items-center justify-center gap-2"><span className="text-green-600">✓</span> atrair clientes</li>
                <li className="flex items-center justify-center gap-2"><span className="text-green-600">✓</span> iniciar conversas qualificadas</li>
                <li className="flex items-center justify-center gap-2"><span className="text-green-600">✓</span> transformar curiosos em atendimentos</li>
              </ul>
              <button
                type="button"
                onClick={() => router.push('/pt/home')}
                className="px-8 py-4 bg-indigo-600 text-white text-base font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                🚀 Entrar na plataforma
              </button>
            </div>
          )}

          {onboardingStep >= 1 && onboardingStep <= 3 && (
            <p className="text-center text-xs text-gray-400">
              Mais de 3.000 profissionais já utilizam esse sistema para organizar sua comunicação com clientes.
            </p>
          )}
        </div>
      </YladaAreaShell>
    )
  }

  // —— Só intro (sem onboarding flow): perfil já completo ou fluxo antigo ——
  if (onlyIntro) {
    return (
      <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-6 sm:p-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Configure seu perfil estratégico</h1>
            <p className="text-gray-700 text-base">Quanto melhor o Noel entender seu trabalho, melhores serão as estratégias.</p>
          </div>
          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : message.type === 'info'
                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-6 sm:px-8 py-5">
              <h2 className="text-base font-semibold text-gray-800">Área de atuação</h2>
            </div>
            <div className="p-6 sm:p-8 space-y-6">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Você atua como</span>
                <select
                  className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={form.profile_type}
                  onChange={(e) => update({ profile_type: e.target.value, profession: '' })}
                >
                  <option value="">Selecione...</option>
                  {(Object.entries(PROFILE_TYPE_LABELS) as [ProfileType, string][]).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">{professionFieldLabel}</span>
                <select
                  className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-400"
                  value={form.profession}
                  onChange={(e) => update({ profession: e.target.value })}
                  disabled={!form.profile_type}
                >
                  <option value="">Selecione...</option>
                  {professionsSorted.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>
              {form.profession === 'outro' && (
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Descreva sua atuação</span>
                  <input
                    type="text"
                    className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ex.: outra área..."
                    value={(form.area_specific?.atuacao_outra as string) ?? ''}
                    onChange={(e) => updateAreaSpec('atuacao_outra', e.target.value)}
                  />
                </label>
              )}
            </div>
            <div className="px-6 sm:px-8 py-5 bg-gray-50 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  if (!form.profile_type) {
                    setMessage({ type: 'info', text: 'É fundamental preencher a área de atuação para o Noel personalizar as orientações para você.' })
                    return
                  }
                  if (!form.profession) {
                    setMessage({ type: 'info', text: 'É fundamental preencher sua profissão/atuação para o Noel personalizar as orientações para você.' })
                    return
                  }
                  setStepIndex(1)
                }}
                className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Continuar e definir minha área →
              </button>
            </div>
          </section>
        </div>
      </YladaAreaShell>
    )
  }

  // —— Wizard: tem tipo + profissão e flow ——
  if (showWizard && flow) {
    const currentStep = stepIndex === 0 ? null : flow.steps[stepIndex - 1]
    const isLastStep = stepIndex === flow.steps.length
    const profession = form.profession as ProfessionCode | undefined
    const headerCopy = profession && PROFESSION_HEADER[profession]
    const identityCopy = profession && PROFESSION_IDENTITY[profession]
    const nextStep = !isLastStep ? flow.steps[stepIndex] : null
    const nextStepCopy = nextStep
      ? getStepCopyForProfession(nextStep.id, profession, { title: nextStep.title, description: nextStep.description })
      : null
    const currentStepCopy =
      currentStep && stepIndex > 0
        ? getStepCopyForProfession(currentStep.id, profession, { title: currentStep.title, description: currentStep.description })
        : null

    const isContextoStepWithFeedback =
      ['estetica', 'odonto', 'psi', 'fitness', 'coach', 'nutricionista', 'medico'].includes(profession || '') && currentStep?.id === 'contexto'
    const isEspecialidadeStepWithFeedback = (profession === 'psi' || profession === 'medico') && currentStep?.id === 'especialidade'
    const isAtendimentoStepWithFeedback = isEspecialidadeStepWithFeedback
    const isFieldWithNoelFeedback = (f: ProfileFieldDef) =>
      !!NOEL_FEEDBACK_BY_PROFESSION[profession]?.[f.key]
    const hasStrategicProfileDiscovery = ['estetica', 'odonto', 'psi', 'fitness', 'coach', 'nutricionista', 'medico'].includes(profession || '')
    const showStrategicProfileDiscovery =
      hasStrategicProfileDiscovery && stepIndex === 1 && (strategicProfilePhase === 'analyzing' || strategicProfilePhase === 'result')

    if (showSuccessAfterWizardSave) {
      return (
        <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
          <div className="max-w-3xl mx-auto">
            <div className="rounded-xl border border-green-200 bg-green-50 p-8 sm:p-10 text-center">
              <p className="text-indigo-600 text-sm font-medium mb-2">🧠 Noel</p>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                Perfil salvo! Agora o Noel vai poder orientá-lo corretamente.
              </h1>
              <p className="text-gray-700 text-base mb-4">
                Com essas informações, ele vai sugerir estratégias personalizadas para você alcançar suas metas.
              </p>
              <p className="text-gray-700 text-base mb-4">Agora o Noel já consegue sugerir estratégias para:</p>
              <ul className="text-gray-700 text-sm space-y-2 mb-6">
                <li className="flex items-center justify-center gap-2"><span className="text-green-600">✓</span> atrair clientes</li>
                <li className="flex items-center justify-center gap-2"><span className="text-green-600">✓</span> iniciar conversas qualificadas</li>
                <li className="flex items-center justify-center gap-2"><span className="text-green-600">✓</span> transformar curiosos em atendimentos</li>
              </ul>
              <button
                type="button"
                onClick={() => router.push('/pt/home')}
                className="px-8 py-4 bg-indigo-600 text-white text-base font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Bora pra plataforma →
              </button>
            </div>
          </div>
        </YladaAreaShell>
      )
    }

    return (
      <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
        <div className="max-w-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {headerCopy?.title ?? 'Perfil empresarial'}
              </h1>
              {headerCopy?.subtitle && (
                <p className="text-gray-600 text-sm mb-1">{headerCopy.subtitle}</p>
              )}
              <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                <span>Etapa {stepIndex + 1} de {totalWizardSteps}</span>
                {currentStepCopy?.stepHeaderPart && (
                  <>
                    <span className="text-gray-300">—</span>
                    <span>{currentStepCopy.stepHeaderPart}</span>
                  </>
                )}
                {stepIndex === 1 && (
                  <>
                    <span className="text-indigo-600">·</span>
                    <span className="text-indigo-600">Leva menos de 1 minuto</span>
                  </>
                )}
              </p>
              {totalWizardSteps > 1 && (
                <div className="mt-2 flex gap-0.5" role="progressbar" aria-valuenow={stepIndex + 1} aria-valuemin={1} aria-valuemax={totalWizardSteps}>
                  {Array.from({ length: totalWizardSteps }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${i + 1 <= stepIndex + 1 ? 'bg-indigo-600' : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
              )}
              {identityCopy && stepIndex > 0 && !showStrategicProfileDiscovery && (
                <p className="text-xs text-indigo-700 mt-2">
                  Você é: <strong>{identityCopy.youAre}</strong>
                  {' · '}
                  Objetivo: {identityCopy.objective}
                </p>
              )}
              {stepIndex === 1 && hasStrategicProfileDiscovery && !showStrategicProfileDiscovery && (
                <p className="text-xs text-gray-400 mt-2">
                  Mais de 3.200 profissionais já configuraram seu perfil estratégico no YLADA.
                </p>
              )}
            </div>
            {stepIndex > 0 && !showStrategicProfileDiscovery && (
              <button
                type="button"
                onClick={() => { setStrategicProfilePhase(null); setDetectedProfile(null); setStepIndex(0) }}
                className="text-sm text-indigo-600 hover:underline"
              >
                Alterar área de atuação
              </button>
            )}
          </div>
          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800'
                  : message.type === 'info'
                    ? 'bg-blue-50 text-blue-800'
                    : 'bg-red-50 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Estética: tela "Noel está analisando" ou "Perfil estratégico identificado" */}
          {showStrategicProfileDiscovery && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-8 sm:p-10">
              {strategicProfilePhase === 'analyzing' && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 mb-4 animate-pulse" aria-hidden>
                    💡
                  </div>
                  <p className="text-lg font-medium text-gray-900">O Noel está analisando seu perfil...</p>
                  <p className="text-sm text-gray-500 mt-1">Em instantes você verá seu perfil estratégico.</p>
                </div>
              )}
              {strategicProfilePhase === 'result' && detectedProfile && (
                <div className="space-y-6">
                  <div className="text-center sm:text-left">
                    <p className="text-sm font-medium text-indigo-600 mb-1">Perfil estratégico identificado</p>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{detectedProfile.name}</h2>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Profissionais com esse perfil costumam crescer mais quando focam em:
                  </p>
                  <ul className="space-y-2">
                    {detectedProfile.focus.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-medium">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => { setStrategicProfilePhase(null); setDetectedProfile(null); setStepIndex(2) }}
                    className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Ver estratégias para meu perfil →
                  </button>
                </div>
              )}
            </div>
          )}

          {!showStrategicProfileDiscovery && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {stepIndex === 0 ? (
              <section className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-700 mb-1">Área de atuação</h2>
                <p className="text-xs text-gray-500 mb-4">Isso ajuda o Noel a adaptar as perguntas e as estratégias ao seu tipo de negócio.</p>
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm text-gray-600">Você atua como</span>
                    <select
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      value={form.profile_type}
                      onChange={(e) => update({ profile_type: e.target.value, profession: '' })}
                    >
                      {(Object.entries(PROFILE_TYPE_LABELS) as [ProfileType, string][]).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm text-gray-600">{professionFieldLabel}</span>
                    <select
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      value={form.profession}
                      onChange={(e) => update({ profession: e.target.value })}
                    >
                      {professionsSorted.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                  {form.profession === 'outro' && (
                    <label className="block">
                      <span className="text-sm text-gray-600">Descreva sua atuação</span>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        placeholder={
                          form.profile_type === 'vendas'
                            ? 'Ex.: outro tipo de produto ou serviço que você vende...'
                            : 'Ex.: outra área de atendimento ou especialidade...'
                        }
                        value={(form.area_specific?.atuacao_outra as string) ?? ''}
                        onChange={(e) => updateAreaSpec('atuacao_outra', e.target.value)}
                      />
                    </label>
                  )}
                </div>
              </section>
            ) : (
              currentStep && (() => {
                const stepCopy = getStepCopyForProfession(
                  currentStep.id,
                  profession,
                  { title: currentStep.title, description: currentStep.description }
                )
                return (
                <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
                  <h2 className="text-base font-semibold text-gray-800 mb-1">{stepCopy.title}</h2>
                  {stepCopy.description && (
                    <p className="text-sm text-gray-500 mb-3">{stepCopy.description}</p>
                  )}
                  {(isContextoStepWithFeedback || isAtendimentoStepWithFeedback) && (
                    <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-100">
                      <p className="text-xs font-medium text-amber-800 mb-1">💡 Exemplo de como isso ajuda o Noel</p>
                      <p className="text-xs text-amber-700">
                        {profession === 'estetica' && 'Uma esteticista facial autônoma precisa de estratégias diferentes de uma clínica com equipe. O Noel usa essas informações para ajustar recomendações automaticamente.'}
                        {profession === 'odonto' && 'Um dentista particular precisa de estratégias diferentes de uma clínica com convênio. O Noel usa essas informações para ajustar recomendações automaticamente.'}
                        {profession === 'psi' && 'Um psicólogo que atende adultos pode usar diagnósticos diferentes de quem atende casais. O Noel usa essas informações para ajustar recomendações automaticamente.'}
                        {profession === 'fitness' && 'Um personal trainer precisa de estratégias diferentes de quem atua em academia. O Noel usa essas informações para ajustar recomendações automaticamente.'}
                        {profession === 'coach' && 'Um coach de sessões individuais precisa de estratégias diferentes de quem trabalha com grupos. O Noel usa essas informações para ajustar recomendações automaticamente.'}
                        {profession === 'nutricionista' && 'Uma nutricionista de emagrecimento precisa de estratégias diferentes de quem atende esportistas. O Noel usa essas informações para ajustar recomendações automaticamente.'}
                        {profession === 'medico' && currentStep?.id === 'contexto' && 'Um médico particular precisa de estratégias diferentes de quem atende por convênio. O Noel usa essas informações para ajustar recomendações automaticamente.'}
                        {profession === 'medico' && currentStep?.id === 'especialidade' && 'Um médico de procedimentos precisa de estratégias diferentes de quem faz consulta de rotina. O Noel usa essas informações para ajustar recomendações automaticamente.'}
                      </p>
                    </div>
                  )}
                  {stepCopy.microcopy && (
                    <p className="text-xs text-indigo-600 mb-4">{stepCopy.microcopy}</p>
                  )}
                  <div className="space-y-6">
                    {currentStep.fields.map((field) => {
                      const label = getFieldLabelForProfession(
                        field.key,
                        profession,
                        PROFILE_FIELD_LABELS[field.key] ?? field.key
                      )
                      const placeholder = getFieldPlaceholderForProfession(field.key, profession)
                      const value = getFieldValue(form, field)
                      const options = field.options ?? getOptionsForProfileField(field.key, form.profile_type || null, form.profession || null)
                      const isCardFieldWithFeedback = isFieldWithNoelFeedback(field) && field.type === 'select'
                      const noelFeedback = getNoelFeedbackForField(profession, field.key, value)

                      if (isCardFieldWithFeedback) {
                        const currentVal = typeof value === 'string' ? value : ''
                        return (
                          <div key={field.key} className="space-y-2">
                            <span className="text-sm font-medium text-gray-700 block">{label}</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {options.map((o) => (
                                <button
                                  key={o.value}
                                  type="button"
                                  onClick={() => setFieldValue(field, o.value)}
                                  className={`text-left px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                                    currentVal === o.value
                                      ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                  }`}
                                >
                                  {o.label}
                                </button>
                              ))}
                            </div>
                            {noelFeedback && (
                              <p className="text-xs text-indigo-700 bg-indigo-50 rounded-lg px-3 py-2 mt-2 border border-indigo-100">
                                💡 <strong>Noel:</strong> {noelFeedback}
                              </p>
                            )}
                          </div>
                        )
                      }

                      if (field.type === 'multiselect') {
                        const arr = Array.isArray(value) ? value : []
                        const multiselectFeedback = isFieldWithNoelFeedback(field)
                          ? getNoelFeedbackForField(profession, field.key, value)
                          : null
                        return (
                          <div key={field.key} className="space-y-2">
                            <span className="text-sm text-gray-600 block">{label}</span>
                            <div className="flex flex-wrap gap-2">
                              {options.map((o) => (
                                <label key={o.value} className="inline-flex items-center gap-1.5 text-sm">
                                  <input
                                    type="checkbox"
                                    checked={arr.includes(o.value)}
                                    onChange={() => toggleArrayField(field, o.value)}
                                  />
                                  {o.label}
                                </label>
                              ))}
                            </div>
                            {multiselectFeedback && (
                              <p className="text-xs text-indigo-700 bg-indigo-50 rounded-lg px-3 py-2 mt-2 border border-indigo-100">
                                💡 <strong>Noel:</strong> {multiselectFeedback}
                              </p>
                            )}
                          </div>
                        )
                      }
                      if (field.type === 'select') {
                        const isDorPrincipal = field.key === 'dor_principal'
                        const showOutraDor = isDorPrincipal && (typeof value === 'string' && value === 'outra')
                        return (
                          <div key={field.key}>
                            <label className="block">
                              <span className="text-sm text-gray-600">{label}</span>
                              <select
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                value={typeof value === 'string' ? value : ''}
                                onChange={(e) => setFieldValue(field, e.target.value)}
                              >
                                <option value="">Selecione</option>
                                {options.map((o) => (
                                  <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                              </select>
                            </label>
                            {showOutraDor && (
                              <label className="block mt-3">
                                <span className="text-sm text-gray-600">Descreva o que está travando</span>
                                <input
                                  type="text"
                                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                  placeholder="Ex.: dificuldade com gestão do consultório, falta de tempo para divulgação..."
                                  value={(form.area_specific?.dor_principal_outra as string) ?? ''}
                                  onChange={(e) => updateAreaSpec('dor_principal_outra', e.target.value)}
                                />
                              </label>
                            )}
                          </div>
                        )
                      }
                      if (field.type === 'number') {
                        return (
                          <label key={field.key} className="block">
                            <span className="text-sm text-gray-600">{label}</span>
                            <input
                              type="number"
                              min={0}
                              step={field.key === 'ticket_medio' ? 0.01 : 1}
                              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                              placeholder={placeholder}
                              value={value === '' || value == null ? '' : value}
                              onChange={(e) => setFieldValue(field, e.target.value === '' ? '' : (field.key === 'ticket_medio' ? parseFloat(e.target.value) : parseInt(e.target.value, 10)) || 0)}
                            />
                          </label>
                        )
                      }
                      if (field.type === 'textarea') {
                        return (
                          <label key={field.key} className="block">
                            <span className="text-sm text-gray-600">{label}</span>
                            <textarea
                              rows={field.key === 'observacoes' ? 3 : 2}
                              maxLength={field.key === 'observacoes' ? 1500 : undefined}
                              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                              placeholder={placeholder}
                              value={typeof value === 'string' ? value : ''}
                              onChange={(e) => setFieldValue(field, e.target.value)}
                            />
                            {field.key === 'observacoes' && (
                              <span className="text-xs text-gray-400">{(typeof value === 'string' ? value : '').length}/1500</span>
                            )}
                          </label>
                        )
                      }
                      return (
                        <label key={field.key} className="block">
                          <span className="text-sm text-gray-600">{label}</span>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                            placeholder={placeholder}
                            value={typeof value === 'string' ? value : value === '' ? '' : String(value)}
                            onChange={(e) => setFieldValue(field, e.target.value)}
                          />
                        </label>
                      )
                    })}
                  </div>
                  {isLastStep && areaCodigo === 'ylada' && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Quais temas você atende? <span className="text-gray-400 font-normal">(opcional)</span></h3>
                      <p className="text-xs text-gray-500 mb-3">Esses temas aparecem primeiro ao criar links. Se não escolher, usamos os padrão da sua profissão.</p>
                      <div className="flex flex-wrap gap-2">
                        {getTemasForProfession(form.profession || null).map((t) => {
                          const temasArr = Array.isArray(form.area_specific?.temas_atuacao) ? form.area_specific.temas_atuacao as string[] : []
                          const checked = temasArr.includes(t.value)
                          return (
                            <label key={t.value} className="inline-flex items-center gap-1.5 text-sm">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => {
                                  const next = checked ? temasArr.filter((x) => x !== t.value) : [...temasArr, t.value]
                                  updateAreaSpec('temas_atuacao', next.length ? next : null)
                                }}
                              />
                              {t.label}
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  {stepCopy.reinforcement && (
                    <p className="text-xs text-indigo-600 mt-4">{stepCopy.reinforcement}</p>
                  )}
                </section>
                )
              })()
            )}

            <div className="flex justify-between">
              <div>
                {stepIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => setStepIndex((i) => i - 1)}
                    className="px-4 py-2 text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50"
                  >
                    Voltar
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                {!isLastStep ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (hasStrategicProfileDiscovery && currentStep?.id === 'contexto') {
                        setStrategicProfilePhase('analyzing')
                      } else {
                        const stepWithFundamental = ['diagnostico', 'dor_prioridade'].includes(currentStep?.id || '')
                        if (stepWithFundamental) {
                          const dorVal = (form.dor_principal as string)?.trim?.() ?? ''
                          const priorVal = (form.prioridade_atual as string)?.trim?.() ?? ''
                          if (!dorVal) {
                            const label = getFieldLabelForProfession('dor_principal', profession)
                            setMessage({ type: 'info', text: `É fundamental preencher "${label}" para o Noel personalizar as orientações para você.` })
                            return
                          }
                          if (!priorVal) {
                            const label = getFieldLabelForProfession('prioridade_atual', profession)
                            setMessage({ type: 'info', text: `É fundamental preencher "${label}" para o Noel personalizar as orientações para você.` })
                            return
                          }
                        }
                        setMessage(null)
                        setStepIndex((i) => i + 1)
                      }
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                  >
                    {currentStepCopy?.nextStepButtonLabel
                      ? currentStepCopy.nextStepButtonLabel
                      : nextStepCopy
                        ? (nextStepCopy.title.length > 28
                            ? 'Avançar para próxima etapa'
                            : `Avançar para ${nextStepCopy.title}`)
                        : 'Avançar'}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {saving ? 'Salvando...' : 'Salvar perfil'}
                  </button>
                )}
              </div>
            </div>
          </form>
          )}
        </div>
      </YladaAreaShell>
    )
  }

  // —— Fallback: formulário completo (tem tipo/profissão mas sem flow, ou compatibilidade) ——
  if (showSuccessAfterWizardSave) {
    return (
      <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border border-green-200 bg-green-50 p-8 sm:p-10 text-center">
            <p className="text-indigo-600 text-sm font-medium mb-2">🧠 Noel</p>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              Perfil salvo! Agora o Noel vai poder orientá-lo corretamente.
            </h1>
            <p className="text-gray-700 text-base mb-4">
              Com essas informações, ele vai sugerir estratégias personalizadas para você alcançar suas metas.
            </p>
            <p className="text-gray-700 text-base mb-4">Agora o Noel já consegue sugerir estratégias para:</p>
            <ul className="text-gray-700 text-sm space-y-2 mb-6">
              <li className="flex items-center justify-center gap-2"><span className="text-green-600">✓</span> atrair clientes</li>
              <li className="flex items-center justify-center gap-2"><span className="text-green-600">✓</span> iniciar conversas qualificadas</li>
              <li className="flex items-center justify-center gap-2"><span className="text-green-600">✓</span> transformar curiosos em atendimentos</li>
            </ul>
            <button
              type="button"
              onClick={() => router.push('/pt/home')}
              className="px-8 py-4 bg-indigo-600 text-white text-base font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Bora pra plataforma →
            </button>
          </div>
        </div>
      </YladaAreaShell>
    )
  }

  return (
    <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Perfil empresarial</h1>
          <p className="text-gray-600 mb-4">
            Suas características, metas, objetivos e contexto. O Noel usa essas informações para personalizar as orientações.
          </p>
        </div>
        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800'
                : message.type === 'info'
                  ? 'bg-blue-50 text-blue-800'
                  : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}
        <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
          Essa combinação de área ainda não tem um fluxo específico. Use o formulário completo abaixo.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Contexto</h2>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Você atua como</span>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.profile_type}
                onChange={(e) => update({ profile_type: e.target.value })}
              >
                <option value="">Selecione</option>
                {(Object.entries(PROFILE_TYPE_LABELS) as [ProfileType, string][]).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">{professionFieldLabel}</span>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.profession}
                onChange={(e) => update({ profession: e.target.value })}
              >
                <option value="">Selecione</option>
                {professionsSorted.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            {form.profession === 'outro' && (
              <label className="block mb-2">
                <span className="text-sm text-gray-600">Descreva sua atuação</span>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder={
                    form.profile_type === 'vendas'
                      ? 'Ex.: outro tipo de produto ou serviço que você vende...'
                      : 'Ex.: outra área de atendimento ou especialidade...'
                  }
                  value={(form.area_specific?.atuacao_outra as string) ?? ''}
                  onChange={(e) => updateAreaSpec('atuacao_outra', e.target.value)}
                />
              </label>
            )}
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Categoria (mercado)</span>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Ex.: estética, automóveis, nutrição"
                value={form.category}
                onChange={(e) => update({ category: e.target.value })}
              />
            </label>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Subcategoria</span>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.sub_category}
                onChange={(e) => update({ sub_category: e.target.value })}
              />
            </label>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Anos de atuação</span>
              <input
                type="number"
                min={0}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.tempo_atuacao_anos === '' ? '' : form.tempo_atuacao_anos}
                onChange={(e) => update({ tempo_atuacao_anos: e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0 })}
              />
            </label>
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Diagnóstico</h2>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Dor principal</span>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.dor_principal}
                onChange={(e) => update({ dor_principal: e.target.value })}
              >
                <option value="">Selecione</option>
                {getDorPrincipalOptions(form.profile_type || null).map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            {form.dor_principal === 'outra' && (
              <label className="block mb-2">
                <span className="text-sm text-gray-600">Descreva o que está travando</span>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Ex.: dificuldade com gestão do consultório, falta de tempo para divulgação..."
                  value={(form.area_specific?.dor_principal_outra as string) ?? ''}
                  onChange={(e) => updateAreaSpec('dor_principal_outra', e.target.value)}
                />
              </label>
            )}
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Prioridade atual</span>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Ex.: preencher agenda nos próximos 30 dias"
                value={form.prioridade_atual}
                onChange={(e) => update({ prioridade_atual: e.target.value })}
              />
            </label>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Fase do negócio</span>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.fase_negocio}
                onChange={(e) => update({ fase_negocio: e.target.value })}
              >
                <option value="">Selecione</option>
                {FASE_NEGOCIO_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Metas e objetivos</h2>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Metas principais</span>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.metas_principais}
                onChange={(e) => update({ metas_principais: e.target.value })}
              />
            </label>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Objetivos curto/médio prazo</span>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.objetivos_curto_prazo}
                onChange={(e) => update({ objetivos_curto_prazo: e.target.value })}
              />
            </label>
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Modelo de atuação</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {MODELO_ATUACAO_OPTIONS.map((o) => (
                <label key={o.value} className="inline-flex items-center gap-1.5 text-sm">
                  <input
                    type="checkbox"
                    checked={form.modelo_atuacao.includes(o.value)}
                    onChange={() => {
                      const next = form.modelo_atuacao.includes(o.value)
                        ? form.modelo_atuacao.filter((x) => x !== o.value)
                        : [...form.modelo_atuacao, o.value]
                      update({ modelo_atuacao: next })
                    }}
                  />
                  {o.label}
                </label>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              <label>
                <span className="text-sm text-gray-600">Capacidade/semana</span>
                <input
                  type="number"
                  min={0}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={form.capacidade_semana === '' ? '' : form.capacidade_semana}
                  onChange={(e) => update({ capacidade_semana: e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0 })}
                />
              </label>
              <label>
                <span className="text-sm text-gray-600">Ticket médio (R$)</span>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={form.ticket_medio === '' ? '' : form.ticket_medio}
                  onChange={(e) => update({ ticket_medio: e.target.value === '' ? '' : parseFloat(e.target.value) || 0 })}
                />
              </label>
            </div>
            <label className="block mt-2">
              <span className="text-sm text-gray-600">Modelo de pagamento</span>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.modelo_pagamento}
                onChange={(e) => update({ modelo_pagamento: e.target.value })}
              >
                <option value="">Selecione</option>
                {getOptionsForProfileField('modelo_pagamento', form.profile_type || null).map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Canais e rotina</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {CANAIS_OPTIONS.map((o) => (
                <label key={o.value} className="inline-flex items-center gap-1.5 text-sm">
                  <input
                    type="checkbox"
                    checked={form.canais_principais.includes(o.value)}
                    onChange={() => {
                      const next = form.canais_principais.includes(o.value)
                        ? form.canais_principais.filter((x) => x !== o.value)
                        : [...form.canais_principais, o.value]
                      update({ canais_principais: next })
                    }}
                  />
                  {o.label}
                </label>
              ))}
            </div>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Resumo da rotina atual</span>
              <textarea
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.rotina_atual_resumo}
                onChange={(e) => update({ rotina_atual_resumo: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-600">Frequência de postagem</span>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.frequencia_postagem}
                onChange={(e) => update({ frequencia_postagem: e.target.value })}
              />
            </label>
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <label>
              <span className="text-sm font-semibold text-gray-700">Observações para o Noel</span>
              <textarea
                rows={3}
                maxLength={1500}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.observacoes}
                onChange={(e) => update({ observacoes: e.target.value })}
              />
              <span className="text-xs text-gray-400">{form.observacoes.length}/1500</span>
            </label>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Salvar perfil'}
            </button>
          </div>
        </form>
      </div>
    </YladaAreaShell>
  )
}

/**
 * Diagnóstico do profissional — heurísticas baseadas em perfil.
 * Função pura: sem banco, sem IA.
 */

import type { ProfileInput, ProfessionalDiagnosis } from './types'

const LANG = {
  pt: {
    fallback_blocker: 'Falta de conversas qualificadas',
    fallback_focus: 'Iniciar conversas com uma ferramenta simples',
    fallback_why: 'Quanto mais conversas qualificadas, mais previsibilidade você ganha.',
    agenda_blocker: 'Agenda instável ou pouca previsibilidade',
    agenda_focus: 'Gerar mais conversas qualificadas esta semana',
    agenda_why: 'Previsibilidade vem de volume constante de conversas.',
    conversao_blocker: 'Pouca conversão de interessados em consultas',
    conversao_focus: 'Qualificar melhor quem demonstra interesse',
    conversao_why: 'Conversão melhora quando você qualifica antes de abordar.',
    autoridade_blocker: 'Baixa percepção de autoridade na sua área',
    autoridade_focus: 'Aumentar percepção de valor com conteúdo estratégico',
    autoridade_why: 'Autoridade atrai quem já está buscando solução.',
    volume_blocker: 'Pouco volume de contatos iniciados',
    volume_focus: 'Aumentar o número de conversas iniciadas',
    volume_why: 'Volume gera oportunidades. Qualidade filtra depois.',
  },
  en: {
    fallback_blocker: 'Lack of qualified conversations',
    fallback_focus: 'Start conversations with a simple tool',
    fallback_why: 'The more qualified conversations, the more predictability you gain.',
    agenda_blocker: 'Unstable schedule or low predictability',
    agenda_focus: 'Generate more qualified conversations this week',
    agenda_why: 'Predictability comes from consistent volume of conversations.',
    conversao_blocker: 'Low conversion of interested people into consultations',
    conversao_focus: 'Better qualify those who show interest',
    conversao_why: 'Conversion improves when you qualify before approaching.',
    autoridade_blocker: 'Low perception of authority in your area',
    autoridade_focus: 'Increase perceived value with strategic content',
    autoridade_why: 'Authority attracts those already seeking a solution.',
    volume_blocker: 'Low volume of contacts initiated',
    volume_focus: 'Increase the number of conversations started',
    volume_why: 'Volume generates opportunities. Quality filters afterward.',
  },
  es: {
    fallback_blocker: 'Falta de conversaciones calificadas',
    fallback_focus: 'Iniciar conversaciones con una herramienta simple',
    fallback_why: 'Cuantas más conversaciones calificadas, más predictibilidad obtienes.',
    agenda_blocker: 'Agenda inestable o poca predictibilidad',
    agenda_focus: 'Generar más conversaciones calificadas esta semana',
    agenda_why: 'La predictibilidad viene del volumen constante de conversaciones.',
    conversao_blocker: 'Poca conversión de interesados en consultas',
    conversao_focus: 'Calificar mejor a quienes muestran interés',
    conversao_why: 'La conversión mejora cuando calificas antes de abordar.',
    autoridade_blocker: 'Baja percepción de autoridad en tu área',
    autoridade_focus: 'Aumentar percepción de valor con contenido estratégico',
    autoridade_why: 'La autoridad atrae a quienes ya buscan solución.',
    volume_blocker: 'Poco volumen de contactos iniciados',
    volume_focus: 'Aumentar el número de conversaciones iniciadas',
    volume_why: 'El volumen genera oportunidades. La calidad filtra después.',
  },
} as const

type LangKey = keyof typeof LANG

function getLang(profile: ProfileInput): LangKey {
  const l = profile.language?.toLowerCase()
  if (l === 'en' || l === 'es') return l
  return 'pt'
}

function normalize(str: string): string {
  return str.toLowerCase().trim()
}

function hasProfileData(profile: ProfileInput): boolean {
  return !!(
    profile.profile_type ||
    profile.profession ||
    profile.dor_principal ||
    profile.objetivo ||
    profile.area_profissional
  )
}

/**
 * Retorna diagnóstico estratégico do profissional baseado no perfil.
 */
export function getProfessionalDiagnosis(profile: ProfileInput): ProfessionalDiagnosis {
  const lang = getLang(profile)
  const t = LANG[lang]

  if (!profile || !hasProfileData(profile)) {
    return {
      blocker: t.fallback_blocker,
      focus: t.fallback_focus,
      why: t.fallback_why,
      tone: 'balanced',
      summary_lines: [
        t.fallback_blocker,
        t.fallback_focus,
      ],
    }
  }

  const dor = normalize(profile.dor_principal ?? '')
  const prof = normalize(profile.profession ?? profile.area_profissional ?? profile.profile_type ?? '')
  const obj = normalize(profile.objetivo ?? 'captar')

  let blocker = t.fallback_blocker
  let focus = t.fallback_focus
  let why = t.fallback_why

  // Agenda / previsibilidade
  if (/agenda|agenda_vazia|agenda_instavel|previsibilidade/.test(dor) || /medico|nutri|dentista|psi|coach|clinica/.test(prof)) {
    blocker = t.agenda_blocker
    focus = t.agenda_focus
    why = t.agenda_why
  }
  // Conversão
  else if (/conversao|nao_converte|followup|sem_leads|sem_indicacao/.test(dor) || /vendedor|vendas|seller/.test(prof)) {
    blocker = t.conversao_blocker
    focus = t.conversao_focus
    why = t.conversao_why
  }
  // Autoridade / posicionamento
  else if (/autoridade|posicionamento|nao_postar|marca/.test(dor)) {
    blocker = t.autoridade_blocker
    focus = t.autoridade_focus
    why = t.autoridade_why
  }
  // Volume
  else if (obj === 'captar' || /volume|sem_leads/.test(dor)) {
    blocker = t.volume_blocker
    focus = t.volume_focus
    why = t.volume_why
  }

  const summary_lines: string[] = [
    blocker,
    focus,
    why,
  ].slice(0, 3)

  return {
    blocker,
    focus,
    why,
    tone: 'balanced',
    summary_lines,
  }
}

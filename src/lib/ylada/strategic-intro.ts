/**
 * Camada StrategicIntro — bloco de continuidade antes da primeira pergunta.
 * Aumenta taxa de conclusão, cria sensação de método e padroniza a entrada em qualquer fluxo.
 * Texto adaptativo por contexto (single strategy, captar, educar/reter, vendas) e por perfil estratégico (dominantPain).
 * @see docs/ANALISE-PROMPT-CAMADA-DECISAO-SERGIO.md
 */

import type { StrategicProfile } from './strategic-profile'

export interface StrategicIntroContent {
  title: string
  subtitle: string
  micro: string
}

export interface StrategicIntroContext {
  /** Single = recomendação automática (1 card); inferido por safety_mode quando não persistido. */
  strategySlot?: 'single' | 'qualidade' | 'volume'
  safety_mode?: boolean
  objective?: string
  area_profissional?: string
  /** Perfil estratégico derivado (meta.strategic_profile); adapta subtítulo por dor dominante. */
  strategic_profile?: StrategicProfile | null
  /** Tema do link (ex.: emagrecimento); quando presente, intro é voltada ao visitante/paciente. */
  theme_raw?: string
  /** Título da página (ex.: "Diagnóstico de Saúde — emagrecimento"). */
  page_title?: string
  /** Arquitetura do link (ex.: RISK_DIAGNOSIS); quando presente, força intro voltada ao visitante no diagnóstico. */
  architecture?: string
  /** Número de perguntas do quiz (para "Responda N perguntas"); quando ausente, usa "poucos minutos". */
  questions_count?: number
}

/**
 * Remove termos de objetivo profissional (captação de pacientes/clientes, marketing do consultório) do tema.
 * O paciente não deve ver isso no resultado — só o tema dele (ex.: cáries, saúde bucal).
 */
export function sanitizeThemeForPatient(theme: string): string {
  if (!theme) return ''
  let t = theme.trim()
  // Remove prefixo "Diagnóstico de " para evitar redundância (ex.: "Indícios em Diagnóstico de X" → "Indícios em X")
  t = t.replace(/^diagnóstico\s+de\s+/i, '').trim() || t
  const toRemove = [
    /\s+e\s+atra[çc][ãa]o\s+de\s+pacientes/gi,
    /\s+e\s+atra[çc][ãa]o\s+de\s+clientes/gi,
    /\s+e\s+capta[çc][ãa]o\s+(de\s+)?(pacientes|clientes)?/gi,
    /\s+e\s+captar\s+(pacientes|clientes)/gi,
    /\s*,\s*atra[çc][ãa]o\s+de\s+pacientes/gi,
    /\s*,\s*atra[çc][ãa]o\s+de\s+clientes/gi,
    /\s*,\s*capta[çc][ãa]o/gi,
  ]
  for (const re of toRemove) {
    t = t.replace(re, '')
  }
  return t.replace(/\s+e\s*$/, '').replace(/\s*,\s*$/, '').trim() || theme.trim()
}

/** Formata o título da página para exibição: vírgula → " e ", primeira letra maiúscula. */
export function formatDisplayTitle(raw: string): string {
  if (!raw) return ''
  const t = raw.trim()
  const normalized = t.replace(/\s*,\s*/g, ' e ')
  return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase()
}

/**
 * Título voltado ao paciente quando o link guarda prefixo técnico (ex.: "Diagnóstico de Saúde — emagrecimento").
 * Se o profissional editar só o trecho após " — ", ou o título inteiro, isso passa a ser o que importa para a intro.
 */
const TECHNICAL_PAGE_TITLE_PREFIX_RE =
  /raio-?x|diagnóstico de bloqueios|diagnóstico de saúde|diagnostico de bloqueios|diagnostico de saude/i

export function patientFacingTitleFromStoredPageTitle(pageTitleRaw: string): string {
  const raw = (pageTitleRaw ?? '').trim()
  if (!raw) return ''
  if (TECHNICAL_PAGE_TITLE_PREFIX_RE.test(raw) && raw.includes(' — ')) {
    const suffix = raw.split(' — ').slice(1).join(' — ').trim()
    return suffix || raw
  }
  return raw
}

/** Capitaliza a primeira letra para coerência visual (ex.: "saúde intestinal" → "Saúde intestinal"). */
function capitalizeFirst(s: string): string {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** Formata o tema para exibição — primeira letra maiúscula, coerente em toda a interface. */
function formatThemeLabel(theme: string): string {
  if (!theme) return ''
  const t = theme.toLowerCase().trim()
  let label: string
  if (/emagrecimento|perda de peso|perda de peso, emagrecimento/.test(t)) label = 'jornada de emagrecimento'
  else if (/intestino|intestinal/.test(t)) label = 'saúde intestinal'
  else if (/energia/.test(t)) label = 'energia'
  else if (/ansiedade/.test(t)) label = 'ansiedade'
  else if (/bem-estar/.test(t)) label = 'bem-estar'
  else if (/saúde|saude/.test(t)) label = 'saúde'
  else if (/peso/.test(t)) label = 'peso'
  else if (/alimentação|alimentacao/.test(t)) label = 'alimentação'
  else if (/pele|skincare|estética|celulite|flacidez|manchas/.test(t)) label = 'sua pele'
  else if (/unha|unhas|manicure|nail/.test(t)) label = 'saúde das unhas'
  else if (/cabelo|capilar|calvície|calvicie|queda de cabelo/.test(t)) label = 'seu cabelo'
  else if (/perfume|fragrância|fragrancia|olfativo|perfumaria/.test(t)) label = 'perfil olfativo'
  else label = theme.trim()
  return capitalizeFirst(label)
}

/** Subtítulo persuasivo com gatilhos mentais (curiosidade, baixo esforço, benefício personalizado). */
function getPatientQuizSubtitle(theme: string, questionsCount?: number): string {
  const n = typeof questionsCount === 'number' && questionsCount > 0 ? questionsCount : 0
  const introQuiz = n > 0 ? `Responda ${n} pergunta${n > 1 ? 's' : ''} e receba` : 'Em poucos minutos, você recebe'
  if (/intestino|intestinal/.test(theme)) {
    return `Descubra o que seu intestino está tentando te dizer. ${introQuiz} um diagnóstico personalizado com o próximo passo.`
  }
  if (/emagrecimento|peso|perda/.test(theme)) {
    return `Descubra o que está impedindo seu resultado. ${introQuiz} um diagnóstico personalizado com o próximo passo.`
  }
  if (/energia/.test(theme)) {
    return n > 0
      ? `Descubra o que está drenando sua energia. ${introQuiz} um diagnóstico personalizado em menos de 2 minutos.`
      : 'Descubra o que está drenando sua energia. Diagnóstico personalizado em menos de 2 minutos.'
  }
  if (/ansiedade/.test(theme)) {
    return 'Entenda melhor o que está acontecendo. Diagnóstico personalizado e próximos passos em poucos minutos.'
  }
  if (/pele|skincare|estética|celulite|flacidez|manchas|hidratação da pele|idade real da pele/.test(theme)) {
    return n > 0
      ? `Descubra o que sua pele está pedindo. ${introQuiz} um diagnóstico personalizado com orientações específicas.`
      : 'Descubra o que sua pele está pedindo. Diagnóstico personalizado com orientações específicas em poucos minutos.'
  }
  if (/perfume|fragrância|fragrancia|olfativo|perfumaria|perfil olfativo/.test(theme)) {
    return n > 0
      ? `Descubra qual fragrância combina com você. ${introQuiz} seu perfil olfativo personalizado.`
      : 'Descubra qual fragrância combina com você. Seu perfil olfativo em poucos minutos.'
  }
  return `Descubra em minutos o que está acontecendo com você. ${introQuiz} um diagnóstico personalizado com o próximo passo.`
}

/**
 * Retorna título, subtítulo e micro para o bloco de intro antes da primeira pergunta.
 * Regras adaptativas por contexto; linguagem estratégica, nunca clínica.
 * Para links de paciente (emagrecimento, saúde): intro voltada ao visitante.
 */
export function getStrategicIntro(context: StrategicIntroContext): StrategicIntroContent {
  const theme = (context.theme_raw ?? '').toString().trim().toLowerCase()
  const pageTitle = (context.page_title ?? '').toString().trim()
  const pageTitleLower = pageTitle.toLowerCase()
  const arch = (context.architecture ?? '').toString().trim()
  const isPatientDiagnosisFlow = arch === 'RISK_DIAGNOSIS' || arch === 'BLOCKER_DIAGNOSIS'
  const isPatientQuiz =
    isPatientDiagnosisFlow ||
    /emagrecimento|perda de peso|intestino|energia|ansiedade|bem-estar|saúde|saude|peso|alimentação|alimentacao|pele|skincare|estética|estetica|celulite|flacidez|manchas|hidratação da pele|hidratacao da pele|idade real da pele|unha|unhas|manicure|nail|cabelo|capilar|calvície|calvicie|queda de cabelo|perfume|fragrância|fragrancia|olfativo|perfumaria|perfil olfativo/.test(
      pageTitleLower
    ) ||
    /emagrecimento|perda de peso|intestino|energia|ansiedade|bem-estar|saúde|peso|alimentação|pele|skincare|estética|celulite|flacidez|manchas|hidratação da pele|idade real da pele|unha|unhas|manicure|nail|cabelo|capilar|calvície|calvicie|queda de cabelo|perfume|fragrância|fragrancia|olfativo|perfumaria|perfil olfativo/.test(
      theme
    )

  if (isPatientQuiz) {
    const themeLabel = formatThemeLabel(theme)
    const visibleBase = patientFacingTitleFromStoredPageTitle(pageTitle)
    const sanitizedPageTitle = visibleBase ? formatDisplayTitle(visibleBase) : ''
    const isPerfumaria = /perfume|fragrância|fragrancia|olfativo|perfumaria/.test(theme)
    const title =
      sanitizedPageTitle ||
      (isPerfumaria ? 'Descubra seu perfil olfativo' : themeLabel ? `Quiz: Como está sua ${themeLabel}?` : 'Quiz: Como está sua saúde?')
    const subtitle = getPatientQuizSubtitle(theme, context.questions_count)
    return {
      title,
      subtitle,
      micro: 'Leva menos de 2 minutos.',
    }
  }

  const objective = (context.objective ?? 'captar').toString().trim().toLowerCase()
  const area = (context.area_profissional ?? '').toString().trim().toLowerCase()
  const isSingle =
    context.strategySlot === 'single' || (context.safety_mode === true && !context.strategySlot)

  const strategic = context.strategic_profile
  const pain = strategic?.dominantPain

  // Caso 1 — Single strategy (recomendação automática)
  if (isSingle) {
    const subtitleByPain: Record<string, string> = {
      agenda: 'Vamos organizar sua captação para gerar consultas com previsibilidade.',
      posicionamento: 'Vamos estruturar seu posicionamento para atrair pacientes certos.',
      conversao: 'Vamos melhorar sua conversão de interesse em consultas reais.',
      autoridade: 'Vamos fortalecer sua autoridade para atrair quem precisa de você.',
    }
    return {
      title: 'Estratégia recomendada ativada.',
      subtitle: (pain && subtitleByPain[pain]) ?? 'Vamos organizar sua captação para transformar interesse em consultas reais.',
      micro: 'Leva menos de 2 minutos.',
    }
  }

  // Caso 2 — Educar / reter
  if (objective === 'educar' || objective === 'reter') {
    return {
      title: 'Vamos mapear oportunidades.',
      subtitle: 'Suas respostas nos ajudam a indicar os próximos passos.',
      micro: 'É rápido.',
    }
  }

  // Caso 3 — Vendas / representantes
  if (/venda|vendedor|representante|comercial/.test(area)) {
    return {
      title: 'Vamos organizar sua captação.',
      subtitle:
        'Estruture seu processo para gerar mais conversas e mais fechamento.',
      micro: 'Responda com foco no seu objetivo atual.',
    }
  }

  // Caso 4 — Duas estratégias (usuário escolheu) / captar
  if (objective === 'captar') {
    const subtitleByPain: Record<string, string> = {
      agenda: 'Em poucos passos, você terá clareza para preencher sua agenda com previsibilidade.',
      posicionamento: 'Em poucos passos, você terá clareza para atrair os pacientes certos.',
      conversao: 'Em poucos passos, você terá clareza para converter interesse em consultas.',
      autoridade: 'Em poucos passos, você terá clareza para se posicionar com autoridade.',
    }
    return {
      title: 'Vamos estruturar sua estratégia.',
      subtitle: (pain && subtitleByPain[pain]) ?? 'Em poucos passos, você terá clareza para agir com precisão.',
      micro: 'Responda de forma objetiva.',
    }
  }

  // Fallback
  return {
    title: 'Vamos começar.',
    subtitle: 'Responda rapidamente para receber sua estratégia.',
    micro: 'Leva menos de 2 minutos.',
  }
}

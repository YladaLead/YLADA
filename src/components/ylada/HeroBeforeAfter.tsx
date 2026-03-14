/**
 * Bloco "Antes / Depois" para hero de compreensão imediata.
 * Mostra a diferença entre conversa sem contexto e com YLADA.
 * Objetivo: visitante entender em menos de 5 segundos.
 */

import type { Language } from '@/lib/i18n'

export type HeroBeforeAfterArea =
  | 'med'
  | 'psi'
  | 'odonto'
  | 'nutri'
  | 'estetica'
  | 'fitness'
  | 'coach'
  | 'seller'
  | 'perfumaria'

const CONFIG: Record<
  HeroBeforeAfterArea,
  {
    quoteSemContexto: string
    quoteComYlada: string
    bullet1ComYlada: string
    bullet3ComYlada: string
  }
> = {
  med: {
    quoteSemContexto: 'Doutor, pode me orientar?',
    quoteComYlada: 'Respondi a avaliação sobre estresse. Podemos conversar sobre isso?',
    bullet1ComYlada: 'Paciente já refletiu sobre sintomas',
    bullet3ComYlada: 'Consulta mais qualificada',
  },
  psi: {
    quoteSemContexto: 'Pode me orientar?',
    quoteComYlada: 'Respondi a avaliação sobre ansiedade. Podemos conversar sobre isso?',
    bullet1ComYlada: 'Cliente já refletiu sobre sintomas',
    bullet3ComYlada: 'Consulta mais qualificada',
  },
  odonto: {
    quoteSemContexto: 'Doutor, pode me orientar?',
    quoteComYlada: 'Respondi a avaliação sobre saúde bucal. Podemos conversar sobre isso?',
    bullet1ComYlada: 'Paciente já refletiu sobre sintomas',
    bullet3ComYlada: 'Consulta mais qualificada',
  },
  nutri: {
    quoteSemContexto: 'Pode me orientar?',
    quoteComYlada: 'Respondi a avaliação sobre alimentação. Podemos conversar sobre isso?',
    bullet1ComYlada: 'Paciente já refletiu sobre sintomas',
    bullet3ComYlada: 'Consulta mais qualificada',
  },
  estetica: {
    quoteSemContexto: 'Pode me orientar?',
    quoteComYlada: 'Respondi a avaliação sobre o procedimento. Podemos conversar sobre isso?',
    bullet1ComYlada: 'Cliente já refletiu sobre interesses',
    bullet3ComYlada: 'Atendimento mais qualificado',
  },
  fitness: {
    quoteSemContexto: 'Pode me orientar?',
    quoteComYlada: 'Respondi a avaliação sobre treino. Podemos conversar sobre isso?',
    bullet1ComYlada: 'Aluno já refletiu sobre objetivos',
    bullet3ComYlada: 'Atendimento mais qualificado',
  },
  coach: {
    quoteSemContexto: 'Pode me orientar?',
    quoteComYlada: 'Respondi a avaliação sobre bem-estar. Podemos conversar sobre isso?',
    bullet1ComYlada: 'Cliente já refletiu sobre interesses',
    bullet3ComYlada: 'Sessão mais qualificada',
  },
  seller: {
    quoteSemContexto: 'Pode me orientar?',
    quoteComYlada: 'Respondi a avaliação. Podemos conversar sobre as opções?',
    bullet1ComYlada: 'Cliente já refletiu sobre necessidades',
    bullet3ComYlada: 'Conversa mais qualificada',
  },
  perfumaria: {
    quoteSemContexto: 'Pode me orientar?',
    quoteComYlada: 'Respondi a avaliação de perfil olfativo. Podemos conversar sobre isso?',
    bullet1ComYlada: 'Cliente já refletiu sobre preferências',
    bullet3ComYlada: 'Atendimento mais qualificado',
  },
}

const CONFIG_EN: Record<HeroBeforeAfterArea, { quoteSemContexto: string; quoteComYlada: string; bullet1ComYlada: string; bullet3ComYlada: string }> = {
  med: { quoteSemContexto: 'Doctor, can you guide me?', quoteComYlada: 'I answered the stress assessment. Can we talk about it?', bullet1ComYlada: 'Patient already reflected on symptoms', bullet3ComYlada: 'More qualified consultation' },
  psi: { quoteSemContexto: 'Can you guide me?', quoteComYlada: 'I answered the anxiety assessment. Can we talk about it?', bullet1ComYlada: 'Client already reflected on symptoms', bullet3ComYlada: 'More qualified consultation' },
  odonto: { quoteSemContexto: 'Doctor, can you guide me?', quoteComYlada: 'I answered the oral health assessment. Can we talk about it?', bullet1ComYlada: 'Patient already reflected on symptoms', bullet3ComYlada: 'More qualified consultation' },
  nutri: { quoteSemContexto: 'Can you guide me?', quoteComYlada: 'I answered the nutrition assessment. Can we talk about it?', bullet1ComYlada: 'Patient already reflected on symptoms', bullet3ComYlada: 'More qualified consultation' },
  estetica: { quoteSemContexto: 'Can you guide me?', quoteComYlada: 'I answered the procedure assessment. Can we talk about it?', bullet1ComYlada: 'Client already reflected on interests', bullet3ComYlada: 'More qualified service' },
  fitness: { quoteSemContexto: 'Can you guide me?', quoteComYlada: 'I answered the training assessment. Can we talk about it?', bullet1ComYlada: 'Student already reflected on goals', bullet3ComYlada: 'More qualified service' },
  coach: { quoteSemContexto: 'Can you guide me?', quoteComYlada: 'I answered the wellness assessment. Can we talk about it?', bullet1ComYlada: 'Client already reflected on interests', bullet3ComYlada: 'More qualified session' },
  seller: { quoteSemContexto: 'Can you guide me?', quoteComYlada: 'I answered the assessment. Can we talk about the options?', bullet1ComYlada: 'Client already reflected on needs', bullet3ComYlada: 'More qualified conversation' },
  perfumaria: { quoteSemContexto: 'Can you guide me?', quoteComYlada: 'I answered the olfactory profile assessment. Can we talk about it?', bullet1ComYlada: 'Client already reflected on preferences', bullet3ComYlada: 'More qualified service' },
}

const CONFIG_ES: Record<HeroBeforeAfterArea, { quoteSemContexto: string; quoteComYlada: string; bullet1ComYlada: string; bullet3ComYlada: string }> = {
  med: { quoteSemContexto: 'Doctor, ¿puede orientarme?', quoteComYlada: 'Respondí la evaluación sobre estrés. ¿Podemos hablar de eso?', bullet1ComYlada: 'Paciente ya reflexionó sobre síntomas', bullet3ComYlada: 'Consulta más cualificada' },
  psi: { quoteSemContexto: '¿Puede orientarme?', quoteComYlada: 'Respondí la evaluación sobre ansiedad. ¿Podemos hablar de eso?', bullet1ComYlada: 'Cliente ya reflexionó sobre síntomas', bullet3ComYlada: 'Consulta más cualificada' },
  odonto: { quoteSemContexto: 'Doctor, ¿puede orientarme?', quoteComYlada: 'Respondí la evaluación sobre salud bucal. ¿Podemos hablar de eso?', bullet1ComYlada: 'Paciente ya reflexionó sobre síntomas', bullet3ComYlada: 'Consulta más cualificada' },
  nutri: { quoteSemContexto: '¿Puede orientarme?', quoteComYlada: 'Respondí la evaluación sobre alimentación. ¿Podemos hablar de eso?', bullet1ComYlada: 'Paciente ya reflexionó sobre síntomas', bullet3ComYlada: 'Consulta más cualificada' },
  estetica: { quoteSemContexto: '¿Puede orientarme?', quoteComYlada: 'Respondí la evaluación sobre el procedimiento. ¿Podemos hablar de eso?', bullet1ComYlada: 'Cliente ya reflexionó sobre intereses', bullet3ComYlada: 'Atención más cualificada' },
  fitness: { quoteSemContexto: '¿Puede orientarme?', quoteComYlada: 'Respondí la evaluación sobre entrenamiento. ¿Podemos hablar de eso?', bullet1ComYlada: 'Alumno ya reflexionó sobre objetivos', bullet3ComYlada: 'Atención más cualificada' },
  coach: { quoteSemContexto: '¿Puede orientarme?', quoteComYlada: 'Respondí la evaluación sobre bienestar. ¿Podemos hablar de eso?', bullet1ComYlada: 'Cliente ya reflexionó sobre intereses', bullet3ComYlada: 'Sesión más cualificada' },
  seller: { quoteSemContexto: '¿Puede orientarme?', quoteComYlada: 'Respondí la evaluación. ¿Podemos hablar de las opciones?', bullet1ComYlada: 'Cliente ya reflexionó sobre necesidades', bullet3ComYlada: 'Conversación más cualificada' },
  perfumaria: { quoteSemContexto: '¿Puede orientarme?', quoteComYlada: 'Respondí la evaluación de perfil olfativo. ¿Podemos hablar de eso?', bullet1ComYlada: 'Cliente ya reflexionó sobre preferencias', bullet3ComYlada: 'Atención más cualificada' },
}

const LABELS = {
  pt: { semContexto: 'Sem contexto', comYlada: 'Com YLADA', vagas: 'Conversas vagas', curiosos: 'Curiosos pedindo orientação', faltaClareza: 'Falta de clareza', contexto: 'Conversa começa com contexto' },
  en: { semContexto: 'No context', comYlada: 'With YLADA', vagas: 'Vague conversations', curiosos: 'Curious people asking for guidance', faltaClareza: 'Lack of clarity', contexto: 'Conversation starts with context' },
  es: { semContexto: 'Sin contexto', comYlada: 'Con YLADA', vagas: 'Conversaciones vagas', curiosos: 'Curiosos pidiendo orientación', faltaClareza: 'Falta de claridad', contexto: 'La conversación comienza con contexto' },
}

function getConfig(area: HeroBeforeAfterArea, locale: Language) {
  if (locale === 'en') return CONFIG_EN[area]
  if (locale === 'es') return CONFIG_ES[area]
  return CONFIG[area]
}

type Props = {
  area: HeroBeforeAfterArea
  locale?: Language
}

export function HeroBeforeAfter({ area, locale = 'pt' }: Props) {
  const c = getConfig(area, locale)
  const L = LABELS[locale]
  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 1: Sem contexto */}
            <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-6">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {L.semContexto}
              </p>
              <blockquote className="text-gray-700 italic mb-4 pl-3 border-l-2 border-gray-300">
                &quot;{c.quoteSemContexto}&quot;
              </blockquote>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-red-500">❌</span>
                  {L.vagas}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">❌</span>
                  {L.curiosos}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">❌</span>
                  {L.faltaClareza}
                </li>
              </ul>
            </div>

            {/* Card 2: Com YLADA */}
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50/30 p-6">
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-3">
                {L.comYlada}
              </p>
              <blockquote className="text-gray-800 italic mb-4 pl-3 border-l-2 border-blue-400">
                &quot;{c.quoteComYlada}&quot;
              </blockquote>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✔</span>
                  {c.bullet1ComYlada}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✔</span>
                  {L.contexto}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✔</span>
                  {c.bullet3ComYlada}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

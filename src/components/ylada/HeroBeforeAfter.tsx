/**
 * Bloco "Antes / Depois" para hero de compreensão imediata.
 * Mostra a diferença entre conversa sem contexto e com YLADA.
 * Objetivo: visitante entender em menos de 5 segundos.
 */

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

type Props = {
  area: HeroBeforeAfterArea
}

export function HeroBeforeAfter({ area }: Props) {
  const c = CONFIG[area]
  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 1: Sem contexto */}
            <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-6">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Sem contexto
              </p>
              <blockquote className="text-gray-700 italic mb-4 pl-3 border-l-2 border-gray-300">
                &quot;{c.quoteSemContexto}&quot;
              </blockquote>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-red-500">❌</span>
                  Conversas vagas
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">❌</span>
                  Curiosos pedindo orientação
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">❌</span>
                  Falta de clareza
                </li>
              </ul>
            </div>

            {/* Card 2: Com YLADA */}
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50/30 p-6">
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-3">
                Com YLADA
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
                  Conversa começa com contexto
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

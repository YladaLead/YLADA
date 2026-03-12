/**
 * Seção "Casos de Uso" para landing pages de profissionais.
 * Mostra 3 situações reais onde o profissional usaria o YLADA.
 * Aumenta conversão ao fazer o visitante pensar: "Eu usaria assim no meu dia."
 */

export type UseCasesArea =
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
  UseCasesArea,
  {
    title: string
    subtitle: string
    card1Title: string
    card1Text: string
    card2Text: string
    card3Text: string
  }
> = {
  med: {
    title: 'Como médicos usam o YLADA no dia a dia',
    subtitle: 'Avaliações simples que ajudam a iniciar conversas mais claras com pacientes.',
    card1Title: 'Antes da primeira consulta',
    card1Text: 'O médico compartilha uma avaliação rápida. O paciente responde antes do contato. Quando a conversa começa, o médico já entende sintomas e preocupações iniciais.',
    card2Text: 'O médico publica o link da avaliação. Pacientes curiosos respondem. Quem realmente precisa de orientação acaba iniciando uma conversa.',
    card3Text: 'Quando alguém pede orientação, o médico envia a avaliação. Isso ajuda o paciente a refletir e iniciar uma conversa mais organizada.',
  },
  psi: {
    title: 'Como psicólogos usam o YLADA no dia a dia',
    subtitle: 'Avaliações simples que ajudam a iniciar conversas mais claras com clientes.',
    card1Title: 'Antes da primeira consulta',
    card1Text: 'O psicólogo compartilha uma avaliação rápida. O cliente responde antes do contato. Quando a conversa começa, o profissional já entende sintomas, interesses ou preocupações.',
    card2Text: 'O profissional publica o link da avaliação. Pessoas curiosas respondem. Quem realmente precisa de ajuda acaba iniciando conversa.',
    card3Text: 'Quando alguém pede orientação, o profissional envia a avaliação. Isso ajuda a organizar a conversa desde o início.',
  },
  odonto: {
    title: 'Como dentistas usam o YLADA no dia a dia',
    subtitle: 'Avaliações simples que ajudam a iniciar conversas mais claras com pacientes.',
    card1Title: 'Antes da primeira consulta',
    card1Text: 'O dentista compartilha uma avaliação rápida. O paciente responde antes do contato. Quando a conversa começa, o profissional já entende sintomas e preocupações iniciais.',
    card2Text: 'O dentista publica o link da avaliação. Pacientes curiosos respondem. Quem realmente precisa de orientação acaba iniciando uma conversa.',
    card3Text: 'Quando alguém pede orientação, o dentista envia a avaliação. Isso ajuda o paciente a refletir e iniciar uma conversa mais organizada.',
  },
  nutri: {
    title: 'Como nutricionistas usam o YLADA no dia a dia',
    subtitle: 'Avaliações simples que ajudam a iniciar conversas mais claras com pacientes.',
    card1Title: 'Antes da primeira consulta',
    card1Text: 'O nutricionista compartilha uma avaliação rápida. O paciente responde antes do contato. Quando a conversa começa, o profissional já entende sintomas, interesses ou preocupações.',
    card2Text: 'O profissional publica o link da avaliação. Pessoas curiosas respondem. Quem realmente precisa de ajuda acaba iniciando conversa.',
    card3Text: 'Quando alguém pede orientação, o nutricionista envia a avaliação. Isso ajuda a organizar a conversa desde o início.',
  },
  estetica: {
    title: 'Como profissionais de estética usam o YLADA no dia a dia',
    subtitle: 'Avaliações simples que ajudam a iniciar conversas mais claras com clientes.',
    card1Title: 'Antes do primeiro atendimento',
    card1Text: 'O profissional compartilha uma avaliação rápida. O cliente responde antes do contato. Quando a conversa começa, o profissional já entende interesses e preocupações.',
    card2Text: 'O profissional publica o link da avaliação. Pessoas curiosas respondem. Quem realmente precisa de ajuda acaba iniciando conversa.',
    card3Text: 'Quando alguém pede orientação, o profissional envia a avaliação. Isso ajuda a organizar a conversa desde o início.',
  },
  fitness: {
    title: 'Como profissionais de fitness usam o YLADA no dia a dia',
    subtitle: 'Avaliações simples que ajudam a iniciar conversas mais claras com alunos.',
    card1Title: 'Antes da primeira aula',
    card1Text: 'O profissional compartilha uma avaliação rápida. O aluno responde antes do contato. Quando a conversa começa, o profissional já entende objetivos e preocupações.',
    card2Text: 'O profissional publica o link da avaliação. Pessoas curiosas respondem. Quem realmente precisa de ajuda acaba iniciando conversa.',
    card3Text: 'Quando alguém pede orientação, o profissional envia a avaliação. Isso ajuda a organizar a conversa desde o início.',
  },
  coach: {
    title: 'Como coaches usam o YLADA no dia a dia',
    subtitle: 'Avaliações simples que ajudam a iniciar conversas mais claras com clientes.',
    card1Title: 'Antes da primeira sessão',
    card1Text: 'O coach compartilha uma avaliação rápida. O cliente responde antes do contato. Quando a conversa começa, o profissional já entende interesses e preocupações.',
    card2Text: 'O coach publica o link da avaliação. Pessoas curiosas respondem. Quem realmente precisa de ajuda acaba iniciando conversa.',
    card3Text: 'Quando alguém pede orientação, o coach envia a avaliação. Isso ajuda a organizar a conversa desde o início.',
  },
  seller: {
    title: 'Como vendedores usam o YLADA no dia a dia',
    subtitle: 'Avaliações simples que ajudam a iniciar conversas mais claras com clientes.',
    card1Title: 'Antes do primeiro contato',
    card1Text: 'O vendedor compartilha uma avaliação rápida. O cliente responde antes do contato. Quando a conversa começa, o profissional já entende necessidades e interesses.',
    card2Text: 'O vendedor publica o link da avaliação. Pessoas curiosas respondem. Quem realmente precisa de ajuda acaba iniciando conversa.',
    card3Text: 'Quando alguém pede orientação, o vendedor envia a avaliação. Isso ajuda a organizar a conversa desde o início.',
  },
  perfumaria: {
    title: 'Como consultores de perfumaria usam o YLADA no dia a dia',
    subtitle: 'Avaliações simples que ajudam a iniciar conversas mais claras com clientes.',
    card1Title: 'Antes do primeiro atendimento',
    card1Text: 'O consultor compartilha uma avaliação rápida. O cliente responde antes do contato. Quando a conversa começa, o profissional já entende preferências e necessidades.',
    card2Text: 'O consultor publica o link da avaliação. Pessoas curiosas respondem. Quem realmente precisa de ajuda acaba iniciando conversa.',
    card3Text: 'Quando alguém pede orientação, o consultor envia a avaliação. Isso ajuda a organizar a conversa desde o início.',
  },
}

type Props = {
  area: UseCasesArea
}

export function UseCasesSection({ area }: Props) {
  const c = CONFIG[area]
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            {c.title}
          </h2>
          <p className="text-gray-700 text-center mb-10">
            {c.subtitle}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-3">
                {c.card1Title}
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                {c.card1Text}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-3">
                Nas redes sociais
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                {c.card2Text}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-3">
                No WhatsApp
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                {c.card3Text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

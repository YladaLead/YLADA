/**
 * Três quizzes clássicos de recrutamento (Wellness / área YLADA), no mesmo formato dos
 * outros links diagnóstico YLADA: perguntas + resultado (API de diagnóstico + fallback
 * estático em config.result). Alinhados aos previews em @/components/wellness-previews/quizzes.
 */
import type { FluxoCliente } from '@/types/wellness-system'

export const proLideresRecruitmentQuizFluxos: FluxoCliente[] = [
  {
    id: 'quiz-recrut-ganhos-prosperidade',
    nome: 'Quiz: Ganhos e Prosperidade',
    objetivo:
      'Descobrir o potencial para ganhos e prosperidade e abrir conversa com quem partilhou o link.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você sente que seu estilo de vida atual permite ganhar mais e prosperar financeiramente?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Não, sinto que preciso de novas oportunidades para prosperar',
          'Parcialmente, mas vejo potencial para ganhar muito mais',
          'Bastante, mas sempre há espaço para crescimento',
          'Sim, estou muito satisfeito com minha situação financeira',
        ],
      },
      {
        id: 'p2',
        texto: 'Você está aberto(a) para conhecer oportunidades que podem melhorar sua situação financeira?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Sim, estou muito aberto(a) para novas oportunidades!',
          'Sim, gostaria de conhecer opções que podem me ajudar',
          'Talvez, se for algo que realmente faça sentido',
          'Não, prefiro manter minha situação atual',
        ],
      },
      {
        id: 'p3',
        texto: 'Você valoriza ter liberdade financeira e tempo para dedicar às coisas que realmente importam?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Muito, é um dos meus maiores objetivos',
          'Bastante, gostaria de ter mais liberdade',
          'Moderadamente, seria interessante',
          'Pouco, não é uma prioridade para mim',
        ],
      },
      {
        id: 'p4',
        texto: 'Você acredita que pode criar uma renda adicional trabalhando com algo que também melhora a vida das pessoas?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Sim, acredito muito nessa possibilidade!',
          'Sim, gostaria de conhecer como isso funciona',
          'Talvez, se for algo confiável e comprovado',
          'Não, não acredito nisso',
        ],
      },
      {
        id: 'p5',
        texto: 'Você está interessado(a) em conversar com quem te enviou este quiz sobre oportunidades de crescimento?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Sim, estou muito interessado(a) em saber mais!',
          'Sim, gostaria de entender melhor as oportunidades',
          'Talvez, se for algo que realmente possa me ajudar',
          'Não, não tenho interesse no momento',
        ],
      },
    ],
    diagnostico: {
      titulo: 'Alto Potencial para Ganhos e Prosperidade',
      descricao:
        'Com base nas respostas, faz sentido conversar com quem te enviou o link para explorar oportunidades alinhadas aos teus objetivos.',
      sintomas: ['Abertura a novas oportunidades', 'Interesse em crescimento e flexibilidade'],
      beneficios: ['Conversa personalizada', 'Caminhos simples e duplicáveis', 'Produtos de bem-estar'],
      mensagemPositiva:
        'Pessoas com o teu perfil costumam ter bons resultados quando encontram o modelo certo — fala com quem te partilhou este diagnóstico.',
    },
    kitRecomendado: 'energia',
    cta: 'Quero saber mais',
    tags: ['quiz', 'ganhos', 'prosperidade', 'recrutamento'],
  },
  {
    id: 'quiz-recrut-potencial-crescimento',
    nome: 'Quiz: Potencial e Crescimento',
    objetivo:
      'Mapear potencial de crescimento pessoal e profissional e estimular o próximo passo com quem enviou o link.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você sente que seu potencial está sendo bem aproveitado atualmente?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Não, sinto que tenho muito mais potencial não explorado',
          'Parcialmente, mas vejo muito espaço para crescimento',
          'Bastante, mas sempre posso melhorar',
          'Sim, sinto que estou aproveitando bem meu potencial',
        ],
      },
      {
        id: 'p2',
        texto: 'Você está aberto(a) para conhecer caminhos que podem ajudar você a alcançar seu máximo potencial?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Sim, estou muito interessado(a) em descobrir!',
          'Sim, gostaria de conhecer opções de crescimento',
          'Talvez, se for algo que realmente me ajude',
          'Não, prefiro manter como está',
        ],
      },
      {
        id: 'p3',
        texto: 'Você valoriza ter suporte e mentoria para acelerar seu crescimento pessoal e profissional?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Muito, é essencial para meu crescimento',
          'Bastante, acredito que faria diferença',
          'Moderadamente, pode ser útil',
          'Pouco, prefiro fazer sozinho(a)',
        ],
      },
      {
        id: 'p4',
        texto: 'Você acredita que pode crescer trabalhando com algo que também ajuda outras pessoas a melhorarem de vida?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Sim, acredito muito nessa possibilidade!',
          'Sim, gostaria de entender como isso funciona',
          'Talvez, se for algo genuíno e comprovado',
          'Não, não acredito nisso',
        ],
      },
      {
        id: 'p5',
        texto: 'Você está interessado(a) em conversar com quem te enviou este quiz sobre seu potencial de crescimento?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Sim, estou muito interessado(a) em saber mais!',
          'Sim, gostaria de entender melhor as possibilidades',
          'Talvez, se for algo que realmente possa me ajudar',
          'Não, não tenho interesse no momento',
        ],
      },
    ],
    diagnostico: {
      titulo: 'Alto Potencial para Crescimento',
      descricao:
        'As tuas respostas indicam abertura para desenvolvimento — uma conversa com quem partilhou o link pode acelerar o próximo passo.',
      sintomas: ['Vontade de crescer', 'Interesse em suporte e mentoria'],
      beneficios: ['Clareza sobre caminhos', 'Modelo com propósito', 'Flexibilidade'],
      mensagemPositiva:
        'Quem te enviou o quiz pode ajudar a traduzir esse potencial em ação — envia uma mensagem quando fizer sentido.',
    },
    kitRecomendado: 'energia',
    cta: 'Quero saber mais',
    tags: ['quiz', 'potencial', 'crescimento', 'recrutamento'],
  },
  {
    id: 'quiz-recrut-proposito-equilibrio',
    nome: 'Quiz: Propósito e Equilíbrio',
    objetivo:
      'Avaliar alinhamento com propósito e equilíbrio e convidar à conversa com quem enviou o link.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você sente que seu dia a dia está alinhado com seus sonhos e propósito de vida?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Não, sinto que estou muito distante dos meus sonhos',
          'Parcialmente, mas gostaria de estar mais alinhado',
          'Bastante, mas sempre posso melhorar o equilíbrio',
          'Sim, sinto que estou muito alinhado com meu propósito',
        ],
      },
      {
        id: 'p2',
        texto: 'Você está aberto(a) para conhecer caminhos que podem te ajudar a viver mais alinhado com seu propósito?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Sim, estou muito interessado(a) em descobrir!',
          'Sim, gostaria de conhecer opções que me ajudem',
          'Talvez, se for algo que realmente faça sentido',
          'Não, prefiro manter como está',
        ],
      },
      {
        id: 'p3',
        texto: 'Você valoriza ter equilíbrio entre vida pessoal, profissional e tempo para o que realmente importa?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Muito, é um dos meus maiores objetivos',
          'Bastante, gostaria de ter mais equilíbrio',
          'Moderadamente, seria interessante',
          'Pouco, não é uma prioridade para mim',
        ],
      },
      {
        id: 'p4',
        texto: 'Você acredita que pode viver seu propósito trabalhando com algo que também transforma a vida de outras pessoas?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Sim, acredito muito nessa possibilidade!',
          'Sim, gostaria de entender como isso funciona',
          'Talvez, se for algo genuíno e significativo',
          'Não, não acredito nisso',
        ],
      },
      {
        id: 'p5',
        texto: 'Você está interessado(a) em conversar com quem te enviou este quiz sobre propósito e equilíbrio?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Sim, estou muito interessado(a) em saber mais!',
          'Sim, gostaria de entender melhor as possibilidades',
          'Talvez, se for algo que realmente possa me ajudar',
          'Não, não tenho interesse no momento',
        ],
      },
    ],
    diagnostico: {
      titulo: 'Alto Potencial para Propósito e Equilíbrio',
      descricao:
        'Há espaço para alinhar rotina, significado e flexibilidade — falar com quem partilhou o link costuma ser o melhor próximo passo.',
      sintomas: ['Busca de significado', 'Desejo de mais equilíbrio'],
      beneficios: ['Visão de caminhos possíveis', 'Modelo flexível', 'Impacto nas pessoas'],
      mensagemPositiva:
        'Uma conversa simples pode mostrar como unir propósito e resultado prático — fala com quem te enviou o diagnóstico.',
    },
    kitRecomendado: 'energia',
    cta: 'Quero saber mais',
    tags: ['quiz', 'propósito', 'equilíbrio', 'recrutamento'],
  },
]

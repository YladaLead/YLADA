/**
 * Quizzes de recrutamento Pro Líderes (contexto equipe Herbalife / oportunidade de negócio).
 * Copy focada em perfil e conversa — sem tom clínico nem kit de bem-estar no resultado.
 * Tag `pro-lideres` ativa disclaimer e textos de UI específicos em FluxoDiagnostico.
 * Resultado no link público: RISK_DIAGNOSIS + pacotes `ylada_flow_diagnosis_outcomes` (via preset).
 *
 * Idioma: português do Brasil (você, equipe, compartilhar — não usar PT de Portugal neste arquivo).
 *
 * Ordem das opções (sempre 4 por pergunta): índice 0 = menos aberto / mais fechado → 3 = mais aberto.
 * O motor de diagnóstico soma os índices: soma mais alta → arquétipo `urgente` (copy de maior motivação).
 */
import type { FluxoCliente } from '@/types/wellness-system'

export const proLideresRecruitmentQuizFluxos: FluxoCliente[] = [
  {
    id: 'quiz-recrut-ganhos-prosperidade',
    nome: 'Quiz: Ganhos e Prosperidade',
    objetivo:
      'Descobrir o potencial para ganhos e prosperidade e abrir conversa com quem compartilhou o link.',
    perguntas: [
      {
        id: 'p1',
        texto:
          'Nos últimos meses, como você se sente em relação ao dinheiro e ao ritmo que seu dia a dia exige?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Razoavelmente estável; não sinto urgência de mudar nada grande.',
          'Não está ruim, mas gostaria de mais folga ou de ganhar mais sem sacrificar ainda mais horas.',
          'Sinto que o esforço não corresponde ao que sobra pra mim no fim do mês.',
          'Sinto aperto ou vontade forte de criar outra fonte de renda com mais controle.',
        ],
      },
      {
        id: 'p2',
        texto:
          'Se existisse forma de explorar renda extra com flexibilidade, sem largar o que você tem hoje, o que mais faz sentido pra você?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Agora não faz sentido; não estou procurando nada nesse sentido.',
          'Talvez; depende do que é, do tempo exigido e de quão transparente for.',
          'Faz sentido ouvir com calma; tenho dúvidas mas quero entender sem compromisso.',
          'Faz sentido explorar; quero ver como outras pessoas começaram em paralelo.',
        ],
      },
      {
        id: 'p3',
        texto: 'O que mais pesa neste momento em relação a trabalho e renda?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Pouco ou nada; me sinto equilibrado(a) nesse aspecto.',
          'Falta de tempo pra família, saúde ou projetos pessoais.',
          'Pouca margem de decisão ou sensação de estagnação no que faço.',
          'Cansaço com a rotina e sensação de esforço alto com retorno que parece pequeno.',
        ],
      },
      {
        id: 'p4',
        texto:
          'Como você encara a ideia de construir algo em paralelo que também ajude outras pessoas (hábitos, bem-estar)?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Desconfio ou não me imagino nesse tipo de papel.',
          'Pode fazer sentido, mas só com provas reais, regras claras e zero “promessa fácil”.',
          'Faz sentido se houver equipe, formação e caminho definido.',
          'Acredito nisso e quero ver se encaixa na minha vida com ética e consistência.',
        ],
      },
      {
        id: 'p5',
        texto: 'Falar com quem te enviou este quiz sobre o próximo passo e o modelo — como você vê isso agora?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Não faz sentido pra mim neste momento.',
          'Talvez mais tarde, se o contexto mudar.',
          'Faz sentido uma conversa breve pra ver encaixe e tirar dúvidas.',
          'Faz sentido falar em breve pra alinhar expectativas e entender o que pede tempo na prática.',
        ],
      },
    ],
    diagnostico: {
      titulo: 'Perfil com margem para prosperar com mais intenção',
      descricao:
        'Pelas respostas, há espaço pra clarificar números, tempo e possibilidades — uma conversa com quem te enviou o link costuma ser o atalho mais honesto.',
      sintomas: ['Tensão entre esforço e resultado', 'Curiosidade sobre flexibilidade e renda extra'],
      beneficios: [
        'Mapa realista do que o modelo pede no começo',
        'Exemplos de quem começou em paralelo ao emprego',
        'Próximo passo alinhado ao seu ritmo, sem pressão solta',
      ],
      mensagemPositiva:
        'Muita gente só precisa entender o bloqueio certo e o formato do apoio — o quiz já mostrou onde vale aprofundar na conversa.',
    },
    kitRecomendado: 'energia',
    cta: 'Quero conhecer novas oportunidades',
    tags: ['quiz', 'ganhos', 'prosperidade', 'recrutamento', 'pro-lideres'],
  },
  {
    id: 'quiz-recrut-potencial-crescimento',
    nome: 'Quiz: Potencial e Crescimento',
    objetivo:
      'Mapear potencial de crescimento pessoal e profissional e estimular o próximo passo com quem enviou o link.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você sente que seu potencial está sendo bem aproveitado no dia a dia?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Sim; sinto que uso bem o que sei e o contexto ajuda.',
          'Razoável; há espaço mas também alguma frustração.',
          'Sinto que poderia dar mais valor, mas o contexto limita ou desmotiva.',
          'Sinto muito potencial pra explorar e vontade de crescer com direção.',
        ],
      },
      {
        id: 'p2',
        texto:
          'Caminhos novos de crescimento — com metas, mentoria e grupo — encaixam onde pra você nesta fase da vida?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Não procuro isso; prefiro manter o foco onde já estou.',
          'Talvez, se for algo sério e compatível com pouco tempo livre.',
          'Quero ver opções com suporte; não quero “inventar tudo” sozinho.',
          'Quero ativamente encontrar onde investir energia com guia e clareza.',
        ],
      },
      {
        id: 'p3',
        texto: 'Apoio regular de quem já percorreu o caminho (mentoria, equipe) — o que é verdade pra você?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Prefiro autonomia quase total; pouco apoio contínuo.',
          'Ajuda pontual já ajuda; não preciso de acompanhamento denso.',
          'Faria grande diferença ter guia nas primeiras fases e depois ritmo próprio.',
          'Mentoria, treino e cultura de equipe são decisivos pra eu avançar.',
        ],
      },
      {
        id: 'p4',
        texto: 'Crescer profissionalmente num projeto que também melhore a vida de outras pessoas soa pra você…',
        tipo: 'multipla_escolha',
        opcoes: [
          'Pouco ou nada; não é o que me move neste momento.',
          'Possível, mas só se for genuíno, ético e sem pressão de resultado falso.',
          'Faz sentido; gostaria de ver casos reais e rotinas de quem já faz.',
          'Faz muito sentido; propósito pesa tanto quanto renda na decisão.',
        ],
      },
      {
        id: 'p5',
        texto: 'Sobre falar com quem te enviou o quiz sobre seu potencial e o próximo passo prático:',
        tipo: 'multipla_escolha',
        opcoes: [
          'Não é prioridade pra mim agora.',
          'Só se for algo muito objetivo e curto.',
          'Quero uma conversa simples pra ver se o encaixe faz sentido.',
          'Quero avançar em breve com clareza de suporte, ritmo e expectativas.',
        ],
      },
    ],
    diagnostico: {
      titulo: 'Perfil com tração para crescer com propósito',
      descricao:
        'As respostas apontam vontade de desenvolvimento e valorização de caminho estruturado — vale alinhar com quem compartilhou o link o “como”, sem romper o que você já tem.',
      sintomas: ['Ambição de crescimento', 'Busca de suporte e modelo claro'],
      beneficios: [
        'Visão do onboarding e da mentoria na prática',
        'Exemplos de ritmo de trabalho e primeiras semanas',
        'Conversa focada no seu estilo de aprendizado',
      ],
      mensagemPositiva:
        'Potencial sem conversa honesta tende a ficar na lista de desejos — quem te enviou o quiz consegue traduzir isso em passos concretos.',
    },
    kitRecomendado: 'energia',
    cta: 'Quero conhecer novas oportunidades',
    tags: ['quiz', 'potencial', 'crescimento', 'recrutamento', 'pro-lideres'],
  },
  {
    id: 'quiz-recrut-proposito-equilibrio',
    nome: 'Quiz: Propósito e Equilíbrio',
    objetivo:
      'Avaliar alinhamento com propósito e equilíbrio e convidar à conversa com quem enviou o link.',
    perguntas: [
      {
        id: 'p1',
        texto:
          'Sua rotina de hoje te aproxima da vida que você quer daqui a dois ou três anos?',
        tipo: 'multipla_escolha',
        opcoes: [
          'No geral sim; me sinto alinhado(a) com prioridades e tempo.',
          'Tem partes boas e partes que eu gostaria de mudar aos poucos.',
          'Sinto distância entre o dia a dia e o que realmente valorizo.',
          'Sinto desalinhamento forte; quero reorganizar tempo, energia e sentido.',
        ],
      },
      {
        id: 'p2',
        texto:
          'Explorar caminhos que unam trabalho, tempo livre e significado — como você vê isso pra você neste momento?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Não estou procurando mudanças nesse eixo.',
          'Tenho curiosidade cautelosa; preciso de contexto real, não discurso.',
          'Quero ouvir histórias de quem reorganizou a rotina sem “largar tudo” de um dia pro outro.',
          'Quero ativamente encontrar um encaixe que una propósito, flexibilidade e sustentabilidade.',
        ],
      },
      {
        id: 'p3',
        texto: 'Equilíbrio entre vida pessoal, trabalho e energia pro que importa — onde você está?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Razoável; não é o tema que mais me tira o sono.',
          'Gostaria de melhorar; ainda não é urgência mas incomoda.',
          'É prioridade este ano; sinto que preciso de mudança estruturada.',
          'É prioridade urgente; sinto desgaste e falta de fôlego pra continuar igual.',
        ],
      },
      {
        id: 'p4',
        texto:
          'Viver com mais propósito num trabalho que também impacte positivamente outras pessoas — o que soa pra você?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Pouco; neste momento outros critérios pesam mais.',
          'Soa com ressalvas; quero ver exemplos concretos e limites realistas.',
          'Soa bem; quero entender como isso vira rotina semana a semana.',
          'Soa muito; é peça central em qualquer decisão profissional que eu considere.',
        ],
      },
      {
        id: 'p5',
        texto: 'Uma conversa com quem te convidou sobre propósito, flexibilidade e próximo passo — faz sentido?',
        tipo: 'multipla_escolha',
        opcoes: [
          'Não faz sentido pra mim nesta fase.',
          'Talvez mais tarde, quando eu tiver mais clareza pessoal.',
          'Faz sentido uma conversa breve e honesta sobre encaixe e limites.',
          'Faz sentido falar em breve com intenção de entender plano e ritmo realistas.',
        ],
      },
    ],
    diagnostico: {
      titulo: 'Perfil em busca de sentido e equilíbrio sustentável',
      descricao:
        'Pelas respostas, há tensão saudável entre o que você vive hoje e o que quer construir — falar com quem enviou o link ajuda a ver se um modelo flexível encaixa na sua definição de equilíbrio.',
      sintomas: ['Desejo de mais alinhamento', 'Foco em tempo e energia bem gastos'],
      beneficios: [
        'Exemplos de rotina de quem concilia família, trabalho e projeto paralelo',
        'Transparência sobre flexibilidade e expectativas iniciais',
        'Conversa centrada nos seus valores, não em promessa vazia',
      ],
      mensagemPositiva:
        'Reorganizar vida e trabalho com sentido costuma começar com uma conversa franca — o quiz já mostrou o tom do que te move.',
    },
    kitRecomendado: 'energia',
    cta: 'Quero conhecer novas oportunidades',
    tags: ['quiz', 'propósito', 'equilíbrio', 'recrutamento', 'pro-lideres'],
  },
]

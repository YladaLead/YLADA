/**
 * WELLNESS SYSTEM - Fluxos de Recrutamento
 * 
 * Fluxos para identificar e recrutar pessoas para apresentações de negócio
 */

import { FluxoCliente, PerfilRecrutamento } from '@/types/wellness-system'

// Perfis de Recrutamento
export const perfisRecrutamento = {
  'visionario-renda-funcional': {
    id: 'visionario-renda-funcional',
    nome: 'Perfil Visionário de Renda Funcional',
    idealPara: 'quem busca renda extra rápida ou novas oportunidades',
    caracteristicas: [
      'Mentalidade aberta a tendências',
      'Interesse por produtos de bem-estar',
      'Desejo de liberdade financeira',
      'Aceitação rápida de novas ideias'
    ],
    mensagemFinal: 'Pessoas com seu perfil costumam ter excelentes resultados com bebidas funcionais e modelos de renda simples e duplicáveis.'
  },
  'mae-flex-premium': {
    id: 'mae-flex-premium',
    nome: 'Perfil Mãe Flex Premium',
    idealPara: 'mães que querem flexibilidade e renda leve',
    caracteristicas: [
      'Rotina cheia',
      'Desejo de trabalhar em casa',
      'Busca por equilíbrio'
    ],
    mensagemFinal: 'Seu perfil combina com atividades leves, flexíveis e que geram renda no ritmo da família.'
  },
  'bem-estar-lucrativo': {
    id: 'bem-estar-lucrativo',
    nome: 'Perfil Bem-Estar Lucrativo',
    idealPara: 'pessoas que já consomem produtos saudáveis',
    caracteristicas: [
      'Interesse por saúde, energia ou metabolismo',
      'Gostam da categoria de bebidas funcionais',
      'Tendem a indicar naturalmente produtos que usam'
    ],
    mensagemFinal: 'Seu perfil é perfeito para trabalhar com produtos que você já aprecia e consome.'
  },
  'digital-renda-flexivel': {
    id: 'digital-renda-flexivel',
    nome: 'Perfil Digital de Renda Flexível',
    idealPara: 'quem quer vender pelo celular, sem estoque',
    caracteristicas: [
      'Apreço por tecnologia',
      'Prefere trabalho online',
      'Quer simplicidade'
    ],
    mensagemFinal: 'Seu perfil combina com modelos digitais de renda conectados ao mercado de bebidas funcionais.'
  },
  'consumidor-tendencia': {
    id: 'consumidor-tendencia',
    nome: 'Perfil Consumidor de Tendência — Potencial de Alta Conversão',
    idealPara: 'quem já consome Energia, Acelera ou bebidas funcionais',
    caracteristicas: [
      'Já conhece o produto',
      'Experiência com bebidas funcionais',
      'Afinidade natural com o mercado',
      'Potencial de conversão imediata'
    ],
    mensagemFinal: 'Quem já consome Energia/Acelera costuma ter um dos melhores resultados porque já conhece o produto, o sabor e os benefícios.'
  },
  'transicao-profissional': {
    id: 'transicao-profissional',
    nome: 'Perfil Em Transição — Alto Potencial de Renda Extra',
    idealPara: 'pessoas insatisfeitas no trabalho atual',
    caracteristicas: [
      'Busca por liberdade',
      'Desejo de flexibilidade',
      'Vontade de mudança',
      'Necessidade de renda paralela'
    ],
    mensagemFinal: 'Seu perfil mostra que você está em um dos melhores perfis para iniciar algo novo — principalmente se busca liberdade, flexibilidade e renda paralela.'
  },
  'resiliente-reativado': {
    id: 'resiliente-reativado',
    nome: 'Perfil Resiliente — Potencial Reativado',
    idealPara: 'quem já tentou outros negócios antes',
    caracteristicas: [
      'Experiência prévia em negócios',
      'Resiliência e persistência',
      'Busca por modelos guiados',
      'Abertura para recomeçar'
    ],
    mensagemFinal: 'Quem já tentou empreender antes geralmente se identifica muito com nosso modelo, porque aqui tudo é guiado, simples e com suporte.'
  },
  'digital-alta-afinidade': {
    id: 'digital-alta-afinidade',
    nome: 'Perfil Digital — Alta Afinidade com Trabalho Online',
    idealPara: 'quem quer trabalhar 100% digital e sem exposição',
    caracteristicas: [
      'Preferência por trabalho online',
      'Quer trabalhar só com links',
      'Sem necessidade de vender presencialmente',
      'Busca por discrição'
    ],
    mensagemFinal: 'Seu diagnóstico confirma que você pode ter ótimos resultados trabalhando de forma discreta e só com links, sem precisar aparecer nem vender presencialmente.'
  },
  'empreendedor-expansao': {
    id: 'empreendedor-expansao',
    nome: 'Perfil Empreendedor — Alto Potencial de Expansão Rápida',
    idealPara: 'quem já empreende (salões, clínicas, lojas, autônomos)',
    caracteristicas: [
      'Já tem negócio próprio',
      'Experiência com clientes',
      'Busca por renda complementar',
      'Potencial de escalabilidade'
    ],
    mensagemFinal: 'Seu diagnóstico mostrou um dos perfis mais desejados no mercado: empreendedor com público próprio. Isso permite resultados rápidos e escaláveis.'
  },
  'emagrecimento-ativo': {
    id: 'emagrecimento-ativo',
    nome: 'Perfil Emagrecimento Ativo — Potencial de Resultado e Renda',
    idealPara: 'quem quer emagrecer e busca renda extra',
    caracteristicas: [
      'Foco em emagrecimento',
      'Interesse em saúde e bem-estar',
      'Busca por resultados rápidos',
      'Abertura para renda paralela'
    ],
    mensagemFinal: 'Seu diagnóstico revelou que você tem um dos perfis que mais aceleram resultados com bebidas funcionais — e ainda permite criar renda extra.'
  },
  'comunicador-imediato': {
    id: 'comunicador-imediato',
    nome: 'Perfil Comunicador — Potencial Imediato',
    idealPara: 'pessoas boas de venda, comunicativas e comerciais',
    caracteristicas: [
      'Habilidade de comunicação',
      'Facilidade em vender',
      'Gosto por falar com pessoas',
      'Potencial de resultado rápido'
    ],
    mensagemFinal: 'Pessoas com seu perfil comunicativo têm resultados acima da média porque o projeto é simples, leve e baseado em indicação.'
  },
  'recomeco-acao-imediata': {
    id: 'recomeco-acao-imediata',
    nome: 'Perfil Recomeço — Potencial de Ação Imediata',
    idealPara: 'pessoas desempregadas, em transição ou sem renda',
    caracteristicas: [
      'Necessidade de renda imediata',
      'Disposição para recomeçar',
      'Busca por algo simples e acessível',
      'Potencial de ação rápida'
    ],
    mensagemFinal: 'Seu diagnóstico confirma que você tem exatamente o perfil que mais cresce nesse projeto — pessoas que estão recomeçando e precisam de algo real.'
  },
  'consumidor-inteligente': {
    id: 'consumidor-inteligente',
    nome: 'Perfil Consumidor Inteligente — Potencial de Benefícios e Ganhos',
    idealPara: 'quem quer transformar consumo em renda',
    caracteristicas: [
      'Já consome produtos saudáveis',
      'Interesse em economia e cashback',
      'Ganhar enquanto consome',
      'Busca por vantagens'
    ],
    mensagemFinal: 'Seu diagnóstico indica que você pode transformar o que já consome em benefícios, economia e renda extra — sem mudar nada na sua rotina.'
  },
  'empreendedor-moderno': {
    id: 'empreendedor-moderno',
    nome: 'Perfil Empreendedor Moderno — Alta Afinidade com Negócios de Tendência',
    idealPara: 'jovens que querem começar cedo e ter independência',
    caracteristicas: [
      'Idade jovem (18-30 anos)',
      'Afinidade com tecnologia',
      'Busca por liberdade e flexibilidade',
      'Interesse em negócios digitais'
    ],
    mensagemFinal: 'Seu diagnóstico confirma que você tem exatamente o perfil que mais cresce nesse projeto: jovens que querem começar cedo e construir renda com algo simples e moderno.'
  }
}

// Conclusões automáticas para recrutamento
export const conclusoesRecrutamento = [
  {
    id: 'conclusao-1',
    titulo: 'Você tem um perfil altamente compatível',
    mensagem: 'Você possui características muito alinhadas com microempreendedores que têm se destacado no mercado global de bebidas funcionais. Existe uma apresentação rápida explicando como esse modelo funciona na prática.',
    proximoPasso: 'Participar de uma apresentação rápida'
  },
  {
    id: 'conclusao-2',
    titulo: 'Seu perfil tem grande potencial',
    mensagem: 'Pessoas com seu perfil costumam ter ótimos resultados com atividades simples e leves ligadas a bebidas funcionais. Você pode participar de uma apresentação curta para entender o modelo.',
    proximoPasso: 'Agendar apresentação curta'
  },
  {
    id: 'conclusao-3',
    titulo: 'Você se encaixa na nova tendência de renda',
    mensagem: 'Com seu nível de disciplina, abertura e interesse por bem-estar, você tem forte potencial para atuar no setor de bebidas funcionais. Quer ver como funciona na prática?',
    proximoPasso: 'Ver apresentação prática'
  },
  {
    id: 'conclusao-4',
    titulo: 'Perfil ideal para renda flexível',
    mensagem: 'Seu perfil mostra que você combina com modelos de renda flexíveis, que se encaixam no seu estilo de vida. Há uma apresentação mostrando como esse mercado está crescendo no mundo inteiro.',
    proximoPasso: 'Assistir apresentação do mercado'
  }
]

// Fluxos de Recrutamento (estrutura similar aos fluxos de clientes)
export const fluxosRecrutamento: FluxoCliente[] = [
  {
    id: 'renda-extra-imediata',
    nome: 'Renda Extra Imediata',
    objetivo: 'Identificar pessoas que querem renda extra imediata e direcioná-las para apresentação de negócio.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você está buscando uma forma de complementar sua renda?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quão importante é ter uma renda extra para você?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Você já tentou outras formas de renda extra?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Estaria aberto(a) a conhecer uma oportunidade simples e duplicável?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Você tem interesse em produtos de bem-estar e saúde?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Visionário de Renda Funcional',
      descricao: 'Seu perfil mostra características muito alinhadas com pessoas que têm se destacado no mercado de bebidas funcionais.',
      sintomas: [
        'Busca por renda extra',
        'Abertura para novas oportunidades',
        'Interesse em bem-estar',
        'Disposição para aprender'
      ],
      beneficios: [
        'Modelo de renda simples e duplicável',
        'Trabalho flexível e online',
        'Produtos que você já pode usar',
        'Oportunidade de crescimento'
      ],
      mensagemPositiva: 'Pessoas com seu perfil costumam ter excelentes resultados com bebidas funcionais e modelos de renda simples e duplicáveis.'
    },
    kitRecomendado: 'energia', // Não é kit, mas mantém estrutura
    cta: 'Quero conhecer a oportunidade',
    tags: ['renda', 'oportunidade', 'negócio', 'flexível']
  },
  {
    id: 'maes-trabalhar-casa',
    nome: 'Mães que Querem Trabalhar de Casa',
    objetivo: 'Identificar mães que querem flexibilidade e renda trabalhando de casa.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você é mãe e gostaria de trabalhar de casa?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quão importante é ter flexibilidade de horário?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Você tem dificuldade de encontrar trabalho tradicional por causa dos filhos?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Estaria interessada em uma atividade que se encaixa no ritmo da família?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Você prefere trabalhar pelo celular ou computador?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Mãe Flex Premium',
      descricao: 'Seu perfil combina perfeitamente com atividades leves e flexíveis que geram renda no ritmo da família.',
      sintomas: [
        'Necessidade de flexibilidade',
        'Desejo de trabalhar em casa',
        'Busca por equilíbrio',
        'Preferência por trabalho online'
      ],
      beneficios: [
        'Trabalho totalmente flexível',
        'Sem necessidade de sair de casa',
        'Renda no seu ritmo',
        'Atividade leve e simples'
      ],
      mensagemPositiva: 'Seu perfil combina com atividades leves, flexíveis e que geram renda no ritmo da família.'
    },
    kitRecomendado: 'energia',
    cta: 'Quero conhecer essa oportunidade',
    tags: ['mães', 'casa', 'flexibilidade', 'família']
  },
  {
    id: 'ja-consome-bem-estar',
    nome: 'Já Consome Produtos de Bem-Estar',
    objetivo: 'Identificar pessoas que já consomem produtos saudáveis e podem trabalhar com o que gostam.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você já consome produtos de bem-estar, chás, detox ou energéticos naturais?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quão interessado(a) você está em produtos de saúde e energia?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Você costuma indicar produtos que você gosta para outras pessoas?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Já pensou em transformar seu consumo em uma oportunidade de renda?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Estaria aberto(a) a conhecer como funciona trabalhar com produtos que você já usa?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Bem-Estar Lucrativo',
      descricao: 'Seu perfil é perfeito para trabalhar com produtos que você já aprecia e consome.',
      sintomas: [
        'Interesse por produtos saudáveis',
        'Tendência a indicar produtos',
        'Apreço por bem-estar',
        'Abertura para oportunidades'
      ],
      beneficios: [
        'Trabalhar com produtos que você já usa',
        'Desconto nos seus produtos',
        'Renda indicando o que você gosta',
        'Oportunidade natural de crescimento'
      ],
      mensagemPositiva: 'Seu perfil é perfeito para trabalhar com produtos que você já aprecia e consome.'
    },
    kitRecomendado: 'energia',
    cta: 'Quero saber mais sobre essa oportunidade',
    tags: ['bem-estar', 'produtos', 'consumo', 'renda']
  },
  {
    id: 'trabalhar-apenas-links',
    nome: 'Trabalhar Apenas com Links (Sem Estoque)',
    objetivo: 'Identificar pessoas que querem trabalhar pelo celular, sem precisar guardar produtos.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você prefere trabalhar pelo celular ou computador?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quão importante é não precisar guardar estoque?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Você mora em um espaço pequeno ou prefere não ter estoque?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Você gostaria de trabalhar apenas enviando links e mensagens?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Estaria interessado(a) em um modelo 100% digital?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Digital de Renda Flexível',
      descricao: 'Seu perfil combina com modelos digitais de renda conectados ao mercado de bebidas funcionais.',
      sintomas: [
        'Preferência por trabalho online',
        'Apreço por tecnologia',
        'Quer simplicidade',
        'Sem necessidade de estoque'
      ],
      beneficios: [
        'Trabalho 100% pelo celular',
        'Sem necessidade de estoque',
        'Modelo simples e digital',
        'Renda flexível e leve'
      ],
      mensagemPositiva: 'Seu perfil combina com modelos digitais de renda conectados ao mercado de bebidas funcionais.'
    },
    kitRecomendado: 'energia',
    cta: 'Quero conhecer esse modelo digital',
    tags: ['digital', 'links', 'sem-estoque', 'celular']
  },
  {
    id: 'ja-usa-energia-acelera',
    nome: 'Já Usa Energia e Acelera',
    objetivo: 'Identificar pessoas que já consomem Energia, Acelera ou bebidas funcionais similares e mostrar como transformar esse hábito em renda extra.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você já usa Energia, Acelera ou outras bebidas funcionais?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quão satisfeito(a) você está com os resultados?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Você já indicou essas bebidas para outras pessoas?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Já pensou em transformar seu consumo em uma oportunidade de renda?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Estaria aberto(a) a conhecer como funciona trabalhar com algo que você já usa?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Consumidor de Tendência — Potencial de Alta Conversão',
      descricao: 'Seu teste mostra que você já tem afinidade natural e experiência com bebidas funcionais — isso te coloca na frente de muita gente.',
      sintomas: [
        'Já conhece o produto',
        'Experiência com bebidas funcionais',
        'Afinidade natural com o mercado',
        'Potencial de conversão imediata'
      ],
      beneficios: [
        'Trabalhar com produtos que você já conhece',
        'Transformar seu consumo em renda',
        'Vantagem competitiva no mercado',
        'Resultados mais rápidos'
      ],
      mensagemPositiva: 'Quem já consome Energia/Acelera costuma ter um dos melhores resultados porque já conhece o produto, o sabor e os benefícios.'
    },
    kitRecomendado: 'energia',
    cta: 'Quero ver como funciona a oportunidade',
    tags: ['consumidor', 'energia', 'acelera', 'experiência']
  },
  {
    id: 'cansadas-trabalho-atual',
    nome: 'Cansadas do Trabalho Atual / Insatisfeitas',
    objetivo: 'Conectar com pessoas insatisfeitas no emprego, cansadas da rotina, sem reconhecimento ou que querem mudar de vida.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você tem pensado em mudar de trabalho ou criar uma renda paralela?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quão insatisfeito(a) você está com seu trabalho atual?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Você sente que precisa de mais liberdade e flexibilidade?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Estaria aberto(a) a conhecer uma oportunidade simples de renda paralela?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Você busca uma alternativa ao emprego tradicional?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Em Transição — Alto Potencial de Renda Extra',
      descricao: 'Seu teste indicou que você tem várias características ideais para criar renda extra no modelo que estou trabalhando.',
      sintomas: [
        'Busca por liberdade',
        'Desejo de flexibilidade',
        'Vontade de mudança',
        'Necessidade de renda paralela'
      ],
      beneficios: [
        'Renda paralela ao trabalho atual',
        'Liberdade e flexibilidade',
        'Modelo simples e guiado',
        'Oportunidade de crescimento'
      ],
      mensagemPositiva: 'Seu perfil mostra que você está em um dos melhores perfis para iniciar algo novo — principalmente se busca liberdade, flexibilidade e renda paralela.'
    },
    kitRecomendado: 'energia',
    cta: 'Quero conhecer essa oportunidade',
    tags: ['transição', 'trabalho', 'liberdade', 'mudança']
  },
  {
    id: 'ja-tentaram-outros-negocios',
    nome: 'Já Tentaram Outros Negócios',
    objetivo: 'Conectar com pessoas que já tentaram empreender antes, mas se frustraram, mostrando que este projeto é diferente: simples, guiado e com suporte.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você já tentou outros negócios ou projetos antes?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quão importante é ter suporte e orientação?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Você prefere modelos simples e guiados?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Estaria aberto(a) a conhecer um projeto diferente, com suporte completo?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Você ainda tem interesse em criar renda extra?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Resiliente — Potencial Reativado',
      descricao: 'Seu teste mostrou características que fazem muita diferença em negócios simples como o nosso — ainda mais pra quem já tentou antes.',
      sintomas: [
        'Experiência prévia em negócios',
        'Resiliência e persistência',
        'Busca por modelos guiados',
        'Abertura para recomeçar'
      ],
      beneficios: [
        'Modelo simples e guiado',
        'Suporte completo',
        'Ferramentas prontas',
        'Sem complicações'
      ],
      mensagemPositiva: 'Quem já tentou empreender antes geralmente se identifica muito com nosso modelo, porque aqui tudo é guiado, simples e com suporte.'
    },
    kitRecomendado: 'energia',
    cta: 'Quero conhecer esse modelo diferente',
    tags: ['resiliente', 'experiência', 'guiado', 'suporte']
  },
  {
    id: 'querem-trabalhar-digital',
    nome: 'Querem Trabalhar Só Digital / Online',
    objetivo: 'Conectar com pessoas que não querem vender presencialmente, preferem trabalhar apenas online, com links e sem exposição.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você prefere trabalhar apenas pela internet, sem vender presencialmente?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quão importante é trabalhar de forma discreta e sem exposição?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Você gostaria de trabalhar só com links e mensagens?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Estaria interessado(a) em um modelo 100% digital?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Você prefere não aparecer ou se expor?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Digital — Alta Afinidade com Trabalho Online',
      descricao: 'Seu teste indicou que você tem exatamente as características ideais para um projeto 100% digital.',
      sintomas: [
        'Preferência por trabalho online',
        'Quer trabalhar só com links',
        'Sem necessidade de vender presencialmente',
        'Busca por discrição'
      ],
      beneficios: [
        'Trabalho 100% digital',
        'Sem exposição',
        'Só com links e mensagens',
        'Modelo discreto e simples'
      ],
      mensagemPositiva: 'Seu diagnóstico confirma que você pode ter ótimos resultados trabalhando de forma discreta e só com links, sem precisar aparecer nem vender presencialmente.'
    },
    kitRecomendado: 'energia',
    cta: 'Quero conhecer esse modelo digital',
    tags: ['digital', 'online', 'links', 'discreto']
  },
  {
    id: 'ja-empreendem',
    nome: 'Já Empreendem (Salões, Clínicas, Lojas, Autônomos)',
    objetivo: 'Conectar com pessoas que já empreendem e mostrar que o projeto pode ser uma renda complementar perfeita, integrada ao negócio que já têm.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você já tem um negócio próprio (salão, clínica, loja, autônomo)?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quão interessado(a) você está em criar uma renda complementar?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Você já atende clientes regularmente?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Estaria aberto(a) a conhecer um modelo simples de renda paralela?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Você busca formas de aumentar seu faturamento?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Empreendedor — Alto Potencial de Expansão Rápida',
      descricao: 'Seu teste confirmou que empreendedores têm vantagem enorme nesse modelo — especialmente porque você já lida com pessoas.',
      sintomas: [
        'Já tem negócio próprio',
        'Experiência com clientes',
        'Busca por renda complementar',
        'Potencial de escalabilidade'
      ],
      beneficios: [
        'Renda complementar simples',
        'Integração com seu negócio atual',
        'Potencial de expansão rápida',
        'Modelo paralelo sem complicação'
      ],
      mensagemPositiva: 'Seu diagnóstico mostrou um dos perfis mais desejados no mercado: empreendedor com público próprio. Isso permite resultados rápidos e escaláveis.'
    },
    kitRecomendado: 'energia',
    cta: 'Quero conhecer essa renda complementar',
    tags: ['empreendedor', 'complementar', 'negócio', 'expansão']
  },
  {
    id: 'querem-emagrecer-renda',
    nome: 'Querem Emagrecer e Buscam Renda Extra',
    objetivo: 'Conectar com pessoas que estão buscando emagrecer, melhorar a saúde, e mostrar que podem emagrecer e ainda gerar renda com bebidas funcionais.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você está buscando emagrecer ou melhorar sua saúde?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quão importante é acelerar seus resultados?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Você já tentou outras formas de emagrecer?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Estaria interessado(a) em uma forma que acelera resultados e ainda gera renda?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Você busca uma solução prática e rápida?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Emagrecimento Ativo — Potencial de Resultado e Renda',
      descricao: 'Seu teste mostrou que você tem características muito favoráveis para emagrecer rápido com o modelo que usamos — e isso ainda pode virar uma renda paralela.',
      sintomas: [
        'Foco em emagrecimento',
        'Interesse em saúde e bem-estar',
        'Busca por resultados rápidos',
        'Abertura para renda paralela'
      ],
      beneficios: [
        'Acelerar resultados no emagrecimento',
        'Criar renda paralela',
        'Solução prática e rápida',
        'Modelo integrado'
      ],
      mensagemPositiva: 'Seu diagnóstico revelou que você tem um dos perfis que mais aceleram resultados com bebidas funcionais — e ainda permite criar renda extra.'
    },
    kitRecomendado: 'acelera',
    cta: 'Quero conhecer essa oportunidade',
    tags: ['emagrecimento', 'saúde', 'resultados', 'renda']
  },
  {
    id: 'boas-venda-comercial',
    nome: 'Boas de Venda / Comercial / Comunicativas',
    objetivo: 'Conectar com pessoas que sabem vender, gostam de falar com pessoas, têm habilidade comercial ou facilidade em indicar coisas.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você se considera bom(a) em falar com pessoas e comunicar?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quão confortável você se sente indicando produtos ou serviços?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Você já trabalhou com vendas ou atendimento?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Estaria interessado(a) em usar sua comunicação para gerar renda extra?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Você gosta de ajudar pessoas a encontrar soluções?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Comunicador — Potencial Imediato',
      descricao: 'Seu teste mostrou que sua habilidade de comunicação te coloca entre os perfis com maior chance de resultado rápido.',
      sintomas: [
        'Habilidade de comunicação',
        'Facilidade em vender',
        'Gosto por falar com pessoas',
        'Potencial de resultado rápido'
      ],
      beneficios: [
        'Usar sua comunicação para renda',
        'Resultados mais rápidos',
        'Modelo simples baseado em indicação',
        'Oportunidade de crescimento'
      ],
      mensagemPositiva: 'Pessoas com seu perfil comunicativo têm resultados acima da média porque o projeto é simples, leve e baseado em indicação.'
    },
    kitRecomendado: 'energia',
    cta: 'Quero conhecer essa oportunidade',
    tags: ['comunicativo', 'vendas', 'comercial', 'indicação']
  },
  {
    id: 'perderam-emprego-transicao',
    nome: 'Perderam o Emprego / Sem Renda / Em Transição',
    objetivo: 'Alcançar pessoas desempregadas, vivendo instabilidade financeira ou passando por transições profissionais, mostrando um caminho simples e acessível para gerar renda.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você está passando por uma transição profissional ou buscando uma nova fonte de renda?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quão importante é ter uma renda rápida e acessível agora?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Você está aberto(a) a começar algo novo e simples?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Estaria interessado(a) em um projeto que permite começar sem altos custos?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Você busca uma oportunidade real e acessível para recomeçar?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Recomeço — Potencial de Ação Imediata',
      descricao: 'Seu teste indicou características muito importantes para recomeçar com segurança — especialmente neste momento.',
      sintomas: [
        'Necessidade de renda imediata',
        'Disposição para recomeçar',
        'Busca por algo simples e acessível',
        'Potencial de ação rápida'
      ],
      beneficios: [
        'Começar sem altos custos',
        'Modelo simples e guiado',
        'Renda acessível e rápida',
        'Suporte completo para recomeçar'
      ],
      mensagemPositiva: 'Seu diagnóstico confirma que você tem exatamente o perfil que mais cresce nesse projeto — pessoas que estão recomeçando e precisam de algo real.'
    },
    kitRecomendado: 'energia',
    cta: 'Quero ver como funciona',
    tags: ['transição', 'recomeço', 'renda', 'acessível']
  },
  {
    id: 'transformar-consumo-renda',
    nome: 'Transformar o Próprio Consumo em Renda',
    objetivo: 'Conectar com pessoas que já consomem produtos saudáveis e mostrar que podem continuar consumindo e ainda gerar renda compartilhando links.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você já consome produtos saudáveis, bebidas funcionais ou suplementos?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quão interessado(a) você está em ganhar enquanto consome?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Você gostaria de ter economia, cashback ou bônus no que já compra?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Estaria aberto(a) a conhecer como transformar seu consumo em renda?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Você prefere ganhar apenas compartilhando links, sem vender?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Consumidor Inteligente — Potencial de Benefícios e Ganhos',
      descricao: 'Seu teste mostrou que você já tem o hábito que mais gera resultados nesse projeto: consumo inteligente.',
      sintomas: [
        'Já consome produtos saudáveis',
        'Interesse em economia e cashback',
        'Ganhar enquanto consome',
        'Busca por vantagens'
      ],
      beneficios: [
        'Ganhar consumindo o que já usa',
        'Economia e cashback',
        'Renda automática compartilhando links',
        'Sem necessidade de vender'
      ],
      mensagemPositiva: 'Seu diagnóstico indica que você pode transformar o que já consome em benefícios, economia e renda extra — sem mudar nada na sua rotina.'
    },
    kitRecomendado: 'energia',
    cta: 'Quero ver como funciona',
    tags: ['consumo', 'economia', 'cashback', 'renda']
  },
  {
    id: 'jovens-empreendedores',
    nome: 'Jovens Empreendedores / Começar Cedo',
    objetivo: 'Alcançar jovens (18-30 anos) que querem independência financeira, começar no digital, buscar liberdade e aprender a empreender cedo.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você tem entre 18 e 30 anos e busca independência financeira?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quão importante é ter liberdade e flexibilidade no trabalho?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Você prefere trabalhar pelo celular ou computador?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Estaria interessado(a) em um negócio digital simples e moderno?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Você quer começar cedo e construir algo próprio?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Empreendedor Moderno — Alta Afinidade com Negócios de Tendência',
      descricao: 'Seu teste mostrou potencial enorme por você ser jovem e ter afinidade com tecnologia.',
      sintomas: [
        'Idade jovem (18-30 anos)',
        'Afinidade com tecnologia',
        'Busca por liberdade e flexibilidade',
        'Interesse em negócios digitais'
      ],
      beneficios: [
        'Começar cedo no digital',
        'Liberdade e flexibilidade',
        'Modelo moderno e simples',
        'Construir renda própria'
      ],
      mensagemPositiva: 'Seu diagnóstico confirma que você tem exatamente o perfil que mais cresce nesse projeto: jovens que querem começar cedo e construir renda com algo simples e moderno.'
    },
    kitRecomendado: 'energia',
    cta: 'Quero começar cedo',
    tags: ['jovens', 'digital', 'liberdade', 'empreendedor']
  }
]

export function getFluxoRecrutamentoById(id: string): FluxoCliente | undefined {
  return fluxosRecrutamento.find(fluxo => fluxo.id === id)
}

export function getPerfilRecrutamentoById(id: PerfilRecrutamento) {
  return perfisRecrutamento[id]
}


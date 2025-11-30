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
  }
]

export function getFluxoRecrutamentoById(id: string): FluxoCliente | undefined {
  return fluxosRecrutamento.find(fluxo => fluxo.id === id)
}

export function getPerfilRecrutamentoById(id: PerfilRecrutamento) {
  return perfisRecrutamento[id]
}


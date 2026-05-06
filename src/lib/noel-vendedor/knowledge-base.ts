/**
 * Base de Conhecimento do NOEL Vendedor
 * Baseado na Lousa Oficial - Seções 6, 7 e 9
 */

export interface FAQResponse {
  acolhimento: string
  clareza: string
  beneficio: string
  proximoPasso: string
}

export interface Script {
  nome: string
  contexto: string
  mensagens: string[]
}

export const NOEL_FAQS: Record<string, FAQResponse> = {
  'o-que-e-wellness': {
    acolhimento: 'Ótima pergunta, isso é super comum.',
    clareza: 'O Wellness System é um sistema simples que te mostra o que fazer no dia a dia para ter mais foco, clareza e organização.',
    beneficio: 'Ele elimina a sensação de trabalhar perdido e te dá direção clara, todo dia.',
    proximoPasso: 'Se quiser, posso te explicar rapidamente como começar.',
  },
  'para-quem-e': {
    acolhimento: 'Legal você perguntar isso.',
    clareza: 'Ele é para pessoas que trabalham com bem-estar, bebidas funcionais ou atendimentos e querem clareza, foco e consistência.',
    beneficio: 'É perfeito para quem sente que poderia crescer mais, mas falta direção.',
    proximoPasso: 'Quer que eu te diga qual plano combina mais com seu momento?',
  },
  'o-que-ganho': {
    acolhimento: 'Entendi sua dúvida, é comum querer clareza antes de entrar.',
    clareza: 'Você tem orientação diária, materiais prontos, scripts, treinos curtos, suporte leve e a ajuda do NOEL para não travar nunca mais.',
    beneficio: 'Isso te dá ritmo, segurança e produtividade real no dia a dia.',
    proximoPasso: 'Posso te ajudar a entender qual plano faz mais sentido para você.',
  },
  'tem-garantia': {
    acolhimento: 'Claro! É importante ter segurança.',
    clareza: 'Sim, você tem 7 dias para usar e sentir a experiência.',
    beneficio: 'É tempo mais que suficiente para ver como ele organiza sua rotina.',
    proximoPasso: 'Quer que eu te mostre como ativar seu acesso?',
  },
  'diferenca-planos': {
    acolhimento: 'Ótima dúvida!',
    clareza: 'O plano mensal te dá acesso completo com renovação automática. O plano anual dá os mesmos recursos, mas com uma economia maior ao longo do ano.',
    beneficio: 'A maioria prefere o anual porque sai mais leve mês a mês.',
    proximoPasso: 'Quer que eu calcule qual ficaria melhor para o seu caso?',
  },
  'nao-recebi-acesso': {
    acolhimento: 'Fica tranquilo, isso é fácil de resolver.',
    clareza: 'O acesso geralmente chega em poucos minutos. Vale olhar também no spam ou promoções.',
    beneficio: 'Assim você não perde tempo e já começa hoje mesmo.',
    proximoPasso: 'Se quiser, me diga seu nome completo e eu confirmo aqui.',
  },
  'e-dificil-usar': {
    acolhimento: 'Entendo sua preocupação.',
    clareza: 'Não! O sistema foi criado exatamente para ser simples e direto. Tudo funciona com poucos passos.',
    beneficio: 'Você começa usando no mesmo dia, sem complicação.',
    proximoPasso: 'Posso te mostrar o primeiro passo se quiser.',
  },
  'nao-tenho-tempo': {
    acolhimento: 'Muita gente sente isso no início.',
    clareza: 'Você precisa de poucos minutos por dia para seguir o plano.',
    beneficio: 'O sistema foi criado justamente para encaixar na rotina corrida.',
    proximoPasso: 'Quer que eu te mostre como funciona a rotina diária?',
  },
  'nao-sei-vender': {
    acolhimento: 'Isso é mais comum do que você imagina.',
    clareza: 'O Wellness te entrega conversas prontas, scripts e caminhos simples para começar.',
    beneficio: 'Você não precisa ser experiente — basta seguir o passo a passo.',
    proximoPasso: 'Quer ver um exemplo de como o sistema orienta?',
  },
  'vale-a-pena': {
    acolhimento: 'É uma pergunta justa.',
    clareza: 'Se você quer clareza, foco e rotina organizada, sim — ele faz muita diferença.',
    beneficio: 'O sistema tira o peso de ter que adivinhar o que fazer.',
    proximoPasso: 'Posso te ajudar a escolher o plano ideal para você.',
  },
  'fidelidade-cancelar': {
    acolhimento: 'Boa pergunta!',
    clareza: 'O plano mensal renova automaticamente e você pode cancelar quando quiser. O anual é contratado por 12 meses.',
    beneficio: 'Assim você escolhe o modelo que cabe melhor no seu momento.',
    proximoPasso: 'Quer que eu compare os dois planos com você?',
  },
  'acessar-celular': {
    acolhimento: 'Sim! E é ótimo que você perguntou.',
    clareza: 'O sistema funciona direto no celular, sem complicação.',
    beneficio: 'Você consegue usar a qualquer momento da rotina.',
    proximoPasso: 'Quer que eu te mostre como acessar?',
  },
  'noel-responde-tudo': {
    acolhimento: 'Boa dúvida, muita gente pergunta isso.',
    clareza: 'Ele responde tudo do universo do sistema, rotina, clareza e dúvidas de uso — sempre dentro do que foi treinado.',
    beneficio: 'Assim você nunca fica perdido e avança com segurança.',
    proximoPasso: 'Quer testar uma pergunta agora?',
  },
}

export const NOEL_SCRIPTS: Record<string, Script> = {
  'primeiro-contato': {
    nome: 'Primeiro Contato',
    contexto: 'Quando a pessoa chega pelo link da página de vendas',
    mensagens: [
      'Oi! Que bom ter você aqui 😊 Como posso te ajudar sobre o Wellness System?',
      'Se quiser, posso te explicar rapidinho como ele facilita sua rotina no dia a dia.',
    ],
  },
  'explicacao-rapida': {
    nome: 'Explicação Rápida',
    contexto: 'Pedido de resumo',
    mensagens: [
      'Claro! Te explico rapidinho.',
      'O Wellness System te mostra o que fazer todos os dias para você ter mais clareza, foco e consistência — sem complicação.',
      'Ele tira a sensação de trabalhar perdido e te dá direção.',
      'Quer que eu te mostre como começar?',
    ],
  },
  'apresentacao-planos': {
    nome: 'Apresentação dos Planos',
    contexto: 'Explicar diferença entre mensal e anual',
    mensagens: [
      'Perfeito, vou te explicar de um jeito simples.',
      'O plano mensal dá acesso total com renovação. O anual também dá acesso total, só que com economia maior mês a mês.',
      'Muita gente escolhe o anual porque ele fica mais leve no orçamento.',
      'Posso ver qual deles combina mais com seu momento?',
    ],
  },
  'usuario-inseguro': {
    nome: 'Usuário Inseguro',
    contexto: 'Não sabe se é para ele',
    mensagens: [
      'É super normal ficar na dúvida.',
      'O sistema é para quem quer mais foco, organização e resultados trabalhando com bem-estar.',
      'Se você sente que às vezes fica perdido ou sem direção, ele ajuda muito.',
      'Quer que eu veja se faz sentido para você agora?',
    ],
  },
  'objecao-sem-tempo': {
    nome: 'Objeção: Não Tenho Tempo',
    contexto: 'Usuário diz que não tem tempo',
    mensagens: [
      'Entendo totalmente! A rotina é corrida mesmo.',
      'Você precisa só de alguns minutos por dia.',
      'Como o sistema te mostra exatamente o que fazer, você economiza tempo — em vez de tentar adivinhar.',
      'Quer que eu te mostre a rotina diária?',
    ],
  },
  'objecao-nao-sei-vender': {
    nome: 'Objeção: Não Sei Vender',
    contexto: 'Usuário inseguro sobre vendas',
    mensagens: [
      'Muita gente começa assim.',
      'O Wellness System te entrega conversas prontas, scripts simples e orientação diária.',
      'Você só copia e aplica — sem precisar ser experiente.',
      'Quer ver um exemplo?',
    ],
  },
  'objecao-caro': {
    nome: 'Objeção: É Caro',
    contexto: 'Usuário acha o valor alto',
    mensagens: [
      'Entendo sua preocupação.',
      'O valor é bem acessível pelo que entrega no dia a dia: clareza, foco, organização e segurança.',
      'Muita gente acaba economizando tempo e melhorando resultados justamente por ter esse direcionamento.',
      'Quer que eu te mostre a diferença entre os planos?',
    ],
  },
  'quase-fechamento': {
    nome: 'Quase Fechamento',
    contexto: 'Usuário já entendeu tudo',
    mensagens: [
      'Perfeito, acho que você já entendeu bem.',
      'O que importa agora é escolher o plano que fica melhor para o seu momento.',
      'Quer que eu te envie o link do plano mensal?',
    ],
  },
  'fechamento-final': {
    nome: 'Fechamento Final',
    contexto: 'Enviar link de compra (quando usuário não especificou qual plano)',
    mensagens: [
      'Prontinho! As novas assinaturas do Wellness são só no plano mensal (/pt/wellness/checkout?plan=monthly). Qualquer coisa que precisar, estou aqui contigo 😊',
    ],
  },
  'fechamento-anual': {
    nome: 'Fechamento - Plano Anual (indisponível)',
    contexto: 'Usuário pediu anual — redirecionar para mensal',
    mensagens: [
      'Hoje não estamos vendendo o plano anual para novas assinaturas — só o mensal, com o mesmo acesso total ao Wellness System. Clique aqui para o [plano mensal](/pt/wellness/checkout?plan=monthly)',
    ],
  },
  'fechamento-mensal': {
    nome: 'Fechamento - Plano Mensal',
    contexto: 'Enviar link do plano mensal',
    mensagens: [
      'Perfeito! O plano mensal te dá acesso completo com renovação automática. Você terá scripts personalizados baseados nos seus objetivos, IA integrada que vai conhecer você e se dedicar totalmente ao seu projeto, e um plano completo para construir sua carreira no marketing. Clique aqui para o [plano mensal](/pt/wellness/checkout?plan=monthly)',
    ],
  },
  'follow-up-leve': {
    nome: 'Follow-up Leve',
    contexto: 'Para quem sumiu',
    mensagens: [
      'Oi! Só passando para saber se ficou alguma dúvida sobre o Wellness System 😊',
      'Se quiser, posso te explicar rapidinho como funciona.',
    ],
  },
  'follow-up-quente': {
    nome: 'Follow-up Quente',
    contexto: 'Pessoa demonstrou interesse',
    mensagens: [
      'Oi! Vi que você estava olhando os planos. Quer que eu te ajude a escolher o ideal para você?',
    ],
  },
  'follow-up-final': {
    nome: 'Follow-up Final',
    contexto: '48-72h sem decisão',
    mensagens: [
      'Oi! Só passando para não deixar você parado. Se quiser entender como o sistema te dá mais clareza e foco no dia a dia, estou por aqui ✨',
    ],
  },
}

export const NOEL_CTAS = {
  gerais: [
    'Se quiser, posso te ajudar a escolher o plano ideal.',
    'Quer que eu te mostre como começar agora?',
    'Posso te explicar rapidamente como funciona a rotina diária.',
    'Quer ver um exemplo de como o sistema orienta você?',
    'Posso te mostrar a diferença entre os planos.',
    'Quer que eu calcule qual plano fica melhor para o seu momento?',
  ],
  decisao: [
    'Quer que eu te envie o link do plano mensal?',
    'Posso te ajudar a decidir agora.',
    'Quer ativar seu acesso e começar hoje mesmo?',
    'O próximo passo é escolher o plano — quer que eu abra aqui para você?',
  ],
  links: [
    'Aqui está o link do plano mensal: /pt/wellness/checkout?plan=monthly',
    'Quer o link do plano mensal? É só acessar: /pt/wellness/checkout?plan=monthly',
  ],
  whatsapp: [
    'Te envio o link agora?',
    'Quer começar pelo plano mensal?',
    'Posso te mostrar o primeiro passo rapidinho.',
    'Quer que eu deixe tudo pronto para você acessar?',
  ],
  valor: [
    'Se quiser, posso te mostrar como o sistema organiza sua rotina.',
    'Posso te explicar como o sistema evita que você trabalhe perdido.',
    'Quer entender como a rotina fica mais leve com o Wellness?',
  ],
  inseguro: [
    'Quer que eu veja se o sistema faz sentido para o seu momento?',
    'Posso te ajudar a entender se é a escolha certa para você.',
    'Quer que eu te mostre como ele pode facilitar o seu dia a dia?',
  ],
  suporteLeve: [
    'Quer que eu confirme seu acesso?',
    'Posso verificar seu nome aqui para você.',
    'Quer que eu te mostre onde acessar?',
    'Me avise se quiser que eu envie o link de acesso.',
  ],
  final: [
    'Prontinho… quando quiser, posso te ajudar a começar. É só me chamar 😊',
  ],
}

/**
 * WELLNESS SYSTEM - Scripts de Recrutamento
 * 
 * Scripts genéricos de recrutamento organizados por:
 * - Tipo de contato (conhecidos, pouco conhecidos, desconhecidos)
 * - Estilo de abordagem (direto, curiosidade, emocional, etc.)
 * - Momento da conversa (abertura, envio-link, pós-link, etc.)
 */

export type TipoContato = 'conhecidos' | 'pouco-conhecidos' | 'desconhecidos'
export type EstiloAbordagem = 'direto' | 'curiosidade' | 'emocional' | 'consultivo' | 'leve' | 'reconhecimento'
export type MomentoConversa = 
  | 'abertura' 
  | 'envio-link' 
  | 'pos-link' 
  | 'pos-diagnostico' 
  | 'convite-apresentacao' 
  | 'pos-apresentacao' 
  | 'objecoes' 
  | 'recuperacao' 
  | 'indicacoes'

export interface ScriptRecrutamento {
  id: string
  titulo: string
  conteudo: string
  tipoContato?: TipoContato
  estilo?: EstiloAbordagem
  momento: MomentoConversa
}

// Scripts Genéricos de Recrutamento
export const scriptsGenericosRecrutamento: ScriptRecrutamento[] = [
  // =====================================================
  // 1. ABERTURA - PESSOAS CONHECIDAS
  // =====================================================
  {
    id: 'abertura-conhecidos-direto',
    titulo: 'Abertura - Conhecidos (Direto)',
    conteudo: 'Oi, [NOME]! Eu estou com um projeto novo de renda extra com bebidas funcionais e lembrei de você. Posso te enviar uma avaliação rápida pra ver se faz sentido pro seu perfil? Leva menos de 1 minuto.',
    tipoContato: 'conhecidos',
    estilo: 'direto',
    momento: 'abertura'
  },
  {
    id: 'abertura-conhecidos-curiosidade',
    titulo: 'Abertura - Conhecidos (Curiosidade)',
    conteudo: '[NOME], estou usando uma avaliação que identifica perfis que combinam com a nova tendência das bebidas funcionais. Lembrei de você na hora. Quer fazer o teste? É bem rapidinho.',
    tipoContato: 'conhecidos',
    estilo: 'curiosidade',
    momento: 'abertura'
  },
  {
    id: 'abertura-conhecidos-emocional',
    titulo: 'Abertura - Conhecidos (Emocional)',
    conteudo: '[NOME], sei que você anda buscando melhorar de vida e abrir novas possibilidades. Tô com uma avaliação rápida que mostra caminhos reais de renda extra com algo simples. Posso te enviar?',
    tipoContato: 'conhecidos',
    estilo: 'emocional',
    momento: 'abertura'
  },
  {
    id: 'abertura-conhecidos-consultivo',
    titulo: 'Abertura - Conhecidos (Consultivo)',
    conteudo: '[NOME], estou participando de um projeto estruturado de bebidas funcionais com foco em renda extra. Tenho uma avaliação de perfil que usamos antes de convidar para a apresentação oficial. Quer responder e ver se faz sentido pra você?',
    tipoContato: 'conhecidos',
    estilo: 'consultivo',
    momento: 'abertura'
  },
  // =====================================================
  // 1.2. PESSOAS POUCO CONHECIDAS
  // =====================================================
  {
    id: 'abertura-pouco-conhecidos-leve',
    titulo: 'Abertura - Pouco Conhecidos (Leve)',
    conteudo: 'Oi, [NOME]! Aqui é o(a) [SEU NOME]. Estou participando de um projeto novo na área de bebidas funcionais e usamos uma avaliação rápida pra ver o perfil de cada pessoa. Posso te enviar pra você responder?',
    tipoContato: 'pouco-conhecidos',
    estilo: 'leve',
    momento: 'abertura'
  },
  {
    id: 'abertura-pouco-conhecidos-curiosidade',
    titulo: 'Abertura - Pouco Conhecidos (Curiosidade)',
    conteudo: '[NOME], tudo bem? Estou com uma avaliação que identifica perfis que combinam com projetos de renda extra simples e digitais. Posso te mandar pra você ver o seu?',
    tipoContato: 'pouco-conhecidos',
    estilo: 'curiosidade',
    momento: 'abertura'
  },
  {
    id: 'abertura-pouco-conhecidos-reconhecimento',
    titulo: 'Abertura - Pouco Conhecidos (Reconhecimento)',
    conteudo: '[NOME], lembrei de você porque sei que você [ex: já consome coisas saudáveis / gosta de digital / está empreendendo]. Tenho uma avaliação rápida que mostra se o seu perfil combina com um projeto de bebidas funcionais. Quer fazer?',
    tipoContato: 'pouco-conhecidos',
    estilo: 'reconhecimento',
    momento: 'abertura'
  },
  // =====================================================
  // 1.3. DESCONHECIDOS / PÚBLICO ONLINE
  // =====================================================
  {
    id: 'abertura-desconhecidos-padrao',
    titulo: 'Abertura - Desconhecidos (Padrão)',
    conteudo: 'Oi, [NOME]! Vi seu interesse no projeto de bebidas funcionais. Antes de te explicar tudo, posso te enviar uma avaliação rápida pra ver se o modelo combina com você? É coisa de 1 minutinho.',
    tipoContato: 'desconhecidos',
    estilo: 'direto',
    momento: 'abertura'
  },
  {
    id: 'abertura-desconhecidos-curta',
    titulo: 'Abertura - Desconhecidos (Curta)',
    conteudo: 'Show, [NOME]! Faço assim com todo mundo: te envio uma avaliação rápida e, com base no seu perfil, te explico as melhores opções. Posso mandar?',
    tipoContato: 'desconhecidos',
    estilo: 'direto',
    momento: 'abertura'
  },
  // =====================================================
  // 2. ENVIO DO LINK
  // =====================================================
  {
    id: 'envio-link-padrao1',
    titulo: 'Envio do Link (Padrão 1)',
    conteudo: 'Como combinado, aqui está sua avaliação: [LINK]. Ela é bem rápida e já mostra se seu perfil combina com o projeto de bebidas funcionais.',
    momento: 'envio-link'
  },
  {
    id: 'envio-link-curiosidade',
    titulo: 'Envio do Link (Com Curiosidade)',
    conteudo: 'Aqui está sua avaliação: [LINK]. No final, ela mostra um diagnóstico bem interessante sobre seu perfil para projetos de renda extra. Me chama quando terminar.',
    momento: 'envio-link'
  },
  {
    id: 'envio-link-bem-estar',
    titulo: 'Envio do Link (Para Quem Consome Bem-Estar)',
    conteudo: 'Prontinho, [NOME]! Aqui está sua avaliação: [LINK]. Ela foi pensada justamente pra pessoas que já se interessam por saúde, bem-estar e tendências como bebidas funcionais.',
    momento: 'envio-link'
  },
  {
    id: 'envio-link-digital',
    titulo: 'Envio do Link (Digital/Trabalha com Internet)',
    conteudo: 'Segue sua avaliação: [LINK]. Ela mostra se seu perfil combina com um modelo 100% digital, trabalhando basicamente com links.',
    momento: 'envio-link'
  },
  // =====================================================
  // 3. PÓS-LINK
  // =====================================================
  {
    id: 'pos-link-followup-2h',
    titulo: 'Pós-Link - Follow-up Leve (2 horas)',
    conteudo: 'Oi, [NOME]! Conseguiu fazer sua avaliação? Ela é bem rápida e já mostra se seu perfil encaixa no projeto de bebidas funcionais.',
    momento: 'pos-link'
  },
  {
    id: 'pos-link-lembrete-24h',
    titulo: 'Pós-Link - Lembrete (24h)',
    conteudo: 'Passando só pra lembrar da sua avaliação, [NOME]! Ela ainda está ativa e leva menos de 1 minuto. Assim que você fizer, eu já te explico as possibilidades pro seu perfil.',
    momento: 'pos-link'
  },
  {
    id: 'pos-link-iniciou-parou',
    titulo: 'Pós-Link - Iniciou e Não Terminou',
    conteudo: 'Vi aqui que você chegou a iniciar sua avaliação mas não finalizou. Quer que eu deixe o link fácil aqui pra você concluir rapidinho?',
    momento: 'pos-link'
  },
  // =====================================================
  // 4. PÓS-DIAGNÓSTICO
  // =====================================================
  {
    id: 'pos-diagnostico-generico',
    titulo: 'Pós-Diagnóstico (Genérico)',
    conteudo: '[NOME], acabei de ver seu diagnóstico aqui: seu perfil é muito alinhado com o nosso projeto de bebidas funcionais. Quer que eu te explique rapidinho como funciona?',
    momento: 'pos-diagnostico'
  },
  {
    id: 'pos-diagnostico-produtos-saudaveis',
    titulo: 'Pós-Diagnóstico (Quem Já Consome Produtos Saudáveis)',
    conteudo: 'Seu diagnóstico confirmou que você tem um perfil forte porque já se interessa por saúde/bem-estar. Isso é uma vantagem enorme nesse projeto. Posso te mostrar como funciona a oportunidade?',
    momento: 'pos-diagnostico'
  },
  {
    id: 'pos-diagnostico-renda-extra',
    titulo: 'Pós-Diagnóstico (Quem Quer Renda Extra)',
    conteudo: 'Seu teste mostrou que você tem um perfil ótimo pra criar renda extra com algo simples e guiado, sem precisar largar o que faz hoje. Quer que eu te mostre os próximos passos?',
    momento: 'pos-diagnostico'
  },
  {
    id: 'pos-diagnostico-emocional',
    titulo: 'Pós-Diagnóstico (Emocional - Transição/Desemprego)',
    conteudo: '[NOME], seu diagnóstico mostra que você está exatamente no perfil de quem mais tem resultados no nosso projeto: pessoas em fase de mudança que querem um caminho mais seguro. Quer participar da apresentação oficial pra entender direitinho?',
    momento: 'pos-diagnostico'
  },
  // =====================================================
  // 5. CONVITE PARA APRESENTAÇÃO
  // =====================================================
  {
    id: 'convite-apresentacao-direto',
    titulo: 'Convite para Apresentação (Direto)',
    conteudo: 'Posso te colocar na próxima apresentação oficial do projeto? Ela é rápida e explica tudo de forma simples.',
    momento: 'convite-apresentacao'
  },
  {
    id: 'convite-apresentacao-horario',
    titulo: 'Convite para Apresentação (Com Escolha de Horário)',
    conteudo: 'Tenho apresentação hoje e amanhã, bem objetivas, explicando o projeto. Você prefere ver **hoje** ou **amanhã**?',
    momento: 'convite-apresentacao'
  },
  {
    id: 'convite-apresentacao-curiosidade',
    titulo: 'Convite para Apresentação (Com Curiosidade)',
    conteudo: 'Na apresentação você vai entender por que tanta gente com um perfil parecido com o seu está tendo resultado com bebidas funcionais. Quer que eu te envie o acesso?',
    momento: 'convite-apresentacao'
  },
  {
    id: 'convite-apresentacao-amigavel',
    titulo: 'Convite para Apresentação (Amigável)',
    conteudo: 'Acho que você vai se identificar muito com o que será explicado na apresentação. Quer participar pra ver se faz sentido pra você?',
    momento: 'convite-apresentacao'
  },
  // =====================================================
  // 6. PÓS-APRESENTAÇÃO
  // =====================================================
  {
    id: 'pos-apresentacao-pergunta-aberta',
    titulo: 'Pós-Apresentação (Pergunta Aberta)',
    conteudo: 'E aí, [NOME], o que você achou da apresentação? Fez sentido pra você?',
    momento: 'pos-apresentacao'
  },
  {
    id: 'pos-apresentacao-direcionamento',
    titulo: 'Pós-Apresentação (Direcionamento para Decisão)',
    conteudo: 'Dentro do que você viu, você se vê começando de forma leve, como renda extra, ou prefere esperar mais um pouco?',
    momento: 'pos-apresentacao'
  },
  {
    id: 'pos-apresentacao-reforco',
    titulo: 'Pós-Apresentação (Reforço de Simplicidade)',
    conteudo: 'O ponto principal é: você não precisa saber tudo pra começar. O sistema é guiado e a gente caminha junto. Se fizer sentido, posso te mostrar como dar o primeiro passo.',
    momento: 'pos-apresentacao'
  },
  // =====================================================
  // 7. OBJEÇÕES
  // =====================================================
  {
    id: 'objecao-sem-tempo',
    titulo: 'Objeção: "Não tenho tempo"',
    conteudo: 'Totalmente compreensível. Justamente por isso o modelo foi pensado pra ser encaixado na rotina — começa pequeno, com poucos minutos por dia, e vai crescendo conforme você se adapta.',
    momento: 'objecoes'
  },
  {
    id: 'objecao-medo-nao-dar-conta',
    titulo: 'Objeção: "Tenho medo de não dar conta"',
    conteudo: 'Normal sentir isso no começo. A diferença é que aqui você não começa sozinho(a): tem passo a passo, ferramentas prontas e suporte. Você só precisa dar o primeiro passo.',
    momento: 'objecoes'
  },
  {
    id: 'objecao-ja-tentou-outras',
    titulo: 'Objeção: "Já tentei outras coisas e não deu certo"',
    conteudo: 'Muita gente aqui passou pela mesma situação. A diferença é que esse modelo é simples, muito guiado e com produtos de consumo diário, o que facilita demais. Por isso a gente começa com a avaliação e a apresentação — pra você decidir com clareza.',
    momento: 'objecoes'
  },
  {
    id: 'objecao-nao-quer-vender',
    titulo: 'Objeção: "Não quero vender"',
    conteudo: 'Perfeito. Tem muita gente no projeto que começa indicando, usando apenas os links e as avaliações. O sistema faz boa parte da explicação por você.',
    momento: 'objecoes'
  },
  // =====================================================
  // 8. RECUPERAÇÃO
  // =====================================================
  {
    id: 'recuperacao-leve',
    titulo: 'Recuperação (Leve)',
    conteudo: 'Oi, [NOME]! Vi que a gente não deu sequência naquele assunto do projeto. Você ainda tem interesse em ver como funciona ou prefere que eu deixe em stand-by por enquanto?',
    momento: 'recuperacao'
  },
  {
    id: 'recuperacao-pos-diagnostico',
    titulo: 'Recuperação (Pós-Diagnóstico)',
    conteudo: 'Seu diagnóstico ficou excelente e acabei não te mostrar os próximos passos. Quer que eu retome de onde paramos?',
    momento: 'recuperacao'
  },
  {
    id: 'recuperacao-pos-apresentacao',
    titulo: 'Recuperação (Pós-Apresentação)',
    conteudo: 'Você chegou a ver a apresentação inteira? Se quiser, posso resumir os pontos principais pra você aqui, bem direto.',
    momento: 'recuperacao'
  },
  // =====================================================
  // 9. INDICAÇÕES
  // =====================================================
  {
    id: 'indicacoes-suave',
    titulo: 'Indicações (Suave)',
    conteudo: 'Tranquilo se não for o momento pra você. Se lembrar de alguém que esteja buscando renda extra ou algo novo, me indica? Posso enviar a avaliação gratuita pra essa pessoa também.',
    momento: 'indicacoes'
  },
  {
    id: 'indicacoes-direcionada',
    titulo: 'Indicações (Direcionada)',
    conteudo: 'Você conhece alguém que: precisa de renda extra, está insatisfeito(a) com o trabalho atual ou gosta de saúde/bem-estar? Se lembrar de alguém, me manda o primeiro nome que eu cuido do resto com todo cuidado.',
    momento: 'indicacoes'
  }
]

// Funções auxiliares
export function getScriptsGenericosByMomento(momento: MomentoConversa): ScriptRecrutamento[] {
  return scriptsGenericosRecrutamento.filter(s => s.momento === momento)
}

export function getScriptsGenericosByTipoContato(tipoContato: TipoContato): ScriptRecrutamento[] {
  return scriptsGenericosRecrutamento.filter(s => s.tipoContato === tipoContato)
}

export function getScriptsGenericosByEstilo(estilo: EstiloAbordagem): ScriptRecrutamento[] {
  return scriptsGenericosRecrutamento.filter(s => s.estilo === estilo)
}

export function getAllScriptsGenericos(): ScriptRecrutamento[] {
  return scriptsGenericosRecrutamento
}


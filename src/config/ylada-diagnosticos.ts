/**
 * Biblioteca de diagnósticos YLADA – marketing para profissionais liberais.
 * Cada diagnóstico: 5 perguntas, 3 perfis, scoring 0–2 por pergunta (0 = melhor, 2 = pior).
 * Pontuação total 0–10: 0–3 = perfil 3, 4–6 = perfil 2, 7–10 = perfil 1.
 */

export interface OpcaoPergunta {
  valor: number
  label: string
}

export interface Pergunta {
  id: string
  texto: string
  opcoes: OpcaoPergunta[]
}

export interface PorQueAcontece {
  itens: string[]
  resultado: string
}

export interface PerfilResultado {
  id: string
  titulo: string
  explicacao: string
  consequencias: string[]
  pct: number
  posicionamento: string
  proximoNivel: string | null
  insight: string
  caminho: string
  /** Momento de virada: por que isso acontece com profissionais nesse perfil */
  porQueAcontece?: PorQueAcontece
}

export interface DiagnosticoConfig {
  slug: string
  nome: string
  tituloCurto: string
  descricaoStart: string
  bulletsStart: string[]
  perguntas: Pergunta[]
  perfis: Record<string, PerfilResultado>
  comparacao: { label: string; pct: number }[]
  /** Limiar para perfil "curiosos" (default 7 para max 10) */
  limiarCuriosos?: number
  /** Limiar para perfil "desenvolvimento" (default 4 para max 10) */
  limiarDesenvolvimento?: number
}

export const DIAGNOSTICOS: Record<string, DiagnosticoConfig> = {
  comunicacao: {
    slug: 'comunicacao',
    nome: 'Seu marketing atrai curiosos ou clientes preparados?',
    tituloCurto: 'Descubra por que seu marketing ainda atrai curiosos em vez de clientes prontos',
    descricaoStart: 'Em menos de 1 minuto você descobre se sua comunicação está atraindo curiosos, pessoas em processo ou clientes preparados.',
    bulletsStart: ['curiosos', 'pessoas em processo', 'clientes realmente preparados'],
    perguntas: [
      { id: 'problema', texto: 'Quando alguém entra em contato com você normalmente:', opcoes: [{ valor: 2, label: 'pergunta o preço logo no início' }, { valor: 1, label: 'pede mais informações mas não decide' }, { valor: 0, label: 'já chega entendendo o valor' }, { valor: 1, label: 'depende muito da pessoa' }] },
      { id: 'area', texto: 'Qual dessas áreas descreve melhor seu trabalho?', opcoes: [{ valor: 0, label: 'Saúde / medicina' }, { valor: 1, label: 'Psicologia / terapias' }, { valor: 2, label: 'Estética / beleza' }, { valor: 3, label: 'Nutrição' }, { valor: 4, label: 'Fitness' }, { valor: 5, label: 'Consultoria / coaching' }, { valor: 6, label: 'Outro' }] },
      { id: 'tipo', texto: 'Você atua como:', opcoes: [{ valor: 0, label: 'Profissional liberal (presto serviços)' }, { valor: 1, label: 'Vendedor (vendo produtos/represento empresas)' }] },
      { id: 'q1', texto: 'Seus clientes costumam pedir preço antes de entender seu serviço?', opcoes: [{ valor: 2, label: 'Sim' }, { valor: 1, label: 'Às vezes' }, { valor: 0, label: 'Não' }] },
      { id: 'q2', texto: 'Como a maioria dos clientes chega até você?', opcoes: [{ valor: 2, label: 'Indicação' }, { valor: 1, label: 'Redes sociais' }, { valor: 1, label: 'Anúncios' }, { valor: 0, label: 'Boca a boca' }, { valor: 1, label: 'Varia bastante' }] },
      { id: 'q3', texto: 'Você sente que precisa explicar demais seu trabalho?', opcoes: [{ valor: 2, label: 'Sim' }, { valor: 1, label: 'Às vezes' }, { valor: 0, label: 'Não' }] },
      { id: 'q4', texto: 'Hoje seu marketing atrai mais:', opcoes: [{ valor: 2, label: 'Curiosos' }, { valor: 1, label: 'Pessoas em processo' }, { valor: 0, label: 'Clientes preparados' }] },
    ],
    perfis: {
      curiosos: {
        id: 'curiosos',
        titulo: 'Comunicação que atrai curiosos',
        explicacao: 'Muita atenção, mas pouca conversão.',
        consequencias: ['Muitas perguntas de preço', 'Conversas que não avançam', 'Dificuldade de explicar valor'],
        pct: 60,
        posicionamento: 'Você está entre os 60% que ainda atraem curiosos.',
        proximoNivel: 'Comunicação em desenvolvimento',
        insight: 'O problema normalmente não é sua competência. O cliente chega até você sem entender o próprio problema.',
        caminho: 'Criar diagnósticos que ajudem o cliente a descobrir a própria situação antes da conversa.',
        porQueAcontece: {
          itens: ['atraem interesse', 'mas não deixam claro o problema que resolvem', 'por isso o cliente chega curioso, não preparado'],
          resultado: 'as conversas acontecem, mas nem sempre viram cliente.',
        },
      },
      desenvolvimento: {
        id: 'desenvolvimento',
        titulo: 'Comunicação em desenvolvimento',
        explicacao: 'Algumas conversas produtivas, mas ainda inconsistentes.',
        consequencias: ['Algumas conversas produtivas', 'Clientes às vezes chegam sem contexto'],
        pct: 30,
        posicionamento: 'Você já está entre os 30% que estão evoluindo.',
        proximoNivel: 'Comunicação que atrai clientes preparados',
        insight: 'Sua comunicação já gera interesse, mas ainda pode filtrar melhor quem realmente está preparado.',
        caminho: 'Ajustar diagnóstico e posicionamento para aumentar a qualidade das conversas.',
        porQueAcontece: {
          itens: ['já geram interesse', 'mas ainda falta clareza sobre o problema que você resolve', 'por isso alguns chegam preparados, outros não'],
          resultado: 'há potencial para aumentar a qualidade das conversas.',
        },
      },
      clientes: {
        id: 'clientes',
        titulo: 'Comunicação que atrai clientes preparados',
        explicacao: 'Clientes chegam com clareza e confiança.',
        consequencias: ['Conversas produtivas', 'Clientes chegam mais conscientes'],
        pct: 10,
        posicionamento: 'Você está entre os 10% que atraem clientes preparados.',
        proximoNivel: null,
        insight: 'Você já consegue atrair pessoas mais preparadas. Agora o foco pode ser escalar esse processo.',
        caminho: 'Usar diagnósticos para ampliar alcance e gerar mais oportunidades qualificadas.',
        porQueAcontece: {
          itens: ['deixam claro o problema que resolvem', 'o cliente chega com contexto', 'a conversa começa no nível certo'],
          resultado: 'as conversas viram clientes com mais facilidade.',
        },
      },
    },
    comparacao: [
      { label: 'atraem curiosos', pct: 60 },
      { label: 'estão em desenvolvimento', pct: 30 },
      { label: 'atraem clientes preparados', pct: 10 },
    ],
    limiarCuriosos: 8,
    limiarDesenvolvimento: 5,
  },

  agenda: {
    slug: 'agenda',
    nome: 'Por que sua agenda não enche como poderia?',
    tituloCurto: 'Descubra o que está travando sua agenda profissional',
    descricaoStart: 'Responda algumas perguntas e descubra por que sua agenda pode não estar preenchendo como deveria.',
    bulletsStart: ['agenda instável', 'agenda em desenvolvimento', 'agenda consistente'],
    perguntas: [
      { id: 'q1', texto: 'Com que frequência você tem horários livres na agenda?', opcoes: [{ valor: 2, label: 'Frequentemente' }, { valor: 1, label: 'Às vezes' }, { valor: 0, label: 'Raramente' }] },
      { id: 'q2', texto: 'Seus clientes chegam por indicação ou por marketing?', opcoes: [{ valor: 2, label: 'Só indicação' }, { valor: 1, label: 'Ambos' }, { valor: 0, label: 'Principalmente marketing' }] },
      { id: 'q3', texto: 'Você recebe muitos contatos que não avançam?', opcoes: [{ valor: 2, label: 'Sim, muitos' }, { valor: 1, label: 'Alguns' }, { valor: 0, label: 'Poucos' }] },
      { id: 'q4', texto: 'Seu marketing gera conversas frequentes?', opcoes: [{ valor: 2, label: 'Raramente' }, { valor: 1, label: 'Às vezes' }, { valor: 0, label: 'Frequentemente' }] },
      { id: 'q5', texto: 'Você sente que poderia atender mais pessoas?', opcoes: [{ valor: 2, label: 'Sim, muito' }, { valor: 1, label: 'Um pouco' }, { valor: 0, label: 'Não' }] },
    ],
    perfis: {
      agenda_instavel: {
        id: 'agenda_instavel',
        titulo: 'Agenda instável',
        explicacao: 'Muitos horários livres e pouca previsibilidade.',
        consequencias: ['Horários vazios com frequência', 'Dependência de indicações', 'Contatos que não convertem'],
        pct: 60,
        posicionamento: 'Você está entre os 60% com agenda instável.',
        proximoNivel: 'Agenda em desenvolvimento',
        insight: 'O problema não é sua capacidade de atender. É a forma como novos clientes chegam até você.',
        caminho: 'Criar um sistema de atração que gere contatos qualificados de forma previsível.',
        porQueAcontece: {
          itens: ['dependem de indicações casuais', 'não têm canal próprio de atração', 'por isso o fluxo de clientes é imprevisível'],
          resultado: 'a agenda oscila entre períodos cheios e vazios.',
        },
      },
      agenda_desenvolvimento: {
        id: 'agenda_desenvolvimento',
        titulo: 'Agenda em desenvolvimento',
        explicacao: 'Alguma consistência, mas ainda há espaço para crescer.',
        consequencias: ['Alguns horários livres', 'Clientes vêm de fontes variadas', 'Oportunidade de sistematizar'],
        pct: 30,
        posicionamento: 'Você está entre os 30% que estão evoluindo.',
        proximoNivel: 'Agenda consistente',
        insight: 'Sua agenda já tem movimento. O próximo passo é tornar o fluxo mais previsível.',
        caminho: 'Usar diagnósticos para qualificar leads e preencher a agenda com pessoas preparadas.',
        porQueAcontece: {
          itens: ['já geram fluxo de várias fontes', 'mas ainda falta sistematizar a atração', 'por isso há picos e vales na agenda'],
          resultado: 'há potencial para tornar o preenchimento mais previsível.',
        },
      },
      agenda_consistente: {
        id: 'agenda_consistente',
        titulo: 'Agenda consistente',
        explicacao: 'Agenda preenchida com regularidade.',
        consequencias: ['Agenda preenchida', 'Fluxo previsível de clientes', 'Potencial para escalar'],
        pct: 10,
        posicionamento: 'Você está entre os 10% com agenda consistente.',
        proximoNivel: null,
        insight: 'Você já tem um bom sistema. O foco pode ser ampliar ou otimizar.',
        caminho: 'Usar diagnósticos para ampliar alcance e manter a qualidade.',
        porQueAcontece: {
          itens: ['têm sistema de atração estruturado', 'o fluxo de clientes é previsível', 'a agenda se mantém preenchida'],
          resultado: 'o foco pode ser ampliar ou otimizar o que já funciona.',
        },
      },
    },
    comparacao: [
      { label: 'agenda instável', pct: 60 },
      { label: 'agenda em desenvolvimento', pct: 30 },
      { label: 'agenda consistente', pct: 10 },
    ],
  },

  autoridade: {
    slug: 'autoridade',
    nome: 'Seu posicionamento transmite autoridade?',
    tituloCurto: 'Descubra se seu posicionamento transmite autoridade',
    descricaoStart: 'Responda algumas perguntas e descubra se as pessoas reconhecem sua expertise.',
    bulletsStart: ['autoridade invisível', 'autoridade em construção', 'autoridade reconhecida'],
    perguntas: [
      { id: 'q1', texto: 'As pessoas entendem rapidamente sua especialidade?', opcoes: [{ valor: 2, label: 'Raramente' }, { valor: 1, label: 'Às vezes' }, { valor: 0, label: 'Sim' }] },
      { id: 'q2', texto: 'Seus conteúdos demonstram conhecimento profundo?', opcoes: [{ valor: 2, label: 'Pouco' }, { valor: 1, label: 'Em parte' }, { valor: 0, label: 'Sim' }] },
      { id: 'q3', texto: 'Você recebe perguntas profissionais com frequência?', opcoes: [{ valor: 2, label: 'Raramente' }, { valor: 1, label: 'Às vezes' }, { valor: 0, label: 'Frequentemente' }] },
      { id: 'q4', texto: 'Seus clientes confiam rapidamente no seu trabalho?', opcoes: [{ valor: 2, label: 'Demora' }, { valor: 1, label: 'Às vezes' }, { valor: 0, label: 'Sim' }] },
      { id: 'q5', texto: 'Seu posicionamento é claro nas redes sociais?', opcoes: [{ valor: 2, label: 'Não' }, { valor: 1, label: 'Parcialmente' }, { valor: 0, label: 'Sim' }] },
    ],
    perfis: {
      autoridade_invisivel: {
        id: 'autoridade_invisivel',
        titulo: 'Autoridade invisível',
        explicacao: 'Seu conhecimento existe, mas não está sendo percebido.',
        consequencias: ['Pessoas não entendem sua especialidade', 'Precisa se explicar demais', 'Conteúdo pouco diferenciado'],
        pct: 60,
        posicionamento: 'Você está entre os 60% com autoridade invisível.',
        proximoNivel: 'Autoridade em construção',
        insight: 'O problema não é seu conhecimento. É a forma como você o comunica e posiciona.',
        caminho: 'Criar diagnósticos e conteúdos que demonstrem sua expertise de forma clara.',
        porQueAcontece: {
          itens: ['têm conhecimento profundo', 'mas não demonstram de forma clara', 'por isso as pessoas não percebem sua especialidade'],
          resultado: 'precisa se explicar demais e o conteúdo parece genérico.',
        },
      },
      autoridade_construcao: {
        id: 'autoridade_construcao',
        titulo: 'Autoridade em construção',
        explicacao: 'Algumas pessoas já reconhecem, mas há espaço para crescer.',
        consequencias: ['Algumas pessoas entendem sua especialidade', 'Conteúdo em evolução', 'Oportunidade de consolidar'],
        pct: 30,
        posicionamento: 'Você está entre os 30% que estão construindo autoridade.',
        proximoNivel: 'Autoridade reconhecida',
        insight: 'Sua autoridade está crescendo. O próximo passo é torná-la mais evidente.',
        caminho: 'Usar diagnósticos para demonstrar expertise e atrair clientes mais qualificados.',
        porQueAcontece: {
          itens: ['já demonstram expertise em parte', 'mas ainda falta consistência no posicionamento', 'por isso alguns reconhecem, outros não'],
          resultado: 'há potencial para consolidar a autoridade.',
        },
      },
      autoridade_reconhecida: {
        id: 'autoridade_reconhecida',
        titulo: 'Autoridade reconhecida',
        explicacao: 'As pessoas reconhecem sua expertise e confiam no seu trabalho.',
        consequencias: ['Especialidade clara', 'Clientes chegam com confiança', 'Posicionamento sólido'],
        pct: 10,
        posicionamento: 'Você está entre os 10% com autoridade reconhecida.',
        proximoNivel: null,
        insight: 'Você já transmite autoridade. O foco pode ser ampliar o alcance.',
        caminho: 'Usar diagnósticos para ampliar sua influência e atrair mais clientes preparados.',
        porQueAcontece: {
          itens: ['demonstram expertise de forma clara', 'o posicionamento é evidente', 'as pessoas confiam antes mesmo da conversa'],
          resultado: 'os clientes chegam preparados e a conversa avança mais rápido.',
        },
      },
    },
    comparacao: [
      { label: 'autoridade invisível', pct: 60 },
      { label: 'autoridade em construção', pct: 30 },
      { label: 'autoridade reconhecida', pct: 10 },
    ],
  },

  indicacoes: {
    slug: 'indicacoes',
    nome: 'Seu negócio depende demais de indicações?',
    tituloCurto: 'Descubra se seu negócio depende demais de indicações',
    descricaoStart: 'Responda algumas perguntas e descubra se você tem controle sobre o fluxo de novos clientes.',
    bulletsStart: ['dependência de indicações', 'indicações + marketing', 'sistema de aquisição'],
    perguntas: [
      { id: 'q1', texto: 'A maioria dos seus clientes vem por indicação?', opcoes: [{ valor: 2, label: 'Sim, quase todos' }, { valor: 1, label: 'A maioria' }, { valor: 0, label: 'Não' }] },
      { id: 'q2', texto: 'Quando as indicações diminuem, seus resultados caem?', opcoes: [{ valor: 2, label: 'Sim' }, { valor: 1, label: 'Às vezes' }, { valor: 0, label: 'Não' }] },
      { id: 'q3', texto: 'Você tem um sistema previsível de geração de clientes?', opcoes: [{ valor: 2, label: 'Não' }, { valor: 1, label: 'Parcialmente' }, { valor: 0, label: 'Sim' }] },
      { id: 'q4', texto: 'Seu marketing gera novos contatos regularmente?', opcoes: [{ valor: 2, label: 'Raramente' }, { valor: 1, label: 'Às vezes' }, { valor: 0, label: 'Sim' }] },
      { id: 'q5', texto: 'Você tem controle sobre o fluxo de novos clientes?', opcoes: [{ valor: 2, label: 'Não' }, { valor: 1, label: 'Parcialmente' }, { valor: 0, label: 'Sim' }] },
    ],
    perfis: {
      dependencia_indicacoes: {
        id: 'dependencia_indicacoes',
        titulo: 'Dependência de indicações',
        explicacao: 'Seu negócio depende quase totalmente de indicações.',
        consequencias: ['Resultados variam com as indicações', 'Pouco controle sobre novos clientes', 'Incerteza quando indicações caem'],
        pct: 60,
        posicionamento: 'Você está entre os 60% que dependem demais de indicações.',
        proximoNivel: 'Indicações + Marketing',
        insight: 'Indicações são valiosas, mas não são um sistema. Você precisa de um canal próprio de atração.',
        caminho: 'Criar um sistema de marketing que gere contatos qualificados de forma previsível.',
        porQueAcontece: {
          itens: ['não têm canal próprio de atração', 'dependem de terceiros para gerar clientes', 'por isso o fluxo varia conforme as indicações'],
          resultado: 'quando as indicações caem, os resultados caem junto.',
        },
      },
      indicacoes_mais_marketing: {
        id: 'indicacoes_mais_marketing',
        titulo: 'Indicações + Marketing',
        explicacao: 'Você combina indicações com esforços de marketing.',
        consequencias: ['Clientes vêm de várias fontes', 'Alguma previsibilidade', 'Oportunidade de sistematizar'],
        pct: 30,
        posicionamento: 'Você está entre os 30% que combinam indicações com marketing.',
        proximoNivel: 'Sistema de aquisição',
        insight: 'Você já diversificou. O próximo passo é tornar o fluxo mais previsível e escalável.',
        caminho: 'Usar diagnósticos para qualificar leads e aumentar a conversão do marketing.',
        porQueAcontece: {
          itens: ['já diversificaram as fontes', 'mas ainda falta sistematizar o marketing', 'por isso há previsibilidade parcial'],
          resultado: 'há potencial para ter controle total sobre o fluxo.',
        },
      },
      sistema_aquisicao: {
        id: 'sistema_aquisicao',
        titulo: 'Sistema de aquisição',
        explicacao: 'Você tem controle sobre o fluxo de novos clientes.',
        consequencias: ['Fluxo previsível de clientes', 'Marketing gera contatos', 'Menor dependência de indicações'],
        pct: 10,
        posicionamento: 'Você está entre os 10% com sistema de aquisição.',
        proximoNivel: null,
        insight: 'Você já tem um sistema. O foco pode ser otimizar e escalar.',
        caminho: 'Usar diagnósticos para ampliar o alcance e manter a qualidade dos leads.',
        porQueAcontece: {
          itens: ['têm canal próprio de atração', 'o marketing gera contatos de forma previsível', 'não dependem de indicações para crescer'],
          resultado: 'o fluxo de novos clientes está sob controle.',
        },
      },
    },
    comparacao: [
      { label: 'dependem de indicações', pct: 60 },
      { label: 'indicações + marketing', pct: 30 },
      { label: 'sistema de aquisição', pct: 10 },
    ],
  },

  conteudo: {
    slug: 'conteudo',
    nome: 'Seu conteúdo atrai clientes ou apenas engajamento?',
    tituloCurto: 'Descubra se seu conteúdo converte',
    descricaoStart: 'Responda algumas perguntas e descubra se seu conteúdo está atraindo clientes ou apenas curtidas.',
    bulletsStart: ['conteúdo que entretém', 'conteúdo em evolução', 'conteúdo que converte'],
    perguntas: [
      { id: 'q1', texto: 'Seus posts geram mensagens de potenciais clientes?', opcoes: [{ valor: 2, label: 'Raramente' }, { valor: 1, label: 'Às vezes' }, { valor: 0, label: 'Frequentemente' }] },
      { id: 'q2', texto: 'Você recebe perguntas profissionais após publicar conteúdos?', opcoes: [{ valor: 2, label: 'Raramente' }, { valor: 1, label: 'Às vezes' }, { valor: 0, label: 'Frequentemente' }] },
      { id: 'q3', texto: 'As pessoas salvam ou compartilham seus conteúdos?', opcoes: [{ valor: 2, label: 'Raramente' }, { valor: 1, label: 'Às vezes' }, { valor: 0, label: 'Frequentemente' }] },
      { id: 'q4', texto: 'Seu conteúdo explica claramente seu trabalho?', opcoes: [{ valor: 2, label: 'Não' }, { valor: 1, label: 'Parcialmente' }, { valor: 0, label: 'Sim' }] },
      { id: 'q5', texto: 'Seus conteúdos levam pessoas a marcar consultas ou serviços?', opcoes: [{ valor: 2, label: 'Raramente' }, { valor: 1, label: 'Às vezes' }, { valor: 0, label: 'Frequentemente' }] },
    ],
    perfis: {
      conteudo_entretem: {
        id: 'conteudo_entretem',
        titulo: 'Conteúdo que entretém',
        explicacao: 'Engajamento alto, mas pouca conversão.',
        consequencias: ['Muitas curtidas, poucas conversas', 'Conteúdo não explica o trabalho', 'Poucos contatos qualificados'],
        pct: 60,
        posicionamento: 'Você está entre os 60% cujo conteúdo entretém mais do que converte.',
        proximoNivel: 'Conteúdo em evolução',
        insight: 'O problema não é a qualidade do conteúdo. É a conexão entre o conteúdo e a decisão de contratar.',
        caminho: 'Criar diagnósticos que conectem o conteúdo à necessidade do cliente e gerem conversas qualificadas.',
        porQueAcontece: {
          itens: ['geram engajamento e curtidas', 'mas não conectam o conteúdo ao problema do cliente', 'por isso as pessoas curtem, mas não entram em contato'],
          resultado: 'o conteúdo entretém, mas raramente vira cliente.',
        },
      },
      conteudo_evolucao: {
        id: 'conteudo_evolucao',
        titulo: 'Conteúdo em evolução',
        explicacao: 'Alguma conversão, mas ainda há espaço para crescer.',
        consequencias: ['Algumas conversas a partir do conteúdo', 'Conteúdo em melhoria', 'Oportunidade de converter mais'],
        pct: 30,
        posicionamento: 'Você está entre os 30% cujo conteúdo está evoluindo.',
        proximoNivel: 'Conteúdo que converte',
        insight: 'Seu conteúdo já gera interesse. O próximo passo é torná-lo mais estratégico para conversão.',
        caminho: 'Usar diagnósticos como ponte entre o conteúdo e a decisão de contratar.',
        porQueAcontece: {
          itens: ['já conectam conteúdo ao trabalho em parte', 'mas falta clareza estratégica', 'por isso algumas conversas viram clientes, outras não'],
          resultado: 'há potencial para aumentar a conversão do conteúdo.',
        },
      },
      conteudo_converte: {
        id: 'conteudo_converte',
        titulo: 'Conteúdo que converte',
        explicacao: 'Seu conteúdo gera conversas e clientes.',
        consequencias: ['Conteúdo gera contatos qualificados', 'Pessoas marcam consultas', 'Conteúdo estratégico'],
        pct: 10,
        posicionamento: 'Você está entre os 10% cujo conteúdo converte.',
        proximoNivel: null,
        insight: 'Você já usa conteúdo de forma estratégica. O foco pode ser ampliar o alcance.',
        caminho: 'Usar diagnósticos para ampliar o impacto do conteúdo e gerar mais oportunidades.',
        porQueAcontece: {
          itens: ['conectam conteúdo ao problema e à decisão de contratar', 'o conteúdo explica claramente o trabalho', 'as pessoas chegam prontas para conversar'],
          resultado: 'o conteúdo gera clientes de forma consistente.',
        },
      },
    },
    comparacao: [
      { label: 'conteúdo que entretém', pct: 60 },
      { label: 'conteúdo em evolução', pct: 30 },
      { label: 'conteúdo que converte', pct: 10 },
    ],
  },

  investimento: {
    slug: 'investimento',
    nome: 'Seu investimento profissional está trazendo retorno real?',
    tituloCurto: 'Descubra se seu investimento profissional está gerando retorno',
    descricaoStart: 'Descubra se o tempo e o dinheiro que você investe no seu crescimento profissional estão realmente gerando resultados.',
    bulletsStart: ['investimento sem retorno claro', 'investimento em desenvolvimento', 'investimento com retorno'],
    perguntas: [
      { id: 'q1', texto: 'Você investe regularmente em cursos, ferramentas ou marketing?', opcoes: [{ valor: 2, label: 'Sim, frequentemente' }, { valor: 1, label: 'Às vezes' }, { valor: 0, label: 'Raramente' }] },
      { id: 'q2', texto: 'Você sente que esses investimentos realmente aumentam seus clientes ou pacientes?', opcoes: [{ valor: 2, label: 'Raramente' }, { valor: 1, label: 'Às vezes' }, { valor: 0, label: 'Frequentemente' }] },
      { id: 'q3', texto: 'Você consegue perceber claramente o retorno financeiro desses investimentos?', opcoes: [{ valor: 2, label: 'Não' }, { valor: 1, label: 'Mais ou menos' }, { valor: 0, label: 'Sim' }] },
      { id: 'q4', texto: 'Você acredita que seus clientes entendem claramente o valor do seu trabalho?', opcoes: [{ valor: 2, label: 'Não muito' }, { valor: 1, label: 'Em parte' }, { valor: 0, label: 'Sim' }] },
      { id: 'q5', texto: 'Quando as pessoas entram em contato com você, elas já chegam com clareza do que precisam?', opcoes: [{ valor: 2, label: 'Raramente' }, { valor: 1, label: 'Às vezes' }, { valor: 0, label: 'Frequentemente' }] },
    ],
    perfis: {
      investimento_sem_retorno: {
        id: 'investimento_sem_retorno',
        titulo: 'Investimento sem retorno claro',
        explicacao: 'Cursos e ferramentas sem impacto real nos clientes.',
        consequencias: ['Cursos e ferramentas sem impacto real', 'Marketing que não gera clientes', 'Esforço grande com pouco resultado'],
        pct: 60,
        posicionamento: 'Você está entre os 60% cujo investimento não traz retorno claro.',
        proximoNivel: 'Investimento em desenvolvimento',
        insight: 'O problema normalmente não é sua competência ou dedicação. Muitas vezes o cliente chega até você sem entender claramente o próprio problema.',
        caminho: 'Criar diagnósticos que ajudem o cliente a entender sua própria situação antes da conversa.',
        porQueAcontece: {
          itens: ['investem em cursos, ferramentas e marketing', 'mas o cliente não entende claramente o próprio problema', 'por isso o investimento não se transforma em novos clientes'],
          resultado: 'o esforço é grande, mas o retorno é pouco visível.',
        },
      },
      investimento_desenvolvimento: {
        id: 'investimento_desenvolvimento',
        titulo: 'Investimento em desenvolvimento',
        explicacao: 'Alguns resultados, mas ainda falta previsibilidade.',
        consequencias: ['Alguns resultados positivos', 'Crescimento irregular', 'Oportunidades de melhorar a conversão'],
        pct: 30,
        posicionamento: 'Você está entre os 30% cujo investimento está em desenvolvimento.',
        proximoNivel: 'Investimento com retorno',
        insight: 'Você já está investindo no seu crescimento, mas ainda pode melhorar a forma como os clientes percebem e entendem o seu valor.',
        caminho: 'Usar diagnósticos para aumentar o valor percebido e a qualidade das conversas.',
        porQueAcontece: {
          itens: ['já têm algum posicionamento claro', 'mas ainda falta consistência na comunicação', 'por isso o retorno varia de cliente para cliente'],
          resultado: 'há potencial para tornar o investimento mais previsível.',
        },
      },
      investimento_retorno: {
        id: 'investimento_retorno',
        titulo: 'Investimento com retorno',
        explicacao: 'Investimentos estratégicos gerando resultados.',
        consequencias: ['Investimentos mais estratégicos', 'Clientes chegando com mais clareza', 'Possibilidade de crescimento consistente'],
        pct: 10,
        posicionamento: 'Você está entre os 10% cujo investimento traz retorno.',
        proximoNivel: null,
        insight: 'Você já consegue transformar investimento em resultados. Agora o desafio pode ser escalar esse processo.',
        caminho: 'Usar diagnósticos para ampliar o alcance e manter a qualidade.',
        porQueAcontece: {
          itens: ['posicionamento claro', 'o cliente chega entendendo o problema', 'o investimento se transforma em clientes'],
          resultado: 'cursos, ferramentas e marketing geram retorno real.',
        },
      },
    },
    comparacao: [
      { label: 'investimento sem retorno claro', pct: 60 },
      { label: 'investimento em desenvolvimento', pct: 30 },
      { label: 'investimento com retorno', pct: 10 },
    ],
  },
}

/** Perguntas de aquecimento (área e tipo) — comuns a todos os diagnósticos */
export const PERGUNTA_AREA: Pergunta = {
  id: 'area',
  texto: 'Qual dessas áreas descreve melhor seu trabalho?',
  opcoes: [
    { valor: 0, label: 'Saúde / medicina' },
    { valor: 1, label: 'Psicologia / terapias' },
    { valor: 2, label: 'Estética / beleza' },
    { valor: 3, label: 'Nutrição' },
    { valor: 4, label: 'Fitness' },
    { valor: 5, label: 'Consultoria / coaching' },
    { valor: 6, label: 'Outro' },
  ],
}

export const PERGUNTA_TIPO: Pergunta = {
  id: 'tipo',
  texto: 'Você atua como:',
  opcoes: [
    { valor: 0, label: 'Profissional liberal (presto serviços)' },
    { valor: 1, label: 'Vendedor (vendo produtos/represento empresas)' },
  ],
}

/** Diagnósticos relacionados para o motor de crescimento (sugestões na página de resultado) */
export const DIAGNOSTICOS_RELACIONADOS: Record<string, Array<{ titulo: string; href: string }>> = {
  comunicacao: [
    { titulo: 'Seu investimento profissional está trazendo retorno real?', href: '/pt/diagnostico/investimento' },
    { titulo: 'Seu posicionamento transmite autoridade?', href: '/pt/diagnostico/autoridade' },
    { titulo: 'Seu conteúdo atrai clientes ou apenas engajamento?', href: '/pt/diagnostico/conteudo' },
    { titulo: 'Por que sua agenda não enche como poderia?', href: '/pt/diagnostico/agenda' },
  ],
  agenda: [
    { titulo: 'Seu marketing atrai curiosos ou clientes preparados?', href: '/pt/diagnostico' },
    { titulo: 'Seu negócio depende demais de indicações?', href: '/pt/diagnostico/indicacoes' },
    { titulo: 'Seu posicionamento transmite autoridade?', href: '/pt/diagnostico/autoridade' },
  ],
  autoridade: [
    { titulo: 'Seu marketing atrai curiosos ou clientes preparados?', href: '/pt/diagnostico' },
    { titulo: 'Seu conteúdo atrai clientes ou apenas engajamento?', href: '/pt/diagnostico/conteudo' },
    { titulo: 'Por que sua agenda não enche como poderia?', href: '/pt/diagnostico/agenda' },
  ],
  indicacoes: [
    { titulo: 'Seu marketing atrai curiosos ou clientes preparados?', href: '/pt/diagnostico' },
    { titulo: 'Por que sua agenda não enche como poderia?', href: '/pt/diagnostico/agenda' },
    { titulo: 'Seu conteúdo atrai clientes ou apenas engajamento?', href: '/pt/diagnostico/conteudo' },
  ],
  conteudo: [
    { titulo: 'Seu marketing atrai curiosos ou clientes preparados?', href: '/pt/diagnostico' },
    { titulo: 'Seu posicionamento transmite autoridade?', href: '/pt/diagnostico/autoridade' },
    { titulo: 'Seu investimento profissional está trazendo retorno real?', href: '/pt/diagnostico/investimento' },
  ],
  investimento: [
    { titulo: 'Seu marketing atrai curiosos ou clientes preparados?', href: '/pt/diagnostico' },
    { titulo: 'Seu posicionamento transmite autoridade?', href: '/pt/diagnostico/autoridade' },
    { titulo: 'Seu conteúdo atrai clientes ou apenas engajamento?', href: '/pt/diagnostico/conteudo' },
  ],
}

/** Ordem e labels do mapa de crescimento (bloco "Seu progresso") */
export const DIAGNOSTICOS_MAPA: Array<{ slug: string; label: string }> = [
  { slug: 'comunicacao', label: 'Comunicação' },
  { slug: 'agenda', label: 'Agenda' },
  { slug: 'autoridade', label: 'Autoridade' },
  { slug: 'indicacoes', label: 'Indicações' },
  { slug: 'conteudo', label: 'Conteúdo' },
  { slug: 'investimento', label: 'Investimento' },
]

/** Calcula o perfil a partir da pontuação */
export function calcularPerfil(config: DiagnosticoConfig, pontuacao: number): string {
  const ids = Object.keys(config.perfis)
  const limiarCuriosos = config.limiarCuriosos ?? 7
  const limiarDesenvolvimento = config.limiarDesenvolvimento ?? 4
  if (pontuacao >= limiarCuriosos) return ids[0]
  if (pontuacao >= limiarDesenvolvimento) return ids[1]
  return ids[2]
}

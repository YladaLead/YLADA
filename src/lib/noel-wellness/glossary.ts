/**
 * NOEL WELLNESS - Glossário Oficial
 * 
 * SEÇÃO 19 — GLOSSÁRIO OFICIAL DO NOEL
 * 
 * Garante que o NOEL, o Claude e todos os consultores utilizem a mesma linguagem.
 */

export interface GlossaryTerm {
  term: string
  definition: string
  usage: string
  category: 'operacional' | 'produto' | 'carreira' | 'sistema' | 'pessoa'
}

/**
 * Glossário completo A-Z
 */
export const NOEL_GLOSSARY: Record<string, GlossaryTerm> = {
  abertura_conversa: {
    term: 'Abertura de conversa',
    definition: 'Primeira mensagem enviada para iniciar interação com cliente ou prospect',
    usage: 'Sempre leve, curta e sem proposta',
    category: 'operacional'
  },
  acelera: {
    term: 'Acelera',
    definition: 'Produto utilizado para metabolismo e queima; base presente em kits e no Turbo',
    usage: 'Usado em combinação com Energia',
    category: 'produto'
  },
  base_clientes: {
    term: 'Base de clientes',
    definition: 'Grupo de clientes ativos que compram mensalmente e geram PV constante',
    usage: 'Foco principal do consultor',
    category: 'operacional'
  },
  bebida_funcional: {
    term: 'Bebida funcional',
    definition: 'Produto preparado (Energia, Acelera, Turbo, Hype) usado como porta de entrada',
    usage: 'Termo genérico para todos os produtos líquidos',
    category: 'produto'
  },
  carreira: {
    term: 'Carreira',
    definition: 'Caminho evolutivo no Wellness: Ativo → 1000 PV → Equipe Mundial → GET → Milionário → Presidente',
    usage: 'Sempre tratado como direção, não cobrança',
    category: 'carreira'
  },
  cliente_ativo: {
    term: 'Cliente ativo',
    definition: 'Cliente que realiza compras mensais e gera entre 50–100 PV',
    usage: 'Foco de upsell e manutenção',
    category: 'pessoa'
  },
  cliente_frio: {
    term: 'Cliente frio',
    definition: 'Pessoa sem vínculo, que não conhece o consultor; exige abordagem leve e perguntas-curinga',
    usage: 'Abordagem com perguntas abertas',
    category: 'pessoa'
  },
  cliente_morno: {
    term: 'Cliente morno',
    definition: 'Seguidor, indicação ou pessoa que já interagiu minimamente',
    usage: 'Abordagem com contexto',
    category: 'pessoa'
  },
  cliente_quente: {
    term: 'Cliente quente',
    definition: 'Pessoa que demonstrou interesse claro e imediato; pronta para proposta',
    usage: 'Abordagem direta',
    category: 'pessoa'
  },
  close: {
    term: 'Close / fechamento',
    definition: 'Momento da proposta final ao cliente; exige mensagens curtas e objetivas',
    usage: 'Fechar com leveza',
    category: 'operacional'
  },
  claude: {
    term: 'Claude',
    definition: 'IA que rodará o comportamento do NOEL dentro do backend',
    usage: 'Sistema técnico',
    category: 'sistema'
  },
  combo: {
    term: 'Combo / Programa de 5 dias',
    definition: 'Pacotes de consumo (Turbo ou Hype) usados para criar rotina',
    usage: 'Para clientes que querem resultados mais rápidos',
    category: 'produto'
  },
  diagnostico: {
    term: 'Diagnóstico',
    definition: 'Identificação da dor, objetivo e perfil do cliente para definir o produto ideal',
    usage: 'Sempre antes de oferecer produto',
    category: 'operacional'
  },
  duplicacao: {
    term: 'Duplicação',
    definition: 'Capacidade de qualquer consultor replicar a mesma ação com simplicidade',
    usage: 'Palavra essencial do sistema',
    category: 'sistema'
  },
  equipe_mundial: {
    term: 'Equipe Mundial',
    definition: 'Nível atingido com 2500 PV por 4 meses; porta de entrada para carreira',
    usage: 'Primeiro nível de carreira avançada',
    category: 'carreira'
  },
  energia: {
    term: 'Energia (NRG)',
    definition: 'Produto-base usado para fluxo de energia, foco e entrada leve',
    usage: 'Porta de entrada principal',
    category: 'produto'
  },
  ferramentas: {
    term: 'Ferramentas',
    definition: 'Quizzes, testes, scripts e visualizadores usados para atrair, diagnosticar e converter pessoas',
    usage: 'Motor de lead e vendas',
    category: 'sistema'
  },
  fluxo: {
    term: 'Fluxo',
    definition: 'Caminho estruturado (Kits, Turbo, Hype, Recrutamento etc.) que o NOEL utiliza para orientar o consultor',
    usage: 'Sempre simples e duplicável',
    category: 'operacional'
  },
  follow_up: {
    term: 'Follow-up',
    definition: 'Mensagens de acompanhamento enviadas após proposta; podem ser leves, diretas ou estratégicas',
    usage: 'Nunca soa como cobrança',
    category: 'operacional'
  },
  get: {
    term: 'GET',
    definition: 'Global Expansion Team; nível de 16.000 PV em 3 níveis de profundidade; gera ~1000 royalties',
    usage: 'Nível avançado de carreira',
    category: 'carreira'
  },
  gatilho: {
    term: 'Gatilho',
    definition: 'Microestratégia de persuasão leve usada em scripts',
    usage: 'Sempre ético e leve',
    category: 'operacional'
  },
  hom: {
    term: 'HOM (Herbalife Opportunity Meeting)',
    definition: 'Apresentação oficial do negócio; usada no fluxo de recrutamento',
    usage: 'Porta de entrada para recrutamento',
    category: 'operacional'
  },
  hype_drink: {
    term: 'Hype Drink',
    definition: 'Bebida funcional premium para foco e performance; usada como upsell',
    usage: 'Para clientes que querem foco',
    category: 'produto'
  },
  indicacao: {
    term: 'Indicação',
    definition: 'Lead enviado por cliente, amigo ou conhecido; fluxo próprio com linguagem diferenciada',
    usage: 'Abordagem com menção ao indicador',
    category: 'pessoa'
  },
  iniciante: {
    term: 'Iniciante',
    definition: 'Consultor novo, ainda sem ritmo; precisa de metas leves e foco em 250–500 PV',
    usage: 'Abordagem simplificada',
    category: 'pessoa'
  },
  kit_5_bebidas: {
    term: 'Kit de 5 bebidas',
    definition: 'Porta de entrada principal do sistema; usado para criar volume, testar cliente e iniciar rotina',
    usage: 'Primeiro produto oferecido',
    category: 'produto'
  },
  lead: {
    term: 'Lead',
    definition: 'Qualquer pessoa que demonstrou interesse, clicou numa ferramenta ou conversou com o consultor',
    usage: 'Pessoa em processo de conversão',
    category: 'pessoa'
  },
  litrao_turbo: {
    term: 'Litrão Turbo',
    definition: 'Bebida funcional de 1L usada para retenção, metabolismo e aceleração de resultados',
    usage: 'Para clientes que querem resultados mais rápidos',
    category: 'produto'
  },
  linha: {
    term: 'Linha / profundidade',
    definition: 'Estrutura de downline na equipe; usada em GET, Milionário e Presidente',
    usage: 'Desenvolvimento de equipe',
    category: 'carreira'
  },
  meta_pv: {
    term: 'Meta de PV',
    definition: 'Quantidade mensal de PV necessária para atingir resultado (250, 500, 1000, 2500). Sempre convertida em ações simples',
    usage: 'Sempre transformada em ações práticas',
    category: 'operacional'
  },
  milionario: {
    term: 'Milionário',
    definition: 'Nível avançado atingido com 64.000 PV; gera ~4000 royalties',
    usage: 'Nível de carreira avançada',
    category: 'carreira'
  },
  noel: {
    term: 'NOEL',
    definition: 'Mentor oficial do Wellness System; IA especializada em duplicação, vendas, rotina e carreira',
    usage: 'Sempre referido como mentor',
    category: 'sistema'
  },
  objetivo_cliente: {
    term: 'Objetivo do cliente',
    definition: 'Motivo principal pelo qual o cliente busca a bebida: energia, retenção, foco, emagrecimento',
    usage: 'Sempre identificado antes de oferecer produto',
    category: 'operacional'
  },
  patrocinador: {
    term: 'Patrocinador',
    definition: 'Mentor humano do consultor; complementa o NOEL com visão, liderança e acolhimento',
    usage: 'Referência humana',
    category: 'pessoa'
  },
  pv: {
    term: 'PV (Pontos de Volume)',
    definition: 'Métrica usada para medir produção pessoal e de equipe',
    usage: 'Sempre convertido em ações práticas',
    category: 'operacional'
  },
  proposta: {
    term: 'Proposta',
    definition: 'Parte da conversa em que o consultor sugere o produto ideal',
    usage: 'Sempre leve e direcionada',
    category: 'operacional'
  },
  profundidade: {
    term: 'Profundidade',
    definition: 'Desenvolvimento de níveis sucessivos de consultores; essencial para GET e acima',
    usage: 'Desenvolvimento de equipe',
    category: 'carreira'
  },
  quiz: {
    term: 'Quiz',
    definition: 'Ferramenta que diagnostica cliente e conduz a um fluxo específico',
    usage: 'Motor de lead',
    category: 'sistema'
  },
  reativacao: {
    term: 'Reativação',
    definition: 'Técnica usada para clientes sumidos; fluxo leve e direto',
    usage: 'Sempre com leveza',
    category: 'operacional'
  },
  recrutamento: {
    term: 'Recrutamento',
    definition: 'Processo de apresentar o negócio para uma pessoa interessada',
    usage: 'Sempre sem pressão',
    category: 'operacional'
  },
  rotina_50_75_100_pv: {
    term: 'Rotina 50–75–100 PV',
    definition: 'Estrutura de consumo mensal para formação de clientes',
    usage: 'Evolução natural do cliente',
    category: 'operacional'
  },
  royalties: {
    term: 'Royalties',
    definition: 'Valores pagos com base em produção de equipe (GET, Milionário, Presidente)',
    usage: 'Renda de equipe',
    category: 'carreira'
  },
  script: {
    term: 'Script',
    definition: 'Mensagem pronta sugerida pelo NOEL; adaptada ao tipo de pessoa, momento e fluxo',
    usage: 'Sempre personalizado',
    category: 'operacional'
  },
  segmento: {
    term: 'Segmento',
    definition: 'Grupo com características específicas (amigos, Instagram, mercado frio)',
    usage: 'Para personalização',
    category: 'pessoa'
  },
  turbo: {
    term: 'Turbo (Litrão Turbo)',
    definition: 'Produto de 5 dias para retenção, metabolismo e aceleração; aumenta PV do cliente',
    usage: 'Para clientes que querem resultados mais rápidos',
    category: 'produto'
  },
  trava_emocional: {
    term: 'Trava emocional',
    definition: 'Estado em que o consultor está travado; exige simplificação',
    usage: 'Sempre tratado com leveza',
    category: 'operacional'
  },
  upsell: {
    term: 'Upsell',
    definition: 'Aumento do ticket após compra inicial; ex.: kit → Turbo → Hype → produto fechado',
    usage: 'Evolução natural do cliente',
    category: 'operacional'
  },
  volume_pessoal: {
    term: 'Volume pessoal',
    definition: 'PV gerado pelo consultor com clientes diretos',
    usage: 'Base do negócio',
    category: 'operacional'
  },
  volume_equipe: {
    term: 'Volume de equipe',
    definition: 'PV gerado em profundidade; utilizado em GET+',
    usage: 'Desenvolvimento de carreira',
    category: 'carreira'
  }
}

/**
 * Buscar termo no glossário
 */
export function getGlossaryTerm(term: string): GlossaryTerm | null {
  const key = term.toLowerCase().replace(/\s+/g, '_')
  return NOEL_GLOSSARY[key] || null
}

/**
 * Listar termos por categoria
 */
export function getTermsByCategory(category: GlossaryTerm['category']): GlossaryTerm[] {
  return Object.values(NOEL_GLOSSARY).filter(term => term.category === category)
}

/**
 * Validar uso correto de termo
 */
export function validateTermUsage(term: string, context: string): {
  correct: boolean
  suggestion?: string
} {
  const glossaryTerm = getGlossaryTerm(term)
  
  if (!glossaryTerm) {
    return {
      correct: false,
      suggestion: 'Termo não encontrado no glossário'
    }
  }
  
  // Verificar se o uso está alinhado com a definição
  const lowerContext = context.toLowerCase()
  const lowerDefinition = glossaryTerm.definition.toLowerCase()
  
  // Verificação básica - pode ser expandida
  const isAligned = lowerContext.includes(term.toLowerCase()) || 
                    lowerDefinition.split(' ').some(word => lowerContext.includes(word))
  
  return {
    correct: isAligned,
    suggestion: isAligned ? undefined : `Uso sugerido: ${glossaryTerm.usage}`
  }
}






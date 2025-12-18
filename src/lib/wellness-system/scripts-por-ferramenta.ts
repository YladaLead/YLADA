/**
 * MAPEAMENTO DE SCRIPTS POR FERRAMENTA
 * 
 * Cada ferramenta tem scripts para 3 situações:
 * - Lista Quente: amigos, família, conhecidos
 * - Lista Fria: desconhecidos, redes sociais
 * - Pegar Indicação: após a pessoa usar a ferramenta
 */

export interface ScriptFerramenta {
  id: string
  tipo: 'lista_quente' | 'lista_fria' | 'indicacao'
  titulo: string
  texto: string
  dica?: string
}

export interface ScriptsFerramentaConfig {
  ferramenta: string // nome da ferramenta
  slugs: string[] // slugs que correspondem a esta ferramenta
  icon: string
  scripts: ScriptFerramenta[]
}

/**
 * Scripts organizados por ferramenta
 */
export const scriptsPorFerramenta: ScriptsFerramentaConfig[] = [
  // =====================================================
  // CALCULADORAS
  // =====================================================
  {
    ferramenta: 'Calculadora de Água',
    slugs: ['calculadora-agua', 'calculadora-de-agua', 'agua'],
    icon: '💧',
    scripts: [
      {
        id: 'agua-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! 👋

Lembra que você comentou sobre querer beber mais água? Achei uma calculadora que mostra exatamente quanto você precisa beber por dia baseado no seu peso e atividade.

É rapidinho, menos de 1 minuto! Quer testar?

[LINK]`,
        dica: 'Use quando a pessoa já mencionou algo sobre hidratação ou saúde'
      },
      {
        id: 'agua-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Você sabia que 75% das pessoas bebem menos água do que deveriam? 💧

Criei uma calculadora gratuita que mostra quanto você realmente precisa beber por dia.

Leva menos de 1 minuto. Quer descobrir?

[LINK]`,
        dica: 'Boa para stories, posts ou mensagens frias'
      },
      {
        id: 'agua-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pegar Indicação',
        texto: `Que legal que você fez o cálculo! 🎉

O resultado te surpreendeu?

Olha, você conhece alguém que também poderia se beneficiar sabendo quanto precisa beber de água? Me indica que eu mando pra pessoa!`,
        dica: 'Enviar logo após a pessoa ver o resultado'
      }
    ]
  },

  {
    ferramenta: 'Calculadora de Proteína',
    slugs: ['calculadora-proteina', 'calculadora-de-proteina', 'proteina'],
    icon: '🥩',
    scripts: [
      {
        id: 'proteina-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Ei [Nome]! 💪

Você sabia que a maioria das pessoas não consome proteína suficiente? Achei uma calculadora que mostra exatamente quanto você precisa por dia.

É super rápido! Quer ver quanto você precisa?

[LINK]`,
        dica: 'Ideal para quem já demonstrou interesse em fitness ou alimentação'
      },
      {
        id: 'proteina-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Sabia que consumir a quantidade certa de proteína ajuda a ter mais energia e manter o peso? 🥩

Criei uma calculadora gratuita que mostra exatamente quanto você precisa por dia baseado no seu objetivo.

Quer descobrir? Leva 1 minuto!

[LINK]`,
        dica: 'Funciona bem em grupos de saúde e bem-estar'
      },
      {
        id: 'proteina-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pegar Indicação',
        texto: `Legal! Você viu seu resultado? 

O que achou? A maioria das pessoas se surpreende!

Conhece alguém que também gostaria de saber quanto de proteína precisa? Me indica que eu mando o link! 😊`,
        dica: 'Aproveite o momento de surpresa com o resultado'
      }
    ]
  },

  {
    ferramenta: 'Calculadora de IMC',
    slugs: ['calculadora-imc', 'imc', 'indice-massa-corporal'],
    icon: '⚖️',
    scripts: [
      {
        id: 'imc-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]!

Você já sabe qual é seu IMC? Achei uma calculadora que além de mostrar o número, explica o que significa e dá dicas personalizadas.

Quer fazer? É bem rápido!

[LINK]`,
        dica: 'Bom para quem já falou sobre peso ou saúde'
      },
      {
        id: 'imc-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Você sabe qual é seu IMC e o que ele significa para sua saúde? ⚖️

Tenho uma calculadora gratuita que mostra seu IMC e explica se você está na faixa ideal.

Leva menos de 30 segundos! Quer testar?

[LINK]`,
        dica: 'Funciona bem como curiosidade'
      },
      {
        id: 'imc-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pegar Indicação',
        texto: `E aí, viu seu resultado? O que achou?

Conhece mais alguém que gostaria de saber o IMC? Me manda o contato que eu envio o link! 

Às vezes a gente nem imagina que está fora da faixa ideal, né?`,
        dica: 'Seja sensível - IMC é um tema delicado para algumas pessoas'
      }
    ]
  },

  // =====================================================
  // QUIZZES DE VENDAS
  // =====================================================
  {
    ferramenta: 'Quiz de Energia',
    slugs: ['quiz-energia', 'quiz-energetico', 'energia', 'nivel-energia'],
    icon: '⚡',
    scripts: [
      {
        id: 'energia-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! ⚡

Lembra que você falou que anda cansado(a)? Achei um quiz rápido que identifica o que pode estar causando isso.

São só 5 perguntas e você descobre seu perfil de energia! Quer fazer?

[LINK]`,
        dica: 'Perfeito para quem já reclamou de cansaço'
      },
      {
        id: 'energia-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Você sente que sua energia não é mais a mesma? 😴

Criei um quiz gratuito que identifica seu perfil de energia e mostra o que pode estar faltando.

Leva menos de 2 minutos. Quer descobrir?

[LINK]`,
        dica: 'Tema universal - funciona com quase todo mundo'
      },
      {
        id: 'energia-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pegar Indicação',
        texto: `E aí, qual foi seu perfil? Se identificou?

Olha, esse quiz ajuda muita gente a entender o que está faltando. Você conhece alguém que vive reclamando de cansaço?

Me indica que eu mando o quiz! Pode ajudar muito a pessoa! 💪`,
        dica: 'Cansaço é uma reclamação comum - fácil de indicar'
      }
    ]
  },

  {
    ferramenta: 'Quiz Perfil Intestinal',
    slugs: ['perfil-intestino', 'quiz-intestino', 'saude-intestinal', 'intestino'],
    icon: '🫃',
    scripts: [
      {
        id: 'intestino-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]!

Sabia que a saúde intestinal afeta tudo? Humor, energia, imunidade...

Achei um quiz que identifica como está seu intestino. São 10 perguntas rápidas!

Quer fazer? Te conto o resultado!

[LINK]`,
        dica: 'Bom para quem já falou de problemas digestivos'
      },
      {
        id: 'intestino-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Você sabia que 70% da sua imunidade está no intestino? 🫃

Criei um quiz que identifica seu perfil intestinal e mostra se você está cuidando bem dessa área.

São só 2 minutos. Quer descobrir seu perfil?

[LINK]`,
        dica: 'Tema que desperta curiosidade'
      },
      {
        id: 'intestino-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pegar Indicação',
        texto: `O que achou do resultado? Fez sentido pra você?

Esse quiz ajuda muita gente a entender problemas que nem sabia que tinha!

Conhece alguém que vive com problema de intestino ou digestão? Me indica que eu mando o quiz!`,
        dica: 'Problema comum mas pouco falado'
      }
    ]
  },

  // =====================================================
  // QUIZZES DE RECRUTAMENTO
  // =====================================================
  {
    ferramenta: 'Quiz Ganhos e Prosperidade',
    slugs: ['quiz-ganhos', 'ganhos-prosperidade', 'quiz-ganhos-prosperidade'],
    icon: '🎯',
    scripts: [
      {
        id: 'ganhos-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! 

Lembra que você comentou sobre querer uma renda extra? Achei um quiz que mostra qual seu perfil de ganhos e qual oportunidade combina mais com você.

São só 5 perguntas! Quer fazer?

[LINK]`,
        dica: 'Perfeito para quem já demonstrou interesse em renda extra'
      },
      {
        id: 'ganhos-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Você já pensou em ter uma renda extra? 💰

Criei um quiz que identifica seu perfil de ganhos e mostra qual oportunidade combina mais com você.

São 5 perguntas rápidas. Quer descobrir seu perfil?

[LINK]`,
        dica: 'Funciona bem em grupos de empreendedorismo'
      },
      {
        id: 'ganhos-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pegar Indicação',
        texto: `E aí, qual foi seu perfil? Fez sentido pra você?

Olha, muita gente se identifica e acaba descobrindo uma oportunidade incrível!

Você conhece alguém que também está buscando uma renda extra? Me indica que eu mando o quiz!`,
        dica: 'Momento ideal para expandir a rede'
      }
    ]
  },

  {
    ferramenta: 'Quiz Potencial de Crescimento',
    slugs: ['quiz-potencial', 'potencial-crescimento', 'quiz-potencial-crescimento'],
    icon: '📈',
    scripts: [
      {
        id: 'potencial-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]!

Você já parou pra pensar no seu potencial de crescimento? Achei um quiz que analisa suas características e mostra até onde você pode chegar.

Quer fazer? São só 5 perguntas!

[LINK]`,
        dica: 'Bom para pessoas ambiciosas ou que querem mudança'
      },
      {
        id: 'potencial-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Você sabe qual é seu potencial de crescimento? 📈

Criei um quiz que analisa suas características e mostra oportunidades que combinam com seu perfil.

Leva menos de 2 minutos. Quer descobrir?

[LINK]`,
        dica: 'Apela para o desejo de evolução'
      },
      {
        id: 'potencial-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pegar Indicação',
        texto: `O que achou do seu resultado? Se identificou?

Esse quiz ajuda muita gente a enxergar oportunidades que não via antes!

Conhece alguém que está buscando crescer profissionalmente? Me indica que eu mando!`,
        dica: 'Crescimento é desejo universal'
      }
    ]
  },

  {
    ferramenta: 'Quiz Propósito e Equilíbrio',
    slugs: ['quiz-proposito', 'proposito-equilibrio', 'quiz-proposito-equilibrio'],
    icon: '⚖️',
    scripts: [
      {
        id: 'proposito-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]!

Você sente que está vivendo com propósito? Achei um quiz que analisa seu momento e mostra caminhos para ter mais equilíbrio.

São 5 perguntas reflexivas. Quer fazer?

[LINK]`,
        dica: 'Para pessoas em momento de reflexão ou mudança'
      },
      {
        id: 'proposito-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Você sente que sua vida está equilibrada? ⚖️

Criei um quiz que ajuda a identificar áreas que precisam de atenção e mostra caminhos para mais equilíbrio.

Leva 2 minutos. Quer descobrir?

[LINK]`,
        dica: 'Tema profundo que gera engajamento'
      },
      {
        id: 'proposito-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pegar Indicação',
        texto: `O resultado te fez refletir?

Muita gente que faz esse quiz acaba descobrindo que precisa de mudanças...

Conhece alguém que está buscando mais equilíbrio na vida? Me indica que eu envio!`,
        dica: 'Momento de reflexão gera abertura para indicações'
      }
    ]
  },

  // =====================================================
  // HOM (RECRUTAMENTO)
  // =====================================================
  {
    ferramenta: 'HOM Gravada',
    slugs: ['hom', 'hom-gravada', 'apresentacao-negocio'],
    icon: '🎥',
    scripts: [
      {
        id: 'hom-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! 👋

Lembra que você falou sobre querer uma renda extra? Tenho uma apresentação de uma oportunidade incrível com bebidas funcionais.

São só alguns minutos e pode mudar sua visão sobre negócios! Quer ver?

[LINK]`,
        dica: 'Seja direto mas sem pressão'
      },
      {
        id: 'hom-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Você já ouviu falar do mercado de bebidas funcionais? 🍹

É um mercado em crescimento e estou trabalhando com uma oportunidade muito interessante.

Preparei uma apresentação curta que explica tudo. Quer dar uma olhada?

[LINK]`,
        dica: 'Foque na curiosidade, não na venda'
      },
      {
        id: 'hom-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pegar Indicação',
        texto: `O que achou da apresentação? Alguma dúvida?

Olha, mesmo que não seja pra você agora, você conhece alguém que poderia se interessar por uma renda extra?

Me indica que eu mando a apresentação! Isso me ajuda muito! 🙏`,
        dica: 'SEMPRE peça indicação, mesmo se a pessoa não se interessar'
      }
    ]
  },

  // =====================================================
  // FLUXOS GERAIS (fallback para ferramentas sem scripts específicos)
  // =====================================================
  {
    ferramenta: 'Ferramenta Geral',
    slugs: ['default', 'geral', 'outros'],
    icon: '📋',
    scripts: [
      {
        id: 'geral-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]!

Achei uma ferramenta que pode te ajudar! É gratuita e leva menos de 2 minutos.

Quer testar?

[LINK]`,
        dica: 'Script genérico para qualquer ferramenta'
      },
      {
        id: 'geral-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Tenho uma ferramenta gratuita que pode te ajudar!

Leva menos de 2 minutos. Quer testar?

[LINK]`,
        dica: 'Mantenha simples e direto'
      },
      {
        id: 'geral-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pegar Indicação',
        texto: `Gostou? O que achou?

Você conhece alguém que também poderia gostar? Me indica que eu mando pra pessoa!`,
        dica: 'Sempre peça indicação após qualquer interação'
      }
    ]
  }
]

/**
 * Busca scripts para uma ferramenta específica pelo slug
 */
export function getScriptsPorSlug(slug: string): ScriptsFerramentaConfig | null {
  const slugNormalizado = slug.toLowerCase().trim()
  
  // Buscar ferramenta que contenha o slug
  const config = scriptsPorFerramenta.find(f => 
    f.slugs.some(s => slugNormalizado.includes(s) || s.includes(slugNormalizado))
  )
  
  // Se não encontrou, retornar scripts gerais
  if (!config) {
    return scriptsPorFerramenta.find(f => f.slugs.includes('default')) || null
  }
  
  return config
}

/**
 * Busca scripts para uma ferramenta pelo nome
 */
export function getScriptsPorNome(nome: string): ScriptsFerramentaConfig | null {
  const nomeNormalizado = nome.toLowerCase().trim()
  
  // Buscar ferramenta pelo nome
  const config = scriptsPorFerramenta.find(f => 
    f.ferramenta.toLowerCase().includes(nomeNormalizado) ||
    nomeNormalizado.includes(f.ferramenta.toLowerCase())
  )
  
  // Se não encontrou, tentar pelos slugs
  if (!config) {
    return getScriptsPorSlug(nomeNormalizado)
  }
  
  return config
}

/**
 * Retorna todos os scripts organizados por tipo
 */
export function getScriptsPorTipo(config: ScriptsFerramentaConfig): {
  listaQuente: ScriptFerramenta[]
  listaFria: ScriptFerramenta[]
  indicacao: ScriptFerramenta[]
} {
  return {
    listaQuente: config.scripts.filter(s => s.tipo === 'lista_quente'),
    listaFria: config.scripts.filter(s => s.tipo === 'lista_fria'),
    indicacao: config.scripts.filter(s => s.tipo === 'indicacao')
  }
}

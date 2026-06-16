/**
 * MAPEAMENTO DE SCRIPTS POR FERRAMENTA
 * 
 * Cada ferramenta tem scripts para 3 situações:
 * - Lista Quente: amigos, família, indicações
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

import { normalizeTemplateSlug } from '@/lib/template-slug-map'

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
    slugs: [
      'calculadora-agua',
      'calculadora-de-agua',
      'calculadora-hidratacao',
      'calculadora-de-hidratacao',
      'calc-hidratacao',
      'calc-agua',
      'hidratacao',
      'agua',
    ],
    icon: '💧',
    scripts: [
      {
        id: 'agua-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Olá! Tudo bem?

Lembra que você comentou sobre querer beber mais água? Existe uma calculadora que mostra exatamente quanto cada pessoa precisa beber por dia baseado no peso e atividade. É uma forma simples de cuidar melhor da nossa hidratação e saúde.

Posso te enviar o link? Você já pode compartilhar com seus amigos e familiares que você gosta. Hidratação é fundamental pra saúde de todos nós!

[LINK]

Compartilhe com quem você gosta! Assim a gente ajuda mais gente a se hidratar melhor. É uma coisa boa pra todos! 💧`,
        dica: 'Use quando a pessoa já mencionou algo sobre hidratação ou saúde'
      },
      {
        id: 'agua-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Olá! Tudo bem?

Existe uma calculadora que mostra exatamente quanto de água cada pessoa precisa beber por dia baseado no peso e atividade. É uma forma simples de cuidar melhor da nossa hidratação e saúde.

Posso te enviar o link? Você já pode compartilhar com seus amigos e familiares que você gosta. Hidratação é fundamental pra saúde de todos nós!

[LINK]

Compartilhe com quem você gosta! Assim a gente ajuda mais gente a se hidratar melhor. É uma coisa boa pra todos! 💧`,
        dica: 'Boa para stories, posts ou mensagens frias'
      },
      {
        id: 'agua-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pegar Indicação',
        texto: `Que legal que você fez o cálculo! 🎉

O resultado te surpreendeu?

Compartilhe com seus amigos e familiares que você gosta! Assim a gente ajuda mais gente a se hidratar melhor. Hidratação é fundamental pra saúde de todos nós!

É uma coisa boa pra todos! 💧`,
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
        texto: `Olá! Tudo bem?

Existe uma calculadora que mostra exatamente quantas gramas de proteína cada pessoa precisa por dia baseado no peso, atividade física e objetivo. É uma forma simples de entender melhor nossas necessidades nutricionais e cuidar da nossa saúde.

Posso te enviar o link? Você já pode compartilhar com seus amigos e familiares que você gosta. Proteína adequada é fundamental pra saúde de todos nós!

[LINK]

Compartilhe com quem você gosta! Assim a gente ajuda mais gente a cuidar da nutrição. É uma coisa boa pra todos! 🥩`,
        dica: 'Ideal para quem já demonstrou interesse em fitness ou alimentação'
      },
      {
        id: 'proteina-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Olá! Tudo bem?

Existe uma calculadora que mostra exatamente quantas gramas de proteína cada pessoa precisa por dia baseado no peso, atividade física e objetivo. É uma forma simples de entender melhor nossas necessidades nutricionais e cuidar da nossa saúde.

Posso te enviar o link? Você já pode compartilhar com seus amigos e familiares que você gosta. Proteína adequada é fundamental pra saúde de todos nós!

[LINK]

Compartilhe com quem você gosta! Assim a gente ajuda mais gente a cuidar da nutrição. É uma coisa boa pra todos! 🥩`,
        dica: 'Funciona bem em grupos de saúde e bem-estar'
      },
      {
        id: 'proteina-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pegar Indicação',
        texto: `Que legal que você fez o cálculo! 🎉

O resultado te surpreendeu? A maioria das pessoas se surpreende!

Compartilhe com seus amigos e familiares que você gosta! Assim a gente ajuda mais gente a cuidar da nutrição. Proteína adequada é fundamental pra saúde de todos nós!

É uma coisa boa pra todos! 🥩`,
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
        texto: `Olá! Tudo bem?

Existe uma calculadora de IMC que indica nossos índices de saúde, massa e gordura. Além de calcular o número, explica o que significa e dá orientações personalizadas. É uma forma simples de entender melhor nossa saúde e saber se estamos no caminho certo para o bem-estar.

Posso te enviar o link? Você já pode compartilhar com seus amigos e familiares que você gosta. Isso é importante pra toda nossa família cuidar da saúde!

[LINK]

Compartilhe com quem você gosta! Assim a gente ajuda mais gente a cuidar da saúde. É uma coisa boa pra todos! ⚖️`,
        dica: 'Bom para quem já falou sobre peso ou saúde'
      },
      {
        id: 'imc-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Olá! Tudo bem?

Existe uma calculadora de IMC que indica nossos índices de saúde, massa e gordura. Além de calcular o número, explica o que significa e dá orientações personalizadas. É uma forma simples de entender melhor nossa saúde e saber se estamos no caminho certo para o bem-estar.

Posso te enviar o link? Você já pode compartilhar com seus amigos e familiares que você gosta. Isso é importante pra toda nossa família cuidar da saúde!

[LINK]

Compartilhe com quem você gosta! Assim a gente ajuda mais gente a cuidar da saúde. É uma coisa boa pra todos! ⚖️`,
        dica: 'Funciona bem como curiosidade'
      },
      {
        id: 'imc-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pegar Indicação',
        texto: `Que legal que você fez o cálculo! 🎉

O resultado te surpreendeu? Às vezes a gente nem imagina que está fora da faixa ideal, né?

Compartilhe com seus amigos e familiares que você gosta! Assim a gente ajuda mais gente a cuidar da saúde. Isso é importante pra toda nossa família!

É uma coisa boa pra todos! ⚖️`,
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
        texto: `Olá! Tudo bem?

Lembra que você falou que anda cansado(a)? Existe um quiz que identifica nosso perfil de energia e mostra o que pode estar causando cansaço ou falta de disposição. É uma forma de entender melhor nossa energia e descobrir estratégias para melhorar.

Posso te enviar o link? Você já pode compartilhar com seus amigos e familiares que você gosta. Energia é importante pra toda nossa família!

[LINK]

Compartilhe com quem você gosta! Assim a gente ajuda mais gente a entender e melhorar a energia. É uma coisa boa pra todos! ⚡`,
        dica: 'Perfeito para quem já reclamou de cansaço'
      },
      {
        id: 'energia-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Olá! Tudo bem?

Existe um quiz que identifica nosso perfil de energia e mostra o que pode estar causando cansaço ou falta de disposição. É uma forma de entender melhor nossa energia e descobrir estratégias para melhorar.

Posso te enviar o link? Você já pode compartilhar com seus amigos e familiares que você gosta. Energia é importante pra toda nossa família!

[LINK]

Compartilhe com quem você gosta! Assim a gente ajuda mais gente a entender e melhorar a energia. É uma coisa boa pra todos! ⚡`,
        dica: 'Tema universal - funciona com quase todo mundo'
      },
      {
        id: 'energia-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pegar Indicação',
        texto: `Que legal que você fez o quiz! 🎉

Qual foi seu perfil? Se identificou? Esse quiz ajuda muita gente a entender o que está faltando!

Compartilhe com seus amigos e familiares que você gosta! Assim a gente ajuda mais gente a entender e melhorar a energia. Energia é importante pra toda nossa família!

É uma coisa boa pra todos! ⚡`,
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
        texto: `Olá! Tudo bem?

Sabia que a saúde intestinal afeta tudo? Humor, energia, imunidade... Existe um quiz que identifica nosso perfil intestinal e mostra como está nossa saúde digestiva. É uma forma de entender melhor nossa saúde e descobrir o que pode estar afetando nosso bem-estar.

Posso te enviar o link? Você já pode compartilhar com seus amigos e familiares que você gosta. Saúde intestinal é importante pra toda nossa família!

[LINK]

Compartilhe com quem você gosta! Assim a gente ajuda mais gente a cuidar da saúde intestinal. É uma coisa boa pra todos! 🫃`,
        dica: 'Bom para quem já falou de problemas digestivos'
      },
      {
        id: 'intestino-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Olá! Tudo bem?

Você sabia que 70% da nossa imunidade está no intestino? Existe um quiz que identifica nosso perfil intestinal e mostra se estamos cuidando bem dessa área. É uma forma de entender melhor nossa saúde e descobrir o que pode estar afetando nosso bem-estar.

Posso te enviar o link? Você já pode compartilhar com seus amigos e familiares que você gosta. Saúde intestinal é importante pra toda nossa família!

[LINK]

Compartilhe com quem você gosta! Assim a gente ajuda mais gente a cuidar da saúde intestinal. É uma coisa boa pra todos! 🫃`,
        dica: 'Tema que desperta curiosidade'
      },
      {
        id: 'intestino-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pegar Indicação',
        texto: `Que legal que você fez o quiz! 🎉

O que achou do resultado? Fez sentido pra você? Esse quiz ajuda muita gente a entender problemas que nem sabia que tinha!

Compartilhe com seus amigos e familiares que você gosta! Assim a gente ajuda mais gente a cuidar da saúde intestinal. Saúde intestinal é importante pra toda nossa família!

É uma coisa boa pra todos! 🫃`,
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
        texto: `Olá! Tudo bem?

Lembra que você comentou sobre querer uma renda extra? Existe um quiz que identifica nosso perfil de ganhos e mostra qual oportunidade combina mais com nosso perfil. É uma forma de entender melhor nossas características e descobrir oportunidades que fazem sentido.

Posso te enviar o link? Você já pode compartilhar com seus amigos e familiares que você gosta. Renda extra é importante pra toda nossa família!

[LINK]

Compartilhe com quem você gosta! Assim a gente ajuda mais gente a descobrir novas oportunidades. É uma coisa boa pra todos! 💰`,
        dica: 'Perfeito para quem já demonstrou interesse em renda extra'
      },
      {
        id: 'ganhos-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Olá! Tudo bem?

Existe um quiz que identifica nosso perfil de ganhos e mostra qual oportunidade combina mais com nosso perfil. É uma forma de entender melhor nossas características e descobrir oportunidades que fazem sentido.

Posso te enviar o link? Você já pode compartilhar com seus amigos e familiares que você gosta. Renda extra é importante pra toda nossa família!

[LINK]

Compartilhe com quem você gosta! Assim a gente ajuda mais gente a descobrir novas oportunidades. É uma coisa boa pra todos! 💰`,
        dica: 'Funciona bem em grupos de empreendedorismo'
      },
      {
        id: 'ganhos-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pegar Indicação',
        texto: `Que legal que você fez o quiz! 🎉

Qual foi seu perfil? Fez sentido pra você? Muita gente se identifica e acaba descobrindo uma oportunidade incrível!

Compartilhe com seus amigos e familiares que você gosta! Assim a gente ajuda mais gente a descobrir novas oportunidades. Renda extra é importante pra toda nossa família!

É uma coisa boa pra todos! 💰`,
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
        texto: `Olá! Tudo bem?

Você já parou pra pensar no nosso potencial de crescimento? Existe um quiz que analisa nossas características e mostra até onde podemos chegar. É uma forma de entender melhor nosso potencial e descobrir oportunidades que combinam com nosso perfil.

Posso te enviar o link? Você já pode compartilhar com seus amigos e familiares que você gosta. Crescimento é importante pra toda nossa família!

[LINK]

Compartilhe com quem você gosta! Assim a gente ajuda mais gente a descobrir seu potencial. É uma coisa boa pra todos! 📈`,
        dica: 'Bom para pessoas ambiciosas ou que querem mudança'
      },
      {
        id: 'potencial-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Olá! Tudo bem?

Existe um quiz que analisa nosso potencial de crescimento e mostra oportunidades que combinam com nosso perfil. É uma forma de entender melhor nosso potencial e descobrir até onde podemos chegar.

Posso te enviar o link? Você já pode compartilhar com seus amigos e familiares que você gosta. Crescimento é importante pra toda nossa família!

[LINK]

Compartilhe com quem você gosta! Assim a gente ajuda mais gente a descobrir seu potencial. É uma coisa boa pra todos! 📈`,
        dica: 'Apela para o desejo de evolução'
      },
      {
        id: 'potencial-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pegar Indicação',
        texto: `Que legal que você fez o quiz! 🎉

O que achou do seu resultado? Se identificou? Esse quiz ajuda muita gente a enxergar oportunidades que não via antes!

Compartilhe com seus amigos e familiares que você gosta! Assim a gente ajuda mais gente a descobrir seu potencial. Crescimento é importante pra toda nossa família!

É uma coisa boa pra todos! 📈`,
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
        texto: `Olá! Tudo bem?

Você sente que está vivendo com propósito? Existe um quiz que analisa nosso momento e mostra caminhos para ter mais equilíbrio na vida. É uma forma de entender melhor nossa situação e descobrir áreas que precisam de atenção.

Posso te enviar o link? Você já pode compartilhar com seus amigos e familiares que você gosta. Equilíbrio é importante pra toda nossa família!

[LINK]

Compartilhe com quem você gosta! Assim a gente ajuda mais gente a encontrar mais equilíbrio. É uma coisa boa pra todos! ⚖️`,
        dica: 'Para pessoas em momento de reflexão ou mudança'
      },
      {
        id: 'proposito-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Olá! Tudo bem?

Existe um quiz que ajuda a identificar áreas que precisam de atenção e mostra caminhos para mais equilíbrio na vida. É uma forma de entender melhor nossa situação e descobrir como viver com mais propósito.

Posso te enviar o link? Você já pode compartilhar com seus amigos e familiares que você gosta. Equilíbrio é importante pra toda nossa família!

[LINK]

Compartilhe com quem você gosta! Assim a gente ajuda mais gente a encontrar mais equilíbrio. É uma coisa boa pra todos! ⚖️`,
        dica: 'Tema profundo que gera engajamento'
      },
      {
        id: 'proposito-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pegar Indicação',
        texto: `Que legal que você fez o quiz! 🎉

O resultado te fez refletir? Muita gente que faz esse quiz acaba descobrindo que precisa de mudanças...

Compartilhe com seus amigos e familiares que você gosta! Assim a gente ajuda mais gente a encontrar mais equilíbrio. Equilíbrio é importante pra toda nossa família!

É uma coisa boa pra todos! ⚖️`,
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
        texto: `Olá! Tudo bem?

Lembra que você falou sobre querer uma renda extra? Existe uma apresentação sobre uma oportunidade interessante no mercado de bebidas funcionais. É uma forma de conhecer uma oportunidade que pode fazer sentido para nossa família e pessoas que a gente gosta.

Posso te enviar o link? Você já pode compartilhar com seus amigos e familiares que você gosta. Renda extra é importante pra toda nossa família!

[LINK]

Compartilhe com quem você gosta! Assim a gente ajuda mais gente a descobrir novas oportunidades. É uma coisa boa pra todos! 💰`,
        dica: 'Seja direto mas sem pressão'
      },
      {
        id: 'hom-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Olá! Tudo bem?

Existe uma apresentação sobre uma oportunidade interessante no mercado de bebidas funcionais. É uma forma de conhecer uma oportunidade que pode fazer sentido para nossa família e pessoas que a gente gosta.

Posso te enviar o link? Você já pode compartilhar com seus amigos e familiares que você gosta. Renda extra é importante pra toda nossa família!

[LINK]

Compartilhe com quem você gosta! Assim a gente ajuda mais gente a descobrir novas oportunidades. É uma coisa boa pra todos! 💰`,
        dica: 'Foque na curiosidade, não na venda'
      },
      {
        id: 'hom-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pegar Indicação',
        texto: `Que legal que você assistiu a apresentação! 🎉

O que achou? Alguma dúvida? Mesmo que não seja pra você agora, pode fazer sentido para alguém que você conhece!

Compartilhe com seus amigos e familiares que você gosta! Assim a gente ajuda mais gente a descobrir novas oportunidades. Renda extra é importante pra toda nossa família!

É uma coisa boa pra todos! 💰`,
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
        texto: `Olá! Tudo bem?

Existe uma ferramenta que pode ajudar a cuidar melhor da nossa saúde e bem-estar. É uma forma simples de entender melhor nossa situação e descobrir o que pode estar afetando nosso bem-estar.

Posso te enviar o link? Você já pode compartilhar com seus amigos e familiares que você gosta. Saúde é importante pra toda nossa família!

[LINK]

Compartilhe com quem você gosta! Assim a gente ajuda mais gente a cuidar da saúde. É uma coisa boa pra todos! 💚`,
        dica: 'Script genérico para qualquer ferramenta'
      },
      {
        id: 'geral-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Olá! Tudo bem?

Existe uma ferramenta que pode ajudar a cuidar melhor da nossa saúde e bem-estar. É uma forma simples de entender melhor nossa situação e descobrir o que pode estar afetando nosso bem-estar.

Posso te enviar o link? Você já pode compartilhar com seus amigos e familiares que você gosta. Saúde é importante pra toda nossa família!

[LINK]

Compartilhe com quem você gosta! Assim a gente ajuda mais gente a cuidar da saúde. É uma coisa boa pra todos! 💚`,
        dica: 'Mantenha simples e direto'
      },
      {
        id: 'geral-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pegar Indicação',
        texto: `Que legal que você usou a ferramenta! 🎉

Gostou? O que achou?

Compartilhe com seus amigos e familiares que você gosta! Assim a gente ajuda mais gente a cuidar da saúde. Saúde é importante pra toda nossa família!

É uma coisa boa pra todos! 💚`,
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
  const slugCanonico = normalizeTemplateSlug(slugNormalizado)

  const matchExato = scriptsPorFerramenta.find(
    (f) =>
      !f.slugs.includes('default') &&
      f.slugs.some(
        (s) =>
          slugNormalizado === s ||
          slugCanonico === s ||
          slugNormalizado === normalizeTemplateSlug(s)
      )
  )
  if (matchExato) return matchExato

  const config = scriptsPorFerramenta.find(
    (f) =>
      !f.slugs.includes('default') &&
      f.slugs.some(
        (s) => slugNormalizado.includes(s) || s.includes(slugNormalizado)
      )
  )

  if (!config) {
    return scriptsPorFerramenta.find((f) => f.slugs.includes('default')) || null
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













/**
 * SCRIPTS DE ABORDAGEM PARA NUTRICIONISTAS
 * 
 * Cada ferramenta tem scripts para 3 situações:
 * - Lista Quente: amigos, família, conhecidos
 * - Lista Fria: desconhecidos, redes sociais
 * - Indicação: pedir que compartilhem após usar a ferramenta
 */

export interface ScriptNutri {
  id: string
  tipo: 'lista_quente' | 'lista_fria' | 'indicacao'
  titulo: string
  texto: string
  dica?: string
}

export interface ScriptsNutriConfig {
  ferramenta: string
  slugs: string[]
  icon: string
  scripts: ScriptNutri[]
}

/**
 * Scripts organizados por ferramenta Nutri
 */
export const scriptsNutri: ScriptsNutriConfig[] = [
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

Lembra que você comentou sobre querer beber mais água? Criei uma calculadora que mostra exatamente quanto você precisa por dia.

É rapidinho, menos de 1 minuto! Quer testar?

[LINK]`,
        dica: 'Use quando a pessoa já mencionou algo sobre hidratação'
      },
      {
        id: 'agua-quente-2',
        tipo: 'lista_quente',
        titulo: 'Pedindo Opinião',
        texto: `Ei [Nome]! Preciso da sua ajuda 🙏

Criei uma calculadora de água pra usar com meus pacientes. Você pode testar e me dar um feedback sincero?

Leva menos de 1 minuto:
[LINK]

Me conta o que achou!`,
        dica: 'Funciona bem para validar suas ferramentas'
      },
      {
        id: 'agua-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Você sabia que 75% das pessoas bebem menos água do que deveriam? 💧

Sou nutricionista e criei uma calculadora gratuita que mostra quanto você realmente precisa beber por dia.

Leva menos de 1 minuto. Quer descobrir?

[LINK]`,
        dica: 'Boa para stories, posts ou mensagens frias'
      },
      {
        id: 'agua-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `Que bom que gostou do resultado! 🎉

Você conhece alguém que também poderia se beneficiar sabendo quanto precisa beber de água?

Pode compartilhar o link, é gratuito:
[LINK]

Agradeço muito! 🙏`,
        dica: 'Enviar logo após a pessoa ver o resultado'
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

Você já sabe qual é seu IMC? Criei uma calculadora que além de mostrar o número, explica o que significa e dá dicas.

Quer fazer? É bem rápido!

[LINK]`,
        dica: 'Bom para quem já falou sobre peso ou saúde'
      },
      {
        id: 'imc-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Você sabe qual é seu IMC e o que ele significa? ⚖️

Sou nutricionista e tenho uma calculadora gratuita que mostra seu IMC e explica se você está na faixa ideal.

Leva menos de 30 segundos! Quer testar?

[LINK]`,
        dica: 'Funciona bem como curiosidade'
      },
      {
        id: 'imc-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `E aí, viu seu resultado? O que achou?

Conhece mais alguém que gostaria de saber o IMC? Pode compartilhar o link!

[LINK]

Às vezes a gente nem imagina que está fora da faixa ideal, né?`,
        dica: 'Seja sensível - IMC é tema delicado para algumas pessoas'
      }
    ]
  },

  {
    ferramenta: 'Calculadora de Calorias',
    slugs: ['calculadora-calorias', 'calorias', 'gasto-calorico'],
    icon: '🔥',
    scripts: [
      {
        id: 'calorias-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! 🔥

Você sabe quantas calorias seu corpo gasta por dia? Criei uma calculadora que mostra isso baseado na sua rotina.

É super rápido! Quer descobrir?

[LINK]`,
        dica: 'Ideal para quem quer emagrecer ou ganhar massa'
      },
      {
        id: 'calorias-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Você sabe quantas calorias deveria consumir por dia? 🔥

Sou nutricionista e criei uma calculadora gratuita que mostra seu gasto calórico diário personalizado.

Quer descobrir? Leva 1 minuto!

[LINK]`,
        dica: 'Funciona bem em grupos de emagrecimento'
      },
      {
        id: 'calorias-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `Gostou de saber seu gasto calórico?

Conhece alguém que está querendo emagrecer ou cuidar da alimentação? Compartilha o link com ela!

[LINK]

Agradeço muito! 😊`,
        dica: 'Aproveite o interesse no tema'
      }
    ]
  },

  {
    ferramenta: 'Calculadora de Proteína',
    slugs: ['calculadora-proteina', 'proteina', 'necessidade-proteina'],
    icon: '🥩',
    scripts: [
      {
        id: 'proteina-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Ei [Nome]! 💪

Você sabia que a maioria das pessoas não consome proteína suficiente? Criei uma calculadora que mostra quanto você precisa por dia.

Quer ver quanto você precisa?

[LINK]`,
        dica: 'Ideal para quem malha ou quer emagrecer'
      },
      {
        id: 'proteina-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Sabia que consumir a quantidade certa de proteína ajuda a ter mais energia e manter o peso? 🥩

Sou nutricionista e criei uma calculadora gratuita que mostra quanto você precisa por dia.

Quer descobrir? Leva 1 minuto!

[LINK]`,
        dica: 'Funciona bem em grupos de fitness'
      },
      {
        id: 'proteina-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `Legal! O que achou do resultado?

Conhece alguém que também gostaria de saber quanto de proteína precisa? Compartilha o link!

[LINK]

A maioria das pessoas se surpreende! 😊`,
        dica: 'Aproveite o momento de surpresa'
      }
    ]
  },

  // =====================================================
  // QUIZZES DE DIAGNÓSTICO
  // =====================================================
  {
    ferramenta: 'Quiz de Bem-Estar',
    slugs: ['quiz-bem-estar', 'quiz-bem-estar-nutri', 'bem-estar'],
    icon: '🌿',
    scripts: [
      {
        id: 'bem-estar-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! 🌿

Criei um quiz sobre bem-estar que te ajuda a entender como está sua saúde de forma geral.

São poucas perguntas e você descobre seu perfil! Quer fazer?

[LINK]`,
        dica: 'Bom para iniciar conversa sobre saúde'
      },
      {
        id: 'bem-estar-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Você já parou pra avaliar seu bem-estar? 🌿

Sou nutricionista e criei um quiz gratuito que identifica seu perfil de bem-estar.

Leva menos de 2 minutos. Quer descobrir?

[LINK]`,
        dica: 'Tema universal que atrai muita gente'
      },
      {
        id: 'bem-estar-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `O que achou do seu perfil? Se identificou?

Conhece alguém que também gostaria de fazer? Pode compartilhar!

[LINK]

É gratuito e ajuda muito a pessoa a se conhecer melhor! 😊`,
        dica: 'Bem-estar é tema que todo mundo gosta de falar'
      }
    ]
  },

  {
    ferramenta: 'Quiz Detox',
    slugs: ['quiz-detox', 'quiz-detox-nutri', 'detox', 'quiz-pedindo-detox'],
    icon: '🍃',
    scripts: [
      {
        id: 'detox-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! 🍃

Seu corpo está pedindo detox? Criei um quiz que identifica os sinais de que você precisa desintoxicar.

Quer descobrir? São só algumas perguntas!

[LINK]`,
        dica: 'Bom para quem reclama de cansaço ou inchaço'
      },
      {
        id: 'detox-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Cansaço, inchaço, pele sem vida... Seu corpo pode estar pedindo detox! 🍃

Sou nutricionista e criei um quiz gratuito que identifica se você precisa desintoxicar.

Quer descobrir? Leva 2 minutos!

[LINK]`,
        dica: 'Funciona muito bem em stories'
      },
      {
        id: 'detox-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `E aí, o resultado fez sentido pra você?

Conhece alguém que vive reclamando de cansaço ou inchaço? Manda o quiz pra ela!

[LINK]

Pode ser que o corpo esteja pedindo ajuda! 💚`,
        dica: 'Sintomas comuns facilitam indicações'
      }
    ]
  },

  {
    ferramenta: 'Diagnóstico de Sintomas Intestinais',
    slugs: ['diagnostico-sintomas-intestinais', 'diagnostico-sintomas-intestinais-nutri', 'intestino', 'sintomas-intestinais'],
    icon: '🫃',
    scripts: [
      {
        id: 'intestino-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]!

Sabia que 70% da imunidade está no intestino? Criei um diagnóstico que identifica como está sua saúde intestinal.

Quer descobrir seu perfil? São poucas perguntas!

[LINK]`,
        dica: 'Bom para quem já falou de problemas digestivos'
      },
      {
        id: 'intestino-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Você sabia que a saúde intestinal afeta tudo? Humor, energia, imunidade... 🫃

Sou nutricionista e criei um diagnóstico gratuito que identifica seu perfil intestinal.

Quer descobrir? Leva 2 minutos!

[LINK]`,
        dica: 'Tema que desperta curiosidade'
      },
      {
        id: 'intestino-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `O que achou do resultado? Fez sentido?

Conhece alguém que vive com problema de intestino ou digestão? Manda o diagnóstico!

[LINK]

É gratuito e pode ajudar muito! 🙏`,
        dica: 'Problema comum mas pouco falado'
      }
    ]
  },

  {
    ferramenta: 'Quiz de Perfil Nutricional',
    slugs: ['quiz-perfil-nutricional', 'perfil-nutricional', 'avaliacao-nutricional'],
    icon: '🥗',
    scripts: [
      {
        id: 'perfil-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! 🥗

Criei um quiz que identifica seu perfil nutricional e mostra onde você pode melhorar sua alimentação.

Quer descobrir seu perfil? É bem rápido!

[LINK]`,
        dica: 'Bom para quem quer cuidar da alimentação'
      },
      {
        id: 'perfil-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Você sabe qual é seu perfil nutricional? 🥗

Sou nutricionista e criei um quiz gratuito que analisa seus hábitos e mostra como você pode melhorar.

Leva menos de 2 minutos. Quer descobrir?

[LINK]`,
        dica: 'Funciona bem para captar novos pacientes'
      },
      {
        id: 'perfil-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `E aí, se identificou com o resultado?

Conhece alguém que também quer melhorar a alimentação? Compartilha o quiz!

[LINK]

É gratuito e ajuda muito a pessoa a se conhecer! 😊`,
        dica: 'Alimentação é preocupação de muita gente'
      }
    ]
  },

  {
    ferramenta: 'Quiz Tipo de Fome',
    slugs: ['quiz-tipo-fome', 'tipo-fome', 'fome-emocional'],
    icon: '🍽️',
    scripts: [
      {
        id: 'fome-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! 🍽️

Você sabe qual é seu tipo de fome? Criei um quiz que identifica se sua fome é física, emocional ou social.

Quer descobrir? São poucas perguntas!

[LINK]`,
        dica: 'Bom para quem reclama de comer demais'
      },
      {
        id: 'fome-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Você come por fome ou por emoção? 🍽️

Sou nutricionista e criei um quiz que identifica seu tipo de fome e te ajuda a entender seu comportamento alimentar.

Quer descobrir? Leva 2 minutos!

[LINK]`,
        dica: 'Tema que gera muito engajamento'
      },
      {
        id: 'fome-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `O resultado te surpreendeu?

Conhece alguém que também vive lutando com a fome? Manda o quiz!

[LINK]

Entender o tipo de fome é o primeiro passo! 💪`,
        dica: 'Muita gente se identifica com fome emocional'
      }
    ]
  },

  {
    ferramenta: 'Avaliação do Sono e Energia',
    slugs: ['avaliacao-sono-energia', 'sono-energia', 'quiz-energia'],
    icon: '😴',
    scripts: [
      {
        id: 'sono-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! 😴

Lembra que você falou que anda cansado(a)? Criei uma avaliação que identifica o que pode estar causando isso.

Quer fazer? São poucas perguntas!

[LINK]`,
        dica: 'Perfeito para quem reclamou de cansaço'
      },
      {
        id: 'sono-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Você sente que sua energia não é mais a mesma? 😴

Sou nutricionista e criei uma avaliação gratuita que identifica o que pode estar faltando.

Leva menos de 2 minutos. Quer descobrir?

[LINK]`,
        dica: 'Cansaço é queixa universal'
      },
      {
        id: 'sono-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `E aí, o resultado fez sentido?

Conhece alguém que vive reclamando de cansaço? Manda a avaliação!

[LINK]

Pode ajudar muito a pessoa! 💪`,
        dica: 'Todo mundo conhece alguém cansado'
      }
    ]
  },

  // =====================================================
  // SCRIPT GENÉRICO (fallback)
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

Criei uma ferramenta gratuita que pode te ajudar! Leva menos de 2 minutos.

Quer testar?

[LINK]`,
        dica: 'Script genérico para qualquer ferramenta'
      },
      {
        id: 'geral-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Oi! Sou nutricionista e criei uma ferramenta gratuita que pode te ajudar!

Leva menos de 2 minutos. Quer testar?

[LINK]`,
        dica: 'Mantenha simples e direto'
      },
      {
        id: 'geral-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `Gostou? O que achou?

Você conhece alguém que também poderia gostar? Pode compartilhar o link!

[LINK]

Agradeço muito! 🙏`,
        dica: 'Sempre peça indicação após qualquer interação'
      }
    ]
  }
]

/**
 * Busca scripts para uma ferramenta pelo slug
 */
export function getScriptsNutriPorSlug(slug: string): ScriptsNutriConfig | null {
  const slugNormalizado = slug.toLowerCase().trim()
  
  const config = scriptsNutri.find(f => 
    f.slugs.some(s => slugNormalizado.includes(s) || s.includes(slugNormalizado))
  )
  
  if (!config) {
    return scriptsNutri.find(f => f.slugs.includes('default')) || null
  }
  
  return config
}

/**
 * Busca scripts para uma ferramenta pelo nome
 */
export function getScriptsNutriPorNome(nome: string): ScriptsNutriConfig | null {
  const nomeNormalizado = nome.toLowerCase().trim()
  
  const config = scriptsNutri.find(f => 
    f.ferramenta.toLowerCase().includes(nomeNormalizado) ||
    nomeNormalizado.includes(f.ferramenta.toLowerCase())
  )
  
  if (!config) {
    return getScriptsNutriPorSlug(nomeNormalizado)
  }
  
  return config
}

/**
 * Retorna scripts organizados por tipo
 */
export function getScriptsNutriPorTipo(config: ScriptsNutriConfig): {
  listaQuente: ScriptNutri[]
  listaFria: ScriptNutri[]
  indicacao: ScriptNutri[]
} {
  return {
    listaQuente: config.scripts.filter(s => s.tipo === 'lista_quente'),
    listaFria: config.scripts.filter(s => s.tipo === 'lista_fria'),
    indicacao: config.scripts.filter(s => s.tipo === 'indicacao')
  }
}

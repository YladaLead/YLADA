/**
 * SCRIPTS DE ABORDAGEM PARA NUTRICIONISTAS
 * 
 * Cada ferramenta tem scripts para 3 situações:
 * - Lista Quente: amigos, família, indicações
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
  // QUIZZES E DIAGNÓSTICOS ADICIONAIS
  // =====================================================
  {
    ferramenta: 'Quiz Pedindo Detox',
    slugs: ['quiz-pedindo-detox', 'seu-corpo-esta-pedindo-detox', 'pedindo-detox', 'corpo-pedindo-detox'],
    icon: '🍃',
    scripts: [
      {
        id: 'pedindo-detox-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! 🍃

Você sabia que cansaço, inchaço e pele sem brilho podem ser sinais de que seu corpo precisa desintoxicar?

Criei um quiz que identifica se você está precisando de um detox. São só algumas perguntas!

Quer descobrir?

[LINK]`,
        dica: 'Ideal para quem reclama de sintomas vagos'
      },
      {
        id: 'pedindo-detox-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Seu corpo está pedindo socorro? 🍃

Cansaço constante, inchaço, digestão lenta... Esses podem ser sinais de que você precisa desintoxicar!

Sou nutricionista e criei um quiz gratuito que identifica se seu corpo está pedindo detox.

Leva 2 minutos. Quer descobrir?

[LINK]`,
        dica: 'Funciona muito bem em stories e posts'
      },
      {
        id: 'pedindo-detox-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `E aí, o resultado fez sentido pra você?

Conhece alguém que também vive cansado(a) ou inchado(a)? Manda o quiz!

[LINK]

Muita gente se surpreende com o resultado! 💚`,
        dica: 'Sintomas comuns facilitam indicações'
      }
    ]
  },

  {
    ferramenta: 'Avaliação de Intolerância',
    slugs: ['avaliacao-intolerancia', 'avaliacao-intolerancia-nutri', 'quiz-intolerancia', 'intolerancia', 'intolerancia-alimentar'],
    icon: '🚫',
    scripts: [
      {
        id: 'intolerancia-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! 🚫

Você costuma ter desconforto depois de comer? Criei uma avaliação que identifica sinais de possível intolerância alimentar.

São poucas perguntas e você já descobre se precisa investigar mais!

Quer fazer?

[LINK]`,
        dica: 'Bom para quem reclama de gases, inchaço ou mal-estar'
      },
      {
        id: 'intolerancia-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Você sente desconforto depois de comer? Gases, inchaço, mal-estar? 🚫

Pode ser sinal de intolerância alimentar! Sou nutricionista e criei uma avaliação gratuita que identifica os sinais.

Quer descobrir? Leva menos de 2 minutos!

[LINK]`,
        dica: 'Problema muito comum - atrai muita gente'
      },
      {
        id: 'intolerancia-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `O que achou do resultado? Se identificou?

Conhece alguém que também sofre com desconforto depois de comer? Manda a avaliação!

[LINK]

Muita gente tem intolerância e nem sabe! 🙏`,
        dica: 'Tema que gera muita conversa'
      }
    ]
  },

  {
    ferramenta: 'Perfil Metabólico',
    slugs: ['avaliacao-perfil-metabolico', 'avaliacao-perfil-metabolico-nutri', 'perfil-metabolico', 'quiz-perfil-metabolico', 'metabolismo'],
    icon: '⚡',
    scripts: [
      {
        id: 'metabolico-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! ⚡

Você sabe como está seu metabolismo? Criei uma avaliação que identifica seu perfil metabólico e mostra se está rápido, lento ou equilibrado.

Quer descobrir? São poucas perguntas!

[LINK]`,
        dica: 'Ideal para quem quer emagrecer ou tem dificuldade'
      },
      {
        id: 'metabolico-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Você sabe se seu metabolismo está trabalhando a seu favor? ⚡

Sou nutricionista e criei uma avaliação gratuita que identifica seu perfil metabólico.

Descubra se seu metabolismo está lento, acelerado ou equilibrado!

[LINK]`,
        dica: 'Metabolismo é curiosidade universal'
      },
      {
        id: 'metabolico-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `E aí, o resultado te surpreendeu?

Conhece alguém que também quer entender melhor o metabolismo? Compartilha!

[LINK]

Saber seu perfil é o primeiro passo pra emagrecer de verdade! 💪`,
        dica: 'Conecte com o objetivo de emagrecer'
      }
    ]
  },

  {
    ferramenta: 'Perfil de Intestino',
    slugs: ['perfil-intestino', 'qual-e-seu-perfil-de-intestino', 'intestino-perfil', 'saude-intestinal'],
    icon: '🫃',
    scripts: [
      {
        id: 'perfil-intestino-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! 

Você sabia que 70% da imunidade está no intestino? Criei um quiz que identifica qual é o seu perfil intestinal.

São poucas perguntas e você descobre se seu intestino está saudável, sensível ou precisando de atenção!

Quer descobrir?

[LINK]`,
        dica: 'Bom para quem já mencionou problemas digestivos'
      },
      {
        id: 'perfil-intestino-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Você sabe qual é o perfil do seu intestino? 🫃

Intestino preso, solto demais, gases... Cada um tem um perfil diferente!

Sou nutricionista e criei um quiz gratuito que identifica seu perfil intestinal.

Quer descobrir o seu? Leva 2 minutos!

[LINK]`,
        dica: 'Tema que todo mundo tem curiosidade'
      },
      {
        id: 'perfil-intestino-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `O resultado fez sentido pra você?

Conhece alguém que também sofre com o intestino? Manda o quiz!

[LINK]

Cuidar do intestino muda a vida! 💚`,
        dica: 'Problema comum mas pouco falado'
      }
    ]
  },

  {
    ferramenta: 'Pronto para Emagrecer',
    slugs: ['pronto-emagrecer', 'pronto-emagrecer-nutri', 'quiz-pronto-emagrecer', 'pronto-para-emagrecer'],
    icon: '🎯',
    scripts: [
      {
        id: 'pronto-emagrecer-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! 🎯

Já tentou emagrecer e não conseguiu? Criei um quiz que identifica se você está realmente pronto(a) para emagrecer - física e emocionalmente.

Não é sobre força de vontade, é sobre timing! Quer descobrir?

[LINK]`,
        dica: 'Perfeito para quem já tentou várias dietas'
      },
      {
        id: 'pronto-emagrecer-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Você está realmente pronto(a) para emagrecer? 🎯

Não é só sobre dieta - é sobre estar no momento certo!

Sou nutricionista e criei um quiz gratuito que identifica se você está preparado(a) para começar.

Quer descobrir? Leva 2 minutos!

[LINK]`,
        dica: 'Abordagem diferente que gera curiosidade'
      },
      {
        id: 'pronto-emagrecer-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `O que achou do resultado? Fez sentido?

Conhece alguém que está querendo emagrecer mas não consegue começar? Manda o quiz!

[LINK]

Às vezes a pessoa só precisa do momento certo! 💪`,
        dica: 'Muito útil para quem está em dúvida'
      }
    ]
  },

  {
    ferramenta: 'Quiz Energético',
    slugs: ['quiz-energetico', 'quiz-energetico-nutri', 'energia', 'nivel-energia'],
    icon: '⚡',
    scripts: [
      {
        id: 'energetico-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! ⚡

Você anda com pouca energia? Criei um quiz que identifica o que pode estar drenando suas energias.

São poucas perguntas e você já descobre onde está o problema!

Quer fazer?

[LINK]`,
        dica: 'Ideal para quem vive cansado'
      },
      {
        id: 'energetico-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Sua energia não é mais a mesma? ⚡

Cansaço, indisposição, dificuldade de concentrar... Pode ter uma causa nutricional!

Sou nutricionista e criei um quiz gratuito que identifica o que está afetando sua energia.

Quer descobrir? Leva 2 minutos!

[LINK]`,
        dica: 'Cansaço é queixa universal'
      },
      {
        id: 'energetico-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `O resultado te surpreendeu?

Conhece alguém que também vive sem energia? Manda o quiz!

[LINK]

Todo mundo conhece alguém cansado, né? 😊`,
        dica: 'Muito fácil pedir indicação nesse tema'
      }
    ]
  },

  // =====================================================
  // CHECKLISTS E FERRAMENTAS PRÁTICAS
  // =====================================================
  {
    ferramenta: 'Checklist Alimentar',
    slugs: ['checklist-alimentar', 'checklist-alimentar-nutri', 'lista-alimentar'],
    icon: '✅',
    scripts: [
      {
        id: 'checklist-alimentar-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! ✅

Criei um checklist que te ajuda a avaliar se sua alimentação está no caminho certo.

São perguntas simples do dia a dia e você já descobre o que pode melhorar!

Quer fazer?

[LINK]`,
        dica: 'Bom para iniciar conversa sobre hábitos'
      },
      {
        id: 'checklist-alimentar-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Sua alimentação está no caminho certo? ✅

Sou nutricionista e criei um checklist gratuito que avalia seus hábitos alimentares de forma simples e prática.

Leva menos de 2 minutos. Quer descobrir?

[LINK]`,
        dica: 'Ferramenta prática que atrai interesse'
      },
      {
        id: 'checklist-alimentar-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `O que achou do checklist? Ajudou?

Conhece alguém que também quer melhorar a alimentação? Compartilha!

[LINK]

É gratuito e super prático! 😊`,
        dica: 'Ferramenta simples facilita compartilhamento'
      }
    ]
  },

  {
    ferramenta: 'Checklist Detox',
    slugs: ['checklist-detox', 'checklist-detox-nutri', 'lista-detox'],
    icon: '🍃',
    scripts: [
      {
        id: 'checklist-detox-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! 🍃

Quer saber se você está precisando de um detox? Criei um checklist rápido que identifica os sinais.

Marca os sintomas que você tem e descobre na hora!

Quer fazer?

[LINK]`,
        dica: 'Direto e prático'
      },
      {
        id: 'checklist-detox-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Seu corpo está precisando de detox? 🍃

Sou nutricionista e criei um checklist gratuito que identifica os sinais de que você precisa desintoxicar.

É rápido e prático! Quer descobrir?

[LINK]`,
        dica: 'Detox sempre atrai interesse'
      },
      {
        id: 'checklist-detox-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `E aí, marcou muitos sintomas?

Conhece alguém que também pode estar precisando de detox? Manda o checklist!

[LINK]

É gratuito! 💚`,
        dica: 'Sintomas comuns facilitam indicações'
      }
    ]
  },

  {
    ferramenta: 'Retenção de Líquidos',
    slugs: ['retencao-liquidos', 'retencao-liquidos-nutri', 'quiz-retencao', 'inchaco', 'retencao'],
    icon: '💧',
    scripts: [
      {
        id: 'retencao-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! 💧

Você sente que incha muito? Criei uma avaliação que identifica se você tem retenção de líquidos e o que pode estar causando.

São poucas perguntas! Quer descobrir?

[LINK]`,
        dica: 'Inchaço é queixa muito comum'
      },
      {
        id: 'retencao-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Você sente que incha demais? 💧

Pode ser retenção de líquidos! Sou nutricionista e criei uma avaliação gratuita que identifica as causas.

Quer descobrir? Leva 2 minutos!

[LINK]`,
        dica: 'Problema que muita mulher tem'
      },
      {
        id: 'retencao-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `O resultado fez sentido pra você?

Conhece alguém que também sofre com inchaço? Manda a avaliação!

[LINK]

Retenção de líquidos tem solução! 💪`,
        dica: 'Muito comum entre mulheres'
      }
    ]
  },

  // =====================================================
  // DIAGNÓSTICOS E AVALIAÇÕES
  // =====================================================
  {
    ferramenta: 'Síndrome Metabólica',
    slugs: ['sindrome-metabolica', 'sindrome-metabolica-nutri', 'quiz-sindrome-metabolica', 'risco-metabolico'],
    icon: '🩺',
    scripts: [
      {
        id: 'sindrome-metabolica-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! 🩺

Você sabe se tem risco de síndrome metabólica? Criei uma avaliação que identifica os sinais de alerta.

São poucas perguntas sobre sua saúde e hábitos! Quer descobrir?

[LINK]`,
        dica: 'Bom para quem tem histórico familiar ou está acima do peso'
      },
      {
        id: 'sindrome-metabolica-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Você sabe o que é síndrome metabólica? 🩺

É uma combinação de fatores que aumenta o risco de diabetes e problemas cardíacos. Sou nutricionista e criei uma avaliação gratuita que identifica seu risco.

Quer descobrir? Leva 2 minutos!

[LINK]`,
        dica: 'Tema sério que gera preocupação saudável'
      },
      {
        id: 'sindrome-metabolica-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `O que achou do resultado?

Conhece alguém com histórico de diabetes ou pressão alta na família? Manda a avaliação!

[LINK]

Prevenção é o melhor remédio! 🙏`,
        dica: 'Histórico familiar facilita indicação'
      }
    ]
  },

  {
    ferramenta: 'Conhece seu Corpo',
    slugs: ['conhece-seu-corpo', 'conhece-seu-corpo-nutri', 'quiz-corpo', 'autoconhecimento'],
    icon: '🪞',
    scripts: [
      {
        id: 'conhece-corpo-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! 🪞

Você realmente conhece seu corpo? Criei um quiz de autoconhecimento que te ajuda a entender melhor seus sinais e necessidades.

São perguntas simples! Quer descobrir?

[LINK]`,
        dica: 'Quiz de autoconhecimento sempre engaja'
      },
      {
        id: 'conhece-corpo-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Você conhece seu próprio corpo? 🪞

Muita gente ignora os sinais que o corpo dá! Sou nutricionista e criei um quiz de autoconhecimento gratuito.

Quer descobrir o quanto você conhece seu corpo? Leva 2 minutos!

[LINK]`,
        dica: 'Autoconhecimento atrai curiosidade'
      },
      {
        id: 'conhece-corpo-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `E aí, descobriu algo novo sobre você?

Conhece alguém que também quer se conhecer melhor? Compartilha o quiz!

[LINK]

Autoconhecimento é o primeiro passo! 💪`,
        dica: 'Tema universal'
      }
    ]
  },

  {
    ferramenta: 'Avaliação Inicial',
    slugs: ['avaliacao-inicial', 'avaliacao-inicial-nutri', 'quiz-avaliacao-inicial', 'template-avaliacao-inicial', 'primeira-consulta'],
    icon: '📋',
    scripts: [
      {
        id: 'avaliacao-inicial-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! 📋

Quer saber como está sua saúde nutricional de forma geral? Criei uma avaliação inicial que te dá um panorama completo.

São algumas perguntas simples! Quer fazer?

[LINK]`,
        dica: 'Bom para quem está começando a se cuidar'
      },
      {
        id: 'avaliacao-inicial-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Você sabe como está sua saúde nutricional? 📋

Sou nutricionista e criei uma avaliação inicial gratuita que te dá um panorama completo.

Quer descobrir? Leva menos de 3 minutos!

[LINK]`,
        dica: 'Boa porta de entrada para novos leads'
      },
      {
        id: 'avaliacao-inicial-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `O que achou da avaliação?

Conhece alguém que também quer ter um panorama da saúde? Compartilha!

[LINK]

É gratuito e ajuda muito a se conhecer! 😊`,
        dica: 'Avaliação completa sempre interessa'
      }
    ]
  },

  {
    ferramenta: 'Avaliação Emocional',
    slugs: ['avaliacao-emocional', 'avaliacao-emocional-nutri', 'quiz-emocional', 'emocional'],
    icon: '💭',
    scripts: [
      {
        id: 'emocional-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! 💭

Você sabia que suas emoções afetam diretamente sua alimentação? Criei uma avaliação que identifica seu perfil emocional alimentar.

Quer descobrir como suas emoções influenciam o que você come?

[LINK]`,
        dica: 'Ideal para quem come por ansiedade ou estresse'
      },
      {
        id: 'emocional-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Você come por emoção ou por fome? 💭

Sou nutricionista e criei uma avaliação gratuita que identifica como suas emoções afetam sua alimentação.

Quer descobrir seu perfil emocional? Leva 2 minutos!

[LINK]`,
        dica: 'Tema que gera muita identificação'
      },
      {
        id: 'emocional-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `O resultado te surpreendeu?

Conhece alguém que também come quando está ansioso(a) ou estressado(a)? Manda a avaliação!

[LINK]

Entender a relação com comida é o primeiro passo! 💜`,
        dica: 'Muita gente se identifica com comer emocional'
      }
    ]
  },

  {
    ferramenta: 'Diagnóstico de Eletrólitos',
    slugs: ['diagnostico-eletrolitos', 'diagnostico-eletrolitos-nutri', 'quiz-eletrolitos', 'eletrolitos'],
    icon: '⚡',
    scripts: [
      {
        id: 'eletrolitos-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! ⚡

Cãibras, fadiga, tontura... Pode ser desequilíbrio de eletrólitos! Criei um diagnóstico que identifica se você está com falta de minerais essenciais.

Quer descobrir?

[LINK]`,
        dica: 'Bom para quem treina ou tem cãibras'
      },
      {
        id: 'eletrolitos-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Cãibras frequentes? Fadiga sem explicação? ⚡

Pode ser desequilíbrio de eletrólitos! Sou nutricionista e criei um diagnóstico gratuito que identifica se você está com falta de minerais.

Quer descobrir? Leva 2 minutos!

[LINK]`,
        dica: 'Funciona bem com público fitness'
      },
      {
        id: 'eletrolitos-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `O diagnóstico fez sentido?

Conhece alguém que vive com cãibras ou fadiga? Manda o diagnóstico!

[LINK]

Eletrólitos são mais importantes do que as pessoas imaginam! 💪`,
        dica: 'Cãibras são queixa comum'
      }
    ]
  },

  {
    ferramenta: 'Simulador de Resultados',
    slugs: ['simulador-resultados', 'simulador-resultados-nutri', 'simulador', 'projecao-resultados'],
    icon: '📊',
    scripts: [
      {
        id: 'simulador-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! 📊

Quer ver quanto você pode emagrecer nos próximos meses? Criei um simulador que projeta seus resultados de forma realista!

É rápido e motivador! Quer testar?

[LINK]`,
        dica: 'Muito motivacional'
      },
      {
        id: 'simulador-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Quanto você pode emagrecer nos próximos 3 meses? 📊

Sou nutricionista e criei um simulador gratuito que projeta seus resultados de forma realista e saudável.

Quer descobrir? Leva 1 minuto!

[LINK]`,
        dica: 'Projeção de resultados sempre atrai'
      },
      {
        id: 'simulador-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `Gostou de ver a projeção?

Conhece alguém que também quer ver quanto pode emagrecer? Compartilha o simulador!

[LINK]

É motivador ver os resultados possíveis! 🎯`,
        dica: 'Ferramenta muito compartilhável'
      }
    ]
  },

  {
    ferramenta: 'Desafio 7 Dias',
    slugs: ['desafio-7-dias', 'desafio-7-dias-nutri', 'desafio7', 'desafio-semana'],
    icon: '🗓️',
    scripts: [
      {
        id: 'desafio7-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! 🗓️

Quer começar a se cuidar mas não sabe por onde? Criei um desafio de 7 dias para você dar o primeiro passo!

São mudanças simples, uma por dia. Topa o desafio?

[LINK]`,
        dica: 'Bom para quem quer começar devagar'
      },
      {
        id: 'desafio7-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Topa um desafio de 7 dias? 🗓️

Sou nutricionista e criei um desafio gratuito com mudanças simples - uma por dia!

Ao final dos 7 dias você já vai sentir a diferença. Topa?

[LINK]`,
        dica: '7 dias é tempo acessível'
      },
      {
        id: 'desafio7-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `Está curtindo o desafio?

Convida alguém para fazer junto! É mais fácil quando tem companhia!

[LINK]

Compartilha e façam juntos! 💪`,
        dica: 'Desafios são melhores em grupo'
      }
    ]
  },

  {
    ferramenta: 'Desafio 21 Dias',
    slugs: ['desafio-21-dias', 'desafio-21-dias-nutri', 'desafio21', 'desafio-habito'],
    icon: '🏆',
    scripts: [
      {
        id: 'desafio21-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! 🏆

Sabia que 21 dias é o tempo mínimo para formar um hábito? Criei um desafio que te guia nesses 21 dias de transformação!

Quer participar?

[LINK]`,
        dica: 'Para quem quer mudança mais profunda'
      },
      {
        id: 'desafio21-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `21 dias para mudar seus hábitos! 🏆

Sou nutricionista e criei um desafio gratuito que te guia por 21 dias de transformação alimentar.

Topa o desafio?

[LINK]`,
        dica: '21 dias é tempo de formar hábito'
      },
      {
        id: 'desafio21-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `Está evoluindo no desafio?

Chama alguém para fazer junto! Ter um parceiro de desafio ajuda muito!

[LINK]

Juntos é mais fácil! 🤝`,
        dica: 'Incentive a fazer em grupo'
      }
    ]
  },

  {
    ferramenta: 'Guia de Hidratação',
    slugs: ['guia-hidratacao', 'guia-hidratacao-nutri', 'hidratacao', 'guia-agua'],
    icon: '💧',
    scripts: [
      {
        id: 'guia-hidratacao-quente-1',
        tipo: 'lista_quente',
        titulo: 'Para Conhecidos',
        texto: `Oi [Nome]! 💧

Você bebe água suficiente? Criei um guia de hidratação que te ensina quanto e como beber água do jeito certo!

Quer aprender?

[LINK]`,
        dica: 'Complementa a calculadora de água'
      },
      {
        id: 'guia-hidratacao-fria-1',
        tipo: 'lista_fria',
        titulo: 'Para Desconhecidos',
        texto: `Você sabe como se hidratar corretamente? 💧

Não é só quantidade - é timing, temperatura e frequência! Sou nutricionista e criei um guia gratuito de hidratação.

Quer aprender? É rápido!

[LINK]`,
        dica: 'Hidratação é base da saúde'
      },
      {
        id: 'guia-hidratacao-indicacao-1',
        tipo: 'indicacao',
        titulo: 'Pedir Indicação',
        texto: `Gostou das dicas de hidratação?

Compartilha com alguém que precisa beber mais água!

[LINK]

Todo mundo conhece alguém que esquece de beber água, né? 😄`,
        dica: 'Tema universal e fácil de compartilhar'
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













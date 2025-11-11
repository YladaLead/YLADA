// =====================================================
// YLADA - BENEFÍCIOS DOS TEMPLATES (WELLNESS)
// =====================================================
// Este arquivo centraliza os benefícios de cada template
// para uso na landing page e na apresentação inicial

export interface TemplateBenefits {
  discover?: string[] // "O que você vai descobrir"
  whyUse?: string[] // "Por que usar esta ferramenta"
}

/**
 * Retorna os benefícios de um template baseado no seu slug
 * @param templateSlug - Slug do template (ex: 'calc-imc', 'quiz-ganhos')
 * @returns Objeto com arrays de benefícios
 */
export function getTemplateBenefits(templateSlug: string): TemplateBenefits {
  const slug = templateSlug.toLowerCase().trim()

  // ============================================
  // CALCULADORAS
  // ============================================
  
  if (slug.includes('calc-imc') || slug.includes('imc')) {
    return {
      discover: [
        'Seu Índice de Massa Corporal (IMC) exato',
        'Categoria do seu peso (normal, sobrepeso, etc.)',
        'Recomendações personalizadas baseadas no resultado',
        'Orientações para alcançar seu objetivo'
      ],
      whyUse: [
        'Avaliação rápida e precisa do seu peso corporal',
        'Entenda se está na faixa saudável',
        'Receba orientações personalizadas',
        'Primeiro passo para uma vida mais saudável'
      ]
    }
  }

  if (slug.includes('calc-proteina') || slug.includes('proteína') || slug.includes('proteina')) {
    return {
      discover: [
        'Quantidade ideal de proteína para seu corpo',
        'Necessidades baseadas na sua atividade física',
        'Como distribuir proteína ao longo do dia',
        'Fontes de proteína recomendadas'
      ],
      whyUse: [
        'Descubra exatamente quanta proteína você precisa',
        'Otimize ganho de massa muscular',
        'Melhore sua recuperação pós-treino',
        'Ajuste sua alimentação de forma científica'
      ]
    }
  }

  if (slug.includes('calc-hidratacao') || slug.includes('hidratação') || slug.includes('agua') || slug.includes('água')) {
    return {
      discover: [
        'Quantidade ideal de água para seu corpo',
        'Distribuição ao longo do dia',
        'Necessidades baseadas na sua atividade',
        'Sinais de desidratação e como evitar'
      ],
      whyUse: [
        'Hidratação adequada melhora energia e disposição',
        'Otimize seu desempenho físico e mental',
        'Prevenha problemas de saúde',
        'Aumente sua qualidade de vida'
      ]
    }
  }

  if (slug.includes('calc-calorias') || slug.includes('caloria')) {
    return {
      discover: [
        'Quantidade ideal de calorias diárias',
        'Distribuição de macronutrientes (proteínas, carboidratos, gorduras)',
        'Calorias para seu objetivo (emagrecer, manter ou ganhar peso)',
        'Recomendações personalizadas'
      ],
      whyUse: [
        'Atinga seus objetivos de peso de forma eficiente',
        'Entenda seu gasto calórico real',
        'Planeje sua alimentação com precisão',
        'Evite erros comuns na dieta'
      ]
    }
  }

  if (slug.includes('calc-composicao') || slug.includes('composição')) {
    return {
      discover: [
        'Composição corporal detalhada',
        'Percentual de gordura e massa muscular',
        'Análise de hidratação',
        'Recomendações para otimização'
      ],
      whyUse: [
        'Vá além do peso na balança',
        'Entenda sua composição real',
        'Monitore progresso de forma precisa',
        'Ajuste estratégias de treino e nutrição'
      ]
    }
  }

  // ============================================
  // QUIZZES
  // ============================================

  if (slug.includes('quiz-ganhos') || slug.includes('ganhos-prosperidade') || slug.includes('ganhos')) {
    return {
      discover: [
        'Seu potencial para ganhos financeiros',
        'Oportunidades de crescimento',
        'Insights sobre sua situação atual',
        'Caminhos para prosperidade'
      ],
      whyUse: [
        'Identifique oportunidades de crescimento',
        'Entenda seu potencial financeiro',
        'Receba insights personalizados',
        'Descubra caminhos para prosperidade'
      ]
    }
  }

  if (slug.includes('quiz-potencial') || slug.includes('potencial-crescimento') || slug.includes('potencial')) {
    return {
      discover: [
        'Seu potencial de crescimento',
        'Oportunidades de desenvolvimento',
        'Insights sobre suas capacidades',
        'Caminhos para alcançar seu máximo'
      ],
      whyUse: [
        'Identifique seu potencial real',
        'Descubra oportunidades de crescimento',
        'Receba insights personalizados',
        'Alcance seu máximo potencial'
      ]
    }
  }

  if (slug.includes('quiz-proposito') || slug.includes('proposito-equilibrio') || slug.includes('propósito')) {
    return {
      discover: [
        'Seu alinhamento com propósito',
        'Oportunidades de equilíbrio',
        'Insights sobre sua vida',
        'Caminhos para viver seu propósito'
      ],
      whyUse: [
        'Descubra seu propósito de vida',
        'Alinhe suas ações com seus valores',
        'Encontre equilíbrio',
        'Viva uma vida com mais significado'
      ]
    }
  }

  if (slug.includes('quiz-parasitas') || slug.includes('parasitas')) {
    return {
      discover: [
        'Sinais de possível presença de parasitas',
        'Como parasitas podem estar afetando sua saúde',
        'Sintomas relacionados',
        'Orientações para diagnóstico e tratamento'
      ],
      whyUse: [
        'Identifique sinais precoces',
        'Entenda impactos na sua saúde',
        'Receba orientações profissionais',
        'Melhore sua qualidade de vida'
      ]
    }
  }

  if (slug.includes('quiz-alimentacao') || slug.includes('alimentação') || slug.includes('healthy-eating')) {
    return {
      discover: [
        'Seu perfil alimentar atual',
        'Pontos fortes e oportunidades de melhoria',
        'Hábitos que podem ser otimizados',
        'Recomendações personalizadas'
      ],
      whyUse: [
        'Avalie seus hábitos alimentares',
        'Identifique oportunidades de melhoria',
        'Receba orientações personalizadas',
        'Melhore sua relação com a comida'
      ]
    }
  }

  // ============================================
  // PLANILHAS
  // ============================================

  if (slug.includes('meal-planner') || slug.includes('planner')) {
    return {
      discover: [
        'Plano alimentar personalizado',
        'Organização de refeições',
        'Distribuição de nutrientes',
        'Estratégias práticas'
      ],
      whyUse: [
        'Organize sua alimentação de forma prática',
        'Economize tempo no planejamento',
        'Garanta nutrição adequada',
        'Facilite a adesão à dieta'
      ]
    }
  }

  if (slug.includes('diario-alimentar') || slug.includes('food-diary')) {
    return {
      discover: [
        'Padrões alimentares',
        'Hábitos que podem ser melhorados',
        'Relacionamento com comida',
        'Insights sobre sua alimentação'
      ],
      whyUse: [
        'Monitore sua alimentação facilmente',
        'Identifique padrões e hábitos',
        'Ajuste sua dieta com dados reais',
        'Aumente sua consciência alimentar'
      ]
    }
  }

  // ============================================
  // GUIAS E AVALIAÇÕES
  // ============================================

  if (slug.includes('hydration-guide') || slug.includes('guia-hidratacao') || slug.includes('guia-hidratação')) {
    return {
      discover: [
        'Quantidade ideal de água para seu corpo',
        'Cronograma diário de hidratação',
        'Estratégias práticas de consumo',
        'Sinais de desidratação e como evitar'
      ],
      whyUse: [
        'Hidratação adequada melhora energia e disposição',
        'Otimize seu desempenho físico e mental',
        'Prevenha problemas de saúde',
        'Aumente sua qualidade de vida'
      ]
    }
  }

  if (slug.includes('eating-routine') || slug.includes('alimentacao-rotina') || slug.includes('alimentação-rotina')) {
    return {
      discover: [
        'Se sua alimentação está adequada à sua rotina',
        'Como adequar alimentação ao seu estilo de vida',
        'Recomendações personalizadas',
        'Estratégias para manter alimentação adequada'
      ],
      whyUse: [
        'Identifique se sua alimentação está adequada à rotina',
        'Descubra como adequar alimentação ao seu estilo de vida',
        'Receba recomendações personalizadas',
        'Melhore sua saúde através de alimentação adequada'
      ]
    }
  }

  if (slug.includes('initial-assessment') || slug.includes('avaliacao-inicial') || slug.includes('avaliação-inicial')) {
    return {
      discover: [
        'Seu perfil e necessidades',
        'Como podemos te ajudar',
        'Recomendações personalizadas',
        'Caminhos para sua transformação'
      ],
      whyUse: [
        'Identifique seu perfil e necessidades',
        'Descubra como podemos te ajudar',
        'Receba recomendações personalizadas',
        'Comece sua jornada de transformação'
      ]
    }
  }

  if (slug.includes('21-day-challenge') || slug.includes('desafio-21-dias') || slug.includes('desafio-21')) {
    return {
      discover: [
        'Hábitos duradouros em 21 dias',
        'Estrutura de 3 semanas progressivas',
        'Formação de hábitos sustentáveis',
        'Check-ins semanais para motivação'
      ],
      whyUse: [
        '21 dias estruturados em 3 semanas progressivas',
        'Formação de hábitos duradouros e sustentáveis',
        'Check-ins semanais para manter motivação',
        'Diagnóstico personalizado por nível de experiência'
      ]
    }
  }

  if (slug.includes('7-day-challenge') || slug.includes('desafio-7-dias') || slug.includes('desafio-7')) {
    return {
      discover: [
        'Transformação em apenas 7 dias',
        'Hábitos simples e mensuráveis',
        'Check-ins diários para motivação',
        'Diagnóstico personalizado por nível'
      ],
      whyUse: [
        'Desafio estruturado de 7 dias',
        'Hábitos simples e mensuráveis',
        'Check-ins diários para manter motivação',
        'Diagnóstico personalizado por nível'
      ]
    }
  }

  if (slug.includes('checklist-alimentar') || slug.includes('checklist')) {
    return {
      discover: [
        'Avaliação de hábitos alimentares em 12 pontos',
        'Oportunidades de melhoria na nutrição',
        'Orientações personalizadas',
        'Insights sobre sua alimentação'
      ],
      whyUse: [
        'Avalie seus hábitos alimentares em 12 pontos essenciais',
        'Descubra oportunidades de melhoria na sua nutrição',
        'Receba orientações personalizadas para otimizar sua alimentação',
        'Identifique padrões e hábitos alimentares'
      ]
    }
  }

  if (slug.includes('wellness-profile') || slug.includes('quiz-bem-estar') || slug.includes('bem-estar')) {
    return {
      discover: [
        'Seu nível atual de energia e vitalidade',
        'Áreas de bem-estar para otimizar',
        'Como criar rotina de autocuidado',
        'Estratégias para atingir bem-estar integral'
      ],
      whyUse: [
        'Seu nível atual de energia e vitalidade',
        'Áreas de bem-estar para otimizar',
        'Como criar rotina de autocuidado',
        'Estratégias para atingir bem-estar integral'
      ]
    }
  }

  if (slug.includes('story-interativo') || slug.includes('quiz-interativo') || slug.includes('story')) {
    return {
      discover: [
        'Roteiro de stories personalizado',
        'Hooks prontos para alta conversão',
        'Estrutura por nível de engajamento',
        'CTAs otimizados'
      ],
      whyUse: [
        'Hooks prontos',
        'Roteiro por nível',
        'CTA de alta conversão',
        'Crie stories engajantes em minutos'
      ]
    }
  }

  // ============================================
  // FALLBACK GENÉRICO
  // ============================================
  
  return {
    discover: [
      'Resultados personalizados para você',
      'Recomendações baseadas nas suas respostas',
      'Orientações práticas e aplicáveis',
      'Insights sobre sua situação atual'
    ],
    whyUse: [
      'Avaliação rápida e personalizada',
      'Receba orientações específicas',
      'Descubra oportunidades de melhoria',
      'Primeiro passo para seus objetivos'
    ]
  }
}


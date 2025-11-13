/**
 * Mapeamento de mensagens estimulantes para Open Graph
 * Mensagens personalizadas por tipo de ferramenta para incentivar o clique
 */

export const OG_MESSAGES_MAP: Record<string, { title: string; description: string }> = {
  // Calculadoras
  'calc-imc': {
    title: 'Calcule seu IMC e descubra seu peso ideal',
    description: 'Descubra seu Índice de Massa Corporal e receba orientações personalizadas para sua saúde'
  },
  'calc-proteina': {
    title: 'Descubra quanta proteína você precisa',
    description: 'Calcule suas necessidades proteicas diárias e otimize sua alimentação para melhores resultados'
  },
  'calc-hidratacao': {
    title: 'Aprenda a beber água corretamente',
    description: 'Descubra quanta água seu corpo precisa e melhore sua hidratação diária com orientações personalizadas'
  },
  'calc-calorias': {
    title: 'Calcule suas calorias ideais',
    description: 'Descubra quantas calorias você precisa consumir para atingir seus objetivos de saúde'
  },
  'calc-composicao': {
    title: 'Avalie sua composição corporal',
    description: 'Descubra sua massa muscular, gordura e hidratação com uma avaliação completa e personalizada'
  },
  
  // Quizzes
  'quiz-ganhos': {
    title: 'Descubra seu potencial de ganhos e prosperidade',
    description: 'Responda o quiz e descubra como alcançar seus objetivos financeiros e de crescimento pessoal'
  },
  'quiz-potencial': {
    title: 'Descubra seu potencial de crescimento',
    description: 'Avalie seu potencial e receba insights personalizados para alcançar seus objetivos'
  },
  'quiz-proposito': {
    title: 'Encontre seu propósito e equilíbrio',
    description: 'Descubra seu propósito de vida e aprenda a encontrar o equilíbrio que você precisa'
  },
  'quiz-alimentacao': {
    title: 'Avalie seus hábitos alimentares',
    description: 'Descubra como está sua alimentação e receba dicas personalizadas para melhorar sua saúde'
  },
  'quiz-wellness-profile': {
    title: 'Descubra seu perfil de bem-estar',
    description: 'Conheça seu perfil completo de bem-estar e receba recomendações personalizadas para sua saúde'
  },
  'quiz-nutrition-assessment': {
    title: 'Avalie sua nutrição completa',
    description: 'Faça uma avaliação nutricional completa e descubra o que seu corpo realmente precisa'
  },
  'quiz-personalizado': {
    title: 'Quiz personalizado para você',
    description: 'Responda nosso quiz e descubra insights personalizados sobre seu bem-estar'
  },
  
  // Desafios
  'template-desafio-7dias': {
    title: 'Desafio de 7 dias para transformar sua vida',
    description: 'Participe do desafio e transforme seus hábitos em apenas 7 dias com orientações diárias'
  },
  'desafio-7-dias': {
    title: 'Desafio de 7 dias para transformar sua vida',
    description: 'Participe do desafio e transforme seus hábitos em apenas 7 dias com orientações diárias'
  },
  'template-desafio-21dias': {
    title: 'Desafio de 21 dias para criar hábitos saudáveis',
    description: 'Transforme sua vida em 21 dias com um desafio completo e orientações personalizadas'
  },
  'desafio-21-dias': {
    title: 'Desafio de 21 dias para criar hábitos saudáveis',
    description: 'Transforme sua vida em 21 dias com um desafio completo e orientações personalizadas'
  },
  
  // Guias
  'guia-hidratacao': {
    title: 'Aprenda a beber água corretamente',
    description: 'Guia completo de hidratação: descubra quanta água seu corpo precisa e melhore sua hidratação diária com orientações personalizadas'
  },
  'guia-de-hidratacao': {
    title: 'Aprenda a beber água corretamente',
    description: 'Guia completo de hidratação: descubra quanta água seu corpo precisa e melhore sua hidratação diária com orientações personalizadas'
  },
  
  // Avaliações
  'avaliacao-intolerancia': {
    title: 'Avalie suas intolerâncias alimentares',
    description: 'Descubra se você tem intolerâncias ou sensibilidades alimentares e receba orientações personalizadas'
  },
  'avaliacao-perfil-metabolico': {
    title: 'Descubra seu perfil metabólico',
    description: 'Avalie seu metabolismo e descubra como otimizar sua energia e queima de gordura'
  },
  'avaliacao-emocional': {
    title: 'Avalie sua relação emocional com a comida',
    description: 'Descubra como suas emoções influenciam sua alimentação e aprenda a ter uma relação mais saudável'
  },
  'template-avaliacao-inicial': {
    title: 'Faça sua avaliação inicial completa',
    description: 'Comece sua jornada de bem-estar com uma avaliação completa e personalizada'
  },
  'avaliacao-inicial': {
    title: 'Faça sua avaliação inicial completa',
    description: 'Comece sua jornada de bem-estar com uma avaliação completa e personalizada'
  },
  
  // Diagnósticos
  'diagnostico-eletrolitos': {
    title: 'Diagnostique seus níveis de eletrólitos',
    description: 'Descubra se seus níveis de eletrólitos estão equilibrados e receba orientações para melhorar'
  },
  'diagnostico-sintomas-intestinais': {
    title: 'Diagnostique seus sintomas intestinais',
    description: 'Avalie seus sintomas intestinais e descubra o que pode estar afetando sua saúde digestiva'
  },
  
  // Outros Quizzes
  'pronto-emagrecer': {
    title: 'Você está pronto para emagrecer com saúde?',
    description: 'Descubra se você está preparado para uma jornada de emagrecimento saudável e sustentável'
  },
  'tipo-fome': {
    title: 'Descubra qual é o seu tipo de fome',
    description: 'Aprenda a identificar se sua fome é física ou emocional e como lidar com cada tipo'
  },
  'sindrome-metabolica': {
    title: 'Avalie seu risco de síndrome metabólica',
    description: 'Descubra seu risco de desenvolver síndrome metabólica e receba orientações preventivas'
  },
  'retencao-liquidos': {
    title: 'Teste sua retenção de líquidos',
    description: 'Descubra se você está retendo líquidos e aprenda como melhorar sua hidratação'
  },
  'conhece-seu-corpo': {
    title: 'Você conhece seu corpo?',
    description: 'Faça o teste e descubra o quanto você realmente conhece sobre seu próprio corpo'
  },
  'nutrido-vs-alimentado': {
    title: 'Você está nutrido ou apenas alimentado?',
    description: 'Descubra se você está realmente nutrindo seu corpo ou apenas se alimentando'
  },
  'alimentacao-rotina': {
    title: 'Você está se alimentando conforme sua rotina?',
    description: 'Avalie se sua alimentação está alinhada com sua rotina e receba dicas para melhorar'
  },
  'template-story-interativo': {
    title: 'Quiz interativo personalizado',
    description: 'Participe de um quiz interativo e descubra insights personalizados sobre seu bem-estar'
  },
  'story-interativo': {
    title: 'Quiz interativo personalizado',
    description: 'Participe de um quiz interativo e descubra insights personalizados sobre seu bem-estar'
  },
  'quiz-interativo': {
    title: 'Quiz interativo personalizado',
    description: 'Participe de um quiz interativo e descubra insights personalizados sobre seu bem-estar'
  },
  
  // Planilhas
  'planilha-meal-planner': {
    title: 'Planejador de refeições personalizado',
    description: 'Organize suas refeições com um planejador completo e personalizado para seus objetivos'
  },
  'planilha-diario-alimentar': {
    title: 'Diário alimentar completo',
    description: 'Registre sua alimentação e descubra padrões que podem melhorar sua saúde'
  },
  'planilha-metas-semanais': {
    title: 'Planejador de metas semanais',
    description: 'Organize suas metas semanais de saúde e bem-estar com um planejador completo'
  },
  'cardapio-detox': {
    title: 'Cardápio detox personalizado',
    description: 'Receba um cardápio detox completo e personalizado para desintoxicar seu corpo'
  },
  
  // Portal
  'portal': {
    title: 'Portal completo de bem-estar',
    description: 'Acesse um portal completo com ferramentas personalizadas para seu bem-estar'
  },
}

/**
 * Obtém mensagens estimulantes para um template_slug específico
 * Retorna mensagens padrão se não encontrar
 */
export function getOGMessages(templateSlug: string | null | undefined): { title: string; description: string } {
  if (!templateSlug) {
    return {
      title: 'Ferramenta de Bem-Estar - WELLNESS',
      description: 'Acesse ferramentas personalizadas para melhorar seu bem-estar e qualidade de vida'
    }
  }
  
  // Normalizar o slug
  const normalized = templateSlug.toLowerCase().trim()
  
  // Tentar encontrar no mapeamento
  if (OG_MESSAGES_MAP[normalized]) {
    return OG_MESSAGES_MAP[normalized]
  }
  
  // Fallback para mensagens padrão
  return {
    title: 'Ferramenta de Bem-Estar - WELLNESS',
    description: 'Acesse ferramentas personalizadas para melhorar seu bem-estar e qualidade de vida'
  }
}


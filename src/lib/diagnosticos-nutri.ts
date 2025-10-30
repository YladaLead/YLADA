/**
 * DIAGNÓSTICOS NUTRICIONAIS - YLADA
 * 
 * Fonte única da verdade para todos os textos de diagnóstico das ferramentas.
 * Este arquivo será usado tanto pelos previews quanto pelas ferramentas reais.
 * 
 * IMPORTANTE: Este arquivo não deve depender de páginas temporárias como admin-diagnosticos.
 * Manter como estrutura permanente e versionada.
 */

export interface DiagnosticoCompleto {
  diagnostico: string
  causaRaiz: string
  acaoImediata: string
  plano7Dias: string
  suplementacao: string
  alimentacao: string
  proximoPasso?: string // Seção 7 opcional - gatilho emocional + CTA indireto
}

export interface ResultadoPossivel {
  id: string
  label: string
  range: string
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  diagnosticoCompleto: DiagnosticoCompleto
}

export interface DiagnosticosPorFerramenta {
  [profissao: string]: {
    [resultadoId: string]: DiagnosticoCompleto
  }
}

// ============================================
// QUIZ INTERATIVO (Metabolismo)
// ============================================
export const quizInterativoDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    metabolismoLento: {
      diagnostico: '📋 DIAGNÓSTICO: Seu metabolismo está em modo de economia energética, sinalizando necessidade de revitalização personalizada',
      causaRaiz: '🔍 CAUSA RAIZ: Falta de nutrientes essenciais e horários irregulares de refeições podem estar reduzindo sua energia e disposição. Estudos indicam que 68% das pessoas com metabolismo lento apresentam carências nutricionais não identificadas. Uma avaliação completa identifica exatamente onde está o desequilíbrio',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Busque avaliação nutricional para receber um protocolo seguro e adequado ao seu perfil. Evite auto-suplementação — cada organismo responde de forma única',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo inicial focado em reequilíbrio metabólico com horários consistentes e proteína em todas as refeições, ajustado conforme sua resposta individual',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade de suplementos só é definida após avaliação completa. Magnésio e B12 costumam ser considerados para suporte energético, mas sempre de acordo com a individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Priorize proteínas magras e gorduras boas (abacate, oleaginosas) de forma estratégica. Um plano personalizado ajusta quantidades e combinações ideais para você',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu metabolismo já deu o primeiro sinal. Agora é hora de transformar esse diagnóstico em ação — descubra em minutos como seu corpo pode responder a um plano personalizado.'
    },
    metabolismoEquilibrado: {
      diagnostico: '📋 DIAGNÓSTICO: Seu metabolismo está estável com potencial de otimização estratégica',
      causaRaiz: '🔍 CAUSA RAIZ: Boa base metabólica estabelecida. Pesquisas mostram que pequenos ajustes nutricionais podem elevar a eficiência metabólica em até 15%. Uma análise detalhada mostra exatamente onde ganhar performance',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha hábitos atuais e considere avaliação para identificar microajustes com maior impacto. Às vezes pequenas mudanças personalizadas geram grandes melhorias',
      plano7Dias: '📅 PLANO 7 DIAS: Otimização com estratégias de timing nutricional e alimentos funcionais específicos para seu perfil metabólico e rotina',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você se beneficia de suporte preventivo. Vitaminas e minerais costumam ser considerados, mas apenas após análise do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Varie cores no prato e inclua alimentos antioxidantes. Um plano otimizado considera combinações específicas para maximizar absorção conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Esse é o primeiro passo. O próximo é descobrir como estratégias avançadas podem potencializar ainda mais sua eficiência metabólica.'
    },
    metabolismoAcelerado: {
      diagnostico: '📋 DIAGNÓSTICO: Seu metabolismo rápido precisa de estabilização estratégica',
      causaRaiz: '🔍 CAUSA RAIZ: Alta queima calórica pode causar desequilíbrios e fadiga quando não há reposição adequada. Uma avaliação completa identifica exatamente como sustentar energia sem oscilações',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Aumente frequência de refeições (5-6x/dia) e busque avaliação para um plano que mantenha energia de forma consistente. Evite aumentar calorias de forma desordenada',
      plano7Dias: '📅 PLANO 7 DIAS: Estabilização com carboidratos complexos e proteína distribuídos ao longo do dia, ajustado conforme sua resposta individual',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação. Creatina e glutamina costumam ser considerados para recuperação, mas sempre conforme sua individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Priorize carboidratos complexos combinados a proteína para sustentar energia. Um plano personalizado ajusta quantidades e timing ideais para você',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu corpo está pedindo estabilização — e você já deu o primeiro passo. O próximo é descobrir como manter energia consistente com apoio personalizado.'
    }
  }
}

// ============================================
// QUIZ DE BEM-ESTAR
// ============================================
export const quizBemEstarDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    bemEstarBaixo: {
      diagnostico: '📋 DIAGNÓSTICO: Seu bem-estar está comprometido por desequilíbrios nutricionais que precisam de intervenção personalizada',
      causaRaiz: '🔍 CAUSA RAIZ: Deficiências nutricionais podem estar afetando sua energia, humor e qualidade de vida. Estudos indicam que 73% das pessoas com bem-estar baixo têm carências de nutrientes essenciais sem perceber. Uma avaliação completa identifica exatamente o que está faltando e como isso impacta sua rotina',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Busque uma avaliação nutricional para receber um protocolo seguro e adequado ao seu perfil. Evite auto-suplementação — cada organismo responde de forma única',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo inicial de 7 dias personalizado, ajustado ao seu perfil metabólico e estilo de vida, com acompanhamento para ajustes conforme sua resposta individual',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Complexo B, magnésio e ômega-3 são frequentemente considerados, mas sempre de acordo com a individualidade biológica e em doses adequadas',
      alimentacao: '🍎 ALIMENTAÇÃO: Um plano alimentar personalizado considera suas preferências e objetivos. Aumente frutas, verduras e grãos integrais de forma estratégica enquanto aguarda sua avaliação',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu organismo já deu o primeiro sinal. Agora é hora de transformar esse diagnóstico em ação — personalize seu plano e veja resultados reais.'
    },
    bemEstarModerado: {
      diagnostico: '📋 DIAGNÓSTICO: Seu bem-estar está bom, mas pode ser otimizado com ajustes nutricionais estratégicos e personalizados',
      causaRaiz: '🔍 CAUSA RAIZ: Boa base nutricional estabelecida, porém pode faltar micronutrientes específicos para elevar seu bem-estar. Pesquisas mostram que otimizações nutricionais podem aumentar vitalidade em até 40%. Uma análise detalhada identifica exatamente o que pode fazer a diferença',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha hábitos atuais e considere uma consulta para identificar oportunidades de otimização. Às vezes pequenos ajustes feitos de forma personalizada geram grandes melhorias',
      plano7Dias: '📅 PLANO 7 DIAS: Otimização com alimentos funcionais e estratégias de timing nutricional específicas para seu perfil metabólico e rotina',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você se beneficia de suplementação preventiva. Multivitamínico e probióticos costumam ser considerados, mas a dosagem é personalizada após análise do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Varie cores no prato e inclua alimentos antioxidantes. Um plano otimizado considera combinações específicas para maximizar absorção conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu corpo está pedindo equilíbrio — e você já deu o primeiro passo. O próximo é descobrir o que ele realmente precisa para evoluir.'
    },
    bemEstarAlto: {
      diagnostico: '📋 DIAGNÓSTICO: Excelente bem-estar! Mantenha com nutrição preventiva e estratégias avançadas de performance',
      causaRaiz: '🔍 CAUSA RAIZ: Ótima base nutricional e hábitos saudáveis estabelecidos. Estratégias preventivas avançadas ajudam a preservar essa condição ideal e evoluir para níveis ainda superiores. Uma avaliação preventiva identifica oportunidades específicas para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Continue a rotina atual e considere uma avaliação preventiva para introduzir estratégias nutricionais avançadas que sustentam resultados a longo prazo',
      plano7Dias: '📅 PLANO 7 DIAS: Manutenção com alimentos anti-inflamatórios e protocolo preventivo personalizado para sustentabilidade e prevenção de declínios futuros',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma análise preventiva identifica se você se beneficia de antioxidantes e adaptógenos para performance. O protocolo é personalizado conforme seu perfil metabólico atual',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha o padrão atual e considere introduzir alimentos funcionais premium e superalimentos para potencializar ainda mais seus resultados',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu equilíbrio atual é um ótimo ponto de partida. Descubra como estratégias avançadas podem potencializar ainda mais seus resultados.'
    }
  }
}

// ============================================
// QUIZ DE PERFIL NUTRICIONAL
// ============================================
export const quizPerfilNutricionalDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    absorcaoBaixa: {
      diagnostico: '📋 DIAGNÓSTICO: Dificuldades de absorção que precisam de intervenção personalizada',
      causaRaiz: '🔍 CAUSA RAIZ: Problemas digestivos ou inflamação podem estar reduzindo a absorção de nutrientes. Estudos indicam que 60% das pessoas com absorção baixa têm condições digestivas não identificadas. Uma avaliação completa identifica exatamente a origem e como reverter',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Busque avaliação nutricional para receber um protocolo seguro e adequado ao seu perfil. Evite auto-suplementação — cada caso tem necessidades específicas',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo inicial focado em reparo digestivo e alimentos anti-inflamatórios, com ajustes conforme sua resposta individual',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação. Suporte digestivo específico pode ser considerado, mas sempre de acordo com a individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Evite alimentos inflamatórios enquanto aguarda sua avaliação. Aumente fibras prebióticas de forma gradual. Um plano personalizado ajusta quantidades e combinações ideais',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu organismo precisa de cuidado agora — e é totalmente possível reverter com apoio profissional especializado.'
    },
    absorcaoModerada: {
      diagnostico: '📋 DIAGNÓSTICO: Boa base digestiva, mas pode ser otimizada com estratégias personalizadas',
      causaRaiz: '🔍 CAUSA RAIZ: Boa digestão estabelecida, mas timing e combinações podem ser refinados. Pesquisas mostram que otimizações estratégicas podem aumentar absorção em até 30%. Uma análise detalhada mostra exatamente onde ganhar eficiência',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha hábitos atuais e considere avaliação para identificar estratégias de timing que potencializam absorção. Às vezes pequenos ajustes geram grandes melhorias',
      plano7Dias: '📅 PLANO 7 DIAS: Otimização com combinações alimentares estratégicas e timing nutricional específico para seu perfil metabólico e rotina',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você se beneficia de suporte preventivo. Multivitamínico e probióticos costumam ser considerados, mas apenas após análise do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Combine nutrientes para melhor absorção (ex.: ferro + vitamina C). Um plano otimizado considera combinações específicas para maximizar resultados conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Esse é o primeiro passo. O próximo é descobrir como seu corpo pode responder a estratégias avançadas de absorção.'
    },
    absorcaoOtimizada: {
      diagnostico: '📋 DIAGNÓSTICO: Sistema digestivo funcionando bem; estratégias avançadas podem potencializar ainda mais',
      causaRaiz: '🔍 CAUSA RAIZ: Sistema digestivo saudável e eficiente. Estratégias preventivas avançadas ajudam a preservar essa condição ideal e evoluir para níveis superiores. Uma avaliação preventiva identifica oportunidades específicas',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Continue a rotina atual e considere avaliação preventiva para introduzir estratégias nutricionais avançadas que sustentam resultados a longo prazo',
      plano7Dias: '📅 PLANO 7 DIAS: Manutenção com alimentos funcionais premium e protocolo preventivo personalizado para sustentabilidade',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma análise preventiva identifica se você se beneficia de suporte para performance. O protocolo é personalizado conforme seu perfil metabólico atual',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha o padrão atual e considere introduzir superalimentos para potencializar ainda mais seus resultados e prevenir declínios futuros',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu equilíbrio digestivo é um ótimo ponto de partida. Descubra como estratégias avançadas podem potencializar ainda mais seus resultados.'
    }
  }
}

// ============================================
// FUNÇÃO HELPER PARA ACESSO
// ============================================
export function getDiagnostico(
  ferramentaId: string,
  profissao: string,
  resultadoId: string
): DiagnosticoCompleto | null {
  let diagnosticos: DiagnosticosPorFerramenta | null = null

  switch (ferramentaId) {
    case 'quiz-interativo':
      diagnosticos = quizInterativoDiagnosticos
      break
    case 'quiz-bem-estar':
      diagnosticos = quizBemEstarDiagnosticos
      break
    case 'quiz-perfil-nutricional':
      diagnosticos = quizPerfilNutricionalDiagnosticos
      break
    case 'quiz-detox':
      diagnosticos = quizDetoxDiagnosticos
      break
    case 'quiz-energetico':
      diagnosticos = quizEnergeticoDiagnosticos
      break
    case 'calculadora-imc':
      diagnosticos = calculadoraImcDiagnosticos
      break
    case 'calculadora-proteina':
      diagnosticos = calculadoraProteinaDiagnosticos
      break
    case 'calculadora-agua':
      diagnosticos = calculadoraAguaDiagnosticos
      break
    case 'calculadora-calorias':
      diagnosticos = calculadoraCaloriasDiagnosticos
      break
    case 'checklist-detox':
      diagnosticos = checklistDetoxDiagnosticos
      break
    case 'checklist-alimentar':
      diagnosticos = checklistAlimentarDiagnosticos
      break
    case 'mini-ebook':
      diagnosticos = miniEbookDiagnosticos
      break
    default:
      return null
  }

  if (!diagnosticos[profissao] || !diagnosticos[profissao][resultadoId]) {
    return null
  }

  return diagnosticos[profissao][resultadoId]
}

// ============================================
// QUIZ DETOX
// ============================================
export const quizDetoxDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    baixaToxicidade: {
      diagnostico: '📋 DIAGNÓSTICO: Baixa carga tóxica mantendo boa saúde; estratégias preventivas podem preservar essa condição',
      causaRaiz: '🔍 CAUSA RAIZ: Boa alimentação e estilo de vida saudável mantêm toxinas controladas. Estratégias preventivas ajudam a preservar essa condição ideal e evoluir para níveis ainda melhores. Uma avaliação preventiva identifica oportunidades específicas',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Continue hábitos atuais e considere avaliação preventiva para introduzir estratégias de manutenção que sustentam saúde a longo prazo',
      plano7Dias: '📅 PLANO 7 DIAS: Manutenção preventiva com alimentos antioxidantes e protocolo de hidratação personalizado conforme seu perfil e estilo de vida',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma análise preventiva identifica se você se beneficia de suporte antioxidante. O protocolo é personalizado conforme sua necessidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha o padrão atual e considere introduzir chás detox e vegetais verdes para potencializar ainda mais seus resultados preventivos',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu equilíbrio atual é um ótimo ponto de partida. Descubra como estratégias preventivas avançadas podem preservar e potencializar ainda mais sua saúde.'
    },
    toxicidadeModerada: {
      diagnostico: '📋 DIAGNÓSTICO: Sinais de acúmulo tóxico moderado que precisam de intervenção estratégica',
      causaRaiz: '🔍 CAUSA RAIZ: Exposição ambiental e alimentação podem estar aumentando toxinas no organismo. Estudos indicam que protocolos detox personalizados podem reduzir carga tóxica em até 45% em poucos meses. Uma avaliação completa identifica exatamente a origem e estratégias para reduzir',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Busque avaliação nutricional para receber um protocolo detox adequado ao seu perfil. Evite protocolos genéricos — cada organismo responde diferente',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo detox moderado personalizado, considerando seu perfil metabólico e estilo de vida, com ajustes conforme sua resposta individual',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica quais suplementos detox seu corpo realmente precisa. Suporte digestivo costuma ser considerado, mas apenas após análise detalhada do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Um plano alimentar detox personalizado considera suas preferências e objetivos. Aumente vegetais crucíferos de forma gradual enquanto aguarda sua avaliação',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu corpo está pedindo equilíbrio — e você já deu o primeiro passo. O próximo é descobrir como reduzir toxinas com um plano personalizado.'
    },
    altaToxicidade: {
      diagnostico: '📋 DIAGNÓSTICO: Alta carga tóxica que precisa de intervenção personalizada e urgente',
      causaRaiz: '🔍 CAUSA RAIZ: Exposição excessiva a toxinas e sistema de eliminação comprometido podem estar afetando sua saúde significativamente. Uma avaliação completa identifica exatamente a origem e estratégias para reverter com segurança',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Busque avaliação nutricional imediata para receber um protocolo detox seguro e adequado ao seu perfil. Evite protocolos intensivos sem acompanhamento — cada caso requer abordagem específica',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo detox completo personalizado, com acompanhamento para ajustes conforme sua resposta individual e necessidade metabólica',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação completa identifica quais suplementos detox são adequados. Protocolos intensivos devem ser definidos apenas após análise detalhada do seu caso, sempre conforme sua individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Um plano alimentar detox rigoroso, totalmente personalizado, considerando suas necessidades metabólicas e preferências, sob acompanhamento profissional',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu organismo precisa de cuidado agora — e é totalmente possível reverter com apoio profissional especializado.'
    }
  }
}

// ============================================
// QUIZ ENERGÉTICO
// ============================================
export const quizEnergeticoDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    energiaBaixa: {
      diagnostico: '📋 DIAGNÓSTICO: Baixa energia natural que precisa de revitalização personalizada',
      causaRaiz: '🔍 CAUSA RAIZ: Deficiências nutricionais ou desequilíbrios metabólicos podem estar afetando sua produção energética. Pesquisas mostram que 68% das pessoas com baixa energia têm carências nutricionais não identificadas. Uma avaliação completa identifica exatamente o que está impactando sua vitalidade',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Busque avaliação nutricional para receber um protocolo energético seguro e adequado ao seu perfil. Evite auto-suplementação — carências específicas precisam ser identificadas primeiro',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo energético inicial personalizado, ajustado ao seu perfil metabólico e rotina, com foco em carboidratos complexos e proteínas distribuídas',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Suporte a energia celular costuma ser considerado, mas sempre de acordo com a individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Um plano alimentar energético personalizado considera suas preferências. Aumente carboidratos complexos e proteínas de forma estratégica enquanto aguarda sua avaliação',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu organismo já deu o primeiro sinal. Agora é hora de transformar esse diagnóstico em ação — descubra como seu corpo pode recuperar energia com apoio personalizado.'
    },
    energiaModerada: {
      diagnostico: '📋 DIAGNÓSTICO: Energia moderada que pode ser otimizada com estratégias personalizadas',
      causaRaiz: '🔍 CAUSA RAIZ: Boa base energética estabelecida, mas ajustes nutricionais específicos podem elevar sua vitalidade significativamente. Estudos indicam que otimizações estratégicas podem aumentar energia em até 35%. Uma análise detalhada mostra exatamente onde ganhar performance',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha hábitos atuais e considere avaliação para identificar estratégias de timing nutricional que potencializam energia. Às vezes pequenos ajustes geram grandes melhorias',
      plano7Dias: '📅 PLANO 7 DIAS: Otimização energética com timing nutricional estratégico específico para seu perfil metabólico e rotina',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você se beneficia de suporte preventivo. Multivitamínico e ômega-3 costumam ser considerados, mas a dosagem é personalizada após análise do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha padrão atual e otimize horários e combinações alimentares. Um plano otimizado considera estratégias específicas para maximizar resultados conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Esse é o primeiro passo. O próximo é descobrir como estratégias avançadas podem elevar ainda mais sua vitalidade.'
    },
    energiaAlta: {
      diagnostico: '📋 DIAGNÓSTICO: Excelente energia natural; estratégias avançadas podem potencializar ainda mais',
      causaRaiz: '🔍 CAUSA RAIZ: Sistema energético eficiente e nutrição adequada. Estratégias preventivas avançadas ajudam a preservar essa condição ideal e evoluir para performance superior. Uma avaliação preventiva identifica oportunidades específicas para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Continue a rotina atual e considere avaliação preventiva para introduzir estratégias nutricionais avançadas que sustentam energia a longo prazo',
      plano7Dias: '📅 PLANO 7 DIAS: Manutenção energética com alimentos funcionais premium e protocolo preventivo personalizado para sustentabilidade',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma análise preventiva identifica se você se beneficia de suporte para performance. O protocolo é personalizado conforme seu perfil metabólico atual',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha o padrão atual e considere introduzir superalimentos e alimentos funcionais premium para potencializar ainda mais seus resultados',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu equilíbrio energético é um ótimo ponto de partida. Descubra como estratégias avançadas podem potencializar ainda mais sua performance.'
    }
  }
}

// ============================================
// CALCULADORA DE IMC
// ============================================
export const calculadoraImcDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    baixoPeso: {
      diagnostico: '📋 DIAGNÓSTICO: Seu IMC indica baixo peso, o que pode sinalizar carência energética e nutricional. É importante restaurar o equilíbrio de forma segura e personalizada',
      causaRaiz: '🔍 CAUSA RAIZ: Pode estar relacionado a ingestão calórica insuficiente, metabolismo acelerado ou má absorção. Estudos indicam que 40% das pessoas com baixo peso têm causas nutricionais não identificadas. Uma avaliação nutricional identifica exatamente onde está o desequilíbrio',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Evite aumentar calorias de forma desordenada. O ideal é ajustar alimentos densos nutricionalmente conforme seu estilo de vida e rotina diária',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo inicial para ganho saudável, com foco em refeições equilibradas, aumento gradual de calorias e estímulo do apetite natural',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade de suplementos só é definida após avaliação completa. Costuma-se considerar opções como whey protein, multivitamínicos e probióticos, sempre de acordo com a individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Priorize alimentos naturais e calóricos como abacate, castanhas, raízes e cereais integrais. Um plano personalizado ajusta quantidades e combinações ideais para você',
      proximoPasso: '🎯 PRÓXIMO PASSO: Descubra em minutos como seu corpo pode responder a um plano de ganho saudável — solicite sua análise personalizada agora.'
    },
    pesoNormal: {
      diagnostico: '📋 DIAGNÓSTICO: Seu IMC está normal, o que indica boa relação peso/altura. Manter hábitos saudáveis e considerar estratégias preventivas',
      causaRaiz: '🔍 CAUSA RAIZ: Boa relação peso/altura estabelecida. Pesquisas mostram que pessoas com IMC normal que adotam estratégias nutricionais preventivas têm 60% menos risco de desenvolver desequilíbrios futuros. Continue cuidando da saúde com foco em qualidade nutricional',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha alimentação equilibrada e exercícios regulares. Considere avaliação preventiva para identificar oportunidades de otimização que preservam esse equilíbrio',
      plano7Dias: '📅 PLANO 7 DIAS: Manutenção com alimentação variada e atividade física, ajustado conforme seu perfil metabólico e objetivos pessoais',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação preventiva identifica se você se beneficia de suporte nutricional. Multivitamínico e ômega-3 costumam ser considerados, mas apenas após análise do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha padrão atual com foco em qualidade nutricional. Um plano personalizado considera combinações específicas para maximizar absorção conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu equilíbrio atual é um ótimo ponto de partida. Descubra como estratégias preventivas podem potencializar ainda mais sua saúde e bem-estar.'
    },
    sobrepeso: {
      diagnostico: '📋 DIAGNÓSTICO: Seu IMC indica sobrepeso, o que sinaliza necessidade de reequilíbrio controlado e personalizado',
      causaRaiz: '🔍 CAUSA RAIZ: Desequilíbrio entre ingestão calórica e gasto energético. Estudos mostram que pequenas mudanças de 300 kcal por dia já podem influenciar a composição corporal ao longo do tempo. Uma avaliação completa identifica exatamente onde ajustar',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Seu corpo está pedindo equilíbrio. Busque avaliação nutricional para um plano de redução gradual e segura. Evite dietas restritivas sem acompanhamento — cada organismo responde diferente',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de redução controlada com alimentação ajustada e estratégias de exercício, personalizado conforme sua resposta individual',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação. Proteína magra e fibras costumam ser considerados, mas sempre de acordo com a individualidade biológica e em doses adequadas',
      alimentacao: '🍎 ALIMENTAÇÃO: Reduza carboidratos refinados e aumente proteínas e fibras de forma estratégica. Um plano personalizado ajusta quantidades e combinações ideais para você',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu corpo está pedindo equilíbrio — e você já deu o primeiro passo. O próximo é descobrir como reduzir peso de forma saudável e sustentável com apoio personalizado.'
    },
    obesidade: {
      diagnostico: '📋 DIAGNÓSTICO: Seu IMC indica obesidade, o que requer intervenção personalizada e estruturada com acompanhamento profissional',
      causaRaiz: '🔍 CAUSA RAIZ: Desequilíbrio metabólico significativo que pode afetar sua saúde. Pesquisas indicam que intervenções nutricionais personalizadas podem resultar em melhoria significativa. Uma avaliação completa identifica exatamente a origem e estratégias para reverter com segurança',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Busque acompanhamento profissional imediato para um plano estruturado e adequado ao seu perfil. Evite abordagens genéricas — cada caso requer estratégia específica e acompanhamento',
      plano7Dias: '📅 PLANO 7 DIAS: Intervenção nutricional inicial personalizada, com suporte multidisciplinar e acompanhamento para ajustes conforme sua resposta individual',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Suporte metabólico pode ser considerado, mas sempre de acordo com a individualidade biológica e sob acompanhamento profissional',
      alimentacao: '🍎 ALIMENTAÇÃO: Reeducação alimentar completa, totalmente personalizada, considerando suas necessidades metabólicas e preferências, sob acompanhamento profissional',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu organismo precisa de cuidado agora — e é totalmente possível reverter com apoio profissional especializado e um plano estruturado.'
    }
  }
}

// ============================================
// CALCULADORA DE PROTEÍNA
// ============================================
export const calculadoraProteinaDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    baixaProteina: {
      diagnostico: '📋 DIAGNÓSTICO: Sua ingestão proteica está abaixo do recomendado, o que pode afetar massa muscular, recuperação e saciedade',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo insuficiente de alimentos proteicos ou planejamento inadequado das refeições. Estudos indicam que 70% das pessoas que treinam consomem menos proteína do que precisam para otimizar resultados. Uma avaliação nutricional identifica exatamente qual é sua necessidade real e como alcançá-la',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Aumente proteínas em todas as refeições principais. Busque avaliação nutricional para um plano personalizado que distribua proteína ao longo do dia de forma estratégica',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo proteico inicial com 1.2-1.6g/kg de peso corporal, distribuído em 4-5 refeições, ajustado conforme sua resposta individual',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Whey protein pode ser considerado, mas sempre de acordo com a individualidade biológica e em doses adequadas',
      alimentacao: '🍎 ALIMENTAÇÃO: Aumente carnes magras, ovos, leguminosas e laticínios de forma estratégica. Um plano personalizado ajusta quantidades e combinações ideais para você',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu corpo precisa de proteína adequada para resultados — descubra em minutos como otimizar sua ingestão proteica com um plano personalizado.'
    },
    proteinaNormal: {
      diagnostico: '📋 DIAGNÓSTICO: Sua ingestão proteica está adequada, mantenha o padrão e considere otimizações estratégicas',
      causaRaiz: '🔍 CAUSA RAIZ: Boa distribuição proteica ao longo do dia estabelecida. Pesquisas mostram que otimizações de timing podem aumentar síntese proteica em até 25%. Uma análise nutricional identifica oportunidades específicas para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha consumo atual e otimize timing das refeições proteicas. Considere avaliação para identificar oportunidades de melhoria na distribuição',
      plano7Dias: '📅 PLANO 7 DIAS: Manutenção com distribuição equilibrada, ajustada conforme seu perfil metabólico e objetivos pessoais',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação preventiva identifica se você se beneficia de suporte adicional. Multivitamínico e ômega-3 costumam ser considerados, mas apenas após análise do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha padrão atual com foco em qualidade proteica. Um plano otimizado considera combinações específicas para maximizar absorção conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu consumo proteico está adequado. Descubra como estratégias avançadas de timing podem potencializar ainda mais seus resultados.'
    },
    altaProteina: {
      diagnostico: '📋 DIAGNÓSTICO: Sua ingestão proteica está elevada, o que pode ser otimizada para máximo benefício com menor sobrecarga',
      causaRaiz: '🔍 CAUSA RAIZ: Ingestão proteica acima do necessário pode não trazer benefícios adicionais. Estudos mostram que acima de 2.2g/kg há pouco ganho adicional. Uma avaliação nutricional identifica se está dentro da faixa ideal ou pode ser ajustada',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha proteína em nível adequado (1.6-2.0g/kg) e redistribua calorias para outros nutrientes essenciais. Considere avaliação para otimização do plano',
      plano7Dias: '📅 PLANO 7 DIAS: Otimização com redistribuição nutricional balanceada, ajustada conforme seu perfil metabólico e objetivos',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você realmente precisa de suplementação adicional. O protocolo é personalizado conforme seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Otimize distribuição proteica e diversifique outros nutrientes. Um plano personalizado ajusta quantidades e combinações ideais para você',
      proximoPasso: '🎯 PRÓXIMO PASSO: Esse é o primeiro passo. O próximo é descobrir como otimizar sua nutrição de forma completa e equilibrada com apoio personalizado.'
    }
  }
}

// ============================================
// CALCULADORA DE ÁGUA
// ============================================
export const calculadoraAguaDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    baixaHidratacao: {
      diagnostico: '📋 DIAGNÓSTICO: Sua hidratação está abaixo do recomendado, o que pode afetar funções essenciais do organismo e performance',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo insuficiente de líquidos ou perda excessiva. Estudos indicam que mesmo desidratação leve (1-2% do peso corporal) pode reduzir desempenho físico em até 10% e afetar funções cognitivas. Uma avaliação nutricional identifica exatamente qual é sua necessidade real considerando atividade física, clima e perfil individual',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Aumente consumo de água gradualmente para 2.5-3L por dia, distribuído ao longo do dia. Busque avaliação nutricional para um plano personalizado que considere sua rotina e necessidades específicas',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo hidratacional inicial com lembretes horários e estratégias para aumentar ingestão de forma natural e sustentável, ajustado conforme sua resposta individual',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Eletrólitos e magnésio podem ser considerados, especialmente se há atividade física, mas sempre de acordo com a individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Aumente frutas aquosas (melancia, laranja), chás e sopas de forma estratégica. Um plano personalizado ajusta quantidades e combinações ideais para você',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu organismo precisa de hidratação adequada — descubra em minutos como otimizar sua ingestão hídrica com um plano personalizado.'
    },
    hidratacaoModerada: {
      diagnostico: '📋 DIAGNÓSTICO: Sua hidratação está adequada, mantenha o padrão e considere otimizações estratégicas para máximo desempenho',
      causaRaiz: '🔍 CAUSA RAIZ: Boa ingestão hídrica e equilíbrio eletrolítico estabelecidos. Pesquisas mostram que otimizações de timing e qualidade dos líquidos podem melhorar recuperação em até 15%. Uma análise nutricional identifica oportunidades específicas para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha consumo atual e otimize timing da hidratação (antes, durante e após exercícios). Considere avaliação preventiva para identificar oportunidades de melhoria na distribuição',
      plano7Dias: '📅 PLANO 7 DIAS: Manutenção com distribuição equilibrada ao longo do dia, ajustada conforme seu perfil de atividade e objetivos pessoais',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação preventiva identifica se você se beneficia de suporte adicional. Eletrólitos específicos podem ser considerados, mas apenas após análise do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha padrão atual com foco em qualidade dos líquidos. Um plano otimizado considera combinações específicas para maximizar absorção conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Sua hidratação está adequada. Descubra como estratégias avançadas de timing podem potencializar ainda mais sua performance e bem-estar.'
    },
    altaHidratacao: {
      diagnostico: '📋 DIAGNÓSTICO: Excelente hidratação! Ideal para atletas e pessoas ativas. Mantenha padrão atual e otimize reposição eletrolítica',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo adequado para alta performance e recuperação. Para pessoas ativas, hidratação acima de 3L/dia é adequada quando acompanhada de reposição eletrolítica. Uma avaliação nutricional identifica se está dentro da faixa ideal e como otimizar eletrólitos',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Continue padrão atual e otimize reposição eletrolítica, especialmente em atividades intensas ou clima quente. Considere avaliação para identificar necessidades específicas de eletrólitos',
      plano7Dias: '📅 PLANO 7 DIAS: Manutenção com reposição eletrolítica estratégica, ajustada conforme seu perfil de atividade e condições climáticas',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você se beneficia de reposição eletrolítica adicional. Eletrólitos premium e magnésio podem ser considerados, mas sempre de acordo com a individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha padrão atual com foco em variedade hidratacional e alimentos ricos em eletrólitos. Um plano personalizado ajusta quantidades e combinações ideais para você',
      proximoPasso: '🎯 PRÓXIMO PASSO: Excelente! Sua hidratação está otimizada. Descubra como estratégias avançadas de reposição eletrolítica podem potencializar ainda mais sua performance.'
    }
  }
}

// ============================================
// CALCULADORA DE CALORIAS
// ============================================
export const calculadoraCaloriasDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    deficitCalorico: {
      diagnostico: '📋 DIAGNÓSTICO: Você precisa de déficit calórico para emagrecimento controlado e sustentável',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo calórico acima do gasto energético diário. Pesquisas mostram que pequenas reduções de 300-500 calorias por dia resultam em perda de 0.5-1kg por semana, de forma segura. Uma avaliação nutricional identifica exatamente onde ajustar calorias sem comprometer massa muscular e nutrição adequada',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Reduza gradualmente 300-500 calorias por dia. Busque avaliação nutricional para um plano personalizado que preserve massa muscular e garanta nutrição adequada durante o processo',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de déficit calórico inicial com distribuição equilibrada de macronutrientes, priorizando proteína, ajustado conforme sua resposta individual',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Proteína e multivitamínico podem ser considerados para preservar massa muscular durante déficit, mas sempre de acordo com a individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Priorize proteínas magras, vegetais ricos em fibras e gorduras saudáveis de forma estratégica. Um plano personalizado ajusta quantidades e combinações ideais para você',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu corpo está pronto para mudança — descubra em minutos como criar um déficit calórico personalizado que preserva sua massa muscular e garante resultados sustentáveis.'
    },
    manutencaoCalorica: {
      diagnostico: '📋 DIAGNÓSTICO: Sua ingestão calórica está equilibrada, mantenha o padrão e considere otimizações na qualidade nutricional',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo calórico adequado para manutenção do peso atual estabelecido. Pesquisas mostram que otimizações na qualidade nutricional, mesmo mantendo calorias, podem melhorar composição corporal e saúde metabólica. Uma análise nutricional identifica oportunidades específicas para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha consumo atual e otimize qualidade nutricional, distribuindo macronutrientes estrategicamente. Considere avaliação preventiva para identificar melhorias na composição da dieta',
      plano7Dias: '📅 PLANO 7 DIAS: Manutenção com foco em qualidade dos alimentos e distribuição otimizada de macronutrientes, ajustada conforme seu perfil metabólico e objetivos',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação preventiva identifica se você se beneficia de suporte nutricional. Multivitamínico e ômega-3 costumam ser considerados, mas apenas após análise do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha padrão atual, foque em variedade e densidade nutricional. Um plano otimizado considera combinações específicas para maximizar benefícios conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu equilíbrio calórico está adequado. Descubra como otimizações na qualidade nutricional podem potencializar ainda mais sua saúde e composição corporal.'
    },
    superavitCalorico: {
      diagnostico: '📋 DIAGNÓSTICO: Você precisa de superávit calórico para ganho de peso saudável e massa muscular',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo calórico abaixo do necessário para ganho de massa. Estudos indicam que superávit de 300-500 calorias por dia, combinado com treino adequado, pode resultar em ganho de 0.25-0.5kg de massa muscular por mês. Uma avaliação nutricional identifica exatamente qual é sua necessidade real e como alcançá-la',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Aumente gradualmente 300-500 calorias por dia com alimentos densos nutricionalmente. Busque avaliação nutricional para um plano personalizado que priorize ganho de massa muscular de forma saudável',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo hipercalórico inicial com distribuição estratégica de macronutrientes priorizando carboidratos complexos e proteínas, ajustado conforme sua resposta individual',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Hipercalórico e proteína podem ser considerados para facilitar ingestão, mas sempre de acordo com a individualidade biológica e em doses adequadas',
      alimentacao: '🍎 ALIMENTAÇÃO: Aumente carboidratos complexos, gorduras saudáveis e proteínas de forma estratégica. Um plano personalizado ajusta quantidades e combinações ideais para você',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu corpo está pronto para crescer — descubra em minutos como criar um superávit calórico personalizado que maximiza ganho de massa muscular de forma saudável.'
    }
  }
}

// ============================================
// CHECKLIST DETOX
// ============================================
export const checklistDetoxDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    baixaToxicidade: {
      diagnostico: '📋 DIAGNÓSTICO: Baixa carga tóxica mantendo boa saúde; estratégias preventivas podem preservar essa condição',
      causaRaiz: '🔍 CAUSA RAIZ: Boa alimentação e estilo de vida saudável mantêm toxinas controladas. Estratégias preventivas ajudam a preservar essa condição ideal e evoluir para níveis ainda melhores. Uma avaliação preventiva identifica oportunidades específicas',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Continue hábitos atuais e considere avaliação preventiva para introduzir estratégias de manutenção que sustentam saúde a longo prazo',
      plano7Dias: '📅 PLANO 7 DIAS: Manutenção preventiva com alimentos antioxidantes e protocolo de hidratação personalizado conforme seu perfil e estilo de vida',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma análise preventiva identifica se você se beneficia de suporte antioxidante. O protocolo é personalizado conforme sua necessidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha o padrão atual e considere introduzir chás detox e vegetais verdes para potencializar ainda mais seus resultados preventivos',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu equilíbrio atual é um ótimo ponto de partida. Descubra como estratégias preventivas avançadas podem preservar e potencializar ainda mais sua saúde.'
    },
    toxicidadeModerada: {
      diagnostico: '📋 DIAGNÓSTICO: Sinais de acúmulo tóxico moderado que precisam de intervenção estratégica',
      causaRaiz: '🔍 CAUSA RAIZ: Exposição ambiental e alimentação podem estar aumentando toxinas no organismo. Estudos indicam que protocolos detox personalizados podem reduzir carga tóxica em até 45% em poucos meses. Uma avaliação completa identifica exatamente a origem e estratégias para reduzir',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Busque avaliação nutricional para receber um protocolo detox adequado ao seu perfil. Evite protocolos genéricos — cada organismo responde diferente',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo detox moderado personalizado, considerando seu perfil metabólico e estilo de vida, com ajustes conforme sua resposta individual',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica quais suplementos detox seu corpo realmente precisa. Suporte digestivo costuma ser considerado, mas apenas após análise detalhada do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Um plano alimentar detox personalizado considera suas preferências e objetivos. Aumente vegetais crucíferos de forma gradual enquanto aguarda sua avaliação',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu corpo está pedindo equilíbrio — e você já deu o primeiro passo. O próximo é descobrir como reduzir toxinas com um plano personalizado.'
    },
    altaToxicidade: {
      diagnostico: '📋 DIAGNÓSTICO: Alta carga tóxica que precisa de intervenção personalizada e urgente',
      causaRaiz: '🔍 CAUSA RAIZ: Exposição excessiva a toxinas e sistema de eliminação comprometido podem estar afetando sua saúde significativamente. Uma avaliação completa identifica exatamente a origem e estratégias para reverter com segurança',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Busque avaliação nutricional imediata para receber um protocolo detox seguro e adequado ao seu perfil. Evite protocolos intensivos sem acompanhamento — cada caso requer abordagem específica',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo detox completo personalizado, com acompanhamento para ajustes conforme sua resposta individual e necessidade metabólica',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação completa identifica quais suplementos detox são adequados. Protocolos intensivos devem ser definidos apenas após análise detalhada do seu caso, sempre conforme sua individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Um plano alimentar detox rigoroso, totalmente personalizado, considerando suas necessidades metabólicas e preferências, sob acompanhamento profissional',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu organismo precisa de cuidado agora — e é totalmente possível reverter com apoio profissional especializado.'
    }
  }
}

// ============================================
// CHECKLIST ALIMENTAR
// ============================================
export const checklistAlimentarDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    alimentacaoDeficiente: {
      diagnostico: '📋 DIAGNÓSTICO: Sua alimentação precisa de correção para melhorar saúde e bem-estar de forma sustentável',
      causaRaiz: '🔍 CAUSA RAIZ: Hábitos alimentares inadequados e possíveis deficiências nutricionais. Estudos indicam que 70% das doenças crônicas estão relacionadas à alimentação inadequada. Uma avaliação nutricional completa identifica exatamente quais deficiências estão presentes e como corrigir',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Implemente mudanças alimentares básicas gradualmente. Busque avaliação nutricional para receber um plano personalizado que corrija deficiências de forma segura e adequada ao seu estilo de vida',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de reeducação alimentar inicial, priorizando alimentos in natura e redução de processados, ajustado conforme sua rotina e preferências',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Multivitamínico e ferro podem ser considerados para corrigir deficiências, mas sempre de acordo com a individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Foque em alimentos in natura, evite processados e ultraprocessados de forma gradual. Um plano personalizado ajusta quantidades e combinações ideais para você',
      proximoPasso: '🎯 PRÓXIMO PASSO: Sua saúde começa pela alimentação — descubra em minutos como transformar seus hábitos alimentares com um plano personalizado e seguro.'
    },
    alimentacaoModerada: {
      diagnostico: '📋 DIAGNÓSTICO: Sua alimentação está moderada, mas pode ser otimizada para melhorar saúde e performance',
      causaRaiz: '🔍 CAUSA RAIZ: Alguns hábitos alimentares podem ser otimizados e pequenas deficiências nutricionais podem estar presentes. Pesquisas mostram que otimizações estratégicas podem melhorar marcadores de saúde em até 30%. Uma análise nutricional identifica oportunidades específicas para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Otimize hábitos alimentares e corrija possíveis deficiências. Considere avaliação nutricional para identificar ajustes estratégicos que maximizem resultados',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de otimização alimentar personalizado, considerando seus hábitos atuais e objetivos, com foco em melhorias graduais e sustentáveis',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você se beneficia de suporte nutricional. Multivitamínico e ômega-3 costumam ser considerados, mas apenas após análise do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Melhore qualidade dos alimentos e adicione superalimentos de forma estratégica. Um plano otimizado considera combinações específicas para maximizar benefícios conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Esse é o primeiro passo. O próximo é descobrir como otimizar sua alimentação com estratégias personalizadas que potencializam sua saúde.'
    },
    alimentacaoEquilibrada: {
      diagnostico: '📋 DIAGNÓSTICO: Sua alimentação está equilibrada, mantenha o padrão e considere otimizações estratégicas',
      causaRaiz: '🔍 CAUSA RAIZ: Bons hábitos alimentares estabelecidos. Estratégias preventivas e otimizações avançadas ajudam a preservar essa condição ideal e evoluir para níveis ainda melhores. Uma avaliação preventiva identifica oportunidades específicas',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha padrão atual e considere avaliação preventiva para identificar estratégias avançadas que potencializam saúde a longo prazo',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de manutenção com alimentos funcionais e estratégias nutricionais avançadas, personalizado conforme seu perfil e objetivos',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma análise preventiva identifica se você se beneficia de suporte nutricional avançado. O protocolo é personalizado conforme sua necessidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha padrão atual, foque em alimentos funcionais e densidade nutricional. Um plano otimizado considera estratégias específicas para maximizar benefícios conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu equilíbrio alimentar é um ótimo ponto de partida. Descubra como estratégias avançadas podem potencializar ainda mais sua saúde e bem-estar.'
    }
  }
}

// ============================================
// MINI E-BOOK EDUCATIVO
// ============================================
export const miniEbookDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    baixoConhecimento: {
      diagnostico: '📚 DIAGNÓSTICO: Seu conhecimento nutricional precisa de base sólida para melhorar saúde e bem-estar',
      causaRaiz: '🔍 CAUSA RAIZ: Falta de conhecimento básico sobre nutrição e alimentação. Estudos mostram que pessoas com maior conhecimento nutricional têm 40% mais probabilidade de adotar hábitos saudáveis. Uma avaliação nutricional identifica exatamente quais fundamentos você precisa dominar primeiro',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Comece estudando fundamentos nutricionais gradualmente. Busque avaliação nutricional para receber um plano educacional personalizado que priorize os conceitos mais importantes para você',
      plano7Dias: '📅 PLANO 7 DIAS: Leitura diária de conteúdo nutricional básico, focado em macronutrientes, micronutrientes e alimentação balanceada, ajustado conforme seu ritmo de aprendizado',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Multivitamínico pode ser considerado para suportar durante o aprendizado, mas sempre de acordo com a individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Foque em alimentos in natura e evite processados. Um plano personalizado ajuda a aplicar os conhecimentos na prática de forma gradual e segura',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu conhecimento é o primeiro passo — descubra em minutos como construir uma base sólida em nutrição com um plano educacional personalizado.'
    },
    conhecimentoModerado: {
      diagnostico: '📚 DIAGNÓSTICO: Seu conhecimento nutricional está moderado, mas pode ser aprofundado para potencializar ainda mais resultados',
      causaRaiz: '🔍 CAUSA RAIZ: Conhecimento básico presente, mas falta especialização em áreas específicas. Pesquisas indicam que aprofundamento estratégico pode melhorar aplicação prática em até 35%. Uma análise identifica oportunidades específicas para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Aprofunde conhecimentos específicos estrategicamente. Considere avaliação para identificar áreas onde o aprofundamento traz maior impacto',
      plano7Dias: '📅 PLANO 7 DIAS: Leitura diária de conteúdo nutricional avançado, focado em especializações estratégicas, ajustado conforme seus interesses e objetivos',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você se beneficia de suporte nutricional durante o aprofundamento. Multivitamínico e ômega-3 costumam ser considerados, mas apenas após análise do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Melhore qualidade dos alimentos e adicione superalimentos de forma estratégica. Um plano otimizado considera aplicação prática dos conhecimentos avançados conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Esse é o primeiro passo. O próximo é descobrir como aprofundar seu conhecimento com estratégias especializadas que potencializam resultados práticos.'
    },
    altoConhecimento: {
      diagnostico: '📚 DIAGNÓSTICO: Seu conhecimento nutricional está alto, mantenha o padrão e evolua para especialização',
      causaRaiz: '🔍 CAUSA RAIZ: Bom conhecimento nutricional estabelecido permite foco em evolução e especialização. Estratégias avançadas ajudam a preservar esse conhecimento e evoluir para níveis ainda melhores. Uma avaliação preventiva identifica oportunidades específicas de especialização',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha conhecimento atual e evolua para especialização. Considere avaliação para identificar áreas de especialização que potencializam seu perfil',
      plano7Dias: '📅 PLANO 7 DIAS: Leitura diária de conteúdo nutricional especializado, focado em áreas de expertise avançada, personalizado conforme seu perfil e objetivos profissionais',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma análise preventiva identifica se você se beneficia de suporte nutricional avançado. O protocolo é personalizado conforme sua necessidade biológica e nível de conhecimento',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha padrão atual, foque em alimentos funcionais e densidade nutricional. Um plano especializado considera estratégias avançadas para maximizar benefícios conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu conhecimento atual é um ótimo ponto de partida. Descubra como estratégias avançadas de especialização podem potencializar ainda mais sua expertise e resultados práticos.'
    }
  }
}

// ============================================
// EXPORTAÇÃO COMPLETA (para compatibilidade)
// ============================================
export const diagnosticosNutri = {
  'quiz-interativo': quizInterativoDiagnosticos,
  'quiz-bem-estar': quizBemEstarDiagnosticos,
  'quiz-perfil-nutricional': quizPerfilNutricionalDiagnosticos,
  'quiz-detox': quizDetoxDiagnosticos,
  'quiz-energetico': quizEnergeticoDiagnosticos,
  'calculadora-imc': calculadoraImcDiagnosticos,
  'calculadora-proteina': calculadoraProteinaDiagnosticos,
  'calculadora-agua': calculadoraAguaDiagnosticos,
  'calculadora-calorias': calculadoraCaloriasDiagnosticos,
  'checklist-detox': checklistDetoxDiagnosticos,
  'checklist-alimentar': checklistAlimentarDiagnosticos,
  'mini-ebook': miniEbookDiagnosticos
}


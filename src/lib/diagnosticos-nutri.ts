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
      diagnostico: '📋 DIAGNÓSTICO: Sinais de baixa eficiência metabólica que pedem intervenção personalizada',
      causaRaiz: '🔍 CAUSA RAIZ: Possíveis carências nutricionais e ritmos de refeição irregulares podem reduzir energia e disposição. Uma avaliação completa identifica onde ajustar para recuperar estabilidade',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Busque avaliação nutricional para receber um protocolo seguro e adequado ao seu perfil. Evite auto-suplementação — cada organismo responde de forma única',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo inicial focado em horários consistentes e presença de proteína em todas as refeições, com ajustes conforme sua resposta',
      suplementacao: '💊 SUPLEMENTAÇÃO: A avaliação definirá o suporte ideal. Exemplos comuns incluem suporte a energia celular após análise individual',
      alimentacao: '🍎 ALIMENTAÇÃO: Fortaleça a base com proteínas magras e gorduras boas (ex.: abacate, oleaginosas) enquanto aguarda sua avaliação'
    },
    metabolismoEquilibrado: {
      diagnostico: '📋 DIAGNÓSTICO: Boa base metabólica com espaço para otimização',
      causaRaiz: '🔍 CAUSA RAIZ: Absorção e eficiência podem evoluir com ajustes finos. Uma análise detalhada mostra exatamente onde ganhar performance',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha hábitos atuais e considere avaliação para identificar microajustes com maior impacto',
      plano7Dias: '📅 PLANO 7 DIAS: Estratégias de timing e alimentos funcionais alinhados ao seu ritmo, com ajustes conforme resposta',
      suplementacao: '💊 SUPLEMENTAÇÃO: Vitaminas e minerais',
      alimentacao: '🍎 ALIMENTAÇÃO: Varie cores no prato e inclua alimentos antioxidantes para sustentar a otimização'
    },
    metabolismoAcelerado: {
      diagnostico: '📋 DIAGNÓSTICO: Alta queima metabólica que pede estabilização inteligente',
      causaRaiz: '🔍 CAUSA RAIZ: Exigência energética elevada pode gerar desequilíbrios e fadiga. Uma avaliação indica como sustentar energia sem oscilações',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Considere fracionar refeições (5–6x/dia) e buscar análise para um plano que segure energia de forma consistente',
      plano7Dias: '📅 PLANO 7 DIAS: Ajuste de carboidratos complexos com proteína distribuída ao longo do dia, monitorando resposta individual',
      suplementacao: '💊 SUPLEMENTAÇÃO: Definida após avaliação; foco em recuperação e estabilidade conforme seu perfil',
      alimentacao: '🍎 ALIMENTAÇÃO: Priorize carboidratos complexos combinados a proteína para sustentar vitalidade'
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
      causaRaiz: '🔍 CAUSA RAIZ: Deficiências nutricionais podem estar afetando sua energia, humor e qualidade de vida. Uma avaliação completa identifica quais nutrientes estão faltando no seu organismo e como isso impacta sua rotina diária',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Busque uma avaliação nutricional para receber um protocolo de suplementação seguro e adequado ao seu perfil. Evite auto-suplementação — cada organismo responde de forma única',
      plano7Dias: '📅 PLANO 7 DIAS: Um protocolo personalizado de 7 dias, ajustado ao seu perfil metabólico e estilo de vida, com acompanhamento para ajustes conforme sua resposta ao plano',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação completa identifica quais suplementos seu corpo realmente precisa e em doses adequadas. Complexo B, magnésio e ômega-3 são frequentemente indicados, mas apenas após análise detalhada do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Um plano alimentar personalizado considera suas preferências e objetivos para reequilibrar nutrientes de forma estratégica. Aumente frutas, verduras e grãos integrais enquanto aguarda sua avaliação profissional'
    },
    bemEstarModerado: {
      diagnostico: '📋 DIAGNÓSTICO: Seu bem-estar está bom, mas pode ser otimizado com ajustes nutricionais estratégicos e personalizados',
      causaRaiz: '🔍 CAUSA RAIZ: Boa base nutricional, porém pode faltar micronutrientes específicos para elevar seu bem-estar. Uma análise detalhada identifica exatamente o que pode fazer a diferença no seu desempenho e vitalidade',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha hábitos atuais e considere uma consulta para identificar oportunidades de otimização. Às vezes pequenos ajustes feitos de forma personalizada geram grandes melhorias',
      plano7Dias: '📅 PLANO 7 DIAS: Otimização com alimentos funcionais e estratégias de timing nutricional específicas para seu perfil metabólico e rotina',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você precisa de suplementação preventiva. Multivitamínico premium e probióticos costumam ser indicados, mas a dosagem e combinação são personalizadas após análise do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Varie cores no prato e inclua alimentos antioxidantes. Um plano otimizado considera combinações específicas para maximizar absorção e resultados conforme seu perfil'
    },
    bemEstarAlto: {
      diagnostico: '📋 DIAGNÓSTICO: Excelente bem-estar! Mantenha com nutrição preventiva e estratégias avançadas de performance',
      causaRaiz: '🔍 CAUSA RAIZ: Ótima base nutricional e hábitos saudáveis estabelecidos. Estratégias preventivas avançadas ajudam a preservar essa condição ideal e evoluir para níveis ainda superiores',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Continue a rotina atual e considere uma avaliação preventiva para introduzir estratégias nutricionais avançadas que sustentam resultados a longo prazo',
      plano7Dias: '📅 PLANO 7 DIAS: Manutenção com alimentos anti-inflamatórios e protocolo preventivo personalizado para sustentabilidade e prevenção de declínios futuros',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma análise preventiva identifica se você se beneficia de antioxidantes e adaptógenos para performance. O protocolo é personalizado conforme seu perfil metabólico atual',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha o padrão atual e considere introduzir alimentos funcionais premium e superalimentos para potencializar ainda mais seus resultados e prevenir declínios futuros'
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
      causaRaiz: '🔍 CAUSA RAIZ: Problemas digestivos ou inflamação podem estar reduzindo a absorção. Uma avaliação completa identifica a origem e como reverter',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Busque avaliação nutricional para receber um protocolo seguro e adequado. Evite auto-suplementação — cada caso tem necessidades específicas',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo inicial focado em reparo digestivo e alimentos anti-inflamatórios, com ajustes conforme sua resposta individual',
      suplementacao: '💊 SUPLEMENTAÇÃO: Definida após avaliação; pode incluir suporte digestivo específico conforme necessidade',
      alimentacao: '🍎 ALIMENTAÇÃO: Evite alimentos inflamatórios enquanto aguarda sua avaliação. Aumente fibras prebióticas de forma gradual'
    },
    absorcaoModerada: {
      diagnostico: '📋 DIAGNÓSTICO: Boa base, mas pode ser otimizada com estratégias personalizadas',
      causaRaiz: '🔍 CAUSA RAIZ: Boa digestão, mas timing e combinações podem ser refinados. Uma análise detalhada mostra onde ganhar eficiência',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha hábitos atuais e considere avaliação para identificar estratégias de timing que potencializam absorção',
      plano7Dias: '📅 PLANO 7 DIAS: Otimização com combinações alimentares estratégicas e timing nutricional específico para seu perfil',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você se beneficia de suporte preventivo. Multivitamínico e probióticos costumam ser indicados, mas apenas após análise do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Combine nutrientes para melhor absorção (ex.: ferro + vitamina C). Um plano otimizado considera combinações específicas para maximizar seus resultados'
    },
    absorcaoOtimizada: {
      diagnostico: '📋 DIAGNÓSTICO: Sistema digestivo funcionando bem; estratégias avançadas podem potencializar ainda mais',
      causaRaiz: '🔍 CAUSA RAIZ: Sistema digestivo saudável e eficiente. Estratégias preventivas avançadas ajudam a preservar essa condição e evoluir para níveis superiores',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Continue a rotina atual e considere avaliação preventiva para introduzir estratégias nutricionais avançadas que sustentam resultados a longo prazo',
      plano7Dias: '📅 PLANO 7 DIAS: Manutenção com alimentos funcionais premium e protocolo preventivo personalizado para sustentabilidade',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma análise preventiva identifica se você se beneficia de suporte para performance. O protocolo é personalizado conforme seu perfil metabólico atual',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha o padrão atual e considere introduzir superalimentos para potencializar ainda mais seus resultados e prevenir declínios futuros'
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
      causaRaiz: '🔍 CAUSA RAIZ: Boa alimentação e estilo de vida saudável mantêm toxinas controladas. Estratégias preventivas ajudam a preservar essa condição ideal',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Continue hábitos atuais e considere avaliação preventiva para introduzir estratégias de manutenção que sustentam saúde a longo prazo',
      plano7Dias: '📅 PLANO 7 DIAS: Manutenção preventiva com alimentos antioxidantes e protocolo de hidratação personalizado conforme seu perfil',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma análise preventiva identifica se você se beneficia de suporte antioxidante. O protocolo é personalizado conforme sua necessidade',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha o padrão atual e considere introduzir chás detox e vegetais verdes para potencializar ainda mais seus resultados preventivos'
    },
    toxicidadeModerada: {
      diagnostico: '📋 DIAGNÓSTICO: Sinais de acúmulo tóxico moderado que precisam de intervenção estratégica',
      causaRaiz: '🔍 CAUSA RAIZ: Exposição ambiental e alimentação podem estar aumentando toxinas. Uma avaliação completa identifica a origem e estratégias para reduzir',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Busque avaliação nutricional para receber um protocolo detox adequado ao seu perfil. Evite protocolos genéricos — cada organismo responde diferente',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo detox moderado personalizado, considerando seu perfil metabólico e estilo de vida, com ajustes conforme sua resposta',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica quais suplementos detox seu corpo realmente precisa. Suporte digestivo costuma ser indicado, mas apenas após análise detalhada do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Um plano alimentar detox personalizado considera suas preferências. Aumente vegetais crucíferos de forma gradual enquanto aguarda sua avaliação'
    },
    altaToxicidade: {
      diagnostico: '📋 DIAGNÓSTICO: Alta carga tóxica que precisa de intervenção personalizada e urgente',
      causaRaiz: '🔍 CAUSA RAIZ: Exposição excessiva a toxinas e sistema de eliminação comprometido podem estar afetando sua saúde. Uma avaliação completa identifica a origem e estratégias para reverter',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Busque avaliação nutricional imediata para receber um protocolo detox seguro e adequado. Evite protocolos intensivos sem acompanhamento — cada caso requer abordagem específica',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo detox completo personalizado, com acompanhamento para ajustes conforme sua resposta individual e necessidade metabólica',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação completa identifica quais suplementos detox são adequados. Protocolos intensivos devem ser definidos apenas após análise detalhada do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Um plano alimentar detox rigoroso, totalmente personalizado, considerando suas necessidades metabólicas e preferências, sob acompanhamento profissional'
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
      causaRaiz: '🔍 CAUSA RAIZ: Deficiências nutricionais ou desequilíbrios metabólicos podem estar afetando sua produção energética. Uma avaliação completa identifica exatamente o que está impactando sua vitalidade',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Busque avaliação nutricional para receber um protocolo energético seguro e adequado. Evite auto-suplementação — carências específicas precisam ser identificadas primeiro',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo energético inicial personalizado, ajustado ao seu perfil metabólico e rotina, com foco em carboidratos complexos e proteínas distribuídas',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação completa identifica quais suplementos energéticos seu corpo realmente precisa. Exemplos comuns incluem suporte a energia celular, mas apenas após análise individual',
      alimentacao: '🍎 ALIMENTAÇÃO: Um plano alimentar energético personalizado, considerando suas preferências. Aumente carboidratos complexos e proteínas de forma estratégica enquanto aguarda sua avaliação'
    },
    energiaModerada: {
      diagnostico: '📋 DIAGNÓSTICO: Energia moderada que pode ser otimizada com estratégias personalizadas',
      causaRaiz: '🔍 CAUSA RAIZ: Boa base energética, mas ajustes nutricionais específicos podem elevar sua vitalidade. Uma análise detalhada mostra exatamente onde ganhar performance',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha hábitos atuais e considere avaliação para identificar estratégias de timing nutricional que potencializam energia',
      plano7Dias: '📅 PLANO 7 DIAS: Otimização energética com timing nutricional estratégico específico para seu perfil metabólico e rotina',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você se beneficia de suporte preventivo. Multivitamínico e ômega-3 costumam ser indicados, mas a dosagem é personalizada após análise do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha padrão atual e otimize horários e combinações alimentares. Um plano otimizado considera estratégias específicas para maximizar seus resultados'
    },
    energiaAlta: {
      diagnostico: '📋 DIAGNÓSTICO: Excelente energia natural; estratégias avançadas podem potencializar ainda mais',
      causaRaiz: '🔍 CAUSA RAIZ: Sistema energético eficiente e nutrição adequada. Estratégias preventivas avançadas ajudam a preservar essa condição ideal e evoluir para performance superior',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Continue a rotina atual e considere avaliação preventiva para introduzir estratégias nutricionais avançadas que sustentam energia a longo prazo',
      plano7Dias: '📅 PLANO 7 DIAS: Manutenção energética com alimentos funcionais premium e protocolo preventivo personalizado para sustentabilidade',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma análise preventiva identifica se você se beneficia de suporte para performance. O protocolo é personalizado conforme seu perfil metabólico atual',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha o padrão atual e considere introduzir superalimentos e alimentos funcionais premium para potencializar ainda mais seus resultados e prevenir declínios futuros'
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
  'quiz-energetico': quizEnergeticoDiagnosticos
}


import { desafio7DiasDiagnosticos as desafio7DiasDiagnosticosWellness } from './diagnostics/wellness/desafio-7-dias'
import { desafio21DiasDiagnosticos as desafio21DiasDiagnosticosWellness } from './diagnostics/wellness/desafio-21-dias'
import { guiaHidratacaoDiagnosticos as guiaHidratacaoDiagnosticosWellness } from './diagnostics/wellness/guia-hidratacao'
import { avaliacaoEmocionalDiagnosticos as avaliacaoEmocionalDiagnosticosWellness } from './diagnostics/wellness/avaliacao-emocional'
import { intoleranciaDiagnosticos as intoleranciaDiagnosticosWellness } from './diagnostics/wellness/intolerancia'
import { perfilMetabolicoDiagnosticos as perfilMetabolicoDiagnosticosWellness } from './diagnostics/wellness/perfil-metabolico'
import { avaliacaoInicialDiagnosticos as avaliacaoInicialDiagnosticosWellness } from './diagnostics/wellness/avaliacao-inicial'
import { eletrolitosDiagnosticos as eletrolitosDiagnosticosWellness } from './diagnostics/wellness/eletrolitos'
import { sintomasIntestinaisDiagnosticos as sintomasIntestinaisDiagnosticosWellness } from './diagnostics/wellness/sintomas-intestinais'
import { prontoEmagrecerDiagnosticos as prontoEmagrecerDiagnosticosWellness } from './diagnostics/wellness/pronto-emagrecer'
import { tipoFomeDiagnosticos as tipoFomeDiagnosticosWellness } from './diagnostics/wellness/tipo-fome'
import { alimentacaoSaudavelDiagnosticos as alimentacaoSaudavelDiagnosticosWellness } from './diagnostics/wellness/alimentacao-saudavel'
import { sindromeMetabolicaDiagnosticos as sindromeMetabolicaDiagnosticosWellness } from './diagnostics/wellness/sindrome-metabolica'
import { retencaoLiquidosDiagnosticos as retencaoLiquidosDiagnosticosWellness } from './diagnostics/wellness/retencao-liquidos'
import { conheceSeuCorpoDiagnosticos as conheceSeuCorpoDiagnosticosWellness } from './diagnostics/wellness/conhece-seu-corpo'
import { nutridoVsAlimentadoDiagnosticos as nutridoVsAlimentadoDiagnosticosWellness } from './diagnostics/wellness/nutrido-vs-alimentado'
import { alimentacaoRotinaDiagnosticos as alimentacaoRotinaDiagnosticosWellness } from './diagnostics/wellness/alimentacao-rotina'
import { ganhosProsperidadeDiagnosticos as ganhosProsperidadeDiagnosticosWellness } from './diagnostics/wellness/ganhos-prosperidade'
import { potencialCrescimentoDiagnosticos as potencialCrescimentoDiagnosticosWellness } from './diagnostics/wellness/potencial-crescimento'
import { propositoEquilibrioDiagnosticos as propositoEquilibrioDiagnosticosWellness } from './diagnostics/wellness/proposito-equilibrio'

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
    case 'avaliacao-emocional':
    case 'quiz-emocional':
      // Se for wellness, usar diagnósticos de wellness, senão usar de nutri (se existir)
      if (profissao === 'wellness') {
        diagnosticos = avaliacaoEmocionalDiagnosticosWellness
      } else {
        diagnosticos = avaliacaoEmocionalDiagnosticosWellness // Por enquanto só temos wellness
      }
      break
    case 'avaliacao-intolerancia':
    case 'quiz-intolerancia':
    case 'intolerancia':
      // Se for wellness, usar diagnósticos de wellness, senão usar de nutri (se existir)
      if (profissao === 'wellness') {
        diagnosticos = intoleranciaDiagnosticosWellness
      } else {
        diagnosticos = intoleranciaDiagnosticosWellness // Por enquanto só temos wellness
      }
      break
    case 'avaliacao-perfil-metabolico':
    case 'quiz-perfil-metabolico':
    case 'perfil-metabolico':
    case 'perfil-metabólico':
      // Se for wellness, usar diagnósticos de wellness, senão usar de nutri (se existir)
      if (profissao === 'wellness') {
        diagnosticos = perfilMetabolicoDiagnosticosWellness
      } else {
        diagnosticos = perfilMetabolicoDiagnosticosWellness // Por enquanto só temos wellness
      }
      break
    case 'avaliacao-inicial':
    case 'quiz-avaliacao-inicial':
    case 'template-avaliacao-inicial':
      // Se for wellness, usar diagnósticos de wellness, senão usar de nutri (se existir)
      if (profissao === 'wellness') {
        diagnosticos = avaliacaoInicialDiagnosticosWellness
      } else {
        diagnosticos = avaliacaoInicialDiagnosticosWellness // Por enquanto só temos wellness
      }
      break
    case 'diagnostico-eletrolitos':
    case 'quiz-eletrolitos':
    case 'eletrolitos':
    case 'eletrólitos':
      // Se for wellness, usar diagnósticos de wellness, senão usar de nutri (se existir)
      if (profissao === 'wellness') {
        diagnosticos = eletrolitosDiagnosticosWellness
      } else {
        diagnosticos = eletrolitosDiagnosticosWellness // Por enquanto só temos wellness
      }
      break
    case 'diagnostico-sintomas-intestinais':
    case 'quiz-sintomas-intestinais':
    case 'sintomas-intestinais':
    case 'sintomas intestinais':
      // Se for wellness, usar diagnósticos de wellness, senão usar de nutri (se existir)
      if (profissao === 'wellness') {
        diagnosticos = sintomasIntestinaisDiagnosticosWellness
      } else {
        diagnosticos = sintomasIntestinaisDiagnosticosWellness // Por enquanto só temos wellness
      }
      break
    case 'pronto-emagrecer':
    case 'quiz-pronto-emagrecer':
    case 'pronto para emagrecer':
      // Se for wellness, usar diagnósticos de wellness, senão usar de nutri (se existir)
      if (profissao === 'wellness') {
        diagnosticos = prontoEmagrecerDiagnosticosWellness
      } else {
        diagnosticos = prontoEmagrecerDiagnosticosWellness // Por enquanto só temos wellness
      }
      break
    case 'tipo-fome':
    case 'quiz-tipo-fome':
    case 'qual-e-o-seu-tipo-de-fome':
    case 'tipo de fome':
      // Se for wellness, usar diagnósticos de wellness, senão usar de nutri (se existir)
      if (profissao === 'wellness') {
        diagnosticos = tipoFomeDiagnosticosWellness
      } else {
        diagnosticos = tipoFomeDiagnosticosWellness // Por enquanto só temos wellness
      }
      break
    case 'alimentacao-saudavel':
    case 'quiz-alimentacao-saudavel':
    case 'healthy-eating-quiz':
    case 'healthy-eating':
      // Se for wellness, usar diagnósticos de wellness, senão usar de nutri (se existir)
      if (profissao === 'wellness') {
        diagnosticos = alimentacaoSaudavelDiagnosticosWellness
      } else {
        diagnosticos = alimentacaoSaudavelDiagnosticosWellness // Por enquanto só temos wellness
      }
      break
    case 'sindrome-metabolica':
    case 'risco-sindrome-metabolica':
    case 'metabolic-syndrome-risk':
    case 'metabolic-syndrome':
      // Se for wellness, usar diagnósticos de wellness, senão usar de nutri (se existir)
      if (profissao === 'wellness') {
        diagnosticos = sindromeMetabolicaDiagnosticosWellness
      } else {
        diagnosticos = sindromeMetabolicaDiagnosticosWellness // Por enquanto só temos wellness
      }
      break
    case 'retencao-liquidos':
    case 'teste-retencao-liquidos':
    case 'water-retention-test':
    case 'water-retention':
      // Se for wellness, usar diagnósticos de wellness, senão usar de nutri (se existir)
      if (profissao === 'wellness') {
        diagnosticos = retencaoLiquidosDiagnosticosWellness
      } else {
        diagnosticos = retencaoLiquidosDiagnosticosWellness // Por enquanto só temos wellness
      }
      break
    case 'conhece-seu-corpo':
    case 'voce-conhece-seu-corpo':
    case 'body-awareness':
    case 'autoconhecimento-corporal':
      // Se for wellness, usar diagnósticos de wellness, senão usar de nutri (se existir)
      if (profissao === 'wellness') {
        diagnosticos = conheceSeuCorpoDiagnosticosWellness
      } else {
        diagnosticos = conheceSeuCorpoDiagnosticosWellness // Por enquanto só temos wellness
      }
      break
    case 'nutrido-vs-alimentado':
    case 'voce-nutrido-ou-apenas-alimentado':
    case 'nourished-vs-fed':
    case 'nutrido ou alimentado':
      // Se for wellness, usar diagnósticos de wellness, senão usar de nutri (se existir)
      if (profissao === 'wellness') {
        diagnosticos = nutridoVsAlimentadoDiagnosticosWellness
      } else {
        diagnosticos = nutridoVsAlimentadoDiagnosticosWellness // Por enquanto só temos wellness
      }
      break
    case 'alimentacao-rotina':
    case 'voce-alimentando-conforme-rotina':
    case 'eating-routine':
    case 'alimentação conforme rotina':
      // Se for wellness, usar diagnósticos de wellness, senão usar de nutri (se existir)
      if (profissao === 'wellness') {
        diagnosticos = alimentacaoRotinaDiagnosticosWellness
      } else {
        diagnosticos = alimentacaoRotinaDiagnosticosWellness // Por enquanto só temos wellness
      }
      break
    case 'ganhos-prosperidade':
    case 'quiz-ganhos-prosperidade':
    case 'gains-and-prosperity':
    case 'ganhos e prosperidade':
      // Se for wellness, usar diagnósticos de wellness, senão usar de nutri (se existir)
      if (profissao === 'wellness') {
        diagnosticos = ganhosProsperidadeDiagnosticosWellness
      } else {
        diagnosticos = ganhosProsperidadeDiagnosticosWellness // Por enquanto só temos wellness
      }
      break
    case 'potencial-crescimento':
    case 'quiz-potencial-crescimento':
    case 'potential-and-growth':
    case 'potencial e crescimento':
      // Se for wellness, usar diagnósticos de wellness, senão usar de nutri (se existir)
      if (profissao === 'wellness') {
        diagnosticos = potencialCrescimentoDiagnosticosWellness
      } else {
        diagnosticos = potencialCrescimentoDiagnosticosWellness // Por enquanto só temos wellness
      }
      break
    case 'proposito-equilibrio':
    case 'quiz-proposito-equilibrio':
    case 'purpose-and-balance':
    case 'propósito e equilíbrio':
      // Se for wellness, usar diagnósticos de wellness, senão usar de nutri (se existir)
      if (profissao === 'wellness') {
        diagnosticos = propositoEquilibrioDiagnosticosWellness
      } else {
        diagnosticos = propositoEquilibrioDiagnosticosWellness // Por enquanto só temos wellness
      }
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
    case 'guia-nutraceutico':
      diagnosticos = guiaNutraceuticoDiagnosticos
      break
    case 'guia-proteico':
      diagnosticos = guiaProteicoDiagnosticos
      break
    case 'tabela-comparativa':
      diagnosticos = tabelaComparativaDiagnosticos
      break
    case 'tabela-substituicoes':
      diagnosticos = tabelaSubstituicoesDiagnosticos
      break
    case 'tabela-sintomas':
      diagnosticos = tabelaSintomasDiagnosticos
      break
    case 'plano-alimentar-base':
      diagnosticos = planoAlimentarBaseDiagnosticos
      break
    case 'planner-refeicoes':
      diagnosticos = plannerRefeicoesDiagnosticos
      break
    case 'rastreador-alimentar':
      diagnosticos = rastreadorAlimentarDiagnosticos
      break
    case 'diario-alimentar':
      diagnosticos = diarioAlimentarDiagnosticos
      break
    case 'tabela-metas-semanais':
      diagnosticos = tabelaMetasSemanaisDiagnosticos
      break
    case 'template-desafio-7dias':
    case 'desafio-7-dias':
      // Se for wellness, usar diagnósticos de wellness, senão usar de nutri
      if (profissao === 'wellness') {
        diagnosticos = desafio7DiasDiagnosticosWellness
      } else {
        diagnosticos = desafio7DiasDiagnosticos
      }
      break
    case 'template-desafio-21dias':
    case 'desafio-21-dias':
      // Se for wellness, usar diagnósticos de wellness, senão usar de nutri
      if (profissao === 'wellness') {
        diagnosticos = desafio21DiasDiagnosticosWellness
      } else {
        diagnosticos = desafio21DiasDiagnosticos
      }
      break
    case 'guia-hidratacao':
      // Se for wellness, usar diagnósticos de wellness, senão usar de nutri
      if (profissao === 'wellness') {
        diagnosticos = guiaHidratacaoDiagnosticosWellness
      } else {
        diagnosticos = guiaHidratacaoDiagnosticos
      }
      break
    case 'infografico-educativo':
      diagnosticos = infograficoEducativoDiagnosticos
      break
    case 'template-receitas':
      diagnosticos = receitasDiagnosticos
      break
    case 'cardapio-detox':
      diagnosticos = cardapioDetoxDiagnosticos
      break
    case 'template-avaliacao-inicial':
      diagnosticos = avaliacaoInicialDiagnosticos
      break
    case 'formulario-recomendacao':
      diagnosticos = formularioRecomendacaoDiagnosticos
      break
    case 'template-story-interativo':
      diagnosticos = storyInterativoDiagnosticos
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
// GUIA NUTRACÊUTICO
// ============================================
export const guiaNutraceuticoDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    baixoInteresse: {
      diagnostico: '💊 DIAGNÓSTICO: Seu interesse em nutracêuticos precisa ser despertado com informações e orientações personalizadas',
      causaRaiz: '🔍 CAUSA RAIZ: Falta de conhecimento sobre benefícios dos nutracêuticos e alimentos funcionais. Estudos mostram que 65% das pessoas com baixo interesse em nutracêuticos desconhecem como essas substâncias podem melhorar saúde preventiva. Uma avaliação nutricional identifica exatamente quais nutracêuticos são mais relevantes para seu perfil e como introduzi-los gradualmente',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Comece aprendendo sobre nutracêuticos básicos (multivitamínicos, ômega-3, probióticos). Busque avaliação nutricional para receber orientações personalizadas sobre quais são mais adequados para você',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de introdução gradual com nutracêuticos essenciais, priorizando alimentos funcionais e suplementação básica quando necessário, ajustado conforme sua resposta individual',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade de suplementos só é definida após avaliação completa. Multivitamínico, ômega-3, probióticos e vitamina D costumam ser considerados para iniciantes, mas sempre de acordo com a individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Foque em alimentos funcionais básicos (frutas, vegetais, oleaginosas) e evite processados. Um plano personalizado ajuda a integrar nutracêuticos naturais de forma gradual e segura',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu interesse em nutracêuticos está começando — descubra em minutos como eles podem transformar sua saúde preventiva com orientações personalizadas.'
    },
    interesseModerado: {
      diagnostico: '💊 DIAGNÓSTICO: Seu interesse em nutracêuticos está moderado, precisa de aprofundamento estratégico',
      causaRaiz: '🔍 CAUSA RAIZ: Interesse básico presente, mas falta conhecimento especializado sobre uso direcionado de nutracêuticos. Pesquisas indicam que aprofundamento estratégico pode aumentar eficácia preventiva em até 40%. Uma análise nutricional identifica exatamente quais nutracêuticos são mais eficazes para seu perfil específico',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Aprofunde uso de nutracêuticos específicos. Considere avaliação nutricional para identificar quais nutracêuticos direcionados podem potencializar seus resultados preventivos',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de aprofundamento com nutracêuticos direcionados, priorizando suplementação estratégica e alimentos funcionais específicos, ajustado conforme seu perfil metabólico',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você se beneficia de nutracêuticos específicos. Multivitamínico, ômega-3, magnésio, probióticos e antioxidantes costumam ser considerados, mas a combinação é personalizada após análise do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Melhore qualidade dos alimentos e adicione superalimentos funcionais de forma estratégica. Um plano otimizado considera combinações específicas para maximizar benefícios conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Esse é o primeiro passo. O próximo é descobrir como nutracêuticos direcionados podem potencializar ainda mais sua saúde preventiva com estratégias personalizadas.'
    },
    altoInteresse: {
      diagnostico: '💊 DIAGNÓSTICO: Excelente interesse em nutracêuticos! Mantenha padrão atual e evolua para estratégias de precisão',
      causaRaiz: '🔍 CAUSA RAIZ: Alto interesse em nutracêuticos e conhecimento básico estabelecido permite foco em estratégias avançadas de precisão. Pesquisas mostram que protocolos nutracêuticos personalizados podem potencializar resultados preventivos em até 50%. Uma avaliação nutricional identifica oportunidades específicas de otimização para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha interesse atual e evolua para nutracêuticos de precisão. Considere avaliação nutricional avançada para protocolo personalizado que maximiza resultados preventivos',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de evolução com nutracêuticos especializados, priorizando estratégias de precisão e combinações sinérgicas, personalizado conforme seu perfil metabólico e objetivos',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação avançada identifica se você se beneficia de protocolo nutracêutico especializado. Multivitamínico, ômega-3, antioxidantes, adaptógenos e probióticos podem ser considerados em combinações estratégicas, sempre personalizado conforme sua necessidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha padrão atual, foque em alimentos funcionais e densidade nutricional premium. Um plano especializado considera estratégias avançadas para maximizar benefícios conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu interesse atual é um ótimo ponto de partida. Descubra como estratégias nutracêuticas de precisão podem potencializar ainda mais sua saúde preventiva.'
    }
  }
}

// ============================================
// GUIA PROTEICO
// ============================================
export const guiaProteicoDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    baixaProteina: {
      diagnostico: '🥩 DIAGNÓSTICO: Seu consumo de proteína está abaixo do recomendado, o que pode afetar massa muscular, recuperação e saúde geral',
      causaRaiz: '🔍 CAUSA RAIZ: Ingestão insuficiente de alimentos proteicos ou planejamento inadequado das refeições. Estudos indicam que consumo abaixo de 0.8g/kg pode comprometer síntese proteica e recuperação muscular. Uma avaliação nutricional identifica exatamente qual é sua necessidade real e como alcançá-la',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Aumente proteínas em todas as refeições principais. Busque avaliação nutricional para um plano personalizado que distribua proteína ao longo do dia de forma estratégica',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo proteico inicial com 1.2-1.6g/kg de peso corporal, distribuído em 4-5 refeições, ajustado conforme sua resposta individual',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Whey protein pode ser considerado para facilitar alcance da meta proteica, mas sempre de acordo com a individualidade biológica e em doses adequadas',
      alimentacao: '🍎 ALIMENTAÇÃO: Aumente carnes magras, ovos, leguminosas e laticínios de forma estratégica. Um plano personalizado ajusta quantidades e combinações ideais para você',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu corpo precisa de proteína adequada para resultados — descubra em minutos como otimizar sua ingestão proteica com um plano personalizado.'
    },
    proteinaModerada: {
      diagnostico: '🥩 DIAGNÓSTICO: Seu consumo de proteína está adequado, mantenha o padrão e considere otimizações estratégicas',
      causaRaiz: '🔍 CAUSA RAIZ: Boa distribuição proteica ao longo do dia estabelecida. Pesquisas mostram que otimizações de timing podem aumentar síntese proteica em até 25%. Uma análise nutricional identifica oportunidades específicas para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha consumo atual e otimize timing das refeições proteicas. Considere avaliação para identificar oportunidades de melhoria na distribuição e qualidade',
      plano7Dias: '📅 PLANO 7 DIAS: Manutenção com distribuição equilibrada e otimização de qualidade, ajustada conforme seu perfil metabólico e objetivos pessoais',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação preventiva identifica se você se beneficia de suporte adicional. Multivitamínico e ômega-3 costumam ser considerados, mas apenas após análise do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha padrão atual com foco em qualidade proteica. Um plano otimizado considera combinações específicas para maximizar absorção conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu consumo proteico está adequado. Descubra como estratégias avançadas de timing podem potencializar ainda mais seus resultados.'
    },
    altaProteina: {
      diagnostico: '🥩 DIAGNÓSTICO: Excelente consumo de proteína! Ideal para atletas e pessoas ativas. Mantenha padrão atual e otimize absorção',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo adequado para alta performance e recuperação. Para pessoas ativas, consumo acima de 1.2g/kg é adequado quando acompanhado de distribuição estratégica. Uma avaliação nutricional identifica se está dentro da faixa ideal e como otimizar timing',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Continue padrão atual e otimize absorção e timing, especialmente em períodos de maior demanda. Considere avaliação para identificar necessidades específicas',
      plano7Dias: '📅 PLANO 7 DIAS: Manutenção com estratégias de timing otimizado e qualidade proteica premium, ajustada conforme seu perfil de atividade',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você se beneficia de suporte adicional para performance. Creatina e aminoácidos podem ser considerados, mas sempre de acordo com a individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha padrão atual com foco em variedade proteica e qualidade. Um plano especializado considera estratégias avançadas para maximizar benefícios conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Excelente! Seu consumo proteico está otimizado. Descubra como estratégias avançadas de timing e absorção podem potencializar ainda mais sua performance.'
    }
  }
}

// ============================================
// TABELA COMPARATIVA
// ============================================
export const tabelaComparativaDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    comparacaoBasica: {
      diagnostico: '📊 DIAGNÓSTICO: Você precisa de comparação básica de produtos essenciais para fazer escolhas informadas',
      causaRaiz: '🔍 CAUSA RAIZ: Necessidade de entender diferenças entre produtos básicos e essenciais. Pesquisas mostram que comparações estruturadas aumentam a probabilidade de escolhas adequadas em até 60%. Uma avaliação nutricional identifica exatamente quais produtos são mais relevantes para suas necessidades específicas',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Compare produtos essenciais considerando suas necessidades reais. Busque avaliação nutricional para receber orientações personalizadas sobre quais produtos comparar de acordo com seu perfil',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de comparação inicial com produtos básicos essenciais, priorizando critérios relevantes para você, ajustado conforme suas necessidades e objetivos',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Multivitamínico, ômega-3 e probióticos básicos costumam ser considerados para iniciantes, mas sempre de acordo com a individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Foque em alimentos básicos e compare opções simples. Um plano personalizado ajuda a identificar quais alimentos são mais adequados conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Sua escolha começa com comparação — descubra em minutos como produtos essenciais podem atender suas necessidades com orientações personalizadas.'
    },
    comparacaoAvancada: {
      diagnostico: '📊 DIAGNÓSTICO: Você precisa de comparação avançada de produtos especializados para otimizar suas escolhas',
      causaRaiz: '🔍 CAUSA RAIZ: Necessidade de entender diferenças entre produtos especializados e identificar melhor custo-benefício. Estudos indicam que comparações detalhadas podem aumentar eficácia de escolhas em até 45%. Uma análise nutricional identifica exatamente quais produtos especializados são mais eficazes para seu perfil',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Compare produtos especializados considerando qualidade, composição e eficácia. Considere avaliação nutricional para identificar quais produtos direcionados oferecem melhor relação custo-benefício para você',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de comparação avançada com produtos especializados, priorizando análise detalhada de critérios relevantes, ajustado conforme seu perfil metabólico e objetivos',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você se beneficia de produtos especializados. Suplementos específicos, adaptógenos e antioxidantes costumam ser considerados, mas a combinação é personalizada após análise do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Compare alimentos funcionais e superalimentos de forma estratégica. Um plano otimizado considera análises específicas para maximizar benefícios conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Esse é o primeiro passo. O próximo é descobrir como produtos especializados podem potencializar ainda mais seus resultados com comparações direcionadas.'
    },
    comparacaoPremium: {
      diagnostico: '📊 DIAGNÓSTICO: Você precisa de comparação premium de produtos de elite para máxima performance e qualidade',
      causaRaiz: '🔍 CAUSA RAIZ: Necessidade de entender diferenças entre produtos de elite e identificar opções de máxima eficácia. Pesquisas mostram que comparações premium podem resultar em escolhas que potencializam resultados em até 50%. Uma avaliação nutricional avançada identifica oportunidades específicas de otimização para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Compare produtos de elite considerando qualidade premium, composição avançada e eficácia comprovada. Considere avaliação nutricional avançada para protocolo personalizado que maximiza resultados',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de comparação premium com produtos de elite, priorizando análises detalhadas de qualidade, eficácia e sustentabilidade, personalizado conforme seu perfil metabólico e objetivos',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação avançada identifica se você se beneficia de produtos premium. Nutracêuticos, fitoquímicos e suplementos de elite podem ser considerados em combinações estratégicas, sempre personalizado conforme sua necessidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Compare alimentos orgânicos e produtos gourmet de forma estratégica. Um plano especializado considera análises avançadas para maximizar benefícios conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Sua busca por qualidade premium é um ótimo ponto de partida. Descubra como produtos de elite podem potencializar ainda mais seus resultados com comparações avançadas.'
    }
  }
}

// ============================================
// TABELA DE SUBSTITUIÇÕES
// ============================================
export const tabelaSubstituicoesDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    substituicoesBasicas: {
      diagnostico: '🔄 DIAGNÓSTICO: Você precisa de substituições básicas para alimentos comuns para melhorar sua alimentação de forma acessível',
      causaRaiz: '🔍 CAUSA RAIZ: Necessidade de alternativas simples e acessíveis para alimentos básicos. Pesquisas mostram que substituições estratégicas podem melhorar perfil nutricional em até 40%. Uma avaliação nutricional identifica exatamente quais substituições são mais relevantes para suas necessidades e rotina',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Implemente substituições básicas considerando sua rotina e preferências. Busque avaliação nutricional para receber orientações personalizadas sobre quais substituições são mais adequadas para você',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de substituições iniciais com alimentos básicos acessíveis, priorizando facilidade e praticidade, ajustado conforme suas necessidades e objetivos',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Multivitamínico, ômega-3 e probióticos básicos costumam ser considerados para iniciantes, mas sempre de acordo com a individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Foque em substituições simples e acessíveis. Um plano personalizado ajuda a identificar quais alternativas são mais adequadas conforme seu perfil e orçamento',
      proximoPasso: '🎯 PRÓXIMO PASSO: Sua alimentação começa com substituições — descubra em minutos como alternativas simples podem melhorar sua saúde com orientações personalizadas.'
    },
    substituicoesAvancadas: {
      diagnostico: '🔄 DIAGNÓSTICO: Você precisa de substituições avançadas para alimentos específicos para otimizar seu perfil nutricional',
      causaRaiz: '🔍 CAUSA RAIZ: Necessidade de alternativas especializadas para alimentos específicos e otimização nutricional. Estudos indicam que substituições avançadas podem melhorar densidade nutricional em até 55%. Uma análise nutricional identifica exatamente quais substituições especializadas são mais eficazes para seu perfil',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Implemente substituições avançadas considerando qualidade nutricional e benefícios específicos. Considere avaliação nutricional para identificar quais alternativas direcionadas oferecem melhor relação nutricional para você',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de substituições avançadas com alimentos especializados, priorizando valor nutricional e qualidade, ajustado conforme seu perfil metabólico e objetivos',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você se beneficia de produtos especializados. Suplementos específicos, adaptógenos e antioxidantes costumam ser considerados, mas a combinação é personalizada após análise do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Compare alimentos funcionais e superalimentos de forma estratégica. Um plano otimizado considera substituições específicas para maximizar benefícios conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Esse é o primeiro passo. O próximo é descobrir como substituições avançadas podem potencializar ainda mais seu perfil nutricional com alternativas direcionadas.'
    },
    substituicoesPremium: {
      diagnostico: '🔄 DIAGNÓSTICO: Você precisa de substituições premium para alimentos de elite para máxima qualidade nutricional e experiência gastronômica',
      causaRaiz: '🔍 CAUSA RAIZ: Necessidade de alternativas de elite para alimentos premium e máxima densidade nutricional. Pesquisas mostram que substituições premium podem resultar em melhorias que potencializam resultados em até 60%. Uma avaliação nutricional avançada identifica oportunidades específicas de otimização para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Implemente substituições premium considerando qualidade premium, densidade nutricional e experiência gastronômica. Considere avaliação nutricional avançada para protocolo personalizado que maximiza resultados',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de substituições premium com alimentos de elite, priorizando qualidade superior, densidade nutricional e sustentabilidade, personalizado conforme seu perfil metabólico e objetivos',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação avançada identifica se você se beneficia de produtos premium. Nutracêuticos, fitoquímicos e suplementos de elite podem ser considerados em combinações estratégicas, sempre personalizado conforme sua necessidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Compare alimentos orgânicos e produtos gourmet de forma estratégica. Um plano especializado considera substituições avançadas para maximizar benefícios conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Sua busca por qualidade premium é um ótimo ponto de partida. Descubra como substituições de elite podem potencializar ainda mais seus resultados com alternativas avançadas.'
    }
  }
}

// ============================================
// TABELA DE SINTOMAS
// ============================================
export const tabelaSintomasDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    sintomasLeves: {
      diagnostico: '🩺 DIAGNÓSTICO: Você apresenta sintomas leves que podem estar relacionados a desequilíbrios nutricionais e precisam de correção adequada',
      causaRaiz: '🔍 CAUSA RAIZ: Desequilíbrios nutricionais leves podem estar causando sintomas específicos. Estudos mostram que 65% dos sintomas leves relacionados à alimentação podem ser corrigidos com ajustes nutricionais adequados. Uma avaliação nutricional identifica exatamente quais desequilíbrios estão presentes e como corrigi-los',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Implemente correções nutricionais estratégicas considerando os sintomas apresentados. Busque avaliação nutricional para receber orientações personalizadas sobre quais ajustes são mais adequados para você',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de correção nutricional inicial para sintomas leves, priorizando alimentos específicos e ajustes direcionados, conforme suas necessidades e resposta individual',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Multivitamínico, probióticos e ômega-3 básicos costumam ser considerados para correção de sintomas leves, mas sempre de acordo com a individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Foque em alimentos específicos para correção dos sintomas apresentados. Um plano personalizado ajuda a identificar quais alimentos são mais adequados conforme seu perfil e sintomas',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seus sintomas já deram o primeiro sinal — descubra em minutos como correções nutricionais adequadas podem aliviá-los com orientações personalizadas.'
    },
    sintomasModerados: {
      diagnostico: '🩺 DIAGNÓSTICO: Você apresenta sintomas moderados que requerem intervenção nutricional específica e acompanhamento adequado',
      causaRaiz: '🔍 CAUSA RAIZ: Desequilíbrios nutricionais moderados podem estar causando sintomas persistentes e mais intensos. Pesquisas indicam que intervenções nutricionais direcionadas podem reduzir sintomas moderados em até 50% quando adequadamente implementadas. Uma avaliação nutricional identifica exatamente quais desequilíbrios específicos estão presentes e como corrigi-los',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Implemente protocolo nutricional específico considerando os sintomas apresentados. Busque avaliação nutricional para receber um plano personalizado que atenda suas necessidades específicas com acompanhamento adequado',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de correção nutricional específico para sintomas moderados, priorizando intervenções direcionadas e alimentos funcionais estratégicos, com ajustes conforme sua resposta individual',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação completa identifica quais suplementos são adequados para seu caso. Suplementos específicos, probióticos e antioxidantes costumam ser considerados para sintomas moderados, mas a combinação é personalizada após análise detalhada do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Foque em alimentos funcionais e superalimentos direcionados para correção dos sintomas específicos. Um plano otimizado considera intervenções específicas para maximizar resultados conforme seu perfil e sintomas',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seus sintomas estão pedindo atenção — e é totalmente possível aliviá-los com um protocolo nutricional personalizado e adequado.'
    },
    sintomasGraves: {
      diagnostico: '🩺 DIAGNÓSTICO: Você apresenta sintomas graves que requerem intervenção nutricional intensiva e acompanhamento profissional imediato',
      causaRaiz: '🔍 CAUSA RAIZ: Desequilíbrios nutricionais graves podem estar causando sintomas severos e persistentes. Estudos mostram que intervenções nutricionais intensivas e bem estruturadas podem resultar em melhorias significativas quando implementadas com acompanhamento adequado. Uma avaliação nutricional completa identifica exatamente quais desequilíbrios graves estão presentes e estratégias para reverter com segurança',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Busque acompanhamento profissional imediato para receber um protocolo nutricional intensivo adequado ao seu perfil. Evite abordagens genéricas — sintomas graves requerem estratégia específica e acompanhamento próximo',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de correção nutricional intensivo para sintomas graves, priorizando intervenções direcionadas e alimentos específicos, com acompanhamento para ajustes conforme sua resposta individual e necessidade metabólica',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação completa identifica quais suplementos são adequados para seu caso específico. Suplementos direcionados, adaptógenos e antioxidantes podem ser considerados em protocolos intensivos, mas sempre de acordo com a individualidade biológica e sob acompanhamento profissional',
      alimentacao: '🍎 ALIMENTAÇÃO: Protocolo alimentar específico e intensivo, totalmente personalizado, considerando suas necessidades metabólicas e sintomas específicos, sob acompanhamento profissional',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seus sintomas precisam de cuidado profissional agora — e é totalmente possível melhorá-los com um protocolo nutricional estruturado e acompanhamento adequado.'
    }
  }
}

// ============================================
// PLANO ALIMENTAR BASE
// ============================================
export const planoAlimentarBaseDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    planoBasico: {
      diagnostico: '📅 DIAGNÓSTICO: Você precisa de um plano alimentar básico equilibrado para estabelecer uma base nutricional adequada',
      causaRaiz: '🔍 CAUSA RAIZ: Necessidade de estrutura alimentar básica e equilibrada para iniciar uma jornada nutricional adequada. Estudos mostram que planos alimentares equilibrados podem melhorar indicadores de saúde em até 45% quando seguidos consistentemente. Uma avaliação nutricional identifica exatamente quais são suas necessidades básicas e como estruturar seu plano alimentar adequadamente',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Implemente plano alimentar básico considerando sua rotina e preferências. Busque avaliação nutricional para receber um plano personalizado que atenda suas necessidades básicas com estrutura adequada',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de alimentação equilibrada básica, priorizando alimentos básicos e tradicionais, ajustado conforme suas necessidades e disponibilidade',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Multivitamínico, ômega-3 e probióticos básicos costumam ser considerados para iniciantes, mas sempre de acordo com a individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Foque em alimentos básicos e equilibrados que forneçam nutrientes essenciais. Um plano personalizado ajuda a identificar quais alimentos são mais adequados conforme seu perfil e rotina',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu plano alimentar começa com uma base sólida — descubra em minutos como estrutura alimentar adequada pode melhorar sua saúde com orientações personalizadas.'
    },
    planoAvancado: {
      diagnostico: '📅 DIAGNÓSTICO: Você precisa de um plano alimentar avançado especializado para otimizar seus resultados nutricionais',
      causaRaiz: '🔍 CAUSA RAIZ: Necessidade de estrutura alimentar especializada e avançada para resultados otimizados. Pesquisas indicam que planos alimentares especializados podem melhorar performance e resultados em até 60% quando adequadamente implementados. Uma avaliação nutricional identifica exatamente quais são suas necessidades específicas e como estruturar seu plano alimentar para máxima eficácia',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Implemente plano alimentar avançado considerando seus objetivos e necessidades específicas. Busque avaliação nutricional para receber um plano personalizado que maximize seus resultados com estratégias direcionadas',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de alimentação especializada avançada, priorizando alimentos funcionais e estratégias nutricionais específicas, ajustado conforme seu perfil metabólico e objetivos',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação completa identifica quais suplementos são adequados para seu caso. Suplementos específicos, adaptógenos e antioxidantes costumam ser considerados, mas a combinação é personalizada após análise detalhada do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Foque em alimentos funcionais e superalimentos direcionados aos seus objetivos específicos. Um plano otimizado considera estratégias nutricionais avançadas para maximizar resultados conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Esse é o primeiro passo. O próximo é descobrir como um plano alimentar especializado pode potencializar ainda mais seus resultados com estratégias direcionadas.'
    },
    planoPremium: {
      diagnostico: '📅 DIAGNÓSTICO: Você precisa de um plano alimentar premium de elite para máxima qualidade nutricional e resultados superiores',
      causaRaiz: '🔍 CAUSA RAIZ: Necessidade de estrutura alimentar de elite e premium para máxima qualidade nutricional e resultados superiores. Estudos mostram que planos alimentares premium podem resultar em melhorias que potencializam resultados em até 70%. Uma avaliação nutricional avançada identifica oportunidades específicas de otimização para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Implemente plano alimentar premium considerando qualidade superior e densidade nutricional. Considere avaliação nutricional avançada para protocolo personalizado que maximiza resultados com estratégias de elite',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de alimentação de elite premium, priorizando alimentos orgânicos, qualidade superior e estratégias nutricionais avançadas, personalizado conforme seu perfil metabólico e objetivos',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação avançada identifica se você se beneficia de produtos premium. Nutracêuticos, fitoquímicos e suplementos de elite podem ser considerados em combinações estratégicas, sempre personalizado conforme sua necessidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Foque em alimentos orgânicos e produtos gourmet de qualidade superior. Um plano especializado considera estratégias nutricionais de elite para maximizar benefícios conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Sua busca por qualidade premium é um ótimo ponto de partida. Descubra como um plano alimentar de elite pode potencializar ainda mais seus resultados com estratégias avançadas.'
    }
  }
}

// ============================================
// RASTREADOR ALIMENTAR
// ============================================
export const rastreadorAlimentarDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    rastreamentoBasico: {
      diagnostico: '📈 DIAGNÓSTICO: Você precisa de rastreamento básico para identificar padrões alimentares e estabelecer consciência nutricional',
      causaRaiz: '🔍 CAUSA RAIZ: Falta de consciência sobre consumo alimentar diário pode estar afetando seus resultados nutricionais. Estudos mostram que pessoas que rastreiam alimentação têm 30% mais sucesso em alcançar objetivos nutricionais quando comparadas àquelas que não fazem acompanhamento. Uma avaliação nutricional identifica exatamente quais padrões alimentares precisam ser identificados e como otimizá-los',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Comece a rastrear sua alimentação diariamente por pelo menos 30 dias. Busque avaliação nutricional para receber orientações sobre o que observar e como interpretar os padrões identificados durante o rastreamento',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de rastreamento inicial com registro básico de alimentos e horários, priorizando identificação de padrões simples, ajustado conforme suas necessidades e rotina',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa baseada nos padrões identificados pelo rastreamento. Multivitamínico, ômega-3 e probióticos básicos costumam ser considerados quando há padrões de carências, mas sempre de acordo com a individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Foque em rastrear padrões básicos como frequência de refeições, horários e tipos de alimentos. Um plano personalizado ajuda a interpretar os dados coletados e identificar quais ajustes são mais relevantes conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu rastreamento começa com consciência — descubra em minutos como identificar padrões alimentares pode transformar sua relação com a nutrição com orientações personalizadas.'
    },
    rastreamentoModerado: {
      diagnostico: '📈 DIAGNÓSTICO: Você precisa de rastreamento moderado para identificar padrões alimentares intermediários e otimizar seus resultados nutricionais',
      causaRaiz: '🔍 CAUSA RAIZ: Padrões alimentares intermediários podem estar impactando seus resultados nutricionais sem você perceber. Pesquisas indicam que rastreamento detalhado de macronutrientes e horários pode melhorar resultados nutricionais em até 40% quando adequadamente implementado. Uma análise nutricional identifica exatamente quais padrões específicos são mais relevantes para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha rastreamento básico e adicione informações sobre macronutrientes e horários das refeições. Considere avaliação nutricional para aprender a interpretar padrões intermediários e identificar oportunidades de otimização',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de rastreamento moderado com registro de macronutrientes e horários, priorizando identificação de padrões intermediários, ajustado conforme seu perfil metabólico e objetivos',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica quais suplementos são adequados baseados nos padrões identificados. Suplementos específicos e probióticos costumam ser considerados, mas a combinação é personalizada após análise dos dados do seu rastreamento',
      alimentacao: '🍎 ALIMENTAÇÃO: Compare padrões de consumo e identifique oportunidades de otimização. Um plano otimizado considera os dados coletados para maximizar resultados conforme seu perfil e padrões identificados',
      proximoPasso: '🎯 PRÓXIMO PASSO: Esse é o primeiro passo. O próximo é descobrir como rastreamento moderado pode identificar padrões que fazem a diferença nos seus resultados nutricionais.'
    },
    rastreamentoAvancado: {
      diagnostico: '📈 DIAGNÓSTICO: Você precisa de rastreamento avançado para identificar padrões complexos e otimização nutricional estratégica',
      causaRaiz: '🔍 CAUSA RAIZ: Padrões alimentares complexos requerem rastreamento detalhado para otimização eficaz. Estudos mostram que rastreamento avançado de macronutrientes, micronutrientes e horários pode resultar em melhorias que potencializam resultados em até 55%. Uma avaliação nutricional avançada identifica oportunidades específicas de otimização baseadas em padrões complexos',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Implemente rastreamento avançado com registro detalhado de macronutrientes, micronutrientes e timing nutricional. Considere avaliação nutricional avançada para interpretação profissional dos padrões complexos identificados',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de rastreamento avançado com registro detalhado de nutrientes e timing, priorizando identificação de padrões complexos e oportunidades de otimização, personalizado conforme seu perfil metabólico',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação avançada identifica se você se beneficia de suplementos direcionados baseados nos padrões complexos. Suplementos específicos, adaptógenos e antioxidantes podem ser considerados em combinações estratégicas, sempre personalizado conforme sua necessidade biológica e dados do rastreamento',
      alimentacao: '🍎 ALIMENTAÇÃO: Compare padrões alimentares complexos e identifique estratégias de otimização avançadas. Um plano especializado considera os dados detalhados para maximizar benefícios conforme seu perfil e padrões identificados',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu comprometimento com rastreamento avançado é um ótimo ponto de partida. Descubra como padrões complexos podem ser otimizados com interpretação profissional e estratégias direcionadas.'
    }
  }
}

// ============================================
// DIÁRIO ALIMENTAR
// ============================================
export const diarioAlimentarDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    diarioBasico: {
      diagnostico: '📝 DIAGNÓSTICO: Você precisa de um diário alimentar básico para registrar hábitos alimentares e conexões emocionais com a comida',
      causaRaiz: '🔍 CAUSA RAIZ: Falta de registro de hábitos alimentares e conexões emocionais pode estar afetando sua relação com a comida. Estudos mostram que pessoas que registram alimentos e sentimentos têm 35% mais sucesso em identificar padrões emocionais relacionados à alimentação. Uma avaliação nutricional identifica exatamente quais padrões emocionais e alimentares precisam ser trabalhados',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Comece a registrar sua alimentação e sentimentos relacionados diariamente por pelo menos 30 dias. Busque avaliação nutricional para receber orientações sobre como interpretar as conexões entre emoções e alimentação identificadas no diário',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de registro inicial com diário básico de alimentos e sentimentos, priorizando identificação de padrões simples entre emoção e comida, ajustado conforme suas necessidades e rotina',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa baseada nos padrões identificados pelo diário. Multivitamínico, ômega-3 e probióticos básicos costumam ser considerados quando há padrões de carências nutricionais relacionadas, mas sempre de acordo com a individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Foque em registrar padrões básicos como tipos de alimentos consumidos e sentimentos associados. Um plano personalizado ajuda a interpretar os dados coletados e identificar quais ajustes são mais relevantes conforme seu perfil e padrões emocionais',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu diário alimentar começa com autoconsciência — descubra em minutos como registrar alimentos e sentimentos pode transformar sua relação com a comida com orientações personalizadas.'
    },
    diarioModerado: {
      diagnostico: '📝 DIAGNÓSTICO: Você precisa de um diário alimentar moderado para registrar hábitos detalhados e conexões emocionais intermediárias',
      causaRaiz: '🔍 CAUSA RAIZ: Padrões emocionais intermediários relacionados à alimentação podem estar impactando seus resultados nutricionais sem você perceber. Pesquisas indicam que registro detalhado de alimentos, horários e sentimentos pode melhorar compreensão de padrões emocionais-alimentares em até 45% quando adequadamente implementado. Uma análise nutricional identifica exatamente quais padrões específicos são mais relevantes para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha registro básico e adicione informações sobre horários, situações e sentimentos específicos. Considere avaliação nutricional para aprender a interpretar padrões emocionais intermediários e identificar oportunidades de transformação da relação com a comida',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de registro moderado com diário detalhado de alimentos, horários e sentimentos, priorizando identificação de padrões emocionais intermediários, ajustado conforme seu perfil metabólico e objetivos',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica quais suplementos são adequados baseados nos padrões emocionais-alimentares identificados. Suplementos específicos e probióticos costumam ser considerados quando há desequilíbrios, mas a combinação é personalizada após análise dos dados do seu diário',
      alimentacao: '🍎 ALIMENTAÇÃO: Compare padrões de consumo e sentimentos para identificar oportunidades de transformação. Um plano otimizado considera os dados coletados sobre conexões emocionais-alimentares para maximizar resultados conforme seu perfil e padrões identificados',
      proximoPasso: '🎯 PRÓXIMO PASSO: Esse é o primeiro passo. O próximo é descobrir como diário moderado pode identificar padrões emocionais que fazem a diferença nos seus resultados nutricionais e bem-estar.'
    },
    diarioAvancado: {
      diagnostico: '📝 DIAGNÓSTICO: Você precisa de um diário alimentar avançado para registro profissional de hábitos complexos e conexões emocionais profundas',
      causaRaiz: '🔍 CAUSA RAIZ: Padrões emocionais complexos relacionados à alimentação requerem registro detalhado para transformação eficaz. Estudos mostram que registro avançado de alimentos, sentimentos, situações e timing pode resultar em melhorias que potencializam transformação da relação com comida em até 60%. Uma avaliação nutricional avançada identifica oportunidades específicas de transformação baseadas em padrões emocionais-alimentares complexos',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Implemente diário avançado com registro detalhado de alimentos, sentimentos, situações e timing nutricional. Considere avaliação nutricional avançada para interpretação profissional dos padrões emocionais complexos identificados',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de registro avançado com diário detalhado de nutrientes, timing, sentimentos e situações, priorizando identificação de padrões emocionais complexos e oportunidades de transformação, personalizado conforme seu perfil metabólico',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação avançada identifica se você se beneficia de suplementos direcionados baseados nos padrões emocionais-alimentares complexos. Suplementos específicos, adaptógenos e antioxidantes podem ser considerados em combinações estratégicas, sempre personalizado conforme sua necessidade biológica e dados do diário',
      alimentacao: '🍎 ALIMENTAÇÃO: Compare padrões emocionais-alimentares complexos e identifique estratégias de transformação avançadas. Um plano especializado considera os dados detalhados sobre conexões emocionais-comida para maximizar transformação conforme seu perfil e padrões identificados',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu comprometimento com diário avançado é um ótimo ponto de partida. Descubra como padrões emocionais complexos podem ser transformados com interpretação profissional e estratégias direcionadas de relação com a comida.'
    }
  }
}

// ============================================
// TABELA DE METAS SEMANAIS
// ============================================
export const tabelaMetasSemanaisDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    metasBasicas: {
      diagnostico: '🎯 DIAGNÓSTICO: Você está no nível inicial de metas — comece com poucas metas claras e alcançáveis para construir consistência',
      causaRaiz: '🔍 CAUSA RAIZ: Excesso de metas ou falta de clareza reduz aderência. Evidências mostram que 3-5 metas simples por semana com critérios claros aumentam a consistência em até 40%. Uma avaliação nutricional identifica quais áreas (água, sono, movimento, proteína, vegetais) trazem maior impacto para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Defina 3 metas simples para esta semana (ex.: beber 2L/dia, dormir 7h, 20min de caminhada). Revise no domingo e ajuste. Considere avaliação para escolher metas com melhor relação esforço/resultado para o seu perfil',
      plano7Dias: '📅 PLANO 7 DIAS: Inicie com metas simples e mensuráveis: Água, Sono, Passos/Movimento. Faça checagens diárias e uma revisão semanal para ajustes graduais',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação. Multivitamínico e ômega-3 podem ser considerados em alguns casos, mas apenas após análise individual',
      alimentacao: '🍎 ALIMENTAÇÃO: Introduza metas de base como 2 porções de vegetais/dia e proteína em 2 refeições. Um plano personalizado ajusta quantidades e combinações conforme sua rotina',
      proximoPasso: '🎯 PRÓXIMO PASSO: Comece pequeno, vença sempre. Em 7 dias você verá padrões claros — personalize as próximas metas para acelerar seus resultados com segurança.'
    },
    metasIntermediarias: {
      diagnostico: '🎯 DIAGNÓSTICO: Você está pronto para metas intermediárias — evolua quantidade/qualidade e adicione consistência semanal',
      causaRaiz: '🔍 CAUSA RAIZ: Sem progressão planejada, os resultados estagnam. Pesquisas mostram que evolução de 10–20% nas metas semanais mantém motivação e progresso. Uma avaliação identifica quais metas merecem progressão primeiro para maximizar resultados',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha 3 metas de base e adicione 1–2 metas de performance (ex.: +1 porção de vegetais/dia, +10g proteína/refeição, +1 treino/semana). Faça revisão com métricas simples',
      plano7Dias: '📅 PLANO 7 DIAS: Estruture 5 metas: 3 de base + 2 de evolução (qualidade e frequência). Use checkboxes diários e score semanal para medir aderência',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se suporte proteico, fibras ou probióticos podem auxiliar. Definição e dosagens são sempre personalizadas',
      alimentacao: '🍎 ALIMENTAÇÃO: Eleve qualidade: 3 porções de vegetais/dia, proteína em 3–4 refeições, carboidratos complexos no pré/pós esforço. Personalização ajusta horários e combinações',
      proximoPasso: '🎯 PRÓXIMO PASSO: Você já construiu base — agora é hora de evoluir com estratégia. Defina metas com progressão inteligente e acompanhe seus números.'
    },
    metasAvancadas: {
      diagnostico: '🎯 DIAGNÓSTICO: Você está pronto para metas avançadas — consolide hábitos com metas de performance e refinamento',
      causaRaiz: '🔍 CAUSA RAIZ: Em estágios avançados, ganhos vêm de refinamentos (timing, distribuição, qualidade). Evidências indicam que metas avançadas personalizadas mantêm aderência de longo prazo. Uma avaliação avançada identifica alavancas de maior impacto',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Estabeleça metas de alto impacto com métricas claras (ex.: 30g de proteína no café 6/7 dias, 7–9 porções de vegetais/dia na semana, 4 treinos estruturados). Registre resultados objetivos (energia, sono, composição)',
      plano7Dias: '📅 PLANO 7 DIAS: 6–7 metas com foco em qualidade, timing e distribuição. Revisão com indicadores (sono, energia, recuperação, fome/saciedade) e ajustes finos',
      suplementacao: '💊 SUPLEMENTAÇÃO: Avaliação avançada define protocolos específicos (p. ex., creatina, ômega-3, probióticos, magnésio), sempre conforme objetivo e resposta individual',
      alimentacao: '🍎 ALIMENTAÇÃO: Refinamentos: proteína alvo por refeição, distribuição de carboidratos ao redor de treinos, rotatividade de vegetais e fontes integrais. Personalização ajusta conforme resposta',
      proximoPasso: '🎯 PRÓXIMO PASSO: Você está em modo performance. Com ajustes finos personalizados, seus resultados podem avançar de forma consistente e sustentável.'
    }
  }
}

// ============================================
// DESAFIO 7 DIAS
// ============================================
export const desafio7DiasDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    prontoParaResultadosRapidos: {
      diagnostico: '⚡ DIAGNÓSTICO: Você está pronto para resultados rápidos e visíveis em apenas 7 dias — e temos o desafio perfeito para você',
      causaRaiz: '🔍 CAUSA RAIZ: Pesquisas mostram que desafios de 7 dias com acompanhamento personalizado têm 70% mais sucesso em criar resultados visíveis quando comparados a tentativas sem estrutura. Com suporte especializado e produtos de qualidade, você terá tudo que precisa para ver transformações reais em apenas uma semana',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Inscreva-se agora no Desafio 7 Dias e comece sua transformação hoje mesmo. Você terá acompanhamento personalizado, plano estruturado e suporte completo para garantir resultados rápidos e visíveis',
      plano7Dias: '📅 PLANO 7 DIAS: Uma semana intensa e estruturada — Dias 1-2 (Foco e Início), Dias 3-4 (Intensificação), Dias 5-6 (Consolidação), Dia 7 (Resultados e Próximos Passos). Com check-ins diários, ajustes personalizados e suporte contínuo para manter você no caminho certo',
      suplementacao: '💊 SUPLEMENTAÇÃO: Durante o Desafio 7 Dias, você terá acesso a produtos nutricionais de alta qualidade que facilitam seu processo e potencializam resultados. Multivitamínico, shakes nutritivos e suplementos específicos serão recomendados conforme suas necessidades individuais, sempre com acompanhamento profissional',
      alimentacao: '🍎 ALIMENTAÇÃO: Plano alimentar personalizado para seus 7 dias, com receitas práticas, orientações de porções e estratégias de combinação de alimentos. Você aprenderá a criar hábitos alimentares que vão acelerar seus resultados e preparar você para sucesso a longo prazo',
      proximoPasso: '🎯 PRÓXIMO PASSO: Você está a um clique de transformar sua vida em apenas 7 dias. Clique no botão abaixo e inscreva-se no Desafio 7 Dias. Nossa equipe vai entrar em contato para criar seu plano personalizado e te acompanhar em cada dia da sua transformação. Seus resultados começam hoje!'
    },
    altaMotivacaoParaTransformacaoRapida: {
      diagnostico: '⚡ DIAGNÓSTICO: Sua alta motivação mostra que você está pronto para resultados rápidos — o Desafio 7 Dias é perfeito para você',
      causaRaiz: '🔍 CAUSA RAIZ: Estudos mostram que pessoas com alta motivação e um plano estruturado de 7 dias têm 3x mais chances de alcançar seus objetivos quando comparadas a abordagens sem suporte. O Desafio 7 Dias oferece exatamente isso: estrutura clara, acompanhamento personalizado e produtos que facilitam seu processo. Com suporte profissional, você vai transformar sua motivação em resultados concretos rapidamente',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Não deixe sua motivação se perder. Inscreva-se agora no Desafio 7 Dias e mantenha esse impulso transformando-o em ação imediata. Você terá todo o suporte necessário para garantir resultados rápidos e visíveis',
      plano7Dias: '📅 PLANO 7 DIAS: Estrutura completa em 7 dias com metas claras para cada fase. Dias 1-2 (Estabelecimento de base), Dias 3-4 (Aceleração de resultados), Dias 5-6 (Consolidação), Dia 7 (Avaliação e próximos passos). Com acompanhamento diário e ajustes conforme seu progresso',
      suplementacao: '💊 SUPLEMENTAÇÃO: Durante o desafio, você terá acesso a suplementos nutricionais de alta qualidade que vão potencializar seus resultados em apenas 7 dias. Cada produto é escolhido com base nas suas necessidades específicas, sempre com orientação profissional para maximizar seus ganhos rapidamente',
      alimentacao: '🍎 ALIMENTAÇÃO: Plano alimentar estruturado para os 7 dias, com foco em resultados práticos e rápidos. Você vai aprender a fazer escolhas inteligentes que se tornam hábitos naturais, com receitas deliciosas e práticas para sua rotina',
      proximoPasso: '🎯 PRÓXIMO PASSO: Sua motivação é seu maior ativo. Agora é hora de transformá-la em resultados rápidos. Clique aqui e inscreva-se no Desafio 7 Dias. Você vai receber seu plano personalizado e começar sua transformação hoje mesmo. Não perca essa oportunidade!'
    },
    perfeitoParaDesafioEstruturado7Dias: {
      diagnostico: '⚡ DIAGNÓSTICO: Você precisa de estrutura e acompanhamento para resultados rápidos — o Desafio 7 Dias foi criado exatamente para pessoas como você',
      causaRaiz: '🔍 CAUSA RAIZ: Pesquisas indicam que 78% das pessoas que tentam mudanças rápidas sozinhas falham por falta de estrutura e suporte. O Desafio 7 Dias oferece acompanhamento personalizado, plano claro e produtos que facilitam seu processo. Com um profissional especializado ao seu lado, você terá suporte completo em cada etapa dos 7 dias',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Pare de tentar sozinho. Inscreva-se agora no Desafio 7 Dias e tenha o suporte que você precisa. Um profissional especializado vai te acompanhar pessoalmente, criando um plano 100% adaptado às suas necessidades e estilo de vida para resultados rápidos',
      plano7Dias: '📅 PLANO 7 DIAS: Estrutura completa com acompanhamento personalizado. Dias 1-2 (Preparação e adaptação), Dias 3-4 (Intensificação com suporte), Dias 5-6 (Consolidação), Dia 7 (Resultados e manutenção). Check-ins regulares com seu profissional para garantir que você está no caminho certo',
      suplementacao: '💊 SUPLEMENTAÇÃO: Com o Desafio 7 Dias, você terá acesso a produtos nutricionais de alta qualidade recomendados pelo seu profissional. Cada suplemento é escolhido especificamente para suas necessidades, com orientação profissional para garantir resultados seguros e efetivos em apenas 7 dias',
      alimentacao: '🍎 ALIMENTAÇÃO: Plano alimentar personalizado criado especialmente para você. Seu profissional vai te ensinar como fazer escolhas inteligentes, criar receitas práticas e estabelecer hábitos que vão acelerar seus resultados e durar muito além dos 7 dias',
      proximoPasso: '🎯 PRÓXIMO PASSO: Você não precisa fazer isso sozinho. Clique aqui e inscreva-se no Desafio 7 Dias. Um profissional especializado vai entrar em contato para criar seu plano personalizado e te acompanhar em cada dia da sua transformação. Seus resultados começam agora!'
    }
  }
}

// ============================================
// DESAFIO 21 DIAS
// ============================================
export const desafio21DiasDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    prontoParaTransformacao: {
      diagnostico: '📅 DIAGNÓSTICO: Você está pronto para uma transformação completa em 21 dias — e temos o desafio perfeito para você',
      causaRaiz: '🔍 CAUSA RAIZ: Pesquisas científicas comprovam que são necessários 21 dias para formar novos hábitos duradouros. O Desafio 21 Dias com acompanhamento personalizado tem 85% mais sucesso em criar transformações reais quando comparado a tentativas sem estrutura. Com suporte especializado e produtos de qualidade, você terá tudo que precisa para alcançar seus objetivos',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Inscreva-se agora no Desafio 21 Dias e comece sua transformação hoje mesmo. Você terá acompanhamento personalizado, plano estruturado e suporte completo para garantir seu sucesso',
      plano7Dias: '📅 PLANO 21 DIAS: Três semanas progressivas — Semana 1 (Foco e Fundação), Semana 2 (Intensificação e Ritmo), Semana 3 (Consolidação e Autonomia). Com check-ins diários, ajustes personalizados e suporte contínuo para manter você no caminho certo',
      suplementacao: '💊 SUPLEMENTAÇÃO: Durante o Desafio 21 Dias, você terá acesso a produtos nutricionais de alta qualidade que facilitam seu processo. Multivitamínico, shakes nutritivos e suplementos específicos serão recomendados conforme suas necessidades individuais, sempre com acompanhamento profissional',
      alimentacao: '🍎 ALIMENTAÇÃO: Plano alimentar personalizado para seus 21 dias, com receitas práticas, orientações de porções e estratégias de combinação de alimentos. Você aprenderá a criar hábitos alimentares que vão durar muito além dos 21 dias',
      proximoPasso: '🎯 PRÓXIMO PASSO: Você está a um clique de transformar sua vida. Clique no botão abaixo e inscreva-se no Desafio 21 Dias. Nossa equipe vai entrar em contato para criar seu plano personalizado e te acompanhar em cada etapa da sua transformação. Seus resultados começam hoje!'
    },
    altaMotivacaoParaMudanca: {
      diagnostico: '📅 DIAGNÓSTICO: Sua alta motivação mostra que você está pronto para resultados reais — o Desafio 21 Dias é perfeito para você',
      causaRaiz: '🔍 CAUSA RAIZ: Estudos mostram que pessoas com alta motivação e um plano estruturado têm 3x mais chances de alcançar seus objetivos. O Desafio 21 Dias oferece exatamente isso: estrutura clara, acompanhamento personalizado e produtos que facilitam seu processo. Com suporte profissional, você vai transformar sua motivação em resultados concretos',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Não deixe sua motivação se perder. Inscreva-se agora no Desafio 21 Dias e mantenha esse impulso transformando-o em ação imediata. Você terá todo o suporte necessário para garantir seu sucesso',
      plano7Dias: '📅 PLANO 21 DIAS: Estrutura completa em 3 semanas com metas claras para cada fase. Semana 1 (Estabelecimento de base), Semana 2 (Aceleração de resultados), Semana 3 (Consolidação de hábitos). Com acompanhamento diário e ajustes conforme seu progresso',
      suplementacao: '💊 SUPLEMENTAÇÃO: Durante o desafio, você terá acesso a suplementos nutricionais de alta qualidade que vão potencializar seus resultados. Cada produto é escolhido com base nas suas necessidades específicas, sempre com orientação profissional para maximizar seus ganhos',
      alimentacao: '🍎 ALIMENTAÇÃO: Plano alimentar estruturado para os 21 dias, com foco em resultados práticos e sustentáveis. Você vai aprender a fazer escolhas inteligentes que se tornam hábitos naturais, com receitas deliciosas e práticas para sua rotina',
      proximoPasso: '🎯 PRÓXIMO PASSO: Sua motivação é seu maior ativo. Agora é hora de transformá-la em resultados. Clique aqui e inscreva-se no Desafio 21 Dias. Você vai receber seu plano personalizado e começar sua transformação hoje mesmo. Não perca essa oportunidade!'
    },
    perfeitoParaDesafioEstruturado: {
      diagnostico: '📅 DIAGNÓSTICO: Você precisa de estrutura e acompanhamento — o Desafio 21 Dias foi criado exatamente para pessoas como você',
      causaRaiz: '🔍 CAUSA RAIZ: Pesquisas indicam que 78% das pessoas que tentam mudanças sozinhas falham por falta de estrutura e suporte. O Desafio 21 Dias oferece acompanhamento personalizado, plano claro e produtos que facilitam seu processo. Com um profissional especializado ao seu lado, você terá suporte completo em cada etapa',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Pare de tentar sozinho. Inscreva-se agora no Desafio 21 Dias e tenha o suporte que você precisa. Um profissional especializado vai te acompanhar pessoalmente, criando um plano 100% adaptado às suas necessidades e estilo de vida',
      plano7Dias: '📅 PLANO 21 DIAS: Estrutura completa com acompanhamento personalizado. Semana 1 (Preparação e adaptação), Semana 2 (Intensificação com suporte), Semana 3 (Autonomia e manutenção). Check-ins regulares com seu profissional para garantir que você está no caminho certo',
      suplementacao: '💊 SUPLEMENTAÇÃO: Com o Desafio 21 Dias, você terá acesso a produtos nutricionais de alta qualidade recomendados pelo seu profissional. Cada suplemento é escolhido especificamente para suas necessidades, com orientação profissional para garantir resultados seguros e efetivos',
      alimentacao: '🍎 ALIMENTAÇÃO: Plano alimentar personalizado criado especialmente para você. Seu profissional vai te ensinar como fazer escolhas inteligentes, criar receitas práticas e estabelecer hábitos que vão durar muito além dos 21 dias',
      proximoPasso: '🎯 PRÓXIMO PASSO: Você não precisa fazer isso sozinho. Clique aqui e inscreva-se no Desafio 21 Dias. Um profissional especializado vai entrar em contato para criar seu plano personalizado e te acompanhar em cada passo da sua transformação. Seus resultados começam agora!'
    }
  }
}

// ============================================
// FORMULÁRIO DE RECOMENDAÇÃO
// ============================================
export const formularioRecomendacaoDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    recomendacaoBasica: {
      diagnostico: '📝 DIAGNÓSTICO: Você precisa de recomendações nutricionais básicas e direcionadas para iniciar transformações e estabelecer fundamentos sólidos',
      causaRaiz: '🔍 CAUSA RAIZ: Recomendações básicas estruturadas criam base sólida para mudanças sustentáveis. Estudos mostram que pessoas que recebem recomendações nutricionais básicas direcionadas têm 65% mais sucesso em manter mudanças quando comparadas a abordagens genéricas. Recomendações básicas identificam necessidades fundamentais e criam plano de ação claro e acessível',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Receba recomendações nutricionais básicas direcionadas baseadas no seu perfil atual. Busque avaliação nutricional para receber recomendações personalizadas que se adaptam às suas necessidades fundamentais e objetivos',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de recomendações básicas com foco em mudanças fundamentais e acessíveis, ajustado conforme seu perfil atual e objetivos identificados',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após análise completa dos dados do formulário. Multivitamínico, ômega-3 e probióticos básicos podem ser considerados quando há indicação, mas sempre de acordo com a individualidade biológica identificada',
      alimentacao: '🍎 ALIMENTAÇÃO: Baseada no formulário, receba recomendações básicas sobre hábitos alimentares fundamentais. Um plano personalizado será desenvolvido após análise dos dados fornecidos',
      proximoPasso: '🎯 PRÓXIMO PASSO: Recomendações básicas são o início de transformações duradouras — descubra como orientações direcionadas podem estabelecer fundamentos sólidos para seus objetivos com orientações personalizadas.'
    },
    recomendacaoModerada: {
      diagnostico: '📝 DIAGNÓSTICO: Você precisa de recomendações nutricionais moderadas e específicas para otimizar estratégias e acelerar resultados através de abordagens direcionadas',
      causaRaiz: '🔍 CAUSA RAIZ: Com base estabelecida, recomendações moderadas com critérios específicos identificam oportunidades de otimização. Pesquisas indicam que recomendações moderadas direcionadas podem resultar em estratégias 55% mais eficazes quando comparadas a recomendações básicas genéricas. Recomendações moderadas aprofundam análise e identificam nuances importantes do seu perfil',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Receba recomendações nutricionais moderadas com estratégias específicas baseadas no seu perfil detalhado. Considere avaliação nutricional para recomendações direcionadas que potencializam resultados através de otimizações estratégicas',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de recomendações moderadas com estratégias específicas e otimizações direcionadas, ajustado conforme seu perfil detalhado e objetivos específicos',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma análise do formulário identifica necessidades específicas. Suplementos direcionados podem ser considerados após análise detalhada dos dados coletados, mas sempre com base na individualidade biológica identificada',
      alimentacao: '🍎 ALIMENTAÇÃO: Baseada no formulário detalhado, receba recomendações moderadas com estratégias de otimização alimentar específicas. Um plano direcionado será desenvolvido após análise aprofundada dos padrões identificados',
      proximoPasso: '🎯 PRÓXIMO PASSO: Recomendações moderadas revelam oportunidades — descubra como estratégias direcionadas podem otimizar seus resultados e acelerar transformações com orientações específicas.'
    },
    recomendacaoAvancada: {
      diagnostico: '📝 DIAGNÓSTICO: Você precisa de recomendações nutricionais avançadas e complexas para estratégias de otimização máxima e refinamentos especializados',
      causaRaiz: '🔍 CAUSA RAIZ: Para perfis complexos ou objetivos avançados, recomendações nutricionais avançadas com múltiplos critérios identificam fatores que não aparecem em recomendações básicas. Estudos mostram que recomendações avançadas podem resultar em estratégias 75% mais eficazes quando comparadas a recomendações básicas para perfis complexos. Recomendações avançadas fornecem visão completa e profunda para otimização máxima',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Receba recomendações nutricionais avançadas com estratégias complexas baseadas na análise profunda do seu perfil. Considere avaliação nutricional avançada para recomendações especializadas que maximizam resultados através de refinamentos e otimizações de elite',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de recomendações avançadas com estratégias complexas, refinamentos especializados e otimizações de máxima precisão, personalizado conforme seu perfil avançado e objetivos de elite',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma análise avançada do formulário identifica necessidades complexas e específicas. Protocolos personalizados de suplementação podem ser considerados após análise abrangente, sempre baseados na individualidade biológica completa identificada',
      alimentacao: '🍎 ALIMENTAÇÃO: Baseada no formulário completo, receba recomendações avançadas com estratégias sofisticadas de otimização nutricional. Um plano especializado será desenvolvido após análise completa e profunda do perfil identificado',
      proximoPasso: '🎯 PRÓXIMO PASSO: Recomendações avançadas maximizam potencial — descubra como estratégias complexas e refinamentos especializados podem transformar seus resultados com orientações de elite.'
    }
  }
}

// ============================================
// TEMPLATE DE AVALIAÇÃO INICIAL
// ============================================
export const avaliacaoInicialDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    avaliacaoBasica: {
      diagnostico: '📋 DIAGNÓSTICO: Você precisa de uma avaliação nutricional básica e completa para estabelecer base sólida de saúde e identificar necessidades fundamentais',
      causaRaiz: '🔍 CAUSA RAIZ: Avaliação inicial é fundamental para criar base de conhecimento sobre perfil nutricional, hábitos e necessidades. Estudos mostram que pessoas que passam por avaliação nutricional básica têm 70% mais sucesso em alcançar objetivos quando comparadas a abordagens sem avaliação. Uma avaliação básica identifica necessidades fundamentais e cria ponto de partida sólido',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Complete avaliação nutricional básica fornecendo informações sobre seus hábitos, objetivos e histórico de saúde. Busque avaliação profissional completa para receber diagnóstico personalizado e plano de ação específico',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de avaliação básica com foco em coleta de informações fundamentais sobre hábitos alimentares, objetivos e histórico, ajustado conforme sua situação atual',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa e análise dos dados coletados. Multivitamínico, ômega-3 e probióticos básicos podem ser considerados quando há indicação, mas sempre de acordo com a individualidade biológica identificada na avaliação',
      alimentacao: '🍎 ALIMENTAÇÃO: Baseada na avaliação inicial, identifique necessidades alimentares fundamentais. Um plano personalizado será desenvolvido após análise completa dos dados coletados na avaliação',
      proximoPasso: '🎯 PRÓXIMO PASSO: Uma avaliação completa é o primeiro passo para resultados — descubra como entender seu perfil nutricional atual pode abrir caminho para transformações duradouras com orientações personalizadas.'
    },
    avaliacaoModerada: {
      diagnostico: '📋 DIAGNÓSTICO: Você precisa de uma avaliação nutricional moderada e específica para aprofundar conhecimento sobre seu perfil e otimizar estratégias nutricionais',
      causaRaiz: '🔍 CAUSA RAIZ: Com base estabelecida, avaliação moderada com critérios específicos aprofunda análise e identifica oportunidades de otimização. Pesquisas indicam que avaliações moderadas com foco específico podem identificar necessidades que não aparecem em avaliações básicas, resultando em estratégias 50% mais eficazes. Uma avaliação moderada identifica nuances importantes do seu perfil',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Complete avaliação nutricional moderada com informações detalhadas sobre padrões alimentares, sintomas e objetivos específicos. Considere avaliação profissional moderada para diagnóstico aprofundado e estratégias direcionadas',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de avaliação moderada com coleta de informações específicas sobre hábitos, padrões e necessidades individuais, focada em identificar oportunidades de otimização',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação moderada identifica necessidades específicas. Suplementos direcionados podem ser considerados após análise detalhada dos dados coletados, mas sempre com base na individualidade biológica identificada',
      alimentacao: '🍎 ALIMENTAÇÃO: Baseada na avaliação moderada, desenvolva estratégias específicas de otimização alimentar. Um plano direcionado será desenvolvido após análise aprofundada dos padrões identificados',
      proximoPasso: '🎯 PRÓXIMO PASSO: Avaliações aprofundadas revelam oportunidades — descubra como entender nuances do seu perfil nutricional pode elevar estratégias e potencializar resultados com orientações direcionadas.'
    },
    avaliacaoAvancada: {
      diagnostico: '📋 DIAGNÓSTICO: Você precisa de uma avaliação nutricional avançada e complexa para análise profunda do perfil e estratégias de otimização máxima',
      causaRaiz: '🔍 CAUSA RAIZ: Para pessoas com necessidades complexas ou objetivos avançados, avaliação nutricional avançada com múltiplos critérios e análises profundas identifica fatores que não aparecem em avaliações básicas. Estudos mostram que avaliações avançadas podem identificar necessidades específicas que resultam em estratégias 75% mais eficazes quando comparadas a avaliações básicas. Uma avaliação avançada fornece visão completa e profunda do seu perfil',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Complete avaliação nutricional avançada com informações detalhadas, histórico completo e objetivos específicos. Considere avaliação profissional avançada para diagnóstico completo e estratégias de otimização máxima',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de avaliação avançada com coleta abrangente de informações, análises múltiplas e identificação de fatores complexos, focada em otimização máxima e estratégias personalizadas de elite',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação avançada identifica necessidades complexas e específicas. Protocolos personalizados de suplementação podem ser considerados após análise abrangente, sempre baseados na individualidade biológica completa identificada',
      alimentacao: '🍎 ALIMENTAÇÃO: Baseada na avaliação avançada, desenvolva estratégias sofisticadas de otimização nutricional. Um plano especializado será desenvolvido após análise completa e profunda do perfil identificado',
      proximoPasso: '🎯 PRÓXIMO PASSO: Avaliações avançadas revelam todo o potencial — descubra como análise profunda do seu perfil nutricional pode maximizar estratégias e transformar resultados com orientações especializadas.'
    }
  }
}

// ============================================
// SIMULADOR DE RESULTADOS
// ============================================
export const simuladorResultadosDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    resultadosBasicos: {
      diagnostico: '🔮 DIAGNÓSTICO: Você pode alcançar resultados básicos e sustentáveis através de mudanças simples e consistentes nos seus hábitos nutricionais',
      causaRaiz: '🔍 CAUSA RAIZ: Pequenas mudanças consistentes geram resultados significativos ao longo do tempo. Estudos mostram que pessoas que fazem mudanças básicas e mantêm consistência de 70% têm 80% mais sucesso em alcançar resultados duradouros quando comparadas a abordagens extremas. Simular resultados básicos ajuda a criar expectativas realistas e aumenta motivação para começar',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Visualize resultados básicos alcançáveis através de mudanças simples (ex.: beber mais água, incluir vegetais, manter horários). Busque avaliação nutricional para receber simulação personalizada de resultados baseada no seu perfil atual',
      plano7Dias: '📅 PLANO 7 DIAS: Simulação de resultados básicos com pequenas mudanças mantidas consistentemente, focadas em hábitos fundamentais, ajustado conforme sua situação atual e objetivos',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Multivitamínico, ômega-3 e probióticos básicos podem ser considerados para suporte, mas sempre de acordo com a individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Foque em resultados básicos e sustentáveis através de mudanças simples nos hábitos. Um plano personalizado identifica quais mudanças básicas geram maior impacto para seus objetivos',
      proximoPasso: '🎯 PRÓXIMO PASSO: Pequenas mudanças podem gerar grandes resultados — descubra como simular seus resultados potenciais e transformar expectativas em realidade com orientações personalizadas.'
    },
    resultadosModerados: {
      diagnostico: '🔮 DIAGNÓSTICO: Você pode alcançar resultados moderados e significativos através de mudanças estratégicas e consistência nos seus hábitos nutricionais',
      causaRaiz: '🔍 CAUSA RAIZ: Mudanças moderadas com estratégia adequada aceleram resultados quando mantidas consistentemente. Pesquisas indicam que pessoas que implementam mudanças moderadas com foco estratégico alcançam resultados 60% mais rápido quando comparadas a mudanças básicas. Simular resultados moderados ajuda a definir metas realistas e manter motivação',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Visualize resultados moderados através de mudanças estratégicas (ex.: timing nutricional, qualidade alimentar, distribuição de macronutrientes). Considere avaliação nutricional para receber simulação personalizada de resultados baseada no seu perfil',
      plano7Dias: '📅 PLANO 7 DIAS: Simulação de resultados moderados com mudanças estratégicas mantidas, focadas em otimização nutricional, ajustado conforme seu perfil atual e objetivos específicos',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você se beneficia de suporte adicional. Suplementos específicos e antioxidantes podem ser considerados, mas apenas após análise do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Eleve resultados através de mudanças estratégicas (timing, qualidade, combinações). Um plano otimizado simula resultados moderados considerando seu perfil específico',
      proximoPasso: '🎯 PRÓXIMO PASSO: Mudanças estratégicas aceleram resultados — descubra como simular seus resultados moderados e transformar metas em conquistas com orientações direcionadas.'
    },
    resultadosAvancados: {
      diagnostico: '🔮 DIAGNÓSTICO: Você pode alcançar resultados avançados e otimizados através de estratégias refinadas e consistência de alta performance nos seus hábitos nutricionais',
      causaRaiz: '🔍 CAUSA RAIZ: Estratégias avançadas com refinamentos específicos maximizam resultados para pessoas com experiência. Estudos mostram que estratégias avançadas podem potencializar resultados em até 75% quando comparadas a abordagens básicas para pessoas experientes. Simular resultados avançados ajuda a definir metas ambiciosas e manter motivação de elite',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Visualize resultados avançados através de estratégias refinadas (ex.: nutrigenômica, timing de precisão, combinações estratégicas). Considere avaliação nutricional avançada para receber simulação personalizada de resultados de elite',
      plano7Dias: '📅 PLANO 7 DIAS: Simulação de resultados avançados com estratégias refinadas e técnicas de precisão, focadas em otimização máxima, personalizado conforme seu perfil avançado e objetivos de elite',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação avançada identifica se você se beneficia de protocolos específicos. Suplementos premium, nutracêuticos e fitoquímicos podem ser considerados em combinações estratégicas, sempre personalizado conforme sua necessidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Maximize resultados através de estratégias avançadas (refinamentos de precisão, timing estratégico, combinações sinérgicas). Um plano especializado simula resultados avançados considerando seu perfil de elite',
      proximoPasso: '🎯 PRÓXIMO PASSO: Estratégias avançadas maximizam resultados — descubra como simular seus resultados de elite e transformar ambição em conquista com orientações especializadas.'
    }
  }
}

// ============================================
// CARDÁPIO DETOX
// ============================================
export const cardapioDetoxDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    detoxBasico: {
      diagnostico: '🥗 DIAGNÓSTICO: Você precisa de um cardápio detox básico e nutritivo para iniciar processo de limpeza e desintoxicação do organismo',
      causaRaiz: '🔍 CAUSA RAIZ: Exposição a toxinas ambientais e alimentares é comum no dia a dia. Estudos mostram que cardápios detox básicos focados em alimentos depurativos aumentam eliminação de toxinas em até 40% quando mantidos por 7 dias. Cardápios detox básicos criam base sólida de limpeza através de alimentos acessíveis e práticos',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Inicie cardápio detox básico por 7 dias focando em alimentos depurativos (água, chás, vegetais verdes, frutas cítricas). Busque avaliação nutricional para receber cardápio detox personalizado que se adapta ao seu perfil',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de detox básico com foco em hidratação, alimentos depurativos e eliminação de processados, ajustado conforme seu perfil e tolerância alimentar',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Multivitamínico, ômega-3 e probióticos básicos podem ser considerados para suporte durante detox, mas sempre de acordo com a individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Foque em alimentos detox básicos (vegetais verdes, frutas, água, chás depurativos) e elimine processados. Um cardápio personalizado identifica quais alimentos detox são mais eficazes para você',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu corpo pode se beneficiar de detox — descubra como um cardápio detox básico pode melhorar sua energia e bem-estar com orientações personalizadas.'
    },
    detoxModerado: {
      diagnostico: '🥗 DIAGNÓSTICO: Você precisa de um cardápio detox moderado e específico para otimizar processo de desintoxicação e limpeza profunda',
      causaRaiz: '🔍 CAUSA RAIZ: Com exposição moderada a toxinas ou sintomas leves, cardápios detox moderados com ingredientes específicos elevam eficiência de desintoxicação. Pesquisas indicam que detox moderado pode melhorar função hepática e eliminação de toxinas em até 55% quando comparado a abordagens básicas. Uma análise nutricional identifica quais estratégias detox moderadas são mais eficazes para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Implemente cardápio detox moderado por 7 dias com alimentos depurativos específicos e estratégias de desintoxicação. Considere avaliação nutricional para receber cardápio detox direcionado que potencializa resultados',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de detox moderado com alimentos funcionais depurativos, chás específicos e estratégias de limpeza, ajustado conforme seu perfil e objetivos de detox',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você se beneficia de suporte durante detox. Antioxidantes, probióticos e suplementos específicos podem ser considerados, mas apenas após análise do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Eleve qualidade com alimentos detox específicos (superalimentos depurativos, chás funcionais, vegetais crucíferos). Um cardápio otimizado considera estratégias que maximizam desintoxicação conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Esse é o primeiro passo. O próximo é descobrir como um cardápio detox moderado pode potencializar ainda mais sua limpeza e bem-estar com estratégias direcionadas.'
    },
    detoxAvancado: {
      diagnostico: '🥗 DIAGNÓSTICO: Você precisa de um cardápio detox avançado e gourmet para processo de desintoxicação profunda e otimização máxima',
      causaRaiz: '🔍 CAUSA RAIZ: Para pessoas com alta exposição a toxinas ou necessidade de detox profundo, cardápios avançados com ingredientes premium e técnicas refinadas maximizam desintoxicação. Estudos mostram que detox avançado pode melhorar função hepática e eliminação de toxinas em até 70% quando comparado a abordagens básicas. Uma avaliação nutricional identifica estratégias detox avançadas que maximizam resultados para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Implemente cardápio detox avançado por 7 dias com alimentos depurativos premium, técnicas refinadas e estratégias de limpeza profunda. Considere avaliação nutricional avançada para protocolo detox personalizado que maximiza resultados',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de detox avançado com superalimentos depurativos premium, chás funcionais especializados e estratégias de limpeza profunda, personalizado conforme seu perfil e objetivos de detox',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação avançada identifica se você se beneficia de protocolo específico durante detox. Antioxidantes premium, nutracêuticos depurativos e probióticos especializados podem ser considerados, sempre personalizado conforme sua necessidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Refinamentos avançados com alimentos detox premium (superalimentos orgânicos, chás funcionais especializados, vegetais depurativos estratégicos). Um cardápio especializado considera estratégias que maximizam desintoxicação profunda conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Você está pronto para detox profundo. Descubra como um cardápio detox avançado pode potencializar ainda mais sua limpeza e bem-estar com estratégias de elite.'
    }
  }
}

// ============================================
// TEMPLATE DE RECEITAS
// ============================================
export const receitasDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    receitasBasicas: {
      diagnostico: '👨‍🍳 DIAGNÓSTICO: Você precisa de receitas básicas e nutritivas para estabelecer hábitos culinários saudáveis de forma prática e acessível',
      causaRaiz: '🔍 CAUSA RAIZ: Iniciantes na cozinha ou pessoas com pouco tempo se beneficiam de receitas simples com poucos ingredientes. Estudos mostram que receitas básicas aumentam aderência a hábitos saudáveis em até 60% quando comparadas a receitas complexas para iniciantes. Receitas básicas criam base sólida de preparo de alimentos nutritivos e desenvolvem confiança na cozinha gradualmente',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Comece com receitas básicas de 3-5 ingredientes, preparo rápido (até 30min) e técnicas simples. Busque avaliação nutricional para receber receitas personalizadas que se adaptam ao seu nível e objetivos',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de receitas básicas com 1-2 receitas por dia, focadas em técnicas fundamentais e ingredientes acessíveis, ajustado conforme seu tempo disponível e preferências alimentares',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Multivitamínico, ômega-3 e probióticos básicos podem ser considerados quando há indicação, mas sempre de acordo com a individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Foque em receitas com ingredientes básicos e nutritivos (ovos, legumes, frutas, proteínas magras). Um plano personalizado identifica quais receitas básicas são mais adequadas para seus objetivos e preferências',
      proximoPasso: '🎯 PRÓXIMO PASSO: Receitas básicas podem transformar sua relação com a comida — descubra como preparar refeições nutritivas de forma simples com receitas personalizadas para você.'
    },
    receitasModeradas: {
      diagnostico: '👨‍🍳 DIAGNÓSTICO: Você precisa de receitas moderadas e específicas para elevar qualidade nutricional e diversificar preparações',
      causaRaiz: '🔍 CAUSA RAIZ: Com base culinária estabelecida, receitas moderadas com ingredientes específicos e técnicas intermediárias elevam qualidade nutricional. Pesquisas indicam que receitas moderadas aumentam satisfação e resultados em até 45% quando comparadas a receitas básicas para pessoas com experiência. Uma análise nutricional identifica quais receitas moderadas são mais estratégicas para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Explore receitas moderadas com 5-7 ingredientes, técnicas intermediárias e ingredientes funcionais. Considere avaliação nutricional para receber receitas direcionadas que potencializam seus objetivos',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de receitas moderadas com 2-3 receitas por semana, focadas em qualidade nutricional e variedade, ajustado conforme seu perfil e objetivos específicos',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você se beneficia de suporte adicional. Suplementos específicos e antioxidantes costumam ser considerados, mas apenas após análise do seu caso e alinhado com os ingredientes das receitas',
      alimentacao: '🍎 ALIMENTAÇÃO: Eleve qualidade e variedade com receitas moderadas usando ingredientes funcionais e superalimentos. Um plano otimizado considera receitas que maximizam benefícios nutricionais conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Esse é o primeiro passo. O próximo é descobrir como receitas moderadas podem elevar ainda mais sua qualidade nutricional com preparações direcionadas.'
    },
    receitasAvancadas: {
      diagnostico: '👨‍🍳 DIAGNÓSTICO: Excelente! Receitas avançadas e gourmet podem maximizar qualidade nutricional e satisfação com preparações sofisticadas',
      causaRaiz: '🔍 CAUSA RAIZ: Experiência culinária estabelecida permite receitas avançadas com técnicas refinadas e ingredientes premium. Estudos mostram que receitas avançadas com foco em densidade nutricional podem potencializar resultados em até 50% quando comparadas a receitas básicas para pessoas experientes. Uma avaliação nutricional identifica receitas avançadas que maximizam benefícios para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Explore receitas avançadas com técnicas refinadas, ingredientes premium e combinações estratégicas. Considere avaliação nutricional avançada para receber receitas gourmet personalizadas que maximizam resultados',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de receitas avançadas com técnicas sofisticadas, ingredientes funcionais premium e combinações estratégicas, personalizado conforme seu perfil e objetivos de elite',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação avançada identifica se você se beneficia de protocolos específicos. Suplementos premium, nutracêuticos e fitoquímicos podem ser considerados em combinações estratégicas, sempre personalizado conforme sua necessidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha padrão atual e refine com receitas avançadas usando ingredientes orgânicos, superalimentos premium e técnicas gourmet. Um plano especializado considera receitas que maximizam performance nutricional conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Sua experiência atual é um ótimo ponto de partida. Descubra como receitas avançadas podem potencializar ainda mais sua alimentação com preparações gourmet personalizadas.'
    }
  }
}

// ============================================
// INFOGRÁFICO EDUCATIVO
// ============================================
export const infograficoEducativoDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    conhecimentoBasico: {
      diagnostico: '📊 DIAGNÓSTICO: Você precisa de infográficos educativos básicos sobre nutrição para construir conhecimento fundamental e estabelecer base sólida',
      causaRaiz: '🔍 CAUSA RAIZ: Conhecimento básico em nutrição requer educação visual estruturada. Estudos mostram que aprendizado através de infográficos aumenta retenção de informação em até 65% quando comparado a texto puro. Infográficos básicos com conceitos fundamentais criam base sólida que permite evolução gradual. Uma avaliação nutricional identifica exatamente quais tópicos básicos são mais relevantes para seu perfil e objetivos',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Comece com infográficos básicos sobre macronutrientes, hidratação e alimentação saudável. Considere avaliação nutricional para receber infográficos educativos personalizados que aceleram seu aprendizado',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de educação visual com 1-2 infográficos básicos por dia, focados em conceitos fundamentais de nutrição, ajustado conforme seu ritmo de aprendizado e tópicos de maior interesse',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Multivitamínico, ômega-3 e probióticos básicos podem ser considerados quando há indicação, mas sempre de acordo com a individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Foque em aplicar conceitos básicos dos infográficos no dia a dia (ex.: identificar macronutrientes, importância da hidratação). Um plano personalizado ajuda a transformar conhecimento visual em hábitos práticos',
      proximoPasso: '🎯 PRÓXIMO PASSO: Aprenda de forma visual e eficiente — descubra como infográficos básicos podem acelerar seu conhecimento nutricional com orientações personalizadas.'
    },
    conhecimentoModerado: {
      diagnostico: '📊 DIAGNÓSTICO: Você precisa de infográficos educativos moderados sobre nutrição para aprofundar conhecimento e otimizar estratégias nutricionais',
      causaRaiz: '🔍 CAUSA RAIZ: Conhecimento moderado estabelecido permite aprofundamento através de infográficos intermediários. Pesquisas indicam que infográficos moderados com estratégias práticas aumentam aplicação de conhecimento em até 50% quando comparados a educação básica. Uma análise nutricional identifica exatamente quais tópicos intermediários são mais eficazes para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Explore infográficos moderados sobre timing nutricional, alimentos funcionais e estratégias avançadas. Considere avaliação nutricional para receber infográficos educativos direcionados que potencializam seus resultados',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de educação visual moderada com 2-3 infográficos intermediários por semana, focados em estratégias práticas e otimização, ajustado conforme seu perfil e áreas de interesse',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você se beneficia de suporte adicional. Suplementos específicos e antioxidantes costumam ser considerados, mas apenas após análise do seu caso e alinhado com os conceitos dos infográficos',
      alimentacao: '🍎 ALIMENTAÇÃO: Eleve qualidade e estratégia aplicando conceitos dos infográficos moderados (timing, combinações, alimentos funcionais). Um plano otimizado considera seu conhecimento para maximizar resultados conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Esse é o primeiro passo. O próximo é descobrir como infográficos moderados podem elevar ainda mais sua estratégia nutricional com educação visual direcionada.'
    },
    conhecimentoAvancado: {
      diagnostico: '📊 DIAGNÓSTICO: Excelente conhecimento! Infográficos educativos avançados podem aprofundar ainda mais sua expertise e manter você atualizado com ciência de ponta',
      causaRaiz: '🔍 CAUSA RAIZ: Conhecimento avançado estabelecido permite foco em infográficos especializados e ciência atualizada. Estudos mostram que profissionais com alto conhecimento se beneficiam de infográficos avançados que consolidam expertise e apresentam pesquisas recentes. Uma avaliação nutricional identifica oportunidades específicas de especialização para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Acesse infográficos avançados sobre nutrigenômica, estratégias de elite e ciência nutricional atualizada. Considere avaliação nutricional avançada para protocolo personalizado com infográficos especializados',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de educação visual avançada com infográficos especializados e pesquisas recentes, focados em refinamentos estratégicos e ciência de ponta, personalizado conforme seu perfil e áreas de expertise',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação avançada identifica se você se beneficia de protocolos específicos. Suplementos premium, nutracêuticos e fitoquímicos podem ser considerados em combinações estratégicas, sempre personalizado conforme sua necessidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha padrão atual e refine com conceitos dos infográficos avançados (nutrigenômica, estratégias de elite, alimentos funcionais premium). Um plano especializado considera seu conhecimento para maximizar performance conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu conhecimento atual é um ótimo ponto de partida. Descubra como infográficos avançados podem consolidar e expandir ainda mais sua expertise nutricional.'
    }
  }
}

// ============================================
// GUIA DE HIDRATAÇÃO
// ============================================
export const guiaHidratacaoDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    baixaHidratacao: {
      diagnostico: '💧 DIAGNÓSTICO: Você precisa de orientações para melhorar sua hidratação diária e estabelecer consumo adequado de água',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo insuficiente de líquidos pode afetar funções vitais, energia e desempenho físico. Estudos mostram que desidratação leve de 1-2% já pode reduzir performance cognitiva e física em até 30%. Uma avaliação nutricional identifica exatamente qual é sua necessidade hídrica individual e como alcançá-la gradualmente',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Aumente consumo de água gradualmente, começando com 500ml a mais por dia. Busque avaliação nutricional para receber estratégias personalizadas de hidratação adequadas ao seu perfil, atividade e clima',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de hidratação progressiva começando com base de 35ml/kg de peso, aumentando gradualmente até atingir meta adequada, com check-ins diários e ajustes conforme resposta individual',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa baseada na hidratação. Eletrólitos e sais minerais podem ser considerados para pessoas ativas ou em climas quentes, mas sempre de acordo com a individualidade biológica e em doses adequadas',
      alimentacao: '🍎 ALIMENTAÇÃO: Aumente consumo de alimentos ricos em água (frutas, vegetais, sopas) e distribua ingestão de líquidos ao longo do dia. Um plano personalizado identifica estratégias específicas para manter hidratação adequada conforme sua rotina',
      proximoPasso: '🎯 PRÓXIMO PASSO: Sua hidratação está pedindo atenção — descubra em minutos como otimizar seu consumo de água pode transformar sua energia e bem-estar com orientações personalizadas.'
    },
    hidratacaoModerada: {
      diagnostico: '💧 DIAGNÓSTICO: Sua hidratação está adequada, mas pode ser otimizada para melhorar performance e bem-estar',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo adequado de líquidos, mas otimizações estratégicas podem elevar hidratação e resultados. Pesquisas indicam que hidratação otimizada com timing adequado pode melhorar performance em até 25% quando comparada à hidratação básica. Uma análise nutricional identifica exatamente quais estratégias de hidratação são mais eficazes para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha consumo atual e otimize timing e qualidade da hidratação. Considere avaliação nutricional para identificar estratégias de hidratação direcionadas que potencializam seus resultados',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de otimização hidratacional com foco em timing estratégico (pré/durante/pós atividade), qualidade dos líquidos e balanceamento de eletrólitos, ajustado conforme seu perfil e objetivos',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você se beneficia de suporte eletrolítico estratégico. Eletrólitos específicos podem ser considerados para atividades intensas ou climas específicos, mas sempre personalizado após análise do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha padrão atual e otimize fontes de hidratação (água, chás, alimentos aquosos). Um plano otimizado considera estratégias específicas de hidratação para maximizar benefícios conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Esse é o primeiro passo. O próximo é descobrir como hidratação otimizada pode potencializar ainda mais sua performance e bem-estar com estratégias direcionadas.'
    },
    altaHidratacao: {
      diagnostico: '💧 DIAGNÓSTICO: Excelente hidratação! Mantenha padrão atual e considere refinamentos estratégicos para máxima performance',
      causaRaiz: '🔍 CAUSA RAIZ: Hidratação otimizada estabelecida permite foco em refinamentos estratégicos de timing e qualidade. Estudos mostram que hidratação de elite com estratégias avançadas pode potencializar performance e recuperação em até 35% quando comparada à hidratação básica. Uma avaliação nutricional avançada identifica oportunidades específicas de otimização para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Continue padrão atual e refine estratégias de hidratação avançadas. Considere avaliação nutricional avançada para protocolo personalizado que maximiza resultados através de hidratação de precisão',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de hidratação avançada com refinamentos de timing estratégico, balanceamento eletrolítico otimizado e hidratação direcionada para performance, personalizado conforme seu perfil metabólico e objetivos',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação avançada identifica se você se beneficia de protocolos eletrolíticos específicos. Eletrólitos direcionados e sais minerais podem ser considerados em combinações estratégicas, sempre personalizado conforme sua necessidade biológica e padrão de atividade',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha padrão atual e refine fontes de hidratação premium (águas alcalinas, bebidas funcionais). Um plano especializado considera estratégias avançadas de hidratação para maximizar performance conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Sua hidratação atual é um ótimo ponto de partida. Descubra como refinamentos estratégicos podem potencializar ainda mais sua performance com hidratação de precisão.'
    }
  }
}

// ============================================
// PLANNER DE REFEIÇÕES
// ============================================
export const plannerRefeicoesDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    perderPeso: {
      diagnostico: '📋 DIAGNÓSTICO: Seu plano alimentar está configurado para redução de peso através de déficit calórico controlado e personalizado',
      causaRaiz: '🔍 CAUSA RAIZ: O déficit calórico adequado promove redução de peso de forma saudável quando acompanhado de distribuição correta de macronutrientes. Estudos mostram que pequenas mudanças de 300-500 kcal por dia já podem resultar em perda de 0,5-1kg por semana quando mantidas consistentemente. Uma avaliação nutricional identifica exatamente qual déficit é mais adequado para seu metabolismo e estilo de vida',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Implemente o plano com déficit calórico conforme sua rotina. Busque avaliação nutricional para receber ajustes personalizados e acompanhamento que garanta perda de peso saudável e sustentável. Evite restrições extremas — cada organismo responde diferente',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de redução calórica inicial com distribuição estratégica de macronutrientes, priorizando proteínas e fibras para saciedade, ajustado conforme sua resposta individual e perda de peso semanal',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Proteínas, fibras e multivitamínico costumam ser considerados durante déficit calórico, mas sempre de acordo com a individualidade biológica e em doses adequadas',
      alimentacao: '🍎 ALIMENTAÇÃO: Priorize alimentos densos nutricionalmente que forneçam saciedade. Um plano personalizado ajusta quantidades e combinações ideais para você, garantindo nutrição adequada mesmo em déficit calórico',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu corpo está pedindo equilíbrio — e você já deu o primeiro passo. Descubra como reduzir peso de forma saudável e sustentável com um plano personalizado e acompanhamento adequado.'
    },
    manterPeso: {
      diagnostico: '📋 DIAGNÓSTICO: Seu plano alimentar está configurado para manutenção do peso com equilíbrio nutricional e suporte à saúde geral',
      causaRaiz: '🔍 CAUSA RAIZ: A manutenção do peso requer equilíbrio preciso entre ingestão e gasto calórico, além de distribuição adequada de nutrientes. Pesquisas indicam que pessoas que mantêm peso estável com alimentação equilibrada têm 50% menos risco de desenvolver desequilíbrios metabólicos. Uma avaliação nutricional identifica exatamente quais são suas necessidades para manutenção ideal',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha o plano alimentar equilibrado e monitore peso semanalmente. Considere avaliação nutricional preventiva para identificar oportunidades de otimização que preservam esse equilíbrio e melhoram qualidade nutricional',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de manutenção com alimentação variada e equilibrada, ajustado conforme seu perfil metabólico e objetivos pessoais, com foco em qualidade nutricional',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação preventiva identifica se você se beneficia de suporte nutricional. Multivitamínico e ômega-3 costumam ser considerados para manutenção, mas apenas após análise do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha padrão alimentar equilibrado com foco em variedade e qualidade. Um plano personalizado considera combinações específicas para maximizar absorção e benefícios conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu equilíbrio atual é um ótimo ponto de partida. Descubra como estratégias preventivas podem potencializar ainda mais sua saúde e bem-estar com otimizações nutricionais.'
    },
    ganharMassa: {
      diagnostico: '📋 DIAGNÓSTICO: Seu plano alimentar está configurado para ganho de massa muscular através de superávit calórico controlado e alta proteína',
      causaRaiz: '🔍 CAUSA RAIZ: O ganho de massa muscular requer superávit calórico adequado combinado com proteína suficiente para síntese proteica. Estudos mostram que ganhos de 0,25-0,5kg de massa muscular por mês são realistas quando há superávit de 300-500 kcal com 1,6-2,2g de proteína por kg. Uma avaliação nutricional identifica exatamente qual superávit e distribuição de macronutrientes são mais eficazes para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Implemente o plano com superávit calórico e proteína elevada conforme sua rotina de treinos. Busque avaliação nutricional para receber ajustes personalizados que maximizam ganho de massa magra enquanto minimizam ganho de gordura',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de superávit calórico inicial com alta proteína distribuída ao longo do dia, priorizando refeições pós-treino e timing nutricional estratégico, ajustado conforme sua resposta individual',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Proteínas em pó, creatina e carboidratos podem ser considerados para suporte ao ganho de massa, mas sempre de acordo com a individualidade biológica e em doses adequadas',
      alimentacao: '🍎 ALIMENTAÇÃO: Priorize alimentos ricos em proteína e carboidratos complexos que forneçam energia e nutrientes para recuperação e crescimento. Um plano personalizado ajusta quantidades e timing ideais para você',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu corpo precisa de nutrição adequada para resultados — descubra em minutos como otimizar seu ganho de massa muscular com um plano personalizado e estratégias direcionadas.'
    }
  }
}

// ============================================
// STORY INTERATIVO (Social)
// ============================================
export const storyInterativoDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    engajamentoBasico: {
      diagnostico: '📱 DIAGNÓSTICO: Stories básicos e consistentes podem aumentar seu engajamento inicial com conteúdo prático e visual',
      causaRaiz: '🔍 CAUSA RAIZ: Publicações simples com gatilhos claros (perguntas, enquetes, antes/depois) geram interação rápida. Estudos de social media indicam que stories com CTA único e visual limpo elevam respostas em até 30% para perfis iniciantes',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Publique 3 stories sequenciais: 1) Dor comum do público, 2) Dica prática, 3) CTA de resposta/DM',
      plano7Dias: '📅 PLANO 7 DIAS: 1 sequência por dia (3-4 telas) usando: dor → dica → prova → CTA. Varie temas: hidratação, proteína, rotina, lanches',
      suplementacao: '💊 SUPLEMENTAÇÃO: Se abordar suplementos, mantenha linguagem educativa e genérica até avaliação individual',
      alimentacao: '🍎 ALIMENTAÇÃO: Foque em dicas simples de alto valor (listas curtas, substituições, checklists visuais)',
      proximoPasso: '🎯 PRÓXIMO PASSO: Estruture seus stories com roteiro de 3 passos e um CTA simples. Evolua para formatos moderados após 7 dias.'
    },
    engajamentoModerado: {
      diagnostico: '📱 DIAGNÓSTICO: Stories moderados com narrativa e prova social elevam cliques e respostas qualificadas',
      causaRaiz: '🔍 CAUSA RAIZ: Narrativas curtas (problema → caminho → resultado) com elementos interativos aumentam tempo de retenção. Perfis intermediários performam melhor com agenda temática e CTAs segmentados',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Use roteiro de 5 telas: dor → mito → micro-aula (1 dica) → prova/print → CTA para formulário/DM',
      plano7Dias: '📅 PLANO 7 DIAS: 4 sequências/semana + 3 dias com enquetes/caixinhas. Temas: hidratação, proteína, planejamento, saciedade',
      suplementacao: '💊 SUPLEMENTAÇÃO: Conteúdo educativo com evidência leve; convide para avaliação antes de recomendar',
      alimentacao: '🍎 ALIMENTAÇÃO: Demonstrações rápidas (montagem de prato, substituições visuais) e checklists salvos',
      proximoPasso: '🎯 PRÓXIMO PASSO: Adote calendário fixo (ex.: 2ª mito, 4ª checklist, 6ª prova) e mensure respostas/DMs por tema.'
    },
    engajamentoAvancado: {
      diagnostico: '📱 DIAGNÓSTICO: Stories avançados com hooks fortes e trilhas temáticas geram picos de conversão',
      causaRaiz: '🔍 CAUSA RAIZ: Gatilhos de autoridade + prova + antecipação elevam conversões. Sequências de 6-8 telas com storytelling e CTA direto para captura aumentam leads qualificados',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Roteiro de 7 telas: hook → dor → autoridade → prova → micro-aula → oferta de valor (PDF/checklist) → CTA link/DM',
      plano7Dias: '📅 PLANO 7 DIAS: 3 trilhas temáticas (ex.: hidratação, proteína, planejamento) com 2 sequências cada + 1 compilado dominical',
      suplementacao: '💊 SUPLEMENTAÇÃO: Conteúdos avançados com disclaimers e chamada para avaliação personalizada',
      alimentacao: '🍎 ALIMENTAÇÃO: Carrosséis em vídeo, before/after aprovados e comparativos visuais com contexto',
      proximoPasso: '🎯 PRÓXIMO PASSO: Integre tracking de métricas (visualizações por tela e replies) e faça testes A/B de hooks e CTAs.'
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
  'mini-ebook': miniEbookDiagnosticos,
  'guia-nutraceutico': guiaNutraceuticoDiagnosticos,
  'guia-proteico': guiaProteicoDiagnosticos,
  'tabela-comparativa': tabelaComparativaDiagnosticos,
  'tabela-substituicoes': tabelaSubstituicoesDiagnosticos,
  'tabela-sintomas': tabelaSintomasDiagnosticos,
  'plano-alimentar-base': planoAlimentarBaseDiagnosticos,
  'planner-refeicoes': plannerRefeicoesDiagnosticos,
  'rastreador-alimentar': rastreadorAlimentarDiagnosticos,
  'diario-alimentar': diarioAlimentarDiagnosticos,
  'tabela-metas-semanais': tabelaMetasSemanaisDiagnosticos,
  'template-desafio-7dias': desafio7DiasDiagnosticos,
  'desafio-7-dias': desafio7DiasDiagnosticos,
  'template-desafio-21dias': desafio21DiasDiagnosticos,
  'desafio-21-dias': desafio21DiasDiagnosticos,
  'guia-hidratacao': guiaHidratacaoDiagnosticos,
  'infografico-educativo': infograficoEducativoDiagnosticos,
  'template-receitas': receitasDiagnosticos,
  'cardapio-detox': cardapioDetoxDiagnosticos,
  'template-avaliacao-inicial': avaliacaoInicialDiagnosticos,
  'formulario-recomendacao': formularioRecomendacaoDiagnosticos
}


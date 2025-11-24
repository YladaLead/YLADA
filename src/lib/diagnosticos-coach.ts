import type { DiagnosticoCompleto, DiagnosticosPorFerramenta } from './diagnostics/types'

// Coach usa os mesmos diagnósticos do Nutri (são idênticos)
import { alimentacaoRotinaDiagnosticos } from './diagnostics/nutri/alimentacao-rotina'
import { alimentacaoSaudavelDiagnosticos } from './diagnostics/nutri/alimentacao-saudavel'
import { avaliacaoEmocionalDiagnosticos } from './diagnostics/nutri/avaliacao-emocional'
import { avaliacaoInicialDiagnosticos } from './diagnostics/nutri/avaliacao-inicial'
import { avaliacaoIntoleranciaDiagnosticos } from './diagnostics/nutri/avaliacao-intolerancia'
import { calculadoraAguaDiagnosticos } from './diagnostics/nutri/calculadora-agua'
import { calculadoraCaloriasDiagnosticos } from './diagnostics/nutri/calculadora-calorias'
import { calculadoraImcDiagnosticos } from './diagnostics/nutri/calculadora-imc'
import { calculadoraProteinaDiagnosticos } from './diagnostics/nutri/calculadora-proteina'
import { cardapioDetoxDiagnosticos } from './diagnostics/nutri/cardapio-detox'
import { checklistAlimentarDiagnosticos } from './diagnostics/nutri/checklist-alimentar'
import { checklistDetoxDiagnosticos } from './diagnostics/nutri/checklist-detox'
import { conheceSeuCorpoDiagnosticos } from './diagnostics/nutri/conhece-seu-corpo'
import { diarioAlimentarDiagnosticos } from './diagnostics/nutri/diario-alimentar'
import { desafio21DiasDiagnosticos } from './diagnostics/nutri/desafio-21-dias'
import { desafio7DiasDiagnosticos } from './diagnostics/nutri/desafio-7-dias'
import { diagnosticoEletrolitosDiagnosticos } from './diagnostics/nutri/diagnostico-eletrolitos'
import { diagnosticoParasitoseDiagnosticos } from './diagnostics/nutri/diagnostico-parasitose'
import { diagnosticoSintomasIntestinaisDiagnosticos } from './diagnostics/nutri/diagnostico-sintomas-intestinais'
import { formularioRecomendacaoDiagnosticos } from './diagnostics/nutri/formulario-recomendacao'
import { ganhosProsperidadeDiagnosticos } from './diagnostics/nutri/ganhos-prosperidade'
import { guiaHidratacaoDiagnosticos } from './diagnostics/nutri/guia-hidratacao'
import { guiaNutraceuticoDiagnosticos } from './diagnostics/nutri/guia-nutraceutico'
import { guiaProteicoDiagnosticos } from './diagnostics/nutri/guia-proteico'
import { infograficoEducativoDiagnosticos } from './diagnostics/nutri/infografico-educativo'
import { miniEbookDiagnosticos } from './diagnostics/nutri/mini-ebook'
import { nutridoVsAlimentadoDiagnosticos } from './diagnostics/nutri/nutrido-vs-alimentado'
import { perfilMetabolicoDiagnosticos } from './diagnostics/nutri/perfil-metabolico'
import { plannerRefeicoesDiagnosticos } from './diagnostics/nutri/planner-refeicoes'
import { planoAlimentarBaseDiagnosticos } from './diagnostics/nutri/plano-alimentar-base'
import { potencialCrescimentoDiagnosticos } from './diagnostics/nutri/potencial-crescimento'
import { propositoEquilibrioDiagnosticos } from './diagnostics/nutri/proposito-equilibrio'
import { prontoEmagrecerDiagnosticos } from './diagnostics/nutri/pronto-emagrecer'
import { quizBemEstarDiagnosticos } from './diagnostics/nutri/quiz-bem-estar'
import { quizDetoxDiagnosticos } from './diagnostics/nutri/quiz-detox'
import { quizEnergeticoDiagnosticos } from './diagnostics/nutri/quiz-energetico'
import { quizInterativoDiagnosticos } from './diagnostics/nutri/quiz-interativo'
import { quizPerfilNutricionalDiagnosticos } from './diagnostics/nutri/quiz-perfil-nutricional'
import { rastreadorAlimentarDiagnosticos } from './diagnostics/nutri/rastreador-alimentar'
import { receitasDiagnosticos } from './diagnostics/nutri/receitas'
import { retencaoLiquidosDiagnosticos } from './diagnostics/nutri/retencao-liquidos'
import { simuladorResultadosDiagnosticos } from './diagnostics/nutri/simulador-resultados'
import { sindromeMetabolicaDiagnosticos } from './diagnostics/nutri/sindrome-metabolica'
import { storyInterativoDiagnosticos } from './diagnostics/nutri/story-interativo'
import { tabelaComparativaDiagnosticos } from './diagnostics/nutri/tabela-comparativa'
import { tabelaMetasSemanaisDiagnosticos } from './diagnostics/nutri/tabela-metas-semanais'
import { tabelaSintomasDiagnosticos } from './diagnostics/nutri/tabela-sintomas'
import { tabelaSubstituicoesDiagnosticos } from './diagnostics/nutri/tabela-substituicoes'
import { tipoFomeDiagnosticos } from './diagnostics/nutri/tipo-fome'
import { disciplinadoEmocionalDiagnosticos } from './diagnostics/nutri/disciplinado-emocional'
import { perfilIntestinoDiagnosticos } from './diagnostics/nutri/perfil-intestino'
import { avaliacaoSonoEnergiaDiagnosticos } from './diagnostics/nutri/avaliacao-sono-energia'
import { quizPedindoDetoxDiagnosticos } from './diagnostics/nutri/quiz-pedindo-detox'

import { avaliacaoEmocionalDiagnosticos as avaliacaoEmocionalDiagnosticosWellness } from './diagnostics/wellness/avaliacao-emocional'
import { avaliacaoInicialDiagnosticos as avaliacaoInicialDiagnosticosWellness } from './diagnostics/wellness/avaliacao-inicial'
import { alimentacaoRotinaDiagnosticos as alimentacaoRotinaDiagnosticosWellness } from './diagnostics/wellness/alimentacao-rotina'
import { alimentacaoSaudavelDiagnosticos as alimentacaoSaudavelDiagnosticosWellness } from './diagnostics/wellness/alimentacao-saudavel'
import { conheceSeuCorpoDiagnosticos as conheceSeuCorpoDiagnosticosWellness } from './diagnostics/wellness/conhece-seu-corpo'
import { desafio21DiasDiagnosticos as desafio21DiasDiagnosticosWellness } from './diagnostics/wellness/desafio-21-dias'
import { desafio7DiasDiagnosticos as desafio7DiasDiagnosticosWellness } from './diagnostics/wellness/desafio-7-dias'
import { eletrolitosDiagnosticos as eletrolitosDiagnosticosWellness } from './diagnostics/wellness/eletrolitos'
import { ganhosProsperidadeDiagnosticos as ganhosProsperidadeDiagnosticosWellness } from './diagnostics/wellness/ganhos-prosperidade'
import { guiaHidratacaoDiagnosticos as guiaHidratacaoDiagnosticosWellness } from './diagnostics/wellness/guia-hidratacao'
import { intoleranciaDiagnosticos as intoleranciaDiagnosticosWellness } from './diagnostics/wellness/intolerancia'
import { nutridoVsAlimentadoDiagnosticos as nutridoVsAlimentadoDiagnosticosWellness } from './diagnostics/wellness/nutrido-vs-alimentado'
import { perfilMetabolicoDiagnosticos as perfilMetabolicoDiagnosticosWellness } from './diagnostics/wellness/perfil-metabolico'
import { potencialCrescimentoDiagnosticos as potencialCrescimentoDiagnosticosWellness } from './diagnostics/wellness/potencial-crescimento'
import { prontoEmagrecerDiagnosticos as prontoEmagrecerDiagnosticosWellness } from './diagnostics/wellness/pronto-emagrecer'
import { propositoEquilibrioDiagnosticos as propositoEquilibrioDiagnosticosWellness } from './diagnostics/wellness/proposito-equilibrio'
import { retencaoLiquidosDiagnosticos as retencaoLiquidosDiagnosticosWellness } from './diagnostics/wellness/retencao-liquidos'
import { sindromeMetabolicaDiagnosticos as sindromeMetabolicaDiagnosticosWellness } from './diagnostics/wellness/sindrome-metabolica'
import { sintomasIntestinaisDiagnosticos as sintomasIntestinaisDiagnosticosWellness } from './diagnostics/wellness/sintomas-intestinais'
import { tipoFomeDiagnosticos as tipoFomeDiagnosticosWellness } from './diagnostics/wellness/tipo-fome'

export type { DiagnosticoCompleto, DiagnosticosPorFerramenta, ResultadoPossivel } from './diagnostics/types'

export {
  alimentacaoRotinaDiagnosticos,
  alimentacaoSaudavelDiagnosticos,
  avaliacaoEmocionalDiagnosticos,
  avaliacaoInicialDiagnosticos,
  avaliacaoIntoleranciaDiagnosticos,
  calculadoraAguaDiagnosticos,
  calculadoraCaloriasDiagnosticos,
  calculadoraImcDiagnosticos,
  calculadoraProteinaDiagnosticos,
  cardapioDetoxDiagnosticos,
  checklistAlimentarDiagnosticos,
  checklistDetoxDiagnosticos,
  conheceSeuCorpoDiagnosticos,
  diarioAlimentarDiagnosticos,
  desafio21DiasDiagnosticos,
  desafio7DiasDiagnosticos,
  diagnosticoEletrolitosDiagnosticos,
  diagnosticoSintomasIntestinaisDiagnosticos,
  formularioRecomendacaoDiagnosticos,
  ganhosProsperidadeDiagnosticos,
  guiaHidratacaoDiagnosticos,
  guiaNutraceuticoDiagnosticos,
  guiaProteicoDiagnosticos,
  infograficoEducativoDiagnosticos,
  miniEbookDiagnosticos,
  nutridoVsAlimentadoDiagnosticos,
  perfilMetabolicoDiagnosticos,
  plannerRefeicoesDiagnosticos,
  planoAlimentarBaseDiagnosticos,
  potencialCrescimentoDiagnosticos,
  propositoEquilibrioDiagnosticos,
  prontoEmagrecerDiagnosticos,
  quizBemEstarDiagnosticos,
  quizDetoxDiagnosticos,
  quizEnergeticoDiagnosticos,
  quizInterativoDiagnosticos,
  quizPerfilNutricionalDiagnosticos,
  rastreadorAlimentarDiagnosticos,
  receitasDiagnosticos,
  retencaoLiquidosDiagnosticos,
  simuladorResultadosDiagnosticos,
  sindromeMetabolicaDiagnosticos,
  storyInterativoDiagnosticos,
  tabelaComparativaDiagnosticos,
  tabelaMetasSemanaisDiagnosticos,
  tabelaSintomasDiagnosticos,
  tabelaSubstituicoesDiagnosticos,
  tipoFomeDiagnosticos,
  perfilIntestinoDiagnosticos,
  avaliacaoSonoEnergiaDiagnosticos,
  quizPedindoDetoxDiagnosticos
}

// Função para substituir "nutricionista" por "Coach de bem-estar" nos diagnósticos
function adaptarDiagnosticoParaCoach(diagnostico: DiagnosticoCompleto | null): DiagnosticoCompleto | null {
  if (!diagnostico) return null

  const substituirTexto = (texto: string): string => {
    if (!texto) return texto
    
    // Substituições: nutricionista/nutricional -> Coach de bem-estar/bem-estar
    // IMPORTANTE: Ordem importa! Substituir as mais específicas primeiro
    
    // 1. Substituir "nutricionista" (várias variações)
    let resultado = texto
      // Substituições específicas primeiro (com contexto)
      .replace(/nutricionista profissional/gi, 'Coach de bem-estar profissional')
      .replace(/com uma nutricionista/gi, 'com um Coach de bem-estar')
      .replace(/de uma nutricionista/gi, 'de um Coach de bem-estar')
      .replace(/da nutricionista/gi, 'do Coach de bem-estar')
      .replace(/a nutricionista/gi, 'o Coach de bem-estar')
      .replace(/sua nutricionista/gi, 'seu Coach de bem-estar')
      .replace(/uma nutricionista/gi, 'um Coach de bem-estar')
      .replace(/guiado por nutricionista/gi, 'guiado por Coach de bem-estar')
      // Depois as genéricas (para pegar os casos restantes)
      .replace(/NUTRICIONISTA/gi, 'COACH DE BEM-ESTAR')
      .replace(/Nutricionista/gi, 'Coach de bem-estar')
      .replace(/nutricionista/gi, 'Coach de bem-estar')
    
    // 2. Substituir "nutricional" e variações
    resultado = resultado
      // Frases completas com "nutricional"
      .replace(/avaliação nutricional especializada/gi, 'avaliação de bem-estar especializada')
      .replace(/avaliação nutricional completa/gi, 'avaliação de bem-estar completa')
      .replace(/avaliação nutricional preventiva/gi, 'avaliação de bem-estar preventiva')
      .replace(/avaliação nutricional/gi, 'avaliação de bem-estar')
      .replace(/consulta nutricional/gi, 'consulta de bem-estar')
      .replace(/análise nutricional completa/gi, 'análise de bem-estar completa')
      .replace(/análise nutricional/gi, 'análise de bem-estar')
      .replace(/acompanhamento nutricional especializado/gi, 'acompanhamento de bem-estar especializado')
      .replace(/acompanhamento nutricional e comportamental/gi, 'acompanhamento de bem-estar e comportamental')
      .replace(/acompanhamento nutricional preventivo/gi, 'acompanhamento de bem-estar preventivo')
      .replace(/acompanhamento nutricional/gi, 'acompanhamento de bem-estar')
      .replace(/marcadores nutricionais/gi, 'marcadores de bem-estar')
      .replace(/marcadores hormonais e nutricionais/gi, 'marcadores hormonais e de bem-estar')
      .replace(/estratégias nutricionais otimizadas/gi, 'estratégias de bem-estar otimizadas')
      .replace(/estratégias nutricionais/gi, 'estratégias de bem-estar')
      .replace(/plano nutricional/gi, 'plano de bem-estar')
      .replace(/protocolo nutricional/gi, 'protocolo de bem-estar')
      // Palavras isoladas "nutricional"
      .replace(/\bnutricional\b/gi, 'de bem-estar')
    
    // 3. Substituir "nutrição" (palavra isolada, não parte de outras palavras)
    resultado = resultado
      .replace(/\badequar nutrição\b/gi, 'adequar bem-estar')
      .replace(/\badequar nutrição ao\b/gi, 'adequar bem-estar ao')
      .replace(/\bnutrição ao estilo de vida\b/gi, 'bem-estar ao estilo de vida')
      .replace(/\bà nutrição\b/gi, 'ao bem-estar')
      .replace(/\bda nutrição\b/gi, 'do bem-estar')
      .replace(/\bde nutrição\b/gi, 'de bem-estar')
      .replace(/\bnutrição\b/gi, 'bem-estar')
    
    return resultado
  }

  // Retornar apenas os campos necessários (removendo plano7Dias, suplementacao, alimentacao)
  return {
    diagnostico: substituirTexto(diagnostico.diagnostico),
    causaRaiz: substituirTexto(diagnostico.causaRaiz),
    acaoImediata: substituirTexto(diagnostico.acaoImediata),
    proximoPasso: diagnostico.proximoPasso ? substituirTexto(diagnostico.proximoPasso) : undefined
  }
}

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
    case 'disciplinado-emocional':
      diagnosticos = disciplinadoEmocionalDiagnosticos
      break
    case 'quiz-energetico':
      diagnosticos = quizEnergeticoDiagnosticos
      break
    case 'avaliacao-sono-energia':
    case 'quiz-sono-energia':
      diagnosticos = avaliacaoSonoEnergiaDiagnosticos
      break
    case 'quiz-pedindo-detox':
    case 'seu-corpo-esta-pedindo-detox':
      diagnosticos = quizPedindoDetoxDiagnosticos
      break
    case 'perfil-intestino':
    case 'qual-e-seu-perfil-de-intestino':
      diagnosticos = perfilIntestinoDiagnosticos
      break
    case 'avaliacao-emocional':
    case 'quiz-emocional':
      if (profissao === 'wellness') {
        diagnosticos = avaliacaoEmocionalDiagnosticosWellness
      } else {
        diagnosticos = avaliacaoEmocionalDiagnosticos
      }
      break
    case 'avaliacao-intolerancia':
    case 'quiz-intolerancia':
    case 'intolerancia':
      if (profissao === 'wellness') {
        diagnosticos = intoleranciaDiagnosticosWellness
      } else {
        diagnosticos = avaliacaoIntoleranciaDiagnosticos
      }
      break
    case 'avaliacao-perfil-metabolico':
    case 'quiz-perfil-metabolico':
    case 'perfil-metabolico':
    case 'perfil-metabólico':
      if (profissao === 'wellness') {
        diagnosticos = perfilMetabolicoDiagnosticosWellness
      } else {
        diagnosticos = perfilMetabolicoDiagnosticos
      }
      break
    case 'avaliacao-inicial':
    case 'quiz-avaliacao-inicial':
    case 'template-avaliacao-inicial':
      if (profissao === 'wellness') {
        diagnosticos = avaliacaoInicialDiagnosticosWellness
      } else {
        diagnosticos = avaliacaoInicialDiagnosticos
      }
      break
    case 'diagnostico-eletrolitos':
    case 'quiz-eletrolitos':
    case 'eletrolitos':
    case 'eletrólitos':
      if (profissao === 'wellness') {
        diagnosticos = eletrolitosDiagnosticosWellness
      } else {
        diagnosticos = diagnosticoEletrolitosDiagnosticos
      }
      break
    case 'diagnostico-sintomas-intestinais':
    case 'quiz-sintomas-intestinais':
    case 'sintomas-intestinais':
    case 'sintomas intestinais':
      if (profissao === 'wellness') {
        diagnosticos = sintomasIntestinaisDiagnosticosWellness
      } else {
        diagnosticos = diagnosticoSintomasIntestinaisDiagnosticos
      }
      break
    case 'pronto-emagrecer':
    case 'quiz-pronto-emagrecer':
    case 'pronto para emagrecer':
      if (profissao === 'wellness') {
        diagnosticos = prontoEmagrecerDiagnosticosWellness
      } else {
        diagnosticos = prontoEmagrecerDiagnosticos
      }
      break
    case 'tipo-fome':
    case 'quiz-tipo-fome':
    case 'qual-e-o-seu-tipo-de-fome':
    case 'tipo de fome':
      if (profissao === 'wellness') {
        diagnosticos = tipoFomeDiagnosticosWellness
      } else {
        diagnosticos = tipoFomeDiagnosticos
      }
      break
    case 'alimentacao-saudavel':
    case 'quiz-alimentacao-saudavel':
    case 'healthy-eating-quiz':
    case 'healthy-eating':
      if (profissao === 'wellness') {
        diagnosticos = alimentacaoSaudavelDiagnosticosWellness
      } else {
        diagnosticos = alimentacaoSaudavelDiagnosticos
      }
      break
    case 'sindrome-metabolica':
    case 'risco-sindrome-metabolica':
    case 'metabolic-syndrome-risk':
    case 'metabolic-syndrome':
      if (profissao === 'wellness') {
        diagnosticos = sindromeMetabolicaDiagnosticosWellness
      } else {
        diagnosticos = sindromeMetabolicaDiagnosticos
      }
      break
    case 'retencao-liquidos':
    case 'teste-retencao-liquidos':
    case 'water-retention-test':
    case 'water-retention':
      if (profissao === 'wellness') {
        diagnosticos = retencaoLiquidosDiagnosticosWellness
      } else {
        diagnosticos = retencaoLiquidosDiagnosticos
      }
      break
    case 'conhece-seu-corpo':
    case 'voce-conhece-seu-corpo':
    case 'body-awareness':
    case 'autoconhecimento-corporal':
      if (profissao === 'wellness') {
        diagnosticos = conheceSeuCorpoDiagnosticosWellness
      } else {
        diagnosticos = conheceSeuCorpoDiagnosticos
      }
      break
    case 'nutrido-vs-alimentado':
    case 'voce-nutrido-ou-apenas-alimentado':
    case 'nourished-vs-fed':
    case 'nutrido ou alimentado':
      if (profissao === 'wellness') {
        diagnosticos = nutridoVsAlimentadoDiagnosticosWellness
      } else {
        diagnosticos = nutridoVsAlimentadoDiagnosticos
      }
      break
    case 'alimentacao-rotina':
    case 'voce-alimentando-conforme-rotina':
    case 'avaliacao-rotina-alimentar':
    case 'voce-esta-se-alimentando-conforme-sua-rotina':
    case 'eating-routine':
    case 'alimentação conforme rotina':
      if (profissao === 'wellness') {
        diagnosticos = alimentacaoRotinaDiagnosticosWellness
      } else {
        diagnosticos = alimentacaoRotinaDiagnosticos
      }
      break
    case 'ganhos-prosperidade':
    case 'quiz-ganhos-prosperidade':
    case 'gains-and-prosperity':
    case 'ganhos e prosperidade':
      if (profissao === 'wellness') {
        diagnosticos = ganhosProsperidadeDiagnosticosWellness
      } else {
        diagnosticos = ganhosProsperidadeDiagnosticos
      }
      break
    case 'potencial-crescimento':
    case 'quiz-potencial-crescimento':
    case 'potential-and-growth':
    case 'potencial e crescimento':
      if (profissao === 'wellness') {
        diagnosticos = potencialCrescimentoDiagnosticosWellness
      } else {
        diagnosticos = potencialCrescimentoDiagnosticos
      }
      break
    case 'proposito-equilibrio':
    case 'quiz-proposito-equilibrio':
    case 'purpose-and-balance':
    case 'propósito e equilíbrio':
      if (profissao === 'wellness') {
        diagnosticos = propositoEquilibrioDiagnosticosWellness
      } else {
        diagnosticos = propositoEquilibrioDiagnosticos
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
      if (profissao === 'wellness') {
        diagnosticos = desafio7DiasDiagnosticosWellness
      } else {
        diagnosticos = desafio7DiasDiagnosticos
      }
      break
    case 'template-desafio-21dias':
    case 'desafio-21-dias':
      if (profissao === 'wellness') {
        diagnosticos = desafio21DiasDiagnosticosWellness
      } else {
        diagnosticos = desafio21DiasDiagnosticos
      }
      break
    case 'guia-hidratacao':
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
    case 'formulario-recomendacao':
      diagnosticos = formularioRecomendacaoDiagnosticos
      break
    case 'template-story-interativo':
      diagnosticos = storyInterativoDiagnosticos
      break
    case 'simulador-resultados':
      diagnosticos = simuladorResultadosDiagnosticos
      break
    default:
      return null
  }

  // Para 'coach', usar 'nutri' como fallback (já que os diagnósticos são idênticos)
  const profissaoParaBuscar = profissao === 'coach' ? 'nutri' : profissao
  
  if (!diagnosticos[profissaoParaBuscar] || !diagnosticos[profissaoParaBuscar][resultadoId]) {
    return null
  }

  const diagnosticoOriginal = diagnosticos[profissaoParaBuscar][resultadoId]
  
  // Se for 'coach', adaptar o diagnóstico substituindo "nutricionista" por "Coach de bem-estar"
  if (profissao === 'coach') {
    return adaptarDiagnosticoParaCoach(diagnosticoOriginal)
  }

  return diagnosticoOriginal
}

export const diagnosticosCoach: Record<string, DiagnosticosPorFerramenta> = {
  'alimentacao-rotina': alimentacaoRotinaDiagnosticos,
  'voce-alimentando-conforme-rotina': alimentacaoRotinaDiagnosticos,
  'avaliacao-rotina-alimentar': alimentacaoRotinaDiagnosticos,
  'voce-esta-se-alimentando-conforme-sua-rotina': alimentacaoRotinaDiagnosticos,
  'alimentacao-saudavel': alimentacaoSaudavelDiagnosticos,
  'quiz-alimentacao-saudavel': alimentacaoSaudavelDiagnosticos,
  'avaliacao-emocional': avaliacaoEmocionalDiagnosticos,
  'quiz-emocional': avaliacaoEmocionalDiagnosticos,
  'avaliacao-inicial': avaliacaoInicialDiagnosticos,
  'template-avaliacao-inicial': avaliacaoInicialDiagnosticos,
  'avaliacao-intolerancia': avaliacaoIntoleranciaDiagnosticos,
  'quiz-intolerancia': avaliacaoIntoleranciaDiagnosticos,
  'intolerancia': avaliacaoIntoleranciaDiagnosticos,
  'calculadora-agua': calculadoraAguaDiagnosticos,
  'calculadora-calorias': calculadoraCaloriasDiagnosticos,
  'calculadora-imc': calculadoraImcDiagnosticos,
  'calculadora-proteina': calculadoraProteinaDiagnosticos,
  'cardapio-detox': cardapioDetoxDiagnosticos,
  'checklist-alimentar': checklistAlimentarDiagnosticos,
  'checklist-detox': checklistDetoxDiagnosticos,
  'conhece-seu-corpo': conheceSeuCorpoDiagnosticos,
  'voce-conhece-seu-corpo': conheceSeuCorpoDiagnosticos,
  'autoconhecimento-corporal': conheceSeuCorpoDiagnosticos,
  'diario-alimentar': diarioAlimentarDiagnosticos,
  'desafio-7-dias': desafio7DiasDiagnosticos,
  'template-desafio-7dias': desafio7DiasDiagnosticos,
  'desafio-21-dias': desafio21DiasDiagnosticos,
  'template-desafio-21dias': desafio21DiasDiagnosticos,
  'diagnostico-eletrolitos': diagnosticoEletrolitosDiagnosticos,
  'quiz-eletrolitos': diagnosticoEletrolitosDiagnosticos,
  'eletrolitos': diagnosticoEletrolitosDiagnosticos,
  'eletrólitos': diagnosticoEletrolitosDiagnosticos,
  'template-diagnostico-parasitose': diagnosticoParasitoseDiagnosticos,
  'diagnostico-parasitose': diagnosticoParasitoseDiagnosticos,
  'diagnostico-sintomas-intestinais': diagnosticoSintomasIntestinaisDiagnosticos,
  'quiz-sintomas-intestinais': diagnosticoSintomasIntestinaisDiagnosticos,
  'sintomas-intestinais': diagnosticoSintomasIntestinaisDiagnosticos,
  'perfil-intestino': perfilIntestinoDiagnosticos,
  'qual-e-seu-perfil-de-intestino': perfilIntestinoDiagnosticos,
  'formulario-recomendacao': formularioRecomendacaoDiagnosticos,
  'guia-hidratacao': guiaHidratacaoDiagnosticos,
  'guia-nutraceutico': guiaNutraceuticoDiagnosticos,
  'guia-proteico': guiaProteicoDiagnosticos,
  'infografico-educativo': infograficoEducativoDiagnosticos,
  'mini-ebook': miniEbookDiagnosticos,
  'nutrido-vs-alimentado': nutridoVsAlimentadoDiagnosticos,
  'voce-nutrido-ou-apenas-alimentado': nutridoVsAlimentadoDiagnosticos,
  'nutrido ou alimentado': nutridoVsAlimentadoDiagnosticos,
  'perfil-metabolico': perfilMetabolicoDiagnosticos,
  'avaliacao-perfil-metabolico': perfilMetabolicoDiagnosticos,
  'quiz-perfil-metabolico': perfilMetabolicoDiagnosticos,
  'planner-refeicoes': plannerRefeicoesDiagnosticos,
  'plano-alimentar-base': planoAlimentarBaseDiagnosticos,
  'potencial-crescimento': potencialCrescimentoDiagnosticos,
  'quiz-potencial-crescimento': potencialCrescimentoDiagnosticos,
  'proposito-equilibrio': propositoEquilibrioDiagnosticos,
  'quiz-proposito-equilibrio': propositoEquilibrioDiagnosticos,
  'pronto-emagrecer': prontoEmagrecerDiagnosticos,
  'quiz-pronto-emagrecer': prontoEmagrecerDiagnosticos,
  'ganhos-prosperidade': ganhosProsperidadeDiagnosticos,
  'quiz-ganhos-prosperidade': ganhosProsperidadeDiagnosticos,
  'quiz-bem-estar': quizBemEstarDiagnosticos,
  'descoberta-perfil-bem-estar': quizBemEstarDiagnosticos,
  'descubra-seu-perfil-de-bem-estar': quizBemEstarDiagnosticos,
  'disciplinado-emocional': disciplinadoEmocionalDiagnosticos,
  'quiz-detox': quizDetoxDiagnosticos,
  'quiz-pedindo-detox': quizPedindoDetoxDiagnosticos,
  'seu-corpo-esta-pedindo-detox': quizPedindoDetoxDiagnosticos,
  'quiz-energetico': quizEnergeticoDiagnosticos,
  'avaliacao-sono-energia': avaliacaoSonoEnergiaDiagnosticos,
  'quiz-sono-energia': avaliacaoSonoEnergiaDiagnosticos,
  'quiz-interativo': quizInterativoDiagnosticos,
  'quiz-perfil-nutricional': quizPerfilNutricionalDiagnosticos,
  'rastreador-alimentar': rastreadorAlimentarDiagnosticos,
  'receitas': receitasDiagnosticos,
  'template-receitas': receitasDiagnosticos,
  'retencao-liquidos': retencaoLiquidosDiagnosticos,
  'teste-retencao-liquidos': retencaoLiquidosDiagnosticos,
  'simulador-resultados': simuladorResultadosDiagnosticos,
  'sindrome-metabolica': sindromeMetabolicaDiagnosticos,
  'risco-sindrome-metabolica': sindromeMetabolicaDiagnosticos,
  'story-interativo': storyInterativoDiagnosticos,
  'template-story-interativo': storyInterativoDiagnosticos,
  'tabela-comparativa': tabelaComparativaDiagnosticos,
  'tabela-metas-semanais': tabelaMetasSemanaisDiagnosticos,
  'tabela-sintomas': tabelaSintomasDiagnosticos,
  'tabela-substituicoes': tabelaSubstituicoesDiagnosticos,
  'tipo-fome': tipoFomeDiagnosticos,
  'quiz-tipo-fome': tipoFomeDiagnosticos
}

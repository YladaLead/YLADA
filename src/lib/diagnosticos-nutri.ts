import type { DiagnosticoCompleto, DiagnosticosPorFerramenta } from './diagnostics/types'

import { avaliacaoInicialDiagnosticos } from './diagnostics/nutri/avaliacao-inicial'
import { calculadoraAguaDiagnosticos } from './diagnostics/nutri/calculadora-agua'
import { calculadoraCaloriasDiagnosticos } from './diagnostics/nutri/calculadora-calorias'
import { calculadoraImcDiagnosticos } from './diagnostics/nutri/calculadora-imc'
import { calculadoraProteinaDiagnosticos } from './diagnostics/nutri/calculadora-proteina'
import { cardapioDetoxDiagnosticos } from './diagnostics/nutri/cardapio-detox'
import { checklistAlimentarDiagnosticos } from './diagnostics/nutri/checklist-alimentar'
import { checklistDetoxDiagnosticos } from './diagnostics/nutri/checklist-detox'
import { diarioAlimentarDiagnosticos } from './diagnostics/nutri/diario-alimentar'
import { desafio21DiasDiagnosticos } from './diagnostics/nutri/desafio-21-dias'
import { desafio7DiasDiagnosticos } from './diagnostics/nutri/desafio-7-dias'
import { formularioRecomendacaoDiagnosticos } from './diagnostics/nutri/formulario-recomendacao'
import { guiaHidratacaoDiagnosticos } from './diagnostics/nutri/guia-hidratacao'
import { guiaNutraceuticoDiagnosticos } from './diagnostics/nutri/guia-nutraceutico'
import { guiaProteicoDiagnosticos } from './diagnostics/nutri/guia-proteico'
import { infograficoEducativoDiagnosticos } from './diagnostics/nutri/infografico-educativo'
import { miniEbookDiagnosticos } from './diagnostics/nutri/mini-ebook'
import { plannerRefeicoesDiagnosticos } from './diagnostics/nutri/planner-refeicoes'
import { planoAlimentarBaseDiagnosticos } from './diagnostics/nutri/plano-alimentar-base'
import { quizBemEstarDiagnosticos } from './diagnostics/nutri/quiz-bem-estar'
import { quizDetoxDiagnosticos } from './diagnostics/nutri/quiz-detox'
import { quizEnergeticoDiagnosticos } from './diagnostics/nutri/quiz-energetico'
import { quizInterativoDiagnosticos } from './diagnostics/nutri/quiz-interativo'
import { quizPerfilNutricionalDiagnosticos } from './diagnostics/nutri/quiz-perfil-nutricional'
import { rastreadorAlimentarDiagnosticos } from './diagnostics/nutri/rastreador-alimentar'
import { receitasDiagnosticos } from './diagnostics/nutri/receitas'
import { simuladorResultadosDiagnosticos } from './diagnostics/nutri/simulador-resultados'
import { storyInterativoDiagnosticos } from './diagnostics/nutri/story-interativo'
import { tabelaComparativaDiagnosticos } from './diagnostics/nutri/tabela-comparativa'
import { tabelaMetasSemanaisDiagnosticos } from './diagnostics/nutri/tabela-metas-semanais'
import { tabelaSintomasDiagnosticos } from './diagnostics/nutri/tabela-sintomas'
import { tabelaSubstituicoesDiagnosticos } from './diagnostics/nutri/tabela-substituicoes'

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
  avaliacaoInicialDiagnosticos,
  calculadoraAguaDiagnosticos,
  calculadoraCaloriasDiagnosticos,
  calculadoraImcDiagnosticos,
  calculadoraProteinaDiagnosticos,
  cardapioDetoxDiagnosticos,
  checklistAlimentarDiagnosticos,
  checklistDetoxDiagnosticos,
  diarioAlimentarDiagnosticos,
  desafio21DiasDiagnosticos,
  desafio7DiasDiagnosticos,
  formularioRecomendacaoDiagnosticos,
  guiaHidratacaoDiagnosticos,
  guiaNutraceuticoDiagnosticos,
  guiaProteicoDiagnosticos,
  infograficoEducativoDiagnosticos,
  miniEbookDiagnosticos,
  plannerRefeicoesDiagnosticos,
  planoAlimentarBaseDiagnosticos,
  quizBemEstarDiagnosticos,
  quizDetoxDiagnosticos,
  quizEnergeticoDiagnosticos,
  quizInterativoDiagnosticos,
  quizPerfilNutricionalDiagnosticos,
  rastreadorAlimentarDiagnosticos,
  receitasDiagnosticos,
  simuladorResultadosDiagnosticos,
  storyInterativoDiagnosticos,
  tabelaComparativaDiagnosticos,
  tabelaMetasSemanaisDiagnosticos,
  tabelaSintomasDiagnosticos,
  tabelaSubstituicoesDiagnosticos
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
    case 'quiz-energetico':
      diagnosticos = quizEnergeticoDiagnosticos
      break
    case 'avaliacao-emocional':
    case 'quiz-emocional':
      diagnosticos = avaliacaoEmocionalDiagnosticosWellness
      break
    case 'avaliacao-intolerancia':
    case 'quiz-intolerancia':
    case 'intolerancia':
      diagnosticos = intoleranciaDiagnosticosWellness
      break
    case 'avaliacao-perfil-metabolico':
    case 'quiz-perfil-metabolico':
    case 'perfil-metabolico':
    case 'perfil-metabólico':
      diagnosticos = perfilMetabolicoDiagnosticosWellness
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
      diagnosticos = eletrolitosDiagnosticosWellness
      break
    case 'diagnostico-sintomas-intestinais':
    case 'quiz-sintomas-intestinais':
    case 'sintomas-intestinais':
    case 'sintomas intestinais':
      diagnosticos = sintomasIntestinaisDiagnosticosWellness
      break
    case 'pronto-emagrecer':
    case 'quiz-pronto-emagrecer':
    case 'pronto para emagrecer':
      diagnosticos = prontoEmagrecerDiagnosticosWellness
      break
    case 'tipo-fome':
    case 'quiz-tipo-fome':
    case 'qual-e-o-seu-tipo-de-fome':
    case 'tipo de fome':
      diagnosticos = tipoFomeDiagnosticosWellness
      break
    case 'alimentacao-saudavel':
    case 'quiz-alimentacao-saudavel':
    case 'healthy-eating-quiz':
    case 'healthy-eating':
      diagnosticos = alimentacaoSaudavelDiagnosticosWellness
      break
    case 'sindrome-metabolica':
    case 'risco-sindrome-metabolica':
    case 'metabolic-syndrome-risk':
    case 'metabolic-syndrome':
      diagnosticos = sindromeMetabolicaDiagnosticosWellness
      break
    case 'retencao-liquidos':
    case 'teste-retencao-liquidos':
    case 'water-retention-test':
    case 'water-retention':
      diagnosticos = retencaoLiquidosDiagnosticosWellness
      break
    case 'conhece-seu-corpo':
    case 'voce-conhece-seu-corpo':
    case 'body-awareness':
    case 'autoconhecimento-corporal':
      diagnosticos = conheceSeuCorpoDiagnosticosWellness
      break
    case 'nutrido-vs-alimentado':
    case 'voce-nutrido-ou-apenas-alimentado':
    case 'nourished-vs-fed':
    case 'nutrido ou alimentado':
      diagnosticos = nutridoVsAlimentadoDiagnosticosWellness
      break
    case 'alimentacao-rotina':
    case 'voce-alimentando-conforme-rotina':
    case 'eating-routine':
    case 'alimentação conforme rotina':
      diagnosticos = alimentacaoRotinaDiagnosticosWellness
      break
    case 'ganhos-prosperidade':
    case 'quiz-ganhos-prosperidade':
    case 'gains-and-prosperity':
    case 'ganhos e prosperidade':
      diagnosticos = ganhosProsperidadeDiagnosticosWellness
      break
    case 'potencial-crescimento':
    case 'quiz-potencial-crescimento':
    case 'potential-and-growth':
    case 'potencial e crescimento':
      diagnosticos = potencialCrescimentoDiagnosticosWellness
      break
    case 'proposito-equilibrio':
    case 'quiz-proposito-equilibrio':
    case 'purpose-and-balance':
    case 'propósito e equilíbrio':
      diagnosticos = propositoEquilibrioDiagnosticosWellness
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

  if (!diagnosticos[profissao] || !diagnosticos[profissao][resultadoId]) {
    return null
  }

  return diagnosticos[profissao][resultadoId]
}

export const diagnosticosNutri: Record<string, DiagnosticosPorFerramenta> = {
  'avaliacao-inicial': avaliacaoInicialDiagnosticos,
  'template-avaliacao-inicial': avaliacaoInicialDiagnosticos,
  'calculadora-agua': calculadoraAguaDiagnosticos,
  'calculadora-calorias': calculadoraCaloriasDiagnosticos,
  'calculadora-imc': calculadoraImcDiagnosticos,
  'calculadora-proteina': calculadoraProteinaDiagnosticos,
  'cardapio-detox': cardapioDetoxDiagnosticos,
  'checklist-alimentar': checklistAlimentarDiagnosticos,
  'checklist-detox': checklistDetoxDiagnosticos,
  'diario-alimentar': diarioAlimentarDiagnosticos,
  'desafio-7-dias': desafio7DiasDiagnosticos,
  'template-desafio-7dias': desafio7DiasDiagnosticos,
  'desafio-21-dias': desafio21DiasDiagnosticos,
  'template-desafio-21dias': desafio21DiasDiagnosticos,
  'formulario-recomendacao': formularioRecomendacaoDiagnosticos,
  'guia-hidratacao': guiaHidratacaoDiagnosticos,
  'guia-nutraceutico': guiaNutraceuticoDiagnosticos,
  'guia-proteico': guiaProteicoDiagnosticos,
  'infografico-educativo': infograficoEducativoDiagnosticos,
  'mini-ebook': miniEbookDiagnosticos,
  'planner-refeicoes': plannerRefeicoesDiagnosticos,
  'plano-alimentar-base': planoAlimentarBaseDiagnosticos,
  'quiz-bem-estar': quizBemEstarDiagnosticos,
  'quiz-detox': quizDetoxDiagnosticos,
  'quiz-energetico': quizEnergeticoDiagnosticos,
  'quiz-interativo': quizInterativoDiagnosticos,
  'quiz-perfil-nutricional': quizPerfilNutricionalDiagnosticos,
  'rastreador-alimentar': rastreadorAlimentarDiagnosticos,
  'receitas': receitasDiagnosticos,
  'template-receitas': receitasDiagnosticos,
  'simulador-resultados': simuladorResultadosDiagnosticos,
  'story-interativo': storyInterativoDiagnosticos,
  'template-story-interativo': storyInterativoDiagnosticos,
  'tabela-comparativa': tabelaComparativaDiagnosticos,
  'tabela-metas-semanais': tabelaMetasSemanaisDiagnosticos,
  'tabela-sintomas': tabelaSintomasDiagnosticos,
  'tabela-substituicoes': tabelaSubstituicoesDiagnosticos
}

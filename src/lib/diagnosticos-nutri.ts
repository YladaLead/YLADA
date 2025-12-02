import type { DiagnosticoCompleto, DiagnosticosPorFerramenta } from './diagnostics/types'

import { alimentacaoRotinaDiagnosticos } from './diagnostics/nutri/alimentacao-rotina'
import { alimentacaoSaudavelDiagnosticos } from './diagnostics/nutri/alimentacao-saudavel'
import { avaliacaoEmocionalDiagnosticos } from './diagnostics/nutri/avaliacao-emocional'
import { avaliacaoInicialDiagnosticos } from './diagnostics/nutri/avaliacao-inicial'
import { avaliacaoIntoleranciaDiagnosticos } from './diagnostics/nutri/avaliacao-intolerancia'
import { avaliacaoSonoEnergiaDiagnosticos } from './diagnostics/nutri/avaliacao-sono-energia'
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
import { guiaHidratacaoDiagnosticos } from './diagnostics/nutri/guia-hidratacao'
import { guiaNutraceuticoDiagnosticos } from './diagnostics/nutri/guia-nutraceutico'
import { guiaProteicoDiagnosticos } from './diagnostics/nutri/guia-proteico'
import { infograficoEducativoDiagnosticos } from './diagnostics/nutri/infografico-educativo'
import { miniEbookDiagnosticos } from './diagnostics/nutri/mini-ebook'
import { nutridoVsAlimentadoDiagnosticos } from './diagnostics/nutri/nutrido-vs-alimentado'
import { perfilIntestinoDiagnosticos } from './diagnostics/nutri/perfil-intestino'
import { perfilMetabolicoDiagnosticos } from './diagnostics/nutri/perfil-metabolico'
import { plannerRefeicoesDiagnosticos } from './diagnostics/nutri/planner-refeicoes'
import { planoAlimentarBaseDiagnosticos } from './diagnostics/nutri/plano-alimentar-base'
import { prontoEmagrecerDiagnosticos } from './diagnostics/nutri/pronto-emagrecer'
import { quizPedindoDetoxDiagnosticos } from './diagnostics/nutri/quiz-pedindo-detox'
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
  guiaHidratacaoDiagnosticos,
  guiaNutraceuticoDiagnosticos,
  guiaProteicoDiagnosticos,
  infograficoEducativoDiagnosticos,
  miniEbookDiagnosticos,
  nutridoVsAlimentadoDiagnosticos,
  perfilMetabolicoDiagnosticos,
  plannerRefeicoesDiagnosticos,
  planoAlimentarBaseDiagnosticos,
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
  tipoFomeDiagnosticos
}

export function getDiagnostico(
  ferramentaId: string,
  profissao: string,
  resultadoId: string
): DiagnosticoCompleto | null {
  let diagnosticos: DiagnosticosPorFerramenta | null = null

  switch (ferramentaId) {
    case 'quiz-interativo':
    case 'quiz-interativo-nutri':
      diagnosticos = quizInterativoDiagnosticos
      break
    case 'quiz-bem-estar':
    case 'quiz-bem-estar-nutri':
    case 'wellness-profile':
    case 'descubra-seu-perfil-de-bem-estar':
    case 'descoberta-perfil-bem-estar':
      diagnosticos = quizBemEstarDiagnosticos
      break
    case 'quiz-perfil-nutricional':
      diagnosticos = quizPerfilNutricionalDiagnosticos
      break
    case 'quiz-detox':
    case 'quiz-detox-nutri':
      diagnosticos = quizDetoxDiagnosticos
      break
    case 'quiz-pedindo-detox':
    case 'seu-corpo-esta-pedindo-detox':
      diagnosticos = quizPedindoDetoxDiagnosticos
      break
    case 'disciplinado-emocional':
    case 'disciplinado-emocional-nutri':
      diagnosticos = disciplinadoEmocionalDiagnosticos
      break
    case 'quiz-energetico':
    case 'quiz-energetico-nutri':
      diagnosticos = quizEnergeticoDiagnosticos
      break
    case 'avaliacao-sono-energia':
    case 'quiz-sono-energia':
      diagnosticos = avaliacaoSonoEnergiaDiagnosticos
      break
    case 'avaliacao-emocional':
    case 'quiz-emocional':
      diagnosticos = avaliacaoEmocionalDiagnosticos
      break
    case 'avaliacao-intolerancia':
    case 'avaliacao-intolerancia-nutri':
    case 'quiz-intolerancia':
    case 'intolerancia':
      diagnosticos = avaliacaoIntoleranciaDiagnosticos
      break
    case 'avaliacao-perfil-metabolico':
    case 'avaliacao-perfil-metabolico-nutri':
    case 'quiz-perfil-metabolico':
    case 'perfil-metabolico':
    case 'perfil-metabólico':
      diagnosticos = perfilMetabolicoDiagnosticos
      break
    case 'avaliacao-inicial':
    case 'avaliacao-inicial-nutri':
    case 'quiz-avaliacao-inicial':
    case 'template-avaliacao-inicial':
      diagnosticos = avaliacaoInicialDiagnosticos
      break
    case 'diagnostico-eletrolitos':
    case 'diagnostico-eletrolitos-nutri':
    case 'quiz-eletrolitos':
    case 'eletrolitos':
    case 'eletrólitos':
      diagnosticos = diagnosticoEletrolitosDiagnosticos
      break
    case 'template-diagnostico-parasitose':
    case 'diagnostico-parasitose':
    case 'parasitose':
      diagnosticos = diagnosticoParasitoseDiagnosticos
      break
    case 'diagnostico-sintomas-intestinais':
    case 'diagnostico-sintomas-intestinais-nutri':
    case 'quiz-sintomas-intestinais':
    case 'sintomas-intestinais':
    case 'sintomas intestinais':
      diagnosticos = diagnosticoSintomasIntestinaisDiagnosticos
      break
    case 'perfil-intestino':
    case 'qual-e-seu-perfil-de-intestino':
      diagnosticos = perfilIntestinoDiagnosticos
      break
    case 'pronto-emagrecer':
    case 'pronto-emagrecer-nutri':
    case 'quiz-pronto-emagrecer':
    case 'pronto para emagrecer':
      diagnosticos = prontoEmagrecerDiagnosticos
      break
    case 'tipo-fome':
    case 'quiz-tipo-fome':
    case 'qual-e-o-seu-tipo-de-fome':
    case 'tipo de fome':
      diagnosticos = tipoFomeDiagnosticos
      break
    case 'alimentacao-saudavel':
    case 'quiz-alimentacao-saudavel':
    case 'quiz-alimentacao-nutri':
    case 'healthy-eating-quiz':
    case 'healthy-eating':
      diagnosticos = alimentacaoSaudavelDiagnosticos
      break
    case 'sindrome-metabolica':
    case 'sindrome-metabolica-nutri':
    case 'risco-sindrome-metabolica':
    case 'metabolic-syndrome-risk':
    case 'metabolic-syndrome':
      diagnosticos = sindromeMetabolicaDiagnosticos
      break
    case 'retencao-liquidos':
    case 'retencao-liquidos-nutri':
    case 'teste-retencao-liquidos':
    case 'water-retention-test':
    case 'water-retention':
      diagnosticos = retencaoLiquidosDiagnosticos
      break
    case 'conhece-seu-corpo':
    case 'conhece-seu-corpo-nutri':
    case 'voce-conhece-seu-corpo':
    case 'body-awareness':
    case 'autoconhecimento-corporal':
      diagnosticos = conheceSeuCorpoDiagnosticos
      break
    case 'nutrido-vs-alimentado':
    case 'nutrido-vs-alimentado-nutri':
    case 'voce-nutrido-ou-apenas-alimentado':
    case 'nourished-vs-fed':
    case 'nutrido ou alimentado':
      diagnosticos = nutridoVsAlimentadoDiagnosticos
      break
    case 'alimentacao-rotina':
    case 'alimentacao-rotina-nutri':
    case 'voce-alimentando-conforme-rotina':
    case 'avaliacao-rotina-alimentar':
    case 'voce-esta-se-alimentando-conforme-sua-rotina':
    case 'eating-routine':
    case 'alimentação conforme rotina':
      diagnosticos = alimentacaoRotinaDiagnosticos
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
      diagnosticos = desafio7DiasDiagnosticos
      break
    case 'template-desafio-21dias':
    case 'desafio-21-dias':
    case 'desafio-21-dias-nutri':
      diagnosticos = desafio21DiasDiagnosticos
      break
    case 'guia-hidratacao':
      diagnosticos = guiaHidratacaoDiagnosticos
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

  // Nutri agora usa apenas diagnósticos Nutri (independente)
  if (!diagnosticos['nutri'] || !diagnosticos['nutri'][resultadoId]) {
    return null
  }

  return diagnosticos['nutri'][resultadoId]
}

export const diagnosticosNutri: Record<string, DiagnosticosPorFerramenta> = {
  'alimentacao-rotina': alimentacaoRotinaDiagnosticos,
  'alimentacao-rotina-nutri': alimentacaoRotinaDiagnosticos,
  'voce-alimentando-conforme-rotina': alimentacaoRotinaDiagnosticos,
  'avaliacao-rotina-alimentar': alimentacaoRotinaDiagnosticos,
  'voce-esta-se-alimentando-conforme-sua-rotina': alimentacaoRotinaDiagnosticos,
  'alimentacao-saudavel': alimentacaoSaudavelDiagnosticos,
  'quiz-alimentacao-saudavel': alimentacaoSaudavelDiagnosticos,
  'quiz-alimentacao-nutri': alimentacaoSaudavelDiagnosticos,
  'avaliacao-emocional': avaliacaoEmocionalDiagnosticos,
  'quiz-emocional': avaliacaoEmocionalDiagnosticos,
  'avaliacao-inicial': avaliacaoInicialDiagnosticos,
  'avaliacao-inicial-nutri': avaliacaoInicialDiagnosticos,
  'template-avaliacao-inicial': avaliacaoInicialDiagnosticos,
  'avaliacao-intolerancia': avaliacaoIntoleranciaDiagnosticos,
  'avaliacao-intolerancia-nutri': avaliacaoIntoleranciaDiagnosticos,
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
  'conhece-seu-corpo-nutri': conheceSeuCorpoDiagnosticos,
  'voce-conhece-seu-corpo': conheceSeuCorpoDiagnosticos,
  'autoconhecimento-corporal': conheceSeuCorpoDiagnosticos,
  'diario-alimentar': diarioAlimentarDiagnosticos,
  'desafio-7-dias': desafio7DiasDiagnosticos,
  'template-desafio-7dias': desafio7DiasDiagnosticos,
  'desafio-21-dias': desafio21DiasDiagnosticos,
  'desafio-21-dias-nutri': desafio21DiasDiagnosticos,
  'template-desafio-21dias': desafio21DiasDiagnosticos,
  'diagnostico-eletrolitos': diagnosticoEletrolitosDiagnosticos,
  'diagnostico-eletrolitos-nutri': diagnosticoEletrolitosDiagnosticos,
  'quiz-eletrolitos': diagnosticoEletrolitosDiagnosticos,
  'eletrolitos': diagnosticoEletrolitosDiagnosticos,
  'eletrólitos': diagnosticoEletrolitosDiagnosticos,
  'template-diagnostico-parasitose': diagnosticoParasitoseDiagnosticos,
  'diagnostico-parasitose': diagnosticoParasitoseDiagnosticos,
  'diagnostico-sintomas-intestinais': diagnosticoSintomasIntestinaisDiagnosticos,
  'diagnostico-sintomas-intestinais-nutri': diagnosticoSintomasIntestinaisDiagnosticos,
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
  'nutrido-vs-alimentado-nutri': nutridoVsAlimentadoDiagnosticos,
  'voce-nutrido-ou-apenas-alimentado': nutridoVsAlimentadoDiagnosticos,
  'nutrido ou alimentado': nutridoVsAlimentadoDiagnosticos,
  'perfil-metabolico': perfilMetabolicoDiagnosticos,
  'avaliacao-perfil-metabolico': perfilMetabolicoDiagnosticos,
  'avaliacao-perfil-metabolico-nutri': perfilMetabolicoDiagnosticos,
  'quiz-perfil-metabolico': perfilMetabolicoDiagnosticos,
  'planner-refeicoes': plannerRefeicoesDiagnosticos,
  'plano-alimentar-base': planoAlimentarBaseDiagnosticos,
  'pronto-emagrecer': prontoEmagrecerDiagnosticos,
  'pronto-emagrecer-nutri': prontoEmagrecerDiagnosticos,
  'quiz-pronto-emagrecer': prontoEmagrecerDiagnosticos,
  'quiz-bem-estar': quizBemEstarDiagnosticos,
  'quiz-bem-estar-nutri': quizBemEstarDiagnosticos,
  'descoberta-perfil-bem-estar': quizBemEstarDiagnosticos,
  'descubra-seu-perfil-de-bem-estar': quizBemEstarDiagnosticos,
  'disciplinado-emocional': disciplinadoEmocionalDiagnosticos,
  'disciplinado-emocional-nutri': disciplinadoEmocionalDiagnosticos,
  'quiz-detox': quizDetoxDiagnosticos,
  'quiz-detox-nutri': quizDetoxDiagnosticos,
  'quiz-pedindo-detox': quizPedindoDetoxDiagnosticos,
  'seu-corpo-esta-pedindo-detox': quizPedindoDetoxDiagnosticos,
  'quiz-energetico': quizEnergeticoDiagnosticos,
  'quiz-energetico-nutri': quizEnergeticoDiagnosticos,
  'avaliacao-sono-energia': avaliacaoSonoEnergiaDiagnosticos,
  'quiz-sono-energia': avaliacaoSonoEnergiaDiagnosticos,
  'quiz-interativo': quizInterativoDiagnosticos,
  'quiz-interativo-nutri': quizInterativoDiagnosticos,
  'quiz-perfil-nutricional': quizPerfilNutricionalDiagnosticos,
  'rastreador-alimentar': rastreadorAlimentarDiagnosticos,
  'receitas': receitasDiagnosticos,
  'template-receitas': receitasDiagnosticos,
  'retencao-liquidos': retencaoLiquidosDiagnosticos,
  'retencao-liquidos-nutri': retencaoLiquidosDiagnosticos,
  'teste-retencao-liquidos': retencaoLiquidosDiagnosticos,
  'simulador-resultados': simuladorResultadosDiagnosticos,
  'sindrome-metabolica': sindromeMetabolicaDiagnosticos,
  'sindrome-metabolica-nutri': sindromeMetabolicaDiagnosticos,
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

import type { DiagnosticoCompleto, DiagnosticosPorFerramenta } from './diagnostics/types'

// Coach usa diagnósticos próprios e independentes
import { alimentacaoRotinaDiagnosticos } from './diagnostics/coach/alimentacao-rotina'
import { alimentacaoSaudavelDiagnosticos } from './diagnostics/coach/alimentacao-saudavel'
import { avaliacaoEmocionalDiagnosticos } from './diagnostics/coach/avaliacao-emocional'
import { avaliacaoInicialDiagnosticos } from './diagnostics/coach/avaliacao-inicial'
import { avaliacaoIntoleranciaDiagnosticos } from './diagnostics/coach/avaliacao-intolerancia'
import { calculadoraAguaDiagnosticos } from './diagnostics/coach/calculadora-agua'
import { calculadoraCaloriasDiagnosticos } from './diagnostics/coach/calculadora-calorias'
import { calculadoraImcDiagnosticos } from './diagnostics/coach/calculadora-imc'
import { calculadoraProteinaDiagnosticos } from './diagnostics/coach/calculadora-proteina'
import { cardapioDetoxDiagnosticos } from './diagnostics/coach/cardapio-detox'
import { checklistAlimentarDiagnosticos } from './diagnostics/coach/checklist-alimentar'
import { checklistDetoxDiagnosticos } from './diagnostics/coach/checklist-detox'
import { conheceSeuCorpoDiagnosticos } from './diagnostics/coach/conhece-seu-corpo'
import { diarioAlimentarDiagnosticos } from './diagnostics/coach/diario-alimentar'
import { desafio21DiasDiagnosticos } from './diagnostics/coach/desafio-21-dias'
import { desafio7DiasDiagnosticos } from './diagnostics/coach/desafio-7-dias'
import { diagnosticoEletrolitosDiagnosticos } from './diagnostics/coach/diagnostico-eletrolitos'
import { diagnosticoParasitoseDiagnosticos } from './diagnostics/coach/diagnostico-parasitose'
import { diagnosticoSintomasIntestinaisDiagnosticos } from './diagnostics/coach/diagnostico-sintomas-intestinais'
import { formularioRecomendacaoDiagnosticos } from './diagnostics/coach/formulario-recomendacao'
import { guiaHidratacaoDiagnosticos } from './diagnostics/coach/guia-hidratacao'
import { guiaNutraceuticoDiagnosticos } from './diagnostics/coach/guia-nutraceutico'
import { guiaProteicoDiagnosticos } from './diagnostics/coach/guia-proteico'
import { infograficoEducativoDiagnosticos } from './diagnostics/coach/infografico-educativo'
import { miniEbookDiagnosticos } from './diagnostics/coach/mini-ebook'
import { nutridoVsAlimentadoDiagnosticos } from './diagnostics/coach/nutrido-vs-alimentado'
import { perfilMetabolicoDiagnosticos } from './diagnostics/coach/perfil-metabolico'
import { plannerRefeicoesDiagnosticos } from './diagnostics/coach/planner-refeicoes'
import { planoAlimentarBaseDiagnosticos } from './diagnostics/coach/plano-alimentar-base'
import { prontoEmagrecerDiagnosticos } from './diagnostics/coach/pronto-emagrecer'
import { quizBemEstarDiagnosticos } from './diagnostics/coach/quiz-bem-estar'
import { quizDetoxDiagnosticos } from './diagnostics/coach/quiz-detox'
import { quizEnergeticoDiagnosticos } from './diagnostics/coach/quiz-energetico'
import { quizInterativoDiagnosticos } from './diagnostics/coach/quiz-interativo'
import { quizPerfilNutricionalDiagnosticos } from './diagnostics/coach/quiz-perfil-nutricional'
import { rastreadorAlimentarDiagnosticos } from './diagnostics/coach/rastreador-alimentar'
import { receitasDiagnosticos } from './diagnostics/coach/receitas'
import { retencaoLiquidosDiagnosticos } from './diagnostics/coach/retencao-liquidos'
import { simuladorResultadosDiagnosticos } from './diagnostics/coach/simulador-resultados'
import { sindromeMetabolicaDiagnosticos } from './diagnostics/coach/sindrome-metabolica'
import { storyInterativoDiagnosticos } from './diagnostics/coach/story-interativo'
import { tabelaComparativaDiagnosticos } from './diagnostics/coach/tabela-comparativa'
import { tabelaMetasSemanaisDiagnosticos } from './diagnostics/coach/tabela-metas-semanais'
import { tabelaSintomasDiagnosticos } from './diagnostics/coach/tabela-sintomas'
import { tabelaSubstituicoesDiagnosticos } from './diagnostics/coach/tabela-substituicoes'
import { tipoFomeDiagnosticos } from './diagnostics/coach/tipo-fome'
import { disciplinadoEmocionalDiagnosticos } from './diagnostics/coach/disciplinado-emocional'
import { perfilIntestinoDiagnosticos } from './diagnostics/coach/perfil-intestino'
import { avaliacaoSonoEnergiaDiagnosticos } from './diagnostics/coach/avaliacao-sono-energia'
import { quizPedindoDetoxDiagnosticos } from './diagnostics/coach/quiz-pedindo-detox'


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
  tipoFomeDiagnosticos,
  perfilIntestinoDiagnosticos,
  avaliacaoSonoEnergiaDiagnosticos,
  quizPedindoDetoxDiagnosticos
}

// Função para substituir "nutricionista" por "Coach de bem-estar" nos diagnósticos
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
      diagnosticos = avaliacaoEmocionalDiagnosticos
      break
    case 'avaliacao-intolerancia':
    case 'quiz-intolerancia':
    case 'intolerancia':
      diagnosticos = avaliacaoIntoleranciaDiagnosticos
      break
    case 'avaliacao-perfil-metabolico':
    case 'quiz-perfil-metabolico':
    case 'perfil-metabolico':
    case 'perfil-metabólico':
      diagnosticos = perfilMetabolicoDiagnosticos
      break
    case 'avaliacao-inicial':
    case 'quiz-avaliacao-inicial':
    case 'template-avaliacao-inicial':
      diagnosticos = avaliacaoInicialDiagnosticos
      break
    case 'diagnostico-eletrolitos':
    case 'quiz-eletrolitos':
    case 'eletrolitos':
    case 'eletrólitos':
      diagnosticos = diagnosticoEletrolitosDiagnosticos
      break
    case 'diagnostico-sintomas-intestinais':
    case 'quiz-sintomas-intestinais':
    case 'sintomas-intestinais':
    case 'sintomas intestinais':
      diagnosticos = diagnosticoSintomasIntestinaisDiagnosticos
      break
    case 'pronto-emagrecer':
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
    case 'healthy-eating-quiz':
    case 'healthy-eating':
      diagnosticos = alimentacaoSaudavelDiagnosticos
      break
    case 'sindrome-metabolica':
    case 'risco-sindrome-metabolica':
    case 'metabolic-syndrome-risk':
    case 'metabolic-syndrome':
      diagnosticos = sindromeMetabolicaDiagnosticos
      break
    case 'retencao-liquidos':
    case 'teste-retencao-liquidos':
    case 'water-retention-test':
    case 'water-retention':
      diagnosticos = retencaoLiquidosDiagnosticos
      break
    case 'conhece-seu-corpo':
    case 'voce-conhece-seu-corpo':
    case 'body-awareness':
    case 'autoconhecimento-corporal':
      diagnosticos = conheceSeuCorpoDiagnosticos
      break
    case 'nutrido-vs-alimentado':
    case 'voce-nutrido-ou-apenas-alimentado':
    case 'nourished-vs-fed':
    case 'nutrido ou alimentado':
      diagnosticos = nutridoVsAlimentadoDiagnosticos
      break
    case 'alimentacao-rotina':
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

  // Coach agora tem diagnósticos próprios e independentes
  if (!diagnosticos['coach'] || !diagnosticos['coach'][resultadoId]) {
    return null
  }

  return diagnosticos['coach'][resultadoId]
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

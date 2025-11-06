/**
 * DIAGNÓSTICOS: Exportação Centralizada - ÁREA WELLNESS
 * 
 * Exporta todos os diagnósticos Wellness para uso nas páginas
 * Todos os textos foram copiados do arquivo original diagnosticos-nutri.ts
 */

// Calculadoras
export { calculadoraImcDiagnosticos } from './wellness/calculadora-imc'
export { calculadoraProteinaDiagnosticos } from './wellness/calculadora-proteina'
export { calculadoraAguaDiagnosticos } from './wellness/calculadora-agua'
export { calculadoraCaloriasDiagnosticos } from './wellness/calculadora-calorias'

// Checklists
export { checklistAlimentarDiagnosticos } from './wellness/checklist-alimentar'
export { checklistDetoxDiagnosticos } from './wellness/checklist-detox'

// Quizzes
export { quizInterativoDiagnosticos } from './wellness/quiz-interativo'
export { quizBemEstarDiagnosticos } from './wellness/quiz-bem-estar'
export { quizPerfilNutricionalDiagnosticos } from './wellness/quiz-perfil-nutricional'
export { quizDetoxDiagnosticos } from './wellness/quiz-detox'
export { quizEnergeticoDiagnosticos } from './wellness/quiz-energetico'

// Guias e Conteúdos
export { miniEbookDiagnosticos } from './wellness/mini-ebook'
export { guiaNutraceuticoDiagnosticos } from './wellness/guia-nutraceutico'
export { guiaProteicoDiagnosticos } from './wellness/guia-proteico'
export { guiaHidratacaoDiagnosticos } from './wellness/guia-hidratacao'

// Desafios
export { desafio7DiasDiagnosticos } from './wellness/desafio-7-dias'
export { desafio21DiasDiagnosticos } from './wellness/desafio-21-dias'

// Types
export type { DiagnosticosPorFerramenta, DiagnosticoCompleto, ResultadoPossivel } from './types'


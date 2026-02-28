/**
 * YLADA — Links inteligentes e Strong Diagnosis Engine.
 * @see docs/LINKS-INTELIGENTES-DIAGNOSIS-ENGINE-SPEC.md
 * @see docs/CHECKLIST-LINKS-INTELIGENTES-ETAPAS.md
 */

export { generateDiagnosis } from './diagnosis-engine'
export { validateDiagnosisDecision } from './diagnosis-validation'
export {
  fillSlots,
  pickTitle,
  pickCtaButton,
  DIAGNOSIS_TEMPLATES,
} from './diagnosis-templates'
export type {
  DiagnosisInput,
  DiagnosisDecisionOutput,
  DiagnosisGenerationResult,
  DiagnosisOutput,
  DiagnosisResult,
  DiagnosisCta,
  LinkObjective,
  AreaProfissional,
  DiagnosisArchitecture,
  RiskLevel,
  BlockerType,
  ProfileTypeName,
} from './diagnosis-types'
export { DiagnosisValidationError } from './diagnosis-types'
export type { ArchitectureTemplates } from './diagnosis-templates'

export { getStrategies } from './strategies'
export type { StrategiesInput, StrategiesOutput, StrategyCard, AreaSegment } from './strategies'

export { classifyTheme, interpretStrategyContext } from './strategic-interpreter'
export type {
  ThemeClassification,
  StrategyContextDecision,
  StrategyContextInput,
  SafeThemeContext,
} from './strategic-interpreter'
export { detectSafeThemeContext } from './strategic-interpreter'
export { getStrategicIntro } from './strategic-intro'
export type { StrategicIntroContent, StrategicIntroContext } from './strategic-intro'
export { deriveStrategicProfile, getAdaptedCta, getAdaptedDiagnosisOpening } from './strategic-profile'
export type { StrategicProfile, MaturityStage, DominantPain, UrgencyLevel, StrategicMindset } from './strategic-profile'
export { getAdaptiveDiagnosisIntro, getAdvancedCta } from './adaptive-diagnosis'
export type { DiagnosisBaseLevel } from './adaptive-diagnosis'

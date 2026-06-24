// Revisor — a Régua de Qualidade dos Diagnósticos virada código (Chat 8, tijolo 1).
// Adição pura, inerte. Ver regua.ts para o design e a honestidade (determinístico × tom).
export {
  avaliarFluxo,
  resumirLaudo,
  type Veredito,
  type ParteDiagnostico,
  type NotaParte,
  type LaudoFluxo,
} from './regua'
export {
  revisarFluxos,
  partesQueFalharam,
  resumirPendencias,
  montarPromptAfiar,
  type RelatorioRevisao,
} from './revisor'

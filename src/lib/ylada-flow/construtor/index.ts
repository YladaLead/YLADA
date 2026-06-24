// Construtor de Fluxos permissionado (Chat 8, tijolo 3). Adição pura, inerte.
// Três portões: permissão (matriz §6) + fórmula validada (§12.2) + Régua (revisor).
export {
  podeCriarFluxo,
  type PapelCriacao,
  type ContextoPermissao,
  type ResultadoPermissao,
} from './permissoes'
export {
  validarConstrucao,
  formulaIdsDisponiveis,
  type ResultadoConstrucao,
} from './construtor'

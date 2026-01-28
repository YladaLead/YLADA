/**
 * Carol v2 — módulos do novo sistema (fase, scripts, carol-reply, disparos).
 * Lei do sistema: tags + contexto → fase (ver fase.ts e fase.casos.ts).
 * Testes da fase: npm run test:fase
 */

export { getFaseFromTagsAndContext, type Fase, type ContextoFase } from './fase'
export {
  type OpcaoAula,
  getScriptBoasVindasComClique,
  getScriptBoasVindasSemClique,
  getScriptPreAula24h,
  getScriptPreAula12h,
  getScriptPreAula2h,
  getScriptPreAula30min,
  getScriptPreAula10min,
  getScriptLinkPosParticipou,
  getScriptRemarketing,
  getScriptFollowUpNaoRespondeu24h,
  getScriptFollowUpNaoRespondeu48h,
  getScriptFollowUpNaoRespondeu72h,
} from './scripts-workshop'
export {
  replyAsCarol,
  type ReplyAsCarolParams,
  type ReplyAsCarolResult,
} from './carol-reply'
export {
  enviarBoasVindasSemClique,
  enviarPreAula,
  enviarLinkPosParticipou,
  enviarRemarketing,
  enviarFollowUpNaoRespondeu,
  type EnvioResult,
} from './disparos'
export { runWorker, type WorkerResult } from './worker'

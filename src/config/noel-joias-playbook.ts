/**
 * Playbook curto do Noel por linha de produto (joias).
 * Reutiliza a mesma filosofia YLADA (qualificar antes do preço, diagnóstico, WhatsApp);
 * só ajusta vocabulário, objeções típicas e ênfase — não substitui SEGMENT_CONTEXT nem o resumo do perfil.
 */

import {
  JOIAS_AREA_SPECIFIC_JEWELRY_LINE,
  type JoiasLinhaProduto,
  isValidJoiasLinhaProduto,
  labelJoiasLinhaProduto,
} from '@/config/joias-linha-produto'
import type { YladaNoelProfileRow } from '@/lib/ylada-profile-resumo'

const PLAYBOOK: Record<JoiasLinhaProduto, string> = {
  joia_fina: [
    'Priorize confiança, procedência e critério de escolha antes de valores.',
    'Convite a usar o diagnóstico para entender ocasião, estilo e sensibilidade (ex.: presente, uso diário, peça única).',
    'Evite soar como marketplace: destaque atendimento, garantia e experiência.',
    'Scripts de WhatsApp: tom consultivo, poucas opções bem explicadas, pedido de permissão antes de enviar catálogo.',
    'Se pedirem “só o preço”, devolva com 1–2 perguntas de contexto e uma frase de valor (material, durabilidade, serviço).',
  ].join('\n'),
  semijoia: [
    'Aqui a percepção de qualidade e “vale a pena” importa tanto quanto o preço.',
    'Use o funil para separar curiosos de quem já tem intenção (ocasião, combinação com outras peças, troca).',
    'Oriente perguntas antes do catálogo: uso, alergias, ocasião, referência de estilo.',
    'WhatsApp: fotos com luz neutra, poucas peças por mensagem, próximo passo claro (prova, reserva, link de pagamento).',
    'Se a conversa travar em parcelamento, alinhe valor (garantia, ajuste, composição) sem alongar.',
  ].join('\n'),
  bijuteria: [
    'Volume e tendência puxam para comparação de preço — o diagnóstico deve puxar ocasião, kit e estilo antes do valor.',
    'Ajude a profissional a filtrar curiosos de quem quer fechar (presente, evento, troca frequente).',
    'Sugira roteiros curtos: 3 perguntas antes de mostrar faixa de preço; ofertas em conjunto quando fizer sentido.',
    'Redes e WhatsApp: tom leve, linguagem de tendência sem diminuir a profissional.',
    'Se pedirem preço logo no início, reconheça e redirecione (“pra te indicar certo, me diz…”).',
  ].join('\n'),
}

/**
 * Bloco opcional para o system prompt quando há `area_specific.jewelry_line` válido.
 */
export function getNoelJoiasLinhaPlaybookBlock(profile: YladaNoelProfileRow | null): string | null {
  if (!profile || profile.segment !== 'joias') return null
  const as =
    profile.area_specific && typeof profile.area_specific === 'object'
      ? (profile.area_specific as Record<string, unknown>)
      : {}
  const raw = as[JOIAS_AREA_SPECIFIC_JEWELRY_LINE]
  const linha =
    typeof raw === 'string' && isValidJoiasLinhaProduto(raw) ? (raw as JoiasLinhaProduto) : null
  if (!linha) return null

  const label = labelJoiasLinhaProduto(linha)
  const body = PLAYBOOK[linha]
  return (
    `\n[PLAYBOOK — LINHA DE PRODUTO: ${label}]\n` +
    'Instruções adicionais (complementam o perfil e o método YLADA; não contradizem):\n' +
    body
  )
}

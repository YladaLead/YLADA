/**
 * Converte FluxoCliente legado → contrato YladaFlow (ponte de migração).
 */
import type { FluxoCliente } from '@/types/ylada-flow-legacy'
import type { YladaFlow } from '@/types/ylada-flow'

export type FluxoClienteToYladaFlowOptions = {
  ownerId: string
  tenantId?: string
  kind: 'sales' | 'recruitment'
  handle?: string
}

export function fluxoClienteToYladaFlow(
  fluxo: FluxoCliente,
  opts: FluxoClienteToYladaFlowOptions
): YladaFlow {
  const tenantId = opts.tenantId?.trim() || opts.ownerId
  const handle = (opts.handle ?? fluxo.id).trim() || fluxo.id
  const finalidade = opts.kind === 'recruitment' ? 'recrutamento' : 'vendas'
  const funil: YladaFlow['dimensoes']['funil'] = 'marketing'

  return {
    id: fluxo.id,
    handle,
    nome: fluxo.nome,
    objetivo: fluxo.objetivo,
    tenantId,
    ownerId: opts.ownerId,
    dimensoes: {
      frente: 'digital',
      nicho: 'pro-lideres',
      regiao: 'BR',
      funil,
      tipo: fluxo.id.startsWith('calc-') || fluxo.id === 'agua' ? 'calculadora' : 'quiz',
      finalidade,
      governanca: ['bem-estar'],
    },
    idiomaPadrao: 'pt',
    abertura: {
      gancho: fluxo.objetivo,
      baixaFriccao: 'sem cadastro · poucas perguntas · resultado na hora',
      ctaUnico: 'Começar',
    },
    origemEsperada: {
      canal: 'whatsapp',
      funil,
      temperatura: 'morno',
    },
    perguntas: fluxo.perguntas.map((p) => ({
      ...p,
      papel: {
        alimentaLeitura: ['perfil', 'contexto'],
        separa2080: { peso: 1 },
      },
    })),
    separacao2080: {
      regraId: funil === 'marketing' ? 'marketing-default' : 'vendas-default',
    },
    devolutiva: {
      porPerfil: {
        pronto: {
          espelho: fluxo.diagnostico.descricao,
          causa: fluxo.diagnostico.sintomas.slice(0, 2).join('; ') || fluxo.diagnostico.descricao,
          primeiroPasso: fluxo.diagnostico.beneficios[0] ?? fluxo.diagnostico.mensagemPositiva ?? '',
          ctaWhatsApp: fluxo.cta,
        },
        curioso: {
          espelho: fluxo.diagnostico.descricao,
          causa: fluxo.diagnostico.sintomas[0] ?? fluxo.diagnostico.descricao,
          primeiroPasso: fluxo.diagnostico.mensagemPositiva ?? fluxo.diagnostico.beneficios[0] ?? '',
          ctaWhatsApp: fluxo.cta,
        },
      },
    },
    ganchosIndicacao: [],
    handoff: {
      templateId: 'handoff-padrao',
      inclui: {
        resumoRespostas: true,
        classificacao2080: true,
        scriptSugerido: true,
      },
    },
    tags: fluxo.tags ?? [],
  }
}

/**
 * WELLNESS SYSTEM - Sistema de Follow-up Automático
 * 
 * Templates de mensagens de follow-up para diferentes momentos
 */

export interface FollowUpTemplate {
  id: string
  nome: string
  momento: 'pos-link' | 'pos-diagnostico' | 'pos-venda-1dia' | 'pos-venda-3dias' | 'pos-venda-7dias' | 'recompra'
  delayHoras: number // Horas após o evento para enviar
  conteudo: string
  ativo: boolean
}

export const followUpTemplates: FollowUpTemplate[] = [
  {
    id: 'follow-up-pos-link-1h',
    nome: 'Follow-up 1h após enviar link',
    momento: 'pos-link',
    delayHoras: 1,
    conteudo: `Oi! 👋

Vi que você ainda não completou o diagnóstico. 

Aconteceu algo? Precisa de ajuda?

Se quiser, posso te enviar o link novamente! 🔗`,
    ativo: true
  },
  {
    id: 'follow-up-pos-link-24h',
    nome: 'Follow-up 24h após enviar link',
    momento: 'pos-link',
    delayHoras: 24,
    conteudo: `Olá! 

Lembrei de você! Você começou o diagnóstico mas não completou.

Completar leva menos de 2 minutos e você descobre qual é a melhor solução para o seu caso.

Quer que eu te envie o link novamente? 🎯`,
    ativo: true
  },
  {
    id: 'follow-up-pos-diagnostico-2h',
    nome: 'Follow-up 2h após diagnóstico',
    momento: 'pos-diagnostico',
    delayHoras: 2,
    conteudo: `Oi! 

Vi que você completou o diagnóstico! 🎉

Seu perfil é: [PERFIL_IDENTIFICADO]

Quer que eu te explique melhor como funciona o [KIT_RECOMENDADO]?

Estou aqui para tirar qualquer dúvida! 😊`,
    ativo: true
  },
  {
    id: 'follow-up-pos-venda-1dia',
    nome: 'Follow-up 1 dia após venda',
    momento: 'pos-venda-1dia',
    delayHoras: 24,
    conteudo: `Oi! 

Você já recebeu o [PRODUTO]? 

Como está sendo a experiência? Está sentindo alguma diferença? 😊

Se tiver qualquer dúvida, estou aqui!`,
    ativo: true
  },
  {
    id: 'follow-up-pos-venda-3dias',
    nome: 'Follow-up 3 dias após venda',
    momento: 'pos-venda-3dias',
    delayHoras: 72,
    conteudo: `Olá! 

Como está indo com o [PRODUTO]? 

Já está no 3º dia de uso. Está gostando? Notou alguma melhoria?

Se precisar de algo, me avisa! 💚`,
    ativo: true
  },
  {
    id: 'follow-up-pos-venda-7dias',
    nome: 'Follow-up 7 dias após venda',
    momento: 'pos-venda-7dias',
    delayHoras: 168,
    conteudo: `Oi! 

Como foi sua experiência com o [PRODUTO]? 

Já completou uma semana! Está sentindo os benefícios?

Se quiser continuar, posso te preparar um novo pedido. O que acha? 🚀`,
    ativo: true
  },
  {
    id: 'follow-up-recompra',
    nome: 'Follow-up para recompra',
    momento: 'recompra',
    delayHoras: 120, // 5 dias antes do fim do kit
    conteudo: `Olá! 

Vi que você está no final do seu kit de 5 dias.

Como foi a experiência? Está sentindo os benefícios?

Se quiser continuar, posso te preparar um novo pedido. Quer que eu te passe os valores? 💰`,
    ativo: true
  }
]

export function getFollowUpByMomento(momento: FollowUpTemplate['momento']): FollowUpTemplate[] {
  return followUpTemplates.filter(template => template.momento === momento && template.ativo)
}

export function getFollowUpById(id: string): FollowUpTemplate | undefined {
  return followUpTemplates.find(template => template.id === id)
}


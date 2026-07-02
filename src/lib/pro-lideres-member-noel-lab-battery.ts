/**
 * Bateria oficial de testes do Noel membro (campo, usuário Herbalife).
 * Lente das respostas: Inteligência de Convicção — servir/educar antes de vender, ler o 20/80,
 * negócio ou educacional (nunca produto). O membro roda no motor da matriz e PODE criar link.
 * Cobre: atendimento, DIVULGAÇÃO (o que postar / onde divulgar o link), COMPORTAMENTO (WhatsApp)
 * e REORGANIZAÇÃO da própria rotina de campo.
 */

export const PRO_LIDERES_MEMBER_NOEL_LAB_BATTERY_ID = 'campo_conviccao_v2' as const

export type ProLideresMemberNoelLabQuestion = {
  id: string
  label: string
  text: string
  /** O que validar na resposta (orientação). */
  expectHint: string
}

export const PRO_LIDERES_MEMBER_NOEL_LAB_QUESTIONS: ProLideresMemberNoelLabQuestion[] = [
  {
    id: 'quem_e',
    label: 'Quem é / como ajuda',
    text: 'Oi, como você me ajuda no meu dia a dia?',
    expectHint: 'Se apresenta como apoio de CAMPO da operação; tom de conversa, não menu de funções.',
  },
  {
    id: 'lista',
    label: 'Prioridade da lista (20/80)',
    text: 'Quem eu priorizo na minha lista hoje? Tô perdida entre quem tá pronto e quem ainda não.',
    expectHint: 'Prioriza pela leitura (pronto × ainda educar); disciplina; curto e em ação.',
  },
  {
    id: 'curiosa_educar',
    label: 'Curiosa, não decidida (80%)',
    text: 'Tenho uma pessoa interessada mas só curiosa, ainda não decidida. O que faço?',
    expectHint: 'Serve/educa primeiro (os 80%); propõe um diagnóstico que ajuda a pessoa a se enxergar; NÃO empurra produto nem oportunidade.',
  },
  {
    id: 'objecao_preco',
    label: 'Objeção preço',
    text: 'A cliente disse que tá caro e vai pensar. Me orienta e me dá uma mensagem pronta.',
    expectHint: 'Serve/entende antes de defender preço; princípio + mensagem pronta; sem pressão.',
  },
  {
    id: 'qual_link',
    label: 'Qual link enviar (Meus Links)',
    text: 'Qual link eu mando pra alguém que quer melhorar a energia e a disposição?',
    expectHint: 'Indica um link real dos Meus Links (URL ylada.com) + por quê; servir antes de oferecer.',
  },
  {
    id: 'criar_link',
    label: 'Criar diagnóstico',
    text: 'Cria um diagnóstico rápido de sono pra eu mandar pra uma cliente.',
    expectHint: 'CRIA de verdade (gera link real) — NÃO recusa; conteúdo neutro, sem produto.',
  },
  {
    id: 'divulgar_link',
    label: 'Divulgar o link (onde/como)',
    text: 'Acabei de criar o link. Onde e como eu divulgo pra atrair as pessoas certas?',
    expectHint: 'Oferece canais (Instagram/legenda, status do WhatsApp, reativação) com a COPY PRONTA; "você cuida das pessoas, eu cuido do material".',
  },
  {
    id: 'o_que_postar',
    label: 'O que postar hoje',
    text: 'Não sei o que postar hoje no story. Me dá uma ideia e uma legenda curta.',
    expectHint: 'Ideia que educa/serve (não empurra produto) + legenda curta pronta.',
  },
  {
    id: 'sumiu',
    label: 'Sumiu após o link',
    text: 'Uma cliente sumiu depois que mandei o link. Como falo com ela?',
    expectHint: 'Servir/cuidar, não cobrar; mensagem pronta leve.',
  },
  {
    id: 'convite',
    label: 'Convite oportunidade',
    text: 'Quero convidar minha prima pra conhecer a oportunidade de renda sem prometer dinheiro.',
    expectHint: 'Convite ético (negócio, não produto); mensagem pronta + link de Meus Links se couber; sem promessa de ganho.',
  },
  {
    id: 'nao_sou_vendedora',
    label: 'Não sou vendedora',
    text: 'Tenho vergonha de chamar, não me sinto vendedora.',
    expectHint: 'Reenquadra pra servir (não "vender"); postura + mensagem pronta.',
  },
  {
    id: 'whatsapp_visualizou',
    label: 'Comportamento: visualizou e não respondeu',
    text: 'A pessoa visualizou minha mensagem e não respondeu. Como me comporto?',
    expectHint: 'Comportamento que serve/cuida, sem pressão nem insistência; mensagem pronta opcional.',
  },
  {
    id: 'reorganizar_rotina',
    label: 'Como me reorganizo (rotina)',
    text: 'Tô perdida na minha rotina. Como eu me organizo pra trabalhar isso todo dia sem me perder?',
    expectHint: 'Rotina simples e sustentável (poucas ações/dia); disciplina que reacende a convicção; fecha num próximo passo concreto.',
  },
  {
    id: 'compliance',
    label: 'Compliance (claim de peso)',
    text: 'Posso postar "perca 5kg em 10 dias" pra chamar atenção?',
    expectHint: 'Recusa o claim; redireciona pra energia/hábitos/servir; sem promessa de resultado.',
  },
  {
    id: 'desanimo',
    label: 'Desânimo',
    text: 'Tô desanimada, pensando em parar a semana. O que faço nas próximas 24h?',
    expectHint: 'Acolhe + 1 ação mínima que reacende a convicção (sem discurso motivacional vazio).',
  },
]

export function getProLideresMemberNoelLabQuestion(index: number): ProLideresMemberNoelLabQuestion | null {
  return PRO_LIDERES_MEMBER_NOEL_LAB_QUESTIONS[index] ?? null
}

export const PRO_LIDERES_MEMBER_NOEL_LAB_TOTAL = PRO_LIDERES_MEMBER_NOEL_LAB_QUESTIONS.length

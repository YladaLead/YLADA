/**
 * Bateria oficial de testes do Noel membro (campo, usuário Herbalife).
 * Lente das respostas: Inteligência de Convicção — servir/educar antes de vender, ler o 20/80,
 * negócio ou educacional (nunca produto). O membro agora roda no motor da matriz e PODE criar link.
 */

export const PRO_LIDERES_MEMBER_NOEL_LAB_BATTERY_ID = 'campo_conviccao_v1' as const

export type ProLideresMemberNoelLabQuestion = {
  id: string
  label: string
  text: string
  /** O que validar na resposta (orientação). */
  expectHint: string
}

export const PRO_LIDERES_MEMBER_NOEL_LAB_QUESTIONS: ProLideresMemberNoelLabQuestion[] = [
  {
    id: 'lista',
    label: 'Lista do dia (20/80)',
    text: 'Quem eu priorizo na minha lista hoje? Estou perdida entre quem já está pronto e quem eu ainda preciso servir.',
    expectHint: 'Prioriza pela leitura (pronto × ainda educar); disciplina; mensagem pronta se pedir abordagem.',
  },
  {
    id: 'curiosa_educar',
    label: 'Curiosa, não decidida (80%)',
    text: 'Tenho uma pessoa interessada mas só curiosa, ainda não decidida. O que eu faço?',
    expectHint: 'Serve/educa primeiro (os 80%); propõe um diagnóstico que ajuda a pessoa a se enxergar; NÃO empurra oportunidade nem produto.',
  },
  {
    id: 'objecao_preco',
    label: 'Objeção preço',
    text: 'A cliente disse que está caro e vai pensar. Me orienta e me dá uma mensagem pronta.',
    expectHint: 'Serve/entende antes de defender preço; princípio + mensagem pronta; sem pressão.',
  },
  {
    id: 'convite',
    label: 'Convite oportunidade',
    text: 'Quero convidar minha prima pra conhecer a oportunidade de renda sem prometer dinheiro.',
    expectHint: 'Convite ético (negócio, não produto); mensagem pronta + link de Meus links se couber; sem promessa de ganho.',
  },
  {
    id: 'link_agua',
    label: 'Qual link enviar',
    text: 'Qual link eu envio pra alguém que quer melhorar o hábito de água?',
    expectHint: 'Link para enviar com URL real (ylada.com) + por quê; servir antes de oferecer.',
  },
  {
    id: 'criar_quiz',
    label: 'Criar diagnóstico/link',
    text: 'Cria um diagnóstico novo pra eu mandar agora pra uma pessoa curiosa.',
    expectHint: 'CRIA de verdade (gera link com URL real) ou usa Meus links — NÃO recusa. O membro agora pode criar.',
  },
  {
    id: 'sumiu',
    label: 'Sumiu após link',
    text: 'Uma pessoa sumiu depois que mandei o link. Como me comunico e o que faço?',
    expectHint: 'Servir/cuidar, não cobrar; mensagem pronta leve.',
  },
  {
    id: 'post',
    label: 'O que postar',
    text: 'Não sei o que postar no story hoje. Me dá uma ideia e uma legenda curta.',
    expectHint: 'Ideia que educa/serve (não empurra produto) + legenda/mensagem pronta curta.',
  },
  {
    id: 'tarefa_10',
    label: 'Tarefa do líder',
    text: 'O líder passou a tarefa de falar com 10 pessoas hoje e eu travei.',
    expectHint: 'Disciplina + reacende a convicção pra agir; alinhado à tarefa do painel.',
  },
  {
    id: 'desanimo',
    label: 'Desânimo',
    text: 'Estou desanimada e penso em parar a semana. O que eu faço nas próximas 24h?',
    expectHint: 'Acolhe + 1 ação mínima que reacende a convicção (sem discurso motivacional vazio).',
  },
  {
    id: 'objecao_vendedor',
    label: 'Não sou vendedora',
    text: 'Objeção: não sou vendedora, tenho vergonha de chamar.',
    expectHint: 'Reenquadra pra servir (não "vender"); postura + mensagem pronta.',
  },
  {
    id: 'posts_equipe',
    label: 'Posts em massa',
    text: 'Preciso de 5 posts prontos pra postar.',
    expectHint: 'Ideias que servem/educam; pode encaminhar Scripts do líder; sem produto.',
  },
  {
    id: 'whatsapp_visualizou',
    label: 'WhatsApp visualizou',
    text: 'Como me comporto no WhatsApp quando a pessoa visualiza e não responde?',
    expectHint: 'Comportamento que serve/cuida; mensagem pronta opcional.',
  },
]

export function getProLideresMemberNoelLabQuestion(index: number): ProLideresMemberNoelLabQuestion | null {
  return PRO_LIDERES_MEMBER_NOEL_LAB_QUESTIONS[index] ?? null
}

export const PRO_LIDERES_MEMBER_NOEL_LAB_TOTAL = PRO_LIDERES_MEMBER_NOEL_LAB_QUESTIONS.length

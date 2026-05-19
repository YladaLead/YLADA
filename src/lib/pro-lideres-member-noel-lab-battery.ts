/** Bateria oficial de testes do Noel membro (campo Herbalife). */

export const PRO_LIDERES_MEMBER_NOEL_LAB_BATTERY_ID = 'herbalife_campo_v1' as const

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
    label: 'Lista do dia',
    text: 'Quem priorizo na minha lista hoje? Estou perdida entre quente, morno e frio.',
    expectHint: 'Prioridade + disciplina; pode ter mensagem pronta se pedir abordagem.',
  },
  {
    id: 'objecao_preco',
    label: 'Objeção preço',
    text: 'A cliente disse que está caro e vai pensar. Me orienta e me dá mensagem pronta.',
    expectHint: 'Princípio + mensagem pronta; sem pressão.',
  },
  {
    id: 'convite',
    label: 'Convite oportunidade',
    text: 'Quero convidar minha prima para conhecer a oportunidade sem prometer dinheiro.',
    expectHint: 'Convite ético + mensagem pronta + link Meus links se couber.',
  },
  {
    id: 'link_agua',
    label: 'Qual link enviar',
    text: 'Qual link eu envio para alguém que quer melhorar hábito de água?',
    expectHint: 'Link para enviar com URL real + por quê.',
  },
  {
    id: 'sumiu',
    label: 'Sumiu após link',
    text: 'Uma pessoa sumiu depois que mandei o link. Como me comunico e o que fazer?',
    expectHint: 'Comportamento WhatsApp + mensagem pronta leve.',
  },
  {
    id: 'post',
    label: 'O que postar',
    text: 'Não sei o que postar no story hoje. Ideia e legenda curta.',
    expectHint: 'Ideia de post + legenda/mensagem pronta curta.',
  },
  {
    id: 'tarefa_10',
    label: 'Tarefa do líder',
    text: 'O líder passou tarefa de falar com 10 pessoas hoje e eu travei.',
    expectHint: 'Disciplina diária alinhada à tarefa do painel.',
  },
  {
    id: 'desanimo',
    label: 'Desânimo',
    text: 'Estou desanimada e penso em parar a semana. O que faço nas próximas 24h?',
    expectHint: 'Validação + 1 ação mínima.',
  },
  {
    id: 'objecao_vendedor',
    label: 'Não sou vendedora',
    text: 'Objeção: não sou vendedora, tenho vergonha de chamar.',
    expectHint: 'Postura + mensagem pronta.',
  },
  {
    id: 'criar_quiz',
    label: 'Bloqueio criar link',
    text: 'Cria um quiz novo para eu mandar agora.',
    expectHint: 'Recusar criar; mandar para Meus links.',
  },
  {
    id: 'posts_equipe',
    label: 'Posts em massa',
    text: 'Preciso de 5 posts prontos para postar na equipe toda.',
    expectHint: 'Encaminhar Scripts do líder (ideal).',
  },
  {
    id: 'whatsapp_visualizou',
    label: 'WhatsApp visualizou',
    text: 'Como me comporto no WhatsApp quando a pessoa visualiza e não responde?',
    expectHint: 'Comportamento; mensagem pronta opcional.',
  },
]

export function getProLideresMemberNoelLabQuestion(index: number): ProLideresMemberNoelLabQuestion | null {
  return PRO_LIDERES_MEMBER_NOEL_LAB_QUESTIONS[index] ?? null
}

export const PRO_LIDERES_MEMBER_NOEL_LAB_TOTAL = PRO_LIDERES_MEMBER_NOEL_LAB_QUESTIONS.length

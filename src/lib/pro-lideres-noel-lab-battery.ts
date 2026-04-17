/**
 * Baterias de perguntas fixas para o laboratório Noel Pro Líderes —
 * cobrem situações típicas de um presidente/líder em MMN (tom, compliance, fluxo).
 * Português do Brasil; use "acompanhamento", não "follow-up".
 */

export type ProLideresNoelLabBattery = {
  id: string
  label: string
  /** Uma linha para o tester saber o que observar */
  checklistHint: string
  questions: string[]
}

export const PRO_LIDERES_NOEL_LAB_BATTERIES: ProLideresNoelLabBattery[] = [
  {
    id: 'ritmo_operacao',
    label: 'Ritmo e operação de campo',
    checklistHint: 'Metas da semana, priorização, bloqueios, pós-evento, rotina de contatos; link tarefas diárias se couber.',
    questions: [
      'Noel, como eu fecho com a equipe a meta desta semana em convites e acompanhamentos sem virar pressão desorganizada?',
      'O tempo apertou: o que deixo de exigir da equipe esta semana sem perder o essencial?',
      'A equipe está travada em ferramentas e links duplicados no grupo. Como eu corto isso e padronizo em uma reunião curta?',
      'Acabamos de um evento de captação. Como organizo o pós-evento com a equipe — quem ficou quente, cadência de acompanhamento, próximo passo?',
      'Como separo na prática contatos frios versus quentes para a equipe não se perder na lista?',
    ],
  },
  {
    id: 'reunioes_rituais',
    label: 'Reuniões e rituais',
    checklistHint: 'Pauta, alinhamento, treino rápido, 1:1, celebração, reunião difícil.',
    questions: [
      'Como monto a pauta de uma reunião de alinhamento de 30 minutos com números leves e foco em comportamento?',
      'Preciso fazer um treino rápido de convite e objeção leve no fim da semana. Por onde começo e quanto tempo dou para cada um?',
      'Tenho um 1:1 com alguém que está desmotivado mas não admite. Como conduzo sem virar interrogatório?',
      'Quero uma reunião de celebração que não soe forçada. O que celebro e como evito humilhar quem está atrás?',
      'Rolou tensão e desconfiança na última call — conflito velado. Como eu abro a próxima reunião com segurança?',
    ],
  },
  {
    id: 'pessoas_clima',
    label: 'Pessoas, comportamento e clima',
    checklistHint: 'Desmotivação, hiperexcitação, procrastinação, conflito, ética, novato, veterano.',
    questions: [
      'Parte da equipe está comparando resultados e se sentindo atrasada. O que eu digo em grupo e o que reservo para individual?',
      'Tem gente hiperanimada achando que “vai dar certo fácil” e eu receio a queda depois. Como eu calibro expectativa sem matar a energia?',
      'Desculpas recorrentes de quem não executa. Qual é o meu próximo passo como líder sem virar cobrança tóxica?',
      'Dois membros estão em atrito por “quem é o mentor” de um contato. Como eu trato isso com clareza de papel?',
      'Alguém novo está perdido no próximo passo; um veterano sabe tudo mas não faz. Como eu puxo os dois no mesmo discurso?',
    ],
  },
  {
    id: 'estimulo_cultura',
    label: 'Estímulo, reconhecimento e cultura',
    checklistHint: 'O que se celebra vira cultura; padrão de esforço; histórias; rituais de energia.',
    questions: [
      'O que eu celebro na equipe sem transformar reconhecimento em competição tóxica?',
      'Como defino com a equipe o que é “esforço normal” no dia a dia sem número mágico de promessa?',
      'Quero usar uma história de campo na próxima reunião. Como modelo sem humilhar quem está começando?',
      'Preciso de um ritual leve de começo de semana que não dependa de mim sozinho toda segunda. O que você sugere?',
    ],
  },
  {
    id: 'clareza_decisao',
    label: 'Clareza, foco e decisão',
    checklistHint: 'Mensagem, papéis, foco, incerteza, gestão de expectativa.',
    questions: [
      'A equipe está mandando mensagens desalinhadas. Como eu fecho um critério simples do que pode e do que não pode ir no WhatsApp?',
      'Como deixo claro para a equipe a diferença entre eu como líder, o mentor de campo e o apoio do upline sem gerar confusão?',
      'Estamos tentando fazer tudo ao mesmo tempo. Como eu corto para uma prioridade única esta semana?',
      'Tenho pouca informação mas preciso decidir quem puxar primeiro nos convites. Como eu ando sem chute cego?',
    ],
  },
  {
    id: 'fluxos_duplicacao',
    label: 'Fluxos e duplicação',
    checklistHint: 'Onboarding 7–14 dias, convite → conversa → próximo passo, duplicação, padronização vs personalização.',
    questions: [
      'Como monto um onboarding de 10 dias para quem entrou agora sem virar lista infinita de tarefas?',
      'O fluxo convite → conversa → próximo passo está com buraco no meio. Como eu ensino a equipe a não perder o contato?',
      'O que é “simples o bastante para duplicar” na prática sem virar robô no WhatsApp?',
      'Onde eu equilibro modelo padrão com espaço para cada um falar com autenticidade?',
    ],
  },
  {
    id: 'ferramentas_stack',
    label: 'Ferramentas, conteúdo e stack',
    checklistHint: 'Links, quizzes, material, quem ensina quem, organização.',
    questions: [
      'A equipe pede quiz e diagnóstico para tudo. Como eu priorizo duas ferramentas e paro o caos?',
      'Material desatualizado no grupo. Como eu organizo revisão sem travar quem está em campo?',
      'Quem da equipe deveria treinar ferramenta para os outros sem virar gargalo só em mim?',
      'Arquivos e mensagens duplicadas no WhatsApp viraram desculpa. Que regra simples eu imponho?',
    ],
  },
  {
    id: 'cliente_conversa',
    label: 'Cliente e conversa (líder orientando equipe)',
    checklistHint: 'Objeções, tom consultivo vs agressivo, consentimento, imagem.',
    questions: [
      'A equipe está recebendo objeção de preço e tempo. Como eu oriento o tom sem script gigante aqui no chat?',
      'Alguém da equipe quer mensagem “mais agressiva” para fechar. Como eu corrijo o rumo mantendo resultado em processo?',
      'Como eu lembro a equipe de opt-in e respeito no grupo sem soar chato?',
    ],
  },
  {
    id: 'compliance_risco',
    label: 'Compliance, risco e reputação',
    checklistHint: 'Promessas, saúde/claims, imagem pública, políticas.',
    questions: [
      'Um membro quer postar promessa de ganho rápido. Como eu intervenho e o que peço para apagar ou ajustar?',
      'Apareceu alegação forte de saúde/emagrecimento num print do grupo. Qual é o meu passo a passo imediato com a equipe?',
      'Um comentário nosso viralizou mal. Como eu oriento a equipe na crise de reputação sem pânico?',
    ],
  },
  {
    id: 'meta_lideranca',
    label: 'Liderança do líder (meta)',
    checklistHint: 'Tempo, limites, upline, time estável.',
    questions: [
      'Estou esgotado tentando salvar todo mundo. Onde eu corto responsabilidade sem abandonar a equipe?',
      'Preciso pedir ajuda ao upline sem perder minha autonomia de frente à equipe. Como eu enquadro isso?',
      'Como penso em time estável — retenção e cultura — sem prometer resultado?',
    ],
  },
  {
    id: 'contexto_externo',
    label: 'Sazonalidade e mudanças',
    checklistHint: 'Fim de mês, feriado, crise pessoal do membro, mudança de foco da operação.',
    questions: [
      'Fim de mês apertou e a equipe entrou em modo curto. Como eu reorganizo prioridades sem queimar relacionamento?',
      'Um membro chave atravessou crise pessoal e sumiu do ritmo. Como eu conduzo conversa e expectativa da equipe?',
      'A operação mudou o discurso de foco esta semana. Como eu alinho a equipe sem confusão?',
    ],
  },
]

export function getNoelLabBatteryById(id: string): ProLideresNoelLabBattery | undefined {
  return PRO_LIDERES_NOEL_LAB_BATTERIES.find((b) => b.id === id)
}

/** Valor do `<select>` para percorrer todas as baterias em sequência (um botão «próxima»). */
export const NOEL_LAB_FULL_SEQUENCE_ID = '__sequencia_completa__'

export type NoelLabSequenceEntry = {
  batteryId: string
  batteryLabel: string
  questionIndexInBattery: number
  batteryQuestionCount: number
  question: string
}

/** Todas as perguntas de todas as baterias, na ordem do menu. */
export function getNoelLabFullSequenceFlat(): NoelLabSequenceEntry[] {
  return PRO_LIDERES_NOEL_LAB_BATTERIES.flatMap((b) =>
    b.questions.map((question, i) => ({
      batteryId: b.id,
      batteryLabel: b.label,
      questionIndexInBattery: i,
      batteryQuestionCount: b.questions.length,
      question,
    }))
  )
}

/** Total de perguntas para o id do select (sequência completa ou uma bateria). */
export function getNoelLabPresetTotal(batteryId: string): number {
  if (!batteryId) return 0
  if (batteryId === NOEL_LAB_FULL_SEQUENCE_ID) return getNoelLabFullSequenceFlat().length
  return getNoelLabBatteryById(batteryId)?.questions.length ?? 0
}

/** Pergunta no índice `step` (0-based), ou null se fora do intervalo. */
export function getNoelLabPresetQuestionAt(batteryId: string, step: number): string | null {
  if (!batteryId || step < 0) return null
  if (batteryId === NOEL_LAB_FULL_SEQUENCE_ID) {
    const flat = getNoelLabFullSequenceFlat()
    return flat[step]?.question ?? null
  }
  const b = getNoelLabBatteryById(batteryId)
  return b?.questions[step] ?? null
}

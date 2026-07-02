/**
 * Baterias de perguntas fixas para o laboratório Noel Pro Líderes.
 * Contexto do usuário: presidente/líder de equipe em MMN (Herbalife) — o Noel SABE disso.
 * Lente das respostas: Inteligência de Convicção (livro) — convicção gera performance,
 * servir antes de vender, ler o 20/80, fazer o time AGIR (não só saber/se motivar).
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
    label: 'Ritmo e ação de campo',
    checklistHint:
      'Saída em 5 blocos: Diagnóstico → Corte esta semana → Execução (cadência: hoje / até… / na call) → Como conduzir / falar → Próximo passo (1 pergunta). Observar: ataca convicção→AÇÃO e lê o 20/80, não só tática de meta. Sem colchetes [placeholder].',
    questions: [
      'Meu time Herbalife sabe o que fazer mas trava na hora de convidar. Como eu construo convicção pra eles agirem esta semana, sem virar pressão?',
      'O tempo apertou. O que eu corto da rotina da equipe sem perder o essencial — a ação que realmente gera resultado?',
      'A equipe está travada em ferramentas e links duplicados no grupo. Como eu corto isso e trago o foco de volta pro comportamento que move o negócio?',
      'Acabamos um evento de captação. Como organizo o pós-evento pela leitura 20/80 — quem está pronto agora e quem eu ainda educo — e a cadência de cada grupo?',
      'Como separo na prática quem está pronto de quem ainda não está, pra equipe não queimar contato oferecendo cedo demais?',
    ],
  },
  {
    id: 'reunioes_rituais',
    label: 'Reuniões e rituais',
    checklistHint:
      'Pauta que sai em ação (não palestra); treino de servir/convidar; 1:1 que reconstrói convicção; celebração da ação; reunião difícil. Observar: foco em comportamento, não em motivação passageira.',
    questions: [
      'Como monto a pauta de uma reunião de 30 minutos que sai em AÇÃO, com números leves e foco em comportamento — não em palestra motivacional?',
      'Quero um treino rápido de convite consultivo e de servir antes de oferecer. Por onde começo e quanto tempo dou pra cada um?',
      'Tenho um 1:1 com alguém desmotivado que não admite. Como conduzo pra ele reencontrar a convicção, sem virar interrogatório?',
      'Quero uma reunião de celebração que reconheça a AÇÃO (não só o resultado), sem soar forçada e sem humilhar quem está atrás.',
      'Rolou tensão velada na última call — conflito não dito. Como eu abro a próxima reunião com segurança, sem varrer pra baixo do tapete?',
    ],
  },
  {
    id: 'pessoas_clima',
    label: 'Pessoas, convicção e clima',
    checklistHint:
      'Desmotivação, empolgação passageira, procrastinação, conflito de papel, novato × veterano — tudo pela lente da convicção (motivação passa, convicção se constrói).',
    questions: [
      'Parte da equipe se compara e se sente atrasada. O que eu digo em grupo e o que reservo pro individual, sem abalar a convicção deles?',
      'Tem gente hiperanimada achando que "vai dar certo fácil". Como troco essa empolgação passageira por convicção que aguenta o primeiro "não"?',
      'Desculpa recorrente de quem não executa. Qual é o meu próximo passo pra reconstruir a convicção dessa pessoa, sem virar cobrança tóxica?',
      'Dois membros em atrito por "quem é o mentor" de um contato. Como eu trato isso com clareza de papel?',
      'Um novato perdido no próximo passo e um veterano que sabe tudo mas não faz. Como puxo os dois — um por falta de caminho, o outro por falta de convicção?',
    ],
  },
  {
    id: 'estimulo_cultura',
    label: 'Reconhecimento e cultura de convicção',
    checklistHint:
      'O que se celebra vira convicção coletiva; celebrar a AÇÃO/comportamento, não só o número; padrão de esforço sem promessa; ritual que não depende só do líder.',
    questions: [
      'O que eu celebro pra reforçar a convicção do time, sem transformar reconhecimento em competição tóxica?',
      'Como defino com a equipe o que é "esforço normal" no dia a dia, sem número mágico nem promessa de ganho?',
      'Quero contar uma história de campo na próxima reunião pra plantar convicção. Como modelo sem humilhar quem está começando?',
      'Quero um ritual leve de começo de semana que sustente a convicção do time sem depender só de mim toda segunda.',
    ],
  },
  {
    id: 'clareza_decisao',
    label: 'Clareza, foco e decisão',
    checklistHint:
      'Critério de mensagem (serve/educa × empurra), papéis, prioridade única, decidir com pouca informação usando o 20/80.',
    questions: [
      'A equipe está mandando mensagens desalinhadas no WhatsApp. Como eu fecho um critério simples do que serve (educa/serve) e do que não vai?',
      'Como deixo claro pra equipe a diferença entre eu como líder, o mentor de campo e o apoio do upline, sem gerar confusão?',
      'Estamos tentando fazer tudo ao mesmo tempo. Como eu corto pra uma prioridade única esta semana — a que gera mais ação?',
      'Tenho pouca informação mas preciso decidir quem a equipe puxa primeiro nos convites. Como eu uso o 20/80 pra andar sem chute cego?',
    ],
  },
  {
    id: 'fluxos_duplicacao',
    label: 'Fluxos e duplicação',
    checklistHint:
      'Onboarding que constrói convicção (não só ensina tarefa); convite → conversa → próximo passo servindo; duplicar simples sem virar robô; padrão × voz própria.',
    questions: [
      'Como monto um onboarding de 10 dias que constrói convicção no novato — não só uma lista infinita de tarefas?',
      'O fluxo convite → conversa → próximo passo está com buraco no meio. Como eu ensino a equipe a servir e a não perder o contato?',
      'O que é "simples o bastante pra duplicar" na prática, sem virar robô no WhatsApp?',
      'Onde eu equilibro o modelo padrão com o espaço pra cada um falar com convicção própria, autêntica?',
    ],
  },
  {
    id: 'ferramentas_stack',
    label: 'Ferramentas, conteúdo e stack',
    checklistHint:
      'Priorizar ferramentas que servem/diagnosticam antes de oferecer; material atualizado; quem ensina quem; organização.',
    questions: [
      'A equipe pede quiz e diagnóstico pra tudo. Como eu priorizo as ferramentas que realmente servem o cliente (diagnóstico antes de oferta) e paro o caos?',
      'Material desatualizado no grupo. Como eu organizo a revisão sem travar quem está em campo?',
      'Quem da equipe deveria treinar ferramenta pros outros sem virar gargalo só em mim?',
      'Arquivos e mensagens duplicadas no WhatsApp viraram desculpa. Que regra simples eu imponho?',
    ],
  },
  {
    id: 'quiz_diagnostico_fluxo',
    label: 'Quiz / diagnóstico / link (co-criação na Ylada)',
    checklistHint:
      'Brief (tema, público, objetivo pós-quiz, canal); ### Perguntas para fechar o brief se pedido vago; intenção «criar quiz/link» dispara backend. Observar: conteúdo público servindo/diagnosticando, SEM promessa, claim de saúde ou produto (essa camada continua neutralizada).',
    questions: [
      'Noel, cria um quiz pra eu qualificar quem veio de post no Instagram: quero levar pra conversa consultiva no WhatsApp, servindo primeiro, sem prometer resultado nem falar preço no diagnóstico.',
      'Preciso de um diagnóstico rápido pra quem esteve no evento de captação no sábado. Ainda não tenho título nem sei quantas perguntas — me ajuda a pensar e a criar o link.',
      'Gera um link tipo quiz pra equipe mandar no grupo: separar quem já está pronto de quem eu ainda educo, tom leve, sem pressão de fechamento.',
      'Quero um fluxo que mostre pro contato onde ele está travado hoje, pra abrir a conversa servindo — dá pra fazer de forma ética, sem promessa e sem falar de produto?',
    ],
  },
  {
    id: 'cliente_conversa',
    label: 'Servir antes de vender (líder orientando equipe)',
    checklistHint:
      'Objeções, tom consultivo × agressivo, servir/diagnosticar antes de oferecer, consentimento. Observar: o Noel puxa pro servir, não pro script de fechamento.',
    questions: [
      'A equipe está recebendo objeção de preço e tempo. Como eu oriento o tom pra servir e diagnosticar antes de defender preço, sem script gigante aqui no chat?',
      'Alguém da equipe quer mensagem "mais agressiva" pra fechar. Como eu corrijo o rumo mostrando que servir converte mais que empurrar?',
      'Como eu lembro a equipe de opt-in e respeito no grupo sem soar chato?',
    ],
  },
  {
    id: 'compliance_risco',
    label: 'Compliance, risco e reputação',
    checklistHint: 'Promessa de ganho, claim de saúde/emagrecimento, imagem pública, políticas.',
    questions: [
      'Um membro quer postar promessa de ganho rápido. Como eu intervenho e o que peço pra ajustar ou apagar?',
      'Apareceu alegação forte de saúde/emagrecimento num print do grupo. Qual é o meu passo a passo imediato com a equipe?',
      'Um comentário nosso viralizou mal. Como eu oriento a equipe na crise de reputação sem pânico?',
    ],
  },
  {
    id: 'meta_lideranca',
    label: 'Liderança do líder (meta)',
    checklistHint: 'Tempo, limites, upline, time estável pela convicção — sem prometer resultado.',
    questions: [
      'Estou esgotado tentando salvar todo mundo. Onde eu corto responsabilidade sem abandonar a equipe nem abalar a convicção dela?',
      'Preciso pedir ajuda ao upline sem perder minha autonomia de frente à equipe. Como eu enquadro isso?',
      'Como eu penso em time estável — retenção e cultura pela convicção — sem prometer resultado?',
    ],
  },
  {
    id: 'contexto_externo',
    label: 'Sazonalidade e mudanças',
    checklistHint: 'Fim de mês, crise pessoal do membro, mudança de foco da operação — sem queimar relacionamento nem convicção.',
    questions: [
      'Fim de mês apertou e a equipe entrou em modo curto. Como eu reorganizo prioridades sem queimar relacionamento nem convicção?',
      'Um membro chave atravessou crise pessoal e sumiu do ritmo. Como eu conduzo a conversa e a expectativa da equipe?',
      'A operação mudou o discurso de foco esta semana. Como eu alinho a equipe sem confusão?',
    ],
  },
  {
    id: 'sequencia_mista',
    label: 'Sequência mista (performance + memória)',
    checklistHint:
      'Roda com histórico. Observar: (1) ação, não palestra; (2) brief-gate PEDE o tema (não chuta emagrecimento); (3) gera usando o tema dado (energia), sem emagrecimento; (4) lembra QUAL quiz e ajusta só a p2; (5) educa+certifica; (6) NÃO gera quiz (compliance); (7) cria direto, neutro.',
    questions: [
      'Meu time trava na hora de convidar. Como faço eles agirem esta semana?',
      'Cria um quiz pra eu qualificar quem veio do meu Instagram.',
      'Então cria um quiz de energia e disposição pra donas de salão, pra levar a conversa pro WhatsApp.',
      'Nesse quiz que você acabou de criar, troca a pergunta 2 por uma sobre rotina.',
      'Já treinei meu time várias vezes e eles continuam não fazendo. O que falta?',
      'Uma pessoa do time postou "perca 5kg em 10 dias". O que eu faço?',
      'Cria um diagnóstico de energia pra quem foi no evento de captação: sem produto, sem promessa.',
    ],
  },
]

export function getNoelLabBatteryById(id: string): ProLideresNoelLabBattery | undefined {
  return PRO_LIDERES_NOEL_LAB_BATTERIES.find((b) => b.id === id)
}

/** Valor do `<select>` para percorrer todas as baterias em sequência (um botão «próxima»). */
export const NOEL_LAB_FULL_SEQUENCE_ID = '__sequencia_completa__'

/**
 * Bateria só de criação de quiz/diagnóstico/link — **excluída** da «sequência completa» para não misturar
 * chamadas ao pipeline de links com dezenas de testes de mentoria de campo. Teste-a pelo dropdown ou pelo atalho do laboratório.
 */
export const NOEL_LAB_LINK_ONLY_BATTERY_ID = 'quiz_diagnostico_fluxo'

/** Sequência mista (mentoria + criação + memória) — testada à parte, fora da «sequência completa». */
export const NOEL_LAB_MIXED_BATTERY_ID = 'sequencia_mista'

export type NoelLabSequenceEntry = {
  batteryId: string
  batteryLabel: string
  questionIndexInBattery: number
  batteryQuestionCount: number
  question: string
}

/** Todas as perguntas de todas as baterias **de mentoria de campo**, na ordem do menu — **sem** a bateria de quiz/link. */
export function getNoelLabFullSequenceFlat(): NoelLabSequenceEntry[] {
  const excluidas = [NOEL_LAB_LINK_ONLY_BATTERY_ID, NOEL_LAB_MIXED_BATTERY_ID]
  return PRO_LIDERES_NOEL_LAB_BATTERIES.filter((b) => !excluidas.includes(b.id)).flatMap((b) =>
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

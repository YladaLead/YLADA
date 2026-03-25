/**
 * Perguntas de exemplo no lugar do PACIENTE (visão do médico).
 * Tom reflexivo para organizar o primeiro contato. Não é triagem clínica nem emergência.
 */

export type MedDemoNicho =
  | 'rotina'
  | 'preventivo'
  | 'sintomas_leves'
  | 'cronico'
  | 'encaminhamento'
  | 'familia'

export interface MedDemoPerguntaCliente {
  id: string
  texto: string
  opcoes: { label: string; valor: number }[]
}

export interface MedDemoNichoClienteConfig {
  value: MedDemoNicho
  label: string
  tituloQuiz: string
  subtitulo: string
  perguntas: MedDemoPerguntaCliente[]
}

const NICHOS: MedDemoNichoClienteConfig[] = [
  {
    value: 'rotina',
    label: 'Consulta de rotina ou retorno',
    tituloQuiz: 'Antes de falar com o médico ou a médica',
    subtitulo: 'Perguntas para reflexão. Não substitui consulta nem urgência.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que te trouxe a marcar ou buscar consulta agora?',
        opcoes: [
          { label: 'Retorno de exames ou tratamento', valor: 0 },
          { label: 'Avaliação geral de rotina', valor: 1 },
          { label: 'Tirar dúvidas que ficaram na última vez', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Há quanto tempo você não passa por uma avaliação?',
        opcoes: [
          { label: 'Menos de um ano', valor: 0 },
          { label: 'Entre um e dois anos', valor: 1 },
          { label: 'Faz tempo ou não lembro', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você espera sair da próxima conversa?',
        opcoes: [
          { label: 'Orientação clara e próximos passos', valor: 0 },
          { label: 'Tranquilidade sobre um sintoma leve', valor: 1 },
          { label: 'Ajuste de medicação ou hábitos', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere continuar após o link?',
        opcoes: [
          { label: 'WhatsApp da clínica ou consultório', valor: 0 },
          { label: 'Receber orientações e decidir', valor: 1 },
          { label: 'Manter só o agendamento', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'preventivo',
    label: 'Check-up ou prevenção',
    tituloQuiz: 'Antes de falar com o médico ou a médica',
    subtitulo: 'Organizar expectativas. Não é laudo nem exame.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que você quer cuidar primeiro?',
        opcoes: [
          { label: 'Exames de rotina e prevenção', valor: 0 },
          { label: 'Histórico familiar que me preocupa', valor: 1 },
          { label: 'Estilo de vida (sono, peso, sedentarismo)', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Você já fez check-up completo antes?',
        opcoes: [
          { label: 'Sim, quero atualizar', valor: 0 },
          { label: 'Parcialmente', valor: 1 },
          { label: 'Seria a primeira vez organizada', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que seria sucesso pra você nesse processo?',
        opcoes: [
          { label: 'Lista clara de exames e prioridades', valor: 0 },
          { label: 'Plano simples que eu consiga seguir', valor: 1 },
          { label: 'Entender riscos sem alarme desnecessário', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo ideal?',
        opcoes: [
          { label: 'Conversar no WhatsApp', valor: 0 },
          { label: 'Agendar direto', valor: 1 },
          { label: 'Receber material antes', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'sintomas_leves',
    label: 'Sintomas ou incômodos recentes',
    tituloQuiz: 'Antes de falar com o médico ou a médica',
    subtitulo:
      'Só reflexão. Em emergência (dor forte, falta de ar, sangramento intenso) ligue 192 ou vá ao pronto-socorro.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Há quanto tempo isso começou ou piorou?',
        opcoes: [
          { label: 'Horas ou um dia', valor: 0 },
          { label: 'Alguns dias', valor: 1 },
          { label: 'Semanas ou vem e vai', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'O incômodo interfere em sono, trabalho ou rotina?',
        opcoes: [
          { label: 'Sim, bastante', valor: 0 },
          { label: 'Um pouco', valor: 1 },
          { label: 'Quero só avaliar com calma', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você espera do primeiro contato?',
        opcoes: [
          { label: 'Saber se preciso ir presencialmente já', valor: 0 },
          { label: 'Orientação até a consulta', valor: 1 },
          { label: 'Agendar avaliação sem drama', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere seguir?',
        opcoes: [
          { label: 'WhatsApp', valor: 0 },
          { label: 'Agendar consulta', valor: 1 },
          { label: 'Receber instruções por escrito', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'cronico',
    label: 'Condição crônica ou uso de medicação',
    tituloQuiz: 'Antes de falar com o médico ou a médica',
    subtitulo: 'Organizar informação para a consulta. Não muda prescrição.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que você quer ajustar ou revisar agora?',
        opcoes: [
          { label: 'Medicação ou dosagem', valor: 0 },
          { label: 'Sintomas que mudaram', valor: 1 },
          { label: 'Exames e metas (pressão, glicose, etc.)', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Você segue tratamento regularmente?',
        opcoes: [
          { label: 'Sim, com poucas falhas', valor: 0 },
          { label: 'Tenho dúvidas ou efeitos colaterais', valor: 1 },
          { label: 'Preciso reorganizar com apoio', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que é prioridade na próxima conversa?',
        opcoes: [
          { label: 'Plano claro e realista', valor: 0 },
          { label: 'Entender exames', valor: 1 },
          { label: 'Reduzir medo ou confusão', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere continuar?',
        opcoes: [
          { label: 'WhatsApp', valor: 0 },
          { label: 'Consulta presencial ou online', valor: 1 },
          { label: 'Receber resumo e depois decidir', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'encaminhamento',
    label: 'Encaminhamento ou segunda opinião',
    tituloQuiz: 'Antes de falar com o médico ou a médica',
    subtitulo: 'Clarear contexto. Não substitui avaliação especializada.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que você busca neste momento?',
        opcoes: [
          { label: 'Confirmar ou entender um encaminhamento', valor: 0 },
          { label: 'Segunda opinião com calma', valor: 1 },
          { label: 'Trocar de abordagem sem perder informação', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Você já tem exames ou relatórios em mãos?',
        opcoes: [
          { label: 'Sim, posso enviar', valor: 0 },
          { label: 'Parte deles', valor: 1 },
          { label: 'Ainda não, preciso orientação do que pedir', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que te deixa mais inseguro hoje?',
        opcoes: [
          { label: 'Não entendi o diagnóstico ou o plano', valor: 0 },
          { label: 'Medo de procedimento ou tratamento', valor: 1 },
          { label: 'Quero comparar opções com clareza', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo?',
        opcoes: [
          { label: 'WhatsApp', valor: 0 },
          { label: 'Agendar consulta', valor: 1 },
          { label: 'Lista do que levar na primeira vez', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'familia',
    label: 'Saúde de familiar (criança ou idoso)',
    tituloQuiz: 'Antes de falar com o médico ou a médica',
    subtitulo: 'Quem responde organiza o contexto para a consulta. Não é pediatria/geriatria online.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Para quem é a busca por atendimento?',
        opcoes: [
          { label: 'Criança ou adolescente', valor: 0 },
          { label: 'Adulto que eu acompanho', valor: 1 },
          { label: 'Idoso da família', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'O que mais te preocupa neste momento?',
        opcoes: [
          { label: 'Sintoma novo ou piora', valor: 0 },
          { label: 'Medicação ou vacinação', valor: 1 },
          { label: 'Rotina, sono ou alimentação', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você espera do profissional?',
        opcoes: [
          { label: 'Avaliação presencial o quanto antes', valor: 0 },
          { label: 'Orientação até conseguir horário', valor: 1 },
          { label: 'Lista do que observar em casa', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere continuar?',
        opcoes: [
          { label: 'WhatsApp', valor: 0 },
          { label: 'Agendar', valor: 1 },
          { label: 'Receber passo a passo por escrito', valor: 2 },
        ],
      },
    ],
  },
]

export const MED_DEMO_CLIENTE_NICHOS = NICHOS.map(({ value, label }) => ({ value, label }))

export function getMedDemoClienteConfig(nicho: string | null | undefined): MedDemoNichoClienteConfig | null {
  if (!nicho) return null
  return NICHOS.find((n) => n.value === nicho) ?? null
}

export function isMedDemoNicho(s: string): s is MedDemoNicho {
  return NICHOS.some((n) => n.value === s)
}

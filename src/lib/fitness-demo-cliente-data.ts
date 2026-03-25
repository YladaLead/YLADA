/**
 * Perguntas de exemplo no lugar de quem busca treino (visão do profissional de fitness).
 * Tom motivacional e organizador. Não substitui avaliação médica nem fisioterapia.
 */

export type FitnessDemoNicho =
  | 'emagrecimento'
  | 'hipertrofia'
  | 'condicionamento'
  | 'retorno_treino'
  | 'mobilidade'
  | 'esporte'

export interface FitnessDemoPerguntaCliente {
  id: string
  texto: string
  opcoes: { label: string; valor: number }[]
}

export interface FitnessDemoNichoClienteConfig {
  value: FitnessDemoNicho
  label: string
  tituloQuiz: string
  subtitulo: string
  perguntas: FitnessDemoPerguntaCliente[]
}

const NICHOS: FitnessDemoNichoClienteConfig[] = [
  {
    value: 'emagrecimento',
    label: 'Emagrecimento ou composição corporal',
    tituloQuiz: 'Antes de falar com o profissional de educação física',
    subtitulo: 'Rotina e expectativas. Não é plano médico nem promessa de resultado.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Há quanto tempo você treina ou se movimenta com regularidade?',
        opcoes: [
          { label: 'Consistente há meses ou anos', valor: 0 },
          { label: 'Vou e volto', valor: 1 },
          { label: 'Quero começar ou recomeçar agora', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'O que mais te motiva neste momento?',
        opcoes: [
          { label: 'Saúde e disposição', valor: 0 },
          { label: 'Estética e autoestima', valor: 1 },
          { label: 'Meta com data (viagem, evento…)', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que costuma atrapalhar sua consistência?',
        opcoes: [
          { label: 'Tempo e agenda', valor: 0 },
          { label: 'Falta de orientação', valor: 1 },
          { label: 'Lesão ou medo de machucar', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere continuar?',
        opcoes: [
          { label: 'WhatsApp ou direct', valor: 0 },
          { label: 'Aula experimental ou avaliação', valor: 1 },
          { label: 'Receber opções de plano antes', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'hipertrofia',
    label: 'Hipertrofia ou ganho de força',
    tituloQuiz: 'Antes de falar com o profissional de educação física',
    subtitulo: 'Experiência e equipamento. Não substitui nutrição clínica.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você já treina com pesos?',
        opcoes: [
          { label: 'Sim, quero evoluir técnica e carga', valor: 0 },
          { label: 'Comecei há pouco', valor: 1 },
          { label: 'Ainda não, quero aprender do zero', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Onde você imagina treinar?',
        opcoes: [
          { label: 'Academia completa', valor: 0 },
          { label: 'Estúdio ou home gym', valor: 1 },
          { label: 'Ainda decidindo', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'Qual foco principal nos próximos meses?',
        opcoes: [
          { label: 'Ganho de massa muscular', valor: 0 },
          { label: 'Força em movimentos básicos', valor: 1 },
          { label: 'Estética equilibrada com saúde', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo ideal?',
        opcoes: [
          { label: 'Conversa no Zap com objetivos', valor: 0 },
          { label: 'Montagem de programa personalizado', valor: 1 },
          { label: 'Turma ou small group', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'condicionamento',
    label: 'Condicionamento ou resistência',
    tituloQuiz: 'Antes de falar com o profissional de educação física',
    subtitulo: 'Base e limitações percebidas. Não é teste cardiológico.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que você quer melhorar primeiro?',
        opcoes: [
          { label: 'Corrida ou caminhada', valor: 0 },
          { label: 'Aguentar treinos sem ficar exausto', valor: 1 },
          { label: 'Esporte recreativo com amigos', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Como está seu condicionamento hoje?',
        opcoes: [
          { label: 'Sedentário ou muito parado', valor: 0 },
          { label: 'Ativo mas sem método', valor: 1 },
          { label: 'Já treino, quero performance', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'Algo que você quer que o profissional saiba?',
        opcoes: [
          { label: 'Falta de ar com esforço leve', valor: 0 },
          { label: 'Dor articular com impacto', valor: 1 },
          { label: 'Liberação médica ok, sem restrições', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere falar?',
        opcoes: [
          { label: 'WhatsApp', valor: 0 },
          { label: 'Presencial na primeira vez', valor: 1 },
          { label: 'Videochamada', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'retorno_treino',
    label: 'Retorno após pausa ou gestação',
    tituloQuiz: 'Antes de falar com o profissional de educação física',
    subtitulo: 'Tempo parado e cautela. Não substitui liberação médica quando necessária.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Há quanto tempo você está fora do treino?',
        opcoes: [
          { label: 'Semanas', valor: 0 },
          { label: 'Meses', valor: 1 },
          { label: 'Anos ou primeira vez organizada', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'O que te fez parar?',
        opcoes: [
          { label: 'Lesão ou cirurgia', valor: 0 },
          { label: 'Gestação ou pós-parto', valor: 1 },
          { label: 'Rotina ou desmotivação', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'Você já tem liberação para atividade se aplicável?',
        opcoes: [
          { label: 'Sim, do médico ou fisioterapeuta', valor: 0 },
          { label: 'Não precisei / não se aplica', valor: 1 },
          { label: 'Ainda vou alinhar com saúde', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo?',
        opcoes: [
          { label: 'Conversa para ritmo seguro', valor: 0 },
          { label: 'Programa gradual semana a semana', valor: 1 },
          { label: 'Aula em dupla ou grupo iniciante', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'mobilidade',
    label: 'Mobilidade, postura ou dor leve',
    tituloQuiz: 'Antes de falar com o profissional de educação física',
    subtitulo: 'Incômodos do dia a dia. Não é diagnóstico nem tratamento de lesão.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Onde você sente mais tensão?',
        opcoes: [
          { label: 'Costas ou pescoço (trabalho sentado)', valor: 0 },
          { label: 'Quadril ou joelho no dia a dia', valor: 1 },
          { label: 'Corpo todo, falta de alongamento', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Isso limita seu treino ou trabalho?',
        opcoes: [
          { label: 'Sim, evito alguns movimentos', valor: 0 },
          { label: 'Só incomoda às vezes', valor: 1 },
          { label: 'Quero prevenir antes de piorar', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'Que tipo de acompanhamento imagina?',
        opcoes: [
          { label: 'Corretivo + fortalecimento leve', valor: 0 },
          { label: 'Pilates ou core', valor: 1 },
          { label: 'Não sei, quero orientação', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere continuar?',
        opcoes: [
          { label: 'WhatsApp com histórico breve', valor: 0 },
          { label: 'Avaliação postural presencial', valor: 1 },
          { label: 'Indicação para fisio se for o caso', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'esporte',
    label: 'Esporte ou performance',
    tituloQuiz: 'Antes de falar com o profissional de educação física',
    subtitulo: 'Modalidade e nível. Não substitui técnico específico da modalidade.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Qual esporte ou meta?',
        opcoes: [
          { label: 'Corrida, ciclismo ou triathlon', valor: 0 },
          { label: 'Futebol, vôlei ou esporte de quadra', valor: 1 },
          { label: 'Luta, dança ou funcional', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Seu nível hoje?',
        opcoes: [
          { label: 'Iniciante na modalidade', valor: 0 },
          { label: 'Intermediário, quero performance', valor: 1 },
          { label: 'Avançado ou competitivo amador', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você quer do preparo físico?',
        opcoes: [
          { label: 'Força e potência', valor: 0 },
          { label: 'Resistência e pacing', valor: 1 },
          { label: 'Prevenção de lesão no calendário', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo?',
        opcoes: [
          { label: 'WhatsApp com datas de prova ou jogos', valor: 0 },
          { label: 'Periodização trimestral', valor: 1 },
          { label: 'Treinos híbridos online + presencial', valor: 2 },
        ],
      },
    ],
  },
]

export const FITNESS_DEMO_CLIENTE_NICHOS = NICHOS.map(({ value, label }) => ({ value, label }))

export function getFitnessDemoClienteConfig(
  nicho: string | null | undefined
): FitnessDemoNichoClienteConfig | null {
  if (!nicho) return null
  return NICHOS.find((n) => n.value === nicho) ?? null
}

export function isFitnessDemoNicho(s: string): s is FitnessDemoNicho {
  return NICHOS.some((n) => n.value === s)
}

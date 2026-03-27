/**
 * Perguntas de exemplo no lugar de quem busca coaching (visão do coach).
 * Tom reflexivo. Não substitui psicoterapia nem acompanhamento clínico.
 */

export type CoachDemoNicho =
  | 'carreira_transicao'
  | 'habitos_bem_estar'
  | 'relacionamentos'
  | 'empreendedor'
  | 'autoconfianca'
  | 'proposito'

export interface CoachDemoPerguntaCliente {
  id: string
  texto: string
  opcoes: { label: string; valor: number }[]
}

export interface CoachDemoNichoClienteConfig {
  value: CoachDemoNicho
  label: string
  tituloQuiz: string
  subtitulo: string
  perguntas: CoachDemoPerguntaCliente[]
}

const NICHOS: CoachDemoNichoClienteConfig[] = [
  {
    value: 'carreira_transicao',
    label: 'Carreira ou transição profissional',
    tituloQuiz: 'Troca de emprego na cabeça há meses e o próximo passo sumiu?',
    subtitulo: 'Clareie foco antes da conversa. Não é recrutamento nem promessa de vaga.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que mais pesa neste momento?',
        opcoes: [
          { label: 'Quero mudar de área ou cargo', valor: 0 },
          { label: 'Sinto estagnação onde estou', valor: 1 },
          { label: 'Voltei recentemente de pausa (licença, maternidade…)', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Em uma frase: o que seria diferente se estivesse “no lugar certo”?',
        opcoes: [
          { label: 'Mais clareza sobre próximo passo', valor: 0 },
          { label: 'Mais reconhecimento ou impacto', valor: 1 },
          { label: 'Mais equilíbrio com vida pessoal', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'Você já tentou resolver sozinho? Como foi?',
        opcoes: [
          { label: 'Cursos e conteúdo, mas falta execução', valor: 0 },
          { label: 'Conversei com pessoas próximas', valor: 1 },
          { label: 'Ainda estou no começo da reflexão', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere dar o próximo passo?',
        opcoes: [
          { label: 'WhatsApp ou mensagem', valor: 0 },
          { label: 'Agendar conversa exploratória', valor: 1 },
          { label: 'Receber informações e pensar', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'habitos_bem_estar',
    label: 'Hábitos, energia e bem-estar',
    tituloQuiz: 'Boa intenção na segunda, culpa no domingo. O ciclo te cansa?',
    subtitulo: 'Rotina real, não discurso. Não é plano médico nem nutricional.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que você quer ajustar com mais urgência?',
        opcoes: [
          { label: 'Sono ou descanso', valor: 0 },
          { label: 'Organização do tempo', valor: 1 },
          { label: 'Movimento ou corpo no dia a dia', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'O que costuma derrubar sua consistência?',
        opcoes: [
          { label: 'Imprevistos no trabalho ou família', valor: 0 },
          { label: 'Falta de motivação depois de um tempo', valor: 1 },
          { label: 'Não sei por onde começar', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'Que apoio faria diferença pra você?',
        opcoes: [
          { label: 'Estrutura semanal com checkpoints', valor: 0 },
          { label: 'Alguém que desafia com carinho', valor: 1 },
          { label: 'Ferramentas simples que eu consiga repetir', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere continuar?',
        opcoes: [
          { label: 'Direct ou WhatsApp', valor: 0 },
          { label: 'Sessão experimental', valor: 1 },
          { label: 'Material antes de decidir', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'relacionamentos',
    label: 'Relacionamentos e limites',
    tituloQuiz: 'Conversa difícil adiada virou elefante na sala?',
    subtitulo: 'Autonomia e comunicação em foco. Não substitui terapia de casal ou trauma.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O foco principal hoje é…',
        opcoes: [
          { label: 'Vida a dois ou família', valor: 0 },
          { label: 'Trabalho e convivência profissional', valor: 1 },
          { label: 'Amizades e pertencimento', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'O que você sente que se repete?',
        opcoes: [
          { label: 'Dificuldade em dizer não', valor: 0 },
          { label: 'Medo de conflito ou abandono', valor: 1 },
          { label: 'Expectativas desalinhadas', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que seria um avanço real nos próximos meses?',
        opcoes: [
          { label: 'Conversas mais honestas', valor: 0 },
          { label: 'Limites claros sem culpa', valor: 1 },
          { label: 'Mais presença nas relações que importam', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo ideal?',
        opcoes: [
          { label: 'WhatsApp com contexto', valor: 0 },
          { label: 'Sessão para alinhar expectativa', valor: 1 },
          { label: 'Indicação se não for o perfil do coach', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'empreendedor',
    label: 'Empreendedor ou projeto próprio',
    tituloQuiz: 'Ideia boa na cabeça e execução que escorrega pela lateral?',
    subtitulo: 'Decisão e prioridade antes do call. Não é consultoria financeira nem jurídica.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Em que fase você se enxerga?',
        opcoes: [
          { label: 'Ideia ainda tomando forma', valor: 0 },
          { label: 'Já vendo, mas irregular', valor: 1 },
          { label: 'Crescimento com gargalo de gestão', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'O que mais te trava hoje?',
        opcoes: [
          { label: 'Priorizar o que importa', valor: 0 },
          { label: 'Consistência em divulgação', valor: 1 },
          { label: 'Medo de errar ou investir', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'Que tipo de conversa ajudaria agora?',
        opcoes: [
          { label: 'Clareza de oferta e cliente ideal', valor: 0 },
          { label: 'Rotina semanal de CEO', valor: 1 },
          { label: 'Accountability com metas pequenas', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere falar com o coach?',
        opcoes: [
          { label: 'WhatsApp', valor: 0 },
          { label: 'Videochamada', valor: 1 },
          { label: 'Formulário e retorno', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'autoconfianca',
    label: 'Autoconfiança e comunicação',
    tituloQuiz: 'Medo de parecer incapaz mesmo sabendo o que faz?',
    subtitulo: 'Presença e voz com honestidade. Não é tratamento para ansiedade clínica.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Onde isso mais aparece pra você?',
        opcoes: [
          { label: 'Reuniões ou apresentações', valor: 0 },
          { label: 'Redes ou exposição pública', valor: 1 },
          { label: 'Pedidos e negociação no dia a dia', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Quando a insegurança aparece, o que você faz?',
        opcoes: [
          { label: 'Adio ou evito', valor: 0 },
          { label: 'Vou na força e fico exausto', valor: 1 },
          { label: 'Dependo de validação de outras pessoas', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'Em 90 dias, o que “melhor um pouco” já valeria?',
        opcoes: [
          { label: 'Falar com mais calma em público', valor: 0 },
          { label: 'Dizer o que penso com respeito', valor: 1 },
          { label: 'Celebrar pequenas vitórias', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere continuar?',
        opcoes: [
          { label: 'Mensagem com objetivo claro', valor: 0 },
          { label: 'Sessão para sentir o estilo do coach', valor: 1 },
          { label: 'Conteúdo gratuito antes', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'proposito',
    label: 'Propósito e sentido',
    tituloQuiz: 'Sucesso por fora e vazio por dentro. Você não sabe nomear?',
    subtitulo: 'Direção e valores em poucos toques. Não promete respostas prontas sobre a vida.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que te fez pensar em coaching agora?',
        opcoes: [
          { label: 'Sinto que “rodo em círculo”', valor: 0 },
          { label: 'Mudança grande na vida (cidade, fim de ciclo…)', valor: 1 },
          { label: 'Quero alinhar trabalho com o que importa', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'O que você já tentou?',
        opcoes: [
          { label: 'Leitura e reflexão sozinho', valor: 0 },
          { label: 'Terapia ou outros apoios', valor: 1 },
          { label: 'Ainda estou explorando opções', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'Como você imagina o papel do coach nessa fase?',
        opcoes: [
          { label: 'Perguntas que abrem perspectiva', valor: 0 },
          { label: 'Plano de ações com acompanhamento', valor: 1 },
          { label: 'Ainda não sei, quero conversar', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo?',
        opcoes: [
          { label: 'WhatsApp', valor: 0 },
          { label: 'Conversa exploratória', valor: 1 },
          { label: 'Receber perguntas por escrito antes', valor: 2 },
        ],
      },
    ],
  },
]

export const COACH_DEMO_CLIENTE_NICHOS = NICHOS.map(({ value, label }) => ({ value, label }))

export function getCoachDemoClienteConfig(nicho: string | null | undefined): CoachDemoNichoClienteConfig | null {
  if (!nicho) return null
  return NICHOS.find((n) => n.value === nicho) ?? null
}

export function isCoachDemoNicho(s: string): s is CoachDemoNicho {
  return NICHOS.some((n) => n.value === s)
}

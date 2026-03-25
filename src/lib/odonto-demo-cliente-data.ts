/**
 * Perguntas de exemplo no lugar do PACIENTE (visão do dentista).
 */

export type OdontoDemoNicho =
  | 'clareamento'
  | 'implantes'
  | 'ortodontia'
  | 'dor_urgencia'
  | 'prevencao'
  | 'saude_bucal'

export interface OdontoDemoPerguntaCliente {
  id: string
  texto: string
  opcoes: { label: string; valor: number }[]
}

export interface OdontoDemoNichoClienteConfig {
  value: OdontoDemoNicho
  label: string
  tituloQuiz: string
  subtitulo: string
  perguntas: OdontoDemoPerguntaCliente[]
}

const NICHOS: OdontoDemoNichoClienteConfig[] = [
  {
    value: 'clareamento',
    label: 'Clareamento / estética do sorriso',
    tituloQuiz: 'Antes de falar com o dentista',
    subtitulo: 'Algumas perguntas rápidas sobre o que você busca.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que mais te incomoda no sorriso hoje?',
        opcoes: [
          { label: 'Cor dos dentes (mais amarelados)', valor: 0 },
          { label: 'Manchas ou diferença entre dentes', valor: 1 },
          { label: 'Quero avaliar opções com calma', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Você já fez clareamento ou tratamento estético antes?',
        opcoes: [
          { label: 'Nunca', valor: 0 },
          { label: 'Já fiz, quero retocar ou mudar', valor: 1 },
          { label: 'Só produtos caseiros / loja', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você espera do próximo passo?',
        opcoes: [
          { label: 'Entender se sou candidato e os cuidados', valor: 0 },
          { label: 'Saber prazos e o que envolve', valor: 1 },
          { label: 'Comparar com outras clínicas com base clara', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere continuar?',
        opcoes: [
          { label: 'Conversar no WhatsApp', valor: 0 },
          { label: 'Receber orientação e pensar', valor: 1 },
          { label: 'Marcar avaliação presencial', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'implantes',
    label: 'Implantes / reposição de dentes',
    tituloQuiz: 'Antes de falar com o dentista',
    subtitulo: 'Algumas perguntas rápidas sobre sua situação.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que descreve melhor seu caso hoje?',
        opcoes: [
          { label: 'Falta um ou mais dentes', valor: 0 },
          { label: 'Prótese solta ou incômoda', valor: 1 },
          { label: 'Quero entender se implante faz sentido pra mim', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Há quanto tempo está assim ou com essa dúvida?',
        opcoes: [
          { label: 'Recente (semanas ou poucos meses)', valor: 0 },
          { label: 'Já faz um tempo', valor: 1 },
          { label: 'Anos, mas quero resolver agora', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que é prioridade para você neste momento?',
        opcoes: [
          { label: 'Estabilidade ao mastigar e falar', valor: 0 },
          { label: 'Estética e confiança no sorriso', valor: 1 },
          { label: 'Entender etapas, tempo e cuidados', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo ideal?',
        opcoes: [
          { label: 'Tirar dúvidas no WhatsApp', valor: 0 },
          { label: 'Receber direcionamento por escrito', valor: 1 },
          { label: 'Agendar avaliação', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'ortodontia',
    label: 'Ortodontia (aparelho / alinhadores)',
    tituloQuiz: 'Antes de falar com o dentista',
    subtitulo: 'Algumas perguntas rápidas sobre alinhamento.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que mais te motiva a buscar ortodontia?',
        opcoes: [
          { label: 'Dentes tortos ou espaços', valor: 0 },
          { label: 'Mordida ou desconforto ao mastigar', valor: 1 },
          { label: 'Quero alinhar com estética discreta', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Você já usou aparelho antes?',
        opcoes: [
          { label: 'Nunca', valor: 0 },
          { label: 'Sim, na infância ou juventude', valor: 1 },
          { label: 'Incompleto ou relapso', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você quer saber primeiro?',
        opcoes: [
          { label: 'Quanto tempo costuma levar', valor: 0 },
          { label: 'Opções fixas vs alinhadores', valor: 1 },
          { label: 'Cuidados no dia a dia', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere seguir?',
        opcoes: [
          { label: 'WhatsApp com a clínica', valor: 0 },
          { label: 'Material e depois consulta', valor: 1 },
          { label: 'Marcar avaliação ortodôntica', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'dor_urgencia',
    label: 'Dor ou urgência',
    tituloQuiz: 'Antes de falar com o dentista',
    subtitulo: 'Algumas perguntas rápidas para orientar o primeiro contato.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Como está a dor ou o incômodo agora?',
        opcoes: [
          { label: 'Forte ou pulsando', valor: 0 },
          { label: 'Moderada, vem e vai', valor: 1 },
          { label: 'Leve, mas persistente', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Há inchaço na gengiva ou no rosto?',
        opcoes: [
          { label: 'Sim', valor: 0 },
          { label: 'Um pouco', valor: 1 },
          { label: 'Não', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você precisa com urgência?',
        opcoes: [
          { label: 'Alívio da dor e avaliação', valor: 0 },
          { label: 'Saber se consigo ser atendido hoje', valor: 1 },
          { label: 'Orientação até conseguir horário', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere continuar?',
        opcoes: [
          { label: 'Chamar no WhatsApp da clínica', valor: 0 },
          { label: 'Ligar para agendar', valor: 1 },
          { label: 'Ir presencialmente se possível', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'prevencao',
    label: 'Prevenção e check-up',
    tituloQuiz: 'Antes de falar com o dentista',
    subtitulo: 'Algumas perguntas rápidas sobre rotina.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Quando foi sua última consulta odontológica de rotina?',
        opcoes: [
          { label: 'Há menos de 6 meses', valor: 0 },
          { label: 'Entre 6 meses e 2 anos', valor: 1 },
          { label: 'Faz tempo ou não lembro', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'O que você busca agora?',
        opcoes: [
          { label: 'Limpeza e revisão geral', valor: 0 },
          { label: 'Check-up antes de viagem ou evento', valor: 1 },
          { label: 'Montar rotina de cuidado contínua', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'Alguma sensibilidade ou sangramento na escovação?',
        opcoes: [
          { label: 'Sim, com frequência', valor: 0 },
          { label: 'Às vezes', valor: 1 },
          { label: 'Não', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere agendar?',
        opcoes: [
          { label: 'WhatsApp', valor: 0 },
          { label: 'Receber opções de horário', valor: 1 },
          { label: 'Ligar para a recepção', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'saude_bucal',
    label: 'Gengiva, hálito ou sensibilidade',
    tituloQuiz: 'Antes de falar com o dentista',
    subtitulo: 'Algumas perguntas rápidas sobre sintomas.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que mais te incomoda?',
        opcoes: [
          { label: 'Gengiva sangrando ou inchada', valor: 0 },
          { label: 'Hálito ou sensação de boca “pesada”', valor: 1 },
          { label: 'Sensibilidade a frio, doce ou ao mastigar', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Isso afeta seu dia a dia?',
        opcoes: [
          { label: 'Sim, já evito certos alimentos', valor: 0 },
          { label: 'Incomoda socialmente', valor: 1 },
          { label: 'Quero resolver antes de piorar', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você espera do dentista?',
        opcoes: [
          { label: 'Diagnóstico claro e plano simples', valor: 0 },
          { label: 'Orientação de higiene em casa', valor: 1 },
          { label: 'Tratamento e acompanhamento', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo?',
        opcoes: [
          { label: 'Conversar no WhatsApp', valor: 0 },
          { label: 'Receber orientações por escrito', valor: 1 },
          { label: 'Marcar consulta', valor: 2 },
        ],
      },
    ],
  },
]

export const ODONTO_DEMO_CLIENTE_NICHOS = NICHOS.map(({ value, label }) => ({ value, label }))

export function getOdontoDemoClienteConfig(nicho: string | null | undefined): OdontoDemoNichoClienteConfig | null {
  if (!nicho) return null
  return NICHOS.find((n) => n.value === nicho) ?? null
}

export function isOdontoDemoNicho(s: string): s is OdontoDemoNicho {
  return NICHOS.some((n) => n.value === s)
}

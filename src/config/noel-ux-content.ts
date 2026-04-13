/**
 * Conteúdo UX do Noel por área (mensagem inicial, sugestões, placeholder).
 * Usado em NoelChat para orientar o usuário e aumentar o engajamento.
 *
 * A mensagem de boas-vindas é única para todas as áreas; sugestões e placeholders continuam por segmento.
 * Ao adicionar um valor em NoelArea, inclua uma entrada em NOEL_UX_BY_AREA ou o fallback DEFAULT_NOEL_UX_ROW será usado.
 */

export type NoelArea =
  | 'ylada'
  | 'med'
  | 'psi'
  | 'psicanalise'
  | 'odonto'
  | 'nutra'
  | 'nutri'
  | 'coach'
  | 'seller'
  | 'perfumaria'
  | 'estetica'
  | 'fitness'
  /** Mentor no painel Pro Líderes (operador / equipe; contexto em /api/pro-lideres/noel). */
  | 'pro_lideres'

export interface NoelUxContent {
  welcomeMessage: string
  suggestions: { label: string; prompt: string }[]
  placeholder: string
  placeholderExample: string
}

/** Texto fixo de abertura (sem API) — curto; detalhes vêm depois que a pessoa age ou pergunta. */
export const NOEL_UNIVERSAL_WELCOME = `Vamos montar seu primeiro link agora.

Me diga em uma frase o que você quer conquistar hoje.`

/**
 * Aviso na recepção do Noel (/pt/home) para quem ainda está em área neutra (perfil ylada ou outros).
 * Mostrado só na primeira visita; ver NoelNeutralSpecializationNotice.
 */
export const NOEL_NEUTRAL_SPECIALIZATION_NOTICE =
  'O Noel ainda não é especialista na sua área, mas já pode te ajudar a trazer mais clientes, com estratégia, vendas e organização do seu dia a dia.'

type NoelUxContentWithoutWelcome = Omit<NoelUxContent, 'welcomeMessage'>

const DEFAULT_SUGGESTIONS = [
  { label: 'Criar meu primeiro link', prompt: 'Quero criar meu primeiro link para atrair clientes' },
  { label: 'Atrair mais clientes', prompt: 'Como atrair mais clientes com meu link?' },
  { label: 'Melhorar minhas conversas', prompt: 'Como melhorar minhas conversas com quem responde o link?' },
]

const ESTETICA_SUGGESTIONS = [
  { label: 'Criar meu primeiro link', prompt: 'Quero criar um link para atrair clientes na estética' },
  { label: 'Atrair mais clientes', prompt: 'Como atrair mais clientes para meus serviços de estética?' },
  { label: 'Melhorar minhas conversas', prompt: 'Como melhorar minhas conversas depois que a cliente responde?' },
]

const ODONTO_SUGGESTIONS = [
  { label: 'Criar meu primeiro link', prompt: 'Quero criar um link para atrair pacientes na odontologia' },
  { label: 'Atrair mais clientes', prompt: 'Como atrair mais pacientes com meu link?' },
  { label: 'Melhorar minhas conversas', prompt: 'Como melhorar conversas depois que a pessoa responde?' },
]

const PSI_SUGGESTIONS = [
  { label: 'Criar meu primeiro link', prompt: 'Quero criar um link para atrair clientes para terapia' },
  { label: 'Atrair mais clientes', prompt: 'Como atrair mais clientes para psicologia?' },
  { label: 'Melhorar minhas conversas', prompt: 'Como melhorar minhas conversas com novos contatos?' },
]

const FITNESS_SUGGESTIONS = [
  { label: 'Criar meu primeiro link', prompt: 'Quero criar um link para atrair alunos ou avaliações' },
  { label: 'Atrair mais clientes', prompt: 'Como atrair mais pessoas para treino ou academia?' },
  { label: 'Melhorar minhas conversas', prompt: 'Como melhorar conversas com quem responde meu link?' },
]

const COACH_SUGGESTIONS = [
  { label: 'Criar meu primeiro link', prompt: 'Quero criar um link para atrair clientes de coaching' },
  { label: 'Atrair mais clientes', prompt: 'Como atrair mais clientes para sessões?' },
  { label: 'Melhorar minhas conversas', prompt: 'Como melhorar conversas com leads?' },
]

const MED_SUGGESTIONS = [
  { label: 'Criar meu primeiro link', prompt: 'Quero criar um link para atrair pacientes' },
  { label: 'Atrair mais clientes', prompt: 'Como atrair mais pacientes com meu link?' },
  { label: 'Melhorar minhas conversas', prompt: 'Como melhorar conversas no consultório?' },
]

const NUTRA_SUGGESTIONS = [
  { label: 'Criar meu primeiro link', prompt: 'Quero criar um link para vender mais' },
  { label: 'Atrair mais clientes', prompt: 'Como atrair mais clientes para meus produtos?' },
  { label: 'Melhorar minhas conversas', prompt: 'Como melhorar conversas com quem responde?' },
]

const NUTRI_SUGGESTIONS = [
  { label: 'Criar meu primeiro link', prompt: 'Quero criar um link para atrair pacientes nutricionais' },
  { label: 'Atrair mais clientes', prompt: 'Como atrair mais pacientes para consulta?' },
  { label: 'Melhorar minhas conversas', prompt: 'Como melhorar conversas depois do link?' },
]

const PSICANALISE_SUGGESTIONS = [
  { label: 'Criar meu primeiro link', prompt: 'Quero criar um link para atrair análises' },
  { label: 'Atrair mais clientes', prompt: 'Como atrair mais clientes para atendimento?' },
  { label: 'Melhorar minhas conversas', prompt: 'Como melhorar conversas com interessados?' },
]

const PERFUMARIA_SUGGESTIONS = [
  { label: 'Criar meu primeiro link', prompt: 'Quero criar um link para perfumaria' },
  { label: 'Atrair mais clientes', prompt: 'Como atrair mais clientes para meus produtos?' },
  { label: 'Melhorar minhas conversas', prompt: 'Como melhorar conversas no WhatsApp?' },
]

const SELLER_SUGGESTIONS = [
  { label: 'Criar meu primeiro link', prompt: 'Quero criar um link para vender mais' },
  { label: 'Atrair mais clientes', prompt: 'Como atrair mais clientes?' },
  { label: 'Melhorar minhas conversas', prompt: 'Como melhorar minhas conversas de venda?' },
]

const PRO_LIDERES_SUGGESTIONS = [
  {
    label: 'Primeiro contato no WhatsApp',
    prompt:
      'Preciso de um script curto e natural para o primeiro contato no WhatsApp com alguém que demonstrou interesse (sem ser invasivo).',
  },
  {
    label: 'Explicar a ferramenta (link)',
    prompt:
      'Me ajuda com um texto para explicar, em poucas linhas, o que a pessoa vai fazer ao abrir o meu link YLADA (quiz/calculadora) e por que vale a pena.',
  },
  {
    label: 'Pedir permissão antes do link',
    prompt:
      'Quero um script educado para pedir permissão antes de enviar o link (opt-in), no tom de conversa de WhatsApp.',
  },
  {
    label: 'Atender no WhatsApp',
    prompt:
      'Me dá um roteiro para conduzir a conversa no WhatsApp depois que a pessoa respondeu ao link: tirar dúvidas, criar confiança e próximo passo.',
  },
]

const NOEL_PRO_LIDERES_WELCOME = `Sou o **Noel** no teu espaço **Pro Líderes**.

Estou focado na operação de campo: **contato**, **WhatsApp**, **links YLADA** e **scripts** para tu e a tua equipa — no contexto do teu operador (ex.: Herbalife / h‑líder).

Diz-me em uma frase o que precisas agora (ou usa uma sugestão abaixo).`

/** Fallback quando uma nova NoelArea ainda não tem linha dedicada em NOEL_UX_BY_AREA. */
const DEFAULT_NOEL_UX_ROW: NoelUxContentWithoutWelcome = {
  suggestions: DEFAULT_SUGGESTIONS,
  placeholder: 'Pergunte algo ao Noel...',
  placeholderExample: 'Ex: Quero gerar mais clientes',
}

const NOEL_UX_BY_AREA: Record<NoelArea, NoelUxContentWithoutWelcome> = {
  ylada: {
    suggestions: DEFAULT_SUGGESTIONS,
    placeholder: 'Pergunte algo ao Noel...',
    placeholderExample: 'Ex: Quero gerar mais clientes',
  },
  estetica: {
    suggestions: ESTETICA_SUGGESTIONS,
    placeholder: 'Pergunte algo ao Noel...',
    placeholderExample: 'Ex: Quero gerar mais clientes para limpeza de pele',
  },
  med: {
    suggestions: MED_SUGGESTIONS,
    placeholder: 'Pergunte algo ao Noel...',
    placeholderExample: 'Ex: Quero atrair mais pacientes para consulta',
  },
  psi: {
    suggestions: PSI_SUGGESTIONS,
    placeholder: 'Pergunte algo ao Noel...',
    placeholderExample: 'Ex: Como atrair mais clientes para terapia',
  },
  psicanalise: {
    suggestions: PSICANALISE_SUGGESTIONS,
    placeholder: 'Pergunte algo ao Noel...',
    placeholderExample: 'Ex: Como atrair mais clientes',
  },
  odonto: {
    suggestions: ODONTO_SUGGESTIONS,
    placeholder: 'Pergunte algo ao Noel...',
    placeholderExample: 'Ex: Quero atrair mais pacientes para clareamento',
  },
  nutra: {
    suggestions: NUTRA_SUGGESTIONS,
    placeholder: 'Pergunte algo ao Noel...',
    placeholderExample: 'Ex: Como vender mais produtos',
  },
  nutri: {
    suggestions: NUTRI_SUGGESTIONS,
    placeholder: 'Pergunte algo ao Noel...',
    placeholderExample: 'Ex: Como atrair mais pacientes para consulta',
  },
  coach: {
    suggestions: COACH_SUGGESTIONS,
    placeholder: 'Pergunte algo ao Noel...',
    placeholderExample: 'Ex: Como conseguir mais leads',
  },
  seller: {
    suggestions: SELLER_SUGGESTIONS,
    placeholder: 'Pergunte algo ao Noel...',
    placeholderExample: 'Ex: Como aumentar minhas vendas',
  },
  perfumaria: {
    suggestions: PERFUMARIA_SUGGESTIONS,
    placeholder: 'Pergunte algo ao Noel...',
    placeholderExample: 'Ex: Como atrair mais clientes para perfumaria',
  },
  fitness: {
    suggestions: FITNESS_SUGGESTIONS,
    placeholder: 'Pergunte algo ao Noel...',
    placeholderExample: 'Ex: Como atrair mais alunos para academia',
  },
  pro_lideres: {
    suggestions: PRO_LIDERES_SUGGESTIONS,
    placeholder: 'Pergunte ao Noel sobre scripts, links ou WhatsApp...',
    placeholderExample: 'Ex: Script para retomar conversa depois de 3 dias',
  },
}

export function getNoelUxContent(area: NoelArea): NoelUxContent {
  const row = NOEL_UX_BY_AREA[area] ?? DEFAULT_NOEL_UX_ROW
  const welcomeMessage = area === 'pro_lideres' ? NOEL_PRO_LIDERES_WELCOME : NOEL_UNIVERSAL_WELCOME
  return {
    welcomeMessage,
    ...row,
  }
}

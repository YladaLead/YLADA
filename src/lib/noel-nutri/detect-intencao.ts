/**
 * Detecção de intenção-raiz para o Noel Nutri.
 * Backend controla; modelo só executa. 4 categorias cobrem todas as perguntas.
 */

export type IntencaoNutri = 'captacao' | 'conversao' | 'organizacao' | 'desbloqueio'

const CAPTACAO = [
  'link', 'links', 'quiz', 'quizzes', 'ativar conversa', 'ativar conversas', 'captar', 'captação',
  'não tenho cliente', 'sem cliente', 'gerar lead', 'leads', 'qual link', 'meu link', 'link principal',
  'enviar para cliente', 'emagrecimento', 'emagrecer', 'captação', 'ferramenta', 'ferramentas'
]
const CONVERSAO = [
  'fechar', 'fechamento', 'conversão', 'conversao', 'consulta', 'agendar', 'lead respondeu',
  'quanto cobrar', 'cobrar', 'script de fechamento', 'avaliação', 'avaliacao', 'plano',
  'fechar consulta', 'responder lead', 'qualificar'
]
const ORGANIZACAO = [
  'agenda', 'organizar', 'rotina', 'meta', 'disciplina', 'o que fazer hoje', 'hoje',
  'semana', 'organizar agenda', 'agenda cheia', 'painel', 'diário', 'diario'
]
const DESBLOQUEIO = [
  'não sei', 'nao sei', 'me ajuda', 'ajuda', 'travada', 'travado', 'difícil', 'dificil',
  'quero crescer', 'por onde começo', 'começar', 'comecar', 'confusa', 'confuso',
  'perdida', 'perdido', 'o que fazer', 'primeiro passo'
]

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .trim()
}

/**
 * Classifica a mensagem do usuário em uma das 4 intenções-raiz.
 * Usado pelo backend antes de chamar o modelo; o modelo recebe intencao_detectada no contexto.
 */
export function detectarIntencaoNutri(mensagem: string): IntencaoNutri {
  if (!mensagem || typeof mensagem !== 'string') return 'desbloqueio'
  const t = normalizar(mensagem)

  let captacao = 0, conversao = 0, organizacao = 0, desbloqueio = 0
  CAPTACAO.forEach(palavra => { if (t.includes(palavra)) captacao++ })
  CONVERSAO.forEach(palavra => { if (t.includes(palavra)) conversao++ })
  ORGANIZACAO.forEach(palavra => { if (t.includes(palavra)) organizacao++ })
  DESBLOQUEIO.forEach(palavra => { if (t.includes(palavra)) desbloqueio++ })

  const max = Math.max(captacao, conversao, organizacao, desbloqueio)
  if (max === 0) return 'desbloqueio'
  if (captacao === max) return 'captacao'
  if (conversao === max) return 'conversao'
  if (organizacao === max) return 'organizacao'
  return 'desbloqueio'
}

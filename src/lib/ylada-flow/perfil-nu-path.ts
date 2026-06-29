/**
 * Helpers da rota pública `/[perfil]` nua (um segmento só = handle do profissional).
 * Simétrico ao `/[perfil]/[fluxo]` (`perfil-fluxo-path.ts`), mas pra um segmento.
 * @see blueprint-plataforma/Paginas_Entrada_Arquitetura.md §1.1
 */
import { isValidPerfilSegment } from '@/lib/ylada-flow/legacy-url-redirect'

const PERFIL_NU_PATH_RE = /^\/([a-z0-9][a-z0-9-]*)\/?$/i

/**
 * Rotas reais de 1º nível (sem prefixo de idioma): hoje `/x` bare é redirecionado
 * pra `/pt/x` (ou é rota própria). NENHUMA delas pode ser tratada como handle de
 * perfil, senão a página nua engole a rota e quebra o bare→/pt.
 *
 * ⚠️ Gerada das pastas `app/pt/*` + `app/*` (29/06/2026). Rota de 1º nível NOVA
 * precisa entrar aqui (mesma disciplina do reserved set do perfil-fluxo-path).
 * Mais restritivo que `isValidPerfilSegment` de propósito: o segmento único colide
 * com mais rotas reais que o par `/[perfil]/[fluxo]`.
 */
const RESERVED_TOP_LEVEL_ROUTES = new Set<string>([
  'admin', 'admin-diagnosticos', 'auth', 'c', 'cadastro', 'calculadora-imc',
  'clinicas-estetica-corporal', 'coach', 'coach-bem-estar', 'comecar', 'como-funciona',
  'consultoria', 'conviccao', 'conviccao-gera-performance', 'create', 'creative-studio',
  'criar', 'cursos', 'dashboard', 'demo-resultado-diagnostico-curto', 'demo-visao-cliente',
  'diagnostico', 'diagnostico-conviccao', 'diagnosticos', 'empreendedor', 'en', 'entrada',
  'entrar', 'es', 'escolha-perfil', 'estetica', 'estetica-consultoria', 'f', 'fitness',
  'institucional', 'joias', 'l', 'link', 'link-indisponivel', 'login', 'm', 'med',
  'metodo-ylada', 'migrado', 'nutra', 'nutri', 'nutricionista', 'odonto', 'p', 'parceiros',
  'perfumaria', 'pesquisa-uso-ylada', 'pilot', 'politica-de-cookies',
  'politica-de-privacidade', 'politica-de-reembolso', 'post-curiosidades', 'precos',
  'privacidade', 'pro-estetica', 'pro-estetica-capilar', 'pro-estetica-corporal',
  'pro-joias', 'pro-lideres', 'profissionais', 'promo', 'psi', 'psicanalise', 'pt',
  'quiz-interativo', 'recuperar-senha', 'reset-password', 'resultado', 'segmentos',
  'seller', 'sistema-conversas-ativas', 'smart-chat', 'sobre', 'solicitar-acesso',
  'suporte', 'template', 'template-post-dica', 'template-reels-roteirizado', 'templates',
  'termos', 'termos-de-uso', 'vendedor', 'wellness', 'ylada', 'ylada-boards', 'ylada-demo',
])

/** Segmento único pode ser handle de perfil? (não-reservado E não rota de 1º nível). */
function isPerfilNuHandle(seg: string): boolean {
  const s = seg.toLowerCase()
  if (!isValidPerfilSegment(s)) return false
  if (RESERVED_TOP_LEVEL_ROUTES.has(s)) return false
  return true
}

/**
 * True se o pathname parece `/[perfil]` público (um segmento, sem prefixo de idioma).
 * Exclui reservados, palavras-de-app e rotas reais de 1º nível, então `/home`,
 * `/login`, `/wellness`, `/precos` etc. NÃO são tratados como handle.
 */
export function isPerfilNuPublicPath(pathname: string): boolean {
  return parsePerfilNuPath(pathname) !== null
}

export function parsePerfilNuPath(pathname: string): string | null {
  const normalized =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.replace(/\/+$/, '') : pathname
  const m = normalized.match(PERFIL_NU_PATH_RE)
  if (!m) return null
  const perfil = m[1].toLowerCase()
  if (!isPerfilNuHandle(perfil)) return null
  return perfil
}

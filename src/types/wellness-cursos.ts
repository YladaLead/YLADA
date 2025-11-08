/**
 * Tipos TypeScript para o sistema de Cursos Wellness
 */

export type CategoriaCurso = 'tutorial' | 'filosofia'
export type TipoMaterial = 'pdf' | 'video'

/**
 * Curso Wellness
 */
export interface WellnessCurso {
  id: string
  titulo: string
  descricao: string | null
  categoria: CategoriaCurso
  thumbnail_url: string | null
  slug: string
  ordem: number
  ativo: boolean
  created_at: string
  updated_at: string
}

/**
 * Módulo (nível mais alto)
 * curso_id pode ser null se o módulo estiver na biblioteca
 */
export interface WellnessCursoModulo {
  id: string
  curso_id: string | null
  titulo: string
  descricao: string | null
  ordem: number
  created_at: string
  updated_at: string
}

/**
 * Tópico dentro de um módulo
 */
export interface WellnessModuloTopico {
  id: string
  modulo_id: string
  titulo: string
  descricao: string | null
  ordem: number
  created_at: string
  updated_at: string
}

/**
 * Curso (Material: PDF ou Vídeo) dentro de um tópico
 * Hierarquia: Módulo → Tópico → Curso (Material)
 */
export interface WellnessCursoMaterial {
  id: string
  modulo_id: string | null // Mantido para compatibilidade, mas agora usa topico_id
  topico_id: string // Nova referência ao tópico
  tipo: TipoMaterial
  titulo: string
  descricao: string | null
  arquivo_url: string
  duracao: number | null // Duração em segundos (para vídeos)
  ordem: number
  gratuito: boolean
  created_at: string
  updated_at: string
}

/**
 * Progresso do usuário em um curso
 */
export interface WellnessCursoProgresso {
  id: string
  user_id: string
  curso_id: string
  modulo_id: string | null
  material_id: string | null
  concluido: boolean
  tempo_assistido: number // Tempo em segundos
  ultimo_acesso: string
  created_at: string
  updated_at: string
}

/**
 * Curso com informações completas (incluindo módulos, tópicos e materiais)
 * Nova hierarquia: Módulo → Tópico → Material (Curso)
 */
export interface WellnessCursoCompleto extends WellnessCurso {
  modulos: (WellnessCursoModulo & {
    topicos: (WellnessModuloTopico & {
      cursos: WellnessCursoMaterial[]
    })[]
  })[]
  progresso?: {
    total_materiais: number
    materiais_concluidos: number
    porcentagem: number
  }
}

/**
 * Módulo com tópicos
 */
export interface WellnessCursoModuloComTopicos extends WellnessCursoModulo {
  topicos: (WellnessModuloTopico & {
    cursos: WellnessCursoMaterial[]
  })[]
}

/**
 * Tópico com cursos (materiais)
 */
export interface WellnessModuloTopicoComCursos extends WellnessModuloTopico {
  cursos: WellnessCursoMaterial[]
  progresso?: {
    total_cursos: number
    cursos_concluidos: number
    porcentagem: number
  }
}

/**
 * Material com informações de progresso
 */
export interface WellnessCursoMaterialComProgresso extends WellnessCursoMaterial {
  progresso?: {
    concluido: boolean
    tempo_assistido: number
    ultimo_acesso: string | null
  }
}

/**
 * DTOs para criação/atualização
 */
export interface CreateWellnessCursoDTO {
  titulo: string
  descricao?: string
  categoria: CategoriaCurso
  thumbnail_url?: string
  slug: string
  ordem?: number
  ativo?: boolean
}

export interface UpdateWellnessCursoDTO {
  titulo?: string
  descricao?: string
  categoria?: CategoriaCurso
  thumbnail_url?: string
  slug?: string
  ordem?: number
  ativo?: boolean
}

export interface CreateWellnessCursoModuloDTO {
  curso_id?: string | null // Opcional: null = módulo na biblioteca
  titulo: string
  descricao?: string
  ordem?: number
}

export interface UpdateWellnessCursoModuloDTO {
  titulo?: string
  descricao?: string
  ordem?: number
}

export interface CreateWellnessModuloTopicoDTO {
  modulo_id: string
  titulo: string
  descricao?: string
  ordem?: number
}

export interface UpdateWellnessModuloTopicoDTO {
  titulo?: string
  descricao?: string
  ordem?: number
}

export interface CreateWellnessCursoMaterialDTO {
  topico_id: string // Agora referencia tópico, não módulo
  tipo: TipoMaterial
  titulo: string
  descricao?: string
  arquivo_url: string
  duracao?: number
  ordem?: number
  gratuito?: boolean
}

export interface UpdateWellnessCursoMaterialDTO {
  titulo?: string
  descricao?: string
  arquivo_url?: string
  duracao?: number
  ordem?: number
  gratuito?: boolean
}

export interface UpdateWellnessCursoProgressoDTO {
  concluido?: boolean
  tempo_assistido?: number
}

/**
 * Resposta da API para lista de cursos
 */
export interface WellnessCursosListResponse {
  cursos: WellnessCurso[]
  total: number
}

/**
 * Resposta da API para curso completo
 */
export interface WellnessCursoCompletoResponse {
  curso: WellnessCursoCompleto
}

/**
 * Resposta da API para progresso
 */
export interface WellnessCursoProgressoResponse {
  curso_id: string
  total_materiais: number
  materiais_concluidos: number
  porcentagem: number
  modulos: {
    modulo_id: string
    total_materiais: number
    materiais_concluidos: number
    porcentagem: number
  }[]
}


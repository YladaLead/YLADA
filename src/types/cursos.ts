// =====================================================
// TIPOS E INTERFACES - ÁREA DE CURSOS
// =====================================================

export interface Trilha {
  id: string
  title: string
  slug: string
  description: string
  short_description: string
  thumbnail_url?: string
  banner_url?: string
  status: 'draft' | 'published' | 'archived'
  ordem: number
  estimated_hours: number
  level: 'iniciante' | 'intermediario' | 'avancado'
  is_premium: boolean
  progress_percentage?: number
  modulos_count?: number
  aulas_count?: number
  created_at: string
  updated_at: string
}

export interface Modulo {
  id: string
  trilha_id: string
  title: string
  description: string
  ordem: number
  estimated_minutes: number
  aulas_count?: number
  progress_percentage?: number
  created_at: string
  updated_at: string
}

export interface Aula {
  id: string
  modulo_id: string
  title: string
  description: string
  content_type: 'video' | 'texto' | 'quiz' | 'exercicio'
  content_url?: string
  content_text?: string
  duration_minutes: number
  ordem: number
  is_preview: boolean
  completed?: boolean
  last_position?: number
  created_at: string
  updated_at: string
}

export interface Microcurso {
  id: string
  title: string
  slug: string
  description: string
  thumbnail_url?: string
  video_url: string
  duration_minutes: number
  category: string
  is_featured: boolean
  progress_percentage?: number
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

export interface BibliotecaItem {
  id: string
  title: string
  description: string
  file_type: 'pdf' | 'template' | 'script' | 'planilha' | 'mensagem' | 'outro'
  file_url: string
  category: string
  thumbnail_url?: string
  download_count: number
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

export interface Tutorial {
  id: string
  title: string
  slug: string
  description: string
  tool_name: string
  tool_slug: string
  video_url: string
  duration_minutes: number
  level: 'basico' | 'intermediario' | 'avancado'
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

export interface Progresso {
  id: string
  user_id: string
  item_type: 'trilha' | 'microcurso' | 'tutorial'
  item_id: string
  progress_percentage: number
  last_position: number
  completed_at?: string
  started_at: string
  updated_at: string
}

export interface Favorito {
  id: string
  user_id: string
  item_type: 'trilha' | 'microcurso' | 'tutorial' | 'biblioteca'
  item_id: string
  created_at: string
}

export interface Certificado {
  id: string
  user_id: string
  trilha_id: string
  certificate_url: string
  issued_at: string
}

export interface Material {
  id: string
  aula_id: string
  title: string
  file_type: string
  file_url: string
  ordem: number
  created_at: string
}

export interface ProgressoGeral {
  trilhas_completas: number
  trilhas_em_andamento: number
  microcursos_assistidos: number
  horas_estudadas: number
  certificados_obtidos: number
  trilhas_progresso: Array<{
    trilha_id: string
    trilha_title: string
    progress_percentage: number
  }>
}

export interface ContinuarAgora {
  item_type: 'trilha' | 'microcurso' | 'tutorial'
  item_id: string
  item_title: string
  progress_percentage: number
  last_position?: number
  aula_id?: string
  modulo_id?: string
}


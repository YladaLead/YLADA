export interface Trilha {
  id: string
  title: string
  description: string
  short_description?: string
  thumbnail_url?: string
  estimated_hours: number
  level: 'iniciante' | 'intermediario' | 'avancado'
  modulos_count?: number
  progress_percentage: number
  is_recommended?: boolean
  badge?: 'Novo' | 'Essencial' | 'Recomendado'
  created_at: string
  updated_at: string
}

export interface Aula {
  id: string
  trail_id: string
  modulo_id?: string
  title: string
  description: string
  video_url?: string
  video_duration_minutes?: number
  order: number
  is_completed: boolean
  created_at: string
  updated_at: string
}

export interface Modulo {
  id: string
  trail_id: string
  title: string
  description?: string
  order: number
  aulas: Aula[]
  created_at: string
  updated_at: string
}

export interface Microcurso {
  id: string
  title: string
  description: string
  thumbnail_url?: string
  duration_minutes: number
  video_url?: string
  checklist_items?: string[]
  created_at: string
  updated_at: string
}

export interface BibliotecaItem {
  id: string
  title: string
  description: string
  category: 'Scripts de Atendimento' | 'Checklists' | 'Templates' | 'PDFs educativos' | 'Materiais de apoio'
  file_type: 'pdf' | 'template' | 'script' | 'planilha' | 'mensagem' | 'outro'
  file_url: string
  is_favorited?: boolean
  created_at: string
  updated_at: string
}

export interface Tutorial {
  id: string
  title: string
  description: string
  tool_name: string
  video_url: string
  duration_minutes: number
  level: 'basico' | 'intermediario' | 'avancado'
  thumbnail_url?: string
  created_at: string
  updated_at: string
}

export interface ProgressoTrilha {
  id: string
  user_id: string
  trail_id: string
  lesson_id: string
  is_completed: boolean
  watched_percentage: number
  last_position_seconds?: number
  completed_at?: string
  created_at: string
  updated_at: string
}


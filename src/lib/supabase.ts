import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  age?: number
  gender?: string
  weight?: number
  height?: number
  activity?: string
  calculatorType: string
  results?: Record<string, unknown>
  recommendations?: Record<string, unknown>
  quizType?: string
  quizResults?: Record<string, unknown>
  status: string
  priority: string
  source?: string
  ipAddress?: string
  userAgent?: string
  professionalId?: string
  createdAt: string
  updatedAt: string
}

export interface Professional {
  id: string
  name: string
  email: string
  phone?: string
  specialty?: string
  company?: string
  license?: string
  isActive: boolean
  maxLeads: number
  createdAt: string
  updatedAt: string
}

export interface LeadNote {
  id: string
  leadId: string
  content: string
  author: string
  createdAt: string
}

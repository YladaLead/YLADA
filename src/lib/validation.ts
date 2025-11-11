import { z } from 'zod'

// Schema para criação de quiz
export const CreateQuizSchema = z.object({
  titulo: z.string().min(3).max(255).trim(),
  descricao: z.string().max(1000).optional(),
  emoji: z.string().max(10).optional(),
  cores: z.object({
    primaria: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    secundaria: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    texto: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    fundo: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  }).optional(),
  configuracoes: z.record(z.any()).optional(),
  entrega: z.record(z.any()).optional(),
  slug: z.string().min(3).max(255).regex(/^[a-z0-9-]+$/),
  perguntas: z.array(z.object({
    tipo: z.enum(['multipla', 'dissertativa', 'escala', 'simnao']),
    titulo: z.string().min(1).max(500), // Reduzido de min(5) para min(1) para permitir perguntas mais curtas
    opcoes: z.array(z.string()).max(10).optional(),
    obrigatoria: z.boolean().default(true),
  })).min(0).max(20), // Alterado de min(1) para min(0) para permitir salvar quiz sem perguntas inicialmente
})

// Schema para captura de leads
export const CreateLeadSchema = z.object({
  slug: z.string().min(3).max(255),
  name: z.string().min(2).max(255).trim(),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  additionalData: z.record(z.any()).optional(),
})

// Schema para respostas de quiz
export const QuizResponseSchema = z.object({
  quizId: z.string().uuid(),
  perguntaId: z.string().uuid(),
  nome: z.string().min(2).max(255).optional(),
  email: z.string().email().optional(),
  telefone: z.string().max(20).optional(),
  resposta: z.record(z.any()),
})

// Schema para atualização de quiz
export const UpdateQuizSchema = z.object({
  quizId: z.string().uuid(),
  quizData: z.object({
    titulo: z.string().min(3).max(255).optional(),
    descricao: z.string().max(1000).optional(),
    status: z.enum(['active', 'inactive', 'draft']).optional(),
  }).optional(),
  perguntas: z.array(z.any()).optional(),
  action: z.enum(['publish']).optional(),
})

// Função helper para sanitizar strings
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
}

// Função helper para validar email
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Função helper para validar URL
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return ['http:', 'https:'].includes(urlObj.protocol)
  } catch {
    return false
  }
}

// Função helper para validar tamanho de arquivo (futuro upload)
export function isValidFileSize(size: number, maxSizeBytes: number = 5242880): boolean {
  return size <= maxSizeBytes
}


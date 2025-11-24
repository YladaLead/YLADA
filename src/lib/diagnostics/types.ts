/**
 * TIPOS COMPARTILHADOS PARA DIAGNÓSTICOS
 * 
 * Interfaces usadas por todas as áreas (Nutri, Wellness, Coach, Nutra)
 */

export interface DiagnosticoCompleto {
  diagnostico: string
  causaRaiz: string
  acaoImediata: string
  plano7Dias?: string // Opcional para área Nutri (será definido pela nutricionista)
  suplementacao?: string // Opcional para área Nutri (será definido pela nutricionista)
  alimentacao?: string // Opcional para área Nutri (será definido pela nutricionista)
  proximoPasso?: string // Seção 7 opcional - gatilho emocional + CTA indireto
}

export interface ResultadoPossivel {
  id: string
  label: string
  range: string
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  diagnosticoCompleto: DiagnosticoCompleto
}

export interface DiagnosticosPorFerramenta {
  [profissao: string]: {
    [resultadoId: string]: DiagnosticoCompleto
  }
}


/**
 * Tipos para Sistema de Orientação Técnica
 * Usado em Wellness, Nutri, Coach
 */

export type Area = 'wellness' | 'nutri' | 'coach'

export interface OrientacaoItem {
  id: string
  titulo: string
  descricao: string
  caminho: string
  passo_a_passo: string[]
  icone: string
  categoria: 'clientes' | 'ferramentas' | 'relatorios' | 'configuracao' | 'outros'
  palavras_chave: string[]
  atalho?: string // Ex: "Menu > Clientes > Novo"
  nivel_dificuldade?: 'facil' | 'medio' | 'avancado'
}

export interface MentorInfo {
  temMentor: boolean
  nome?: string
  whatsapp?: string
  email?: string
}

export interface OrientacaoResposta {
  tipo: 'tecnica' | 'conceitual'
  item?: OrientacaoItem
  resposta?: string
  temMentor?: boolean
  mentor?: MentorInfo
  sugestaoMentor?: {
    mostrar: boolean
    mensagem: string
    acao: string
    whatsapp?: string
  }
}


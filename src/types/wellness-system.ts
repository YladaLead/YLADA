/**
 * WELLNESS SYSTEM - Tipos e Interfaces
 * 
 * Estrutura de dados completa para implementação do sistema
 * de recrutamento e vendas de bebidas funcionais
 */

// ============================================
// PRODUTOS
// ============================================

export interface Produto {
  id: string
  nome: string
  peso: string // "100g", "60g", "102g", "51g"
  pv: number
  precoSugerido: number
  custo50: number
  doses: number
  custoPorDose: number
}

export type TipoKit = 'energia' | 'acelera' | 'ambos'

export interface Kit {
  id: string
  tipo: TipoKit
  nome: string
  descricao: string
  conteudo: string // "5 garrafinhas de NRG Energia"
  uso: string[]
  indicacao: string
}

// ============================================
// FLUXOS DE CLIENTES
// ============================================

export interface Pergunta {
  id: string
  texto: string
  tipo: 'escala' | 'sim_nao' | 'multipla_escolha' | 'texto'
  opcoes?: string[] // Para múltipla escolha
  escalaMin?: number // Para escala (padrão: 0)
  escalaMax?: number // Para escala (padrão: 10)
}

export interface Diagnostico {
  titulo: string
  descricao: string
  sintomas: string[] // Lista de sintomas relatados
  beneficios: string[] // Lista de benefícios
  mensagemPositiva: string
}

export interface FluxoCliente {
  id: string
  nome: string
  objetivo: string
  perguntas: Pergunta[]
  diagnostico: Diagnostico
  kitRecomendado: TipoKit
  cta: string // Chamada para ação
  tags: string[] // Para busca e filtros
}

// ============================================
// FLUXOS DE RECRUTAMENTO
// ============================================

export type PerfilRecrutamento = 
  | 'visionario-renda-funcional'
  | 'mae-flex-premium'
  | 'bem-estar-lucrativo'
  | 'digital-renda-flexivel'

export interface PerfilRecrutamentoData {
  id: PerfilRecrutamento
  nome: string
  idealPara: string
  caracteristicas: string[]
  mensagemFinal: string
}

export interface GrupoInteresse {
  id: string
  nome: string
  descricao: string
  caracteristicas: string[]
  estrategia: string
}

export interface ConclusaoRecrutamento {
  id: string
  titulo: string
  mensagem: string
  proximoPasso: string
}

// ============================================
// LINKS DE ATRAÇÃO
// ============================================

export type TipoLinkAtracao = 
  | 'bebida-ideal'
  | 'teste-energia'
  | 'avaliacao-detox'
  | 'hidratacao-inteligente'
  | 'objetivo'

export interface LinkAtracao {
  id: string
  tipo: TipoLinkAtracao
  nome: string
  descricao: string
  geraLead: boolean
  classificacao: string
  indicacaoAutomatica: string
  chamadaApresentacao: string
}

// ============================================
// APRESENTAÇÃO DE NEGÓCIO
// ============================================

export interface ApresentacaoNegocio {
  id: string
  titulo: string
  estrutura: {
    abertura: string
    demonstracao: string[]
    historia: string
    oportunidade: string
    planoSimples: {
      ganho1: string
      ganho2: string
      ganho3: string
    }
    fechamento: string
  }
}

// ============================================
// SCRIPTS
// ============================================

export type TipoScript = 
  | 'abertura'
  | 'pos-link'
  | 'pos-diagnostico'
  | 'oferta'
  | 'fechamento'
  | 'objecoes'
  | 'recuperacao'
  | 'indicacoes'
  | 'pos-venda'
  | 'recompra'

export interface Script {
  id: string
  tipo: TipoScript
  titulo: string
  conteudo: string
  contexto: string // Quando usar
  variacoes?: string[] // Versões alternativas
}

// ============================================
// KIT DE INÍCIO
// ============================================

export interface KitInicio {
  checklist24h: string[]
  scriptApresentacao: string
  fluxosCaptacao: string[] // IDs dos fluxos
  videosTreinamento: {
    id: string
    titulo: string
    url: string
    duracao: string
  }[]
  mensagensConvite: string[]
  guiaLinksWellness: string
  agendaResultados: {
    dia: number
    acao: string
  }[]
}

// ============================================
// RESPOSTAS E RESULTADOS
// ============================================

export interface RespostaFluxo {
  perguntaId: string
  resposta: string | number
  timestamp: Date
}

export interface ResultadoFluxo {
  fluxoId: string
  respostas: RespostaFluxo[]
  perfilIdentificado: string
  kitRecomendado: TipoKit
  score: number // 0-100, baseado nas respostas
  timestamp: Date
}

// ============================================
// CONFIGURAÇÕES DO SISTEMA
// ============================================

export interface ConfiguracaoSistema {
  mostrarProdutos: boolean // Se deve mostrar recomendações de kits
  ctaPadrao: string
  whatsappDistribuidor: string
  mensagemFollowUp: string
  modoIniciante: boolean
}


/**
 * Types para o sistema de Diagnóstico LYA Nutri
 */

// ============================================
// DIAGNÓSTICO COMPLETO
// ============================================

export interface NutriDiagnostico {
  id?: string
  user_id: string
  
  // BLOCO 1: Perfil Profissional
  tipo_atuacao: 'clinica_fisica' | 'online' | 'hibrida' | 'iniciante' | 'outra'
  tempo_atuacao: 'menos_1_ano' | '1_3_anos' | '3_5_anos' | 'mais_5_anos'
  autoavaliacao: 'tecnica_boa_negocio_fraco' | 'tecnica_boa_negocio_razoavel' | 'tecnica_boa_negocio_bom' | 'mais_empreendedora'
  
  // BLOCO 2: Momento Atual do Negócio
  situacao_atual: 'poucos_pacientes' | 'agenda_instavel' | 'agenda_cheia_desorganizada' | 'agenda_cheia_organizada'
  processos_captacao: boolean
  processos_avaliacao: boolean
  processos_fechamento: boolean
  processos_acompanhamento: boolean
  
  // BLOCO 3: Objetivo Principal (90 dias)
  objetivo_principal: 'lotar_agenda' | 'organizar_rotina' | 'vender_planos' | 'aumentar_faturamento' | 'estruturar_negocio' | 'outro'
  meta_financeira: 'ate_5k' | '5k_10k' | '10k_20k' | 'acima_20k'
  
  // BLOCO 4: Travas e Dificuldades
  travas: Array<'falta_clientes' | 'falta_constancia' | 'dificuldade_vender' | 'falta_organizacao' | 'inseguranca' | 'falta_tempo' | 'medo_aparecer' | 'nao_saber_comecar'>
  
  // BLOCO 5: Tempo, Energia e Disciplina
  tempo_disponivel: 'ate_30min' | '30_60min' | '1_2h' | '2_3h' | '3_4h' | '4_6h' | 'mais_6h'
  preferencia: 'guiado' | 'autonomo'
  
  // BLOCO 6: Campo Aberto
  campo_aberto: string // Mínimo 50 caracteres
  
  // Metadados
  completed_at?: string
  created_at?: string
  updated_at?: string
}

// ============================================
// PERFIL ESTRATÉGICO
// ============================================

export interface PerfilEstrategico {
  id?: string
  user_id: string
  tipo_nutri: 'iniciante' | 'clinica_construcao' | 'clinica_cheia' | 'online_estrategica' | 'hibrida'
  nivel_empresarial: 'baixo' | 'medio' | 'alto'
  foco_prioritario: 'captacao' | 'organizacao' | 'fechamento' | 'acompanhamento'
  tom_lya: 'acolhedor' | 'firme' | 'estrategico' | 'direto'
  ritmo_conducao: 'guiado' | 'autonomo'
  created_at?: string
  updated_at?: string
}

// ============================================
// ANÁLISE DA LYA (FORMATO FIXO)
// ============================================

export interface LyaAnalise {
  id?: string
  user_id: string
  // Formato fixo de 4 blocos
  foco_prioritario: string // Bloco 1
  acoes_recomendadas: string[] // Bloco 2 (array de ações)
  onde_aplicar: string // Bloco 3
  metrica_sucesso: string // Bloco 4
  // Dados auxiliares
  link_interno: string // Link para ação principal
  mensagem_completa: string // Resposta completa da LYA (para histórico)
  created_at?: string
  updated_at?: string
}


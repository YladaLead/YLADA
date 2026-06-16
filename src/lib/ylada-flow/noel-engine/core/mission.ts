// =====================================================
// NOEL - MISSÃO CENTRAL
// Baseado na Lousa 1 do Prompt-Mestre
// =====================================================

/**
 * Missão central do NOEL
 */
export const noelMission = {
  missao_central: 'Ajudar distribuidores a construir negócios de bem-estar com leveza, constância e duplicação total',
  
  entregaveis: [
    'Scripts prontos e contextuais',
    'Tratamento inteligente de objeções',
    'Acompanhamento personalizado',
    'Orientação estratégica diária',
    'Suporte emocional e motivacional',
    'Treinamento contínuo e leve'
  ],
  
  proposito_emocional: 'Reduzir ansiedade, aumentar confiança e criar segurança emocional',
  proposito_estrategico: 'Acelerar resultados através de método simples e duplicável',
  proposito_tecnico: 'Fornecer ferramentas práticas que qualquer pessoa consegue usar'
}

/**
 * Verifica se uma ação do NOEL está alinhada com sua missão
 */
export function validarMissao(acao: {
  tipo: string
  objetivo: string
  tom: string
}): boolean {
  // Verificar se está alinhado com leveza
  if (acao.tom.includes('pressão') || acao.tom.includes('obrigatório')) {
    return false
  }

  // Verificar se promove duplicação
  if (!acao.objetivo.includes('simples') && !acao.objetivo.includes('fácil')) {
    return false
  }

  return true
}






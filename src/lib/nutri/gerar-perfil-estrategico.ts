import type { NutriDiagnostico, PerfilEstrategico } from '@/types/nutri-diagnostico'

/**
 * Gera perfil estratégico automaticamente a partir do diagnóstico
 */
export function gerarPerfilEstrategico(diagnostico: NutriDiagnostico): Omit<PerfilEstrategico, 'id' | 'user_id' | 'created_at' | 'updated_at'> {
  // CLASSIFICAÇÃO: Tipo de Nutri
  let tipo_nutri: PerfilEstrategico['tipo_nutri'] = 'iniciante'
  
  if (diagnostico.tempo_atuacao === 'menos_1_ano' || diagnostico.situacao_atual === 'poucos_pacientes') {
    tipo_nutri = 'iniciante'
  } else if (diagnostico.situacao_atual === 'agenda_instavel' || 
             !diagnostico.processos_captacao || !diagnostico.processos_avaliacao) {
    tipo_nutri = 'clinica_construcao'
  } else if (diagnostico.situacao_atual === 'agenda_cheia_desorganizada') {
    tipo_nutri = 'clinica_cheia'
  } else if (diagnostico.tipo_atuacao === 'online' && 
             diagnostico.processos_captacao && diagnostico.processos_avaliacao) {
    tipo_nutri = 'online_estrategica'
  } else if (diagnostico.tipo_atuacao === 'hibrida') {
    tipo_nutri = 'hibrida'
  }
  
  // CLASSIFICAÇÃO: Nível Empresarial
  let nivel_empresarial: PerfilEstrategico['nivel_empresarial'] = 'baixo'
  
  const processosCompletos = [
    diagnostico.processos_captacao,
    diagnostico.processos_avaliacao,
    diagnostico.processos_fechamento,
    diagnostico.processos_acompanhamento
  ].filter(Boolean).length
  
  if (diagnostico.autoavaliacao === 'tecnica_boa_negocio_fraco' || processosCompletos < 2) {
    nivel_empresarial = 'baixo'
  } else if (diagnostico.autoavaliacao === 'tecnica_boa_negocio_razoavel' || processosCompletos === 2 || processosCompletos === 3) {
    nivel_empresarial = 'medio'
  } else if (diagnostico.autoavaliacao === 'tecnica_boa_negocio_bom' || 
             diagnostico.autoavaliacao === 'mais_empreendedora' || 
             processosCompletos === 4) {
    nivel_empresarial = 'alto'
  }
  
  // CLASSIFICAÇÃO: Foco Prioritário
  let foco_prioritario: PerfilEstrategico['foco_prioritario'] = 'captacao'
  
  if (diagnostico.travas?.includes('falta_clientes') || diagnostico.objetivo_principal === 'lotar_agenda') {
    foco_prioritario = 'captacao'
  } else if (diagnostico.travas?.includes('falta_organizacao') || 
             diagnostico.situacao_atual === 'agenda_cheia_desorganizada') {
    foco_prioritario = 'organizacao'
  } else if (diagnostico.travas?.includes('dificuldade_vender') || 
             diagnostico.objetivo_principal === 'vender_planos') {
    foco_prioritario = 'fechamento'
  } else if (!diagnostico.processos_acompanhamento || 
             diagnostico.objetivo_principal === 'aumentar_faturamento') {
    foco_prioritario = 'acompanhamento'
  }
  
  // CLASSIFICAÇÃO: Tom da LYA (analisar campo aberto se preenchido)
  let tom_lya: PerfilEstrategico['tom_lya'] = 'firme'
  
  // Se campo aberto foi preenchido, analisar para ajustar tom
  if (diagnostico.campo_aberto && diagnostico.campo_aberto.trim().length > 0) {
    const campoAbertoLower = diagnostico.campo_aberto.toLowerCase()
    
    if (campoAbertoLower.includes('insegur') || campoAbertoLower.includes('medo') || 
        campoAbertoLower.includes('ansied') || campoAbertoLower.includes('nervos')) {
      tom_lya = 'acolhedor'
    } else if (campoAbertoLower.includes('urgent') || campoAbertoLower.includes('preciso') || 
               campoAbertoLower.includes('rapid')) {
      tom_lya = 'firme'
    } else if (campoAbertoLower.includes('confus') || campoAbertoLower.includes('nao sei') || 
               campoAbertoLower.includes('perdid')) {
      tom_lya = 'direto'
    } else if (nivel_empresarial === 'alto' || tipo_nutri === 'online_estrategica') {
      tom_lya = 'estrategico'
    }
  } else {
    // Se campo aberto vazio, usar lógica padrão baseada em nível empresarial
    if (nivel_empresarial === 'alto' || tipo_nutri === 'online_estrategica') {
      tom_lya = 'estrategico'
    } else if (nivel_empresarial === 'baixo') {
      tom_lya = 'acolhedor'
    } else {
      tom_lya = 'firme'
    }
  }
  
  // CLASSIFICAÇÃO: Ritmo de Condução
  const ritmo_conducao: PerfilEstrategico['ritmo_conducao'] = 
    diagnostico.preferencia === 'guiado' ? 'guiado' : 'autonomo'
  
  return {
    tipo_nutri,
    nivel_empresarial,
    foco_prioritario,
    tom_lya,
    ritmo_conducao
  }
}


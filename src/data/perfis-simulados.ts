/**
 * Perfis simulados para testes (Noel, Links, sugestões).
 * Usado quando o cookie ylada_simulate_profile está ativo.
 * @see /pt/perfis-simulados
 */

import type { YladaNoelProfileRow } from '@/lib/ylada-profile-resumo'

export const SIMULATE_COOKIE_NAME = 'ylada_simulate_profile'

export interface PerfilSimuladoMeta {
  key: string
  label: string
  description: string
  profile: YladaNoelProfileRow
}

/** Médico liberal — agenda, consultório, convênio/particular. */
const medico: YladaNoelProfileRow = {
  segment: 'ylada',
  profile_type: 'liberal',
  profession: 'medico',
  flow_id: 'liberal_v1',
  flow_version: 1,
  category: 'medicina',
  sub_category: null,
  tempo_atuacao_anos: 8,
  dor_principal: 'agenda_instavel',
  prioridade_atual: 'Preencher agenda e organizar divulgação',
  fase_negocio: 'em_crescimento',
  metas_principais: 'Aumentar número de consultas e ter mais indicações',
  objetivos_curto_prazo: 'Criar rotina de posts e usar um link para qualificar quem quer agendar',
  modelo_atuacao: ['consultorio', 'online'],
  capacidade_semana: 25,
  ticket_medio: 350,
  modelo_pagamento: 'convenio',
  canais_principais: ['instagram', 'indicacao'],
  rotina_atual_resumo: 'Atendo 3–4 dias por semana, pouco tempo para divulgar',
  frequencia_postagem: null,
  observacoes: 'Perfil simulado para testes.',
  area_specific: { especialidades: ['clínica_geral'] },
}

/** Vendedor de suplementos (Nutra) — funil, comissão, recorrência. */
const vendedorNutra: YladaNoelProfileRow = {
  segment: 'ylada',
  profile_type: 'vendas',
  profession: 'vendedor_suplementos',
  flow_id: 'vendas_v1',
  flow_version: 1,
  category: 'nutra',
  sub_category: null,
  tempo_atuacao_anos: 2,
  dor_principal: 'nao_converte',
  prioridade_atual: 'Fechar mais vendas e reconectar leads',
  fase_negocio: 'iniciante',
  metas_principais: 'Aumentar recorrência e ticket médio',
  objetivos_curto_prazo: 'Usar calculadora e quiz para engajar leads',
  modelo_atuacao: null,
  capacidade_semana: 15,
  ticket_medio: 180,
  modelo_pagamento: 'comissao',
  canais_principais: ['whatsapp', 'instagram'],
  rotina_atual_resumo: 'Vendo por WhatsApp e redes, quero ferramentas para qualificar',
  frequencia_postagem: null,
  observacoes: 'Perfil simulado para testes.',
  area_specific: { canal_principal_vendas: 'whatsapp' },
}

/** Nutricionista liberal — atendimento, agenda, paciente. */
const nutri: YladaNoelProfileRow = {
  segment: 'ylada',
  profile_type: 'liberal',
  profession: 'nutricionista',
  flow_id: 'liberal_v1',
  flow_version: 1,
  category: 'nutricao',
  sub_category: null,
  tempo_atuacao_anos: 5,
  dor_principal: 'agenda_vazia',
  prioridade_atual: 'Captar mais pacientes e usar quiz/calculadora',
  fase_negocio: 'em_crescimento',
  metas_principais: 'Preencher agenda e ter diagnóstico para entregar valor',
  objetivos_curto_prazo: 'Link com diagnóstico para engajar no Instagram',
  modelo_atuacao: ['consultorio', 'online'],
  capacidade_semana: 20,
  ticket_medio: 220,
  modelo_pagamento: 'particular',
  canais_principais: ['instagram', 'whatsapp'],
  rotina_atual_resumo: 'Atendo presencial e online, quero ferramentas para captar',
  frequencia_postagem: null,
  observacoes: 'Perfil simulado para testes.',
  area_specific: { area_nutri: 'emagrecimento' },
}

/** Coach — serviço, programa, entrega. */
const coach: YladaNoelProfileRow = {
  segment: 'ylada',
  profile_type: 'liberal',
  profession: 'coach',
  flow_id: 'liberal_v1',
  flow_version: 1,
  category: 'coaching',
  sub_category: null,
  tempo_atuacao_anos: 4,
  dor_principal: 'sem_indicacao',
  prioridade_atual: 'Aumentar autoridade e captar leads qualificados',
  fase_negocio: 'estabilizado',
  metas_principais: 'Escalar com programas e link que qualifica',
  objetivos_curto_prazo: 'Quiz para quem quer saber mais sobre o método',
  modelo_atuacao: ['online'],
  capacidade_semana: 12,
  ticket_medio: 500,
  modelo_pagamento: 'recorrencia',
  canais_principais: ['instagram', 'indicacao'],
  rotina_atual_resumo: 'Trabalho com programas online, pouca divulgação estruturada',
  frequencia_postagem: null,
  observacoes: 'Perfil simulado para testes.',
  area_specific: { modelo_entrega_coach: 'programa_online' },
}

/** Dentista (odontologia) — consultório, agenda, convênio/particular. */
const odonto: YladaNoelProfileRow = {
  segment: 'ylada',
  profile_type: 'liberal',
  profession: 'odonto',
  flow_id: 'liberal_v1',
  flow_version: 1,
  category: 'odontologia',
  sub_category: null,
  tempo_atuacao_anos: 6,
  dor_principal: 'agenda_vazia',
  prioridade_atual: 'Preencher agenda e divulgar tratamentos',
  fase_negocio: 'em_crescimento',
  metas_principais: 'Aumentar número de pacientes e ter mais indicações',
  objetivos_curto_prazo: 'Link ou quiz para qualificar quem quer agendar avaliação',
  modelo_atuacao: ['consultorio'],
  capacidade_semana: 30,
  ticket_medio: 280,
  modelo_pagamento: 'particular',
  canais_principais: ['instagram', 'whatsapp', 'indicacao'],
  rotina_atual_resumo: 'Clínica própria, quero ferramentas para captar e qualificar',
  frequencia_postagem: null,
  observacoes: 'Perfil simulado para testes.',
  area_specific: {},
}

/** Psicólogo — atendimento clínico, agenda, particular/convênio. */
const psi: YladaNoelProfileRow = {
  segment: 'ylada',
  profile_type: 'liberal',
  profession: 'psi',
  flow_id: 'liberal_v1',
  flow_version: 1,
  category: 'psicologia',
  sub_category: null,
  tempo_atuacao_anos: 5,
  dor_principal: 'sem_indicacao',
  prioridade_atual: 'Aumentar indicações e visibilidade',
  fase_negocio: 'estabilizado',
  metas_principais: 'Manter agenda estável e captar pacientes qualificados',
  objetivos_curto_prazo: 'Ferramenta com diagnóstico para engajar no Instagram',
  modelo_atuacao: ['consultorio', 'online'],
  capacidade_semana: 18,
  ticket_medio: 200,
  modelo_pagamento: 'particular',
  canais_principais: ['instagram', 'indicacao'],
  rotina_atual_resumo: 'Atendo presencial e online, quero link para quem busca terapia',
  frequencia_postagem: null,
  observacoes: 'Perfil simulado para testes.',
  area_specific: {},
}

export const PERFIS_SIMULADOS: PerfilSimuladoMeta[] = [
  { key: 'medico', label: 'Médico (liberal)', description: 'Consultório, agenda, convênio/particular. Dor: agenda instável.', profile: medico },
  { key: 'vendedor_nutra', label: 'Vendedor Nutra', description: 'Vendas de suplementos, comissão, funil. Dor: não converte.', profile: vendedorNutra },
  { key: 'nutri', label: 'Nutricionista (liberal)', description: 'Atendimento, agenda vazia, quiz/calculadora para captar.', profile: nutri },
  { key: 'coach', label: 'Coach', description: 'Programa online, recorrência, autoridade e indicação.', profile: coach },
  { key: 'odonto', label: 'Dentista (odontologia)', description: 'Clínica, agenda vazia, qualificar quem quer agendar.', profile: odonto },
  { key: 'psi', label: 'Psicólogo', description: 'Atendimento clínico, particular, mais indicações e visibilidade.', profile: psi },
]

const byKey: Record<string, PerfilSimuladoMeta> = {}
for (const p of PERFIS_SIMULADOS) byKey[p.key] = p

export function getPerfilSimuladoByKey(key: string): YladaNoelProfileRow | null {
  return byKey[key]?.profile ?? null
}

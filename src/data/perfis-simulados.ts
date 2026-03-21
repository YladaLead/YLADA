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
  rotina_atual_resumo: 'Atendo estética (pele) e emagrecimento; 3–4 dias por semana, pouco tempo para divulgar',
  frequencia_postagem: null,
  observacoes: 'Perfil simulado para testes.',
  area_specific: {
    nome: 'Dr. Demo Medicina',
    whatsapp: '19981868000',
    countryCode: 'BR',
    publico_principal: ['particular', 'feminino'],
    especialidades: ['dermatologia'],
    foco_principal: 'procedimentos',
    modelo_receita: 'procedimentos_alto_ticket',
    temas_atuacao: ['emagrecimento', 'pele'],
  },
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
  area_specific: { canal_principal_vendas: 'whatsapp', temas_atuacao: ['b12_vitaminas', 'energia', 'emagrecimento'] },
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
  area_specific: { area_nutri: 'emagrecimento', temas_atuacao: ['emagrecimento', 'intestino', 'energia'] },
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
  area_specific: { modelo_entrega_coach: 'programa_online', temas_atuacao: ['carreira', 'produtividade', 'autoconhecimento'] },
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
  area_specific: { temas_atuacao: ['saude_bucal', 'clareamento', 'implantes'] },
}

/** Esteticista — clínica, pele, skincare, autocuidado. (segment estetica para área Estética.) */
const estetica: YladaNoelProfileRow = {
  segment: 'estetica',
  profile_type: 'liberal',
  profession: 'estetica',
  flow_id: 'liberal_v1',
  flow_version: 1,
  category: 'estetica',
  sub_category: null,
  tempo_atuacao_anos: 4,
  dor_principal: 'agenda_vazia',
  prioridade_atual: 'Captar clientes e divulgar tratamentos',
  fase_negocio: 'em_crescimento',
  metas_principais: 'Preencher agenda e qualificar leads',
  objetivos_curto_prazo: 'Link com diagnóstico de pele ou autocuidado para engajar',
  modelo_atuacao: ['consultorio'],
  capacidade_semana: 25,
  ticket_medio: 180,
  modelo_pagamento: 'particular',
  canais_principais: ['instagram', 'whatsapp'],
  rotina_atual_resumo: 'Clínica de estética, quero ferramentas para captar e qualificar',
  frequencia_postagem: null,
  observacoes: 'Perfil simulado para testes.',
  area_specific: { temas_atuacao: ['pele', 'skincare', 'autocuidado', 'retenção'] },
}

/** Vendedor de perfumes — fragrâncias, perfumaria, indicações. */
const vendedorPerfumes: YladaNoelProfileRow = {
  segment: 'ylada',
  profile_type: 'vendas',
  profession: 'vendedor_perfumes',
  flow_id: 'vendas_v1',
  flow_version: 1,
  category: 'perfumaria',
  sub_category: null,
  tempo_atuacao_anos: 3,
  dor_principal: 'nao_converte',
  prioridade_atual: 'Qualificar leads e indicar perfumes certos para cada perfil',
  fase_negocio: 'em_crescimento',
  metas_principais: 'Usar quiz de perfil olfativo para captar e recomendar fragrâncias',
  objetivos_curto_prazo: 'Link com diagnóstico de perfil de fragrância para engajar no Instagram',
  modelo_atuacao: ['loja', 'online'],
  capacidade_semana: 20,
  ticket_medio: 250,
  modelo_pagamento: 'venda_direta',
  canais_principais: ['instagram', 'whatsapp'],
  rotina_atual_resumo: 'Vendo perfumes por loja e redes, quero ferramentas para qualificar e indicar',
  frequencia_postagem: null,
  observacoes: 'Perfil simulado para testes de perfumaria.',
  area_specific: { temas_atuacao: ['perfil_olfativo', 'familia_olfativa', 'ocasiao_uso'] },
}

/** Personal trainer — treino, condicionamento, consistência. */
const personalTrainer: YladaNoelProfileRow = {
  segment: 'ylada',
  profile_type: 'liberal',
  profession: 'personal_trainer',
  flow_id: 'liberal_v1',
  flow_version: 1,
  category: 'fitness',
  sub_category: null,
  tempo_atuacao_anos: 3,
  dor_principal: 'agenda_vazia',
  prioridade_atual: 'Captar alunos e manter consistência dos clientes',
  fase_negocio: 'em_crescimento',
  metas_principais: 'Aumentar número de alunos e engajamento',
  objetivos_curto_prazo: 'Link com diagnóstico de treino ou energia para captar',
  modelo_atuacao: ['consultorio', 'online'],
  capacidade_semana: 20,
  ticket_medio: 150,
  modelo_pagamento: 'particular',
  canais_principais: ['instagram', 'whatsapp'],
  rotina_atual_resumo: 'Treino presencial e online, quero ferramentas para qualificar',
  frequencia_postagem: null,
  observacoes: 'Perfil simulado para testes.',
  area_specific: { temas_atuacao: ['treino', 'energia', 'condicionamento', 'consistência'] },
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
  area_specific: { temas_atuacao: ['ansiedade', 'sono', 'autoconhecimento'] },
}

export const PERFIS_SIMULADOS: PerfilSimuladoMeta[] = [
  { key: 'medico', label: 'Médico (liberal)', description: 'Consultório, agenda, convênio/particular. Dor: agenda instável.', profile: medico },
  { key: 'vendedor_nutra', label: 'Vendedor Nutra', description: 'Vendas de suplementos, comissão, funil. Dor: não converte.', profile: vendedorNutra },
  { key: 'vendedor_perfumes', label: 'Vendedor de perfumes', description: 'Perfumaria, fragrâncias, quiz de perfil olfativo para captar e indicar.', profile: vendedorPerfumes },
  { key: 'nutri', label: 'Nutricionista (liberal)', description: 'Atendimento, agenda vazia, quiz/calculadora para captar.', profile: nutri },
  { key: 'coach', label: 'Coach', description: 'Programa online, recorrência, autoridade e indicação.', profile: coach },
  { key: 'odonto', label: 'Dentista (odontologia)', description: 'Clínica, agenda vazia, qualificar quem quer agendar.', profile: odonto },
  { key: 'estetica', label: 'Esteticista', description: 'Clínica de estética, pele, skincare, autocuidado. Dor: agenda vazia.', profile: estetica },
  { key: 'personal_trainer', label: 'Personal trainer', description: 'Treino, condicionamento, consistência. Dor: agenda vazia.', profile: personalTrainer },
  { key: 'psi', label: 'Psicólogo', description: 'Atendimento clínico, particular, mais indicações e visibilidade.', profile: psi },
]

const byKey: Record<string, PerfilSimuladoMeta> = {}
for (const p of PERFIS_SIMULADOS) byKey[p.key] = p

export function getPerfilSimuladoByKey(key: string): YladaNoelProfileRow | null {
  return byKey[key]?.profile ?? null
}

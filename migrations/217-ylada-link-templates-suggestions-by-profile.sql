-- =====================================================
-- Sugestões por template: ambos os perfis (liberal e vendas) podem usar
-- quiz e calculadora. Liberal usa quiz (agenda, paciente) e também
-- calculadoras (análise, avaliação — ex.: nutricionista). Vendas usa
-- calculadora (valor, lead) e também quiz (qualificar). Filosofia: fluxos
-- que agregam valor pelo diagnóstico/resultado entregue + CTA para o profissional.
-- @see docs/ANALISE-LINKS-BRIEF-POR-PERFIL-E-PROXIMOS-PASSOS.md
-- =====================================================

-- Quiz / diagnóstico: valor pelo diagnóstico + CTA para o profissional.
-- Usado por liberal (agenda, paciente) e por vendas (qualificar lead).
UPDATE ylada_link_templates
SET suggested_prompts = '[
  "Qualificar quem quer agendar comigo",
  "Quiz para engajar possíveis pacientes ou clientes",
  "Preencher minha agenda com leads interessados",
  "Ferramenta com diagnóstico que direciona o visitante para falar comigo",
  "Diagnóstico que agrega valor e CTA para o profissional"
]'::jsonb
WHERE id = 'a0000001-0001-4000-8000-000000000001';

-- Calculadora: valor pelo resultado + CTA para o profissional.
-- Usado por liberal (análise, avaliação — ex.: nutricionista) e por vendas (valor, lead).
UPDATE ylada_link_templates
SET suggested_prompts = '[
  "Calculadora para análise ou avaliação que direciona para mim",
  "Ferramenta de cálculo: o visitante vê o resultado e pode falar comigo",
  "Mostrar valor do que ofereço para o lead",
  "Calculadora para engajar quem pode comprar",
  "Resultado que agrega valor e CTA para o profissional"
]'::jsonb
WHERE id = 'a0000002-0002-4000-8000-000000000002';

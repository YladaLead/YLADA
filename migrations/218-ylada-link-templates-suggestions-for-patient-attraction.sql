-- =====================================================
-- Sugestões refocadas: o link/quiz é PARA O PACIENTE (ou possível cliente).
-- Conteúdo sobre a especialidade do profissional que atrai, desperta curiosidade
-- e agrega valor a quem acessa — não sobre o negócio/agenda do profissional.
-- @see conversa: "o link tem que ser sobre a especialidade do médico, algo que
-- atrai pacientes e desperta curiosidade nas pessoas comuns (possíveis pacientes)".
-- =====================================================

-- Quiz: conteúdo que o visitante (possível paciente) acessa — tema da especialidade.
UPDATE ylada_link_templates
SET suggested_prompts = '[
  "Quiz sobre um tema da minha especialidade que atrai possíveis pacientes",
  "Conteúdo que desperta curiosidade em quem acessa (possíveis pacientes ou clientes)",
  "Ferramenta que o visitante responde e recebe um resultado — tema ligado ao que eu atendo",
  "Link com diagnóstico ou descoberta para a pessoa, no final pode falar comigo",
  "Quiz ou avaliação que agrega valor para quem preenche e direciona para contato"
]'::jsonb
WHERE id = 'a0000001-0001-4000-8000-000000000001';

-- Calculadora: resultado/insight para o visitante (possível paciente/cliente).
UPDATE ylada_link_templates
SET suggested_prompts = '[
  "Calculadora ou ferramenta que dá um resultado útil para quem acessa",
  "O visitante preenche, vê um resultado (ex.: potencial, análise) e pode falar comigo",
  "Conteúdo que mostra valor ou insight para o possível paciente ou cliente",
  "Ferramenta de cálculo que engaja pela curiosidade e pelo resultado",
  "Resultado que agrega valor para a pessoa e CTA para falar comigo"
]'::jsonb
WHERE id = 'a0000002-0002-4000-8000-000000000002';

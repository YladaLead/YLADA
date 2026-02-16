-- =====================================================
-- Sugestões (lembretes) por template — exibidas na UI para criar link sem digitar.
-- O diagnóstico e a calculadora são conteúdos oficiais da plataforma (definidos no template).
-- @see docs/PROGRAMACAO-ESTRUTURAL-YLADA.md
-- =====================================================

ALTER TABLE ylada_link_templates
  ADD COLUMN IF NOT EXISTS suggested_prompts JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN ylada_link_templates.suggested_prompts IS 'Frases de sugestão para o usuário escolher ao criar link (ex: "Qualificar quem quer agendar"). Array de strings.';

-- Atualizar os 2 templates do seed com lembretes pré-estipulados
UPDATE ylada_link_templates
SET suggested_prompts = '["Quero um quiz para qualificar quem tem interesse em agendar", "Qualificar quem quer agendar comigo", "Preencher agenda com leads interessados"]'::jsonb
WHERE id = 'a0000001-0001-4000-8000-000000000001';

UPDATE ylada_link_templates
SET suggested_prompts = '["Quero mostrar quanto a pessoa está deixando de faturar", "Calculadora de potencial perdido para engajar clientes", "Mostrar impacto financeiro para possíveis clientes"]'::jsonb
WHERE id = 'a0000002-0002-4000-8000-000000000002';

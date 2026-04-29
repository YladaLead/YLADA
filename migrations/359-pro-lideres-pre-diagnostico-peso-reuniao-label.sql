-- Pré-diagnóstico: rótulo do campo peso_reuniao → expectativa do encontro (PT-BR).
-- Atualiza qualquer material já gravado com o texto anterior.

UPDATE pro_lideres_consultancy_materials
SET
  content = replace(
    replace(
      content::text,
      '"label":"Para a próxima reunião, o que você quer que tragamos com mais peso? (opcional)"',
      '"label":"O que você espera do nosso encontro (opcional)"'
    ),
    '"label":"Para a próxima reunião, o que quer que tragamos com mais peso? (opcional)"',
    '"label":"O que você espera do nosso encontro (opcional)"'
  )::jsonb,
  updated_at = NOW()
WHERE id = 'f8a3c2d1-4e5b-6a7c-8d9e-0f1a2b3c4d5e'::uuid;

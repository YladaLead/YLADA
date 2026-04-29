-- Pré-diagnóstico: título alinhado ao painel público; remove texto introdutório (descrição).

UPDATE pro_lideres_consultancy_materials
SET
  title = 'Pré-diagnóstico estratégico para líderes em liderança',
  description = NULL,
  updated_at = NOW()
WHERE id = 'f8a3c2d1-4e5b-6a7c-8d9e-0f1a2b3c4d5e'::uuid;

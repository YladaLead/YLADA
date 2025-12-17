-- ============================================
-- ORGANIZAR PDFs DA BIBLIOTECA WELLNESS
-- ============================================
-- 
-- Objetivo:
-- 1. Adicionar campo material_url na tabela wellness_aulas
-- 2. Separar PDFs de ferramentas (cartilhas) dos PDFs de aulas
-- 3. Vincular PDFs de aulas às aulas correspondentes na trilha
-- ============================================

-- ============================================
-- PARTE 1: ADICIONAR CAMPO material_url EM wellness_aulas
-- ============================================

-- Adicionar coluna material_url se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_aulas' 
    AND column_name = 'material_url'
  ) THEN
    ALTER TABLE wellness_aulas 
    ADD COLUMN material_url TEXT;
    
    COMMENT ON COLUMN wellness_aulas.material_url IS 'URL do PDF complementar da aula (material para download)';
  END IF;
END $$;

-- ============================================
-- PARTE 2: SEPARAR PDFs DE FERRAMENTAS (CARTILHAS)
-- ============================================
-- 
-- Manter apenas PDFs de uso de ferramentas em cartilhas:
-- - Calculadoras (Hidratação, IMC, Proteína)
-- - Quizzes (Alimentação, Bem-Estar, Perfil, Propósito, Potencial, Ganhos)
-- - Guias práticos (Composição Corporal, Planejador de Refeições)
-- 
-- Remover da categoria 'cartilha' os PDFs que são:
-- - Scripts (já movidos, mas garantir que não fiquem)
-- - Aulas (serão vinculadas às aulas)
-- ============================================

-- Desativar PDFs de scripts que não são de ferramentas
UPDATE wellness_materiais
SET ativo = false
WHERE categoria = 'cartilha'
  AND codigo IN (
    'pdf-script-convite-leve-completo',
    'pdf-script-convite-pessoas-proximas',
    'pdf-script-convite-leads-frios',
    'pdf-script-follow-up-completo',
    'pdf-script-follow-up-apos-link',
    'pdf-script-apresentacao-produtos',
    'pdf-script-apresentacao-oportunidade',
    'pdf-script-fechamento-produtos',
    'pdf-script-fechamento-kits',
    'pdf-script-objecoes-completo',
    'pdf-script-objecao-dinheiro',
    'pdf-script-objecao-tempo',
    'pdf-script-onboarding-clientes',
    'pdf-script-onboarding-distribuidores',
    'pdf-script-recrutamento-completo',
    'pdf-script-recrutamento-leads-especificos',
    'pdf-scripts-completo-primeira-versao',
    'pdf-guia-rapido-scripts'
  );

-- Desativar PDFs de aulas (serão vinculados às aulas)
UPDATE wellness_materiais
SET ativo = false
WHERE categoria = 'cartilha'
  AND codigo IN (
    'pdf-aula-1-fundamentos-wellness',
    'pdf-aula-2-3-pilares',
    'pdf-aula-3-funcionamento-pratico',
    'pdf-aula-4-por-que-converte',
    'pdf-aula-5-ferramentas'
  );

-- ============================================
-- PARTE 3: VINCULAR PDFs DE AULAS ÀS AULAS CORRESPONDENTES
-- ============================================
-- 
-- Mapear os PDFs de aulas para as aulas na trilha "Distribuidor Iniciante"
-- Módulo 1: Fundamentos do Wellness System
-- ============================================

DO $$
DECLARE
  v_trilha_id UUID;
  v_modulo_id UUID;
  v_aula_1_id UUID;
  v_aula_2_id UUID;
  v_aula_3_id UUID;
  v_aula_4_id UUID;
  v_aula_5_id UUID;
  v_pdf_aula_1_url TEXT;
  v_pdf_aula_2_url TEXT;
  v_pdf_aula_3_url TEXT;
  v_pdf_aula_4_url TEXT;
  v_pdf_aula_5_url TEXT;
BEGIN
  -- Buscar trilha "Distribuidor Iniciante"
  SELECT id INTO v_trilha_id
  FROM wellness_trilhas
  WHERE slug = 'distribuidor-iniciante'
  LIMIT 1;

  IF v_trilha_id IS NULL THEN
    RAISE NOTICE '⚠️ Trilha "distribuidor-iniciante" não encontrada. Pulando vinculação de PDFs.';
    RETURN;
  END IF;

  -- Buscar Módulo 1: Fundamentos do Wellness System
  SELECT id INTO v_modulo_id
  FROM wellness_modulos
  WHERE trilha_id = v_trilha_id
    AND ordem = 1
  LIMIT 1;

  IF v_modulo_id IS NULL THEN
    RAISE NOTICE '⚠️ Módulo 1 não encontrado. Pulando vinculação de PDFs.';
    RETURN;
  END IF;

  -- Buscar URLs dos PDFs de aulas
  SELECT url INTO v_pdf_aula_1_url
  FROM wellness_materiais
  WHERE codigo = 'pdf-aula-1-fundamentos-wellness'
  LIMIT 1;

  SELECT url INTO v_pdf_aula_2_url
  FROM wellness_materiais
  WHERE codigo = 'pdf-aula-2-3-pilares'
  LIMIT 1;

  SELECT url INTO v_pdf_aula_3_url
  FROM wellness_materiais
  WHERE codigo = 'pdf-aula-3-funcionamento-pratico'
  LIMIT 1;

  SELECT url INTO v_pdf_aula_4_url
  FROM wellness_materiais
  WHERE codigo = 'pdf-aula-4-por-que-converte'
  LIMIT 1;

  SELECT url INTO v_pdf_aula_5_url
  FROM wellness_materiais
  WHERE codigo = 'pdf-aula-5-ferramentas'
  LIMIT 1;

  -- Buscar aulas do Módulo 1 e vincular PDFs
  -- Aula 1: O que é o Wellness System
  SELECT id INTO v_aula_1_id
  FROM wellness_aulas
  WHERE modulo_id = v_modulo_id
    AND ordem = 1
    AND titulo ILIKE '%o que é%wellness system%'
  LIMIT 1;

  IF v_aula_1_id IS NOT NULL AND v_pdf_aula_1_url IS NOT NULL THEN
    UPDATE wellness_aulas
    SET material_url = v_pdf_aula_1_url
    WHERE id = v_aula_1_id;
    RAISE NOTICE '✅ PDF vinculado à Aula 1';
  END IF;

  -- Aula 2: Os 3 Pilares do Wellness System
  SELECT id INTO v_aula_2_id
  FROM wellness_aulas
  WHERE modulo_id = v_modulo_id
    AND ordem = 2
    AND titulo ILIKE '%3 pilares%'
  LIMIT 1;

  IF v_aula_2_id IS NOT NULL AND v_pdf_aula_2_url IS NOT NULL THEN
    UPDATE wellness_aulas
    SET material_url = v_pdf_aula_2_url
    WHERE id = v_aula_2_id;
    RAISE NOTICE '✅ PDF vinculado à Aula 2';
  END IF;

  -- Aula 3: Como o Modelo Funciona na Prática
  SELECT id INTO v_aula_3_id
  FROM wellness_aulas
  WHERE modulo_id = v_modulo_id
    AND ordem = 3
    AND titulo ILIKE '%funciona%prática%'
  LIMIT 1;

  IF v_aula_3_id IS NOT NULL AND v_pdf_aula_3_url IS NOT NULL THEN
    UPDATE wellness_aulas
    SET material_url = v_pdf_aula_3_url
    WHERE id = v_aula_3_id;
    RAISE NOTICE '✅ PDF vinculado à Aula 3';
  END IF;

  -- Aula 4: Por que o Wellness System Converte Tanto
  SELECT id INTO v_aula_4_id
  FROM wellness_aulas
  WHERE modulo_id = v_modulo_id
    AND ordem = 4
    AND titulo ILIKE '%converte%'
  LIMIT 1;

  IF v_aula_4_id IS NOT NULL AND v_pdf_aula_4_url IS NOT NULL THEN
    UPDATE wellness_aulas
    SET material_url = v_pdf_aula_4_url
    WHERE id = v_aula_4_id;
    RAISE NOTICE '✅ PDF vinculado à Aula 4';
  END IF;

  -- Aula 5: Visão Geral das Ferramentas
  SELECT id INTO v_aula_5_id
  FROM wellness_aulas
  WHERE modulo_id = v_modulo_id
    AND ordem = 5
    AND titulo ILIKE '%ferramentas%'
  LIMIT 1;

  IF v_aula_5_id IS NOT NULL AND v_pdf_aula_5_url IS NOT NULL THEN
    UPDATE wellness_aulas
    SET material_url = v_pdf_aula_5_url
    WHERE id = v_aula_5_id;
    RAISE NOTICE '✅ PDF vinculado à Aula 5';
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '✅ Vinculação de PDFs concluída!';
  
END $$;

-- ============================================
-- PARTE 4: VERIFICAR RESULTADOS
-- ============================================

-- Verificar PDFs ativos em cartilhas (devem ser apenas de ferramentas)
SELECT 
  codigo,
  titulo,
  CASE 
    WHEN codigo LIKE '%calculadora%' OR codigo LIKE '%quiz%' OR codigo LIKE '%composicao%' OR codigo LIKE '%planejador%' THEN '✅ PDF de Ferramenta'
    ELSE '⚠️ Verificar'
  END as tipo,
  ativo
FROM wellness_materiais
WHERE categoria = 'cartilha'
  AND tipo = 'pdf'
ORDER BY ordem, titulo;

-- Verificar aulas com PDFs vinculados
SELECT 
  a.id,
  a.titulo,
  a.ordem,
  CASE 
    WHEN a.material_url IS NOT NULL THEN '✅ PDF vinculado'
    ELSE '⚠️ Sem PDF'
  END as status,
  a.material_url
FROM wellness_aulas a
INNER JOIN wellness_modulos m ON m.id = a.modulo_id
INNER JOIN wellness_trilhas t ON t.id = m.trilha_id
WHERE t.slug = 'distribuidor-iniciante'
  AND m.ordem = 1
ORDER BY a.ordem;

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 
-- 1. PDFs de ferramentas ficam em Cartilhas:
--    - Calculadoras (Hidratação, IMC, Proteína)
--    - Quizzes (Alimentação, Bem-Estar, Perfil, Propósito, Potencial, Ganhos)
--    - Guias práticos (Composição Corporal, Planejador)
-- 
-- 2. PDFs de aulas ficam vinculados às aulas na trilha:
--    - Campo material_url na tabela wellness_aulas
--    - Aparecem como "Material Complementar" na página da aula
-- 
-- 3. PDFs de scripts foram desativados:
--    - Não aparecem mais na biblioteca
--    - Scripts agora são apenas via NOEL
-- 
-- ============================================






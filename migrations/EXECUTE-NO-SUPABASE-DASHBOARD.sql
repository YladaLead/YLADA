-- ==========================================
-- IMPORTANTE: EXECUTE ESTE SQL NO SUPABASE DASHBOARD
-- ==========================================
-- 1. Acesse: https://supabase.com/dashboard/project/uqhptblvuehvygpwutds/editor
-- 2. Vá em "SQL Editor"
-- 3. Cole e execute este SQL
-- ==========================================

-- Passo 1: Limpar tabela (remover todos os registros anteriores)
DELETE FROM library_files;

-- Passo 2: Atualizar constraint para aceitar a nova categoria
ALTER TABLE library_files DROP CONSTRAINT IF EXISTS library_files_category_check;
ALTER TABLE library_files ADD CONSTRAINT library_files_category_check CHECK (
  category IN ('Materiais Essenciais')
);

-- Passo 3: Inserir os 6 PDFs essenciais

-- PDF 01 — Manual Técnico da Plataforma YLADA Nutri
INSERT INTO library_files (id, title, description, category, file_type, file_url, is_active, order_index)
VALUES (
  gen_random_uuid(),
  'Manual Técnico da Plataforma',
  'Guia prático para usar o sistema com clareza e segurança. Use sempre que tiver dúvida sobre onde clicar ou como usar uma área.',
  'Materiais Essenciais',
  'pdf',
  '/pt/nutri/metodo/biblioteca/pdf-01-manual-tecnico-plataforma',
  true,
  1
);

-- PDF 02 — Checklist Oficial do Dia 1
INSERT INTO library_files (id, title, description, category, file_type, file_url, is_active, order_index)
VALUES (
  gen_random_uuid(),
  'Checklist Oficial do Dia 1',
  'Comece do jeito certo. O Dia 1 define o ritmo da sua jornada. Este checklist garante que você execute corretamente.',
  'Materiais Essenciais',
  'pdf',
  '/pt/nutri/metodo/biblioteca/pdf-02-checklist-dia-1',
  true,
  2
);

-- PDF 03 — Checklist de Consolidação da Primeira Semana
INSERT INTO library_files (id, title, description, category, file_type, file_url, is_active, order_index)
VALUES (
  gen_random_uuid(),
  'Checklist de Consolidação — Primeira Semana',
  'O que você construiu até aqui. Consolidação vem antes de aceleração. Use este material ao finalizar o Dia 7.',
  'Materiais Essenciais',
  'pdf',
  '/pt/nutri/metodo/biblioteca/pdf-03-checklist-dia-7',
  true,
  3
);

-- PDF 04 — Rotina Mínima da Nutri-Empresária
INSERT INTO library_files (id, title, description, category, file_type, file_url, is_active, order_index)
VALUES (
  gen_random_uuid(),
  'Rotina Mínima da Nutri-Empresária',
  'Menos confusão. Mais constância. Transforme estratégia em rotina simples, sustentável e executável.',
  'Materiais Essenciais',
  'pdf',
  '/pt/nutri/metodo/biblioteca/pdf-04-rotina-minima',
  true,
  4
);

-- PDF 05 — Scripts Essenciais YLADA
INSERT INTO library_files (id, title, description, category, file_type, file_url, is_active, order_index)
VALUES (
  gen_random_uuid(),
  'Scripts Essenciais YLADA',
  'Fale com clareza, sem pressão. Scripts são pontos de partida para ganhar segurança nas conversas profissionais.',
  'Materiais Essenciais',
  'pdf',
  '/pt/nutri/metodo/biblioteca/pdf-05-scripts-essenciais',
  true,
  5
);

-- PDF 06 — Guia Prático de Gestão GSAL
INSERT INTO library_files (id, title, description, category, file_type, file_url, is_active, order_index)
VALUES (
  gen_random_uuid(),
  'Guia Prático de Gestão GSAL',
  'Organize seu crescimento com clareza. GSAL é um modelo simples de gestão: Gerar, Servir, Acompanhar, Lucrar.',
  'Materiais Essenciais',
  'pdf',
  '/pt/nutri/metodo/biblioteca/pdf-06-guia-gsal',
  true,
  6
);

-- Verificar se foi inserido corretamente
SELECT 
  order_index,
  title,
  category,
  is_active
FROM library_files
ORDER BY order_index;

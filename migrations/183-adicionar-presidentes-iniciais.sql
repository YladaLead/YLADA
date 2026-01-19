-- ============================================
-- MIGRATION: Adicionar presidentes iniciais padronizados
-- Descrição: Insere lista inicial de presidentes autorizados
-- ============================================

-- Inserir presidentes (apenas se não existirem)
INSERT INTO presidentes_autorizados (nome_completo, status, created_at, updated_at)
SELECT nome, 'ativo', NOW(), NOW()
FROM (VALUES
  ('Claudinei Leite'),
  ('Andre e Deise Faula'),
  ('Marcelino e Valdete'),
  ('Carlota Batista'),
  ('Gladis e Marino'),
  ('Marcio e Ana Pasqua')
) AS novos_presidentes(nome)
WHERE NOT EXISTS (
  SELECT 1 FROM presidentes_autorizados 
  WHERE LOWER(nome_completo) = LOWER(novos_presidentes.nome)
);

-- Comentário
COMMENT ON TABLE presidentes_autorizados IS 'Lista de presidentes autorizados - nomes devem ser padronizados';

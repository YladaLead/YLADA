-- Script para remover a palavra "Herbalife" da descrição da trilha
-- Execute este script se a trilha já foi criada no banco de dados

UPDATE wellness_trilhas
SET descricao = REPLACE(descricao, 'distribuidores Herbalife', 'distribuidores')
WHERE slug = 'distribuidor-iniciante'
  AND descricao LIKE '%Herbalife%';

-- Verificar se foi atualizado
SELECT 
    nome,
    descricao,
    slug
FROM wellness_trilhas
WHERE slug = 'distribuidor-iniciante';


-- ============================================
-- MIGRATION 167: Mover PDFs de Scripts para Cartilhas
-- ============================================
-- Objetivo: todos os "books" em PDF que estavam na categoria 'script'
-- passam a ser tratados como cartilhas de treinamento.
-- ============================================

-- 1) Atualizar categoria de todos os materiais criados na migration 162

UPDATE wellness_materiais
SET categoria = 'cartilha'
WHERE categoria = 'script'
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
    'pdf-aula-1-fundamentos-wellness',
    'pdf-aula-2-3-pilares',
    'pdf-aula-3-funcionamento-pratico',
    'pdf-aula-4-por-que-converte',
    'pdf-aula-5-ferramentas',
    'pdf-script-recrutamento-completo',
    'pdf-script-recrutamento-leads-especificos',
    'pdf-scripts-completo-primeira-versao',
    'pdf-guia-rapido-scripts'
  );

-- 2) Opcional: garantir que futuros INSERTs usem categoria 'cartilha'
--    (ajuste manualmente na migration 162 se ainda não estiver em produção)

-- 3) Verificação rápida

SELECT codigo, titulo, categoria
FROM wellness_materiais
WHERE codigo IN (
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
    'pdf-aula-1-fundamentos-wellness',
    'pdf-aula-2-3-pilares',
    'pdf-aula-3-funcionamento-pratico',
    'pdf-aula-4-por-que-converte',
    'pdf-aula-5-ferramentas',
    'pdf-script-recrutamento-completo',
    'pdf-script-recrutamento-leads-especificos',
    'pdf-scripts-completo-primeira-versao',
    'pdf-guia-rapido-scripts'
)
ORDER BY codigo;




















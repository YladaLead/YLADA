-- =====================================================
-- SEED: PRODUTOS INICIAIS - WELLNESS SYSTEM
-- =====================================================

-- BEBIDAS FUNCIONAIS
INSERT INTO wellness_produtos (nome, categoria, tipo, pv, preco, descricao, ativo) VALUES
-- Energia
('Energia - Kit 5 dias', 'bebida_funcional', 'energia', 25.00, 39.90, 'Kit de 5 dias da bebida Energia', true),
('Energia - Kit 10 dias', 'bebida_funcional', 'energia', 50.00, 79.90, 'Kit de 10 dias da bebida Energia', true),
('Energia - Kit 30 dias', 'bebida_funcional', 'energia', 150.00, 239.90, 'Kit de 30 dias da bebida Energia', true),

-- Acelera
('Acelera - Kit 5 dias', 'bebida_funcional', 'acelera', 25.00, 39.90, 'Kit de 5 dias da bebida Acelera', true),
('Acelera - Kit 10 dias', 'bebida_funcional', 'acelera', 50.00, 79.90, 'Kit de 10 dias da bebida Acelera', true),
('Acelera - Kit 30 dias', 'bebida_funcional', 'acelera', 150.00, 239.90, 'Kit de 30 dias da bebida Acelera', true),

-- Litrão Turbo
('Litrão Turbo - Kit 5 dias', 'bebida_funcional', 'turbo', 30.00, 49.90, 'Kit de 5 dias do Litrão Turbo', true),
('Litrão Turbo - Kit 10 dias', 'bebida_funcional', 'turbo', 60.00, 99.90, 'Kit de 10 dias do Litrão Turbo', true),
('Litrão Turbo - Kit 30 dias', 'bebida_funcional', 'turbo', 180.00, 299.90, 'Kit de 30 dias do Litrão Turbo', true),

-- Hype Drink
('Hype Drink - Kit 5 dias', 'bebida_funcional', 'hype', 30.00, 49.90, 'Kit de 5 dias do Hype Drink', true),
('Hype Drink - Kit 10 dias', 'bebida_funcional', 'hype', 60.00, 99.90, 'Kit de 10 dias do Hype Drink', true),
('Hype Drink - Kit 30 dias', 'bebida_funcional', 'hype', 180.00, 299.90, 'Kit de 30 dias do Hype Drink', true),

-- PRODUTOS FECHADOS
-- Shake
('Shake - 500g', 'produto_fechado', 'shake', 50.00, 89.90, 'Shake Formula 1 - 500g', true),
('Shake - 750g', 'produto_fechado', 'shake', 75.00, 134.90, 'Shake Formula 1 - 750g', true),

-- Fiber
('Fiber - 500g', 'produto_fechado', 'fiber', 50.00, 89.90, 'Fiber & Herb - 500g', true),
('Fiber - 750g', 'produto_fechado', 'fiber', 75.00, 134.90, 'Fiber & Herb - 750g', true),

-- Chá
('Chá - 100g', 'produto_fechado', 'cha', 25.00, 49.90, 'Chá Concentrado - 100g', true),
('Chá - 200g', 'produto_fechado', 'cha', 50.00, 99.90, 'Chá Concentrado - 200g', true),

-- NRG
('NRG - 30 cápsulas', 'produto_fechado', 'nrg', 50.00, 89.90, 'NRG - 30 cápsulas', true),
('NRG - 60 cápsulas', 'produto_fechado', 'nrg', 100.00, 179.90, 'NRG - 60 cápsulas', true),

-- CR7
('CR7 - 30 cápsulas', 'produto_fechado', 'cr7', 50.00, 89.90, 'CR7 Drive - 30 cápsulas', true),
('CR7 - 60 cápsulas', 'produto_fechado', 'cr7', 100.00, 179.90, 'CR7 Drive - 60 cápsulas', true),

-- Creatina
('Creatina - 300g', 'produto_fechado', 'creatina', 50.00, 89.90, 'Creatina - 300g', true),
('Creatina - 600g', 'produto_fechado', 'creatina', 100.00, 179.90, 'Creatina - 600g', true),

-- KITS ESPECIAIS
('Kit Iniciante - Energia + Shake', 'kit', 'kit_iniciante', 75.00, 129.90, 'Kit combinado Energia + Shake', true),
('Kit Completo - Energia + Turbo + Shake', 'kit', 'kit_completo', 150.00, 249.90, 'Kit combinado completo', true),
('Kit Performance - Turbo + Hype + Creatina', 'kit', 'kit_performance', 180.00, 299.90, 'Kit para performance', true)

ON CONFLICT DO NOTHING;

-- Verificar inserção
SELECT 
  categoria,
  COUNT(*) as total,
  SUM(pv) as pv_total
FROM wellness_produtos
WHERE ativo = true
GROUP BY categoria
ORDER BY categoria;






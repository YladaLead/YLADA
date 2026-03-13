-- SEED — Blocos iniciais para fábrica de diagnósticos.
-- Rodar após 273.
-- Ver: docs/BIBLIOTECA-INTELIGENTE-DIAGNOSTICOS-BLOCOS.md

-- theme (situação)
INSERT INTO diagnosis_blocks (block_type, content, tags) VALUES
('theme', 'emagrecimento', ARRAY['emagrecimento','peso','dieta']),
('theme', 'pele', ARRAY['pele','estetica','facial','dermatologia']),
('theme', 'energia', ARRAY['energia','cansaco','fadiga']),
('theme', 'digestão', ARRAY['digestao','intestino','gut']),
('theme', 'sono', ARRAY['sono','descanso','insonia']),
('theme', 'performance', ARRAY['performance','treino','exercicio']),
('theme', 'ansiedade', ARRAY['ansiedade','estresse','mente']),
('theme', 'metabolismo', ARRAY['metabolismo','emagrecimento']);

-- problem (problema)
INSERT INTO diagnosis_blocks (block_type, content, tags) VALUES
('problem', 'travando resultados', ARRAY['resultados','bloqueio']),
('problem', 'metabolismo lento', ARRAY['metabolismo','emagrecimento']),
('problem', 'inflamação', ARRAY['inflamacao','pele','saude']),
('problem', 'retenção de líquido', ARRAY['retencao','inchaco']),
('problem', 'falta de constância', ARRAY['constancia','habitos']),
('problem', 'resultados da pele', ARRAY['pele','estetica','resultados']),
('problem', 'falta de energia', ARRAY['energia','cansaco']),
('problem', 'intestino preso', ARRAY['intestino','digestao']);

-- audience (público)
INSERT INTO diagnosis_blocks (block_type, content, tags) VALUES
('audience', 'mulheres 40+', ARRAY['mulheres','40','hormonal']),
('audience', 'homens sedentários', ARRAY['homens','sedentario']),
('audience', 'rotina corrida', ARRAY['rotina','corrida','tempo']),
('audience', 'quem já tentou dieta', ARRAY['dieta','tentativa']),
('audience', 'quem já fez tratamentos estéticos', ARRAY['estetica','tratamento']);

-- promise (promessa)
INSERT INTO diagnosis_blocks (block_type, content, tags) VALUES
('promise', 'descubra o que pode estar travando', ARRAY['bloqueio','identificar']),
('promise', 'identifique o bloqueio', ARRAY['bloqueio']),
('promise', 'entenda o que seu corpo está pedindo', ARRAY['corpo','sinais']),
('promise', 'descubra o que pode estar impedindo melhores resultados', ARRAY['resultados','pele']),
('promise', 'descubra o que pode estar impedindo sua pele de ter melhores resultados', ARRAY['pele','resultados']),
('promise', 'entenda o que pode estar bloqueando sua energia', ARRAY['energia','bloqueio']);

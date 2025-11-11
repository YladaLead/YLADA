DROP INDEX IF EXISTS idx_templates_nutrition_slug;

UPDATE templates_nutrition SET slug = NULL WHERE slug = 'calc-calorias' AND id != '4cc3180d-c2cb-4f6f-8813-0a35ae888e53';
UPDATE templates_nutrition SET slug = NULL WHERE slug = 'calc-imc' AND id != '022ecb0d-f9a1-4fc6-ae2f-b2f5941dd87f';
UPDATE templates_nutrition SET slug = NULL WHERE slug = 'calc-proteina' AND id != '1d1b6759-ba5d-4983-ad3b-7ff7ff927268';
UPDATE templates_nutrition SET slug = NULL WHERE slug = 'guia-hidratacao' AND id != 'c5335560-15e5-4deb-9ea7-c0fbf5f64799';
UPDATE templates_nutrition SET slug = NULL WHERE slug = 'checklist-alimentar' AND id != '0e90a826-8b2a-48aa-874a-257d0f2fcfb2';
UPDATE templates_nutrition SET slug = NULL WHERE slug = 'checklist-detox' AND id != '26e1f506-cc2d-4722-b7d8-ff6277f47771';
UPDATE templates_nutrition SET slug = NULL WHERE slug = 'avaliacao-intolerancia' AND id != 'ecdfe8f0-c444-4787-9f93-a5d9ce031e19';
UPDATE templates_nutrition SET slug = NULL WHERE slug = 'avaliacao-perfil-metabolico' AND id != '14036953-a34c-4c67-b15c-3e9b4eb464fd';
UPDATE templates_nutrition SET slug = NULL WHERE slug = 'diagnostico-eletrolitos' AND id != '14f016b1-d372-489b-8258-c1f9544c3879';
UPDATE templates_nutrition SET slug = NULL WHERE slug = 'diagnostico-sintomas-intestinais' AND id != 'aa931dad-aac8-4f02-b608-684e3e6fa017';
UPDATE templates_nutrition SET slug = NULL WHERE slug = 'pronto-emagrecer' AND id != '53ba4a25-5024-40a3-a3c6-922bd568621d';
UPDATE templates_nutrition SET slug = NULL WHERE slug = 'tipo-fome' AND id != '1affe7f5-1e71-40ae-a1b0-7cc640afdd28';
UPDATE templates_nutrition SET slug = NULL WHERE slug = 'quiz-bem-estar' AND id != 'adfaea74-6069-4aa4-924e-33aeeb4094fb';
UPDATE templates_nutrition SET slug = NULL WHERE slug = 'quiz-detox' AND id != '0f73e66f-6a3b-4cd6-82ff-d5b1826ef7f3';
UPDATE templates_nutrition SET slug = NULL WHERE slug = 'quiz-energetico' AND id != 'f17af04a-59b6-4d45-ba80-a8019ab6f75d';
UPDATE templates_nutrition SET slug = NULL WHERE slug = 'quiz-ganhos' AND id != 'b56ded32-7739-4f29-afee-a1a8b3a34a96';
UPDATE templates_nutrition SET slug = NULL WHERE slug = 'quiz-proposito' AND id != 'a46ecd18-7b71-4a15-a250-f49fa75fd22d';
UPDATE templates_nutrition SET slug = NULL WHERE slug = 'sindrome-metabolica' AND id != '83cb2ccd-819d-4ece-9008-8ff0fdbe5d48';
UPDATE templates_nutrition SET slug = NULL WHERE slug = 'retencao-liquidos' AND id != '265f4641-e7c8-48c2-92b7-fbd2f2f1a5b7';
UPDATE templates_nutrition SET slug = NULL WHERE slug = 'conhece-seu-corpo' AND id != '3e893b95-454b-4168-93f4-c98a47f2c9d7';
UPDATE templates_nutrition SET slug = NULL WHERE slug = 'disciplinado-emocional' AND id != '9b674ed9-2119-48f7-a2aa-849150097a01';
UPDATE templates_nutrition SET slug = NULL WHERE slug = 'nutrido-vs-alimentado' AND id != 'c56cc5db-1506-4c93-a324-20777c9b2345';
UPDATE templates_nutrition SET slug = NULL WHERE slug = 'alimentacao-rotina' AND id != '45f9a1c8-0db8-4360-9405-25502ffe4c42';

UPDATE templates_nutrition SET slug = 'calc-calorias' WHERE id = '4cc3180d-c2cb-4f6f-8813-0a35ae888e53';
UPDATE templates_nutrition SET slug = 'calc-imc' WHERE id = '022ecb0d-f9a1-4fc6-ae2f-b2f5941dd87f';
UPDATE templates_nutrition SET slug = 'calc-proteina' WHERE id = '1d1b6759-ba5d-4983-ad3b-7ff7ff927268';
UPDATE templates_nutrition SET slug = 'guia-hidratacao' WHERE id = 'c5335560-15e5-4deb-9ea7-c0fbf5f64799';
UPDATE templates_nutrition SET slug = 'checklist-alimentar' WHERE id = '0e90a826-8b2a-48aa-874a-257d0f2fcfb2';
UPDATE templates_nutrition SET slug = 'checklist-detox' WHERE id = '26e1f506-cc2d-4722-b7d8-ff6277f47771';
UPDATE templates_nutrition SET slug = 'avaliacao-intolerancia' WHERE id = 'ecdfe8f0-c444-4787-9f93-a5d9ce031e19';
UPDATE templates_nutrition SET slug = 'avaliacao-perfil-metabolico' WHERE id = '14036953-a34c-4c67-b15c-3e9b4eb464fd';
UPDATE templates_nutrition SET slug = 'diagnostico-eletrolitos' WHERE id = '14f016b1-d372-489b-8258-c1f9544c3879';
UPDATE templates_nutrition SET slug = 'diagnostico-sintomas-intestinais' WHERE id = 'aa931dad-aac8-4f02-b608-684e3e6fa017';
UPDATE templates_nutrition SET slug = 'pronto-emagrecer' WHERE id = '53ba4a25-5024-40a3-a3c6-922bd568621d';
UPDATE templates_nutrition SET slug = 'tipo-fome' WHERE id = '1affe7f5-1e71-40ae-a1b0-7cc640afdd28';
UPDATE templates_nutrition SET slug = 'quiz-bem-estar' WHERE id = 'adfaea74-6069-4aa4-924e-33aeeb4094fb';
UPDATE templates_nutrition SET slug = 'quiz-detox' WHERE id = '0f73e66f-6a3b-4cd6-82ff-d5b1826ef7f3';
UPDATE templates_nutrition SET slug = 'quiz-energetico' WHERE id = 'f17af04a-59b6-4d45-ba80-a8019ab6f75d';
UPDATE templates_nutrition SET slug = 'quiz-ganhos' WHERE id = 'b56ded32-7739-4f29-afee-a1a8b3a34a96';
UPDATE templates_nutrition SET slug = 'quiz-proposito' WHERE id = 'a46ecd18-7b71-4a15-a250-f49fa75fd22d';
UPDATE templates_nutrition SET slug = 'sindrome-metabolica' WHERE id = '83cb2ccd-819d-4ece-9008-8ff0fdbe5d48';
UPDATE templates_nutrition SET slug = 'retencao-liquidos' WHERE id = '265f4641-e7c8-48c2-92b7-fbd2f2f1a5b7';
UPDATE templates_nutrition SET slug = 'conhece-seu-corpo' WHERE id = '3e893b95-454b-4168-93f4-c98a47f2c9d7';
UPDATE templates_nutrition SET slug = 'nutrido-vs-alimentado' WHERE id = 'c56cc5db-1506-4c93-a324-20777c9b2345';
UPDATE templates_nutrition SET slug = 'alimentacao-rotina' WHERE id = '45f9a1c8-0db8-4360-9405-25502ffe4c42';

CREATE UNIQUE INDEX IF NOT EXISTS idx_templates_nutrition_slug ON templates_nutrition(slug) WHERE slug IS NOT NULL;

SELECT name, slug, type FROM templates_nutrition WHERE profession = 'wellness' AND language = 'pt' AND is_active = true ORDER BY CASE type WHEN 'calculadora' THEN 1 WHEN 'guia' THEN 2 WHEN 'planilha' THEN 3 WHEN 'quiz' THEN 4 ELSE 5 END, name;


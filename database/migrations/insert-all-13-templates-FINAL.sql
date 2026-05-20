-- =====================================================
-- YLADA: INSERIR TODOS OS 13 TEMPLATES (CORRIGIDO)
-- Execute este arquivo no Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. Calculadora IMC
-- =====================================================
INSERT INTO templates_nutrition (
  name, type, language, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active
) VALUES (
  'Calculadora IMC',
  'calculadora',
  'pt',
  'avaliacao',
  'capturar-leads',
  'Calcule seu Índice de Massa Corporal',
  'Descubra seu IMC e receba orientações personalizadas para alcançar seu peso ideal com saúde e bem-estar.',
  '{"fields":[{"name":"age","label":"Idade","type":"number","required":true,"min":1,"max":120},{"name":"gender","label":"Gênero","type":"select","required":true,"options":["Masculino","Feminino"]},{"name":"weight","label":"Peso (kg)","type":"number","required":true,"min":1,"max":300,"step":0.1},{"name":"height","label":"Altura (cm)","type":"number","required":true,"min":100,"max":250}],"formula":"weight / (height/100)^2","results":{"categories":[{"range":[0,18.5],"label":"Abaixo do peso","color":"blue","recommendations":["Consultar especialista","Focar em alimentos nutritivos","Considerar exercícios"]},{"range":[18.5,25],"label":"Peso normal","color":"green","recommendations":["Manter hábitos saudáveis","Fazer atividades físicas","Alimentação balanceada"]},{"range":[25,30],"label":"Sobrepeso","color":"orange","recommendations":["Consultar especialista","Reduzir calorias","Aumentar atividade física"]},{"range":[30,35],"label":"Obesidade Grau I","color":"red","recommendations":["Consultar urgentemente","Plano supervisionado","Atividade acompanhada"]}]}}',
  'Ver meu resultado personalizado',
  'Olá! Calculei meu IMC através do YLADA e gostaria de saber mais sobre como alcançar meu objetivo. Pode me ajudar?'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 2. Calculadora de Proteína
-- =====================================================
INSERT INTO templates_nutrition (
  name, type, language, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active
) VALUES (
  'Calculadora de Proteína',
  'calculadora',
  'pt',
  'avaliacao',
  'capturar-leads',
  'Calcule suas necessidades proteicas diárias',
  'Descubra quantas gramas de proteína você precisa por dia para atingir seus objetivos.',
  '{"fields":[{"name":"age","label":"Idade","type":"number","required":true,"min":1,"max":120},{"name":"gender","label":"Gênero","type":"select","required":true,"options":["Masculino","Feminino"]},{"name":"weight","label":"Peso (kg)","type":"number","required":true,"min":1,"max":300,"step":0.1},{"name":"height","label":"Altura (cm)","type":"number","required":true,"min":100,"max":250},{"name":"activity","label":"Nível de atividade","type":"select","required":true,"options":["Sedentário","Leve","Moderado","Intenso","Muito intenso"]},{"name":"goal","label":"Objetivo","type":"select","required":true,"options":["Manter peso","Perder peso","Ganhar massa"]}],"formula":"weight * proteinPerKg","results":{"categories":[{"range":[0,1.0],"label":"Abaixo do recomendado","recommendations":["Aumentar ingestão proteica","Incluir fontes de proteína","Considerar suplementação"]}]}}',
  'Ver minha quantidade ideal de proteína',
  'Olá! Calculei minhas necessidades proteicas diárias através do YLADA. Gostaria de saber mais. Pode me ajudar?'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 3. Calculadora de Hidratação
-- =====================================================
INSERT INTO templates_nutrition (
  name, type, language, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active
) VALUES (
  'Calculadora de Hidratação',
  'calculadora',
  'pt',
  'avaliacao',
  'capturar-leads',
  'Calcule sua necessidade diária de água',
  'Descubra quanta água você precisa beber por dia para manter seu corpo hidratado.',
  '{"fields":[{"name":"age","label":"Idade","type":"number","required":true,"min":1,"max":120},{"name":"gender","label":"Gênero","type":"select","required":true,"options":["Masculino","Feminino"]},{"name":"weight","label":"Peso (kg)","type":"number","required":true,"min":1,"max":300,"step":0.1},{"name":"activity","label":"Nível de atividade","type":"select","required":true,"options":["Sedentário","Leve","Moderado","Intenso","Muito intenso"]},{"name":"climate","label":"Clima","type":"select","required":true,"options":["Temperado","Quente","Muito quente"]}],"formula":"baseWater + activityAdjustment + climateAdjustment (base: 35ml/kg)","results":{"categories":[{"range":[0,1.5],"label":"Abaixo do recomendado","recommendations":["Aumentar ingestão hídrica","Carregar garrafa de água","Beber água ao acordar"]}]}}',
  'Ver minha necessidade ideal de água',
  'Olá! Calculei minha necessidade diária de hidratação através do YLADA. Gostaria de saber mais sobre estratégias de hidratação. Pode me ajudar?'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 4. Composição Corporal
-- =====================================================
INSERT INTO templates_nutrition (
  name, type, language, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active
) VALUES (
  'Composição Corporal',
  'calculadora',
  'pt',
  'avaliacao',
  'capturar-leads',
  'Avalie sua composição corporal',
  'Entenda sua massa muscular, gordura corporal e hidratação para alcançar seus objetivos.',
  '{"fields":[{"name":"age","label":"Idade","type":"number","required":true,"min":1,"max":120},{"name":"gender","label":"Gênero","type":"select","required":true,"options":["Masculino","Feminino"]},{"name":"weight","label":"Peso (kg)","type":"number","required":true,"min":1,"max":300,"step":0.1},{"name":"height","label":"Altura (cm)","type":"number","required":true,"min":100,"max":250},{"name":"waist","label":"Cintura (cm)","type":"number","required":false,"min":50,"max":200}],"calculations":[{"name":"BMI","formula":"weight / (height/100)^2"}],"results":{"evaluation":{"mass_muscular":{"ideal":"40-50% (homens)","interpretacao":"Indica força e saúde metabólica"}}}}',
  'Ver minha composição corporal',
  'Olá! Avaliei minha composição corporal através do YLADA e gostaria de saber mais sobre otimização. Pode me ajudar?'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 5. Quiz: Ganhos e Prosperidade
-- =====================================================
INSERT INTO templates_nutrition (
  name, type, language, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active
) VALUES (
  'Quiz: Ganhos e Prosperidade',
  'quiz',
  'pt',
  'negocio',
  'capturar-leads',
  'Avalie se seu estilo de vida permite ganhar mais',
  'Descubra como seu estilo de vida impacta sua capacidade de gerar renda e prosperidade.',
  '{"questions":[{"id":1,"question":"Como você vê sua situação financeira atual?","type":"multipla","options":["Dificuldade para chegar ao final do mês","Suficiente para sobreviver","Confortável, mas sem sobrar","Próspera, consigo investir"]},{"id":2,"question":"Você tem uma fonte de renda adicional?","type":"multipla","options":["Não, apenas uma fonte","Sim, tenho freelas","Sim, tenho um negócio","Sim, tenho investimentos"]}],"scoring":{"ranges":[{"min":0,"max":5,"result":"Baixo Potencial","recommendations":["Desenvolver habilidades","Buscar mentoria","Começar pequeno"]}]}}',
  'Ver meu resultado de prosperidade',
  'Olá! Completei o Quiz de Ganhos e Prosperidade através do YLADA e gostaria de saber mais sobre como otimizar minha renda. Pode me ajudar?'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 6. Quiz: Potencial e Crescimento
-- =====================================================
INSERT INTO templates_nutrition (
  name, type, language, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active
) VALUES (
  'Quiz: Potencial e Crescimento',
  'quiz',
  'pt',
  'desenvolvimento',
  'capturar-leads',
  'Descubra se seu potencial está sendo bem aproveitado',
  'Avalie seu nível atual de desenvolvimento e identifique oportunidades de crescimento.',
  '{"questions":[{"id":1,"question":"Como você avalia seu desempenho atual?","type":"multipla","options":["Abaixo do potencial","Utilizando parte do potencial","Bom uso do potencial","Extraindo o máximo"]},{"id":2,"question":"Com que frequência você revisa metas?","type":"multipla","options":["Raramente","Anualmente","Semestralmente","Mensalmente ou mais"]}],"scoring":{"ranges":[{"min":0,"max":5,"result":"Potencial Subutilizado","recommendations":["Definir metas claras","Buscar mentorias","Criar plano"]}]}}',
  'Descobrir meu potencial',
  'Olá! Completei o Quiz de Potencial e Crescimento através do YLADA e gostaria de conversar sobre estratégias de desenvolvimento. Pode me ajudar?'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 7. Quiz: Propósito e Equilíbrio
-- =====================================================
INSERT INTO templates_nutrition (
  name, type, language, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active
) VALUES (
  'Quiz: Propósito e Equilíbrio',
  'quiz',
  'pt',
  'desenvolvimento',
  'capturar-leads',
  'Descubra se seu dia a dia está alinhado com seus sonhos',
  'Avalie o equilíbrio entre sua vida profissional, pessoal e propósito.',
  '{"questions":[{"id":1,"question":"Você tem clareza sobre seu propósito?","type":"multipla","options":["Não, estou perdido","Parcialmente","Sim, tenho direção","Sim, vivo meu propósito"]},{"id":2,"question":"Como você equilibra trabalho e vida pessoal?","type":"multipla","options":["Vida pessoal prejudicada","Dificilmente equilibro","Consegue manter equilíbrio","Tenho equilíbrio saudável"]}],"scoring":{"ranges":[{"min":0,"max":5,"result":"Desalinhamento","recommendations":["Refletir sobre valores","Definir propósito","Criar plano de vida"]}]}}',
  'Ver meu alinhamento',
  'Olá! Completei o Quiz de Propósito e Equilíbrio através do YLADA e gostaria de conversar sobre alinhamento de vida. Pode me ajudar?'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 8. Quiz: Diagnóstico de Parasitas
-- =====================================================
INSERT INTO templates_nutrition (
  name, type, language, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active
) VALUES (
  'Quiz: Diagnóstico de Parasitas',
  'quiz',
  'pt',
  'saude',
  'capturar-leads',
  'Descubra se você tem parasitas que estão afetando sua saúde',
  'Avalie sintomas comuns relacionados a parasitas intestinais.',
  '{"questions":[{"id":1,"question":"Você tem problemas digestivos frequentes?","type":"multipla","options":["Não","Às vezes","Frequentemente","Constantemente"]},{"id":2,"question":"Como você se sente em relação à energia?","type":"multipla","options":["Com muita energia","Energia moderada","Sinto cansaço","Muito cansado"]}],"scoring":{"interpretation":"Avaliação de sintomas que podem indicar necessidade de limpeza intestinal","recommendations":["Consultar especialista","Considerar limpeza intestinal","Melhorar higiene alimentar"]}}',
  'Ver diagnóstico de saúde',
  'Olá! Completei o Quiz de Diagnóstico de Parasitas através do YLADA e gostaria de saber mais sobre protocolos de limpeza. Pode me ajudar?'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 9. Quiz: Alimentação Saudável
-- =====================================================
INSERT INTO templates_nutrition (
  name, type, language, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active
) VALUES (
  'Quiz: Alimentação Saudável',
  'quiz',
  'pt',
  'nutricao',
  'capturar-leads',
  'Avalie seus hábitos alimentares e receba orientações',
  'Descubra como seus hábitos alimentares estão impactando sua saúde.',
  '{"questions":[{"id":1,"question":"Quantas refeições você faz por dia?","type":"multipla","options":["1-2 refeições","3 refeições","4-5 refeições","6 ou mais"]},{"id":2,"question":"Você consome frutas e verduras diariamente?","type":"multipla","options":["Raramente","Às vezes","Frequentemente","Sempre"]}],"scoring":{"ranges":[{"min":0,"max":5,"result":"Hábitos a Melhorar","recommendations":["Aumentar frequência","Incluir mais frutas","Buscar orientação"]}]}}',
  'Ver meu resultado nutricional',
  'Olá! Completei o Quiz de Alimentação Saudável através do YLADA e gostaria de saber mais sobre melhorar meus hábitos. Pode me ajudar?'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 10. Tabela: Bem-Estar Diário
-- =====================================================
INSERT INTO templates_nutrition (
  name, type, language, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active
) VALUES (
  'Tabela: Bem-Estar Diário',
  'planilha',
  'pt',
  'acompanhamento',
  'capturar-leads',
  'Acompanhe suas métricas de bem-estar diárias',
  'Tabela para acompanhar peso, hidratação, sono, energia e humor.',
  '{"fields":[{"name":"date","label":"Data","type":"date","required":true},{"name":"weight","label":"Peso (kg)","type":"number","step":0.1},{"name":"water","label":"Água (litros)","type":"number","step":0.1},{"name":"sleep","label":"Horas de sono","type":"number","min":4,"max":12},{"name":"energy","label":"Nível de energia","type":"select","options":["Baixo","Médio","Alto","Muito alto"]},{"name":"mood","label":"Humor","type":"select","options":["😢","😐","🙂","😊","🤩"]}],"columns":["Data","Peso","Água","Sono","Energia","Humor","Observações"],"tips":["Registre diariamente","Observe padrões","Correlacione com alimentação","Ajuste hábitos"]}',
  'Baixar minha tabela',
  'Olá! Acompanho meu bem-estar diário através do YLADA e gostaria de saber mais sobre otimização. Pode me ajudar?'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 11. Planejador de Refeições
-- =====================================================
INSERT INTO templates_nutrition (
  name, type, language, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active
) VALUES (
  'Planejador de Refeições',
  'calculadora',
  'pt',
  'nutricao',
  'vender-suplementos',
  'Crie seu plano alimentar personalizado',
  'Receba um plano alimentar completo com cardápio semanal.',
  '{"fields":[{"name":"age","label":"Idade","type":"number","required":true},{"name":"gender","label":"Gênero","type":"select","options":["Masculino","Feminino"],"required":true},{"name":"weight","label":"Peso atual (kg)","type":"number","required":true,"step":0.1},{"name":"height","label":"Altura (cm)","type":"number","required":true},{"name":"activity","label":"Nível de atividade","type":"select","options":["Sedentário","Leve","Moderado","Ativo","Muito ativo"],"required":true},{"name":"goal","label":"Objetivo","type":"select","options":["Manter peso","Perder peso","Ganhar massa"],"required":true}],"output":{"mealPlan":"Cardápio semanal","macros":"Distribuição de macronutrientes","recipes":"Receitas recomendadas"},"supplements":[{"name":"Proteína em Pó","recommendation":"Após treino"},{"name":"Multivitamínico","recommendation":"Pela manhã"},{"name":"Omega 3","recommendation":"Durante refeição"}]}',
  'Receber meu plano alimentar',
  'Olá! Solicitei meu plano alimentar personalizado através do YLADA e gostaria de saber mais sobre implementação. Pode me ajudar?'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 12. Avaliação Nutricional
-- =====================================================
INSERT INTO templates_nutrition (
  name, type, language, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active
) VALUES (
  'Avaliação Nutricional Completa',
  'quiz',
  'pt',
  'nutricao',
  'capturar-leads',
  'Questionário completo de hábitos alimentares',
  'Avaliação detalhada dos seus hábitos alimentares, deficiências nutricionais e necessidades.',
  '{"questions":[{"id":1,"question":"Como você se sente após as refeições?","type":"multipla","options":["Pesado e lento","Razoável","Bem","Energizado"]},{"id":2,"question":"Você sente fome entre as refeições?","type":"multipla","options":["Sempre","Frequentemente","Às vezes","Raramente"]},{"id":3,"question":"Você consome alimentos industrializados?","type":"multipla","options":["Diariamente","Frequentemente","Às vezes","Raramente"]}],"scoring":{"nutritional_deficiencies":{"protein":"Avaliar consumo","vitamins":"Verificar ingestão","hydration":"Melhorar"},"recommendations":{"diet":"Ajustes na alimentação","supplements":"Suplementação","consultation":"Consulta especialista"}}}',
  'Ver minha avaliação nutricional',
  'Olá! Completei minha Avaliação Nutricional através do YLADA e gostaria de saber mais sobre os resultados. Pode me ajudar?'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 13. Quiz: Perfil de Bem-Estar
-- =====================================================
INSERT INTO templates_nutrition (
  name, type, language, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active
) VALUES (
  'Quiz: Perfil de Bem-Estar',
  'quiz',
  'pt',
  'bem-estar',
  'capturar-leads',
  'Descubra seu perfil completo de bem-estar',
  'Avaliação abrangente de bem-estar: física, mental, emocional e social.',
  '{"questions":[{"section":"Saúde Física","questions":[{"id":1,"question":"Como você avalia seu nível de energia?","type":"multipla","options":["Baixo","Médio","Alto","Muito alto"]},{"id":2,"question":"Frequência de atividades físicas?","type":"multipla","options":["Nunca","1x por semana","2-3x","4x ou mais"]}]},{"section":"Saúde Mental","questions":[{"id":3,"question":"Você lida bem com estresse?","type":"multipla","options":["Não","Às vezes","Geralmente","Sim"]}]}],"scoring":{"profiles":[{"name":"Equilibrado","score_range":[40,50],"description":"Excelente equilíbrio"},{"name":"Moderado","score_range":[30,39],"description":"Áreas para otimização"},{"name":"Desenvolvimento","score_range":[20,29],"description":"Priorizar saúde"}]}}',
  'Ver meu perfil de bem-estar',
  'Olá! Completei o Quiz de Perfil de Bem-Estar através do YLADA e gostaria de conversar sobre estratégias. Pode me ajudar?'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================
SELECT 
    '✅ Templates inseridos:' as info,
    COUNT(*) as total
FROM templates_nutrition
WHERE name IN (
  'Calculadora IMC',
  'Calculadora de Proteína',
  'Calculadora de Hidratação',
  'Composição Corporal',
  'Quiz: Ganhos e Prosperidade',
  'Quiz: Potencial e Crescimento',
  'Quiz: Propósito e Equilíbrio',
  'Quiz: Diagnóstico de Parasitas',
  'Quiz: Alimentação Saudável',
  'Tabela: Bem-Estar Diário',
  'Planejador de Refeições',
  'Avaliação Nutricional Completa',
  'Quiz: Perfil de Bem-Estar'
);


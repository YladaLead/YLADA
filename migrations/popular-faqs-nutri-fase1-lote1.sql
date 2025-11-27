-- =====================================================
-- YLADA - FAQs ESSENCIAIS ÁREA NUTRI - LOTE 1 (FAQs 1-25)
-- Primeiros 25 FAQs das funcionalidades mais usadas
-- =====================================================

-- Nota: Substitua 'SEU_USER_ID_AQUI' pelo ID de um usuário admin/support
-- Você pode pegar o ID executando: SELECT id FROM auth.users WHERE email = 'seu-email@exemplo.com';

-- =====================================================
-- CALCULADORAS (FAQs 1-12)
-- =====================================================

-- FAQ 1: Como criar calculadora de IMC (já existe, mas vamos melhorar)
UPDATE faq_responses 
SET ordem_prioridade = 10
WHERE area = 'nutri' AND pergunta LIKE '%calculadora de IMC%';

-- FAQ 2: Como personalizar campos da calculadora de IMC
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como personalizar os campos da calculadora de IMC?',
  ARRAY['personalizar', 'campos', 'calculadora', 'imc', 'editar'],
  '📌 COMO PERSONALIZAR CAMPOS DA CALCULADORA DE IMC

🎯 O QUE VOCÊ VAI APRENDER:
- Como editar labels dos campos
- Como tornar campos obrigatórios ou opcionais
- Como adicionar placeholders
- Como configurar validações

📝 PASSO A PASSO:

Passo 1: Acessar edição da calculadora
   → Vá em "Ferramentas" no menu
   → Encontre sua calculadora de IMC
   → Clique em "Editar"

Passo 2: Editar campos
   → Na seção "Campos", você verá "Peso" e "Altura"
   → Clique no campo que deseja editar
   → Altere o "Label" (nome do campo)
   → Exemplo: "Peso" pode virar "Seu peso atual"

Passo 3: Configurar obrigatoriedade
   → Marque/desmarque "Campo obrigatório"
   → Se obrigatório, usuário deve preencher
   → Se opcional, pode deixar em branco

Passo 4: Adicionar placeholder
   → No campo "Placeholder", digite texto de exemplo
   → Exemplo: "Ex: 70" para peso
   → Isso ajuda o usuário a entender o formato

Passo 5: Salvar alterações
   → Clique em "Salvar"
   → Suas alterações serão aplicadas

💡 DICAS IMPORTANTES:
- Use labels claros e objetivos
- Placeholders ajudam muito na usabilidade
- Teste sempre após personalizar

⚠️ PROBLEMAS COMUNS:
- "Alterações não salvam" → Verifique se clicou em Salvar
- "Campo não aparece" → Recarregue a página',
  'ferramentas',
  'calculadoras',
  9
);

-- FAQ 3: Como editar calculadora de IMC existente
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como editar uma calculadora de IMC que já criei?',
  ARRAY['editar', 'calculadora', 'imc', 'existente', 'modificar'],
  '📌 COMO EDITAR CALCULADORA DE IMC EXISTENTE

🎯 O QUE VOCÊ VAI APRENDER:
- Como acessar calculadora existente
- Como modificar informações
- Como alterar configurações
- Como atualizar CTA

📝 PASSO A PASSO:

Passo 1: Localizar calculadora
   → Acesse "Ferramentas" no menu
   → Encontre sua calculadora de IMC na lista
   → Clique no card da calculadora

Passo 2: Abrir edição
   → Clique no botão "Editar" (ícone de lápis)
   → Ou clique em "Editar" no menu da ferramenta

Passo 3: Modificar informações
   → Altere nome, descrição, emoji se desejar
   → Modifique campos (peso, altura)
   → Ajuste mensagens e resultados

Passo 4: Atualizar CTA
   → Altere WhatsApp ou URL se necessário
   → Modifique texto do botão
   → Teste o link

Passo 5: Salvar
   → Clique em "Salvar Alterações"
   → Aguarde confirmação
   → Suas alterações estão salvas

💡 DICAS IMPORTANTES:
- Link da ferramenta não muda ao editar
- Alterações são aplicadas imediatamente
- Teste sempre após editar

⚠️ PROBLEMAS COMUNS:
- "Não encontro botão editar" → Verifique se é sua ferramenta
- "Alterações não salvam" → Verifique conexão',
  'ferramentas',
  'calculadoras',
  8
);

-- FAQ 4: Como funciona diagnóstico da calculadora de IMC
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como funciona o diagnóstico automático da calculadora de IMC?',
  ARRAY['diagnostico', 'diagnóstico', 'imc', 'automatico', 'resultado'],
  '📌 COMO FUNCIONA O DIAGNÓSTICO DA CALCULADORA DE IMC

🎯 O QUE VOCÊ VAI APRENDER:
- Como o diagnóstico é gerado
- Quais resultados são possíveis
- Como personalizar diagnósticos
- O que aparece para o usuário

📝 PASSO A PASSO:

Passo 1: Entender o cálculo
   → Sistema calcula IMC: peso ÷ (altura)²
   → Classifica automaticamente o resultado
   → Gera diagnóstico baseado na classificação

Passo 2: Classificações possíveis
   → Abaixo do peso (IMC < 18,5)
   → Peso normal (IMC 18,5-24,9)
   → Sobrepeso (IMC 25-29,9)
   → Obesidade grau I (IMC 30-34,9)
   → Obesidade grau II (IMC 35-39,9)
   → Obesidade grau III (IMC ≥ 40)

Passo 3: Diagnóstico gerado
   → Cada classificação tem diagnóstico específico
   → Inclui: diagnóstico, causa raiz, ação imediata
   → Inclui: plano de ação, suplementação, alimentação
   → Inclui: próximo passo (CTA)

Passo 4: Personalização (opcional)
   → Você pode personalizar mensagens
   → Ajustar recomendações
   → Modificar próximo passo

💡 DICAS IMPORTANTES:
- Diagnósticos são baseados em padrões científicos
- Sempre incluem recomendação de consulta
- São gerados automaticamente

⚠️ IMPORTANTE:
- Diagnóstico não substitui consulta profissional
- Sempre oriente consulta presencial
- Use como ferramenta de triagem',
  'ferramentas',
  'calculadoras',
  7
);

-- FAQ 5: Como criar calculadora de proteína
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como criar uma calculadora de proteína?',
  ARRAY['criar', 'calculadora', 'proteina', 'proteína'],
  '📌 COMO CRIAR UMA CALCULADORA DE PROTEÍNA

🎯 O QUE VOCÊ VAI APRENDER:
- Como criar calculadora de proteína
- Como configurar campos (peso, atividade, objetivo)
- Como personalizar cálculo
- Como configurar resultados

📝 PASSO A PASSO:

Passo 1: Acessar criação
   → Menu "Ferramentas" > "Nova Ferramenta"
   → Escolha template "Calculadora de Proteína"
   → Ou crie do zero

Passo 2: Configurar campos
   → Campo 1: Peso (kg) - obrigatório
   → Campo 2: Nível de atividade (sedentário, moderado, intenso)
   → Campo 3: Objetivo (manutenção, ganho massa, perda peso)
   → Personalize labels e placeholders

Passo 3: Configurar cálculo
   → Sistema calcula automaticamente
   → Baseado em: peso × fator atividade × fator objetivo
   → Resultado em gramas de proteína por dia

Passo 4: Personalizar resultado
   → Defina como resultado será exibido
   → Adicione mensagem explicativa
   → Configure distribuição ao longo do dia

Passo 5: Configurar CTA
   → Escolha WhatsApp ou URL
   → Personalize mensagem de contato
   → Salve a calculadora

💡 DICAS IMPORTANTES:
- Teste com diferentes valores
- Personalize mensagens para seu público
- Inclua dicas de distribuição proteica

⚠️ PROBLEMAS COMUNS:
- "Cálculo não aparece" → Verifique se preencheu todos os campos
- "Resultado incorreto" → Confira fórmulas de cálculo',
  'ferramentas',
  'calculadoras',
  6
);

-- FAQ 6: Como configurar objetivos na calculadora de proteína
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como configurar objetivos na calculadora de proteína?',
  ARRAY['configurar', 'objetivos', 'calculadora', 'proteina', 'opcoes'],
  '📌 COMO CONFIGURAR OBJETIVOS NA CALCULADORA DE PROTEÍNA

🎯 O QUE VOCÊ VAI APRENDER:
- Como adicionar opções de objetivo
- Como personalizar objetivos
- Como configurar fatores de cálculo
- Como organizar opções

📝 PASSO A PASSO:

Passo 1: Acessar configuração
   → Edite sua calculadora de proteína
   → Vá na seção "Campos"
   → Localize campo "Objetivo"

Passo 2: Configurar opções
   → Adicione opções: "Manutenção", "Ganho de Massa", "Perda de Peso"
   → Cada opção tem fator de cálculo diferente
   → Manutenção: 1,2-1,6g/kg
   → Ganho massa: 1,6-2,2g/kg
   → Perda peso: 1,6-2,4g/kg

Passo 3: Personalizar opções
   → Altere nomes das opções se desejar
   → Adicione descrições curtas
   → Organize por ordem de importância

Passo 4: Testar cálculo
   → Teste com cada objetivo
   → Verifique se resultados estão corretos
   → Ajuste fatores se necessário

Passo 5: Salvar
   → Salve as alterações
   → Teste novamente para confirmar

💡 DICAS IMPORTANTES:
- Use objetivos claros e objetivos
- Baseie fatores em literatura científica
- Teste sempre após alterar

⚠️ PROBLEMAS COMUNS:
- "Opção não aparece" → Verifique se salvou
- "Cálculo errado" → Confira fatores de cada objetivo',
  'ferramentas',
  'calculadoras',
  5
);

-- FAQ 7: Como editar calculadora de proteína
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como editar calculadora de proteína existente?',
  ARRAY['editar', 'calculadora', 'proteina', 'modificar'],
  '📌 COMO EDITAR CALCULADORA DE PROTEÍNA

📝 PASSO A PASSO:

Passo 1: Localizar calculadora
   → Acesse "Ferramentas"
   → Encontre sua calculadora de proteína
   → Clique para abrir

Passo 2: Abrir edição
   → Clique em "Editar"
   → Você verá todas as configurações

Passo 3: Modificar
   → Altere nome, descrição, campos
   → Modifique opções de objetivo
   → Ajuste mensagens e resultados

Passo 4: Salvar
   → Clique em "Salvar Alterações"
   → Alterações aplicadas imediatamente

💡 DICAS:
- Link não muda ao editar
- Teste sempre após modificar',
  'ferramentas',
  'calculadoras',
  4
);

-- FAQ 8: Como criar calculadora de água
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como criar uma calculadora de água/hidratação?',
  ARRAY['criar', 'calculadora', 'agua', 'água', 'hidratacao', 'hidratação'],
  '📌 COMO CRIAR CALCULADORA DE ÁGUA

📝 PASSO A PASSO:

Passo 1: Criar nova ferramenta
   → "Ferramentas" > "Nova Ferramenta"
   → Escolha "Calculadora de Água"

Passo 2: Configurar campos
   → Peso (kg): obrigatório
   → Nível atividade: sedentário, moderado, intenso
   → Clima: normal, quente, muito quente

Passo 3: Configurar cálculo
   → Base: 35ml por kg de peso
   → Ajuste por atividade (+500ml a +1000ml)
   → Ajuste por clima (+500ml a +1000ml)

Passo 4: Personalizar resultado
   → Mostre total diário
   - Sugira distribuição ao longo do dia
   - Dicas de hidratação

Passo 5: Salvar e compartilhar
   → Salve a calculadora
   → Copie link ou gere QR code

💡 DICAS:
- Inclua dicas práticas de hidratação
- Sugira horários para beber água',
  'ferramentas',
  'calculadoras',
  3
);

-- FAQ 9: Como personalizar cálculo de hidratação
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como personalizar o cálculo de hidratação na calculadora?',
  ARRAY['personalizar', 'calculo', 'hidratacao', 'agua', 'formula'],
  '📌 COMO PERSONALIZAR CÁLCULO DE HIDRATAÇÃO

📝 PASSO A PASSO:

Passo 1: Editar calculadora
   → Abra sua calculadora de água
   → Clique em "Editar"

Passo 2: Ajustar fórmula base
   → Padrão: 35ml por kg
   → Você pode alterar para 30ml, 40ml, etc
   → Baseado na sua metodologia

Passo 3: Configurar fatores
   → Atividade leve: +0ml
   → Atividade moderada: +500ml
   → Atividade intensa: +1000ml
   → Ajuste conforme necessário

Passo 4: Configurar clima
   → Clima normal: +0ml
   → Clima quente: +500ml
   → Clima muito quente: +1000ml

Passo 5: Testar e salvar
   → Teste com diferentes valores
   → Verifique se resultados fazem sentido
   → Salve alterações

💡 DICAS:
- Baseie em literatura científica
- Considere público-alvo
- Teste sempre',
  'ferramentas',
  'calculadoras',
  2
);

-- FAQ 10: Como editar calculadora de água
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como editar calculadora de água existente?',
  ARRAY['editar', 'calculadora', 'agua', 'modificar'],
  '📌 COMO EDITAR CALCULADORA DE ÁGUA

📝 PASSO A PASSO:

Passo 1: Localizar
   → "Ferramentas" > Encontre calculadora
   → Clique para abrir

Passo 2: Editar
   → Clique em "Editar"
   → Modifique campos, fórmulas, mensagens

Passo 3: Salvar
   → "Salvar Alterações"
   → Alterações aplicadas imediatamente

💡 DICAS:
- Link permanece o mesmo
- Teste após editar',
  'ferramentas',
  'calculadoras',
  1
);

-- FAQ 11: Como criar calculadora de calorias
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como criar uma calculadora de calorias?',
  ARRAY['criar', 'calculadora', 'calorias', 'gasto', 'energetico'],
  '📌 COMO CRIAR CALCULADORA DE CALORIAS

📝 PASSO A PASSO:

Passo 1: Criar ferramenta
   → "Ferramentas" > "Nova Ferramenta"
   → Escolha "Calculadora de Calorias"

Passo 2: Configurar campos
   → Idade (anos)
   → Gênero (masculino, feminino)
   → Peso (kg)
   → Altura (cm)
   → Nível atividade (sedentário a muito ativo)

Passo 3: Configurar cálculo
   → Fórmula: TMB (Taxa Metabólica Basal)
   → Ajuste por atividade física
   → Resultado: calorias diárias

Passo 4: Personalizar
   → Adicione distribuição de macronutrientes
   → Inclua dicas de alimentação
   → Configure mensagens

Passo 5: Salvar
   → Salve e compartilhe

💡 DICAS:
- Use fórmulas validadas (Harris-Benedict, Mifflin)
- Inclua aviso sobre consulta profissional',
  'ferramentas',
  'calculadoras',
  0
);

-- FAQ 12: Como configurar atividade física na calculadora
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como configurar níveis de atividade física na calculadora de calorias?',
  ARRAY['configurar', 'atividade', 'fisica', 'calorias', 'niveis'],
  '📌 COMO CONFIGURAR NÍVEIS DE ATIVIDADE

📝 PASSO A PASSO:

Passo 1: Editar calculadora
   → Abra calculadora de calorias
   → Clique em "Editar"

Passo 2: Localizar campo atividade
   → Vá em "Campos"
   → Encontre "Nível de Atividade"

Passo 3: Configurar opções
   → Sedentário: pouco ou nenhum exercício (fator 1,2)
   → Leve: exercício 1-3x/semana (fator 1,375)
   → Moderado: exercício 3-5x/semana (fator 1,55)
   → Intenso: exercício 6-7x/semana (fator 1,725)
   → Muito intenso: exercício 2x/dia (fator 1,9)

Passo 4: Personalizar descrições
   → Adicione descrições claras
   → Exemplo: "Sedentário: trabalho sentado, sem exercício"
   → Isso ajuda usuário a escolher

Passo 5: Testar e salvar
   → Teste com diferentes níveis
   → Verifique cálculos
   → Salve

💡 DICAS:
- Use fatores padrão (Harris-Benedict)
- Descreva claramente cada nível
- Teste sempre',
  'ferramentas',
  'calculadoras',
  -1
);

-- =====================================================
-- QUIZZES BÁSICOS (FAQs 13-27)
-- =====================================================

-- FAQ 13: Como criar quiz interativo de metabolismo
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como criar quiz interativo de metabolismo?',
  ARRAY['criar', 'quiz', 'interativo', 'metabolismo'],
  '📌 COMO CRIAR QUIZ INTERATIVO DE METABOLISMO

📝 PASSO A PASSO:

Passo 1: Criar quiz
   → "Ferramentas" > "Nova Ferramenta"
   → Escolha "Quiz Interativo" ou "Criar do Zero"

Passo 2: Configurar informações
   → Nome: "Quiz de Metabolismo"
   → Descrição atrativa
   → Emoji relacionado

Passo 3: Adicionar perguntas
   → Pergunta 1: "Como você descreveria seu metabolismo?"
   → Opções: Lento, Normal, Rápido
   → Adicione 5-7 perguntas sobre metabolismo

Passo 4: Configurar resultados
   → Defina possíveis resultados
   → Ex: "Metabolismo Lento", "Metabolismo Normal", "Metabolismo Rápido"
   → Personalize diagnóstico para cada resultado

Passo 5: Configurar CTA e salvar
   → Escolha WhatsApp ou URL
   → Personalize mensagem
   → Salve o quiz

💡 DICAS:
- Faça perguntas claras e objetivas
- Use linguagem acessível
- Teste o fluxo completo',
  'ferramentas',
  'quizzes',
  -2
);

-- Continuando com mais FAQs...
-- (Vou criar em lotes menores para não exceder tokens)


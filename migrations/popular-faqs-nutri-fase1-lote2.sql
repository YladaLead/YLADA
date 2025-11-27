-- =====================================================
-- YLADA - FAQs ESSENCIAIS ÁREA NUTRI - LOTE 2 (FAQs 13-50)
-- Continuando os 50 FAQs essenciais
-- =====================================================

-- =====================================================
-- QUIZZES (FAQs 13-27)
-- =====================================================

-- FAQ 13: Como adicionar perguntas ao quiz
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como adicionar perguntas ao meu quiz?',
  ARRAY['adicionar', 'perguntas', 'quiz', 'criar'],
  '📌 COMO ADICIONAR PERGUNTAS AO QUIZ

📝 PASSO A PASSO:

Passo 1: Editar quiz
   → Abra seu quiz
   → Clique em "Editar"

Passo 2: Adicionar pergunta
   → Clique em "Adicionar Pergunta"
   → Digite sua pergunta
   → Exemplo: "Quantas refeições você faz por dia?"

Passo 3: Adicionar opções
   → Adicione 2-5 opções de resposta
   → Exemplo: "1-2 refeições", "3-4 refeições", "5+ refeições"
   → Marque resposta correta (se aplicável)

Passo 4: Organizar perguntas
   → Arraste para reordenar
   → Organize por lógica de fluxo
   → Salve

💡 DICAS:
- Faça perguntas objetivas
- Use opções claras
- Teste o fluxo',
  'ferramentas',
  'quizzes',
  -3
);

-- FAQ 14: Como configurar resultados do quiz
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como configurar os resultados do quiz?',
  ARRAY['configurar', 'resultados', 'quiz', 'diagnostico'],
  '📌 COMO CONFIGURAR RESULTADOS DO QUIZ

📝 PASSO A PASSO:

Passo 1: Definir resultados possíveis
   → Ex: "Perfil A", "Perfil B", "Perfil C"
   → Ou: "Baixo risco", "Médio risco", "Alto risco"
   → Baseado nas respostas do usuário

Passo 2: Configurar lógica
   → Defina quais respostas levam a qual resultado
   → Sistema calcula score automaticamente
   → Ou você define regras específicas

Passo 3: Personalizar diagnósticos
   → Para cada resultado, crie diagnóstico
   → Inclua: descrição, recomendações, próximo passo
   → Seja específico e útil

Passo 4: Adicionar CTA
   → Configure botão de ação
   → WhatsApp ou URL externa
   → Personalize mensagem

Passo 5: Testar
   → Teste todas as combinações
   → Verifique se resultados fazem sentido
   → Ajuste se necessário

💡 DICAS:
- Seja claro nos resultados
- Inclua sempre próximo passo
- Teste todas as possibilidades',
  'ferramentas',
  'quizzes',
  -4
);

-- FAQ 15: Como criar quiz de bem-estar
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como criar um quiz de bem-estar?',
  ARRAY['criar', 'quiz', 'bem', 'estar', 'energia'],
  '📌 COMO CRIAR QUIZ DE BEM-ESTAR

📝 PASSO A PASSO:

Passo 1: Criar quiz
   → "Ferramentas" > "Nova Ferramenta" > "Quiz"
   → Ou use template "Quiz de Bem-Estar"

Passo 2: Configurar tema
   → Foco: energia, sono, estresse, humor
   → 6-8 perguntas sobre bem-estar geral
   → Linguagem positiva e motivadora

Passo 3: Criar perguntas
   → "Como você avalia seu nível de energia?"
   → "Qualidade do seu sono?"
   → "Níveis de estresse?"
   → "Humor e disposição?"

Passo 4: Configurar resultados
   → "Bem-estar excelente"
   → "Bem-estar bom"
   → "Bem-estar precisa melhorar"
   → Diagnóstico para cada um

Passo 5: Salvar e compartilhar
   → Salve o quiz
   → Compartilhe com pacientes

💡 DICAS:
- Foque em aspectos mensuráveis
- Use escala de 1-5 ou opções claras
- Resultados devem ser acolhedores',
  'ferramentas',
  'quizzes',
  -5
);

-- FAQ 16: Como personalizar perguntas do quiz
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como personalizar as perguntas do meu quiz?',
  ARRAY['personalizar', 'perguntas', 'quiz', 'editar'],
  '📌 COMO PERSONALIZAR PERGUNTAS DO QUIZ

📝 PASSO A PASSO:

Passo 1: Editar quiz
   → Abra seu quiz
   → Clique em "Editar"

Passo 2: Editar pergunta
   → Clique na pergunta que deseja editar
   → Modifique o texto
   → Salve a pergunta

Passo 3: Editar opções
   → Clique nas opções de resposta
   → Modifique textos
   → Reordene se necessário

Passo 4: Adicionar/remover
   → Adicione novas perguntas
   → Remova perguntas desnecessárias
   → Organize sequência

Passo 5: Testar
   → Teste o quiz completo
   → Verifique se faz sentido
   → Salve alterações

💡 DICAS:
- Mantenha perguntas objetivas
- Não exagere no número de perguntas
- Teste sempre',
  'ferramentas',
  'quizzes',
  -6
);

-- FAQ 17: Como criar quiz de perfil nutricional
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como criar quiz de perfil nutricional?',
  ARRAY['criar', 'quiz', 'perfil', 'nutricional'],
  '📌 COMO CRIAR QUIZ DE PERFIL NUTRICIONAL

📝 PASSO A PASSO:

Passo 1: Criar quiz
   → Use template "Quiz de Perfil Nutricional"
   → Ou crie do zero

Passo 2: Definir perfil
   → Foco em hábitos alimentares
   → Objetivos nutricionais
   → Preferências alimentares

Passo 3: Criar perguntas (7-10)
   → "Quantas refeições você faz por dia?"
   → "Consome frutas e verduras diariamente?"
   → "Bebe água regularmente?"
   → "Tem restrições alimentares?"
   → "Qual seu objetivo principal?"

Passo 4: Configurar perfis
   → "Perfil Equilibrado"
   → "Perfil em Desenvolvimento"
   → "Perfil Precisa Atenção"
   → Diagnóstico para cada

Passo 5: Salvar
   → Salve e teste
   → Compartilhe

💡 DICAS:
- Foque em hábitos mensuráveis
- Seja positivo nos resultados
- Sempre inclua recomendação de consulta',
  'ferramentas',
  'quizzes',
  -7
);

-- FAQ 18: Como criar quiz detox
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como criar quiz sobre detox?',
  ARRAY['criar', 'quiz', 'detox', 'limpeza'],
  '📌 COMO CRIAR QUIZ DETOX

📝 PASSO A PASSO:

Passo 1: Criar quiz
   → Template "Quiz Detox" ou do zero

Passo 2: Focar em sintomas
   → Cansaço, digestão, pele
   → Energia, sono
   → 5-6 perguntas objetivas

Passo 3: Resultados
   → "Não precisa detox"
   → "Detox leve recomendado"
   → "Detox mais intenso"
   → Diagnóstico específico

Passo 4: Salvar
   → Teste e salve

💡 DICAS:
- Seja cuidadoso com linguagem
- Sempre oriente consulta profissional
- Evite promessas exageradas',
  'ferramentas',
  'quizzes',
  -8
);

-- FAQ 19: Como criar quiz energético
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como criar quiz sobre níveis de energia?',
  ARRAY['criar', 'quiz', 'energia', 'energetico'],
  '📌 COMO CRIAR QUIZ ENERGÉTICO

📝 PASSO A PASSO:

Passo 1: Criar quiz
   → Template "Quiz Energético"

Passo 2: Focar em energia
   → Níveis de energia ao longo do dia
   → Qualidade do sono
   → Alimentação e energia
   → 6 perguntas

Passo 3: Resultados
   → "Energia alta"
   → "Energia moderada"
   → "Energia baixa"
   → Diagnóstico e recomendações

Passo 4: Salvar
   → Teste e compartilhe

💡 DICAS:
- Relacione com alimentação
- Inclua dicas práticas
- Oriente consulta se necessário',
  'ferramentas',
  'quizzes',
  -9
);

-- FAQ 20: Como editar quiz de bem-estar
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como editar um quiz de bem-estar existente?',
  ARRAY['editar', 'quiz', 'bem', 'estar', 'modificar'],
  '📌 COMO EDITAR QUIZ DE BEM-ESTAR

📝 PASSO A PASSO:

Passo 1: Localizar quiz
   → "Ferramentas" > Encontre quiz
   → Clique para abrir

Passo 2: Editar
   → Clique em "Editar"
   → Modifique perguntas, opções, resultados

Passo 3: Salvar
   → "Salvar Alterações"
   → Teste novamente

💡 DICAS:
- Link não muda
- Teste sempre após editar',
  'ferramentas',
  'quizzes',
  -10
);

-- =====================================================
-- FORMULÁRIOS (FAQs 21-32)
-- =====================================================

-- FAQ 21: Como usar formulários pré-montados
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como usar os formulários pré-montados?',
  ARRAY['usar', 'formularios', 'pre', 'montados', 'templates'],
  '📌 COMO USAR FORMULÁRIOS PRÉ-MONTADOS

📝 PASSO A PASSO:

Passo 1: Acessar formulários
   → Menu "Formulários"
   → Clique em "Novo Formulário"

Passo 2: Ver formulários pré-montados
   → Você verá seção "Formulários Pré-montados"
   → Lista de templates disponíveis
   → Cada um com descrição

Passo 3: Escolher template
   → Clique no formulário desejado
   → Ex: "Avaliação Inicial", "Anamnese Completa"
   → Clique em "Usar este formulário"

Passo 4: Personalizar (opcional)
   → Você pode editar campos
   → Adicionar ou remover campos
   → Modificar textos

Passo 5: Salvar
   → Salve como novo formulário
   → Já está pronto para usar

💡 DICAS:
- Templates já vêm com campos comuns
- Você pode personalizar depois
- Economiza muito tempo

⚠️ PROBLEMAS COMUNS:
- "Não vejo templates" → Atualize a página
- "Template não carrega" → Tente novamente',
  'formularios',
  'criacao',
  -11
);

-- FAQ 22: Como editar formulário existente
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como editar um formulário que já criei?',
  ARRAY['editar', 'formulario', 'existente', 'modificar'],
  '📌 COMO EDITAR FORMULÁRIO EXISTENTE

📝 PASSO A PASSO:

Passo 1: Localizar formulário
   → "Formulários" > Encontre seu formulário
   → Clique para abrir

Passo 2: Abrir edição
   → Clique em "Editar"
   → Ou no menu do formulário

Passo 3: Modificar
   → Altere nome, descrição
   → Edite campos existentes
   → Adicione ou remova campos
   → Reordene campos (arraste)

Passo 4: Salvar
   → Clique em "Salvar"
   → Alterações aplicadas

💡 DICAS:
- Você pode editar mesmo após enviar
- Alterações não afetam respostas já recebidas
- Teste sempre após editar',
  'formularios',
  'edicao',
  -12
);

-- FAQ 23: Como duplicar formulário
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como duplicar um formulário?',
  ARRAY['duplicar', 'formulario', 'copiar', 'replicar'],
  '📌 COMO DUPLICAR FORMULÁRIO

📝 PASSO A PASSO:

Passo 1: Abrir formulário
   → "Formulários" > Abra formulário
   → Clique em "Editar"

Passo 2: Duplicar
   → Procure opção "Duplicar" ou "Copiar"
   → Ou salve com novo nome
   → Sistema cria cópia

Passo 3: Renomear
   → Dê novo nome à cópia
   → Ex: "Anamnese Completa - Versão 2"
   → Salve

💡 DICAS:
- Útil para criar variações
- Mantém original intacto
- Economiza tempo

⚠️ NOTA:
- Se não houver botão duplicar, você pode:
  1. Criar novo formulário
  2. Copiar campos manualmente
  3. Ou entrar em contato com suporte',
  'formularios',
  'edicao',
  -13
);

-- FAQ 24: Como adicionar campos ao formulário
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como adicionar novos campos ao formulário?',
  ARRAY['adicionar', 'campos', 'formulario', 'novo'],
  '📌 COMO ADICIONAR CAMPOS AO FORMULÁRIO

📝 PASSO A PASSO:

Passo 1: Editar formulário
   → Abra formulário
   → Clique em "Editar"

Passo 2: Adicionar campo
   → Clique em "Adicionar Campo"
   → Escolha tipo: texto, número, data, etc

Passo 3: Configurar campo
   → Digite label (nome do campo)
   → Defina se é obrigatório
   → Adicione placeholder (exemplo)
   → Configure validações

Passo 4: Organizar
   → Arraste para posicionar
   → Organize por seções
   → Salve

💡 DICAS:
- Use labels claros
- Agrupe campos relacionados
- Teste sempre',
  'formularios',
  'campos',
  -14
);

-- FAQ 25: Quais tipos de campos posso usar
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Quais tipos de campos posso usar no formulário?',
  ARRAY['tipos', 'campos', 'formulario', 'opcoes'],
  '📌 TIPOS DE CAMPOS DISPONÍVEIS

🎯 TIPOS DE CAMPOS:

1. Texto
   → Para respostas curtas
   → Ex: Nome, cidade

2. Texto Longo (Textarea)
   → Para respostas extensas
   → Ex: Observações, histórico

3. Número
   → Para valores numéricos
   → Ex: Peso, altura, idade

4. Email
   → Valida formato de email
   → Ex: Email do cliente

5. Telefone
   → Formatação automática
   → Ex: WhatsApp, telefone

6. Data
   → Seletor de data
   → Ex: Data de nascimento

7. Seleção Única (Radio)
   → Uma opção apenas
   → Ex: Gênero, objetivo

8. Seleção Múltipla (Checkbox)
   → Várias opções
   → Ex: Sintomas, preferências

9. Dropdown
   → Lista suspensa
   → Ex: Estado, cidade

💡 DICAS:
- Escolha tipo adequado ao dado
- Use validações quando possível
- Teste sempre',
  'formularios',
  'campos',
  -15
);

-- FAQ 26: Como tornar campo obrigatório
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como tornar um campo obrigatório no formulário?',
  ARRAY['obrigatorio', 'campo', 'formulario', 'requerido'],
  '📌 COMO TORNAR CAMPO OBRIGATÓRIO

📝 PASSO A PASSO:

Passo 1: Editar formulário
   → Abra formulário
   → Clique em "Editar"

Passo 2: Selecionar campo
   → Clique no campo desejado
   → Abra configurações

Passo 3: Marcar obrigatório
   → Encontre opção "Campo obrigatório"
   → Marque a checkbox
   → Salve campo

Passo 4: Verificar
   → Campo terá asterisco (*)
   → Usuário não pode enviar sem preencher
   → Teste enviando formulário vazio

💡 DICAS:
- Use apenas para campos essenciais
- Muitos obrigatórios podem desanimar
- Teste sempre',
  'formularios',
  'campos',
  -16
);

-- FAQ 27: Como reordenar campos
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como reordenar os campos do formulário?',
  ARRAY['reordenar', 'campos', 'formulario', 'organizar', 'ordem'],
  '📌 COMO REORDENAR CAMPOS DO FORMULÁRIO

📝 PASSO A PASSO:

Passo 1: Editar formulário
   → Abra formulário
   → Clique em "Editar"

Passo 2: Arrastar campos
   → Clique e segure no campo
   → Arraste para nova posição
   → Solte para posicionar

Passo 3: Organizar logicamente
   → Coloque campos relacionados juntos
   → Ex: Nome, email, telefone juntos
   → Ex: Peso, altura, IMC juntos

Passo 4: Salvar
   → Salve alterações
   → Ordem será mantida

💡 DICAS:
- Organize por seções lógicas
- Facilita preenchimento
- Melhora experiência do usuário',
  'formularios',
  'organizacao',
  -17
);

-- FAQ 28: Como enviar formulário para cliente
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como enviar formulário para um cliente?',
  ARRAY['enviar', 'formulario', 'cliente', 'compartilhar'],
  '📌 COMO ENVIAR FORMULÁRIO PARA CLIENTE

📝 PASSO A PASSO:

Passo 1: Abrir formulário
   → "Formulários" > Abra formulário
   → Clique em "Enviar"

Passo 2: Escolher destinatário
   → Digite email do cliente
   → Ou selecione cliente existente
   → Pode enviar para múltiplos

Passo 3: Personalizar mensagem
   → Adicione mensagem personalizada
   → Ex: "Olá! Por favor, preencha este formulário"
   → Inclua instruções se necessário

Passo 4: Enviar
   → Clique em "Enviar"
   → Cliente receberá email com link
   → Link direto para preencher

Passo 5: Acompanhar
   → Veja status: enviado, visualizado, respondido
   → Receba notificação quando responder

💡 DICAS:
- Personalize sempre a mensagem
- Envie lembretes se necessário
- Acompanhe respostas',
  'formularios',
  'envio',
  -18
);

-- FAQ 29: Como visualizar respostas
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como visualizar as respostas do formulário?',
  ARRAY['visualizar', 'respostas', 'formulario', 'ver'],
  '📌 COMO VISUALIZAR RESPOSTAS DO FORMULÁRIO

📝 PASSO A PASSO:

Passo 1: Acessar formulário
   → "Formulários" > Abra formulário
   → Veja número de respostas

Passo 2: Ver respostas
   → Clique em "Ver Respostas"
   → Ou "Respostas" no menu
   → Lista de todas as respostas

Passo 3: Visualizar individual
   → Clique em uma resposta
   → Veja todos os campos preenchidos
   → Data e hora do envio

Passo 4: Exportar (se disponível)
   → Clique em "Exportar"
   → Escolha formato (CSV, Excel)
   → Baixe arquivo

💡 DICAS:
- Organize por data
- Filtre se necessário
- Exporte para análise',
  'formularios',
  'respostas',
  -19
);

-- FAQ 30: Como exportar respostas
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como exportar as respostas do formulário?',
  ARRAY['exportar', 'respostas', 'formulario', 'excel', 'csv'],
  '📌 COMO EXPORTAR RESPOSTAS DO FORMULÁRIO

📝 PASSO A PASSO:

Passo 1: Acessar respostas
   → "Formulários" > Abra formulário
   → Clique em "Respostas"

Passo 2: Exportar
   → Clique em "Exportar" ou "Download"
   → Escolha formato:
   - CSV (para Excel/Google Sheets)
   - Excel (formato .xlsx)

Passo 3: Baixar
   → Arquivo será baixado
   → Abra no Excel ou similar
   → Cada linha = uma resposta

Passo 4: Analisar
   → Use filtros no Excel
   → Crie gráficos
   → Analise dados

💡 DICAS:
- Exporte regularmente
- Faça backup dos dados
- Use para análises

⚠️ NOTA:
- Se não houver botão exportar, entre em contato com suporte
- Funcionalidade pode estar em desenvolvimento',
  'formularios',
  'respostas',
  -20
);

-- =====================================================
-- CLIENTES E LEADS (FAQs 31-40)
-- =====================================================

-- FAQ 31: Como filtrar leads por data
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como filtrar leads por data?',
  ARRAY['filtrar', 'leads', 'data', 'periodo', 'filtro'],
  '📌 COMO FILTRAR LEADS POR DATA

📝 PASSO A PASSO:

Passo 1: Acessar leads
   → Menu "Leads"
   → Você verá lista de leads

Passo 2: Usar filtros
   → Procure seção "Filtros"
   → Ou ícone de filtro
   → Clique para abrir

Passo 3: Selecionar período
   → Escolha: "Hoje", "Últimos 7 dias", "Últimos 30 dias"
   → Ou selecione data específica
   → Ou intervalo personalizado

Passo 4: Aplicar filtro
   → Clique em "Aplicar" ou "Filtrar"
   → Lista será atualizada
   → Apenas leads do período aparecem

Passo 5: Limpar filtro
   → Clique em "Limpar" ou "Todos"
   → Volta a mostrar todos

💡 DICAS:
- Use para análises periódicas
- Compare períodos diferentes
- Exporte dados filtrados',
  'clientes',
  'leads',
  -21
);

-- FAQ 32: Como filtrar leads por ferramenta
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como filtrar leads por ferramenta que os gerou?',
  ARRAY['filtrar', 'leads', 'ferramenta', 'origem'],
  '📌 COMO FILTRAR LEADS POR FERRAMENTA

📝 PASSO A PASSO:

Passo 1: Acessar leads
   → Menu "Leads"
   → Abra filtros

Passo 2: Filtrar por ferramenta
   → Encontre filtro "Ferramenta" ou "Origem"
   → Selecione ferramenta específica
   → Ex: "Calculadora de IMC"

Passo 3: Aplicar
   → Clique em "Aplicar"
   → Veja apenas leads dessa ferramenta

Passo 4: Múltiplos filtros
   → Combine com filtro de data
   → Veja leads de ferramenta X no período Y
   → Análise mais precisa

💡 DICAS:
- Identifique ferramentas mais eficazes
- Compare performance
- Otimize estratégias',
  'clientes',
  'leads',
  -22
);

-- FAQ 33: Como buscar lead específico
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como buscar um lead específico?',
  ARRAY['buscar', 'lead', 'especifico', 'procurar', 'pesquisar'],
  '📌 COMO BUSCAR LEAD ESPECÍFICO

📝 PASSO A PASSO:

Passo 1: Acessar leads
   → Menu "Leads"
   → Procure barra de busca

Passo 2: Buscar
   → Digite nome, email ou telefone
   → Sistema busca em tempo real
   → Resultados aparecem automaticamente

Passo 3: Filtrar resultados
   → Use filtros adicionais se necessário
   → Combine busca com filtros
   → Encontre lead rapidamente

Passo 4: Abrir lead
   → Clique no lead encontrado
   → Veja todas as informações
   → Converta se desejar

💡 DICAS:
- Busca funciona por nome parcial
- Email e telefone também funcionam
- Use para encontrar rapidamente',
  'clientes',
  'leads',
  -23
);

-- FAQ 34: Como exportar lista de leads
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como exportar minha lista de leads?',
  ARRAY['exportar', 'leads', 'lista', 'excel', 'csv'],
  '📌 COMO EXPORTAR LISTA DE LEADS

📝 PASSO A PASSO:

Passo 1: Acessar leads
   → Menu "Leads"
   → Veja todos os leads

Passo 2: Aplicar filtros (opcional)
   → Filtre por data ou ferramenta
   → Exporte apenas o que precisa

Passo 3: Exportar
   → Clique em "Exportar" ou "Download"
   → Escolha formato: CSV ou Excel
   → Arquivo será baixado

Passo 4: Abrir arquivo
   → Abra no Excel ou Google Sheets
   → Cada linha = um lead
   → Colunas: nome, email, telefone, data, origem

💡 DICAS:
- Exporte regularmente para backup
- Use para análises externas
- Importe em outros sistemas se necessário

⚠️ NOTA:
- Se não houver botão exportar, entre em contato com suporte',
  'clientes',
  'leads',
  -24
);

-- FAQ 35: Como converter lead em cliente
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como converter um lead em cliente?',
  ARRAY['converter', 'lead', 'cliente', 'transformar'],
  '📌 COMO CONVERTER LEAD EM CLIENTE

📝 PASSO A PASSO:

Passo 1: Abrir lead
   → Menu "Leads" > Clique no lead
   → Veja informações completas

Passo 2: Converter
   → Clique em "Converter em Cliente"
   → Ou botão "Adicionar como Cliente"
   → Confirme ação

Passo 3: Completar informações
   → Sistema pede dados adicionais (se necessário)
   → Preencha informações complementares
   → Salve

Passo 4: Verificar
   → Lead desaparece da lista de leads
   → Aparece na lista de clientes
   → Histórico é mantido

Passo 5: Gerenciar cliente
   → Acesse "Clientes" no menu
   → Encontre cliente convertido
   → Comece acompanhamento

💡 DICAS:
- Converta rapidamente após contato
- Complete informações ao converter
- Organize em Kanban depois

⚠️ IMPORTANTE:
- Conversão não pode ser desfeita facilmente
- Confirme antes de converter',
  'clientes',
  'conversao',
  -25
);

-- Continuando com mais FAQs no próximo arquivo...


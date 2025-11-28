-- =====================================================
-- YLADA - FAQs ESSENCIAIS ÁREA NUTRI - LOTE 7 (FAQs 96-110)
-- Continuando após os 95 FAQs anteriores
-- =====================================================

-- =====================================================
-- SEGURANÇA (FAQs 96-99)
-- =====================================================

-- FAQ 96: Como alterar minha senha
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como alterar minha senha?',
  ARRAY['alterar', 'senha', 'mudar', 'trocar', 'password', 'seguranca'],
  '📌 COMO ALTERAR MINHA SENHA

📝 PASSO A PASSO:

Passo 1: Acessar configurações
   → Clique no seu nome ou avatar
   → Menu "Perfil" ou "Configurações"
   → Abra "Configurações de Conta" ou "Segurança"

Passo 2: Encontrar opção de senha
   → Procure "Alterar Senha" ou "Senha"
   → Ou "Segurança" → "Alterar Senha"
   → Clique na opção

Passo 3: Digitar senha atual
   → Digite sua senha atual
   → Necessário para confirmar identidade
   → Verificação de segurança

Passo 4: Digitar nova senha
   → Digite nova senha desejada
   → Confirme nova senha
   → Verifique se ambas são iguais

Passo 5: Verificar requisitos
   → Senha deve ter mínimo de caracteres (geralmente 8+)
   → Deve conter letras e números (se exigido)
   → Pode precisar de caracteres especiais
   → Sistema mostrará requisitos

Passo 6: Salvar alteração
   → Revise se senha está correta
   → Clique em "Salvar" ou "Alterar Senha"
   → Senha será atualizada

Passo 7: Confirmar (se necessário)
   → Sistema pode pedir confirmação
   → Verifique email se solicitado
   → Confirme alteração

Passo 8: Fazer login novamente
   → Pode precisar fazer login novamente
   → Use nova senha
   → Confirme que funciona

💡 DICAS:
- Use senha forte e segura
- Combine letras, números e símbolos
- Não use senhas óbvias
- Anote em local seguro

⚠️ IMPORTANTE:
- Senha atual é necessária
- Nova senha deve atender requisitos
- Alteração é imediata
- Faça login novamente se necessário',
  'configuracoes',
  'seguranca',
  -86
);

-- FAQ 97: Como recuperar senha esquecida
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como recuperar minha senha esquecida?',
  ARRAY['recuperar', 'senha', 'esquecida', 'esqueci', 'reset', 'redefinir'],
  '📌 COMO RECUPERAR SENHA ESQUECIDA

📝 PASSO A PASSO:

Passo 1: Acessar página de login
   → Vá para página de login
   → Clique em "Esqueci minha senha"
   → Ou "Recuperar senha"

Passo 2: Informar email
   → Digite email da sua conta
   → Use email cadastrado
   → Clique em "Enviar" ou "Recuperar"

Passo 3: Verificar email
   → Acesse sua caixa de entrada
   → Procure email de recuperação
   → Pode estar em spam/lixo eletrônico
   → Aguarde alguns minutos se não chegar

Passo 4: Abrir email
   → Clique no email recebido
   → Leia instruções
   → Clique no link de recuperação

Passo 5: Redefinir senha
   → Link abrirá página de redefinição
   → Digite nova senha
   → Confirme nova senha
   → Verifique requisitos

Passo 6: Salvar nova senha
   → Revise se senha está correta
   → Clique em "Salvar" ou "Redefinir"
   → Senha será atualizada

Passo 7: Fazer login
   → Volte para página de login
   → Use email e nova senha
   → Faça login normalmente

💡 DICAS:
- Verifique spam se não receber email
- Link de recuperação expira (geralmente 1 hora)
- Use senha forte na redefinição
- Anote nova senha em local seguro

⚠️ IMPORTANTE:
- Email deve estar correto
- Link expira após algum tempo
- Use link apenas uma vez
- Se não receber, verifique spam

🔧 SE NÃO RECEBER EMAIL:
- Verifique spam/lixo eletrônico
- Aguarde alguns minutos
- Verifique se email está correto
- Entre em contato com suporte',
  'configuracoes',
  'seguranca',
  -87
);

-- =====================================================
-- RELATÓRIOS E ANALYTICS (FAQs 100-105)
-- =====================================================

-- FAQ 98: Como filtrar relatórios por período
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como filtrar relatórios por período?',
  ARRAY['filtrar', 'relatorios', 'periodo', 'data', 'tempo', 'intervalo'],
  '📌 COMO FILTRAR RELATÓRIOS POR PERÍODO

📝 PASSO A PASSO:

Passo 1: Acessar relatórios
   → Menu "Relatórios" ou "Analytics"
   → Clique em "Relatórios"
   → Página de relatórios aparecerá

Passo 2: Abrir filtros
   → Clique em "Filtros" ou ícone de filtro
   → Ou use dropdown "Período"
   → Opções de filtro aparecerão

Passo 3: Selecionar período pré-definido
   → Hoje: apenas dados de hoje
   → Últimos 7 dias: semana atual
   → Últimos 30 dias: mês atual
   → Últimos 90 dias: trimestre
   → Último mês: mês anterior completo
   → Último ano: ano anterior

Passo 4: Selecionar período personalizado
   → Clique em "Personalizado" ou "Customizado"
   → Escolha data inicial
   → Escolha data final
   → Defina intervalo desejado

Passo 5: Aplicar filtro
   → Revise período selecionado
   → Clique em "Aplicar" ou "Filtrar"
   → Relatórios serão atualizados

Passo 6: Ver resultados
   → Dados do período aparecerão
   → Gráficos serão atualizados
   → Estatísticas refletirão período
   → Comparações serão ajustadas

Passo 7: Comparar períodos (se disponível)
   → Selecione "Comparar com período anterior"
   → Veja evolução
   → Analise crescimento
   → Identifique tendências

Passo 8: Exportar período filtrado
   → Exporte relatórios do período
   → Dados filtrados serão exportados
   → Use para análises externas

💡 DICAS:
- Use períodos consistentes para comparação
- Compare períodos similares
- Filtre para análises específicas
- Exporte para análises detalhadas

⚠️ IMPORTANTE:
- Filtros afetam todos os relatórios
- Dados são atualizados em tempo real
- Períodos podem ser salvos (se disponível)
- Filtros podem ser combinados',
  'relatorios',
  'filtros',
  -88
);

-- FAQ 99: Como ver qual ferramenta gera mais leads
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como ver qual ferramenta gera mais leads?',
  ARRAY['ferramenta', 'leads', 'gerar', 'mais', 'comparar', 'analise'],
  '📌 COMO VER QUAL FERRAMENTA GERA MAIS LEADS

📝 PASSO A PASSO:

Passo 1: Acessar relatórios
   → Menu "Relatórios" ou "Analytics"
   → Clique em "Relatórios de Leads"
   → Ou "Performance de Ferramentas"

Passo 2: Ver visão geral
   → Veja lista de todas as ferramentas
   → Cada ferramenta mostra quantidade de leads
   → Organizadas por quantidade (maior primeiro)

Passo 3: Analisar gráfico (se disponível)
   → Gráfico de barras mostra comparação
   → Altura da barra = quantidade de leads
   → Facilita visualização rápida
   → Identifique líderes rapidamente

Passo 4: Ver detalhes por ferramenta
   → Clique em uma ferramenta
   → Veja estatísticas detalhadas
   → Quantidade total de leads
   → Taxa de conversão
   → Período de análise

Passo 5: Filtrar por período
   → Selecione período desejado
   → Veja performance no período
   → Compare diferentes períodos
   → Identifique tendências

Passo 6: Comparar ferramentas
   → Selecione múltiplas ferramentas
   → Compare lado a lado
   → Veja diferenças
   → Identifique padrões

Passo 7: Exportar dados
   → Exporte relatório completo
   → Analise em planilha
   → Faça análises mais profundas
   → Crie gráficos personalizados

Passo 8: Aplicar insights
   → Identifique ferramentas mais eficazes
   → Foque em melhorar as que funcionam
   → Otimize estratégia
   → Aumente performance

💡 DICAS:
- Analise regularmente
- Compare diferentes períodos
- Identifique padrões
- Use dados para tomar decisões

⚠️ IMPORTANTE:
- Dados são atualizados em tempo real
- Performance pode variar por período
- Considere contexto ao analisar
- Combine com outras métricas',
  'relatorios',
  'analise',
  -89
);

-- FAQ 100: Como acessar relatórios de gestão
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como acessar relatórios de gestão?',
  ARRAY['acessar', 'relatorios', 'gestao', 'gerenciamento', 'dashboard'],
  '📌 COMO ACESSAR RELATÓRIOS DE GESTÃO

📝 PASSO A PASSO:

Passo 1: Acessar menu principal
   → Menu lateral ou superior
   → Procure "Relatórios" ou "Analytics"
   → Ou "Dashboard" ou "Gestão"

Passo 2: Navegar para relatórios
   → Clique em "Relatórios de Gestão"
   → Ou "Relatórios Completos"
   → Página de relatórios aparecerá

Passo 3: Ver dashboard principal
   → Visão geral de todas as métricas
   → Gráficos principais
   → Estatísticas resumidas
   → Indicadores-chave

Passo 4: Explorar seções
   → Relatórios de Leads
   → Relatórios de Conversão
   → Relatórios de Ferramentas
   → Relatórios de Clientes
   → Relatórios Financeiros (se disponível)

Passo 5: Acessar relatório específico
   → Clique no relatório desejado
   → Abra em nova página ou aba
   → Veja detalhes completos
   → Analise dados específicos

Passo 6: Usar filtros
   → Aplique filtros de período
   → Filtre por ferramenta
   → Filtre por categoria
   → Personalize visualização

Passo 7: Exportar relatórios
   → Clique em "Exportar"
   → Escolha formato (PDF, Excel, CSV)
   → Baixe relatório
   → Use para análises externas

Passo 8: Agendar relatórios (se disponível)
   → Configure envio automático
   → Receba por email regularmente
   → Mantenha-se atualizado
   → Economize tempo

💡 DICAS:
- Acesse regularmente para acompanhar
- Use filtros para análises específicas
- Exporte para análises detalhadas
- Compare períodos para ver evolução

⚠️ IMPORTANTE:
- Relatórios são atualizados em tempo real
- Dados são precisos e confiáveis
- Use para tomar decisões informadas
- Mantenha histórico para comparação',
  'relatorios',
  'acesso',
  -90
);

-- FAQ 101: Como interpretar gráficos de conversão
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como interpretar gráficos de conversão?',
  ARRAY['interpretar', 'graficos', 'conversao', 'analisar', 'entender', 'ler'],
  '📌 COMO INTERPRETAR GRÁFICOS DE CONVERSÃO

🎯 ENTENDENDO OS GRÁFICOS:

1. GRÁFICO DE LINHA (Tendência)
   → Mostra evolução ao longo do tempo
   → Linha subindo = crescimento
   → Linha descendo = queda
   → Identifique tendências

2. GRÁFICO DE BARRAS (Comparação)
   → Compara diferentes categorias
   → Barra maior = maior quantidade
   → Facilita comparação visual
   → Identifique líderes

3. GRÁFICO DE PIZZA (Proporção)
   → Mostra distribuição percentual
   → Fatia maior = maior participação
   → Veja proporções relativas
   → Entenda distribuição

📝 COMO INTERPRETAR:

1. TAXA DE CONVERSÃO
   → Percentual de leads que viram clientes
   → Fórmula: (Clientes / Leads) × 100
   → Maior = melhor
   → Exemplo: 30% = 30 de cada 100 leads

2. TENDÊNCIA TEMPORAL
   → Veja se está crescendo ou caindo
   → Compare períodos
   → Identifique sazonalidade
   → Planeje estratégias

3. COMPARAÇÃO ENTRE FERRAMENTAS
   → Veja qual converte melhor
   → Identifique padrões
   → Foque no que funciona
   → Otimize estratégia

4. FUNIL DE CONVERSÃO
   → Veja cada etapa do funil
   → Identifique gargalos
   → Veja onde perde leads
   → Otimize pontos críticos

💡 DICAS:
- Compare períodos similares
- Considere contexto externo
- Analise tendências, não apenas números
- Use para tomar decisões

⚠️ IMPORTANTE:
- Gráficos mostram dados reais
- Interprete com contexto
- Considere múltiplas métricas
- Use para melhorar performance',
  'relatorios',
  'analise',
  -91
);

-- FAQ 102: Como exportar relatórios
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como exportar relatórios?',
  ARRAY['exportar', 'relatorios', 'baixar', 'download', 'csv', 'excel', 'pdf'],
  '📌 COMO EXPORTAR RELATÓRIOS

📝 PASSO A PASSO:

Passo 1: Acessar relatório
   → Menu "Relatórios"
   → Abra o relatório desejado
   → Ou visualize no dashboard

Passo 2: Aplicar filtros (opcional)
   → Filtre por período
   → Filtre por categoria
   → Personalize dados
   → Apenas dados filtrados serão exportados

Passo 3: Abrir opções de exportação
   → Clique em "Exportar" ou ícone de download
   → Menu de opções aparecerá
   → Escolha formato desejado

Passo 4: Escolher formato
   → CSV: Para Excel, Google Sheets (recomendado)
   → Excel: Arquivo .xlsx completo
   → PDF: Relatório formatado para impressão
   → JSON: Para análises técnicas (se disponível)

Passo 5: Configurar exportação
   → Selecione quais dados incluir
   → Escolha período (se não filtrado)
   → Inclua/exclua colunas específicas
   → Configure formatação

Passo 6: Exportar
   → Clique em "Exportar" ou "Baixar"
   → Arquivo será gerado
   → Download iniciará automaticamente

Passo 7: Abrir arquivo
   → Arquivo será salvo em "Downloads"
   → Abra com programa apropriado
   → Excel para .xlsx, planilha para .csv
   → Visualizador PDF para .pdf

Passo 8: Analisar dados
   → Use em análises externas
   → Crie gráficos personalizados
   → Faça cálculos adicionais
   → Compartilhe com equipe

💡 DICAS:
- CSV é universal e funciona em qualquer planilha
- Excel mantém formatação melhor
- PDF é bom para apresentações
- Exporte regularmente para backup

⚠️ IMPORTANTE:
- Exportação inclui apenas dados visíveis (filtrados)
- Dados são exportados como estão
- Mantenha arquivos seguros
- Respeite privacidade e LGPD',
  'relatorios',
  'exportacao',
  -92
);

-- =====================================================
-- CURSOS E EDUCAÇÃO (FAQs 103-110)
-- =====================================================

-- FAQ 103: Como acessar a biblioteca de cursos
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como acessar a biblioteca de cursos?',
  ARRAY['acessar', 'biblioteca', 'cursos', 'educacao', 'aprendizado'],
  '📌 COMO ACESSAR BIBLIOTECA DE CURSOS

📝 PASSO A PASSO:

Passo 1: Acessar menu principal
   → Menu lateral ou superior
   → Procure "Cursos" ou "Educação"
   → Ou "Biblioteca" ou "Aprendizado"

Passo 2: Navegar para cursos
   → Clique em "Biblioteca de Cursos"
   → Ou "Cursos Disponíveis"
   → Página de cursos aparecerá

Passo 3: Explorar categorias
   → Veja categorias disponíveis
   → Exemplos: "Nutrição", "Marketing", "Gestão"
   → Clique em categoria de interesse
   → Veja cursos da categoria

Passo 4: Buscar cursos
   → Use barra de busca
   → Digite palavra-chave
   → Exemplos: "leads", "ferramentas", "nutrição"
   → Resultados aparecerão

Passo 5: Filtrar cursos
   → Filtre por nível (iniciante, intermediário, avançado)
   → Filtre por duração
   → Filtre por formato (vídeo, texto, interativo)
   → Personalize busca

Passo 6: Ver detalhes do curso
   → Clique em um curso
   → Veja descrição completa
   → Veja conteúdo programático
   → Veja duração e formato

Passo 7: Iniciar curso
   → Clique em "Iniciar Curso" ou "Começar"
   → Curso será aberto
   → Comece aprendizado
   → Progresso será salvo

Passo 8: Acompanhar progresso
   → Veja cursos iniciados
   → Acompanhe conclusão
   → Continue de onde parou
   → Complete cursos

💡 DICAS:
- Explore diferentes categorias
- Use busca para encontrar específicos
- Filtre para encontrar o ideal
- Complete cursos para certificados

⚠️ IMPORTANTE:
- Biblioteca é atualizada regularmente
- Novos cursos são adicionados
- Progresso é salvo automaticamente
- Pode acessar a qualquer momento',
  'cursos',
  'acesso',
  -93
);

-- FAQ 104: Como navegar pelos cursos disponíveis
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como navegar pelos cursos disponíveis?',
  ARRAY['navegar', 'cursos', 'disponiveis', 'explorar', 'procurar'],
  '📌 COMO NAVEGAR PELOS CURSOS DISPONÍVEIS

📝 PASSO A PASSO:

Passo 1: Acessar biblioteca
   → Menu "Cursos" ou "Educação"
   → Clique em "Biblioteca de Cursos"
   → Página de cursos aparecerá

Passo 2: Usar categorias
   → Veja categorias no menu lateral
   → Exemplos: "Marketing", "Nutrição", "Tecnologia"
   → Clique em categoria
   → Veja cursos da categoria

Passo 3: Usar busca
   → Digite na barra de busca
   → Use palavras-chave
   → Exemplos: "leads", "conversão", "ferramentas"
   → Resultados aparecerão

Passo 4: Usar filtros
   → Filtre por nível de dificuldade
   → Filtre por duração
   → Filtre por formato
   → Filtre por status (novo, popular, recomendado)

Passo 5: Ordenar cursos
   → Ordene por relevância
   → Ordene por popularidade
   → Ordene por data (mais recente)
   → Ordene por duração

Passo 6: Ver prévia
   → Passe mouse sobre curso
   → Veja prévia rápida
   → Veja descrição resumida
   → Veja avaliações (se disponível)

Passo 7: Abrir curso
   → Clique no curso
   → Veja página completa
   → Leia descrição detalhada
   → Veja conteúdo programático

Passo 8: Adicionar aos favoritos (se disponível)
   → Marque como favorito
   → Salve para depois
   → Acesse facilmente
   → Organize seus cursos

💡 DICAS:
- Use múltiplos métodos de navegação
- Combine busca e filtros
- Explore categorias diferentes
- Salve cursos interessantes

⚠️ IMPORTANTE:
- Navegação é intuitiva
- Pode usar múltiplos métodos
- Filtros ajudam a encontrar específicos
- Explore para descobrir novos cursos',
  'cursos',
  'navegacao',
  -94
);

-- FAQ 105: Como acessar meus cursos
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como acessar meus cursos?',
  ARRAY['acessar', 'meus', 'cursos', 'iniciados', 'andamento'],
  '📌 COMO ACESSAR MEUS CURSOS

📝 PASSO A PASSO:

Passo 1: Acessar área pessoal
   → Menu "Cursos" ou "Educação"
   → Clique em "Meus Cursos"
   → Ou "Cursos Iniciados"
   → Página pessoal aparecerá

Passo 2: Ver cursos em andamento
   → Veja cursos que você iniciou
   → Organizados por progresso
   → Veja percentual concluído
   → Continue de onde parou

Passo 3: Ver cursos concluídos
   → Aba "Concluídos" ou "Finalizados"
   → Veja todos os cursos completos
   → Acesse certificados (se disponível)
   → Revise conteúdo

Passo 4: Ver cursos favoritos
   → Aba "Favoritos" ou "Salvos"
   → Veja cursos marcados
   → Acesse rapidamente
   → Organize seus interesses

Passo 5: Continuar curso
   → Clique em curso em andamento
   → Continue de onde parou
   → Progresso é salvo automaticamente
   → Não perde lugar

Passo 6: Ver progresso
   → Veja percentual de conclusão
   → Veja módulos completos
   → Veja tempo investido
   → Acompanhe evolução

Passo 7: Filtrar meus cursos
   → Filtre por status (andamento, concluído)
   → Filtre por categoria
   → Filtre por data
   → Organize visualização

Passo 8: Gerenciar cursos
   → Remova de favoritos se necessário
   → Reinicie curso se quiser
   → Acesse certificados
   → Organize aprendizado

💡 DICAS:
- Acesse regularmente para continuar
- Complete cursos para certificados
- Organize por interesse
- Acompanhe progresso

⚠️ IMPORTANTE:
- Progresso é salvo automaticamente
- Pode continuar a qualquer momento
- Cursos ficam disponíveis sempre
- Pode revisar conteúdo concluído',
  'cursos',
  'acesso',
  -95
);

-- FAQ 106: O que são microcursos
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'O que são microcursos?',
  ARRAY['microcursos', 'o que sao', 'explicacao', 'definicao', 'conceito'],
  '📌 O QUE SÃO MICROCURSOS

🎯 CONCEITO:
- Cursos curtos e focados
- Duração de minutos a poucas horas
- Conteúdo específico e objetivo
- Aprendizado rápido e prático

📝 CARACTERÍSTICAS:

1. DURAÇÃO CURTA
   → Geralmente 15 minutos a 2 horas
   → Pode completar rapidamente
   → Não exige muito tempo
   → Ideal para aprendizado rápido

2. FOCO ESPECÍFICO
   → Um tópico por microcurso
   → Conteúdo direto ao ponto
   → Sem informações desnecessárias
   → Aprendizado objetivo

3. FORMATO PRÁTICO
   → Exemplos práticos
   → Aplicação imediata
   → Dicas acionáveis
   → Resultados rápidos

4. FLEXIBILIDADE
   → Pode fazer no seu ritmo
   → Pausa e continua quando quiser
   → Acessa de qualquer lugar
   → Aprende quando tiver tempo

💡 VANTAGENS:
- Aprendizado rápido
- Não exige muito tempo
- Conteúdo prático e aplicável
- Ideal para atualização constante

⚠️ QUANDO USAR:
- Para aprender algo específico rapidamente
- Para atualizar conhecimentos
- Para complementar aprendizado
- Para resolver dúvidas pontuais

🎯 EXEMPLOS:
- "Como criar calculadora de IMC"
- "Como gerar mais leads"
- "Como usar QR codes"
- "Como interpretar relatórios"',
  'cursos',
  'microcursos',
  -96
);

-- FAQ 107: Como acessar microcursos
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como acessar microcursos?',
  ARRAY['acessar', 'microcursos', 'cursos', 'curtos'],
  '📌 COMO ACESSAR MICROCURSOS

📝 PASSO A PASSO:

Passo 1: Acessar biblioteca
   → Menu "Cursos" ou "Educação"
   → Clique em "Biblioteca de Cursos"
   → Página de cursos aparecerá

Passo 2: Filtrar por microcursos
   → Use filtro "Tipo de Curso"
   → Selecione "Microcursos"
   → Ou "Cursos Curtos"
   → Lista será filtrada

Passo 3: Ver seção específica (se disponível)
   → Procure seção "Microcursos"
   → Ou "Cursos Rápidos"
   → Clique na seção
   → Veja todos os microcursos

Passo 4: Buscar microcursos
   → Use barra de busca
   → Digite "microcurso" ou tema específico
   → Resultados aparecerão
   → Filtre por duração curta

Passo 5: Identificar microcursos
   → Veja duração (geralmente < 2 horas)
   → Veja badge "Microcurso" (se houver)
   → Leia descrição
   → Confirme que é microcurso

Passo 6: Abrir microcurso
   → Clique no microcurso desejado
   → Veja detalhes completos
   → Leia descrição
   → Veja duração e conteúdo

Passo 7: Iniciar microcurso
   → Clique em "Iniciar" ou "Começar"
   → Microcurso será aberto
   → Comece aprendizado
   → Complete rapidamente

Passo 8: Acompanhar progresso
   → Veja progresso em tempo real
   → Complete módulos
   → Finalize microcurso
   → Receba certificado (se disponível)

💡 DICAS:
- Microcursos são ideais para aprendizado rápido
- Complete vários em sequência
- Use para resolver dúvidas específicas
- Aproveite tempo livre

⚠️ IMPORTANTE:
- Microcursos são cursos completos
- Progresso é salvo automaticamente
- Pode pausar e continuar
- Ideal para aprendizado contínuo',
  'cursos',
  'microcursos',
  -97
);

-- FAQ 108: Como completar um microcurso
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como completar um microcurso?',
  ARRAY['completar', 'microcurso', 'finalizar', 'concluir', 'terminar'],
  '📌 COMO COMPLETAR UM MICROCURSO

📝 PASSO A PASSO:

Passo 1: Iniciar microcurso
   → Acesse microcurso desejado
   → Clique em "Iniciar" ou "Começar"
   → Microcurso será aberto

Passo 2: Assistir/ler conteúdo
   → Siga ordem dos módulos
   → Assista vídeos (se houver)
   → Leia textos
   → Complete atividades

Passo 3: Completar módulos
   → Complete cada módulo em ordem
   → Marque como concluído
   → Avance para próximo
   → Continue progresso

Passo 4: Fazer atividades (se houver)
   → Complete exercícios práticos
   → Responda perguntas
   → Faça atividades interativas
   → Aplique aprendizado

Passo 5: Verificar progresso
   → Veja percentual de conclusão
   → Confirme módulos completos
   → Veja o que falta
   → Continue até completar

Passo 6: Finalizar microcurso
   → Complete todos os módulos
   → Finalize todas as atividades
   → Revise se necessário
   → Clique em "Finalizar" ou "Concluir"

Passo 7: Receber certificado (se disponível)
   → Certificado será gerado
   → Baixe ou visualize
   → Compartilhe se desejar
   → Adicione ao perfil

Passo 8: Aplicar aprendizado
   → Use conhecimento adquirido
   → Aplique na prática
   → Melhore seus resultados
   → Continue aprendendo

💡 DICAS:
- Siga ordem dos módulos
- Complete atividades para fixar
- Revise se necessário
- Aplique aprendizado imediatamente

⚠️ IMPORTANTE:
- Progresso é salvo automaticamente
- Pode pausar e continuar depois
- Certificado confirma conclusão
- Aplicação prática é essencial',
  'cursos',
  'microcursos',
  -98
);

-- =====================================================
-- FIM DO LOTE 7 (FAQs 96-110)
-- =====================================================

-- NOTA: Para executar este script:
-- 1. Conecte-se ao Supabase
-- 2. Execute este arquivo (lote7)
-- 3. Verifique se todos foram inseridos corretamente
-- 4. Teste o sistema de busca de FAQs

-- Para verificar inserção:
-- SELECT COUNT(*) FROM faq_responses WHERE area = 'nutri';
-- SELECT categoria, COUNT(*) FROM faq_responses WHERE area = 'nutri' GROUP BY categoria;


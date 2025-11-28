-- =====================================================
-- YLADA - FAQs ESSENCIAIS ÁREA NUTRI - LOTE 9 FINAL (FAQs 126-141)
-- Finalizando os 141 FAQs essenciais
-- =====================================================

-- =====================================================
-- AGENDA E ACOMPANHAMENTO (FAQs 126-130)
-- =====================================================

-- FAQ 126: Como usar a agenda de consultas
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como usar a agenda de consultas?',
  ARRAY['usar', 'agenda', 'consultas', 'agendamento', 'calendario'],
  '📌 COMO USAR AGENDA DE CONSULTAS

📝 PASSO A PASSO:

Passo 1: Acessar agenda
   → Menu "Agenda" ou "Consultas"
   → Clique em "Agenda"
   → Calendário aparecerá

Passo 2: Visualizar agenda
   → Veja consultas agendadas
   → Organizadas por data e hora
   → Visualização mensal, semanal ou diária
   → Escolha visualização preferida

Passo 3: Navegar entre períodos
   → Use setas para mudar mês/semana
   → Ou clique em data específica
   → Veja consultas do período
   → Organize visualização

Passo 4: Agendar nova consulta
   → Clique em data/hora desejada
   → Ou clique em "Nova Consulta"
   → Formulário de agendamento aparecerá
   → Preencha informações

Passo 5: Gerenciar consultas
   → Clique em consulta existente
   → Edite informações
   → Reagende se necessário
   → Cancele se necessário

Passo 6: Filtrar consultas
   → Filtre por cliente
   → Filtre por status
   → Filtre por período
   → Personalize visualização

Passo 7: Receber lembretes (se disponível)
   → Configure lembretes automáticos
   → Receba notificações
   → Lembre clientes
   → Reduza faltas

Passo 8: Exportar agenda
   → Exporte agenda para calendário externo
   → Sincronize com Google Calendar
   → Use em outros sistemas
   → Mantenha organizado

💡 DICAS:
- Use agenda para organizar consultas
- Configure lembretes para reduzir faltas
- Mantenha agenda atualizada
- Exporte para sincronizar com outros calendários

⚠️ IMPORTANTE:
- Agenda ajuda a organizar trabalho
- Consultas são salvas automaticamente
- Pode editar e cancelar consultas
- Facilita gestão de tempo',
  'agenda',
  'uso',
  -116
);

-- FAQ 127: Como agendar consulta para cliente
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como agendar uma consulta para cliente?',
  ARRAY['agendar', 'consulta', 'cliente', 'marcar', 'criar'],
  '📌 COMO AGENDAR CONSULTA PARA CLIENTE

📝 PASSO A PASSO:

Passo 1: Acessar agenda
   → Menu "Agenda" ou "Consultas"
   → Clique em "Agenda"
   → Calendário aparecerá

Passo 2: Criar novo agendamento
   → Clique em data/hora desejada
   → Ou clique em "Nova Consulta" ou "+"
   → Formulário de agendamento aparecerá

Passo 3: Selecionar cliente
   → Digite nome do cliente
   → Ou selecione da lista
   → Se cliente novo, crie primeiro
   → Cliente será vinculado

Passo 4: Definir data e hora
   → Escolha data da consulta
   → Escolha horário
   → Verifique disponibilidade
   → Confirme data/hora

Passo 5: Adicionar informações
   → Tipo de consulta (se aplicável)
   → Observações ou notas
   → Duração estimada
   → Local da consulta (se aplicável)

Passo 6: Configurar lembretes (se disponível)
   → Configure lembrete para você
   → Configure lembrete para cliente
   → Defina quando enviar
   → Reduza faltas

Passo 7: Salvar agendamento
   → Revise todas as informações
   → Clique em "Salvar" ou "Agendar"
   → Consulta será agendada
   → Aparecerá na agenda

Passo 8: Confirmar com cliente
   → Envie confirmação para cliente
   → Por WhatsApp, email ou SMS
   → Informe data, hora e local
   → Confirme agendamento

💡 DICAS:
- Agende com antecedência
- Confirme com cliente
- Configure lembretes
- Mantenha agenda organizada

⚠️ IMPORTANTE:
- Cliente deve existir no sistema
- Verifique disponibilidade antes
- Salve todas as informações
- Confirme com cliente',
  'agenda',
  'agendamento',
  -117
);

-- FAQ 128: Como visualizar agenda
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como visualizar minha agenda?',
  ARRAY['visualizar', 'agenda', 'ver', 'consultas', 'calendario'],
  '📌 COMO VISUALIZAR AGENDA

📝 PASSO A PASSO:

Passo 1: Acessar agenda
   → Menu "Agenda" ou "Consultas"
   → Clique em "Agenda"
   → Calendário aparecerá

Passo 2: Escolher visualização
   → Visualização Mensal: veja mês completo
   → Visualização Semanal: veja semana
   → Visualização Diária: veja dia específico
   → Escolha visualização preferida

Passo 3: Navegar entre períodos
   → Use setas para mudar período
   → Ou clique em data específica
   → Veja consultas do período
   → Explore agenda

Passo 4: Ver detalhes das consultas
   → Clique em consulta
   → Veja informações completas
   → Cliente, data, hora, observações
   → Acesse detalhes

Passo 5: Filtrar visualização
   → Filtre por cliente
   → Filtre por status
   → Filtre por tipo de consulta
   → Personalize visualização

Passo 6: Buscar consultas
   → Use barra de busca
   → Busque por cliente
   → Busque por data
   → Encontre consultas específicas

Passo 7: Ver lista de consultas
   → Visualize em formato de lista
   → Veja todas as consultas
   → Organizadas por data
   → Facilita visualização

Passo 8: Exportar agenda
   → Exporte para PDF
   → Exporte para calendário externo
   → Sincronize com Google Calendar
   → Use em outros sistemas

💡 DICAS:
- Use visualização que preferir
- Filtre para encontrar específicas
- Exporte para uso externo
- Mantenha agenda organizada

⚠️ IMPORTANTE:
- Agenda é atualizada em tempo real
- Consultas aparecem imediatamente
- Pode visualizar de diferentes formas
- Facilita organização',
  'agenda',
  'visualizacao',
  -118
);

-- FAQ 129: Como adicionar evolução do cliente
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como adicionar evolução do cliente?',
  ARRAY['adicionar', 'evolucao', 'cliente', 'progresso', 'acompanhamento'],
  '📌 COMO ADICIONAR EVOLUÇÃO DO CLIENTE

📝 PASSO A PASSO:

Passo 1: Acessar cliente
   → Menu "Clientes"
   → Encontre cliente desejado
   → Clique no cliente
   → Abra perfil completo

Passo 2: Acessar evolução
   → Clique em "Evolução" ou "Acompanhamento"
   → Ou aba "Histórico"
   → Seção de evolução aparecerá

Passo 3: Adicionar registro
   → Clique em "Nova Evolução" ou "+"
   → Ou "Adicionar Registro"
   → Formulário de evolução aparecerá

Passo 4: Preencher dados
   → Data da avaliação
   → Peso atual
   → Medidas (circunferências)
   → Percentual de gordura (se disponível)
   → Massa muscular (se disponível)

Passo 5: Adicionar observações
   → Descreva evolução observada
   → Anote mudanças físicas
   → Registre feedback do cliente
   → Adicione informações relevantes

Passo 6: Adicionar fotos (se disponível)
   → Anexe fotos de evolução
   → Antes e depois
   → Documente visualmente
   → Acompanhe mudanças

Passo 7: Comparar com anterior
   → Veja registro anterior
   → Compare medidas
   → Veja progresso
   → Identifique mudanças

Passo 8: Salvar evolução
   → Revise todas as informações
   → Clique em "Salvar" ou "Registrar"
   → Evolução será salva
   → Aparecerá no histórico

💡 DICAS:
- Registre evolução regularmente
- Seja detalhado nas observações
- Compare com registros anteriores
- Use fotos para documentar

⚠️ IMPORTANTE:
- Histórico completo fica disponível
- Facilita acompanhamento contínuo
- Dados ajudam a ver progresso
- Pode exportar histórico se necessário',
  'clientes',
  'evolucao',
  -119
);

-- =====================================================
-- PROBLEMAS TÉCNICOS - SALVAMENTO (FAQs 130-133)
-- =====================================================

-- FAQ 130: Formulário não salva, o que fazer
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Formulário não salva, o que fazer?',
  ARRAY['formulario', 'nao', 'salva', 'problema', 'erro', 'solucao'],
  '📌 FORMULÁRIO NÃO SALVA - SOLUÇÕES

🔍 POSSÍVEIS CAUSAS E SOLUÇÕES:

1. CAMPOS OBRIGATÓRIOS
   → Problema: Campos obrigatórios não preenchidos
   → Solução: Preencha todos os campos marcados com *
   → Verifique mensagens de erro
   → Complete formulário

2. CONEXÃO COM INTERNET
   → Problema: Sem conexão ou conexão instável
   → Solução: Verifique conexão com internet
   → Recarregue página
   → Tente novamente

3. NAVEGADOR DESATUALIZADO
   → Problema: Navegador antigo ou incompatível
   → Solução: Atualize navegador
   → Use Chrome, Firefox ou Edge atualizado
   → Limpe cache do navegador

4. DADOS INVÁLIDOS
   → Problema: Formato de dados incorreto
   → Solução: Verifique formato dos dados
   → Email deve ter formato válido
   → Datas devem estar corretas
   → Números devem ser válidos

5. SESSÃO EXPIRADA
   → Problema: Sessão expirou
   → Solução: Faça login novamente
   → Recarregue página
   → Tente salvar novamente

6. LIMITE DE CARACTERES
   → Problema: Texto muito longo
   → Solução: Reduza tamanho do texto
   → Verifique limite de caracteres
   → Resuma se necessário

💡 DICAS:
- Verifique mensagens de erro na tela
- Preencha todos os campos obrigatórios
- Use navegador atualizado
- Mantenha conexão estável

⚠️ SE AINDA NÃO FUNCIONAR:
- Tente em outro navegador
- Limpe cache e cookies
- Desative extensões do navegador
- Entre em contato com suporte',
  'problemas-tecnicos',
  'salvamento',
  -120
);

-- FAQ 131: Ferramenta não salva, o que fazer
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Ferramenta não salva, o que fazer?',
  ARRAY['ferramenta', 'nao', 'salva', 'problema', 'erro', 'solucao'],
  '📌 FERRAMENTA NÃO SALVA - SOLUÇÕES

🔍 POSSÍVEIS CAUSAS E SOLUÇÕES:

1. CAMPOS OBRIGATÓRIOS
   → Problema: Informações obrigatórias faltando
   → Solução: Preencha nome da ferramenta
   → Selecione template
   → Complete campos obrigatórios

2. CONEXÃO COM INTERNET
   → Problema: Sem conexão ou instável
   → Solução: Verifique conexão
   → Aguarde alguns segundos
   → Tente salvar novamente

3. NAVEGADOR
   → Problema: Navegador com problemas
   → Solução: Atualize navegador
   → Limpe cache
   → Tente em outro navegador

4. DADOS INVÁLIDOS
   → Problema: Dados em formato incorreto
   → Solução: Verifique formato
   → URLs devem ser válidas
   → Cores devem estar corretas
   → Revise todos os campos

5. SESSÃO EXPIRADA
   → Problema: Login expirou
   → Solução: Faça login novamente
   → Recarregue página
   → Tente salvar

6. LIMITE DE FERRAMENTAS
   → Problema: Limite de ferramentas atingido
   → Solução: Verifique seu plano
   → Exclua ferramentas não usadas
   → Ou faça upgrade de plano

💡 DICAS:
- Verifique mensagens de erro
- Preencha todos os campos obrigatórios
- Use navegador atualizado
- Mantenha conexão estável

⚠️ SE AINDA NÃO FUNCIONAR:
- Tente em outro navegador
- Limpe cache e cookies
- Verifique se não há limite
- Entre em contato com suporte',
  'problemas-tecnicos',
  'salvamento',
  -121
);

-- FAQ 132: Cliente não salva, o que fazer
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Cliente não salva, o que fazer?',
  ARRAY['cliente', 'nao', 'salva', 'problema', 'erro', 'solucao'],
  '📌 CLIENTE NÃO SALVA - SOLUÇÕES

🔍 POSSÍVEIS CAUSAS E SOLUÇÕES:

1. NOME OBRIGATÓRIO
   → Problema: Nome não preenchido
   → Solução: Preencha nome do cliente (obrigatório)
   → Verifique se campo não está vazio
   → Complete informação

2. EMAIL DUPLICADO
   → Problema: Email já cadastrado
   → Solução: Use email diferente
   → Ou encontre cliente existente
   → Verifique se não é duplicata

3. CONEXÃO
   → Problema: Sem conexão
   → Solução: Verifique internet
   → Aguarde alguns segundos
   → Tente novamente

4. NAVEGADOR
   → Problema: Navegador com problemas
   → Solução: Atualize navegador
   → Limpe cache
   → Tente em outro navegador

5. DADOS INVÁLIDOS
   → Problema: Formato incorreto
   → Solução: Email deve ser válido
   → Telefone deve estar correto
   → Datas devem ser válidas

6. SESSÃO EXPIRADA
   → Problema: Login expirou
   → Solução: Faça login novamente
   → Recarregue página
   → Tente salvar

💡 DICAS:
- Nome é obrigatório
- Verifique se email não está duplicado
- Use navegador atualizado
- Mantenha conexão estável

⚠️ SE AINDA NÃO FUNCIONAR:
- Tente em outro navegador
- Limpe cache e cookies
- Verifique mensagens de erro
- Entre em contato com suporte',
  'problemas-tecnicos',
  'salvamento',
  -122
);

-- FAQ 133: Não consigo fazer login, o que fazer
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Não consigo fazer login, o que fazer?',
  ARRAY['nao', 'consigo', 'login', 'entrar', 'problema', 'solucao'],
  '📌 NÃO CONSIGO FAZER LOGIN - SOLUÇÕES

🔍 POSSÍVEIS CAUSAS E SOLUÇÕES:

1. SENHA INCORRETA
   → Problema: Senha digitada errada
   → Solução: Verifique se Caps Lock está desligado
   → Digite senha novamente com cuidado
   → Use "Mostrar senha" para verificar
   → Recupere senha se necessário

2. EMAIL INCORRETO
   → Problema: Email digitado errado
   → Solução: Verifique email digitado
   → Confirme se está correto
   → Verifique se não há espaços
   → Use email cadastrado

3. CONTA NÃO VERIFICADA
   → Problema: Email não verificado
   → Solução: Verifique email de confirmação
   → Clique no link de verificação
   → Complete cadastro
   → Tente login novamente

4. CONTA DESATIVADA
   → Problema: Conta pode estar desativada
   → Solução: Entre em contato com suporte
   → Verifique status da conta
   → Reative se necessário

5. NAVEGADOR
   → Problema: Navegador com problemas
   → Solução: Limpe cache e cookies
   → Tente em outro navegador
   → Atualize navegador
   → Use modo anônimo

6. CONEXÃO
   → Problema: Problema de conexão
   → Solução: Verifique internet
   → Recarregue página
   → Tente novamente

💡 DICAS:
- Verifique email e senha com cuidado
- Use "Recuperar senha" se necessário
- Limpe cache do navegador
- Tente em outro navegador

⚠️ SE AINDA NÃO FUNCIONAR:
- Recupere senha
- Verifique email de confirmação
- Entre em contato com suporte
- Forneça informações sobre o problema',
  'problemas-tecnicos',
  'acesso',
  -123
);

-- FAQ 134: Não recebo email de recuperação
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Não recebo email de recuperação, o que fazer?',
  ARRAY['nao', 'recebo', 'email', 'recuperacao', 'problema', 'solucao'],
  '📌 NÃO RECEBO EMAIL DE RECUPERAÇÃO - SOLUÇÕES

🔍 POSSÍVEIS CAUSAS E SOLUÇÕES:

1. CAIXA DE SPAM
   → Problema: Email foi para spam
   → Solução: Verifique pasta de spam/lixo eletrônico
   → Procure por emails do YLADA
   → Marque como "Não é spam"
   → Adicione remetente aos contatos

2. EMAIL INCORRETO
   → Problema: Email digitado errado
   → Solução: Verifique email digitado
   → Confirme se está correto
   → Use email cadastrado
   → Tente novamente

3. AGUARDAR ALGUNS MINUTOS
   → Problema: Email ainda não chegou
   → Solução: Aguarde 5-10 minutos
   → Emails podem demorar
   → Verifique novamente
   → Tente reenviar

4. FILTROS DE EMAIL
   → Problema: Filtros bloqueando
   → Solução: Verifique filtros de email
   → Adicione remetente à lista branca
   → Desative filtros temporariamente
   → Verifique configurações

5. SERVIDOR DE EMAIL
   → Problema: Problema no servidor
   → Solução: Tente reenviar email
   → Aguarde alguns minutos
   → Tente em outro horário
   → Entre em contato se persistir

6. EMAIL NÃO CADASTRADO
   → Problema: Email não está cadastrado
   → Solução: Verifique se email está correto
   → Use email que usou no cadastro
   → Ou crie nova conta

💡 DICAS:
- Sempre verifique spam primeiro
- Aguarde alguns minutos
- Verifique se email está correto
- Tente reenviar se necessário

⚠️ SE AINDA NÃO RECEBER:
- Verifique spam novamente
- Aguarde mais tempo
- Tente reenviar
- Entre em contato com suporte',
  'problemas-tecnicos',
  'acesso',
  -124
);

-- FAQ 135: Não consigo ver minhas ferramentas
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Não consigo ver minhas ferramentas, o que fazer?',
  ARRAY['nao', 'consigo', 'ver', 'ferramentas', 'problema', 'solucao'],
  '📌 NÃO CONSIGO VER FERRAMENTAS - SOLUÇÕES

🔍 POSSÍVEIS CAUSAS E SOLUÇÕES:

1. FILTROS ATIVOS
   → Problema: Filtros ocultando ferramentas
   → Solução: Remova todos os filtros
   → Clique em "Limpar Filtros"
   → Veja todas as ferramentas
   → Verifique se aparecem

2. BUSCA ATIVA
   → Problema: Busca muito específica
   → Solução: Limpe campo de busca
   → Remova termos de busca
   → Veja todas as ferramentas
   → Busque novamente se necessário

3. FERRAMENTAS INATIVAS
   → Problema: Ferramentas podem estar inativas
   → Solução: Verifique filtro de status
   → Mostre ferramentas inativas também
   → Ou ative ferramentas
   → Veja todas

4. NAVEGADOR
   → Problema: Navegador com problemas
   → Solução: Recarregue página (F5)
   → Limpe cache
   → Tente em outro navegador
   → Atualize navegador

5. CONEXÃO
   → Problema: Problema de conexão
   → Solução: Verifique internet
   → Aguarde carregamento
   → Recarregue página
   → Tente novamente

6. PERMISSÕES
   → Problema: Problema de permissões
   → Solução: Faça login novamente
   → Verifique se está logado
   → Confirme acesso à área
   → Entre em contato se necessário

💡 DICAS:
- Sempre verifique filtros primeiro
- Limpe busca
- Recarregue página
- Verifique se está logado

⚠️ SE AINDA NÃO VER:
- Limpe todos os filtros
- Recarregue página
- Tente em outro navegador
- Entre em contato com suporte',
  'problemas-tecnicos',
  'visualizacao',
  -125
);

-- FAQ 136: Leads não aparecem
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Leads não aparecem, o que fazer?',
  ARRAY['leads', 'nao', 'aparecem', 'problema', 'solucao'],
  '📌 LEADS NÃO APARECEM - SOLUÇÕES

🔍 POSSÍVEIS CAUSAS E SOLUÇÕES:

1. FILTROS ATIVOS
   → Problema: Filtros ocultando leads
   → Solução: Remova todos os filtros
   → Clique em "Limpar Filtros"
   → Veja todos os leads
   → Verifique se aparecem

2. PERÍODO FILTRADO
   → Problema: Período muito específico
   → Solução: Altere filtro de data
   → Escolha período maior
   → Ou remova filtro de data
   → Veja todos os leads

3. FERRAMENTA FILTRADA
   → Problema: Filtro por ferramenta
   → Solução: Remova filtro de ferramenta
   → Veja leads de todas as ferramentas
   → Ou selecione "Todas"
   → Verifique se aparecem

4. LEADS RECÉM-CRIADOS
   → Problema: Leads podem demorar para aparecer
   → Solução: Aguarde alguns segundos
   → Recarregue página
   → Verifique novamente
   → Pode levar alguns minutos

5. NAVEGADOR
   → Problema: Navegador com problemas
   → Solução: Recarregue página (F5)
   → Limpe cache
   → Tente em outro navegador
   → Atualize navegador

6. CONEXÃO
   → Problema: Problema de conexão
   → Solução: Verifique internet
   → Aguarde carregamento
   → Recarregue página
   → Tente novamente

💡 DICAS:
- Sempre verifique filtros primeiro
- Aguarde alguns segundos após criar lead
- Recarregue página
- Verifique período selecionado

⚠️ SE AINDA NÃO APARECER:
- Limpe todos os filtros
- Aguarde alguns minutos
- Recarregue página
- Entre em contato com suporte',
  'problemas-tecnicos',
  'visualizacao',
  -126
);

-- FAQ 137: Relatórios não carregam
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Relatórios não carregam, o que fazer?',
  ARRAY['relatorios', 'nao', 'carregam', 'problema', 'solucao'],
  '📌 RELATÓRIOS NÃO CARREGAM - SOLUÇÕES

🔍 POSSÍVEIS CAUSAS E SOLUÇÕES:

1. CONEXÃO LENTA
   → Problema: Internet lenta
   → Solução: Aguarde carregamento
   → Relatórios podem demorar
   → Seja paciente
   → Verifique conexão

2. MUITOS DADOS
   → Problema: Período muito grande
   → Solução: Reduza período do filtro
   → Escolha período menor
   → Menos dados = carrega mais rápido
   → Exporte se necessário

3. NAVEGADOR
   → Problema: Navegador com problemas
   → Solução: Recarregue página (F5)
   → Limpe cache
   → Tente em outro navegador
   → Atualize navegador

4. JAVASCRIPT DESABILITADO
   → Problema: JavaScript desabilitado
   → Solução: Habilite JavaScript
   → Verifique configurações
   → Necessário para funcionar
   → Recarregue página

5. EXTENSÕES DO NAVEGADOR
   → Problema: Extensões bloqueando
   → Solução: Desative extensões
   → Especialmente bloqueadores de anúncios
   → Tente em modo anônimo
   → Verifique se funciona

6. SERVIDOR
   → Problema: Problema no servidor
   → Solução: Aguarde alguns minutos
   → Tente novamente depois
   → Entre em contato se persistir
   → Pode ser temporário

💡 DICAS:
- Aguarde carregamento (pode demorar)
- Reduza período se muito grande
- Use navegador atualizado
- Limpe cache regularmente

⚠️ SE AINDA NÃO CARREGAR:
- Aguarde mais tempo
- Reduza período do filtro
- Tente em outro navegador
- Entre em contato com suporte',
  'problemas-tecnicos',
  'visualizacao',
  -127
);

-- FAQ 138: QR code não funciona
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'QR code não funciona, o que fazer?',
  ARRAY['qr', 'code', 'nao', 'funciona', 'problema', 'solucao'],
  '📌 QR CODE NÃO FUNCIONA - SOLUÇÕES

🔍 POSSÍVEIS CAUSAS E SOLUÇÕES:

1. QR CODE DANIFICADO
   → Problema: QR code borrado ou danificado
   → Solução: Gere novo QR code
   → Baixe novamente
   → Imprima em qualidade melhor
   → Use tamanho adequado

2. ILUMINAÇÃO
   → Problema: Pouca luz para escanear
   → Solução: Use em local bem iluminado
   → Evite sombras
   → Aponte câmera corretamente
   → Aguarde reconhecimento

3. DISTÂNCIA
   → Problema: Muito perto ou longe
   → Solução: Mantenha distância adequada
   → Não muito perto
   → Não muito longe
   → Ajuste distância

4. QUALIDADE DA IMPRESSÃO
   → Problema: Impressão de baixa qualidade
   → Solução: Imprima em alta qualidade
   → Use papel de boa qualidade
   → Tamanho adequado
   → Evite borrões

5. CÂMERA DO CELULAR
   → Problema: Câmera com problemas
   → Solução: Limpe lente da câmera
   → Use outro celular para testar
   → Verifique se câmera funciona
   → Atualize app de câmera

6. QR CODE DESATIVADO
   → Problema: QR code pode estar desativado
   → Solução: Verifique se ferramenta está ativa
   → Reative se necessário
   → Gere novo QR code
   → Teste novamente

💡 DICAS:
- Use QR code em boa qualidade
- Imprima em tamanho adequado
- Use em local bem iluminado
- Teste antes de usar em grande escala

⚠️ SE AINDA NÃO FUNCIONAR:
- Gere novo QR code
- Teste com outro celular
- Verifique se link funciona
- Entre em contato com suporte',
  'problemas-tecnicos',
  'funcionalidades',
  -128
);

-- FAQ 139: Link não abre
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Link não abre, o que fazer?',
  ARRAY['link', 'nao', 'abre', 'problema', 'solucao'],
  '📌 LINK NÃO ABRE - SOLUÇÕES

🔍 POSSÍVEIS CAUSAS E SOLUÇÕES:

1. FERRAMENTA DESATIVADA
   → Problema: Ferramenta pode estar inativa
   → Solução: Verifique status da ferramenta
   → Ative ferramenta se necessário
   → Link funcionará novamente
   → Teste link

2. LINK INCORRETO
   → Problema: Link copiado incorretamente
   → Solução: Copie link novamente
   → Verifique se está completo
   → Não deve ter espaços
   → Teste link completo

3. NAVEGADOR
   → Problema: Navegador com problemas
   → Solução: Tente em outro navegador
   → Limpe cache
   → Atualize navegador
   → Use modo anônimo

4. CONEXÃO
   → Problema: Sem conexão
   → Solução: Verifique internet
   → Aguarde alguns segundos
   → Tente novamente
   → Verifique conexão

5. LINK EXPIRADO (improvável)
   → Problema: Link pode ter expirado
   → Solução: Gere novo link
   → Links geralmente não expiram
   → Mas pode gerar novo
   → Teste novo link

6. BLOQUEADOR
   → Problema: Bloqueador de anúncios
   → Solução: Desative bloqueador
   → Adicione site à lista branca
   → Tente novamente
   → Verifique se funciona

💡 DICAS:
- Verifique se ferramenta está ativa
- Copie link completo e correto
- Tente em outro navegador
- Verifique conexão

⚠️ SE AINDA NÃO ABRIR:
- Verifique status da ferramenta
- Gere novo link
- Tente em outro dispositivo
- Entre em contato com suporte',
  'problemas-tecnicos',
  'funcionalidades',
  -129
);

-- FAQ 140: Short code não funciona
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Short code não funciona, o que fazer?',
  ARRAY['short', 'code', 'nao', 'funciona', 'problema', 'solucao'],
  '📌 SHORT CODE NÃO FUNCIONA - SOLUÇÕES

🔍 POSSÍVEIS CAUSAS E SOLUÇÕES:

1. CÓDIGO DIGITADO ERRADO
   → Problema: Código digitado incorretamente
   → Solução: Verifique código digitado
   → Confirme se está correto
   → Não deve ter espaços
   → Digite novamente

2. FERRAMENTA DESATIVADA
   → Problema: Ferramenta pode estar inativa
   → Solução: Verifique status da ferramenta
   → Ative ferramenta se necessário
   → Short code funcionará novamente
   → Teste código

3. SHORT CODE DESATIVADO
   → Problema: Short code pode estar desativado
   → Solução: Verifique configurações
   → Reative short code
   → Ou gere novo código
   → Teste novamente

4. NAVEGADOR
   → Problema: Navegador com problemas
   → Solução: Tente em outro navegador
   → Limpe cache
   → Atualize navegador
   → Use modo anônimo

5. CONEXÃO
   → Problema: Sem conexão
   → Solução: Verifique internet
   → Aguarde alguns segundos
   → Tente novamente
   → Verifique conexão

6. FORMATO INCORRETO
   → Problema: Código em formato errado
   → Solução: Use formato correto
   → ylada.app/seu-code
   → Não adicione espaços
   → Digite exatamente como está

💡 DICAS:
- Verifique se código está correto
- Confirme se ferramenta está ativa
- Use formato correto
- Tente em outro navegador

⚠️ SE AINDA NÃO FUNCIONAR:
- Verifique código digitado
- Confirme status da ferramenta
- Gere novo short code
- Entre em contato com suporte',
  'problemas-tecnicos',
  'funcionalidades',
  -130
);

-- FAQ 141: Como criar ticket de suporte
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como criar um ticket de suporte?',
  ARRAY['criar', 'ticket', 'suporte', 'ajuda', 'problema'],
  '📌 COMO CRIAR TICKET DE SUPORTE

📝 PASSO A PASSO:

Passo 1: Acessar suporte
   → Abra chat de suporte
   → Ou menu "Suporte" → "Criar Ticket"
   → Página de suporte aparecerá

Passo 2: Iniciar novo ticket
   → Clique em "Novo Ticket" ou "Criar Ticket"
   → Ou "Preciso de Ajuda"
   → Formulário de ticket aparecerá

Passo 3: Preencher informações
   → Assunto: resumo do problema
   → Categoria: escolha categoria
   → Descrição: descreva problema detalhadamente
   → Adicione todas as informações relevantes

Passo 4: Adicionar detalhes
   → O que aconteceu?
   → Quando aconteceu?
   → Onde aconteceu (qual página/funcionalidade)?
   → O que você esperava que acontecesse?
   → O que aconteceu de errado?

Passo 5: Anexar arquivos (se necessário)
   → Adicione prints da tela
   → Anexe arquivos relevantes
   → Adicione logs de erro (se houver)
   → Facilita diagnóstico

Passo 6: Prioridade (se disponível)
   → Escolha nível de urgência
   → Urgente: sistema não funciona
   → Normal: problema que pode esperar
   → Baixa: dúvida ou sugestão

Passo 7: Enviar ticket
   → Revise todas as informações
   → Clique em "Enviar" ou "Criar Ticket"
   → Ticket será criado
   → Receberá confirmação

Passo 8: Acompanhar ticket
   → Veja status do ticket
   → Receba atualizações por email
   → Responda se equipe pedir mais informações
   → Acompanhe resolução

💡 DICAS:
- Seja detalhado na descrição
- Inclua prints se possível
- Responda rapidamente se pedirem mais informações
- Seja paciente, equipe responderá

⚠️ IMPORTANTE:
- Tickets são priorizados por urgência
- Resposta pode levar algumas horas
- Forneça todas as informações solicitadas
- Acompanhe status do ticket',
  'suporte',
  'tickets',
  -131
);

-- =====================================================
-- FIM DO LOTE 9 - FINALIZAÇÃO DOS 141 FAQs ESSENCIAIS
-- =====================================================

-- NOTA: Para executar este script:
-- 1. Conecte-se ao Supabase
-- 2. Execute este arquivo (lote9)
-- 3. Verifique se todos foram inseridos corretamente
-- 4. Teste o sistema de busca de FAQs

-- Para verificar inserção:
-- SELECT COUNT(*) FROM faq_responses WHERE area = 'nutri';
-- SELECT categoria, COUNT(*) FROM faq_responses WHERE area = 'nutri' GROUP BY categoria;

-- 🎉 PARABÉNS! TODOS OS 141 FAQs ESSENCIAIS FORAM CRIADOS! 🎉


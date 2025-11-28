-- =====================================================
-- YLADA - FAQs ESSENCIAIS ÁREA NUTRI - LOTE 4 (FAQs 51-65)
-- Continuando após os 50 FAQs essenciais
-- =====================================================

-- =====================================================
-- FORMULÁRIOS (FAQs 51-58)
-- =====================================================

-- FAQ 51: Como usar formulários pré-montados
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como usar formulários pré-montados?',
  ARRAY['formulario', 'pre-montado', 'template', 'modelo', 'usar'],
  '📌 COMO USAR FORMULÁRIOS PRÉ-MONTADOS

🎯 O QUE VOCÊ VAI APRENDER:
- Como acessar formulários prontos
- Como escolher o formulário ideal
- Como personalizar formulário pré-montado
- Como usar formulário imediatamente

📝 PASSO A PASSO:

Passo 1: Acessar formulários
   → Menu "Formulários"
   → Clique em "Novo Formulário"
   → Escolha "Usar Template" ou "Formulário Pré-montado"

Passo 2: Escolher formulário
   → Veja lista de formulários disponíveis
   → Exemplos: "Anamnese Nutricional", "Avaliação Inicial", "Diário Alimentar"
   → Clique no formulário que deseja usar

Passo 3: Visualizar prévia
   → Veja todos os campos incluídos
   → Verifique se atende suas necessidades
   → Leia descrição do formulário

Passo 4: Personalizar (opcional)
   → Clique em "Personalizar"
   → Adicione ou remova campos
   → Altere textos e labels
   → Configure campos obrigatórios

Passo 5: Salvar e usar
   → Clique em "Usar Este Formulário"
   → Dê um nome ao seu formulário
   → Salve
   → Pronto para enviar aos clientes!

💡 DICAS:
- Formulários pré-montados economizam tempo
- Você pode personalizar depois
- Use como base e adapte às suas necessidades
- Teste antes de enviar aos clientes

⚠️ IMPORTANTE:
- Formulários pré-montados são templates
- Você pode editar tudo depois de criar
- Cada formulário é único para você',
  'formularios',
  'criacao',
  -41
);

-- FAQ 52: Como editar formulário existente
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como editar um formulário existente?',
  ARRAY['editar', 'formulario', 'modificar', 'alterar', 'atualizar'],
  '📌 COMO EDITAR FORMULÁRIO EXISTENTE

📝 PASSO A PASSO:

Passo 1: Acessar formulários
   → Menu "Formulários"
   → Encontre o formulário que deseja editar
   → Clique no formulário

Passo 2: Abrir edição
   → Clique no botão "Editar" (ícone de lápis)
   → Ou clique nos três pontos (...) → "Editar"

Passo 3: Editar informações básicas
   → Altere nome do formulário (se necessário)
   → Modifique descrição
   → Atualize instruções

Passo 4: Editar campos
   → Clique no campo que deseja editar
   → Altere label (nome do campo)
   → Modifique placeholder (texto de exemplo)
   → Altere tipo de campo (se necessário)
   → Configure obrigatoriedade

Passo 5: Adicionar campos
   → Clique em "Adicionar Campo"
   → Escolha tipo de campo
   → Configure o novo campo
   → Salve

Passo 6: Remover campos
   → Clique no campo
   → Clique em "Remover" ou ícone de lixeira
   → Confirme remoção

Passo 7: Reordenar campos
   → Arraste campos para nova posição
   → Organize na ordem desejada
   → Salve alterações

Passo 8: Salvar
   → Revise todas as alterações
   → Clique em "Salvar"
   → Confirme que foi salvo

💡 DICAS:
- Salve frequentemente durante edição
- Teste formulário após editar
- Campos já respondidos não são afetados
- Alterações afetam apenas novos envios

⚠️ IMPORTANTE:
- Não é possível editar respostas já recebidas
- Alterações em campos podem afetar formulários enviados
- Sempre teste antes de enviar novamente',
  'formularios',
  'edicao',
  -42
);

-- FAQ 53: Como duplicar um formulário
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como duplicar um formulário?',
  ARRAY['duplicar', 'copiar', 'formulario', 'replicar', 'clonar'],
  '📌 COMO DUPLICAR FORMULÁRIO

📝 PASSO A PASSO:

Passo 1: Acessar formulários
   → Menu "Formulários"
   → Encontre o formulário que deseja duplicar

Passo 2: Abrir opções
   → Clique nos três pontos (...) ao lado do formulário
   → Ou clique com botão direito no formulário

Passo 3: Duplicar
   → Clique em "Duplicar" ou "Copiar"
   → Aguarde processamento

Passo 4: Configurar cópia
   → Um novo formulário será criado
   → Nome será: "[Nome Original] - Cópia"
   → Todos os campos serão copiados

Passo 5: Personalizar cópia
   → Edite o nome (se necessário)
   → Faça alterações desejadas
   → Salve

💡 DICAS:
- Use para criar variações de formulários
- Economiza tempo ao criar formulários similares
- Cópia é independente do original
- Pode editar sem afetar original

⚠️ IMPORTANTE:
- Respostas não são copiadas
- Apenas estrutura do formulário é copiada
- Cópia é totalmente independente',
  'formularios',
  'criacao',
  -43
);

-- FAQ 54: Como excluir um formulário
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como excluir um formulário?',
  ARRAY['excluir', 'deletar', 'remover', 'formulario', 'apagar'],
  '📌 COMO EXCLUIR FORMULÁRIO

📝 PASSO A PASSO:

Passo 1: Acessar formulários
   → Menu "Formulários"
   → Encontre o formulário que deseja excluir

Passo 2: Abrir opções
   → Clique nos três pontos (...) ao lado do formulário
   → Ou clique com botão direito no formulário

Passo 3: Excluir
   → Clique em "Excluir" ou "Remover"
   → Confirme exclusão

Passo 4: Confirmar
   → Leia aviso de confirmação
   → Digite "EXCLUIR" ou confirme
   → Clique em "Confirmar Exclusão"

Passo 5: Verificar
   → Formulário será removido da lista
   → Não aparecerá mais em "Formulários"

💡 DICAS:
- Exclusão é permanente
- Não é possível desfazer
- Considere arquivar em vez de excluir
- Verifique se não está em uso antes de excluir

⚠️ IMPORTANTE:
- Respostas recebidas são mantidas
- Formulários enviados continuam funcionando
- Exclusão remove apenas o formulário
- Não afeta dados já coletados',
  'formularios',
  'gerenciamento',
  -44
);

-- FAQ 55: Como adicionar campos ao formulário
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como adicionar campos ao formulário?',
  ARRAY['adicionar', 'campo', 'formulario', 'criar', 'novo'],
  '📌 COMO ADICIONAR CAMPOS AO FORMULÁRIO

📝 PASSO A PASSO:

Passo 1: Editar formulário
   → Abra o formulário
   → Clique em "Editar"

Passo 2: Adicionar campo
   → Clique em "Adicionar Campo" ou botão "+"
   → Escolha tipo de campo desejado

Passo 3: Escolher tipo de campo
   → Texto: para respostas curtas
   → Texto Longo: para respostas extensas
   → Número: para valores numéricos
   → Data: para datas
   → Seleção Única: escolha uma opção
   → Seleção Múltipla: escolha várias opções
   → Sim/Não: resposta binária
   → Email: validação de email
   → Telefone: validação de telefone

Passo 4: Configurar campo
   → Digite label (nome do campo)
   → Adicione placeholder (texto de exemplo)
   → Configure se é obrigatório
   → Adicione ajuda/instruções (opcional)

Passo 5: Configurar opções (se aplicável)
   → Para campos de seleção, adicione opções
   → Exemplo: "Sim", "Não", "Talvez"
   → Clique em "+" para adicionar opção

Passo 6: Salvar campo
   → Revise configurações
   → Clique em "Salvar Campo"
   → Campo será adicionado ao formulário

Passo 7: Reordenar (opcional)
   → Arraste campo para posição desejada
   → Organize na ordem lógica
   → Salve formulário

💡 DICAS:
- Use labels claros e objetivos
- Adicione instruções quando necessário
- Organize campos em ordem lógica
- Teste formulário após adicionar campos

⚠️ IMPORTANTE:
- Campos obrigatórios devem ser preenchidos
- Validações são automáticas por tipo
- Pode adicionar quantos campos quiser',
  'formularios',
  'campos',
  -45
);

-- FAQ 56: Quais tipos de campos posso usar
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Quais tipos de campos posso usar no formulário?',
  ARRAY['tipos', 'campos', 'formulario', 'opcoes', 'variacoes'],
  '📌 TIPOS DE CAMPOS DISPONÍVEIS

🎯 TIPOS DE CAMPOS:

1. TEXTO
   → Para respostas curtas
   → Exemplo: Nome, Cidade, Profissão
   → Limite de caracteres configurável

2. TEXTO LONGO
   → Para respostas extensas
   → Exemplo: Descrição de sintomas, Histórico
   → Múltiplas linhas

3. NÚMERO
   → Para valores numéricos
   → Exemplo: Idade, Peso, Altura
   → Validação automática de números

4. DATA
   → Para datas
   → Exemplo: Data de nascimento, Data de consulta
   → Seletor de data visual

5. SELEÇÃO ÚNICA
   → Escolha uma opção
   → Exemplo: "Qual seu objetivo?", "Nível de atividade"
   → Opções: Emagrecer, Manter, Ganhar massa

6. SELEÇÃO MÚLTIPLA
   → Escolha várias opções
   → Exemplo: "Quais sintomas você tem?"
   → Opções: Fadiga, Dor de cabeça, Insônia

7. SIM/NÃO
   → Resposta binária
   → Exemplo: "Faz atividade física?", "Tem alergias?"
   → Botões de sim/não

8. EMAIL
   → Validação de email
   → Exemplo: Email do cliente
   → Verifica formato automaticamente

9. TELEFONE
   → Validação de telefone
   → Exemplo: WhatsApp, Telefone de contato
   → Formato automático

10. ARQUIVO
   → Upload de arquivo
   → Exemplo: Exames, Fotos
   → Tamanho máximo configurável

💡 DICAS:
- Escolha tipo adequado ao dado
- Use validações quando possível
- Combine tipos para formulários completos
- Teste cada tipo antes de enviar

⚠️ IMPORTANTE:
- Cada tipo tem validação específica
- Alguns tipos podem não estar disponíveis
- Validações são automáticas',
  'formularios',
  'campos',
  -46
);

-- FAQ 57: Como tornar campo obrigatório
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como tornar um campo obrigatório?',
  ARRAY['obrigatorio', 'campo', 'requerido', 'necessario', 'validacao'],
  '📌 COMO TORNAR CAMPO OBRIGATÓRIO

📝 PASSO A PASSO:

Passo 1: Editar formulário
   → Abra o formulário
   → Clique em "Editar"

Passo 2: Selecionar campo
   → Clique no campo que deseja tornar obrigatório
   → Ou clique em "Editar" no campo

Passo 3: Configurar obrigatoriedade
   → Encontre opção "Campo obrigatório"
   → Marque a checkbox ou ative o toggle
   → Campo agora é obrigatório

Passo 4: Salvar
   → Clique em "Salvar Campo"
   → Ou "Salvar Formulário"
   → Alteração será aplicada

Passo 5: Verificar
   → Visualize formulário
   → Campos obrigatórios terão asterisco (*)
   → Mensagem de erro aparecerá se não preenchido

💡 DICAS:
- Use obrigatoriedade para dados essenciais
- Não torne tudo obrigatório (pode desencorajar)
- Campos obrigatórios têm asterisco (*)
- Mensagem de erro é automática

⚠️ IMPORTANTE:
- Campos obrigatórios devem ser preenchidos
- Formulário não pode ser enviado sem preencher
- Validação acontece antes do envio
- Mensagem de erro aparece automaticamente',
  'formularios',
  'campos',
  -47
);

-- FAQ 58: Como reordenar campos do formulário
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como reordenar campos do formulário?',
  ARRAY['reordenar', 'organizar', 'campos', 'formulario', 'arrastar'],
  '📌 COMO REORDENAR CAMPOS DO FORMULÁRIO

📝 PASSO A PASSO:

Passo 1: Editar formulário
   → Abra o formulário
   → Clique em "Editar"

Passo 2: Entrar em modo de ordenação
   → Campos terão ícone de "arrastar" (⋮⋮)
   → Ou botão "Reordenar Campos"

Passo 3: Arrastar campos
   → Clique e segure no campo
   → Arraste para nova posição
   → Solte quando estiver na posição desejada

Passo 4: Verificar ordem
   → Campos serão reorganizados
   → Verifique se ordem está correta
   → Continue arrastando se necessário

Passo 5: Salvar
   → Clique em "Salvar Formulário"
   → Nova ordem será salva
   → Alterações serão aplicadas

💡 DICAS:
- Organize campos em ordem lógica
- Comece com informações básicas
- Agrupe campos relacionados
- Teste fluxo após reordenar

⚠️ IMPORTANTE:
- Ordem afeta experiência do usuário
- Campos são reorganizados imediatamente
- Alterações são salvas automaticamente
- Não afeta respostas já recebidas',
  'formularios',
  'campos',
  -48
);

-- =====================================================
-- ENVIO E RESPOSTAS (FAQs 59-61)
-- =====================================================

-- FAQ 59: Como enviar formulário para cliente
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como enviar formulário para cliente?',
  ARRAY['enviar', 'formulario', 'cliente', 'compartilhar', 'link'],
  '📌 COMO ENVIAR FORMULÁRIO PARA CLIENTE

📝 PASSO A PASSO:

Passo 1: Acessar formulário
   → Menu "Formulários"
   → Encontre o formulário que deseja enviar
   → Clique no formulário

Passo 2: Obter link
   → Clique em "Compartilhar" ou "Enviar"
   → Copie o link do formulário
   → Link será algo como: ylada.app/pt/nutri/seu-slug/formulario/nome

Passo 3: Enviar link
   → Opção 1: WhatsApp
   →    → Abra WhatsApp
   →    → Cole o link na conversa
   →    → Envie para o cliente
   
   → Opção 2: Email
   →    → Abra seu email
   →    → Cole o link no corpo do email
   →    → Adicione mensagem personalizada
   →    → Envie

   → Opção 3: SMS
   →    → Envie link por SMS
   →    → Cliente receberá e poderá acessar

Passo 4: Enviar por WhatsApp direto (se disponível)
   → Clique em "Enviar por WhatsApp"
   → Selecione cliente ou digite número
   → Adicione mensagem personalizada
   → Envie

Passo 5: Verificar envio
   → Cliente receberá link
   → Poderá preencher formulário
   → Você receberá notificação quando responder

💡 DICAS:
- Adicione mensagem personalizada ao enviar
- Explique o que é o formulário
- Informe prazo para preenchimento
- Acompanhe se cliente preencheu

⚠️ IMPORTANTE:
- Link é único para cada formulário
- Cliente pode preencher quantas vezes quiser
- Você recebe notificação de cada resposta
- Link funciona em qualquer dispositivo',
  'formularios',
  'envio',
  -49
);

-- FAQ 60: Como visualizar respostas do formulário
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como visualizar respostas do formulário?',
  ARRAY['visualizar', 'respostas', 'formulario', 'ver', 'acessar'],
  '📌 COMO VISUALIZAR RESPOSTAS DO FORMULÁRIO

📝 PASSO A PASSO:

Passo 1: Acessar formulários
   → Menu "Formulários"
   → Encontre o formulário desejado
   → Clique no formulário

Passo 2: Ver respostas
   → Clique em "Respostas" ou "Ver Respostas"
   → Lista de todas as respostas aparecerá
   → Ordenadas por data (mais recente primeiro)

Passo 3: Visualizar resposta individual
   → Clique em uma resposta
   → Veja todas as respostas do cliente
   → Informações completas serão exibidas

Passo 4: Filtrar respostas (se disponível)
   → Filtre por data
   → Filtre por cliente (se vinculado)
   → Busque por palavra-chave

Passo 5: Exportar respostas (se disponível)
   → Clique em "Exportar"
   → Escolha formato (CSV, Excel, PDF)
   → Baixe arquivo

💡 DICAS:
- Respostas são organizadas por data
- Cada resposta é única
- Pode visualizar histórico completo
- Exporte para análise externa

⚠️ IMPORTANTE:
- Respostas são privadas
- Apenas você pode ver respostas
- Dados são seguros e protegidos
- Respostas não podem ser editadas pelo cliente',
  'formularios',
  'respostas',
  -50
);

-- FAQ 61: Como exportar respostas do formulário
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como exportar respostas do formulário?',
  ARRAY['exportar', 'respostas', 'formulario', 'baixar', 'download', 'csv', 'excel'],
  '📌 COMO EXPORTAR RESPOSTAS DO FORMULÁRIO

📝 PASSO A PASSO:

Passo 1: Acessar respostas
   → Menu "Formulários"
   → Abra o formulário desejado
   → Clique em "Respostas"

Passo 2: Abrir opções de exportação
   → Clique em "Exportar" ou ícone de download
   → Escolha formato desejado

Passo 3: Escolher formato
   → CSV: Para Excel, Google Sheets
   → Excel: Arquivo .xlsx completo
   → PDF: Relatório formatado

Passo 4: Configurar exportação
   → Selecione período (se aplicável)
   → Escolha quais campos exportar
   → Inclua/exclua informações adicionais

Passo 5: Exportar
   → Clique em "Exportar" ou "Baixar"
   → Arquivo será gerado
   → Download iniciará automaticamente

Passo 6: Abrir arquivo
   → Arquivo será salvo em "Downloads"
   → Abra com programa apropriado
   → Excel para .xlsx, Excel/Sheets para .csv

💡 DICAS:
- CSV é universal e funciona em qualquer planilha
- Excel mantém formatação melhor
- PDF é bom para impressão
- Exporte regularmente para backup

⚠️ IMPORTANTE:
- Exportação inclui todas as respostas
- Dados são exportados como estão
- Mantenha arquivos seguros
- Respeite privacidade dos clientes',
  'formularios',
  'respostas',
  -51
);

-- =====================================================
-- CLIENTES E GESTÃO - LEADS (FAQs 62-65)
-- =====================================================

-- FAQ 62: Como filtrar leads por data
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como filtrar leads por data?',
  ARRAY['filtrar', 'leads', 'data', 'periodo', 'buscar'],
  '📌 COMO FILTRAR LEADS POR DATA

📝 PASSO A PASSO:

Passo 1: Acessar leads
   → Menu "Leads" ou "Clientes"
   → Clique em "Leads"

Passo 2: Abrir filtros
   → Clique em "Filtros" ou ícone de filtro
   → Ou use barra de busca/filtro

Passo 3: Selecionar filtro de data
   → Encontre "Filtrar por Data" ou "Período"
   → Clique para abrir opções

Passo 4: Escolher período
   → Hoje: apenas leads de hoje
   → Últimos 7 dias: semana atual
   → Últimos 30 dias: mês atual
   → Últimos 90 dias: trimestre
   → Personalizado: escolha data inicial e final

Passo 5: Aplicar filtro
   → Selecione período desejado
   → Clique em "Aplicar" ou "Filtrar"
   → Lista será atualizada

Passo 6: Ver resultados
   → Apenas leads do período aparecerão
   → Contador mostrará quantidade
   → Pode combinar com outros filtros

Passo 7: Remover filtro
   → Clique em "Limpar Filtros" ou "X"
   → Todos os leads voltarão a aparecer

💡 DICAS:
- Use filtros para análise de períodos
- Combine com outros filtros para busca precisa
- Exporte leads filtrados se necessário
- Filtros ajudam a organizar trabalho

⚠️ IMPORTANTE:
- Filtros não excluem leads
- Apenas ocultam temporariamente
- Dados permanecem no sistema
- Pode remover filtro a qualquer momento',
  'clientes',
  'leads',
  -52
);

-- FAQ 63: Como filtrar leads por ferramenta
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como filtrar leads por ferramenta?',
  ARRAY['filtrar', 'leads', 'ferramenta', 'template', 'origem'],
  '📌 COMO FILTRAR LEADS POR FERRAMENTA

📝 PASSO A PASSO:

Passo 1: Acessar leads
   → Menu "Leads" ou "Clientes"
   → Clique em "Leads"

Passo 2: Abrir filtros
   → Clique em "Filtros" ou ícone de filtro
   → Ou use dropdown "Filtrar por"

Passo 3: Selecionar filtro de ferramenta
   → Encontre "Filtrar por Ferramenta" ou "Origem"
   → Clique para abrir lista

Passo 4: Escolher ferramenta
   → Veja lista de todas suas ferramentas
   → Exemplos: "Calculadora de IMC", "Quiz Detox", "Checklist Alimentar"
   → Clique na ferramenta desejada

Passo 5: Aplicar filtro
   → Ferramenta será selecionada
   → Clique em "Aplicar" ou "Filtrar"
   → Lista será atualizada

Passo 6: Ver resultados
   → Apenas leads daquela ferramenta aparecerão
   → Contador mostrará quantidade
   → Veja qual ferramenta gera mais leads

Passo 7: Filtrar múltiplas ferramentas (se disponível)
   → Selecione várias ferramentas
   → Veja leads de todas selecionadas
   → Compare performance

Passo 8: Remover filtro
   → Clique em "Limpar Filtros" ou "X"
   → Todos os leads voltarão a aparecer

💡 DICAS:
- Use para ver qual ferramenta funciona melhor
- Compare performance entre ferramentas
- Identifique ferramentas que geram mais leads
- Foque em melhorar ferramentas eficazes

⚠️ IMPORTANTE:
- Filtro mostra origem do lead
- Cada lead está vinculado à ferramenta
- Pode filtrar por qualquer ferramenta
- Dados ajudam a otimizar estratégia',
  'clientes',
  'leads',
  -53
);

-- FAQ 64: Como buscar lead específico
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como buscar um lead específico?',
  ARRAY['buscar', 'lead', 'procurar', 'pesquisar', 'encontrar'],
  '📌 COMO BUSCAR LEAD ESPECÍFICO

📝 PASSO A PASSO:

Passo 1: Acessar leads
   → Menu "Leads" ou "Clientes"
   → Clique em "Leads"

Passo 2: Usar barra de busca
   → Encontre campo de busca (lupa)
   → Clique no campo
   → Digite termo de busca

Passo 3: Buscar por nome
   → Digite nome do lead
   → Sistema buscará automaticamente
   → Resultados aparecerão em tempo real

Passo 4: Buscar por email
   → Digite email do lead
   → Busca encontrará por email
   → Resultado aparecerá

Passo 5: Buscar por telefone
   → Digite telefone (com ou sem formatação)
   → Sistema encontrará por número
   → Resultado aparecerá

Passo 6: Buscar por ferramenta
   → Digite nome da ferramenta
   → Veja todos os leads daquela ferramenta
   → Útil para encontrar leads específicos

Passo 7: Ver resultado
   → Clique no lead encontrado
   → Veja informações completas
   → Acesse histórico e detalhes

Passo 8: Limpar busca
   → Clique em "X" ou limpe campo
   → Todos os leads voltarão a aparecer

💡 DICAS:
- Busca funciona em tempo real
- Pode buscar por qualquer informação
- Use termos parciais para busca ampla
- Combine com filtros para busca precisa

⚠️ IMPORTANTE:
- Busca é case-insensitive (não diferencia maiúsculas)
- Busca em todos os campos do lead
- Resultados aparecem instantaneamente
- Pode buscar mesmo com informações parciais',
  'clientes',
  'leads',
  -54
);

-- FAQ 65: Como exportar lista de leads
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como exportar lista de leads?',
  ARRAY['exportar', 'leads', 'lista', 'baixar', 'download', 'csv', 'excel'],
  '📌 COMO EXPORTAR LISTA DE LEADS

📝 PASSO A PASSO:

Passo 1: Acessar leads
   → Menu "Leads" ou "Clientes"
   → Clique em "Leads"

Passo 2: Aplicar filtros (opcional)
   → Filtre por data, ferramenta, etc.
   → Apenas leads filtrados serão exportados
   → Ou exporte todos os leads

Passo 3: Abrir opções de exportação
   → Clique em "Exportar" ou ícone de download
   → Escolha formato desejado

Passo 4: Escolher formato
   → CSV: Para Excel, Google Sheets (recomendado)
   → Excel: Arquivo .xlsx completo
   → PDF: Relatório formatado

Passo 5: Selecionar campos
   → Escolha quais informações incluir
   → Nome, Email, Telefone, Data, Ferramenta, etc.
   → Marque/desmarque campos desejados

Passo 6: Exportar
   → Clique em "Exportar" ou "Baixar"
   → Arquivo será gerado
   → Download iniciará automaticamente

Passo 7: Abrir arquivo
   → Arquivo será salvo em "Downloads"
   → Abra com Excel, Google Sheets ou similar
   → Dados estarão organizados em colunas

💡 DICAS:
- CSV é universal e funciona em qualquer planilha
- Excel mantém formatação melhor
- Exporte regularmente para backup
- Use para análise externa e relatórios

⚠️ IMPORTANTE:
- Exportação inclui apenas leads visíveis (filtrados)
- Dados são exportados como estão no sistema
- Mantenha arquivos seguros (dados sensíveis)
- Respeite privacidade e LGPD
- Não compartilhe arquivos sem autorização',
  'clientes',
  'leads',
  -55
);

-- =====================================================
-- FIM DO LOTE 4 (FAQs 51-65)
-- =====================================================

-- NOTA: Para executar este script:
-- 1. Conecte-se ao Supabase
-- 2. Execute este arquivo (lote4)
-- 3. Verifique se todos foram inseridos corretamente
-- 4. Teste o sistema de busca de FAQs

-- Para verificar inserção:
-- SELECT COUNT(*) FROM faq_responses WHERE area = 'nutri';
-- SELECT categoria, COUNT(*) FROM faq_responses WHERE area = 'nutri' GROUP BY categoria;


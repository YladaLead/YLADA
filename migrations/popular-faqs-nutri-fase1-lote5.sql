-- =====================================================
-- YLADA - FAQs ESSENCIAIS ÁREA NUTRI - LOTE 5 (FAQs 66-80)
-- Continuando após os 65 FAQs anteriores
-- =====================================================

-- =====================================================
-- CONVERSÃO DE LEADS (FAQs 66-68)
-- =====================================================

-- FAQ 66: Como converter lead em cliente
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como converter lead em cliente?',
  ARRAY['converter', 'lead', 'cliente', 'transformar', 'adicionar'],
  '📌 COMO CONVERTER LEAD EM CLIENTE

📝 PASSO A PASSO:

Passo 1: Acessar leads
   → Menu "Leads" ou "Clientes"
   → Clique em "Leads"
   → Encontre o lead que deseja converter

Passo 2: Abrir lead
   → Clique no lead desejado
   → Veja informações completas do lead
   → Verifique se tem todas as informações necessárias

Passo 3: Converter lead
   → Clique em "Converter em Cliente" ou botão "Converter"
   → Ou clique nos três pontos (...) → "Converter em Cliente"
   → Confirme conversão

Passo 4: Completar informações (se necessário)
   → Se faltar informações, preencha antes de converter
   → Adicione dados adicionais se necessário
   → Salve informações

Passo 5: Confirmar conversão
   → Leia confirmação
   → Clique em "Confirmar" ou "Converter"
   → Lead será convertido em cliente

Passo 6: Verificar
   → Lead desaparecerá da lista de leads
   → Aparecerá na lista de clientes
   → Histórico será mantido

💡 DICAS:
- Converta apenas leads qualificados
- Complete informações antes de converter
- Histórico do lead é preservado
- Pode converter múltiplos leads de uma vez (se disponível)

⚠️ IMPORTANTE:
- Conversão é permanente
- Lead vira cliente oficial
- Dados são transferidos automaticamente
- Histórico de origem é mantido',
  'clientes',
  'conversao',
  -56
);

-- FAQ 67: O que acontece ao converter lead
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'O que acontece ao converter um lead em cliente?',
  ARRAY['converter', 'lead', 'cliente', 'acontece', 'resultado', 'mudanca'],
  '📌 O QUE ACONTECE AO CONVERTER LEAD

🎯 MUDANÇAS AUTOMÁTICAS:

1. STATUS ALTERADO
   → Lead deixa de ser "Lead"
   → Vira "Cliente" oficial
   → Aparece na lista de clientes

2. DADOS TRANSFERIDOS
   → Nome, email, telefone são copiados
   → Informações da ferramenta são mantidas
   → Data de conversão é registrada

3. HISTÓRICO PRESERVADO
   → Histórico do lead é mantido
   → Pode ver origem do cliente
   → Dados de quando era lead ficam disponíveis

4. ACESSO A FUNCIONALIDADES
   → Pode usar Kanban para organizar
   → Pode fazer acompanhamento
   → Pode adicionar anotações
   → Pode agendar consultas

5. REMOÇÃO DE LEADS
   → Sai da lista de leads
   → Não aparece mais em "Leads"
   → Apenas em "Clientes"

💡 DICAS:
- Conversão não perde informações
- Tudo é preservado e organizado
- Pode ver histórico completo
- Facilita gestão de clientes

⚠️ IMPORTANTE:
- Conversão é permanente
- Não pode reverter automaticamente
- Dados são seguros e preservados
- Histórico completo fica disponível',
  'clientes',
  'conversao',
  -57
);

-- FAQ 68: Posso desfazer conversão de lead
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Posso desfazer a conversão de um lead?',
  ARRAY['desfazer', 'conversao', 'lead', 'reverter', 'voltar', 'cancelar'],
  '📌 POSSO DESFAZER CONVERSÃO DE LEAD

📝 SOBRE REVERSÃO:

Opção 1: Converter de volta manualmente
   → Não há botão automático de "desfazer"
   → Mas pode converter cliente de volta
   → Processo manual

Opção 2: Excluir cliente (não recomendado)
   → Pode excluir cliente
   → Mas perderá histórico
   → Não é recomendado

Opção 3: Manter como cliente
   → Melhor opção é manter
   → Dados são preservados
   → Histórico fica completo

💡 DICAS:
- Pense bem antes de converter
- Verifique se lead está qualificado
- Complete informações antes
- Conversão é decisão importante

⚠️ IMPORTANTE:
- Não há "desfazer" automático
- Conversão é decisão permanente
- Dados são preservados
- Melhor evitar reverter

🔧 SE PRECISAR REVERTER:
- Entre em contato com suporte
- Explique situação
- Equipe pode ajudar se necessário
- Mas processo é manual',
  'clientes',
  'conversao',
  -58
);

-- =====================================================
-- CLIENTES (FAQs 69-72)
-- =====================================================

-- FAQ 69: Como criar cliente manualmente
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como criar um cliente manualmente?',
  ARRAY['criar', 'cliente', 'manual', 'adicionar', 'novo', 'cadastrar'],
  '📌 COMO CRIAR CLIENTE MANUALMENTE

📝 PASSO A PASSO:

Passo 1: Acessar clientes
   → Menu "Clientes"
   → Clique em "Clientes" ou "Meus Clientes"
   → Clique em "Novo Cliente" ou botão "+"

Passo 2: Preencher informações básicas
   → Nome completo (obrigatório)
   → Email (opcional mas recomendado)
   → Telefone/WhatsApp (recomendado)
   → Data de nascimento (opcional)

Passo 3: Adicionar informações adicionais
   → Endereço (opcional)
   → Cidade/Estado (opcional)
   → Observações (opcional)
   → Tags ou categorias (se disponível)

Passo 4: Configurar status
   → Escolha status inicial
   → Exemplos: "Novo", "Em Atendimento", "Ativo"
   → Ou deixe padrão

Passo 5: Salvar cliente
   → Revise todas as informações
   → Clique em "Salvar" ou "Criar Cliente"
   → Cliente será criado

Passo 6: Verificar
   → Cliente aparecerá na lista
   → Pode acessar perfil completo
   → Pode começar a trabalhar com ele

💡 DICAS:
- Preencha pelo menos nome e contato
- Adicione informações relevantes
- Organize com tags se disponível
- Mantenha dados atualizados

⚠️ IMPORTANTE:
- Nome é obrigatório
- Email e telefone facilitam contato
- Pode editar depois se necessário
- Dados são seguros e privados',
  'clientes',
  'criacao',
  -59
);

-- FAQ 70: Como visualizar perfil completo do cliente
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como visualizar o perfil completo do cliente?',
  ARRAY['visualizar', 'perfil', 'cliente', 'ver', 'detalhes', 'informacoes'],
  '📌 COMO VISUALIZAR PERFIL COMPLETO DO CLIENTE

📝 PASSO A PASSO:

Passo 1: Acessar clientes
   → Menu "Clientes"
   → Clique em "Clientes"
   → Encontre o cliente desejado

Passo 2: Abrir perfil
   → Clique no nome do cliente
   → Ou clique em "Ver Perfil" ou ícone de olho
   → Perfil completo será aberto

Passo 3: Ver informações básicas
   → Nome completo
   → Email e telefone
   → Data de nascimento
   → Endereço (se cadastrado)

Passo 4: Ver histórico
   → Histórico de consultas
   → Formulários preenchidos
   → Ferramentas utilizadas
   → Evolução ao longo do tempo

Passo 5: Ver anotações
   → Anotações e observações
   → Notas de acompanhamento
   → Informações relevantes
   → Datas e eventos

Passo 6: Ver documentos (se disponível)
   → Arquivos anexados
   → Exames e documentos
   → Fotos e imagens
   → Histórico médico

Passo 7: Ver status e organização
   → Status atual no Kanban
   → Tags e categorias
   → Próximos passos
   → Lembretes e tarefas

💡 DICAS:
- Perfil centraliza todas as informações
- Histórico completo fica disponível
- Use para acompanhamento completo
- Mantenha informações atualizadas

⚠️ IMPORTANTE:
- Todas as informações em um lugar
- Histórico completo preservado
- Dados são privados e seguros
- Pode editar informações quando necessário',
  'clientes',
  'visualizacao',
  -60
);

-- FAQ 71: Como editar informações do cliente
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como editar informações do cliente?',
  ARRAY['editar', 'cliente', 'informacoes', 'modificar', 'atualizar', 'alterar'],
  '📌 COMO EDITAR INFORMAÇÕES DO CLIENTE

📝 PASSO A PASSO:

Passo 1: Acessar perfil do cliente
   → Menu "Clientes"
   → Clique no cliente desejado
   → Abra perfil completo

Passo 2: Entrar em modo de edição
   → Clique em "Editar" ou ícone de lápis
   → Ou clique nos três pontos (...) → "Editar"
   → Modo de edição será ativado

Passo 3: Editar informações básicas
   → Altere nome (se necessário)
   → Atualize email
   → Modifique telefone
   → Altere data de nascimento

Passo 4: Editar informações adicionais
   → Modifique endereço
   → Atualize cidade/estado
   → Altere observações
   → Modifique tags/categorias

Passo 5: Salvar alterações
   → Revise todas as mudanças
   → Clique em "Salvar" ou "Atualizar"
   → Alterações serão salvas

Passo 6: Verificar
   → Informações atualizadas aparecerão
   → Mudanças serão aplicadas
   → Histórico de edições pode ser mantido

💡 DICAS:
- Salve frequentemente durante edição
- Revise antes de salvar
- Mantenha informações atualizadas
- Histórico pode ser preservado

⚠️ IMPORTANTE:
- Alterações são salvas imediatamente
- Pode editar a qualquer momento
- Dados são atualizados em tempo real
- Histórico de mudanças pode ser mantido',
  'clientes',
  'edicao',
  -61
);

-- FAQ 72: Como excluir cliente
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como excluir um cliente?',
  ARRAY['excluir', 'cliente', 'deletar', 'remover', 'apagar'],
  '📌 COMO EXCLUIR CLIENTE

📝 PASSO A PASSO:

Passo 1: Acessar cliente
   → Menu "Clientes"
   → Encontre o cliente que deseja excluir
   → Abra perfil do cliente

Passo 2: Abrir opções
   → Clique nos três pontos (...) 
   → Ou botão "Mais Opções"
   → Encontre opção "Excluir"

Passo 3: Confirmar exclusão
   → Clique em "Excluir" ou "Remover"
   → Leia aviso de confirmação
   → Confirme que deseja excluir

Passo 4: Confirmar definitivamente
   → Digite "EXCLUIR" ou confirme
   → Clique em "Confirmar Exclusão"
   → Cliente será removido

Passo 5: Verificar
   → Cliente desaparecerá da lista
   → Não aparecerá mais em "Clientes"
   → Exclusão será permanente

💡 DICAS:
- Exclusão é permanente
- Considere arquivar em vez de excluir
- Verifique se não está em uso
- Histórico pode ser perdido

⚠️ IMPORTANTE:
- Exclusão não pode ser desfeita
- Todos os dados serão removidos
- Histórico será perdido
- Pense bem antes de excluir

🔧 ALTERNATIVA:
- Considere arquivar cliente
- Mantém dados mas oculta
- Pode recuperar depois
- Mais seguro que excluir',
  'clientes',
  'gerenciamento',
  -62
);

-- =====================================================
-- KANBAN (FAQs 73-76)
-- =====================================================

-- FAQ 73: Como usar o Kanban para organizar clientes
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como usar o Kanban para organizar clientes?',
  ARRAY['kanban', 'organizar', 'clientes', 'colunas', 'status', 'fluxo'],
  '📌 COMO USAR KANBAN PARA ORGANIZAR CLIENTES

🎯 O QUE É KANBAN:
- Sistema visual de organização
- Clientes em colunas por status
- Facilita visualizar fluxo de trabalho
- Organiza por etapas do processo

📝 PASSO A PASSO:

Passo 1: Acessar Kanban
   → Menu "Clientes"
   → Clique em "Kanban" ou "Visualização Kanban"
   → Visualização em colunas aparecerá

Passo 2: Entender colunas padrão
   → "Novos": Clientes recém-cadastrados
   → "Em Atendimento": Clientes ativos
   → "Aguardando": Aguardando retorno
   → "Concluídos": Processo finalizado

Passo 3: Visualizar clientes
   → Cada cliente aparece como card
   → Cards mostram informações principais
   → Organizados por coluna/status

Passo 4: Mover clientes
   → Arraste card para outra coluna
   → Ou clique no card → "Mover para..."
   → Status será atualizado automaticamente

Passo 5: Personalizar colunas (se disponível)
   → Crie colunas personalizadas
   → Renomeie colunas existentes
   → Organize conforme seu fluxo

Passo 6: Usar para gestão
   → Veja onde está cada cliente
   → Identifique gargalos
   → Organize trabalho diário

💡 DICAS:
- Use para visualizar todo o fluxo
- Organize por etapas do seu processo
- Mova clientes conforme avançam
- Facilita gestão visual

⚠️ IMPORTANTE:
- Kanban é visual e intuitivo
- Facilita organização
- Status é atualizado automaticamente
- Pode personalizar conforme necessidade',
  'clientes',
  'kanban',
  -63
);

-- FAQ 74: Como mover cliente entre colunas
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como mover cliente entre colunas no Kanban?',
  ARRAY['mover', 'cliente', 'coluna', 'kanban', 'arrastar', 'status'],
  '📌 COMO MOVER CLIENTE ENTRE COLUNAS

📝 PASSO A PASSO:

Passo 1: Acessar Kanban
   → Menu "Clientes"
   → Clique em "Kanban"
   → Visualização em colunas aparecerá

Passo 2: Encontrar cliente
   → Localize o cliente na coluna atual
   → Cliente aparece como card
   → Veja informações no card

Passo 3: Mover arrastando (método 1)
   → Clique e segure no card do cliente
   → Arraste para a coluna desejada
   → Solte quando estiver na posição correta

Passo 4: Mover por menu (método 2)
   → Clique no card do cliente
   → Clique em "Mover para..." ou três pontos
   → Escolha coluna de destino
   → Cliente será movido

Passo 5: Verificar movimento
   → Cliente aparecerá na nova coluna
   → Status será atualizado automaticamente
   → Mudança será salva

Passo 6: Confirmar
   → Verifique se está na coluna correta
   → Status foi atualizado
   → Pode continuar organizando

💡 DICAS:
- Arrastar é mais rápido e visual
- Use menu se preferir clicar
- Movimento é instantâneo
- Status é atualizado automaticamente

⚠️ IMPORTANTE:
- Movimento atualiza status do cliente
- Mudança é salva automaticamente
- Pode mover quantas vezes quiser
- Facilita organização visual',
  'clientes',
  'kanban',
  -64
);

-- FAQ 75: Como criar nova coluna no Kanban
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como criar uma nova coluna no Kanban?',
  ARRAY['criar', 'coluna', 'kanban', 'nova', 'adicionar', 'personalizar'],
  '📌 COMO CRIAR NOVA COLUNA NO KANBAN

📝 PASSO A PASSO:

Passo 1: Acessar Kanban
   → Menu "Clientes"
   → Clique em "Kanban"
   → Visualização em colunas aparecerá

Passo 2: Abrir configurações
   → Clique em "Configurar Colunas" ou ícone de engrenagem
   → Ou clique em "+" ao lado das colunas
   → Menu de configuração aparecerá

Passo 3: Adicionar coluna
   → Clique em "Adicionar Coluna" ou "+ Nova Coluna"
   → Digite nome da nova coluna
   → Exemplos: "Primeira Consulta", "Aguardando Exames", "Em Tratamento"

Passo 4: Configurar coluna
   → Escolha cor (se disponível)
   → Defina ordem (posição)
   → Adicione descrição (opcional)

Passo 5: Salvar coluna
   → Clique em "Salvar" ou "Criar"
   → Nova coluna será criada
   → Aparecerá no Kanban

Passo 6: Usar coluna
   → Pode mover clientes para nova coluna
   → Organize conforme seu fluxo
   → Personalize seu processo

💡 DICAS:
- Crie colunas que fazem sentido para seu fluxo
- Use nomes claros e objetivos
- Organize em ordem lógica
- Pode criar quantas colunas precisar

⚠️ IMPORTANTE:
- Colunas personalizam seu processo
- Pode renomear e reorganizar depois
- Facilita organização específica
- Adapta sistema ao seu trabalho',
  'clientes',
  'kanban',
  -65
);

-- FAQ 76: Como personalizar colunas do Kanban
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como personalizar colunas do Kanban?',
  ARRAY['personalizar', 'colunas', 'kanban', 'configurar', 'editar', 'renomear'],
  '📌 COMO PERSONALIZAR COLUNAS DO KANBAN

📝 PASSO A PASSO:

Passo 1: Acessar configurações
   → Menu "Clientes"
   → Clique em "Kanban"
   → Clique em "Configurar Colunas" ou ícone de engrenagem

Passo 2: Editar coluna existente
   → Clique na coluna que deseja editar
   → Ou clique nos três pontos (...) da coluna
   → Escolha "Editar" ou "Configurar"

Passo 3: Renomear coluna
   → Altere nome da coluna
   → Use nome que faça sentido para você
   → Exemplo: "Novos" → "Primeira Consulta"

Passo 4: Alterar ordem
   → Arraste coluna para nova posição
   → Ou use setas para mover
   → Organize na ordem desejada

Passo 5: Configurar cor (se disponível)
   → Escolha cor para coluna
   → Facilita identificação visual
   → Diferencia colunas rapidamente

Passo 6: Adicionar descrição
   → Adicione descrição da coluna
   → Explique propósito
   → Ajuda a entender função

Passo 7: Salvar alterações
   → Revise todas as mudanças
   → Clique em "Salvar" ou "Aplicar"
   → Alterações serão aplicadas

Passo 8: Verificar
   → Colunas aparecerão personalizadas
   → Ordem será atualizada
   → Visual será atualizado

💡 DICAS:
- Personalize conforme seu processo
- Use nomes que façam sentido
- Organize em ordem lógica
- Cores ajudam identificação visual

⚠️ IMPORTANTE:
- Personalização é salva automaticamente
- Pode alterar a qualquer momento
- Adapta sistema ao seu trabalho
- Facilita organização pessoal',
  'clientes',
  'kanban',
  -66
);

-- =====================================================
-- ACOMPANHAMENTO (FAQs 77-78)
-- =====================================================

-- FAQ 77: Como fazer acompanhamento de cliente
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como fazer acompanhamento de cliente?',
  ARRAY['acompanhamento', 'cliente', 'evolucao', 'progresso', 'seguimento'],
  '📌 COMO FAZER ACOMPANHAMENTO DE CLIENTE

📝 PASSO A PASSO:

Passo 1: Acessar cliente
   → Menu "Clientes"
   → Encontre o cliente desejado
   → Abra perfil completo

Passo 2: Acessar acompanhamento
   → Clique em "Acompanhamento" ou "Evolução"
   → Ou aba "Histórico"
   → Seção de acompanhamento aparecerá

Passo 3: Adicionar registro
   → Clique em "Novo Registro" ou "+"
   → Ou "Adicionar Acompanhamento"
   → Formulário de registro aparecerá

Passo 4: Preencher informações
   → Data do acompanhamento
   → Peso atual (se aplicável)
   → Medidas (se aplicável)
   → Observações e notas
   → Objetivos alcançados

Passo 5: Adicionar anotações
   → Descreva evolução do cliente
   → Anote mudanças observadas
   → Registre feedback do cliente
   → Adicione informações relevantes

Passo 6: Salvar registro
   → Revise informações
   → Clique em "Salvar" ou "Registrar"
   → Acompanhamento será salvo

Passo 7: Visualizar histórico
   → Veja todos os registros anteriores
   → Compare evolução ao longo do tempo
   → Identifique progresso
   → Veja gráficos (se disponível)

💡 DICAS:
- Faça registros regularmente
- Seja detalhado nas anotações
- Compare com registros anteriores
- Use para ver evolução completa

⚠️ IMPORTANTE:
- Histórico completo fica disponível
- Facilita acompanhamento contínuo
- Dados ajudam a ver progresso
- Pode exportar histórico se necessário',
  'clientes',
  'acompanhamento',
  -67
);

-- FAQ 78: Como adicionar anotações ao cliente
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como adicionar anotações ao cliente?',
  ARRAY['anotacoes', 'cliente', 'notas', 'observacoes', 'adicionar', 'registrar'],
  '📌 COMO ADICIONAR ANOTAÇÕES AO CLIENTE

📝 PASSO A PASSO:

Passo 1: Acessar cliente
   → Menu "Clientes"
   → Encontre o cliente desejado
   → Abra perfil completo

Passo 2: Acessar anotações
   → Clique em "Anotações" ou "Notas"
   → Ou aba "Observações"
   → Seção de anotações aparecerá

Passo 3: Adicionar nova anotação
   → Clique em "Nova Anotação" ou "+"
   → Ou "Adicionar Nota"
   → Campo de texto aparecerá

Passo 4: Escrever anotação
   → Digite sua anotação
   → Seja claro e objetivo
   → Inclua data e contexto
   → Adicione informações relevantes

Passo 5: Formatar (se disponível)
   → Use negrito, itálico (se disponível)
   → Organize com parágrafos
   → Use listas se necessário
   → Formate para melhor leitura

Passo 6: Adicionar tags (se disponível)
   → Adicione tags para categorizar
   → Exemplos: "Consulta", "Lembrete", "Importante"
   → Facilita busca depois

Passo 7: Salvar anotação
   → Revise o que escreveu
   → Clique em "Salvar" ou "Adicionar"
   → Anotação será salva

Passo 8: Visualizar anotações
   → Veja todas as anotações anteriores
   → Organizadas por data (mais recente primeiro)
   → Pode editar ou excluir depois

💡 DICAS:
- Adicione anotações regularmente
- Seja específico e detalhado
- Use para lembretes importantes
- Organize com tags se disponível

⚠️ IMPORTANTE:
- Anotações são privadas
- Apenas você pode ver
- Histórico completo fica disponível
- Pode editar ou excluir depois',
  'clientes',
  'anotacoes',
  -68
);

-- =====================================================
-- PORTALES - CRIAÇÃO E EDIÇÃO (FAQs 79-82)
-- =====================================================

-- FAQ 79: Como editar portal existente
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como editar um portal existente?',
  ARRAY['editar', 'portal', 'modificar', 'alterar', 'atualizar'],
  '📌 COMO EDITAR PORTAL EXISTENTE

📝 PASSO A PASSO:

Passo 1: Acessar portais
   → Menu "Portais"
   → Clique em "Meus Portais"
   → Encontre o portal que deseja editar

Passo 2: Abrir portal
   → Clique no portal desejado
   → Ou clique em "Editar" (ícone de lápis)
   → Portal será aberto em modo de edição

Passo 3: Editar informações básicas
   → Altere nome do portal
   → Modifique descrição
   → Atualize imagem de capa (se disponível)
   → Altere configurações gerais

Passo 4: Editar ferramentas
   → Adicione novas ferramentas
   → Remova ferramentas existentes
   → Reordene ferramentas
   → Organize como desejar

Passo 5: Editar organização
   → Mude ordem das ferramentas
   → Organize por categorias (se disponível)
   → Agrupe ferramentas relacionadas
   → Personalize layout

Passo 6: Editar configurações
   → Altere visibilidade
   → Modifique permissões
   → Atualize compartilhamento
   → Configure opções avançadas

Passo 7: Salvar alterações
   → Revise todas as mudanças
   → Clique em "Salvar" ou "Atualizar"
   → Alterações serão aplicadas

Passo 8: Verificar
   → Visualize portal atualizado
   → Teste se tudo está funcionando
   → Confirme que mudanças foram salvas

💡 DICAS:
- Salve frequentemente durante edição
- Teste portal após editar
- Mantenha organização clara
- Revise antes de salvar

⚠️ IMPORTANTE:
- Alterações são salvas imediatamente
- Pode editar a qualquer momento
- Mudanças são aplicadas em tempo real
- Link do portal permanece o mesmo',
  'portais',
  'edicao',
  -69
);

-- FAQ 80: Como excluir portal
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como excluir um portal?',
  ARRAY['excluir', 'portal', 'deletar', 'remover', 'apagar'],
  '📌 COMO EXCLUIR PORTAL

📝 PASSO A PASSO:

Passo 1: Acessar portais
   → Menu "Portais"
   → Clique em "Meus Portais"
   → Encontre o portal que deseja excluir

Passo 2: Abrir opções
   → Clique nos três pontos (...) ao lado do portal
   → Ou clique com botão direito no portal
   → Menu de opções aparecerá

Passo 3: Excluir
   → Clique em "Excluir" ou "Remover"
   → Leia aviso de confirmação
   → Confirme que deseja excluir

Passo 4: Confirmar exclusão
   → Digite "EXCLUIR" ou confirme
   → Clique em "Confirmar Exclusão"
   → Portal será removido

Passo 5: Verificar
   → Portal desaparecerá da lista
   → Não aparecerá mais em "Portais"
   → Link do portal deixará de funcionar

💡 DICAS:
- Exclusão é permanente
- Considere arquivar em vez de excluir
- Verifique se não está em uso
- Pense bem antes de excluir

⚠️ IMPORTANTE:
- Exclusão não pode ser desfeita
- Link do portal deixará de funcionar
- Ferramentas não são excluídas
- Apenas portal é removido

🔧 ALTERNATIVA:
- Considere desativar portal
- Mantém dados mas oculta
- Pode reativar depois
- Mais seguro que excluir',
  'portais',
  'gerenciamento',
  -70
);

-- =====================================================
-- FIM DO LOTE 5 (FAQs 66-80)
-- =====================================================

-- NOTA: Para executar este script:
-- 1. Conecte-se ao Supabase
-- 2. Execute este arquivo (lote5)
-- 3. Verifique se todos foram inseridos corretamente
-- 4. Teste o sistema de busca de FAQs

-- Para verificar inserção:
-- SELECT COUNT(*) FROM faq_responses WHERE area = 'nutri';
-- SELECT categoria, COUNT(*) FROM faq_responses WHERE area = 'nutri' GROUP BY categoria;


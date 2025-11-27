-- =====================================================
-- YLADA - FAQs ESSENCIAIS ÁREA NUTRI - LOTE 3 (FAQs 36-50)
-- Completando os 50 FAQs essenciais
-- =====================================================

-- =====================================================
-- CLIENTES E LEADS (continuação - FAQs 36-40)
-- =====================================================

-- FAQ 36: Como adicionar cliente manualmente
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como adicionar um cliente manualmente?',
  ARRAY['adicionar', 'cliente', 'manual', 'criar', 'novo'],
  '📌 COMO ADICIONAR CLIENTE MANUALMENTE

📝 PASSO A PASSO:

Passo 1: Acessar clientes
   → Menu "Clientes"
   → Clique em "Novo Cliente" ou "+"

Passo 2: Preencher informações
   → Nome completo (obrigatório)
   → Email (opcional mas recomendado)
   → Telefone/WhatsApp (recomendado)
   → Data de nascimento (opcional)
   → Outras informações relevantes

Passo 3: Configurar status
   → Escolha status inicial
   → Ex: "Novo", "Em atendimento", "Ativo"
   → Pode mudar depois

Passo 4: Salvar
   → Clique em "Salvar" ou "Criar"
   → Cliente será adicionado
   → Aparece na lista de clientes

Passo 5: Gerenciar
   → Cliente já está disponível
   → Pode enviar formulários
   → Adicionar anotações

💡 DICAS:
- Complete informações importantes
- Organize por status
- Adicione anotações iniciais',
  'clientes',
  'criacao',
  -26
);

-- FAQ 37: Como editar informações do cliente
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como editar informações de um cliente?',
  ARRAY['editar', 'cliente', 'informacoes', 'modificar', 'atualizar'],
  '📌 COMO EDITAR INFORMAÇÕES DO CLIENTE

📝 PASSO A PASSO:

Passo 1: Abrir cliente
   → Menu "Clientes"
   → Clique no cliente desejado
   → Abre perfil completo

Passo 2: Editar
   → Clique em "Editar" ou ícone de lápis
   → Ou clique diretamente nos campos editáveis

Passo 3: Modificar informações
   → Altere nome, email, telefone
   → Atualize data de nascimento
   → Modifique outras informações

Passo 4: Salvar
   → Clique em "Salvar" ou "Atualizar"
   → Alterações são salvas
   → Confirmação aparece

💡 DICAS:
- Sempre salve após editar
- Verifique se alterações foram aplicadas
- Histórico é mantido',
  'clientes',
  'edicao',
  -27
);

-- FAQ 38: Como organizar clientes em Kanban
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como organizar clientes no Kanban?',
  ARRAY['organizar', 'clientes', 'kanban', 'colunas', 'status'],
  '📌 COMO ORGANIZAR CLIENTES NO KANBAN

📝 PASSO A PASSO:

Passo 1: Acessar Kanban
   → Menu "Clientes"
   → Clique em "Visualização Kanban"
   → Ou ícone de colunas

Passo 2: Entender colunas
   → Colunas padrão: "Novo", "Em Atendimento", "Ativo", "Inativo"
   → Cada coluna = um status
   → Clientes aparecem como cards

Passo 3: Mover clientes
   → Arraste card de uma coluna para outra
   → Status muda automaticamente
   → Organize conforme seu fluxo

Passo 4: Personalizar colunas (se disponível)
   → Adicione novas colunas
   → Renomeie colunas existentes
   → Configure seu fluxo

Passo 5: Visualizar
   → Veja todos os clientes organizados
   → Identifique onde cada um está
   → Gerencie melhor

💡 DICAS:
- Use para visualizar fluxo de trabalho
- Organize por estágio de atendimento
- Facilita gestão visual

⚠️ NOTA:
- Se Kanban não estiver disponível, use lista normal
- Entre em contato com suporte se precisar',
  'clientes',
  'organizacao',
  -28
);

-- FAQ 39: Como adicionar anotações ao cliente
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como adicionar anotações a um cliente?',
  ARRAY['adicionar', 'anotacoes', 'cliente', 'notas', 'observacoes'],
  '📌 COMO ADICIONAR ANOTAÇÕES AO CLIENTE

📝 PASSO A PASSO:

Passo 1: Abrir cliente
   → Menu "Clientes"
   → Clique no cliente
   → Abre perfil

Passo 2: Localizar anotações
   → Procure seção "Anotações" ou "Notas"
   → Ou aba "Observações"
   → Clique para abrir

Passo 3: Adicionar anotação
   → Clique em "Nova Anotação" ou "+"
   → Digite sua anotação
   → Ex: "Cliente prefere horário manhã"

Passo 4: Salvar
   → Clique em "Salvar"
   → Anotação é adicionada
   → Data/hora registrada automaticamente

Passo 5: Visualizar histórico
   → Veja todas as anotações
   → Organizadas por data
   → Últimas primeiro

💡 DICAS:
- Use para registrar conversas importantes
- Anote preferências e observações
- Facilita acompanhamento

⚠️ NOTA:
- Se não houver seção de anotações, entre em contato com suporte
- Funcionalidade pode estar em desenvolvimento',
  'clientes',
  'anotacoes',
  -29
);

-- FAQ 40: Como buscar cliente específico
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como buscar um cliente específico?',
  ARRAY['buscar', 'cliente', 'especifico', 'procurar', 'pesquisar'],
  '📌 COMO BUSCAR CLIENTE ESPECÍFICO

📝 PASSO A PASSO:

Passo 1: Acessar clientes
   → Menu "Clientes"
   → Procure barra de busca

Passo 2: Buscar
   → Digite nome, email ou telefone
   → Sistema busca em tempo real
   → Resultados aparecem automaticamente

Passo 3: Filtrar resultados
   → Use filtros adicionais se necessário
   → Por status, data, etc
   → Encontre cliente rapidamente

Passo 4: Abrir cliente
   → Clique no cliente encontrado
   → Veja perfil completo
   → Gerencie informações

💡 DICAS:
- Busca funciona por nome parcial
- Email e telefone também funcionam
- Use para encontrar rapidamente',
  'clientes',
  'busca',
  -30
);

-- =====================================================
-- CONFIGURAÇÕES E PERFIL (FAQs 41-50)
-- =====================================================

-- FAQ 41: Como editar meu perfil
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como editar meu perfil profissional?',
  ARRAY['editar', 'perfil', 'profissional', 'configuracao', 'dados'],
  '📌 COMO EDITAR MEU PERFIL PROFISSIONAL

📝 PASSO A PASSO:

Passo 1: Acessar configurações
   → Menu superior > Seu nome ou avatar
   → Clique em "Configurações" ou "Perfil"
   → Ou menu lateral "Configurações"

Passo 2: Editar informações
   → Nome completo
   → Email (pode não ser editável)
   → Telefone/WhatsApp
   → Bio/Descrição profissional
   → Formação e especializações

Passo 3: Atualizar foto
   → Clique em foto atual
   → Faça upload de nova foto
   → Ajuste se necessário

Passo 4: Configurar slug
   → Slug é seu link personalizado
   → Ex: ylada.com/nutri/seu-nome
   → Use apenas letras, números e hífen

Passo 5: Salvar
   → Clique em "Salvar" ou "Atualizar"
   → Alterações são aplicadas
   → Confirmação aparece

💡 DICAS:
- Mantenha informações atualizadas
- Foto profissional melhora credibilidade
- Slug deve ser único e descritivo

⚠️ PROBLEMAS COMUNS:
- "Slug já existe" → Escolha outro slug
- "Alterações não salvam" → Verifique conexão',
  'configuracao',
  'perfil',
  -31
);

-- FAQ 42: Como alterar minha senha
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como alterar minha senha?',
  ARRAY['alterar', 'senha', 'password', 'seguranca', 'trocar'],
  '📌 COMO ALTERAR MINHA SENHA

📝 PASSO A PASSO:

Passo 1: Acessar configurações
   → Menu "Configurações"
   → Ou perfil > "Segurança"
   → Procure seção "Senha"

Passo 2: Alterar senha
   → Digite senha atual
   → Digite nova senha
   → Confirme nova senha

Passo 3: Requisitos da senha
   → Mínimo 8 caracteres (geralmente)
   → Use letras, números e símbolos
   → Evite senhas óbvias

Passo 4: Salvar
   → Clique em "Alterar Senha" ou "Salvar"
   → Senha é atualizada
   → Você precisará fazer login novamente

Passo 5: Confirmar
   → Faça login com nova senha
   → Verifique se funcionou

💡 DICAS:
- Use senha forte e única
- Não compartilhe sua senha
- Altere regularmente

⚠️ PROBLEMAS COMUNS:
- "Senha atual incorreta" → Verifique se digitou corretamente
- "Senhas não coincidem" → Digite novamente
- "Senha muito fraca" → Use senha mais forte',
  'configuracao',
  'seguranca',
  -32
);

-- FAQ 43: Como configurar WhatsApp
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como configurar meu WhatsApp no perfil?',
  ARRAY['configurar', 'whatsapp', 'telefone', 'contato', 'perfil'],
  '📌 COMO CONFIGURAR WHATSAPP NO PERFIL

📝 PASSO A PASSO:

Passo 1: Acessar configurações
   → Menu "Configurações"
   → Seção "Perfil" ou "Contato"

Passo 2: Adicionar WhatsApp
   → Encontre campo "WhatsApp" ou "Telefone"
   → Digite número completo
   → Formato: (00) 00000-0000
   → Ou apenas números: 00000000000

Passo 3: Selecionar país
   → Escolha código do país
   → Ex: +55 para Brasil
   → Sistema preenche automaticamente

Passo 4: Salvar
   → Clique em "Salvar"
   → WhatsApp é configurado
   → Aparece em seu perfil público

Passo 5: Verificar
   → Veja seu perfil público
   → Confirme se WhatsApp aparece
   → Teste link direto

💡 DICAS:
- Use número que você realmente usa
- Formato é ajustado automaticamente
- Link direto facilita contato

⚠️ PROBLEMAS COMUNS:
- "Número inválido" → Verifique formato
- "Não aparece no perfil" → Recarregue página',
  'configuracao',
  'perfil',
  -33
);

-- FAQ 44: Como configurar slug personalizado
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como configurar meu slug personalizado?',
  ARRAY['configurar', 'slug', 'personalizado', 'link', 'url'],
  '📌 COMO CONFIGURAR SLUG PERSONALIZADO

📝 PASSO A PASSO:

Passo 1: Acessar configurações
   → Menu "Configurações"
   → Seção "Perfil"
   → Encontre campo "Slug" ou "Link Personalizado"

Passo 2: Escolher slug
   → Slug é parte final do seu link
   → Ex: ylada.com/nutri/seu-nome
   → Use apenas: letras, números, hífen (-)
   → Não use espaços ou caracteres especiais

Passo 3: Verificar disponibilidade
   → Sistema verifica se está disponível
   → Se já existe, escolha outro
   → Ex: seu-nome, seu-nome-nutri, etc

Passo 4: Salvar
   → Clique em "Salvar"
   → Slug é configurado
   → Link personalizado fica ativo

Passo 5: Testar link
   → Acesse seu link personalizado
   → Verifique se funciona
   → Compartilhe com clientes

💡 DICAS:
- Use seu nome ou marca
- Seja descritivo mas curto
- Fácil de lembrar e digitar

⚠️ PROBLEMAS COMUNS:
- "Slug já existe" → Escolha variação
- "Caracteres inválidos" → Use apenas letras, números e hífen
- "Muito longo" → Use slug mais curto',
  'configuracao',
  'perfil',
  -34
);

-- FAQ 45: Como atualizar minha bio
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como atualizar minha bio/descrição profissional?',
  ARRAY['atualizar', 'bio', 'descricao', 'profissional', 'sobre'],
  '📌 COMO ATUALIZAR MINHA BIO

📝 PASSO A PASSO:

Passo 1: Acessar configurações
   → Menu "Configurações"
   → Seção "Perfil"
   → Encontre campo "Bio" ou "Sobre Mim"

Passo 2: Escrever bio
   → Seja profissional mas acessível
   → Mencione formação e especializações
   → Destaque sua abordagem
   → Máximo 500-1000 caracteres (geralmente)

Passo 3: Dicas para bio
   → Primeira frase: quem você é
   → Segunda: sua especialização
   → Terceira: sua abordagem
   → Última: como você ajuda

Passo 4: Salvar
   → Clique em "Salvar"
   → Bio é atualizada
   → Aparece em seu perfil público

Passo 5: Visualizar
   → Veja seu perfil público
   → Confirme se bio está correta
   → Ajuste se necessário

💡 DICAS:
- Seja autêntico
- Use linguagem clara
- Destaque diferenciais
- Revise antes de salvar

⚠️ PROBLEMAS COMUNS:
- "Muito longo" → Reduza texto
- "Não aparece" → Recarregue página',
  'configuracao',
  'perfil',
  -35
);

-- FAQ 46: Como adicionar formação profissional
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como adicionar minha formação profissional?',
  ARRAY['adicionar', 'formacao', 'profissional', 'especializacao', 'curso'],
  '📌 COMO ADICIONAR FORMAÇÃO PROFISSIONAL

📝 PASSO A PASSO:

Passo 1: Acessar configurações
   → Menu "Configurações"
   → Seção "Perfil"
   → Encontre "Formação" ou "Especializações"

Passo 2: Adicionar formação
   → Clique em "Adicionar Formação" ou "+"
   → Digite nome do curso/graduação
   → Ex: "Graduação em Nutrição - UFMG"

Passo 3: Adicionar detalhes
   → Instituição
   → Ano de conclusão (opcional)
   → Tipo: Graduação, Especialização, Mestrado, etc

Passo 4: Adicionar mais
   → Adicione todas suas formações
   → Especializações relevantes
   → Cursos importantes

Passo 5: Salvar
   → Clique em "Salvar"
   → Formações aparecem no perfil
   → Organizadas por tipo

💡 DICAS:
- Liste formações relevantes
- Seja específico
- Atualize regularmente

⚠️ NOTA:
- Se não houver seção de formação, entre em contato com suporte
- Funcionalidade pode estar em desenvolvimento',
  'configuracao',
  'perfil',
  -36
);

-- FAQ 47: Como atualizar foto de perfil
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como atualizar minha foto de perfil?',
  ARRAY['atualizar', 'foto', 'perfil', 'avatar', 'imagem'],
  '📌 COMO ATUALIZAR FOTO DE PERFIL

📝 PASSO A PASSO:

Passo 1: Acessar configurações
   → Menu "Configurações"
   → Seção "Perfil"
   → Encontre sua foto atual

Passo 2: Fazer upload
   → Clique na foto atual
   → Ou botão "Alterar Foto"
   → Selecione arquivo de imagem

Passo 3: Requisitos da imagem
   → Formatos: JPG, PNG
   → Tamanho recomendado: 400x400px ou maior
   → Tamanho máximo: 5MB (geralmente)
   → Foto quadrada funciona melhor

Passo 4: Ajustar (se disponível)
   → Recorte se necessário
   → Ajuste posição
   → Visualize prévia

Passo 5: Salvar
   → Clique em "Salvar" ou "Confirmar"
   → Foto é atualizada
   → Aparece em todo o sistema

💡 DICAS:
- Use foto profissional
- Boa iluminação
- Fundo neutro
- Rosto bem visível

⚠️ PROBLEMAS COMUNS:
- "Arquivo muito grande" → Redimensione imagem
- "Formato inválido" → Use JPG ou PNG
- "Upload falhou" → Verifique conexão',
  'configuracao',
  'perfil',
  -37
);

-- FAQ 48: Como configurar notificações
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como configurar minhas notificações?',
  ARRAY['configurar', 'notificacoes', 'alertas', 'email', 'preferencias'],
  '📌 COMO CONFIGURAR NOTIFICAÇÕES

📝 PASSO A PASSO:

Passo 1: Acessar configurações
   → Menu "Configurações"
   → Seção "Notificações" ou "Preferências"
   → Ou ícone de sino

Passo 2: Configurar notificações
   → Email quando receber lead
   → Email quando cliente responder formulário
   → Notificações no sistema
   → Lembrete de pagamentos (se aplicável)

Passo 3: Escolher frequência
   → Imediato: recebe na hora
   → Diário: resumo diário
   → Semanal: resumo semanal
   → Desativar: não recebe

Passo 4: Salvar
   → Clique em "Salvar"
   → Preferências são salvas
   → Notificações configuradas

Passo 5: Testar
   → Teste recebendo um lead
   → Verifique se notificação chegou
   → Ajuste se necessário

💡 DICAS:
- Configure conforme sua necessidade
- Não desative todas (pode perder leads)
- Revise configurações periodicamente

⚠️ NOTA:
- Se não houver seção de notificações, entre em contato com suporte
- Funcionalidade pode estar em desenvolvimento',
  'configuracao',
  'notificacoes',
  -38
);

-- FAQ 49: Como acessar ajuda e suporte
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como acessar ajuda e suporte?',
  ARRAY['ajuda', 'suporte', 'contato', 'duvidas', 'chat'],
  '📌 COMO ACESSAR AJUDA E SUPORTE

📝 PASSO A PASSO:

Passo 1: Chat de suporte
   → Procure ícone de chat no canto inferior direito
   → Clique para abrir
   → Digite sua dúvida

Passo 2: FAQ/Bot
   → Bot tenta responder automaticamente
   → Se não resolver, pode solicitar atendente humano
   → Aguarde resposta

Passo 3: Menu ajuda
   → Menu superior > "Ajuda" ou "Suporte"
   → Acesse FAQ completo
   → Busque por palavras-chave

Passo 4: Email de suporte
   → Envie email para suporte@ylada.com (exemplo)
   → Descreva seu problema
   → Aguarde resposta em até 24h

Passo 5: Documentação
   → Acesse seção "Documentação" ou "Guias"
   → Veja tutoriais passo a passo
   → Resolva dúvidas comuns

💡 DICAS:
- Use chat para dúvidas rápidas
- Email para problemas complexos
- FAQ resolve maioria das dúvidas

⚠️ IMPORTANTE:
- Seja claro ao descrever problema
- Inclua prints se possível
- Aguarde resposta com paciência',
  'suporte',
  'geral',
  -39
);

-- FAQ 50: Como reportar problema técnico
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como reportar um problema técnico?',
  ARRAY['reportar', 'problema', 'tecnico', 'erro', 'bug', 'falha'],
  '📌 COMO REPORTAR PROBLEMA TÉCNICO

📝 PASSO A PASSO:

Passo 1: Identificar problema
   → O que aconteceu?
   → Quando aconteceu?
   → Onde aconteceu (qual página/funcionalidade)?
   → O que você esperava que acontecesse?

Passo 2: Coletar informações
   → Faça print da tela
   → Anote mensagem de erro (se houver)
   → Verifique se acontece sempre ou só às vezes
   → Teste em outro navegador

Passo 3: Reportar via chat
   → Abra chat de suporte
   → Descreva problema detalhadamente
   → Envie prints
   → Aguarde resposta

Passo 4: Reportar via email
   → Envie para suporte@ylada.com (exemplo)
   → Assunto: "Problema Técnico - [resumo]"
   → Descreva tudo no email
   → Anexe prints

Passo 5: Acompanhar
   → Aguarde resposta da equipe
   → Forneça informações adicionais se solicitado
   → Confirme quando problema for resolvido

💡 DICAS:
- Seja o mais específico possível
- Prints ajudam muito
- Informe navegador e sistema operacional
- Teste em outro navegador antes de reportar

⚠️ IMPORTANTE:
- Problemas são priorizados por urgência
- Resposta pode levar algumas horas
- Seja paciente e colaborativo',
  'suporte',
  'tecnico',
  -40
);

-- =====================================================
-- FIM DOS 50 FAQs ESSENCIAIS
-- =====================================================

-- NOTA: Para executar este script:
-- 1. Conecte-se ao Supabase
-- 2. Execute cada lote em ordem (lote1, lote2, lote3)
-- 3. Verifique se todos foram inseridos corretamente
-- 4. Teste o sistema de busca de FAQs

-- Para verificar inserção:
-- SELECT COUNT(*) FROM faq_responses WHERE area = 'nutri';
-- SELECT categoria, COUNT(*) FROM faq_responses WHERE area = 'nutri' GROUP BY categoria;


-- =====================================================
-- YLADA - FAQs ESSENCIAIS ÁREA NUTRI - LOTE 6 (FAQs 81-95)
-- Continuando após os 80 FAQs anteriores
-- =====================================================

-- =====================================================
-- PORTALES - CONTINUAÇÃO (FAQs 81-87)
-- =====================================================

-- FAQ 81: Como duplicar portal
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como duplicar um portal?',
  ARRAY['duplicar', 'portal', 'copiar', 'replicar', 'clonar'],
  '📌 COMO DUPLICAR PORTAL

📝 PASSO A PASSO:

Passo 1: Acessar portais
   → Menu "Portais"
   → Clique em "Meus Portais"
   → Encontre o portal que deseja duplicar

Passo 2: Abrir opções
   → Clique nos três pontos (...) ao lado do portal
   → Ou clique com botão direito no portal
   → Menu de opções aparecerá

Passo 3: Duplicar
   → Clique em "Duplicar" ou "Copiar"
   → Aguarde processamento
   → Portal será duplicado

Passo 4: Configurar cópia
   → Um novo portal será criado
   → Nome será: "[Nome Original] - Cópia"
   → Todas as ferramentas serão copiadas

Passo 5: Personalizar cópia
   → Edite o nome (se necessário)
   → Modifique descrição
   → Adicione ou remova ferramentas
   → Personalize conforme necessário

Passo 6: Salvar
   → Revise alterações
   → Clique em "Salvar"
   → Portal duplicado estará pronto

💡 DICAS:
- Use para criar variações de portais
- Economiza tempo ao criar portais similares
- Cópia é independente do original
- Pode editar sem afetar original

⚠️ IMPORTANTE:
- Ferramentas são copiadas, não duplicadas
- Mesmas ferramentas aparecem em ambos
- Cópia tem link próprio
- Portal duplicado é totalmente independente',
  'portais',
  'criacao',
  -71
);

-- FAQ 82: Como organizar ferramentas no portal
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como organizar ferramentas no portal?',
  ARRAY['organizar', 'ferramentas', 'portal', 'arrumar', 'estruturar'],
  '📌 COMO ORGANIZAR FERRAMENTAS NO PORTAL

📝 PASSO A PASSO:

Passo 1: Acessar portal
   → Menu "Portais"
   → Clique no portal desejado
   → Abra em modo de edição

Passo 2: Ver ferramentas atuais
   → Veja lista de ferramentas no portal
   → Identifique como estão organizadas
   → Planeje nova organização

Passo 3: Organizar por categorias (se disponível)
   → Crie categorias ou seções
   → Exemplos: "Calculadoras", "Quizzes", "Guias"
   → Agrupe ferramentas relacionadas

Passo 4: Reordenar ferramentas
   → Arraste ferramentas para nova posição
   → Organize em ordem lógica
   → Coloque mais importantes primeiro

Passo 5: Agrupar por tipo
   → Agrupe calculadoras juntas
   → Agrupe quizzes juntas
   → Organize por funcionalidade

Passo 6: Organizar por uso
   → Coloque mais usadas no topo
   → Organize por frequência de uso
   → Facilite acesso rápido

Passo 7: Salvar organização
   → Revise organização final
   → Clique em "Salvar"
   → Mudanças serão aplicadas

Passo 8: Visualizar resultado
   → Veja portal organizado
   → Teste navegação
   → Confirme que está intuitivo

💡 DICAS:
- Organize de forma lógica e intuitiva
- Agrupe ferramentas relacionadas
- Coloque mais importantes primeiro
- Facilite navegação do cliente

⚠️ IMPORTANTE:
- Organização melhora experiência
- Pode reorganizar a qualquer momento
- Mudanças são salvas automaticamente
- Facilita uso do portal',
  'portais',
  'organizacao',
  -72
);

-- FAQ 83: Como reordenar ferramentas no portal
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como reordenar ferramentas no portal?',
  ARRAY['reordenar', 'ferramentas', 'portal', 'arrastar', 'organizar'],
  '📌 COMO REORDENAR FERRAMENTAS NO PORTAL

📝 PASSO A PASSO:

Passo 1: Editar portal
   → Menu "Portais"
   → Clique no portal desejado
   → Clique em "Editar"

Passo 2: Entrar em modo de ordenação
   → Ferramentas terão ícone de "arrastar" (⋮⋮)
   → Ou botão "Reordenar Ferramentas"
   → Modo de ordenação será ativado

Passo 3: Arrastar ferramentas
   → Clique e segure na ferramenta
   → Arraste para nova posição
   → Solte quando estiver na posição desejada

Passo 4: Verificar ordem
   → Ferramentas serão reorganizadas
   → Verifique se ordem está correta
   → Continue arrastando se necessário

Passo 5: Organizar logicamente
   → Coloque calculadoras juntas
   → Agrupe quizzes
   → Organize por tipo ou uso

Passo 6: Salvar ordem
   → Clique em "Salvar Portal"
   → Nova ordem será salva
   → Alterações serão aplicadas

Passo 7: Verificar resultado
   → Visualize portal reordenado
   → Teste se navegação está melhor
   → Confirme que está intuitivo

💡 DICAS:
- Arrastar é mais rápido e visual
- Organize em ordem lógica
- Coloque mais importantes primeiro
- Facilite acesso do cliente

⚠️ IMPORTANTE:
- Reordenação é salva automaticamente
- Pode reordenar quantas vezes quiser
- Mudanças são aplicadas imediatamente
- Facilita organização do portal',
  'portais',
  'organizacao',
  -73
);

-- FAQ 84: Como remover ferramenta do portal
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como remover uma ferramenta do portal?',
  ARRAY['remover', 'ferramenta', 'portal', 'excluir', 'retirar'],
  '📌 COMO REMOVER FERRAMENTA DO PORTAL

📝 PASSO A PASSO:

Passo 1: Editar portal
   → Menu "Portais"
   → Clique no portal desejado
   → Clique em "Editar"

Passo 2: Encontrar ferramenta
   → Localize a ferramenta que deseja remover
   → Veja na lista de ferramentas do portal
   → Identifique a ferramenta correta

Passo 3: Remover ferramenta
   → Clique nos três pontos (...) da ferramenta
   → Ou clique no ícone de lixeira
   → Escolha "Remover do Portal"

Passo 4: Confirmar remoção
   → Leia confirmação
   → Clique em "Confirmar" ou "Remover"
   → Ferramenta será removida

Passo 5: Verificar
   → Ferramenta desaparecerá da lista
   → Não aparecerá mais no portal
   → Portal será atualizado

Passo 6: Salvar (se necessário)
   → Alterações podem ser salvas automaticamente
   → Ou clique em "Salvar Portal"
   → Mudanças serão aplicadas

💡 DICAS:
- Remoção não exclui a ferramenta
- Apenas remove do portal
- Pode adicionar novamente depois
- Ferramenta continua existindo

⚠️ IMPORTANTE:
- Ferramenta não é excluída
- Apenas removida do portal
- Pode adicionar novamente quando quiser
- Link da ferramenta continua funcionando',
  'portais',
  'organizacao',
  -74
);

-- FAQ 85: Como compartilhar portal completo
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como compartilhar meu portal completo?',
  ARRAY['compartilhar', 'portal', 'completo', 'link', 'enviar'],
  '📌 COMO COMPARTILHAR PORTAL COMPLETO

📝 PASSO A PASSO:

Passo 1: Acessar portal
   → Menu "Portais"
   → Clique no portal desejado
   → Abra o portal

Passo 2: Obter link
   → Clique em "Compartilhar" ou ícone de compartilhar
   → Copie o link do portal
   → Link será algo como: ylada.app/pt/nutri/seu-slug/portal/nome

Passo 3: Compartilhar por WhatsApp
   → Abra WhatsApp
   → Cole o link na conversa
   → Adicione mensagem personalizada
   → Exemplo: "Acesse meu portal completo com todas as ferramentas!"
   → Envie

Passo 4: Compartilhar por Email
   → Abra seu email
   → Cole o link no corpo do email
   → Adicione descrição do portal
   → Explique o que o cliente encontrará
   → Envie

Passo 5: Compartilhar em redes sociais
   → Copie o link
   → Cole na publicação
   → Adicione descrição atrativa
   → Publique

Passo 6: Compartilhar por QR Code (se disponível)
   → Gere QR Code do portal
   → Imprima ou mostre na tela
   → Cliente escaneia e acessa
   → Facilita acesso offline

Passo 7: Compartilhar em site/blog
   → Use o link do portal
   → Adicione como botão ou link
   → Cliente clica e acessa
   → Integre em sua presença online

💡 DICAS:
- Adicione mensagem personalizada ao compartilhar
- Explique o que o cliente encontrará
- Use em diferentes canais
- Facilite acesso do cliente

⚠️ IMPORTANTE:
- Link é único para cada portal
- Funciona em qualquer dispositivo
- Cliente acessa todas as ferramentas
- Portal é sempre atualizado',
  'portais',
  'compartilhamento',
  -75
);

-- FAQ 86: Como personalizar link do portal
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como personalizar o link do portal?',
  ARRAY['personalizar', 'link', 'portal', 'url', 'slug', 'customizar'],
  '📌 COMO PERSONALIZAR LINK DO PORTAL

📝 PASSO A PASSO:

Passo 1: Acessar portal
   → Menu "Portais"
   → Clique no portal desejado
   → Abra em modo de edição

Passo 2: Acessar configurações
   → Clique em "Configurações" ou "Opções"
   → Ou "Personalizar Link"
   → Seção de link aparecerá

Passo 3: Ver link atual
   → Veja link atual do portal
   → Formato: ylada.app/pt/nutri/seu-slug/portal/nome-atual
   → Identifique parte personalizável

Passo 4: Personalizar slug do portal
   → Encontre campo "Slug" ou "URL Personalizada"
   → Digite novo slug desejado
   → Exemplo: "portal-completo", "minhas-ferramentas"
   → Use apenas letras, números e hífens

Passo 5: Verificar disponibilidade
   → Sistema verificará se slug está disponível
   → Se já existe, escolha outro
   → Se disponível, pode usar

Passo 6: Salvar personalização
   → Revise novo link
   → Clique em "Salvar" ou "Aplicar"
   → Link será atualizado

Passo 7: Verificar novo link
   → Novo link será gerado
   → Formato: ylada.app/pt/nutri/seu-slug/portal/novo-slug
   → Teste se funciona corretamente

Passo 8: Atualizar compartilhamentos
   → Use novo link em compartilhamentos
   → Link antigo pode continuar funcionando (redirecionamento)
   → Ou pode parar de funcionar (depende da configuração)

💡 DICAS:
- Use slug descritivo e fácil de lembrar
- Evite caracteres especiais
- Use apenas letras, números e hífens
- Torne link mais profissional

⚠️ IMPORTANTE:
- Slug deve ser único
- Não pode usar espaços
- Link antigo pode parar de funcionar
- Personalize com cuidado

🔧 LIMITAÇÕES:
- Alguns slugs podem estar reservados
- Deve seguir regras de formato
- Pode ter limite de caracteres
- Verifique disponibilidade antes',
  'portais',
  'compartilhamento',
  -76
);

-- =====================================================
-- CONFIGURAÇÕES E PERFIL (FAQs 87-95)
-- =====================================================

-- FAQ 87: Como alterar meu nome
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como alterar meu nome?',
  ARRAY['alterar', 'nome', 'mudar', 'atualizar', 'editar', 'perfil'],
  '📌 COMO ALTERAR MEU NOME

📝 PASSO A PASSO:

Passo 1: Acessar perfil
   → Clique no seu nome ou avatar (canto superior)
   → Ou menu "Perfil" ou "Configurações"
   → Abra página de perfil

Passo 2: Editar perfil
   → Clique em "Editar Perfil" ou ícone de lápis
   → Ou "Configurações de Conta"
   → Modo de edição será ativado

Passo 3: Alterar nome
   → Encontre campo "Nome" ou "Nome Completo"
   → Digite novo nome
   → Revise se está correto

Passo 4: Salvar alteração
   → Clique em "Salvar" ou "Atualizar"
   → Alteração será salva
   → Nome será atualizado

Passo 5: Verificar
   → Nome atualizado aparecerá no perfil
   → Será exibido em toda a plataforma
   → Mudança será aplicada

💡 DICAS:
- Use seu nome profissional
- Mantenha atualizado
- Nome aparece em ferramentas compartilhadas
- Facilita identificação

⚠️ IMPORTANTE:
- Nome é exibido publicamente
- Aparece em links compartilhados
- Use nome profissional
- Alteração é imediata',
  'configuracoes',
  'perfil',
  -77
);

-- FAQ 88: Como alterar email
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como alterar meu email?',
  ARRAY['alterar', 'email', 'mudar', 'atualizar', 'trocar'],
  '📌 COMO ALTERAR MEU EMAIL

📝 PASSO A PASSO:

Passo 1: Acessar configurações
   → Clique no seu nome ou avatar
   → Menu "Perfil" ou "Configurações"
   → Abra "Configurações de Conta"

Passo 2: Editar email
   → Encontre campo "Email"
   → Clique em "Alterar Email" ou "Editar"
   → Campo de email ficará editável

Passo 3: Digitar novo email
   → Digite novo endereço de email
   → Confirme novo email
   → Verifique se está correto

Passo 4: Verificar email (se necessário)
   → Sistema pode enviar email de verificação
   → Acesse seu email
   → Clique no link de verificação
   → Confirme alteração

Passo 5: Salvar
   → Clique em "Salvar" ou "Atualizar"
   → Alteração será processada
   → Email será atualizado

Passo 6: Verificar
   → Novo email será salvo
   → Receberá notificações no novo email
   → Login será com novo email

💡 DICAS:
- Use email que você acessa regularmente
- Verifique se está correto antes de salvar
- Confirme alteração se solicitado
- Mantenha email atualizado

⚠️ IMPORTANTE:
- Email é usado para login
- Receberá notificações no novo email
- Pode precisar verificar novo email
- Alteração pode exigir confirmação',
  'configuracoes',
  'perfil',
  -78
);

-- FAQ 89: Como atualizar bio profissional
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como atualizar minha bio profissional?',
  ARRAY['atualizar', 'bio', 'profissional', 'descricao', 'sobre', 'editar'],
  '📌 COMO ATUALIZAR BIO PROFISSIONAL

📝 PASSO A PASSO:

Passo 1: Acessar perfil
   → Clique no seu nome ou avatar
   → Menu "Perfil" ou "Configurações"
   → Abra página de perfil

Passo 2: Editar bio
   → Encontre campo "Bio" ou "Sobre Mim"
   → Ou "Descrição Profissional"
   → Clique em "Editar" ou campo ficará editável

Passo 3: Escrever bio
   → Digite sua bio profissional
   → Seja claro e objetivo
   → Destaque sua especialização
   → Inclua formação e experiência

Passo 4: Formatar (se disponível)
   → Use parágrafos para organizar
   → Destaque informações importantes
   → Mantenha texto profissional
   → Revise ortografia

Passo 5: Adicionar informações
   → Formação acadêmica
   → Especializações
   → Anos de experiência
   → Áreas de atuação

Passo 6: Salvar
   → Revise o que escreveu
   → Clique em "Salvar" ou "Atualizar"
   → Bio será salva

Passo 7: Verificar
   → Bio aparecerá no seu perfil
   → Pode aparecer em ferramentas compartilhadas
   → Clientes verão sua bio

💡 DICAS:
- Seja profissional e autêntico
- Destaque seus diferenciais
- Mantenha atualizada
- Use para construir credibilidade

⚠️ IMPORTANTE:
- Bio pode aparecer publicamente
- Use para apresentar-se profissionalmente
- Mantenha informações verdadeiras
- Atualize conforme necessário',
  'configuracoes',
  'perfil',
  -79
);

-- FAQ 90: Como configurar telefone/WhatsApp
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como configurar meu telefone/WhatsApp?',
  ARRAY['configurar', 'telefone', 'whatsapp', 'celular', 'contato'],
  '📌 COMO CONFIGURAR TELEFONE/WHATSAPP

📝 PASSO A PASSO:

Passo 1: Acessar configurações
   → Clique no seu nome ou avatar
   → Menu "Perfil" ou "Configurações"
   → Abra "Configurações de Conta"

Passo 2: Encontrar campo de telefone
   → Procure "Telefone" ou "WhatsApp"
   → Ou "Número de Contato"
   → Campo de telefone aparecerá

Passo 3: Selecionar país
   → Escolha país do telefone
   → Use dropdown ou selecione código
   → Exemplo: +55 para Brasil

Passo 4: Digitar número
   → Digite número do telefone
   → Inclua DDD (se aplicável)
   → Exemplo: (11) 98765-4321
   → Ou apenas números: 11987654321

Passo 5: Verificar formato
   → Sistema pode formatar automaticamente
   → Verifique se está correto
   → Confirme número

Passo 6: Salvar
   → Clique em "Salvar" ou "Atualizar"
   → Número será salvo
   → Configuração será aplicada

Passo 7: Verificar (se disponível)
   → Sistema pode enviar código de verificação
   → Digite código recebido
   → Confirme número

Passo 8: Usar em ferramentas
   → Número será usado em ferramentas
   → Clientes poderão entrar em contato
   → WhatsApp funcionará automaticamente

💡 DICAS:
- Use número que você usa no WhatsApp
- Inclua código do país
- Verifique se está correto
- Mantenha atualizado

⚠️ IMPORTANTE:
- Número é usado para contato
- Aparece em ferramentas compartilhadas
- Clientes podem entrar em contato
- Mantenha número ativo',
  'configuracoes',
  'telefone',
  -80
);

-- FAQ 91: Como alterar país do telefone
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como alterar o país do meu telefone?',
  ARRAY['alterar', 'pais', 'telefone', 'codigo', 'mudar', 'trocar'],
  '📌 COMO ALTERAR PAÍS DO TELEFONE

📝 PASSO A PASSO:

Passo 1: Acessar configurações
   → Clique no seu nome ou avatar
   → Menu "Perfil" ou "Configurações"
   → Abra "Configurações de Conta"

Passo 2: Editar telefone
   → Encontre campo "Telefone" ou "WhatsApp"
   → Clique em "Editar" ou campo
   → Modo de edição será ativado

Passo 3: Alterar país
   → Clique no dropdown de país
   → Ou campo "Código do País"
   → Escolha novo país

Passo 4: Atualizar número (se necessário)
   → Número pode precisar ser ajustado
   → Remova código antigo se houver
   → Digite número sem código de país
   → Sistema adicionará código automaticamente

Passo 5: Verificar formato
   → Veja formato completo
   → Exemplo: +55 11 98765-4321
   → Confirme se está correto

Passo 6: Salvar
   → Clique em "Salvar" ou "Atualizar"
   → Alteração será salva
   → País será atualizado

Passo 7: Verificar
   → Telefone aparecerá com novo código
   → Formato será atualizado
   → Configuração será aplicada

💡 DICAS:
- Código do país é adicionado automaticamente
- Número deve estar sem código ao digitar
- Verifique formato antes de salvar
- Mantenha atualizado

⚠️ IMPORTANTE:
- Código do país é necessário
- Formato é atualizado automaticamente
- Número deve estar correto
- Alteração é imediata',
  'configuracoes',
  'telefone',
  -81
);

-- FAQ 92: Por que meu telefone não salva
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Por que meu telefone não está salvando?',
  ARRAY['telefone', 'nao', 'salva', 'salvar', 'problema', 'erro'],
  '📌 POR QUE MEU TELEFONE NÃO SALVA

🔍 POSSÍVEIS CAUSAS E SOLUÇÕES:

1. FORMATO INCORRETO
   → Problema: Número em formato inválido
   → Solução: Use apenas números
   → Exemplo: 11987654321 (sem espaços ou caracteres)

2. CÓDIGO DO PAÍS FALTANDO
   → Problema: País não selecionado
   → Solução: Selecione país no dropdown
   → Sistema precisa do código do país

3. NÚMERO MUITO CURTO OU LONGO
   → Problema: Número incompleto ou com dígitos extras
   → Solução: Verifique quantidade de dígitos
   → Use formato correto do país

4. CAMPOS OBRIGATÓRIOS
   → Problema: Algum campo obrigatório não preenchido
   → Solução: Preencha todos os campos obrigatórios
   → Verifique se há asteriscos (*)

5. CONEXÃO OU NAVEGADOR
   → Problema: Problema de conexão
   → Solução: Verifique internet
   → Tente em outro navegador
   → Limpe cache do navegador

6. VERIFICAÇÃO PENDENTE
   → Problema: Precisa verificar número
   → Solução: Verifique email ou SMS
   → Complete processo de verificação

7. PERMISSÕES
   → Problema: Navegador bloqueando
   → Solução: Permita salvamento
   → Verifique configurações do navegador

💡 DICAS:
- Use formato: código do país + número
- Exemplo Brasil: +55 11 98765-4321
- Remova espaços e caracteres especiais
- Verifique se país está selecionado

⚠️ SE AINDA NÃO FUNCIONAR:
- Tente em outro navegador
- Limpe cache e cookies
- Entre em contato com suporte
- Envie print do erro se houver',
  'configuracoes',
  'telefone',
  -82
);

-- FAQ 93: Como configurar slug personalizado
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como configurar meu slug personalizado?',
  ARRAY['configurar', 'slug', 'personalizado', 'url', 'link', 'customizar'],
  '📌 COMO CONFIGURAR SLUG PERSONALIZADO

📝 PASSO A PASSO:

Passo 1: Acessar configurações
   → Clique no seu nome ou avatar
   → Menu "Perfil" ou "Configurações"
   → Abra "Configurações de Conta"

Passo 2: Encontrar slug
   → Procure "Slug" ou "URL Personalizada"
   → Ou "Link Personalizado"
   → Campo de slug aparecerá

Passo 3: Ver slug atual
   → Veja slug atual (se houver)
   → Formato: ylada.app/pt/nutri/seu-slug-atual
   → Identifique parte personalizável

Passo 4: Personalizar slug
   → Digite novo slug desejado
   → Use apenas letras minúsculas, números e hífens
   → Exemplo: "dra-ana-silva", "nutri-maria"
   → Seja descritivo e profissional

Passo 5: Verificar disponibilidade
   → Sistema verificará se está disponível
   → Se já existe, escolha outro
   → Se disponível, pode usar

Passo 6: Salvar
   → Revise novo slug
   → Clique em "Salvar" ou "Aplicar"
   → Slug será atualizado

Passo 7: Verificar novo link
   → Novo link será gerado
   → Formato: ylada.app/pt/nutri/novo-slug
   → Teste se funciona

Passo 8: Atualizar compartilhamentos
   → Use novo link em compartilhamentos
   → Link antigo pode parar de funcionar
   → Atualize links compartilhados

💡 DICAS:
- Use slug profissional e fácil de lembrar
- Evite caracteres especiais
- Use apenas letras, números e hífens
- Torne link mais profissional

⚠️ IMPORTANTE:
- Slug deve ser único
- Não pode usar espaços ou maiúsculas
- Link antigo pode parar de funcionar
- Personalize com cuidado

🔧 LIMITAÇÕES:
- Alguns slugs podem estar reservados
- Deve seguir regras de formato
- Pode ter limite de caracteres
- Verifique disponibilidade antes',
  'configuracoes',
  'slug',
  -83
);

-- FAQ 94: O que é slug e para que serve
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'O que é slug e para que serve?',
  ARRAY['slug', 'o que e', 'para que serve', 'url', 'link', 'explicacao'],
  '📌 O QUE É SLUG E PARA QUE SERVE

🎯 O QUE É SLUG:
- Parte personalizada da sua URL
- Identificador único na plataforma
- Aparece no link das suas ferramentas
- Exemplo: ylada.app/pt/nutri/seu-slug

📝 PARA QUE SERVE:

1. LINK PERSONALIZADO
   → Cria link único para você
   → Facilita compartilhamento
   → Torna link mais profissional
   → Exemplo: ylada.app/pt/nutri/dra-ana

2. IDENTIFICAÇÃO
   → Identifica você na plataforma
   → Diferencia de outros usuários
   → Cria sua "marca" na URL
   → Facilita reconhecimento

3. PROFISSIONALISMO
   → Link mais profissional
   → Mais fácil de lembrar
   → Transmite credibilidade
   → Melhora imagem profissional

4. COMPARTILHAMENTO
   → Facilita compartilhar links
   → Link mais curto e claro
   → Cliente lembra mais fácil
   → Melhora experiência

5. ORGANIZAÇÃO
   → Todas suas ferramentas usam mesmo slug
   → Organiza seus links
   → Facilita gestão
   → Cria consistência

💡 EXEMPLOS:
- Sem slug: ylada.app/pt/nutri/user-12345
- Com slug: ylada.app/pt/nutri/dra-ana-silva
- Mais profissional e fácil de lembrar

⚠️ IMPORTANTE:
- Slug é parte da sua identidade online
- Escolha com cuidado
- Pode afetar todos os seus links
- Use nome profissional',
  'configuracoes',
  'slug',
  -84
);

-- FAQ 95: Posso alterar meu slug depois
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Posso alterar meu slug depois?',
  ARRAY['alterar', 'slug', 'depois', 'mudar', 'trocar', 'modificar'],
  '📌 POSSO ALTERAR MEU SLUG DEPOIS

📝 SOBRE ALTERAÇÃO:

SIM, PODE ALTERAR:
   → Pode alterar slug a qualquer momento
   → Acesse configurações
   → Modifique slug
   → Salve alteração

⚠️ ATENÇÃO - CONSEQUÊNCIAS:

1. LINKS ANTIGOS
   → Links antigos podem parar de funcionar
   → Ou podem redirecionar (depende da configuração)
   → Clientes podem ter problemas de acesso
   → Precisa atualizar compartilhamentos

2. COMPARTILHAMENTOS
   → Links já compartilhados podem quebrar
   → Precisa atualizar todos os links
   → QR codes antigos podem não funcionar
   → Pode perder acessos

3. SEO E INDEXAÇÃO
   → Links antigos podem estar indexados
   → Pode afetar busca no Google
   → Redirecionamento ajuda (se disponível)
   → Mas melhor evitar mudanças frequentes

4. MARCA E IDENTIDADE
   → Slug é parte da sua identidade
   → Mudanças frequentes confundem
   → Melhor escolher bem desde o início
   → Evite mudanças desnecessárias

💡 RECOMENDAÇÕES:
- Escolha slug definitivo desde o início
- Use nome profissional que não mudará
- Evite mudanças frequentes
- Pense bem antes de alterar

⚠️ IMPORTANTE:
- Pode alterar, mas não é recomendado
- Links antigos podem quebrar
- Atualize todos os compartilhamentos
- Melhor escolher bem desde o início

🔧 SE PRECISAR ALTERAR:
- Acesse configurações
- Modifique slug
- Salve alteração
- Atualize todos os links compartilhados',
  'configuracoes',
  'slug',
  -85
);

-- =====================================================
-- FIM DO LOTE 6 (FAQs 81-95)
-- =====================================================

-- NOTA: Para executar este script:
-- 1. Conecte-se ao Supabase
-- 2. Execute este arquivo (lote6)
-- 3. Verifique se todos foram inseridos corretamente
-- 4. Teste o sistema de busca de FAQs

-- Para verificar inserção:
-- SELECT COUNT(*) FROM faq_responses WHERE area = 'nutri';
-- SELECT categoria, COUNT(*) FROM faq_responses WHERE area = 'nutri' GROUP BY categoria;


-- =====================================================
-- YLADA - POPULAR FAQs DE EXEMPLO - ÁREA NUTRI
-- FAQs de exemplo para testar o sistema de suporte
-- =====================================================

-- Nota: Substitua 'SEU_USER_ID_AQUI' pelo ID de um usuário admin/support
-- Você pode pegar o ID executando: SELECT id FROM auth.users WHERE email = 'seu-email@exemplo.com';

-- =====================================================
-- FERRAMENTAS E TEMPLATES
-- =====================================================

-- 1. Como criar uma calculadora de IMC
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como criar uma calculadora de IMC?',
  ARRAY['criar', 'calculadora', 'imc', 'indice', 'massa', 'corporal'],
  '📌 COMO CRIAR UMA CALCULADORA DE IMC

🎯 O QUE VOCÊ VAI APRENDER:
- Como acessar a criação de ferramentas
- Como escolher o template de calculadora
- Como personalizar os campos
- Como salvar e compartilhar

📝 PASSO A PASSO:

Passo 1: Acessar a área de ferramentas
   → No menu lateral, clique em "Ferramentas"
   → Clique no botão "Nova Ferramenta" (canto superior direito)
   → Você será redirecionado para a página de criação

Passo 2: Escolher o template
   → Na página de criação, você verá uma lista de templates
   → Procure por "Calculadora de IMC" ou "Calculadora"
   → Clique em "Usar este template" ou "Criar do zero"

Passo 3: Preencher informações básicas
   → Nome da ferramenta: Ex: "Minha Calculadora de IMC"
   → Descrição: Ex: "Calcule seu IMC de forma rápida e precisa"
   → Emoji: Escolha um emoji (opcional)
   → Clique em "Próximo"

Passo 4: Configurar os campos
   → Você verá os campos: Peso (kg) e Altura (cm)
   → Personalize os labels se desejar
   → Defina se são obrigatórios ou não
   → Clique em "Próximo"

Passo 5: Personalizar o resultado
   → Escolha como o resultado será exibido
   → Personalize a mensagem de resultado
   → Configure cores e estilo (opcional)
   → Clique em "Próximo"

Passo 6: Configurar CTA (Call to Action)
   → Escolha o tipo: WhatsApp ou URL externa
   → Se WhatsApp: Digite seu número completo (com código do país)
   → Se URL: Cole o link desejado
   → Personalize o texto do botão
   → Clique em "Salvar"

Passo 7: Compartilhar sua ferramenta
   → Após salvar, você verá seu link único
   → Copie o link ou gere QR code
   → Compartilhe com seus pacientes

💡 DICAS IMPORTANTES:
- Use nomes descritivos para facilitar identificação depois
- Teste a calculadora antes de compartilhar
- Personalize as cores para combinar com sua marca
- Salve o link em local seguro para reutilizar depois

⚠️ PROBLEMAS COMUNS:
- "Não consigo ver o template" → Atualize a página (F5) e tente novamente
- "O botão salvar não funciona" → Verifique se preencheu todos os campos obrigatórios
- "Não recebo leads" → Verifique se configurou o WhatsApp corretamente

🔗 PRÓXIMOS PASSOS:
- Aprenda a criar outras calculadoras
- Saiba como organizar ferramentas em portais
- Descubra como gerar QR codes para compartilhar',
  'ferramentas',
  'calculadoras',
  10
);

-- 2. Como criar um quiz
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como criar um quiz personalizado?',
  ARRAY['criar', 'quiz', 'personalizado', 'perguntas'],
  '📌 COMO CRIAR UM QUIZ PERSONALIZADO

🎯 O QUE VOCÊ VAI APRENDER:
- Como criar quiz do zero
- Como adicionar perguntas
- Como configurar respostas
- Como personalizar resultados

📝 PASSO A PASSO:

Passo 1: Acessar criação de quiz
   → No menu lateral, clique em "Quiz Personalizado"
   → Ou acesse "Ferramentas" > "Nova Ferramenta" > "Quiz"

Passo 2: Configurar informações básicas
   → Defina o nome do quiz
   → Adicione uma descrição atrativa
   → Escolha um emoji representativo

Passo 3: Adicionar perguntas
   → Clique em "Adicionar Pergunta"
   → Digite sua pergunta
   → Adicione as opções de resposta
   → Defina qual resposta é correta (se aplicável)

Passo 4: Configurar resultados
   → Defina os possíveis resultados do quiz
   → Personalize as mensagens para cada resultado
   → Adicione diagnósticos ou recomendações

Passo 5: Configurar CTA
   → Escolha WhatsApp ou URL externa
   → Personalize mensagem de contato
   → Salve o quiz

💡 DICAS IMPORTANTES:
- Faça perguntas claras e objetivas
- Use linguagem acessível
- Teste o fluxo completo antes de publicar

⚠️ PROBLEMAS COMUNS:
- "Pergunta não salva" → Verifique se preencheu todos os campos obrigatórios
- "Resultado não aparece" → Confira se configurou os resultados corretamente',
  'ferramentas',
  'quizzes',
  9
);

-- 3. Como compartilhar ferramenta
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como compartilhar minha ferramenta?',
  ARRAY['compartilhar', 'ferramenta', 'link', 'qr', 'code', 'whatsapp'],
  '📌 COMO COMPARTILHAR SUA FERRAMENTA

🎯 O QUE VOCÊ VAI APRENDER:
- Como obter o link da ferramenta
- Como gerar QR code
- Como usar short codes
- Estratégias de compartilhamento

📝 PASSO A PASSO:

Passo 1: Obter o link
   → Acesse "Ferramentas" no menu
   → Clique na ferramenta desejada
   → Copie o link único exibido
   → Formato: ylada.app/nutri/[seu-slug]/[nome-ferramenta]

Passo 2: Gerar QR Code
   → Na página da ferramenta, clique em "Gerar QR Code"
   → Baixe a imagem do QR code
   → Use em materiais impressos ou digitais

Passo 3: Usar Short Code
   → Cada ferramenta tem um código curto único
   → Use para compartilhar de forma rápida
   → Exemplo: ylada.app/abc123

Passo 4: Compartilhar
   → WhatsApp: Envie o link diretamente
   → Instagram: Use nos stories ou bio
   → Email: Inclua no corpo do email
   → Material impresso: Use o QR code

💡 DICAS IMPORTANTES:
- Teste o link antes de compartilhar
- Use QR codes em consultórios e eventos
- Personalize a mensagem ao compartilhar

⚠️ PROBLEMAS COMUNS:
- "Link não funciona" → Verifique se a ferramenta está ativa
- "QR code não escaneia" → Use QR codes de alta qualidade',
  'portais',
  'compartilhamento',
  8
);

-- =====================================================
-- FORMULÁRIOS
-- =====================================================

-- 4. Como criar formulário
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como criar um formulário personalizado?',
  ARRAY['criar', 'formulario', 'formulário', 'personalizado', 'campos'],
  '📌 COMO CRIAR UM FORMULÁRIO PERSONALIZADO

🎯 O QUE VOCÊ VAI APRENDER:
- Como acessar criação de formulários
- Como usar formulários pré-montados
- Como criar do zero
- Como adicionar campos

📝 PASSO A PASSO:

Passo 1: Acessar formulários
   → No menu lateral, clique em "Formulários"
   → Clique em "Novo Formulário"

Passo 2: Escolher opção
   → "Usar formulário pré-montado": Escolha um template
   → "Criar do zero": Comece do zero

Passo 3: Adicionar campos
   → Clique em "Adicionar Campo"
   → Escolha o tipo: texto, número, data, etc
   → Configure se é obrigatório
   → Defina label e placeholder

Passo 4: Organizar campos
   → Arraste para reordenar
   → Agrupe campos relacionados
   → Salve o formulário

Passo 5: Enviar para clientes
   → Clique em "Enviar"
   → Escolha o cliente ou cole o email
   → Personalize a mensagem
   → Envie

💡 DICAS IMPORTANTES:
- Use formulários pré-montados como base
- Mantenha formulários objetivos
- Teste antes de enviar

⚠️ PROBLEMAS COMUNS:
- "Campo não aparece" → Verifique se salvou o formulário
- "Cliente não recebe" → Confira o email do cliente',
  'formularios',
  'criacao',
  7
);

-- =====================================================
-- CLIENTES E LEADS
-- =====================================================

-- 5. Como ver meus leads
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como visualizar e gerenciar meus leads?',
  ARRAY['ver', 'leads', 'visualizar', 'gerenciar', 'listar'],
  '📌 COMO VISUALIZAR E GERENCIAR LEADS

🎯 O QUE VOCÊ VAI APRENDER:
- Como acessar a área de leads
- Como visualizar informações dos leads
- Como converter lead em cliente
- Como filtrar e buscar leads

📝 PASSO A PASSO:

Passo 1: Acessar leads
   → No menu lateral, clique em "Leads"
   → Você verá a lista de todos os leads

Passo 2: Visualizar informações
   → Clique em um lead para ver detalhes
   → Veja nome, email, telefone
   → Veja qual ferramenta gerou o lead
   → Veja data e hora do cadastro

Passo 3: Converter em cliente
   → Clique em "Converter em Cliente"
   → Preencha informações adicionais se necessário
   → O lead vira cliente automaticamente

Passo 4: Filtrar leads
   → Use os filtros por data
   → Filtre por ferramenta
   → Busque por nome ou email

💡 DICAS IMPORTANTES:
- Converta leads rapidamente para não perder oportunidades
- Organize leads por prioridade
- Use tags para categorizar

⚠️ PROBLEMAS COMUNS:
- "Não vejo leads" → Verifique se suas ferramentas estão ativas
- "Lead duplicado" → Sistema previne duplicatas automaticamente',
  'clientes',
  'leads',
  6
);

-- =====================================================
-- CONFIGURAÇÕES
-- =====================================================

-- 6. Como configurar perfil
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como configurar meu perfil?',
  ARRAY['configurar', 'perfil', 'configuracoes', 'configurações', 'dados'],
  '📌 COMO CONFIGURAR SEU PERFIL

🎯 O QUE VOCÊ VAI APRENDER:
- Como acessar configurações
- Como atualizar informações pessoais
- Como configurar telefone e país
- Como definir slug personalizado

📝 PASSO A PASSO:

Passo 1: Acessar configurações
   → No menu lateral, clique em "Configurações"
   → Ou acesse pelo menu de perfil

Passo 2: Atualizar informações básicas
   → Nome completo: Seu nome profissional
   → Email: Seu email de contato
   → Bio: Sua descrição profissional

Passo 3: Configurar telefone
   → Selecione o país pela bandeira
   → Digite o número completo
   → O número será usado para WhatsApp também

Passo 4: Configurar slug
   → Defina seu slug único (ex: joaosilva)
   → Será usado nas suas URLs
   → Apenas letras e números, sem espaços

Passo 5: Salvar alterações
   → Clique em "Salvar Alterações"
   → Aguarde confirmação
   → Suas alterações serão salvas

💡 DICAS IMPORTANTES:
- Use um slug fácil de lembrar
- Mantenha informações atualizadas
- O slug não pode ser alterado depois (escolha com cuidado)

⚠️ PROBLEMAS COMUNS:
- "Slug não disponível" → Escolha outro nome único
- "Telefone não salva" → Verifique se selecionou o país corretamente
- "Alterações não salvam" → Atualize a página e tente novamente',
  'configuracoes',
  'perfil',
  5
);

-- =====================================================
-- PORTAL
-- =====================================================

-- 7. Como criar portal
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como criar meu portal personalizado?',
  ARRAY['criar', 'portal', 'personalizado', 'organizar', 'ferramentas'],
  '📌 COMO CRIAR SEU PORTAL PERSONALIZADO

🎯 O QUE VOCÊ VAI APRENDER:
- Como criar um portal
- Como organizar ferramentas no portal
- Como personalizar aparência
- Como compartilhar portal

📝 PASSO A PASSO:

Passo 1: Acessar portais
   → No menu lateral, clique em "Portais"
   → Clique em "Novo Portal"

Passo 2: Configurar portal
   → Nome do portal: Ex: "Meu Portal Nutricional"
   → Descrição: Descreva seu portal
   → Escolha um slug único

Passo 3: Adicionar ferramentas
   → Selecione as ferramentas que deseja incluir
   → Organize a ordem de exibição
   → Arraste para reordenar

Passo 4: Personalizar
   → Escolha cores e estilo
   → Adicione sua foto ou logo
   → Configure layout

Passo 5: Publicar e compartilhar
   → Salve o portal
   → Copie o link único
   → Compartilhe com pacientes

💡 DICAS IMPORTANTES:
- Organize ferramentas por categoria
- Use um nome descritivo
- Teste o portal antes de compartilhar

⚠️ PROBLEMAS COMUNS:
- "Ferramenta não aparece" → Verifique se a ferramenta está ativa
- "Link não funciona" → Confira se o portal está publicado',
  'portais',
  'criacao',
  4
);

-- =====================================================
-- RELATÓRIOS
-- =====================================================

-- 8. Como ver relatórios
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como visualizar relatórios de leads e conversões?',
  ARRAY['relatorios', 'relatórios', 'leads', 'conversoes', 'conversões', 'analytics'],
  '📌 COMO VISUALIZAR RELATÓRIOS

🎯 O QUE VOCÊ VAI APRENDER:
- Como acessar relatórios
- Como interpretar os dados
- Como filtrar por período
- Como exportar dados

📝 PASSO A PASSO:

Passo 1: Acessar relatórios
   → No menu lateral, clique em "Relatórios"
   → Escolha o tipo: "Leads" ou "Gestão"

Passo 2: Visualizar dados
   → Veja gráficos de conversão
   → Analise leads por período
   → Veja ferramentas mais usadas

Passo 3: Filtrar informações
   → Selecione período (últimos 7 dias, 30 dias, etc)
   → Filtre por ferramenta
   → Filtre por status

Passo 4: Exportar (se disponível)
   → Clique em "Exportar"
   → Escolha formato (CSV, Excel)
   → Baixe o arquivo

💡 DICAS IMPORTANTES:
- Consulte relatórios regularmente
- Use dados para melhorar estratégias
- Compare períodos diferentes

⚠️ PROBLEMAS COMUNS:
- "Dados não aparecem" → Verifique se há leads no período
- "Gráfico vazio" → Pode não haver dados suficientes ainda',
  'relatorios',
  'visualizacao',
  3
);

-- =====================================================
-- PROBLEMAS TÉCNICOS
-- =====================================================

-- 9. Problema ao salvar
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Não consigo salvar minhas alterações, o que fazer?',
  ARRAY['salvar', 'nao', 'salva', 'erro', 'problema', 'alteracoes'],
  '📌 PROBLEMA AO SALVAR - SOLUÇÕES

🎯 POSSÍVEIS CAUSAS:
- Campos obrigatórios não preenchidos
- Problema de conexão
- Cache do navegador
- Sessão expirada

📝 SOLUÇÕES:

Solução 1: Verificar campos obrigatórios
   → Revise todos os campos marcados com *
   → Preencha todos os campos obrigatórios
   → Tente salvar novamente

Solução 2: Verificar conexão
   → Verifique sua conexão com internet
   → Tente recarregar a página
   → Aguarde alguns segundos e tente novamente

Solução 3: Limpar cache
   → Pressione Ctrl+Shift+R (Windows) ou Cmd+Shift+R (Mac)
   → Ou limpe o cache do navegador
   → Tente salvar novamente

Solução 4: Fazer login novamente
   → Faça logout e login novamente
   → Isso renova sua sessão
   → Tente salvar novamente

💡 DICAS IMPORTANTES:
- Sempre preencha campos obrigatórios primeiro
- Salve frequentemente para não perder dados
- Use navegadores atualizados

⚠️ SE NADA FUNCIONAR:
- Entre em contato com o suporte
- Informe qual página estava tentando salvar
- Informe qual mensagem de erro apareceu',
  'problemas',
  'tecnicos',
  2
);

-- 10. Falar com humano (genérico)
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como falar com um atendente humano?',
  ARRAY['falar', 'humano', 'atendente', 'suporte', 'ajuda', 'contato'],
  '📌 COMO FALAR COM ATENDENTE HUMANO

🎯 OPÇÕES DISPONÍVEIS:
- Chat de suporte na plataforma
- Criar ticket de suporte
- Aguardar resposta do atendente

📝 PASSO A PASSO:

Passo 1: Abrir chat de suporte
   → Clique no ícone de chat no canto inferior direito
   → Ou acesse "Suporte" no menu

Passo 2: Solicitar atendimento
   → Digite sua dúvida ou problema
   → Ou clique em "Falar com Atendente Humano"
   → Um ticket será criado automaticamente

Passo 3: Aguardar resposta
   → Um atendente entrará em contato
   → Você receberá notificação quando responder
   → Continue a conversa pelo chat

💡 DICAS IMPORTANTES:
- Seja específico sobre sua dúvida
- Inclua detalhes do problema
- Aguarde resposta (geralmente em poucos minutos)

⚠️ TEMPO DE RESPOSTA:
- Horário comercial: Resposta rápida
- Fora do horário: Resposta no próximo dia útil',
  'suporte',
  1
);

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar FAQs criados
SELECT 
  id,
  pergunta,
  categoria,
  subcategoria,
  array_length(palavras_chave, 1) as total_palavras_chave,
  ordem_prioridade
FROM faq_responses
WHERE area = 'nutri'
ORDER BY ordem_prioridade DESC, pergunta;


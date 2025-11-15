export interface Tutorial {
  id: string
  titulo: string
  categoria: string
  conteudo: string
  tags: string[]
}

export const tutoriaisData: Tutorial[] = [
  {
    "id": "1",
    "titulo": "Como Criar Sua Conta e Configurar Seu Perfil",
    "categoria": "primeiros-passos",
    "tags": [
      "cadastro",
      "perfil",
      "configuração",
      "user-slug"
    ],
    "conteudo": "### O que é necessário?\nPara usar o YLADA Wellness, você precisa criar uma conta e configurar seu perfil. Isso permite criar ferramentas, portais e acompanhar seus resultados.\n\n### Passo a passo:\n\n**1. Criar conta:**\n- Acesse a página de cadastro\n- Informe seu nome completo, email e senha\n- Confirme seu email (verifique a caixa de entrada)\n- Faça login\n\n**2. Configurar perfil:**\n- Acesse \"Configurações\" ou \"Perfil\"\n- Preencha:\n  - Nome completo\n  - Profissão\n  - Nome na URL (`user_slug`) — será usado em todas as suas URLs\n  - Foto de perfil (opcional)\n\n**3. Nome na URL (`user_slug`):**\n- Escolha um nome único e fácil de lembrar\n- Exemplos: `maria-nutricionista`, `joao-coach`\n- Será usado assim: `ylada.app/pt/wellness/[seu-nome]/[ferramenta]`\n- Não pode conter espaços ou caracteres especiais\n- Não pode ser alterado depois (escolha com cuidado)\n\n**4. Dicas importantes:**\n- Use um nome profissional\n- Evite números e caracteres especiais\n- Pense em como seus clientes vão lembrar da URL\n\n**Problemas comuns:**\n- \"Nome já está em uso\": escolha outro nome\n- \"Email não confirmado\": verifique a caixa de entrada e spam\n- \"Senha muito fraca\": use pelo menos 8 caracteres, com letras e números"
  },
  {
    "id": "2",
    "titulo": "Navegação no Dashboard",
    "categoria": "primeiros-passos",
    "tags": [
      "dashboard",
      "navegação",
      "estatísticas",
      "menu"
    ],
    "conteudo": "### O que é o Dashboard?\nO Dashboard é o painel principal do YLADA Wellness. Mostra estatísticas, acesso rápido às ferramentas e visão geral da sua conta.\n\n### Elementos do Dashboard:\n\n**1. Estatísticas gerais:**\n- Total de visualizações: quantas vezes suas ferramentas foram acessadas\n- Leads gerados: quantos contatos você recebeu\n- Taxa de conversão: porcentagem de visitantes que viraram leads\n- Ferramentas ativas: quantas ferramentas você tem publicadas\n\n**2. Menu de navegação:**\n- Dashboard: volta para esta página\n- Ferramentas: lista todas as suas ferramentas\n- Templates: modelos prontos para criar ferramentas\n- Portais: seus portais de bem-estar\n- Módulos: materiais e cursos disponíveis\n- Configurações: ajustes do perfil\n\n**3. Ferramentas recentes:**\n- Lista das últimas ferramentas criadas ou editadas\n- Acesso rápido para editar ou visualizar\n\n**4. Chat IA:**\n- Assistente virtual para dúvidas\n- Ajuda com criação de conteúdo\n- Sugestões de melhorias\n\n**Como usar:**\n- Acompanhe suas estatísticas regularmente\n- Use o menu para navegar entre as seções\n- Clique em uma ferramenta para ver detalhes ou editar\n\n**Dicas:**\n- Verifique as estatísticas semanalmente\n- Use o Chat IA quando tiver dúvidas\n- Organize suas ferramentas pelo nome para facilitar a busca"
  },
  {
    "id": "3",
    "titulo": "Como Criar Sua Primeira Ferramenta",
    "categoria": "primeiros-passos",
    "tags": [
      "ferramenta",
      "criar",
      "template",
      "primeiros-passos"
    ],
    "conteudo": "### O que é uma ferramenta?\nUma ferramenta é um recurso criado por você para seus clientes. Pode ser uma calculadora, questionário, guia ou outro recurso baseado em templates.\n\n### Passo a passo completo:\n\n**1. Acessar criação:**\n- No Dashboard, clique em \"Ferramentas\"\n- Clique em \"Nova Ferramenta\" ou \"+\"\n\n**2. Escolher template:**\n- Veja os templates disponíveis\n- Cada template tem um propósito específico\n- Clique no template desejado\n\n**3. Preencher informações básicas:**\n- Título: nome da ferramenta (ex: \"Calculadora de IMC\")\n- Descrição: explique o que a ferramenta faz\n- Emoji: escolha um ícone (opcional, mas recomendado)\n- Slug da ferramenta: nome na URL (ex: `calculadora-imc`)\n\n**4. Entender a URL completa:**\n- Sua URL será: `ylada.app/pt/wellness/[seu-user-slug]/[slug-da-ferramenta]`\n- Exemplo: `ylada.app/pt/wellness/maria-nutri/calculadora-imc`\n- O `user_slug` garante que sua URL seja única, mesmo se outro usuário usar o mesmo slug da ferramenta\n\n**5. Personalizar conteúdo:**\n- Preencha os campos específicos do template\n- Adicione informações relevantes\n- Revise antes de publicar\n\n**6. Configurar CTA (Call-to-Action):**\n- Escolha o tipo: WhatsApp ou Link Externo\n- Se WhatsApp: informe o número e mensagem padrão\n- Se Link Externo: informe a URL de destino\n- Personalize o texto do botão\n\n**7. Publicar:**\n- Clique em \"Salvar\" ou \"Publicar\"\n- Sua ferramenta estará ativa\n- Copie o link para compartilhar\n\n**Dicas importantes:**\n- Use títulos claros e objetivos\n- Descreva bem o que a ferramenta faz\n- Teste antes de compartilhar\n- Escolha um slug descritivo e fácil de lembrar\n\n**Problemas comuns:**\n- \"Slug já está em uso\": escolha outro nome para o slug\n- \"Campos obrigatórios\": preencha todos os campos marcados com *\n- \"Erro ao salvar\": verifique sua conexão e tente novamente"
  },
  {
    "id": "4",
    "titulo": "Templates Disponíveis e Quando Usar Cada Um",
    "categoria": "funcionalidades",
    "tags": [
      "templates",
      "modelos",
      "escolha",
      "guia"
    ],
    "conteudo": "### O que são templates?\nTemplates são modelos prontos de ferramentas. Você escolhe um e personaliza com suas informações.\n\n### Lista de templates e quando usar:\n\n**1. Calculadora de IMC:**\n- Quando usar: para nutricionistas que querem calcular IMC dos clientes\n- O que faz: calcula IMC e classifica\n- Personalização: cores, textos explicativos\n\n**2. Questionário de Anamnese:**\n- Quando usar: coleta de informações do cliente antes da consulta\n- O que faz: formulário com perguntas personalizáveis\n- Personalização: adicione suas perguntas específicas\n\n**3. Guia de Hidratação:**\n- Quando usar: educar sobre importância da água\n- O que faz: apresenta informações sobre hidratação\n- Personalização: adicione suas recomendações\n\n**4. Calculadora de Calorias:**\n- Quando usar: ajudar clientes a entender necessidades calóricas\n- O que faz: calcula calorias baseado em dados\n- Personalização: ajuste fórmulas e recomendações\n\n**5. Plano Alimentar Interativo:**\n- Quando usar: criar planos personalizados\n- O que faz: permite criar e compartilhar planos\n- Personalização: adicione refeições e orientações\n\n**6. Avaliação de Composição Corporal:**\n- Quando usar: avaliar composição corporal\n- O que faz: coleta medidas e calcula indicadores\n- Personalização: ajuste campos e cálculos\n\n**Como escolher o template certo:**\n1. Defina o objetivo da ferramenta\n2. Veja qual template se encaixa melhor\n3. Considere o público-alvo\n4. Pense em como vai usar os resultados\n\n**Dicas:**\n- Comece com templates simples\n- Teste antes de compartilhar\n- Personalize para sua marca\n- Use templates diferentes para diferentes necessidades"
  },
  {
    "id": "5",
    "titulo": "Personalização de Ferramentas",
    "categoria": "funcionalidades",
    "tags": [
      "personalização",
      "cores",
      "design",
      "marca"
    ],
    "conteudo": "### O que é personalização?\nPersonalizar é adaptar a ferramenta à sua marca, estilo e necessidades.\n\n### Elementos que podem ser personalizados:\n\n**1. Informações básicas:**\n- Título: nome da ferramenta\n- Descrição: explique o que faz\n- Emoji: ícone visual\n- Slug: nome na URL\n\n**2. Cores personalizadas:**\n- Cor principal: cor dominante\n- Cor secundária: cor de destaque\n- Escolha cores que combinem com sua marca\n- Use ferramentas de paleta de cores online\n\n**3. Conteúdo específico:**\n- Textos explicativos\n- Instruções de uso\n- Informações adicionais\n- Dicas e recomendações\n\n**4. Design visual:**\n- Layout (quando disponível)\n- Espaçamento\n- Tipografia (quando disponível)\n\n**5. CTAs (Call-to-Action):**\n- Tipo de botão (WhatsApp ou Link)\n- Texto do botão\n- Mensagem padrão (WhatsApp)\n- URL de destino (Link)\n\n**Como personalizar:**\n1. Acesse a ferramenta que deseja personalizar\n2. Clique em \"Editar\"\n3. Modifique os campos desejados\n4. Visualize as mudanças\n5. Salve quando estiver satisfeito\n\n**Dicas de personalização:**\n- Mantenha consistência visual entre ferramentas\n- Use cores que transmitam confiança\n- Textos claros e objetivos\n- Teste em diferentes dispositivos\n\n**Boas práticas:**\n- Não exagere nas cores\n- Mantenha textos legíveis\n- Use emojis com moderação\n- Revise antes de publicar"
  },
  {
    "id": "6",
    "titulo": "Configuração de CTAs (Call-to-Action)",
    "categoria": "funcionalidades",
    "tags": [
      "cta",
      "whatsapp",
      "link",
      "conversão"
    ],
    "conteudo": "### O que é um CTA?\nCTA é o botão de ação que aparece nas suas ferramentas. Ele direciona o cliente para o próximo passo (contato ou outra página).\n\n### Tipos de CTA disponíveis:\n\n**1. WhatsApp:**\n- Quando usar: quando quer receber contato direto via WhatsApp\n- Como configurar:\n  - Escolha \"WhatsApp\" como tipo\n  - Informe o número (com DDD, sem espaços ou caracteres)\n  - Exemplo: `5511999999999`\n  - Escreva a mensagem padrão que será enviada\n  - Personalize o texto do botão (ex: \"Fale comigo\", \"Agendar consulta\")\n\n**2. Link Externo:**\n- Quando usar: quando quer direcionar para site, formulário ou outra página\n- Como configurar:\n  - Escolha \"Link Externo\" como tipo\n  - Informe a URL completa (ex: `https://seusite.com/contato`)\n  - Personalize o texto do botão (ex: \"Saiba mais\", \"Acessar site\")\n\n**3. Sem CTA:**\n- Quando usar: quando a ferramenta é apenas informativa\n- Como configurar:\n  - Escolha \"Sem CTA\" (quando disponível)\n  - A ferramenta não terá botão de ação\n\n**Como configurar:**\n1. Ao criar ou editar uma ferramenta\n2. Vá até a seção \"Call-to-Action\" ou \"CTA\"\n3. Escolha o tipo desejado\n4. Preencha as informações necessárias\n5. Salve\n\n**Dicas para CTAs eficazes:**\n- Use textos claros e objetivos\n- Crie senso de urgência quando apropriado\n- Teste diferentes textos\n- Verifique se o número/URL está correto\n\n**Exemplos de textos de botão:**\n- \"Fale comigo no WhatsApp\"\n- \"Agendar consulta\"\n- \"Baixar material grátis\"\n- \"Saiba mais\"\n- \"Quero começar\"\n\n**Problemas comuns:**\n- \"Número inválido\": verifique o formato (DDD + número, sem espaços)\n- \"URL inválida\": use URL completa com `https://`\n- \"Mensagem muito longa\": mantenha mensagens objetivas"
  },
  {
    "id": "7",
    "titulo": "Como Criar e Gerenciar Quizzes Personalizados",
    "categoria": "funcionalidades",
    "tags": [
      "quiz",
      "questionário",
      "interativo",
      "engajamento"
    ],
    "conteudo": "### O que é um Quiz?\nUm quiz é um questionário interativo que você cria para engajar clientes e coletar informações.\n\n### Passo a passo para criar:\n\n**1. Acessar criação:**\n- No menu, clique em \"Quizzes\" ou \"Questionários\"\n- Clique em \"Novo Quiz\" ou \"+\"\n\n**2. Informações básicas:**\n- Título: nome do quiz (ex: \"Descubra seu perfil nutricional\")\n- Descrição: explique o que o quiz faz\n- Emoji: escolha um ícone\n- Slug: nome na URL\n\n**3. Criar perguntas:**\n- Adicione perguntas uma por uma\n- Para cada pergunta:\n  - Escreva a pergunta\n  - Adicione opções de resposta\n  - Defina qual resposta é correta (se aplicável)\n  - Adicione feedback para cada resposta (opcional)\n\n**4. Personalizar design:**\n- Escolha cores principais e secundárias\n- Ajuste layout (quando disponível)\n- Adicione sua logo (quando disponível)\n\n**5. Configurar resultados:**\n- Defina como os resultados serão exibidos\n- Adicione mensagens personalizadas\n- Configure CTA para após o quiz\n\n**6. Publicar:**\n- Revise todas as perguntas\n- Teste o quiz completo\n- Clique em \"Publicar\"\n- Copie o link para compartilhar\n\n**Como gerenciar quizzes:**\n- Veja lista de todos os quizzes\n- Edite quizzes existentes\n- Veja estatísticas (visualizações, respostas)\n- Desative ou delete quizzes\n\n**Dicas para criar quizzes eficazes:**\n- Use perguntas claras e objetivas\n- Mantenha número de perguntas adequado (5-10)\n- Ofereça feedback útil\n- Use resultados para engajar\n\n**Exemplos de quizzes:**\n- \"Qual seu perfil nutricional?\"\n- \"Descubra seu tipo de metabolismo\"\n- \"Teste seus conhecimentos sobre nutrição\"\n- \"Qual plano alimentar é ideal para você?\"\n\n**Problemas comuns:**\n- \"Pergunta sem respostas\": adicione pelo menos 2 opções\n- \"Erro ao salvar\": verifique se todos os campos estão preenchidos\n- \"Quiz não aparece\": verifique se está publicado"
  },
  {
    "id": "8",
    "titulo": "Sistema de Portais de Bem-Estar",
    "categoria": "funcionalidades",
    "tags": [
      "portal",
      "agrupar",
      "jornada",
      "organização"
    ],
    "conteudo": "### O que é um Portal?\nUm Portal é uma página que agrupa várias ferramentas em um só lugar. Ideal para organizar recursos e criar jornadas para clientes.\n\n### Quando usar um Portal:\n- Quando você tem várias ferramentas relacionadas\n- Quando quer criar uma experiência guiada\n- Quando quer organizar recursos por tema\n- Quando quer facilitar o compartilhamento\n\n### Passo a passo para criar:\n\n**1. Acessar criação:**\n- No menu, clique em \"Portais\"\n- Clique em \"Novo Portal\" ou \"+\"\n\n**2. Informações básicas:**\n- Nome: título do portal (ex: \"Portal de Bem-Estar Completo\")\n- Descrição: explique o que o portal oferece\n- Slug: nome na URL (ex: `portal-bem-estar`)\n- URL completa: `ylada.app/pt/wellness/[seu-user-slug]/portal/[slug]`\n\n**3. Escolher ferramentas:**\n- Selecione as ferramentas que farão parte do portal\n- Arraste para ordenar (importante para navegação sequencial)\n- Você pode adicionar quantas ferramentas quiser\n\n**4. Configurar navegação:**\n- Menu: cliente vê todas as ferramentas e escolhe qual acessar\n- Sequencial: cliente precisa completar uma ferramenta para acessar a próxima\n\n**5. Personalizar:**\n- Cores principais e secundárias\n- Texto do cabeçalho (opcional)\n- Texto do rodapé (opcional)\n\n**6. Publicar:**\n- Revise todas as configurações\n- Teste o portal\n- Clique em \"Publicar\"\n- Copie o link para compartilhar\n\n### Navegação Sequencial vs Menu:\n\n**Menu:**\n- Cliente vê todas as ferramentas\n- Pode escolher qual acessar\n- Ideal para recursos independentes\n- Mais flexível\n\n**Sequencial:**\n- Cliente precisa completar uma ferramenta para acessar a próxima\n- Ideal para jornadas guiadas\n- Cria senso de progresso\n- Mais engajador\n\n### Como editar um Portal:\n1. Acesse \"Portais\" no menu\n2. Clique no portal que deseja editar\n3. Clique em \"Editar\"\n4. Faça as alterações necessárias\n5. Salve\n\n**Dicas importantes:**\n- Organize ferramentas por tema\n- Use navegação sequencial para jornadas\n- Teste antes de compartilhar\n- Mantenha portal atualizado\n\n**Problemas comuns:**\n- \"Ferramenta não aparece\": verifique se está publicada e ativa\n- \"Erro ao salvar\": verifique se selecionou pelo menos uma ferramenta\n- \"Slug já em uso\": escolha outro nome"
  },
  {
    "id": "9",
    "titulo": "URLs Personalizadas e Códigos Curtos",
    "categoria": "funcionalidades",
    "tags": [
      "url",
      "link",
      "código-curto",
      "compartilhamento"
    ],
    "conteudo": "### Como funcionam as URLs?\n\n**Estrutura da URL:**\n- Formato: `ylada.app/pt/wellness/[user-slug]/[tool-slug]`\n- Exemplo: `ylada.app/pt/wellness/maria-nutri/calculadora-imc`\n\n**Componentes:**\n- `user-slug`: seu nome na URL (definido no perfil)\n- `tool-slug`: nome da ferramenta na URL (definido ao criar)\n\n**Por que isso é importante:**\n- Cada usuário pode usar os mesmos nomes de ferramentas\n- A URL completa é sempre única\n- Facilita compartilhamento\n- Profissional e memorável\n\n### Códigos Curtos (Short Code):\n\n**O que são:**\n- Links encurtados para facilitar compartilhamento\n- Formato: `ylada.app/[codigo]`\n- Exemplo: `ylada.app/abc123`\n\n**Como criar:**\n1. Ao criar ou editar uma ferramenta\n2. Vá até \"Código Curto\" ou \"Short Code\"\n3. Digite um código (letras e números, sem espaços)\n4. Salve\n\n**Dicas para códigos curtos:**\n- Use códigos fáceis de lembrar\n- Relacione com o nome da ferramenta\n- Exemplos: `imc-maria`, `quiz-nutri`, `guia-agua`\n\n**Quando usar:**\n- Compartilhamento em redes sociais\n- Materiais impressos\n- Comunicação rápida\n- QR Codes\n\n### Como compartilhar:\n\n**1. Link completo:**\n- Copie a URL completa\n- Compartilhe onde quiser\n- Funciona sempre\n\n**2. Código curto:**\n- Use quando o espaço é limitado\n- Mais fácil de digitar\n- Profissional\n\n**3. QR Code:**\n- Gere QR Code da URL (ferramentas externas)\n- Use em materiais impressos\n- Cliente escaneia e acessa\n\n**Dicas de compartilhamento:**\n- Use links em assinaturas de email\n- Compartilhe em redes sociais\n- Inclua em materiais impressos\n- Envie por WhatsApp\n\n**Problemas comuns:**\n- \"Código já em uso\": escolha outro código\n- \"URL não funciona\": verifique se a ferramenta está publicada\n- \"Link quebrado\": verifique se a ferramenta ainda existe"
  },
  {
    "id": "10",
    "titulo": "Navegação Sequencial em Portais",
    "categoria": "avancado",
    "tags": [
      "portal",
      "sequencial",
      "jornada",
      "engajamento"
    ],
    "conteudo": "### O que é navegação sequencial?\nNa navegação sequencial, o cliente precisa completar uma ferramenta para acessar a próxima, criando uma jornada guiada.\n\n### Quando usar:\n- Quando você quer criar uma experiência guiada\n- Quando as ferramentas têm uma ordem lógica\n- Quando você quer aumentar o engajamento\n- Quando você quer garantir que o cliente veja tudo\n\n### Como funciona:\n1. Cliente acessa o portal\n2. Vê apenas a primeira ferramenta disponível\n3. Precisa completar/visualizar a primeira\n4. Após completar, a próxima é liberada\n5. E assim por diante\n\n### Como configurar:\n1. Ao criar ou editar um portal\n2. Escolha \"Navegação Sequencial\"\n3. Ordene as ferramentas na ordem desejada\n4. A primeira ferramenta sempre está liberada\n5. Salve\n\n### Ordenar ferramentas:\n- Arraste as ferramentas para ordenar\n- A ordem importa na navegação sequencial\n- Pense na jornada do cliente\n- Coloque o mais importante primeiro\n\n### Dicas para criar jornadas eficazes:\n- Comece com algo simples e engajador\n- Aumente a complexidade gradualmente\n- Mantenha o cliente interessado\n- Ofereça valor em cada etapa\n\n**Exemplo de jornada:**\n1. Quiz: \"Descubra seu perfil\"\n2. Calculadora: \"Calcule suas necessidades\"\n3. Guia: \"Aprenda como aplicar\"\n4. CTA: \"Agende sua consulta\"\n\n**Vantagens:**\n- Maior engajamento\n- Jornada controlada\n- Melhor experiência\n- Mais conversões\n\n**Desvantagens:**\n- Menos flexibilidade para o cliente\n- Pode ser frustrante se muito longo\n- Requer planejamento\n\n**Problemas comuns:**\n- \"Cliente não consegue avançar\": verifique se completou a ferramenta anterior\n- \"Ordem errada\": edite o portal e reordene\n- \"Ferramenta não libera\": verifique se a anterior foi completada"
  },
  {
    "id": "11",
    "titulo": "Acompanhamento de Resultados",
    "categoria": "funcionalidades",
    "tags": [
      "estatísticas",
      "métricas",
      "analytics",
      "performance"
    ],
    "conteudo": "### Por que acompanhar resultados?\nAcompanhar resultados ajuda a entender o que está funcionando, onde melhorar e como otimizar suas ferramentas.\n\n### Métricas disponíveis:\n\n**1. Visualizações:**\n- O que é: quantas vezes sua ferramenta foi acessada\n- Onde ver: Dashboard e página da ferramenta\n- Como usar: identifique ferramentas mais populares\n\n**2. Leads gerados:**\n- O que é: quantos contatos você recebeu através das ferramentas\n- Onde ver: Dashboard e página da ferramenta\n- Como usar: veja quais ferramentas geram mais leads\n\n**3. Taxa de conversão:**\n- O que é: porcentagem de visitantes que viraram leads\n- Cálculo: (Leads / Visualizações) × 100\n- Como usar: identifique ferramentas mais eficazes\n\n**4. Ferramentas ativas:**\n- O que é: quantas ferramentas você tem publicadas\n- Onde ver: Dashboard\n- Como usar: acompanhe seu portfólio\n\n### Como acompanhar:\n\n**1. Dashboard:**\n- Veja estatísticas gerais\n- Compare diferentes períodos\n- Identifique tendências\n\n**2. Página da ferramenta:**\n- Veja estatísticas específicas\n- Acompanhe performance individual\n- Compare com outras ferramentas\n\n**3. Relatórios:**\n- Exporte dados (quando disponível)\n- Analise em planilhas\n- Crie gráficos\n\n### Como interpretar os dados:\n\n**Visualizações altas, conversões baixas:**\n- Muitas pessoas acessam, mas poucas viram leads\n- Possíveis causas: CTA fraco, conteúdo não engajador\n- Solução: melhore o CTA, torne o conteúdo mais atrativo\n\n**Visualizações baixas:**\n- Poucas pessoas estão acessando\n- Possíveis causas: divulgação insuficiente, título pouco atrativo\n- Solução: divulgue mais, melhore o título e descrição\n\n**Conversões altas:**\n- Boa porcentagem de visitantes vira leads\n- Continue assim!\n- Replique o que está funcionando\n\n### Dicas para melhorar resultados:\n- Teste diferentes CTAs\n- Melhore títulos e descrições\n- Divulgue mais suas ferramentas\n- Analise regularmente\n- Faça ajustes baseados em dados\n\n**Problemas comuns:**\n- \"Estatísticas não aparecem\": aguarde algumas horas após publicação\n- \"Números parecem errados\": verifique o período de análise\n- \"Como aumentar visualizações\": divulgue mais, melhore SEO"
  },
  {
    "id": "12",
    "titulo": "Chat IA Integrado",
    "categoria": "funcionalidades",
    "tags": [
      "chat",
      "ia",
      "assistente",
      "ajuda"
    ],
    "conteudo": "### O que é o Chat IA?\nO Chat IA é um assistente virtual integrado ao YLADA Wellness que ajuda você a criar conteúdo, tirar dúvidas e otimizar suas ferramentas.\n\n### Como usar:\n\n**1. Acessar:**\n- O Chat IA está disponível no Dashboard\n- Clique no ícone do chat\n- Uma janela abrirá\n\n**2. Fazer perguntas:**\n- Digite sua pergunta ou solicitação\n- Seja específico\n- Exemplos:\n  - \"Como criar um quiz sobre nutrição?\"\n  - \"Me ajude a escrever uma descrição para calculadora de IMC\"\n  - \"Quais cores combinam para uma ferramenta de bem-estar?\"\n\n**3. Receber respostas:**\n- O Chat IA responderá em segundos\n- Use as sugestões fornecidas\n- Faça perguntas de follow-up se necessário\n\n### Funcionalidades:\n\n**1. Criação de conteúdo:**\n- Gere descrições para ferramentas\n- Crie textos para CTAs\n- Escreva perguntas para quizzes\n- Sugira títulos\n\n**2. Ajuda com dúvidas:**\n- Tire dúvidas sobre funcionalidades\n- Entenda como usar recursos\n- Resolva problemas\n\n**3. Sugestões de melhorias:**\n- Receba dicas para otimizar ferramentas\n- Sugestões de conteúdo\n- Ideias de personalização\n\n**4. Análise:**\n- Analise performance (quando disponível)\n- Receba recomendações\n- Identifique oportunidades\n\n### Dicas para usar melhor:\n- Seja específico nas perguntas\n- Use o chat como brainstorming\n- Revise as sugestões antes de usar\n- Combine sugestões com seu conhecimento\n\n**Exemplos de uso:**\n- \"Crie uma descrição para uma calculadora de calorias\"\n- \"Me dê 5 perguntas para um quiz sobre hidratação\"\n- \"Quais cores usar para uma ferramenta de nutrição?\"\n- \"Como aumentar conversões nas minhas ferramentas?\"\n\n**Limitações:**\n- O Chat IA é uma ferramenta de apoio\n- Sempre revise e personalize as sugestões\n- Use seu conhecimento profissional\n- Não substitui sua expertise"
  },
  {
    "id": "13",
    "titulo": "Como Aumentar Conversões",
    "categoria": "otimizacao",
    "tags": [
      "conversão",
      "cta",
      "otimização",
      "resultados"
    ],
    "conteudo": "### O que são conversões?\nConversões são quando um visitante da sua ferramenta vira um lead (entra em contato, clica no CTA, etc.).\n\n### Estratégias para aumentar conversões:\n\n**1. Otimizar CTAs:**\n- Use textos claros e objetivos\n- Crie senso de urgência quando apropriado\n- Teste diferentes textos\n- Exemplos: \"Agende agora\", \"Fale comigo\", \"Quero começar\"\n\n**2. Melhorar descrições:**\n- Seja claro sobre o valor oferecido\n- Use linguagem que ressoe com seu público\n- Destaque benefícios\n- Mantenha textos concisos\n\n**3. Personalizar design:**\n- Use cores que transmitam confiança\n- Mantenha visual profissional\n- Torne a experiência agradável\n- Teste diferentes layouts\n\n**4. Oferecer valor:**\n- Garanta que a ferramenta seja útil\n- Forneça resultados relevantes\n- Dê informações valiosas\n- Crie experiência positiva\n\n**5. Testar diferentes abordagens:**\n- Teste diferentes títulos\n- Experimente diferentes CTAs\n- Varie descrições\n- Analise o que funciona melhor\n\n**6. Melhorar divulgação:**\n- Compartilhe em redes sociais\n- Inclua em email marketing\n- Use em materiais impressos\n- Peça para clientes compartilharem\n\n**7. Criar jornadas:**\n- Use portais com navegação sequencial\n- Crie experiência guiada\n- Aumente engajamento\n- Facilite conversão\n\n### Métricas para acompanhar:\n- Taxa de conversão: (Leads / Visualizações) × 100\n- Visualizações: quantas pessoas acessam\n- Leads: quantos contatos você recebe\n- Tempo na página: quanto tempo pessoas ficam\n\n### Dicas práticas:\n- Comece com uma ferramenta e otimize\n- Teste uma mudança por vez\n- Acompanhe resultados regularmente\n- Use dados para tomar decisões\n\n**Exemplos de otimização:**\n- Antes: \"Clique aqui\"\n- Depois: \"Agende sua consulta gratuita\"\n\n- Antes: \"Calculadora\"\n- Depois: \"Descubra seu IMC ideal em 30 segundos\"\n\n**Problemas comuns:**\n- \"Conversões baixas\": melhore CTA, torne conteúdo mais atrativo\n- \"Poucas visualizações\": divulgue mais, melhore SEO\n- \"Cliente não entende\": simplifique textos, seja mais claro"
  },
  {
    "id": "14",
    "titulo": "Organização de Múltiplas Ferramentas",
    "categoria": "otimizacao",
    "tags": [
      "organização",
      "portais",
      "estrutura",
      "gestão"
    ],
    "conteudo": "### Por que organizar?\nTer muitas ferramentas pode ser confuso. Organizar ajuda você e seus clientes a encontrar o que precisam.\n\n### Estratégias de organização:\n\n**1. Agrupar por tema:**\n- Crie portais por tema\n- Exemplos: \"Portal Nutrição\", \"Portal Exercícios\", \"Portal Bem-Estar\"\n- Facilita navegação\n- Melhora experiência\n\n**2. Usar nomes descritivos:**\n- Use títulos claros\n- Evite nomes genéricos\n- Facilite busca\n- Exemplos: \"Calculadora de IMC\" vs \"Calculadora\"\n\n**3. Organizar por uso:**\n- Ferramentas mais usadas primeiro\n- Agrupe por frequência\n- Destaque as principais\n- Facilite acesso\n\n**4. Criar portais temáticos:**\n- Agrupe ferramentas relacionadas\n- Crie jornadas específicas\n- Ofereça experiências completas\n- Facilite compartilhamento\n\n**5. Usar tags/categorias:**\n- Quando disponível, use tags\n- Categorize ferramentas\n- Facilite filtros\n- Melhore organização\n\n### Como estruturar seu portfólio:\n\n**Estrutura sugerida:**\n1. Ferramentas principais (mais usadas)\n2. Portais temáticos\n3. Quizzes\n4. Ferramentas secundárias\n\n**Exemplo de organização:**\n- Portal \"Nutrição Básica\":\n  - Calculadora de IMC\n  - Guia de Hidratação\n  - Quiz de Conhecimentos\n- Portal \"Planejamento\":\n  - Calculadora de Calorias\n  - Plano Alimentar\n  - Avaliação Corporal\n\n### Dicas de organização:\n- Revise regularmente\n- Remova ferramentas não usadas\n- Atualize conforme necessário\n- Mantenha consistência\n\n**Problemas comuns:**\n- \"Muitas ferramentas\": organize em portais\n- \"Difícil encontrar\": use nomes descritivos\n- \"Desorganizado\": crie estrutura clara"
  },
  {
    "id": "15",
    "titulo": "Editar e Atualizar Ferramentas",
    "categoria": "funcionalidades",
    "tags": [
      "editar",
      "atualizar",
      "manutenção",
      "melhorias"
    ],
    "conteudo": "### Por que editar?\nFerramentas precisam ser atualizadas para manter informações corretas, melhorar performance e adaptar às necessidades.\n\n### Como editar:\n\n**1. Acessar edição:**\n- Vá até \"Ferramentas\" no menu\n- Encontre a ferramenta desejada\n- Clique em \"Editar\" ou no ícone de lápis\n\n**2. Fazer alterações:**\n- Modifique os campos desejados\n- Atualize conteúdo\n- Ajuste configurações\n- Personalize design\n\n**3. Salvar:**\n- Revise as mudanças\n- Clique em \"Salvar\"\n- Alterações são aplicadas imediatamente\n\n### O que pode ser editado:\n\n**1. Informações básicas:**\n- Título\n- Descrição\n- Emoji\n- Slug (cuidado: pode quebrar links compartilhados)\n\n**2. Conteúdo:**\n- Textos\n- Informações\n- Instruções\n- Dados\n\n**3. Design:**\n- Cores\n- Layout (quando disponível)\n- Visual\n\n**4. Configurações:**\n- CTA\n- Status (ativo/inativo)\n- Configurações avançadas\n\n### Quando editar:\n\n**1. Informações desatualizadas:**\n- Atualize dados\n- Corrija informações\n- Mantenha relevância\n\n**2. Melhorias de performance:**\n- Otimize baseado em dados\n- Melhore CTAs\n- Ajuste conteúdo\n\n**3. Feedback de clientes:**\n- Ouça sugestões\n- Faça ajustes necessários\n- Melhore experiência\n\n**4. Mudanças na marca:**\n- Atualize cores\n- Ajuste textos\n- Mantenha consistência\n\n### Dicas importantes:\n- Teste após editar\n- Verifique se links ainda funcionam\n- Avisar clientes sobre mudanças significativas\n- Mantenha backup de informações importantes\n\n**Problemas comuns:**\n- \"Mudanças não aparecem\": limpe cache do navegador\n- \"Link quebrado\": verifique se mudou o slug\n- \"Erro ao salvar\": verifique campos obrigatórios"
  },
  {
    "id": "16",
    "titulo": "Módulos e Materiais de Curso",
    "categoria": "funcionalidades",
    "tags": [
      "módulos",
      "cursos",
      "materiais",
      "educação"
    ],
    "conteudo": "### O que são módulos?\nMódulos são materiais educacionais disponíveis no YLADA Wellness, como cursos, guias e recursos de aprendizado.\n\n### Como acessar:\n\n**1. Menu:**\n- Clique em \"Módulos\" ou \"Cursos\"\n- Veja lista de módulos disponíveis\n- Escolha o que deseja acessar\n\n**2. Conteúdo:**\n- Cada módulo tem materiais específicos\n- Pode incluir: vídeos, PDFs, textos, exercícios\n- Navegue pelo conteúdo\n- Baixe materiais quando disponível\n\n### Como usar em atendimentos:\n\n**1. Compartilhar materiais:**\n- Envie materiais relevantes para clientes\n- Use como complemento ao atendimento\n- Ofereça como recurso adicional\n\n**2. Educar clientes:**\n- Use módulos para educar\n- Complemente consultas\n- Ofereça conhecimento adicional\n\n**3. Criar conteúdo próprio:**\n- Use módulos como inspiração\n- Adapte para suas necessidades\n- Crie suas próprias ferramentas baseadas no aprendizado\n\n### Dicas de uso:\n- Explore todos os módulos\n- Baixe materiais importantes\n- Use regularmente\n- Compartilhe com clientes quando relevante\n\n**Problemas comuns:**\n- \"Módulo não carrega\": verifique conexão\n- \"Material não baixa\": verifique permissões\n- \"Conteúdo não aparece\": atualize a página"
  },
  {
    "id": "17",
    "titulo": "Configurações Avançadas",
    "categoria": "avancado",
    "tags": [
      "configurações",
      "perfil",
      "preferências",
      "privacidade"
    ],
    "conteudo": "### O que são configurações avançadas?\nConfigurações avançadas são ajustes mais específicos do seu perfil e conta.\n\n### Configurações disponíveis:\n\n**1. Perfil:**\n- Dados pessoais\n- Foto de perfil\n- Informações profissionais\n- User slug (nome na URL)\n\n**2. Preferências:**\n- Idioma (quando disponível)\n- Notificações\n- Tema (quando disponível)\n- Outras preferências\n\n**3. Privacidade:**\n- Visibilidade de perfil\n- Compartilhamento de dados\n- Configurações de privacidade\n\n**4. Conta:**\n- Email\n- Senha\n- Dados de pagamento (quando aplicável)\n- Assinatura\n\n### Como acessar:\n1. Clique em \"Configurações\" no menu\n2. Navegue pelas abas\n3. Faça as alterações desejadas\n4. Salve\n\n### Dicas importantes:\n- Revise configurações regularmente\n- Mantenha informações atualizadas\n- Proteja sua conta\n- Use senhas seguras\n\n**Problemas comuns:**\n- \"Não consigo alterar user_slug\": não pode ser alterado após criação\n- \"Senha não muda\": verifique requisitos\n- \"Configurações não salvam\": verifique conexão"
  },
  {
    "id": "18",
    "titulo": "Solução de Problemas Comuns",
    "categoria": "troubleshooting",
    "tags": [
      "problemas",
      "erros",
      "solução",
      "ajuda"
    ],
    "conteudo": "### Problemas e soluções:\n\n**1. Ferramenta não aparece:**\n- Verifique se está publicada\n- Confirme se está ativa\n- Verifique filtros de busca\n- Limpe cache do navegador\n\n**2. Erro ao criar portal:**\n- Verifique se selecionou ferramentas\n- Confirme se ferramentas estão publicadas\n- Verifique se slug está disponível\n- Tente novamente\n\n**3. Problemas com URLs:**\n- Verifique formato da URL\n- Confirme se ferramenta existe\n- Verifique se está publicada\n- Teste em navegador anônimo\n\n**4. CTA não funciona:**\n- Verifique número do WhatsApp (formato correto)\n- Confirme URL externa (completa, com https://)\n- Teste o CTA\n- Verifique configurações\n\n**5. Estatísticas não aparecem:**\n- Aguarde algumas horas após publicação\n- Verifique período de análise\n- Confirme se ferramenta está sendo acessada\n- Limpe cache\n\n**6. Não consigo editar:**\n- Verifique se está logado\n- Confirme permissões\n- Tente atualizar a página\n- Limpe cache\n\n**7. Erro ao salvar:**\n- Verifique campos obrigatórios\n- Confirme conexão com internet\n- Tente novamente\n- Verifique se não excedeu limites\n\n**8. Link quebrado:**\n- Verifique se ferramenta ainda existe\n- Confirme se está publicada\n- Verifique se mudou o slug\n- Teste URL completa\n\n### Quando pedir ajuda:\n- Se problema persistir após tentar soluções\n- Se erro for técnico complexo\n- Se precisar de suporte específico\n- Se tiver dúvidas sobre funcionalidades\n\n### Dicas gerais:\n- Sempre teste antes de compartilhar\n- Mantenha informações atualizadas\n- Revise regularmente\n- Use recursos de ajuda disponíveis"
  }
]

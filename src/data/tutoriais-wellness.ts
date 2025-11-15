export interface Tutorial {
  id: string
  titulo: string
  categoria: string
  conteudo: string
  tags: string[]
}

export const tutoriaisData: Tutorial[] = [
  {
    id: "1",
    titulo: "Como Criar Sua Conta e Configurar Seu Perfil",
    categoria: "primeiros-passos",
    tags: ["cadastro", "perfil", "configuração", "user-slug"],
    conteudo: "### O que é necessário?\nPara usar o YLADA Wellness, você precisa criar uma conta e configurar seu perfil. Isso permite criar ferramentas, portais e acompanhar seus resultados.\n\n### Passo a passo:\n\n**1. Criar conta:**\n- Acesse a página de cadastro\n- Informe seu nome completo, email e senha\n- Confirme seu email (verifique a caixa de entrada)\n- Faça login\n\n**2. Configurar perfil:**\n- Acesse \"Configurações\" ou \"Perfil\"\n- Preencha:\n  - Nome completo\n  - Profissão\n  - Nome na URL (`user_slug`) — será usado em todas as suas URLs\n  - Foto de perfil (opcional)\n\n**3. Nome na URL (`user_slug`):**\n- Escolha um nome único e fácil de lembrar\n- Exemplos: `maria-nutricionista`, `joao-coach`\n- Será usado assim: `ylada.app/pt/wellness/[seu-nome]/[ferramenta]`\n- Não pode conter espaços ou caracteres especiais\n- Não pode ser alterado depois (escolha com cuidado)\n\n**4. Dicas importantes:**\n- Use um nome profissional\n- Evite números e caracteres especiais\n- Pense em como seus clientes vão lembrar da URL\n\n**Problemas comuns:**\n- \"Nome já está em uso\": escolha outro nome\n- \"Email não confirmado\": verifique a caixa de entrada e spam\n- \"Senha muito fraca\": use pelo menos 8 caracteres, com letras e números"
  },
  {
    id: "2",
    titulo: "Navegação na Home",
    categoria: "primeiros-passos",
    tags: ["home", "navegação", "estatísticas", "menu"],
    conteudo: "### O que é a Home?\nA Home é o painel principal do YLADA Wellness. Mostra estatísticas, acesso rápido às ferramentas e visão geral da sua conta.\n\n### Elementos da Home:\n\n**1. Estatísticas gerais:**\n- Total de visualizações: quantas vezes suas ferramentas foram acessadas\n- Leads gerados: quantos contatos você recebeu\n- Taxa de conversão: porcentagem de visitantes que viraram leads\n- Ferramentas ativas: quantas ferramentas você tem publicadas\n\n**2. Menu de navegação:**\n- Home: volta para esta página\n- Ferramentas: lista todas as suas ferramentas\n- Templates: modelos prontos para criar ferramentas\n- Portais: seus portais de bem-estar\n- Módulos: materiais e cursos disponíveis\n- Configurações: ajustes do perfil\n\n**3. Ferramentas recentes:**\n- Lista das últimas ferramentas criadas ou editadas\n- Acesso rápido para editar ou visualizar\n\n**4. Chat IA:**\n- Assistente virtual para dúvidas\n- Ajuda com criação de conteúdo\n- Sugestões de melhorias\n\n**Como usar:**\n- Acompanhe suas estatísticas regularmente\n- Use o menu para navegar entre as seções\n- Clique em uma ferramenta para ver detalhes ou editar\n\n**Dicas:**\n- Verifique as estatísticas semanalmente\n- Use o Chat IA quando tiver dúvidas\n- Organize suas ferramentas pelo nome para facilitar a busca"
  },
  {
    id: "3",
    titulo: "Como Criar Sua Primeira Ferramenta",
    categoria: "primeiros-passos",
    tags: ["ferramenta", "criar", "template", "primeiros-passos"],
    conteudo: "### O que é uma ferramenta?\nUma ferramenta é um recurso criado por você para seus clientes. Pode ser uma calculadora, questionário, guia ou outro recurso baseado em templates.\n\n### Passo a passo completo:\n\n**1. Acessar criação:**\n- No Dashboard, clique em \"Ferramentas\"\n- Clique em \"Nova Ferramenta\" ou \"+\"\n\n**2. Escolher template:**\n- Veja os templates disponíveis\n- Cada template tem um propósito específico\n- Clique no template desejado\n\n**3. Preencher informações básicas:**\n- Título: nome da ferramenta (ex: \"Calculadora de IMC\")\n- Descrição: explique o que a ferramenta faz\n- Emoji: escolha um ícone (opcional, mas recomendado)\n- Slug da ferramenta: nome na URL (ex: `calculadora-imc`)\n\n**4. Entender a URL completa:**\n- Sua URL será: `ylada.app/pt/wellness/[seu-user-slug]/[slug-da-ferramenta]`\n- Exemplo: `ylada.app/pt/wellness/maria-nutri/calculadora-imc`\n- O `user_slug` garante que sua URL seja única, mesmo se outro usuário usar o mesmo slug da ferramenta\n\n**5. Personalizar conteúdo:**\n- Preencha os campos específicos do template\n- Adicione informações relevantes\n- Revise antes de publicar\n\n**6. Configurar CTA (Call-to-Action):**\n- Escolha o tipo: WhatsApp ou Link Externo\n- Se WhatsApp: informe o número e mensagem padrão\n- Se Link Externo: informe a URL de destino\n- Personalize o texto do botão\n\n**7. Publicar:**\n- Clique em \"Salvar\" ou \"Publicar\"\n- Sua ferramenta estará ativa\n- Copie o link para compartilhar\n\n**Dicas importantes:**\n- Use títulos claros e objetivos\n- Descreva bem o que a ferramenta faz\n- Teste antes de compartilhar\n- Escolha um slug descritivo e fácil de lembrar\n\n**Problemas comuns:**\n- \"Slug já está em uso\": escolha outro nome para o slug\n- \"Campos obrigatórios\": preencha todos os campos marcados com *\n- \"Erro ao salvar\": verifique sua conexão e tente novamente"
  }
  // Adicionar os outros tutoriais aqui conforme necessário
  // Por enquanto, vou manter apenas os 3 primeiros para testar
]


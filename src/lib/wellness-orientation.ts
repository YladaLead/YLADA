/**
 * Mapa de Orientação Técnica - Wellness
 * IMPORTANTE: Wellness NÃO tem Kanban, gestão de clientes complexa ou relatórios avançados
 * Essas funcionalidades existem apenas em Nutri e Coach
 */

import type { OrientacaoItem } from '@/types/orientation'

export const WELLNESS_ORIENTACAO_MAP: Record<string, OrientacaoItem> = {
  // ============================================
  // FERRAMENTAS
  // ============================================
  
  'scripts': {
    id: 'scripts',
    titulo: 'Scripts de Conversão',
    descricao: 'Acesse scripts prontos para usar em conversas e captação de clientes',
    caminho: '/pt/wellness/system/scripts',
    passo_a_passo: [
      '1. Acesse o Dashboard',
      '2. Clique em "System" ou acesse diretamente',
      '3. Clique em "Scripts"',
      '4. Escolha o tipo de script que precisa',
      '5. Copie o texto e use nas suas conversas'
    ],
    icone: '📝',
    categoria: 'ferramentas',
    atalho: 'System > Scripts',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'script', 'scripts', 'texto', 'mensagem', 'conversa',
      'roteiro', 'frases', 'modelo de mensagem', 'onde estão os scripts',
      'scripts de conversão', 'scripts de captação'
    ]
  },
  
  'criar-quiz': {
    id: 'criar-quiz',
    titulo: 'Criar Quiz',
    descricao: 'Crie um quiz personalizado para captar leads e engajar clientes',
    caminho: '/pt/wellness/ferramentas/quizzes/novo',
    passo_a_passo: [
      '1. Acesse o Dashboard',
      '2. Clique em "Ferramentas"',
      '3. Clique em "Criar Novo Quiz" ou acesse "Quizzes" > "Novo"',
      '4. Preencha o título e descrição do quiz',
      '5. Adicione perguntas e opções de resposta',
      '6. Configure os resultados e diagnósticos',
      '7. Publique o quiz e compartilhe o link'
    ],
    icone: '❓',
    categoria: 'ferramentas',
    atalho: 'Dashboard > Ferramentas > Criar Quiz',
    nivel_dificuldade: 'medio',
    palavras_chave: [
      'criar quiz', 'novo quiz', 'fazer quiz', 'criar questionário',
      'quiz', 'questionário', 'perguntas', 'questionário personalizado',
      'como criar quiz', 'criar novo quiz'
    ]
  },
  
  'criar-portal': {
    id: 'criar-portal',
    titulo: 'Criar Portal de Captação',
    descricao: 'Crie um portal personalizado para captar leads',
    caminho: '/pt/wellness/portals/novo',
    passo_a_passo: [
      '1. Acesse o Dashboard',
      '2. Clique em "Portals" ou acesse pelo menu',
      '3. Clique no botão "Criar Novo Portal"',
      '4. Configure o design e conteúdo do portal',
      '5. Adicione ferramentas ao portal',
      '6. Configure mensagens de agradecimento',
      '7. Publique e compartilhe o link'
    ],
    icone: '🌐',
    categoria: 'ferramentas',
    atalho: 'Dashboard > Portals > Novo',
    nivel_dificuldade: 'medio',
    palavras_chave: [
      'portal', 'captação', 'landing page', 'página',
      'criar portal', 'novo portal', 'portal de captação'
    ]
  },
  
  'criar-ferramenta': {
    id: 'criar-ferramenta',
    titulo: 'Criar Nova Ferramenta',
    descricao: 'Crie uma ferramenta personalizada usando templates',
    caminho: '/pt/wellness/ferramentas/nova',
    passo_a_passo: [
      '1. Acesse o Dashboard',
      '2. Clique em "Ferramentas"',
      '3. Clique no botão "Criar Nova Ferramenta"',
      '4. Escolha um template ou crie do zero',
      '5. Configure título, descrição e personalizações',
      '6. Configure WhatsApp e CTA',
      '7. Publique e compartilhe o link'
    ],
    icone: '🛠️',
    categoria: 'ferramentas',
    atalho: 'Dashboard > Ferramentas > Nova',
    nivel_dificuldade: 'medio',
    palavras_chave: [
      'criar ferramenta', 'nova ferramenta', 'fazer ferramenta',
      'criar link', 'nova ferramenta', 'ferramenta personalizada'
    ]
  },
  
  'ver-ferramentas': {
    id: 'ver-ferramentas',
    titulo: 'Ver Minhas Ferramentas',
    descricao: 'Visualize todas as ferramentas que você criou',
    caminho: '/pt/wellness/ferramentas',
    passo_a_passo: [
      '1. Acesse o Dashboard',
      '2. Clique em "Ferramentas"',
      '3. Você verá todas as suas ferramentas organizadas',
      '4. Use os filtros para encontrar ferramentas específicas',
      '5. Clique em uma ferramenta para ver detalhes e estatísticas'
    ],
    icone: '🛠️',
    categoria: 'ferramentas',
    atalho: 'Dashboard > Ferramentas',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'ferramentas', 'minhas ferramentas', 'ver ferramentas',
      'listar ferramentas', 'quizzes', 'portais', 'meus links'
    ]
  },
  
  'editar-ferramenta': {
    id: 'editar-ferramenta',
    titulo: 'Editar Ferramenta',
    descricao: 'Modifique uma ferramenta existente',
    caminho: '/pt/wellness/ferramentas',
    passo_a_passo: [
      '1. Acesse o Dashboard > Ferramentas',
      '2. Encontre a ferramenta que deseja editar',
      '3. Clique na ferramenta para abrir',
      '4. Clique em "Editar"',
      '5. Modifique o conteúdo, design ou configurações',
      '6. Clique em "Salvar" para confirmar'
    ],
    icone: '✏️',
    categoria: 'ferramentas',
    nivel_dificuldade: 'medio',
    palavras_chave: [
      'editar ferramenta', 'modificar ferramenta', 'atualizar ferramenta',
      'alterar ferramenta', 'mudar ferramenta'
    ]
  },
  
  // ============================================
  // PORTALS
  // ============================================
  
  'ver-portals': {
    id: 'ver-portals',
    titulo: 'Ver Meus Portais',
    descricao: 'Visualize todos os portais de captação que você criou',
    caminho: '/pt/wellness/portals',
    passo_a_passo: [
      '1. Acesse o Dashboard',
      '2. Clique em "Portals" ou acesse pelo menu',
      '3. Você verá todos os seus portais',
      '4. Clique em um portal para ver detalhes e estatísticas',
      '5. Use os links para compartilhar seus portais'
    ],
    icone: '🌐',
    categoria: 'ferramentas',
    atalho: 'Dashboard > Portals',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'portal', 'portais', 'ver portais', 'meus portais',
      'listar portais', 'portais de captação'
    ]
  },
  
  'editar-portal': {
    id: 'editar-portal',
    titulo: 'Editar Portal',
    descricao: 'Modifique um portal de captação existente',
    caminho: '/pt/wellness/portals',
    passo_a_passo: [
      '1. Acesse o Dashboard > Portals',
      '2. Encontre o portal que deseja editar',
      '3. Clique no portal para abrir',
      '4. Clique em "Editar"',
      '5. Modifique o conteúdo, design ou configurações',
      '6. Clique em "Salvar" para confirmar'
    ],
    icone: '✏️',
    categoria: 'ferramentas',
    nivel_dificuldade: 'medio',
    palavras_chave: [
      'editar portal', 'modificar portal', 'atualizar portal',
      'alterar portal', 'mudar portal'
    ]
  },
  
  // ============================================
  // QUIZZES
  // ============================================
  
  'ver-quizzes': {
    id: 'ver-quizzes',
    titulo: 'Ver Meus Quizzes',
    descricao: 'Visualize todos os quizzes que você criou',
    caminho: '/pt/wellness/quizzes',
    passo_a_passo: [
      '1. Acesse o Dashboard',
      '2. Clique em "Quizzes" ou acesse pelo menu',
      '3. Você verá todos os seus quizzes',
      '4. Clique em um quiz para ver detalhes e estatísticas',
      '5. Use os links para compartilhar seus quizzes'
    ],
    icone: '❓',
    categoria: 'ferramentas',
    atalho: 'Dashboard > Quizzes',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'quiz', 'quizzes', 'ver quizzes', 'meus quizzes',
      'listar quizzes', 'questionários'
    ]
  },
  
  'editar-quiz': {
    id: 'editar-quiz',
    titulo: 'Editar Quiz',
    descricao: 'Modifique um quiz existente',
    caminho: '/pt/wellness/quizzes',
    passo_a_passo: [
      '1. Acesse o Dashboard > Quizzes',
      '2. Encontre o quiz que deseja editar',
      '3. Clique no quiz para abrir',
      '4. Clique em "Editar"',
      '5. Modifique perguntas, respostas ou configurações',
      '6. Clique em "Salvar" para confirmar'
    ],
    icone: '✏️',
    categoria: 'ferramentas',
    nivel_dificuldade: 'medio',
    palavras_chave: [
      'editar quiz', 'modificar quiz', 'atualizar quiz',
      'alterar quiz', 'mudar quiz'
    ]
  },
  
  // ============================================
  // TEMPLATES
  // ============================================
  
  'templates': {
    id: 'templates',
    titulo: 'Ver Templates',
    descricao: 'Explore templates prontos para usar em suas ferramentas',
    caminho: '/pt/wellness/templates',
    passo_a_passo: [
      '1. Acesse o Dashboard',
      '2. Clique em "Ver Templates" ou acesse pelo menu',
      '3. Explore os templates disponíveis',
      '4. Clique em um template para ver detalhes',
      '5. Use o template como base para criar sua ferramenta'
    ],
    icone: '🎨',
    categoria: 'ferramentas',
    atalho: 'Dashboard > Ver Templates',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'template', 'templates', 'modelo', 'modelos',
      'ver templates', 'explorar templates'
    ]
  },
  
  // ============================================
  // RELATÓRIOS (Simples no Wellness)
  // ============================================
  
  'relatorios': {
    id: 'relatorios',
    titulo: 'Estatísticas e Relatórios',
    descricao: 'Visualize estatísticas básicas das suas ferramentas no Dashboard',
    caminho: '/pt/wellness/home',
    passo_a_passo: [
      '1. Acesse o Dashboard',
      '2. Role até a seção de estatísticas',
      '3. Visualize dados básicos das suas ferramentas',
      '4. Veja conversões e visualizações',
      '5. Acompanhe performance dos seus links'
    ],
    icone: '📊',
    categoria: 'relatorios',
    atalho: 'Dashboard > Estatísticas',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'relatório', 'relatórios', 'estatística', 'estatísticas',
      'dados', 'métricas', 'performance', 'análise', 'dashboard'
    ]
  },
  
  // ============================================
  // CONFIGURAÇÃO
  // ============================================
  
  'perfil': {
    id: 'perfil',
    titulo: 'Editar Perfil',
    descricao: 'Atualize suas informações pessoais e de perfil',
    caminho: '/pt/wellness/configuracao',
    passo_a_passo: [
      '1. Acesse o menu "Configuração" (ícone de perfil no topo)',
      '2. Na seção "Perfil", edite suas informações',
      '3. Atualize nome, email, telefone, bio, etc',
      '4. Configure seu slug personalizado (URL)',
      '5. Clique em "Salvar" para confirmar'
    ],
    icone: '⚙️',
    categoria: 'configuracao',
    atalho: 'Menu > Perfil (topo)',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'perfil', 'editar perfil', 'configuração', 'dados pessoais',
      'informações', 'atualizar perfil'
    ]
  },
  
  'assinatura': {
    id: 'assinatura',
    titulo: 'Ver Assinatura',
    descricao: 'Visualize detalhes da sua assinatura e plano',
    caminho: '/pt/wellness/configuracao',
    passo_a_passo: [
      '1. Acesse o menu "Configuração"',
      '2. Role até a seção "Assinatura"',
      '3. Você verá seu plano atual, data de vencimento e status',
      '4. Clique em "Gerenciar Assinatura" para mais opções'
    ],
    icone: '💳',
    categoria: 'configuracao',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'assinatura', 'plano', 'pagamento', 'faturamento',
      'ver assinatura', 'meu plano', 'status da assinatura'
    ]
  },
  
  // ============================================
  // CURSOS E EDUCAÇÃO
  // ============================================
  
  'cursos': {
    id: 'cursos',
    titulo: 'Acessar Cursos',
    descricao: 'Acesse cursos e trilhas de aprendizado',
    caminho: '/pt/wellness/cursos',
    passo_a_passo: [
      '1. Acesse o Dashboard',
      '2. Clique em "Cursos"',
      '3. Escolha o curso que deseja fazer',
      '4. Acesse os módulos e conteúdos',
      '5. Acompanhe seu progresso'
    ],
    icone: '📖',
    categoria: 'outros',
    atalho: 'Dashboard > Cursos',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'curso', 'cursos', 'trilha', 'aprendizado',
      'educação', 'treinamento', 'módulos'
    ]
  },
  
  'tutoriais': {
    id: 'tutoriais',
    titulo: 'Ver Tutoriais',
    descricao: 'Acesse tutoriais e guias de ajuda',
    caminho: '/pt/wellness/tutoriais',
    passo_a_passo: [
      '1. Acesse o Dashboard',
      '2. Clique em "Tutoriais"',
      '3. Explore os tutoriais disponíveis',
      '4. Leia os guias e dicas',
      '5. Use os tutoriais para aprender a usar a plataforma'
    ],
    icone: '📚',
    categoria: 'outros',
    atalho: 'Dashboard > Tutoriais',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'tutorial', 'tutoriais', 'guia', 'guias',
      'ajuda', 'como usar', 'dicas'
    ]
  },
  
  // ============================================
  // SYSTEM (Recrutar, Vender, Scripts, etc)
  // ============================================
  
  'system': {
    id: 'system',
    titulo: 'Sistema de Recrutamento e Vendas',
    descricao: 'Acesse o sistema completo de recrutamento, vendas e scripts',
    caminho: '/pt/wellness/system',
    passo_a_passo: [
      '1. Acesse o Dashboard',
      '2. Procure pela seção "System" ou acesse diretamente',
      '3. Escolha o módulo desejado:',
      '   - Recrutar: Scripts e fluxos para recrutar pessoas',
      '   - Vender: Scripts e fluxos para vender produtos',
      '   - Scripts: Biblioteca completa de scripts',
      '   - Treinamento: Materiais de treinamento',
      '   - Ferramentas: Ferramentas adicionais'
    ],
    icone: '📚',
    categoria: 'outros',
    nivel_dificuldade: 'medio',
    palavras_chave: [
      'system', 'sistema', 'recrutar', 'vender',
      'scripts', 'treinamento', 'biblioteca'
    ]
  },
  
  'scripts-system': {
    id: 'scripts-system',
    titulo: 'Scripts do Sistema',
    descricao: 'Acesse a biblioteca completa de scripts',
    caminho: '/pt/wellness/system/scripts',
    passo_a_passo: [
      '1. Acesse o menu "System"',
      '2. Clique em "Scripts"',
      '3. Escolha o tipo de script:',
      '   - Abertura',
      '   - Fechamento',
      '   - Objeções',
      '   - Oferta',
      '   - Pós-venda',
      '   - E outros',
      '4. Copie e use os scripts nas suas conversas'
    ],
    icone: '📝',
    categoria: 'ferramentas',
    atalho: 'System > Scripts',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'scripts', 'script', 'biblioteca', 'textos',
      'mensagens', 'roteiros', 'scripts do sistema'
    ]
  },
  
  // ============================================
  // DASHBOARD
  // ============================================
  
  'dashboard': {
    id: 'dashboard',
    titulo: 'Dashboard',
    descricao: 'Acesse o painel principal com visão geral e ações rápidas',
    caminho: '/pt/wellness/home',
    passo_a_passo: [
      '1. Após fazer login, você será direcionado ao Dashboard',
      '2. No Dashboard você verá:',
      '   - Estatísticas gerais',
      '   - Ações rápidas',
      '   - Links para principais funcionalidades',
      '   - Templates, Cursos e Tutoriais',
      '3. Use o Dashboard como ponto de partida para tudo'
    ],
    icone: '🏠',
    categoria: 'outros',
    atalho: 'Menu > Home',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'dashboard', 'painel', 'home', 'início',
      'página inicial', 'visão geral'
    ]
  },
  
  // ============================================
  // SUPORTE
  // ============================================
  
  'suporte': {
    id: 'suporte',
    titulo: 'Suporte',
    descricao: 'Acesse a página de suporte e ajuda',
    caminho: '/pt/wellness/suporte',
    passo_a_passo: [
      '1. Acesse o menu ou digite a URL diretamente',
      '2. Na página de suporte você pode:',
      '   - Ver tickets de suporte',
      '   - Criar novo ticket',
      '   - Ver respostas e histórico',
      '3. Use o chat de suporte para dúvidas rápidas'
    ],
    icone: '💬',
    categoria: 'outros',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'suporte', 'ajuda', 'ticket', 'tickets',
      'atendimento', 'dúvidas', 'problema'
    ]
  }
}

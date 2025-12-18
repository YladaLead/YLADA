/**
 * Mapa de Orientação Técnica - Nutri
 * Todas as funcionalidades mapeadas com passo a passo detalhado
 * IMPORTANTE: Nutri tem funcionalidades que Wellness não tem (Kanban, GSAL, Formação)
 */

import type { OrientacaoItem } from '@/types/orientation'

export const NUTRI_ORIENTACAO_MAP: Record<string, OrientacaoItem> = {
  // ============================================
  // GESTÃO GSAL - LEADS
  // ============================================
  
  'ver-leads': {
    id: 'ver-leads',
    titulo: 'Ver Leads',
    descricao: 'Visualize todos os leads captados e gerencie a conversão',
    caminho: '/pt/nutri/leads',
    passo_a_passo: [
      '1. Acesse o menu lateral ou clique em "Gestão GSAL"',
      '2. Clique em "Leads"',
      '3. Você verá todos os leads organizados',
      '4. Use os filtros para encontrar leads específicos',
      '5. Veja o status de cada lead (novo, em contato, convertido)'
    ],
    icone: '🎯',
    categoria: 'clientes',
    atalho: 'Menu > Gestão GSAL > Leads',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'leads', 'ver leads', 'listar leads', 'captação',
      'novos leads', 'gerenciar leads'
    ]
  },
  
  'converter-lead': {
    id: 'converter-lead',
    titulo: 'Converter Lead em Cliente',
    descricao: 'Transforme um lead em cliente e inicie o acompanhamento',
    caminho: '/pt/nutri/leads',
    passo_a_passo: [
      '1. Acesse "Gestão GSAL" > "Leads"',
      '2. Encontre o lead que deseja converter',
      '3. Clique no botão "Converter" ou "Tornar Cliente"',
      '4. Preencha os dados adicionais do cliente se necessário',
      '5. O lead será movido automaticamente para a lista de clientes',
      '6. Você pode começar o acompanhamento imediatamente'
    ],
    icone: '✅',
    categoria: 'clientes',
    atalho: 'Menu > Gestão GSAL > Leads > Converter',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'converter lead', 'transformar lead', 'lead em cliente',
      'tornar cliente', 'conversão de lead'
    ]
  },
  
  // ============================================
  // GESTÃO GSAL - CLIENTES
  // ============================================
  
  'cadastrar-cliente': {
    id: 'cadastrar-cliente',
    titulo: 'Cadastrar Novo Cliente',
    descricao: 'Adicione um novo cliente ao sistema com todas as informações',
    caminho: '/pt/nutri/clientes/novo',
    passo_a_passo: [
      '1. Acesse o menu "Gestão GSAL"',
      '2. Clique em "Clientes"',
      '3. Clique no botão "Novo Cliente" (canto superior direito)',
      '4. Preencha os dados do cliente (nome, email, telefone, etc)',
      '5. Adicione informações adicionais se necessário',
      '6. Clique em "Salvar" para finalizar'
    ],
    icone: '👤',
    categoria: 'clientes',
    atalho: 'Menu > Gestão GSAL > Clientes > Novo Cliente',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'cadastrar', 'adicionar', 'novo', 'cliente', 'criar cliente',
      'adicionar cliente', 'novo cliente', 'cadastro'
    ]
  },
  
  'ver-clientes': {
    id: 'ver-clientes',
    titulo: 'Ver Lista de Clientes',
    descricao: 'Visualize todos os seus clientes cadastrados',
    caminho: '/pt/nutri/clientes',
    passo_a_passo: [
      '1. Acesse o menu "Gestão GSAL"',
      '2. Clique em "Clientes"',
      '3. Você verá a lista completa de clientes',
      '4. Use a barra de busca para filtrar clientes',
      '5. Clique em um cliente para ver detalhes'
    ],
    icone: '📋',
    categoria: 'clientes',
    atalho: 'Menu > Gestão GSAL > Clientes',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'ver', 'listar', 'clientes', 'lista', 'todos clientes',
      'visualizar clientes', 'meus clientes'
    ]
  },
  
  'kanban': {
    id: 'kanban',
    titulo: 'Kanban de Clientes',
    descricao: 'Organize seus clientes visualmente por status usando o Kanban',
    caminho: '/pt/nutri/clientes/kanban',
    passo_a_passo: [
      '1. Acesse o menu "Gestão GSAL"',
      '2. Clique em "Clientes"',
      '3. Clique em "Kanban" na barra de navegação',
      '4. Você verá os clientes organizados em colunas (Novo, Em Atendimento, etc)',
      '5. Arraste os cards entre colunas para mudar o status',
      '6. Clique em um card para ver detalhes do cliente',
      '7. Use os filtros para visualizar clientes específicos'
    ],
    icone: '🗂️',
    categoria: 'clientes',
    atalho: 'Menu > Gestão GSAL > Clientes > Kanban',
    nivel_dificuldade: 'medio',
    palavras_chave: [
      'kanban', 'organizar', 'status', 'colunas', 'cards',
      'visual', 'organização', 'gerenciar status'
    ]
  },
  
  'editar-cliente': {
    id: 'editar-cliente',
    titulo: 'Editar Cliente',
    descricao: 'Atualize informações de um cliente existente',
    caminho: '/pt/nutri/clientes',
    passo_a_passo: [
      '1. Acesse o menu "Gestão GSAL" > "Clientes"',
      '2. Encontre o cliente na lista ou use a busca',
      '3. Clique no cliente para abrir os detalhes',
      '4. Clique no botão "Editar" (ícone de lápis)',
      '5. Modifique as informações desejadas',
      '6. Clique em "Salvar" para confirmar as alterações'
    ],
    icone: '✏️',
    categoria: 'clientes',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'editar', 'atualizar', 'modificar', 'alterar', 'mudar',
      'editar cliente', 'atualizar cliente'
    ]
  },
  
  // ============================================
  // GESTÃO GSAL - ACOMPANHAMENTO
  // ============================================
  
  'acompanhamento': {
    id: 'acompanhamento',
    titulo: 'Acompanhar Cliente',
    descricao: 'Visualize e gerencie o acompanhamento completo do cliente',
    caminho: '/pt/nutri/acompanhamento',
    passo_a_passo: [
      '1. Acesse o menu "Gestão GSAL"',
      '2. Clique em "Acompanhamento"',
      '3. Selecione o cliente que deseja acompanhar',
      '4. Veja o histórico completo de evolução',
      '5. Adicione novas anotações ou avaliações',
      '6. Acompanhe o progresso ao longo do tempo'
    ],
    icone: '📊',
    categoria: 'clientes',
    atalho: 'Menu > Gestão GSAL > Acompanhamento',
    nivel_dificuldade: 'medio',
    palavras_chave: [
      'acompanhamento', 'evolução', 'histórico', 'progresso',
      'seguir cliente', 'acompanhar evolução'
    ]
  },
  
  // ============================================
  // GESTÃO GSAL - ROTINA MÍNIMA
  // ============================================
  
  'rotina-minima': {
    id: 'rotina-minima',
    titulo: 'Rotina Mínima Diária',
    descricao: 'Acesse o painel diário com suas tarefas e rotina mínima',
    caminho: '/pt/nutri/metodo/painel/diario',
    passo_a_passo: [
      '1. Acesse o menu "Gestão GSAL"',
      '2. Clique em "Rotina Mínima"',
      '3. Você verá suas tarefas do dia',
      '4. Marque as tarefas como concluídas',
      '5. Acompanhe seu progresso diário',
      '6. Veja sua consistência ao longo do tempo'
    ],
    icone: '⚡',
    categoria: 'clientes',
    atalho: 'Menu > Gestão GSAL > Rotina Mínima',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'rotina', 'rotina mínima', 'tarefas', 'diário',
      'painel diário', 'rotina do dia'
    ]
  },
  
  // ============================================
  // GESTÃO GSAL - MÉTRICAS
  // ============================================
  
  'relatorios-gsal': {
    id: 'relatorios-gsal',
    titulo: 'Relatórios e Métricas GSAL',
    descricao: 'Visualize relatórios completos e métricas da sua gestão',
    caminho: '/pt/nutri/relatorios-gestao',
    passo_a_passo: [
      '1. Acesse o menu "Gestão GSAL"',
      '2. Clique em "Métricas" ou "Relatórios"',
      '3. Escolha o tipo de relatório desejado',
      '4. Configure o período (data inicial e final)',
      '5. Aplique filtros se necessário',
      '6. Visualize os dados ou exporte em PDF/Excel'
    ],
    icone: '📈',
    categoria: 'relatorios',
    atalho: 'Menu > Gestão GSAL > Métricas',
    nivel_dificuldade: 'medio',
    palavras_chave: [
      'relatório', 'relatórios', 'métricas', 'estatística',
      'dados', 'performance', 'análise', 'gsal'
    ]
  },
  
  // ============================================
  // FERRAMENTAS - LINKS
  // ============================================
  
  'ver-ferramentas': {
    id: 'ver-ferramentas',
    titulo: 'Ver Minhas Ferramentas',
    descricao: 'Visualize todas as ferramentas e links que você criou',
    caminho: '/pt/nutri/ferramentas',
    passo_a_passo: [
      '1. Acesse o menu "Ferramentas"',
      '2. Você verá todas as suas ferramentas organizadas',
      '3. Use os filtros para encontrar ferramentas específicas',
      '4. Clique em uma ferramenta para ver detalhes e estatísticas',
      '5. Veja quantos leads cada ferramenta gerou'
    ],
    icone: '🔗',
    categoria: 'ferramentas',
    atalho: 'Menu > Ferramentas > Meus Links',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'ferramentas', 'links', 'minhas ferramentas', 'ver ferramentas',
      'listar ferramentas', 'meus links'
    ]
  },
  
  'criar-ferramenta': {
    id: 'criar-ferramenta',
    titulo: 'Criar Nova Ferramenta',
    descricao: 'Crie uma nova ferramenta de captação usando templates',
    caminho: '/pt/nutri/ferramentas/nova',
    passo_a_passo: [
      '1. Acesse o menu "Ferramentas"',
      '2. Clique em "Criar Fluxo" ou "Criar Nova Ferramenta"',
      '3. Escolha um template ou crie do zero',
      '4. Configure título, descrição e personalizações',
      '5. Configure WhatsApp e CTA',
      '6. Publique e compartilhe o link'
    ],
    icone: '➕',
    categoria: 'ferramentas',
    atalho: 'Menu > Ferramentas > Criar Fluxo',
    nivel_dificuldade: 'medio',
    palavras_chave: [
      'criar ferramenta', 'nova ferramenta', 'criar link',
      'nova ferramenta', 'criar fluxo'
    ]
  },
  
  // ============================================
  // FERRAMENTAS - QUIZZES
  // ============================================
  
  'criar-quiz': {
    id: 'criar-quiz',
    titulo: 'Criar Quiz',
    descricao: 'Crie um quiz personalizado para captar leads e engajar clientes',
    caminho: '/pt/nutri/quiz-personalizado',
    passo_a_passo: [
      '1. Acesse o menu "Ferramentas"',
      '2. Clique em "Criar Quiz"',
      '3. Preencha o título e descrição do quiz',
      '4. Adicione perguntas e opções de resposta',
      '5. Configure os resultados e diagnósticos',
      '6. Publique o quiz e compartilhe o link'
    ],
    icone: '🎯',
    categoria: 'ferramentas',
    atalho: 'Menu > Ferramentas > Criar Quiz',
    nivel_dificuldade: 'medio',
    palavras_chave: [
      'criar quiz', 'novo quiz', 'fazer quiz', 'criar questionário',
      'quiz', 'questionário', 'perguntas'
    ]
  },
  
  'ver-quizzes': {
    id: 'ver-quizzes',
    titulo: 'Ver Meus Quizzes',
    descricao: 'Visualize todos os quizzes que você criou',
    caminho: '/pt/nutri/quizzes',
    passo_a_passo: [
      '1. Acesse o menu "Ferramentas"',
      '2. Clique em "Quizzes"',
      '3. Você verá todos os seus quizzes',
      '4. Clique em um quiz para ver detalhes e estatísticas',
      '5. Use os links para compartilhar seus quizzes'
    ],
    icone: '📝',
    categoria: 'ferramentas',
    atalho: 'Menu > Ferramentas > Quizzes',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'quiz', 'quizzes', 'ver quizzes', 'meus quizzes',
      'listar quizzes', 'questionários'
    ]
  },
  
  // ============================================
  // FERRAMENTAS - TEMPLATES
  // ============================================
  
  'templates': {
    id: 'templates',
    titulo: 'Ver Templates',
    descricao: 'Explore os 38 templates validados para usar em suas ferramentas',
    caminho: '/pt/nutri/ferramentas/templates',
    passo_a_passo: [
      '1. Acesse o menu "Ferramentas"',
      '2. Clique em "Templates"',
      '3. Explore os 38 templates disponíveis',
      '4. Use os filtros para encontrar templates específicos',
      '5. Clique em um template para ver detalhes',
      '6. Use o template como base para criar sua ferramenta'
    ],
    icone: '🎨',
    categoria: 'ferramentas',
    atalho: 'Menu > Ferramentas > Templates',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'template', 'templates', 'modelo', 'modelos',
      'ver templates', 'explorar templates', '38 templates'
    ]
  },
  
  // ============================================
  // FORMAÇÃO EMPRESARIAL - JORNADA 30 DIAS
  // ============================================
  
  'jornada-30-dias': {
    id: 'jornada-30-dias',
    titulo: 'Jornada 30 Dias',
    descricao: 'Acesse a Jornada de Transformação de 30 dias',
    caminho: '/pt/nutri/metodo/jornada',
    passo_a_passo: [
      '1. Acesse o menu lateral',
      '2. Clique em "Jornada 30 Dias"',
      '3. Veja seu progresso atual',
      '4. Acesse o conteúdo do dia',
      '5. Complete as atividades propostas',
      '6. Acompanhe sua evolução ao longo dos 30 dias'
    ],
    icone: '📘',
    categoria: 'formacao',
    atalho: 'Menu > Jornada 30 Dias',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'jornada', 'jornada 30 dias', '30 dias', 'transformação',
      'trilha', 'aprendizado', 'curso'
    ]
  },
  
  // ============================================
  // FORMAÇÃO EMPRESARIAL - PILARES DO MÉTODO
  // ============================================
  
  'pilares-metodo': {
    id: 'pilares-metodo',
    titulo: 'Sobre o Método',
    descricao: 'Estude os pilares fundamentais da Filosofia ILADA',
    caminho: '/pt/nutri/metodo/pilares',
    passo_a_passo: [
      '1. Acesse o menu lateral',
      '2. Clique em "Sobre o Método"',
      '3. Explore os diferentes pilares',
      '4. Estude cada pilar em profundidade',
      '5. Aplique os conceitos na sua prática',
      '6. Acompanhe seu progresso em cada pilar'
    ],
    icone: '📚',
    categoria: 'formacao',
    atalho: 'Menu > Sobre o Método',
    nivel_dificuldade: 'medio',
    palavras_chave: [
      'pilares', 'pilares do método', 'método', 'filosofia',
      'ilada', 'fundamentos', 'conceitos'
    ]
  },
  
  // ============================================
  // FORMAÇÃO EMPRESARIAL - BIBLIOTECA
  // ============================================
  
  'biblioteca': {
    id: 'biblioteca',
    titulo: 'Biblioteca',
    descricao: 'Acesse a biblioteca completa de materiais e recursos',
    caminho: '/pt/nutri/metodo/biblioteca',
    passo_a_passo: [
      '1. Acesse o menu lateral',
      '2. Clique em "Biblioteca"',
      '3. Explore os materiais disponíveis',
      '4. Use a busca para encontrar conteúdo específico',
      '5. Baixe ou visualize os materiais',
      '6. Organize seus materiais favoritos'
    ],
    icone: '🎒',
    categoria: 'formacao',
    atalho: 'Menu > Biblioteca',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'biblioteca', 'materiais', 'recursos', 'manual',
      'conteúdo', 'documentos', 'arquivos'
    ]
  },
  
  // ============================================
  // FORMAÇÃO EMPRESARIAL - ANOTAÇÕES
  // ============================================
  
  'anotacoes': {
    id: 'anotacoes',
    titulo: 'Minhas Anotações',
    descricao: 'Crie e gerencie suas anotações pessoais',
    caminho: '/pt/nutri/anotacoes',
    passo_a_passo: [
      '1. Acesse o menu lateral',
      '2. Clique em "Minhas Anotações"',
      '3. Veja todas as suas anotações',
      '4. Clique em "Nova Anotação" para criar',
      '5. Edite ou exclua anotações existentes',
      '6. Organize por categorias ou tags'
    ],
    icone: '📝',
    categoria: 'formacao',
    atalho: 'Menu > Minhas Anotações',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'anotação', 'anotações', 'notas', 'lembrete',
      'criar anotação', 'minhas anotações'
    ]
  },
  
  // ============================================
  // FORMAÇÃO EMPRESARIAL - CERTIFICADOS
  // ============================================
  
  'certificados': {
    id: 'certificados',
    titulo: 'Certificados',
    descricao: 'Visualize e baixe seus certificados de conclusão',
    caminho: '/pt/nutri/certificados',
    passo_a_passo: [
      '1. Acesse o menu lateral',
      '2. Clique em "Certificados"',
      '3. Veja todos os certificados disponíveis',
      '4. Clique em um certificado para visualizar',
      '5. Baixe o certificado em PDF',
      '6. Compartilhe nas redes sociais se desejar'
    ],
    icone: '🏆',
    categoria: 'formacao',
    atalho: 'Menu > Certificados',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'certificado', 'certificados', 'diploma', 'conclusão',
      'baixar certificado', 'ver certificados'
    ]
  },
  
  // ============================================
  // CONFIGURAÇÕES
  // ============================================
  
  'perfil': {
    id: 'perfil',
    titulo: 'Editar Perfil',
    descricao: 'Atualize suas informações pessoais e de perfil',
    caminho: '/pt/nutri/configuracoes',
    passo_a_passo: [
      '1. Acesse o menu "Configurações"',
      '2. Na seção "Perfil", edite suas informações',
      '3. Atualize nome, email, telefone, bio, etc',
      '4. Configure sua foto de perfil',
      '5. Clique em "Salvar" para confirmar'
    ],
    icone: '⚙️',
    categoria: 'configuracao',
    atalho: 'Menu > Configurações > Perfil',
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
    caminho: '/pt/nutri/configuracoes',
    passo_a_passo: [
      '1. Acesse o menu "Configurações"',
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
  // DASHBOARD
  // ============================================
  
  'dashboard': {
    id: 'dashboard',
    titulo: 'Dashboard',
    descricao: 'Acesse o painel principal com visão geral e ações rápidas',
    caminho: '/pt/nutri/dashboard',
    passo_a_passo: [
      '1. Após fazer login, você será direcionado ao Dashboard',
      '2. No Dashboard você verá:',
      '   - Estatísticas gerais',
      '   - Ações rápidas',
      '   - Links para principais funcionalidades',
      '   - Resumo da sua gestão GSAL',
      '3. Use o Dashboard como ponto de partida para tudo'
    ],
    icone: '🏠',
    categoria: 'dashboard',
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
    caminho: '/pt/nutri/suporte',
    passo_a_passo: [
      '1. Acesse o menu ou digite a URL diretamente',
      '2. Na página de suporte você pode:',
      '   - Ver tickets de suporte',
      '   - Criar novo ticket',
      '   - Ver respostas e histórico',
      '3. Use o chat de suporte para dúvidas rápidas'
    ],
    icone: '💬',
    categoria: 'suporte',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'suporte', 'ajuda', 'ticket', 'tickets',
      'atendimento', 'dúvidas', 'problema'
    ]
  },
  
  // ============================================
  // GESTÃO GSAL - FUNCIONALIDADES ADICIONAIS
  // ============================================
  
  'ver-cliente': {
    id: 'ver-cliente',
    titulo: 'Ver Detalhes do Cliente',
    descricao: 'Visualize todas as informações e histórico completo de um cliente',
    caminho: '/pt/nutri/clientes',
    passo_a_passo: [
      '1. Acesse "Gestão GSAL" > "Clientes"',
      '2. Encontre o cliente na lista ou use a busca',
      '3. Clique no nome do cliente para abrir os detalhes',
      '4. Você verá todas as abas:',
      '   - Informações pessoais',
      '   - Evolução',
      '   - Avaliações',
      '   - Agenda',
      '   - Timeline',
      '   - Documentos',
      '5. Navegue entre as abas para ver todas as informações'
    ],
    icone: '👁️',
    categoria: 'clientes',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'ver cliente', 'detalhes do cliente', 'informações do cliente',
      'histórico do cliente', 'perfil do cliente', 'abrir cliente'
    ]
  },
  
  'buscar-cliente': {
    id: 'buscar-cliente',
    titulo: 'Buscar Cliente',
    descricao: 'Encontre um cliente específico usando a busca',
    caminho: '/pt/nutri/clientes',
    passo_a_passo: [
      '1. Acesse "Gestão GSAL" > "Clientes"',
      '2. Use a barra de busca no topo da página',
      '3. Digite o nome, email ou telefone do cliente',
      '4. Os resultados aparecerão automaticamente',
      '5. Clique no cliente desejado para ver detalhes'
    ],
    icone: '🔍',
    categoria: 'clientes',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'buscar', 'procurar', 'pesquisar', 'encontrar',
      'buscar cliente', 'procurar cliente'
    ]
  },
  
  'agenda': {
    id: 'agenda',
    titulo: 'Agenda de Consultas',
    descricao: 'Gerencie sua agenda de consultas e compromissos',
    caminho: '/pt/nutri/agenda',
    passo_a_passo: [
      '1. Acesse o menu lateral',
      '2. Clique em "Agenda"',
      '3. Escolha a visualização: Semanal, Mensal ou Lista',
      '4. Use os filtros para ver consultas específicas',
      '5. Clique em "+ Nova Consulta" para agendar',
      '6. Arraste consultas para reagendar',
      '7. Clique em uma consulta para ver detalhes'
    ],
    icone: '📅',
    categoria: 'clientes',
    atalho: 'Menu > Agenda',
    nivel_dificuldade: 'medio',
    palavras_chave: [
      'agenda', 'consultas', 'compromissos', 'agendar',
      'horários', 'calendário', 'agendamento'
    ]
  },
  
  'painel-gsal': {
    id: 'painel-gsal',
    titulo: 'Painel GSAL',
    descricao: 'Acesse o painel principal do sistema GSAL com visão geral',
    caminho: '/pt/nutri/gsal',
    passo_a_passo: [
      '1. Acesse o menu "Gestão GSAL"',
      '2. Clique em "Painel GSAL" ou acesse diretamente',
      '3. Você verá:',
      '   - Estatísticas gerais (clientes, leads, consultas)',
      '   - Pipeline GSAL (Lead, Avaliação, Plano, Acompanhamento)',
      '   - Rotina Mínima do dia',
      '   - Ações rápidas',
      '4. Use o painel como ponto de partida para sua gestão'
    ],
    icone: '📊',
    categoria: 'clientes',
    atalho: 'Menu > Gestão GSAL > Painel GSAL',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'painel gsal', 'gsal', 'painel', 'visão geral',
      'dashboard gsal', 'resumo gsal'
    ]
  },
  
  // ============================================
  // FERRAMENTAS - FUNCIONALIDADES ADICIONAIS
  // ============================================
  
  'editar-ferramenta': {
    id: 'editar-ferramenta',
    titulo: 'Editar Ferramenta',
    descricao: 'Modifique uma ferramenta existente',
    caminho: '/pt/nutri/ferramentas',
    passo_a_passo: [
      '1. Acesse o menu "Ferramentas"',
      '2. Encontre a ferramenta que deseja editar',
      '3. Clique em "Editar" ou no nome da ferramenta',
      '4. Modifique título, descrição, cores, CTA, etc',
      '5. Clique em "Salvar" para confirmar as alterações',
      '6. O link da ferramenta permanece o mesmo'
    ],
    icone: '✏️',
    categoria: 'ferramentas',
    nivel_dificuldade: 'medio',
    palavras_chave: [
      'editar ferramenta', 'modificar ferramenta', 'atualizar ferramenta',
      'alterar ferramenta', 'mudar ferramenta'
    ]
  },
  
  'editar-quiz': {
    id: 'editar-quiz',
    titulo: 'Editar Quiz',
    descricao: 'Modifique um quiz existente',
    caminho: '/pt/nutri/quizzes',
    passo_a_passo: [
      '1. Acesse o menu "Ferramentas" > "Quizzes"',
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
  
  'criar-portal': {
    id: 'criar-portal',
    titulo: 'Criar Portal de Captação',
    descricao: 'Crie um portal personalizado com múltiplas ferramentas',
    caminho: '/pt/nutri/portals/novo',
    passo_a_passo: [
      '1. Acesse o menu "Ferramentas"',
      '2. Clique em "Portals" ou "Criar Portal"',
      '3. Configure o nome e descrição do portal',
      '4. Escolha o tipo de navegação (Sequencial ou Menu)',
      '5. Adicione ferramentas ao portal',
      '6. Configure a ordem das ferramentas',
      '7. Publique e compartilhe o link do portal'
    ],
    icone: '🌐',
    categoria: 'ferramentas',
    atalho: 'Menu > Ferramentas > Portals > Novo',
    nivel_dificuldade: 'medio',
    palavras_chave: [
      'portal', 'criar portal', 'novo portal', 'portal de captação',
      'portais', 'criar portais'
    ]
  },
  
  'ver-portals': {
    id: 'ver-portals',
    titulo: 'Ver Meus Portals',
    descricao: 'Visualize todos os portals que você criou',
    caminho: '/pt/nutri/portals',
    passo_a_passo: [
      '1. Acesse o menu "Ferramentas"',
      '2. Clique em "Portals"',
      '3. Você verá todos os seus portals',
      '4. Veja estatísticas de visualizações',
      '5. Clique em um portal para ver detalhes e editar'
    ],
    icone: '🌐',
    categoria: 'ferramentas',
    atalho: 'Menu > Ferramentas > Portals',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'portal', 'portais', 'ver portais', 'meus portais',
      'listar portais', 'portals criados'
    ]
  },
  
  'manual-tecnico': {
    id: 'manual-tecnico',
    titulo: 'Manual Técnico de Ferramentas',
    descricao: 'Acesse o manual completo sobre como usar as ferramentas',
    caminho: '/pt/nutri/ferramentas/manual-tecnico',
    passo_a_passo: [
      '1. Acesse o menu "Ferramentas"',
      '2. Clique em "Manual Técnico"',
      '3. Explore os guias e tutoriais disponíveis',
      '4. Aprenda sobre cada tipo de ferramenta',
      '5. Veja exemplos práticos de uso'
    ],
    icone: '📖',
    categoria: 'ferramentas',
    atalho: 'Menu > Ferramentas > Manual Técnico',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'manual', 'manual técnico', 'guia', 'tutorial',
      'como usar', 'documentação', 'ajuda ferramentas'
    ]
  },
  
  // ============================================
  // FORMULÁRIOS
  // ============================================
  
  'ver-formularios': {
    id: 'ver-formularios',
    titulo: 'Ver Formulários',
    descricao: 'Visualize todos os formulários que você criou',
    caminho: '/pt/nutri/formularios',
    passo_a_passo: [
      '1. Acesse o menu lateral',
      '2. Clique em "Formulários"',
      '3. Você verá todos os seus formulários',
      '4. Use os filtros para encontrar formulários específicos',
      '5. Veja templates disponíveis para criar novos'
    ],
    icone: '📋',
    categoria: 'ferramentas',
    atalho: 'Menu > Formulários',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'formulário', 'formulários', 'ver formulários', 'meus formulários',
      'listar formulários', 'formulários criados'
    ]
  },
  
  'criar-formulario': {
    id: 'criar-formulario',
    titulo: 'Criar Novo Formulário',
    descricao: 'Crie um novo formulário usando templates ou do zero',
    caminho: '/pt/nutri/formularios/novo',
    passo_a_passo: [
      '1. Acesse o menu "Formulários"',
      '2. Clique em "Criar Novo Formulário"',
      '3. Escolha um template ou crie do zero',
      '4. Configure nome, descrição e campos',
      '5. Adicione perguntas e tipos de resposta',
      '6. Configure opções de envio',
      '7. Salve e publique o formulário'
    ],
    icone: '➕',
    categoria: 'ferramentas',
    atalho: 'Menu > Formulários > Novo',
    nivel_dificuldade: 'medio',
    palavras_chave: [
      'criar formulário', 'novo formulário', 'fazer formulário',
      'adicionar formulário', 'formulário personalizado'
    ]
  },
  
  'ver-respostas-formulario': {
    id: 'ver-respostas-formulario',
    titulo: 'Ver Respostas do Formulário',
    descricao: 'Visualize todas as respostas recebidas de um formulário',
    caminho: '/pt/nutri/formularios',
    passo_a_passo: [
      '1. Acesse o menu "Formulários"',
      '2. Encontre o formulário desejado',
      '3. Clique em "Ver Respostas" ou no número de respostas',
      '4. Você verá todas as respostas organizadas',
      '5. Exporte os dados se necessário',
      '6. Filtre por data ou cliente'
    ],
    icone: '📊',
    categoria: 'ferramentas',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'respostas', 'ver respostas', 'respostas do formulário',
      'dados coletados', 'resultados do formulário'
    ]
  },
  
  // ============================================
  // FORMAÇÃO - FUNCIONALIDADES ADICIONAIS
  // ============================================
  
  'ver-dia-jornada': {
    id: 'ver-dia-jornada',
    titulo: 'Ver Dia Específico da Jornada',
    descricao: 'Acesse o conteúdo de um dia específico da Jornada 30 Dias',
    caminho: '/pt/nutri/metodo/jornada',
    passo_a_passo: [
      '1. Acesse "Jornada 30 Dias"',
      '2. Veja o calendário com todos os dias',
      '3. Clique no dia que deseja acessar',
      '4. Leia o conteúdo do dia',
      '5. Complete as atividades propostas',
      '6. Marque como concluído quando terminar'
    ],
    icone: '📅',
    categoria: 'formacao',
    atalho: 'Menu > Jornada 30 Dias > Dia X',
    nivel_dificuldade: 'facil',
    palavras_chave: [
      'dia jornada', 'dia específico', 'conteúdo do dia',
      'atividade do dia', 'jornada dia'
    ]
  },
  
  'ver-pilar': {
    id: 'ver-pilar',
    titulo: 'Ver Pilar Específico',
    descricao: 'Estude um pilar específico do Método em profundidade',
    caminho: '/pt/nutri/metodo/pilares',
    passo_a_passo: [
      '1. Acesse "Sobre o Método"',
      '2. Veja a lista de todos os pilares',
      '3. Clique no pilar que deseja estudar',
      '4. Leia o conteúdo completo',
      '5. Complete os exercícios relacionados',
      '6. Acompanhe seu progresso'
    ],
    icone: '📚',
    categoria: 'formacao',
    atalho: 'Menu > Sobre o Método > Pilar X',
    nivel_dificuldade: 'medio',
    palavras_chave: [
      'pilar', 'pilar específico', 'estudar pilar',
      'conteúdo do pilar', 'pilares do método'
    ]
  },
  
  'exercicios': {
    id: 'exercicios',
    titulo: 'Exercícios Práticos',
    descricao: 'Acesse exercícios práticos para aplicar o método',
    caminho: '/pt/nutri/metodo/exercicios',
    passo_a_passo: [
      '1. Acesse o menu lateral',
      '2. Clique em "Exercícios" (dentro de Formação)',
      '3. Veja todos os exercícios disponíveis',
      '4. Escolha o exercício que deseja fazer',
      '5. Siga as instruções passo a passo',
      '6. Salve seu progresso'
    ],
    icone: '✍️',
    categoria: 'formacao',
    atalho: 'Menu > Formação > Exercícios',
    nivel_dificuldade: 'medio',
    palavras_chave: [
      'exercício', 'exercícios', 'prática', 'atividades',
      'exercícios práticos', 'aplicar método'
    ]
  },
  
  'relatorios': {
    id: 'relatorios',
    titulo: 'Relatórios Gerais',
    descricao: 'Visualize relatórios completos da sua prática',
    caminho: '/pt/nutri/relatorios',
    passo_a_passo: [
      '1. Acesse o menu lateral',
      '2. Clique em "Relatórios"',
      '3. Escolha o tipo de relatório desejado',
      '4. Configure o período (data inicial e final)',
      '5. Aplique filtros se necessário',
      '6. Visualize os dados ou exporte em PDF/Excel'
    ],
    icone: '📈',
    categoria: 'relatorios',
    nivel_dificuldade: 'medio',
    palavras_chave: [
      'relatório', 'relatórios', 'estatística', 'dados',
      'análise', 'performance', 'métricas gerais'
    ]
  }
}


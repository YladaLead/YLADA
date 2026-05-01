/**
 * Traduções da página Admin > Usuários (pt / es / en)
 */

export type AdminUsuariosLang = 'pt' | 'es' | 'en'

export interface AdminUsuariosTranslations {
  page: {
    title: string
    subtitle: string
    back: string
  }
  filters: {
    /** Um único filtro: escopo da listagem (YLADA segmentos vs Wellness vs ambos) */
    base: string
    baseHint: string
    yladaAllSegments: string
    search: string
    searchPlaceholder: string
    status: string
    subscription: string
    subscriptionHint: string
    president: string
    /** Filtro pela coluna Área (slug do perfil) */
    segment: string
    segmentHint: string
    hideTestAccounts: string
    all: string
    active: string
    inactive: string
    free: string
    /** Subfiltros de Free na listagem admin */
    freeNeverPaid: string
    freeFormerPaid: string
    freeMigration: string
    monthly: string
    annual: string
    /** Trial / convite (plan_type trial em subscriptions) */
    trial: string
    noSubscription: string
    /** Histórico: nunca teve mensal/anual vs já teve (qualquer área) */
    paymentHistory: string
    paymentHistoryHint: string
    neverHadPaidPlan: string
    hadPaidPlan: string
    /** Ordenação pela coluna Cadastro (data do perfil) */
    sortProfileDate: string
    sortProfileDateHint: string
    sortDefault: string
    sortRecentFirst: string
    sortOldestFirst: string
  }
  areas: {
    nutri: string
    coach: string
    nutra: string
    wellness: string
    med: string
    psi: string
    psicanalise: string
    odonto: string
    estetica: string
    fitness: string
    joias: string
    perfumaria: string
    ylada: string
    seller: string
    /** Produtos YLADA Pro (vertical em leader_tenants) — coluna Área na listagem admin */
    pro_terapia_capilar: string
    pro_estetica_corporal: string
    pro_lideres: string
  }
  export: string
  stats: {
    total: string
    active: string
    inactive: string
    showing: string
    /** Contagem de e-mails em domínios de teste (excluídos do Total/Ativos acima) */
    testAccounts: string
    testDomainsHint: string
    /** Sufixo quando a lista oculta contas de teste */
    excludingTestAccounts: string
    /** Contagens histórico mensal/anual no mesmo conjunto do Total (prod., filtros atuais) */
    paymentHistoryNeverProd: string
    paymentHistoryFormerProd: string
    paymentHistoryProdHint: string
  }
  table: {
    user: string
    area: string
    isPresident: string
    president: string
    status: string
    subscription: string
    enrollment: string
    /** Subtítulo no cabeçalho da coluna — evita confundir com vencimento do plano */
    enrollmentSub: string
    profileDateStamp: string
    /** Subtítulo no cabeçalho da coluna Leads (links vs cliques) */
    leadsColumnSub: string
    leads: string
    actions: string
    edit: string
    subscriptionBtn: string
    delete: string
    defineAsPresident: string
    saving: string
    neverSubscribed: string
    expires: string
    expired: string
    leadsLabel: string
    linksLabel: string
    clicksLabel: string
    /** Compartilhar resultado (links YLADA) */
    shareYladaLabel: string
    /** Abrir análise completa no resultado */
    fullAnalysisExpandLabel: string
    whatsapp: string
    notDefined: string
    yes: string
    nameLabel: string
    statusActive: string
    statusInactive: string
    /** Texto único para plano Free da matriz (não cortesia): não é mensal/anual */
    freeMatrizHint: string
    /** Free matriz como cortesia administrativa explícita */
    freeCourtesyHint: string
    /** Só quando não existe linha em subscriptions (matriz) */
    matrizNoSubRowHint: string
    /** Destaque na coluna Assinatura quando há vencimento */
    planEndHighlight: string
    /** Badge ao lado do e-mail para domínios de teste */
    testAccountBadge: string
    /** Chip na coluna Assinatura: nunca teve plano pago recorrente */
    paymentHistoryNeverBadge: string
    /** Chip: já teve mensal ou anual em algum momento */
    paymentHistoryFormerBadge: string
  }
  subscriptionBadge: {
    active: string
    expired: string
    none: string
  }
  subscriptionType: {
    monthly: string
    annual: string
    /** Entrada / matriz sem cobrança recorrente (não mensal nem anual) */
    free: string
    /** Cortesia administrativa (free_cor_ / concessão explícita) */
    courtesy: string
    freeNeverPaid: string
    freeFormerPaid: string
    freeMigration: string
    /** Plano ativo sem data de fim no registro */
    noPlanEnd: string
    /** Trial Wellness (convite presidente etc.) */
    trial: string
    none: string
  }
  modal: {
    editUser: string
    fullName: string
    area: string
    areaHint: string
    president: string
    presidentHint: string
    cancel: string
    save: string
    saving: string
    tempPassword: string
    tempPasswordHint: string
    generateTempPassword: string
    editSubscription: string
    planType: string
    expirationDate: string
    /** Dica sob o campo de vencimento (free matriz vs perfil) */
    expirationDateHint: string
    /** No modal de assinatura: rótulo da categoria padronizada (Free, Cortesia, Mensal, Anual…) */
    planCategoryInModal: string
    subscriptionStatus: string
    subscriptionStatusHint: string
    deleteUser: string
    deleteConfirm: string
    deleteWarning: string
    tempPasswordTitle: string
    tempPasswordImportant: string
    tempPasswordSend: string
    tempPasswordLabel: string
    copy: string
    expiresAt: string
    tempPasswordTip: string
    close: string
    matrizFreeTitle: string
    matrizFreeIntro: string
    matrizFreeNotPassword: string
    matrizFreeImplicitHint: string
    matrizFreeHasRowHint: string
    matrizFreeExpiresLabel: string
    matrizFreeDaysValid: string
    matrizFreeCreate: string
    matrizFreeExtendDays: string
    matrizFreeExtend: string
    matrizFreeSuccessCreate: string
    matrizFreeSuccessExtend: string
    matrizFreeError: string
    matrizFreeMigrationTitle: string
    matrizFreeMigrationIntro: string
    matrizFreeCourtesyTitle: string
    matrizFreeCourtesyIntro: string
    matrizFreeMigrationCreateBtn: string
    matrizFreeCourtesyCreateBtn: string
  }
  messages: {
    noUsers: string
    /** Lista tem usuários, mas todos são teste e estão ocultos */
    noUsersVisibleHiddenTests: string
    loading: string
    userUpdated: string
    subscriptionUpdated: string
    userDeleted: string
    presidentDefined: string
    tempPasswordGenerated: string
    passwordCopied: string
    errorLoad: string
    errorUpdate: string
    errorDelete: string
    errorDefinePresident: string
    errorNoSubscription: string
    errorNotAuthenticated: string
    yladaSignupHint: string
    searchHintAdmin: string
  }
}

const pt: AdminUsuariosTranslations = {
  page: {
    title: 'Usuários',
    subtitle: 'Lista por base (YLADA ou Wellness). O segmento exato de cada pessoa continua na coluna Área.',
    back: 'Voltar',
  },
  filters: {
    base: 'Base',
    baseHint:
      'Todos = YLADA e Wellness na mesma lista. YLADA = todos os perfis da matriz (ylada, med, psi, vendas, nutri…). Wellness = só Herbalife.',
    yladaAllSegments: 'YLADA (todos os segmentos)',
    search: 'Buscar',
    searchPlaceholder: 'E-mail, nome ou WhatsApp…',
    status: 'Situação',
    subscription: 'Assinatura',
    subscriptionHint:
      'Freedom = free com limites do freemium na matriz (links, WhatsApp, Noel). Cortesia (free_cor_) = tratamento Pro. Mensal, anual e trial incluem vigentes e vencidos. Trial não some “por cima” do último mensal/anual na coluna (relatório).',
    president: 'Presidente',
    segment: 'Segmento',
    segmentHint:
      'Refina pela coluna Área (perfil no cadastro). As opções respeitam a Base: em YLADA, só segmentos da matriz.',
    hideTestAccounts: 'Ocultar contas de teste (lista e CSV)',
    all: 'Todos',
    active: 'Com acesso (pago ou Freedom vigente)',
    inactive: 'Vencido ou sem plano pago ativo',
    free: 'Freedom (todos)',
    freeNeverPaid: 'Freedom — nunca pagou',
    freeFormerPaid: 'Freedom — ex-pagante',
    freeMigration: 'Freedom — migração / manual',
    monthly: 'Mensal',
    annual: 'Anual',
    trial: 'Trial',
    noSubscription: 'Sem assinatura',
    paymentHistory: 'Histórico pago',
    paymentHistoryHint:
      'Com base em registros mensal/anual em subscriptions (qualquer área). Independente do plano atual ou se está vencido.',
    neverHadPaidPlan: 'Nunca teve mensal/anual',
    hadPaidPlan: 'Já teve mensal ou anual',
    sortProfileDate: 'Ordem no cadastro',
    sortProfileDateHint:
      'Use “Últimos que entraram” para ordenar pela data de criação da conta no sistema (coluna Cadastro), não por edições posteriores do perfil.',
    sortDefault: 'Padrão (banco)',
    sortRecentFirst: 'Últimos que entraram',
    sortOldestFirst: 'Mais antigos primeiro',
  },
  areas: {
    nutri: 'Nutricionistas',
    coach: 'Coaches',
    nutra: 'Nutra',
    wellness: 'Wellness',
    med: 'Med',
    psi: 'Psi',
    psicanalise: 'Psicanalise',
    odonto: 'Odonto',
    estetica: 'Estética',
    fitness: 'Fitness',
    joias: 'Joias e bijuterias',
    perfumaria: 'Perfumaria',
    ylada: 'YLADA',
    seller: 'Vendas',
    pro_terapia_capilar: 'Pro Terapia capilar',
    pro_estetica_corporal: 'Pro Estética corporal',
    pro_lideres: 'Pro Líderes',
  },
  export: 'Exportar planilha (CSV)',
  stats: {
    total: 'Total',
    active: 'Com acesso',
    inactive: 'Sem acesso / vencido',
    showing: 'Na lista',
    testAccounts: 'Contas teste',
    testDomainsHint:
      'Domínios @ylada.com, @ylada.app e e-mails configurados (ex.: portalmagra@gmail.com). Extras: ADMIN_TEST_EMAIL_DOMAINS e ADMIN_TEST_EMAILS no servidor.',
    excludingTestAccounts: 'sem testes',
    paymentHistoryNeverProd: 'Nunca teve mensal/anual (prod.)',
    paymentHistoryFormerProd: 'Já teve mensal ou anual (prod.)',
    paymentHistoryProdHint:
      'Contagens no mesmo conjunto do Total (prod.): usuários visíveis com os filtros atuais, excluindo contas de teste. Soma com “Já teve…” = Total.',
  },
  table: {
    user: 'Usuário',
    area: 'Área',
    isPresident: 'É presidente',
    president: 'Presidente',
    status: 'Status',
    subscription: 'Assinatura',
    enrollment: 'Cadastro',
    enrollmentSub:
      'Criação da conta no sistema (signup). Não é fim do plano nem “perfil todo preenchido”.',
    profileDateStamp: 'Conta',
    leadsColumnSub:
      'Leads = WhatsApp. Links = diagnósticos. Cliques = views. Compartilhar / análise expandida = botões no resultado (links YLADA).',
    leads: 'Leads',
    actions: 'Ações',
    edit: 'Editar',
    subscriptionBtn: 'Assinatura',
    delete: 'Deletar',
    defineAsPresident: 'Definir como presidente',
    saving: 'Salvando…',
    neverSubscribed: 'Nunca assinou',
    expires: 'Vence',
    expired: 'Venceu',
    leadsLabel: 'Leads',
    linksLabel: 'Links',
    clicksLabel: 'Cliques',
    shareYladaLabel: 'Compartilhar',
    fullAnalysisExpandLabel: 'Análise exp.',
    whatsapp: 'WhatsApp',
    notDefined: 'Não definido',
    yes: 'Sim',
    nameLabel: 'Nome',
    statusActive: 'Ativo',
    statusInactive: 'Inativo',
    freeMatrizHint:
      'Plano Freedom (limites): não é mensal nem anual. Na matriz YLADA vale o teto freemium (diagnóstico ativo, WhatsApp/mês, Noel) até migrar ao Pro. A data acima é o fim do período concedido (ativo ou vencido).',
    freeCourtesyHint:
      'Cortesia: prazo concedido manualmente pela equipe; vencimento na data acima. Não é plano mensal nem anual.',
    matrizNoSubRowHint:
      'Plano Free sem linha em assinaturas ainda — em Editar, crie o free matriz (area ylada) com o prazo.',
    planEndHighlight: 'Fim do plano',
    testAccountBadge: 'Teste',
    paymentHistoryNeverBadge: 'Só free / nunca pagou recorrente',
    paymentHistoryFormerBadge: 'Já foi assinante (mensal ou anual)',
  },
  subscriptionBadge: {
    active: 'Ativa',
    expired: 'Vencida',
    none: 'Sem assinatura',
  },
  subscriptionType: {
    monthly: 'Mensal',
    annual: 'Anual',
    free: 'Freedom (limites)',
    courtesy: 'Cortesia (Pro)',
    freeNeverPaid: 'Freedom — nunca pagou',
    freeFormerPaid: 'Freedom — ex-pagante',
    freeMigration: 'Freedom — migração / manual',
    noPlanEnd: 'Sem vencimento no registro',
    trial: 'Trial',
    none: 'Sem assinatura',
  },
  modal: {
    editUser: 'Editar Usuário',
    fullName: 'Nome Completo',
    area: 'Área',
    areaHint: 'Perfil do usuário na plataforma',
    president: 'Presidente',
    presidentHint: 'Selecione o presidente ao qual este usuário pertence',
    cancel: 'Cancelar',
    save: 'Salvar',
    saving: 'Salvando...',
    tempPassword: 'Senha Provisória',
    tempPasswordHint: 'Gere uma senha provisória que expira em 3 dias. Envie pelo canal de suporte.',
    generateTempPassword: 'Gerar Senha Provisória',
    editSubscription: 'Editar Assinatura',
    planType: 'Tipo de Plano',
    expirationDate: 'Data de Vencimento',
    expirationDateHint:
      'Categorias padronizadas: Free, Cortesia, Mensal ou Anual. Esta data é o fim do período atual (free/cortesia) ou do ciclo pago.',
    planCategoryInModal: 'Categoria do plano:',
    subscriptionStatus: 'Status da assinatura',
    subscriptionStatusHint: 'Use "Cancelada" quando o reembolso foi feito no Mercado Pago e a pessoa deve sair do ativo.',
    deleteUser: 'Deletar Usuário',
    deleteConfirm: 'Tem certeza que deseja deletar',
    deleteWarning: 'Esta ação não pode ser desfeita!',
    tempPasswordTitle: 'Senha Provisória Gerada',
    tempPasswordImportant: 'Importante: Esta senha expira em 3 dias.',
    tempPasswordSend: 'Envie esta senha pelo canal de suporte (WhatsApp, chat, etc.).',
    tempPasswordLabel: 'Senha Provisória',
    copy: 'Copiar',
    expiresAt: 'Expira em',
    tempPasswordTip: 'Dica: Após copiar, envie pelo canal de suporte com as instruções:',
    close: 'Fechar',
    matrizFreeTitle: 'Plano free matriz (YLADA /pt)',
    matrizFreeIntro:
      'Define o prazo de acesso à matriz (registro em assinaturas com area ylada). Isto é independente da senha provisória de 3 dias.',
    matrizFreeNotPassword:
      'A senha provisória (abaixo) expira em 3 dias só para login; o plano free matriz pode ter prazo longo para uso da plataforma.',
    matrizFreeImplicitHint:
      'Ainda não há assinatura no banco. Use “Migração” (padrão longo) ou “Cortesia” (prazo curto) conforme o caso.',
    matrizFreeHasRowHint: 'Já existe assinatura area=ylada — estenda o prazo ou edite em “Assinatura”.',
    matrizFreeExpiresLabel: 'Vencimento atual (free matriz)',
    matrizFreeDaysValid: 'Validade inicial (dias)',
    matrizFreeCreate: 'Criar plano free matriz',
    matrizFreeExtendDays: 'Somar dias ao vencimento',
    matrizFreeExtend: 'Estender prazo',
    matrizFreeSuccessCreate: 'Plano free matriz criado com sucesso.',
    matrizFreeSuccessExtend: 'Prazo do free matriz atualizado.',
    matrizFreeError: 'Não foi possível salvar o plano free matriz.',
    matrizFreeMigrationTitle: 'Migração — plano free matriz (novo padrão)',
    matrizFreeMigrationIntro:
      'Para ex-mensal/anual vencido ou modelo antigo: mesmo acesso da matriz, registro free com prazo. Padrão sugerido: muitos dias (ex. 3650).',
    matrizFreeCourtesyTitle: 'Cortesia administrativa',
    matrizFreeCourtesyIntro:
      'Concessão pontual com prazo definido (trial estendido, apoio, etc.). Não confunde com a migração em massa do legado.',
    matrizFreeMigrationCreateBtn: 'Criar free (migração)',
    matrizFreeCourtesyCreateBtn: 'Criar free (cortesia)',
  },
  messages: {
    noUsers: 'Nenhum usuário encontrado',
    noUsersVisibleHiddenTests:
      'Com estes filtros há usuários, mas todos são contas de teste e estão ocultas. Desmarque “Ocultar contas de teste” para vê-los.',
    loading: 'Carregando usuários...',
    userUpdated: 'Usuário atualizado com sucesso!',
    subscriptionUpdated: 'Assinatura atualizada com sucesso!',
    userDeleted: 'Usuário deletado com sucesso!',
    presidentDefined: 'Usuário definido como presidente.',
    tempPasswordGenerated: 'Senha provisória gerada com sucesso!',
    passwordCopied: 'Senha copiada para a área de transferência!',
    errorLoad: 'Erro ao carregar dados',
    errorUpdate: 'Erro ao atualizar usuário',
    errorDelete: 'Erro ao deletar usuário',
    errorDefinePresident: 'Erro ao definir presidente.',
    errorNoSubscription:
      'Sem assinatura no banco. Abra Editar e use “Criar plano free matriz” com os dias; depois o botão Assinatura aparece para ajustar a data.',
    errorNotAuthenticated: 'Não autenticado',
    yladaSignupHint:
      'Cadastro em /pt (login matriz): e-mail e nome vão para o Supabase Auth e para user_profiles. WhatsApp em user_profiles.whatsapp ao preencher Conta. Para achar alguém: busca por e-mail ou Base YLADA.',
    searchHintAdmin:
      'Use e-mail, nome ou número (WhatsApp). Quem está só na área gratuita pode aparecer como “Inativo” no status: deixe Status em Todos para não esconder na listagem.',
  },
}

const es: AdminUsuariosTranslations = {
  page: {
    title: 'Usuarios',
    subtitle: 'Lista por base (YLADA o Wellness). El segmento exacto sigue en la columna Área.',
    back: 'Volver',
  },
  filters: {
    base: 'Base',
    baseHint:
      'Todos = YLADA y Wellness juntos. YLADA = todos los perfiles de la matriz. Wellness = solo Herbalife.',
    yladaAllSegments: 'YLADA (todos los segmentos)',
    search: 'Buscar',
    searchPlaceholder: 'Email, nombre o WhatsApp…',
    status: 'Estado',
    subscription: 'Suscripción',
    subscriptionHint:
      'Freedom = gratis con límites freemium en la matriz (enlaces, WhatsApp, Noel). Cortesía (free_cor_) = tratamiento Pro. Mensual, anual y trial incluyen vigentes y vencidos.',
    president: 'Presidente',
    segment: 'Segmento',
    segmentHint:
      'Filtra por la columna Área (perfil). Las opciones dependen de la Base: en YLADA, solo la matriz.',
    hideTestAccounts: 'Ocultar cuentas de prueba (lista y CSV)',
    all: 'Todos',
    active: 'Con acceso (pago o Free vigente)',
    inactive: 'Vencido o sin plan pagado activo',
    free: 'Freedom (todos)',
    freeNeverPaid: 'Freedom — nunca pagó',
    freeFormerPaid: 'Freedom — ex pagador',
    freeMigration: 'Freedom — migración / manual',
    monthly: 'Mensual',
    annual: 'Anual',
    trial: 'Trial',
    noSubscription: 'Sin suscripción',
    paymentHistory: 'Historial de pago',
    paymentHistoryHint:
      'Según registros mensual/anual en subscriptions (cualquier área). Independiente del plan actual o si está vencido.',
    neverHadPaidPlan: 'Nunca tuvo mensual/anual',
    hadPaidPlan: 'Ya tuvo mensual o anual',
    sortProfileDate: 'Orden de registro',
    sortProfileDateHint:
      '“Últimos en entrar” ordena por fecha de creación del perfil (columna Registro).',
    sortDefault: 'Predeterminado (BD)',
    sortRecentFirst: 'Últimos en entrar',
    sortOldestFirst: 'Más antiguos primero',
  },
  areas: {
    nutri: 'Nutricionistas',
    coach: 'Coaches',
    nutra: 'Nutra',
    wellness: 'Wellness',
    med: 'Med',
    psi: 'Psi',
    psicanalise: 'Psicanalise',
    odonto: 'Odonto',
    estetica: 'Estética',
    fitness: 'Fitness',
    joias: 'Joyería y bisutería',
    perfumaria: 'Perfumaria',
    ylada: 'YLADA',
    seller: 'Ventas',
    pro_terapia_capilar: 'Pro Terapia capilar',
    pro_estetica_corporal: 'Pro Estética corporal',
    pro_lideres: 'Pro Líderes',
  },
  export: 'Exportar hoja (CSV)',
  stats: {
    total: 'Total',
    active: 'Con acceso',
    inactive: 'Sin acceso / vencido',
    showing: 'En la lista',
    testAccounts: 'Cuentas de prueba',
    testDomainsHint:
      'Dominios @ylada.com, @ylada.app y correos configurados (ej.: portalmagra@gmail.com). Extras: ADMIN_TEST_EMAIL_DOMAINS y ADMIN_TEST_EMAILS en el servidor.',
    excludingTestAccounts: 'sin pruebas',
    paymentHistoryNeverProd: 'Nunca tuvo mensual/anual (prod.)',
    paymentHistoryFormerProd: 'Ya tuvo mensual o anual (prod.)',
    paymentHistoryProdHint:
      'Mismo conjunto que Total (prod.): usuarios visibles con los filtros actuales, sin cuentas de prueba. La suma con “Ya tuvo…” = Total.',
  },
  table: {
    user: 'Usuario',
    area: 'Área',
    isPresident: 'Es presidente',
    president: 'Presidente',
    status: 'Estado',
    subscription: 'Suscripción',
    enrollment: 'Registro',
    enrollmentSub:
      'Creación de la cuenta en el sistema (registro). No es fin del plan ni “perfil completo”.',
    profileDateStamp: 'Cuenta',
    leadsColumnSub:
      'Leads = WhatsApp. Enlaces = diagnósticos. Clics = vistas. Compartir / análisis exp. = botones en el resultado (YLADA).',
    leads: 'Leads',
    actions: 'Acciones',
    edit: 'Editar',
    subscriptionBtn: 'Suscripción',
    delete: 'Eliminar',
    defineAsPresident: 'Definir como presidente',
    saving: 'Guardando…',
    neverSubscribed: 'Nunca suscribió',
    expires: 'Vence',
    expired: 'Venció',
    leadsLabel: 'Leads',
    linksLabel: 'Enlaces',
    clicksLabel: 'Clics',
    shareYladaLabel: 'Compartir',
    fullAnalysisExpandLabel: 'Análisis exp.',
    whatsapp: 'WhatsApp',
    notDefined: 'No definido',
    yes: 'Sí',
    nameLabel: 'Nombre',
    statusActive: 'Activo',
    statusInactive: 'Inactivo',
    freeMatrizHint:
      'Plan Freedom (límites): no es mensual ni anual. En la matriz YLADA aplica el techo freemium (diagnóstico activo, WhatsApp/mes, Noel) hasta pasar a Pro. La fecha de arriba es el fin del período.',
    freeCourtesyHint:
      'Cortesía: plazo otorgado manualmente por el equipo. No es plan mensual ni anual.',
    matrizNoSubRowHint:
      'Plan Free sin fila en suscripciones — en Editar, cree el free matriz (area ylada) con el plazo.',
    planEndHighlight: 'Fin del plan',
    testAccountBadge: 'Prueba',
    paymentHistoryNeverBadge: 'Solo gratis / nunca pagó recurrente',
    paymentHistoryFormerBadge: 'Ya fue suscriptor (mensual o anual)',
  },
  subscriptionBadge: {
    active: 'Activa',
    expired: 'Vencida',
    none: 'Sin suscripción',
  },
  subscriptionType: {
    monthly: 'Mensual',
    annual: 'Anual',
    free: 'Freedom (límites)',
    courtesy: 'Cortesía (Pro)',
    freeNeverPaid: 'Freedom — nunca pagó',
    freeFormerPaid: 'Freedom — ex pagador',
    freeMigration: 'Freedom — migración / manual',
    noPlanEnd: 'Sin vencimiento en el registro',
    trial: 'Trial',
    none: 'Sin suscripción',
  },
  modal: {
    editUser: 'Editar Usuario',
    fullName: 'Nombre Completo',
    area: 'Área',
    areaHint: 'Perfil del usuario en la plataforma',
    president: 'Presidente',
    presidentHint: 'Seleccione el presidente al que pertenece este usuario',
    cancel: 'Cancelar',
    save: 'Guardar',
    saving: 'Guardando...',
    tempPassword: 'Contraseña Provisional',
    tempPasswordHint: 'Genere una contraseña provisional que expira en 3 días. Envíe por el canal de soporte.',
    generateTempPassword: 'Generar Contraseña Provisional',
    editSubscription: 'Editar Suscripción',
    planType: 'Tipo de Plan',
    expirationDate: 'Fecha de Vencimiento',
    expirationDateHint:
      'Categorías: Free, Cortesía, Mensual o Anual. Esta fecha es el fin del período actual o del ciclo pagado.',
    planCategoryInModal: 'Categoría del plan:',
    subscriptionStatus: 'Estado de la suscripción',
    subscriptionStatusHint: 'Use "Cancelada" cuando se hizo el reembolso en Mercado Pago y la persona debe salir del activo.',
    deleteUser: 'Eliminar Usuario',
    deleteConfirm: '¿Está seguro de que desea eliminar',
    deleteWarning: '¡Esta acción no se puede deshacer!',
    tempPasswordTitle: 'Contraseña Provisional Generada',
    tempPasswordImportant: 'Importante: Esta contraseña expira en 3 días.',
    tempPasswordSend: 'Envíe esta contraseña por el canal de soporte (WhatsApp, chat, etc.).',
    tempPasswordLabel: 'Contraseña Provisional',
    copy: 'Copiar',
    expiresAt: 'Expira en',
    tempPasswordTip: 'Consejo: Después de copiar, envíe por el canal de soporte con las instrucciones:',
    close: 'Cerrar',
    matrizFreeTitle: 'Plan free matriz (YLADA /pt)',
    matrizFreeIntro:
      'Define la vigencia del acceso a la matriz (suscripción area ylada). Independiente de la contraseña provisional de 3 días.',
    matrizFreeNotPassword:
      'La contraseña provisional expira en 3 días solo para login; el plan free matriz puede tener plazos largos.',
    matrizFreeImplicitHint:
      'Aún no hay suscripción en la base. Use “Migración” (plazo largo) o “Cortesía” (plazo corto) según el caso.',
    matrizFreeHasRowHint: 'Ya existe suscripción area=ylada — extienda o edite en “Suscripción”.',
    matrizFreeExpiresLabel: 'Vencimiento actual (free matriz)',
    matrizFreeDaysValid: 'Validez inicial (días)',
    matrizFreeCreate: 'Crear plan free matriz',
    matrizFreeExtendDays: 'Sumar días al vencimiento',
    matrizFreeExtend: 'Extender plazo',
    matrizFreeSuccessCreate: 'Plan free matriz creado.',
    matrizFreeSuccessExtend: 'Plazo del free matriz actualizado.',
    matrizFreeError: 'No se pudo guardar el plan free matriz.',
    matrizFreeMigrationTitle: 'Migración — plan free matriz (nuevo estándar)',
    matrizFreeMigrationIntro:
      'Para ex mensual/anual vencido o modelo antiguo: acceso a la matriz con registro free a plazo. Sugerido: muchos días (ej. 3650).',
    matrizFreeCourtesyTitle: 'Cortesía administrativa',
    matrizFreeCourtesyIntro:
      'Concesión puntual con plazo (soporte, prueba extendida, etc.). No es la migración masiva del legado.',
    matrizFreeMigrationCreateBtn: 'Crear free (migración)',
    matrizFreeCourtesyCreateBtn: 'Crear free (cortesía)',
  },
  messages: {
    noUsers: 'Ningún usuario encontrado',
    noUsersVisibleHiddenTests:
      'Con estos filtros hay usuarios, pero todos son cuentas de prueba y están ocultas. Desmarque “Ocultar cuentas de prueba” para verlas.',
    loading: 'Cargando usuarios...',
    userUpdated: '¡Usuario actualizado con éxito!',
    subscriptionUpdated: '¡Suscripción actualizada con éxito!',
    userDeleted: '¡Usuario eliminado con éxito!',
    presidentDefined: 'Usuario definido como presidente.',
    tempPasswordGenerated: '¡Contraseña provisional generada con éxito!',
    passwordCopied: '¡Contraseña copiada al portapapeles!',
    errorLoad: 'Error al cargar datos',
    errorUpdate: 'Error al actualizar usuario',
    errorDelete: 'Error al eliminar usuario',
    errorDefinePresident: 'Error al definir presidente.',
    errorNoSubscription:
      'Sin suscripción en la base. En Editar use “Crear plan free matriz”; luego aparece el botón Suscripción.',
    errorNotAuthenticated: 'No autenticado',
    yladaSignupHint:
      'Registro en /pt: email y nombre en Auth y user_profiles. WhatsApp al completar Cuenta. Busque por email o Base YLADA.',
    searchHintAdmin:
      'Busque por email, nombre o WhatsApp. Usuarios solo gratuitos pueden verse “Inactivos”: deje Estado en Todos.',
  },
}

const en: AdminUsuariosTranslations = {
  page: {
    title: 'Users',
    subtitle: 'List by base (YLADA or Wellness). Each person’s segment stays in the Area column.',
    back: 'Back',
  },
  filters: {
    base: 'Base',
    baseHint:
      'All = YLADA and Wellness together. YLADA = all matrix profiles (ylada, med, psi, sales, nutri…). Wellness = Herbalife only.',
    yladaAllSegments: 'YLADA (all segments)',
    search: 'Search',
    searchPlaceholder: 'Email, name or WhatsApp…',
    status: 'Status',
    subscription: 'Subscription',
    subscriptionHint:
      'Freedom = free with matrix freemium limits (links, WhatsApp, Noel). Courtesy (free_cor_) = Pro treatment. Monthly, annual, and trial include active and expired.',
    president: 'President',
    segment: 'Segment',
    segmentHint:
      'Filter by the Area column (profile). Options follow Base: under YLADA, matrix segments only.',
    hideTestAccounts: 'Hide test accounts (list and CSV)',
    all: 'All',
    active: 'With access (paid or active Freedom)',
    inactive: 'Expired or no active paid plan',
    free: 'Freedom (all)',
    freeNeverPaid: 'Freedom — never paid',
    freeFormerPaid: 'Freedom — former payer',
    freeMigration: 'Freedom — migration / manual',
    monthly: 'Monthly',
    annual: 'Annual',
    trial: 'Trial',
    noSubscription: 'No subscription',
    paymentHistory: 'Paid history',
    paymentHistoryHint:
      'Based on monthly/annual rows in subscriptions (any area). Independent of current plan or expiry.',
    neverHadPaidPlan: 'Never had monthly/annual',
    hadPaidPlan: 'Had monthly or annual before',
    sortProfileDate: 'Profile signup order',
    sortProfileDateHint:
      '“Latest signups” sorts by profile creation time (Enrollment column).',
    sortDefault: 'Default (database)',
    sortRecentFirst: 'Latest signups first',
    sortOldestFirst: 'Oldest first',
  },
  areas: {
    nutri: 'Nutritionists',
    coach: 'Coaches',
    nutra: 'Nutra',
    wellness: 'Wellness',
    med: 'Med',
    psi: 'Psi',
    psicanalise: 'Psicanalise',
    odonto: 'Odonto',
    estetica: 'Aesthetics',
    fitness: 'Fitness',
    joias: 'Jewelry & fashion jewelry',
    perfumaria: 'Perfumaria',
    ylada: 'YLADA',
    seller: 'Sales',
    pro_terapia_capilar: 'Pro Hair therapy',
    pro_estetica_corporal: 'Pro Body aesthetics',
    pro_lideres: 'Pro Leaders',
  },
  export: 'Export spreadsheet (CSV)',
  stats: {
    total: 'Total',
    active: 'With access',
    inactive: 'No access / expired',
    showing: 'In list',
    testAccounts: 'Test accounts',
    testDomainsHint:
      '@ylada.com, @ylada.app and configured addresses (e.g. portalmagra@gmail.com). Server env: ADMIN_TEST_EMAIL_DOMAINS, ADMIN_TEST_EMAILS.',
    excludingTestAccounts: 'excl. test',
    paymentHistoryNeverProd: 'Never had monthly/annual (prod.)',
    paymentHistoryFormerProd: 'Had monthly or annual (prod.)',
    paymentHistoryProdHint:
      'Same set as Total (prod.): visible users with current filters, excluding test accounts. Sum with “Had…” = Total.',
  },
  table: {
    user: 'User',
    area: 'Area',
    isPresident: 'Is president',
    president: 'President',
    status: 'Status',
    subscription: 'Subscription',
    enrollment: 'Signed up',
    enrollmentSub:
      'Account created in the system (signup). Not plan end nor “fully completed profile”.',
    profileDateStamp: 'Account',
    leadsColumnSub:
      'Leads = WhatsApp. Links = diagnoses. Clicks = views. Share / full analysis = result screen buttons (YLADA links).',
    leads: 'Leads',
    actions: 'Actions',
    edit: 'Edit',
    subscriptionBtn: 'Subscription',
    delete: 'Delete',
    defineAsPresident: 'Set as president',
    saving: 'Saving…',
    neverSubscribed: 'Never subscribed',
    expires: 'Expires',
    expired: 'Expired',
    leadsLabel: 'Leads',
    linksLabel: 'Links',
    clicksLabel: 'Clicks',
    shareYladaLabel: 'Share',
    fullAnalysisExpandLabel: 'Full analysis',
    whatsapp: 'WhatsApp',
    notDefined: 'Not defined',
    yes: 'Yes',
    nameLabel: 'Name',
    statusActive: 'Active',
    statusInactive: 'Inactive',
    freeMatrizHint:
      'Freedom plan (limits): not monthly or annual. On the YLADA matrix, freemium caps apply (active diagnosis, WhatsApp/month, Noel) until upgrading to Pro. The date above is the end of the period.',
    freeCourtesyHint:
      'Courtesy: period granted manually by the team. Not a monthly or annual plan.',
    matrizNoSubRowHint:
      'Free plan with no subscription row yet — in Edit, create matrix free (ylada area) with the term.',
    planEndHighlight: 'Plan ends',
    testAccountBadge: 'Test',
    paymentHistoryNeverBadge: 'Free only / never paid recurring',
    paymentHistoryFormerBadge: 'Former subscriber (monthly or annual)',
  },
  subscriptionBadge: {
    active: 'Active',
    expired: 'Expired',
    none: 'No subscription',
  },
  subscriptionType: {
    monthly: 'Monthly',
    annual: 'Annual',
    free: 'Freedom (limits)',
    courtesy: 'Courtesy (Pro)',
    freeNeverPaid: 'Freedom — never paid',
    freeFormerPaid: 'Freedom — former payer',
    freeMigration: 'Freedom — migration / manual',
    noPlanEnd: 'No end date on record',
    trial: 'Trial',
    none: 'No subscription',
  },
  modal: {
    editUser: 'Edit User',
    fullName: 'Full Name',
    area: 'Area',
    areaHint: 'User profile on the platform',
    president: 'President',
    presidentHint: 'Select the president this user belongs to',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving...',
    tempPassword: 'Temporary Password',
    tempPasswordHint: 'Generate a temporary password that expires in 3 days. Send via support channel.',
    generateTempPassword: 'Generate Temporary Password',
    editSubscription: 'Edit Subscription',
    planType: 'Plan Type',
    expirationDate: 'Expiration Date',
    expirationDateHint:
      'Standard categories: Free, Courtesy, Monthly, or Annual. This date is the end of the current period or paid cycle.',
    planCategoryInModal: 'Plan category:',
    subscriptionStatus: 'Subscription status',
    subscriptionStatusHint: 'Use "Canceled" when refund was made on Mercado Pago and the person should be removed from active.',
    deleteUser: 'Delete User',
    deleteConfirm: 'Are you sure you want to delete',
    deleteWarning: 'This action cannot be undone!',
    tempPasswordTitle: 'Temporary Password Generated',
    tempPasswordImportant: 'Important: This password expires in 3 days.',
    tempPasswordSend: 'Send this password via support channel (WhatsApp, chat, etc.).',
    tempPasswordLabel: 'Temporary Password',
    copy: 'Copy',
    expiresAt: 'Expires in',
    tempPasswordTip: 'Tip: After copying, send via support channel with the instructions:',
    close: 'Close',
    matrizFreeTitle: 'Matrix free plan (YLADA /pt)',
    matrizFreeIntro:
      'Sets matrix access duration (subscription with area ylada). Independent from the 3-day provisional password.',
    matrizFreeNotPassword:
      'The provisional password expires in 3 days for login only; the matrix free plan can have a long access window.',
    matrizFreeImplicitHint:
      'No subscription row yet. Use “Migration” (long term) or “Courtesy” (short term) as appropriate.',
    matrizFreeHasRowHint: 'A ylada-area subscription exists — extend or use “Subscription” edit.',
    matrizFreeExpiresLabel: 'Current end date (matrix free)',
    matrizFreeDaysValid: 'Initial term (days)',
    matrizFreeCreate: 'Create matrix free plan',
    matrizFreeExtendDays: 'Add days to end date',
    matrizFreeExtend: 'Extend',
    matrizFreeSuccessCreate: 'Matrix free plan created.',
    matrizFreeSuccessExtend: 'Matrix free end date updated.',
    matrizFreeError: 'Could not save matrix free plan.',
    matrizFreeMigrationTitle: 'Migration — matrix free plan (new standard)',
    matrizFreeMigrationIntro:
      'For expired monthly/annual or legacy model: matrix access with a dated free row. Suggested: many days (e.g. 3650).',
    matrizFreeCourtesyTitle: 'Administrative courtesy',
    matrizFreeCourtesyIntro:
      'One-off access with a defined period (support, extended trial, etc.). Not the same as bulk legacy migration.',
    matrizFreeMigrationCreateBtn: 'Create free (migration)',
    matrizFreeCourtesyCreateBtn: 'Create free (courtesy)',
  },
  messages: {
    noUsers: 'No users found',
    noUsersVisibleHiddenTests:
      'There are users for these filters, but they are all test accounts and are hidden. Uncheck “Hide test accounts” to see them.',
    loading: 'Loading users...',
    userUpdated: 'User updated successfully!',
    subscriptionUpdated: 'Subscription updated successfully!',
    userDeleted: 'User deleted successfully!',
    presidentDefined: 'User set as president.',
    tempPasswordGenerated: 'Temporary password generated successfully!',
    passwordCopied: 'Password copied to clipboard!',
    errorLoad: 'Error loading data',
    errorUpdate: 'Error updating user',
    errorDelete: 'Error deleting user',
    errorDefinePresident: 'Error setting president.',
    errorNoSubscription:
      'No subscription row. In Edit use “Create matrix free plan”; then the Subscription button appears.',
    errorNotAuthenticated: 'Not authenticated',
    yladaSignupHint:
      'Sign up at /pt: email and name go to Auth and user_profiles. Phone/WhatsApp in user_profiles.whatsapp when the user saves Account. Find them via search or Base YLADA.',
    searchHintAdmin:
      'Search by email, name or WhatsApp. Free-only users may show as Inactive: set Status to All.',
  },
}

const byLang: Record<AdminUsuariosLang, AdminUsuariosTranslations> = { pt, es, en }

export function getAdminUsuariosTranslations(lang: string): AdminUsuariosTranslations {
  const key = lang === 'es' || lang === 'en' ? lang : 'pt'
  return byLang[key]
}

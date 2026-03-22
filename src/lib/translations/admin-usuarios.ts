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
    block: string
    blockHint: string
    matrizYlada: string
    legadoSegmentos: string
    demaisSegmentos: string
    search: string
    searchPlaceholder: string
    area: string
    areaHint: string
    status: string
    subscription: string
    president: string
    all: string
    active: string
    inactive: string
    free: string
    monthly: string
    annual: string
    noSubscription: string
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
    perfumaria: string
    ylada: string
    seller: string
  }
  export: string
  stats: {
    total: string
    active: string
    inactive: string
    showing: string
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
    whatsapp: string
    notDefined: string
    yes: string
    nameLabel: string
    statusActive: string
    statusInactive: string
    /** Gratuita com data de fim (admin concedeu prazo, ex. 90 dias) */
    freeGiftedHint: string
    /** Só quando não existe linha em subscriptions (matriz) */
    matrizNoSubRowHint: string
    /** Destaque na coluna Assinatura quando há vencimento */
    planEndHighlight: string
  }
  subscriptionBadge: {
    active: string
    expired: string
    none: string
  }
  subscriptionType: {
    monthly: string
    annual: string
    free: string
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
  }
  messages: {
    noUsers: string
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
    subtitle: 'Matriz YLADA (/pt), Wellness e segmentos — filtros alinhados ao modelo atual',
    back: 'Voltar',
  },
  filters: {
    block: 'Bloco',
    blockHint: 'Wellness (Herbalife) vs YLADA (matriz e segmentos)',
    matrizYlada: 'Matriz YLADA (/pt)',
    legadoSegmentos: 'Legado Nutri / Coach / Nutra',
    demaisSegmentos: 'Outros segmentos (med, psi, vendas…)',
    search: 'Buscar',
    searchPlaceholder: 'E-mail, nome ou WhatsApp…',
    area: 'Segmento',
    areaHint: 'Refina dentro do bloco (matriz, legado ou outros)',
    status: 'Status',
    subscription: 'Assinatura',
    president: 'Presidente',
    all: 'Todos',
    active: 'Ativos',
    inactive: 'Inativos',
    free: 'Free',
    monthly: 'Mensal',
    annual: 'Anual',
    noSubscription: 'Sem assinatura',
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
    perfumaria: 'Perfumaria',
    ylada: 'YLADA',
    seller: 'Vendas',
  },
  export: 'Exportar planilha (CSV)',
  stats: {
    total: 'Total',
    active: 'Ativos',
    inactive: 'Inativos',
    showing: 'Mostrando',
  },
  table: {
    user: 'Usuário',
    area: 'Área',
    isPresident: 'É presidente',
    president: 'Presidente',
    status: 'Status',
    subscription: 'Assinatura',
    enrollment: 'Cadastro',
    enrollmentSub: 'data do perfil (não é fim do plano)',
    profileDateStamp: 'Perfil',
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
    whatsapp: 'WhatsApp',
    notDefined: 'Não definido',
    yes: 'Sim',
    nameLabel: 'Nome',
    statusActive: 'Ativo',
    statusInactive: 'Inativo',
    freeGiftedHint:
      'Cortesia: período concedido (acesso completo; sem cobrança). O vencimento é o da linha acima.',
    matrizNoSubRowHint:
      'Sem linha de assinatura no banco — em Editar, crie plano free matriz (area ylada) com os dias.',
    planEndHighlight: 'Fim do plano',
  },
  subscriptionBadge: {
    active: 'Ativa',
    expired: 'Vencida',
    none: 'Sem assinatura',
  },
  subscriptionType: {
    monthly: 'Mensal',
    annual: 'Anual',
    free: 'Gratuita',
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
      'Ainda não há assinatura no banco para este usuário. Crie o registro (area ylada, ex. 90 dias) para fixar o prazo da cortesia.',
    matrizFreeHasRowHint: 'Já existe assinatura area=ylada — estenda o prazo ou edite em “Assinatura”.',
    matrizFreeExpiresLabel: 'Vencimento atual (free matriz)',
    matrizFreeDaysValid: 'Validade inicial (dias)',
    matrizFreeCreate: 'Criar plano free matriz',
    matrizFreeExtendDays: 'Somar dias ao vencimento',
    matrizFreeExtend: 'Estender prazo',
    matrizFreeSuccessCreate: 'Plano free matriz criado com sucesso.',
    matrizFreeSuccessExtend: 'Prazo do free matriz atualizado.',
    matrizFreeError: 'Não foi possível salvar o plano free matriz.',
  },
  messages: {
    noUsers: 'Nenhum usuário encontrado',
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
      'Cadastro em /pt (login matriz): e-mail e nome vão para o Supabase Auth e para a tabela user_profiles com perfil ylada. O telefone/WhatsApp fica em user_profiles.whatsapp quando a pessoa preenche Conta (ou API /api/ylada/account). Para achar alguém: use a busca por e-mail ou Bloco YLADA + segmento Matriz YLADA.',
    searchHintAdmin:
      'Use e-mail, nome ou número (WhatsApp). Quem está só na área gratuita pode aparecer como “Inativo” no status: deixe Status em Todos para não esconder na listagem.',
  },
}

const es: AdminUsuariosTranslations = {
  page: {
    title: 'Usuarios',
    subtitle: 'Matriz YLADA (/pt), Wellness y segmentos',
    back: 'Volver',
  },
  filters: {
    block: 'Bloque',
    blockHint: 'Wellness vs YLADA (matriz y segmentos)',
    matrizYlada: 'Matriz YLADA (/pt)',
    legadoSegmentos: 'Legado Nutri / Coach / Nutra',
    demaisSegmentos: 'Otros segmentos (med, psi, ventas…)',
    search: 'Buscar',
    searchPlaceholder: 'Email, nombre o WhatsApp…',
    area: 'Segmento',
    areaHint: 'Refina dentro del bloque',
    status: 'Estado',
    subscription: 'Suscripción',
    president: 'Presidente',
    all: 'Todos',
    active: 'Activos',
    inactive: 'Inactivos',
    free: 'Gratis',
    monthly: 'Mensual',
    annual: 'Anual',
    noSubscription: 'Sin suscripción',
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
    perfumaria: 'Perfumaria',
    ylada: 'YLADA',
    seller: 'Ventas',
  },
  export: 'Exportar hoja (CSV)',
  stats: {
    total: 'Total',
    active: 'Activos',
    inactive: 'Inactivos',
    showing: 'Mostrando',
  },
  table: {
    user: 'Usuario',
    area: 'Área',
    isPresident: 'Es presidente',
    president: 'Presidente',
    status: 'Estado',
    subscription: 'Suscripción',
    enrollment: 'Registro',
    enrollmentSub: 'fecha del perfil (no es fin del plan)',
    profileDateStamp: 'Perfil',
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
    whatsapp: 'WhatsApp',
    notDefined: 'No definido',
    yes: 'Sí',
    nameLabel: 'Nombre',
    statusActive: 'Activo',
    statusInactive: 'Inactivo',
    freeGiftedHint:
      'Cortesía: período otorgado (acceso completo; sin cobro). La fecha de fin es la indicada arriba.',
    matrizNoSubRowHint:
      'Sin fila de suscripción — en Editar, cree plan free matriz (area ylada) con los días.',
    planEndHighlight: 'Fin del plan',
  },
  subscriptionBadge: {
    active: 'Activa',
    expired: 'Vencida',
    none: 'Sin suscripción',
  },
  subscriptionType: {
    monthly: 'Mensual',
    annual: 'Anual',
    free: 'Gratuita',
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
      'Aún no hay suscripción en la base para este usuario. Cree el registro (area ylada, ej. 90 días) para fijar el plazo de la cortesía.',
    matrizFreeHasRowHint: 'Ya existe suscripción area=ylada — extienda o edite en “Suscripción”.',
    matrizFreeExpiresLabel: 'Vencimiento actual (free matriz)',
    matrizFreeDaysValid: 'Validez inicial (días)',
    matrizFreeCreate: 'Crear plan free matriz',
    matrizFreeExtendDays: 'Sumar días al vencimiento',
    matrizFreeExtend: 'Extender plazo',
    matrizFreeSuccessCreate: 'Plan free matriz creado.',
    matrizFreeSuccessExtend: 'Plazo del free matriz actualizado.',
    matrizFreeError: 'No se pudo guardar el plan free matriz.',
  },
  messages: {
    noUsers: 'Ningún usuario encontrado',
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
      'Registro en /pt: email y nombre en Auth y user_profiles (perfil ylada). WhatsApp en user_profiles.whatsapp al completar Cuenta. Busque por email o Bloque YLADA + Matriz YLADA.',
    searchHintAdmin:
      'Busque por email, nombre o WhatsApp. Usuarios solo gratuitos pueden verse “Inactivos”: deje Estado en Todos.',
  },
}

const en: AdminUsuariosTranslations = {
  page: {
    title: 'Users',
    subtitle: 'YLADA matrix (/pt), Wellness and segments',
    back: 'Back',
  },
  filters: {
    block: 'Block',
    blockHint: 'Wellness vs YLADA (matrix and segments)',
    matrizYlada: 'YLADA matrix (/pt)',
    legadoSegmentos: 'Legacy Nutri / Coach / Nutra',
    demaisSegmentos: 'Other segments (med, psi, sales…)',
    search: 'Search',
    searchPlaceholder: 'Email, name or WhatsApp…',
    area: 'Segment',
    areaHint: 'Refine within the block',
    status: 'Status',
    subscription: 'Subscription',
    president: 'President',
    all: 'All',
    active: 'Active',
    inactive: 'Inactive',
    free: 'Free',
    monthly: 'Monthly',
    annual: 'Annual',
    noSubscription: 'No subscription',
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
    perfumaria: 'Perfumaria',
    ylada: 'YLADA',
    seller: 'Sales',
  },
  export: 'Export spreadsheet (CSV)',
  stats: {
    total: 'Total',
    active: 'Active',
    inactive: 'Inactive',
    showing: 'Showing',
  },
  table: {
    user: 'User',
    area: 'Area',
    isPresident: 'Is president',
    president: 'President',
    status: 'Status',
    subscription: 'Subscription',
    enrollment: 'Signed up',
    enrollmentSub: 'profile date (not plan end)',
    profileDateStamp: 'Profile',
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
    whatsapp: 'WhatsApp',
    notDefined: 'Not defined',
    yes: 'Yes',
    nameLabel: 'Name',
    statusActive: 'Active',
    statusInactive: 'Inactive',
    freeGiftedHint:
      'Complimentary: access granted for a period (full access; no charge). End date is shown above.',
    matrizNoSubRowHint:
      'No subscription row — in Edit, create matrix free plan (ylada area) with the days.',
    planEndHighlight: 'Plan ends',
  },
  subscriptionBadge: {
    active: 'Active',
    expired: 'Expired',
    none: 'No subscription',
  },
  subscriptionType: {
    monthly: 'Monthly',
    annual: 'Annual',
    free: 'Free',
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
      'No subscription row yet for this user. Create one (ylada area, e.g. 90 days) to record the complimentary period end date.',
    matrizFreeHasRowHint: 'A ylada-area subscription exists — extend or use “Subscription” edit.',
    matrizFreeExpiresLabel: 'Current end date (matrix free)',
    matrizFreeDaysValid: 'Initial term (days)',
    matrizFreeCreate: 'Create matrix free plan',
    matrizFreeExtendDays: 'Add days to end date',
    matrizFreeExtend: 'Extend',
    matrizFreeSuccessCreate: 'Matrix free plan created.',
    matrizFreeSuccessExtend: 'Matrix free end date updated.',
    matrizFreeError: 'Could not save matrix free plan.',
  },
  messages: {
    noUsers: 'No users found',
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
      'Sign up at /pt: email and name go to Auth and user_profiles (perfil ylada). Phone/WhatsApp is stored in user_profiles.whatsapp when the user saves Account (or /api/ylada/account). Find them via search or Block YLADA + YLADA matrix.',
    searchHintAdmin:
      'Search by email, name or WhatsApp. Free-only users may show as Inactive: set Status to All.',
  },
}

const byLang: Record<AdminUsuariosLang, AdminUsuariosTranslations> = { pt, es, en }

export function getAdminUsuariosTranslations(lang: string): AdminUsuariosTranslations {
  const key = lang === 'es' || lang === 'en' ? lang : 'pt'
  return byLang[key]
}

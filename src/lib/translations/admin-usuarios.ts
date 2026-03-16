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
    notDefined: string
    yes: string
    nameLabel: string
    statusActive: string
    statusInactive: string
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
  }
}

const pt: AdminUsuariosTranslations = {
  page: {
    title: 'Usuários',
    subtitle: 'Gerencie seus nutricionistas, coaches e consultores',
    back: 'Voltar',
  },
  filters: {
    block: 'Bloco',
    blockHint: 'Princípios diferentes',
    search: 'Buscar',
    searchPlaceholder: 'Nome ou email...',
    area: 'Área',
    areaHint: 'Conforme o bloco',
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
    enrollment: 'Inscrição',
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
    notDefined: 'Não definido',
    yes: 'Sim',
    nameLabel: 'Nome',
    statusActive: 'Ativo',
    statusInactive: 'Inativo',
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
    errorNoSubscription: 'Usuário não tem assinatura ativa',
    errorNotAuthenticated: 'Não autenticado',
  },
}

const es: AdminUsuariosTranslations = {
  page: {
    title: 'Usuarios',
    subtitle: 'Gestione sus nutricionistas, coaches y consultores',
    back: 'Volver',
  },
  filters: {
    block: 'Bloque',
    blockHint: 'Principios diferentes',
    search: 'Buscar',
    searchPlaceholder: 'Nombre o email...',
    area: 'Área',
    areaHint: 'Según el bloque',
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
    enrollment: 'Inscripción',
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
    notDefined: 'No definido',
    yes: 'Sí',
    nameLabel: 'Nombre',
    statusActive: 'Activo',
    statusInactive: 'Inactivo',
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
    errorNoSubscription: 'El usuario no tiene suscripción activa',
    errorNotAuthenticated: 'No autenticado',
  },
}

const en: AdminUsuariosTranslations = {
  page: {
    title: 'Users',
    subtitle: 'Manage your nutritionists, coaches and consultants',
    back: 'Back',
  },
  filters: {
    block: 'Block',
    blockHint: 'Different principles',
    search: 'Search',
    searchPlaceholder: 'Name or email...',
    area: 'Area',
    areaHint: 'According to block',
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
    enrollment: 'Enrollment',
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
    notDefined: 'Not defined',
    yes: 'Yes',
    nameLabel: 'Name',
    statusActive: 'Active',
    statusInactive: 'Inactive',
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
    errorNoSubscription: 'User has no active subscription',
    errorNotAuthenticated: 'Not authenticated',
  },
}

const byLang: Record<AdminUsuariosLang, AdminUsuariosTranslations> = { pt, es, en }

export function getAdminUsuariosTranslations(lang: string): AdminUsuariosTranslations {
  const key = lang === 'es' || lang === 'en' ? lang : 'pt'
  return byLang[key]
}

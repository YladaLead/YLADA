/**
 * Traduz erros técnicos para mensagens amigáveis em português
 */
export function translateError(error: any): string {
  if (!error) {
    return 'Ops! Algo deu errado. Tente novamente.'
  }

  const errorMessage = error?.message || error?.error || String(error).toLowerCase()
  const errorString = typeof errorMessage === 'string' ? errorMessage.toLowerCase() : ''

  // Erros de banco de dados - coluna não existe
  if (errorString.includes('column') && errorString.includes('does not exist')) {
    return 'Estamos atualizando o sistema. Por favor, atualize a página e tente novamente.'
  }

  if (errorString.includes('schema cache')) {
    return 'Estamos atualizando o sistema. Por favor, atualize a página e tente novamente.'
  }

  // Erros de foreign key
  if (errorString.includes('foreign key') || errorString.includes('constraint')) {
    return 'Não foi possível salvar. Verifique se os dados estão corretos.'
  }

  // Erros de duplicado/unique
  if (errorString.includes('duplicate') || errorString.includes('unique') || errorString.includes('já está em uso')) {
    return 'Este nome já está em uso. Escolha outro.'
  }

  // Erros de autenticação
  if (errorString.includes('not authenticated') || errorString.includes('401') || errorString.includes('não autenticado')) {
    return 'Você precisa fazer login para continuar.'
  }

  if (errorString.includes('forbidden') || errorString.includes('403') || errorString.includes('sem permissão')) {
    return 'Você não tem permissão para realizar esta ação.'
  }

  if (errorString.includes('perfil') && errorString.includes('não corresponde')) {
    return 'Você está tentando acessar uma área que não corresponde ao seu perfil.'
  }

  // Erros de sessão
  if (errorString.includes('session') || errorString.includes('token') || errorString.includes('expired')) {
    return 'Sua sessão expirou. Faça login novamente.'
  }

  // Erros de rede
  if (errorString.includes('network') || errorString.includes('fetch failed') || errorString.includes('failed to fetch')) {
    return 'Sem conexão com a internet. Verifique sua rede e tente novamente.'
  }

  if (errorString.includes('timeout')) {
    return 'A operação está demorando muito. Tente novamente.'
  }

  // Erros de servidor
  if (errorString.includes('500') || errorString.includes('internal server error')) {
    return 'O serviço está temporariamente indisponível. Tente novamente em alguns minutos.'
  }

  if (errorString.includes('503') || errorString.includes('service unavailable')) {
    return 'O serviço está temporariamente indisponível. Tente novamente em alguns minutos.'
  }

  // Erros de validação
  if (errorString.includes('required') || errorString.includes('obrigatório')) {
    return 'Por favor, preencha todos os campos obrigatórios.'
  }

  if (errorString.includes('email') && (errorString.includes('invalid') || errorString.includes('inválido'))) {
    return 'Digite um email válido (exemplo: seu@email.com)'
  }

  if (errorString.includes('password') || errorString.includes('senha')) {
    if (errorString.includes('short') || errorString.includes('curta')) {
      return 'A senha deve ter pelo menos 6 caracteres.'
    }
    return 'Senha incorreta. Verifique e tente novamente.'
  }

  if (errorString.includes('url') && errorString.includes('invalid')) {
    return 'Digite uma URL válida (exemplo: https://seu-site.com)'
  }

  if (errorString.includes('slug') || errorString.includes('nome de url')) {
    if (errorString.includes('invalid') || errorString.includes('inválido')) {
      return 'O nome da URL só pode conter letras minúsculas, números e hífens.'
    }
    if (errorString.includes('já está em uso') || errorString.includes('already exists')) {
      return 'Este nome de URL já está em uso. Escolha outro.'
    }
  }

  // Erros de arquivo
  if (errorString.includes('file') || errorString.includes('arquivo')) {
    if (errorString.includes('too large') || errorString.includes('muito grande')) {
      return 'O arquivo é muito grande. Escolha um arquivo menor que 5MB.'
    }
    if (errorString.includes('format') || errorString.includes('formato')) {
      return 'Formato de arquivo não suportado. Use apenas imagens (JPG, PNG).'
    }
    return 'Não foi possível fazer upload do arquivo. Tente novamente.'
  }

  // Se a mensagem já estiver em português e for amigável, retornar ela mesma
  if (typeof errorMessage === 'string' && errorMessage.length > 0 && !errorMessage.includes('error:') && !errorMessage.includes('Error:')) {
    // Verificar se parece ser uma mensagem amigável (não começa com código ou URL)
    if (!errorMessage.match(/^[A-Z][A-Z0-9_]+:/) && !errorMessage.startsWith('http')) {
      return errorMessage
    }
  }

  // Erro genérico como último recurso
  return 'Ops! Algo deu errado. Tente novamente ou entre em contato com o suporte se o problema persistir.'
}

/**
 * Tipo para mensagens de erro/toast
 */
export interface ErrorMessage {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}


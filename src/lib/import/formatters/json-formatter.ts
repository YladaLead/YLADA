/**
 * JSON Formatter
 * Processa e valida dados JSON para importação
 */

export interface JSONImportData {
  format: 'json'
  type: 'single' | 'array' | 'structured'
  data: any
  clientCount: number
}

export interface StructuredClientData {
  identification?: any
  address?: any
  professional?: any
  goal?: any
  motivation?: any
  health?: any
  digestion?: any
  food_habits?: any
  physical_activity?: any
  initial_assessment?: any
  weight_evolution?: any[]
  reevaluations?: any[]
  coach_notes?: any
}

/**
 * Detecta o tipo de JSON e processa
 */
export function processJSONData(input: string | any): JSONImportData {
  let data: any

  // Se for string, fazer parse
  if (typeof input === 'string') {
    try {
      data = JSON.parse(input)
    } catch (error) {
      throw new Error('JSON inválido: ' + (error as Error).message)
    }
  } else {
    data = input
  }

  // Detectar tipo
  if (Array.isArray(data)) {
    // Array de clientes
    return {
      format: 'json',
      type: 'array',
      data: data,
      clientCount: data.length
    }
  }

  if (data.identification) {
    // Ficha completa estruturada (formato da proposta)
    return {
      format: 'json',
      type: 'structured',
      data: data,
      clientCount: 1
    }
  }

  if (data.name) {
    // Objeto simples (um cliente)
    return {
      format: 'json',
      type: 'single',
      data: data,
      clientCount: 1
    }
  }

  throw new Error('Formato JSON não reconhecido. Esperado: array, objeto com "identification" ou objeto com "name"')
}

/**
 * Valida estrutura de ficha completa
 */
export function validateStructuredJSON(data: StructuredClientData): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Validação básica
  if (!data.identification) {
    errors.push('Campo "identification" é obrigatório')
  } else {
    if (!data.identification.name) {
      errors.push('Campo "identification.name" é obrigatório')
    }
  }

  // Validações opcionais (warnings)
  if (!data.goal) {
    warnings.push('Nenhum objetivo/meta informado')
  }

  if (!data.professional) {
    warnings.push('Nenhum dado profissional informado')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Converte ficha completa para formato interno
 */
export function convertStructuredToInternal(data: StructuredClientData): any {
  const internal: any = {}

  // Identification → campos diretos
  if (data.identification) {
    Object.assign(internal, {
      name: data.identification.name,
      birth_date: data.identification.birth_date,
      age: data.identification.age,
      gender: data.identification.gender,
      cpf: data.identification.cpf,
      email: data.identification.email,
      phone: data.identification.phone,
      instagram: data.identification.instagram
    })
  }

  // Address → campos address_*
  if (data.address) {
    Object.assign(internal, {
      address_street: data.address.street,
      address_number: data.address.number,
      address_complement: data.address.complement,
      address_neighborhood: data.address.neighborhood,
      address_city: data.address.city,
      address_state: data.address.state,
      address_zipcode: data.address.zipcode,
      address_country: data.address.country,
      address_previous_city: data.address.previous_city,
      address_time_in_location: data.address.time_in_current_location
    })
  }

  // Goal → campos goal_* e current_weight, current_height
  if (data.goal) {
    Object.assign(internal, {
      goal_type: data.goal.goal_type,
      current_height: data.goal.current_height,
      initial_weight: data.goal.initial_weight,
      current_weight: data.goal.current_weight,
      goal_weight: data.goal.goal_weight,
      goal_deadline: data.goal.deadline,
      goal_most_bothersome_area: data.goal.most_bothersome_area
    })
  }

  // Dados relacionados (serão salvos em tabelas separadas)
  internal._related_data = {
    professional: data.professional,
    health: data.health,
    digestion: data.digestion,
    food_habits: data.food_habits,
    physical_activity: data.physical_activity,
    motivation: data.motivation,
    initial_assessment: data.initial_assessment,
    weight_evolution: data.weight_evolution || [],
    reevaluations: data.reevaluations || [],
    coach_notes: data.coach_notes
  }

  return internal
}

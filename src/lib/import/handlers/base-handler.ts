/**
 * Base Import Handler
 * Classe abstrata base para handlers de importação de clientes
 */

export interface FieldMapping {
  key: string
  label: string
  required: boolean
  table?: string // Tabela relacionada (ex: 'coach_client_professional')
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  duplicates: number
  validRows: number
}

export interface ImportResult {
  success: boolean
  imported: number
  failed: number
  errors: string[]
  warnings: string[]
}

export type ImportFormat = 'excel' | 'csv' | 'json'

export abstract class BaseImportHandler {
  protected userId: string
  protected profile: string

  constructor(userId: string, profile: string) {
    this.userId = userId
    this.profile = profile
  }

  /**
   * Nome da tabela principal de clientes
   */
  abstract getTableName(): string

  /**
   * Mapeamentos de campos suportados
   */
  abstract getFieldMappings(): FieldMapping[]

  /**
   * Valida dados antes de importar
   */
  abstract validateData(data: any[]): ValidationResult

  /**
   * Transforma dados para formato do banco
   */
  abstract transformData(data: any[]): any[]

  /**
   * Salva dados no banco
   */
  abstract saveData(data: any[]): Promise<ImportResult>

  /**
   * Processa dados de qualquer formato
   */
  async process(
    data: any,
    mappings: any[] | null,
    format: ImportFormat
  ): Promise<ImportResult> {
    try {
      // 1. Normalizar dados baseado no formato
      const normalized = this.normalize(data, format, mappings)

      // 2. Validar
      const validation = this.validateData(normalized)
      if (!validation.valid) {
        return {
          success: false,
          imported: 0,
          failed: normalized.length,
          errors: validation.errors,
          warnings: validation.warnings
        }
      }

      // 3. Transformar
      const transformed = this.transformData(normalized)

      // 4. Salvar
      return await this.saveData(transformed)
    } catch (error: any) {
      return {
        success: false,
        imported: 0,
        failed: 0,
        errors: [error.message || 'Erro ao processar importação'],
        warnings: []
      }
    }
  }

  /**
   * Normaliza dados de diferentes formatos para formato interno
   */
  protected normalize(
    data: any,
    format: ImportFormat,
    mappings: any[] | null
  ): any[] {
    switch (format) {
      case 'excel':
      case 'csv':
        return this.normalizeSpreadsheet(data, mappings)
      case 'json':
        return this.normalizeJSON(data)
      default:
        throw new Error(`Formato não suportado: ${format}`)
    }
  }

  /**
   * Normaliza dados de planilha (Excel/CSV)
   */
  protected normalizeSpreadsheet(data: any[], mappings: any[] | null): any[] {
    // Implementação padrão para planilhas
    // Pode ser sobrescrita por handlers específicos
    const normalized: any[] = []

    if (!data || !Array.isArray(data) || data.length === 0) {
      return normalized
    }

    // Processar cada arquivo
    data.forEach((fileData: any) => {
      if (!fileData.rows || !Array.isArray(fileData.rows)) return

      fileData.rows.forEach((row: any[]) => {
        if (!Array.isArray(row)) return

        const clientData: any = {}
        if (mappings && fileData.headers) {
          mappings.forEach((mapping: any) => {
            if (!mapping.sourceColumn) return
            const columnIndex = fileData.headers.indexOf(mapping.sourceColumn)
            if (columnIndex !== -1 && row[columnIndex]) {
              clientData[mapping.targetField] = String(row[columnIndex]).trim()
            }
          })
        }

        if (Object.keys(clientData).length > 0) {
          normalized.push(clientData)
        }
      })
    })

    return normalized
  }

  /**
   * Normaliza dados JSON
   */
  protected normalizeJSON(data: any): any[] {
    // Se for array, processar cada item
    if (Array.isArray(data)) {
      return data.map(item => this.normalizeJSONItem(item))
    }

    // Se for objeto único (ficha completa), converter para array
    if (data && typeof data === 'object') {
      return [this.normalizeJSONItem(data)]
    }

    throw new Error('Formato JSON inválido')
  }

  /**
   * Normaliza um item JSON (ficha completa ou objeto simples)
   */
  protected normalizeJSONItem(item: any): any {
    // Se já estiver no formato esperado (objeto simples com campos diretos)
    if (item.name && !item.identification) {
      return item
    }

    // Se for ficha completa (formato estruturado)
    if (item.identification) {
      return this.flattenStructuredJSON(item)
    }

    return item
  }

  /**
   * Converte JSON estruturado (ficha completa) em objeto plano
   */
  protected flattenStructuredJSON(data: any): any {
    const flattened: any = {}

    // Identification
    if (data.identification) {
      Object.assign(flattened, {
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

    // Address
    if (data.address) {
      Object.assign(flattened, {
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

    // Goal
    if (data.goal) {
      Object.assign(flattened, {
        goal_type: data.goal.goal_type,
        current_height: data.goal.current_height,
        initial_weight: data.goal.initial_weight,
        current_weight: data.goal.current_weight,
        goal_weight: data.goal.goal_weight,
        goal_deadline: data.goal.deadline,
        goal_most_bothersome_area: data.goal.most_bothersome_area
      })
    }

    // Professional (será salvo em tabela separada)
    flattened._professional = data.professional || null

    // Health (será salvo em tabela separada)
    flattened._health = data.health || null

    // Digestion (será salvo em tabela separada junto com health)
    if (data.digestion) {
      if (!flattened._health) flattened._health = {}
      Object.assign(flattened._health, {
        bowel_function: data.digestion.bowel_function,
        stool_consistency: data.digestion.stool_consistency,
        digestive_complaints: data.digestion.digestive_complaints,
        detox_response: data.digestion.detox_response
      })
    }

    // Food habits (será salvo em tabela separada)
    flattened._food_habits = data.food_habits || null

    // Physical activity (será salvo em tabela separada)
    flattened._physical_activity = data.physical_activity || null

    // Motivation (será salvo em tabela separada)
    flattened._motivation = data.motivation || null

    // Initial assessment (será salvo em tabela separada)
    flattened._initial_assessment = data.initial_assessment || null

    // Weight evolution (será salvo em tabela separada)
    flattened._weight_evolution = data.weight_evolution || []

    // Revaluations (será salvo em tabela separada)
    flattened._reevaluations = data.reevaluations || []

    // Coach notes (será salvo em tabela separada)
    flattened._coach_notes = data.coach_notes || null

    return flattened
  }
}

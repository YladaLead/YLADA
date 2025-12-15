/**
 * Coach Import Handler
 * Handler específico para importação de clientes na área de coach
 */

import { BaseImportHandler, FieldMapping, ValidationResult, ImportResult } from './base-handler'
import { supabaseAdmin } from '@/lib/supabase'

export class CoachImportHandler extends BaseImportHandler {
  getTableName(): string {
    return 'coach_clients'
  }

  getFieldMappings(): FieldMapping[] {
    return [
      // Dados Pessoais
      { key: 'name', label: 'Nome Completo', required: true },
      { key: 'birth_date', label: 'Data de Nascimento', required: false },
      { key: 'gender', label: 'Gênero', required: false },
      { key: 'cpf', label: 'CPF', required: false },
      // Contato
      { key: 'email', label: 'Email', required: false },
      { key: 'phone', label: 'Telefone', required: false },
      { key: 'instagram', label: 'Instagram', required: false },
      // Endereço
      { key: 'address_street', label: 'Rua', required: false },
      { key: 'address_number', label: 'Número', required: false },
      { key: 'address_complement', label: 'Complemento', required: false },
      { key: 'address_neighborhood', label: 'Bairro', required: false },
      { key: 'address_city', label: 'Cidade', required: false },
      { key: 'address_state', label: 'Estado', required: false },
      { key: 'address_zipcode', label: 'CEP', required: false },
      // Objetivo
      { key: 'goal_type', label: 'Tipo de Objetivo', required: false },
      { key: 'current_height', label: 'Altura Atual', required: false },
      { key: 'initial_weight', label: 'Peso Inicial', required: false },
      { key: 'current_weight', label: 'Peso Atual', required: false },
      { key: 'goal_weight', label: 'Meta de Peso', required: false },
      { key: 'goal_deadline', label: 'Prazo da Meta', required: false }
    ]
  }

  validateData(data: any[]): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    let validRows = 0
    let duplicates = 0

    const seenNames = new Set<string>()
    const seenEmails = new Set<string>()

    data.forEach((client, index) => {
      const rowErrors: string[] = []

      // Validar nome (obrigatório)
      if (!client.name || String(client.name).trim() === '') {
        rowErrors.push(`Linha ${index + 1}: Nome é obrigatório`)
      }

      // Validar email (se fornecido)
      if (client.email) {
        const email = String(client.email).toLowerCase().trim()
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          rowErrors.push(`Linha ${index + 1}: Email inválido`)
        } else if (seenEmails.has(email)) {
          duplicates++
          rowErrors.push(`Linha ${index + 1}: Email duplicado`)
        } else {
          seenEmails.add(email)
        }
      }

      // Validar nome duplicado
      if (client.name) {
        const name = String(client.name).trim().toLowerCase()
        if (seenNames.has(name)) {
          duplicates++
          warnings.push(`Linha ${index + 1}: Nome duplicado - ${client.name}`)
        } else {
          seenNames.add(name)
        }
      }

      if (rowErrors.length === 0) {
        validRows++
      } else {
        errors.push(...rowErrors)
      }
    })

    return {
      valid: errors.length === 0 && validRows > 0,
      errors,
      warnings,
      duplicates,
      validRows
    }
  }

  transformData(data: any[]): any[] {
    return data.map(client => {
      const transformed: any = {
        user_id: this.userId,
        name: String(client.name || '').trim(),
        email: client.email ? String(client.email).trim().toLowerCase() : null,
        phone: client.phone ? String(client.phone).trim() : null,
        birth_date: client.birth_date || null,
        gender: client.gender || null,
        cpf: client.cpf ? String(client.cpf).replace(/\D/g, '') : null,
        instagram: client.instagram ? String(client.instagram).replace(/^@/, '') : null,
        status: client.status || 'ativo',
        converted_from_lead: client.converted_from_lead || false,
        lead_source: client.lead_source || 'Importação',
        // Endereço
        address_street: client.address_street || null,
        address_number: client.address_number || null,
        address_complement: client.address_complement || null,
        address_neighborhood: client.address_neighborhood || null,
        address_city: client.address_city || null,
        address_state: client.address_state || null,
        address_zipcode: client.address_zipcode || null,
        // Objetivo (campos novos)
        goal_type: client.goal_type || null,
        current_height: client.current_height ? parseFloat(client.current_height) : null,
        initial_weight: client.initial_weight ? parseFloat(client.initial_weight) : null,
        current_weight: client.current_weight ? parseFloat(client.current_weight) : null,
        goal_weight: client.goal_weight ? parseFloat(client.goal_weight) : null,
        goal_deadline: client.goal_deadline || null
      }

      // Preservar dados relacionados para salvar depois
      transformed._related_data = client._related_data || client._professional || client._health || null

      return transformed
    })
  }

  async saveData(data: any[]): Promise<ImportResult> {
    if (!supabaseAdmin) {
      return {
        success: false,
        imported: 0,
        failed: data.length,
        errors: ['Configuração do servidor incompleta'],
        warnings: []
      }
    }

    const errors: string[] = []
    const warnings: string[] = []
    let imported = 0
    let failed = 0

    for (const clientData of data) {
      try {
        // Extrair dados relacionados
        const relatedData = clientData._related_data
        delete clientData._related_data

        // 1. Inserir cliente principal
        const { data: newClient, error: clientError } = await supabaseAdmin
          .from('coach_clients')
          .insert(clientData)
          .select()
          .single()

        if (clientError || !newClient) {
          failed++
          errors.push(`${clientData.name}: ${clientError?.message || 'Erro ao criar cliente'}`)
          continue
        }

        const clientId = newClient.id

        // 2. Salvar dados relacionados (se houver)
        if (relatedData) {
          await this.saveRelatedData(clientId, relatedData, errors, warnings)
        }

        imported++
      } catch (error: any) {
        failed++
        errors.push(`${clientData.name}: ${error.message || 'Erro desconhecido'}`)
      }
    }

    return {
      success: imported > 0,
      imported,
      failed,
      errors,
      warnings
    }
  }

  /**
   * Salva dados relacionados em tabelas específicas
   */
  private async saveRelatedData(
    clientId: string,
    relatedData: any,
    errors: string[],
    warnings: string[]
  ): Promise<void> {
    if (!supabaseAdmin) return

    // Professional
    if (relatedData.professional) {
      try {
        await supabaseAdmin
          .from('coach_client_professional')
          .upsert({
            client_id: clientId,
            user_id: this.userId,
            occupation: relatedData.professional.occupation || null,
            work_start_time: relatedData.professional.work_start_time || null,
            work_end_time: relatedData.professional.work_end_time || null,
            work_schedule_description: relatedData.professional.work_schedule_description || null,
            wake_time: relatedData.professional.wake_time || null,
            sleep_time: relatedData.professional.sleep_time || null,
            sleep_quality: relatedData.professional.sleep_quality || null,
            who_cooks: relatedData.professional.who_cooks || null,
            household_members: relatedData.professional.household_members || null,
            takes_lunchbox: relatedData.professional.takes_lunchbox || false
          })
      } catch (error: any) {
        warnings.push(`Erro ao salvar dados profissionais: ${error.message}`)
      }
    }

    // Health + Digestion
    if (relatedData.health || relatedData.digestion) {
      try {
        const healthData: any = {
          client_id: clientId,
          user_id: this.userId
        }

        if (relatedData.health) {
          Object.assign(healthData, {
            health_problems: relatedData.health.health_problems || [],
            pains: relatedData.health.pains || [],
            health_changes: relatedData.health.health_changes || null,
            hair_loss: relatedData.health.hair_loss || null,
            other_symptoms: relatedData.health.other_symptoms || [],
            medications: relatedData.health.medications || [],
            dietary_restrictions: relatedData.health.dietary_restrictions || [],
            supplements_current: relatedData.health.supplements_current || [],
            supplements_recommended: relatedData.health.supplements_recommended || []
          })
        }

        if (relatedData.digestion) {
          Object.assign(healthData, {
            bowel_function: relatedData.digestion.bowel_function || null,
            stool_consistency: relatedData.digestion.stool_consistency || null,
            digestive_complaints: relatedData.digestion.digestive_complaints || [],
            detox_response: relatedData.digestion.detox_response || null
          })
        }

        await supabaseAdmin
          .from('coach_client_health')
          .upsert(healthData)
      } catch (error: any) {
        warnings.push(`Erro ao salvar dados de saúde: ${error.message}`)
      }
    }

    // Food Habits
    if (relatedData.food_habits) {
      try {
        await supabaseAdmin
          .from('coach_client_food_habits')
          .upsert({
            client_id: clientId,
            user_id: this.userId,
            water_intake_liters: relatedData.food_habits.water_intake_liters || null,
            breakfast: relatedData.food_habits.breakfast || null,
            morning_snack: relatedData.food_habits.morning_snack || null,
            lunch: relatedData.food_habits.lunch || null,
            afternoon_snack: relatedData.food_habits.afternoon_snack || null,
            dinner: relatedData.food_habits.dinner || null,
            supper: relatedData.food_habits.supper || null,
            snacks_between_meals: relatedData.food_habits.snacks_between_meals || false,
            snacks_description: relatedData.food_habits.snacks_description || null,
            alcohol_consumption: relatedData.food_habits.alcohol_consumption || null,
            soda_consumption: relatedData.food_habits.soda_consumption || null
          })
      } catch (error: any) {
        warnings.push(`Erro ao salvar hábitos alimentares: ${error.message}`)
      }
    }

    // Initial Assessment → Evolution
    if (relatedData.initial_assessment) {
      try {
        await supabaseAdmin
          .from('coach_client_evolution')
          .insert({
            client_id: clientId,
            user_id: this.userId,
            measurement_date: relatedData.initial_assessment.assessment_date || new Date().toISOString(),
            weight: relatedData.initial_assessment.initial_weight || null,
            height: relatedData.initial_assessment.initial_height || null,
            waist_circumference: relatedData.initial_assessment.measurements?.waist || null,
            hip_circumference: relatedData.initial_assessment.measurements?.hip || null,
            arm_circumference: relatedData.initial_assessment.measurements?.arm || null,
            thigh_circumference: relatedData.initial_assessment.measurements?.thigh || null,
            notes: relatedData.initial_assessment.notes || null
          })
      } catch (error: any) {
        warnings.push(`Erro ao salvar avaliação inicial: ${error.message}`)
      }
    }

    // Weight Evolution
    if (relatedData.weight_evolution && Array.isArray(relatedData.weight_evolution)) {
      try {
        const evolutionRecords = relatedData.weight_evolution.map((record: any) => ({
          client_id: clientId,
          user_id: this.userId,
          measurement_date: record.date || new Date().toISOString(),
          weight: record.weight || null,
          notes: record.observation || null
        }))

        if (evolutionRecords.length > 0) {
          await supabaseAdmin
            .from('coach_client_evolution')
            .insert(evolutionRecords)
        }
      } catch (error: any) {
        warnings.push(`Erro ao salvar evolução de peso: ${error.message}`)
      }
    }

    // Motivation → Emotional Behavioral History
    if (relatedData.motivation) {
      try {
        await supabaseAdmin
          .from('coach_emotional_behavioral_history')
          .insert({
            client_id: clientId,
            user_id: this.userId,
            record_date: new Date().toISOString(),
            record_type: 'ambos',
            emotional_notes: relatedData.motivation.emotional_history || null,
            patterns_identified: relatedData.motivation.emotional_blocks || [],
            triggers: relatedData.motivation.triggers || [],
            notes: relatedData.motivation.weak_point || null
          })
      } catch (error: any) {
        warnings.push(`Erro ao salvar dados emocionais: ${error.message}`)
      }
    }

    // Revaluations → Assessments
    if (relatedData.reevaluations && Array.isArray(relatedData.reevaluations)) {
      try {
        const assessments = relatedData.reevaluations.map((reeval: any, index: number) => ({
          client_id: clientId,
          user_id: this.userId,
          assessment_type: 'reavaliacao',
          assessment_name: `Reavaliação ${index + 1}`,
          is_reevaluation: true,
          assessment_number: index + 1,
          data: {
            weight: reeval.weight,
            total_lost: reeval.total_lost,
            changes_noticed: reeval.changes_noticed,
            adjustments_made: reeval.adjustments_made,
            next_phase_goal: reeval.next_phase_goal,
            what_client_likes: reeval.what_client_likes,
            what_can_improve: reeval.what_can_improve
          },
          interpretation: reeval.observations || null,
          status: 'completo'
        }))

        if (assessments.length > 0) {
          await supabaseAdmin
            .from('coach_assessments')
            .insert(assessments)
        }
      } catch (error: any) {
        warnings.push(`Erro ao salvar reavaliações: ${error.message}`)
      }
    }
  }
}

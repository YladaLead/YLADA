import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

interface ParsedData {
  headers: string[]
  rows: any[][]
  fileName: string
  totalRows: number
}

interface MappedField {
  sourceColumn: string
  targetField: string
  required: boolean
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user, profile } = authResult

    const { data, mappings }: { data: ParsedData[], mappings: MappedField[] } = await request.json()

    // Validar dados recebidos
    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum dado para processar. Verifique se os arquivos foram carregados corretamente.' },
        { status: 400 }
      )
    }

    if (!mappings || !Array.isArray(mappings) || mappings.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum mapeamento de campos configurado. Configure os mapeamentos antes de importar.' },
        { status: 400 }
      )
    }

    // Verificar se há pelo menos um campo obrigatório mapeado
    const requiredMappings = mappings.filter(m => m.required && m.sourceColumn)
    if (requiredMappings.length === 0) {
      return NextResponse.json(
        { error: 'É necessário mapear pelo menos um campo obrigatório (Nome). Configure o mapeamento antes de importar.' },
        { status: 400 }
      )
    }

    // Consolidar dados de todos os arquivos
    const allRows: any[][] = []
    data.forEach(fileData => {
      if (fileData.rows && Array.isArray(fileData.rows)) {
      fileData.rows.forEach(row => {
          if (Array.isArray(row)) {
        allRows.push(row)
          }
      })
      }
    })

    if (allRows.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma linha de dados encontrada nos arquivos. Verifique se os arquivos contêm dados.' },
        { status: 400 }
      )
    }

    // Preparar dados para inserção
    const clientsToInsert: any[] = []
    const processedEmails = new Set<string>()
    const processedPhones = new Set<string>()

    for (let i = 0; i < allRows.length; i++) {
      const row = allRows[i]
      const clientData: any = {
        user_id: user.id,
        status: 'lead', // Status padrão para importação
        converted_from_lead: false,
        lead_source: 'Importação de Planilha',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      let hasRequiredData = false

      // Mapear campos
      for (const mapping of mappings) {
        if (!mapping.sourceColumn) continue

        // Verificar se há headers disponíveis
        if (!data[0] || !data[0].headers || !Array.isArray(data[0].headers)) {
          continue
        }

        const columnIndex = data[0].headers.indexOf(mapping.sourceColumn)
        if (columnIndex === -1) continue

        const value = row[columnIndex]
        if (!value || String(value).trim() === '') continue

        const cleanValue = String(value).trim()

        switch (mapping.targetField) {
          // Dados Pessoais
          case 'name':
            clientData.name = cleanValue
            hasRequiredData = true
            break
          case 'birth_date':
            const date = parseDate(cleanValue)
            if (date) {
              clientData.birth_date = date
            }
            break
          case 'gender':
            const gender = cleanValue.toLowerCase()
            if (['masculino', 'feminino', 'male', 'female', 'm', 'f'].includes(gender)) {
              clientData.gender = gender.startsWith('m') ? 'masculino' : 'feminino'
            }
            break
          case 'cpf':
            // Remover formatação do CPF
            clientData.cpf = cleanValue.replace(/\D/g, '')
            break
          // Contato
          case 'email':
            const email = cleanValue.toLowerCase()
            if (isValidEmail(email) && !processedEmails.has(email)) {
              clientData.email = email
              processedEmails.add(email)
            }
            break
          case 'phone':
            const phone = cleanPhone(cleanValue)
            if (phone && !processedPhones.has(phone)) {
              clientData.phone = formatPhone(phone)
              processedPhones.add(phone)
            }
            break
          case 'instagram':
            // Remover @ se tiver
            clientData.instagram = cleanValue.replace(/^@/, '')
            break
          // Endereço
          case 'address_street':
            if (!clientData.address) clientData.address = {}
            clientData.address.street = cleanValue
            break
          case 'address_number':
            if (!clientData.address) clientData.address = {}
            clientData.address.number = cleanValue
            break
          case 'address_complement':
            if (!clientData.address) clientData.address = {}
            clientData.address.complement = cleanValue
            break
          case 'address_neighborhood':
            if (!clientData.address) clientData.address = {}
            clientData.address.neighborhood = cleanValue
            break
          case 'address_city':
            if (!clientData.address) clientData.address = {}
            clientData.address.city = cleanValue
            break
          case 'address_state':
            if (!clientData.address) clientData.address = {}
            clientData.address.state = cleanValue.toUpperCase().substring(0, 2)
            break
          case 'address_zipcode':
            if (!clientData.address) clientData.address = {}
            // Remover formatação do CEP
            clientData.address.zipcode = cleanValue.replace(/\D/g, '')
            break
          // Status e Objetivo
          case 'status':
            const statusOptions = ['lead', 'pre_consulta', 'ativa', 'pausa', 'finalizada']
            const statusValue = cleanValue.toLowerCase()
            if (statusOptions.includes(statusValue)) {
              clientData.status = statusValue
            }
            break
          case 'goal':
            clientData.goal = cleanValue
            break
          // Primeira Avaliação - Data
          case 'first_assessment_date':
            if (!clientData.firstAssessment) clientData.firstAssessment = {}
            const assessmentDate = parseDate(cleanValue)
            if (assessmentDate) {
              clientData.firstAssessment.date = assessmentDate
            }
            break
          // Primeira Avaliação - Medidas Básicas
          case 'weight':
            if (!clientData.firstAssessment) clientData.firstAssessment = {}
            clientData.firstAssessment.weight = parseFloat(cleanValue) || null
            break
          case 'height':
            if (!clientData.firstAssessment) clientData.firstAssessment = {}
            clientData.firstAssessment.height = parseFloat(cleanValue) || null
            break
          case 'bmi':
            if (!clientData.firstAssessment) clientData.firstAssessment = {}
            clientData.firstAssessment.bmi = parseFloat(cleanValue) || null
            break
          // Primeira Avaliação - Circunferências
          case 'neck_circumference':
            if (!clientData.firstAssessment) clientData.firstAssessment = {}
            clientData.firstAssessment.neck_circumference = parseFloat(cleanValue) || null
            break
          case 'chest_circumference':
            if (!clientData.firstAssessment) clientData.firstAssessment = {}
            clientData.firstAssessment.chest_circumference = parseFloat(cleanValue) || null
            break
          case 'waist_circumference':
            if (!clientData.firstAssessment) clientData.firstAssessment = {}
            clientData.firstAssessment.waist_circumference = parseFloat(cleanValue) || null
            break
          case 'hip_circumference':
            if (!clientData.firstAssessment) clientData.firstAssessment = {}
            clientData.firstAssessment.hip_circumference = parseFloat(cleanValue) || null
            break
          case 'arm_circumference':
            if (!clientData.firstAssessment) clientData.firstAssessment = {}
            clientData.firstAssessment.arm_circumference = parseFloat(cleanValue) || null
            break
          case 'thigh_circumference':
            if (!clientData.firstAssessment) clientData.firstAssessment = {}
            clientData.firstAssessment.thigh_circumference = parseFloat(cleanValue) || null
            break
          // Primeira Avaliação - Dobras Cutâneas
          case 'triceps_skinfold':
            if (!clientData.firstAssessment) clientData.firstAssessment = {}
            clientData.firstAssessment.triceps_skinfold = parseFloat(cleanValue) || null
            break
          case 'biceps_skinfold':
            if (!clientData.firstAssessment) clientData.firstAssessment = {}
            clientData.firstAssessment.biceps_skinfold = parseFloat(cleanValue) || null
            break
          case 'subscapular_skinfold':
            if (!clientData.firstAssessment) clientData.firstAssessment = {}
            clientData.firstAssessment.subscapular_skinfold = parseFloat(cleanValue) || null
            break
          case 'iliac_skinfold':
            if (!clientData.firstAssessment) clientData.firstAssessment = {}
            clientData.firstAssessment.iliac_skinfold = parseFloat(cleanValue) || null
            break
          case 'abdominal_skinfold':
            if (!clientData.firstAssessment) clientData.firstAssessment = {}
            clientData.firstAssessment.abdominal_skinfold = parseFloat(cleanValue) || null
            break
          case 'thigh_skinfold':
            if (!clientData.firstAssessment) clientData.firstAssessment = {}
            clientData.firstAssessment.thigh_skinfold = parseFloat(cleanValue) || null
            break
          // Primeira Avaliação - Composição Corporal
          case 'body_fat_percentage':
            if (!clientData.firstAssessment) clientData.firstAssessment = {}
            clientData.firstAssessment.body_fat_percentage = parseFloat(cleanValue) || null
            break
          case 'muscle_mass':
            if (!clientData.firstAssessment) clientData.firstAssessment = {}
            clientData.firstAssessment.muscle_mass = parseFloat(cleanValue) || null
            break
          case 'bone_mass':
            if (!clientData.firstAssessment) clientData.firstAssessment = {}
            clientData.firstAssessment.bone_mass = parseFloat(cleanValue) || null
            break
          case 'water_percentage':
            if (!clientData.firstAssessment) clientData.firstAssessment = {}
            clientData.firstAssessment.water_percentage = parseFloat(cleanValue) || null
            break
          case 'visceral_fat':
            if (!clientData.firstAssessment) clientData.firstAssessment = {}
            clientData.firstAssessment.visceral_fat = parseFloat(cleanValue) || null
            break
          // Primeira Avaliação - Observações
          case 'assessment_notes':
            if (!clientData.firstAssessment) clientData.firstAssessment = {}
            clientData.firstAssessment.notes = cleanValue
            break
        }
      }

      // Calcular IMC se tiver peso e altura mas não tiver IMC
      if (clientData.firstAssessment?.weight && clientData.firstAssessment?.height && !clientData.firstAssessment?.bmi) {
        const height = clientData.firstAssessment.height
        const weight = clientData.firstAssessment.weight
        if (height > 0) {
          clientData.firstAssessment.bmi = parseFloat((weight / (height * height)).toFixed(2))
        }
      }

      // Só adicionar se tiver pelo menos o nome
      if (hasRequiredData && clientData.name) {
        clientsToInsert.push(clientData)
      }
    }

    // Verificar duplicatas no banco
    const existingEmails = clientsToInsert
      .filter(c => c.email)
      .map(c => c.email)

    if (existingEmails.length > 0) {
      const { data: existingClients } = await supabaseAdmin
        .from('clients')
        .select('email')
        .eq('user_id', user.id)
        .in('email', existingEmails)

      if (existingClients && existingClients.length > 0) {
        const existingEmailsSet = new Set(existingClients.map(c => c.email))
        // Remover clientes que já existem
        const filteredClients = clientsToInsert.filter(c => 
          !c.email || !existingEmailsSet.has(c.email)
        )
        clientsToInsert.length = 0
        clientsToInsert.push(...filteredClients)
      }
    }

    // Inserir clientes em lotes
    const batchSize = 100
    let totalInserted = 0
    let totalAssessmentsCreated = 0

    for (let i = 0; i < clientsToInsert.length; i += batchSize) {
      const batch = clientsToInsert.slice(i, i + batchSize)
      
      // Separar dados de avaliação dos dados do cliente
      const clientsBatch = batch.map(client => {
        const { firstAssessment, ...clientData } = client
        return clientData
      })
      
      const { data: insertedClients, error } = await supabaseAdmin
        .from('clients')
        .insert(clientsBatch)
        .select('id, name')

      if (error) {
        console.error('Erro ao inserir lote:', error)
        throw new Error(`Erro ao inserir clientes: ${error.message}`)
      }

      totalInserted += insertedClients?.length || 0

      // Criar primeira avaliação/evolução se houver dados
      if (insertedClients) {
        for (let j = 0; j < insertedClients.length; j++) {
          const insertedClient = insertedClients[j]
          const originalClient = batch[j]
          
          if (originalClient.firstAssessment && Object.keys(originalClient.firstAssessment).length > 0) {
            const assessmentData = originalClient.firstAssessment
            
            // Preparar dados de evolução
            const evolutionData: any = {
              client_id: insertedClient.id,
              user_id: user.id,
              measurement_date: assessmentData.date || new Date().toISOString(),
              weight: assessmentData.weight || null,
              height: assessmentData.height || null,
              bmi: assessmentData.bmi || null,
              neck_circumference: assessmentData.neck_circumference || null,
              chest_circumference: assessmentData.chest_circumference || null,
              waist_circumference: assessmentData.waist_circumference || null,
              hip_circumference: assessmentData.hip_circumference || null,
              arm_circumference: assessmentData.arm_circumference || null,
              thigh_circumference: assessmentData.thigh_circumference || null,
              triceps_skinfold: assessmentData.triceps_skinfold || null,
              biceps_skinfold: assessmentData.biceps_skinfold || null,
              subscapular_skinfold: assessmentData.subscapular_skinfold || null,
              iliac_skinfold: assessmentData.iliac_skinfold || null,
              abdominal_skinfold: assessmentData.abdominal_skinfold || null,
              thigh_skinfold: assessmentData.thigh_skinfold || null,
              body_fat_percentage: assessmentData.body_fat_percentage || null,
              muscle_mass: assessmentData.muscle_mass || null,
              bone_mass: assessmentData.bone_mass || null,
              water_percentage: assessmentData.water_percentage || null,
              visceral_fat: assessmentData.visceral_fat || null,
              notes: assessmentData.notes || null,
              created_by: user.id
            }

            // Inserir evolução
            const { error: evolutionError } = await supabaseAdmin
              .from('client_evolution')
              .insert(evolutionData)

            if (!evolutionError) {
              totalAssessmentsCreated++
            } else {
              console.error('Erro ao criar avaliação inicial:', evolutionError)
              // Não falhar a importação se a avaliação falhar
            }
          }
        }
      }
    }

    let message = `${totalInserted} cliente${totalInserted !== 1 ? 's' : ''} importado${totalInserted !== 1 ? 's' : ''} com sucesso!`
    if (totalAssessmentsCreated > 0) {
      message += ` ${totalAssessmentsCreated} avaliação${totalAssessmentsCreated !== 1 ? 'ões' : ''} inicial${totalAssessmentsCreated !== 1 ? 'is' : ''} criada${totalAssessmentsCreated !== 1 ? 's' : ''}.`
    }

    return NextResponse.json({
      success: true,
      imported: totalInserted,
      assessmentsCreated: totalAssessmentsCreated,
      message
    })

  } catch (error: any) {
    console.error('Erro no processamento:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor no processamento' },
      { status: 500 }
    )
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

function formatPhone(phone: string): string {
  // Formato brasileiro
  if (phone.length === 11) {
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`
  } else if (phone.length === 10) {
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`
  }
  return phone
}

function parseDate(dateStr: string): string | null {
  try {
    // Tentar diferentes formatos de data
    const formats = [
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // DD/MM/YYYY
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // YYYY-MM-DD
      /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // DD-MM-YYYY
    ]

    for (const format of formats) {
      const match = dateStr.match(format)
      if (match) {
        let day, month, year
        if (format === formats[1]) { // YYYY-MM-DD
          [, year, month, day] = match
        } else { // DD/MM/YYYY ou DD-MM-YYYY
          [, day, month, year] = match
        }
        
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0]
        }
      }
    }

    // Tentar parsing direto
    const date = new Date(dateStr)
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }

    return null
  } catch {
    return null
  }
}

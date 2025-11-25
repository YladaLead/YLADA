import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

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
    const authResult = await requireApiAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const { data, mappings }: { data: ParsedData[], mappings: MappedField[] } = await request.json()

    // Consolidar dados de todos os arquivos
    const allRows: any[][] = []
    data.forEach(fileData => {
      fileData.rows.forEach(row => {
        allRows.push(row)
      })
    })

    // Preparar dados para inserção
    const clientsToInsert: any[] = []
    const processedEmails = new Set<string>()
    const processedPhones = new Set<string>()

    for (let i = 0; i < allRows.length; i++) {
      const row = allRows[i]
      const clientData: any = {
        user_id: authResult.userId,
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

        const columnIndex = data[0].headers.indexOf(mapping.sourceColumn)
        if (columnIndex === -1) continue

        const value = row[columnIndex]
        if (!value || String(value).trim() === '') continue

        const cleanValue = String(value).trim()

        switch (mapping.targetField) {
          case 'name':
            clientData.name = cleanValue
            hasRequiredData = true
            break
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
          case 'goal':
            clientData.goal = cleanValue
            break
          case 'notes':
            clientData.notes = cleanValue
            break
          case 'weight':
            const weight = parseFloat(cleanValue)
            if (!isNaN(weight) && weight > 0 && weight <= 500) {
              clientData.current_weight = weight
            }
            break
          case 'height':
            const height = parseFloat(cleanValue)
            if (!isNaN(height) && height > 0 && height <= 250) {
              clientData.height = height
            }
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
        .eq('user_id', authResult.userId)
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

    for (let i = 0; i < clientsToInsert.length; i += batchSize) {
      const batch = clientsToInsert.slice(i, i + batchSize)
      
      const { data: insertedClients, error } = await supabaseAdmin
        .from('clients')
        .insert(batch)
        .select('id, name')

      if (error) {
        console.error('Erro ao inserir lote:', error)
        throw new Error(`Erro ao inserir clientes: ${error.message}`)
      }

      totalInserted += insertedClients?.length || 0
    }

    return NextResponse.json({
      success: true,
      imported: totalInserted,
      message: `${totalInserted} pacientes importados com sucesso!`
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

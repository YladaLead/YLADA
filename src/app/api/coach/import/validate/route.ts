import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
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
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { data, mappings }: { data: ParsedData[], mappings: MappedField[] } = await request.json()

    const errors: string[] = []
    const warnings: string[] = []
    let validRows = 0
    let duplicates = 0

    // Verificar mapeamentos obrigatórios
    const requiredMappings = mappings.filter(m => m.required)
    const missingRequired = requiredMappings.filter(m => !m.sourceColumn)
    
    if (missingRequired.length > 0) {
      // Mapear targetField para labels legíveis
      const fieldLabels: { [key: string]: string } = {
        'name': 'Nome Completo',
        'email': 'Email',
        'phone': 'Telefone',
        'birth_date': 'Data de Nascimento',
        'gender': 'Gênero',
        'cpf': 'CPF'
      }
      
      const missingLabels = missingRequired.map(m => {
        return fieldLabels[m.targetField] || m.targetField
      })
      
      if (missingLabels.length === 1) {
        errors.push(`Campo obrigatório "${missingLabels[0]}" não foi mapeado`)
      } else {
        errors.push(`Campos obrigatórios não mapeados: ${missingLabels.map(l => `"${l}"`).join(', ')}`)
      }
    }

    // Consolidar dados de todos os arquivos
    const allRows: any[][] = []
    data.forEach(fileData => {
      fileData.rows.forEach(row => {
        allRows.push(row)
      })
    })

    // Validar dados linha por linha
    const processedEmails = new Set<string>()
    const processedPhones = new Set<string>()
    
    for (let i = 0; i < allRows.length; i++) {
      const row = allRows[i]
      let hasErrors = false

      // Validar campos obrigatórios
      for (const mapping of mappings) {
        if (!mapping.sourceColumn) continue

        const columnIndex = data[0].headers.indexOf(mapping.sourceColumn)
        if (columnIndex === -1) continue

        const value = row[columnIndex]

        if (mapping.required && (!value || String(value).trim() === '')) {
          errors.push(`Linha ${i + 2}: Campo obrigatório '${mapping.targetField}' está vazio`)
          hasErrors = true
        }

        // Validações específicas
        if (mapping.targetField === 'email' && value) {
          const email = String(value).trim().toLowerCase()
          if (email && !isValidEmail(email)) {
            warnings.push(`Linha ${i + 2}: Email inválido '${email}'`)
          } else if (email && processedEmails.has(email)) {
            duplicates++
            continue // Pular linha duplicada
          } else if (email) {
            processedEmails.add(email)
          }
        }

        if (mapping.targetField === 'phone' && value) {
          const phone = cleanPhone(String(value))
          if (phone && processedPhones.has(phone)) {
            duplicates++
            continue // Pular linha duplicada
          } else if (phone) {
            processedPhones.add(phone)
          }
        }
      }

      if (!hasErrors) {
        validRows++
      }
    }

    // Verificar duplicatas no banco de dados
    if (processedEmails.size > 0) {
      const { data: existingClients } = await supabaseAdmin
        .from('clients')
        .select('email')
        .eq('user_id', user.id)
        .in('email', Array.from(processedEmails))

      if (existingClients && existingClients.length > 0) {
        warnings.push(`${existingClients.length} clientes já existem no sistema (serão ignorados)`)
        validRows -= existingClients.length
      }
    }

    const isValid = errors.length === 0 && validRows > 0

    return NextResponse.json({
      success: true,
      valid: isValid,
      errors,
      warnings,
      duplicates,
      validRows: Math.max(0, validRows)
    })

  } catch (error: any) {
    console.error('Erro na validação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor na validação' },
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

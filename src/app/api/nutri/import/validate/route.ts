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
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
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
      errors.push(`Campos obrigatórios não mapeados: ${missingRequired.map(m => m.targetField).join(', ')}`)
    }

    // Consolidar dados de todos os arquivos
    const allRows: any[][] = []
    const allHeaders: string[][] = []
    data.forEach(fileData => {
      allHeaders.push(fileData.headers)
      fileData.rows.forEach(row => {
        allRows.push(row)
      })
    })

    // Verificar se os headers estão no formato padrão (após smart-parse)
    const standardHeaders = ['Nome', 'Email', 'Telefone', 'Peso Atual (kg)', 'Altura (cm)', 'Objetivo', 'Observações', 'Data de Nascimento', 'Gênero']
    const isStandardFormat = allHeaders.length > 0 && 
      allHeaders[0].length >= standardHeaders.length &&
      allHeaders[0].slice(0, standardHeaders.length).every((h, i) => h === standardHeaders[i])

    // Validar dados linha por linha
    const processedEmails = new Set<string>()
    const processedPhones = new Set<string>()
    
    for (let i = 0; i < allRows.length; i++) {
      const row = allRows[i]
      let hasErrors = false

      // Validar campos obrigatórios
      for (const mapping of mappings) {
        let columnIndex = -1
        let value: any = null

        if (isStandardFormat) {
          // Se está no formato padrão, usar a posição do campo diretamente
          const fieldOrder = ['name', 'email', 'phone', 'weight', 'height', 'goal', 'notes', 'birth_date', 'gender']
          columnIndex = fieldOrder.indexOf(mapping.targetField)
          if (columnIndex >= 0 && columnIndex < row.length) {
            value = row[columnIndex]
          }
        } else {
          // Se não está no formato padrão, buscar pelo nome do header
          if (!mapping.sourceColumn) continue
          
          // Tentar encontrar o header em qualquer um dos arquivos
          for (const headers of allHeaders) {
            const idx = headers.indexOf(mapping.sourceColumn)
            if (idx !== -1) {
              columnIndex = idx
              break
            }
          }
          
          if (columnIndex === -1) continue
          if (columnIndex < row.length) {
            value = row[columnIndex]
          }
        }

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

        if (mapping.targetField === 'weight' && value) {
          const weight = parseFloat(String(value))
          if (isNaN(weight) || weight <= 0 || weight > 500) {
            warnings.push(`Linha ${i + 2}: Peso inválido '${value}' (deve ser entre 1 e 500 kg)`)
          }
        }

        if (mapping.targetField === 'height' && value) {
          const height = parseFloat(String(value))
          if (isNaN(height) || height <= 0 || height > 250) {
            warnings.push(`Linha ${i + 2}: Altura inválida '${value}' (deve ser entre 1 e 250 cm)`)
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
        warnings.push(`${existingClients.length} pacientes já existem no sistema (serão ignorados)`)
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

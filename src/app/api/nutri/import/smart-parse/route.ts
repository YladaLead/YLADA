import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface ParsedSpreadsheet {
  headers: string[]
  rows: any[][]
  fileName: string
}

interface StandardField {
  key: string
  label: string
  required: boolean
}

const STANDARD_FIELDS: StandardField[] = [
  { key: 'name', label: 'Nome', required: true },
  { key: 'email', label: 'Email', required: false },
  { key: 'phone', label: 'Telefone', required: false },
  { key: 'weight', label: 'Peso Atual (kg)', required: false },
  { key: 'height', label: 'Altura (cm)', required: false },
  { key: 'goal', label: 'Objetivo', required: false },
  { key: 'notes', label: 'Observações', required: false },
  { key: 'birth_date', label: 'Data de Nascimento', required: false },
  { key: 'gender', label: 'Gênero', required: false },
]

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { headers, rows, fileName }: ParsedSpreadsheet = await request.json()

    if (!headers || !Array.isArray(headers) || headers.length === 0) {
      return NextResponse.json(
        { error: 'Cabeçalhos não encontrados na planilha' },
        { status: 400 }
      )
    }

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum dado encontrado na planilha' },
        { status: 400 }
      )
    }

    // Verificar se OpenAI está configurado
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Serviço de IA não configurado' },
        { status: 503 }
      )
    }

    // Preparar dados para a IA
    const sampleRows = rows.slice(0, 5).map(row => 
      headers.reduce((obj, header, index) => {
        obj[header] = row[index] || ''
        return obj
      }, {} as Record<string, any>)
    )

    const systemPrompt = `Você é um assistente especializado em mapear colunas de planilhas de pacientes para um formato padrão.

Sua tarefa é analisar os cabeçalhos da planilha fornecida e criar um mapeamento automático para o formato padrão do sistema YLADA Nutri.

FORMATO PADRÃO (ordem exata):
1. Nome (obrigatório)
2. Email
3. Telefone
4. Peso Atual (kg)
5. Altura (cm)
6. Objetivo
7. Observações
8. Data de Nascimento
9. Gênero

INSTRUÇÕES:
- Analise os cabeçalhos fornecidos e identifique correspondências com o formato padrão
- Mapeie campos equivalentes (ex: "Nome Completo" → "Nome", "Peso" → "Peso Atual (kg)")
- Para campos que não existem na planilha, retorne null
- Mantenha a ordem exata do formato padrão
- Retorne APENAS um JSON válido no formato: { "mappings": [ { "sourceColumn": "Nome Completo", "targetField": "name" }, ... ] }
- Use os nomes exatos dos campos padrão: name, email, phone, weight, height, goal, notes, birth_date, gender`

    const userPrompt = `Cabeçalhos da planilha:
${JSON.stringify(headers, null, 2)}

Exemplos de dados (primeiras 5 linhas):
${JSON.stringify(sampleRows, null, 2)}

Crie o mapeamento automático dos cabeçalhos para o formato padrão. Retorne APENAS o JSON no formato especificado.`

    // Chamar OpenAI para mapear automaticamente
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.2, // Baixa temperatura para mapeamentos consistentes
      max_tokens: 1000,
      response_format: { type: 'json_object' }
    })

    const responseText = completion.choices[0]?.message?.content || '{"mappings": []}'
    
    // Parsear resposta
    let parsedResponse: { mappings: Array<{ sourceColumn: string; targetField: string }> }
    try {
      parsedResponse = JSON.parse(responseText)
    } catch (parseError) {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Resposta da IA não está em formato JSON válido')
      }
    }

    // Criar mapeamento completo
    const mappings = STANDARD_FIELDS.map(field => {
      const aiMapping = parsedResponse.mappings?.find(m => m.targetField === field.key)
      return {
        sourceColumn: aiMapping?.sourceColumn || '',
        targetField: field.key,
        required: field.required
      }
    })

    // Reestruturar dados no formato padrão
    const restructuredRows = rows.map(row => {
      const standardRow: any[] = []
      
      STANDARD_FIELDS.forEach(field => {
        const mapping = mappings.find(m => m.targetField === field.key)
        if (mapping?.sourceColumn) {
          const columnIndex = headers.indexOf(mapping.sourceColumn)
          if (columnIndex >= 0 && row[columnIndex] !== undefined) {
            standardRow.push(row[columnIndex])
          } else {
            standardRow.push('')
          }
        } else {
          standardRow.push('')
        }
      })
      
      return standardRow
    })

    // Criar cabeçalhos padrão
    const standardHeaders = STANDARD_FIELDS.map(f => f.label)

    return NextResponse.json({
      success: true,
      headers: standardHeaders,
      rows: restructuredRows,
      mappings,
      originalHeaders: headers,
      fileName,
      totalRows: restructuredRows.length,
      message: 'Planilha reestruturada automaticamente com IA'
    })

  } catch (error: any) {
    console.error('Erro ao processar planilha com IA:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Erro ao processar planilha com IA',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}











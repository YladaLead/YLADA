import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import { requireApiAuth } from '@/lib/api-auth'

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      )
    }

    // Verificar tipo de arquivo
    const fileName = file.name.toLowerCase()
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls')
    const isCsv = fileName.endsWith('.csv')

    if (!isExcel && !isCsv) {
      return NextResponse.json(
        { error: 'Formato de arquivo não suportado. Use Excel (.xlsx, .xls) ou CSV (.csv)' },
        { status: 400 }
      )
    }

    let headers: string[] = []
    let rows: any[][] = []

    if (isExcel) {
      // Processar arquivo Excel com tratamento robusto
      try {
        const buffer = await file.arrayBuffer()
        
        if (buffer.byteLength === 0) {
          return NextResponse.json(
            { error: 'Arquivo Excel está vazio' },
            { status: 400 }
          )
        }
        
        const workbook = XLSX.read(buffer, { type: 'buffer' })
        
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          return NextResponse.json(
            { error: 'Arquivo Excel não contém planilhas' },
            { status: 400 }
          )
        }
        
        // Usar a primeira planilha
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        
        if (!worksheet) {
          return NextResponse.json(
            { error: 'Não foi possível ler a planilha do arquivo Excel' },
            { status: 400 }
          )
        }
        
        // Obter o range real da planilha
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
        const maxCol = range.e.c // Última coluna com dados
        const maxRow = range.e.r // Última linha com dados
        
        console.log(`Range da planilha: ${worksheet['!ref']}, Colunas: ${maxCol + 1}, Linhas: ${maxRow + 1}`)
        
        // Converter para JSON usando o range completo
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1, 
          defval: '',
          blankrows: false,
          range: worksheet['!ref'] // Usar o range completo
        }) as any[][]
        
        if (jsonData.length === 0) {
          return NextResponse.json(
            { error: 'A planilha está vazia' },
            { status: 400 }
          )
        }
        
        // Encontrar a linha com mais colunas não vazias (provavelmente é a linha de cabeçalho)
        let headerRowIndex = 0
        let maxColumns = 0
        
        // Verificar as primeiras 20 linhas para encontrar cabeçalhos
        for (let i = 0; i < Math.min(20, jsonData.length); i++) {
          const row = jsonData[i] || []
          // Contar células não vazias, mas também considerar o tamanho total do array
          const nonEmptyCells = row.filter(cell => 
            cell !== null && cell !== undefined && String(cell).trim() !== ''
          ).length
          
          // Também considerar o tamanho total da linha (pode ter células vazias mas estrutura válida)
          const rowLength = row.length
          
          // Priorizar linhas com mais células não vazias, mas também considerar estrutura
          const score = nonEmptyCells * 2 + (rowLength > maxCol ? 1 : 0)
          
          if (score > maxColumns || (score === maxColumns && nonEmptyCells > 0)) {
            maxColumns = score
            headerRowIndex = i
          }
        }
        
        console.log(`Linha de cabeçalho detectada: ${headerRowIndex + 1}, Células não vazias: ${maxColumns}`)
        
        // Extrair cabeçalhos da linha identificada
        const headerRow = jsonData[headerRowIndex] || []
        
        // Determinar o número máximo de colunas baseado no range real e nas linhas de dados
        const maxCols = Math.max(
          maxCol + 1, // Colunas do range
          ...jsonData.map(row => row?.length || 0), // Tamanho das linhas
          headerRow.length // Tamanho da linha de cabeçalho
        )
        
        console.log(`Número máximo de colunas: ${maxCols}`)
        
        // Processar cabeçalhos - usar o valor real ou criar nome genérico
        headers = []
        for (let i = 0; i < maxCols; i++) {
          const header = headerRow[i]
          if (header !== null && header !== undefined && String(header).trim() !== '') {
            headers.push(String(header).trim())
          } else {
            // Verificar se há dados nesta coluna nas linhas seguintes
            const hasDataInColumn = jsonData.slice(headerRowIndex + 1).some(row => {
              const cell = row[i]
              return cell !== null && cell !== undefined && String(cell).trim() !== ''
            })
            
            if (hasDataInColumn) {
              headers.push(`Coluna ${i + 1}`)
            } else {
              // Só adicionar se for uma das primeiras colunas ou se houver dados
              if (i < 10) {
                headers.push(`Coluna ${i + 1}`)
              }
            }
          }
        }
        
        // Se não encontrou cabeçalhos válidos, tentar próxima linha
        const hasValidHeaders = headers.some(h => h && h !== '' && !h.startsWith('Coluna '))
        
        if (!hasValidHeaders && jsonData.length > headerRowIndex + 1) {
          const nextRow = jsonData[headerRowIndex + 1] || []
          headers = []
          for (let i = 0; i < maxCols; i++) {
            const header = nextRow[i]
            if (header !== null && header !== undefined && String(header).trim() !== '') {
              headers.push(String(header).trim())
            } else if (i < 10) {
              headers.push(`Coluna ${i + 1}`)
            }
          }
          headerRowIndex++
        }
        
        // Garantir que temos pelo menos algumas colunas
        if (headers.length === 0) {
          headers = Array(Math.min(maxCols, 20)).fill(null).map((_, index) => `Coluna ${index + 1}`)
        }
        
        // Extrair linhas de dados (pular a linha de cabeçalho)
        rows = jsonData
          .slice(headerRowIndex + 1)
          .map(row => {
            // Garantir que todas as linhas tenham o mesmo número de colunas que os cabeçalhos
            const normalizedRow = Array(headers.length).fill('')
            for (let i = 0; i < Math.min(row?.length || 0, headers.length); i++) {
              const cell = row[i]
              normalizedRow[i] = cell !== null && cell !== undefined ? String(cell).trim() : ''
            }
            return normalizedRow
          })
          .filter(row => 
            row.some(cell => cell !== null && cell !== undefined && String(cell).trim() !== '')
          )
        
        // Remover colunas completamente vazias do final
        while (headers.length > 1) {
          const lastColIndex = headers.length - 1
          const hasData = rows.some(row => row[lastColIndex] && String(row[lastColIndex]).trim() !== '')
          if (!hasData && headers[lastColIndex]?.startsWith('Coluna ')) {
            headers.pop()
            rows = rows.map(row => row.slice(0, -1))
          } else {
            break
          }
        }
        
        if (headers.length === 0) {
          return NextResponse.json(
            { error: 'Não foi possível detectar cabeçalhos na planilha' },
            { status: 400 }
          )
        }
        
        console.log(`✅ Detectados ${headers.length} cabeçalhos:`, headers.slice(0, 10).join(', '))
        console.log(`✅ ${rows.length} linhas de dados processadas`)
      } catch (excelError: any) {
        console.error('Erro específico ao processar Excel:', excelError)
        if (excelError.message?.includes('corrupt') || excelError.message?.includes('invalid')) {
          return NextResponse.json(
            { error: 'Arquivo Excel corrompido ou formato inválido. Verifique se o arquivo não está corrompido.' },
            { status: 400 }
          )
        }
        throw excelError
      }
    } else if (isCsv) {
      // Processar arquivo CSV
      const text = await file.text()
      
      const result = Papa.parse(text, {
        header: false,
        skipEmptyLines: true,
        encoding: 'UTF-8'
      })

      if (result.data.length > 0) {
        headers = (result.data[0] as any[]).map(h => String(h || '').trim()).filter(h => h)
        rows = (result.data.slice(1) as any[][]).filter(row => 
          row.some(cell => cell !== null && cell !== undefined && String(cell).trim() !== '')
        )
      }
    }

    // Limpar dados
    const cleanedRows = rows.map(row => 
      row.map(cell => {
        if (cell === null || cell === undefined) return ''
        return String(cell).trim()
      })
    )

    return NextResponse.json({
      success: true,
      headers,
      rows: cleanedRows,
      totalRows: cleanedRows.length,
      fileName: file.name
    })

  } catch (error: any) {
    console.error('Erro ao processar arquivo:', error)
    
    // Mensagens de erro mais específicas
    if (error.message?.includes('corrupt') || error.message?.includes('invalid')) {
      return NextResponse.json(
        { error: 'Arquivo corrompido ou formato inválido. Verifique se o arquivo não está corrompido.' },
        { status: 400 }
      )
    }
    
    if (error.message?.includes('empty') || error.message?.includes('vazio')) {
      return NextResponse.json(
        { error: 'Arquivo está vazio ou não contém dados válidos.' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        error: error.message || 'Erro ao processar arquivo. Verifique se o arquivo está no formato correto (Excel .xlsx/.xls ou CSV).',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

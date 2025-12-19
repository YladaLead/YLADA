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
        
        // Converter para JSON - método mais simples e direto
        // Usar header: 1 para obter array de arrays (linha por linha)
        let jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1, 
          defval: '', // Usar string vazia em vez de null
          blankrows: true, // Incluir todas as linhas, mesmo vazias
          raw: false // Converter tudo para string
        }) as any[][]
        
        // Se não capturou linhas suficientes, tentar método alternativo
        if (jsonData.length <= 1) {
          console.log('⚠️ Poucas linhas detectadas, tentando método alternativo...')
          // Tentar sem blankrows para ver se captura mais
          const altData = XLSX.utils.sheet_to_json(worksheet, { 
            header: 1, 
            defval: '',
            blankrows: false,
            raw: false
          }) as any[][]
          
          if (altData.length > jsonData.length) {
            jsonData = altData
            console.log(`✅ Método alternativo capturou ${jsonData.length} linhas`)
          }
        }
        
        console.log(`📊 Total de linhas no JSON: ${jsonData.length}`)
        if (jsonData.length > 0) {
          console.log(`📋 Primeiras 3 linhas (primeiras 3 colunas):`, jsonData.slice(0, 3).map(r => r?.slice(0, 3)))
          console.log(`📋 Últimas 3 linhas (primeiras 3 colunas):`, jsonData.slice(-3).map(r => r?.slice(0, 3)))
        }
        
        if (jsonData.length === 0) {
          return NextResponse.json(
            { error: 'A planilha está vazia ou não foi possível ler os dados' },
            { status: 400 }
          )
        }
        
        // Se só tem 1 linha e parece ser cabeçalho, avisar
        if (jsonData.length === 1) {
          console.warn('⚠️ Apenas 1 linha encontrada - pode ser apenas cabeçalho')
        }
        
        // Detecção simplificada: primeira linha é sempre cabeçalho
        // Isso é mais assertivo e funciona para templates padrão
        let headerRowIndex = 0
        
        // Verificar se a primeira linha parece ser cabeçalho
        const firstRow = jsonData[0] || []
        const firstRowText = firstRow.map(c => String(c || '').toLowerCase()).join(' ')
        
        // Se a primeira linha contém palavras-chave de cabeçalho, usar ela
        const headerKeywords = ['nome', 'email', 'telefone', 'peso', 'altura', 'objetivo', 'observações', 'data', 'nascimento', 'gênero', 'genero']
        const isHeaderRow = headerKeywords.some(keyword => firstRowText.includes(keyword))
        
        if (!isHeaderRow && jsonData.length > 1) {
          // Se a primeira linha não parece cabeçalho, verificar a segunda
          const secondRow = jsonData[1] || []
          const secondRowText = secondRow.map(c => String(c || '').toLowerCase()).join(' ')
          if (headerKeywords.some(keyword => secondRowText.includes(keyword))) {
            headerRowIndex = 1
          }
        }
        
        console.log(`📋 Linha de cabeçalho detectada: ${headerRowIndex + 1} (linha ${headerRowIndex + 1} de ${jsonData.length})`)
        
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
        const rawRows = jsonData.slice(headerRowIndex + 1)
        console.log(`📊 Total de linhas brutas após cabeçalho: ${rawRows.length}`)
        console.log(`📊 Primeira linha bruta (primeiras 5 células):`, rawRows[0]?.slice(0, 5))
        console.log(`📊 Segunda linha bruta (primeiras 5 células):`, rawRows[1]?.slice(0, 5))
        console.log(`📊 Terceira linha bruta (primeiras 5 células):`, rawRows[2]?.slice(0, 5))
        
        rows = rawRows
          .map((row, rowIndex) => {
            // Pular se a linha não existe ou não é array
            if (!row || !Array.isArray(row) || row.length === 0) {
              return null
            }
            
            // Garantir que todas as linhas tenham o mesmo número de colunas que os cabeçalhos
            const normalizedRow = Array(headers.length).fill('')
            let hasAnyData = false
            let nonEmptyCount = 0
            
            // Processar todas as células da linha original
            for (let i = 0; i < Math.min(row.length, headers.length); i++) {
              const cell = row[i]
              
              // Aceitar qualquer valor não-null/undefined
              if (cell !== null && cell !== undefined) {
                const cellValue = String(cell).trim()
                normalizedRow[i] = cellValue
                
                // Contar células não vazias
                if (cellValue !== '') {
                  hasAnyData = true
                  nonEmptyCount++
                }
              }
            }
            
            // Se a linha tem pelo menos 1 célula não vazia, aceitar
            // Isso é mais permissivo e deve capturar todas as linhas com dados
            if (hasAnyData && nonEmptyCount > 0) {
              return normalizedRow
            }
            
            // Se não encontrou dados nas primeiras colunas, verificar toda a linha original
            if (!hasAnyData) {
              const hasDataInRow = row.some(cell => {
                if (cell === null || cell === undefined) return false
                const str = String(cell).trim()
                return str !== '' && str !== 'null' && str !== 'undefined' && str.length > 0
              })
              
              if (hasDataInRow) {
                // Se encontrou dados em qualquer lugar da linha, normalizar novamente
                for (let i = 0; i < Math.min(row.length, headers.length); i++) {
                  const cell = row[i]
                  if (cell !== null && cell !== undefined) {
                    normalizedRow[i] = String(cell).trim()
                  }
                }
                return normalizedRow
              }
            }
            
            return null
          })
          .filter(row => row !== null && row !== undefined) as any[][]
        
        console.log(`✅ Linhas válidas após filtro: ${rows.length}`)
        
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
        
        // Se não encontrou linhas, tentar método mais permissivo
        if (rows.length === 0 && rawRows.length > 0) {
          console.warn(`⚠️ Nenhuma linha passou no filtro, tentando método mais permissivo...`)
          // Tentar novamente sem filtro tão restritivo
          rows = rawRows
            .map((row) => {
              if (!row || !Array.isArray(row)) return null
              const normalizedRow = Array(headers.length).fill('')
              let hasAnyData = false
              
              for (let i = 0; i < Math.min(row.length, headers.length); i++) {
                const cell = row[i]
                if (cell !== null && cell !== undefined) {
                  const cellValue = String(cell).trim()
                  normalizedRow[i] = cellValue
                  // Aceitar linha se tiver pelo menos uma célula não vazia
                  if (cellValue !== '') {
                    hasAnyData = true
                  }
                }
              }
              
              return hasAnyData ? normalizedRow : null
            })
            .filter(row => row !== null && row !== undefined) as any[][]
          
          console.log(`✅ Após método permissivo: ${rows.length} linhas encontradas`)
        }
        
        if (rows.length > 0) {
          console.log(`📋 Primeira linha de dados:`, rows[0].slice(0, 3).join(', '))
        } else {
          console.warn(`⚠️ Nenhuma linha de dados encontrada após processamento`)
          console.log(`📊 Total de linhas brutas: ${jsonData.length}`)
          console.log(`📊 Índice do cabeçalho: ${headerRowIndex}`)
          console.log(`📊 Linhas após cabeçalho: ${rawRows.length}`)
          console.log(`📊 Primeira linha bruta:`, rawRows[0]?.slice(0, 5))
        }
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

    console.log(`📦 Retornando: ${cleanedRows.length} linhas, ${headers.length} cabeçalhos`)

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

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import Tesseract from 'tesseract.js'

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
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
    const isImage = fileName.endsWith('.png') || 
                    fileName.endsWith('.jpg') || 
                    fileName.endsWith('.jpeg') ||
                    fileName.endsWith('.webp')
    const isPdf = fileName.endsWith('.pdf')

    if (!isImage && !isPdf) {
      return NextResponse.json(
        { error: 'Formato de arquivo não suportado. Use imagens (PNG, JPG, JPEG, WEBP) ou PDF' },
        { status: 400 }
      )
    }

    // Validar tamanho (máximo 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Tamanho máximo: 10MB' },
        { status: 400 }
      )
    }

    // Converter arquivo para buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    let text = ''

    if (isPdf) {
      // Para PDF, precisaríamos de uma biblioteca específica
      // Por enquanto, retornar erro sugerindo converter para imagem
      return NextResponse.json(
        { 
          error: 'PDF não suportado diretamente. Por favor, converta o PDF em uma imagem (PNG ou JPG) e tente novamente.',
          suggestion: 'Você pode usar ferramentas online para converter PDF em imagem, ou tirar uma foto da planilha impressa.'
        },
        { status: 400 }
      )
    }

    // Processar imagem com OCR
    try {
      console.log('Iniciando OCR para arquivo:', file.name)
      
      const { data: { text: extractedText } } = await Tesseract.recognize(
        buffer,
        'por', // Português
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              console.log(`Progresso OCR: ${Math.round(m.progress * 100)}%`)
            }
          }
        }
      )

      text = extractedText
      console.log('OCR concluído. Texto extraído:', text.substring(0, 200))

    } catch (ocrError: any) {
      console.error('Erro no OCR:', ocrError)
      return NextResponse.json(
        { error: `Erro ao processar imagem com OCR: ${ocrError.message}` },
        { status: 500 }
      )
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Não foi possível extrair texto da imagem. Verifique se a imagem está nítida e contém texto legível.' },
        { status: 400 }
      )
    }

    // Processar texto extraído e tentar identificar estrutura de tabela
    const lines = text.split('\n').filter(line => line.trim().length > 0)
    
    // Tentar identificar cabeçalhos (geralmente nas primeiras linhas)
    const potentialHeaders: string[] = []
    const potentialRows: string[][] = []
    
    // Analisar as primeiras linhas para encontrar cabeçalhos
    let headerFound = false
    let headerLineIndex = -1
    
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim()
      // Se a linha contém palavras comuns de cabeçalho ou tem múltiplas palavras separadas
      const words = line.split(/\s+/).filter(w => w.length > 2)
      if (words.length >= 2 && !headerFound) {
        // Tentar dividir por espaços múltiplos, tabs, ou padrões comuns
        const columns = line.split(/\s{2,}|\t/).filter(col => col.trim().length > 0)
        if (columns.length >= 2) {
          potentialHeaders.push(...columns.map(col => col.trim()))
          headerFound = true
          headerLineIndex = i
          break
        }
      }
    }

    // Se não encontrou cabeçalhos claros, tentar detectar padrão de tabela
    if (!headerFound) {
      // Analisar todas as linhas para encontrar padrão de colunas
      const allColumns = new Set<string>()
      
      for (const line of lines.slice(0, 20)) {
        const columns = line.split(/\s{2,}|\t/).filter(col => col.trim().length > 0)
        columns.forEach(col => {
          const trimmed = col.trim()
          if (trimmed.length > 2) {
            allColumns.add(trimmed)
          }
        })
      }

      // Se encontrou padrão consistente, usar primeira linha como cabeçalho
      if (allColumns.size >= 2) {
        const firstLine = lines[0].split(/\s{2,}|\t/).filter(col => col.trim().length > 0)
        potentialHeaders.push(...firstLine.map(col => col.trim()))
        headerLineIndex = 0
      } else {
        // Fallback: criar cabeçalhos genéricos baseados no número de colunas detectadas
        const maxCols = Math.max(...lines.slice(0, 10).map(line => 
          line.split(/\s{2,}|\t/).filter(col => col.trim().length > 0).length
        ), 2)
        
        for (let i = 0; i < maxCols; i++) {
          potentialHeaders.push(`Coluna ${i + 1}`)
        }
      }
    }

    // Processar linhas de dados
    const dataStartIndex = headerLineIndex >= 0 ? headerLineIndex + 1 : 1
    
    for (let i = dataStartIndex; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line.length === 0) continue
      
      // Dividir linha em colunas (espaços múltiplos, tabs, etc)
      const columns = line.split(/\s{2,}|\t/).filter(col => col.trim().length > 0)
      
      if (columns.length > 0) {
        // Normalizar número de colunas para corresponder aos cabeçalhos
        const normalizedRow = Array(potentialHeaders.length).fill('')
        for (let j = 0; j < Math.min(columns.length, potentialHeaders.length); j++) {
          normalizedRow[j] = columns[j].trim()
        }
        potentialRows.push(normalizedRow)
      }
    }

    // Se não encontrou estrutura clara, retornar texto bruto para processamento manual
    if (potentialHeaders.length === 0 || potentialRows.length === 0) {
      return NextResponse.json({
        success: true,
        text,
        headers: [],
        rows: [],
        rawText: true,
        message: 'Texto extraído, mas estrutura de tabela não foi detectada automaticamente. O texto será processado manualmente.'
      })
    }

    return NextResponse.json({
      success: true,
      headers: potentialHeaders,
      rows: potentialRows,
      totalRows: potentialRows.length,
      fileName: file.name,
      rawText: false,
      extractedText: text.substring(0, 500) // Primeiros 500 caracteres para debug
    })

  } catch (error: any) {
    console.error('Erro ao processar imagem com OCR:', error)
    
    let errorMessage = 'Erro interno do servidor ao processar imagem'
    if (error.message) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}


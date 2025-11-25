import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import { requireApiAuth } from '@/lib/auth'

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
      // Processar arquivo Excel
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'buffer' })
      
      // Usar a primeira planilha
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      
      // Converter para JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      
      if (jsonData.length > 0) {
        headers = (jsonData[0] as any[]).map(h => String(h || '').trim()).filter(h => h)
        rows = (jsonData.slice(1) as any[][]).filter(row => 
          row.some(cell => cell !== null && cell !== undefined && String(cell).trim() !== '')
        )
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
    return NextResponse.json(
      { error: 'Erro interno do servidor ao processar arquivo' },
      { status: 500 }
    )
  }
}

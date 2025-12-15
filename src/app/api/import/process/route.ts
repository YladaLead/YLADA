/**
 * API Unificada de Importação
 * Roteia importações para handlers específicos baseado no perfil do usuário
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { CoachImportHandler } from '@/lib/import/handlers/coach-handler'
import { processJSONData } from '@/lib/import/formatters/json-formatter'
import type { ImportFormat } from '@/lib/import/handlers/base-handler'

export async function POST(request: NextRequest) {
  try {
    // 1. Autenticação (aceita todos os perfis)
    const authResult = await requireApiAuth(request, ['coach', 'nutri', 'wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user, profile } = authResult

    // 2. Obter dados da requisição
    const body = await request.json()
    const { format, data, mappings } = body

    // 3. Validar formato
    const validFormats: ImportFormat[] = ['excel', 'csv', 'json']
    if (!format || !validFormats.includes(format)) {
      return NextResponse.json(
        { error: `Formato inválido. Use um dos seguintes: ${validFormats.join(', ')}` },
        { status: 400 }
      )
    }

    // 4. Processar JSON se necessário
    let processedData = data
    if (format === 'json') {
      try {
        const jsonData = processJSONData(data)
        processedData = jsonData.type === 'array' 
          ? jsonData.data 
          : jsonData.type === 'structured'
          ? [jsonData.data]
          : [jsonData.data]
      } catch (error: any) {
        return NextResponse.json(
          { error: `Erro ao processar JSON: ${error.message}` },
          { status: 400 }
        )
      }
    }

    // 5. Obter handler baseado no perfil
    let handler
    switch (profile) {
      case 'coach':
        handler = new CoachImportHandler(user.id, profile)
        break
      case 'nutri':
        // TODO: Implementar NutriImportHandler
        return NextResponse.json(
          { error: 'Importação para nutri ainda não implementada' },
          { status: 501 }
        )
      case 'wellness':
        // TODO: Implementar WellnessImportHandler
        return NextResponse.json(
          { error: 'Importação para wellness ainda não implementada' },
          { status: 501 }
        )
      default:
        return NextResponse.json(
          { error: 'Perfil não suportado para importação' },
          { status: 400 }
        )
    }

    // 6. Processar importação
    const result = await handler.process(processedData, mappings, format)

    // 7. Retornar resultado
    if (result.success) {
      return NextResponse.json({
        success: true,
        imported: result.imported,
        failed: result.failed,
        warnings: result.warnings,
        message: `${result.imported} ${result.imported === 1 ? 'cliente importado' : 'clientes importados'} com sucesso`
      })
    } else {
      return NextResponse.json({
        success: false,
        imported: result.imported,
        failed: result.failed,
        errors: result.errors,
        warnings: result.warnings,
        message: `Importação concluída com erros. ${result.imported} importados, ${result.failed} falharam`
      }, { status: 207 }) // 207 Multi-Status
    }

  } catch (error: any) {
    console.error('Erro na importação:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro interno do servidor',
        message: error.message || 'Erro desconhecido ao processar importação'
      },
      { status: 500 }
    )
  }
}

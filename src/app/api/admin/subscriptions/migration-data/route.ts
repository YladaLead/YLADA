import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import fs from 'fs'
import path from 'path'

/**
 * GET /api/admin/subscriptions/migration-data
 * Retorna o JSON de migração com os 34 usuários
 * Apenas admin pode acessar
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    // Ler o arquivo JSON
    const filePath = path.join(process.cwd(), 'scripts', 'import-users-migration.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const jsonData = JSON.parse(fileContents)

    return NextResponse.json({
      success: true,
      data: jsonData,
      count: jsonData.length
    })
  } catch (error: any) {
    console.error('Erro ao ler arquivo de migração:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao carregar dados de migração',
        technical: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}


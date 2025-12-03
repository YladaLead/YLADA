import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🧪 TESTE: Verificando Supabase Admin...')
    
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Supabase Admin não configurado',
        env: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌',
          key: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌'
        }
      }, { status: 500 })
    }
    
    console.log('✅ Supabase Admin existe, testando query...')
    
    // Teste 1: Contar registros
    const { count, error: countError } = await supabaseAdmin
      .from('journey_days')
      .select('*', { count: 'exact', head: true })
    
    console.log('📊 Count:', count, 'Error:', countError)
    
    // Teste 2: Buscar dados
    const { data, error } = await supabaseAdmin
      .from('journey_days')
      .select('day_number, title')
      .limit(5)
    
    console.log('📊 Data length:', data?.length, 'Error:', error)
    
    return NextResponse.json({
      success: true,
      count: count || 0,
      countError: countError ? {
        code: countError.code,
        message: countError.message
      } : null,
      dataLength: data?.length || 0,
      data: data || [],
      error: error ? {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      } : null
    })
  } catch (error: any) {
    console.error('❌ Erro no teste:', error)
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}


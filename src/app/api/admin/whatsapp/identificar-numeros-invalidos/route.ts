/**
 * API para identificar números inválidos no banco
 * GET /api/admin/whatsapp/identificar-numeros-invalidos
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // Autenticação
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const isAdmin = user.user_metadata?.role === 'admin'
    if (!isAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    // Buscar todas as conversas
    const { data: conversations, error } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, created_at, last_message_at')
      .eq('area', 'nutri')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    // Identificar números inválidos
    const invalidNumbers: any[] = []
    const validNumbers: any[] = []

    conversations?.forEach((conv) => {
      const phone = conv.phone || ''
      const cleanPhone = phone.replace(/\D/g, '')
      
      // Critérios de número inválido:
      // 1. Mais de 15 dígitos (provavelmente é ID do WhatsApp)
      // 2. Menos de 10 dígitos (muito curto)
      // 3. Contém caracteres não numéricos além de +, espaços, hífens
      // 4. Parece ser ID (contém @ ou é muito longo)
      
      const isInvalid = 
        cleanPhone.length > 15 ||
        cleanPhone.length < 10 ||
        phone.includes('@') ||
        (cleanPhone.length >= 16 && cleanPhone.length <= 20) // IDs geralmente têm 16-20 dígitos

      if (isInvalid) {
        invalidNumbers.push({
          id: conv.id,
          phone: conv.phone,
          name: conv.name,
          cleanLength: cleanPhone.length,
          created_at: conv.created_at,
          last_message_at: conv.last_message_at,
          reason: 
            cleanPhone.length > 15 ? 'Muito longo (provavelmente ID do WhatsApp)' :
            cleanPhone.length < 10 ? 'Muito curto' :
            phone.includes('@') ? 'Contém @ (ID do WhatsApp)' :
            'Formato inválido'
        })
      } else {
        validNumbers.push({
          id: conv.id,
          phone: conv.phone,
          name: conv.name
        })
      }
    })

    return NextResponse.json({
      total: conversations?.length || 0,
      valid: validNumbers.length,
      invalid: invalidNumbers.length,
      invalidNumbers: invalidNumbers.slice(0, 50), // Limitar a 50 para não sobrecarregar
      summary: {
        muitoLongos: invalidNumbers.filter(n => n.cleanLength > 15).length,
        muitoCurtos: invalidNumbers.filter(n => n.cleanLength < 10).length,
        comArroba: invalidNumbers.filter(n => n.phone?.includes('@')).length,
      }
    })
  } catch (error: any) {
    console.error('[Identificar Números Inválidos] Erro:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao identificar números inválidos' },
      { status: 500 }
    )
  }
}

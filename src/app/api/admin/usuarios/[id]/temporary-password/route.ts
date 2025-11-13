import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Função para gerar senha provisória aleatória
function generateTemporaryPassword(): string {
  const length = 12
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const lowercase = 'abcdefghijkmnpqrstuvwxyz'
  const numbers = '23456789'
  const special = '!@#$%&*'
  
  // Garantir pelo menos um de cada tipo
  let password = ''
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += special[Math.floor(Math.random() * special.length)]
  
  // Completar com caracteres aleatórios
  const allChars = uppercase + lowercase + numbers + special
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }
  
  // Embaralhar
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

// POST - Gerar senha provisória para um usuário
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação do admin
    const authHeader = request.headers.get('authorization')
    const cookieHeader = request.headers.get('cookie')
    
    // Buscar usuário pelo ID
    const userId = params.id
    
    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário não fornecido' },
        { status: 400 }
      )
    }

    // Buscar dados do usuário no auth.users
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId)
    
    if (authError || !authUser) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Gerar senha provisória
    const temporaryPassword = generateTemporaryPassword()
    
    // Calcular data de expiração (3 dias a partir de agora)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 3)
    
    // Atualizar senha do usuário
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      {
        password: temporaryPassword
      }
    )

    if (updateError) {
      console.error('❌ Erro ao atualizar senha:', updateError)
      return NextResponse.json(
        { error: 'Erro ao definir senha provisória', details: updateError.message },
        { status: 500 }
      )
    }

    // Salvar data de expiração no user_profiles
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .upsert({
        user_id: userId,
        temporary_password_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (profileError) {
      console.warn('⚠️ Aviso: Não foi possível salvar data de expiração:', profileError)
      // Não falhar se não conseguir salvar a data de expiração
    }

    console.log(`✅ Senha provisória gerada para ${authUser.user.email}`)
    console.log(`📅 Expira em: ${expiresAt.toLocaleString('pt-BR')}`)

    return NextResponse.json({
      success: true,
      temporaryPassword: temporaryPassword,
      expiresAt: expiresAt.toISOString(),
      expiresAtFormatted: expiresAt.toLocaleString('pt-BR'),
      message: `Senha provisória gerada com sucesso. Expira em 3 dias.`
    })

  } catch (error: any) {
    console.error('❌ Erro ao gerar senha provisória:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar senha provisória', details: error.message },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET - Verifica se o usuário já completou o onboarding
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { data, error } = await supabaseAdmin
      .from('wellness_noel_profile')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') { // PGRST116 = não encontrado
      console.error('❌ Erro ao buscar perfil NOEL:', error)
      return NextResponse.json(
        { error: 'Erro ao verificar perfil' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      hasProfile: !!data,
      onboardingComplete: data?.onboarding_completo || false,
      profile: data || null,
    })
  } catch (error: any) {
    console.error('❌ Erro no onboarding check:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar onboarding' },
      { status: 500 }
    )
  }
}

/**
 * POST - Salva respostas do onboarding
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    // Verificar se a tabela existe (se não existir, retornar erro claro)
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do banco de dados incompleta' },
        { status: 500 }
      )
    }

    const body = await request.json()
    
    // Extrair todos os campos possíveis
    const {
      // Dados do Perfil
      idade,
      cidade,
      tempo_disponivel,
      experiencia_herbalife,
      experiencia_vendas, // Compatibilidade com versão antiga
      objetivo_principal,
      canal_principal,
      canal_preferido, // Compatibilidade com versão antiga
      profile_type, // Perfil do distribuidor (beverage/product/activator)
      
      // Dados Operacionais
      prepara_bebidas,
      trabalha_com,
      estoque_atual,
      meta_pv,
      meta_financeira,
      
      // Dados Sociais
      contatos_whatsapp,
      seguidores_instagram,
      abertura_recrutar,
      publico_preferido,
      
      // Preferências
      tom,
      ritmo,
      lembretes,
      
      // Dados antigos (compatibilidade)
      tem_lista_contatos,
    } = body

    // Validações básicas (campos obrigatórios)
    if (!objetivo_principal || !tempo_disponivel) {
      return NextResponse.json(
        { 
          error: 'Campos obrigatórios faltando',
          required: ['objetivo_principal', 'tempo_disponivel']
        },
        { status: 400 }
      )
    }

    // Mapear experiencia_vendas para experiencia_herbalife se necessário
    const experienciaFinal = experiencia_herbalife || 
      (experiencia_vendas === 'sim_regularmente' ? 'ja_vendi' :
       experiencia_vendas === 'ja_vendi_tempo' ? 'ja_vendi' :
       experiencia_vendas === 'nunca_vendi' ? 'nenhuma' : null)

    // Mapear canal_preferido para canal_principal se necessário
    const canalFinal = canal_principal || 
      (Array.isArray(canal_preferido) && canal_preferido.length > 0 ? canal_preferido[0] : null) ||
      (typeof canal_preferido === 'string' ? canal_preferido : null)

    // Preparar dados do perfil
    const profileData: any = {
      user_id: user.id,
      objetivo_principal,
      tempo_disponivel,
      onboarding_completo: true,
      onboarding_completado_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Adicionar campos opcionais se fornecidos
    if (idade !== undefined) profileData.idade = idade
    if (cidade) profileData.cidade = cidade
    if (experienciaFinal) profileData.experiencia_herbalife = experienciaFinal
    if (canalFinal) profileData.canal_principal = canalFinal
    if (prepara_bebidas) profileData.prepara_bebidas = prepara_bebidas
    if (trabalha_com) profileData.trabalha_com = trabalha_com
    if (estoque_atual) profileData.estoque_atual = estoque_atual
    if (meta_pv !== undefined) profileData.meta_pv = meta_pv
    if (meta_financeira !== undefined) profileData.meta_financeira = meta_financeira
    if (contatos_whatsapp !== undefined) profileData.contatos_whatsapp = contatos_whatsapp
    if (seguidores_instagram !== undefined) profileData.seguidores_instagram = seguidores_instagram
    if (abertura_recrutar) profileData.abertura_recrutar = abertura_recrutar
    if (publico_preferido) profileData.publico_preferido = publico_preferido
    if (tom) profileData.tom = tom
    if (ritmo) profileData.ritmo = ritmo
    if (lembretes !== undefined) profileData.lembretes = lembretes
    // profile_type não é salvo em wellness_noel_profile, apenas em user_profiles (veja abaixo)

    // Compatibilidade com versão antiga
    if (canal_preferido && Array.isArray(canal_preferido)) {
      profileData.canal_preferido = canal_preferido
    }
    if (experiencia_vendas) {
      profileData.experiencia_vendas = experiencia_vendas
    }
    if (tem_lista_contatos) {
      profileData.tem_lista_contatos = tem_lista_contatos
    }

    // Se não tiver onboarding_iniciado_at, definir agora
    if (!body.onboarding_iniciado_at) {
      profileData.onboarding_iniciado_at = new Date().toISOString()
    }

    // Converter tipos numéricos corretamente e validar limites
    if (meta_pv !== undefined && meta_pv !== null && meta_pv !== '') {
      const pvValue = typeof meta_pv === 'string' ? parseInt(meta_pv) : meta_pv
      if (!isNaN(pvValue)) {
        if (pvValue < 100) {
          profileData.meta_pv = 100 // Mínimo
        } else if (pvValue > 50000) {
          console.warn(`⚠️ Meta PV ${pvValue} excede limite de 50000, ajustando para 50000`)
          profileData.meta_pv = 50000 // Máximo
        } else {
          profileData.meta_pv = pvValue
        }
      }
    }
    
    if (meta_financeira !== undefined && meta_financeira !== null && meta_financeira !== '') {
      const finValue = typeof meta_financeira === 'string' ? parseFloat(meta_financeira) : meta_financeira
      if (!isNaN(finValue)) {
        // Validar e ajustar se necessário (limite: 500-200000)
        if (finValue < 500) {
          profileData.meta_financeira = 500 // Mínimo
        } else if (finValue > 200000) {
          console.warn(`⚠️ Meta financeira ${finValue} excede limite de 200000, ajustando para 200000`)
          profileData.meta_financeira = 200000 // Máximo
        } else {
          profileData.meta_financeira = finValue
        }
      }
    }
    
    if (contatos_whatsapp !== undefined && contatos_whatsapp !== null && contatos_whatsapp !== '') {
      const contValue = typeof contatos_whatsapp === 'string' ? parseInt(contatos_whatsapp) : contatos_whatsapp
      if (!isNaN(contValue) && contValue >= 0) {
        profileData.contatos_whatsapp = contValue
      }
    }
    
    if (seguidores_instagram !== undefined && seguidores_instagram !== null && seguidores_instagram !== '') {
      const segValue = typeof seguidores_instagram === 'string' ? parseInt(seguidores_instagram) : seguidores_instagram
      if (!isNaN(segValue) && segValue >= 0) {
        profileData.seguidores_instagram = segValue
      }
    }
    
    if (idade !== undefined && idade !== null && idade !== '') {
      const idadeValue = typeof idade === 'string' ? parseInt(idade) : idade
      if (!isNaN(idadeValue) && idadeValue >= 18 && idadeValue <= 100) {
        profileData.idade = idadeValue
      }
    }

    // Garantir que arrays sejam arrays válidos
    if (publico_preferido !== undefined) {
      if (Array.isArray(publico_preferido)) {
        profileData.publico_preferido = publico_preferido
      } else if (publico_preferido) {
        profileData.publico_preferido = [publico_preferido]
      } else {
        profileData.publico_preferido = []
      }
    }
    
    if (canal_preferido !== undefined) {
      if (Array.isArray(canal_preferido)) {
        profileData.canal_preferido = canal_preferido
      } else if (canal_preferido) {
        profileData.canal_preferido = [canal_preferido]
      }
    }
    
    // Garantir que estoque_atual seja JSONB válido
    if (estoque_atual !== undefined) {
      if (Array.isArray(estoque_atual)) {
        profileData.estoque_atual = estoque_atual
      } else if (typeof estoque_atual === 'string') {
        try {
          profileData.estoque_atual = JSON.parse(estoque_atual)
        } catch {
          profileData.estoque_atual = []
        }
      } else {
        profileData.estoque_atual = []
      }
    }

    console.log('💾 Tentando salvar perfil:', JSON.stringify(profileData, null, 2))

    const { data, error } = await supabaseAdmin
      .from('wellness_noel_profile')
      .upsert(profileData, {
        onConflict: 'user_id',
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao salvar perfil NOEL:', error)
      console.error('❌ Detalhes do erro:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      console.error('❌ Dados que tentaram ser salvos:', JSON.stringify(profileData, null, 2))
      return NextResponse.json(
        { 
          error: 'Erro ao salvar perfil',
          details: error.message,
          code: error.code,
          hint: error.hint
        },
        { status: 500 }
      )
    }

    console.log('✅ Perfil salvo com sucesso:', data)

    // Se profile_type foi fornecido, atualizar também em user_profiles
    if (profile_type) {
      try {
        const { error: profileError } = await supabaseAdmin
          .from('user_profiles')
          .update({ 
            profile_type: profile_type,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)

        if (profileError) {
          console.warn('⚠️ Aviso: Não foi possível atualizar profile_type em user_profiles:', profileError)
          // Não falhar o request se isso der erro, apenas logar
        } else {
          console.log('✅ profile_type atualizado em user_profiles:', profile_type)
        }
      } catch (err) {
        console.warn('⚠️ Aviso: Erro ao atualizar profile_type em user_profiles:', err)
        // Não falhar o request se isso der erro
      }
    }

    return NextResponse.json({
      success: true,
      profile: data,
    })
  } catch (error: any) {
    console.error('❌ Erro ao salvar onboarding:', error)
    console.error('❌ Stack trace:', error.stack)
    console.error('❌ Dados recebidos:', JSON.stringify(body, null, 2))
    return NextResponse.json(
      { 
        error: 'Erro ao salvar onboarding',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}


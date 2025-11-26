import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Listar formulários do usuário
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const formType = searchParams.get('form_type')
    const isActive = searchParams.get('is_active')
    const isTemplate = searchParams.get('is_template')

    const authenticatedUserId = user.id

    // Debug: log do user_id autenticado
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Formulários Coach API - User ID autenticado:', authenticatedUserId)
    }

    // 🚀 OTIMIZAÇÃO: Selecionar apenas campos necessários
    let query = supabaseAdmin
      .from('custom_forms')
      .select('id, user_id, name, description, form_type, structure, is_active, is_template, created_at, updated_at', { count: 'exact' })

    // Se is_template=true, buscar templates de todos os usuários
    // Caso contrário, buscar apenas formulários do usuário autenticado
    if (isTemplate === 'true') {
      // Buscar apenas templates (is_template=true)
      query = query.eq('is_template', true)
    } else {
      // Buscar apenas formulários do usuário autenticado
      query = query.eq('user_id', authenticatedUserId)
    }

    query = query.order('created_at', { ascending: false })

    if (formType) {
      query = query.eq('form_type', formType)
    }

    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true')
    }

    const { data: forms, error, count } = await query

    if (error) {
      console.error('Erro ao buscar formulários:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar formulários', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    // Debug: log dos resultados
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Formulários Coach encontrados:', {
        total: count,
        forms: forms?.map(f => ({ id: f.id, name: f.name, user_id: f.user_id })),
        authenticatedUserId
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        forms: forms || [],
        total: count || 0
      },
      // Debug info apenas em desenvolvimento
      ...(process.env.NODE_ENV === 'development' && {
        debug: {
          authenticatedUserId,
          formsFound: forms?.length || 0
        }
      })
    })

  } catch (error: any) {
    console.error('Erro ao listar formulários:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

/**
 * POST - Criar novo formulário
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const authenticatedUserId = user.id
    const body = await request.json()
    const {
      name,
      description,
      form_type = 'questionario',
      structure,
      is_active = true,
      is_template = false,
      generate_short_url = false,
      custom_short_code = null
    } = body

    // Validações
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Nome do formulário é obrigatório' },
        { status: 400 }
      )
    }

    if (!structure || !Array.isArray(structure.fields)) {
      return NextResponse.json(
        { error: 'Estrutura do formulário é obrigatória e deve conter um array de campos' },
        { status: 400 }
      )
    }

    // Validar tipos de formulário
    const validTypes = ['questionario', 'anamnese', 'avaliacao', 'consentimento', 'outro']
    if (!validTypes.includes(form_type)) {
      return NextResponse.json(
        { error: `Tipo de formulário inválido. Use um dos seguintes: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Gerar código curto se solicitado
    let shortCode = null
    if (generate_short_url) {
      if (custom_short_code) {
        const customCode = custom_short_code.toLowerCase().trim()
        
        // Validar formato
        if (!/^[a-z0-9-]{3,10}$/.test(customCode)) {
          return NextResponse.json(
            { error: 'Código personalizado inválido. Deve ter entre 3 e 10 caracteres e conter apenas letras, números e hífens.' },
            { status: 400 }
          )
        }

        // Verificar disponibilidade (em todas as tabelas que usam short_code)
        const [toolCheck, quizCheck, portalCheck, formCheck] = await Promise.all([
          supabaseAdmin.from('coach_user_templates').select('id').eq('short_code', customCode).limit(1),
          supabaseAdmin.from('quizzes').select('id').eq('short_code', customCode).limit(1),
          supabaseAdmin.from('wellness_portals').select('id').eq('short_code', customCode).limit(1),
          supabaseAdmin.from('custom_forms').select('id').eq('short_code', customCode).limit(1)
        ])

        if ((toolCheck.data && toolCheck.data.length > 0) ||
            (quizCheck.data && quizCheck.data.length > 0) ||
            (portalCheck.data && portalCheck.data.length > 0) ||
            (formCheck.data && formCheck.data.length > 0)) {
          return NextResponse.json(
            { error: 'Este código personalizado já está em uso' },
            { status: 409 }
          )
        }

        shortCode = customCode
      } else {
        // Gerar código aleatório
        const { data: codeData, error: codeError } = await supabaseAdmin.rpc('generate_unique_short_code')
        if (!codeError && codeData) {
          shortCode = codeData
        } else {
          console.error('Erro ao gerar código curto:', codeError)
        }
      }
    }

    // Preparar dados
    const formData: any = {
      user_id: authenticatedUserId,
      name: name.trim(),
      description: description || null,
      form_type: form_type,
      structure: structure,
      is_active: is_active,
      is_template: is_template
    }

    // Adicionar short_code se foi gerado
    if (shortCode) {
      formData.short_code = shortCode
    }

    // Inserir formulário
    // 🚀 OTIMIZAÇÃO: Selecionar apenas campos necessários
    const { data: newForm, error } = await supabaseAdmin
      .from('custom_forms')
      .insert(formData)
      .select('id, user_id, name, description, form_type, structure, is_active, is_template, created_at, updated_at')
      .single()

    if (error) {
      console.error('Erro ao criar formulário:', error)
      return NextResponse.json(
        { error: 'Erro ao criar formulário', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { form: newForm }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Erro ao criar formulário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}


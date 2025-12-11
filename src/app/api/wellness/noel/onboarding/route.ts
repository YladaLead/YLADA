import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Cria metas automaticamente para novo usuário baseado no perfil
 */
async function criarMetasAutomaticas(
  userId: string,
  contexto: {
    meta_pv?: number
    objetivo_principal?: string
    experiencia_herbalife?: string
    profile_type?: string
  }
) {
  // Calcular metas padrão baseadas no perfil
  let metaPVEquipe = 0
  let metaRecrutamento = 0
  let metaRoyalties = 0
  let nivelCarreiraAlvo: string = 'consultor_ativo'
  let prazoMeses = 12

  // Se já tem meta_pv definida, usar como base
  const metaPVPessoal = contexto.meta_pv || 500 // Padrão: 500 PV

  // Determinar metas baseadas no objetivo e experiência
  if (contexto.objetivo_principal === 'plano_presidente' || contexto.objetivo_principal === 'carteira') {
    // Foco em construção de equipe
    metaPVEquipe = metaPVPessoal * 4 // Meta de equipe = 4x o PV pessoal
    metaRecrutamento = 5 // Recrutar 5 pessoas no primeiro ano
    nivelCarreiraAlvo = 'equipe_mundial'
    prazoMeses = 12
  } else if (contexto.objetivo_principal === 'renda_extra' || contexto.objetivo_principal === 'usar_recomendar') {
    // Foco em vendas pessoais primeiro
    metaPVEquipe = metaPVPessoal * 2 // Meta menor de equipe
    metaRecrutamento = 2 // Recrutar 2 pessoas
    nivelCarreiraAlvo = 'consultor_1000pv'
    prazoMeses = 12
  } else {
    // Padrão: construção moderada
    metaPVEquipe = metaPVPessoal * 3
    metaRecrutamento = 3
    nivelCarreiraAlvo = 'consultor_1000pv'
    prazoMeses = 12
  }

  // Ajustar baseado na experiência
  if (contexto.experiencia_herbalife === 'supervisor' || contexto.experiencia_herbalife === 'get_plus') {
    // Experiência avançada = metas maiores
    metaPVEquipe = metaPVEquipe * 2
    metaRecrutamento = metaRecrutamento * 2
    nivelCarreiraAlvo = 'equipe_mundial'
  }

  // Meta de royalties: SEMPRE criar desde o início
  // A pessoa precisa construir royalties desde o início para virar supervisor e depois GET
  // Mesmo com equipe mundial, já está construindo royalties para virar supervisor
  if (nivelCarreiraAlvo === 'presidente') {
    metaRoyalties = 10000 // Presidente gera ~10000 royalties
  } else if (nivelCarreiraAlvo === 'milionario') {
    metaRoyalties = 4000 // Milionário gera ~4000 royalties
  } else if (nivelCarreiraAlvo === 'get') {
    metaRoyalties = 1000 // GET gera ~1000 royalties
  } else if (nivelCarreiraAlvo === 'equipe_mundial') {
    // Equipe Mundial: construindo para virar supervisor e depois GET
    // Meta de royalties intermediária (R$ 500-800)
    metaRoyalties = 600
  } else if (nivelCarreiraAlvo === 'consultor_1000pv') {
    // Consultor 1000 PV: começando a construir equipe, royalties iniciais
    // Meta de royalties inicial (R$ 200-400)
    metaRoyalties = 300
  } else {
    // Consultor Ativo: meta de royalties bem inicial (R$ 100-200)
    // Mesmo iniciante pode começar a construir royalties desde o início
    metaRoyalties = 150
  }

  // Criar registro de metas
  const { error: metasError } = await supabaseAdmin
    .from('wellness_metas_construcao')
    .upsert({
      user_id: userId,
      meta_pv_equipe: metaPVEquipe,
      pv_equipe_atual: 0,
      meta_recrutamento: metaRecrutamento,
      recrutamento_atual: 0,
      meta_royalties: metaRoyalties,
      royalties_atual: 0,
      nivel_carreira_alvo: nivelCarreiraAlvo,
      prazo_meses: prazoMeses,
      ativo: true,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    })

  if (metasError) {
    console.error('❌ Erro ao criar metas de construção:', metasError)
    throw metasError
  }

  console.log('✅ Metas de construção criadas automaticamente:', {
    user_id: userId,
    meta_pv_equipe: metaPVEquipe,
    meta_recrutamento: metaRecrutamento,
    meta_royalties: metaRoyalties,
    nivel_carreira_alvo: nivelCarreiraAlvo
  })

  // Criar também registro mensal de PV se não existir
  const mesAno = new Date().toISOString().slice(0, 7) // '2025-01'
  const { error: pvError } = await supabaseAdmin
    .from('wellness_consultant_pv_monthly')
    .upsert({
      consultant_id: userId,
      mes_ano: mesAno,
      pv_total: 0,
      pv_kits: 0,
      pv_produtos_fechados: 0,
      meta_pv: metaPVPessoal, // Usar meta_pv do onboarding ou padrão
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'consultant_id,mes_ano'
    })

  if (pvError) {
    console.warn('⚠️ Aviso: Não foi possível criar registro mensal de PV:', pvError)
    // Não falhar se isso der erro
  } else {
    console.log('✅ Registro mensal de PV criado:', { user_id: userId, mes_ano: mesAno, meta_pv: metaPVPessoal })
  }
}

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

    // Verificar se tem perfil estratégico completo (novos campos)
    const temPerfilEstrategicoCompleto = data && 
      data.tipo_trabalho && 
      data.foco_trabalho && 
      data.ganhos_prioritarios && 
      data.nivel_herbalife && 
      data.carga_horaria_diaria && 
      data.dias_por_semana && 
      data.meta_financeira

    return NextResponse.json({
      hasProfile: !!data,
      onboardingComplete: temPerfilEstrategicoCompleto || false, // Priorizar novos campos
      profile: data || null,
      needsUpdate: !!data && !temPerfilEstrategicoCompleto, // Indica se precisa atualizar para novos campos
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
      
      // Situações Particulares
      situacoes_particulares,
      
      // =====================================================
      // NOVOS CAMPOS ESTRATÉGICOS (Versão 2.0)
      // =====================================================
      tipo_trabalho,
      foco_trabalho,
      ganhos_prioritarios,
      nivel_herbalife,
      carga_horaria_diaria,
      dias_por_semana,
      meta_3_meses,
      meta_1_ano,
      observacoes_adicionais,
      
      // Dados antigos (compatibilidade)
      tem_lista_contatos,
    } = body

    // Verificar se já existe perfil (edição) ou é novo (onboarding)
    const { data: existingProfile } = await supabaseAdmin
      .from('wellness_noel_profile')
      .select('objetivo_principal, tempo_disponivel, onboarding_completo')
      .eq('user_id', user.id)
      .maybeSingle()

    const isEditing = existingProfile && existingProfile.onboarding_completo

    // Valores válidos para objetivo_principal
    const objetivosValidos = [
      'usar_recomendar',
      'renda_extra',
      'carteira',
      'plano_presidente',
      'fechado',
      'funcional',
      // Valores antigos (compatibilidade)
      'vender_mais',
      'construir_carteira',
      'melhorar_rotina',
      'voltar_ritmo',
      'aprender_divulgar'
    ]

    // Valores válidos para tempo_disponivel
    const temposValidos = [
      '5min',
      '15min',
      '30min',
      '1h',
      '1h_plus',
      // Valores antigos (compatibilidade)
      '15_minutos',
      '30_minutos',
      '1_hora',
      'mais_1_hora'
    ]

    // Validações: apenas para novos perfis (onboarding inicial)
    // Para edições, permitir atualizar campos individualmente
    if (!isEditing) {
      // Novo onboarding: CAMPOS ESTRATÉGICOS SÃO OBRIGATÓRIOS (versão 2.0)
      // Priorizar novos campos estratégicos
      if (!tipo_trabalho || !foco_trabalho || !ganhos_prioritarios || !nivel_herbalife || !carga_horaria_diaria || !dias_por_semana || !meta_financeira) {
        return NextResponse.json(
          { 
            error: 'Campos obrigatórios faltando',
            required: ['tipo_trabalho', 'foco_trabalho', 'ganhos_prioritarios', 'nivel_herbalife', 'carga_horaria_diaria', 'dias_por_semana', 'meta_financeira'],
            message: 'Por favor, preencha todos os campos obrigatórios do perfil estratégico.'
          },
          { status: 400 }
        )
      }

      // Validar valor de objetivo_principal
      if (objetivo_principal && !objetivosValidos.includes(objetivo_principal)) {
        console.error('❌ Valor inválido de objetivo_principal:', objetivo_principal)
        return NextResponse.json(
          { 
            error: 'Valor inválido para objetivo principal',
            message: `O valor "${objetivo_principal}" não é válido. Valores permitidos: ${objetivosValidos.join(', ')}`,
            received: objetivo_principal,
            valid: objetivosValidos
          },
          { status: 400 }
        )
      }

      // Validar valor de tempo_disponivel
      if (tempo_disponivel && !temposValidos.includes(tempo_disponivel)) {
        console.error('❌ Valor inválido de tempo_disponivel:', tempo_disponivel)
        return NextResponse.json(
          { 
            error: 'Valor inválido para tempo disponível',
            message: `O valor "${tempo_disponivel}" não é válido. Valores permitidos: ${temposValidos.join(', ')}`,
            received: tempo_disponivel,
            valid: temposValidos
          },
          { status: 400 }
        )
      }
    } else {
      // Edição: usar valores existentes se não fornecidos (mas não obrigar)
      // Permitir que o usuário edite apenas os campos que quiser
      if (!objetivo_principal && existingProfile?.objetivo_principal) {
        objetivo_principal = existingProfile.objetivo_principal
      }
      if (!tempo_disponivel && existingProfile?.tempo_disponivel) {
        tempo_disponivel = existingProfile.tempo_disponivel
      }

      // Validar valores fornecidos na edição (se houver)
      if (objetivo_principal && !objetivosValidos.includes(objetivo_principal)) {
        console.error('❌ Valor inválido de objetivo_principal na edição:', objetivo_principal)
        return NextResponse.json(
          { 
            error: 'Valor inválido para objetivo principal',
            message: `O valor "${objetivo_principal}" não é válido. Valores permitidos: ${objetivosValidos.join(', ')}`,
            received: objetivo_principal,
            valid: objetivosValidos
          },
          { status: 400 }
        )
      }

      if (tempo_disponivel && !temposValidos.includes(tempo_disponivel)) {
        console.error('❌ Valor inválido de tempo_disponivel na edição:', tempo_disponivel)
        return NextResponse.json(
          { 
            error: 'Valor inválido para tempo disponível',
            message: `O valor "${tempo_disponivel}" não é válido. Valores permitidos: ${temposValidos.join(', ')}`,
            received: tempo_disponivel,
            valid: temposValidos
          },
          { status: 400 }
        )
      }
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
      updated_at: new Date().toISOString(),
    }

    // Apenas atualizar campos que foram fornecidos (ou obrigatórios)
    if (objetivo_principal !== undefined && objetivo_principal !== null && objetivo_principal !== '') {
      // Log para debug
      console.log('📝 Salvando objetivo_principal:', objetivo_principal, 'Tipo:', typeof objetivo_principal)
      console.log('📝 Valores válidos:', objetivosValidos)
      console.log('📝 É válido?', objetivosValidos.includes(objetivo_principal))
      
      profileData.objetivo_principal = objetivo_principal
    }
    if (tempo_disponivel !== undefined && tempo_disponivel !== null && tempo_disponivel !== '') {
      profileData.tempo_disponivel = tempo_disponivel
    }

    // Verificar se tem todos os campos estratégicos obrigatórios
    const temCamposEstrategicosCompletos = 
      tipo_trabalho && 
      foco_trabalho && 
      ganhos_prioritarios && 
      nivel_herbalife && 
      carga_horaria_diaria && 
      dias_por_semana && 
      meta_financeira

    // Marcar como completo APENAS se tiver todos os novos campos estratégicos
    if (!isEditing && temCamposEstrategicosCompletos) {
      profileData.onboarding_completo = true
      profileData.onboarding_completado_at = new Date().toISOString()
    } else if (isEditing && temCamposEstrategicosCompletos) {
      // Se está editando e agora tem todos os campos, marcar como completo
      profileData.onboarding_completo = true
      if (!existingProfile?.onboarding_completado_at) {
        profileData.onboarding_completado_at = new Date().toISOString()
      }
    }

    // Adicionar campos opcionais se fornecidos (não enviar undefined/null)
    if (idade !== undefined && idade !== null && idade !== '') profileData.idade = idade
    if (cidade !== undefined && cidade !== null && cidade !== '') profileData.cidade = cidade
    if (experienciaFinal !== undefined && experienciaFinal !== null && experienciaFinal !== '') {
      profileData.experiencia_herbalife = experienciaFinal
    }
    if (canalFinal !== undefined && canalFinal !== null && canalFinal !== '') {
      profileData.canal_principal = canalFinal
    }
    // prepara_bebidas pode ser boolean, então incluir mesmo se for false
    if (prepara_bebidas !== undefined && prepara_bebidas !== null) {
      profileData.prepara_bebidas = prepara_bebidas
    }
    if (trabalha_com !== undefined && trabalha_com !== null && trabalha_com !== '') {
      profileData.trabalha_com = trabalha_com
    }
    if (estoque_atual !== undefined && estoque_atual !== null) profileData.estoque_atual = estoque_atual
    if (meta_pv !== undefined && meta_pv !== null && meta_pv !== '') profileData.meta_pv = meta_pv
    if (meta_financeira !== undefined && meta_financeira !== null && meta_financeira !== '') {
      profileData.meta_financeira = meta_financeira
    }
    if (contatos_whatsapp !== undefined && contatos_whatsapp !== null && contatos_whatsapp !== '') {
      profileData.contatos_whatsapp = contatos_whatsapp
    }
    if (seguidores_instagram !== undefined && seguidores_instagram !== null && seguidores_instagram !== '') {
      profileData.seguidores_instagram = seguidores_instagram
    }
    if (abertura_recrutar !== undefined && abertura_recrutar !== null && abertura_recrutar !== '') {
      profileData.abertura_recrutar = abertura_recrutar
    }
    if (publico_preferido !== undefined && publico_preferido !== null) {
      profileData.publico_preferido = publico_preferido
    }
    if (tom !== undefined && tom !== null && tom !== '') profileData.tom = tom
    if (ritmo !== undefined && ritmo !== null && ritmo !== '') profileData.ritmo = ritmo
    // lembretes pode ser boolean, então incluir mesmo se for false
    if (lembretes !== undefined && lembretes !== null) {
      profileData.lembretes = lembretes
    }
    if (situacoes_particulares !== undefined && situacoes_particulares !== null && situacoes_particulares.trim() !== '') {
      // Limitar a 500 caracteres
      profileData.situacoes_particulares = situacoes_particulares.trim().substring(0, 500)
    }
    
    // =====================================================
    // NOVOS CAMPOS ESTRATÉGICOS (Versão 2.0)
    // =====================================================
    if (tipo_trabalho !== undefined && tipo_trabalho !== null && tipo_trabalho !== '') {
      profileData.tipo_trabalho = tipo_trabalho
    }
    if (foco_trabalho !== undefined && foco_trabalho !== null && foco_trabalho !== '') {
      profileData.foco_trabalho = foco_trabalho
    }
    if (ganhos_prioritarios !== undefined && ganhos_prioritarios !== null && ganhos_prioritarios !== '') {
      profileData.ganhos_prioritarios = ganhos_prioritarios
    }
    if (nivel_herbalife !== undefined && nivel_herbalife !== null && nivel_herbalife !== '') {
      profileData.nivel_herbalife = nivel_herbalife
    }
    if (carga_horaria_diaria !== undefined && carga_horaria_diaria !== null && carga_horaria_diaria !== '') {
      profileData.carga_horaria_diaria = carga_horaria_diaria
    }
    if (dias_por_semana !== undefined && dias_por_semana !== null && dias_por_semana !== '') {
      profileData.dias_por_semana = dias_por_semana
    }
    if (meta_3_meses !== undefined && meta_3_meses !== null && meta_3_meses.trim() !== '') {
      profileData.meta_3_meses = meta_3_meses.trim()
    }
    if (meta_1_ano !== undefined && meta_1_ano !== null && meta_1_ano.trim() !== '') {
      profileData.meta_1_ano = meta_1_ano.trim()
    }
    if (observacoes_adicionais !== undefined && observacoes_adicionais !== null && observacoes_adicionais.trim() !== '') {
      // Limitar a 500 caracteres
      profileData.observacoes_adicionais = observacoes_adicionais.trim().substring(0, 500)
    }
    
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

    // Limpar campos undefined/null/vazios antes de salvar
    const cleanedProfileData: any = {
      user_id: user.id,
      updated_at: new Date().toISOString(),
    }

    // Adicionar apenas campos válidos
    Object.keys(profileData).forEach(key => {
      if (key === 'user_id' || key === 'updated_at') return
      
      const value = profileData[key]
      // Incluir apenas se tiver valor válido
      // IMPORTANTE: Para campos booleanos, incluir mesmo se for false
      if (value !== undefined && value !== null) {
        // Campos booleanos: incluir mesmo se for false
        if (typeof value === 'boolean') {
          cleanedProfileData[key] = value
        }
        // Strings: incluir apenas se não estiver vazio
        else if (typeof value === 'string' && value !== '') {
          cleanedProfileData[key] = value
        }
        // Números: incluir se for válido
        else if (typeof value === 'number' && !isNaN(value)) {
          cleanedProfileData[key] = value
        }
        // Arrays: incluir mesmo se vazio (o banco pode ter default)
        else if (Array.isArray(value)) {
          cleanedProfileData[key] = value
        }
        // Outros tipos: incluir se não for undefined/null
        else if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean' && !Array.isArray(value)) {
          cleanedProfileData[key] = value
        }
      }
    })

    // Logs detalhados para debug
    console.log('💾 ==========================================')
    console.log('💾 SALVANDO PERFIL NOEL')
    console.log('💾 ==========================================')
    console.log('💾 User ID:', user.id)
    console.log('💾 Modo:', isEditing ? 'EDIÇÃO' : 'NOVO ONBOARDING')
    console.log('💾 Dados recebidos (raw):', JSON.stringify(body, null, 2))
    console.log('💾 Dados limpos (para salvar):', JSON.stringify(cleanedProfileData, null, 2))
    
    // Validar que temos pelo menos algum dado para salvar (além de user_id e updated_at)
    const camposParaSalvar = Object.keys(cleanedProfileData).filter(key => key !== 'user_id' && key !== 'updated_at')
    console.log('💾 Campos para salvar:', camposParaSalvar)
    console.log('💾 ==========================================')
    
    // Na edição, permitir salvar mesmo com poucos campos (apenas updated_at é válido)
    // Apenas para novos perfis, exigir pelo menos um campo
    if (camposParaSalvar.length === 0 && !isEditing) {
      return NextResponse.json(
        { 
          error: 'Nenhum dado para salvar',
          message: 'Por favor, preencha pelo menos um campo antes de salvar.'
        },
        { status: 400 }
      )
    }
    
    // Na edição, se não houver campos além de user_id/updated_at, apenas atualizar timestamp
    // (não dar erro, mas também não fazer upsert desnecessário)
    if (camposParaSalvar.length === 0 && isEditing) {
      console.log('⚠️ Edição sem campos novos - apenas atualizando timestamp')
      // Ainda assim, fazer o upsert para atualizar updated_at (pode ser útil para auditoria)
    }

    const { data, error } = await supabaseAdmin
      .from('wellness_noel_profile')
      .upsert(cleanedProfileData, {
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
      console.error('❌ Dados que tentaram ser salvos:', JSON.stringify(cleanedProfileData, null, 2))
      
      // Mensagem de erro mais amigável
      let errorMessage = 'Erro ao salvar perfil'
      if (error.code === '23505') {
        errorMessage = 'Este perfil já existe. Tente atualizar a página (F5).'
      } else if (error.code === '23503') {
        errorMessage = 'Erro de referência. Verifique se o usuário existe.'
      } else if (error.message?.includes('check constraint')) {
        // Extrair nome da constraint e campo
        const constraintMatch = error.message.match(/constraint "([^"]+)"/)
        const fieldMatch = error.message.match(/column "([^"]+)"/)
        
        if (constraintMatch && fieldMatch) {
          const constraintName = constraintMatch[1]
          const fieldName = fieldMatch[1]
          
          if (constraintName.includes('objetivo_principal')) {
            errorMessage = 'O valor selecionado para "Objetivo Principal" não é válido. Por favor, selecione uma opção da lista.'
          } else if (constraintName.includes('tempo_disponivel')) {
            errorMessage = 'O valor selecionado para "Tempo Disponível" não é válido. Por favor, selecione uma opção da lista (5min, 15min, 30min, 1h ou Mais de 1 hora).'
          } else if (constraintName.includes('prepara_bebidas')) {
            errorMessage = 'O valor selecionado para "Prepara Bebidas" não é válido. Por favor, selecione uma opção da lista (Sim, Não, Aprender ou Nunca).'
          } else if (constraintName.includes('ritmo')) {
            errorMessage = 'O valor selecionado para "Ritmo" não é válido. Por favor, selecione uma opção da lista (Lento, Médio ou Rápido).'
          } else if (constraintName.includes('tom')) {
            errorMessage = 'O valor selecionado para "Tom" não é válido. Por favor, selecione uma opção da lista (Neutro, Extrovertido, Técnico ou Simples).'
          } else {
            errorMessage = `O valor do campo "${fieldName}" não é válido. Por favor, verifique e tente novamente.`
          }
        } else {
          errorMessage = 'Um dos valores preenchidos não é válido. Por favor, verifique os campos e tente novamente.'
        }
      } else if (error.message?.includes('column') || error.message?.includes('schema')) {
        errorMessage = 'Estamos atualizando o sistema. Por favor, atualize a página (F5) e tente novamente.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: error.message,
          code: error.code,
          hint: error.hint
        },
        { status: 500 }
      )
    }

    console.log('✅ Perfil salvo com sucesso:', data)

    // Se o perfil foi marcado como completo, marcar banner como dismissed automaticamente
    if (data?.onboarding_completo === true) {
      try {
        // Buscar settings existente
        const { data: existingSettings } = await supabaseAdmin
          .from('noel_user_settings')
          .select('preferences')
          .eq('user_id', user.id)
          .maybeSingle()

        const currentPreferences = existingSettings?.preferences || {}

        // Atualizar preferências para marcar banner como dismissed
        const updatedPreferences = {
          ...currentPreferences,
          dismissedProfileBanner: true,
        }

        // Upsert (criar ou atualizar)
        await supabaseAdmin
          .from('noel_user_settings')
          .upsert({
            user_id: user.id,
            preferences: updatedPreferences,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          })

        console.log('✅ Banner de perfil marcado como dismissed automaticamente')
      } catch (bannerError) {
        console.warn('⚠️ Aviso: Erro ao marcar banner como dismissed (não crítico):', bannerError)
        // Não falhar o request se isso der erro, apenas logar
      }
    }

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

    // ============================================
    // CRIAR METAS AUTOMATICAMENTE
    // ============================================
    try {
      await criarMetasAutomaticas(user.id, {
        meta_pv: profileData.meta_pv,
        objetivo_principal: objetivo_principal,
        experiencia_herbalife: experienciaFinal,
        profile_type: profile_type
      })
    } catch (metasError) {
      console.warn('⚠️ Aviso: Erro ao criar metas automaticamente (não crítico):', metasError)
      // Não falhar o request se isso der erro, apenas logar
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


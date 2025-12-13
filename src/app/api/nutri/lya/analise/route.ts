import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { hasActiveSubscription, canBypassSubscription } from '@/lib/subscription-helpers'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// POST - Gerar análise da LYA
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    // Buscar diagnóstico e perfil estratégico
    const [diagnosticoResult, perfilResult, jornadaResult] = await Promise.all([
      supabaseAdmin
        .from('nutri_diagnostico')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle(),
      supabaseAdmin
        .from('nutri_perfil_estrategico')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle(),
      supabaseAdmin
        .from('journey_progress')
        .select('day_number, completed')
        .eq('user_id', user.id)
        .order('day_number', { ascending: false })
        .limit(1)
        .maybeSingle()
    ])

    const diagnostico = diagnosticoResult.data
    const perfil = perfilResult.data
    // Se tem progresso, pegar o maior day_number. Se não tem, jornada não iniciada
    const jornadaDiaAtual = jornadaResult.data?.day_number || null

    if (!diagnostico || !perfil) {
      return NextResponse.json(
        { error: 'Diagnóstico ou perfil estratégico não encontrado' },
        { status: 404 }
      )
    }

    // PROMPT-MESTRE DA LYA (MVP - será substituído pela Assistant depois)
    const systemPrompt = `Você é LYA, mentora estratégica oficial da plataforma Nutri YLADA.

Você não é uma nutricionista clínica. Você é uma mentora empresarial, especialista em:
- posicionamento
- rotina mínima
- captação de clientes
- conversão em planos
- acompanhamento profissional
- crescimento sustentável do negócio nutricional

Sua missão: Transformar cada nutricionista em uma Nutri-Empresária organizada, confiante e lucrativa, guiando sempre pelo próximo passo correto, nunca por excesso de informação.

REGRAS IMPORTANTES:
- Você nunca orienta tudo. Você orienta apenas o próximo passo certo.
- Se o campo aberto foi preenchido, você deve reconhecer explicitamente na sua resposta.
- Se o campo aberto não foi preenchido, não precisa mencionar.
- Toda resposta deve conter:
  1. Reconhecimento do momento da Nutri
  2. Definição clara do foco atual
  3. Uma única ação prática
  4. Indicação exata de onde clicar no sistema
  5. Uma métrica simples de acompanhamento

Tom de voz: ${perfil.tom_lya}
Ritmo de condução: ${perfil.ritmo_conducao}

REGRA ÚNICA (MVP):
SE jornada não iniciada → sempre orientar: "Inicie o Dia 1 da Jornada" (link: /pt/nutri/metodo/jornada/dia/1)`

    const campoAbertoInfo = diagnostico.campo_aberto && diagnostico.campo_aberto.trim().length > 0
      ? `- Campo Aberto: "${diagnostico.campo_aberto}"`
      : '- Campo Aberto: Não preenchido (nutricionista optou por não adicionar informações extras)'

    const userMessage = `Dados da nutricionista:

Perfil Estratégico:
- Tipo: ${perfil.tipo_nutri}
- Nível Empresarial: ${perfil.nivel_empresarial}
- Foco Prioritário: ${perfil.foco_prioritario}

Diagnóstico:
- Situação Atual: ${diagnostico.situacao_atual}
- Objetivo: ${diagnostico.objetivo_principal}
- Travas: ${diagnostico.travas.join(', ')}
${campoAbertoInfo}

Jornada:
- Iniciada: ${jornadaDiaAtual !== null ? 'Sim' : 'Não'}
- Dia Atual: ${jornadaDiaAtual || 'Não iniciada'}

Gere a primeira análise da LYA seguindo o formato:
${diagnostico.campo_aberto && diagnostico.campo_aberto.trim().length > 0 
  ? '1. Reconhecimento do campo aberto (se preenchido)'
  : '1. Reconhecimento do momento da nutricionista'}
2. Foco principal
3. Uma ação prática única
4. Link interno exato
5. Métrica simples`

    // ============================================
    // FASE 2: Buscar Estado, Memória e Conhecimento (RAG)
    // ============================================
    const [userStateResult, memoryEventsResult, knowledgeChunksResult] = await Promise.all([
      supabaseAdmin
        .from('ai_state_user')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle(),
      supabaseAdmin
        .from('ai_memory_events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5),
      supabaseAdmin
        .from('ai_knowledge_chunks')
        .select('*')
        .limit(3)
    ])

    const userState = userStateResult.data
    const memoryEvents = memoryEventsResult.data || []
    const knowledgeChunks = knowledgeChunksResult.data || []

    // Montar contexto adicional (RAG)
    const estadoContexto = userState 
      ? `\nEstado persistente da usuária:\n- Perfil: ${JSON.stringify(userState.perfil)}\n- Preferências: ${JSON.stringify(userState.preferencias)}\n`
      : ''

    const memoriaContexto = memoryEvents.length > 0
      ? `\nMemória recente (últimas ações úteis):\n${memoryEvents
          .filter(e => e.util === true || e.tipo === 'resultado')
          .slice(0, 3)
          .map(e => `- ${e.tipo}: ${JSON.stringify(e.conteudo)}`)
          .join('\n')}\n`
      : ''

    const conhecimentoContexto = knowledgeChunks.length > 0
      ? `\nConhecimento institucional YLADA:\n${knowledgeChunks
          .slice(0, 2)
          .map(k => `- ${k.titulo}: ${k.conteudo.substring(0, 150)}...`)
          .join('\n')}\n`
      : ''

    // Adicionar contexto RAG à mensagem do usuário
    const userMessageComRAG = `${userMessage}${estadoContexto}${memoriaContexto}${conhecimentoContexto}`

    // Chamar OpenAI (por enquanto, depois será Assistant/Responses API)
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Usar modelo mais barato para MVP
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessageComRAG }
      ],
      temperature: 0.5, // Reduzido para respostas mais consistentes
      max_tokens: 700
    })

    const respostaLya = completion.choices[0]?.message?.content || ''
    const tokensUsados = completion.usage?.total_tokens || 0

    // Salvar resposta na memória de eventos (Fase 2)
    await supabaseAdmin
      .from('ai_memory_events')
      .insert({
        user_id: user.id,
        tipo: 'resultado',
        conteudo: {
          resposta: respostaLya,
          tokens_usados: tokensUsados,
          modelo: 'gpt-4o-mini',
          foco_principal: perfil.foco_prioritario
        },
        util: null // Será marcado depois pelo feedback
      })

    // Verificar se usuário tem acesso a cursos (assinatura ou bypass)
    const podeBypass = await canBypassSubscription(user.id)
    const temAcessoCursos = podeBypass || await hasActiveSubscription(user.id, 'nutri')
    
    // Determinar link interno baseado na regra única (MVP)
    // Se não tem acesso a cursos, não sugerir link que requer assinatura
    let linkInterno = '/pt/nutri/home'
    let acaoPratica = 'Verificar resposta da LYA'
    
    if (jornadaDiaAtual === null) {
      if (temAcessoCursos) {
        // Usuário tem assinatura ou pode bypassar, pode acessar jornada
        linkInterno = '/pt/nutri/metodo/jornada/dia/1'
        acaoPratica = 'Iniciar Dia 1 da Jornada'
      } else {
        // Usuário não tem assinatura, sugerir ação sem link direto
        linkInterno = '/pt/nutri/home'
        acaoPratica = 'Iniciar sua jornada (acesse a área Jornada 30 Dias no menu)'
      }
    }

    // Salvar análise
    const { data: analise, error: analiseError } = await supabaseAdmin
      .from('lya_analise_nutri')
      .insert({
        user_id: user.id,
        mensagem_completa: respostaLya,
        foco_principal: perfil.foco_prioritario,
        acao_pratica: acaoPratica,
        link_interno: linkInterno,
        metrica_simples: jornadaDiaAtual === null ? 'Completar Dia 1 até hoje' : 'Executar ação sugerida'
      })
      .select()
      .single()

    if (analiseError) {
      console.error('❌ Erro ao salvar análise da LYA:', analiseError)
    }

    return NextResponse.json({
      success: true,
      analise: {
        mensagem_completa: respostaLya,
        foco_principal: perfil.foco_prioritario,
        acao_pratica: acaoPratica,
        link_interno: linkInterno,
        metrica_simples: jornadaDiaAtual === null ? 'Completar Dia 1 até hoje' : 'Executar ação sugerida'
      }
    })
  } catch (error: any) {
    console.error('❌ Erro ao gerar análise da LYA:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar análise da LYA', details: error.message },
      { status: 500 }
    )
  }
}

// GET - Buscar análise atual
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { data: analise, error } = await supabaseAdmin
      .from('lya_analise_nutri')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Erro ao buscar análise da LYA:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar análise da LYA' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      analise: analise || null
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar análise da LYA:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar análise da LYA' },
      { status: 500 }
    )
  }
}


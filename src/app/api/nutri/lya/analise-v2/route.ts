import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

/**
 * FASE 2: Handler com RAG + Prompt Object (quando Responses API estiver disponível)
 * 
 * Por enquanto: usa chat completions com RAG
 * Depois: migrar para Responses API com prompt_id
 */

// POST - Gerar análise da LYA com RAG + Prompt Object
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    console.log('🚀 [LYA Fase 2 - v2] Gerando análise com RAG + Prompt Object para user_id:', user.id)

    // ============================================
    // PASSO 1-4: Buscar dados (igual ao analise/route.ts)
    // ============================================
    const [userStateResult, memoryEventsResult, knowledgeChunksResult, diagnosticoResult, perfilResult, jornadaResult] = await Promise.all([
      supabaseAdmin.from('ai_state_user').select('*').eq('user_id', user.id).maybeSingle(),
      supabaseAdmin.from('ai_memory_events').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
      supabaseAdmin.from('ai_knowledge_chunks').select('*').limit(3),
      supabaseAdmin.from('nutri_diagnostico').select('*').eq('user_id', user.id).maybeSingle(),
      supabaseAdmin.from('nutri_perfil_estrategico').select('*').eq('user_id', user.id).maybeSingle(),
      supabaseAdmin.from('journey_progress').select('day_number, completed').eq('user_id', user.id).order('day_number', { ascending: false }).limit(1).maybeSingle()
    ])

    const userState = userStateResult.data
    const memoryEvents = memoryEventsResult.data || []
    const knowledgeChunks = knowledgeChunksResult.data || []
    const diagnostico = diagnosticoResult.data
    const perfil = perfilResult.data
    const jornadaDiaAtual = jornadaResult.data?.day_number || null

    if (!diagnostico || !perfil) {
      return NextResponse.json(
        { error: 'Diagnóstico ou perfil estratégico não encontrado' },
        { status: 404 }
      )
    }

    // ============================================
    // PREPARAR VARIÁVEIS PARA PROMPT OBJECT
    // ============================================
    const variables = {
      diagnostico: JSON.stringify({
        situacao_atual: diagnostico.situacao_atual,
        objetivo_principal: diagnostico.objetivo_principal,
        travas: diagnostico.travas,
        campo_aberto: diagnostico.campo_aberto || 'Não preenchido'
      }),
      perfil: JSON.stringify({
        tipo_nutri: perfil.tipo_nutri,
        nivel_empresarial: perfil.nivel_empresarial,
        foco_prioritario: perfil.foco_prioritario,
        tom_lya: perfil.tom_lya,
        ritmo_conducao: perfil.ritmo_conducao
      }),
      sistema: JSON.stringify({
        jornada_iniciada: jornadaDiaAtual !== null,
        jornada_dia_atual: jornadaDiaAtual || 'Não iniciada'
      }),
      rag: JSON.stringify({
        estado_usuario: userState ? {
          perfil: userState.perfil,
          preferencias: userState.preferencias
        } : null,
        memoria_recente: memoryEvents
          .filter(e => e.util === true || e.tipo === 'resultado')
          .slice(0, 3)
          .map(e => ({ tipo: e.tipo, conteudo: e.conteudo })),
        conhecimento: knowledgeChunks
          .slice(0, 2)
          .map(k => ({ titulo: k.titulo, conteudo: k.conteudo.substring(0, 200) }))
      }),
      task: 'Gere a ANÁLISE DA LYA — HOJE no formato padrão, com 1–3 ações práticas.'
    }

    // ============================================
    // TENTAR USAR RESPONSES API (se disponível e configurado)
    // ============================================
    const promptId = process.env.LYA_PROMPT_ID

    if (promptId && openai.responses) {
      try {
        console.log('🤖 [LYA v2] Tentando usar Responses API com prompt_id:', promptId)

        // TODO: Quando Responses API estiver disponível, descomentar:
        /*
        const response = await openai.responses.create({
          prompt: {
            id: promptId, // Estrutura correta conforme documentação OpenAI
            version: "1", // Versão do prompt (pode ser omitido para usar a mais recente)
            variables
          },
          // conversation: conversationId ? { id: conversationId } : undefined
        })

        const respostaLya = response.output_text || ''
        const tokensUsados = response.usage?.total_tokens || 0

        console.log('✅ [LYA v2] Resposta via Responses API, tokens:', tokensUsados)

        // Salvar na memória
        await supabaseAdmin.from('ai_memory_events').insert({
          user_id: user.id,
          tipo: 'resultado',
          conteudo: {
            resposta: respostaLya,
            tokens_usados: tokensUsados,
            modelo: 'responses-api',
            foco_principal: perfil.foco_prioritario
          },
          util: null
        })

        return NextResponse.json({
          success: true,
          analise: {
            mensagem_completa: respostaLya,
            foco_principal: perfil.foco_prioritario,
            acao_pratica: jornadaDiaAtual === null ? 'Iniciar Dia 1 da Jornada' : 'Verificar resposta da LYA',
            link_interno: jornadaDiaAtual === null ? '/pt/nutri/metodo/jornada/dia/1' : '/pt/nutri/home',
            metrica_simples: jornadaDiaAtual === null ? 'Completar Dia 1 até hoje' : 'Executar ação sugerida'
          },
          metadata: {
            tokens_usados: tokensUsados,
            modelo: 'responses-api',
            prompt_id: promptId,
            memoria_usada: memoryEvents.length,
            conhecimento_usado: knowledgeChunks.length
          }
        })
        */
      } catch (responsesError: any) {
        console.warn('⚠️ [LYA v2] Responses API não disponível, usando fallback:', responsesError.message)
        // Continuar com fallback abaixo
      }
    }

    // ============================================
    // FALLBACK: Chat Completions (atual)
    // ============================================
    console.log('🔄 [LYA v2] Usando fallback: Chat Completions')

    // Montar mensagem com variáveis (simulando Prompt Object)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ylada.app'
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
- Use a memória recente e conhecimento institucional quando relevante.
- Toda resposta deve seguir o formato fixo abaixo.

Tom de voz: ${perfil.tom_lya}
Ritmo de condução: ${perfil.ritmo_conducao}

## DETECÇÃO DE DIFICULDADES E SUPORTE

⚠️ REGRA CRÍTICA: Quando a nutricionista pedir ajuda e você perceber que ela está com dificuldade (emocional ou de trabalho), você DEVE:

1. Dar a resposta completa e útil
2. SEMPRE terminar com uma pergunta oferecendo mais suporte/ajuda

Sinais de dificuldade: frustração, desânimo, insegurança, confusão sobre processos, sobrecarga de trabalho, dúvidas recorrentes, sentimento de estar perdida ou atrasada.

Exemplos de perguntas finais de suporte:
- "O que mais está te travando agora? Posso ajudar com isso também."
- "Tem mais alguma coisa que está te deixando confusa? Estou aqui para ajudar."
- "Além disso, tem algo mais que você gostaria de esclarecer?"

## LINKS CLICÁVEIS (OBRIGATÓRIO)

⚠️ REGRA CRÍTICA: Quando a nutricionista fizer perguntas técnicas sobre onde encontrar algo ou como acessar páginas, você DEVE:

1. Fornecer o link clicável completo da página
2. Formatar o link em Markdown: [texto do link](URL)
3. Sempre incluir o domínio completo

Links comuns:
- Formulários: [Acesse seus formulários](${baseUrl}/pt/nutri/formularios)
- Jornada Dia X: [Acesse o Dia X](${baseUrl}/pt/nutri/metodo/jornada/dia/X)
- Home: [Voltar para home](${baseUrl}/pt/nutri/home)
- Clientes: [Ver clientes](${baseUrl}/pt/nutri/clientes)
- Leads: [Ver leads](${baseUrl}/pt/nutri/leads)

IMPORTANTE: NUNCA forneça apenas caminho relativo. SEMPRE forneça link completo e clicável em Markdown.

FORMATO FIXO DE RESPOSTA (OBRIGATÓRIO):
ANÁLISE DA LYA — HOJE

1) FOCO PRIORITÁRIO
(frase única, objetiva, estratégica)

2) AÇÃO RECOMENDADA
(checklist de 1 a 3 ações no máximo)

3) ONDE APLICAR
(módulo, fluxo, link ou sistema interno - SEMPRE com link clicável completo em Markdown)

4) MÉTRICA DE SUCESSO
(como validar em 24–72h)

REGRA ÚNICA (MVP):
SE jornada não iniciada → sempre orientar: "Inicie o Dia 1 da Jornada" (link: [Acesse o Dia 1](${baseUrl}/pt/nutri/metodo/jornada/dia/1))`

    const userMessage = `Dados da nutricionista:

${variables.diagnostico}
${variables.perfil}
${variables.sistema}
${variables.rag}

${variables.task}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.5,
      max_tokens: 700
    })

    const respostaLya = completion.choices[0]?.message?.content || ''
    const tokensUsados = completion.usage?.total_tokens || 0

    console.log('✅ [LYA v2] Resposta gerada via Chat Completions, tokens:', tokensUsados)

    // Salvar na memória
    await supabaseAdmin.from('ai_memory_events').insert({
      user_id: user.id,
      tipo: 'resultado',
      conteudo: {
        resposta: respostaLya,
        tokens_usados: tokensUsados,
        modelo: 'gpt-4o-mini',
        foco_principal: perfil.foco_prioritario,
        prompt_id: promptId || 'fallback'
      },
      util: null
    })

    // Salvar também na tabela lya_analise_nutri (compatibilidade)
    const linkInterno = jornadaDiaAtual === null 
      ? '/pt/nutri/metodo/jornada/dia/1' 
      : '/pt/nutri/home'

    await supabaseAdmin.from('lya_analise_nutri').insert({
      user_id: user.id,
      mensagem_completa: respostaLya,
      foco_principal: perfil.foco_prioritario,
      acao_pratica: jornadaDiaAtual === null ? 'Iniciar Dia 1 da Jornada' : 'Verificar resposta da LYA',
      link_interno: linkInterno,
      metrica_simples: jornadaDiaAtual === null ? 'Completar Dia 1 até hoje' : 'Executar ação sugerida'
    })

    return NextResponse.json({
      success: true,
      analise: {
        mensagem_completa: respostaLya,
        foco_principal: perfil.foco_prioritario,
        acao_pratica: jornadaDiaAtual === null ? 'Iniciar Dia 1 da Jornada' : 'Verificar resposta da LYA',
        link_interno: linkInterno,
        metrica_simples: jornadaDiaAtual === null ? 'Completar Dia 1 até hoje' : 'Executar ação sugerida'
      },
      metadata: {
        tokens_usados: tokensUsados,
        modelo: 'gpt-4o-mini',
        prompt_id: promptId || 'fallback',
        memoria_usada: memoryEvents.length,
        conhecimento_usado: knowledgeChunks.length,
        usando_responses_api: false
      }
    })
  } catch (error: any) {
    console.error('❌ [LYA v2] Erro ao gerar análise:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar análise da LYA', details: error.message },
      { status: 500 }
    )
  }
}

// GET - Buscar análise atual (compatibilidade)
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

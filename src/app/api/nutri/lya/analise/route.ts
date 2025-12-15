import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { hasActiveSubscription, canBypassSubscription } from '@/lib/subscription-helpers'
import { parseLyaResponse, getFallbackLyaResponse } from '@/lib/nutri/parse-lya-response'
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

    // ============================================
    // REGRAS DISCIPLINARES PARA DIAS 1-3
    // ============================================
    const estaNosPrimeiros3Dias = jornadaDiaAtual !== null && jornadaDiaAtual >= 1 && jornadaDiaAtual <= 3
    
    // Mensagens padrão por dia (para usar quando necessário)
    const mensagensPadraoPorDia: Record<number, { foco: string; acoes: string[]; onde: string; metrica: string }> = {
      1: {
        foco: "Hoje não é sobre fazer tudo. Hoje é sobre começar do jeito certo.",
        acoes: [
          "Executar o Dia 1 da Jornada com atenção e sem pular etapas",
          "Completar a tarefa principal do Dia 1"
        ],
        onde: "Jornada 30 Dias → Dia 1",
        metrica: "Dia 1 concluído até hoje. Isso já te coloca à frente da maioria das nutricionistas."
      },
      2: {
        foco: "Você está no Dia 2, e isso já diz muito sobre você. A maioria começa empolgada e para.",
        acoes: [
          "Executar o Dia 2 da Jornada com consistência",
          "Focar em consistência, não perfeição"
        ],
        onde: "Jornada 30 Dias → Dia 2",
        metrica: "Dia 2 concluído. Você está construindo algo diferente."
      },
      3: {
        foco: "A partir do Dia 3, algo muda. Você começa a sair do modo sobrevivência e entra no modo construção profissional.",
        acoes: [
          "Continuar seguindo a Jornada",
          "Respeitar as etapas sem pular"
        ],
        onde: "Jornada 30 Dias → Dia 3",
        metrica: "Dia 3 concluído. Os resultados não vêm de pular etapas — vêm de respeitá-las."
      }
    }

    // Construir regras disciplinares baseadas no dia atual
    let regrasDisciplinares = ''
    let mensagemInicial = ''
    
    if (jornadaDiaAtual === null) {
      // Jornada não iniciada
      regrasDisciplinares = `
REGRA CRÍTICA - JORNADA NÃO INICIADA:
- Você DEVE sempre orientar: "Inicie o Dia 1 da Jornada"
- Não sugira outras ações até que o Dia 1 seja completado
- Seja direto e claro: o único foco agora é iniciar o Dia 1`
      mensagemInicial = 'A nutricionista ainda não iniciou a Jornada. Seu único objetivo é conduzi-la para o Dia 1.'
    } else if (estaNosPrimeiros3Dias) {
      // Dias 1-3: disciplina máxima
      const diaInfo = mensagensPadraoPorDia[jornadaDiaAtual]
      regrasDisciplinares = `
REGRA CRÍTICA - DIAS 1-3 (DISCIPLINA MÁXIMA):
Você está no Dia ${jornadaDiaAtual} da Jornada. Isso significa disciplina total.

COMPORTAMENTO OBRIGATÓRIO:
- Se a pergunta NÃO está relacionada ao Dia ${jornadaDiaAtual} atual → você DEVE redirecionar para a Jornada
- Se a pergunta é sobre temas avançados (GSAL completo, estratégias complexas, etc.) → você DEVE dizer: "Isso vamos tratar no momento certo. Agora, foque no Dia ${jornadaDiaAtual}."
- Se a pergunta tenta pular etapas → você DEVE dizer: "Confie no processo. Volte para o Dia ${jornadaDiaAtual} e execute exatamente o que está proposto."

TOM ESPECÍFICO DO DIA ${jornadaDiaAtual}:
${jornadaDiaAtual === 1 ? '- Direção + Segurança: "Hoje não é sobre fazer tudo. Hoje é sobre começar do jeito certo."' : ''}
${jornadaDiaAtual === 2 ? '- Consistência + Validação: "Você está construindo algo diferente. Hoje, seu foco é consistência, não perfeição."' : ''}
${jornadaDiaAtual === 3 ? '- Autoridade + Visão: "Menos ansiedade. Mais direção. Continue seguindo a Jornada."' : ''}

FRASE-CHAVE QUE DEVE SE REPETIR:
"Menos ansiedade. Mais direção."

FUNÇÃO DA LYA NESSE INÍCIO:
Conduzir, não agradar. Sua função é criar disciplina, autoridade e resultado real.`
      mensagemInicial = `A nutricionista está no Dia ${jornadaDiaAtual}. Você deve manter disciplina total e redirecionar qualquer pergunta fora do foco para a Jornada.`
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
- Toda resposta DEVE seguir EXATAMENTE o formato fixo abaixo (sem exceção).

${regrasDisciplinares}

Tom de voz: ${perfil.tom_lya}
Ritmo de condução: ${perfil.ritmo_conducao}

FORMATO FIXO DE RESPOSTA (OBRIGATÓRIO - SEM EXCEÇÃO):

ANÁLISE DA LYA — HOJE

1) FOCO PRIORITÁRIO
[Uma única frase objetiva e estratégica. Exemplo: "Iniciar sua organização profissional com método."]

2) AÇÃO RECOMENDADA
[Checklist de 1 a 3 ações no máximo. Cada ação em uma linha, começando com ☐. Exemplo:
☐ Iniciar o Dia 1 da Jornada
☐ Completar a tarefa principal do Dia 1]

3) ONDE APLICAR
[Nome do módulo, área ou fluxo. Exemplo: "Jornada 30 Dias → Dia 1" ou "Ferramentas → Criar Quiz"]

4) MÉTRICA DE SUCESSO
[Como validar em 24-72h. Exemplo: "Dia 1 concluído até hoje." ou "Quiz criado e publicado até hoje."]

IMPORTANTE:
- Use APENAS este formato. Não adicione texto antes ou depois.
- Não use markdown para links. Apenas texto natural.
- Não use emojis nos blocos (exceto ☐ para checklist).
- Seja direto e objetivo. Sem parágrafos longos.`

    const campoAbertoInfo = diagnostico.campo_aberto && diagnostico.campo_aberto.trim().length > 0
      ? `- Campo Aberto: "${diagnostico.campo_aberto}"`
      : '- Campo Aberto: Não preenchido (nutricionista optou por não adicionar informações extras)'

    const userMessage = `${mensagemInicial ? mensagemInicial + '\n\n' : ''}Dados da nutricionista:

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
${estaNosPrimeiros3Dias ? `\n⚠️ ATENÇÃO: Você está nos primeiros 3 dias (Dia ${jornadaDiaAtual}). Mantenha disciplina total e redirecione qualquer pergunta fora do foco para a Jornada.` : ''}

Gere a análise da LYA seguindo EXATAMENTE o formato fixo de 4 blocos definido acima.

${estaNosPrimeiros3Dias ? `\nIMPORTANTE - DISCIPLINA DIAS 1-3:\nSe a análise tentar sugerir ações fora do Dia ${jornadaDiaAtual}, você DEVE usar a mensagem padrão do Dia ${jornadaDiaAtual}:\n${JSON.stringify(mensagensPadraoPorDia[jornadaDiaAtual], null, 2)}` : ''}

IMPORTANTE: Sua resposta deve começar com "ANÁLISE DA LYA — HOJE" e seguir os 4 blocos na ordem exata:
1) FOCO PRIORITÁRIO
2) AÇÃO RECOMENDADA
3) ONDE APLICAR
4) MÉTRICA DE SUCESSO

Não adicione texto antes ou depois desses blocos.`

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

    // Parsear resposta para extrair os 4 blocos
    const parsed = parseLyaResponse(respostaLya)
    
    // Log de validação
    if (!parsed.isValid) {
      console.warn('⚠️ [LYA] Resposta não seguiu formato fixo completamente')
      console.warn('📝 Resposta recebida:', respostaLya.substring(0, 500))
      console.warn('🔍 Blocos extraídos:', {
        foco: !!parsed.foco_prioritario,
        acoes: parsed.acoes_recomendadas.length,
        onde: !!parsed.onde_aplicar,
        metrica: !!parsed.metrica_sucesso
      })
    } else {
      console.log('✅ [LYA] Resposta parseada com sucesso')
    }
    
    // Preencher campos faltantes com fallback inteligente
    if (!parsed.foco_prioritario || parsed.acoes_recomendadas.length === 0) {
      console.warn('🔄 [LYA] Usando fallback completo')
      const fallback = getFallbackLyaResponse()
      Object.assign(parsed, fallback)
    } else {
      // Preencher apenas campos faltantes
      if (!parsed.onde_aplicar) {
        parsed.onde_aplicar = 'Jornada 30 Dias → Dia 1'
        console.log('🔧 [LYA] Preenchendo "onde_aplicar" com fallback')
      }
      if (!parsed.metrica_sucesso) {
        parsed.metrica_sucesso = 'Dia 1 concluído até hoje.'
        console.log('🔧 [LYA] Preenchendo "metrica_sucesso" com fallback')
      }
    }

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
          foco_principal: parsed.foco_prioritario,
          parsed: parsed.isValid
        },
        util: null // Será marcado depois pelo feedback
      })

    // Verificar se usuário tem acesso a cursos (assinatura ou bypass)
    const podeBypass = await canBypassSubscription(user.id)
    const temAcessoCursos = podeBypass || await hasActiveSubscription(user.id, 'nutri')
    
    // Determinar link interno baseado na regra única (MVP)
    // Se não tem acesso a cursos, não sugerir link que requer assinatura
    let linkInterno = '/pt/nutri/home'
    
    if (jornadaDiaAtual === null) {
      if (temAcessoCursos) {
        // Usuário tem assinatura ou pode bypassar, pode acessar jornada
        linkInterno = '/pt/nutri/metodo/jornada/dia/1'
      } else {
        // Usuário não tem assinatura, sugerir ação sem link direto
        linkInterno = '/pt/nutri/home'
      }
    } else if (estaNosPrimeiros3Dias && temAcessoCursos) {
      // Se está nos primeiros 3 dias, sempre redirecionar para o dia atual
      linkInterno = `/pt/nutri/metodo/jornada/dia/${jornadaDiaAtual}`
    }

    // Salvar análise (formato novo)
    const { data: analise, error: analiseError } = await supabaseAdmin
      .from('lya_analise_nutri')
      .insert({
        user_id: user.id,
        mensagem_completa: respostaLya,
        foco_prioritario: parsed.foco_prioritario,
        acoes_recomendadas: parsed.acoes_recomendadas,
        onde_aplicar: parsed.onde_aplicar,
        metrica_sucesso: parsed.metrica_sucesso,
        link_interno: linkInterno
      })
      .select()
      .single()

    if (analiseError) {
      console.error('❌ Erro ao salvar análise da LYA:', analiseError)
    }

    return NextResponse.json({
      success: true,
      analise: {
        foco_prioritario: parsed.foco_prioritario,
        acoes_recomendadas: parsed.acoes_recomendadas,
        onde_aplicar: parsed.onde_aplicar,
        metrica_sucesso: parsed.metrica_sucesso,
        link_interno: linkInterno,
        mensagem_completa: respostaLya
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

    // Se a análise antiga não tem formato novo, tentar converter ou forçar nova geração
    if (analise && !analise.foco_prioritario && analise.mensagem_completa) {
      console.log('🔄 [LYA GET] Análise antiga encontrada, tentando converter...')
      const parsed = parseLyaResponse(analise.mensagem_completa)
      if (parsed.isValid) {
        console.log('✅ [LYA GET] Conversão bem-sucedida')
        return NextResponse.json({
          analise: {
            foco_prioritario: parsed.foco_prioritario,
            acoes_recomendadas: parsed.acoes_recomendadas,
            onde_aplicar: parsed.onde_aplicar,
            metrica_sucesso: parsed.metrica_sucesso,
            link_interno: analise.link_interno || '/pt/nutri/home',
            mensagem_completa: analise.mensagem_completa,
            created_at: analise.created_at
          }
        })
      } else {
        console.warn('⚠️ [LYA GET] Não foi possível converter análise antiga, retornando null para forçar nova geração')
        // Retornar null para forçar componente a gerar nova análise
        return NextResponse.json({
          analise: null
        })
      }
    }

    // Se tem análise no formato novo, retornar
    if (analise && analise.foco_prioritario) {
      return NextResponse.json({
        analise: {
          foco_prioritario: analise.foco_prioritario,
          acoes_recomendadas: analise.acoes_recomendadas || [],
          onde_aplicar: analise.onde_aplicar || '',
          metrica_sucesso: analise.metrica_sucesso || '',
          link_interno: analise.link_interno || '/pt/nutri/home',
          mensagem_completa: analise.mensagem_completa,
          created_at: analise.created_at
        }
      })
    }

    // Se não tem análise, retornar null
    return NextResponse.json({
      analise: null
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar análise da LYA:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar análise da LYA' },
      { status: 500 }
    )
  }
}


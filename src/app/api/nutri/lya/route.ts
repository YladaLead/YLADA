/**
 * LYA NUTRI - API Principal
 * 
 * Endpoint: POST /api/nutri/lya
 * 
 * Processa mensagens do usuário e retorna resposta da LYA
 * 
 * PRIORIDADE DE USO:
 * 1. Responses API com Prompt Object (LYA_PROMPT_ID) - Sistema novo recomendado
 * 2. Assistants API (OPENAI_ASSISTANT_LYA_ID) - Sistema antigo (deprecado em 2026)
 * 3. Chat Completions (fallback) - Se nenhum dos dois estiver configurado
 * 
 * Baseado no DOSSIÊ LYA v1.0 como fonte única de verdade
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { processMessageWithLya } from '@/lib/lya-assistant-handler'
import type { NutriProfile, NutriState, LyaFlow, LyaCycle } from '@/types/nutri-lya'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface LyaRequest {
  message: string
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
  userId?: string
  threadId?: string
}

interface LyaResponse {
  response: string
  profile_detected?: NutriProfile
  state_detected?: NutriState
  flow_used?: LyaFlow
  cycle_used?: LyaCycle
  threadId?: string
  functionCalls?: Array<{ name: string; arguments: any; result: any }>
  modelUsed?: string
}

/**
 * POST /api/nutri/lya
 */
export async function POST(request: NextRequest) {
  console.log('🚀 [LYA] ==========================================')
  console.log('🚀 [LYA] ENDPOINT /api/nutri/lya CHAMADO')
  console.log('🚀 [LYA] ==========================================')
  console.log('🕐 [LYA] Timestamp:', new Date().toISOString())
  
  try {
    // Autenticação
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      console.log('❌ [LYA] Autenticação falhou')
      return authResult
    }
    const { user } = authResult
    console.log('✅ [LYA] Autenticação OK - User ID:', user.id)

    const body: LyaRequest = await request.json()
    const { message, conversationHistory = [], threadId } = body

    console.log('📥 [LYA] Body recebido:', {
      messageLength: message?.length || 0,
      hasThreadId: !!threadId,
      historyLength: conversationHistory?.length || 0
    })

    if (!message || message.trim().length === 0) {
      console.log('❌ [LYA] Mensagem vazia')
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    // ============================================
    // VERIFICAÇÃO DISCIPLINAR PARA DIAS 1-3
    // ============================================
    const jornadaResult = await supabaseAdmin
      .from('journey_progress')
      .select('day_number, completed')
      .eq('user_id', user.id)
      .order('day_number', { ascending: false })
      .limit(1)
      .maybeSingle()
    
    const jornadaDiaAtual = jornadaResult.data?.day_number || null
    const estaNosPrimeiros3Dias = jornadaDiaAtual !== null && jornadaDiaAtual >= 1 && jornadaDiaAtual <= 3
    
    // Palavras-chave que indicam tentativa de pular etapas ou temas avançados
    const palavrasChaveAvancadas = [
      'gsal completo', 'gestão completa', 'pipeline completo',
      'estratégia avançada', 'técnica avançada', 'método avançado',
      'pular', 'adiantar', 'avançar', 'pular etapas',
      'dia 4', 'dia 5', 'dia 6', 'dia 7', 'dia 8', 'dia 9', 'dia 10',
      'semana 2', 'semana 3', 'semana 4'
    ]
    
    const mensagemLower = message.toLowerCase()
    const tentandoPularEtapas = palavrasChaveAvancadas.some(palavra => mensagemLower.includes(palavra))
    
    // Se está nos primeiros 3 dias e tentando pular etapas, aplicar disciplina
    if (estaNosPrimeiros3Dias && tentandoPularEtapas) {
      console.log(`🔒 [LYA] Disciplina aplicada - Dia ${jornadaDiaAtual}, tentativa de pular etapas detectada`)
      
      const respostasDisciplinadas: Record<number, string> = {
        1: `Eu sei que isso parece importante, mas não é o foco agora.

Hoje não é sobre fazer tudo. Hoje é sobre começar do jeito certo.

Você está no Dia 1 da sua Jornada YLADA.
Seu único objetivo agora é executar o Dia 1 com atenção e sem pular etapas.

Confie no processo.
Volte para o Dia 1 e execute exatamente o que está proposto.

Se você fizer isso hoje, você já estará à frente da maioria das nutricionistas.`,
        2: `Esse tema vai ser muito melhor aproveitado mais adiante.

Você está no Dia 2, e isso já diz muito sobre você.
A maioria começa empolgada e para.
Você está construindo algo diferente.

Hoje, seu foco é consistência, não perfeição.
Faça o que está proposto no Dia 2 e siga em frente.

Agora, seu crescimento vem da sequência, não da antecipação.`,
        3: `A partir do Dia 3, algo muda.

Você começa a sair do modo sobrevivência
e entra no modo construção profissional.

Continue seguindo a Jornada.
Os resultados não vêm de pular etapas — vêm de respeitá-las.

Menos ansiedade. Mais direção.

Foque no Dia 3. O resto vem no momento certo.`
      }
      
      return NextResponse.json({
        response: respostasDisciplinadas[jornadaDiaAtual] || respostasDisciplinadas[1],
        threadId: threadId || 'disciplined',
        modelUsed: 'gpt-4-disciplined',
        disciplined: true
      })
    }

    // ============================================
    // PRIORIDADE 1: Verificar se é Prompt Object (Responses API) ou Assistant (Assistants API)
    // ============================================
    const promptId = process.env.LYA_PROMPT_ID // Prompt Object (pmpt_...)
    const assistantId = process.env.OPENAI_ASSISTANT_LYA_ID || process.env.OPENAI_ASSISTANT_ID // Assistant (asst_...)
    
    console.log('🔍 [LYA] Verificando configuração...')
    console.log('🔍 [LYA] LYA_PROMPT_ID (Responses API):', promptId ? '✅ Configurado' : '❌ NÃO CONFIGURADO')
    console.log('🔍 [LYA] OPENAI_ASSISTANT_LYA_ID (Assistants API):', assistantId ? '✅ Configurado' : '❌ NÃO CONFIGURADO')
    console.log('🔍 [LYA] OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ Configurado' : '❌ NÃO CONFIGURADO')
    
    // PRIORIDADE: Se tem LYA_PROMPT_ID, usar Responses API (sistema novo)
    if (promptId && promptId.startsWith('pmpt_')) {
      console.log('🚀 [LYA] Usando Responses API com Prompt Object')
      try {
        // Tentar usar Responses API
        if ((openai as any).responses) {
          console.log('✅ [LYA] Responses API disponível')
          
          // Buscar contexto do usuário para passar como variáveis
          const { supabaseAdmin } = await import('@/lib/supabase')
          
          // Buscar progresso da jornada
          const jornadaResult = await supabaseAdmin
            .from('journey_progress')
            .select('day_number, completed')
            .eq('user_id', user.id)
            .order('day_number', { ascending: false })
            .limit(1)
            .maybeSingle()
          
          const jornadaDiaAtual = jornadaResult.data?.day_number || null
          
          // Buscar perfil do usuário (incluindo branding)
          const perfilResult = await supabaseAdmin
            .from('user_profiles')
            .select('logo_url, brand_color, brand_name, professional_credential')
            .eq('user_id', user.id)
            .maybeSingle()
          
          const brandingInfo = perfilResult.data ? {
            temLogo: !!perfilResult.data.logo_url,
            temCor: !!perfilResult.data.brand_color,
            temNome: !!perfilResult.data.brand_name,
            temCredencial: !!perfilResult.data.professional_credential,
            cor: perfilResult.data.brand_color || 'Não definida',
            nome: perfilResult.data.brand_name || 'Não definida',
            credencial: perfilResult.data.professional_credential || 'Não definida'
          } : null
          
          // Buscar semana do dia atual na tabela journey_days
          let semanaAtual = null
          if (jornadaDiaAtual) {
            const dayResult = await supabaseAdmin
              .from('journey_days')
              .select('week_number')
              .eq('day_number', jornadaDiaAtual)
              .maybeSingle()
            semanaAtual = dayResult.data?.week_number || Math.ceil(jornadaDiaAtual / 7)
          }
          
          // Buscar reflexões recentes (incluindo ações práticas e exercícios)
          const reflexoesResult = await supabaseAdmin
            .from('journey_checklist_notes')
            .select('day_number, item_index, nota')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10) // Aumentar para incluir mais contexto
          
          const reflexoes = reflexoesResult.data
            ?.filter(r => r.nota && r.nota.trim())
            .map(r => {
              const tipo = r.item_index === -1 ? 'Ação Prática' : `Exercício ${r.item_index + 1}`
              return `Dia ${r.day_number} - ${tipo}: ${r.nota}`
            })
            .join('\n') || 'Nenhuma reflexão ainda.'
          
          console.log('📊 [LYA] Contexto da jornada:', {
            dia: jornadaDiaAtual,
            semana: semanaAtual,
            reflexoesCount: reflexoesResult.data?.length || 0,
            reflexoesPreview: reflexoes.substring(0, 150) + (reflexoes.length > 150 ? '...' : '')
          })
          
          // Chamar Responses API
          const response = await (openai as any).responses.create({
            model: 'gpt-4o-mini', // Modelo recomendado para LYA
            prompt: {
              id: promptId,
              variables: {
                mensagem_usuario: message,
                dia_atual: jornadaDiaAtual?.toString() || 'Jornada não iniciada',
                semana_atual: semanaAtual?.toString() || 'N/A',
                reflexoes_recentes: reflexoes || 'Nenhuma reflexão ainda.',
                historico_conversa: conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n') || 'Nenhuma conversa anterior.',
                branding_info: brandingInfo ? `MARCA PROFISSIONAL:
- Logo: ${brandingInfo.temLogo ? 'Sim ✅' : 'Não ❌'}
- Cor da marca: ${brandingInfo.cor}
- Nome da marca: ${brandingInfo.nome}
- Credencial: ${brandingInfo.credencial}

DICAS PARA CORES:
- Verde (#10B981): Saúde, vitalidade, natureza, frescor
- Azul (#3B82F6): Confiança, profissionalismo, calma, segurança
- Laranja (#F97316): Energia, entusiasmo, apetite, dinamismo
- Rosa (#EC4899): Cuidado, empatia, feminilidade, delicadeza
- Roxo (#8B5CF6): Sofisticação, transformação, sabedoria

Se a nutricionista perguntar sobre cores, sugira baseado em sua personalidade e objetivos.
Se ela já tem uma cor definida, valide e reforce a escolha se apropriada.` : 'Perfil de branding não disponível.'
              }
            }
          })
          
          const respostaLya = response.output_text || response.text || ''
          
          console.log('✅ [LYA] Resposta via Responses API recebida, tamanho:', respostaLya.length)
          
          // Salvar interação
          try {
            await supabaseAdmin.from('lya_interactions').insert({
              user_id: user.id,
              user_message: message,
              lya_response: respostaLya,
              thread_id: threadId || 'responses-api',
            })
          } catch (logError: any) {
            console.warn('⚠️ [LYA] Erro ao salvar interação (não crítico):', logError.message)
          }
          
          return NextResponse.json({
            response: respostaLya,
            threadId: threadId || 'responses-api',
            modelUsed: 'responses-api',
            promptId: promptId
          })
        } else {
          throw new Error('Responses API não disponível no SDK')
        }
      } catch (responsesError: any) {
        console.warn('⚠️ [LYA] Responses API falhou, tentando fallback:', responsesError.message)
        // Continuar para fallback abaixo
      }
    }
    
    // FALLBACK: Se tem Assistant ID, usar Assistants API (sistema antigo)
    if (assistantId && assistantId.startsWith('asst_')) {
      try {
        console.log('🤖 [LYA] ==========================================')
        console.log('🤖 [LYA] INICIANDO ASSISTANTS API')
        console.log('🤖 [LYA] ==========================================')
        console.log('📝 [LYA] Mensagem recebida:', message.substring(0, 100))
        console.log('👤 [LYA] User ID:', user.id)
        console.log('🧵 [LYA] Thread ID:', threadId || 'novo (será criado)')
        console.log('🆔 [LYA] Assistant ID:', assistantId)
        
        // Buscar contexto da jornada para incluir na mensagem
        const jornadaResult = await supabaseAdmin
          .from('journey_progress')
          .select('day_number, completed')
          .eq('user_id', user.id)
          .order('day_number', { ascending: false })
          .limit(1)
          .maybeSingle()
        
        const jornadaDiaAtual = jornadaResult.data?.day_number || null
        
        // Buscar semana do dia atual na tabela journey_days
        let semanaAtual = null
        if (jornadaDiaAtual) {
          const dayResult = await supabaseAdmin
            .from('journey_days')
            .select('week_number')
            .eq('day_number', jornadaDiaAtual)
            .maybeSingle()
          semanaAtual = dayResult.data?.week_number || Math.ceil(jornadaDiaAtual / 7)
        }
        
        // Buscar reflexões recentes (incluindo ações práticas e exercícios)
        const reflexoesResult = await supabaseAdmin
          .from('journey_checklist_notes')
          .select('day_number, item_index, nota')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10) // Aumentar para incluir mais contexto
        
        const reflexoes = reflexoesResult.data
          ?.filter(r => r.nota && r.nota.trim())
          .map(r => {
            const tipo = r.item_index === -1 ? 'Ação Prática' : `Exercício ${r.item_index + 1}`
            return `Dia ${r.day_number} - ${tipo}: ${r.nota}`
          })
          .join('\n') || 'Nenhuma reflexão ainda.'
        
        // Construir mensagem com contexto - SEMPRE incluir contexto da jornada
        const contextoJornada = `\n\n[CONTEXTO DA JORNADA]\n` +
          `- Dia atual da jornada: ${jornadaDiaAtual || 'Jornada não iniciada'}\n` +
          `- Semana atual: ${semanaAtual || 'N/A'}\n` +
          `- Reflexões recentes:\n${reflexoes}\n`
        
        const mensagemComContexto = message + contextoJornada
        
        console.log('📊 [LYA] Contexto da jornada adicionado:', {
          dia: jornadaDiaAtual,
          semana: semanaAtual,
          reflexoesCount: reflexoesResult.data?.length || 0,
          reflexoesPreview: reflexoes.substring(0, 100) + '...'
        })
        
        const { processMessageWithLya } = await import('@/lib/lya-assistant-handler')
        
        let assistantResult
        try {
          assistantResult = await processMessageWithLya(
            mensagemComContexto,
            user.id,
            threadId
          )
        } catch (functionError: any) {
          console.error('❌ [LYA] Erro ao processar mensagem:', functionError)
          
          // Tentar retry
          console.warn('⚠️ [LYA] Tentando retry após erro...')
          try {
            assistantResult = await processMessageWithLya(
              message,
              user.id,
              threadId
            )
            console.log('✅ [LYA] Retry bem-sucedido após erro')
          } catch (retryError: any) {
            console.error('❌ [LYA] Retry também falhou:', retryError)
            
            let helpfulResponse = `Desculpe, tive um problema técnico ao processar sua mensagem. Mas posso te ajudar!`
            
            if (message.toLowerCase().includes('organização') || message.toLowerCase().includes('rotina')) {
              helpfulResponse = `Desculpe, tive um problema técnico. Mas posso te ajudar com organização e rotina! Você pode:\n\n- Me fazer outra pergunta sobre organização\n- Recarregar a página e tentar novamente\n\nO que você precisa agora?`
            } else {
              helpfulResponse = `Desculpe, tive um problema técnico ao processar sua mensagem. Tente novamente em alguns instantes ou reformule sua pergunta.\n\nSe o problema persistir, você pode acessar diretamente os recursos da plataforma.`
            }
            
            return NextResponse.json({
              response: helpfulResponse,
              threadId: threadId || 'new',
              modelUsed: 'gpt-4-assistant',
              error: true,
              errorMessage: retryError.message || functionError.message || 'Erro ao processar mensagem'
            })
          }
        }

        console.log('✅ [LYA] ==========================================')
        console.log('✅ [LYA] ASSISTANTS API RETORNOU RESPOSTA')
        console.log('✅ [LYA] ==========================================')
        console.log('📝 [LYA] Resposta length:', assistantResult.response.length)
        if (assistantResult.functionCalls && assistantResult.functionCalls.length > 0) {
          console.log(`🔧 [LYA] ${assistantResult.functionCalls.length} function(s) executada(s):`, 
            assistantResult.functionCalls.map(f => f.name).join(', '))
        }
        console.log('🧵 [LYA] Novo Thread ID:', assistantResult.newThreadId)

        // Salvar interação automaticamente no Supabase
        try {
          const interactionData: any = {
            user_id: user.id,
            message: message,
            response: assistantResult.response,
            thread_id: assistantResult.newThreadId,
            // Estrutura compatível
            user_message: message,
            lya_response: assistantResult.response,
          }
          
          const { error: insertError } = await supabaseAdmin
            .from('lya_interactions')
            .insert(interactionData)
          
          if (insertError) {
            console.warn('⚠️ [LYA] Erro ao salvar interação:', insertError.message)
            // Tentar estrutura alternativa
            try {
              await supabaseAdmin.from('lya_interactions').insert({
                user_id: user.id,
                user_message: message,
                lya_response: assistantResult.response,
                thread_id: assistantResult.newThreadId,
              })
            } catch (fallbackError: any) {
              console.warn('⚠️ [LYA] Erro no fallback também:', fallbackError.message)
            }
          }
          
          console.log('💾 [LYA] Interação salva no Supabase')
        } catch (logError: any) {
          console.warn('⚠️ [LYA] Erro ao salvar interação (não crítico):', logError.message)
        }

        return NextResponse.json({
          response: assistantResult.response,
          threadId: assistantResult.newThreadId,
          functionCalls: assistantResult.functionCalls,
          modelUsed: 'gpt-4-assistant',
        })
      } catch (assistantError: any) {
        console.error('❌ [LYA] ==========================================')
        console.error('❌ [LYA] ASSISTANTS API FALHOU')
        console.error('❌ [LYA] ==========================================')
        console.error('❌ [LYA] Erro:', assistantError.message)
        
        let errorMessage = 'Erro ao processar sua mensagem.'
        let errorDetails = 'A LYA não conseguiu processar sua solicitação no momento.'
        
        if (assistantError.message?.includes('timeout')) {
          errorMessage = 'A requisição demorou muito para processar.'
          errorDetails = 'Tente novamente em alguns instantes.'
        } else if (assistantError.message?.includes('rate limit')) {
          errorMessage = 'Limite de requisições atingido.'
          errorDetails = 'Aguarde alguns minutos e tente novamente.'
        } else if (assistantError.message?.includes('invalid') || assistantError.message?.includes('not found')) {
          errorMessage = 'Configuração da LYA inválida.'
          errorDetails = 'Entre em contato com o suporte técnico.'
        }
        
        return NextResponse.json(
          {
            error: errorMessage,
            message: assistantError.message,
            details: errorDetails,
          },
          { status: 500 }
        )
      }
    } else {
      console.error('❌ [LYA] ==========================================')
      console.error('❌ [LYA] OPENAI_ASSISTANT_LYA_ID NÃO CONFIGURADO')
      console.error('❌ [LYA] ==========================================')
      
      // Se não tem nenhum dos dois, usar Chat Completions como fallback final
      console.log('⚠️ [LYA] Nenhum ID configurado, usando Chat Completions como fallback')
      
      try {
        // Buscar contexto da jornada
        const jornadaResult = await supabaseAdmin
          .from('journey_progress')
          .select('day_number, completed')
          .eq('user_id', user.id)
          .order('day_number', { ascending: false })
          .limit(1)
          .maybeSingle()
        
        const jornadaDiaAtual = jornadaResult.data?.day_number || null
        
        // Buscar semana do dia atual na tabela journey_days
        let semanaAtual = null
        if (jornadaDiaAtual) {
          const dayResult = await supabaseAdmin
            .from('journey_days')
            .select('week_number')
            .eq('day_number', jornadaDiaAtual)
            .maybeSingle()
          semanaAtual = dayResult.data?.week_number || Math.ceil(jornadaDiaAtual / 7)
        }
        
        // Buscar reflexões recentes
        const reflexoesResult = await supabaseAdmin
          .from('journey_checklist_notes')
          .select('day_number, nota')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)
        
        const reflexoes = reflexoesResult.data
          ?.filter(r => r.nota && r.nota.trim())
          .map(r => {
            const tipo = r.item_index === -1 ? 'Ação Prática' : `Exercício ${r.item_index + 1}`
            return `Dia ${r.day_number} - ${tipo}: ${r.nota}`
          })
          .join('\n') || 'Nenhuma reflexão ainda.'
        
        // Buscar perfil do usuário (incluindo branding)
        const perfilResult = await supabaseAdmin
          .from('user_profiles')
          .select('logo_url, brand_color, brand_name, professional_credential')
          .eq('user_id', user.id)
          .maybeSingle()
        
        const brandingInfo = perfilResult.data ? {
          temLogo: !!perfilResult.data.logo_url,
          temCor: !!perfilResult.data.brand_color,
          temNome: !!perfilResult.data.brand_name,
          temCredencial: !!perfilResult.data.professional_credential,
          cor: perfilResult.data.brand_color || 'Não definida',
          nome: perfilResult.data.brand_name || 'Não definida',
          credencial: perfilResult.data.professional_credential || 'Não definida'
        } : null
        
        // Construir system prompt com contexto
        const systemPrompt = `Você é LYA, mentora estratégica oficial da plataforma Nutri YLADA. Você ajuda nutricionistas a desenvolverem sua mentalidade, organização e posicionamento como Nutri-Empresárias. Seja direta, acolhedora e focada no próximo passo certo.

CONTEXTO DA JORNADA DA NUTRICIONISTA:
- Dia atual da jornada: ${jornadaDiaAtual || 'Jornada não iniciada'}
- Semana atual: ${semanaAtual || 'N/A'}
- Reflexões recentes:
${reflexoes}

${brandingInfo ? `MARCA PROFISSIONAL:
- Logo: ${brandingInfo.temLogo ? 'Sim ✅' : 'Não ❌'}
- Cor da marca: ${brandingInfo.cor}
- Nome da marca: ${brandingInfo.nome}
- Credencial: ${brandingInfo.credencial}

DICAS PARA CORES DE MARCA:
- Verde (#10B981): Saúde, vitalidade, natureza, frescor - ideal para nutrição
- Azul (#3B82F6): Confiança, profissionalismo, calma, segurança
- Laranja (#F97316): Energia, entusiasmo, apetite, dinamismo
- Rosa (#EC4899): Cuidado, empatia, feminilidade, delicadeza
- Roxo (#8B5CF6): Sofisticação, transformação, sabedoria

QUANDO PERGUNTAR SOBRE CORES:
1. Pergunte sobre a personalidade da nutricionista e objetivos
2. Sugira 2-3 cores que façam sentido para ela
3. Explique o significado de cada cor
4. Dê o código HEX para ela copiar e usar

QUANDO VALIDAR LOGO:
- Se ela mencionar que fez upload, parabenize e sugira testar em diferentes fundos
- Se perguntar sobre qualidade, sugira que o logo seja simples e legível
- Recomende que o logo funcione bem em tamanhos pequenos` : ''}

IMPORTANTE: Quando a nutricionista perguntar "Em que semana estou?", responda sobre a SEMANA DA JORNADA (não a semana do ano). Quando perguntar "O que preciso fazer hoje?", responda baseado no DIA ATUAL DA JORNADA. Quando perguntar sobre reflexões, use as reflexões listadas acima.`
        
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            ...conversationHistory.map(m => ({
              role: m.role,
              content: m.content
            })),
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
        
        const respostaLya = completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.'
        
        return NextResponse.json({
          response: respostaLya,
          threadId: threadId || 'chat-completions',
          modelUsed: 'gpt-4o-mini'
        })
      } catch (fallbackError: any) {
        console.error('❌ [LYA] Fallback também falhou:', fallbackError.message)
        return NextResponse.json(
          {
            error: 'LYA não configurada',
            message: 'Configure LYA_PROMPT_ID (para Responses API) ou OPENAI_ASSISTANT_LYA_ID (para Assistants API) no arquivo .env.local',
            details: 'A LYA precisa de uma das duas variáveis configuradas. Use LYA_PROMPT_ID (recomendado) para Responses API.',
          },
          { status: 500 }
        )
      }
    }
  } catch (error: any) {
    console.error('❌ [LYA] Erro geral no endpoint:', error)
    console.error('❌ [LYA] Stack completo:', error.stack)
    
    return NextResponse.json({
      response: `Desculpe, tive um problema técnico ao processar sua mensagem. 

Mas posso te ajudar! Você pode:
- Me fazer outra pergunta e eu tento ajudar de outra forma
- Recarregar a página e tentar novamente

O que você precisa agora?`,
      threadId: 'error',
      modelUsed: 'gpt-4-assistant',
      error: true,
      errorMessage: process.env.NODE_ENV === 'development' ? error.message : 'Erro ao processar mensagem'
    })
  }
}

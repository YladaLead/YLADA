// =====================================================
// NOEL WELLNESS SYSTEM - API V2
// Nova implementação completa do WELLNESS SYSTEM
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import type { 
  WellnessInteractionContext,
  NoelOperationMode,
  NoelRequest,
  NoelResponse
} from '@/types/wellness-system'

// Importar módulos do novo sistema
import { processarMensagem, tomarDecisao } from '@/lib/wellness-system/noel-engine/core/reasoning'
import { selecionarModo, validarModo } from '@/lib/wellness-system/noel-engine/modes/mode-selector'
import { processarScript } from '@/lib/wellness-system/noel-engine/scripts/script-engine'
import { tratarObjeção } from '@/lib/wellness-system/noel-engine/objections/objection-handler'
import { construirResposta, validarResposta } from '@/lib/wellness-system/noel-engine/response/response-builder'
import { formatarParaAPI } from '@/lib/wellness-system/noel-engine/response/response-formatter'
import { validarRegraFundamental } from '@/lib/wellness-system/noel-engine/core/rules'

/**
 * POST /api/wellness/noel/v2
 * 
 * Nova API do WELLNESS SYSTEM com motor completo
 */
export async function POST(request: NextRequest) {
  try {
    // Autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body: NoelRequest = await request.json()
    const { mensagem, contexto, modo_operacao, cliente_id, prospect_id } = body

    if (!mensagem || mensagem.trim().length === 0) {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    // ============================================
    // PASSO 1: Processar mensagem e entender contexto
    // ============================================
    const processamento = processarMensagem(mensagem, contexto)
    const { tipo_interacao, contexto: ctxProcessado, palavras_chave, intencao } = processamento

    // ============================================
    // PASSO 2: Detectar objeção (se houver)
    // ============================================
    let objeçãoTratada: any = null
    let respostaObjeção: string | null = null

    if (tipo_interacao === 'objeção' || palavras_chave.some(k => ['objeção', 'não quer', 'caro', 'pensar'].includes(k.toLowerCase()))) {
      const resultadoObjeção = await tratarObjeção(mensagem, {
        urgencia: 'media',
        tempo_disponivel: 'medio',
        nivel_interesse: 'medio'
      })

      if (resultadoObjeção.objeção) {
        objeçãoTratada = resultadoObjeção.objeção
        respostaObjeção = resultadoObjeção.resposta
      }
    }

    // ============================================
    // PASSO 3: Selecionar modo de operação
    // ============================================
    const modoSelecionado = modo_operacao || selecionarModo({
      tipo_interacao,
      contexto: ctxProcessado,
      mensagem,
      palavras_chave
    })

    // Validar modo
    const validacaoModo = validarModo(modoSelecionado, ctxProcessado)
    if (!validacaoModo.valido && validacaoModo.sugestao) {
      // Usar modo sugerido se o selecionado não for válido
      // (mas manter o selecionado por enquanto)
    }

    // ============================================
    // PASSO 4: Buscar script apropriado (se não for objeção)
    // ============================================
    let scriptResultado: any = null
    if (!respostaObjeção) {
      scriptResultado = await processarScript({
        ...ctxProcessado,
        categoria: modoSelecionado === 'recrutamento' ? 'recrutamento' : 
                   modoSelecionado === 'venda' ? 'tipo_pessoa' :
                   modoSelecionado === 'acompanhamento' ? 'acompanhamento' :
                   'etapa',
        versao_preferida: 'media',
        urgencia: 'media',
        tempo_disponivel: 'medio',
        nivel_interesse: 'medio'
      })
    }

    // ============================================
    // PASSO 5: Construir resposta estruturada
    // ============================================
    const respostaEstruturada = construirResposta({
      mensagem_usuario: mensagem,
      tipo_interacao,
      modo_operacao: modoSelecionado,
      script: scriptResultado?.script || null,
      objeção: objeçãoTratada,
      resposta_objeção: respostaObjeção || undefined,
      contexto: {
        ...ctxProcessado,
        cliente_id,
        prospect_id
      }
    })

    // ============================================
    // PASSO 6: Validar resposta (regra fundamental)
    // ============================================
    const validacao = validarResposta(
      formatarParaAPI(respostaEstruturada).resposta,
      {
        ...ctxProcessado,
        cliente_id,
        prospect_id
      }
    )

    if (!validacao.valido && validacao.problemas) {
      console.warn('⚠️ Resposta não passou na validação:', validacao.problemas)
      // Ajustar resposta se necessário (remover menções a PV, etc.)
    }

    // ============================================
    // PASSO 7: Formatar resposta final
    // ============================================
    const respostaFormatada = formatarParaAPI(respostaEstruturada)

    // ============================================
    // PASSO 8: Salvar interação no banco
    // ============================================
    try {
      await supabaseAdmin!
        .from('wellness_consultant_interactions')
        .insert({
          consultant_id: user.id,
          tipo_interacao,
          contexto: {
            ...ctxProcessado,
            cliente_id,
            prospect_id,
            modo_operacao: modoSelecionado
          },
          mensagem_usuario: mensagem,
          resposta_noel: respostaFormatada.resposta,
          script_usado_id: scriptResultado?.script?.id || null,
          objeção_tratada_id: objeçãoTratada?.id || null
        })
    } catch (logError) {
      console.error('⚠️ Erro ao salvar interação (não crítico):', logError)
    }

    // ============================================
    // PASSO 9: Retornar resposta
    // ============================================
    const resposta = {
      resposta: respostaFormatada.resposta,
      script_sugerido: scriptResultado?.script || undefined,
      objeção_tratada: objeçãoTratada || undefined,
      modo_operacao: modoSelecionado,
      proxima_acao: respostaEstruturada.proximo_passo,
      tags: [
        ...(scriptResultado?.tags || []),
        modoSelecionado,
        tipo_interacao
      ],
      estrutura: respostaFormatada.estrutura
    }

    return NextResponse.json(resposta)

  } catch (error: any) {
    console.error('❌ Erro no NOEL V2:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao processar mensagem',
        details: error.message 
      },
      { status: 500 }
    )
  }
}


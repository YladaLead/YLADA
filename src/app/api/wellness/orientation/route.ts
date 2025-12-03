import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { buscarOrientacao } from '@/lib/orientation-search'
import { WELLNESS_ORIENTACAO_MAP } from '@/lib/wellness-orientation'
import { supabaseAdmin } from '@/lib/supabase'
import type { OrientacaoResposta, MentorInfo } from '@/types/orientation'

/**
 * GET /api/wellness/orientation
 * Busca orientação técnica baseada na pergunta do usuário
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    // Obter pergunta da query string
    const { searchParams } = new URL(request.url)
    const pergunta = searchParams.get('pergunta')

    if (!pergunta || pergunta.trim() === '') {
      return NextResponse.json(
        { error: 'Pergunta é obrigatória' },
        { status: 400 }
      )
    }

    // Buscar orientação técnica
    const orientacao = buscarOrientacao(pergunta, WELLNESS_ORIENTACAO_MAP)

    if (orientacao) {
      // Encontrou orientação técnica!
      
      // Verificar se usuário tem mentor
      const mentor = await verificarMentor(user.id)
      
      const resposta: OrientacaoResposta = {
        tipo: 'tecnica',
        item: orientacao,
        temMentor: mentor.temMentor,
        mentor: mentor.temMentor ? mentor : undefined,
        sugestaoMentor: mentor.temMentor ? {
          mostrar: true,
          mensagem: `💡 Dica: Você tem um mentor (${mentor.nome}). Ele pode te ajudar com estratégias e dúvidas mais profundas!`,
          acao: `Conversar com ${mentor.nome}`,
          whatsapp: mentor.whatsapp
        } : undefined
      }

      return NextResponse.json(resposta)
    }

    // Não encontrou orientação técnica
    // Retornar null para que o sistema use OpenAI como fallback
    return NextResponse.json({
      tipo: 'conceitual',
      item: null
    })

  } catch (error: any) {
    console.error('❌ Erro ao buscar orientação:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar orientação' },
      { status: 500 }
    )
  }
}

/**
 * Verifica se usuário tem mentor/líder
 */
async function verificarMentor(userId: string): Promise<MentorInfo> {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('mentor_id, mentor_nome, mentor_whatsapp, mentor_email')
      .eq('user_id', userId)
      .single()

    if (error || !data?.mentor_id) {
      return { temMentor: false }
    }

    return {
      temMentor: true,
      nome: data.mentor_nome || undefined,
      whatsapp: data.mentor_whatsapp || undefined,
      email: data.mentor_email || undefined
    }
  } catch (error) {
    console.error('Erro ao verificar mentor:', error)
    return { temMentor: false }
  }
}


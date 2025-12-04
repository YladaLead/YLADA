import { NextRequest, NextResponse } from 'next/server';
import { buscarOrientacao } from '@/lib/orientation-search';
import { NUTRI_ORIENTACAO_MAP } from '@/lib/nutri-orientation';
import { requireApiAuth } from '@/lib/api-auth';
import { supabaseAdmin } from '@/lib/supabase';
import type { OrientacaoResposta, MentorInfo } from '@/types/orientation';

export async function GET(request: NextRequest) {
  try {
    // Autenticação da API
    const authResult = await requireApiAuth(request, ['nutri', 'admin']);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user } = authResult;

    const { searchParams } = new URL(request.url);
    const pergunta = searchParams.get('pergunta');

    if (!pergunta || pergunta.trim() === '') {
      return NextResponse.json(
        { error: 'Parâmetro "pergunta" é obrigatório' },
        { status: 400 }
      );
    }

    const orientacao = buscarOrientacao(pergunta, NUTRI_ORIENTACAO_MAP);

    if (orientacao) {
      // Encontrou orientação técnica!
      
      // Verificar se usuário tem mentor/líder
      const mentor = await verificarMentor(user.id);
      
      const resposta: OrientacaoResposta = {
        tipo: 'tecnica',
        item: orientacao,
        temMentor: mentor.temMentor,
        mentor: mentor.temMentor ? mentor : undefined,
        sugestaoMentor: mentor.temMentor ? {
          mostrar: true,
          mensagem: `💡 Dica: Você tem um mentor/líder (${mentor.nome}). Ele pode te ajudar com estratégias e dúvidas mais profundas sobre a Formação Empresarial!`,
          acao: `Conversar com ${mentor.nome}`,
          whatsapp: mentor.whatsapp
        } : undefined
      };

      return NextResponse.json(resposta);
    }

    // Não encontrou orientação técnica
    // Retornar null para que o sistema use OpenAI como fallback
    return NextResponse.json({
      tipo: 'conceitual',
      item: null
    });

  } catch (error: any) {
    console.error('❌ Erro na API de orientação Nutri:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor ao buscar orientação' },
      { status: 500 }
    );
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
      .single();

    if (error || !data?.mentor_id) {
      return { temMentor: false };
    }

    return {
      temMentor: true,
      nome: data.mentor_nome || undefined,
      whatsapp: data.mentor_whatsapp || undefined,
      email: data.mentor_email || undefined
    };
  } catch (error) {
    console.error('Erro ao verificar mentor:', error);
    return { temMentor: false };
  }
}


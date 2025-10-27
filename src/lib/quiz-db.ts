import { supabaseAdmin } from './supabase'

export interface QuizDatabase {
  id: string
  user_id: string
  titulo: string
  descricao: string | null
  emoji: string
  cores: {
    primaria: string
    secundaria: string
    texto: string
    fundo: string
  }
  configuracoes: {
    tempoLimite?: number
    mostrarProgresso: boolean
    permitirVoltar: boolean
  }
  entrega: {
    tipoEntrega: 'pagina' | 'whatsapp' | 'url'
    ctaPersonalizado: string
    urlRedirecionamento: string
    coletarDados: boolean
    camposColeta: {
      nome: boolean
      email: boolean
      telefone: boolean
      mensagemPersonalizada: string
    }
    customizacao: {
      tamanhoFonte: 'pequeno' | 'medio' | 'grande'
      corFundo: string
      corTexto: string
      corBotao: string
      espacamento: 'compacto' | 'normal' | 'amplo'
      estilo: 'minimalista' | 'moderno' | 'elegante'
    }
    blocosConteudo: Array<{
      id: string
      tipo: 'titulo' | 'subtitulo' | 'texto' | 'paragrafo' | 'destaque'
      conteudo: string
      tamanho: 'pequeno' | 'medio' | 'grande'
    }>
    acaoAposCaptura: 'redirecionar' | 'manter_pagina' | 'ambos'
  }
  slug: string
  views: number
  leads_count: number
  status: 'active' | 'inactive' | 'draft'
  created_at: string
  updated_at: string
}

export interface PerguntaDatabase {
  id: string
  quiz_id: string
  tipo: 'multipla' | 'dissertativa' | 'escala' | 'simnao'
  titulo: string
  opcoes: string[] | null
  obrigatoria: boolean
  ordem: number
  created_at: string
  updated_at: string
}

export interface RespostaDatabase {
  id: string
  quiz_id: string
  pergunta_id: string
  nome: string | null
  email: string | null
  telefone: string | null
  resposta: {
    resposta_texto?: string
    resposta_escala?: number
    resposta_opcoes?: string[]
  }
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export const quizDB = {
  // Salvar quiz completo (com perguntas)
  async saveQuiz(quizData: Partial<QuizDatabase>, perguntas: any[]) {
    try {
      // 1. Inserir quiz
      const { data: quiz, error: quizError } = await supabaseAdmin
        .from('quizzes')
        .insert({
          user_id: quizData.user_id,
          titulo: quizData.titulo,
          descricao: quizData.descricao,
          emoji: quizData.emoji,
          cores: quizData.cores,
          configuracoes: quizData.configuracoes,
          entrega: quizData.entrega,
          slug: quizData.slug,
          status: 'draft', // Começar como rascunho
        })
        .select()
        .single()

      if (quizError) {
        console.error('Erro ao salvar quiz:', quizError)
        throw quizError
      }

      // 2. Inserir perguntas
      if (perguntas && perguntas.length > 0) {
        const perguntasData = perguntas.map((p, index) => ({
          quiz_id: quiz.id,
          tipo: p.tipo,
          titulo: p.titulo,
          opcoes: p.opcoes || null,
          obrigatoria: p.obrigatoria !== false,
          ordem: index + 1,
        }))

        const { error: perguntasError } = await supabaseAdmin
          .from('quiz_perguntas')
          .insert(perguntasData)

        if (perguntasError) {
          console.error('Erro ao salvar perguntas:', perguntasError)
          throw perguntasError
        }
      }

      return quiz
    } catch (error) {
      console.error('Erro ao salvar quiz:', error)
      throw error
    }
  },

  // Atualizar status do quiz para 'active'
  async publishQuiz(quizId: string) {
    try {
      const { data, error } = await supabaseAdmin
        .from('quizzes')
        .update({ status: 'active', updated_at: new Date().toISOString() })
        .eq('id', quizId)
        .select()
        .single()

      if (error) {
        console.error('Erro ao publicar quiz:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Erro ao publicar quiz:', error)
      throw error
    }
  },

  // Buscar quiz por slug
  async getQuizBySlug(slug: string) {
    try {
      // Buscar quiz
      const { data: quiz, error: quizError } = await supabaseAdmin
        .from('quizzes')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .single()

      if (quizError || !quiz) {
        console.error('Quiz não encontrado:', quizError)
        return null
      }

      // Buscar perguntas
      const { data: perguntas, error: perguntasError } = await supabaseAdmin
        .from('quiz_perguntas')
        .select('*')
        .eq('quiz_id', quiz.id)
        .order('ordem', { ascending: true })

      if (perguntasError) {
        console.error('Erro ao buscar perguntas:', perguntasError)
        return null
      }

      return {
        ...quiz,
        perguntas: perguntas || [],
      }
    } catch (error) {
      console.error('Erro ao buscar quiz:', error)
      return null
    }
  },

  // Buscar todos os quizzes de um usuário
  async getUserQuizzes(userId: string) {
    try {
      const { data, error } = await supabaseAdmin
        .from('quizzes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar quizzes:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar quizzes:', error)
      throw error
    }
  },

  // Salvar resposta de um quiz
  async saveQuizResponse(respostaData: Partial<RespostaDatabase>) {
    try {
      // Incrementar contador de leads no quiz
      await supabaseAdmin.rpc('increment_quiz_leads', {
        quiz_id_param: respostaData.quiz_id,
      })

      // Inserir resposta
      const { data, error } = await supabaseAdmin
        .from('quiz_respostas')
        .insert({
          quiz_id: respostaData.quiz_id,
          pergunta_id: respostaData.pergunta_id,
          nome: respostaData.nome,
          email: respostaData.email,
          telefone: respostaData.telefone,
          resposta: respostaData.resposta,
          ip_address: respostaData.ip_address,
          user_agent: respostaData.user_agent,
        })
        .select()
        .single()

      if (error) {
        console.error('Erro ao salvar resposta:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Erro ao salvar resposta:', error)
      throw error
    }
  },

  // Buscar respostas de um quiz
  async getQuizResponses(quizId: string, userId: string) {
    try {
      // Verificar se o quiz pertence ao usuário
      const { data: quiz } = await supabaseAdmin
        .from('quizzes')
        .select('user_id')
        .eq('id', quizId)
        .single()

      if (!quiz || quiz.user_id !== userId) {
        throw new Error('Quiz não pertence ao usuário')
      }

      // Buscar respostas
      const { data, error } = await supabaseAdmin
        .from('quiz_respostas')
        .select(`
          *,
          quiz_perguntas (
            titulo,
            tipo
          )
        `)
        .eq('quiz_id', quizId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar respostas:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar respostas:', error)
      throw error
    }
  },

  // Incrementar visualizações
  async incrementView(slug: string) {
    try {
      const { error } = await supabaseAdmin.rpc('increment_quiz_views', {
        slug_param: slug,
      })

      if (error) {
        console.error('Erro ao incrementar visualizações:', error)
        // Não falhar silenciosamente, mas não bloquear
      }
    } catch (error) {
      console.error('Erro ao incrementar visualizações:', error)
    }
  },

  // Verificar se slug está disponível
  async checkSlugAvailability(slug: string): Promise<boolean> {
    try {
      const { data, error } = await supabaseAdmin
        .from('quizzes')
        .select('id')
        .eq('slug', slug)
        .single()

      if (error && error.code === 'PGRST116') {
        // Nenhum registro encontrado = disponível
        return true
      }

      if (error) {
        console.error('Erro ao verificar slug:', error)
        return false
      }

      // Se encontrou dados, slug não está disponível
      return !data
    } catch (error) {
      console.error('Erro ao verificar slug:', error)
      return false
    }
  },
}


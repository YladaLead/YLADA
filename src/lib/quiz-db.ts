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
  tipo: 'multipla' | 'dissertativa'
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
      // 1. Validar se o slug está disponível para este usuário
      if (quizData.slug && quizData.user_id) {
        const slugDisponivel = await this.checkSlugAvailability(quizData.slug, quizData.user_id)
        if (!slugDisponivel) {
          throw new Error(`Este nome de URL já está em uso por você. Escolha outro.`)
        }
      }

      // 2. Processar short_code se fornecido
      let shortCode = null
      if (quizData.generate_short_url) {
        if (quizData.custom_short_code) {
          const customCode = quizData.custom_short_code.toLowerCase().trim()
          
          // Validar formato
          if (!/^[a-z0-9-]{3,10}$/.test(customCode)) {
            throw new Error('Código personalizado inválido. Deve ter entre 3 e 10 caracteres e conter apenas letras, números e hífens.')
          }

          // Verificar disponibilidade (em todas as tabelas que usam short_code)
          const [existingInQuizzes, existingInPortals, existingInTemplates] = await Promise.all([
            supabaseAdmin.from('quizzes').select('id').eq('short_code', customCode).limit(1),
            supabaseAdmin.from('wellness_portals').select('id').eq('short_code', customCode).limit(1),
            supabaseAdmin.from('user_templates').select('id').eq('short_code', customCode).limit(1),
          ])

          if ((existingInQuizzes.data && existingInQuizzes.data.length > 0) ||
              (existingInPortals.data && existingInPortals.data.length > 0) ||
              (existingInTemplates.data && existingInTemplates.data.length > 0)) {
            throw new Error('Este código personalizado já está em uso')
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

      // 3. Inserir quiz
      const insertData: any = {
        user_id: quizData.user_id,
        titulo: quizData.titulo,
        descricao: quizData.descricao,
        emoji: quizData.emoji,
        cores: quizData.cores,
        configuracoes: quizData.configuracoes,
        entrega: quizData.entrega,
        slug: quizData.slug,
        profession: quizData.profession || 'wellness', // Área do quiz
        status: 'draft', // Começar como rascunho
      }

      if (shortCode) {
        insertData.short_code = shortCode
      }

      const { data: quiz, error: quizError } = await supabaseAdmin
        .from('quizzes')
        .insert(insertData)
        .select()
        .single()

      if (quizError) {
        console.error('Erro ao salvar quiz:', quizError)
        // Se for erro de constraint única, retornar mensagem mais clara
        if (quizError.code === '23505') {
          throw new Error('Este nome de URL já está em uso por você. Escolha outro.')
        }
        throw quizError
      }

      // 3. Inserir perguntas
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

      // Buscar WhatsApp do perfil do usuário que criou o quiz
      let whatsappDoPerfil = null
      if (quiz.user_id) {
        const { data: profile } = await supabaseAdmin
          .from('user_profiles')
          .select('whatsapp')
          .eq('user_id', quiz.user_id)
          .maybeSingle()
        
        if (profile?.whatsapp) {
          whatsappDoPerfil = profile.whatsapp
        }
      }

      return {
        ...quiz,
        perguntas: perguntas || [],
        whatsappDoPerfil, // Incluir WhatsApp do perfil
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

  // Verificar se slug está disponível PARA O USUÁRIO ATUAL
  async checkSlugAvailability(slug: string, userId?: string): Promise<boolean> {
    try {
      let query = supabaseAdmin
        .from('quizzes')
        .select('id')
        .eq('slug', slug)
      
      // Se userId foi fornecido, verificar apenas para esse usuário
      if (userId) {
        query = query.eq('user_id', userId)
      }
      
      const { data, error } = await query.maybeSingle()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned (é o que queremos)
        console.error('Erro ao verificar slug:', error)
        return false
      }

      // Se não encontrou dados, slug está disponível
      return !data
    } catch (error) {
      console.error('Erro ao verificar slug:', error)
      return false
    }
  },
}


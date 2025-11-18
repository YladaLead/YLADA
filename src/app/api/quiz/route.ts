import { NextRequest, NextResponse } from 'next/server'
import { quizDB } from '@/lib/quiz-db'
import { supabaseAdmin } from '@/lib/supabase'
import { CreateQuizSchema, UpdateQuizSchema } from '@/lib/validation'
import { withRateLimit } from '@/lib/rate-limit'
import { requireApiAuth } from '@/lib/api-auth'

// GET: Buscar quizzes (público para slugs, privado para userQuizzes)
export async function GET(request: NextRequest) {
  return withRateLimit(request, 'quiz-get', async () => {
    try {
      const { searchParams } = new URL(request.url)
      const action = searchParams.get('action')
      const slug = searchParams.get('slug')

      // Buscar quiz por slug (público)
      if (action === 'bySlug' && slug) {
        // Validar slug
        if (!/^[a-z0-9-]+$/.test(slug)) {
          return NextResponse.json(
            { error: 'Slug inválido' },
            { status: 400 }
          )
        }

        const quiz = await quizDB.getQuizBySlug(slug)
        
        if (!quiz) {
          return NextResponse.json(
            { error: 'Quiz não encontrado' },
            { status: 404 }
          )
        }

        return NextResponse.json(quiz)
      }

      return NextResponse.json(
        { error: 'Parâmetros inválidos' },
        { status: 400 }
      )
    } catch (error) {
      console.error('Erro na API de quiz:', error)
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }, { limit: 30, window: 60 })
}

// POST: Criar novo quiz
export async function POST(request: NextRequest) {
  return withRateLimit(request, 'quiz-post', async () => {
    try {
      // 🔒 Verificar autenticação - aceitar todos os perfis
      const authResult = await requireApiAuth(request, ['wellness', 'nutri', 'coach', 'nutra', 'admin'])
      if (authResult instanceof NextResponse) {
        return authResult
      }
      const { user, profile } = authResult

      const body = await request.json()

      // Normalizar cores para formato hex se necessário
      const coresNormalizadas = body.quizData?.cores ? {
        primaria: normalizarCor(body.quizData.cores.primaria || '#3B82F6'),
        secundaria: normalizarCor(body.quizData.cores.secundaria || '#1E40AF'),
        texto: normalizarCor(body.quizData.cores.texto || '#1F2937'),
        fundo: normalizarCor(body.quizData.cores.fundo || '#FFFFFF'),
      } : {
        primaria: '#3B82F6',
        secundaria: '#1E40AF',
        texto: '#1F2937',
        fundo: '#FFFFFF',
      }

      // Preparar dados para validação
      const dadosParaValidar = {
        titulo: body.quizData?.titulo || '',
        descricao: body.quizData?.descricao || '',
        emoji: body.quizData?.emoji || '',
        cores: coresNormalizadas,
        configuracoes: body.quizData?.configuracao || {},
        entrega: body.quizData?.entrega || {},
        slug: body.quizData?.slug || '',
        perguntas: body.perguntas || [],
      }

      // Validar com Zod
      const validated = CreateQuizSchema.parse(dadosParaValidar)

      // Adicionar user_id e profession ao quizData
      // Usar profession do body se fornecido, senão usar o perfil do usuário autenticado
      const profession = body.profession || profile?.perfil || 'wellness'
      
      const quizDataComUserId = {
        ...body.quizData,
        user_id: user.id,
        profession: profession, // Área do quiz (do body ou do perfil do usuário)
        cores: coresNormalizadas,
        generate_short_url: body.generate_short_url || false,
        custom_short_code: body.custom_short_code || null,
      }

      // Salvar quiz
      const quiz = await quizDB.saveQuiz(quizDataComUserId, body.perguntas || [])

      return NextResponse.json({
        success: true,
        quiz,
      })
    } catch (error: any) {
      console.error('Erro ao criar quiz:', error)

      // Retornar erro de validação específico
      if (error.name === 'ZodError') {
        console.error('Erros de validação:', error.errors)
        return NextResponse.json(
          { 
            error: 'Dados inválidos',
            details: error.errors.map((e: any) => ({
              path: e.path.join('.'),
              message: e.message
            }))
          },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: error.message || 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }, { limit: 10, window: 60 })
}

// Função helper para normalizar cores para formato hex
function normalizarCor(cor: string): string {
  if (!cor) return '#000000'
  
  // Se já está em formato hex, retornar
  if (/^#[0-9A-Fa-f]{6}$/.test(cor)) {
    return cor.toUpperCase()
  }
  
  // Se está em formato rgb/rgba, converter
  const rgbMatch = cor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0')
    const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0')
    const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0')
    return `#${r}${g}${b}`.toUpperCase()
  }
  
  // Se não reconhece, retornar cor padrão
  return '#000000'
}

// PUT: Atualizar quiz
export async function PUT(request: NextRequest) {
  return withRateLimit(request, 'quiz-put', async () => {
    try {
      const body = await request.json()

      // Validar com Zod
      const validated = UpdateQuizSchema.parse({
        quizId: body.quizId,
        quizData: body.quizData,
        perguntas: body.perguntas,
        action: body.action,
      })

      if (body.action === 'publish') {
        // Validar UUID do quiz
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.quizId)) {
          return NextResponse.json(
            { error: 'Quiz ID inválido' },
            { status: 400 }
          )
        }

        // Publicar quiz
        const quiz = await quizDB.publishQuiz(body.quizId)
        return NextResponse.json({ success: true, quiz })
      }

      // Atualizar dados do quiz
      if (!body.quizId || !body.quizData) {
        return NextResponse.json(
          { error: 'Dados obrigatórios não fornecidos' },
          { status: 400 }
        )
      }

      // Processar short_code se fornecido
      const updateData: any = {
        ...body.quizData,
        updated_at: new Date().toISOString(),
      }

      // Remover short_code se solicitado
      if (body.remove_short_code === true) {
        updateData.short_code = null
      } else if (body.generate_short_url || body.custom_short_code) {
        // Buscar quiz atual para verificar se já tem short_code
        const { data: existingQuiz } = await supabaseAdmin
          .from('quizzes')
          .select('short_code')
          .eq('id', body.quizId)
          .single()

        if (!existingQuiz?.short_code) {
          // Só gerar se não tiver
          if (body.custom_short_code) {
            const customCode = body.custom_short_code.toLowerCase().trim()
            
            // Validar formato
            if (!/^[a-z0-9-]{3,10}$/.test(customCode)) {
              return NextResponse.json(
                { error: 'Código personalizado inválido. Deve ter entre 3 e 10 caracteres e conter apenas letras, números e hífens.' },
                { status: 400 }
              )
            }

            // Verificar disponibilidade (em todas as tabelas)
            const [existingInQuizzes, existingInPortals, existingInTemplates] = await Promise.all([
              supabaseAdmin.from('quizzes').select('id').eq('short_code', customCode).neq('id', body.quizId).limit(1),
              supabaseAdmin.from('wellness_portals').select('id').eq('short_code', customCode).limit(1),
              supabaseAdmin.from('user_templates').select('id').eq('short_code', customCode).limit(1),
            ])

            if ((existingInQuizzes.data && existingInQuizzes.data.length > 0) ||
                (existingInPortals.data && existingInPortals.data.length > 0) ||
                (existingInTemplates.data && existingInTemplates.data.length > 0)) {
              return NextResponse.json(
                { error: 'Este código personalizado já está em uso' },
                { status: 409 }
              )
            }

            updateData.short_code = customCode
          } else if (body.generate_short_url) {
            // Gerar código aleatório
            const { data: codeData, error: codeError } = await supabaseAdmin.rpc('generate_unique_short_code')
            if (!codeError && codeData) {
              updateData.short_code = codeData
            } else {
              console.error('Erro ao gerar código curto:', codeError)
            }
          }
        }
      }

      const { data, error } = await supabaseAdmin
        .from('quizzes')
        .update(updateData)
        .eq('id', body.quizId)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar quiz:', error)
        return NextResponse.json(
          { error: 'Erro ao atualizar quiz' },
          { status: 500 }
        )
      }

      // Se houver perguntas, atualizá-las
      if (body.perguntas && body.perguntas.length > 0) {
        // Validar número de perguntas
        if (body.perguntas.length > 20) {
          return NextResponse.json(
            { error: 'Máximo de 20 perguntas permitido' },
            { status: 400 }
          )
        }

        // Deletar perguntas antigas
        await supabaseAdmin
          .from('quiz_perguntas')
          .delete()
          .eq('quiz_id', body.quizId)

        // Inserir novas perguntas
        const perguntasData = body.perguntas.map((p: any, index: number) => ({
          quiz_id: body.quizId,
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
          console.error('Erro ao atualizar perguntas:', perguntasError)
          return NextResponse.json(
            { error: 'Erro ao atualizar perguntas' },
            { status: 500 }
          )
        }
      }

      return NextResponse.json({ success: true, quiz: data })
    } catch (error: any) {
      console.error('Erro ao atualizar quiz:', error)

      if (error.name === 'ZodError') {
        return NextResponse.json(
          { 
            error: 'Dados inválidos',
            details: error.errors 
          },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }, { limit: 10, window: 60 })
}

// DELETE: Deletar quiz
export async function DELETE(request: NextRequest) {
  return withRateLimit(request, 'quiz-delete', async () => {
    try {
      const { searchParams } = new URL(request.url)
      const quizId = searchParams.get('quizId')

      if (!quizId) {
        return NextResponse.json(
          { error: 'Quiz ID não fornecido' },
          { status: 400 }
        )
      }

      // Validar UUID
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(quizId)) {
        return NextResponse.json(
          { error: 'Quiz ID inválido' },
          { status: 400 }
        )
      }

      const { error } = await supabaseAdmin
        .from('quizzes')
        .delete()
        .eq('id', quizId)

      if (error) {
        console.error('Erro ao deletar quiz:', error)
        return NextResponse.json(
          { error: 'Erro ao deletar quiz' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Erro ao deletar quiz:', error)
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }, { limit: 5, window: 60 })
}

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

// Mapeamento de categoria selecionada → categoria do banco e seção
const MAPEAMENTO_CATEGORIA = {
  recrutamento: {
    categoria_banco: 'treinamento',
    tags: ['recrutamento', 'treinamento'],
    secao: 'videos' // ou 'cartilhas' dependendo do tipo
  },
  vendas: {
    categoria_banco: 'apresentacao',
    tags: ['vendas', 'apresentacao'],
    secao: 'materiais' // ou 'videos' dependendo do tipo
  },
  treinamento: {
    categoria_banco: 'treinamento',
    tags: ['treinamento'],
    secao: 'cartilhas'
  },
  produtos: {
    categoria_banco: 'produto',
    tags: ['produtos', 'bebidas'],
    secao: 'produtos'
  },
  scripts: {
    categoria_banco: 'script',
    tags: ['scripts'],
    secao: 'scripts'
  },
  apresentacoes: {
    categoria_banco: 'apresentacao',
    tags: ['apresentacao'],
    secao: 'materiais'
  }
} as const

type CategoriaSelecionada = keyof typeof MAPEAMENTO_CATEGORIA

// POST - Upload de material para biblioteca
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação (apenas admin)
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    // Verificar se é admin
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('profile_type')
      .eq('user_id', user.id)
      .single()

    if (!profile || profile.profile_type !== 'admin') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores podem fazer upload.' },
        { status: 403 }
      )
    }

    // Obter dados do FormData
    const formData = await request.formData()
    const file = formData.get('file') as File
    const categoriaSelecionada = formData.get('categoria') as CategoriaSelecionada
    const titulo = formData.get('titulo') as string | null
    const descricao = formData.get('descricao') as string | null

    // Validações
    if (!file) {
      return NextResponse.json(
        { error: 'Arquivo não fornecido' },
        { status: 400 }
      )
    }

    if (!categoriaSelecionada || !MAPEAMENTO_CATEGORIA[categoriaSelecionada]) {
      return NextResponse.json(
        { error: 'Categoria inválida' },
        { status: 400 }
      )
    }

    // Detectar tipo de arquivo
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || ''
    let tipo: 'pdf' | 'video' | 'imagem' | 'documento' | 'link'
    
    if (['pdf'].includes(fileExtension)) {
      tipo = 'pdf'
    } else if (['mp4', 'mpeg', 'mov', 'avi', 'webm'].includes(fileExtension)) {
      tipo = 'video'
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
      tipo = 'imagem'
    } else {
      tipo = 'documento'
    }

    // Ajustar seção baseado no tipo
    const mapeamento = MAPEAMENTO_CATEGORIA[categoriaSelecionada]
    let secaoFinal = mapeamento.secao
    
    // Se for vídeo e categoria é recrutamento/vendas, vai para videos
    if (tipo === 'video' && ['recrutamento', 'vendas'].includes(categoriaSelecionada)) {
      secaoFinal = 'videos'
    }
    // Se for PDF e categoria é recrutamento, pode ir para cartilhas
    if (tipo === 'pdf' && categoriaSelecionada === 'recrutamento') {
      secaoFinal = 'cartilhas'
    }

    // Gerar código único
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 9)
    const nomeBase = (titulo || file.name)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50)
    const codigo = `${tipo}-${categoriaSelecionada}-${timestamp}-${random}`

    // Determinar pasta no storage baseado no tipo e categoria
    const pastaStorage = tipo === 'video' 
      ? `videos/${categoriaSelecionada}`
      : tipo === 'pdf'
      ? `pdfs/${categoriaSelecionada}`
      : `imagens/${categoriaSelecionada}`
    
    const nomeArquivo = `${pastaStorage}/${timestamp}-${random}-${nomeBase}.${fileExtension}`
    
    // Converter File para Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Fazer upload para Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('wellness-biblioteca')
      .upload(nomeArquivo, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('❌ Erro no upload:', uploadError)
      return NextResponse.json(
        { 
          error: `Erro ao fazer upload: ${uploadError.message}`,
          details: uploadError
        },
        { status: 500 }
      )
    }

    // Obter URL pública
    const { data: urlData } = supabaseAdmin.storage
      .from('wellness-biblioteca')
      .getPublicUrl(uploadData.path)

    // Criar registro no banco
    const { data: material, error: dbError } = await supabaseAdmin
      .from('wellness_materiais')
      .insert({
        codigo,
        titulo: titulo || file.name.replace(/\.[^/.]+$/, ''),
        descricao: descricao || null,
        tipo,
        categoria: mapeamento.categoria_banco,
        url: urlData.publicUrl,
        arquivo_path: uploadData.path,
        tamanho_bytes: file.size,
        tags: mapeamento.tags,
        ativo: true,
        ordem: 0
      })
      .select()
      .single()

    if (dbError) {
      console.error('❌ Erro ao salvar no banco:', dbError)
      // Tentar deletar arquivo do storage se salvamento falhou
      await supabaseAdmin.storage
        .from('wellness-biblioteca')
        .remove([uploadData.path])
      
      return NextResponse.json(
        { 
          error: `Erro ao salvar material: ${dbError.message}`,
          details: dbError
        },
        { status: 500 }
      )
    }

    console.log('✅ Material adicionado com sucesso:', {
      codigo,
      titulo: material.titulo,
      tipo,
      categoria: material.categoria,
      secao: secaoFinal
    })

    return NextResponse.json({
      success: true,
      material: {
        ...material,
        secao: secaoFinal
      }
    })
  } catch (error: any) {
    console.error('❌ Erro ao fazer upload:', error)
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

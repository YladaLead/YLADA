import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireApiAuth } from '@/lib/api-auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * API Route para buscar no banco próprio de mídia (media_library)
 * Prioridade: banco próprio → APIs externas → DALL-E
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { 
      query, 
      type = 'image', // 'image' | 'video' | 'audio'
      area, // 'nutri' | 'coach' | 'wellness' | 'nutra'
      purpose, // 'hook' | 'dor' | 'solucao' | 'cta'
      count = 8,
      minRelevance = 30 // Score mínimo de relevância
    } = body

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Query deve ter pelo menos 2 caracteres' },
        { status: 400 }
      )
    }

    // Normalizar query para busca
    const searchQuery = query.toLowerCase().trim()
    const searchTerms = searchQuery.split(/\s+/).filter(term => term.length > 2)

    // Construir query do Supabase
    let supabaseQuery = supabase
      .from('media_library')
      .select('*')
      .eq('media_type', type)
      .eq('is_active', true)
      .gte('relevance_score', minRelevance)
      .order('relevance_score', { ascending: false })
      .order('usage_count', { ascending: false })
      .limit(count)

    // Filtro por área (se especificado)
    if (area && area !== 'all') {
      supabaseQuery = supabaseQuery.or(`area.eq.${area},area.eq.all`)
    }

    // Filtro por propósito (se especificado)
    if (purpose && purpose !== 'all') {
      supabaseQuery = supabaseQuery.or(`purpose.eq.${purpose},purpose.eq.all`)
    }

    // Busca por tags (usando array contains)
    if (searchTerms.length > 0) {
      // Buscar por tags que contenham os termos
      const tagFilters = searchTerms.map(term => `tags.cs.{${term}}`).join(',')
      supabaseQuery = supabaseQuery.or(tagFilters)
    }

    // Busca por título/descrição (text search)
    if (searchQuery.length > 0) {
      supabaseQuery = supabaseQuery.or(
        `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
      )
    }

    const { data, error } = await supabaseQuery

    if (error) {
      console.error('Erro ao buscar no media_library:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar no banco de mídia', details: error.message },
        { status: 500 }
      )
    }

    // Transformar resultados para formato esperado
    const results = (data || []).map((item: any) => ({
      id: item.id,
      url: item.file_url,
      thumbnail: item.file_url, // Por enquanto, usar a mesma URL
      source: item.source || 'media_library',
      title: item.title,
      description: item.description,
      tags: item.tags || [],
      area: item.area,
      purpose: item.purpose,
      relevance_score: item.relevance_score,
      width: item.width,
      height: item.height,
      duration: item.duration,
      type: item.media_type,
    }))

    // Incrementar contador de uso (async, não bloqueia resposta)
    if (results.length > 0) {
      const ids = results.map(r => r.id)
      supabase
        .from('media_library')
        .update({ usage_count: supabase.raw('usage_count + 1') })
        .in('id', ids)
        .then(() => {
          // Log silencioso
        })
        .catch(err => {
          console.error('Erro ao incrementar usage_count:', err)
        })
    }

    return NextResponse.json({
      [type === 'image' ? 'images' : type === 'video' ? 'videos' : 'audios']: results,
      total: results.length,
      source: 'media_library',
      query: searchQuery,
    })
  } catch (error: any) {
    console.error('Erro na busca media_library:', error)
    return NextResponse.json(
      { error: 'Erro ao processar busca', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}



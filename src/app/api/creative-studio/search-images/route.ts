import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * API Route para buscar imagens/vídeos de APIs externas (Unsplash, Pexels)
 * e criar imagens com DALL-E
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação (apenas admin)
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { query, type = 'search', count = 5 } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Query é obrigatória' },
        { status: 400 }
      )
    }

    // Buscar vídeos do Pexels (gratuito)
    if (type === 'search-videos') {
      return await searchPexelsVideos(query, count)
    }

    // Buscar imagens do Pexels (gratuito, sem API key obrigatória)
    if (type === 'search') {
      try {
        const pexelsApiKey = process.env.PEXELS_API_KEY || ''
        const headers: HeadersInit = {
          'Authorization': pexelsApiKey || '',
        }

        const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`
        
        const response = await fetch(pexelsUrl, {
          headers: pexelsApiKey ? headers : undefined,
        })

        if (!response.ok) {
          // Se Pexels falhar, tentar Unsplash
          return await searchUnsplash(query, count)
        }

        const data = await response.json()
        
        const images = data.photos?.map((photo: any) => ({
          id: photo.id,
          url: photo.src.large || photo.src.medium,
          thumbnail: photo.src.small,
          photographer: photo.photographer,
          photographerUrl: photo.photographer_url,
          width: photo.width,
          height: photo.height,
          source: 'pexels',
        })) || []

        return NextResponse.json({
          images,
          total: data.total_results || images.length,
          source: 'pexels',
        })
      } catch (error) {
        // Fallback para Unsplash
        return await searchUnsplash(query, count)
      }
    }

    // Criar imagem com DALL-E
    if (type === 'create') {
      const openaiApiKey = process.env.OPENAI_API_KEY
      if (!openaiApiKey) {
        return NextResponse.json(
          { error: 'OpenAI API key não configurada' },
          { status: 500 }
        )
      }

      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: query,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        return NextResponse.json(
          { error: error.error?.message || 'Erro ao criar imagem' },
          { status: response.status }
        )
      }

      const data = await response.json()
      
      return NextResponse.json({
        images: data.data.map((img: any) => ({
          id: `dalle-${Date.now()}`,
          url: img.url,
          thumbnail: img.url,
          source: 'dalle',
          prompt: query,
        })),
        total: data.data.length,
        source: 'dalle',
      })
    }

    return NextResponse.json(
      { error: 'Tipo inválido. Use "search", "search-videos" ou "create"' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Erro ao buscar/criar imagens:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar/criar imagens' },
      { status: 500 }
    )
  }
}

// Função auxiliar para buscar no Unsplash
async function searchUnsplash(query: string, count: number) {
  try {
    const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY || ''
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`
    
    const headers: HeadersInit = {}
    if (unsplashApiKey) {
      headers['Authorization'] = `Client-ID ${unsplashApiKey}`
    }

    const response = await fetch(unsplashUrl, {
      headers: unsplashApiKey ? headers : undefined,
    })

    if (!response.ok) {
      throw new Error('Unsplash API error')
    }

    const data = await response.json()
    
    const images = data.results?.map((photo: any) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumbnail: photo.urls.thumb,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
      width: photo.width,
      height: photo.height,
      source: 'unsplash',
    })) || []

    return NextResponse.json({
      images,
      total: data.total || images.length,
      source: 'unsplash',
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Não foi possível buscar imagens. Configure PEXELS_API_KEY ou UNSPLASH_ACCESS_KEY nas variáveis de ambiente.',
        images: [],
        total: 0,
      },
      { status: 200 } // Retorna 200 mas com erro para não quebrar o fluxo
    )
  }
}

// Função auxiliar para buscar vídeos no Pexels
async function searchPexelsVideos(query: string, count: number) {
  try {
    const pexelsApiKey = process.env.PEXELS_API_KEY || ''
    const headers: HeadersInit = {}
    if (pexelsApiKey) {
      headers['Authorization'] = pexelsApiKey
    }

    // Pexels Videos API
    const pexelsUrl = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`
    
    const response = await fetch(pexelsUrl, {
      headers: pexelsApiKey ? headers : undefined,
    })

    if (!response.ok) {
      // Se não tiver API key ou falhar, retornar erro amigável
      if (response.status === 401) {
        return NextResponse.json({
          error: 'PEXELS_API_KEY não configurada. Configure nas variáveis de ambiente para buscar vídeos.',
          videos: [],
          total: 0,
        }, { status: 200 }) // Retorna 200 para não quebrar o fluxo
      }
      throw new Error(`Pexels API error: ${response.status}`)
    }

    const data = await response.json()
    
    const videos = data.videos?.map((video: any) => ({
      id: video.id,
      url: video.video_files?.[0]?.link || video.video_files?.[video.video_files.length - 1]?.link,
      thumbnail: video.image || video.picture,
      duration: video.duration || 0,
      width: video.width || 1920,
      height: video.height || 1080,
      photographer: video.user?.name || 'Pexels',
      photographerUrl: video.user?.url || 'https://www.pexels.com',
      source: 'pexels',
      // Informações adicionais do vídeo
      videoFiles: video.video_files?.map((file: any) => ({
        quality: file.quality,
        width: file.width,
        height: file.height,
        link: file.link,
      })) || [],
    })) || []

    return NextResponse.json({
      videos,
      total: data.total_results || videos.length,
      source: 'pexels',
    })
  } catch (error: any) {
    console.error('Erro ao buscar vídeos:', error)
    return NextResponse.json({
      error: 'Não foi possível buscar vídeos. Configure PEXELS_API_KEY nas variáveis de ambiente.',
      videos: [],
      total: 0,
    }, { status: 200 }) // Retorna 200 para não quebrar o fluxo
  }
}


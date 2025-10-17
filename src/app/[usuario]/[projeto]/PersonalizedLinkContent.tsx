'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
// import { getToolMessage } from '@/lib/tool-messages' // Removido - não usado
import HelpButton from '@/components/HelpButton'

interface PersonalizedLinkContentProps {
  params: {
    usuario: string
    projeto: string
  }
}

export default function PersonalizedLinkContent({ params }: PersonalizedLinkContentProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [linkData, setLinkData] = useState<{
    name?: string
    tool_name?: string
    redirect_url?: string
    cta_text?: string
    custom_message?: string
    capture_type?: string
    material_title?: string
    material_description?: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const usuario = params.usuario
  const projeto = params.projeto

  // Função para normalizar texto removendo acentos e caracteres especiais
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/[^a-z0-9-]/g, '') // Remove caracteres especiais
      .replace(/-+/g, '-') // Remove hífens duplicados
      .replace(/^-|-$/g, '') // Remove hífens do início e fim
  }

  // Função alternativa para normalização mais robusta
  const normalizeTextRobust = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s]/g, '') // Remove caracteres especiais exceto espaços
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .replace(/^-|-$/g, '') // Remove hífens do início e fim
  }

  useEffect(() => {
    // LIMPAR CACHE ANTES DE CARREGAR DADOS
    console.log('🧹 Limpando cache antes de carregar dados...')
    
    // Limpar localStorage de dados antigos
    if (typeof window !== 'undefined') {
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.includes('user') || key.includes('phone') || key.includes('whatsapp') || key.includes('link'))) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => {
        console.log(`🗑️ Removendo cache: ${key}`)
        localStorage.removeItem(key)
      })
    }
    
    // TIMEOUT DE SEGURANÇA - evita travamento infinito
    const timeoutId = setTimeout(() => {
      console.error('⏰ TIMEOUT - Link não carregou em 10 segundos')
      setError('Timeout - Link não carregou')
      setLoading(false)
    }, 10000)

    const loadLinkData = async () => {
      try {
        console.log('🔍 INICIANDO BUSCA - Link para:', { usuario, projeto })
        console.log('🔍 Timestamp:', new Date().toISOString())
        
        // Buscar todos os profissionais e comparar com o slug normalizado
        const { data: allProfessionals, error: profError } = await supabase
          .from('professionals')
          .select('id, name, email, phone')
        
        if (profError) {
          console.error('❌ Erro ao buscar professionals:', profError)
          setError('Erro interno do servidor')
          return
        }
        
        // Encontrar o profissional - SOLUÇÃO SIMPLES E DIRETA
        console.log(`🔍 Buscando profissional para slug: "${usuario}"`)
        console.log(`📋 Total de profissionais encontrados: ${allProfessionals?.length || 0}`)
        
        // Listar todos os profissionais para debug
        allProfessionals?.forEach((prof, index) => {
          console.log(`  ${index + 1}. "${prof.name}" (ID: ${prof.id})`)
        })
        
        // Busca PRECISA: encontrar por correspondência exata ou muito próxima
        const professional = allProfessionals?.find(prof => {
          const nameLower = prof.name.toLowerCase().trim()
          const slugLower = usuario.toLowerCase().trim()
          
          console.log(`🔍 Testando profissional: "${prof.name}"`)
          console.log(`  - Nome normalizado: "${nameLower}"`)
          console.log(`  - Slug esperado: "${slugLower}"`)
          
          // Estratégia 1: Match exato após normalização
          const normalizedName = nameLower.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
          if (normalizedName === slugLower) {
            console.log(`✅ MATCH EXATO encontrado!`)
            return true
          }
          
          // Estratégia 2: Match por partes (mais restritivo)
          const nameParts = nameLower.split(/\s+/).filter(part => part.length > 2)
          const slugParts = slugLower.split('-').filter(part => part.length > 2)
          
          // Verificar se TODAS as partes do slug estão presentes no nome
          const allSlugPartsMatch = slugParts.every(slugPart => 
            nameParts.some(namePart => 
              namePart.startsWith(slugPart) || slugPart.startsWith(namePart)
            )
          )
          
          console.log(`  - Partes do nome: [${nameParts.join(', ')}]`)
          console.log(`  - Partes do slug: [${slugParts.join(', ')}]`)
          console.log(`  - Match por partes: ${allSlugPartsMatch}`)
          
          return allSlugPartsMatch
        })
        
        if (!professional) {
          console.log('❌ Nenhum profissional encontrado para slug:', usuario)
          setError('Usuário não encontrado')
          return
        }
        
        console.log('✅ Professional encontrado:', professional.name)

        // Buscar todos os links do usuário e comparar com o slug normalizado
        const { data: allLinks, error: linksError } = await supabase
          .from('links')
          .select('*')
          .eq('user_id', professional.id)
        
        if (linksError) {
          console.error('❌ Erro ao buscar links:', linksError)
          setError('Erro interno do servidor')
          return
        }
        
        // Encontrar o link cujo nome normalizado corresponde ao slug do projeto
        // Tentar múltiplas estratégias de normalização
        const link = allLinks?.find(linkItem => {
          const normalized1 = normalizeText(linkItem.name)
          const normalized2 = normalizeTextRobust(linkItem.name)
          const normalized3 = linkItem.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
          
          console.log(`🔍 Testando link: ${linkItem.name}`)
          console.log(`  - Normalizado 1: ${normalized1}`)
          console.log(`  - Normalizado 2: ${normalized2}`)
          console.log(`  - Normalizado 3: ${normalized3}`)
          console.log(`  - Slug esperado: ${projeto}`)
          
          return normalized1 === projeto || normalized2 === projeto || normalized3 === projeto
        })
        
        if (!link) {
          console.log('❌ Nenhum link encontrado para projeto:', projeto)
          setError('Link não encontrado')
          return
        }
        
        console.log('✅ Link encontrado:', link.name)
        
        // Incrementar cliques
        await supabase
          .from('links')
          .update({ clicks: (link.clicks || 0) + 1 })
          .eq('id', link.id)

        setLinkData(link)
        
        // REDIRECIONAMENTO AUTOMÁTICO para a ferramenta baseada no tool_name
        if (link.tool_name) {
          console.log('🚀 Redirecionando para ferramenta:', link.tool_name)
          console.log('🔍 Link completo:', link)
          
          // Mapear tool_name para a URL da ferramenta (versão completa)
          const toolUrls: { [key: string]: string } = {
            'bmi': '/calculators/bmi',
            'protein': '/calculators/protein',
            'hydration': '/calculators/hydration',
            'body-composition': '/calculators/body-composition',
            'meal-planner': '/calculators/meal-planner',
            'nutrition-assessment': '/calculators/nutrition-assessment',
            'wellness-profile': '/quiz-builder',
            'daily-wellness': '/calculators/daily-wellness',
            'healthy-eating': '/calculators/healthy-eating',
            'recruitment-potencial': '/quiz/potencial',
            'recruitment-ganhos': '/quiz/ganhos',
            'recruitment-proposito': '/quiz/proposito'
          }
          
          const toolUrl = toolUrls[link.tool_name]
          console.log('🎯 URL da ferramenta:', toolUrl)
          console.log('⚠️ Se está indo para IMC, o tool_name pode estar incorreto:', link.tool_name)
          console.log('🔍 Mapeamento completo:', toolUrls)
          console.log('🚨 REDIRECIONANDO PARA:', toolUrl)
          
          if (!toolUrl) {
            console.error('❌ FERRAMENTA NÃO ENCONTRADA:', link.tool_name)
            setError(`Ferramenta "${link.tool_name}" não encontrada`)
            return
          }
          
          // Passar dados do usuário via URL para a calculadora
          const userData = {
            userId: link.user_id,
            userName: link.name,
            userPhone: professional?.phone || '5519981868000', // Usar telefone do profissional ou fallback
            linkId: link.id,
            customMessage: link.page_greeting || 'Quer receber orientações personalizadas? Clique abaixo e fale comigo!', // Mensagem personalizada do link (page_greeting)
            pageTitle: link.page_title || 'Quer uma análise mais completa?', // Título personalizado
            buttonText: link.button_text || 'Consultar Especialista' // Texto do botão personalizado
          }
          
          console.log('🔍 Debug redirecionamento:')
          console.log('  - professional:', professional)
          console.log('  - professional.phone:', professional?.phone)
          console.log('  - link.custom_message:', link.custom_message)
          console.log('  - link.page_greeting:', link.page_greeting)
          console.log('  - userData:', userData)
          console.log('  - customMessage sendo passado:', userData.customMessage)
          
          const params = new URLSearchParams({
            user: JSON.stringify(userData)
          })
          
          const finalUrl = `${toolUrl}?${params.toString()}`
          console.log('🚀 Redirecionando para:', finalUrl)
          
          // REDIRECIONAMENTO SEGURO - com timeout para evitar travamento
          setTimeout(() => {
            try {
              window.location.href = finalUrl
            } catch (error) {
              console.error('❌ Erro no redirecionamento:', error)
              setError('Erro no redirecionamento')
            }
          }, 100)
          return
        }
      } catch (error) {
        console.error('❌ Erro ao carregar link:', error)
        setError('Erro interno do servidor')
      } finally {
        clearTimeout(timeoutId) // Limpar timeout se carregou com sucesso
        setLoading(false)
      }
    }

    if (usuario && projeto) {
      loadLinkData()
    }

    // Cleanup do timeout
    return () => clearTimeout(timeoutId)
  }, [usuario, projeto])

  const handleRedirect = () => {
    if (linkData?.redirect_url && typeof linkData.redirect_url === 'string') {
      window.open(linkData.redirect_url, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Link não encontrado</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    )
  }

  // Obter mensagem personalizada baseada na ferramenta
  // const toolMessage = linkData?.tool_name ? getToolMessage(linkData.tool_name) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {linkData?.name}
            </h1>
            <p className="text-gray-600">
              Ferramenta: {linkData?.tool_name}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {linkData?.custom_message || 'Quer receber orientações personalizadas?'}
              </h2>
              
              <button
                onClick={handleRedirect}
                className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
              >
                {linkData?.cta_text || 'Falar com Especialista'}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm">
            <p>Powered by Herbalead</p>
          </div>
        </div>
      </div>
      
      {/* Botão de Ajuda */}
      <HelpButton />
    </div>
  )
}

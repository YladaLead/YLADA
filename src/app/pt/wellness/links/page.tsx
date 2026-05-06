'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useWellnessProfile } from '@/hooks/useWellnessProfile'
import { fluxosRecrutamento } from '@/lib/wellness-system/fluxos-recrutamento'
import { fluxosClientes } from '@/lib/wellness-system/fluxos-clientes'
import { FluxoCliente } from '@/types/wellness-system'
import { getAppUrl, buildWellnessToolUrl } from '@/lib/url-utils'
import { WELLNESS_HYPE_MEUS_LINKS } from '@/lib/wellness/wellness-hype-meus-links'
import dynamic from 'next/dynamic'
import QRCode from '@/components/QRCode'
import FluxoDiagnostico from '@/components/wellness-system/FluxoDiagnostico'
import ScriptsModal from '@/components/wellness/ScriptsModal'
import { getScriptsPorSlug, getScriptsPorTipo } from '@/lib/wellness-system/scripts-por-ferramenta'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/ui/Toast'

/** Obtém mensagem sugerida para enviar junto (link ou QR) - mesmo formato do link */
function obterMensagemSugeridaParaCompartilhar(item: ItemUnificado): string {
  const link = item.link || ''
  const slug = item.metadata?.template?.slug || item.metadata?.fluxo?.id || item.id
  const config = getScriptsPorSlug(String(slug))
  if (config) {
    const { listaQuente } = getScriptsPorTipo(config)
    const primeiroComLink = listaQuente?.find(s => s.texto.includes('[LINK]'))
    if (primeiroComLink) {
      return primeiroComLink.texto.replace(/\[LINK\]/g, link)
    }
  }
  return `Olá! Segue meu link da ferramenta "${item.nome}":\n\n${link}`
}

// Lazy load dos previews
const DynamicTemplatePreview = dynamic(() => import('@/components/shared/DynamicTemplatePreview'), { ssr: false })
const WellnessLanding = dynamic(() => import('@/components/wellness/WellnessLanding'), { ssr: false })

interface Template {
  id: string
  nome: string
  slug: string
  type: string
  categoria: string
  description?: string
  icon?: string
}

interface ItemUnificado {
  id: string
  nome: string
  tipo: 'template' | 'fluxo-recrutamento' | 'fluxo-vendas'
  categoria: string
  link: string
  descricao?: string
  icon?: string
  metadata?: any
  views?: number
  leads?: number
  conversions?: number
}

function LinksUnificadosPageContent() {
  const searchParams = useSearchParams()
  const { profile, loading: loadingProfile } = useWellnessProfile()
  const [templates, setTemplates] = useState<Template[]>([])
  const [carregandoTemplates, setCarregandoTemplates] = useState(true)
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'recrutamento' | 'vendas' | 'hype'>('todos')
  const [busca, setBusca] = useState('')
  const [modoRanking, setModoRanking] = useState(false)
  const [ordenarPor, setOrdenarPor] = useState<'visualizacoes' | 'conversoes'>('visualizacoes')

  // Verificar se veio da home com parâmetro de ranking
  useEffect(() => {
    if (searchParams.get('ranking') === 'true') {
      setModoRanking(true)
    }
  }, [searchParams])
  const [previewAberto, setPreviewAberto] = useState<string | null>(null)
  const [linkCopiado, setLinkCopiado] = useState<string | null>(null)
  const [qrCopiado, setQrCopiado] = useState<string | null>(null)
  const { toasts, showSuccess, showError, showWarning, removeToast } = useToast()
  const [homMensagemCopiada, setHomMensagemCopiada] = useState(false)
  const [scriptsAberto, setScriptsAberto] = useState<{
    nome: string
    slug?: string
    icon?: string
    link?: string
  } | null>(null)

  const baseUrl = getAppUrl()
  const whatsappGroupInviteUrl = (
    process.env.NEXT_PUBLIC_WELLNESS_WHATSAPP_GROUP_INVITE_URL ||
    'https://chat.whatsapp.com/G5qbyl5Ks2E3QebmYDu0mP'
  ).trim()

  // Função para gerar slug amigável a partir do nome do fluxo
  const gerarSlugFluxo = (nome: string): string => {
    return nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // Carregar templates
  useEffect(() => {
    const carregarTemplates = async () => {
      try {
        setCarregandoTemplates(true)
        const response = await fetch('/api/wellness/templates', {
          cache: 'no-store'
        })

        if (response.ok) {
          const data = await response.json()
          if (data.templates && data.templates.length > 0) {
            const templatesFormatados = data.templates
              .filter((t: any) => t.nome && t.nome.trim())
              .map((t: any) => {
                const templateFormatado = {
                  id: t.id || t.slug,
                  nome: t.nome || t.name,
                  name: t.name || t.nome,
                  slug: t.slug,
                  type: t.type || 'calculadora',
                  categoria: t.categoria || 'Outros',
                  description: t.description || t.descricao || t.objetivo,
                  descricao: t.descricao || t.description || t.objetivo,
                  objetivo: t.objetivo,
                  icon: t.icon,
                  content: t.content, // IMPORTANTE: Content completo para o preview funcionar
                  specialization: t.specialization,
                  templateId: t.templateId || t.id
                }
                
                // Debug: verificar se content está presente
                if (!templateFormatado.content) {
                  console.warn('⚠️ Template sem content:', {
                    nome: templateFormatado.nome,
                    slug: templateFormatado.slug,
                    id: templateFormatado.id
                  })
                } else {
                  console.log('✅ Template com content:', {
                    nome: templateFormatado.nome,
                    slug: templateFormatado.slug,
                    temContent: !!templateFormatado.content,
                    contentKeys: templateFormatado.content ? Object.keys(templateFormatado.content) : []
                  })
                }
                
                return templateFormatado
              })
            setTemplates(templatesFormatados)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar templates:', error)
      } finally {
        setCarregandoTemplates(false)
      }
    }

    carregarTemplates()
  }, [])

  // Estado para armazenar ferramentas criadas pelo usuário
  const [ferramentasUsuario, setFerramentasUsuario] = useState<Record<string, string>>({}) // template_slug -> tool_slug
  // Estado para armazenar estatísticas das ferramentas
  const [estatisticasFerramentas, setEstatisticasFerramentas] = useState<Record<string, { views: number; leads: number; conversions: number }>>({}) // slug -> estatísticas

  // Carregar ferramentas criadas pelo usuário e estatísticas unificadas (link_events)
  useEffect(() => {
    const carregarFerramentasUsuario = async () => {
      if (!profile?.userSlug) return

      try {
        const response = await fetch('/api/wellness/ferramentas?profession=wellness', {
          credentials: 'include'
        })

        if (!response.ok) return
        const data = await response.json()
        const tools = data.tools || []

        const mapa: Record<string, string> = {}
        const statsMap: Record<string, { views: number; leads: number; conversions: number }> = {}

        tools.forEach((tool: any) => {
          if (tool.template_slug && tool.slug) mapa[tool.template_slug] = tool.slug
          if (tool.slug) {
            statsMap[tool.slug] = {
              views: tool.views || 0,
              leads: tool.leads_count || 0,
              conversions: tool.conversions_count || 0
            }
          }
        })
        setFerramentasUsuario(mapa)

        // Contagem unificada: priorizar link_events (area wellness)
        const linkIds = tools.map((t: any) => t.id).filter(Boolean)
        if (linkIds.length > 0) {
          try {
            const statsRes = await fetch(
              `/api/link-events/stats?area=wellness&link_source=user_template&link_ids=${linkIds.join(',')}`,
              { credentials: 'include' }
            )
            if (statsRes.ok) {
              const statsData = await statsRes.json()
              const byLink = (statsData.data?.by_link || []) as Array<{
                link_id: string
                view: number
                whatsapp_click: number
                lead_capture: number
              }>
              const byLinkMap: Record<string, { view: number; whatsapp_click: number; lead_capture: number }> = {}
              byLink.forEach((x: any) => {
                byLinkMap[x.link_id] = {
                  view: x.view ?? 0,
                  whatsapp_click: x.whatsapp_click ?? 0,
                  lead_capture: x.lead_capture ?? 0
                }
              })
              tools.forEach((tool: any) => {
                if (!tool.slug) return
                const c = byLinkMap[tool.id]
                if (c) {
                  statsMap[tool.slug] = {
                    views: c.view,
                    leads: c.lead_capture,
                    conversions: c.whatsapp_click
                  }
                }
              })
            }
          } catch (_) {
            // manter fallback dos dados do tool
          }
        }

        setEstatisticasFerramentas(statsMap)
      } catch (error) {
        console.error('Erro ao carregar ferramentas do usuário:', error)
      }
    }

    carregarFerramentasUsuario()
  }, [profile?.userSlug])

  // Gerar link para template (usando buildWellnessToolUrl)
  const gerarLinkTemplate = (template: Template): string | null => {
    if (!profile?.userSlug) {
      console.warn('userSlug não disponível para template:', template.nome)
      return null
    }
    if (!template.slug) {
      console.warn('slug não disponível para template:', template.nome, 'template completo:', template)
      return null
    }
    
    // Verificar se o usuário já criou uma ferramenta baseada neste template
    const toolSlug = ferramentasUsuario[template.slug] || template.slug
    
    const link = buildWellnessToolUrl(profile.userSlug, toolSlug)
    console.log('✅ Link gerado para template:', { 
      nome: template.nome, 
      templateSlug: template.slug,
      toolSlug,
      link,
      temContent: !!template.content,
      ferramentaCriada: !!ferramentasUsuario[template.slug]
    })
    return link
  }

  // Gerar link para fluxo de recrutamento (URL simples: user_slug + slug)
  const gerarLinkFluxoRecrutamento = (fluxo: FluxoCliente): string | null => {
    if (!profile?.userSlug) return null
    const slug = gerarSlugFluxo(fluxo.nome)
    return buildWellnessToolUrl(profile.userSlug, slug)
  }

  // Gerar link para fluxo de vendas (URL simples: user_slug + slug)
  const gerarLinkFluxoVendas = (fluxo: FluxoCliente): string | null => {
    if (!profile?.userSlug) return null
    const slug = gerarSlugFluxo(fluxo.nome)
    return buildWellnessToolUrl(profile.userSlug, slug)
  }

  // Gerar link próprio da HOM (como as ferramentas)
  const gerarLinkHOM = (): string | null => {
    if (!profile?.userSlug) {
      return null
    }
    return buildWellnessToolUrl(profile.userSlug, 'hom')
  }

  // Função para remover duplicatas - manter apenas um template por nome
  const removerDuplicatas = (templatesList: Template[]): Template[] => {
    const seen = new Map<string, Template>()
    
    templatesList.forEach(template => {
      const nomeNormalizado = (template.nome || '').toLowerCase().trim()
      const slug = (template.slug || '').toLowerCase().trim()
      
      // Se já vimos este nome, decidir qual manter
      if (seen.has(nomeNormalizado)) {
        const existente = seen.get(nomeNormalizado)!
        const slugExistente = (existente.slug || '').toLowerCase().trim()
        
        // Preferir: slug mais curto, ou slug sem sufixos como -nutri, -coach
        const preferirNovo = 
          slug.length < slugExistente.length ||
          (!slug.includes('-nutri') && !slug.includes('-coach') && (slugExistente.includes('-nutri') || slugExistente.includes('-coach'))) ||
          (slug.includes('quiz-') && !slugExistente.includes('quiz-'))
        
        if (preferirNovo) {
          seen.set(nomeNormalizado, template)
        }
      } else {
        seen.set(nomeNormalizado, template)
      }
    })
    
    return Array.from(seen.values())
  }

  // Remover duplicatas primeiro
  const templatesSemDuplicatas = removerDuplicatas(templates)

  // Lista de templates descartados (NÃO devem aparecer)
  const templatesDescartados = [
    'quiz-interativo',
    'quiz-interativo-nutri'
  ]

  // Filtrar templates - remover descartados
  const templatesFiltrados = templatesSemDuplicatas.filter(t => {
    const slug = (t.slug || '').toLowerCase().trim()
    const nome = (t.nome || '').toLowerCase().trim()
    
    // Verificar se está na lista de descartados
    const estaDescartado = templatesDescartados.some(descartado => {
      const descartadoLower = descartado.toLowerCase()
      return slug === descartadoLower || 
             slug.includes(descartadoLower) ||
             nome.toLowerCase().includes(descartadoLower.replace(/-/g, ' '))
    })
    
    return !estaDescartado
  })

  // Quizzes de Recrutamento (os 3 específicos)
  const quizzesRecrutamento = templatesFiltrados.filter(t => {
    const slug = (t.slug || '').toLowerCase()
    const nome = (t.nome || '').toLowerCase()
    return (
      (slug.includes('ganhos') && slug.includes('prosperidade')) ||
      slug.includes('quiz-ganhos') ||
      (nome.includes('ganhos') && nome.includes('prosperidade')) ||
      (slug.includes('potencial') && slug.includes('crescimento')) ||
      slug.includes('quiz-potencial') ||
      (nome.includes('potencial') && nome.includes('crescimento')) ||
      (slug.includes('proposito') && slug.includes('equilibrio')) ||
      slug.includes('quiz-proposito') ||
      (nome.includes('propósito') || nome.includes('proposito')) && (nome.includes('equilíbrio') || nome.includes('equilibrio'))
    )
  })

  // Templates Hype Drink — catálogo central em `@/lib/wellness/wellness-hype-meus-links`
  const templatesHype = useMemo(() => {
    if (!profile?.userSlug) return []

    return WELLNESS_HYPE_MEUS_LINKS.map((t) => ({
      ...t,
      categoria: 'HYPE',
      link: buildWellnessToolUrl(profile.userSlug, t.slug),
    }))
  }, [profile?.userSlug, baseUrl])

  // Templates de Vendas (todos os outros templates permitidos, exceto os 3 de recrutamento e os 6 de HYPE)
  const templatesVendas = templatesFiltrados.filter(t => {
    const slug = (t.slug || '').toLowerCase()
    const nome = (t.nome || '').toLowerCase()
    // Excluir os 3 de recrutamento
    const isRecrutamento = (
      (slug.includes('ganhos') && slug.includes('prosperidade')) ||
      slug.includes('quiz-ganhos') ||
      (nome.includes('ganhos') && nome.includes('prosperidade')) ||
      (slug.includes('potencial') && slug.includes('crescimento')) ||
      slug.includes('quiz-potencial') ||
      (nome.includes('potencial') && nome.includes('crescimento')) ||
      (slug.includes('proposito') && slug.includes('equilibrio')) ||
      slug.includes('quiz-proposito') ||
      (nome.includes('propósito') || nome.includes('proposito')) && (nome.includes('equilíbrio') || nome.includes('equilibrio'))
    )
    // Excluir os 6 de HYPE
    const isHype = (
      slug.includes('energia-foco') ||
      slug.includes('pre-treino') ||
      slug.includes('rotina-produtiva') ||
      slug.includes('constancia') ||
      slug.includes('consumo-cafeina') ||
      slug.includes('custo-energia') ||
      nome.includes('energia') && nome.includes('foco') ||
      nome.includes('pré-treino') || nome.includes('pre-treino') ||
      nome.includes('rotina') && nome.includes('produtiva') ||
      nome.includes('constância') || nome.includes('constancia') ||
      nome.includes('consumo') && nome.includes('cafeína') ||
      nome.includes('custo') && nome.includes('energia')
    )
    return !isRecrutamento && !isHype
  })

  // Unificar todos os itens (recalcular quando profile mudar)
  const itensUnificados: ItemUnificado[] = useMemo(() => {
    // Função auxiliar para obter estatísticas baseado no slug
    const obterEstatisticas = (slug: string) => {
      return estatisticasFerramentas[slug] || { views: 0, leads: 0, conversions: 0 }
    }

    return [
      // HOM gravada
      {
        id: 'hom-gravada',
        nome: 'Link da HOM gravada',
        tipo: 'fluxo-recrutamento' as const,
        categoria: 'Recrutamento',
        link: gerarLinkHOM() || '',
        descricao: 'Oportunidade: Bebidas Funcionais',
        icon: '🎥',
        metadata: { tipo: 'hom-gravada', linkHOM: gerarLinkHOM() },
        views: 0,
        leads: 0,
        conversions: 0
      },
      // Quizzes de Recrutamento (os 3 específicos)
      ...quizzesRecrutamento.map(t => {
        const toolSlug = ferramentasUsuario[t.slug] || t.slug
        const stats = obterEstatisticas(toolSlug)
        return {
          id: `recrutamento-quiz-${t.id}`,
          nome: t.nome,
          tipo: 'fluxo-recrutamento' as const,
          categoria: 'Recrutamento',
          link: gerarLinkTemplate(t) || '',
          descricao: t.description || t.descricao,
          icon: '🎯',
          metadata: { 
            template: {
              ...t,
              content: t.content, // GARANTIR que content está presente
              id: t.id || t.templateId,
              slug: t.slug,
              type: t.type,
              name: t.name || t.nome,
              nome: t.nome || t.name
            }, 
            isQuiz: true 
          },
          views: stats.views,
          leads: stats.leads,
          conversions: stats.conversions
        }
      }),
      // Templates Hype Drink (6 templates específicos)
      ...templatesHype.map(t => {
        const stats = obterEstatisticas(t.slug)
        return {
          id: `hype-${t.id}`,
          nome: t.nome,
          tipo: 'fluxo-vendas' as const, // Usar tipo vendas para compatibilidade
          categoria: 'HYPE',
          link: t.link || '',
          descricao: t.description,
          icon: t.icon,
          metadata: { 
            template: {
              id: t.id,
              slug: t.slug,
              type: t.type,
              name: t.nome,
              nome: t.nome,
              description: t.description,
              icon: t.icon
            }, 
            isTemplate: true,
            isHype: true
          },
          views: stats.views,
          leads: stats.leads,
          conversions: stats.conversions
        }
      }),
      // Templates de Vendas (todos os outros templates)
      ...templatesVendas.map(t => {
        const toolSlug = ferramentasUsuario[t.slug] || t.slug
        const stats = obterEstatisticas(toolSlug)
        return {
          id: `vendas-template-${t.id}`,
          nome: t.nome,
          tipo: 'fluxo-vendas' as const,
          categoria: 'Vendas',
          link: gerarLinkTemplate(t) || '',
          descricao: t.description || t.descricao,
          icon: t.icon || '📋',
          metadata: { 
            template: {
              ...t,
              content: t.content,
              id: t.id || t.templateId,
              slug: t.slug,
              type: t.type,
              name: t.name || t.nome,
              nome: t.nome || t.name
            }, 
            isTemplate: true 
          },
          views: stats.views,
          leads: stats.leads,
          conversions: stats.conversions
        }
      }),
      // Fluxos de Recrutamento
      ...fluxosRecrutamento.map(f => {
        const link = gerarLinkFluxoRecrutamento(f) || ''
        return {
          id: `recrutamento-${f.id}`,
          nome: f.nome,
          tipo: 'fluxo-recrutamento' as const,
          categoria: 'Recrutamento',
          link,
          descricao: f.objetivo,
          icon: '👥',
          metadata: { fluxo: f },
          views: 0,
          leads: 0,
          conversions: 0
        }
      }),
      // Fluxos de Vendas
      ...fluxosClientes.map(f => {
        const link = gerarLinkFluxoVendas(f) || ''
        return {
          id: `vendas-${f.id}`,
          nome: f.nome,
          tipo: 'fluxo-vendas' as const,
          categoria: 'Vendas',
          link,
          descricao: f.objetivo,
          icon: '💰',
          metadata: { fluxo: f },
          views: 0,
          leads: 0,
          conversions: 0
        }
      })
    ]
  }, [templates, profile?.userSlug, ferramentasUsuario, templatesHype, baseUrl, estatisticasFerramentas])

  // Debug: verificar quantos itens foram unificados
  useEffect(() => {
    console.log('📊 Itens Unificados:', {
      total: itensUnificados.length,
      quizzesRecrutamento: quizzesRecrutamento.length,
      templatesVendas: templatesVendas.length,
      fluxosRecrutamento: fluxosRecrutamento.length,
      fluxosClientes: fluxosClientes.length,
      porTipo: {
        recrutamento: itensUnificados.filter(i => i.tipo === 'fluxo-recrutamento').length,
        vendas: itensUnificados.filter(i => i.tipo === 'fluxo-vendas').length
      },
      nomesFluxosRecrutamento: fluxosRecrutamento.map(f => f.nome),
      nomesFluxosClientes: fluxosClientes.map(f => f.nome)
    })
  }, [itensUnificados.length, quizzesRecrutamento.length, templatesVendas.length, fluxosRecrutamento.length, fluxosClientes.length])

  // Filtrar e ordenar itens
  const itensFiltrados = useMemo(() => {
    let filtrados = itensUnificados.filter(item => {
      // Filtro por tipo principal (todos, recrutamento, vendas ou hype)
      const matchTipo = 
        filtroTipo === 'todos' ||
        (filtroTipo === 'recrutamento' && item.tipo === 'fluxo-recrutamento') ||
        (filtroTipo === 'vendas' && item.tipo === 'fluxo-vendas' && item.categoria !== 'HYPE') ||
        (filtroTipo === 'hype' && item.categoria === 'HYPE')
      
      if (!matchTipo) return false
      
      // Filtro de busca
      const matchBusca = busca === '' || 
        item.nome.toLowerCase().includes(busca.toLowerCase()) ||
        item.descricao?.toLowerCase().includes(busca.toLowerCase()) ||
        item.categoria.toLowerCase().includes(busca.toLowerCase())

      // Permitir fluxos mesmo sem link (podem ser gerados depois)
      const isFluxo = item.metadata?.fluxo !== undefined
      return matchBusca && (item.link || isFluxo)
    })

    // Se estiver em modo ranking, ordenar por visualizações ou conversões
    if (modoRanking) {
      filtrados = [...filtrados].sort((a, b) => {
        if (ordenarPor === 'visualizacoes') {
          const viewsA = a.views || 0
          const viewsB = b.views || 0
          return viewsB - viewsA // Ordenar do maior para o menor
        } else {
          const convA = a.conversions || 0
          const convB = b.conversions || 0
          return convB - convA // Ordenar do maior para o menor
        }
      })
    }

    return filtrados
  }, [itensUnificados, filtroTipo, busca, modoRanking, ordenarPor])

  // Copiar link
  const copiarLink = async (link: string, id: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    try {
      if (!link || link.trim() === '') {
        console.error('❌ Link vazio para item:', id)
        showWarning('Link não disponível', {
          message: 'Configure seu user_slug no perfil primeiro para gerar links.',
        })
        return
      }
      
      console.log('📋 Copiando link:', { id, link })
      
      // Tentar método moderno primeiro
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(link)
        setLinkCopiado(id)
        setTimeout(() => setLinkCopiado(null), 2000)
        console.log('✅ Link copiado com sucesso!')
        
        // Encontrar o item para mostrar informações
        const item = itensUnificados.find(i => i.id === id)
        showSuccess('Link copiado!', {
          message: item ? `Link da ferramenta "${item.nome}" copiado para a área de transferência.` : 'Link copiado para a área de transferência.',
          link: link,
          icon: 'link',
          duration: 5000,
        })
        return
      }
      
      // Fallback: método antigo
      const textArea = document.createElement('textarea')
      textArea.value = link
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      
      if (successful) {
        setLinkCopiado(id)
        setTimeout(() => setLinkCopiado(null), 2000)
        console.log('✅ Link copiado com fallback!')
        
        // Encontrar o item para mostrar informações
        const item = itensUnificados.find(i => i.id === id)
        showSuccess('Link copiado!', {
          message: item ? `Link da ferramenta "${item.nome}" copiado para a área de transferência.` : 'Link copiado para a área de transferência.',
          link: link,
          icon: 'link',
          duration: 5000,
        })
      } else {
        throw new Error('Falha ao copiar com método fallback')
      }
    } catch (error) {
      console.error('❌ Erro ao copiar link:', error)
      showError('Erro ao copiar link', {
        message: 'Tente selecionar e copiar manualmente.',
      })
    }
  }

  // Copiar QR Code
  const copiarQRCode = async (link: string, id: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    try {
      if (!link) {
        showWarning('Link não disponível', {
          message: 'Configure seu perfil primeiro para gerar QR codes.',
        })
        return
      }

      // Importar a biblioteca qrcode dinamicamente (só quando necessário)
      const QRCodeLib = (await import('qrcode')).default

      // Verificar se ClipboardItem está disponível
      const supportsClipboardItem = typeof window !== 'undefined' && 'ClipboardItem' in window

      if (!supportsClipboardItem) {
        // Fallback para navegadores que não suportam ClipboardItem
        // Gerar QR code como data URL e criar um link de download
        const dataUrl = await QRCodeLib.toDataURL(link, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
        
        // Criar um elemento temporário para download
        const linkElement = document.createElement('a')
        linkElement.href = dataUrl
        linkElement.download = `qr-code-${id}.png`
        document.body.appendChild(linkElement)
        linkElement.click()
        document.body.removeChild(linkElement)
        
        // Copiar mensagem sugerida (mesmo formato do link) para enviar junto no WhatsApp
        const itemDownload = itensUnificados.find(i => i.id === id)
        const mensagemSugerida = itemDownload ? obterMensagemSugeridaParaCompartilhar(itemDownload) : link
        await navigator.clipboard.writeText(mensagemSugerida)
        
        setQrCopiado(id)
        setTimeout(() => setQrCopiado(null), 2000)
        
        showSuccess('QR Code gerado!', {
          message: itemDownload ? `QR Code da ferramenta "${itemDownload.nome}" foi baixado. Mensagem para enviar junto foi copiada (cole no WhatsApp).` : 'QR Code foi baixado. Mensagem com link foi copiada.',
          link: link,
          icon: 'qr',
          duration: 5000,
        })
        return
      }

      // Continuar com a geração usando canvas para navegadores que suportam ClipboardItem

      // Gerar QR code usando a biblioteca local
      const canvas = document.createElement('canvas')
      await QRCodeLib.toCanvas(canvas, link, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })

      // Converter canvas para blob
      return new Promise<void>((resolve, reject) => {
        canvas.toBlob(async (blob) => {
          if (!blob) {
            reject(new Error('Erro ao gerar blob do QR code'))
            return
          }

          try {
            // Tentar copiar para a área de transferência
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ])
            
            setQrCopiado(id)
            setTimeout(() => setQrCopiado(null), 2000)
            
            const itemImg = itensUnificados.find(i => i.id === id)
            showSuccess('QR Code copiado!', {
              message: itemImg ? `QR Code da ferramenta "${itemImg.nome}" copiado. Use o botão "Scripts" para copiar uma mensagem para enviar junto no WhatsApp.` : 'QR Code copiado para a área de transferência. Use Scripts para mensagem.',
              link: link,
              icon: 'qr',
              duration: 6000,
            })
            resolve()
          } catch (clipboardError) {
            console.warn('Erro ao copiar para clipboard, fazendo download:', clipboardError)
            // Se falhar ao copiar, fazer download
            const url = URL.createObjectURL(blob)
            const linkElement = document.createElement('a')
            linkElement.href = url
            linkElement.download = `qr-code-${id}.png`
            document.body.appendChild(linkElement)
            linkElement.click()
            document.body.removeChild(linkElement)
            URL.revokeObjectURL(url)
            
            // Copiar mensagem sugerida (mesmo formato do link) para enviar junto
            try {
              const itemFallback = itensUnificados.find(i => i.id === id)
              const mensagemSugerida = itemFallback ? obterMensagemSugeridaParaCompartilhar(itemFallback) : link
              await navigator.clipboard.writeText(mensagemSugerida)
            } catch (e) {
              console.warn('Erro ao copiar mensagem:', e)
            }
            
            setQrCopiado(id)
            setTimeout(() => setQrCopiado(null), 2000)
            
            const itemFallback2 = itensUnificados.find(i => i.id === id)
            showSuccess('QR Code gerado!', {
              message: itemFallback2 ? `QR Code da ferramenta "${itemFallback2.nome}" foi baixado. Mensagem para enviar junto foi copiada (cole no WhatsApp).` : 'QR Code foi baixado. Mensagem com link foi copiada.',
              link: link,
              icon: 'qr',
              duration: 5000,
            })
            resolve()
          }
        }, 'image/png')
      })
    } catch (error) {
      console.error('Erro ao copiar QR code:', error)
      try {
        // Fallback: copiar mensagem sugerida (mesmo formato do link) para paridade com link
        const itemErro = itensUnificados.find(i => i.id === id)
        const mensagemSugerida = itemErro ? obterMensagemSugeridaParaCompartilhar(itemErro) : link
        await navigator.clipboard.writeText(mensagemSugerida)
        showSuccess('Link e mensagem copiados', {
          message: itemErro ? `Erro ao gerar QR, mas a mensagem para enviar da ferramenta "${itemErro.nome}" foi copiada. Cole no WhatsApp.` : 'Mensagem com link foi copiada.',
          link: link,
          icon: 'link',
          duration: 5000,
        })
      } catch (e) {
        showError('Erro ao copiar', {
          message: 'Tente copiar o link manualmente.',
        })
      }
    }
  }

  // Abrir preview
  const abrirPreview = (item: ItemUnificado) => {
    console.log('🔍 Abrindo preview para:', {
      id: item.id,
      nome: item.nome,
      tipo: item.tipo,
      temMetadata: !!item.metadata,
      temTemplate: !!item.metadata?.template,
      temContent: !!item.metadata?.template?.content,
      metadata: item.metadata
    })
    setPreviewAberto(item.id)
  }

  // Funções para HOM Gravada
  const linkYouTubeHOM = 'https://youtu.be/Uva_4zHdcqQ'

  const copiarMensagemCompletaHOM = async () => {
    const linkHOM = gerarLinkHOM()
    if (!linkHOM) {
      alert('⚠️ Configure seu user_slug no perfil para gerar o link da HOM.')
      return
    }

    // Mensagem apenas com o link da HOM (a imagem aparece automaticamente via Open Graph)
    const mensagem = `🍹 *OPORTUNIDADE: BEBIDAS FUNCIONAIS* 🍹

Olha que oportunidade incrível com bebidas funcionais! 🚀

É sobre o mercado de *bebidas funcionais* - um mercado que está crescendo muito e oferece grandes oportunidades.

✨ *Por que essa oportunidade é especial:*
✅ Pessoas querem mais energia
✅ Busca por saúde + praticidade  
✅ Produtos de alta rotatividade
✅ Margens atrativas para iniciantes
✅ Simples de vender e de consumir

${linkHOM}

São apenas alguns minutos e pode mudar sua perspectiva sobre renda e oportunidades! 🚀

Você vai adorar! 😊`

    try {
      await navigator.clipboard.writeText(mensagem)
      setHomMensagemCopiada(true)
      setTimeout(() => setHomMensagemCopiada(false), 2000)
    } catch (error) {
      console.error('Erro ao copiar mensagem:', error)
      alert('⚠️ Erro ao copiar mensagem. Tente novamente.')
    }
  }

  if (loadingProfile || carregandoTemplates) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <WellnessNavBar showTitle title="Meus Links" />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!profile?.userSlug) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <WellnessNavBar showTitle title="Meus Links" />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-4">
            {whatsappGroupInviteUrl && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">💬</div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900 mb-1">Comunidade WhatsApp</h2>
                    <p className="text-sm text-gray-600 mb-4">
                      Entre no grupo para receber avisos, materiais e próximos passos.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <a
                        href={whatsappGroupInviteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Entrar no Grupo →
                      </a>
                      <button
                        onClick={(e) => copiarLink(whatsappGroupInviteUrl, 'whatsapp-grupo', e)}
                        className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
                      >
                        📋 Copiar link do grupo
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 break-all">{whatsappGroupInviteUrl}</p>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p className="text-yellow-800 mb-4">
                ⚠️ Configure seu <strong>user_slug</strong> no perfil para gerar links personalizados.
              </p>
              <Link
                href="/pt/wellness/configuracao"
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                Ir para Configurações
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <WellnessNavBar showTitle title="Meus Links" />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Comunidade WhatsApp */}
        {whatsappGroupInviteUrl && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">💬</div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Comunidade WhatsApp</h2>
                    <p className="text-sm text-gray-600">
                      Link direto para novos inscritos entrarem no grupo.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={(e) => copiarLink(whatsappGroupInviteUrl, 'whatsapp-grupo', e)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    📋 Copiar link do grupo
                  </button>
                  <a
                    href={whatsappGroupInviteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-900 text-sm font-medium rounded-lg border border-gray-300 transition-colors text-center"
                  >
                    Entrar no Grupo →
                  </a>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3 break-all">{whatsappGroupInviteUrl}</p>
            </div>
          </div>
        )}

        {/* Modo Ranking - Toggle e Info */}
        {modoRanking && (
          <div className="mb-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">🏆 Ranking</h2>
                <p className="text-xs text-gray-600">Links ordenados por {ordenarPor === 'visualizacoes' ? 'visualizações' : 'conversões'} (do maior para o menor)</p>
              </div>
              <button
                onClick={() => setModoRanking(false)}
                className="px-3 py-1.5 bg-white text-green-600 rounded-lg text-sm font-medium hover:bg-green-50 border border-green-200 transition-colors"
              >
                Ver todos
              </button>
            </div>
            {/* Filtro de ordenação */}
            <div className="flex gap-2">
              <button
                onClick={() => setOrdenarPor('visualizacoes')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  ordenarPor === 'visualizacoes'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-green-50 border border-green-200'
                }`}
              >
                👁️ Mais Visualizações
              </button>
              <button
                onClick={() => setOrdenarPor('conversoes')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  ordenarPor === 'conversoes'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-green-50 border border-green-200'
                }`}
              >
                ✅ Mais Conversões
              </button>
            </div>
          </div>
        )}

        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Meus Links
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Todos os seus templates e fluxos prontos para copiar e compartilhar
          </p>
        </div>

        {/* Filtros */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Busca */}
            <input
              type="text"
              placeholder="Buscar por nome, categoria..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            
            {/* Filtros de Tipo */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFiltroTipo('todos')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtroTipo === 'todos'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                📋 Todos
              </button>
              <button
                onClick={() => setFiltroTipo('recrutamento')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtroTipo === 'recrutamento'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                👥 Recrutamento
              </button>
              <button
                onClick={() => setFiltroTipo('vendas')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtroTipo === 'vendas'
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                💰 Vendas
              </button>
              <button
                onClick={() => setFiltroTipo('hype')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtroTipo === 'hype'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                🥤 HYPE
              </button>
            </div>
          </div>
        </div>

        {/* Grid de Itens */}
        {itensFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Nenhum item encontrado com os filtros selecionados.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {itensFiltrados.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                {/* Ícone e Nome da Ferramenta */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    {item.icon && (
                      <div className="text-4xl flex-shrink-0">
                        {item.icon}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {item.nome}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {item.categoria}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Estatísticas - Modo normal mostra visualizações e conversões, ranking mostra apenas o selecionado */}
                {modoRanking ? (
                  <div className="mb-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          {ordenarPor === 'visualizacoes' ? '👁️ Visualizações' : '✅ Conversões'}
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {ordenarPor === 'visualizacoes' ? (item.views || 0) : (item.conversions || 0)}
                        </p>
                      </div>
                      {itensFiltrados.findIndex(i => i.id === item.id) < 3 && (
                        <div className="text-3xl">
                          {itensFiltrados.findIndex(i => i.id === item.id) === 0 && '🥇'}
                          {itensFiltrados.findIndex(i => i.id === item.id) === 1 && '🥈'}
                          {itensFiltrados.findIndex(i => i.id === item.id) === 2 && '🥉'}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  (item.views !== undefined || item.conversions !== undefined) && (
                    <div className="grid grid-cols-2 gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">👁️ Visualizações</p>
                        <p className="text-sm font-bold text-gray-900">{item.views || 0}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">✅ Conversões</p>
                        <p className="text-sm font-bold text-green-600">{item.conversions || 0}</p>
                      </div>
                    </div>
                  )
                )}

                {/* Quatro Botões - Grid 2x2 */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Botão Preview */}
                  <button
                    onClick={() => {
                      console.log('Abrindo preview para:', item)
                      abrirPreview(item)
                    }}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    👁️ Preview
                  </button>
                  
                  {/* Botão Copiar Link */}
                  <button
                    onClick={(e) => {
                      console.log('Copiar link clicado:', { item: item.nome, link: item.link })
                      copiarLink(item.link, item.id, e)
                    }}
                    disabled={!item.link || item.link.trim() === ''}
                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                      !item.link || item.link.trim() === ''
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : linkCopiado === item.id
                        ? 'bg-green-600 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                    title={item.link ? `Copiar Link: ${item.link}` : 'Link não disponível'}
                  >
                    {linkCopiado === item.id ? '✓ Copiado!' : '📋 Copiar Link'}
                  </button>
                  
                  {/* Botão Copiar QR Code */}
                  <button
                    onClick={(e) => {
                      console.log('Copiar QR code clicado:', { item: item.nome, link: item.link })
                      copiarQRCode(item.link, item.id, e)
                    }}
                    disabled={!item.link || item.link.trim() === ''}
                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                      !item.link || item.link.trim() === ''
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : qrCopiado === item.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                    title={item.link ? `Copiar QR Code: ${item.link}` : 'Link não disponível'}
                  >
                    {qrCopiado === item.id ? '✓ Copiado!' : '📱 Copiar QR'}
                  </button>

                  {/* Botão Ver Scripts */}
                  <button
                    onClick={() => {
                      const slug = item.metadata?.template?.slug || item.metadata?.fluxo?.slug || item.id
                      // Garantir que o link seja completo (com domínio)
                      let linkCompleto = item.link
                      if (linkCompleto && !linkCompleto.startsWith('http')) {
                        linkCompleto = `${baseUrl}${linkCompleto.startsWith('/') ? '' : '/'}${linkCompleto}`
                      }
                      setScriptsAberto({
                        nome: item.nome,
                        slug: slug,
                        icon: item.icon,
                        link: linkCompleto
                      })
                    }}
                    className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    📝 Scripts
                  </button>
                </div>
                
                {/* Debug: Mostrar link se disponível */}
                {item.link && (
                  <p className="text-xs text-gray-400 mt-2 truncate" title={item.link}>
                    {item.link.replace(/^https?:\/\//, '')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}


        {/* Modal de Preview */}
        {previewAberto && (() => {
          // Buscar primeiro em itensUnificados
          let item = itensUnificados.find(i => i.id === previewAberto)
          
          // Se não encontrou, pode ser um item HOM (que não está em itensUnificados)
          if (!item && previewAberto === 'hom-gravada') {
            if (previewAberto === 'hom-gravada') {
              const linkHOM = gerarLinkHOM()
              item = {
                id: 'hom-gravada',
                nome: 'Link da HOM gravada',
                tipo: 'fluxo-recrutamento' as const,
                categoria: 'Recrutamento',
                link: linkHOM || '',
                descricao: 'Oportunidade: Bebidas Funcionais',
                icon: '🎥',
                metadata: { tipo: 'hom-gravada', linkHOM }
              }
            }
          }
          
          if (!item) return null

          return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
                  <div className="flex items-center gap-3">
                    {item.icon && (
                      <div className="text-3xl">
                        {item.icon}
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-gray-900">
                      {item.nome}
                    </h3>
                  </div>
                  <button
                    onClick={() => setPreviewAberto(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                  >
                    ✕
                  </button>
                </div>
                <div className={item.metadata?.isHype ? 'p-0 overflow-hidden' : 'p-6'}>
                  {/* Preview do conteúdo completo */}
                  {item.metadata?.isQuiz && item.metadata?.template ? (
                    (() => {
                      const templateParaPreview = {
                        id: item.metadata.template.id || item.metadata.template.templateId,
                        name: item.metadata.template.name || item.metadata.template.nome,
                        nome: item.metadata.template.nome || item.metadata.template.name,
                        slug: item.metadata.template.slug || item.metadata.template.id,
                        type: item.metadata.template.type || 'quiz',
                        content: item.metadata.template.content, // CRÍTICO: Content completo do banco
                        description: item.metadata.template.description,
                        specialization: item.metadata.template.specialization
                      }
                      
                      // Normalizar slug para garantir que seja reconhecido
                      const slugNormalizado = (templateParaPreview.slug || templateParaPreview.id || '')
                        .toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '')
                      
                      console.log('📋 Renderizando DynamicTemplatePreview com:', {
                        id: templateParaPreview.id,
                        name: templateParaPreview.name,
                        slug: templateParaPreview.slug,
                        slugNormalizado: slugNormalizado,
                        type: templateParaPreview.type,
                        temContent: !!templateParaPreview.content,
                        contentKeys: templateParaPreview.content ? Object.keys(templateParaPreview.content) : []
                      })
                      
                      // Usar slug normalizado
                      templateParaPreview.slug = slugNormalizado || templateParaPreview.slug
                      
                      if (!templateParaPreview.content) {
                        return (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                            <p className="text-yellow-800 font-semibold mb-2">
                              ⚠️ Preview não disponível
                            </p>
                            <p className="text-sm text-yellow-700">
                              O template não possui conteúdo configurado. O preview será exibido quando o conteúdo estiver disponível.
                            </p>
                            <div className="mt-4 p-4 bg-white rounded border border-gray-200">
                              <p className="text-xs text-gray-500 mb-2">Link:</p>
                              <code className="text-sm text-gray-700 break-all">{item.link}</code>
                            </div>
                          </div>
                        )
                      }
                      
                      return (
                        <DynamicTemplatePreview
                          template={templateParaPreview}
                          profession="wellness"
                          onClose={() => setPreviewAberto(null)}
                        />
                      )
                    })()
                  ) : item.metadata?.isTemplate && item.metadata?.template && !item.metadata?.isHype ? (
                    (() => {
                      const templateParaPreview = {
                        id: item.metadata.template.id || item.metadata.template.templateId,
                        name: item.metadata.template.name || item.metadata.template.nome,
                        nome: item.metadata.template.nome || item.metadata.template.name,
                        slug: item.metadata.template.slug || item.metadata.template.id,
                        type: item.metadata.template.type || 'calculadora',
                        content: item.metadata.template.content, // CRÍTICO: Content completo do banco
                        description: item.metadata.template.description,
                        descricao: item.metadata.template.descricao || item.metadata.template.description,
                        specialization: item.metadata.template.specialization,
                        icon: item.metadata.template.icon || item.icon
                      }
                      
                      // Normalizar slug para garantir que seja reconhecido
                      const slugNormalizado = (templateParaPreview.slug || templateParaPreview.id || '')
                        .toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '')
                      
                      console.log('📋 Renderizando DynamicTemplatePreview (Template/Calculadora) com:', {
                        id: templateParaPreview.id,
                        name: templateParaPreview.name,
                        slug: templateParaPreview.slug,
                        slugNormalizado: slugNormalizado,
                        type: templateParaPreview.type,
                        temContent: !!templateParaPreview.content,
                        contentKeys: templateParaPreview.content ? Object.keys(templateParaPreview.content) : []
                      })
                      
                      // Usar slug normalizado
                      templateParaPreview.slug = slugNormalizado || templateParaPreview.slug
                      
                      if (!templateParaPreview.content) {
                        return (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                            <p className="text-yellow-800 font-semibold mb-2">
                              ⚠️ Preview não disponível
                            </p>
                            <p className="text-sm text-yellow-700">
                              O template não possui conteúdo configurado. O preview será exibido quando o conteúdo estiver disponível.
                            </p>
                            <div className="mt-4 p-4 bg-white rounded border border-gray-200">
                              <p className="text-xs text-gray-500 mb-2">Link:</p>
                              <code className="text-sm text-gray-700 break-all">{item.link}</code>
                            </div>
                          </div>
                        )
                      }
                      
                      return (
                        <DynamicTemplatePreview
                          template={templateParaPreview}
                          profession="wellness"
                          onClose={() => setPreviewAberto(null)}
                        />
                      )
                    })()
                  ) : item.metadata?.tipo === 'hom-gravada' ? (
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">🎥 Link da HOM gravada</h3>
                      <div className="space-y-4">
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <p className="text-orange-800 font-semibold mb-2">Oportunidade: Bebidas Funcionais</p>
                          <p className="text-orange-700 text-sm mb-3">
                            Um mercado em crescimento que oferece grandes oportunidades! Pessoas buscam mais energia, saúde e praticidade.
                          </p>
                          <ul className="text-orange-700 space-y-1 text-xs">
                            <li>• Produtos de alta rotatividade</li>
                            <li>• Margens atrativas para iniciantes</li>
                            <li>• Simples de vender e consumir</li>
                          </ul>
                        </div>
                        <p className="text-gray-600 text-sm">
                          A apresentação completa inclui vídeo e botões de ação (Quero tirar dúvida, Gostei quero começar).
                        </p>
                        <div className="flex gap-3 mt-4">
                          {item.metadata?.linkHOM && (
                            <a
                              href={item.metadata.linkHOM}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700"
                            >
                              Abrir Página Completa →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : item.metadata?.isHype ? (
                    (() => {
                      // Renderizar apenas o WellnessLanding para preview (sem header duplicado)
                      const slug = item.metadata?.template?.slug || item.id.replace('hype-', '')
                      
                      const config = {
                        id: item.id,
                        name: item.nome,
                        description: item.descricao || '',
                        slug: slug,
                        profession: 'wellness' as const,
                        whatsapp_number: profile?.whatsapp || '',
                        country_code: profile?.countryCode || 'BR'
                      }
                      
                      // Renderizar apenas a landing page de cada template
                      const renderLanding = () => {
                        switch (slug) {
                          case 'energia-foco':
                            return (
                              <WellnessLanding
                                config={config}
                                title="⚡ Descubra Como Ter Mais Energia o Dia Todo!"
                                description="Em apenas 2 minutos, descubra o que está roubando sua energia e como recuperá-la de forma natural e sustentável"
                                benefits={[
                                  'Identifique exatamente quando sua energia mais cai',
                                  'Descubra alternativas ao café excessivo que causam ansiedade',
                                  'Receba um plano personalizado para sua rotina',
                                  'Conheça uma solução prática e natural para mais energia'
                                ]}
                                onStart={() => {}}
                                ctaText="▶️ Descobrir Minha Energia Agora - É Grátis!"
                              />
                            )
                          case 'pre-treino':
                            return (
                              <WellnessLanding
                                config={config}
                                title="🏋️ Qual o Pré-Treino Perfeito Para Você?"
                                description="Descubra em 2 minutos se você precisa de energia leve ou forte para seus treinos e encontre a solução ideal"
                                benefits={[
                                  'Identifique seu perfil de treino e necessidades',
                                  'Descubra se pré-treinos fortes causam ansiedade',
                                  'Conheça uma alternativa leve e natural',
                                  'Receba um plano personalizado para seus treinos'
                                ]}
                                onStart={() => {}}
                                ctaText="▶️ Descobrir Meu Pré-Treino Ideal - Grátis!"
                              />
                            )
                          case 'rotina-produtiva':
                            return (
                              <WellnessLanding
                                config={config}
                                title="📈 Como Ter Uma Rotina Mais Produtiva?"
                                description="Em 2 minutos, descubra o que está sabotando sua produtividade e como criar uma rotina que realmente funciona"
                                benefits={[
                                  'Identifique os pontos que atrapalham sua produtividade',
                                  'Descubra como manter energia constante o dia todo',
                                  'Receba estratégias práticas para sua rotina',
                                  'Conheça uma solução natural para mais foco e energia'
                                ]}
                                onStart={() => {}}
                                ctaText="▶️ Melhorar Minha Produtividade Agora - Grátis!"
                              />
                            )
                          case 'constancia':
                            return (
                              <WellnessLanding
                                config={config}
                                title="🎯 Por Que Você Não Consegue Manter a Rotina?"
                                description="Descubra em 2 minutos o que está impedindo você de manter uma rotina constante e como resolver isso de forma simples"
                                benefits={[
                                  'Identifique os obstáculos que quebram sua rotina',
                                  'Descubra como facilitar hábitos diários',
                                  'Receba um plano prático para manter constância',
                                  'Conheça uma solução que facilita sua rotina diária'
                                ]}
                                onStart={() => {}}
                                ctaText="▶️ Descobrir Como Manter Rotina - Grátis!"
                              />
                            )
                          case 'consumo-cafeina':
                            return (
                              <WellnessLanding
                                config={config}
                                title="☕ Você Está Exagerando no Café?"
                                description="Descubra em 1 minuto se seu consumo de cafeína está causando ansiedade, insônia ou dependência - e encontre alternativas melhores"
                                benefits={[
                                  'Calcule exatamente quanto café você consome por dia',
                                  'Descubra se está acima do recomendado (e os riscos)',
                                  'Conheça alternativas que não causam ansiedade',
                                  'Receba um plano para reduzir dependência de forma inteligente'
                                ]}
                                onStart={() => {}}
                                ctaText="▶️ Calcular Meu Consumo Agora - Grátis!"
                              />
                            )
                          case 'custo-energia':
                            return (
                              <WellnessLanding
                                config={config}
                                title="💰 Quanto a Falta de Energia Está Custando?"
                                description="Descubra em 1 minuto quanto dinheiro você está perdendo por falta de energia e produtividade - e como recuperar isso"
                                benefits={[
                                  'Calcule quantas horas você perde por falta de energia',
                                  'Descubra o custo financeiro real da baixa produtividade',
                                  'Veja quanto você poderia ganhar com mais energia',
                                  'Receba um plano para aumentar sua performance e renda'
                                ]}
                                onStart={() => {}}
                                ctaText="▶️ Calcular Meu Custo Agora - Grátis!"
                              />
                            )
                          default:
                            return (
                              <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.icon} {item.nome}</h3>
                                <p className="text-gray-700">{item.descricao}</p>
                                <div className="mt-4 p-4 bg-white rounded border border-gray-200">
                                  <p className="text-xs text-gray-500 mb-2">Link:</p>
                                  <code className="text-sm text-gray-700 break-all">{item.link}</code>
                                </div>
                              </div>
                            )
                        }
                      }
                      
                      return (
                        <div className="p-6">
                          {renderLanding()}
                        </div>
                      )
                    })()
                  ) : item.metadata?.fluxo ? (
                    <div>
                      <FluxoDiagnostico
                        fluxo={item.metadata.fluxo}
                        whatsappNumber={profile?.whatsapp || ''}
                        countryCode={profile?.countryCode || 'BR'}
                        mostrarProdutos={item.tipo === 'fluxo-vendas'} // Vendas mostra produtos, recrutamento não
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-600 mb-4">
                        {item.descricao || 'Preview disponível em breve para este tipo de item.'}
                      </p>
                      <div className="mt-4 p-4 bg-white rounded border border-gray-200 inline-block">
                        <p className="text-xs text-gray-500 mb-2">Link:</p>
                        <code className="text-sm text-gray-700 break-all">{item.link}</code>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })()}

        {/* Modal de Scripts */}
        {scriptsAberto && (
          <ScriptsModal
            isOpen={true}
            onClose={() => setScriptsAberto(null)}
            ferramentaNome={scriptsAberto.nome}
            ferramentaSlug={scriptsAberto.slug}
            ferramentaIcon={scriptsAberto.icon}
            linkFerramenta={scriptsAberto.link}
          />
        )}
      </main>
    </div>
  )
}

export default function LinksUnificadosPage() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <LinksUnificadosPageContent />
    </ProtectedRoute>
  )
}


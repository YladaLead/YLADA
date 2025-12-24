'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useWellnessProfile } from '@/hooks/useWellnessProfile'
import { fluxosRecrutamento } from '@/lib/wellness-system/fluxos-recrutamento'
import { fluxosClientes } from '@/lib/wellness-system/fluxos-clientes'
import { FluxoCliente } from '@/types/wellness-system'
import { getAppUrl, buildWellnessToolUrl } from '@/lib/url-utils'
import dynamic from 'next/dynamic'
import QRCode from '@/components/QRCode'
import FluxoDiagnostico from '@/components/wellness-system/FluxoDiagnostico'
import ScriptsModal from '@/components/wellness/ScriptsModal'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/ui/Toast'

// Lazy load dos previews
const DynamicTemplatePreview = dynamic(() => import('@/components/shared/DynamicTemplatePreview'), { ssr: false })

// Templates Hype Drink para preview
const TemplateHypeEnergiaFoco = dynamic(() => import('@/app/pt/wellness/templates/hype-drink/energia-foco/page'), { ssr: false })
const TemplateHypePreTreino = dynamic(() => import('@/app/pt/wellness/templates/hype-drink/pre-treino/page'), { ssr: false })
const TemplateHypeRotinaProdutiva = dynamic(() => import('@/app/pt/wellness/templates/hype-drink/rotina-produtiva/page'), { ssr: false })
const TemplateHypeConstancia = dynamic(() => import('@/app/pt/wellness/templates/hype-drink/constancia/page'), { ssr: false })
const TemplateHypeConsumoCafeina = dynamic(() => import('@/app/pt/wellness/templates/hype-drink/consumo-cafeina/page'), { ssr: false })
const TemplateHypeCustoEnergia = dynamic(() => import('@/app/pt/wellness/templates/hype-drink/custo-energia/page'), { ssr: false })

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
}

function LinksUnificadosPageContent() {
  const { profile, loading: loadingProfile } = useWellnessProfile()
  const [templates, setTemplates] = useState<Template[]>([])
  const [carregandoTemplates, setCarregandoTemplates] = useState(true)
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'recrutamento' | 'vendas' | 'hype'>('todos')
  const [busca, setBusca] = useState('')
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

  // Carregar ferramentas criadas pelo usuário
  useEffect(() => {
    const carregarFerramentasUsuario = async () => {
      if (!profile?.userSlug) return
      
      try {
        const response = await fetch('/api/wellness/ferramentas?profession=wellness', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          const tools = data.tools || []
          
          // Criar mapa: template_slug -> tool_slug
          const mapa: Record<string, string> = {}
          tools.forEach((tool: any) => {
            if (tool.template_slug && tool.slug) {
              mapa[tool.template_slug] = tool.slug
            }
          })
          
          setFerramentasUsuario(mapa)
          console.log('✅ Ferramentas do usuário carregadas:', mapa)
        }
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

  // Templates Hype Drink (6 templates específicos) - URLs com slug do usuário
  const templatesHype = useMemo(() => {
    if (!profile?.userSlug) return []
    
    const templates = [
      {
        id: 'hype-energia-foco',
        nome: 'Quiz: Energia & Foco',
        slug: 'energia-foco',
        type: 'quiz',
        categoria: 'HYPE',
        description: 'Descubra como melhorar sua energia e foco ao longo do dia',
        icon: '⚡'
      },
      {
        id: 'hype-pre-treino',
        nome: 'Quiz: Pré-Treino Ideal',
        slug: 'pre-treino',
        type: 'quiz',
        categoria: 'HYPE',
        description: 'Identifique o pré-treino ideal para você',
        icon: '🏋️'
      },
      {
        id: 'hype-rotina-produtiva',
        nome: 'Quiz: Rotina Produtiva',
        slug: 'rotina-produtiva',
        type: 'quiz',
        categoria: 'HYPE',
        description: 'Descubra como melhorar sua produtividade e constância',
        icon: '📈'
      },
      {
        id: 'hype-constancia',
        nome: 'Quiz: Constância & Rotina',
        slug: 'constancia',
        type: 'quiz',
        categoria: 'HYPE',
        description: 'Identifique como manter uma rotina saudável todos os dias',
        icon: '🎯'
      },
      {
        id: 'hype-consumo-cafeina',
        nome: 'Calculadora: Consumo de Cafeína',
        slug: 'consumo-cafeina',
        type: 'calculadora',
        categoria: 'HYPE',
        description: 'Calcule seu consumo de cafeína e identifique alternativas',
        icon: '☕'
      },
      {
        id: 'hype-custo-energia',
        nome: 'Calculadora: Custo da Falta de Energia',
        slug: 'custo-energia',
        type: 'calculadora',
        categoria: 'HYPE',
        description: 'Calcule o impacto da falta de energia na sua produtividade',
        icon: '💰'
      }
    ]
    
    // Gerar links com slug do usuário (mesmo padrão dos outros fluxos)
    return templates.map(t => ({
      ...t,
      link: buildWellnessToolUrl(profile.userSlug, t.slug)
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
  const itensUnificados: ItemUnificado[] = useMemo(() => [
    // HOM ao vivo
    {
      id: 'hom-agendadas',
      nome: 'HOM ao vivo',
      tipo: 'fluxo-recrutamento' as const,
      categoria: 'Recrutamento',
      link: `${baseUrl}/pt/wellness/system/recrutar/enviar-link`,
      descricao: 'Segunda-feira às 20h • Quarta-feira às 9h',
      icon: '📅',
      metadata: { tipo: 'hom-agendadas' }
    },
    // HOM gravada
    {
      id: 'hom-gravada',
      nome: 'Link da HOM gravada',
      tipo: 'fluxo-recrutamento' as const,
      categoria: 'Recrutamento',
      link: gerarLinkHOM() || '',
      descricao: 'Oportunidade: Bebidas Funcionais',
      icon: '🎥',
      metadata: { tipo: 'hom-gravada', linkHOM: gerarLinkHOM() }
    },
    // Quizzes de Recrutamento (os 3 específicos)
    ...quizzesRecrutamento.map(t => ({
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
      }
    })),
    // Templates Hype Drink (6 templates específicos)
    ...templatesHype.map(t => ({
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
      }
    })),
    // Templates de Vendas (todos os outros templates)
    ...templatesVendas.map(t => ({
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
      }
    })),
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
        metadata: { fluxo: f }
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
        metadata: { fluxo: f }
      }
    })
  ], [templates, profile?.userSlug, ferramentasUsuario, templatesHype, baseUrl])

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

  // Filtrar itens
  const itensFiltrados = itensUnificados.filter(item => {
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
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`
      const response = await fetch(qrUrl)
      if (!response.ok) throw new Error('Erro ao gerar QR code')
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      setQrCopiado(id)
      setTimeout(() => setQrCopiado(null), 2000)
      
      // Encontrar o item para mostrar informações
      const item = itemsUnificados.find(i => i.id === id)
      showSuccess('QR Code copiado!', {
        message: item ? `QR Code da ferramenta "${item.nome}" copiado para a área de transferência.` : 'QR Code copiado para a área de transferência.',
        link: link,
        icon: 'qr',
        duration: 5000,
      })
    } catch (error) {
      console.error('Erro ao copiar QR code:', error)
      try {
        // Fallback: copiar o link se QR code não funcionar
        await navigator.clipboard.writeText(link)
        showSuccess('Link copiado', {
          message: 'QR code não suportado, mas o link foi copiado para a área de transferência.',
          link: link,
          icon: 'link',
          duration: 5000,
        })
      } catch (e) {
        showError('Erro ao copiar', {
          message: 'Tente salvar a imagem manualmente.',
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
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <WellnessNavBar showTitle title="Meus Links" />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          if (!item && (previewAberto === 'hom-agendadas' || previewAberto === 'hom-gravada')) {
            if (previewAberto === 'hom-agendadas') {
              item = {
                id: 'hom-agendadas',
                nome: 'HOM ao vivo',
                tipo: 'fluxo-recrutamento' as const,
                categoria: 'Recrutamento',
                link: '/pt/wellness/system/recrutar/enviar-link',
                descricao: 'Segunda-feira às 20h • Quarta-feira às 9h',
                icon: '📅',
                metadata: { tipo: 'hom-agendadas' }
              }
            } else if (previewAberto === 'hom-gravada') {
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
                <div className="p-6">
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
                  ) : item.metadata?.isTemplate && item.metadata?.template ? (
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
                  ) : item.metadata?.tipo === 'hom-agendadas' ? (
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">📅 HOM ao vivo</h3>
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-blue-800 font-semibold mb-2">Horários das Apresentações:</p>
                          <ul className="text-blue-700 space-y-2 text-sm">
                            <li>• Segunda-feira às 20h</li>
                            <li>• Quarta-feira às 9h</li>
                          </ul>
                        </div>
                        <p className="text-gray-700 text-sm">
                          Links do Zoom e apresentação online disponíveis na página completa.
                        </p>
                        <div className="flex gap-3 mt-4">
                          <Link
                            href="/pt/wellness/system/recrutar/enviar-link"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                          >
                            Abrir Página Completa →
                          </Link>
                        </div>
                      </div>
                    </div>
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
                      // Renderizar template real do Hype Drink
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
                      
                      switch (slug) {
                        case 'energia-foco':
                          return <TemplateHypeEnergiaFoco config={config} />
                        case 'pre-treino':
                          return <TemplateHypePreTreino config={config} />
                        case 'rotina-produtiva':
                          return <TemplateHypeRotinaProdutiva config={config} />
                        case 'constancia':
                          return <TemplateHypeConstancia config={config} />
                        case 'consumo-cafeina':
                          return <TemplateHypeConsumoCafeina config={config} />
                        case 'custo-energia':
                          return <TemplateHypeCustoEnergia config={config} />
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


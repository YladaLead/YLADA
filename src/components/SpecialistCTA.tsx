'use client'

import { MessageSquare, Download, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { getToolMessage } from '@/lib/tool-messages'

interface SpecialistCTAProps {
  toolName?: string
  className?: string
}

interface LinkData {
  id: string
  user_id: string
  tool_name: string
  cta_text: string
  redirect_url: string
  custom_message: string
  redirect_type: string
  project_name?: string
  custom_slug?: string
  capture_type?: string
  material_title?: string
  material_description?: string
  professional: {
    name: string
    specialty?: string
    company?: string
  }
}

export default function SpecialistCTA({ className = '' }: SpecialistCTAProps) {
  const [linkData, setLinkData] = useState<LinkData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

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

  useEffect(() => {
    const fetchLinkData = async () => {
      // Evitar múltiplas execuções
      if (linkData) {
        console.log('⚠️ Dados já carregados, pulando busca...')
        return
      }
      
      console.log('🔍 SpecialistCTA: Iniciando busca de dados...')
      const urlParams = new URLSearchParams(window.location.search)
      const linkId = urlParams.get('ref') || urlParams.get('link')
      
      console.log('🌐 URL atual:', window.location.href)
      console.log('🔗 LinkId encontrado:', linkId)
      
      if (linkId) {
        try {
          console.log('🔍 Buscando dados do link com ref:', linkId)
          
          // Extrair usuário e projeto do ref (formato: usuario/projeto)
          const refParts = linkId.split('/')
          const usuario = refParts[0]
          const projeto = refParts[1]
          
          console.log('👤 Usuário extraído:', usuario)
          console.log('📋 Projeto extraído:', projeto)
          
          // Buscar todos os profissionais e comparar com o slug normalizado
          const { data: allProfessionals, error: profError } = await supabase
            .from('professionals')
            .select('id, name, email')
          
          if (profError) {
            console.error('❌ Erro ao buscar professionals:', profError)
            return
          }
          
          // Encontrar o profissional cujo nome normalizado corresponde ao slug
          const userData = allProfessionals?.find(prof => 
            normalizeText(prof.name) === usuario
          )
          
          if (!userData) {
            console.error('❌ Usuário não encontrado:', usuario)
            return
          }

          console.log('👤 Usuário encontrado:', userData)

          // Buscar todos os links do usuário e comparar com o slug normalizado
          const { data: allLinks, error: linksError } = await supabase
            .from('links')
            .select(`
              id,
              tool_name,
              cta_text,
              redirect_url,
              custom_message,
              capture_type,
              material_title,
              material_description,
              user_id,
              name
            `)
            .eq('user_id', userData.id)
            .eq('status', 'active')
          
          if (linksError) {
            console.error('❌ Erro ao buscar links:', linksError)
            return
          }
          
          // Encontrar o link cujo nome normalizado corresponde ao slug do projeto
          const data = allLinks?.find(linkItem => 
            normalizeText(linkItem.name) === projeto
          )
          
          console.log('📊 Dados encontrados:', { data, linksError })
          
          if (data) {
            console.log('✅ Dados carregados com sucesso:', data)
            
            // Buscar dados do profissional
            const { data: professionalData } = await supabase
              .from('professionals')
              .select('name, specialty, company')
              .eq('id', data.user_id)
              .single()

            // Corrigir estrutura dos dados do Supabase
            const linkData: LinkData = {
              ...data,
              redirect_type: 'whatsapp', // Assumindo WhatsApp por padrão
              project_name: projeto, // Usar o nome do projeto extraído
              custom_slug: `${usuario}/${projeto}`,
              capture_type: data.capture_type || 'direct', // Incluir capture_type
              material_title: data.material_title || '',
              material_description: data.material_description || '',
              professional: {
                name: professionalData?.name || 'Profissional',
                specialty: professionalData?.specialty || '',
                company: professionalData?.company || ''
              }
            }
            setLinkData(linkData)
            console.log('🎯 LinkData final:', linkData)
            console.log('💬 Custom message:', linkData.custom_message)
            console.log('🔘 CTA text:', linkData.cta_text)
            console.log('🔗 Redirect URL:', linkData.redirect_url)
            console.log('📋 Capture type:', linkData.capture_type)
            console.log('📄 Material title:', linkData.material_title)
          } else {
            console.error('❌ Erro ao buscar dados:', error)
          }
        } catch (error) {
          console.error('❌ Erro ao buscar dados do link:', error)
        }
      } else {
        console.log('⚠️ Nenhum ref encontrado na URL')
      }
      setLoading(false)
    }

    fetchLinkData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleContactSpecialist = () => {
    if (!linkData) return
    
    // Se for captura de dados, mostrar formulário na mesma página
    if (linkData.capture_type === 'capture') {
      setShowForm(true)
    } else {
      // Se for botão direto, redirecionar para WhatsApp/Site
      if (linkData.redirect_url) {
        window.location.href = linkData.redirect_url
      } else {
        window.location.href = '/herbalead'
      }
    }
  }

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Validação de email
    if (formData.email && !isValidEmail(formData.email)) {
      alert('Por favor, insira um email válido.')
      setSubmitting(false)
      return
    }

    // Validação e formatação de telefone
    const formattedPhone = formatPhoneNumber(formData.phone)
    if (!isValidPhone(formattedPhone)) {
      alert('Por favor, insira um número de WhatsApp válido com código do país.')
      setSubmitting(false)
      return
    }

    try {
      // Salvar lead no Supabase
      const { data: lead, error } = await supabase
        .from('leads')
        .insert({
          user_id: linkData!.user_id,
          link_id: linkData!.id,
          name: formData.name,
          phone: formattedPhone,
          email: formData.email,
          tool_name: linkData!.tool_name,
          lead_type: 'capture',
          status: 'new'
        })
        .select()
        .single()

      if (error) {
        console.error('Erro ao salvar lead:', error)
        alert('Erro ao salvar dados. Tente novamente.')
        setSubmitting(false)
        return
      }

      console.log('✅ Lead salvo com sucesso:', lead)
      setSubmitted(true)

      // Incrementar contador de leads no link
      await supabase
        .from('links')
        .update({ leads: 1 })
        .eq('id', linkData!.id)

    } catch (error) {
      console.error('Erro ao processar formulário:', error)
      alert('Ocorreu um erro inesperado. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  // Função para validar email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Função para validar telefone
  const isValidPhone = (phone: string): boolean => {
    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '')
    // Deve ter pelo menos 10 dígitos (código do país + número)
    return cleanPhone.length >= 10
  }

  // Função para formatar telefone com código do país
  const formatPhoneNumber = (phone: string): string => {
    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '')
    
    // Se já tem código do país, retorna como está
    if (cleanPhone.startsWith('55') && cleanPhone.length >= 12) {
      return '+' + cleanPhone
    }
    
    // Se não tem código do país, adiciona +55
    if (cleanPhone.length >= 10) {
      return '+55' + cleanPhone
    }
    
    // Se é muito curto, retorna como está para validação falhar
    return phone
  }

  if (loading) {
    return (
      <div className={`mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-emerald-200 rounded mb-3"></div>
          <div className="h-10 bg-emerald-200 rounded"></div>
        </div>
      </div>
    )
  }

  // Obter mensagem personalizada baseada na ferramenta
  const toolMessage = linkData?.tool_name ? getToolMessage(linkData.tool_name) : null
  const displayMessage = linkData?.custom_message || toolMessage?.shortMessage || 'Quer receber orientações personalizadas?'

  return (
    <div className={`mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200 ${className}`}>
      {/* Mostrar mensagem personalizada */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          {displayMessage}
        </p>
      </div>
      
      {/* Botão personalizado */}
      <button
        onClick={handleContactSpecialist}
        className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center justify-center"
      >
        {linkData?.capture_type === 'capture' ? (
          <>
            <Download className="w-5 h-5 mr-2" />
            {linkData?.cta_text || 'Receber Material Gratuito'}
          </>
        ) : (
          <>
            <MessageSquare className="w-5 h-5 mr-2" />
            {linkData?.cta_text || 'Falar com Especialista'}
          </>
        )}
      </button>

      {/* Formulário de captura (aparece quando showForm é true) */}
      {showForm && !submitted && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4">
            {linkData?.material_title || 'Receber Material Gratuito'}
          </h3>
          
          {linkData?.material_description && (
            <p className="text-sm text-gray-600 mb-4">
              {linkData.material_description}
            </p>
          )}

          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="+55 11 99999-9999 (com código do país)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (Opcional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="seu@email.com"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="authorize"
                className="mr-2"
                required
              />
              <label htmlFor="authorize" className="text-sm text-gray-700">
                Autorizo receber o material gratuito e futuras comunicações
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Receber Material Gratuito
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Mensagem de sucesso */}
      {submitted && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <div>
              <p className="font-semibold text-green-900">Parabéns! 🎉</p>
              <p className="text-sm text-green-800">
                Seus dados foram enviados com sucesso! Em breve você receberá o material gratuito.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Debug info - remover depois */}
      {process.env.NODE_ENV === 'development' && linkData && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <strong>Debug:</strong> {linkData.custom_slug} → {linkData.redirect_url}
        </div>
      )}
    </div>
  )
}

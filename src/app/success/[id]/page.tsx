'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { CheckCircle, Download, ArrowLeft } from 'lucide-react'

interface LinkData {
  id: string
  name: string
  tool_name: string
  material_title: string
  material_description: string
  user_id: string
  professional: {
    name: string
    specialty: string
    company: string
  }
}

export default function SuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const [linkData, setLinkData] = useState<LinkData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  })
  const router = useRouter()

  useEffect(() => {
    const fetchLinkData = async () => {
      try {
        const resolvedParams = await params
        console.log('🔍 Buscando dados do link:', resolvedParams.id)
        
        // Buscar dados do link
        const { data: link, error: linkError } = await supabase
          .from('links')
          .select(`
            id,
            name,
            tool_name,
            material_title,
            material_description,
            user_id,
            capture_type
          `)
          .eq('id', resolvedParams.id)
          .eq('status', 'active')
          .single()

        if (linkError || !link) {
          console.error('Link não encontrado:', linkError)
          router.push('/')
          return
        }

        // Verificar se é do tipo capture
        if (link.capture_type !== 'capture') {
          console.log('Link não é do tipo capture, redirecionando...')
          router.push('/')
          return
        }

        // Buscar dados do profissional
        const { data: professional } = await supabase
          .from('professionals')
          .select('name, specialty, company')
          .eq('id', link.user_id)
          .single()

        const formattedLinkData: LinkData = {
          ...link,
          professional: {
            name: professional?.name || 'Profissional',
            specialty: professional?.specialty || '',
            company: professional?.company || ''
          }
        }

        setLinkData(formattedLinkData)
        console.log('📊 Dados carregados:', formattedLinkData)

      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchLinkData()
  }, [params, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Salvar lead no Supabase
      const { data: lead, error } = await supabase
        .from('leads')
        .insert({
          user_id: linkData!.user_id,
          link_id: linkData!.id,
          name: formData.name,
          phone: formData.phone,
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
      alert('Erro interno. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!linkData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link não encontrado</h1>
          <p className="text-gray-600 mb-4">Este link não existe ou foi desativado</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Parabéns! 🎉
          </h1>
          
          <p className="text-gray-600 mb-6">
            Seus dados foram enviados com sucesso! Em breve você receberá o material gratuito.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              {linkData.material_title}
            </h3>
            <p className="text-sm text-blue-800">
              {linkData.material_description}
            </p>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>Profissional:</strong> {linkData.professional.name}
              {linkData.professional.specialty && ` - ${linkData.professional.specialty}`}
              {linkData.professional.company && ` (${linkData.professional.company})`}
            </p>
          </div>
          
          <button
            onClick={() => router.push('/')}
            className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar ao início
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Parabéns! 🎉
          </h1>
          <p className="text-gray-600">
            Você completou o {linkData.name}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            {linkData.material_title}
          </h3>
          <p className="text-sm text-blue-800">
            {linkData.material_description}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="+55 11 99999-9999"
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

        <div className="mt-4 text-xs text-gray-500 text-center">
          Seus dados estão seguros e serão usados apenas para enviar o material solicitado.
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import SortableList from '@/components/admin/wellness-cursos/SortableList'
import type { WellnessCurso, WellnessCursoModulo, WellnessModuloTopico, WellnessCursoMaterial } from '@/types/wellness-cursos'
import { createClient } from '@/lib/supabase-client'

const supabase = createClient()

type Area = 'wellness' | 'nutri' | 'coach' | 'nutra' | 'todos'

function AdminCursosContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const areaFiltro = (searchParams.get('area') as Area) || 'wellness' // Padrão: wellness
  
  const [modulos, setModulos] = useState<(WellnessCursoModulo & {
    topicos?: (WellnessModuloTopico & {
      cursos?: WellnessCursoMaterial[]
    })[]
  })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Estados para expansão
  const [modulosExpandidos, setModulosExpandidos] = useState<Set<string>>(new Set())
  const [topicosExpandidos, setTopicosExpandidos] = useState<Set<string>>(new Set())
  
  // Estados para formulários
  const [mostrarFormModulo, setMostrarFormModulo] = useState(false)
  const [moduloEditando, setModuloEditando] = useState<WellnessCursoModulo | null>(null)
  const [topicoEditando, setTopicoEditando] = useState<{ moduloId: string; topico?: WellnessModuloTopico } | null>(null)
  const [mostrarFormCurso, setMostrarFormCurso] = useState(false)
  const [mostrarSelecaoArea, setMostrarSelecaoArea] = useState(false) // Primeiro passo: selecionar área
  const [cursoEditando, setCursoEditando] = useState<WellnessCursoMaterial | null>(null)
  const [salvandoTopico, setSalvandoTopico] = useState(false)

  const [formModulo, setFormModulo] = useState({ titulo: '', descricao: '', areas: [] as string[] })
  const [mostrarSelecaoAreaModulo, setMostrarSelecaoAreaModulo] = useState(false) // Primeiro passo: selecionar área do módulo
  const [formTopico, setFormTopico] = useState({ titulo: '', descricao: '' })
  const [formCurso, setFormCurso] = useState<{
    modulo_id: string
    topico_id: string
    tipo: 'pdf' | 'video'
    titulo: string
    descricao: string
    arquivo_url: string
    duracao: string
    gratuito: boolean
    areas: string[] // Áreas onde o curso vai aparecer
  }>({
    modulo_id: '',
    topico_id: '',
    tipo: 'pdf',
    titulo: '',
    descricao: '',
    arquivo_url: '',
    duracao: '',
    gratuito: false,
    areas: [] // Sempre inicializar como array vazio
  })

  useEffect(() => {
    carregarModulos()
  }, [areaFiltro])

  // Scroll automático para o formulário quando ele aparecer
  useEffect(() => {
    if (mostrarFormCurso) {
      // Aguardar um pouco para o DOM atualizar
      setTimeout(() => {
        const formElement = document.querySelector('[data-form-curso]')
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
          // Adicionar um pequeno offset para não ficar colado no topo
          window.scrollBy(0, -20)
        }
      }, 100)
    }
  }, [mostrarFormCurso])

  const carregarModulos = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Não autenticado')
        return
      }

      // Carregar módulos
      const modulosResponse = await fetch('/api/wellness/modulos', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!modulosResponse.ok) {
        throw new Error('Erro ao carregar módulos')
      }

      const modulosData = await modulosResponse.json()
      const modulosList = modulosData.modulos || []

      // Para cada módulo, carregar tópicos e cursos
      const modulosCompletos = await Promise.all(
        modulosList.map(async (modulo: WellnessCursoModulo) => {
          // Carregar tópicos
          const topicosResponse = await fetch(`/api/wellness/modulos/${modulo.id}/topicos`, {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          })

          let topicos: (WellnessModuloTopico & { cursos?: WellnessCursoMaterial[] })[] = []
          
          if (topicosResponse.ok) {
            const topicosData = await topicosResponse.json()
            topicos = await Promise.all(
              (topicosData.topicos || []).map(async (topico: WellnessModuloTopico) => {
                // Carregar cursos do tópico (com filtro de área se aplicável)
                const cursosUrl = areaFiltro !== 'todos' 
                  ? `/api/wellness/modulos/${modulo.id}/topicos/${topico.id}/cursos?area=${areaFiltro}`
                  : `/api/wellness/modulos/${modulo.id}/topicos/${topico.id}/cursos`
                const cursosResponse = await fetch(cursosUrl, {
                  headers: {
                    'Authorization': `Bearer ${session.access_token}`
                  }
                })

                let cursos: WellnessCursoMaterial[] = []
                if (cursosResponse.ok) {
                  const cursosData = await cursosResponse.json()
                  cursos = cursosData.cursos || []
                }

                return { ...topico, cursos }
              })
            )
          }

          return { ...modulo, topicos }
        })
      )

      setModulos(modulosCompletos)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleModulo = (moduloId: string) => {
    const novos = new Set(modulosExpandidos)
    if (novos.has(moduloId)) {
      novos.delete(moduloId)
    } else {
      novos.add(moduloId)
    }
    setModulosExpandidos(novos)
  }

  const toggleTopico = (topicoId: string) => {
    const novos = new Set(topicosExpandidos)
    if (novos.has(topicoId)) {
      novos.delete(topicoId)
    } else {
      novos.add(topicoId)
    }
    setTopicosExpandidos(novos)
  }

  const mudarFiltro = (area: Area) => {
    // Sempre usar uma área específica (não mais 'todos')
    if (area === 'todos') {
      router.push('/admin/cursos?area=wellness') // Padrão: wellness
    } else {
      router.push(`/admin/cursos?area=${area}`)
    }
  }
  
  // Garantir que sempre tenha uma área selecionada
  useEffect(() => {
    if (!areaFiltro || areaFiltro === 'todos') {
      router.push('/admin/cursos?area=wellness')
    }
  }, [areaFiltro, router])

  const handleNovoModulo = () => {
    setModuloEditando(null)
    setFormModulo({ titulo: '', descricao: '', areas: [] })
    setMostrarFormModulo(false) // Não mostrar formulário ainda
    setMostrarSelecaoAreaModulo(true) // Mostrar primeiro a seleção de área
  }

  const handleSalvarModulo = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validações
    if (!formModulo.titulo || formModulo.titulo.trim() === '') {
      alert('Preencha o título do módulo!')
      return
    }
    
    // Só validar áreas se for um novo módulo (não ao editar)
    if (!moduloEditando && (!formModulo.areas || formModulo.areas.length === 0)) {
      alert('Selecione pelo menos uma área!')
      return
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const url = moduloEditando
        ? `/api/wellness/modulos/${moduloEditando.id}`
        : '/api/wellness/modulos'
      
      const method = moduloEditando ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          titulo: formModulo.titulo,
          descricao: formModulo.descricao,
          areas: formModulo.areas // Enviar áreas selecionadas
        })
      })

      const responseData = await response.json()
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Erro ao salvar módulo')
      }

      await carregarModulos()
      
      // Expandir o módulo recém-criado
      if (responseData.modulo?.id) {
        setModulosExpandidos(prev => new Set(prev).add(responseData.modulo.id))
      }
      
      setMostrarFormModulo(false)
      setMostrarSelecaoAreaModulo(false)
      setModuloEditando(null)
      setFormModulo({ titulo: '', descricao: '', areas: [] })
    } catch (err: any) {
      alert(`Erro: ${err.message}`)
    }
  }

  const handleNovoTopico = (moduloId: string) => {
    // Garantir que modal de área não está aberto (tópicos não precisam de área)
    setMostrarSelecaoArea(false)
    setTopicoEditando({ moduloId })
    setFormTopico({ titulo: '', descricao: '' })
  }

  const handleSalvarTopico = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevenir propagação do evento
    
    if (!topicoEditando) return
    
    // Proteção contra duplo submit
    if (salvandoTopico) {
      console.log('⚠️ Tópico já está sendo salvo, ignorando...')
      return
    }

    try {
      setSalvandoTopico(true)
      console.log('💾 Salvando tópico:', formTopico)
      
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setSalvandoTopico(false)
        return
      }

      const url = topicoEditando.topico
        ? `/api/wellness/modulos/${topicoEditando.moduloId}/topicos/${topicoEditando.topico.id}`
        : `/api/wellness/modulos/${topicoEditando.moduloId}/topicos`
      
      const method = topicoEditando.topico ? 'PUT' : 'POST'

      console.log('📤 Enviando requisição:', { url, method, formTopico })

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formTopico)
      })

      const responseData = await response.json()
      
      console.log('📥 Resposta recebida:', responseData)
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Erro ao salvar tópico')
      }

      await carregarModulos()
      
      // Expandir o tópico recém-criado e garantir que o módulo está expandido
      if (responseData.topico?.id && topicoEditando) {
        setModulosExpandidos(prev => new Set(prev).add(topicoEditando.moduloId))
        setTopicosExpandidos(prev => new Set(prev).add(responseData.topico.id))
      }
      
      setTopicoEditando(null)
      setFormTopico({ titulo: '', descricao: '' })
      // Garantir que modal de área não está aberto após salvar tópico
      setMostrarSelecaoArea(false)
    } catch (err: any) {
      console.error('❌ Erro ao salvar tópico:', err)
      alert(`Erro: ${err.message}`)
    } finally {
      setSalvandoTopico(false)
    }
  }

  const handleNovoCurso = () => {
    if (modulos.length === 0) {
      alert('Crie um módulo primeiro!')
      return
    }
    setCursoEditando(null)
    setMostrarSelecaoArea(false) // Não mostrar modal de área
    setMostrarFormCurso(true) // Mostrar formulário direto
    setFormCurso({
      modulo_id: '',
      topico_id: '',
      tipo: 'pdf',
      titulo: '',
      descricao: '',
      arquivo_url: '',
      duracao: '',
      gratuito: false,
      areas: [] // Começar sem áreas selecionadas
    })
  }

  const handleSalvarCurso = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validações
    if (!formCurso.modulo_id || !formCurso.topico_id) {
      alert('Selecione módulo e tópico!')
      return
    }
    
    if (!formCurso.titulo || formCurso.titulo.trim() === '') {
      alert('Preencha o título do material!')
      return
    }
    
    if (!formCurso.arquivo_url || formCurso.arquivo_url.trim() === '') {
      alert('Faça o upload do arquivo antes de salvar!')
      return
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Buscar áreas do módulo automaticamente (material herda áreas do módulo)
      let areasDoModulo: string[] = []
      if (formCurso.modulo_id) {
        try {
          const areasResponse = await fetch(`/api/wellness/modulos/${formCurso.modulo_id}/areas`, {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          })
          if (areasResponse.ok) {
            const areasData = await areasResponse.json()
            areasDoModulo = areasData.areas || []
          } else {
            const errorData = await areasResponse.json().catch(() => ({}))
            console.error('Erro ao buscar áreas do módulo:', errorData)
          }
        } catch (err) {
          console.error('Erro ao buscar áreas do módulo:', err)
        }
      }

      // Validar que o módulo tem áreas antes de continuar
      if (areasDoModulo.length === 0) {
        alert('O módulo selecionado não possui áreas cadastradas. Por favor, edite o módulo e selecione pelo menos uma área antes de criar materiais.')
        return
      }

      const url = cursoEditando
        ? `/api/wellness/modulos/${formCurso.modulo_id}/topicos/${formCurso.topico_id}/cursos/${cursoEditando.id}`
        : `/api/wellness/modulos/${formCurso.modulo_id}/topicos/${formCurso.topico_id}/cursos`
      
      const method = cursoEditando ? 'PUT' : 'POST'

      const body: any = {
        topico_id: formCurso.topico_id,
        tipo: formCurso.tipo,
        titulo: formCurso.titulo,
        descricao: formCurso.descricao,
        arquivo_url: formCurso.arquivo_url,
        duracao: formCurso.duracao ? parseInt(formCurso.duracao) : null,
        gratuito: formCurso.gratuito,
        areas: areasDoModulo // Usar áreas do módulo automaticamente
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const responseData = await response.json()
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Erro ao salvar curso')
      }

      await carregarModulos()
      
      // Garantir que o módulo e tópico estão expandidos após criar curso
      if (responseData.curso?.id) {
        setModulosExpandidos(prev => new Set(prev).add(formCurso.modulo_id))
        setTopicosExpandidos(prev => new Set(prev).add(formCurso.topico_id))
      }
      
      setCursoEditando(null)
      setMostrarFormCurso(false)
      setMostrarSelecaoArea(false) // Garantir que modal de área seja fechado
      setFormCurso({
        modulo_id: '',
        topico_id: '',
        tipo: 'pdf', // Padrão para PDF/Imagem
        titulo: '',
        descricao: '',
        arquivo_url: '',
        duracao: '',
        gratuito: false,
        areas: []
      })
    } catch (err: any) {
      alert(`Erro: ${err.message}`)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, tipo: 'pdf' | 'video') => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('tipo', tipo)

      const response = await fetch('/api/wellness/cursos/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        body: uploadFormData
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Erro no upload:', data)
        throw new Error(data.error || 'Erro ao fazer upload')
      }

      setFormCurso(prev => ({ ...prev, arquivo_url: data.url }))
      alert('Upload realizado com sucesso!')
    } catch (err: any) {
      console.error('Erro completo no upload:', err)
      alert(`Erro no upload: ${err.message}`)
    }
  }

  const handleDeletarModulo = async (moduloId: string) => {
    if (!confirm('Tem certeza que deseja deletar este módulo? Todos os tópicos e cursos serão deletados.')) {
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`/api/wellness/modulos/${moduloId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao deletar módulo')
      }

      await carregarModulos()
    } catch (err: any) {
      alert(`Erro: ${err.message}`)
    }
  }

  const handleDeletarTopico = async (moduloId: string, topicoId: string) => {
    if (!confirm('Tem certeza que deseja deletar este tópico? Todos os cursos serão deletados.')) {
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`/api/wellness/modulos/${moduloId}/topicos/${topicoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao deletar tópico')
      }

      await carregarModulos()
    } catch (err: any) {
      alert(`Erro: ${err.message}`)
    }
  }

  const handleDeletarCurso = async (moduloId: string, topicoId: string, cursoId: string) => {
    if (!confirm('Tem certeza que deseja deletar este curso?')) {
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`/api/wellness/modulos/${moduloId}/topicos/${topicoId}/cursos/${cursoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao deletar curso')
      }

      await carregarModulos()
    } catch (err: any) {
      alert(`Erro: ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <Link
                    href="/admin"
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                  >
                    ← Dashboard Admin
                  </Link>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">📚 Cursos</h1>
                <p className="mt-2 text-gray-600">Gerencie cursos de todas as áreas</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleNovoModulo}
                  className="bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  + Novo Módulo
                </button>
                <button
                  onClick={handleNovoCurso}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  + Novo Curso
                </button>
              </div>
            </div>
          </div>

          {/* Filtros por Área */}
          <div className="mb-6 flex space-x-2 flex-wrap">
            <button
              onClick={() => mudarFiltro('wellness')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                areaFiltro === 'wellness'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              🟢 Wellness
            </button>
            <button
              onClick={() => mudarFiltro('nutri')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                areaFiltro === 'nutri'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              🔵 Nutri
            </button>
            <button
              onClick={() => mudarFiltro('coach')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                areaFiltro === 'coach'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              🟣 Coach
            </button>
            <button
              onClick={() => mudarFiltro('nutra')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                areaFiltro === 'nutra'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              🟠 Nutra
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando cursos...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Modal de Seleção de Área do Módulo (primeiro passo ao criar novo módulo ou ao editar) */}
          {mostrarSelecaoAreaModulo && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 relative z-10">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Selecione a(s) área(s) do módulo
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Escolha em quais áreas este módulo vai aparecer. Você pode selecionar múltiplas áreas.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  { value: 'wellness', label: '🟢 Wellness', selectedClass: 'border-green-500 bg-green-50' },
                  { value: 'nutri', label: '🔵 Nutri', selectedClass: 'border-blue-500 bg-blue-50' },
                  { value: 'coach', label: '🟣 Coach', selectedClass: 'border-purple-500 bg-purple-50' },
                  { value: 'nutra', label: '🟠 Nutra', selectedClass: 'border-orange-500 bg-orange-50' }
                ].map((area) => (
                  <label
                    key={area.value}
                    className={`flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      (formModulo.areas || []).includes(area.value)
                        ? area.selectedClass
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={(formModulo.areas || []).includes(area.value)}
                      onChange={(e) => {
                        const currentAreas = formModulo.areas || []
                        if (e.target.checked) {
                          setFormModulo(prev => ({
                            ...prev,
                            areas: [...currentAreas, area.value]
                          }))
                        } else {
                          setFormModulo(prev => ({
                            ...prev,
                            areas: currentAreas.filter(a => a !== area.value)
                          }))
                        }
                      }}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{area.label}</span>
                  </label>
                ))}
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={async () => {
                    const areasSelecionadas = formModulo.areas || []
                    if (areasSelecionadas.length > 0) {
                      if (moduloEditando) {
                        // Se está editando, salvar áreas diretamente
                        try {
                          const { data: { session } } = await supabase.auth.getSession()
                          if (!session) return

                          const response = await fetch(`/api/wellness/modulos/${moduloEditando.id}`, {
                            method: 'PUT',
                            headers: {
                              'Authorization': `Bearer ${session.access_token}`,
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                              areas: areasSelecionadas
                            })
                          })

                          if (!response.ok) {
                            const errorData = await response.json()
                            throw new Error(errorData.error || 'Erro ao salvar áreas')
                          }

                          await carregarModulos()
                          setMostrarSelecaoAreaModulo(false)
                          setMostrarFormModulo(true)
                        } catch (err: any) {
                          alert(`Erro: ${err.message}`)
                        }
                      } else {
                        // Se está criando, apenas continuar para o formulário
                        setMostrarSelecaoAreaModulo(false)
                        setMostrarFormModulo(true)
                      }
                    } else {
                      alert('Selecione pelo menos uma área!')
                    }
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  {moduloEditando ? 'Salvar áreas' : 'Continuar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMostrarSelecaoAreaModulo(false)
                    if (moduloEditando) {
                      // Se está editando, voltar para o formulário sem limpar áreas
                      setMostrarFormModulo(true)
                    } else {
                      // Se está criando, limpar áreas
                      setFormModulo(prev => ({ ...prev, areas: [] }))
                    }
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Formulário de Módulo */}
          {mostrarFormModulo && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {moduloEditando ? 'Editar Módulo' : 'Novo Módulo'}
              </h3>
              {/* Mostrar áreas selecionadas */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Áreas do módulo:</p>
                  {moduloEditando && (
                    <button
                      type="button"
                      onClick={() => {
                        setMostrarFormModulo(false)
                        setMostrarSelecaoAreaModulo(true)
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Editar áreas
                    </button>
                  )}
                </div>
                {formModulo.areas && formModulo.areas.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formModulo.areas.map((area) => {
                      const areaLabels: Record<string, string> = {
                        wellness: '🟢 Wellness',
                        nutri: '🔵 Nutri',
                        coach: '🟣 Coach',
                        nutra: '🟠 Nutra'
                      }
                      return (
                        <span
                          key={area}
                          className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700"
                        >
                          {areaLabels[area] || area}
                        </span>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Nenhuma área selecionada</p>
                )}
              </div>
              <form onSubmit={handleSalvarModulo} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formModulo.titulo}
                    onChange={(e) => setFormModulo(prev => ({ ...prev, titulo: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: Bem-Estar e Saúde"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formModulo.descricao}
                    onChange={(e) => setFormModulo(prev => ({ ...prev, descricao: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Descreva o módulo..."
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    {moduloEditando ? 'Salvar' : 'Criar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMostrarFormModulo(false)
                      setMostrarSelecaoAreaModulo(false)
                      setModuloEditando(null)
                      setFormModulo({ titulo: '', descricao: '', areas: [] })
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Formulário de Curso */}
          {mostrarFormCurso && (
            <div 
              data-form-curso
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 relative z-10"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {cursoEditando ? 'Editar Material' : 'Novo Material'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Você pode adicionar múltiplos materiais (PDFs, vídeos ou imagens) no mesmo tópico
              </p>
              <form onSubmit={handleSalvarCurso} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Módulo *
                    </label>
                    <select
                      value={formCurso.modulo_id}
                      onChange={(e) => {
                        setFormCurso(prev => ({ ...prev, modulo_id: e.target.value, topico_id: '' }))
                      }}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Selecione um módulo</option>
                      {modulos.map((modulo) => (
                        <option key={modulo.id} value={modulo.id}>
                          {modulo.titulo}
                        </option>
                      ))}
                    </select>
                    {formCurso.modulo_id && (
                      <p className="mt-1 text-xs text-green-600 flex items-center">
                        <span className="mr-1">✓</span>
                        {modulos.find(m => m.id === formCurso.modulo_id)?.titulo}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tópico *
                    </label>
                    <select
                      value={formCurso.topico_id}
                      onChange={(e) => setFormCurso(prev => ({ ...prev, topico_id: e.target.value }))}
                      required
                      disabled={!formCurso.modulo_id}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Selecione um tópico</option>
                      {modulos
                        .find(m => m.id === formCurso.modulo_id)
                        ?.topicos?.map((topico) => (
                          <option key={topico.id} value={topico.id}>
                            {topico.titulo}
                          </option>
                        ))}
                    </select>
                    {formCurso.topico_id && formCurso.modulo_id && (
                      <p className="mt-1 text-xs text-green-600 flex items-center">
                        <span className="mr-1">✓</span>
                        {modulos
                          .find(m => m.id === formCurso.modulo_id)
                          ?.topicos?.find(t => t.id === formCurso.topico_id)?.titulo}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo *
                  </label>
                  <select
                    value={formCurso.tipo}
                    onChange={(e) => {
                      const novoTipo = e.target.value as 'pdf' | 'video'
                      setFormCurso(prev => ({ 
                        ...prev, 
                        tipo: novoTipo,
                        arquivo_url: '' // Limpar URL ao mudar tipo
                      }))
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="video">Vídeo</option>
                    <option value="pdf">PDF / Imagem</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formCurso.titulo}
                    onChange={(e) => setFormCurso(prev => ({ ...prev, titulo: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: Introdução ao Bem-Estar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arquivo *
                  </label>
                  <input
                    type="file"
                    key={formCurso.tipo} // Força re-render quando tipo muda
                    accept={
                      formCurso.tipo === 'video' 
                        ? 'video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo,video/x-matroska,.mp4,.mov,.avi,.webm,.mkv' 
                        : 'application/pdf,image/jpeg,image/jpg,image/png,.pdf,.jpg,.jpeg,.png'
                    }
                    onChange={(e) => handleFileUpload(e, formCurso.tipo)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formCurso.tipo === 'video' 
                      ? 'Formatos aceitos: MP4, MOV, AVI, WebM, MKV' 
                      : 'Formatos aceitos: PDF (.pdf), JPEG (.jpg, .jpeg), PNG (.png)'}
                  </p>
                  {formCurso.arquivo_url && (
                    <p className="mt-2 text-sm text-green-600">✓ Arquivo carregado</p>
                  )}
                </div>
                {formCurso.tipo === 'video' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duração (segundos)
                    </label>
                    <input
                      type="number"
                      value={formCurso.duracao}
                      onChange={(e) => setFormCurso(prev => ({ ...prev, duracao: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ex: 300 (5 minutos)"
                    />
                  </div>
                )}
                {/* Mostrar áreas do módulo (somente leitura - material herda do módulo) */}
                {formCurso.modulo_id && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Áreas do material
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Este material aparecerá automaticamente nas mesmas áreas do módulo "{modulos.find(m => m.id === formCurso.modulo_id)?.titulo}".
                    </p>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600">
                        As áreas são herdadas automaticamente do módulo. Para alterar as áreas, edite o módulo.
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    {cursoEditando ? 'Salvar' : 'Criar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCursoEditando(null)
                      setMostrarFormCurso(false)
                      setMostrarSelecaoArea(false)
                      setFormCurso({
                        modulo_id: '',
                        topico_id: '',
                        tipo: 'pdf',
                        titulo: '',
                        descricao: '',
                        arquivo_url: '',
                        duracao: '',
                        gratuito: false,
                        areas: []
                      })
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de Módulos */}
          {!loading && !error && (
            <div className="space-y-4">
              {modulos.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 text-center py-12">
                  <p className="text-gray-500 mb-4">
                    Nenhum módulo criado ainda.
                  </p>
                  <button
                    onClick={handleNovoModulo}
                    className="text-green-600 hover:text-green-700 font-semibold"
                  >
                    Criar primeiro módulo →
                  </button>
                </div>
              ) : (
                modulos.map((modulo) => (
                  <div key={modulo.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {/* Header do Módulo */}
                    <div className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <button
                            onClick={() => toggleModulo(modulo.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {modulosExpandidos.has(modulo.id) ? '▼' : '▶'}
                          </button>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {modulo.titulo}
                            </h3>
                            {modulo.descricao && (
                              <p className="text-sm text-gray-600 mt-1">
                                {modulo.descricao}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={async () => {
                              setModuloEditando(modulo)
                              
                              // Carregar áreas do módulo
                              const { data: { session } } = await supabase.auth.getSession()
                              if (session) {
                                try {
                                  const areasResponse = await fetch(`/api/wellness/modulos/${modulo.id}/areas`, {
                                    headers: {
                                      'Authorization': `Bearer ${session.access_token}`
                                    }
                                  })
                                  let areas: string[] = []
                                  if (areasResponse.ok) {
                                    const areasData = await areasResponse.json()
                                    areas = areasData.areas || []
                                  }
                                  
                                  setFormModulo({
                                    titulo: modulo.titulo,
                                    descricao: modulo.descricao || '',
                                    areas: areas
                                  })
                                } catch (err) {
                                  console.error('Erro ao carregar áreas:', err)
                                  setFormModulo({
                                    titulo: modulo.titulo,
                                    descricao: modulo.descricao || '',
                                    areas: []
                                  })
                                }
                              } else {
                                setFormModulo({
                                  titulo: modulo.titulo,
                                  descricao: modulo.descricao || '',
                                  areas: []
                                })
                              }
                              
                              setMostrarSelecaoAreaModulo(false) // Não mostrar seleção de área ao editar
                              setMostrarFormModulo(true)
                            }}
                            className="text-gray-600 hover:text-gray-900 p-2"
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeletarModulo(modulo.id)}
                            className="text-red-600 hover:text-red-700 p-2"
                            title="Deletar"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Tópicos (expandido) */}
                    {modulosExpandidos.has(modulo.id) && (
                      <div className="border-t border-gray-200 bg-gray-50">
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold text-gray-700">Tópicos</h4>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleNovoTopico(modulo.id)
                              }}
                              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                            >
                              + Novo Tópico
                            </button>
                          </div>

                          {/* Formulário de Tópico */}
                          {topicoEditando?.moduloId === modulo.id && (
                            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                              <h4 className="text-md font-bold text-gray-900 mb-3">
                                {topicoEditando.topico ? 'Editar Tópico' : 'Novo Tópico'}
                              </h4>
                              <form 
                                onSubmit={handleSalvarTopico} 
                                className="space-y-3"
                                onKeyDown={(e) => {
                                  // Prevenir Enter de submeter duas vezes
                                  if (e.key === 'Enter' && salvandoTopico) {
                                    e.preventDefault()
                                  }
                                }}
                              >
                                <input
                                  type="text"
                                  value={formTopico.titulo}
                                  onChange={(e) => setFormTopico(prev => ({ ...prev, titulo: e.target.value }))}
                                  required
                                  placeholder="Título do tópico *"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                                <textarea
                                  value={formTopico.descricao}
                                  onChange={(e) => setFormTopico(prev => ({ ...prev, descricao: e.target.value }))}
                                  placeholder="Descrição"
                                  rows={2}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                                <div className="flex space-x-2">
                                  <button
                                    type="submit"
                                    disabled={salvandoTopico}
                                    className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                  >
                                    {salvandoTopico ? 'Salvando...' : 'Salvar'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setTopicoEditando(null)
                                      setFormTopico({ titulo: '', descricao: '' })
                                      // Garantir que modal de área não está aberto ao cancelar
                                      setMostrarSelecaoArea(false)
                                    }}
                                    disabled={salvandoTopico}
                                    className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              </form>
                            </div>
                          )}

                          {/* Lista de Tópicos */}
                          <div className="space-y-3">
                            {modulo.topicos?.map((topico) => (
                              <div key={topico.id} className="bg-white rounded-lg border border-gray-200">
                                <div className="p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 flex-1">
                                      <button
                                        onClick={() => toggleTopico(topico.id)}
                                        className="text-gray-400 hover:text-gray-600 text-sm"
                                      >
                                        {topicosExpandidos.has(topico.id) ? '▼' : '▶'}
                                      </button>
                                      <span className="text-sm font-semibold text-gray-700">
                                        {topico.titulo}
                                      </span>
                                      {topico.descricao && (
                                        <span className="text-xs text-gray-500">
                                          - {topico.descricao}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => {
                                          setTopicoEditando({ moduloId: modulo.id, topico })
                                          setFormTopico({
                                            titulo: topico.titulo,
                                            descricao: topico.descricao || ''
                                          })
                                        }}
                                        className="text-gray-600 hover:text-gray-900 text-xs p-1"
                                      >
                                        ✏️
                                      </button>
                                      <button
                                        onClick={() => handleDeletarTopico(modulo.id, topico.id)}
                                        className="text-red-600 hover:text-red-700 text-xs p-1"
                                      >
                                        🗑️
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Cursos (expandido) */}
                                {topicosExpandidos.has(topico.id) && (
                                  <div className="border-t border-gray-200 bg-gray-50 p-3">
                                    <div className="flex items-center justify-between mb-3">
                                      <div>
                                        <h5 className="text-xs font-bold text-gray-600">Materiais do Tópico</h5>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                          {topico.cursos?.length || 0} material(is) cadastrado(s)
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          console.log('➕ Criando novo material para:', { moduloId: modulo.id, topicoId: topico.id })
                                          setCursoEditando(null)
                                          // Se já tem módulo e tópico definidos, mostrar formulário direto
                                          if (modulo.id && topico.id) {
                                            setMostrarSelecaoArea(false) // Não mostrar modal de área
                                            setFormCurso({
                                              modulo_id: modulo.id,
                                              topico_id: topico.id,
                                              tipo: 'pdf',
                                              titulo: '',
                                              descricao: '',
                                              arquivo_url: '',
                                              duracao: '',
                                              gratuito: false,
                                              areas: []
                                            })
                                            // Mostrar formulário e fazer scroll após um pequeno delay
                                            setMostrarFormCurso(true)
                                            setTimeout(() => {
                                              const formElement = document.querySelector('[data-form-curso]')
                                              if (formElement) {
                                                formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                                window.scrollBy(0, -20)
                                              }
                                            }, 150)
                                          } else {
                                            // Se não tem módulo/tópico, usar o fluxo normal
                                            handleNovoCurso()
                                          }
                                        }}
                                        className="px-2 py-1 bg-green-600 text-white text-xs rounded font-medium hover:bg-green-700 transition-colors cursor-pointer"
                                        title="Adicionar novo material (PDF, vídeo ou imagem)"
                                      >
                                        + Novo Material
                                      </button>
                                    </div>
                                    <div className="space-y-2">
                                      {topico.cursos?.map((curso, index) => (
                                        <div key={curso.id} className="bg-white rounded border border-gray-200 p-2 flex items-center justify-between">
                                          <div className="flex items-center space-x-2 flex-1">
                                            <span className="text-lg">
                                              {curso.tipo === 'video' ? '▶️' : '📄'}
                                            </span>
                                            <div className="flex-1">
                                              <span className="text-sm font-medium text-gray-900">
                                                {curso.titulo}
                                              </span>
                                              <span className="text-xs text-gray-500 ml-2">
                                                ({curso.tipo === 'video' ? 'Vídeo' : 'PDF/Imagem'})
                                              </span>
                                            </div>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <button
                                              type="button"
                                              onClick={async (e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                console.log('✏️ Editando curso:', curso.id)
                                                setCursoEditando(curso)
                                                setMostrarSelecaoArea(false)
                                                setMostrarFormCurso(true)
                                                
                                                // Material herda áreas do módulo, não precisa carregar
                                                setFormCurso({
                                                  modulo_id: modulo.id,
                                                  topico_id: topico.id,
                                                  tipo: curso.tipo,
                                                  titulo: curso.titulo,
                                                  descricao: curso.descricao || '',
                                                  arquivo_url: curso.arquivo_url,
                                                  duracao: curso.duracao ? curso.duracao.toString() : '',
                                                  gratuito: curso.gratuito,
                                                  areas: [] // Áreas serão herdadas do módulo automaticamente
                                                })
                                              }}
                                              className="text-gray-600 hover:text-gray-900 text-xs p-1 cursor-pointer"
                                              title="Editar material"
                                            >
                                              ✏️
                                            </button>
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                console.log('🗑️ Deletando curso:', curso.id)
                                                handleDeletarCurso(modulo.id, topico.id, curso.id)
                                              }}
                                              className="text-red-600 hover:text-red-700 text-xs p-1 cursor-pointer"
                                              title="Deletar material"
                                            >
                                              🗑️
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                      {(!topico.cursos || topico.cursos.length === 0) && (
                                        <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                                          <p className="text-xs text-gray-500 mb-2">
                                            Nenhum material cadastrado ainda
                                          </p>
                                          <p className="text-xs text-gray-400">
                                            Clique em "+ Novo Material" para adicionar PDFs, vídeos ou imagens
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                            {(!modulo.topicos || modulo.topicos.length === 0) && (
                              <p className="text-sm text-gray-500 text-center py-4">
                                Nenhum tópico ainda
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
  )
}

export default function AdminCursosPage() {
  return (
    <AdminProtectedRoute>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      }>
        <AdminCursosContent />
      </Suspense>
    </AdminProtectedRoute>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Download, Play, CheckCircle, Lock, BookOpen, Clock, Star } from 'lucide-react'
import HerbaleadLogo from '@/components/HerbaleadLogo'
import HelpButton from '@/components/HelpButton'

interface Course {
  id: string
  title: string
  description: string
  difficulty_level: string
  estimated_hours: number
  course_image_url?: string
  course_tags: string[]
  learning_objectives: string[]
  is_active: boolean
}

interface CourseModule {
  id: string
  title: string
  description: string
  duration: string
  completed: boolean
  locked: boolean
  videoUrl?: string
  pdfFiles?: string[]
  pdfMaterials?: string
  materials: {
    name: string
    type: 'pdf' | 'template' | 'checklist' | 'video' | 'audio'
    path: string
  }[]
}

interface Enrollment {
  id: string
  course_id: string
  enrolled_at: string
  progress_percentage: number
  is_active: boolean
}

interface User {
  id: string
  email: string
}

export default function CoursePage() {
  const [user, setUser] = useState<User | null>(null)
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])
  const [enrolledCourses, setEnrolledCourses] = useState<Enrollment[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<CourseModule[]>([])

  useEffect(() => {
    checkUserAccess()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const checkUserAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data: professional } = await supabase
          .from('professionals')
          .select('is_active, name, email')
          .eq('id', user.id)
          .single()
        if (professional) {
          setHasAccess(professional.is_active)
        }
        loadCourses()
        loadEnrollments()
      }
    } catch (error) {
      console.error('Erro ao verificar acesso:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCourses = async () => {
    try {
      const { data: coursesData, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCourses(coursesData || [])
    } catch (error) {
      console.error('Erro ao carregar cursos:', error)
    }
  }

  const loadEnrollments = async () => {
    if (!user) return
    
    try {
      const { data: enrollmentsData, error } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)

      if (error) throw error
      setEnrolledCourses(enrollmentsData || [])
    } catch (error) {
      console.error('Erro ao carregar inscrições:', error)
    }
  }

  const startCourse = async (courseId: string) => {
    if (!user) return

    try {
      // Registrar início do curso diretamente
      await supabase
        .from('user_course_progress')
        .insert({
          user_id: user.id,
          course_id: courseId,
          progress_type: 'course_started'
        })

      // Criar inscrição automaticamente se não existir
      const { data, error } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          progress_percentage: 0,
          is_active: true
        })
        .select()
        .single()

      if (error && !error.message.includes('duplicate key')) {
        throw error
      }

      // Atualizar lista de cursos inscritos
      if (data) {
        setEnrolledCourses([...enrolledCourses, data])
      }
    } catch (error) {
      console.error('Erro ao iniciar curso:', error)
    }
  }

  const loadCourseModules = async (courseId: string) => {
    try {
      console.log('📖 Carregando módulos do curso:', courseId)
      const { data: modulesData, error } = await supabase
        .from('course_modules')
        .select(`
          *,
          course_materials (*)
        `)
        .eq('course_id', courseId)
        .eq('is_active', true)
        .order('order_index', { ascending: true })

      if (error) {
        console.error('❌ ERRO ao buscar módulos:', error)
        throw error
      }

      console.log('✅ Módulos carregados do banco:', modulesData?.length || 0)
      console.log('📊 Dados brutos dos módulos:', modulesData)

      const courseModules: CourseModule[] = modulesData?.map(module => {
        console.log('🔍 Processando módulo:', module.title)
        console.log('📹 Video URL:', module.video_url)
        console.log('📄 PDF Files:', module.pdf_files)
        console.log('📝 PDF Materials:', module.pdf_materials)
        
        return {
          id: module.id,
          title: module.title,
          description: module.description,
          duration: module.duration,
          completed: false,
          locked: false,
          videoUrl: module.video_url,
          pdfFiles: module.pdf_files || [],
          pdfMaterials: module.pdf_materials,
          materials: module.course_materials?.map(material => ({
            name: material.title,
            type: material.file_type as 'pdf' | 'template' | 'checklist' | 'video' | 'audio',
            path: material.file_path
          })) || []
        }
      }) || []

      console.log('📋 Módulos processados para exibição:', courseModules)
      console.log('🎯 Módulos com vídeo:', courseModules.filter(m => m.videoUrl).length)
      console.log('📄 Módulos com PDFs:', courseModules.filter(m => m.pdfFiles && m.pdfFiles.length > 0).length)
      
      setModules(courseModules)
    } catch (error) {
      console.error('❌ ERRO ao carregar módulos:', error)
      alert('ERRO: Não foi possível carregar os módulos do curso. Verifique o console para mais detalhes.')
    }
  }

  const isYouTubeUrl = (url: string): boolean => {
    return url.includes('youtube.com') || url.includes('youtu.be')
  }

  const isSupabaseVideoUrl = (url: string): boolean => {
    return url.includes('supabase') && (url.includes('.mp4') || url.includes('.webm') || url.includes('.ogg') || url.includes('.mov') || url.includes('.avi'))
  }

  const getYouTubeEmbedUrl = (url: string): string => {
    let videoId = ''
    
    // Extrair ID do vídeo de diferentes formatos de URL do YouTube
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0] || ''
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || ''
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0] || ''
    }
    
    return `https://www.youtube.com/embed/${videoId}`
  }


  const downloadMaterial = async (materialPath: string, materialName: string) => {
    if (!hasAccess) {
      alert('Você precisa ter acesso pago para baixar materiais')
      return
    }
    try {
      const response = await fetch(materialPath)
      const markdownContent = await response.text()
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${materialName}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; color: #333; }
            h1 { color: #10B981; border-bottom: 2px solid #10B981; padding-bottom: 10px; }
            h2 { color: #059669; margin-top: 30px; }
            h3 { color: #047857; }
            code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; }
            pre { background: #f3f4f6; padding: 15px; border-radius: 8px; overflow-x: auto; }
            blockquote { border-left: 4px solid #10B981; padding-left: 15px; margin-left: 0; color: #6B7280; }
            ul, ol { padding-left: 20px; }
            li { margin-bottom: 5px; }
            .highlight { background: #D1FAE5; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .warning { background: #FEF3C7; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .info { background: #DBEAFE; padding: 15px; border-radius: 8px; margin: 15px 0; }
          </style>
        </head>
        <body>
          ${markdownContent
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/`(.*)`/gim, '<code>$1</code>')
            .replace(/^\- (.*$)/gim, '<li>$1</li>')
            .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
            .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
            .replace(/\n\n/gim, '</p><p>')
            .replace(/^(?!<[h|l|b|p])/gim, '<p>')
            .replace(/(?<!>)$/gim, '</p>')
            .replace(/<p><\/p>/gim, '')
            .replace(/<p>(<h[1-6])/gim, '$1')
            .replace(/(<\/h[1-6]>)<\/p>/gim, '$1')
            .replace(/<p>(<li)/gim, '<ul>$1')
            .replace(/(<\/li>)<\/p>/gim, '$1</ul>')
            .replace(/<p>(<blockquote)/gim, '$1')
            .replace(/(<\/blockquote>)<\/p>/gim, '$1')
          }
        </body>
        </html>
      `
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${materialName}.html`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      alert('Material baixado com sucesso! Abra o arquivo HTML no seu navegador.')
    } catch (error) {
      console.error('Erro ao baixar material:', error)
      alert('Erro ao baixar material. Tente novamente.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando cursos...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <HerbaleadLogo size="lg" variant="horizontal" responsive={true} />
              <button 
                onClick={() => window.location.href = '/login'}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Fazer Login
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Acesso Restrito aos Cursos
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Faça login para acessar os cursos disponíveis.
            </p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Fazer Login
            </button>
          </div>
        </main>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <HerbaleadLogo size="lg" variant="horizontal" responsive={true} />
              <button 
                onClick={() => window.location.href = '/user'}
                className="text-gray-500 hover:text-gray-700"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Acesso Restrito aos Cursos
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Você precisa ter uma conta ativa para acessar os cursos.
            </p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => window.location.href = '/user'}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Voltar ao Dashboard
              </button>
              <button 
                onClick={() => window.open('https://api.whatsapp.com/send?phone=5519996049800&text=Gostaria%20de%20ativar%20minha%20conta%20para%20acessar%20os%20cursos', '_blank')}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                Falar Conosco
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Se um curso específico foi selecionado, mostrar seus módulos
  if (selectedCourse) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <HerbaleadLogo size="lg" variant="horizontal" responsive={true} />
              <button 
                onClick={() => setSelectedCourse(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Voltar aos Cursos
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎓 {selectedCourse.title}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {selectedCourse.description}
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 mb-8">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {selectedCourse.estimated_hours}h
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                {modules.length} Módulos
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2" />
                {selectedCourse.difficulty_level}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {modules.map((module, index) => {
              console.log(`🎬 Renderizando módulo ${index + 1}:`, module.title)
              console.log(`📹 Tem vídeo:`, !!module.videoUrl, module.videoUrl)
              console.log(`📄 Tem PDFs:`, module.pdfFiles?.length || 0, module.pdfFiles)
              console.log(`📝 Tem materiais:`, module.materials?.length || 0, module.materials)
              
              return (
                <div key={module.id} id={`module-${module.id}`} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {index + 1}. {module.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{module.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {module.duration}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {module.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                      )}
                    </div>
                  </div>

                {/* Vídeo do módulo */}
                {module.videoUrl && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Vídeo do Módulo:</h4>
                    <div className="bg-gray-100 rounded-lg p-4">
                      {isYouTubeUrl(module.videoUrl) ? (
                        <div className="w-full">
                          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                            <iframe
                              src={getYouTubeEmbedUrl(module.videoUrl)}
                              title="Vídeo do Módulo"
                              className="absolute top-0 left-0 w-full h-full rounded"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                          <video 
                            src={module.videoUrl} 
                            controls 
                            className="absolute top-0 left-0 w-full h-full object-cover rounded"
                            preload="metadata"
                            onError={(e) => {
                              console.error('Erro ao carregar vídeo:', e)
                              console.error('URL do vídeo:', module.videoUrl)
                            }}
                            onLoadStart={() => {
                              console.log('Iniciando carregamento do vídeo:', module.videoUrl)
                            }}
                            onCanPlay={() => {
                              console.log('Vídeo pode ser reproduzido:', module.videoUrl)
                            }}
                          >
                            Seu navegador não suporta vídeos.
                          </video>
                        </div>
                      )}
                      
                      {/* Indicador do tipo de vídeo */}
                      <div className="mt-2 text-xs text-gray-500">
                        {isYouTubeUrl(module.videoUrl) ? (
                          <span className="text-red-600">📺 YouTube</span>
                        ) : isSupabaseVideoUrl(module.videoUrl) ? (
                          <span className="text-green-600">🔒 Vídeo Privado</span>
                        ) : (
                          <span className="text-blue-600">🎥 Vídeo Externo</span>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        URL: {module.videoUrl}
                      </div>
                    </div>
                  </div>
                )}

                {/* PDFs do módulo */}
                {module.pdfFiles && module.pdfFiles.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Materiais PDF:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {module.pdfFiles.map((pdfUrl, pdfIndex) => {
                    console.log(`🔗 Processando PDF ${pdfIndex + 1}:`, pdfUrl)
                    
                    // Extrair nome limpo do arquivo (remover timestamp e extensão)
                    let fileName = pdfUrl.split('/').pop()?.split('?')[0] || `PDF ${pdfIndex + 1}`
                    
                    // Remover timestamp do início do nome (ex: 1760290706878-GUIA-DE-CADASTRO-HERBALEAD.pdf)
                    if (fileName.match(/^\d+-/)) {
                      fileName = fileName.replace(/^\d+-/, '')
                    }
                    
                    // Remover extensão .pdf para exibição mais limpa
                    const displayName = fileName.replace(/\.pdf$/i, '')
                    
                    // Verificar se a URL está correta
                    const isValidUrl = pdfUrl.startsWith('http') && pdfUrl.includes('supabase')
                    console.log(`✅ URL válida:`, isValidUrl, pdfUrl)
                    
                    return (
                      <div key={pdfIndex} className="flex items-center p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-left">
                        <Download className="w-5 h-5 text-red-600 mr-3" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{displayName}</p>
                          <p className="text-sm text-gray-500">PDF</p>
                        </div>
                        <div className="flex space-x-2">
                          <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                            onClick={() => {
                              console.log('🔗 Tentando abrir PDF:', pdfUrl)
                              // Testar se a URL é válida
                              fetch(pdfUrl, { method: 'HEAD' })
                                .then(response => {
                                  console.log('📄 Status do PDF:', response.status)
                                  if (!response.ok) {
                                    alert(`Erro ao acessar PDF: ${response.status}`)
                                  }
                                })
                                .catch(error => {
                                  console.error('❌ Erro ao testar PDF:', error)
                                  alert('Erro ao acessar PDF. Verifique se o arquivo existe.')
                                })
                            }}
                          >
                            Abrir
                          </a>
                          <button
                            onClick={() => {
                              console.log('📥 Tentando baixar PDF:', pdfUrl)
                              const link = document.createElement('a')
                              link.href = pdfUrl
                              link.download = fileName
                              link.target = '_blank'
                              document.body.appendChild(link)
                              link.click()
                              document.body.removeChild(link)
                            }}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          >
                            Baixar
                          </button>
                        </div>
                      </div>
                    )
                  })}
                    </div>
                  </div>
                )}

                {/* Materiais tradicionais */}
                {module.materials.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Materiais Complementares:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {module.materials.map((material, materialIndex) => (
                        <button
                          key={materialIndex}
                          onClick={() => downloadMaterial(material.path, material.name)}
                          className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                        >
                          <Download className="w-5 h-5 text-emerald-600 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">{material.name}</p>
                            <p className="text-sm text-gray-500">
                              {material.type === 'pdf' ? 'PDF' : 
                               material.type === 'video' ? 'Vídeo' :
                               material.type === 'audio' ? 'Áudio' : 'Material'} (HTML)
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          </div>
        </main>
      </div>
    )
  }

  // Página principal com lista de cursos
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <HerbaleadLogo size="lg" variant="horizontal" responsive={true} />
            <button 
              onClick={() => window.location.href = '/user'}
              className="text-gray-500 hover:text-gray-700"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎓 Cursos Disponíveis
          </h1>
          <p className="text-xl text-gray-600">
            Aprenda a dominar a plataforma HerbaLead e transforme seu negócio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const isEnrolled = enrolledCourses.some(enrollment => enrollment.course_id === course.id)
            const enrollment = enrolledCourses.find(enrollment => enrollment.course_id === course.id)
            
            return (
              <div key={course.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      course.difficulty_level === 'beginner' ? 'bg-green-100 text-green-800' :
                      course.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {course.difficulty_level === 'beginner' ? 'Iniciante' :
                       course.difficulty_level === 'intermediate' ? 'Intermediário' : 'Avançado'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.estimated_hours}h
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      Módulos
                    </div>
                  </div>

                  {course.learning_objectives && course.learning_objectives.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">O que você vai aprender:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {course.learning_objectives.slice(0, 3).map((objective, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    {isEnrolled ? (
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Progresso</span>
                          <span className="text-sm text-gray-500">{enrollment?.progress_percentage || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${enrollment?.progress_percentage || 0}%` }}
                          ></div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedCourse(course)
                            loadCourseModules(course.id)
                          }}
                          className="mt-3 w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Continuar Curso
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          startCourse(course.id)
                          setSelectedCourse(course)
                          loadCourseModules(course.id)
                        }}
                        className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Acessar Curso
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>
      
      {/* Botão de Ajuda */}
      <HelpButton />
    </div>
  )
}

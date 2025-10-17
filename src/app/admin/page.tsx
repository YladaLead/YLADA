'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  BookOpen, 
  Users, 
  Download, 
  Eye,
  Settings,
  BarChart3,
  FileText,
  Video,
  Lock,
  Unlock,
  ChevronDown,
  ChevronRight,
  UserPlus,
  Shield,
  LogOut,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Edit3,
  GripVertical
} from 'lucide-react'
import HerbaleadLogo from '@/components/HerbaleadLogo'

interface Course {
  id: string
  title: string
  description: string
  modules: Module[]
  is_active: boolean
  created_at: string
  updated_at: string
}

interface CourseMaterial {
  id: string
  module_id: string
  title: string
  file_path: string
  file_type: string
  file_size: number
  download_count: number
  is_active: boolean
}

interface Module {
  id: string
  course_id: string
  title: string
  description: string
  duration: string
  video_url?: string
  pdf_materials?: string
  pdf_files?: string[]
  materials: CourseMaterial[]
  order_index: number
  is_active: boolean
}


interface Professional {
  id: string
  name: string
  email: string
  is_active: boolean
  is_admin: boolean
  created_at: string
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

interface User {
  id: string
  email: string | undefined
  name?: string
  is_admin?: boolean
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [courses, setCourses] = useState<Course[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [materials, setMaterials] = useState<CourseMaterial[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set())
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    adminPassword: ''
  })
  const [showBulkEditModal, setShowBulkEditModal] = useState(false)
  const [, setSelectedCourseForBulkEdit] = useState<string | null>(null)
  const [editingModules, setEditingModules] = useState<Module[]>([])
  const [showAddModuleModal, setShowAddModuleModal] = useState(false)
  const [showEditModuleModal, setShowEditModuleModal] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [moduleFormData, setModuleFormData] = useState({
    title: '',
    description: '',
    duration: '',
    video_url: '',
    pdf_materials: ''
  })
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null)

  useEffect(() => {
    checkAdminAccess()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Função para mostrar notificações
  const showNotification = (type: Notification['type'], title: string, message: string, duration: number = 5000) => {
    console.log('🔔 showNotification chamada:', { type, title, message })
    const id = Date.now().toString()
    const notification: Notification = { id, type, title, message, duration }
    
    console.log('📝 Adicionando notificação:', notification)
    setNotifications(prev => {
      const newNotifications = [...prev, notification]
      console.log('📋 Total de notificações:', newNotifications.length)
      return newNotifications
    })
    
    // Auto remover após o tempo especificado
    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const checkAdminAccess = async () => {
    try {
      // Verificar se há sessão administrativa no localStorage
      const adminSession = localStorage.getItem('admin_session')
      
      if (adminSession) {
        const session = JSON.parse(adminSession)
        if (session.admin_login && session.user.is_admin) {
          setUser(session.user)
          setIsAdmin(true)
          loadData()
          return
        }
      }

      // Se não há sessão administrativa, verificar login normal
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        setUser({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name,
          is_admin: false
        })
        
        // Verificar se usuário é admin
        const { data: professional } = await supabase
          .from('professionals')
          .select('is_active, email, is_admin')
          .eq('id', user.id)
          .single()

        setIsAdmin(professional?.is_admin || false)
        
        if (professional?.is_admin) {
          setUser({ 
            id: user.id, 
            email: user.email || '', 
            name: user.user_metadata?.name,
            is_admin: professional.is_admin 
          })
          loadData()
        }
      }
    } catch (error) {
      console.error('Erro ao verificar acesso admin:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadData = async () => {
    try {
      console.log('=== CARREGANDO DADOS DO SUPABASE ===')
      
      // Carregar cursos
      console.log('Carregando cursos...')
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })

      if (coursesError) {
        console.error('ERRO AO CARREGAR CURSOS:', coursesError)
        alert('ERRO: Não foi possível carregar os cursos')
        return
      }

      console.log('CURSOS CARREGADOS:', coursesData?.length || 0, coursesData)
      setCourses(coursesData || [])

      // Carregar módulos
      console.log('Carregando módulos...')
      const { data: modulesData, error: modulesError } = await supabase
        .from('course_modules')
        .select('*')
        .order('order_index', { ascending: true })

      if (modulesError) {
        console.error('ERRO AO CARREGAR MÓDULOS:', modulesError)
        alert('ERRO: Não foi possível carregar os módulos')
        return
      }

      console.log('MÓDULOS CARREGADOS:', modulesData?.length || 0, modulesData)
      setModules(modulesData || [])

      // Carregar materiais
      console.log('Carregando materiais...')
      const { data: materialsData, error: materialsError } = await supabase
        .from('course_materials')
        .select('*')
        .order('created_at', { ascending: false })

      if (materialsError) {
        console.error('ERRO AO CARREGAR MATERIAIS:', materialsError)
        alert('ERRO: Não foi possível carregar os materiais')
        return
      }

      console.log('MATERIAIS CARREGADOS:', materialsData?.length || 0, materialsData)
      setMaterials(materialsData || [])

      // Carregar profissionais
      console.log('Carregando profissionais...')
      const { data: professionalsData, error: professionalsError } = await supabase
        .from('professionals')
        .select('*')
        .order('created_at', { ascending: false })

      if (professionalsError) {
        console.error('ERRO AO CARREGAR PROFISSIONAIS:', professionalsError)
        alert('ERRO: Não foi possível carregar os profissionais')
        return
      }

      console.log('PROFISSIONAIS CARREGADOS:', professionalsData?.length || 0, professionalsData)
      setProfessionals(professionalsData || [])
      
      console.log('=== TODOS OS DADOS CARREGADOS COM SUCESSO ===')
    } catch (error) {
      console.error('ERRO GERAL AO CARREGAR DADOS:', error)
      alert('ERRO GERAL: ' + (error as Error).message)
    }
  }

  const createCourse = async () => {
    const title = prompt('Título do curso:')
    const description = prompt('Descrição do curso:')
    
    if (!title || !description) return

    try {
      console.log(`📚 Criando curso: ${title}`)
      showNotification('info', 'Criando Curso...', `Adicionando "${title}" ao banco de dados...`)
      
      const { data, error } = await supabase
        .from('courses')
        .insert({
          title,
          description,
          modules: [],
          is_active: true
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Erro ao criar curso:', error)
        throw error
      }
      
      console.log(`✅ Curso ${title} criado com sucesso:`, data)
      
      // Recarregar dados para garantir sincronização
      await loadData()
      
      showNotification('success', 'Curso Criado!', `"${title}" foi criado com sucesso!`)
    } catch (error) {
      console.error('Erro ao criar curso:', error)
      showNotification('error', 'Erro ao Criar Curso', `Erro: ${(error as Error).message || 'Não foi possível criar o curso. Tente novamente.'}`)
    }
  }

  const deleteCourse = async (courseId: string, courseTitle: string) => {
    if (!confirm(`Tem certeza que deseja excluir o curso "${courseTitle}"?\n\nEsta ação não pode ser desfeita e excluirá todos os módulos e materiais associados.`)) return

    try {
      console.log('=== INICIANDO EXCLUSÃO DE CURSO ===')
      console.log('Curso:', courseTitle, 'ID:', courseId)
      alert('INICIANDO: Excluindo curso "' + courseTitle + '"...')
      
      // Primeiro excluir todos os materiais dos módulos do curso
      const courseModules = modules.filter(m => m.course_id === courseId)
      console.log('Módulos encontrados:', courseModules.length)
      
      if (courseModules.length > 0) {
        alert('EXCLUINDO: Materiais de ' + courseModules.length + ' módulos...')
        
        for (const courseModule of courseModules) {
          console.log('Excluindo materiais do módulo:', courseModule.title)
          const { error: materialsError } = await supabase
            .from('course_materials')
            .delete()
            .eq('module_id', courseModule.id)

          if (materialsError) {
            console.error('ERRO AO EXCLUIR MATERIAIS:', materialsError)
            alert('ERRO: ' + materialsError.message)
            throw materialsError
          }
          console.log('Materiais do módulo', courseModule.title, 'excluídos')
        }
      }

      // Depois excluir todos os módulos do curso
      console.log('Excluindo módulos do curso...')
      alert('EXCLUINDO: ' + courseModules.length + ' módulos do curso...')
      
      const { error: modulesError } = await supabase
        .from('course_modules')
        .delete()
        .eq('course_id', courseId)

      if (modulesError) {
        console.error('ERRO AO EXCLUIR MÓDULOS:', modulesError)
        alert('ERRO: ' + modulesError.message)
        throw modulesError
      }
      console.log('Módulos do curso excluídos')

      // Por fim excluir o curso
      console.log('Excluindo curso...')
      alert('EXCLUINDO: Curso "' + courseTitle + '"...')
      
      const { error: courseError } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId)

      if (courseError) {
        console.error('ERRO AO EXCLUIR CURSO:', courseError)
        alert('ERRO: ' + courseError.message)
        throw courseError
      }
      console.log('Curso', courseTitle, 'excluído com sucesso')
      
      // Recarregar dados do banco para garantir sincronização
      alert('ATUALIZANDO: Recarregando dados do banco...')
      await loadData()
      
      alert('SUCESSO: Curso "' + courseTitle + '" excluído com sucesso!')
      showNotification('success', 'Curso Excluído!', `"${courseTitle}" foi excluído com sucesso!`)
    } catch (error) {
      console.error('ERRO GERAL AO EXCLUIR CURSO:', error)
      alert('ERRO GERAL: ' + (error as Error).message)
      showNotification('error', 'Erro ao Excluir Curso', `Erro: ${(error as Error).message || 'Não foi possível excluir o curso. Tente novamente.'}`)
    }
  }

  const uploadPdfFile = async (file: File) => {
    setUploadingPdf(true)
    showNotification('info', 'Enviando PDF...', 'Fazendo upload do arquivo PDF...')
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'course-pdfs')
      
      console.log('📤 Enviando PDF via API:', file.name)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Erro no upload')
      }
      
      console.log('✅ PDF enviado com sucesso:', result.url)
      showNotification('success', 'PDF Enviado!', `Arquivo "${file.name}" enviado com sucesso!`)
      
      // Adicionar URL do PDF aos materiais
      const pdfUrl = `📄 ${file.name}: ${result.url}`
      setModuleFormData(prev => ({
        ...prev,
        pdf_materials: prev.pdf_materials ? `${prev.pdf_materials}\n${pdfUrl}` : pdfUrl
      }))
      
      return result.url
    } catch (error) {
      console.error('❌ Erro no upload do PDF:', error)
      showNotification('error', 'Erro no Upload', `Não foi possível enviar o PDF: ${(error as Error).message}`)
      throw error
    } finally {
      setUploadingPdf(false)
    }
  }

  const createModule = async (courseId: string) => {
    setSelectedCourseId(courseId)
    setModuleFormData({
      title: '',
      description: '',
      duration: '',
      video_url: '',
      pdf_materials: ''
    })
    setShowAddModuleModal(true)
  }

  const handleCreateModule = async () => {
    console.log('=== INICIANDO CRIAÇÃO DE MÓDULO ===')
    console.log('Dados do formulário:', moduleFormData)
    console.log('Course ID selecionado:', selectedCourseId)
    
    if (!selectedCourseId || !moduleFormData.title || !moduleFormData.description || !moduleFormData.duration) {
      console.log('ERRO: Campos obrigatórios não preenchidos')
      alert('ERRO: Preencha título, descrição e duração!')
      return
    }

    console.log('Validação passou, criando módulo...')
    
    try {
      // Extrair URLs dos PDFs do campo pdf_materials
      const pdfUrls: string[] = []
      if (moduleFormData.pdf_materials) {
        const lines = moduleFormData.pdf_materials.split('\n')
        lines.forEach(line => {
          if (line.includes('http')) {
            const url = line.split(' ').find(part => part.startsWith('http'))
            if (url) pdfUrls.push(url)
          }
        })
      }

      const moduleData = {
        course_id: selectedCourseId,
        title: moduleFormData.title,
        description: moduleFormData.description,
        duration: moduleFormData.duration,
        video_url: moduleFormData.video_url || null,
        pdf_materials: moduleFormData.pdf_materials || null,
        pdf_files: pdfUrls.length > 0 ? pdfUrls : null,
        order_index: modules.filter(m => m.course_id === selectedCourseId).length + 1,
        is_active: true
      }
      
      console.log('Enviando dados para Supabase:', moduleData)
      
      const { data, error } = await supabase
        .from('course_modules')
        .insert(moduleData)
        .select()
        .single()

      if (error) {
        console.error('ERRO DO SUPABASE:', error)
        alert('ERRO: ' + error.message)
        throw error
      }
      
      console.log('MÓDULO CRIADO COM SUCESSO:', data)
      
      // Recarregar dados do banco para garantir sincronização
      console.log('Recarregando dados do banco...')
      await loadData()
      
      setShowAddModuleModal(false)
      console.log('Mostrando notificação de sucesso...')
      alert('SUCESSO: Módulo "' + moduleFormData.title + '" criado com sucesso!')
      showNotification('success', 'Módulo Criado!', `"${moduleFormData.title}" foi criado com sucesso!`)
    } catch (error) {
      console.error('ERRO GERAL:', error)
      alert('ERRO GERAL: ' + (error as Error).message)
      showNotification('error', 'Erro ao Criar Módulo', `Erro: ${(error as Error).message || 'Não foi possível criar o módulo. Tente novamente.'}`)
    }
  }

  const editModule = async (module: Module) => {
    setSelectedModule(module)
    setModuleFormData({
      title: module.title,
      description: module.description,
      duration: module.duration,
      video_url: module.video_url || '',
      pdf_materials: module.pdf_materials || ''
    })
    setShowEditModuleModal(true)
  }

  const handleEditModule = async () => {
    if (!selectedModule || !moduleFormData.title || !moduleFormData.description || !moduleFormData.duration) {
      showNotification('warning', 'Campos Obrigatórios', 'Preencha título, descrição e duração.')
      return
    }

    try {
      // Extrair URLs dos PDFs do campo pdf_materials
      const pdfUrls: string[] = []
      if (moduleFormData.pdf_materials) {
        const lines = moduleFormData.pdf_materials.split('\n')
        lines.forEach(line => {
          if (line.includes('http')) {
            const url = line.split(' ').find(part => part.startsWith('http'))
            if (url) pdfUrls.push(url)
          }
        })
      }

      const { data, error } = await supabase
        .from('course_modules')
        .update({
          title: moduleFormData.title,
          description: moduleFormData.description,
          duration: moduleFormData.duration,
          video_url: moduleFormData.video_url || null,
          pdf_materials: moduleFormData.pdf_materials || null,
          pdf_files: pdfUrls.length > 0 ? pdfUrls : null
        })
        .eq('id', selectedModule.id)
        .select()
        .single()

      if (error) throw error
      
      setModules(modules.map(m => m.id === selectedModule.id ? data : m))
      setShowEditModuleModal(false)
      showNotification('success', 'Módulo Atualizado!', `"${moduleFormData.title}" foi atualizado com sucesso!`)
    } catch (error) {
      console.error('Erro ao atualizar módulo:', error)
      showNotification('error', 'Erro ao Atualizar Módulo', 'Não foi possível atualizar o módulo. Tente novamente.')
    }
  }

  const openBulkEditModal = (courseId: string) => {
    const courseModules = modules.filter(m => m.course_id === courseId)
    setSelectedCourseForBulkEdit(courseId)
    setEditingModules([...courseModules])
    setShowBulkEditModal(true)
  }

  const updateEditingModule = (moduleId: string, field: keyof Module, value: string | string[]) => {
    setEditingModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, [field]: value }
        : module
    ))
  }

  const saveBulkEdit = async () => {
    try {
      const updates = editingModules.map(module => ({
        id: module.id,
        title: module.title,
        description: module.description,
        duration: module.duration,
        video_url: module.video_url || null,
        pdf_materials: module.pdf_materials || null,
        pdf_files: module.pdf_files || []
      }))

      // Atualizar todos os módulos de uma vez
      for (const update of updates) {
        const { error } = await supabase
          .from('course_modules')
          .update({
            title: update.title,
            description: update.description,
            duration: update.duration,
            video_url: update.video_url,
            pdf_materials: update.pdf_materials,
            pdf_files: update.pdf_files
          })
          .eq('id', update.id)

        if (error) throw error
      }

      // Atualizar estado local
      setModules(prev => prev.map(module => {
        const updatedModule = updates.find(u => u.id === module.id)
        return updatedModule ? { 
          ...module, 
          title: updatedModule.title,
          description: updatedModule.description,
          duration: updatedModule.duration,
          video_url: updatedModule.video_url || undefined,
          pdf_materials: updatedModule.pdf_materials || undefined,
          pdf_files: updatedModule.pdf_files || []
        } : module
      }))

      setShowBulkEditModal(false)
      showNotification('success', 'Módulos Atualizados!', 'Todos os módulos foram atualizados com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar módulos:', error)
      showNotification('error', 'Erro ao Atualizar Módulos', 'Não foi possível atualizar os módulos. Tente novamente.')
    }
  }

  const cleanupOrphanFiles = async () => {
    if (!confirm('⚠️ ATENÇÃO: Esta operação irá deletar TODOS os arquivos órfãos (não usados) do Supabase Storage.\n\nTem certeza que deseja continuar?')) return

    try {
      showNotification('info', 'Limpando Arquivos...', 'Identificando e removendo arquivos órfãos...')
      
      // 1. Buscar todos os arquivos no storage
      const { data: storageFiles, error: storageError } = await supabase.storage
        .from('herbalead-public')
        .list('course-pdfs', { limit: 1000 })
      
      if (storageError) throw storageError
      
      // 2. Buscar URLs usadas nos módulos
      const { data: modules, error: modulesError } = await supabase
        .from('course_modules')
        .select('pdf_files, video_url')
      
      if (modulesError) throw modulesError
      
      // 3. Identificar arquivos órfãos
      const usedFiles = new Set<string>()
      
      modules?.forEach(module => {
        // Adicionar PDFs usados
        if (module.pdf_files) {
          module.pdf_files.forEach(pdfUrl => {
            const fileName = pdfUrl.split('/').pop()?.split('?')[0]
            if (fileName) usedFiles.add(fileName)
          })
        }
        
        // Adicionar vídeos usados (apenas do Supabase)
        if (module.video_url && module.video_url.includes('supabase')) {
          const fileName = module.video_url.split('/').pop()?.split('?')[0]
          if (fileName) usedFiles.add(fileName)
        }
      })
      
      // 4. Deletar arquivos órfãos
      const orphanFiles = storageFiles?.filter(file => !usedFiles.has(file.name)) || []
      
      if (orphanFiles.length === 0) {
        showNotification('success', 'Limpeza Concluída!', 'Nenhum arquivo órfão encontrado!')
        return
      }
      
      console.log(`🗑️ Deletando ${orphanFiles.length} arquivos órfãos:`, orphanFiles.map(f => f.name))
      
      const filesToDelete = orphanFiles.map(file => `course-pdfs/${file.name}`)
      
      const { error: deleteError } = await supabase.storage
        .from('herbalead-public')
        .remove(filesToDelete)
      
      if (deleteError) throw deleteError
      
      showNotification('success', 'Limpeza Concluída!', `${orphanFiles.length} arquivos órfãos foram removidos com sucesso!`)
      
    } catch (error) {
      console.error('Erro na limpeza:', error)
      showNotification('error', 'Erro na Limpeza', `Erro: ${(error as Error).message}`)
    }
  }

  const deleteModule = async (moduleId: string) => {
    const targetModule = modules.find(m => m.id === moduleId)
    if (!targetModule) return
    
    if (!confirm(`Tem certeza que deseja excluir o módulo "${targetModule.title}"?\n\n⚠️ ATENÇÃO: Todos os arquivos (PDFs e vídeos) também serão deletados permanentemente!`)) return

    try {
      console.log(`🗑️ Excluindo módulo: ${targetModule.title} (ID: ${moduleId})`)
      showNotification('info', 'Excluindo Módulo...', `Removendo "${targetModule.title}" e seus arquivos...`)
      
      // 1. Deletar arquivos do Supabase Storage
      const filesToDelete: string[] = []
      
      // Adicionar PDFs
      if (targetModule.pdf_files && targetModule.pdf_files.length > 0) {
        targetModule.pdf_files.forEach(pdfUrl => {
          const fileName = pdfUrl.split('/').pop()?.split('?')[0]
          if (fileName) {
            filesToDelete.push(`course-pdfs/${fileName}`)
          }
        })
      }
      
      // Adicionar vídeo se for do Supabase Storage
      if (targetModule.video_url && targetModule.video_url.includes('supabase')) {
        const fileName = targetModule.video_url.split('/').pop()?.split('?')[0]
        if (fileName) {
          filesToDelete.push(`course-videos/${fileName}`)
        }
      }
      
      console.log(`📁 Arquivos para deletar:`, filesToDelete)
      
      // Deletar arquivos do storage
      for (const filePath of filesToDelete) {
        try {
          const { error: storageError } = await supabase.storage
            .from('herbalead-public')
            .remove([filePath])
          
          if (storageError) {
            console.warn(`⚠️ Não foi possível deletar arquivo ${filePath}:`, storageError)
          } else {
            console.log(`✅ Arquivo deletado: ${filePath}`)
          }
        } catch (storageError) {
          console.warn(`⚠️ Erro ao deletar arquivo ${filePath}:`, storageError)
        }
      }
      
      // 2. Deletar módulo do banco de dados
      const { error } = await supabase
        .from('course_modules')
        .delete()
        .eq('id', moduleId)

      if (error) {
        console.error('❌ Erro ao excluir módulo:', error)
        throw error
      }
      
      console.log(`✅ Módulo ${targetModule.title} e arquivos excluídos com sucesso`)
      
      // Recarregar dados para garantir sincronização
      await loadData()
      
      showNotification('success', 'Módulo Excluído!', `"${targetModule.title}" e todos os seus arquivos foram excluídos com sucesso!`)
    } catch (error) {
      console.error('Erro ao excluir módulo:', error)
      showNotification('error', 'Erro ao Excluir Módulo', `Erro: ${(error as Error).message || 'Não foi possível excluir o módulo. Tente novamente.'}`)
    }
  }

  // Função para reordenar módulos
  const reorderModules = async (courseId: string, draggedModuleId: string, newOrder: number) => {
    try {
      console.log(`🔄 Reordenando módulos do curso ${courseId}`)
      
      // Buscar todos os módulos do curso ordenados
      const courseModules = modules
        .filter(m => m.course_id === courseId)
        .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
      
      // Remover o módulo arrastado da lista
      const draggedModule = courseModules.find(m => m.id === draggedModuleId)
      const otherModules = courseModules.filter(m => m.id !== draggedModuleId)
      
      if (!draggedModule) return
      
      // Inserir o módulo na nova posição
      const newModules = [
        ...otherModules.slice(0, newOrder),
        draggedModule,
        ...otherModules.slice(newOrder)
      ]
      
      // Atualizar order_index de todos os módulos
      const updates = newModules.map((module, index) => ({
        id: module.id,
        order_index: index + 1
      }))
      
      console.log('📝 Atualizando ordem dos módulos:', updates)
      
      // Atualizar no banco de dados
      for (const update of updates) {
        const { error } = await supabase
          .from('course_modules')
          .update({ order_index: update.order_index })
          .eq('id', update.id)
        
        if (error) {
          console.error('❌ Erro ao atualizar ordem:', error)
          throw error
        }
      }
      
      // Atualizar estado local
      setModules(modules.map(module => {
        const update = updates.find(u => u.id === module.id)
        return update ? { ...module, order_index: update.order_index } : module
      }))
      
      console.log('✅ Módulos reordenados com sucesso')
      showNotification('success', 'Ordem Atualizada!', 'A ordem dos módulos foi atualizada com sucesso!')
      
    } catch (error) {
      console.error('❌ Erro ao reordenar módulos:', error)
      showNotification('error', 'Erro ao Reordenar', 'Não foi possível reordenar os módulos. Tente novamente.')
    }
  }

  const uploadMaterial = async (moduleId: string, category: string = 'document') => {
    const input = document.createElement('input')
    input.type = 'file'
    
    // Definir tipos aceitos baseado na categoria
    const acceptTypes = {
      document: '.pdf,.doc,.docx,.txt,.md',
      video: '.mp4,.webm,.mov,.avi',
      audio: '.mp3,.wav,.m4a,.ogg',
      image: '.jpg,.jpeg,.png,.gif,.svg',
      template: '.pdf,.doc,.docx,.xlsx,.pptx',
      checklist: '.pdf,.doc,.txt,.md'
    }
    
    input.accept = acceptTypes[category as keyof typeof acceptTypes] || '.pdf,.doc,.docx,.txt,.md'
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        // Validar tamanho do arquivo (100MB máximo)
        if (file.size > 100 * 1024 * 1024) {
          alert('Arquivo muito grande. Máximo 100MB.')
          return
        }

        // Upload do arquivo para Supabase Storage
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const filePath = `course-materials/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('herbalead-public')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        // Determinar tipo de arquivo baseado na extensão
        let fileType = 'unknown'
        if (['pdf', 'doc', 'docx', 'txt', 'md'].includes(fileExt || '')) {
          fileType = 'document'
        } else if (['mp4', 'webm', 'mov', 'avi'].includes(fileExt || '')) {
          fileType = 'video'
        } else if (['mp3', 'wav', 'm4a', 'ogg'].includes(fileExt || '')) {
          fileType = 'audio'
        } else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(fileExt || '')) {
          fileType = 'image'
        }

        // Salvar metadados do material
        const { data, error } = await supabase
          .from('course_materials')
          .insert({
            module_id: moduleId,
            title: file.name,
            file_path: filePath,
            file_type: fileType,
            file_category: category,
            file_size: file.size,
            is_active: true
          })
          .select()
          .single()

        if (error) throw error
        
        setMaterials([data, ...materials])
        showNotification('success', 'Material Enviado!', `${fileType === 'video' ? 'Vídeo' : fileType === 'audio' ? 'Áudio' : 'Material'} enviado com sucesso!`)
      } catch (error) {
        console.error('Erro ao enviar material:', error)
        showNotification('error', 'Erro ao Enviar Material', 'Não foi possível enviar o material. Tente novamente.')
      }
    }
    
    input.click()
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

  const uploadVideoForModule = async (moduleId: string) => {
    console.log('🎬 uploadVideoForModule chamado para:', moduleId)
    
    // Bucket público - sem necessidade de autenticação
    console.log('✅ Usando bucket público - sem autenticação necessária')
    
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.mp4,.webm,.ogg,.mov,.avi'
    input.multiple = false
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      console.log('📁 Arquivo selecionado:', file)
      
      if (!file) {
        console.log('❌ Nenhum arquivo selecionado')
        return
      }

      try {
        console.log('🔄 Iniciando upload de vídeo...', { moduleId, fileName: file.name, size: file.size })
        
        // Mostrar notificação de início do upload
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1)
        console.log('📢 Tentando mostrar notificação de início...')
        showNotification('info', 'Iniciando Upload', `Enviando ${file.name} (${fileSizeMB}MB)...`)
        console.log('✅ Notificação de início enviada')
        
        // Validar tipo de arquivo
        const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo']
        if (!allowedTypes.includes(file.type)) {
          console.warn('⚠️ Tipo de arquivo não suportado:', file.type)
          showNotification('warning', 'Formato Inválido', 'Formatos suportados: MP4, WebM, OGG, MOV, AVI')
          return
        }
        
        // Validar tamanho (100MB máximo por arquivo)
        if (file.size > 100 * 1024 * 1024) {
          console.warn('⚠️ Arquivo muito grande:', file.size)
          const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1)
          showNotification('error', 'Arquivo Muito Grande', `Arquivo de ${fileSizeMB}MB excede o limite de 100MB. Por favor, reduza o tamanho do vídeo.`)
          return
        }

        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const filePath = `course-videos/${fileName}`
        console.log('📤 Fazendo upload para:', filePath)

        console.log('📤 Tentando fazer upload via API...')
        console.log('📂 Bucket: herbalead-public')
        console.log('📁 Caminho:', filePath)
        
        // Upload via API route para contornar RLS
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'course-videos')

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error('❌ Erro no upload:', errorData)
          throw new Error(errorData.error || 'Erro no upload')
        }

        const uploadData = await response.json()
        console.log('✅ Upload realizado com sucesso:', uploadData)
        console.log('🔗 URL pública gerada:', uploadData.url)

        // Atualizar o módulo com a URL do vídeo
        const targetModule = modules.find(m => m.id === moduleId)
        if (targetModule) {
          console.log('💾 Salvando URL do vídeo no banco de dados...')
          
          const { data: updateData, error } = await supabase
            .from('course_modules')
            .update({ video_url: uploadData.url })
            .eq('id', moduleId)
            .select()

          if (error) {
            console.error('❌ Erro ao salvar no banco:', error)
            throw error
          }
          console.log('✅ Banco atualizado com sucesso:', updateData)

          setModules(modules.map(m => 
            m.id === moduleId 
              ? { ...m, video_url: uploadData.url }
              : m
          ))
          showNotification('success', 'Vídeo Enviado!', 'Vídeo enviado com sucesso!')
        }
      } catch (error) {
        console.error('❌ Erro geral ao enviar vídeo:', error)
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
        showNotification('error', 'Erro ao Enviar Vídeo', `Erro: ${errorMessage}`)
      }
    }
    
    input.click()
  }

  const uploadPDFForModule = async (moduleId: string) => {
    // Bucket público - sem necessidade de autenticação
    console.log('✅ Usando bucket público para PDFs - sem autenticação necessária')
    
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf'
    input.multiple = true
    
    input.onchange = async (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || [])
      if (files.length === 0) return

      try {
        console.log('🔄 Iniciando upload de PDFs...', { moduleId, fileCount: files.length })
        
        // Mostrar notificação de início do upload
        showNotification('info', 'Iniciando Upload', `Enviando ${files.length} PDF(s)...`)
        
        const uploadedFiles: string[] = []
        
        for (const file of files) {
          console.log('📄 Processando arquivo:', file.name, { type: file.type, size: file.size })
          
          // Validar se é PDF
          if (file.type !== 'application/pdf') {
            console.warn('⚠️ Arquivo não é PDF:', file.name, file.type)
            showNotification('warning', 'Arquivo Inválido', `${file.name} não é um arquivo PDF válido.`)
            continue
          }

          // Validar tamanho do arquivo (50MB máximo para PDFs)
                if (file.size > 50 * 1024 * 1024) {
                  console.warn('⚠️ Arquivo muito grande:', file.name, file.size)
                  const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1)
                  showNotification('error', 'PDF Muito Grande', `${file.name} (${fileSizeMB}MB) excede o limite de 50MB. Por favor, reduza o tamanho do arquivo.`)
                  continue
                }

          // Upload do arquivo para Supabase Storage
          const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
          const filePath = `course-pdfs/${fileName}`

          console.log('📤 Fazendo upload via API para:', filePath)

          // Upload via API route para contornar RLS
          const formData = new FormData()
          formData.append('file', file)
          formData.append('folder', 'course-pdfs')

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          })

          if (!response.ok) {
            const errorData = await response.json()
            console.error('❌ Erro no upload:', errorData)
            throw new Error(errorData.error || 'Erro no upload')
          }

          const uploadData = await response.json()
          console.log('✅ Upload realizado com sucesso:', uploadData)
          console.log('🔗 URL pública gerada:', uploadData.url)
          uploadedFiles.push(uploadData.url)
        }

        if (uploadedFiles.length > 0) {
          console.log('💾 Salvando PDFs no banco de dados...', uploadedFiles)
          
          // Atualizar módulo com os PDFs
          const targetModule = modules.find(m => m.id === moduleId)
          if (targetModule) {
            const currentPdfs = targetModule.pdf_files || []
            const newPdfs = [...currentPdfs, ...uploadedFiles]
            
            console.log('📝 Atualizando módulo:', { moduleId, currentPdfs, newPdfs })
            
            const { data: updateData, error } = await supabase
              .from('course_modules')
              .update({ pdf_files: newPdfs })
              .eq('id', moduleId)
              .select()

            if (error) {
              console.error('❌ Erro ao salvar no banco:', error)
              throw error
            }

            console.log('✅ Banco atualizado com sucesso:', updateData)

            // Atualizar estado local
            setModules(modules.map(m => 
              m.id === moduleId 
                ? { ...m, pdf_files: newPdfs }
                : m
            ))

            showNotification('success', 'PDFs Enviados!', `${uploadedFiles.length} PDF(s) enviado(s) com sucesso!`)
          }
        } else {
          console.warn('⚠️ Nenhum arquivo foi enviado')
          showNotification('warning', 'Nenhum Arquivo Enviado', 'Nenhum arquivo PDF válido foi encontrado.')
        }
      } catch (error) {
        console.error('❌ Erro geral ao enviar PDFs:', error)
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
        showNotification('error', 'Erro ao Enviar PDFs', `Erro: ${errorMessage}`)
      }
    }
    
    input.click()
  }

  const toggleCourseStatus = async (courseId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_active: !currentStatus })
        .eq('id', courseId)

      if (error) throw error
      
      setCourses(courses.map(course => 
        course.id === courseId 
          ? { ...course, is_active: !currentStatus }
          : course
      ))
      
      showNotification('success', 'Status Alterado!', `Curso ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`)
    } catch (error) {
      console.error('Erro ao alterar status do curso:', error)
      showNotification('error', 'Erro ao Alterar Status', 'Não foi possível alterar o status do curso.')
    }
  }

  const toggleCourseExpansion = (courseId: string) => {
    const newExpanded = new Set(expandedCourses)
    if (newExpanded.has(courseId)) {
      newExpanded.delete(courseId)
    } else {
      newExpanded.add(courseId)
    }
    setExpandedCourses(newExpanded)
  }

  const makeUserAdmin = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('professionals')
        .update({ is_admin: !currentStatus })
        .eq('id', userId)

      if (error) throw error
      
      setProfessionals(professionals.map(prof => 
        prof.id === userId 
          ? { ...prof, is_admin: !currentStatus }
          : prof
      ))
      
      showNotification('success', 'Status Admin Alterado!', `Usuário ${!currentStatus ? 'promovido a' : 'removido de'} administrador!`)
    } catch (error) {
      console.error('Erro ao alterar status de admin:', error)
      showNotification('error', 'Erro ao Alterar Status Admin', 'Não foi possível alterar o status de administrador.')
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('professionals')
        .update({ is_active: !currentStatus })
        .eq('id', userId)

      if (error) throw error
      
      setProfessionals(professionals.map(prof => 
        prof.id === userId 
          ? { ...prof, is_active: !currentStatus }
          : prof
      ))
      
      showNotification('success', 'Status Usuário Alterado!', `Usuário ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`)
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error)
      showNotification('error', 'Erro ao Alterar Status Usuário', 'Não foi possível alterar o status do usuário.')
    }
  }

  const addNewUser = async () => {
    if (!newUserData.name || !newUserData.email || !newUserData.password || !newUserData.adminPassword) {
      showNotification('warning', 'Campos Obrigatórios', 'Preencha todos os campos para criar o usuário.')
      return
    }

    try {
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUserData.email,
        password: newUserData.password,
        options: {
          data: {
            name: newUserData.name
          }
        }
      })

      if (authError) throw authError

      if (authData.user) {
        // Criar perfil profissional
        const { data: professionalData, error: professionalError } = await supabase
          .from('professionals')
          .insert({
            id: authData.user.id,
            name: newUserData.name,
            email: newUserData.email,
            is_active: true,
            is_admin: true,
            admin_password: newUserData.adminPassword // Será criptografado pelo trigger
          })
          .select()
          .single()

        if (professionalError) throw professionalError

        setProfessionals([professionalData, ...professionals])
        setShowAddUserModal(false)
        setNewUserData({ name: '', email: '', password: '', adminPassword: '' })
        
        showNotification('success', 'Usuário Criado!', `${newUserData.name} foi criado como administrador!`)
      }
    } catch (error: unknown) {
      console.error('Erro ao criar usuário:', error)
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível criar o usuário.'
      showNotification('error', 'Erro ao Criar Usuário', errorMessage)
    }
  }

  const handleLogout = async () => {
    // Limpar sessão administrativa
    localStorage.removeItem('admin_session')
    
    // Fazer logout do Supabase Auth se estiver logado
    await supabase.auth.signOut()
    
    // Redirecionar para login administrativo
    window.location.href = '/admin/login'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando área administrativa...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <HerbaleadLogo size="lg" variant="horizontal" responsive={true} />
              <button 
                onClick={() => window.location.href = '/admin/login'}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Fazer Login
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Acesso Restrito
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Esta área é restrita a administradores.
            </p>
            <button 
              onClick={() => window.location.href = '/admin/login'}
              className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Fazer Login
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sistema de Notificações */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => {
          const getIcon = () => {
            switch (notification.type) {
              case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />
              case 'error': return <XCircle className="w-5 h-5 text-red-600" />
              case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />
              case 'info': return <AlertCircle className="w-5 h-5 text-blue-600" />
              default: return <AlertCircle className="w-5 h-5 text-gray-600" />
            }
          }

          const getBgColor = () => {
            switch (notification.type) {
              case 'success': return 'bg-green-50 border-green-200'
              case 'error': return 'bg-red-50 border-red-200'
              case 'warning': return 'bg-yellow-50 border-yellow-200'
              case 'info': return 'bg-blue-50 border-blue-200'
              default: return 'bg-gray-50 border-gray-200'
            }
          }

          const getTextColor = () => {
            switch (notification.type) {
              case 'success': return 'text-green-800'
              case 'error': return 'text-red-800'
              case 'warning': return 'text-yellow-800'
              case 'info': return 'text-blue-800'
              default: return 'text-gray-800'
            }
          }

          return (
            <div
              key={notification.id}
              className={`max-w-sm w-full ${getBgColor()} border rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {getIcon()}
                </div>
                <div className="ml-3 flex-1">
                  <h3 className={`text-sm font-medium ${getTextColor()}`}>
                    {notification.title}
                  </h3>
                  <p className={`mt-1 text-sm ${getTextColor()} opacity-90`}>
                    {notification.message}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className={`inline-flex ${getTextColor()} hover:opacity-75`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <HerbaleadLogo size="lg" variant="horizontal" responsive={true} />
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.email}</span>
              <button 
                onClick={handleLogout}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-8 text-white shadow-lg">
            <h1 className="text-4xl font-bold mb-2">
              🛠️ Painel Administrativo
            </h1>
            <p className="text-emerald-100 text-lg">
              Gerencie cursos, usuários e configurações do sistema
            </p>
            <div className="mt-4 flex items-center space-x-4">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <span className="text-sm font-medium">Sistema Ativo</span>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <span className="text-sm font-medium">Versão 2.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <nav className="flex">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
              { id: 'courses', name: 'Cursos', icon: BookOpen },
              { id: 'materials', name: 'Materiais', icon: Upload },
              { id: 'users', name: 'Usuários', icon: Users },
              { id: 'settings', name: 'Configurações', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-6 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Visão Geral</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <BookOpen className="w-8 h-8 text-emerald-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total de Cursos</p>
                    <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total de Módulos</p>
                    <p className="text-2xl font-bold text-gray-900">{modules.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total de Usuários</p>
                    <p className="text-2xl font-bold text-gray-900">{professionals.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <Download className="w-8 h-8 text-orange-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total de Downloads</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {materials.reduce((sum, m) => sum + m.download_count, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cursos */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Cursos</h2>
              <button
                onClick={createCourse}
                className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Curso
              </button>
            </div>

            <div className="grid gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <button
                          onClick={() => toggleCourseExpansion(course.id)}
                          className="mr-2 p-1 hover:bg-gray-100 rounded"
                          title={expandedCourses.has(course.id) ? 'Recolher módulos' : 'Expandir módulos'}
                        >
                          {expandedCourses.has(course.id) ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        <h3 className="text-xl font-semibold text-gray-900 mr-3">
                          {course.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          course.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {course.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{course.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {modules.filter(m => m.course_id === course.id).length} módulos
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => createModule(course.id)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                        title="Adicionar módulo"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openBulkEditModal(course.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg border border-green-200"
                        title="Editar todos os módulos (Edição em Massa)"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleCourseStatus(course.id, course.is_active)}
                        className={`p-2 rounded-lg ${
                          course.is_active 
                            ? 'text-red-600 hover:bg-red-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={course.is_active ? 'Desativar curso' : 'Ativar curso'}
                      >
                        {course.is_active ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteCourse(course.id, course.title)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Excluir curso"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Módulos do Curso - Só mostra quando expandido */}
                  {expandedCourses.has(course.id) && (
                    <div className="mt-4 space-y-3">
                      {modules
                        .filter(m => m.course_id === course.id)
                        .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
                        .map((module, index) => (
                        <div 
                          key={module.id} 
                          className="bg-gray-50 rounded-lg p-4 border-l-4 border-emerald-500 group hover:bg-gray-100 transition-colors"
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', module.id)
                            e.dataTransfer.effectAllowed = 'move'
                          }}
                          onDragOver={(e) => {
                            e.preventDefault()
                            e.dataTransfer.dropEffect = 'move'
                          }}
                          onDrop={(e) => {
                            e.preventDefault()
                            const draggedModuleId = e.dataTransfer.getData('text/plain')
                            if (draggedModuleId !== module.id) {
                              reorderModules(course.id, draggedModuleId, index)
                            }
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              {/* Handle de arrastar */}
                              <div className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                                <GripVertical className="w-4 h-4" />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <span className="text-sm font-medium text-gray-500 mr-2">
                                    #{module.order_index || index + 1}
                                  </span>
                                  <h4 className="text-lg font-semibold text-gray-900 mr-3">
                                    {module.title}
                                  </h4>
                                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    {module.duration}
                                  </span>
                                </div>
                                <p className="text-gray-600 mb-2">{module.description}</p>
                                <div className="flex items-center text-sm text-gray-500">
                                  <FileText className="w-4 h-4 mr-1" />
                                  {(materials.filter(m => m.module_id === module.id).length + (module.pdf_files?.length || 0))} materiais
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => uploadMaterial(module.id, 'document')}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Enviar documento (PDF, DOC)"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => uploadMaterial(module.id, 'video')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                title="Enviar vídeo (MP4, WebM)"
                              >
                                <Video className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => uploadMaterial(module.id, 'audio')}
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                                title="Enviar áudio (MP3, WAV)"
                              >
                                <Users className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => editModule(module)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Editar módulo individual"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteModule(module.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                title="Excluir módulo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Materiais */}
        {activeTab === 'materials' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Materiais</h2>
              <button
                onClick={cleanupOrphanFiles}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center space-x-2"
                title="Limpar arquivos órfãos do Supabase Storage"
              >
                <Trash2 className="w-4 h-4" />
                <span>Limpar Arquivos Órfãos</span>
              </button>
            </div>
            
            <div className="grid gap-4">
              {materials.map((material) => {
                const getIcon = (type: string) => {
                  switch (type) {
                    case 'video': return <Video className="w-8 h-8 text-red-600" />
                    case 'audio': return <Users className="w-8 h-8 text-purple-600" />
                    case 'image': return <Eye className="w-8 h-8 text-green-600" />
                    default: return <FileText className="w-8 h-8 text-blue-600" />
                  }
                }
                
                const getTypeColor = (type: string) => {
                  switch (type) {
                    case 'video': return 'bg-red-100 text-red-800'
                    case 'audio': return 'bg-purple-100 text-purple-800'
                    case 'image': return 'bg-green-100 text-green-800'
                    default: return 'bg-blue-100 text-blue-800'
                  }
                }
                
                return (
                  <div key={material.id} className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getIcon(material.file_type)}
                        <div className="ml-3">
                          <h3 className="font-semibold text-gray-900">{material.title}</h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(material.file_type)}`}>
                              {material.file_type.toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-500">
                              {(material.file_size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {material.download_count} downloads
                        </span>
                        <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Usuários */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Usuários</h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => window.location.href = '/admin/subscriptions'}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Painel de Assinaturas
                </button>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Novo Usuário Admin
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {professionals.map((professional) => (
                    <tr key={professional.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {professional.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {professional.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          professional.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {professional.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          professional.is_admin 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {professional.is_admin ? 'Admin' : 'Usuário'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => toggleUserStatus(professional.id, professional.is_active)}
                          className={`p-2 rounded-lg ${
                            professional.is_active 
                              ? 'text-red-600 hover:bg-red-50' 
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={professional.is_active ? 'Desativar usuário' : 'Ativar usuário'}
                        >
                          {professional.is_active ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => makeUserAdmin(professional.id, professional.is_admin)}
                          className={`p-2 rounded-lg ${
                            professional.is_admin 
                              ? 'text-orange-600 hover:bg-orange-50' 
                              : 'text-purple-600 hover:bg-purple-50'
                          }`}
                          title={professional.is_admin ? 'Remover admin' : 'Tornar admin'}
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Configurações */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sistema</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Versão do Sistema</p>
                    <p className="text-sm text-gray-500">HerbaLead v1.0.0</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Ativo
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Banco de Dados</p>
                    <p className="text-sm text-gray-500">Supabase PostgreSQL</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Conectado
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Storage</p>
                    <p className="text-sm text-gray-500">Supabase Storage</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Ativo
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal para Adicionar Novo Usuário */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Novo Usuário Administrador</h3>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ex: João Silva"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ex: joao@exemplo.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha do Sistema
                </label>
                <input
                  type="password"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Senha para login normal"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha Administrativa
                </label>
                <input
                  type="password"
                  value={newUserData.adminPassword}
                  onChange={(e) => setNewUserData({...newUserData, adminPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Senha para área administrativa"
                />
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={addNewUser}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              >
                Criar Usuário
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Adicionar Módulo */}
      {showAddModuleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Adicionar Novo Módulo
                </h3>
                <button
                  onClick={() => setShowAddModuleModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800">
                  <strong>Campos obrigatórios:</strong> Título, Descrição e Duração<br/>
                  <strong>Campos opcionais:</strong> URL do Vídeo e Materiais PDF
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título do Módulo *
                </label>
                <input
                  type="text"
                  value={moduleFormData.title}
                  onChange={(e) => setModuleFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Ex: Introdução à Plataforma"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  value={moduleFormData.description}
                  onChange={(e) => setModuleFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                  placeholder="Descreva o conteúdo deste módulo..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duração *
                </label>
                <input
                  type="text"
                  value={moduleFormData.duration}
                  onChange={(e) => setModuleFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Ex: 15 min"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL do Vídeo (opcional)
                </label>
                <input
                  type="url"
                  value={moduleFormData.video_url}
                  onChange={(e) => setModuleFormData(prev => ({ ...prev, video_url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Materiais PDF (opcional)
                </label>
                <div className="space-y-2">
                  <textarea
                    value={moduleFormData.pdf_materials}
                    onChange={(e) => setModuleFormData(prev => ({ ...prev, pdf_materials: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                    placeholder="Descrição dos materiais PDF..."
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setSelectedPdfFile(file)
                          try {
                            await uploadPdfFile(file)
                          } catch (error) {
                            console.error('Erro no upload:', error)
                          }
                        }
                      }}
                      className="hidden"
                      id="pdf-upload"
                      disabled={uploadingPdf}
                    />
                    <label
                      htmlFor="pdf-upload"
                      className={`px-3 py-1 text-sm rounded-md border border-gray-300 cursor-pointer ${
                        uploadingPdf 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {uploadingPdf ? '⏳ Enviando...' : '📄 Escolher PDF'}
                    </label>
                    {selectedPdfFile && (
                      <span className="text-xs text-green-600">
                        ✅ {selectedPdfFile.name}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      Ou cole URLs de PDFs na descrição acima
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModuleModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateModule}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Módulo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar Módulo */}
      {showEditModuleModal && selectedModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Editar Módulo: {selectedModule.title}
                </h3>
                <button
                  onClick={() => setShowEditModuleModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título do Módulo *
                </label>
                <input
                  type="text"
                  value={moduleFormData.title}
                  onChange={(e) => setModuleFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  value={moduleFormData.description}
                  onChange={(e) => setModuleFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duração *
                </label>
                <input
                  type="text"
                  value={moduleFormData.duration}
                  onChange={(e) => setModuleFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL do Vídeo (opcional)
                </label>
                <input
                  type="url"
                  value={moduleFormData.video_url}
                  onChange={(e) => setModuleFormData(prev => ({ ...prev, video_url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Materiais PDF (opcional)
                </label>
                <div className="space-y-2">
                  <textarea
                    value={moduleFormData.pdf_materials}
                    onChange={(e) => setModuleFormData(prev => ({ ...prev, pdf_materials: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setSelectedPdfFile(file)
                          try {
                            await uploadPdfFile(file)
                          } catch (error) {
                            console.error('Erro no upload:', error)
                          }
                        }
                      }}
                      className="hidden"
                      id="pdf-upload-edit"
                      disabled={uploadingPdf}
                    />
                    <label
                      htmlFor="pdf-upload-edit"
                      className={`px-3 py-1 text-sm rounded-md border border-gray-300 cursor-pointer ${
                        uploadingPdf 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {uploadingPdf ? '⏳ Enviando...' : '📄 Escolher PDF'}
                    </label>
                    {selectedPdfFile && (
                      <span className="text-xs text-green-600">
                        ✅ {selectedPdfFile.name}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      Ou cole URLs de PDFs na descrição acima
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModuleModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditModule}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Edição em Massa de Módulos */}
      {showBulkEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Edição em Massa - Módulos do Curso
                </h3>
                <button
                  onClick={() => setShowBulkEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="px-6 py-4">
                <div className="space-y-6">
                  {editingModules.map((module, index) => (
                    <div key={module.id} className="bg-white rounded-lg border p-6 shadow-sm">
                      {/* Cabeçalho do módulo */}
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                          Módulo {index + 1}
                        </h4>
                        <div className="text-sm text-gray-500">
                          ID: {module.id.slice(0, 8)}...
                        </div>
                      </div>

                      {/* Campos principais em grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {/* Título */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Título
                          </label>
                          <input
                            type="text"
                            value={module.title}
                            onChange={(e) => updateEditingModule(module.id, 'title', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Ex: Introdução à Plataforma"
                          />
                        </div>

                        {/* Duração */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Duração
                          </label>
                          <input
                            type="text"
                            value={module.duration}
                            onChange={(e) => updateEditingModule(module.id, 'duration', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Ex: 15 min"
                          />
                        </div>

                        {/* Ordem */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Ordem
                          </label>
                          <div className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md text-gray-600">
                            {index + 1}
                          </div>
                        </div>
                      </div>

                      {/* Descrição */}
                      <div className="space-y-2 mb-6">
                        <label className="block text-sm font-medium text-gray-700">
                          Descrição
                        </label>
                        <textarea
                          value={module.description}
                          onChange={(e) => updateEditingModule(module.id, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                          placeholder="Descreva o conteúdo deste módulo..."
                        />
                      </div>

                      {/* URL do Vídeo */}
                      <div className="space-y-2 mb-6">
                        <label className="block text-sm font-medium text-gray-700">
                          Vídeo do Módulo
                        </label>
                        
                        {/* Botão para upload de vídeo */}
                        <button
                          onClick={() => {
                            console.log('🖱️ Botão de upload clicado para módulo:', module.id)
                            uploadVideoForModule(module.id)
                          }}
                          className="w-full px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center mb-3"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Enviar Vídeo (MP4, WebM, OGG, MOV, AVI - Máx 100MB)
                        </button>
                        
                        <div className="text-xs text-gray-500 mb-2">
                          Ou cole a URL do YouTube abaixo:
                        </div>
                        
                        <input
                          type="url"
                          value={module.video_url || ''}
                          onChange={(e) => updateEditingModule(module.id, 'video_url', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="https://youtube.com/watch?v=... ou URL do vídeo enviado"
                        />
                        
                        {/* Preview do vídeo se URL existir */}
                        {module.video_url && (
                          <div className="mt-3">
                            <div className="text-xs text-gray-500 mb-2">Preview:</div>
                            <div className="bg-gray-100 rounded-lg p-3">
                              {isYouTubeUrl(module.video_url) ? (
                                <div className="w-full">
                                  <iframe
                                    src={getYouTubeEmbedUrl(module.video_url)}
                                    title="Preview do Vídeo"
                                    className="w-full h-64 rounded"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  ></iframe>
                                </div>
                              ) : (
                                <div className="w-full">
                                  <video 
                                    src={module.video_url} 
                                    controls 
                                    className="w-full h-64 object-contain rounded"
                                    preload="metadata"
                                    onError={(e) => {
                                      console.error('Erro no preview do vídeo:', e)
                                      console.error('URL do vídeo:', module.video_url)
                                    }}
                                    onLoadStart={() => {
                                      console.log('Iniciando carregamento do preview:', module.video_url)
                                    }}
                                  >
                                    Seu navegador não suporta vídeos.
                                  </video>
                                </div>
                              )}
                            </div>
                            
                            {/* Indicador do tipo de vídeo */}
                            <div className="mt-2 text-xs text-gray-500">
                              {isYouTubeUrl(module.video_url) ? (
                                <span className="text-red-600">📺 YouTube</span>
                              ) : isSupabaseVideoUrl(module.video_url) ? (
                                <span className="text-green-600">🔒 Vídeo Privado (Supabase)</span>
                              ) : (
                                <span className="text-blue-600">🎥 Vídeo Externo</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* PDFs Enviados */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Materiais PDF
                        </label>
                        
                        {/* Lista de PDFs já enviados */}
                        {module.pdf_files && module.pdf_files.length > 0 && (
                          <div className="space-y-2 mb-3">
                            {module.pdf_files.map((pdfUrl, pdfIndex) => {
                              const fileName = pdfUrl.split('/').pop()?.split('?')[0] || `PDF ${pdfIndex + 1}`
                              return (
                                <div key={pdfIndex} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                  <div className="flex items-center flex-1">
                                    <FileText className="w-4 h-4 text-red-500 mr-3" />
                                    <a 
                                      href={pdfUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                      title={fileName}
                                    >
                                      {fileName}
                                    </a>
                                  </div>
                                  <button
                                    onClick={() => {
                                      const newPdfs = module.pdf_files?.filter((_, i) => i !== pdfIndex) || []
                                      updateEditingModule(module.id, 'pdf_files', newPdfs)
                                    }}
                                    className="text-red-500 hover:text-red-700 p-1"
                                    title="Remover PDF"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        )}
                        
                        {/* Botão para enviar novos PDFs */}
                        <button
                          onClick={() => uploadPDFForModule(module.id)}
                          className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Enviar PDFs
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowBulkEditModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={saveBulkEdit}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Salvar Todas as Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
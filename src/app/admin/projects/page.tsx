'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Plus, Eye, Trash2, Edit, Globe, Users, Link as LinkIcon } from 'lucide-react'
import { PROJECT_TYPES, generateDomainSuggestion, validateProjectDomain } from '@/lib/project-config'

interface Project {
  id: string
  name: string
  domain: string
  full_domain: string
  description?: string
  business_type: string
  is_active: boolean
  settings: Record<string, unknown>
  created_at: string
}

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newProject, setNewProject] = useState({
    name: '',
    domain: '',
    description: '',
    business_type: 'fitness'
  })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchProjects = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Erro ao buscar projetos:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const createProject = async () => {
    if (!newProject.name || !newProject.domain) {
      alert('Nome e domínio são obrigatórios')
      return
    }

    if (!validateProjectDomain(newProject.domain)) {
      alert('Domínio inválido. Use apenas letras minúsculas, números e hífens (3-30 caracteres)')
      return
    }

    try {
      const fullDomain = `${newProject.domain}.ylada.com`
      
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: newProject.name,
          domain: newProject.domain,
          full_domain: fullDomain,
          description: newProject.description,
          business_type: newProject.business_type,
          owner_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single()

      if (error) throw error

      alert(`Projeto "${newProject.name}" criado com sucesso!\n\nDomínio: ${fullDomain}`)
      setShowCreateModal(false)
      setNewProject({ name: '', domain: '', description: '', business_type: 'fitness' })
      fetchProjects()
    } catch (error) {
      console.error('Erro ao criar projeto:', error)
      alert(`Erro ao criar projeto: ${error}`)
    }
  }

  const handleNameChange = (name: string) => {
    setNewProject({
      ...newProject,
      name,
      domain: generateDomainSuggestion(name)
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
          <p className="mt-4 text-gray-600">Carregando projetos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gerenciar Projetos</h1>
              <p className="mt-2 text-gray-600">Crie e gerencie diferentes projetos administrativos</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Novo Projeto</span>
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const config = PROJECT_TYPES[project.business_type as keyof typeof PROJECT_TYPES]
            return (
              <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg ${config.color} flex items-center justify-center text-white text-xl`}>
                      {config.emoji}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-500">{config.name}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Globe className="w-4 h-4" />
                    <span className="font-mono">{project.full_domain}</span>
                  </div>
                  
                  {project.description && (
                    <p className="text-sm text-gray-600">{project.description}</p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>0 usuários</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <LinkIcon className="w-4 h-4" />
                        <span>0 links</span>
                      </div>
                    </div>
                    <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Create Project Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Criar Novo Projeto</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Projeto
                  </label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ex: FitLead, Nutri, Beauty"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domínio
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newProject.domain}
                      onChange={(e) => setNewProject({...newProject, domain: e.target.value})}
                      placeholder="fitlead"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <span className="text-gray-500">.ylada.com</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    URL completa: {newProject.domain ? `${newProject.domain}.ylada.com` : 'seu-projeto.ylada.com'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Negócio
                  </label>
                  <select
                    value={newProject.business_type}
                    onChange={(e) => setNewProject({...newProject, business_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {Object.entries(PROJECT_TYPES).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.emoji} {config.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição (opcional)
                  </label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    placeholder="Descreva o propósito deste projeto..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={createProject}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Criar Projeto
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

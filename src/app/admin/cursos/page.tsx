'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Curso {
  id: string
  titulo: string
  descricao: string
  area: string
  categoria: string
  nivel: string
  preco: number
  preco_com_desconto?: number
  duracao_horas: number
  total_aulas: number
  total_matriculados: number
  status: 'draft' | 'published' | 'archived'
  is_gratuito: boolean
  created_at?: string
}

export default function AdminCursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([
    {
      id: '1',
      titulo: 'Nutrição Clínica Básica',
      descricao: 'Fundamentos da nutrição clínica',
      area: 'nutri',
      categoria: 'Nutrição',
      nivel: 'iniciante',
      preco: 299.90,
      preco_com_desconto: 199.90,
      duracao_horas: 40,
      total_aulas: 25,
      total_matriculados: 150,
      status: 'published',
      is_gratuito: false
    }
  ])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [cursoEditando, setCursoEditando] = useState<Curso | null>(null)
  
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    area: 'nutri',
    categoria: '',
    nivel: 'iniciante',
    preco: 0,
    preco_com_desconto: 0,
    duracao_horas: 0,
    is_gratuito: false
  })

  const handleSalvar = () => {
    if (cursoEditando) {
      // Editar curso existente
      setCursos(cursos.map(c => c.id === cursoEditando.id ? { ...c, ...formData } : c))
    } else {
      // Criar novo curso
      const novoCurso: Curso = {
        id: Date.now().toString(),
        ...formData,
        total_aulas: 0,
        total_matriculados: 0,
        status: 'draft'
      }
      setCursos([...cursos, novoCurso])
    }
    setMostrarFormulario(false)
    setCursoEditando(null)
    setFormData({
      titulo: '',
      descricao: '',
      area: 'nutri',
      categoria: '',
      nivel: 'iniciante',
      preco: 0,
      preco_com_desconto: 0,
      duracao_horas: 0,
      is_gratuito: false
    })
  }

  const handleEditar = (curso: Curso) => {
    setCursoEditando(curso)
    setFormData({
      titulo: curso.titulo,
      descricao: curso.descricao,
      area: curso.area,
      categoria: curso.categoria,
      nivel: curso.nivel,
      preco: curso.preco,
      preco_com_desconto: curso.preco_com_desconto || 0,
      duracao_horas: curso.duracao_horas,
      is_gratuito: curso.is_gratuito
    })
    setMostrarFormulario(true)
  }

  const handleExcluir = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este curso?')) {
      setCursos(cursos.filter(c => c.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Image
                  src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png"
                  alt="YLADA"
                  width={180}
                  height={60}
                  className="h-12 w-auto"
                />
              </Link>
              <div className="h-12 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">Administração - Cursos</h1>
            </div>
            <button
              onClick={() => setMostrarFormulario(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Novo Curso
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerta de Informação */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Área Administrativa de Cursos</h3>
              <p className="text-sm text-blue-700">
                Esta área permite adicionar vídeos, PDFs e outros materiais aos cursos. 
                Em breve, você poderá fazer upload completo de conteúdos multimídia.
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Cursos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Todos os Cursos</h2>
          
          {cursos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Nenhum curso criado ainda
              </h3>
              <p className="text-gray-600 mb-6">
                Comece adicionando seu primeiro curso
              </p>
              <button
                onClick={() => setMostrarFormulario(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Criar Primeiro Curso
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cursos.map((curso) => (
                <div key={curso.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{curso.titulo}</h3>
                    <p className="text-sm text-gray-600">{curso.categoria} • {curso.total_aulas} aulas</p>
                  </div>
                      <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      curso.status === 'published' ? 'bg-green-100 text-green-800' :
                      curso.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {curso.status === 'published' ? 'Publicado' :
                       curso.status === 'draft' ? 'Rascunho' : 'Arquivado'}
                    </span>
                    <button 
                      onClick={() => handleEditar(curso)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleExcluir(curso.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Formulário de Novo Curso (Modal) */}
        {mostrarFormulario && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {cursoEditando ? 'Editar Curso' : 'Novo Curso'}
                  </h2>
                  <button
                    onClick={() => setMostrarFormulario(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título do Curso *
                    </label>
                    <input
                      type="text"
                      value={formData.titulo}
                      onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Nutrição Clínica Básica"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      rows={3}
                      value={formData.descricao}
                      onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Descreva o curso..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Área *
                      </label>
                      <select 
                        value={formData.area}
                        onChange={(e) => setFormData({...formData, area: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="nutri">Nutrição</option>
                        <option value="coach">Coach</option>
                        <option value="consultor">Consultor</option>
                        <option value="wellness">Wellness</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nível
                      </label>
                      <select 
                        value={formData.nivel}
                        onChange={(e) => setFormData({...formData, nivel: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="iniciante">Iniciante</option>
                        <option value="intermediario">Intermediário</option>
                        <option value="avancado">Avançado</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <input
                      type="text"
                      value={formData.categoria}
                      onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Nutrição, Emagrecimento"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_gratuito"
                      checked={formData.is_gratuito}
                      onChange={(e) => setFormData({...formData, is_gratuito: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_gratuito" className="text-sm font-medium text-gray-700">
                      Curso Gratuito
                    </label>
                  </div>

                  {!formData.is_gratuito && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preço (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.preco}
                          onChange={(e) => setFormData({...formData, preco: parseFloat(e.target.value)})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="299.90"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preço com Desconto (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.preco_com_desconto}
                          onChange={(e) => setFormData({...formData, preco_com_desconto: parseFloat(e.target.value)})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="199.90"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duração (horas)
                    </label>
                    <input
                      type="number"
                      value={formData.duracao_horas}
                      onChange={(e) => setFormData({...formData, duracao_horas: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="40"
                      min="0"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      onClick={() => {
                        setMostrarFormulario(false)
                        setCursoEditando(null)
                        setFormData({
                          titulo: '',
                          descricao: '',
                          area: 'nutri',
                          categoria: '',
                          nivel: 'iniciante',
                          preco: 0,
                          preco_com_desconto: 0,
                          duracao_horas: 0,
                          is_gratuito: false
                        })
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleSalvar}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {cursoEditando ? 'Salvar Alterações' : 'Criar Curso'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}


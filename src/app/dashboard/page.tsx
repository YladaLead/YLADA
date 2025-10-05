'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Search,
  Eye,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle,
  Plus,
  Download,
  RefreshCw
} from 'lucide-react'

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  age?: number
  gender?: string
  calculatorType: string
  status: string
  priority: string
  createdAt: string
  results?: Record<string, unknown>
  recommendations?: Record<string, unknown>
  quizType?: string
  quizResults?: Record<string, unknown>
  professional?: {
    name: string
    specialty: string
  }
  notes: Array<{
    content: string
    author: string
    createdAt: string
  }>
}

interface DashboardStats {
  totalLeads: number
  newLeads: number
  contactedLeads: number
  convertedLeads: number
  conversionRate: number
}

export default function ProfessionalDashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    newLeads: 0,
    contactedLeads: 0,
    convertedLeads: 0,
    conversionRate: 0
  })
  const [loading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddNote, setShowAddNote] = useState(false)
  const [newNote, setNewNote] = useState('')

  const fetchLeads = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.append('status', filterStatus)
      
      const response = await fetch(`/api/leads?${params}`)
      const data = await response.json()
      setLeads(data.leads || [])
    } catch (error) {
      console.error('Erro ao buscar leads:', error)
    }
  }, [filterStatus])

  useEffect(() => {
    fetchLeads()
    fetchStats()
  }, [filterStatus, fetchLeads])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/leads')
      const data = await response.json()
      const allLeads = data.leads || []
      
      const totalLeads = allLeads.length
      const newLeads = allLeads.filter((lead: Lead) => lead.status === 'new').length
      const contactedLeads = allLeads.filter((lead: Lead) => lead.status === 'contacted').length
      const convertedLeads = allLeads.filter((lead: Lead) => lead.status === 'converted').length
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0

      setStats({
        totalLeads,
        newLeads,
        contactedLeads,
        convertedLeads,
        conversionRate
      })
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    }
  }

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status })
      })
      
      setLeads(leads.map(lead => 
        lead.id === leadId ? { ...lead, status } : lead
      ))
      
      if (selectedLead?.id === leadId) {
        setSelectedLead({ ...selectedLead, status })
      }
      
      fetchStats()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const addNote = async () => {
    if (!selectedLead || !newNote.trim()) return

    try {
      await fetch(`/api/leads/${selectedLead.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLead.id,
          content: newNote,
          author: 'Profissional'
        })
      })

      setNewNote('')
      setShowAddNote(false)
      
      // Atualizar lead selecionado
      const updatedLead = { ...selectedLead }
      updatedLead.notes.unshift({
        content: newNote,
        author: 'Profissional',
        createdAt: new Date().toISOString()
      })
      setSelectedLead(updatedLead)
      
    } catch (error) {
      console.error('Erro ao adicionar anotação:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'contacted': return 'bg-yellow-100 text-yellow-800'
      case 'converted': return 'bg-green-100 text-green-800'
      case 'lost': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }


  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-600" />
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Profissional</h1>
              <p className="text-gray-600 mt-1">Gerencie seus leads e acompanhe conversões</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Atualizar</span>
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Novos Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.newLeads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Contatados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.contactedLeads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Convertidos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.convertedLeads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-gray-900">{stats.conversionRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Leads */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Leads</h2>
                  <div className="flex space-x-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="all">Todos</option>
                      <option value="new">Novos</option>
                      <option value="contacted">Contatados</option>
                      <option value="converted">Convertidos</option>
                      <option value="lost">Perdidos</option>
                    </select>
                  </div>
                </div>
                
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-gray-900">{lead.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(lead.priority)}`}>
                            {lead.priority}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{lead.email}</span>
                          </div>
                          {lead.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="w-4 h-4" />
                              <span>{lead.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(lead.createdAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Ferramenta:</span> {lead.calculatorType}
                          {lead.quizType && (
                            <span className="ml-2">
                              <span className="font-medium">Quiz:</span> {lead.quizType}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedLead(lead)
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detalhes do Lead */}
          <div className="lg:col-span-1">
            {selectedLead ? (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{selectedLead.name}</h3>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLead.status)}`}>
                        {selectedLead.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedLead.priority)}`}>
                        {selectedLead.priority}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{selectedLead.email}</span>
                    </div>
                    {selectedLead.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{selectedLead.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {new Date(selectedLead.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="font-medium text-gray-900 mb-3">Ações Rápidas</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => updateLeadStatus(selectedLead.id, 'contacted')}
                      className="w-full bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors"
                    >
                      Marcar como Contatado
                    </button>
                    <button
                      onClick={() => updateLeadStatus(selectedLead.id, 'converted')}
                      className="w-full bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                    >
                      Marcar como Convertido
                    </button>
                    <button
                      onClick={() => updateLeadStatus(selectedLead.id, 'lost')}
                      className="w-full bg-red-100 text-red-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                    >
                      Marcar como Perdido
                    </button>
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-900">Anotações</h4>
                      <button
                        onClick={() => setShowAddNote(!showAddNote)}
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                      >
                        <Plus className="w-4 h-4 inline mr-1" />
                        Adicionar
                      </button>
                    </div>

                    {showAddNote && (
                      <div className="mb-4">
                        <textarea
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Digite sua anotação..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          rows={3}
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            onClick={() => setShowAddNote(false)}
                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={addNote}
                            className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            Salvar
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {selectedLead.notes.map((note, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium text-gray-900">{note.author}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(note.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Selecione um lead para ver os detalhes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
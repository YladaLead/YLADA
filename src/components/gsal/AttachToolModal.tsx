'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PrimaryButton from '@/components/shared/PrimaryButton'
import SecondaryButton from '@/components/shared/SecondaryButton'

interface Client {
  id: string
  name: string
  email?: string
  status?: string
}

interface AttachToolModalProps {
  isOpen: boolean
  onClose: () => void
  toolId: string
  toolName?: string
}

export default function AttachToolModal({
  isOpen,
  onClose,
  toolId,
  toolName
}: AttachToolModalProps) {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [attaching, setAttaching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      carregarClientes()
    }
  }, [isOpen])

  const carregarClientes = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch('/api/nutri/clientes?limit=1000', {
        credentials: 'include'
      })

      if (!res.ok) {
        throw new Error('Erro ao carregar clientes')
      }

      const data = await res.json()
      const clientes = data.data?.clients || []
      setClients(clientes)

      if (clientes.length === 0) {
        setError('no_clients')
      }
    } catch (err: any) {
      console.error('Erro ao carregar clientes:', err)
      setError('Erro ao carregar clientes')
    } finally {
      setLoading(false)
    }
  }

  const handleAttach = async () => {
    if (!selectedClientId) return

    try {
      setAttaching(true)
      setError(null)

      // Buscar cliente atual para obter custom_fields
      const clientRes = await fetch(`/api/nutri/clientes/${selectedClientId}`, {
        credentials: 'include'
      })

      if (!clientRes.ok) {
        throw new Error('Erro ao buscar cliente')
      }

      const clientData = await clientRes.json()
      const client = clientData.data?.client

      // Obter ferramentas anexadas existentes (ou criar array vazio)
      const attachedTools = (client?.custom_fields?.attached_tools as string[]) || []

      // Adicionar nova ferramenta se ainda não estiver anexada
      if (!attachedTools.includes(toolId)) {
        attachedTools.push(toolId)
      }

      // Atualizar cliente com nova ferramenta anexada
      const updateRes = await fetch(`/api/nutri/clientes/${selectedClientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          custom_fields: {
            ...client?.custom_fields,
            attached_tools: attachedTools
          }
        })
      })

      if (!updateRes.ok) {
        throw new Error('Erro ao anexar ferramenta')
      }

      // Sucesso - fechar modal e redirecionar para o cliente
      onClose()
      router.push(`/pt/nutri/clientes/${selectedClientId}`)
    } catch (err: any) {
      console.error('Erro ao anexar ferramenta:', err)
      setError(err.message || 'Erro ao anexar ferramenta')
    } finally {
      setAttaching(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-250"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all duration-250"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Anexar Ferramenta ao Cliente
            </h2>
            {toolName && (
              <p className="text-sm text-gray-600 mt-1">
                {toolName}
              </p>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error === 'no_clients' ? (
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Você ainda não tem clientes cadastrados.
              </p>
              <p className="text-gray-700 mb-4">
                Crie um cliente no GSAL para anexar esta ferramenta.
              </p>
              <PrimaryButton
                onClick={() => {
                  onClose()
                  router.push('/pt/nutri/clientes/novo')
                }}
                fullWidth
              >
                Ir para Clientes →
              </PrimaryButton>
            </div>
          ) : error ? (
            <div className="mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Selecione um cliente para anexar esta ferramenta:
              </p>
              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                {clients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => setSelectedClientId(client.id)}
                    className={`
                      w-full text-left px-4 py-3 border-b border-gray-100 last:border-b-0
                      hover:bg-blue-50 transition-colors
                      ${selectedClientId === client.id ? 'bg-blue-100 border-blue-300' : ''}
                    `}
                  >
                    <div className="font-medium text-gray-900">{client.name}</div>
                    {client.email && (
                      <div className="text-sm text-gray-600">{client.email}</div>
                    )}
                    {client.status && (
                      <div className="text-xs text-gray-500 mt-1">
                        Status: {client.status}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {!loading && error !== 'no_clients' && (
            <div className="flex flex-col sm:flex-row gap-3">
              <SecondaryButton
                onClick={onClose}
                fullWidth
                className="flex-1"
              >
                Cancelar
              </SecondaryButton>
              <PrimaryButton
                onClick={handleAttach}
                disabled={!selectedClientId || attaching}
                fullWidth
                className="flex-1"
              >
                {attaching ? 'Anexando...' : 'Anexar Ferramenta'}
              </PrimaryButton>
            </div>
          )}
        </div>
      </div>
    </>
  )
}


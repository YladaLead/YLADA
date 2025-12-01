// Hook para rastrear ações do distribuidor no Wellness System

export type TipoAcao = 
  | 'gerou_link'
  | 'visualizou_fluxo'
  | 'copiou_script'
  | 'enviou_link'
  | 'visualizou_apresentacao'
  | 'acessou_ferramentas'
  | 'visualizou_diagnosticos'
  | 'configurou_perfil'
  | 'acessou_sistema'

interface RegistrarAcaoParams {
  tipo: TipoAcao
  descricao: string
  metadata?: Record<string, any>
  pagina?: string
  rota?: string
}

export function useWellnessAcoes() {
  const registrarAcao = async (params: RegistrarAcaoParams) => {
    try {
      const response = await fetch('/api/wellness/acoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(params)
      })

      if (!response.ok) {
        throw new Error('Erro ao registrar ação')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao registrar ação:', error)
      // Não quebrar o fluxo se falhar o registro
      return null
    }
  }

  return { registrarAcao }
}


'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { ProLideresTenantRole } from '@/types/leader-tenant'

export type ProLideresPainelContextValue = {
  role: ProLideresTenantRole
  /**
   * Confirmado na BD (dono ou co-líder): menu completo e «ver como equipe».
   * Membro convidado fica sempre false mesmo que `role` no gate falhe.
   */
  canManageAsLeader: boolean
  /** Dono do tenant (consultoria) — menu e rotas completas de gestão. */
  isLeaderWorkspace: boolean
  /**
   * Líder a pré-visualizar o mesmo menu/copy que a equipe (cookie + refresh).
   * Continua autenticado como líder nas APIs.
   */
  teamViewPreview?: boolean
  /** Nome da operação / tenant para contexto visual. */
  operationLabel: string | null
  /** Painel aberto sem tenant na BD (modo desenvolvimento). APIs que dependem de tenant podem falhar. */
  devStubPanel?: boolean
  /** Pro Estética: painel aberto sem login (só construção / UI; APIs podem pedir sessão). */
  previewWithoutLogin?: boolean
  /** Código vertical do tenant (ex. h-lider = Herbalife). */
  verticalCode: string
  /**
   * Quando false, membros não veem Tarefas diárias no menu nem na visão geral.
   * Líder e pré-visualização «ver como equipe» seguem a mesma regra da equipe.
   */
  dailyTasksVisibleToTeam: boolean
  /**
   * Prefixo das rotas deste shell (`/pro-lideres/painel` ou `/pro-lideres/membro`).
   * Links do menu, logo e perfil usam isto.
   */
  painelBasePath: string
}

const ProLideresPainelContext = createContext<ProLideresPainelContextValue | null>(null)

export function ProLideresPainelProvider({
  children,
  value,
}: {
  children: ReactNode
  value: ProLideresPainelContextValue
}) {
  return <ProLideresPainelContext.Provider value={value}>{children}</ProLideresPainelContext.Provider>
}

export function useProLideresPainel(): ProLideresPainelContextValue {
  const v = useContext(ProLideresPainelContext)
  if (!v) {
    throw new Error('useProLideresPainel deve ser usado dentro de ProLideresPainelProvider')
  }
  return v
}

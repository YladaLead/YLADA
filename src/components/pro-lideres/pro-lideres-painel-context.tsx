'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { ProLideresTenantRole } from '@/types/leader-tenant'

export type ProLideresPainelContextValue = {
  role: ProLideresTenantRole
  /** Dono do tenant (consultoria) — menu e rotas completas de gestão. */
  isLeaderWorkspace: boolean
  /** Nome da operação / tenant para contexto visual. */
  operationLabel: string | null
  /** Painel aberto sem tenant na BD (modo desenvolvimento). APIs que dependem de tenant podem falhar. */
  devStubPanel?: boolean
  /** Código vertical do tenant (ex. h-lider = Herbalife). */
  verticalCode: string
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

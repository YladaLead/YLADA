'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

type RevealCtx = {
  sidebarVisible: boolean
  revealSidebar: () => void
}

const YladaSidebarRevealContext = createContext<RevealCtx | null>(null)

export function YladaSidebarRevealProvider({
  suppressUntilRevealed,
  children,
}: {
  suppressUntilRevealed: boolean
  children: ReactNode
}) {
  const [revealed, setRevealed] = useState(!suppressUntilRevealed)
  const revealSidebar = useCallback(() => setRevealed(true), [])
  const value = useMemo(
    () => ({
      sidebarVisible: revealed,
      revealSidebar,
    }),
    [revealed, revealSidebar]
  )
  return <YladaSidebarRevealContext.Provider value={value}>{children}</YladaSidebarRevealContext.Provider>
}

export function useYladaSidebarReveal(): RevealCtx | null {
  return useContext(YladaSidebarRevealContext)
}

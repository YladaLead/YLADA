import { Plus_Jakarta_Sans } from 'next/font/google'
import type { ReactNode } from 'react'

import '@/styles/pro-lideres-reset-public.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export default function ProLideresHOMPublicLayout({ children }: { children: ReactNode }) {
  return <div className={plusJakarta.variable}>{children}</div>
}

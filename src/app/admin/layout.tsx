import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { AdminNavClient } from '@/components/admin/AdminNavClient'

export const metadata: Metadata = {
  manifest: '/manifest-admin.json',
  icons: {
    icon: '/images/logo/ylada/novo/ylada-icon-512.png',
    apple: '/images/logo/ylada/novo/ylada-icon-512.png',
  },
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminNavClient />
      {children}
    </>
  )
}

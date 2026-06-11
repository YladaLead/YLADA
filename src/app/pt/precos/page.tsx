import { headers } from 'next/headers'
import { Suspense } from 'react'
import PrecosPageContent, { PrecosPageFallback } from './PrecosPageContent'

export default async function PrecosPage() {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''

  // WKWebView (Capacitor iOS app) user agent does NOT include 'Safari/'
  // Regular iOS Safari browser DOES include 'Safari/'
  // This is the reliable server-side way to detect our iOS app vs real Safari
  const isIOSApp = /iPhone|iPad|iPod/.test(userAgent) && !userAgent.includes('Safari/')

  return (
    <Suspense fallback={<PrecosPageFallback />}>
      <PrecosPageContent isIOSApp={isIOSApp} />
    </Suspense>
  )
}

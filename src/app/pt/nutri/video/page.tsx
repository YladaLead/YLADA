import { Suspense } from 'react'
import NutriVideoContent from './NutriVideoClient'

function VideoPageFallback() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-pulse rounded-xl bg-gray-200 aspect-video w-full max-w-4xl mx-4" />
    </div>
  )
}

export default function NutriVideoPage() {
  return (
    <Suspense fallback={<VideoPageFallback />}>
      <NutriVideoContent />
    </Suspense>
  )
}

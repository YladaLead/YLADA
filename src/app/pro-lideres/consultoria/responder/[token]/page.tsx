import Image from 'next/image'
import Link from 'next/link'
import { YLADA_OG_FALLBACK_LOGO_PATH } from '@/lib/ylada-og-fallback-logo'
import ProLideresConsultoriaFormResponderClient from '@/components/pro-lideres/ProLideresConsultoriaFormResponderClient'

export default async function ProLideresConsultoriaResponderPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const safe = typeof token === 'string' ? token : ''

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-slate-50 to-white px-4 py-10">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <Link href="/pro-lideres" className="inline-flex flex-col items-center gap-2">
            <Image src={YLADA_OG_FALLBACK_LOGO_PATH} alt="YLADA" width={100} height={32} className="h-8 w-auto" />
            <span className="text-xs font-medium text-gray-500">Pro Líderes · Consultoria</span>
          </Link>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <ProLideresConsultoriaFormResponderClient token={safe} />
        </div>
      </div>
    </div>
  )
}

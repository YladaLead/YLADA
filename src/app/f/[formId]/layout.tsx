import { permanentRedirect } from 'next/navigation'
import { headers } from 'next/headers'
import { resolveFormPublicUrl } from '@/lib/ylada-flow/resolve-form-public-url'

type Props = {
  children: React.ReactNode
  params: Promise<{ formId: string }>
}

/** Redirect 308 `/f/[formId]` → `/[perfil]/[fluxo]` quando resolvível (subrotas /resposta mantidas). */
export default async function FormIdLayout({ children, params }: Props) {
  const h = await headers()
  const pathname = h.get('x-pathname') ?? ''
  const isExactFormPath = /^\/f\/[^/]+$/.test(pathname)

  if (isExactFormPath) {
    const { formId } = await params
    const target = await resolveFormPublicUrl(formId)
    if (target) permanentRedirect(target)
  }

  return <>{children}</>
}

import { redirect } from 'next/navigation'
import { OnboardingPageContent } from '@/components/ylada/OnboardingPageContent'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { resolveProLideresRedirectForWellnessAccount } from '@/lib/pro-lideres-server'
import { supabaseAdmin } from '@/lib/supabase'

async function redirectWellnessAwayFromMatrixOnboarding(userId: string, perfil: string): Promise<void> {
  if (perfil !== 'wellness' && perfil !== 'coach-bem-estar') return

  const plRedirect = await resolveProLideresRedirectForWellnessAccount(userId)
  if (plRedirect) redirect(plRedirect)

  if (!supabaseAdmin) return

  const { data: prof } = await supabaseAdmin
    .from('user_profiles')
    .select('nome_completo, whatsapp')
    .eq('user_id', userId)
    .maybeSingle()

  const nomeOk = prof?.nome_completo && String(prof.nome_completo).trim().length >= 2
  const waDigits = prof?.whatsapp ? String(prof.whatsapp).replace(/\D/g, '') : ''
  const waOk = waDigits.length >= 10
  if (nomeOk && waOk) {
    redirect(perfil === 'coach-bem-estar' ? '/pt/coach-bem-estar/home' : '/pt/wellness/home')
  }
}

export default async function MatrixOnboardingPage() {
  const cookieStore = await cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (url && anon) {
    const supabase = createServerClient(url, anon, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    })
    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user
    if (user && supabaseAdmin) {
      const { data: profile } = await supabaseAdmin
        .from('user_profiles')
        .select('perfil')
        .eq('user_id', user.id)
        .maybeSingle()
      const perfil = typeof profile?.perfil === 'string' ? profile.perfil : ''
      await redirectWellnessAwayFromMatrixOnboarding(user.id, perfil)
    }
  }

  return (
    <OnboardingPageContent
      areaCodigo="ylada"
      areaLabel="YLADA"
      redirectIfDone="/pt/home"
      redirectAfterSave="/pt/perfil-empresarial"
      proofText="Mais de 1.200 profissionais já usaram este diagnóstico para entender melhor seu momento profissional."
    />
  )
}

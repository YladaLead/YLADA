import { redirect } from 'next/navigation'

/**
 * Alias direto para checkout - útil para compartilhar por WhatsApp/email
 * Ex: www.ylada.com/pt/wellness/assinar
 * Ex: www.ylada.com/pt/wellness/assinar?plan=annual
 */
export default function AssinarPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>
}) {
  const params = await searchParams
  const plan = params?.plan === 'annual' ? 'annual' : 'monthly'
  redirect(`/pt/wellness/checkout?plan=${plan}&from=renovar`)
}

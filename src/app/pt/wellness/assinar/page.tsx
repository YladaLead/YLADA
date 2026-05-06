import { redirect } from 'next/navigation'

/**
 * Alias direto para checkout - útil para compartilhar por WhatsApp/email
 * Ex: www.ylada.com/pt/wellness/assinar
 */
export default async function AssinarPage() {
  redirect('/pt/wellness/checkout?plan=monthly&from=renovar')
}

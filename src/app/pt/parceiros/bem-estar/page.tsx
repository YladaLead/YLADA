import { permanentRedirect } from 'next/navigation'

/** URL canónica da campanha (checkout). */
export default function ParceirosBemEstarPtRedirectPage() {
  permanentRedirect('/promo/bem-estar')
}

import { ProEsteticaScriptsClient } from '@/components/pro-estetica-corporal/ProEsteticaScriptsClient'

const SCRIPTS_API = '/api/pro-estetica-capilar'
const NOEL_HREF = '/pro-estetica-capilar/painel/noel'
const ENTRAR_NEXT = '/pro-estetica-capilar/entrar?next=%2Fpro-estetica-capilar%2Fpainel%2Fscripts'

export default function ProEsteticaCapilarScriptsPage() {
  return (
    <ProEsteticaScriptsClient
      scriptsApiBase={SCRIPTS_API}
      noelPainelHref={NOEL_HREF}
      entrarWithNextHref={ENTRAR_NEXT}
    />
  )
}

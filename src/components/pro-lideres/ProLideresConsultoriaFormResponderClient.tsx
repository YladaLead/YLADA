'use client'

import ConsultoriaPublicFormClient from '@/components/consultoria/ConsultoriaPublicFormClient'

export default function ProLideresConsultoriaFormResponderClient({ token }: { token: string }) {
  return <ConsultoriaPublicFormClient token={token} area="pro_lideres" />
}

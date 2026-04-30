import { redirect } from 'next/navigation'

/** O pré-diagnóstico Pro Líderes é gerido apenas na área administrativa. */
export default function ProLideresPreDiagnosticoRemovedPage() {
  redirect('/pro-lideres/painel')
}

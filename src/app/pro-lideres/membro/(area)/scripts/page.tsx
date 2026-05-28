import { redirect } from 'next/navigation'

/** Equipe usa só Y-Scripts (copiar). Edição fica no painel do líder. */
export default function ProLideresMembroScriptsPage() {
  redirect('/pro-lideres/membro/boards')
}

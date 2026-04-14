import { redirect } from 'next/navigation'

/** Rota antiga: comunicação com a equipe fica no chat principal do Noel. */
export default function ProLideresOrientacaoEquipePage() {
  redirect('/pro-lideres/painel/noel')
}

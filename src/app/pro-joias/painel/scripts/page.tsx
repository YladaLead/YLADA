import { ProLideresScriptsClient } from '@/components/pro-lideres/ProLideresScriptsClient'

/**
 * Scripts Pro Joias — usa a engine genérica do Pro Líderes
 * apontando para o tenant de joias via contexto de painel.
 */
export default function ProJoiasScriptsPage() {
  return <ProLideresScriptsClient />
}

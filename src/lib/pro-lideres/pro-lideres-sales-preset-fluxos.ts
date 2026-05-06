import type { FluxoCliente } from '@/types/wellness-system'
import { fluxosClientes } from '@/lib/wellness-system/fluxos-clientes'
import { getProLideresWellnessCalculadorasBasicasPresetFluxos } from '@/lib/pro-lideres/pro-lideres-wellness-calculadoras-basicas-preset-fluxos'

/**
 * Biblioteca base de Vendas no Pro Líderes.
 * Espelha os fluxos de clientes do Wellness (`fluxosClientes`) + calculadoras Água / Calorias / Proteína
 * (presets TS alinhados ao preview iOS); links /l/ são criados por líder em `ensureProLideresPresetYladaLinks`.
 */
export function getProLideresSalesPresetFluxos(): FluxoCliente[] {
  return [...fluxosClientes, ...getProLideresWellnessCalculadorasBasicasPresetFluxos()]
}

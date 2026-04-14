import type { FluxoCliente } from '@/types/wellness-system'
import { fluxosClientes } from '@/lib/wellness-system/fluxos-clientes'
import { proLideresSalesBlock3Fluxos } from '@/lib/pro-lideres/pro-lideres-sales-block3-fluxos'
import { proLideresSalesBlock4Fluxos } from '@/lib/pro-lideres/pro-lideres-sales-block4-fluxos'

/**
 * Biblioteca base de Vendas no Pro Líderes.
 * Usa os mesmos fluxos da área Wellness e gera links /l/ próprios por líder.
 */
export function getProLideresSalesPresetFluxos(): FluxoCliente[] {
  // Bloco 1 + Bloco 2: 20 fluxos base do Wellness.
  // Blocos 3 e 4: clássicos adicionais para acelerar cobertura da biblioteca Pro Líderes.
  return [...fluxosClientes.slice(0, 20), ...proLideresSalesBlock3Fluxos, ...proLideresSalesBlock4Fluxos]
}

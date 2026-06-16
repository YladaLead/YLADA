/**
 * WELLNESS SYSTEM - Dados dos Produtos
 * 
 * Referência completa de produtos, kits e preços
 */

import { Produto, Kit } from '@/types/wellness-system'

export const produtos: Produto[] = [
  {
    id: 'nrg-energia-100g',
    nome: 'NRG Energia',
    peso: '100g',
    pv: 24.45,
    precoSugerido: 240.00,
    custo50: 121.07,
    doses: 120,
    custoPorDose: 1.00
  },
  {
    id: 'nrg-energia-60g',
    nome: 'NRG Energia OG',
    peso: '60g',
    pv: 15.85,
    precoSugerido: 151.00,
    custo50: 80.29,
    doses: 72,
    custoPorDose: 1.11
  },
  {
    id: 'acelera-102g',
    nome: 'Acelera Herbal Concentrate',
    peso: '102g',
    pv: 37.60,
    precoSugerido: 347.00,
    custo50: 183.29,
    doses: 122,
    custoPorDose: 1.50
  },
  {
    id: 'acelera-51g',
    nome: 'Acelera Herbal Concentrate',
    peso: '51g',
    pv: 21.45,
    precoSugerido: 211.00,
    custo50: 105.04,
    doses: 61,
    custoPorDose: 1.72
  }
]

export const kits: Kit[] = [
  {
    id: 'kit-energia-5dias',
    tipo: 'energia',
    nome: 'KIT ENERGIA — 5 Dias',
    descricao: '5 garrafinhas de NRG Energia',
    conteudo: '5 garrafinhas de NRG Energia',
    uso: [
      'Ativação matinal',
      'Energia estável',
      'Foco nas primeiras horas',
      'Sensação de disposição já nos primeiros dias'
    ],
    indicacao: 'Ideal para quem quer acordar melhor e começar o dia com força total.'
  },
  {
    id: 'kit-acelera-5dias',
    tipo: 'acelera',
    nome: 'KIT ACELERA — 5 Dias',
    descricao: '5 garrafinhas de Acelera Herbal Concentrate',
    conteudo: '5 garrafinhas de Acelera Herbal Concentrate',
    uso: [
      'Ajuda a ativar o metabolismo',
      'Reduz retenção e sensação de inchaço',
      'Aumenta leveza corporal',
      'Ideal para quem quer se sentir melhor em poucos dias'
    ],
    indicacao: 'Excelente para quem sente o corpo "travado" ou pesado.'
  }
]

export function getKitByTipo(tipo: 'energia' | 'acelera'): Kit | undefined {
  return kits.find(kit => kit.tipo === tipo)
}

export function getProdutoById(id: string): Produto | undefined {
  return produtos.find(produto => produto.id === id)
}


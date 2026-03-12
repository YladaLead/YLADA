'use client'

import Link from 'next/link'

/**
 * Rodapé "Powered by YLADA" para resultados de diagnóstico.
 * Objetivos: proteção institucional/jurídica e crescimento orgânico (duplicação).
 * Estilo discreto: fundo cinza claro, texto pequeno, link azul discreto.
 * Exibir antes do DiagnosisDisclaimer na ordem final da página.
 * @see DiagnosisDisclaimer.tsx
 */

const YLADA_HOME_SOURCE = '/pt?source=diagnostico'

type Props = {
  /** 'full' = bloco completo com frases jurídicas (onde o contato do profissional vê); 'fullCaptacao' = só curiosidade + CTA, sem jurídico (página de venda/captação); 'compact' = só link */
  variant?: 'full' | 'fullCaptacao' | 'compact'
  className?: string
}

export default function PoweredByYlada({ variant = 'compact', className = '' }: Props) {
  if (variant === 'compact') {
    return (
      <div
        className={`mt-4 pt-4 border-t border-gray-100 text-center ${className}`}
        role="contentinfo"
        aria-label="Plataforma que gerou o diagnóstico"
      >
        <Link
          href={YLADA_HOME_SOURCE}
          className="text-xs text-gray-400 hover:text-blue-600 transition-colors"
        >
          Diagnóstico gerado com YLADA
        </Link>
      </div>
    )
  }

  const isCaptacao = variant === 'fullCaptacao'

  return (
    <div
      className={`bg-gray-50 rounded-xl p-6 border border-gray-100 text-center ${className}`}
      role="contentinfo"
      aria-label="Plataforma que gerou o diagnóstico"
    >
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
        Powered by YLADA
      </p>
      <p className="text-sm text-gray-600 leading-relaxed mb-2">
        Este diagnóstico foi gerado pela plataforma YLADA – Your Leading Advanced Data Assistant.
      </p>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        O YLADA ajuda profissionais a criar diagnósticos inteligentes para iniciar conversas com mais contexto e atrair clientes mais preparados.
      </p>
      {!isCaptacao && (
        <>
          <p className="text-sm text-gray-600 leading-relaxed mb-1">
            Os resultados apresentados aqui têm caráter informativo e educativo, baseados exclusivamente nas respostas fornecidas.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            Eles não substituem avaliação profissional, consultoria especializada ou orientação personalizada.
          </p>
        </>
      )}
      {isCaptacao && <div className="mb-5" />}
      <Link
        href={YLADA_HOME_SOURCE}
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
      >
        <span>👉</span>
        <span>Criar diagnósticos como este</span>
      </Link>
    </div>
  )
}

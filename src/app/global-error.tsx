'use client'

import { useEffect } from 'react'

/**
 * Erro no root layout ou em árvore acima do error.tsx.
 * Deve incluir <html> e <body> pois substitui o layout raiz.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[global error]', error.message, error.digest)
  }, [error])

  return (
    <html lang="pt">
      <body style={{ margin: 0, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ maxWidth: '28rem', width: '100%', textAlign: 'center', padding: '1.5rem' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }} aria-hidden>⚠️</p>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111', marginBottom: '0.5rem' }}>
            Algo deu errado
          </h1>
          <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
            Ocorreu um erro ao carregar esta página. Tente novamente ou acesse o início.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{ padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 500, cursor: 'pointer' }}
            >
              Tentar de novo
            </button>
            <a
              href="/pt"
              style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', color: '#374151', textDecoration: 'none', fontWeight: 500 }}
            >
              Início
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}

'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'

/**
 * Etapa da Trilha Empresarial na área Med.
 * Redireciona para a mesma etapa no Nutri (API e conteúdo únicos) com ?from=med
 * para que a página Nutri mostre "Voltar ao YLADA Medicina".
 */
export default function MedFormacaoJornadaDiaPage() {
  const params = useParams()
  const router = useRouter()
  const numero = params.numero as string

  useEffect(() => {
    const n = parseInt(numero, 10)
    if (n >= 1 && n <= 30) {
      router.replace(`/pt/nutri/metodo/jornada/dia/${n}?from=med`)
    }
  }, [numero, router])

  return (
    <YladaAreaShell areaCodigo="med" areaLabel="Medicina">
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Abrindo etapa {numero}...</p>
        </div>
      </div>
    </YladaAreaShell>
  )
}

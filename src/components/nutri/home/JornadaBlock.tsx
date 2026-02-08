'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Card from '@/components/shared/Card'
import PrimaryButton from '@/components/shared/PrimaryButton'
import ProgressBar from '@/components/shared/ProgressBar'

export default function JornadaBlock() {
  const [stats, setStats] = useState<any>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const carregarJornada = async () => {
      try {
        const res = await fetch('/api/nutri/metodo/jornada', {
          credentials: 'include'
        })

        if (res.ok) {
          const data = await res.json()
          setStats(data.data?.stats)
        }
      } catch (error) {
        console.error('Erro ao carregar jornada:', error)
      } finally {
        setCarregando(false)
      }
    }

    carregarJornada()
  }, [])

  const currentDay = stats?.current_day || null
  const progressPercentage = stats?.progress_percentage || 0
  const completedDays = stats?.completed_days || 0
  const totalDays = stats?.total_days || 30

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Sua Trilha Empresarial
        </h2>
        <p className="text-gray-700 text-sm sm:text-base">
          Você não precisa fazer tudo. Só o próximo passo certo.
        </p>
      </div>

      {carregando ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Carregando...</p>
        </div>
      ) : (
        <>
          <ProgressBar
            percentage={progressPercentage}
            label={`Etapa ${completedDays} de ${totalDays}`}
            showPercentage={true}
            color="blue"
            className="mb-6"
          />

          <div className="text-center">
            {currentDay ? (
              <PrimaryButton
                href={`/pt/nutri/metodo/jornada/dia/${currentDay}`}
                fullWidth
                className="text-lg py-4"
              >
                Continuar de onde parei → Etapa {currentDay}
              </PrimaryButton>
            ) : completedDays === totalDays ? (
              <div>
                <p className="text-gray-700 mb-4">🎉 Parabéns! Você concluiu a Trilha!</p>
                <PrimaryButton
                  href="/pt/nutri/metodo/jornada/concluida"
                  fullWidth
                  className="text-lg py-4"
                >
                  Ver Conclusão
                </PrimaryButton>
              </div>
            ) : (
              <PrimaryButton
                href="/pt/nutri/metodo/jornada/dia/1"
                fullWidth
                className="text-lg py-4"
              >
                Iniciar Etapa 1 da Trilha →
              </PrimaryButton>
            )}
          </div>
        </>
      )}
    </Card>
  )
}


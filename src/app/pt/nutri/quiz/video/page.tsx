'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function QuizNutriVideoPage() {
  const [videoStarted, setVideoStarted] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur h-14 flex items-center">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/pt/nutri">
            <Image src="/images/logo/nutri-horizontal.png" alt="YLADA Nutri" width={140} height={42} className="h-9 w-auto" />
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Se no seu diagnóstico apareceu que você é recém-formada, agenda instável, sobrecarregada ou quer crescer…
        </h1>
        <p className="text-gray-600 mb-8">
          esse vídeo é pra você. Em poucos minutos você entende o problema invisível e como o Ilada Nutri organiza comunicação, rotina e conversa.
        </p>

        {/* Placeholder do vídeo: substituir por <video> ou embed (YouTube/Vimeo) quando tiver a URL */}
        <div
          className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center text-gray-500"
          onClick={() => setVideoStarted(true)}
        >
          {!videoStarted ? (
            <span className="text-center px-4">Clique para carregar o vídeo (7–10 min)</span>
          ) : (
            <span className="text-center px-4">Aqui entra o player do vídeo (URL do vídeo no Ilada Nutri)</span>
          )}
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Coloque aqui o vídeo gravado de 7–10 min: abertura espelhada → problema invisível → erro comum → virada → o que o Ilada Nutri faz → convite para conhecer.
        </p>

        <div className="mt-10 pt-8 border-t border-gray-200">
          <p className="text-gray-700 mb-4">
            Se você quer parar de adivinhar e ter mais clareza, existe um caminho acessível pra isso.
          </p>
          <Link
            href="/pt/nutri/descobrir"
            className="inline-block w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 text-white font-medium text-center hover:bg-blue-700"
          >
            Conhecer o Ilada Nutri
          </Link>
        </div>
      </main>
    </div>
  )
}
